// Shared lineage helpers for Nexus. This tracks scene parentage and pending site nodes without depending on Foundry folders staying untouched.

import { LegacySciFiCompatibility } from "../../../support/compatibility/LegacySciFiCompatibility.js";
import { SiteRecordManager } from "../../site/services/SiteRecordManager.js";
import { DEFAULT_SITE_ICON_SRC } from "../../site/services/SiteIconDefaults.js";

const MODULE_ID = "augur-nexus";

export class NexusLineageManager {
    static ROOT_FLAG = "nexusRoot";
    static LINEAGE_FLAG = "lineage";
    static #lineageCache = null;
    static #lastInvalidationReason = "";

    static invalidateCache(reason = "") {
        this.#lineageCache = null;
        this.#lastInvalidationReason = String(reason || "");
    }

    static getRootScene() {
        return game.scenes.contents.find(scene => scene.getFlag(MODULE_ID, this.ROOT_FLAG) === true) || null;
    }

    static getSceneLineage(scene) {
        if (!scene) return null;
        return scene.getFlag(MODULE_ID, this.LINEAGE_FLAG) || null;
    }

    static getParentScene(scene) {
        const lineage = this.getSceneLineage(scene);
        if (lineage?.parentSceneId) {
            const parentScene = game.scenes.get(lineage.parentSceneId) || null;
            if (parentScene) return parentScene;
        }
        return LegacySciFiCompatibility.getParentScene(scene);
    }

