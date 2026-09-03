import { SiteJournalManager } from "./SiteJournalManager.js";
import { SiteIconGeometry } from "./SiteIconGeometry.js";
import { SiteLabelManager } from "./SiteLabelManager.js";

const MODULE_ID = "augur-nexus";
const RECORDS_FLAG = "sites";

export class SiteRecordManager {
    static getSceneRecords(scene) {
        const records = scene?.getFlag(MODULE_ID, RECORDS_FLAG)?.records || {};
        return foundry.utils.deepClone(records);
    }

    static getSceneRecord(scene, siteId) {
        if (!scene || !siteId) return null;
        const record = this.getSceneRecords(scene)?.[siteId] || null;
        return record ? this.normalizeRecord(record, { parentScene: scene }) : null;
    }

    static getSceneRecordList(scene) {
        return Object.values(this.getSceneRecords(scene))
            .map(record => this.normalizeRecord(record, { parentScene: scene }))
            .filter(record => !!record?.siteId);
    }

    static async upsertSceneRecord(scene, record) {
        const normalized = this.normalizeRecord(record, { parentScene: scene });
        if (!scene || !normalized?.siteId) return null;

        const sites = foundry.utils.deepClone(scene.getFlag(MODULE_ID, RECORDS_FLAG) || {});
        const records = foundry.utils.deepClone(sites.records || {});
        records[normalized.siteId] = normalized;
        sites.records = records;
        await scene.setFlag(MODULE_ID, RECORDS_FLAG, sites);
        return normalized;
    }

    static async removeSceneRecord(scene, siteId, { placeableId = null, linkedSceneId = null } = {}) {
        if (!scene || (!siteId && !placeableId && !linkedSceneId)) return false;
        const sites = foundry.utils.deepClone(scene.getFlag(MODULE_ID, RECORDS_FLAG) || {});
        const records = foundry.utils.deepClone(sites.records || {});
        const removedKeys = new Set();

        if (siteId && records[siteId]) removedKeys.add(siteId);
        for (const [key, record] of Object.entries(records)) {
            if (siteId && record?.siteId === siteId) removedKeys.add(key);
            if (placeableId && record?.placeableId === placeableId) removedKeys.add(key);
            if (linkedSceneId && (record?.siteSceneId === linkedSceneId || record?.linkedSceneId === linkedSceneId)) removedKeys.add(key);
        }

        if (!removedKeys.size) return false;
        const removedRecords = [...removedKeys]
            .map(key => this.normalizeRecord(records[key], { parentScene: scene }))
            .filter(record => !!record?.siteId);
        const update = {};
        for (const key of removedKeys) {
            delete records[key];
            update[`flags.${MODULE_ID}.${RECORDS_FLAG}.records.-=${key}`] = null;
        }
        await scene.update(update);
        await this.#removeConnectionTargetsForRecords(removedRecords, scene);
        return true;
    }

    static async clearDiscoveryFlags(scene) {
        if (!scene) return false;
        const sites = foundry.utils.deepClone(scene.getFlag(MODULE_ID, RECORDS_FLAG) || {});
        const records = foundry.utils.deepClone(sites.records || {});
        let changedRecords = false;

        for (const record of Object.values(records)) {
            if (!record || !Object.hasOwn(record, "discovered")) continue;
            delete record.discovered;
            changedRecords = true;
        }

        const updatesByType = new Map();
        for (const collection of [scene.tiles?.contents, scene.notes?.contents]) {
            for (const doc of collection || []) {
                const flags = doc.flags?.[MODULE_ID] || {};
                if (!flags.site || !Object.hasOwn(flags, "discovered")) continue;
                const documentName = doc.documentName || "Tile";
                const nextFlags = foundry.utils.deepClone(flags);
                delete nextFlags.discovered;
                if (!updatesByType.has(documentName)) updatesByType.set(documentName, []);
                updatesByType.get(documentName).push({
                    _id: doc.id,
                    [`flags.${MODULE_ID}`]: nextFlags
                });
            }
        }

        if (changedRecords) {
            sites.records = records;
            await scene.setFlag(MODULE_ID, RECORDS_FLAG, sites);
        }

        for (const [documentName, updates] of updatesByType.entries()) {
            if (updates.length) await scene.updateEmbeddedDocuments(documentName, updates);
        }

        return changedRecords || Array.from(updatesByType.values()).some(updates => updates.length);
    }

