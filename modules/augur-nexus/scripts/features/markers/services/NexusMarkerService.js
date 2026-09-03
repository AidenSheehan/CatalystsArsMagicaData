import { addConnection, getSceneConnectionTarget } from "../../../api/connections.js";
import { getTopLeftAnchorCompensatedPosition, getTopLeftAnchorVisualPosition, normalizeTileCreateData } from "../../../api/tiles.js";
import { PlacePreview } from "../../connections/applications/PlacePreview.js";
import { ConnectionTargetResolver } from "../../connections/services/ConnectionTargetResolver.js";
import { CampaignEntityJournalStore } from "../../campaign-entities/services/CampaignEntityJournalStore.js";
import { CampaignEntityVisibilityManager } from "../../campaign-entities/services/CampaignEntityVisibilityManager.js";
import { EntityPlacementTab } from "../../site/applications/tabs/EntityPlacementTab.js";
import { SiteIconGeometry } from "../../site/services/SiteIconGeometry.js";
import { DEFAULT_SITE_ICON_SRC } from "../../site/services/SiteIconDefaults.js";
import { SiteLabelManager } from "../../site/services/SiteLabelManager.js";
import { SITE_MARKER_SORT } from "../../site/services/SiteLayering.js";
import { SiteMapManager } from "../../site/services/SiteMapManager.js";
import { SiteRecordManager } from "../../site/services/SiteRecordManager.js";
import { LegacySciFiCompatibility } from "../../../support/compatibility/LegacySciFiCompatibility.js";

const MODULE_ID = "augur-nexus";
const FALLBACK_ICON = "icons/svg/mystery-man.svg";
const SUPPORTED_ENTITY_TYPES = new Set(["npc", "ship", "faction"]);

export class NexusMarkerService {
    static DEFAULT_ICON_SIZE = 100;
    static DEFAULT_LABEL_FONT_SIZE = 22;
    static DEFAULT_LABEL_FONT_FAMILY = "Signika";
    static #dragState = null;
    static #ghostContainer = null;
    static #ghostSignature = "";
    static #lastGhostPosition = null;
    static #selectedPlaceableId = null;

    static async createMarker(target = {}, position = {}, options = {}) {
        const resolved = await this.#resolveTargetForCreate(target, options);
        if (!resolved) return null;
        return this.#createMarkerForResolvedTarget(resolved, position, options);
    }

    static async createEntityMarker(entity = {}, position = {}, options = {}) {
        if (!SUPPORTED_ENTITY_TYPES.has(entity?.type) || !entity?.id) return null;
        return this.createMarker({
            kind: "campaign-entity",
            entityType: entity.type,
            entityId: entity.id
        }, position, { ...options, entity });
    }

    static async createSiteMarker(siteRecord = {}, position = {}, options = {}) {
        const parentScene = SiteRecordManager.getParentScene(siteRecord);
        const record = parentScene ? SiteRecordManager.normalizeRecord(siteRecord, { parentScene }) : SiteRecordManager.normalizeRecord(siteRecord);
        if (!record?.parentSceneId || !record?.siteId) return null;
        return this.createMarker({
            kind: "nexus-site",
            parentSceneId: record.parentSceneId,
            siteId: record.siteId,
            journalEntryId: record.journalEntryId || "",
            pageId: record.journalPageId || ""
        }, position, {
            ...options,
            scene: options.scene || parentScene,
            markerKind: options.markerKind || "site-placement",
            canOrbit: options.canOrbit !== false,
            iconSize: options.iconSize || record.iconSize || this.DEFAULT_ICON_SIZE,
            rotation: options.rotation ?? record.rotation ?? 0,
            showLabel: options.showLabel ?? record.showLabel,
            labelFontSize: options.labelFontSize || record.labelFontSize || this.DEFAULT_LABEL_FONT_SIZE,
            labelFontFamily: options.labelFontFamily || record.labelFontFamily || this.DEFAULT_LABEL_FONT_FAMILY,
            labelColor: options.labelColor || record.siteLabelColor || record.siteColor || "#f4e6cf",
            snapToGrid: !!options.snapToGrid
        });
    }

