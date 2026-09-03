// Deep scene operations for Nexus. These keep scene rename and delete in sync with site pages, note pins, lineage, and managed folders.

import { NexusLineageManager } from "./NexusLineageManager.js";
import { SiteLabelManager } from "../../site/services/SiteLabelManager.js";
import { SiteJournalManager } from "../../site/services/SiteJournalManager.js";
import { SiteRecordManager } from "../../site/services/SiteRecordManager.js";
import { ConnectionStore } from "../../connections/services/ConnectionStore.js";
import { LegacySciFiCompatibility } from "../../../support/compatibility/LegacySciFiCompatibility.js";
import { NexusMarkerService } from "../../markers/services/NexusMarkerService.js";

const MODULE_ID = "augur-nexus";

export class NexusSceneOperations {
    static collectSceneBranch(rootScene) {
        if (!rootScene) return [];

        const branch = [];
        const visit = scene => {
            for (const childScene of NexusLineageManager.getChildScenes(scene)) {
                visit(childScene);
            }
            branch.push(scene);
        };

        visit(rootScene);
        return branch;
    }

    static getDeleteBranchImpact(rootScene, branch = null) {
        if (LegacySciFiCompatibility.isLegacyScene(rootScene)) {
            branch ||= this.collectSceneBranch(rootScene);
            const impact = {
                ...LegacySciFiCompatibility.getDeleteBranchImpact(rootScene),
                sceneCount: branch.length
            };
            const legacySceneIds = new Set(LegacySciFiCompatibility.getLegacyBranch(rootScene, branch).map(scene => scene.id));

            for (const scene of branch) {
                if (legacySceneIds.has(scene.id)) continue;

                const parentContext = this.#getParentSiteContext(scene);
                if (parentContext?.note) impact.noteCount += 1;
                if (parentContext?.page) impact.pageCount += 1;
                if (this.#getOwnedSiteJournalEntry(scene)) impact.journalEntryCount += 1;
            }

            return impact;
        }

        branch ||= this.collectSceneBranch(rootScene);
        const impact = { sceneCount: branch.length, noteCount: 0, pageCount: 0, journalEntryCount: 0 };

        for (const scene of branch) {
            const parentContext = this.#getParentSiteContext(scene);
            if (parentContext?.note) impact.noteCount += 1;
            if (parentContext?.page) impact.pageCount += 1;
            if (this.#getOwnedSiteJournalEntry(scene)) impact.journalEntryCount += 1;
        }

        return impact;
    }

    static async confirmAndDeleteSceneBranch(rootScene, { bypassHook = false } = {}) {
        const { NexusSceneDeletionCoordinator } = await import("./NexusSceneDeletionCoordinator.js");
        return NexusSceneDeletionCoordinator.deleteSceneBranch(rootScene);
    }

    static async deleteSceneBranch(rootScene, operation = {}, { branch = null } = {}) {
        if (!rootScene) return;
        branch ||= this.collectSceneBranch(rootScene);

        if (LegacySciFiCompatibility.isLegacyScene(rootScene)) {
            const managedFolderIds = branch.map(scene => scene.getFlag(MODULE_ID, "siteChildSceneFolderId")).filter(Boolean);
            const legacySceneIds = new Set(LegacySciFiCompatibility.getLegacyBranch(rootScene, branch).map(scene => scene.id));

            await LegacySciFiCompatibility.cleanupLegacyBranchArtifacts(rootScene, branch);

            for (const scene of branch) {
                if (legacySceneIds.has(scene.id)) continue;
                await NexusMarkerService.removeMarkerRefsForSceneContents(scene);
                await NexusMarkerService.deleteMarkersForTarget({ kind: "nexus-scene", sceneId: scene.id });
                await this.#deleteSceneConnectionTarget(scene);
                await this.#deleteParentSiteArtifacts(scene);
                await this.#deleteOwnedSiteJournal(scene);
            }

            await Scene.deleteDocuments(branch.map(scene => scene.id), operation);
            await this.#cleanupManagedFolders(managedFolderIds);
            return;
        }

        const managedFolderIds = branch.map(scene => scene.getFlag(MODULE_ID, "siteChildSceneFolderId")).filter(Boolean);

        for (const scene of branch) {
            await NexusMarkerService.removeMarkerRefsForSceneContents(scene);
            await NexusMarkerService.deleteMarkersForTarget({ kind: "nexus-scene", sceneId: scene.id });
            await this.#deleteSceneConnectionTarget(scene);
            await this.#deleteParentSiteArtifacts(scene);
            await this.#deleteOwnedSiteJournal(scene);
        }

        await Scene.deleteDocuments(branch.map(scene => scene.id), operation);
        await this.#cleanupManagedFolders(managedFolderIds);
    }

    static async renameScene(scene, nextName) {
        if (!scene) return null;

        const name = (nextName || "").trim();
        if (!name) throw new Error("Scene name cannot be empty.");
        if (name === scene.name) return scene;

        await scene.update({
            name,
            [`flags.${MODULE_ID}.site.siteName`]: name,
            [`flags.${MODULE_ID}.site.linkedSceneName`]: name
        });

        await this.#renameManagedFolder(scene, name);
        await this.#renameParentSiteArtifacts(scene, name);
        await this.#renameOwnedSiteJournal(scene, name);
        await this.#refreshDirectChildParentMetadata(scene, name);

        return scene;
    }

    static async cleanupDeletedScene(scene) {
        if (!scene) return;

        const managedFolderIds = [scene.getFlag(MODULE_ID, "siteChildSceneFolderId")].filter(Boolean);
        await NexusMarkerService.removeMarkerRefsForSceneContents(scene);
        await NexusMarkerService.deleteMarkersForTarget({ kind: "nexus-scene", sceneId: scene.id });
        await this.#deleteSceneConnectionTarget(scene);
        await this.#deleteParentSiteArtifacts(scene);
        await this.#deleteOwnedSiteJournal(scene);
        await this.#cleanupManagedFolders(managedFolderIds);
    }

    static async #deleteSceneConnectionTarget(scene) {
        if (!scene?.id) return;
        await ConnectionStore.removeConnectionsForTarget({
            kind: "nexus-scene",
            sceneId: scene.id
        });
    }

    static async #renameManagedFolder(scene, nextName) {
        const folderId = scene.getFlag(MODULE_ID, "siteChildSceneFolderId");
        const folder = folderId ? game.folders.get(folderId) : null;
        if (!folder || folder.name === nextName) return;
        await folder.update({ name: nextName });
    }