    static getChildScenes(scene) {
        if (!scene) return [];
        const nexusChildren = game.scenes.contents
            .filter(candidate => candidate.getFlag(MODULE_ID, this.LINEAGE_FLAG)?.parentSceneId === scene.id)
            .sort(this.#sortScenes);
        const legacyChildren = LegacySciFiCompatibility.getChildScenes(scene);
        const seen = new Set();
        return [...nexusChildren, ...legacyChildren]
            .filter(childScene => {
                if (!childScene || seen.has(childScene.id)) return false;
                seen.add(childScene.id);
                return true;
            })
            .sort(this.#sortScenes);
    }

    static collectSceneBranch(scene) {
        if (!scene) return [];
        const branch = [];
        const visited = new Set();
        const visit = current => {
            if (!current || visited.has(current.id)) return;
            visited.add(current.id);
            branch.push(current);
            for (const child of this.getChildScenes(current)) visit(child);
        };
        visit(scene);
        return branch;
    }

    static validateSceneParent(scene, { parentSceneId = null } = {}) {
        if (!scene) {
            return {
                valid: false,
                reason: "missing-scene",
                message: "No scene was provided."
            };
        }

        if (!parentSceneId) return { valid: true, reason: "root", message: "" };

        const parentScene = game.scenes.get(parentSceneId) || null;
        if (!parentScene) {
            return {
                valid: false,
                reason: "missing-parent",
                message: "The selected parent scene could not be found."
            };
        }

        if (scene.id === parentScene.id) {
            return {
                valid: false,
                reason: "self-parent",
                message: "A scene cannot be nested inside itself."
            };
        }

        const visited = new Set();
        let cursor = parentScene;
        while (cursor) {
            if (cursor.id === scene.id) {
                return {
                    valid: false,
                    reason: "cycle",
                    message: "A scene cannot be moved inside one of its own child scenes."
                };
            }
            if (visited.has(cursor.id)) {
                return {
                    valid: false,
                    reason: "existing-cycle",
                    message: "The target scene is already part of a broken lineage loop."
                };
            }
            visited.add(cursor.id);
            cursor = this.getParentScene(cursor);
        }

        return { valid: true, reason: "ok", message: "" };
    }

    static getBrokenLineageScenes() {
        const brokenSceneIds = new Set();
        for (const scene of game.scenes.contents) {
            const path = [];
            const pathIndexBySceneId = new Map();
            let cursor = scene;

            while (cursor) {
                if (pathIndexBySceneId.has(cursor.id)) {
                    for (const cyclicScene of path.slice(pathIndexBySceneId.get(cursor.id))) {
                        brokenSceneIds.add(cyclicScene.id);
                    }
                    break;
                }

                pathIndexBySceneId.set(cursor.id, path.length);
                path.push(cursor);

                const parentId = cursor.getFlag(MODULE_ID, this.LINEAGE_FLAG)?.parentSceneId || null;
                cursor = parentId ? game.scenes.get(parentId) || null : null;
            }
        }

        return [...brokenSceneIds]
            .map(sceneId => game.scenes.get(sceneId) || null)
            .filter(Boolean)
            .sort(this.#sortScenes);
    }

    static async repairBrokenLineage({ dryRun = false } = {}) {
        const brokenScenes = this.getBrokenLineageScenes();
        if (dryRun) return brokenScenes;

        for (const scene of brokenScenes) {
            await scene.update({
                [`flags.${MODULE_ID}.${this.LINEAGE_FLAG}`]: {
                    parentSceneId: null,
                    parentSiteId: null
                }
            });
            await scene.unsetFlag(MODULE_ID, "navigation");
        }

        if (brokenScenes.length) {
            this.invalidateCache("repair-broken-lineage");
            Hooks.callAll("augurNexusLineageChanged");
        }

        return brokenScenes;
    }

    static async setRootScene(scene) {
        if (!scene) throw new Error("No scene provided.");

        const updates = [];
        for (const candidate of game.scenes.contents) {
            const isTarget = candidate.id == scene.id;
            const update = { _id: candidate.id };
            let changed = false;

            if (candidate.getFlag(MODULE_ID, this.ROOT_FLAG) !== isTarget) {
                update[`flags.${MODULE_ID}.${this.ROOT_FLAG}`] = isTarget;
                changed = true;
            }

            if (isTarget) {
                const lineage = candidate.getFlag(MODULE_ID, this.LINEAGE_FLAG) || {};
                if (lineage.parentSceneId || lineage.parentSiteId) {
                    update[`flags.${MODULE_ID}.${this.LINEAGE_FLAG}`] = {
                        parentSceneId: null,
                        parentSiteId: null
                    };
                    changed = true;
                }
            }

            if (changed) updates.push(update);
        }

        if (updates.length) await Scene.updateDocuments(updates);
        return scene;
    }

    static async setSceneParent(scene, { parentSceneId = null, parentSiteId = null } = {}) {
        if (!scene) throw new Error("No scene provided.");
        const validation = this.validateSceneParent(scene, { parentSceneId });
        if (!validation.valid) throw new Error(validation.message || "Invalid Nexus scene lineage.");

        const nextLineage = {
            parentSceneId: parentSceneId || null,
            parentSiteId: parentSiteId || null
        };
        const current = scene.getFlag(MODULE_ID, this.LINEAGE_FLAG) || {};
        const updates = { _id: scene.id };
        let changed = false;

        if ((current.parentSceneId || null) !== nextLineage.parentSceneId || (current.parentSiteId || null) != nextLineage.parentSiteId) {
            updates[`flags.${MODULE_ID}.${this.LINEAGE_FLAG}`] = nextLineage;
            changed = true;
        }

        if (scene.getFlag(MODULE_ID, this.ROOT_FLAG) === true) {
            updates[`flags.${MODULE_ID}.${this.ROOT_FLAG}`] = false;
            changed = true;
        }

        if (changed) await scene.update(updates);
        return scene;
    }

    static async clearSceneParent(scene, { expectedParentSceneId = null, expectedParentSiteId = null } = {}) {
        if (!scene) return scene;
        const current = scene.getFlag(MODULE_ID, this.LINEAGE_FLAG) || {};
        if (!current.parentSceneId && !current.parentSiteId) return scene;
        if (expectedParentSceneId && current.parentSceneId !== expectedParentSceneId) return scene;
        if (expectedParentSiteId && current.parentSiteId !== expectedParentSiteId) return scene;

        await scene.update({
            [`flags.${MODULE_ID}.${this.LINEAGE_FLAG}`]: {
                parentSceneId: null,
                parentSiteId: null
            }
        });
        return scene;
    }

    static getLineageRows() {
        if (this.#lineageCache) return this.#lineageCache;
        this.#lineageCache = this.#buildLineageRows();
        return this.#lineageCache;
    }

    static #buildLineageRows() {
        const scenes = [...game.scenes.contents].sort(this.#sortScenes);
        const rootScene = this.getRootScene();
        const childNodesByParent = new Map();

        for (const scene of scenes) {
            const parentId = scene.getFlag(MODULE_ID, this.LINEAGE_FLAG)?.parentSceneId
                || LegacySciFiCompatibility.getParentScene(scene)?.id
                || null;
            if (!parentId) continue;
            this.#pushChildNode(childNodesByParent, parentId, this.#buildSceneNode(scene, rootScene));
        }

        for (const scene of scenes) {
            for (const pendingNode of this.#getPendingSiteNodes(scene)) {
                this.#pushChildNode(childNodesByParent, scene.id, pendingNode);
            }
            for (const pendingNode of LegacySciFiCompatibility.getPendingNodes(scene)) {
                this.#pushChildNode(childNodesByParent, scene.id, pendingNode);
            }
        }

        for (const bucket of childNodesByParent.values()) bucket.sort(this.#sortChildNodes.bind(this));

        const rootIds = [];
        const seenRoots = new Set();
        if (rootScene) {
            rootIds.push(rootScene.id);
            seenRoots.add(rootScene.id);
        }

        for (const scene of scenes) {
            if (seenRoots.has(scene.id)) continue;
            const parentId = scene.getFlag(MODULE_ID, this.LINEAGE_FLAG)?.parentSceneId
                || LegacySciFiCompatibility.getParentScene(scene)?.id
                || null;
            if (!parentId || !game.scenes.get(parentId)) {
                rootIds.push(scene.id);
                seenRoots.add(scene.id);
            }
        }

        const rows = [];
        const visitedSceneIds = new Set();
        const visitScene = (scene, depth = 0) => {
            if (!scene || visitedSceneIds.has(scene.id)) return;
            visitedSceneIds.add(scene.id);

            const sceneNode = this.#buildSceneNode(scene, rootScene);
            const childNodes = childNodesByParent.get(scene.id) || [];
            rows.push(this.#buildRow(sceneNode, depth, childNodes.length > 0));

            for (const childNode of childNodes) {
                if (childNode.nodeKind === "scene") visitScene(game.scenes.get(childNode.sceneId), depth + 1);
                else rows.push(this.#buildRow(childNode, depth + 1, false));
            }
        };

        for (const rootId of rootIds) visitScene(game.scenes.get(rootId), 0);
        for (const scene of scenes) visitScene(scene, 0);

        return { rootScene, rows };
    }

    static #buildSceneNode(scene, rootScene) {
        const legacyKind = LegacySciFiCompatibility.getSceneKind(scene);
        const legacyLabel = LegacySciFiCompatibility.getSceneLabel(scene);
        const legacyCanRename = !legacyKind;
        const nexusSiteFlags = scene.getFlag(MODULE_ID, "site") || {};
        const nexusLineage = scene.getFlag(MODULE_ID, this.LINEAGE_FLAG) || {};
        const legacyParentSceneId = LegacySciFiCompatibility.getParentScene(scene)?.id || null;
        const legacySiteFlags = legacyKind ? scene.getFlag("augur-scifi", "siteScene") || {} : {};
        const legacyJournalEntryId = legacyKind ? scene.getFlag("augur-scifi", "journalId") || null : null;
        const parentSceneId = nexusLineage.parentSceneId || legacyParentSceneId || null;
        const siteId = nexusLineage.parentSiteId || legacySiteFlags.siteId || null;
        const pageId = nexusSiteFlags.journalPageId || legacySiteFlags.journalPageId || null;
        const journalEntryId = nexusSiteFlags.journalEntryId || legacySiteFlags.journalEntryId || legacyJournalEntryId || null;
        const thumb = scene.thumb || "";
        const placePreviewFlags = scene.getFlag(MODULE_ID, "placePreview") || {};
        const associatedSiteIconSrc = this.#getAssociatedSiteIconSrc({
            nexusSiteFlags,
            parentSceneId,
            siteId,
            pageId,
            journalEntryId,
            linkedSceneThumb: thumb
        });
        const sceneIconSrc = placePreviewFlags.iconSrc || LegacySciFiCompatibility.getSceneIconSrc(scene);
        const iconSrc = siteId
            ? (associatedSiteIconSrc || sceneIconSrc || DEFAULT_SITE_ICON_SRC)
            : sceneIconSrc;

        return {
            id: `scene:${scene.id}`,
            nodeKind: "scene",
            sceneId: scene.id,
            siteId,
            pageId,
            journalEntryId,
            parentNodeId: parentSceneId ? `scene:${parentSceneId}` : null,
            parentSceneId,
            name: scene.name,
            thumb,
            iconSrc,
            sort: scene.sort ?? 0,
            isCurrent: canvas.scene?.id === scene.id,
            isActive: scene.active,
            isRoot: rootScene?.id === scene.id,
            canOpen: true,
            canConfigure: true,
            canRename: legacyCanRename,
            canDelete: true,
            typeLabel: rootScene?.id === scene.id ? "Nexus" : (legacyLabel || "Scene")
        };
    }

    static #getPendingSiteNodes(parentScene) {
        const recordNodes = SiteRecordManager.getSceneRecordList(parentScene)
            .filter(record => {
                const linkedSceneId = record.siteSceneId || record.linkedSceneId || null;
                return !linkedSceneId || !game.scenes.get(linkedSceneId);
            })
            .map(record => ({
                id: `site:${record.siteId}`,
                nodeKind: "pending-site",
                sceneId: null,
                siteId: record.siteId,
                pageId: record.journalPageId || null,
                journalEntryId: record.journalEntryId || null,
                parentNodeId: `scene:${parentScene.id}`,
                parentSceneId: parentScene.id,
                name: record.siteName || "Site",
                thumb: "",
                iconSrc: record.siteIconSrc || DEFAULT_SITE_ICON_SRC,
                sort: 0,
                isCurrent: false,
                isActive: false,
                isRoot: false,
                canOpen: true,
                canConfigure: false,
                canRename: false,
                canDelete: true,
                typeLabel: `${record.siteSceneTypeLabel || "Site"} Pending`
            }));

        const journalEntryId = parentScene?.getFlag(MODULE_ID, "siteJournalId") || null;
        const journalEntry = journalEntryId ? game.journal.get(journalEntryId) : null;
        if (!journalEntry) return recordNodes;

        const knownSiteIds = new Set(recordNodes.map(node => node.siteId));

        const legacyNodes = journalEntry.pages.contents
            .filter(page => {
                const flags = page.flags?.[MODULE_ID] || {};
                if (!flags.sitePage || flags.parentSceneId !== parentScene.id) return false;
                if (knownSiteIds.has(flags.siteId)) return false;
                const linkedSceneId = flags.siteSceneId || flags.linkedSceneId || null;
                return !linkedSceneId || !game.scenes.get(linkedSceneId);
            })
            .map(page => {
                const flags = page.flags?.[MODULE_ID] || {};
                return {
                    id: `site:${flags.siteId || page.id}`,
                    nodeKind: "pending-site",
                    sceneId: null,
                    siteId: flags.siteId || page.id,
                    pageId: page.id,
                    journalEntryId: page.parent?.id || null,
                    parentNodeId: `scene:${parentScene.id}`,
                    parentSceneId: parentScene.id,
                    name: flags.siteName || page.name,
                    thumb: "",
                    iconSrc: flags.siteIconSrc || DEFAULT_SITE_ICON_SRC,
                    sort: page.sort ?? 0,
                    isCurrent: false,
                    isActive: false,
                    isRoot: false,
                    canOpen: true,
                    canConfigure: false,
                    canRename: false,
                    canDelete: true,
                    typeLabel: `${flags.siteSceneTypeLabel || "Site"} Pending`
                };
            });
        return [...recordNodes, ...legacyNodes];
    }

    static #getAssociatedSiteIconSrc({ nexusSiteFlags = {}, parentSceneId = null, siteId = null, pageId = null, journalEntryId = null, linkedSceneThumb = "" } = {}) {
        const excluded = new Set([linkedSceneThumb].filter(Boolean));
        if (nexusSiteFlags.siteIconSrc && !excluded.has(nexusSiteFlags.siteIconSrc)) return nexusSiteFlags.siteIconSrc;
        if (!siteId) return "";

        const parentScene = parentSceneId ? game.scenes.get(parentSceneId) : null;
        const parentNote = parentScene?.tiles?.contents?.find(tile => tile.flags?.[MODULE_ID]?.siteId === siteId)
            || parentScene?.notes?.contents?.find(note => note.flags?.[MODULE_ID]?.siteId === siteId)
            || null;
        const noteIcon = parentNote?.flags?.[MODULE_ID]?.siteIconSrc || parentNote?.texture?.src || "";
        if (noteIcon && !excluded.has(noteIcon)) return noteIcon;

        const resolvedJournalEntryId = journalEntryId || parentScene?.getFlag(MODULE_ID, "siteJournalId") || null;
        const page = pageId && resolvedJournalEntryId
            ? game.journal.get(resolvedJournalEntryId)?.pages.get(pageId)
            : resolvedJournalEntryId
                ? game.journal.get(resolvedJournalEntryId)?.pages.contents.find(candidate => candidate.flags?.[MODULE_ID]?.siteId === siteId)
                : null;
        const pageIcon = page?.flags?.[MODULE_ID]?.siteIconSrc || "";
        return pageIcon && !excluded.has(pageIcon) ? pageIcon : "";
    }

    static #buildRow(node, depth, hasChildren) {
        return { ...node, depth, hasChildren };
    }

    static #pushChildNode(map, parentSceneId, node) {
        const bucket = map.get(parentSceneId) || [];
        bucket.push(node);
        map.set(parentSceneId, bucket);
    }

    static #sortChildNodes(a, b) {
        const sortA = a.sort ?? 0;
        const sortB = b.sort ?? 0;
        if (sortA !== sortB) return sortA - sortB;
        return (a.name || "").localeCompare(b.name || "", game.i18n.lang);
    }

    static #sortScenes(a, b) {
        const sortA = a.sort ?? 0;
        const sortB = b.sort ?? 0;
        if (sortA !== sortB) return sortA - sortB;
        return (a.name || "").localeCompare(b.name || "", game.i18n.lang);
    }
}
