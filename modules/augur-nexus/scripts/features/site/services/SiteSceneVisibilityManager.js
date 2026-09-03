import { SiteLabelManager } from "./SiteLabelManager.js";
import { SiteRecordManager } from "./SiteRecordManager.js";
import { NexusMarkerService } from "../../markers/services/NexusMarkerService.js";
import { CampaignEntityJournalStore } from "../../campaign-entities/services/CampaignEntityJournalStore.js";
import { CampaignEntityVisibilityManager } from "../../campaign-entities/services/CampaignEntityVisibilityManager.js";
import { NexusPlayerSceneAccess } from "../../nexus/services/NexusPlayerSceneAccess.js";

const MODULE_ID = "augur-nexus";
const SITES_FLAG = "sites";

export class SiteSceneVisibilityManager {
    static getSceneOptions(scene = canvas.scene) {
        const sites = scene?.getFlag(MODULE_ID, SITES_FLAG) || {};
        return {
            showMarkers: sites.showMarkers !== false,
            showLabels: sites.showLabels !== false
        };
    }

    static getSceneSummary(scene = canvas.scene) {
        const records = SiteRecordManager.getSceneRecordList(scene);
        return {
            siteCount: records.length
        };
    }

    static async setSceneOptions(scene = canvas.scene, options = {}) {
        if (!scene) return null;
        const sites = foundry.utils.deepClone(scene.getFlag(MODULE_ID, SITES_FLAG) || {});
        if ("showMarkers" in options) sites.showMarkers = options.showMarkers !== false;
        if ("showLabels" in options) sites.showLabels = options.showLabels !== false;
        await scene.setFlag(MODULE_ID, SITES_FLAG, sites);
        await this.applySceneVisibility(scene);
        return this.getSceneOptions(scene);
    }

    static getSitePlayerVisibilityOverride({ scene = canvas.scene, siteId = null, linkedScene = null, record = null } = {}) {
        const siteRecord = record || SiteRecordManager.getSceneRecord(scene, siteId);
        const resolvedLinkedScene = linkedScene
            || game.scenes.get(siteRecord?.siteSceneId || siteRecord?.linkedSceneId)
            || null;
        const sceneOverride = resolvedLinkedScene
            ? NexusPlayerSceneAccess.getSceneNexusVisibilityOverride(resolvedLinkedScene)
            : "inherit";
        if (sceneOverride !== "inherit") return sceneOverride;

        const recordOverride = NexusPlayerSceneAccess.normalizeNexusVisibilityOverride(siteRecord?.playerVisibility);
        if (recordOverride !== "inherit") return recordOverride;

        return "inherit";
    }

    static getSitePlayerVisibilityLabel(options = {}) {
        return NexusPlayerSceneAccess.getNexusVisibilityLabel(this.getSitePlayerVisibilityOverride(options));
    }

    static getSitePlayerVisibilityIcon(options = {}) {
        return NexusPlayerSceneAccess.getNexusVisibilityIcon(this.getSitePlayerVisibilityOverride(options));
    }

    static isSiteVisibleToPlayers(options = {}) {
        return NexusPlayerSceneAccess.isNexusVisibilityVisible(this.getSitePlayerVisibilityOverride(options));
    }

    static canUserSeeSite(options = {}, user = game.user) {
        if (user?.isGM) return true;
        return this.isSiteVisibleToPlayers(options);
    }

    static async setSitePlayerVisibilityOverride({ parentScene = canvas.scene, siteId = null, linkedScene = null, value = "inherit" } = {}) {
        if (!game.user.isGM || !parentScene || !siteId) return null;

        const normalized = NexusPlayerSceneAccess.normalizeNexusVisibilityOverride(value);
        const record = SiteRecordManager.getSceneRecord(parentScene, siteId);
        if (!record) return null;

        const resolvedLinkedScene = linkedScene
            || game.scenes.get(record.siteSceneId || record.linkedSceneId)
            || null;
        if (resolvedLinkedScene) await NexusPlayerSceneAccess.setSceneNexusVisibilityOverride(resolvedLinkedScene, normalized);

        const nextRecord = SiteRecordManager.normalizeRecord({
            ...record,
            playerVisibility: normalized
        }, { parentScene });
        await SiteRecordManager.upsertSceneRecord(parentScene, nextRecord);
        await SiteRecordManager.syncRecordToVisuals(parentScene, nextRecord);
        Hooks.callAll("augurNexusPlayerSceneAccessChanged", parentScene);

        await this.applySceneVisibility(parentScene);
        await this.applyMarkerVisibilityForTarget({
            kind: "nexus-site",
            parentSceneId: parentScene.id,
            siteId
        });
        Hooks.callAll("augurNexusLineageChanged");
        return this.getSitePlayerVisibilityOverride({ scene: parentScene, siteId });
    }

