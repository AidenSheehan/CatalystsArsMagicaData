import { confirmDestructiveAction } from "../../../api/ui.js";
import { CampaignEntityJournalStore } from "../../campaign-entities/services/CampaignEntityJournalStore.js";
import { CampaignEntityVisibilityManager } from "../../campaign-entities/services/CampaignEntityVisibilityManager.js";
import { NexusPlayerSceneAccess } from "../../nexus/services/NexusPlayerSceneAccess.js";
import { NexusSceneDeletionCoordinator } from "../../nexus/services/NexusSceneDeletionCoordinator.js";
import { LegacySciFiCompatibility } from "../../../support/compatibility/LegacySciFiCompatibility.js";
import { EntityPlacementTab } from "../../site/applications/tabs/EntityPlacementTab.js";
import { SiteDeletionManager } from "../../site/services/SiteDeletionManager.js";
import { SiteRecordManager } from "../../site/services/SiteRecordManager.js";
import { SiteSceneVisibilityManager } from "../../site/services/SiteSceneVisibilityManager.js";
import { NexusMarkerService } from "./NexusMarkerService.js";

const MODULE_ID = "augur-nexus";

export class NexusMarkerTargetActions {
    static getActionState(placeable) {
        const record = NexusMarkerService.getMarkerRecord(placeable);
        if (!record) return null;
        const target = record.target || {};
        const targetScene = this.resolveTargetScene(record);
        const visibility = this.getVisibilityState(record);
        const playerAccess = this.getPlayerSceneAccessState(record);
        const entityConfig = target.kind === "campaign-entity" ? EntityPlacementTab.getConfig(target.entityType) : null;
        const targetLabel = this.getTargetTypeLabel(record);

        return {
            record,
            target,
            targetScene,
            targetLabel,
            openLabel: this.getOpenLabel(record),
            openIcon: entityConfig?.icon || this.getTargetIcon(record),
            visibility,
            playerAccess,
            canDeleteTarget: this.canDeleteTarget(record),
            deleteTargetLabel: this.getDeleteTargetMenuLabel(record)
        };
    }

    static getOpenLabel(record) {
        const target = record?.target || {};
        if (target.kind === "nexus-site") {
            const siteRecord = this.resolveSiteRecord(record);
            const linkedScene = this.resolveTargetScene(record);
            return linkedScene || siteRecord?.linkedSceneId || siteRecord?.siteSceneId ? "Open Site Scene" : "Create Site Scene";
        }
        if (target.kind === "nexus-scene") return "Open Scene";
        if (target.kind === "legacy-scifi-pending") return "Open Pending Node";
        if (target.kind === "campaign-entity") {
            const config = EntityPlacementTab.getConfig(target.entityType);
            return config ? `Open ${config.label}` : "Open Entity";
        }
        return "Open Marker";
    }

    static getTargetTypeLabel(record) {
        const target = record?.target || {};
        if (target.kind === "nexus-site") return "Site";
        if (target.kind === "nexus-scene") return "Scene";
        if (target.kind === "legacy-scifi-pending") return "Pending Node";
        if (target.kind === "campaign-entity") return EntityPlacementTab.getConfig(target.entityType)?.label || "Entity";
        return "Target";
    }

    static getDeleteTargetMenuLabel(record) {
        const target = record?.target || {};
        if (target.kind === "campaign-entity") return "Delete Linked Entity";
        if (target.kind === "nexus-site") return "Delete Linked Site";
        if (target.kind === "nexus-scene") return "Delete Linked Scene";
        return `Delete Linked ${this.getTargetTypeLabel(record)}`;
    }

    static getTargetIcon(record) {
        const target = record?.target || {};
        if (target.kind === "nexus-site") return "fas fa-location-dot";
        if (target.kind === "nexus-scene") return "fas fa-map";
        if (target.kind === "legacy-scifi-pending") return "fas fa-clock";
        return "fas fa-eye";
    }