    static async persistLinkedScene(record, sceneId, sceneName = "") {
        const parentScene = this.getParentScene(record);
        if (!parentScene || !record?.siteId) return null;

        const nextRecord = this.normalizeRecord({
            ...record,
            linkedSceneId: sceneId || null,
            siteSceneId: sceneId || null,
            linkedSceneName: sceneName || record.linkedSceneName || ""
        }, { parentScene });

        await this.upsertSceneRecord(parentScene, nextRecord);
        await this.syncRecordToVisuals(parentScene, nextRecord);

        if (nextRecord.journalEntryId || nextRecord.journalPageId) {
            await SiteJournalManager.updateSitePageSceneLink(
                nextRecord.journalEntryId,
                nextRecord.siteId,
                sceneId,
                sceneName
            );
        }

        return nextRecord;
    }

    static async syncRecordToVisuals(scene, record) {
        const normalized = this.normalizeRecord(record, { parentScene: scene });
        if (!scene || !normalized?.siteId) return null;

        await this.syncRecordToMarkers(scene, normalized);
        return normalized;
    }

    static async syncRecordToMarkers(scene, record) {
        const normalized = this.normalizeRecord(record, { parentScene: scene });
        if (!scene || !normalized?.siteId) return false;
        const { NexusMarkerService } = await import("../../markers/services/NexusMarkerService.js");
        return NexusMarkerService.syncSiteMarkers(normalized);
    }

    static findSitePlaceable(scene, siteId, placeableId = null) {
        if (!scene || !siteId) return null;
        const matches = doc => {
            const flags = doc?.flags?.[MODULE_ID] || {};
            if (!flags.site) return false;
            if (placeableId && doc.id === placeableId) return true;
            return flags.siteId === siteId;
        };

        const tile = scene.tiles?.contents?.find(matches)
            || (canvas.scene?.id === scene.id
                ? canvas.tiles?.placeables?.find(placeable => matches(placeable.document)) || null
                : null);
        if (tile) return tile;

        return scene.notes?.contents?.find(matches)
            || (canvas.scene?.id === scene.id
                ? canvas.notes?.placeables?.find(placeable => matches(placeable.document)) || null
                : null);
    }