    static async #renameParentSiteArtifacts(scene, nextName) {
        const context = this.#getParentSiteContext(scene);
        if (!context) return;

        const { parentScene, note, page, record } = context;
        const nextRecord = record
            ? SiteRecordManager.normalizeRecord({
                ...record,
                siteName: nextName,
                linkedSceneName: nextName
            }, { parentScene })
            : null;

        if (note) {
            const documentName = note.documentName || "Note";
            const updateData = {
                _id: note.id,
                [`flags.${MODULE_ID}.siteName`]: nextName,
                [`flags.${MODULE_ID}.linkedSceneName`]: nextName
            };
            if (documentName === "Note") updateData.text = nextName;
            await parentScene.updateEmbeddedDocuments(documentName, [updateData]);
        }

        if (nextRecord) {
            await SiteRecordManager.upsertSceneRecord(parentScene, nextRecord);
            await SiteRecordManager.syncRecordToVisuals(parentScene, nextRecord);
        }

        if (page) {
            await page.update({
                name: nextName,
                [`flags.${MODULE_ID}.siteName`]: nextName,
                [`flags.${MODULE_ID}.linkedSceneName`]: nextName
            });
        }
    }

    static async #renameOwnedSiteJournal(scene, nextName) {
        const entry = this.#getOwnedSiteJournalEntry(scene);
        if (!entry) {
            await this.#renameOwnedSiteRecords(scene, nextName);
            return;
        }

        await entry.update({ name: `${nextName} Sites` });

        for (const page of entry.pages.contents.filter(candidate => candidate.flags?.[MODULE_ID]?.sitePage)) {
            await page.update({
                [`flags.${MODULE_ID}.parentSceneName`]: nextName
            });
        }
        await this.#renameOwnedSiteRecords(scene, nextName);
    }

    static async #renameOwnedSiteRecords(scene, nextName) {
        const records = SiteRecordManager.getSceneRecordList(scene);
        if (!records.length) return;
        for (const record of records) {
            const nextRecord = await SiteRecordManager.upsertSceneRecord(scene, {
                ...record,
                parentSceneName: nextName
            });
            await SiteRecordManager.syncRecordToVisuals(scene, nextRecord);
        }
    }

    static async #refreshDirectChildParentMetadata(scene, nextName) {
        const directChildren = NexusLineageManager.getChildScenes(scene);
        for (const childScene of directChildren) {
            await childScene.update({ [`flags.${MODULE_ID}.site.parentSceneName`]: nextName });
        }
    }

    static #getOwnedSiteJournalEntry(scene) {
        const entryId = scene?.getFlag(MODULE_ID, "siteJournalId");
        return entryId ? game.journal.get(entryId) || null : null;
    }

    static #getParentSiteContext(scene) {
        const siteFlags = scene?.getFlag(MODULE_ID, "site") || {};
        const lineage = NexusLineageManager.getSceneLineage(scene) || {};

        let parentSceneId = siteFlags.parentSceneId || lineage.parentSceneId || null;
        let parentSiteId = siteFlags.siteId || lineage.parentSiteId || null;
        let parentScene = parentSceneId ? game.scenes.get(parentSceneId) || null : null;
        let record = parentScene && parentSiteId
            ? SiteRecordManager.resolveSite({ parentScene, siteId: parentSiteId })
            : null;

        if ((!parentScene || !parentSiteId || !record) && scene?.id) {
            const fallback = this.#findParentSiteRecordForLinkedScene(scene, { parentScene, parentSiteId });
            if (fallback) {
                parentScene = fallback.parentScene;
                parentSceneId = parentScene?.id || parentSceneId;
                parentSiteId = fallback.parentSiteId || parentSiteId;
                record = fallback.record || record;
            }
        }

        if (!parentSceneId || !parentScene || !parentSiteId) return null;

        const marker = parentScene.tiles?.contents?.find(candidate => {
            const record = NexusMarkerService.getMarkerRecord(candidate);
            return record?.target?.kind === "nexus-site"
                && record.target.parentSceneId === parentScene.id
                && record.target.siteId === parentSiteId;
        }) || null;
        const note = marker
            || parentScene.notes?.contents?.find(candidate => candidate.flags?.[MODULE_ID]?.siteId === parentSiteId)
            || parentScene.tiles?.contents?.find(candidate => candidate.flags?.[MODULE_ID]?.siteId === parentSiteId)
            || null;
        const journalEntryId = siteFlags.journalEntryId
            || note?.flags?.[MODULE_ID]?.journalEntryId
            || record?.journalEntryId
            || parentScene.getFlag(MODULE_ID, "siteJournalId")
            || null;
        const pageId = siteFlags.journalPageId || note?.flags?.[MODULE_ID]?.journalPageId || record?.journalPageId || null;
        const page = journalEntryId
            ? (pageId
                ? game.journal.get(journalEntryId)?.pages.get(pageId) || null
                : SiteJournalManager.findSitePage(journalEntryId, parentSiteId))
            : null;

        return { parentScene, note, page, record, parentSiteId };
    }

    static #findParentSiteRecordForLinkedScene(scene, { parentScene = null, parentSiteId = null } = {}) {
        const linkedSceneId = scene?.id || null;
        if (!linkedSceneId) return null;

        const scenes = parentScene ? [parentScene] : game.scenes.contents;
        for (const candidateScene of scenes) {
            const record = SiteRecordManager.getSceneRecordList(candidateScene).find(candidate => {
                if (parentSiteId && candidate.siteId !== parentSiteId) return false;
                return candidate.siteSceneId === linkedSceneId || candidate.linkedSceneId === linkedSceneId;
            });
            if (record) {
                return {
                    parentScene: candidateScene,
                    parentSiteId: record.siteId,
                    record
                };
            }
        }

        for (const entry of game.journal.contents) {
            const page = entry.pages?.contents?.find(candidate => {
                const flags = candidate.flags?.[MODULE_ID] || {};
                if (!flags.sitePage) return false;
                if (parentSiteId && flags.siteId !== parentSiteId) return false;
                return flags.siteSceneId === linkedSceneId || flags.linkedSceneId === linkedSceneId;
            });
            if (!page) continue;

            const record = SiteRecordManager.fromPage(page);
            const resolvedParentScene = record?.parentSceneId ? game.scenes.get(record.parentSceneId) || null : null;
            if (record?.siteId && resolvedParentScene) {
                return {
                    parentScene: resolvedParentScene,
                    parentSiteId: record.siteId,
                    record
                };
            }
        }

        return null;
    }

    static async #deleteParentSiteArtifacts(scene) {
        const context = this.#getParentSiteContext(scene);
        if (!context) return;

        const { parentScene, note, page, parentSiteId } = context;
        const noteHandledByMarkerCleanup = !!NexusMarkerService.getMarkerRecord(note);
        if (page) await SiteJournalManager.removeSitePage(page.parent?.id, page.id);
        if (parentSiteId) {
            await NexusMarkerService.deleteMarkersForTarget({
                kind: "nexus-site",
                parentSceneId: parentScene.id,
                siteId: parentSiteId
            });
            await ConnectionStore.removeConnectionsForTarget({
                kind: "nexus-site",
                parentSceneId: parentScene.id,
                siteId: parentSiteId
            });
        }
        if (parentSiteId) await SiteRecordManager.removeSceneRecord(parentScene, parentSiteId);
        const label = parentSiteId ? SiteLabelManager.findLabel(parentScene, parentSiteId, note?.documentName === "Tile" ? note.id : null) : null;
        if (label) await parentScene.deleteEmbeddedDocuments("Drawing", [label.id]);
        if (note && !noteHandledByMarkerCleanup) await parentScene.deleteEmbeddedDocuments(note.documentName || "Note", [note.id]);
    }

    static async #deleteOwnedSiteJournal(scene) {
        const entry = this.#getOwnedSiteJournalEntry(scene);
        if (!entry) return;
        await entry.delete();
    }

    static async #cleanupManagedFolders(folderIds) {
        const folders = [...new Set(folderIds)]
            .map(folderId => game.folders.get(folderId))
            .filter(folder => folder?.type === "Scene");

        folders.sort((a, b) => this.#getFolderDepth(b) - this.#getFolderDepth(a));

        for (const folder of folders) {
            const sceneCount = game.scenes.contents.filter(scene => (scene.folder?.id || scene.folder || null) === folder.id).length;
            const childFolderCount = game.folders.contents.filter(candidate => (candidate.folder?.id || candidate.folder || null) === folder.id).length;
            if (!sceneCount && !childFolderCount) {
                await folder.delete();
            }
        }
    }

    static #getFolderDepth(folder) {
        let depth = 0;
        let current = folder?.folder || null;
        while (current) {
            depth += 1;
            current = current.folder || null;
        }
        return depth;
    }
}