    static async openTarget(placeable) {
        const record = NexusMarkerService.getMarkerRecord(placeable);
        if (!record) return null;
        const target = record.target || {};

        if (target.kind === "nexus-site" && !game.user?.isGM) {
            const scene = this.resolveTargetScene(record);
            if (!scene || !NexusPlayerSceneAccess.canUserViewScene(scene)) {
                ui.notifications.warn("This site scene is not currently available to view.");
                return null;
            }
            await scene.view();
            return scene;
        }

        if (target.kind === "nexus-scene") {
            const scene = this.resolveTargetScene(record);
            if (!scene) return NexusMarkerService.openMarker(placeable);
            if (!game.user?.isGM && !NexusPlayerSceneAccess.canUserViewScene(scene)) {
                ui.notifications.warn("This scene is not currently available to view.");
                return null;
            }
            await scene.view();
            return scene;
        }

        return NexusMarkerService.openMarker(placeable);
    }

    static async previewTarget(placeable) {
        return NexusMarkerService.previewMarker(placeable);
    }

    static getVisibilityState(record) {
        const target = record?.target || {};
        if (target.kind === "nexus-site") {
            const siteRecord = this.resolveSiteRecord(record);
            if (!siteRecord) return null;
            const parentScene = SiteRecordManager.getParentScene(siteRecord);
            const linkedScene = this.resolveTargetScene(record);
            return {
                supported: true,
                value: SiteSceneVisibilityManager.getSitePlayerVisibilityOverride({
                    scene: parentScene,
                    siteId: siteRecord.siteId,
                    linkedScene,
                    record: siteRecord
                }),
                label: SiteSceneVisibilityManager.getSitePlayerVisibilityLabel({
                    scene: parentScene,
                    siteId: siteRecord.siteId,
                    linkedScene,
                    record: siteRecord
                }),
                icon: SiteSceneVisibilityManager.getSitePlayerVisibilityIcon({
                    scene: parentScene,
                    siteId: siteRecord.siteId,
                    linkedScene,
                    record: siteRecord
                })
            };
        }

        if (target.kind === "nexus-scene") {
            const scene = this.resolveTargetScene(record);
            if (!scene) return null;
            const value = NexusPlayerSceneAccess.getSceneNexusVisibilityOverride(scene);
            return {
                supported: true,
                value,
                label: NexusPlayerSceneAccess.getNexusVisibilityLabel(value),
                icon: NexusPlayerSceneAccess.getNexusVisibilityIcon(value)
            };
        }

        if (target.kind === "campaign-entity") {
            const entity = this.resolveEntity(record);
            if (entity) {
                return {
                    supported: true,
                    value: CampaignEntityVisibilityManager.getPlayerVisibilityOverride(entity),
                    label: CampaignEntityVisibilityManager.getPlayerVisibilityLabel(entity),
                    icon: CampaignEntityVisibilityManager.getPlayerVisibilityIcon(entity)
                };
            }
            const value = this.#normalizeVisibility(record.presentation?.playerVisibility);
            return {
                supported: true,
                value,
                label: NexusPlayerSceneAccess.getNexusVisibilityLabel(value),
                icon: NexusPlayerSceneAccess.getNexusVisibilityIcon(value),
                markerOnly: true
            };
        }

        const value = this.#normalizeVisibility(record?.presentation?.playerVisibility);
        return {
            supported: true,
            value,
            label: NexusPlayerSceneAccess.getNexusVisibilityLabel(value),
            icon: NexusPlayerSceneAccess.getNexusVisibilityIcon(value),
            markerOnly: true
        };
    }

    static async setVisibilityState(placeable, value = "inherit") {
        const record = NexusMarkerService.getMarkerRecord(placeable);
        if (!record) return null;
        const target = record.target || {};
        const normalized = this.#normalizeVisibility(value);

        if (target.kind === "nexus-site") {
            const siteRecord = this.resolveSiteRecord(record);
            const parentScene = SiteRecordManager.getParentScene(siteRecord);
            if (!siteRecord || !parentScene) return null;
            return SiteSceneVisibilityManager.setSitePlayerVisibilityOverride({
                parentScene,
                siteId: siteRecord.siteId,
                linkedScene: this.resolveTargetScene(record),
                value: normalized
            });
        }

        if (target.kind === "nexus-scene") {
            const scene = this.resolveTargetScene(record);
            if (!scene) return null;
            await NexusPlayerSceneAccess.setSceneNexusVisibilityOverride(scene, normalized);
            await SiteSceneVisibilityManager.applySceneVisibility(canvas.scene);
            return normalized;
        }

        if (target.kind === "campaign-entity" && CampaignEntityVisibilityManager.getEntityTypes().includes(target.entityType)) {
            await CampaignEntityVisibilityManager.setPlayerVisibilityOverride(target.entityId, target.entityType, normalized);
            await SiteSceneVisibilityManager.applySceneVisibility(canvas.scene);
            return normalized;
        }

        return this.#setMarkerLocalVisibility(placeable, record, normalized);
    }