    static async createPlacement(position, type) {
        const result = await EntityPlacementTab.createEntityForPlacement(type);
        const entity = result?.entity || null;
        if (!entity) return null;
        return this.createEntityMarker(entity, position, this.#getStyle(type));
    }

    static async placeExistingEntity(entity = {}, position = {}, options = {}) {
        return this.createEntityMarker(entity, position, options);
    }

    static async createReferenceMarkerFromBrowserPayload(payload = {}, position = {}, options = {}) {
        if (!game.user?.isGM) {
            ui.notifications.warn("Only the GM can place Nexus markers.");
            return null;
        }

        const target = this.#targetFromBrowserPayload(payload);
        if (!target) {
            ui.notifications.warn("That Nexus item cannot be placed as a marker.");
            return null;
        }
        return this.createMarker(target, position, options);
    }

    static async handleCanvasClick(position, type, { shiftKey = false } = {}) {
        const marker = this.getMarkerAtPosition(position);
        if (shiftKey) {
            if (marker) await this.deleteMarker(marker);
            return;
        }
        if (marker) return;
        await this.createPlacement(position, type);
    }

    static async syncGhost(position, type, { shiftKey = false } = {}) {
        this.#lastGhostPosition = position ? { x: position.x, y: position.y } : this.#lastGhostPosition;
        if (shiftKey) {
            this.clearGhost();
            return;
        }

        const preview = this.#getEntityPreview(type);
        if (!preview) {
            this.clearGhost();
            return;
        }

        const signature = [
            type,
            preview.iconSrc,
            preview.name,
            preview.labelColor,
            preview.iconSize,
            preview.rotation,
            preview.showLabel,
            preview.labelFontSize,
            preview.labelFontFamily
        ].join("|");
        if (!this.#ghostContainer || this.#ghostSignature !== signature) {
            await this.#ensureGhostContainer(preview, signature);
        }

        if (!this.#ghostContainer) return;
        this.#ghostContainer.position.set(Math.round(position.x), Math.round(position.y));
        this.#ghostContainer.rotation = 0;
        this.#ghostContainer.visible = true;
    }

    static clearGhost() {
        if (this.#ghostContainer) this.#ghostContainer.visible = false;
    }

    static get hasVisibleGhost() {
        return !!this.#ghostContainer?.visible;
    }

    static resetGhost() {
        if (this.#ghostContainer?.parent) this.#ghostContainer.parent.removeChild(this.#ghostContainer);
        this.#ghostContainer?.destroy({ children: true });
        this.#ghostContainer = null;
        this.#ghostSignature = "";
        this.#lastGhostPosition = null;
    }

    static refreshGhost(type) {
        if (!this.#lastGhostPosition || !this.#ghostContainer) return;
        this.#ghostSignature = "";
        this.syncGhost(this.#lastGhostPosition, type).catch(err => {
            console.warn("Augur: Nexus | Failed to refresh marker ghost.", err);
        });
    }

    static getMarkerRecord(placeableOrDocument) {
        const doc = placeableOrDocument?.document || placeableOrDocument || null;
        const record = doc?.flags?.[MODULE_ID]?.marker || null;
        if (!record?.markerId || !record?.target?.kind) return null;
        return this.#normalizeMarkerRecord({
            ...record,
            parentSceneId: record.parentSceneId || doc.parent?.id || canvas.scene?.id || null,
            placeableDocumentName: record.placeableDocumentName || doc.documentName || "Tile",
            placement: {
                ...(record.placement || {}),
                iconSize: Number(record.placement?.iconSize || doc?.height || this.DEFAULT_ICON_SIZE),
                iconAspectRatio: record.placement?.iconAspectRatio || SiteIconGeometry.aspectRatioFromDocument(doc, 1),
                rotation: record.placement?.rotation ?? doc?.rotation ?? 0
            }
        });
    }

    static getMarkerAtPosition(position) {
        return canvas.tiles?.placeables?.filter(tile => {
            const record = this.getMarkerRecord(tile.document);
            if (!record) return false;
            const bounds = this.#getTileBounds(tile);
            if (!bounds) return false;
            return position.x >= bounds.x
                && position.x <= bounds.x + bounds.width
                && position.y >= bounds.y
                && position.y <= bounds.y + bounds.height;
        }).sort((a, b) => Number(b.document.sort ?? 0) - Number(a.document.sort ?? 0))[0] || null;
    }

    static async findMarkerForTarget(target = {}, { scene = canvas.scene, includeLegacy = true } = {}) {
        const targetScene = scene || canvas.scene || null;
        if (!targetScene) return null;

        const refs = await this.#getOwnerMarkerRefs(target);
        for (const ref of refs) {
            if (ref.sceneId !== targetScene.id) continue;
            const tile = targetScene.tiles?.get(ref.documentId) || null;
            if (tile && this.#targetMatches(this.getMarkerRecord(tile)?.target, target)) return tile;
        }

        const tile = targetScene.tiles?.contents?.find(candidate => this.#targetMatches(this.getMarkerRecord(candidate)?.target, target)) || null;
        if (tile) return tile;

        if (!includeLegacy || target.kind !== "nexus-site") return null;
        return SiteRecordManager.findSitePlaceable(targetScene, target.siteId) || null;
    }

    static async convertLegacySitePlaceableToMarker(placeable, { scene = canvas.scene } = {}) {
        const doc = placeable?.document || placeable || null;
        const parentScene = scene || doc?.parent || canvas.scene || null;
        const flags = doc?.flags?.[MODULE_ID] || {};
        if (!parentScene || !doc?.id || !flags.site || !flags.siteId) return null;
        if ((doc.documentName || "Tile") !== "Tile") return null;

        const record = SiteRecordManager.resolveSite({ parentScene, placeable: doc });
        if (!record?.siteId) return null;
        const markerId = foundry.utils.randomID();
        const markerRecord = this.#normalizeMarkerRecord({
            markerId,
            markerKind: "site-placement",
            target: {
                kind: "nexus-site",
                parentSceneId: record.parentSceneId,
                siteId: record.siteId,
                journalEntryId: record.journalEntryId || "",
                pageId: record.journalPageId || ""
            },
            presentation: {
                name: record.siteName || "Site",
                iconSrc: record.siteIconSrc || doc.texture?.src || FALLBACK_ICON,
                iconTint: record.siteColor || doc.texture?.tint || "#ffffff",
                labelColor: record.siteLabelColor || record.siteColor || "#f4e6cf",
                labelFontSize: record.labelFontSize || this.DEFAULT_LABEL_FONT_SIZE,
                labelFontFamily: record.labelFontFamily || this.DEFAULT_LABEL_FONT_FAMILY,
                showLabel: record.showLabel !== false
            },
            behavior: {
                opens: "site",
                canOrbit: true,
                canConvertToToken: false,
                createsSceneConnection: false
            },
            placement: {
                iconSize: Number(doc.height || record.iconSize || this.DEFAULT_ICON_SIZE),
                iconAspectRatio: SiteIconGeometry.aspectRatioFromDocument(doc, record.siteIconAspectRatio || 1),
                rotation: doc.rotation ?? record.rotation ?? 0,
                snapToGrid: false
            },
            label: { id: record.labelId || "", role: "name" },
            parentSceneId: parentScene.id,
            placeableDocumentName: "Tile"
        });

        const label = record.labelId
            ? parentScene.drawings?.get(record.labelId) || null
            : SiteLabelManager.findLabelForTile(parentScene, doc);
        const labelId = label?.id || "";
        if (labelId) markerRecord.label.id = labelId;

        const [updated] = await parentScene.updateEmbeddedDocuments("Tile", [{
            _id: doc.id,
            [`flags.${MODULE_ID}`]: { marker: markerRecord }
        }], { diff: false, [MODULE_ID]: { visualOnly: true } });
        const tile = updated || parentScene.tiles.get(doc.id) || doc;

        if (label) {
            await parentScene.updateEmbeddedDocuments("Drawing", [{
                _id: label.id,
                [`flags.${MODULE_ID}`]: {
                    markerLabel: true,
                    markerId,
                    ownerTileId: tile.id,
                    target: markerRecord.target,
                    labelRole: "name",
                    offset: label.flags?.[MODULE_ID]?.offset ?? 8
                }
            }], { diff: false, [MODULE_ID]: { visualOnly: true } });
        }

        const nextRecord = SiteRecordManager.normalizeRecord({
            ...record,
            placeableId: null,
            placeableDocumentName: "Tile",
            labelId: null
        }, { parentScene });
        await SiteRecordManager.upsertSceneRecord(parentScene, nextRecord);
        await this.addOwnerMarkerRef(markerRecord.target, this.#buildOwnerRef(markerRecord, tile, label));
        await this.syncMarkersForTarget(markerRecord.target);
        return tile;
    }

    static selectMarker(placeable) {
        const doc = placeable?.document || placeable || null;
        this.#selectedPlaceableId = this.getMarkerRecord(doc) ? doc?.id || null : null;
        Hooks.callAll("augurNexusSiteEditorSelectionChanged");
        return this.getSelectedPlaceable();
    }

    static selectMarkerAtPosition(position) {
        const placeable = this.getMarkerAtPosition(position);
        this.selectMarker(placeable);
        return placeable || null;
    }

    static getSelectedPlaceable() {
        if (!this.#selectedPlaceableId) return null;
        return canvas.tiles?.placeables?.find(tile => tile.document?.id === this.#selectedPlaceableId)
            || canvas.scene?.tiles?.get(this.#selectedPlaceableId)
            || null;
    }

    static getSelectedMarkerState() {
        const placeable = this.getSelectedPlaceable();
        const doc = placeable?.document || placeable || null;
        const record = this.getMarkerRecord(doc);
        if (!record) return null;
        const siteRecord = record.target.kind === "nexus-site"
            ? SiteRecordManager.resolveSite({
                parentScene: record.target.parentSceneId ? game.scenes.get(record.target.parentSceneId) || null : null,
                siteId: record.target.siteId,
                journalEntryId: record.target.journalEntryId || null,
                pageId: record.target.pageId || null
            })
            : null;
        const config = record.target.kind === "campaign-entity"
            ? EntityPlacementTab.getConfig(record.target.entityType)
            : null;
        return {
            ...record,
            noteId: doc.id,
            label: config?.label || this.#markerKindLabel(record),
            icon: config?.icon || this.#markerIconClass(record),
            iconSrc: record.target.kind === "nexus-site"
                ? this.#resolveSiteIconSrc(record.presentation.iconSrc, doc.texture?.src)
                : (record.presentation.iconSrc || doc.texture?.src || FALLBACK_ICON),
            name: record.presentation.name || "Marker",
            presentationOverrides: foundry.utils.deepClone(record.presentation.overrides || {}),
            siteId: siteRecord?.siteId || null,
            siteName: siteRecord?.siteName || record.presentation.name || "Site",
            siteGenre: siteRecord?.siteGenre || "fantasy",
            siteIconRole: siteRecord?.siteIconRole || "landmark",
            siteIconRoleLabel: siteRecord?.siteIconRoleLabel || "Landmark",
            siteIcon: siteRecord?.siteIcon || null,
            siteIconSrc: siteRecord?.siteIconSrc || record.presentation.iconSrc || "",
            iconColor: record.presentation.iconTint || "#ffffff",
            labelColor: record.presentation.labelColor || "#f4e6cf",
            iconSize: Number(record.placement.iconSize || doc.height || this.DEFAULT_ICON_SIZE),
            labelFontSize: this.#clampLabelFontSize(record.presentation.labelFontSize || this.DEFAULT_LABEL_FONT_SIZE),
            labelFontFamily: this.#resolveLabelFontFamily(record.presentation.labelFontFamily),
            rotation: this.#normalizeRotation(record.placement.rotation ?? doc.rotation ?? 0),
            showLabel: record.presentation.showLabel !== false,
            snapToGrid: !!record.placement.snapToGrid,
            supportsSnapToGrid: true,
            supportsLocalPresentation: true,
            canResetMarkerName: record.presentation.overrides?.name === true,
            canResetMarkerIcon: record.presentation.overrides?.iconSrc === true,
            canResetMarkerIconColor: record.presentation.overrides?.iconTint === true
        };
    }

    static clearSelection() {
        if (!this.#selectedPlaceableId) return;
        this.#selectedPlaceableId = null;
        Hooks.callAll("augurNexusSiteEditorSelectionChanged");
    }

    static async updateSelectedMarker(changes = {}) {
        const scene = canvas.scene;
        const placeable = this.getSelectedPlaceable();
        const doc = placeable?.document || placeable || null;
        let current = this.getSelectedMarkerState();
        if (!scene || !doc?.id || !current) return false;
        const presentation = await this.#resolveLocalPresentationChanges(current, changes);
        const next = { ...current, ...changes };
        const iconSrc = presentation.iconSrc || current.iconSrc || FALLBACK_ICON;
        const iconTint = presentation.iconTint || current.iconColor || "#ffffff";
        const iconSize = this.#clampIconSize(next.iconSize || current.iconSize);
        const rotation = this.#normalizeRotation(next.rotation ?? current.rotation ?? doc.rotation ?? 0);
        const labelFontSize = this.#clampLabelFontSize(next.labelFontSize || current.labelFontSize);
        const labelFontFamily = this.#resolveLabelFontFamily(next.labelFontFamily || current.labelFontFamily);
        const labelColor = next.labelColor || current.labelColor || "#f4e6cf";
        const showLabel = next.showLabel !== false;
        const dimensions = await SiteIconGeometry.resolveDimensions(iconSrc, iconSize, current.placement?.iconAspectRatio || 1);
        const center = this.#getTileCenter(doc);
        const record = this.#normalizeMarkerRecord({
            ...current,
            presentation: {
                ...current.presentation,
                ...presentation,
                iconSrc,
                iconTint,
                labelColor,
                showLabel,
                labelFontSize,
                labelFontFamily
            },
            placement: {
                ...current.placement,
                iconSize: dimensions.height,
                iconAspectRatio: dimensions.aspectRatio,
                rotation,
                snapToGrid: !!next.snapToGrid
            }
        });

        const topLeft = getTopLeftAnchorCompensatedPosition({
            x: center.x - (dimensions.width / 2),
            y: center.y - (dimensions.height / 2),
            width: dimensions.width,
            height: dimensions.height,
            rotation
        });
        const [updated] = await scene.updateEmbeddedDocuments(doc.documentName || "Tile", [{
            _id: doc.id,
            x: Math.round(topLeft.x),
            y: Math.round(topLeft.y),
            width: dimensions.width,
            height: dimensions.height,
            rotation,
            texture: { src: iconSrc, tint: iconTint },
            [`flags.${MODULE_ID}.marker`]: record
        }], { [MODULE_ID]: { visualOnly: true } });

        const tile = updated || scene.tiles.get(doc.id) || doc;
        const label = this.findLabelForTile(scene, tile);
        if (showLabel) {
            const nextLabel = label
                ? await this.#updateLabel(scene, label, tile, record)
                : await this.#createLabel(scene, tile, record);
            if (nextLabel && record.label.id !== nextLabel.id) {
                await this.#updateMarkerLabelId(scene, tile, nextLabel.id);
            }
        } else if (label) {
            await scene.deleteEmbeddedDocuments("Drawing", [label.id]);
            await this.#updateMarkerLabelId(scene, tile, "");
        }

        Hooks.callAll("augurNexusSiteEditorSelectionChanged");
        return true;
    }

    static beginDrag(position, { placeableId = null } = {}) {
        const placeable = this.getMarkerAtPosition(position);
        if (!placeable) return false;
        const doc = placeable.document || placeable;
        if (placeableId && doc.id !== placeableId) return false;
        const label = this.findLabelForTile(canvas.scene, doc);
        const center = this.#getTileCenter(doc);
        const width = Number(doc.width || 0);
        const height = Number(doc.height || 0);
        const rotation = this.#normalizeRotation(doc.rotation || 0);
        this.#dragState = {
            placeable,
            label,
            origin: { x: doc.x, y: doc.y },
            sizeOrigin: { width, height, rotation },
            labelOrigin: label ? { x: label.x, y: label.y } : null,
            center,
            dimensions: {
                width,
                height,
                aspectRatio: SiteIconGeometry.aspectRatioFromDocument(doc, 1)
            },
            rotation
        };
        return true;
    }

    static updateDrag(position) {
        if (!this.#dragState?.placeable) return false;
        const placeable = this.#dragState.placeable;
        const doc = placeable.document || placeable;
        const record = this.getMarkerRecord(doc);
        const dragPosition = this.#getPlacementPosition(position, record.placement);
        this.#dragState.center = { x: dragPosition.x, y: dragPosition.y };
        doc.updateSource(this.#buildTileUpdateFromDragState(this.#dragState));
        placeable.refresh?.();

        if (this.#dragState.label) this.#applyLabelSourceSync(this.#dragState.label, this.#buildLabelSync(this.#dragState.label, doc, record));
        return true;
    }

    static async endDrag() {
        if (!this.#dragState?.placeable) return false;
        const state = this.#dragState;
        const placeable = state.placeable;
        const doc = placeable.document || placeable;
        const storedLabel = state.label;
        this.#dragState = null;
        const record = this.getMarkerRecord(doc);
        if (!record) return false;
        const dimensions = state.dimensions || {
            width: Number(doc.width || 0),
            height: Number(doc.height || this.DEFAULT_ICON_SIZE),
            aspectRatio: SiteIconGeometry.aspectRatioFromDocument(doc, 1)
        };
        const rotation = this.#normalizeRotation(state.rotation ?? doc.rotation ?? 0);
        const nextRecord = this.#normalizeMarkerRecord({
            ...record,
            placement: {
                ...record.placement,
                iconSize: Number(dimensions.height || this.DEFAULT_ICON_SIZE),
                rotation,
                iconAspectRatio: Number(dimensions.aspectRatio || SiteIconGeometry.aspectRatioFromDocument(doc, 1))
            }
        });
        const [updatedDoc] = await canvas.scene.updateEmbeddedDocuments(
            doc.documentName || "Tile",
            [{
                _id: doc.id,
                ...this.#buildTileUpdateFromDragState({ ...state, dimensions, rotation }),
                [`flags.${MODULE_ID}.marker`]: nextRecord
            }],
            { diff: false, [MODULE_ID]: { visualOnly: true } }
        );
        const tile = updatedDoc || canvas.scene.tiles.get(doc.id) || doc;
        const label = this.findLabelForTile(canvas.scene, tile) || storedLabel;
        if (label) await this.#updateLabel(canvas.scene, label, tile, nextRecord, { force: true });
        Hooks.callAll("augurNexusSiteEditorSelectionChanged");
        return true;
    }

    static cancelDrag() {
        if (!this.#dragState?.placeable) return false;
        const { placeable, origin, sizeOrigin, label, labelOrigin } = this.#dragState;
        const doc = placeable.document || placeable;
        doc.updateSource({ ...origin, ...(sizeOrigin || {}) });
        placeable.refresh?.();
        if (label && labelOrigin) label.updateSource(labelOrigin);
        this.#dragState = null;
        return true;
    }

    static get isDragging() {
        return !!this.#dragState?.placeable;
    }

    static transformActiveGesture(type, { rotationDelta = 0, iconSizeDelta = 0, resetIconSize = false } = {}) {
        if (this.#dragState?.placeable) return this.#transformDrag({ rotationDelta, iconSizeDelta, resetIconSize });
        if (type) EntityPlacementTab.transformPlacementStyle(type, { rotationDelta, iconSizeDelta, resetIconSize });
        return true;
    }

    static async openMarker(placeable) {
        const record = this.getMarkerRecord(placeable);
        if (!record) return null;
        const target = record.target || {};

        if (target.kind === "campaign-entity") {
            const config = EntityPlacementTab.getConfig(target.entityType);
            if (!config) return null;
            return config.open(target.entityId);
        }

        if (target.kind === "nexus-site") {
            return SiteMapManager.openSite({
                parentSceneId: target.parentSceneId,
                siteId: target.siteId,
                journalEntryId: target.journalEntryId || null,
                pageId: target.pageId || null
            });
        }

        if (target.kind === "legacy-scifi-pending") {
            return LegacySciFiCompatibility.openPendingNode({
                nodeKind: target.nodeKind,
                journalEntryId: target.journalEntryId || null,
                pageId: target.pageId || null,
                parentSceneId: target.parentSceneId || null
            });
        }

        if (target.kind === "nexus-scene") {
            const scene = target.sceneId ? game.scenes.get(target.sceneId) || null : null;
            if (!scene) return this.#confirmDeleteOrphan(placeable);
            const openedSciFiPreview = await LegacySciFiCompatibility.openPreview(scene);
            if (openedSciFiPreview) return scene;
            PlacePreview.show({ scene });
            return scene;
        }

        return this.#confirmDeleteOrphan(placeable);
    }

    static async previewMarker(placeable) {
        const record = this.getMarkerRecord(placeable);
        if (!record) return null;
        const target = record.target || {};
        if (target.kind === "nexus-scene") {
            const scene = target.sceneId ? game.scenes.get(target.sceneId) || null : null;
            if (!scene) return this.#confirmDeleteOrphan(placeable);
            const openedSciFiPreview = await LegacySciFiCompatibility.openPreview(scene);
            if (openedSciFiPreview) return scene;
            return PlacePreview.show({ scene });
        }
        if (target.kind === "nexus-site") {
            return PlacePreview.show({
                target: {
                    kind: "nexus-site",
                    parentSceneId: target.parentSceneId,
                    siteId: target.siteId
                },
                presentation: {
                    iconSrc: record.presentation.iconSrc || "",
                    name: record.presentation.name || "Site"
                }
            });
        }
        return this.openMarker(placeable);
    }

    static async deleteMarker(placeable, { notify = true, removeOwnerRef = true, scene = canvas.scene } = {}) {
        const doc = placeable?.document || placeable || null;
        const record = this.getMarkerRecord(doc);
        const parentScene = scene || (record?.parentSceneId ? game.scenes.get(record.parentSceneId) : null);
        if (!parentScene || !doc?.id || !record) return false;

        const label = record.label?.id
            ? parentScene.drawings?.get(record.label.id) || null
            : this.findLabelForTile(parentScene, doc);
        if (label) await parentScene.deleteEmbeddedDocuments("Drawing", [label.id]);
        await parentScene.deleteEmbeddedDocuments(doc.documentName || "Tile", [doc.id]);
        if (removeOwnerRef) await this.removeOwnerMarkerRef(record.target, record.markerId);
        if (this.#selectedPlaceableId === doc.id) this.clearSelection();
        if (notify) ui.notifications.info(`Deleted ${record.presentation.name || "marker"}.`);
        return true;
    }

    static async syncMarkersForTarget(targetOrEntity = {}) {
        const target = targetOrEntity?.type && targetOrEntity?.id
            ? { kind: "campaign-entity", entityType: targetOrEntity.type, entityId: targetOrEntity.id, entity: targetOrEntity }
            : targetOrEntity;
        const ownerRefs = await this.#getOwnerMarkerRefs(target);
        if (!ownerRefs.length) return false;

        let changed = false;
        for (const ref of ownerRefs) {
            const scene = game.scenes.get(ref.sceneId);
            const tile = scene?.tiles?.get(ref.documentId);
            if (!scene || !tile) {
                await this.removeOwnerMarkerRef(target, ref.markerId);
                continue;
            }
            const record = this.getMarkerRecord(tile);
            if (!record) continue;
            const resolved = await this.#resolveTargetForCreate(record.target, { entity: target.entity || targetOrEntity });
            if (!resolved) continue;
            const overrides = record.presentation?.overrides || {};
            const nextRecord = this.#normalizeMarkerRecord({
                ...record,
                target: resolved.target,
                presentation: {
                    ...record.presentation,
                    name: overrides.name === true ? record.presentation.name : (resolved.presentation.name || record.presentation.name),
                    iconSrc: overrides.iconSrc === true ? record.presentation.iconSrc : (resolved.presentation.iconSrc || record.presentation.iconSrc),
                    iconTint: overrides.iconTint === true ? record.presentation.iconTint : (resolved.presentation.iconTint || record.presentation.iconTint)
                }
            });
            const iconSrc = nextRecord.presentation.iconSrc || FALLBACK_ICON;
            const dimensions = await SiteIconGeometry.resolveDimensions(iconSrc, nextRecord.placement.iconSize, nextRecord.placement.iconAspectRatio);
            const center = this.#getTileCenter(tile);
            const topLeft = getTopLeftAnchorCompensatedPosition({
                x: center.x - (dimensions.width / 2),
                y: center.y - (dimensions.height / 2),
                width: dimensions.width,
                height: dimensions.height,
                rotation: nextRecord.placement.rotation
            });
            const [updated] = await scene.updateEmbeddedDocuments("Tile", [{
                _id: tile.id,
                x: Math.round(topLeft.x),
                y: Math.round(topLeft.y),
                width: dimensions.width,
                height: dimensions.height,
                rotation: nextRecord.placement.rotation,
                texture: { src: iconSrc, tint: nextRecord.presentation.iconTint || "#ffffff" },
                [`flags.${MODULE_ID}.marker`]: {
                    ...nextRecord,
                    placement: {
                        ...nextRecord.placement,
                        iconSize: dimensions.height,
                        iconAspectRatio: dimensions.aspectRatio
                    }
                }
            }], { diff: false, [MODULE_ID]: { visualOnly: true } });
            const updatedTile = updated || scene.tiles.get(tile.id) || tile;
            const label = this.findLabelForTile(scene, updatedTile);
            if (label && nextRecord.presentation.showLabel !== false) await this.#updateLabel(scene, label, updatedTile, nextRecord, { force: true });
            changed = true;
        }
        if (changed) Hooks.callAll("augurNexusSiteEditorSelectionChanged");
        return changed;
    }

    static async syncSiteMarkers(siteRecord = {}) {
        const parentScene = SiteRecordManager.getParentScene(siteRecord);
        const record = parentScene ? SiteRecordManager.normalizeRecord(siteRecord, { parentScene }) : SiteRecordManager.normalizeRecord(siteRecord);
        if (!record?.parentSceneId || !record?.siteId) return false;
        return this.syncMarkersForTarget({
            kind: "nexus-site",
            parentSceneId: record.parentSceneId,
            siteId: record.siteId,
            journalEntryId: record.journalEntryId || "",
            pageId: record.journalPageId || ""
        });
    }

    static async deleteMarkersForTarget(target = {}) {
        const refs = await this.#getOwnerMarkerRefs(target);
        let deleted = false;
        for (const ref of refs) {
            const scene = game.scenes.get(ref.sceneId);
            const tile = scene?.tiles?.get(ref.documentId);
            if (!scene || !tile) {
                await this.removeOwnerMarkerRef(target, ref.markerId);
                continue;
            }
            await this.deleteMarker(tile, { notify: false, removeOwnerRef: false, scene });
            deleted = true;
        }
        if (refs.length) await this.#setOwnerMarkerRefs(target, []);
        return deleted;
    }

    static async removeMarkerRefsForSceneContents(scene) {
        if (!scene) return false;
        const records = scene.tiles?.contents
            ?.map(tile => this.getMarkerRecord(tile))
            .filter(Boolean) || [];
        for (const record of records) {
            await this.removeOwnerMarkerRef(record.target, record.markerId);
        }
        return !!records.length;
    }

    static async getMarkerRefsForTarget(targetOrEntity = {}) {
        const target = targetOrEntity?.type && targetOrEntity?.id
            ? { kind: "campaign-entity", entityType: targetOrEntity.type, entityId: targetOrEntity.id, entity: targetOrEntity }
            : targetOrEntity;
        return this.#getOwnerMarkerRefs(target);
    }

    static async addOwnerMarkerRef(target = {}, ref = {}) {
        const refs = await this.#getOwnerMarkerRefs(target);
        const next = refs.filter(existing => existing.markerId !== ref.markerId);
        next.push(this.#normalizeOwnerRef(ref));
        return this.#setOwnerMarkerRefs(target, next);
    }

    static async removeOwnerMarkerRef(target = {}, markerId = "") {
        const refs = await this.#getOwnerMarkerRefs(target);
        const next = refs.filter(ref => ref.markerId !== markerId);
        if (next.length === refs.length) return false;
        await this.#setOwnerMarkerRefs(target, next);
        return true;
    }

    static findLabelForTile(scene, tileOrDocument) {
        const doc = tileOrDocument?.document || tileOrDocument || null;
        const record = this.getMarkerRecord(doc);
        if (!scene || !doc || !record) return null;
        if (record.label?.id) {
            const label = scene.drawings?.get(record.label.id) || null;
            if (label) return label;
        }
        return scene.drawings?.contents?.find(drawing => {
            const flags = drawing.flags?.[MODULE_ID] || {};
            return flags.markerLabel && (flags.ownerTileId === doc.id || flags.markerId === record.markerId);
        }) || null;
    }

    static getPlacementImage(config, entity) {
        return this.#getPlacementImage(config, entity);
    }

    static async #createMarkerForResolvedTarget(resolved, position, options = {}) {
        const scene = options.scene || canvas.scene;
        if (!scene) return null;

        const style = this.#styleFromOptions(options, resolved);
        const markerId = foundry.utils.randomID();
        const placement = this.#getPlacementPosition(position, style);
        const dimensions = await SiteIconGeometry.resolveDimensions(resolved.presentation.iconSrc || FALLBACK_ICON, style.iconSize);
        const rotation = this.#normalizeRotation(style.rotation || 0);
        const topLeft = getTopLeftAnchorCompensatedPosition({
            x: placement.x - (dimensions.width / 2),
            y: placement.y - (dimensions.height / 2),
            width: dimensions.width,
            height: dimensions.height,
            rotation
        });
        const record = this.#normalizeMarkerRecord({
            markerId,
            markerKind: resolved.markerKind,
            target: resolved.target,
            presentation: {
                ...resolved.presentation,
                labelColor: style.labelColor || resolved.presentation.labelColor,
                showLabel: style.showLabel,
                labelFontSize: style.labelFontSize,
                labelFontFamily: style.labelFontFamily
            },
            behavior: resolved.behavior,
            placement: {
                iconSize: dimensions.height,
                iconAspectRatio: dimensions.aspectRatio,
                rotation,
                snapToGrid: style.snapToGrid
            },
            label: { id: "", role: "name" },
            parentSceneId: scene.id,
            placeableDocumentName: "Tile"
        });
        const initiallyHidden = this.#shouldCreateMarkerHidden(resolved);

        const [tile] = await scene.createEmbeddedDocuments("Tile", [normalizeTileCreateData({
            x: Math.round(topLeft.x),
            y: Math.round(topLeft.y),
            width: dimensions.width,
            height: dimensions.height,
            rotation,
            texture: {
                src: record.presentation.iconSrc || FALLBACK_ICON,
                tint: record.presentation.iconTint || "#ffffff"
            },
            sort: SITE_MARKER_SORT,
            hidden: initiallyHidden,
            flags: { [MODULE_ID]: { marker: record } }
        })]);
        if (!tile) {
            ui.notifications.error("Failed to place Nexus marker.");
            return null;
        }

        const label = record.presentation.showLabel === false ? null : await this.#createLabel(scene, tile, record);
        if (label) {
            await this.#updateMarkerLabelId(scene, tile, label.id);
            record.label.id = label.id;
        }

        await this.addOwnerMarkerRef(record.target, this.#buildOwnerRef(record, tile, label));
        if (initiallyHidden) {
            const { SiteSceneVisibilityManager } = await import("../../site/services/SiteSceneVisibilityManager.js");
            await SiteSceneVisibilityManager.applySceneVisibility(scene);
        }
        if (record.behavior.createsSceneConnection && resolved.entity && game.settings.get(MODULE_ID, "entityPlacementCreatesSceneConnections") !== false) {
            await this.#ensureSceneEntityConnection(scene, resolved.entity, resolved.target.entityType);
        }

        Hooks.callAll("augurNexusLineageChanged");
        if (resolved.entity) Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "markerCreated", entity: resolved.entity });
        ui.notifications.info(`Placed ${record.presentation.name || "marker"}.`);
        return tile;
    }

    static #shouldCreateMarkerHidden(resolved = {}) {
        if (resolved.target?.kind !== "campaign-entity" || !resolved.entity) return false;
        return !CampaignEntityVisibilityManager.isVisibleToPlayers(resolved.entity);
    }

    static async #resolveLocalPresentationChanges(current = {}, changes = {}) {
        const presentation = foundry.utils.deepClone(current.presentation || {});
        const overrides = {
            name: presentation.overrides?.name === true,
            iconSrc: presentation.overrides?.iconSrc === true,
            iconTint: presentation.overrides?.iconTint === true
        };
        const defaults = (changes.resetMarkerName || changes.resetMarkerIcon || changes.resetMarkerIconColor)
            ? await this.#getTargetPresentationDefaults(current)
            : null;

        if (Object.hasOwn(changes, "markerName")) {
            presentation.name = String(changes.markerName || "").trim() || "Marker";
            overrides.name = true;
        }
        if (changes.resetMarkerName) {
            presentation.name = defaults?.name || presentation.name || "Marker";
            overrides.name = false;
        }

        if (Object.hasOwn(changes, "markerIconSrc")) {
            presentation.iconSrc = current.target?.kind === "nexus-site"
                ? this.#resolveSiteIconSrc(changes.markerIconSrc)
                : (String(changes.markerIconSrc || "").trim() || FALLBACK_ICON);
            overrides.iconSrc = true;
        }
        if (changes.resetMarkerIcon) {
            presentation.iconSrc = defaults?.iconSrc || presentation.iconSrc || FALLBACK_ICON;
            overrides.iconSrc = false;
        }

        if (Object.hasOwn(changes, "markerIconColor") || Object.hasOwn(changes, "iconColor")) {
            presentation.iconTint = changes.markerIconColor || changes.iconColor || "#ffffff";
            overrides.iconTint = true;
        }
        if (changes.resetMarkerIconColor) {
            presentation.iconTint = defaults?.iconTint || presentation.iconTint || "#ffffff";
            overrides.iconTint = false;
        }

        presentation.overrides = overrides;
        return presentation;
    }

    static async #getTargetPresentationDefaults(current = {}) {
        const resolved = await this.#resolveTargetForCreate(current.target || {});
        return resolved?.presentation || null;
    }

    static async #resolveTargetForCreate(target = {}, options = {}) {
        if (target.kind === "campaign-entity") {
            const entity = options.entity || this.#resolveEntity(target.entityId, target.entityType);
            const config = EntityPlacementTab.getConfig(entity?.type || target.entityType);
            if (!entity || !config) return null;
            const name = config.model.getName(entity);
            return {
                markerKind: "entity-placement",
                target: {
                    kind: "campaign-entity",
                    entityType: entity.type,
                    entityId: entity.id,
                    journalEntryId: entity.journalEntryId || "",
                    uuid: entity.uuid || ""
                },
                presentation: {
                    name,
                    iconSrc: this.#getPlacementImage(config, entity),
                    iconTint: "#ffffff",
                    labelColor: options.labelColor || config.model.getAccent(entity) || "#f4e6cf"
                },
                behavior: {
                    opens: "entity-dossier",
                    canOrbit: true,
                    canConvertToToken: true,
                    createsSceneConnection: true
                },
                entity,
                config
            };
        }

        if (target.kind === "nexus-site") {
            const parentScene = target.parentSceneId ? game.scenes.get(target.parentSceneId) || null : null;
            const record = parentScene && target.siteId ? SiteRecordManager.resolveSite({
                parentScene,
                siteId: target.siteId,
                journalEntryId: target.journalEntryId || null,
                pageId: target.pageId || null
            }) : null;
            if (!record && target.sceneId) {
                return this.#resolveTargetForCreate({
                    kind: "nexus-scene",
                    sceneId: target.sceneId,
                    name: target.name || "",
                    iconSrc: target.iconSrc || "",
                    thumb: target.thumb || ""
                }, options);
            }
            if (!record) return null;
            const markerKind = options.markerKind || "reference";
            const linkedScene = record.siteSceneId || record.linkedSceneId
                ? game.scenes.get(record.siteSceneId || record.linkedSceneId) || null
                : null;
            const siteIconCandidate = record.siteIcon ? record.siteIconSrc : "";
            return {
                markerKind,
                target: {
                    kind: "nexus-site",
                    parentSceneId: parentScene.id,
                    siteId: record.siteId,
                    journalEntryId: record.journalEntryId || target.journalEntryId || "",
                    pageId: record.journalPageId || target.pageId || ""
                },
                presentation: {
                    name: record.siteName || target.name || "Site",
                    iconSrc: this.#resolveSiteIconSrc(siteIconCandidate, target.iconSrc, {
                        excluded: [target.thumb, linkedScene?.thumb]
                    }),
                    iconTint: record.siteColor || "#ffffff",
                    labelColor: record.siteLabelColor || record.siteColor || "#f4e6cf"
                },
                behavior: {
                    opens: "site",
                    canOrbit: options.canOrbit === true || markerKind === "site-placement",
                    canConvertToToken: false,
                    createsSceneConnection: false
                }
            };
        }

        if (target.kind === "nexus-scene") {
            const scene = target.sceneId ? game.scenes.get(target.sceneId) || null : null;
            if (!scene) return null;
            const placePreviewFlags = scene.getFlag(MODULE_ID, "placePreview") || {};
            return {
                markerKind: "reference",
                target: {
                    kind: "nexus-scene",
                    sceneId: scene.id
                },
                presentation: {
                    name: scene.name || target.name || "Scene",
                    iconSrc: target.iconSrc || placePreviewFlags.iconSrc || LegacySciFiCompatibility.getSceneIconSrc(scene) || DEFAULT_SITE_ICON_SRC,
                    iconTint: "#ffffff",
                    labelColor: "#f4e6cf"
                },
                behavior: {
                    opens: LegacySciFiCompatibility.getSceneKind(scene) ? "legacy-scifi-preview" : "place-preview",
                    canOrbit: false,
                    canConvertToToken: false,
                    createsSceneConnection: false
                }
            };
        }

        if (target.kind === "legacy-scifi-pending") {
            return {
                markerKind: "reference",
                target: {
                    kind: "legacy-scifi-pending",
                    nodeKind: target.nodeKind || "",
                    journalEntryId: target.journalEntryId || "",
                    pageId: target.pageId || "",
                    parentSceneId: target.parentSceneId || ""
                },
                presentation: {
                    name: target.name || "Pending Scene",
                    iconSrc: target.iconSrc || DEFAULT_SITE_ICON_SRC,
                    iconTint: "#ffffff",
                    labelColor: "#f4e6cf"
                },
                behavior: {
                    opens: "legacy-scifi-pending",
                    canOrbit: false,
                    canConvertToToken: false,
                    createsSceneConnection: false
                }
            };
        }

        return null;
    }

    static #targetFromBrowserPayload(payload = {}) {
        const nodeKind = String(payload.nodeKind || "").trim();
        if (nodeKind.startsWith("legacy-scifi-pending-")) {
            return {
                kind: "legacy-scifi-pending",
                nodeKind,
                journalEntryId: payload.journalEntryId || "",
                pageId: payload.pageId || "",
                parentSceneId: payload.parentSceneId || "",
                name: payload.name || "",
                iconSrc: payload.iconSrc || "",
                thumb: payload.thumb || ""
            };
        }
        if (payload.parentSceneId && payload.siteId) {
            return {
                kind: "nexus-site",
                sceneId: payload.sceneId || "",
                parentSceneId: payload.parentSceneId,
                siteId: payload.siteId,
                journalEntryId: payload.journalEntryId || "",
                pageId: payload.pageId || "",
                name: payload.name || "",
                iconSrc: payload.iconSrc || "",
                thumb: payload.thumb || ""
            };
        }
        if (payload.sceneId) {
            return {
                kind: "nexus-scene",
                sceneId: payload.sceneId,
                name: payload.name || "",
                iconSrc: payload.iconSrc || "",
                thumb: payload.thumb || ""
            };
        }
        return null;
    }

    static #resolveSiteIconSrc(...args) {
        const last = args.at(-1);
        const options = last && typeof last === "object" && !Array.isArray(last) ? last : {};
        const candidates = options === last ? args.slice(0, -1) : args;
        const excluded = new Set((options.excluded || []).filter(Boolean).map(src => String(src).trim()));
        const iconSrc = candidates
            .map(src => String(src || "").trim())
            .find(src => src && !excluded.has(src));
        return iconSrc || DEFAULT_SITE_ICON_SRC;
    }

    static #normalizeMarkerRecord(record = {}) {
        const target = foundry.utils.deepClone(record.target || {});
        const presentation = foundry.utils.deepClone(record.presentation || {});
        const behavior = foundry.utils.deepClone(record.behavior || {});
        const placement = foundry.utils.deepClone(record.placement || {});
        const label = foundry.utils.deepClone(record.label || {});
        const overrides = presentation.overrides || {};
        const iconSrc = target.kind === "nexus-site"
            ? this.#resolveSiteIconSrc(presentation.iconSrc)
            : (String(presentation.iconSrc || FALLBACK_ICON).trim() || FALLBACK_ICON);
        return {
            markerId: String(record.markerId || "").trim(),
            markerKind: String(record.markerKind || "reference").trim(),
            target,
            presentation: {
                name: String(presentation.name || "Marker").trim() || "Marker",
                iconSrc,
                iconTint: presentation.iconTint || "#ffffff",
                labelColor: presentation.labelColor || "#f4e6cf",
                labelFontSize: this.#clampLabelFontSize(presentation.labelFontSize || this.DEFAULT_LABEL_FONT_SIZE),
                labelFontFamily: this.#resolveLabelFontFamily(presentation.labelFontFamily),
                showLabel: presentation.showLabel !== false,
                playerVisibility: ["inherit", "show", "hide"].includes(presentation.playerVisibility) ? presentation.playerVisibility : "inherit",
                overrides: {
                    name: overrides.name === true,
                    iconSrc: overrides.iconSrc === true,
                    iconTint: overrides.iconTint === true
                }
            },
            behavior: {
                opens: behavior.opens || "place-preview",
                canOrbit: behavior.canOrbit === true,
                canConvertToToken: behavior.canConvertToToken === true,
                createsSceneConnection: behavior.createsSceneConnection === true
            },
            placement: {
                iconSize: this.#clampIconSize(placement.iconSize || this.DEFAULT_ICON_SIZE),
                iconAspectRatio: SiteIconGeometry.normalizeAspectRatio(placement.iconAspectRatio || 1),
                rotation: this.#normalizeRotation(placement.rotation || 0),
                snapToGrid: !!placement.snapToGrid
            },
            label: {
                id: label.id || label.labelId || "",
                role: label.role || "name"
            },
            parentSceneId: record.parentSceneId || canvas.scene?.id || null,
            placeableDocumentName: record.placeableDocumentName || "Tile"
        };
    }

    static async #createLabel(scene, tile, record) {
        if (!scene || !tile || !record?.markerId) return null;
        const [created] = await scene.createEmbeddedDocuments("Drawing", [this.#buildLabelDrawing(tile, record)]);
        return created || null;
    }

    static async #updateLabel(scene, label, tile, record, { force = false } = {}) {
        const doc = label?.document || label || null;
        if (!scene || !doc || !tile || !record?.markerId) return null;
        const [updated] = await scene.updateEmbeddedDocuments("Drawing", [this.#buildLabelSync(doc, tile, record)], { ...(force ? { diff: false } : {}), [MODULE_ID]: { visualOnly: true } });
        return updated || null;
    }

    static #buildLabelDrawing(tile, record) {
        const text = record?.presentation?.name || "Marker";
        const fontSize = this.#clampLabelFontSize(record?.presentation?.labelFontSize || this.DEFAULT_LABEL_FONT_SIZE);
        const width = this.#labelWidth(text, fontSize);
        const height = Math.max(30, Math.round(fontSize * 1.35));
        const pos = this.#getLabelPositionForTile(tile, width, height);
        return {
            x: pos.x,
            y: pos.y,
            shape: { type: "r", width, height },
            fillType: 1,
            fillColor: "#020711",
            fillAlpha: 0.01,
            strokeWidth: 0,
            strokeAlpha: 0,
            text,
            textAlpha: 0.96,
            fontSize,
            fontFamily: this.#resolveLabelFontFamily(record?.presentation?.labelFontFamily),
            textColor: record?.presentation?.labelColor || "#f4e6cf",
            locked: true,
            sort: SITE_MARKER_SORT,
            hidden: false,
            flags: {
                [MODULE_ID]: {
                    markerLabel: true,
                    markerId: record.markerId || "",
                    ownerTileId: tile?.id || "",
                    target: record.target || {},
                    labelRole: record.label?.role || "name",
                    offset: 8
                }
            }
        };
    }

    static #buildLabelSync(label, tile, record) {
        const doc = label?.document || label || {};
        const text = record?.presentation?.name || doc.text || "Marker";
        const fontSize = this.#clampLabelFontSize(record?.presentation?.labelFontSize || doc.fontSize || this.DEFAULT_LABEL_FONT_SIZE);
        const width = this.#labelWidth(text, fontSize);
        const height = Math.max(30, Math.round(fontSize * 1.35));
        const pos = this.#getLabelPositionForTile(tile, width, height, doc.flags?.[MODULE_ID]?.offset ?? 8);
        return {
            _id: doc.id,
            x: pos.x,
            y: pos.y,
            text,
            fontSize,
            fontFamily: this.#resolveLabelFontFamily(record?.presentation?.labelFontFamily || doc.fontFamily),
            textColor: record?.presentation?.labelColor || doc.textColor || "#f4e6cf",
            "shape.width": width,
            "shape.height": height,
            [`flags.${MODULE_ID}.markerId`]: record?.markerId || "",
            [`flags.${MODULE_ID}.ownerTileId`]: tile?.id || "",
            [`flags.${MODULE_ID}.target`]: record?.target || {},
            [`flags.${MODULE_ID}.labelRole`]: record?.label?.role || "name"
        };
    }

    static async #updateMarkerLabelId(scene, tileOrDocument, labelId) {
        const doc = tileOrDocument?.document || tileOrDocument || null;
        if (!scene || !doc?.id) return null;
        const [updated] = await scene.updateEmbeddedDocuments(doc.documentName || "Tile", [{
            _id: doc.id,
            [`flags.${MODULE_ID}.marker.label.id`]: labelId || ""
        }], { diff: false, [MODULE_ID]: { visualOnly: true } });
        return updated || null;
    }

    static #applyLabelSourceSync(label, sync = {}) {
        const doc = label?.document || label || null;
        if (!doc || !sync) return;
        doc.updateSource({
            x: sync.x,
            y: sync.y,
            text: sync.text,
            fontSize: sync.fontSize,
            fontFamily: sync.fontFamily,
            shape: {
                ...(doc.shape || {}),
                width: sync["shape.width"],
                height: sync["shape.height"]
            }
        });
        const drawing = canvas.drawings?.placeables?.find(placeable => placeable.document?.id === doc.id);
        drawing?.refresh?.();
    }

    static #buildOwnerRef(record, tile, label) {
        return this.#normalizeOwnerRef({
            markerId: record.markerId,
            sceneId: record.parentSceneId,
            documentName: tile?.documentName || "Tile",
            documentId: tile?.id || "",
            labelId: label?.id || "",
            markerKind: record.markerKind,
            target: record.target
        });
    }

    static #normalizeOwnerRef(ref = {}) {
        return {
            markerId: String(ref.markerId || "").trim(),
            sceneId: String(ref.sceneId || "").trim(),
            documentName: ref.documentName || "Tile",
            documentId: String(ref.documentId || "").trim(),
            labelId: ref.labelId || "",
            markerKind: ref.markerKind || "reference",
            target: foundry.utils.deepClone(ref.target || {})
        };
    }

    static #targetMatches(left = {}, right = {}) {
        if (!left || !right || left.kind !== right.kind) return false;
        if (left.kind === "campaign-entity") return left.entityType === right.entityType && left.entityId === right.entityId;
        if (left.kind === "nexus-site") return left.parentSceneId === right.parentSceneId && left.siteId === right.siteId;
        if (left.kind === "nexus-scene") return left.sceneId === right.sceneId;
        if (left.kind === "legacy-scifi-pending") {
            return (left.pageId && left.pageId === right.pageId)
                || (left.journalEntryId && left.journalEntryId === right.journalEntryId && left.nodeKind === right.nodeKind);
        }
        return false;
    }

    static async #getOwnerMarkerRefs(target = {}) {
        if (target.kind === "campaign-entity") {
            const doc = this.#resolveEntityDocument(target.entityId, target.entityType);
            const entity = doc?.getFlag?.(MODULE_ID, "campaignEntity") || null;
            return Array.isArray(entity?.markerRefs) ? foundry.utils.deepClone(entity.markerRefs) : [];
        }
        if (target.kind === "nexus-scene") {
            const scene = target.sceneId ? game.scenes.get(target.sceneId) || null : null;
            return Array.isArray(scene?.getFlag(MODULE_ID, "markerRefs")) ? foundry.utils.deepClone(scene.getFlag(MODULE_ID, "markerRefs")) : [];
        }
        if (target.kind === "nexus-site") {
            const parentScene = target.parentSceneId ? game.scenes.get(target.parentSceneId) || null : null;
            const record = parentScene ? SiteRecordManager.resolveSite({ parentScene, siteId: target.siteId }) : null;
            return Array.isArray(record?.markerRefs) ? foundry.utils.deepClone(record.markerRefs) : [];
        }
        if (target.kind === "legacy-scifi-pending") {
            const page = await this.#resolveJournalPage(target.journalEntryId, target.pageId);
            return Array.isArray(page?.getFlag?.(MODULE_ID, "markerRefs")) ? foundry.utils.deepClone(page.getFlag(MODULE_ID, "markerRefs")) : [];
        }
        return [];
    }

    static async #setOwnerMarkerRefs(target = {}, refs = []) {
        const cleanRefs = refs.map(ref => this.#normalizeOwnerRef(ref)).filter(ref => ref.markerId && ref.sceneId && ref.documentId);
        if (target.kind === "campaign-entity") {
            const doc = this.#resolveEntityDocument(target.entityId, target.entityType);
            const entity = doc?.getFlag?.(MODULE_ID, "campaignEntity") || null;
            if (!doc || !entity) return false;
            await doc.update({ [`flags.${MODULE_ID}.campaignEntity`]: { ...entity, markerRefs: cleanRefs } });
            return true;
        }
        if (target.kind === "nexus-scene") {
            const scene = target.sceneId ? game.scenes.get(target.sceneId) || null : null;
            if (!scene) return false;
            await scene.setFlag(MODULE_ID, "markerRefs", cleanRefs);
            return true;
        }
        if (target.kind === "nexus-site") {
            const parentScene = target.parentSceneId ? game.scenes.get(target.parentSceneId) || null : null;
            const record = parentScene ? SiteRecordManager.resolveSite({ parentScene, siteId: target.siteId }) : null;
            if (!parentScene || !record) return false;
            await SiteRecordManager.upsertSceneRecord(parentScene, { ...record, markerRefs: cleanRefs });
            return true;
        }
        if (target.kind === "legacy-scifi-pending") {
            const page = await this.#resolveJournalPage(target.journalEntryId, target.pageId);
            if (!page) return false;
            await page.setFlag(MODULE_ID, "markerRefs", cleanRefs);
            return true;
        }
        return false;
    }

    static async #resolveJournalPage(journalEntryId = "", pageId = "") {
        const entry = journalEntryId ? game.journal.get(journalEntryId) || null : null;
        return entry && pageId ? entry.pages.get(pageId) || null : null;
    }

    static #resolveEntity(entityId = "", entityType = "") {
        if (entityType === "ship") return CampaignEntityJournalStore.getShip(entityId);
        if (entityType === "faction") return CampaignEntityJournalStore.getFaction(entityId);
        return CampaignEntityJournalStore.getNpc(entityId);
    }

    static #resolveEntityDocument(entityId = "", entityType = "") {
        if (entityType === "ship") return CampaignEntityJournalStore.resolveShipDocument(entityId);
        if (entityType === "faction") return CampaignEntityJournalStore.resolveFactionDocument(entityId);
        return CampaignEntityJournalStore.resolveNpcDocument(entityId);
    }

    static async #ensureSceneEntityConnection(scene, entity, type) {
        const sceneTarget = getSceneConnectionTarget(scene);
        const entityTarget = ConnectionTargetResolver.fromCampaignEntity(entity);
        if (sceneTarget && entityTarget) {
            await addConnection(sceneTarget, entityTarget, {
                sourceView: { category: type, role: "Present", sort: 100 },
                targetView: { category: "place", role: "Located At", sort: 100 }
            });
        }
    }

    static async #confirmDeleteOrphan(placeable) {
        if (!game.user?.isGM) {
            ui.notifications.warn("This marker points to something that could not be found.");
            return null;
        }
        const confirmed = await foundry.applications.api.DialogV2.confirm({
            window: { title: "Missing Marker Target" },
            content: `<p>This marker points to something that could not be found. Delete the marker?</p>`,
            yes: { label: "Delete Marker", icon: "fa-solid fa-trash" },
            no: { label: "Cancel", icon: "fa-solid fa-xmark" },
            modal: true
        });
        if (confirmed) await this.deleteMarker(placeable);
        return null;
    }

    static #getEntityPreview(type) {
        const config = EntityPlacementTab.getConfig(type);
        const state = EntityPlacementTab.getPlacementStyle(type);
        if (!config || !state) return null;
        const entity = state.mode === "existing"
            ? config.list({ search: "" }).find(row => row.id === state.selectedEntityId) || null
            : state.candidate;
        if (!entity) return null;
        return {
            name: config.model.getName(entity),
            iconSrc: this.#getPlacementImage(config, entity),
            labelColor: state.labelColor || config.model.getAccent(entity),
            iconSize: state.iconSize || this.DEFAULT_ICON_SIZE,
            rotation: this.#normalizeRotation(state.rotation || 0),
            showLabel: state.showLabel !== false,
            labelFontSize: state.labelFontSize || this.DEFAULT_LABEL_FONT_SIZE,
            labelFontFamily: state.labelFontFamily || this.DEFAULT_LABEL_FONT_FAMILY
        };
    }

    static #getPlacementImage(config, entity) {
        const tokenImage = config?.type === "npc" && typeof config?.model?.getTokenImage === "function"
            ? config.model.getTokenImage(entity)
            : "";
        return tokenImage || config?.model?.getImage?.(entity) || FALLBACK_ICON;
    }

    static #styleFromOptions(options = {}, resolved = {}) {
        return {
            iconSize: this.#clampIconSize(options.iconSize || this.DEFAULT_ICON_SIZE),
            rotation: this.#normalizeRotation(options.rotation || 0),
            showLabel: options.showLabel !== false,
            labelFontSize: this.#clampLabelFontSize(options.labelFontSize || this.DEFAULT_LABEL_FONT_SIZE),
            labelFontFamily: this.#resolveLabelFontFamily(options.labelFontFamily),
            labelColor: options.labelColor || resolved.presentation?.labelColor || "#f4e6cf",
            snapToGrid: !!options.snapToGrid
        };
    }

    static #getStyle(type) {
        const state = EntityPlacementTab.getPlacementStyle(type) || EntityPlacementTab.getState(type) || {};
        return this.#styleFromOptions(state);
    }

    static async #ensureGhostContainer(preview, signature) {
        if (!canvas.stage) return;
        if (!this.#ghostContainer) {
            this.#ghostContainer = new PIXI.Container();
            this.#ghostContainer.eventMode = "none";
            this.#ghostContainer.zIndex = 999999;
            this.#ghostContainer.visible = false;
            canvas.stage.sortableChildren = true;
            canvas.stage.addChild(this.#ghostContainer);
        } else {
            this.#ghostContainer.removeChildren().forEach(child => child.destroy?.());
        }
        this.#ghostSignature = signature;

        const texture = await foundry.canvas.loadTexture(preview.iconSrc);
        if (!texture || this.#ghostSignature !== signature) return;
        const dimensions = SiteIconGeometry.dimensionsFromTexture(texture, preview.iconSize || this.DEFAULT_ICON_SIZE);
        const iconSprite = new PIXI.Sprite(texture);
        iconSprite.anchor.set(0.5, 0.5);
        iconSprite.width = dimensions.width;
        iconSprite.height = dimensions.height;
        iconSprite.alpha = 0.85;
        iconSprite.rotation = this.#toRadians(preview.rotation || 0);
        this.#ghostContainer.addChild(iconSprite);

        if (preview.showLabel === false) return;
        const label = new PIXI.Text(preview.name || "Marker", new PIXI.TextStyle({
            fontFamily: this.#resolveLabelFontFamily(preview.labelFontFamily),
            fontSize: this.#clampLabelFontSize(preview.labelFontSize),
            fill: preview.labelColor || "#f4e6cf",
            stroke: "#000000",
            strokeThickness: 4,
            align: "center"
        }));
        label.anchor.set(0.5, 0);
        label.position.set(0, (dimensions.height / 2) + 8);
        this.#ghostContainer.addChild(label);
    }

    static #transformDrag({ rotationDelta = 0, iconSizeDelta = 0, resetIconSize = false } = {}) {
        const state = this.#dragState;
        const placeable = state?.placeable;
        const doc = placeable?.document || placeable || null;
        if (!doc) return false;

        const record = this.getMarkerRecord(doc);
        if (!record) return false;

        const center = state.center || this.#getTileCenter(doc);
        const currentDimensions = state.dimensions || {};
        const nextSize = resetIconSize
            ? this.#getSceneDefaultIconSize()
            : this.#clampIconSize((currentDimensions.height || record.placement.iconSize || this.DEFAULT_ICON_SIZE) + Number(iconSizeDelta || 0));
        const nextRotation = this.#normalizeRotation(Number(state.rotation ?? record.placement.rotation ?? doc.rotation ?? 0) + Number(rotationDelta || 0));
        const dimensions = this.#dimensionsForIconSize(nextSize, currentDimensions.aspectRatio || record.placement.iconAspectRatio || SiteIconGeometry.aspectRatioFromDocument(doc, 1));

        state.center = center;
        state.dimensions = dimensions;
        state.rotation = nextRotation;
        doc.updateSource(this.#buildTileUpdateFromDragState(state));
        placeable.refresh?.();

        if (state.label) {
            const updatedRecord = this.#normalizeMarkerRecord({
                ...record,
                placement: {
                    ...record.placement,
                    iconSize: dimensions.height,
                    iconAspectRatio: dimensions.aspectRatio,
                    rotation: nextRotation
                }
            });
            this.#applyLabelSourceSync(state.label, this.#buildLabelSync(state.label, doc, updatedRecord));
        }
        return true;
    }

    static #buildTileUpdateFromDragState(state = {}) {
        const dimensions = state.dimensions || {};
        const width = Number(dimensions.width || 0);
        const height = Number(dimensions.height || 0);
        const rotation = this.#normalizeRotation(state.rotation || 0);
        const center = state.center || { x: 0, y: 0 };
        const topLeft = getTopLeftAnchorCompensatedPosition({
            x: Number(center.x || 0) - (width / 2),
            y: Number(center.y || 0) - (height / 2),
            width,
            height,
            rotation
        });
        return {
            x: Math.round(topLeft.x),
            y: Math.round(topLeft.y),
            width,
            height,
            rotation
        };
    }

    static #getPlacementPosition(position, style = {}) {
        if (!style?.snapToGrid) return { x: position.x, y: position.y };
        const gridSize = canvas.grid?.size ?? canvas.dimensions?.size ?? 0;
        if (!gridSize) return { x: position.x, y: position.y };
        const halfGrid = gridSize / 2;
        return {
            x: Math.round(position.x / halfGrid) * halfGrid,
            y: Math.round(position.y / halfGrid) * halfGrid
        };
    }

    static #getCompensatedTileUpdate(doc, update = {}) {
        const width = Number(update.width || doc.width || 0);
        const height = Number(update.height || doc.height || 0);
        const rotation = this.#normalizeRotation(update.rotation ?? doc.rotation ?? 0);
        const topLeft = getTopLeftAnchorCompensatedPosition({
            x: Number(update.x ?? doc.x ?? 0),
            y: Number(update.y ?? doc.y ?? 0),
            width,
            height,
            rotation
        });
        return {
            ...update,
            x: Math.round(topLeft.x),
            y: Math.round(topLeft.y)
        };
    }

    static #getTileCenter(doc = {}) {
        const rect = this.#getTileVisualRect(doc);
        return {
            x: rect.x + (rect.width / 2),
            y: rect.y + (rect.height / 2)
        };
    }

    static #getLabelPositionForTile(tile, width, height, offset = 8) {
        const doc = tile?.document || tile || {};
        const rect = this.#getTileVisualRect(doc);
        const centerX = rect.x + (rect.width / 2);
        return {
            x: Math.round(centerX - (width / 2)),
            y: Math.round(rect.y + Math.max(rect.height, 1) + offset)
        };
    }

    static #getTileVisualRect(doc = {}) {
        const width = Number(doc.width || 0);
        const height = Number(doc.height || 0);
        const rotation = this.#normalizeRotation(doc.rotation || 0);
        const visual = getTopLeftAnchorVisualPosition({
            x: Number(doc.x || 0),
            y: Number(doc.y || 0),
            width,
            height,
            rotation
        });
        return {
            x: Number(visual.x || 0),
            y: Number(visual.y || 0),
            width,
            height,
            rotation
        };
    }

    static #labelWidth(label, fontSize) {
        return Math.max(96, Math.min(720, Math.round((String(label || "").length * fontSize * 0.62) + 36)));
    }

    static #dimensionsForIconSize(iconSize = 100, aspectRatio = 1) {
        const height = this.#clampIconSize(iconSize);
        const ratio = SiteIconGeometry.normalizeAspectRatio(aspectRatio || 1);
        return {
            width: Math.max(1, Math.round(height * ratio)),
            height,
            aspectRatio: ratio
        };
    }

    static #markerKindLabel(record = {}) {
        if (record.target?.kind === "nexus-site") return record.markerKind === "site-placement" ? "Site marker" : "Site reference";
        if (record.target?.kind === "nexus-scene") return "Scene reference";
        if (record.target?.kind === "legacy-scifi-pending") return "Pending scene reference";
        return "Marker";
    }

    static #markerIconClass(record = {}) {
        if (record.target?.kind === "nexus-site") return "fas fa-location-dot";
        if (record.target?.kind === "nexus-scene") return "fas fa-map";
        if (record.target?.kind === "legacy-scifi-pending") return "fas fa-sparkles";
        return "fas fa-circle";
    }

    static #getSceneDefaultIconSize() {
        return this.#clampIconSize(canvas.grid?.size ?? canvas.dimensions?.size ?? this.DEFAULT_ICON_SIZE);
    }

    static #clampIconSize(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return this.DEFAULT_ICON_SIZE;
        return Math.min(256, Math.max(50, Math.round(numeric)));
    }

    static #clampLabelFontSize(value) {
        return SiteLabelManager.clampFontSize(value || this.DEFAULT_LABEL_FONT_SIZE);
    }

    static #normalizeRotation(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return 0;
        return ((Math.round(numeric) % 360) + 360) % 360;
    }

    static #toRadians(value) {
        return this.#normalizeRotation(value) * (Math.PI / 180);
    }

    static #resolveLabelFontFamily(value) {
        return SiteLabelManager.resolveFontFamily({ labelFontFamily: value || this.DEFAULT_LABEL_FONT_FAMILY });
    }

    static #getTileBounds(tile) {
        const doc = tile?.document || tile || null;
        if (!doc) return null;
        if (doc.hidden && !game.user.isGM) return null;
        if (Number(doc.alpha) === 0) return null;
        const rect = this.#getTileVisualRect(doc);
        if (rect.rotation) {
            return PIXI.Rectangle.fromRotation(rect.x, rect.y, rect.width, rect.height, Math.toRadians(rect.rotation)).normalize();
        }
        return new PIXI.Rectangle(rect.x, rect.y, rect.width, rect.height).normalize();
    }
}

Hooks.on("augurNexusEntityPlacementStyleChanged", type => {
    NexusMarkerService.refreshGhost(type);
});