    static async applySceneVisibility(scene = canvas.scene) {
        if (!scene) return;
        await SiteRecordManager.clearDiscoveryFlags(scene);
        const options = this.getSceneOptions(scene);
        const updatesByType = new Map();
        const drawingUpdates = [];

        for (const record of SiteRecordManager.getSceneRecordList(scene)) {
            const placeable = SiteRecordManager.findSitePlaceable(scene, record.siteId, record.placeableId);
            const doc = placeable?.document || placeable || null;
            if (!doc?.id) continue;

            const documentName = doc.documentName || record.placeableDocumentName || "Tile";
            const isTileSite = documentName === "Tile";
            const playerHidden = isTileSite && !this.isSiteVisibleToPlayers({ scene, record });
            const markerHidden = !options.showMarkers || playerHidden;
            const markerUpdate = {
                _id: doc.id,
                hidden: markerHidden
            };
            if (documentName === "Tile") markerUpdate.alpha = options.showMarkers ? 1 : 0;
            this.#pushUpdate(updatesByType, documentName, markerUpdate);

            const label = SiteLabelManager.findLabelForTile(scene, doc) || SiteLabelManager.findLabel(scene, record.siteId);
            const labelDoc = label?.document || label || null;
            if (!labelDoc?.id) continue;

            const labelHidden = markerHidden || !options.showLabels || record.showLabel === false;
            drawingUpdates.push({
                _id: labelDoc.id,
                hidden: labelHidden,
                fillAlpha: labelHidden ? 0 : SiteLabelManager.LABEL_FILL_ALPHA,
                textAlpha: labelHidden ? SiteLabelManager.HIDDEN_LABEL_TEXT_ALPHA : SiteLabelManager.LABEL_TEXT_ALPHA
            });
        }

        for (const tile of scene.tiles?.contents || []) {
            const marker = NexusMarkerService.getMarkerRecord(tile);
            if (!marker) continue;

            const playerHidden = !this.#isMarkerVisibleToPlayers(marker);
            const markerHidden = !options.showMarkers || playerHidden;
            this.#pushUpdate(updatesByType, "Tile", {
                _id: tile.id,
                hidden: markerHidden,
                alpha: options.showMarkers ? 1 : 0
            });

            const label = NexusMarkerService.findLabelForTile(scene, tile);
            const labelDoc = label?.document || label || null;
            if (!labelDoc?.id) continue;

            const labelHidden = markerHidden || !options.showLabels || marker.presentation?.showLabel === false;
            drawingUpdates.push({
                _id: labelDoc.id,
                hidden: labelHidden,
                fillAlpha: labelHidden ? 0 : SiteLabelManager.LABEL_FILL_ALPHA,
                textAlpha: labelHidden ? SiteLabelManager.HIDDEN_LABEL_TEXT_ALPHA : SiteLabelManager.LABEL_TEXT_ALPHA
            });
        }

        for (const [documentName, updates] of updatesByType.entries()) {
            if (updates.length) await scene.updateEmbeddedDocuments(documentName, updates, { [MODULE_ID]: { visualOnly: true } });
        }
        if (drawingUpdates.length) await scene.updateEmbeddedDocuments("Drawing", drawingUpdates, { [MODULE_ID]: { visualOnly: true } });
    }

    static async applyMarkerVisibilityForTarget(targetOrEntity = {}) {
        const refs = await NexusMarkerService.getMarkerRefsForTarget(targetOrEntity);
        const sceneIds = [...new Set(refs.map(ref => ref.sceneId).filter(Boolean))];
        for (const sceneId of sceneIds) {
            const scene = game.scenes.get(sceneId);
            if (scene) await this.applySceneVisibility(scene);
        }
        return sceneIds.length;
    }

    static #pushUpdate(map, documentName, update) {
        if (!map.has(documentName)) map.set(documentName, []);
        map.get(documentName).push(update);
    }

    static #isMarkerVisibleToPlayers(marker) {
        const target = marker?.target || {};
        if (target.kind === "nexus-site") {
            const parentScene = target.parentSceneId ? game.scenes.get(target.parentSceneId) || null : null;
            const record = parentScene && target.siteId ? SiteRecordManager.getSceneRecord(parentScene, target.siteId) : null;
            const linkedSceneId = record?.siteSceneId || record?.linkedSceneId || null;
            const linkedScene = linkedSceneId ? game.scenes.get(linkedSceneId) || null : null;
            return this.isSiteVisibleToPlayers({ scene: parentScene, siteId: target.siteId, linkedScene, record });
        }

        if (target.kind === "nexus-scene") {
            const targetScene = target.sceneId ? game.scenes.get(target.sceneId) || null : null;
            const override = NexusPlayerSceneAccess.getSceneNexusVisibilityOverride(targetScene);
            return NexusPlayerSceneAccess.isNexusVisibilityVisible(override);
        }

        if (target.kind === "campaign-entity") {
            const entity = target.entityType === "ship"
                ? CampaignEntityJournalStore.getShip(target.entityId)
                : target.entityType === "faction"
                    ? CampaignEntityJournalStore.getFaction(target.entityId)
                    : CampaignEntityJournalStore.getNpc(target.entityId);
            return entity ? CampaignEntityVisibilityManager.isVisibleToPlayers(entity) : false;
        }

        return NexusPlayerSceneAccess.isNexusVisibilityVisible(marker?.presentation?.playerVisibility || "inherit");
    }
}