    static getPlayerSceneAccessState(record) {
        const scene = this.resolveTargetScene(record);
        if (!scene) {
            return {
                supported: record?.target?.kind === "nexus-site",
                unavailable: true,
                value: "inherit",
                label: "Create Scene First",
                icon: "fas fa-door-open"
            };
        }
        return {
            supported: true,
            unavailable: false,
            value: NexusPlayerSceneAccess.getSceneViewOverride(scene),
            label: NexusPlayerSceneAccess.getSceneViewLabel(scene),
            icon: "fas fa-door-open"
        };
    }

    static async setPlayerSceneAccessState(record, value = "inherit") {
        const scene = this.resolveTargetScene(record);
        if (!scene) return null;
        return NexusPlayerSceneAccess.setSceneViewOverride(scene, value);
    }

    static async deleteMarker(placeable) {
        return NexusMarkerService.deleteMarker(placeable);
    }

    static canDeleteTarget(record) {
        const target = record?.target || {};
        if (target.kind === "nexus-site") return !!this.resolveSiteRecord(record);
        if (target.kind === "nexus-scene") return !!this.resolveTargetScene(record);
        if (target.kind === "campaign-entity") return !!this.resolveEntity(record);
        return false;
    }

    static async deleteTarget(placeable) {
        const record = NexusMarkerService.getMarkerRecord(placeable);
        if (!record) return false;
        const target = record.target || {};
        const name = record.presentation?.name || this.getTargetTypeLabel(record);

        if (target.kind === "nexus-site") {
            const siteRecord = this.resolveSiteRecord(record);
            if (!siteRecord) return false;
            const linkedScene = this.resolveTargetScene(record);
            if (!linkedScene) {
                const confirmed = await confirmDestructiveAction({
                    title: "Delete Site",
                    subject: siteRecord.siteName || name,
                    message: `Delete site <strong>${foundry.utils.escapeHTML(siteRecord.siteName || name)}</strong>?`,
                    warning: "This removes the Site record, journal page, connections, and markers that point to it.",
                    confirmLabel: "Delete Site"
                });
                if (!confirmed) return false;
            }
            return SiteDeletionManager.deleteSiteRecord(siteRecord, {
                parentScene: SiteRecordManager.getParentScene(siteRecord)
            });
        }

        if (target.kind === "nexus-scene") {
            const scene = this.resolveTargetScene(record);
            if (!scene) return false;
            return NexusSceneDeletionCoordinator.deleteSceneBranch(scene, {
                title: "Delete Scene Branch",
                message: `Delete <strong>${foundry.utils.escapeHTML(scene.name)}</strong> and everything below it in the Nexus tree?`,
                confirmLabel: "Delete Branch"
            });
        }

        if (target.kind === "campaign-entity") {
            const entity = this.resolveEntity(record);
            if (!entity) return false;
            const label = this.getTargetTypeLabel(record);
            const entityName = this.#getEntityName(entity, label);
            const confirmed = await confirmDestructiveAction({
                title: `Delete ${label}`,
                subject: entityName,
                message: `Delete ${label.toLowerCase()} <strong>${foundry.utils.escapeHTML(entityName)}</strong>?`,
                warning: "This removes the dossier, connections, and all map markers for this entity.",
                confirmLabel: `Delete ${label}`
            });
            if (!confirmed) return false;
            if (target.entityType === "ship") return CampaignEntityJournalStore.deleteShip(target.entityId);
            if (target.entityType === "faction") return CampaignEntityJournalStore.deleteFaction(target.entityId);
            return CampaignEntityJournalStore.deleteNpc(target.entityId);
        }

        ui.notifications.warn("This marker target cannot be deleted from the map yet.");
        return false;
    }