    static resolveSite({ parentScene = null, siteId = null, siteRecord = null, placeable = null, page = null, journalEntryId = null, pageId = null } = {}) {
        if (siteRecord) {
            const scene = parentScene || this.getParentScene(siteRecord);
            return this.normalizeRecord(siteRecord, { parentScene: scene });
        }

        const placeableRecord = placeable ? this.fromPlaceable(placeable, parentScene) : null;
        if (placeableRecord) return placeableRecord;

        const scene = parentScene || (siteId ? this.#findParentSceneForSite(siteId) : null);
        const sceneRecord = scene && siteId ? this.getSceneRecord(scene, siteId) : null;
        if (sceneRecord) return sceneRecord;

        const foundPlaceable = scene && siteId ? this.findSitePlaceable(scene, siteId) : null;
        const foundPlaceableRecord = foundPlaceable ? this.fromPlaceable(foundPlaceable, scene) : null;
        if (foundPlaceableRecord) return foundPlaceableRecord;

        const resolvedPage = page || this.#resolveLegacyPage({ journalEntryId, pageId, parentScene: scene, siteId });
        return resolvedPage ? this.fromPage(resolvedPage) : null;
    }

    static fromPlaceable(placeable, parentScene = null) {
        const doc = placeable?.document || placeable || null;
        const flags = doc?.flags?.[MODULE_ID] || {};
        if (!flags.site || !flags.siteId) return null;

        const scene = parentScene
            || game.scenes.get(flags.parentSceneId)
            || canvas.scene
            || null;

        return this.normalizeRecord({
            ...flags,
            siteName: flags.siteName || doc.text || "Site",
            siteIconSrc: flags.siteIconSrc || doc.texture?.src || "",
            iconSize: Number(doc.iconSize || doc.height || flags.iconSize || 100),
            siteIconAspectRatio: flags.siteIconAspectRatio || SiteIconGeometry.aspectRatioFromDocument(doc),
            rotation: flags.rotation ?? doc.rotation ?? 0,
            showLabel: flags.showLabel !== false,
            labelFontSize: flags.labelFontSize || null,
            labelFontFamily: flags.labelFontFamily || null,
            siteLabelColor: flags.siteLabelColor || doc.textColor || flags.siteColor || "#ffffff",
            parentSceneId: flags.parentSceneId || scene?.id || null,
            parentSceneName: flags.parentSceneName || scene?.name || "",
            placeableDocumentName: doc.documentName || "Note",
            placeableId: doc.id || flags.placeableId || null
        }, { parentScene: scene });
    }

    static fromPage(page) {
        const flags = page?.flags?.[MODULE_ID] || {};
        if (!flags.sitePage || !flags.siteId) return null;

        return this.normalizeRecord({
            ...flags,
            siteName: flags.siteName || page.name || "Site",
            journalEntryId: page.parent?.id || flags.journalEntryId || null,
            journalPageId: page.id || flags.journalPageId || null,
            legacyJournalBacked: true
        }, { parentScene: game.scenes.get(flags.parentSceneId) || null });
    }

    static normalizeRecord(record = {}, { parentScene = null } = {}) {
        if (!record) return null;
        const siteId = record.siteId || foundry.utils.randomID();
        const scene = parentScene || game.scenes.get(record.parentSceneId) || null;
        const siteName = (record.siteName || record.name || "Site").trim?.() || "Site";

        return {
            siteId,
            siteName,
            siteGenre: record.siteGenre || record.genreId || "fantasy",
            siteGenreLabel: record.siteGenreLabel || record.genreLabel || "Fantasy",
            siteSceneType: record.siteSceneType || record.sceneType || "empty",
            siteSceneTypeLabel: record.siteSceneTypeLabel || record.sceneTypeLabel || "Empty Scene",
            siteScenePresetId: record.siteScenePresetId || record.sceneTypePresetId || null,
            siteScenePresetLabel: record.siteScenePresetLabel || record.sceneTypePresetLabel || "",
            siteSceneBiomeId: record.siteSceneBiomeId || record.sceneTypeBiomeId || null,
            siteSceneBiomeLabel: record.siteSceneBiomeLabel || record.sceneTypeBiomeLabel || "",
            siteSceneBiomeFieldLabel: record.siteSceneBiomeFieldLabel || record.sceneTypeBiomeFieldLabel || "Biome",
            siteSceneImageSrc: record.siteSceneImageSrc || record.sceneImageSrc || "",
            siteSceneImageName: record.siteSceneImageName || record.sceneImageName || "",
            coverImageSrc: record.coverImageSrc || "",
            linkedSceneId: record.siteSceneId || record.linkedSceneId || null,
            siteSceneId: record.siteSceneId || record.linkedSceneId || null,
            linkedSceneName: record.linkedSceneName || "",
            siteTheme: record.siteTheme || record.themeId || "castle",
            siteThemeLabel: record.siteThemeLabel || record.themeLabel || "Castle",
            siteIconRole: record.siteIconRole || record.iconRole || "landmark",
            siteIconRoleLabel: record.siteIconRoleLabel || record.iconRoleLabel || "Landmark",
            siteSize: record.siteSize || record.sizeId || "small",
            siteSizeLabel: record.siteSizeLabel || record.sizeLabel || "Small",
            roomCount: Number(record.roomCount || 5),
            autoSortScenes: record.autoSortScenes !== false,
            siteIcon: record.siteIcon || record.iconId || null,
            siteIconSrc: record.siteIconSrc || record.iconSrc || "",
            iconSize: Number(record.iconSize || 100),
            siteIconAspectRatio: SiteIconGeometry.normalizeAspectRatio(record.siteIconAspectRatio || record.iconAspectRatio || 1),
            rotation: this.#normalizeRotation(record.rotation || 0),
            showLabel: record.showLabel !== false,
            labelFontSize: SiteLabelManager.resolveFontSize(record),
            labelFontFamily: SiteLabelManager.resolveFontFamily(record),
            siteColor: record.siteColor || record.iconColor || "#ffffff",
            siteLabelColor: record.siteLabelColor || record.labelColor || record.siteColor || record.iconColor || "#ffffff",
            mapColorId: record.mapColorId || "green",
            mapColorLabel: record.mapColorLabel || "Green",
            parentSceneId: record.parentSceneId || scene?.id || null,
            parentSceneName: record.parentSceneName || scene?.name || "",
            placeableDocumentName: record.placeableDocumentName || "Note",
            placeableId: record.placeableId || record.noteId || null,
            labelId: record.labelId || null,
            playerVisibility: ["inherit", "show", "hide"].includes(record.playerVisibility) ? record.playerVisibility : "inherit",
            journalEntryId: record.journalEntryId || null,
            journalPageId: record.journalPageId || null,
            markerRefs: Array.isArray(record.markerRefs) ? foundry.utils.deepClone(record.markerRefs).filter(ref => ref?.markerId && ref?.sceneId && ref?.documentId) : [],
            legacyJournalBacked: !!record.legacyJournalBacked
        };
    }

    static createPageAdapter(record) {
        const normalized = this.normalizeRecord(record);
        return {
            id: normalized.journalPageId || null,
            name: normalized.siteName,
            flags: { [MODULE_ID]: { ...normalized, sitePage: true } },
            parent: normalized.journalEntryId ? game.journal.get(normalized.journalEntryId) || null : null
        };
    }

    static getParentScene(record) {
        if (!record) return null;
        return game.scenes.get(record.parentSceneId) || null;
    }

    static #normalizeRotation(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return 0;
        return ((Math.round(numeric) % 360) + 360) % 360;
    }