    static resolveSiteRecord(record) {
        const target = record?.target || {};
        if (target.kind !== "nexus-site") return null;
        const parentScene = target.parentSceneId ? game.scenes.get(target.parentSceneId) || null : null;
        return SiteRecordManager.resolveSite({
            parentScene,
            siteId: target.siteId || null,
            journalEntryId: target.journalEntryId || null,
            pageId: target.pageId || null
        });
    }

    static resolveTargetScene(record) {
        const target = record?.target || {};
        if (target.kind === "nexus-scene") return target.sceneId ? game.scenes.get(target.sceneId) || null : null;
        if (target.kind === "nexus-site") {
            const siteRecord = this.resolveSiteRecord(record);
            const sceneId = siteRecord?.siteSceneId || siteRecord?.linkedSceneId || null;
            return sceneId ? game.scenes.get(sceneId) || null : null;
        }
        return null;
    }

    static resolveEntity(record) {
        const target = record?.target || {};
        if (target.kind !== "campaign-entity" || !target.entityId) return null;
        if (target.entityType === "ship") return CampaignEntityJournalStore.getShip(target.entityId);
        if (target.entityType === "faction") return CampaignEntityJournalStore.getFaction(target.entityId);
        return CampaignEntityJournalStore.getNpc(target.entityId);
    }

    static async openLegacyPending(record) {
        const target = record?.target || {};
        if (target.kind !== "legacy-scifi-pending") return null;
        return LegacySciFiCompatibility.openPendingNode({
            nodeKind: target.nodeKind,
            journalEntryId: target.journalEntryId || null,
            pageId: target.pageId || null,
            parentSceneId: target.parentSceneId || null
        });
    }

    static async #setMarkerLocalVisibility(placeable, record, value) {
        const doc = placeable?.document || placeable || null;
        const scene = doc?.parent || canvas.scene;
        if (!scene || !doc?.id) return null;
        const normalized = this.#normalizeVisibility(value);
        const refs = await NexusMarkerService.getMarkerRefsForTarget(record.target);
        const refsByScene = new Map();
        if (!refs.some(ref => ref.markerId === record.markerId)) {
            refs.push({
                markerId: record.markerId,
                sceneId: scene.id,
                documentId: doc.id,
                documentName: doc.documentName || "Tile"
            });
        }
        for (const ref of refs) {
            if (!ref.sceneId || !ref.documentId) continue;
            const bucket = refsByScene.get(ref.sceneId) || [];
            bucket.push(ref);
            refsByScene.set(ref.sceneId, bucket);
        }

        for (const [sceneId, sceneRefs] of refsByScene.entries()) {
            const targetScene = game.scenes.get(sceneId);
            if (!targetScene) continue;
            const updates = [];
            for (const ref of sceneRefs) {
                const tile = targetScene.tiles?.get(ref.documentId);
                const marker = NexusMarkerService.getMarkerRecord(tile);
                if (!tile || !marker) continue;
                updates.push({
                    _id: tile.id,
                    [`flags.${MODULE_ID}.marker`]: {
                        ...marker,
                        presentation: {
                            ...(marker.presentation || {}),
                            playerVisibility: normalized
                        }
                    }
                });
            }
            if (updates.length) {
                await targetScene.updateEmbeddedDocuments("Tile", updates, { [MODULE_ID]: { visualOnly: true } });
                await SiteSceneVisibilityManager.applySceneVisibility(targetScene);
            }
        }
        return normalized;
    }

    static #normalizeVisibility(value = "inherit") {
        return NexusPlayerSceneAccess.normalizeNexusVisibilityOverride(value);
    }

    static #getEntityName(entity, fallback = "Entity") {
        const config = EntityPlacementTab.getConfig(entity?.type);
        if (config?.model?.getName) return config.model.getName(entity);
        return entity?.name || entity?.displayName || fallback;
    }
}