    static #resolveLegacyPage({ journalEntryId = null, pageId = null, parentScene = null, siteId = null } = {}) {
        if (journalEntryId && pageId) return game.journal.get(journalEntryId)?.pages.get(pageId) || null;
        const entryId = journalEntryId || parentScene?.getFlag(MODULE_ID, "siteJournalId") || null;
        return entryId && siteId ? SiteJournalManager.findSitePage(entryId, siteId) : null;
    }

    static #findParentSceneForSite(siteId) {
        if (!siteId) return null;
        return game.scenes.contents.find(scene => {
            if (this.getSceneRecords(scene)?.[siteId]) return true;
            if (scene.notes?.contents?.some(note => note.flags?.[MODULE_ID]?.siteId === siteId)) return true;
            return scene.tiles?.contents?.some(tile => tile.flags?.[MODULE_ID]?.siteId === siteId);
        }) || null;
    }

    static async #removeConnectionTargetsForRecords(records = [], scene = null) {
        if (!records.length) return;
        const { ConnectionStore } = await import("../../connections/services/ConnectionStore.js");
        for (const record of records) {
            await ConnectionStore.removeConnectionsForTarget({
                kind: "nexus-site",
                parentSceneId: record.parentSceneId || scene?.id || null,
                siteId: record.siteId || null
            });
        }
    }

}
