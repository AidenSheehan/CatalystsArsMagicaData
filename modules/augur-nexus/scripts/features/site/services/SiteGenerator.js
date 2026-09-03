// Canvas-side Site placement behavior. Existing Site visuals are handled by Markers or legacy compatibility hooks.

import { SitePanel } from "../applications/SitePanel.js";
import { SiteIconGeometry } from "./SiteIconGeometry.js";
import { SiteLabelManager } from "./SiteLabelManager.js";
import { SiteRecordManager } from "./SiteRecordManager.js";
import { SiteSceneVisibilityManager } from "./SiteSceneVisibilityManager.js";
import { isNexusSiteToolSuppressedScene } from "../../../support/toolbar/NexusToolContext.js";
import { NexusLineageManager } from "../../nexus/services/NexusLineageManager.js";
import { NexusSceneFolderManager } from "../../nexus/services/NexusSceneFolderManager.js";
import { NexusSceneNavigationManager } from "../../nexus/services/NexusSceneNavigationManager.js";
import { NexusMarkerService } from "../../markers/services/NexusMarkerService.js";

const MODULE_ID = "augur-nexus";

export class SiteGenerator {
    static NOTE_FONT_SIZE = 38;
    static NOTE_FONT_FAMILY = "Bruno Ace";
    static NOTE_TEXT_ANCHOR = CONST.TEXT_ANCHOR_POINTS.RIGHT;
    static #ghostContainer = null;
    static #ghostSignature = null;
    static #lastGhostPosition = null;

    static async syncGhost(position, { shiftKey = false } = {}) {
        this.#lastGhostPosition = position ? { x: position.x, y: position.y } : this.#lastGhostPosition;
        if (shiftKey) {
            this.clearGhost();
            return;
        }

        const state = SitePanel.getState();
        if (!state?.iconSrc) {
            this.clearGhost();
            return;
        }

        const signature = ["place", state.iconSrc, state.iconColor, state.labelColor, state.iconSize, state.rotation || 0, state.showLabel, state.labelFontSize, state.labelFontFamily, state.siteName || "Site"].join("|");
        if (!this.#ghostContainer || this.#ghostSignature !== signature) {
            await this.#ensureGhostContainer(state, signature);
        }

        if (!this.#ghostContainer) return;
        const ghostPosition = this.#getPlacementPosition(position, state);
        this.#ghostContainer.position.set(Math.round(ghostPosition.x), Math.round(ghostPosition.y));
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
        this.#ghostSignature = null;
        this.#lastGhostPosition = null;
    }

    static refreshGhost() {
        if (!this.#lastGhostPosition || !this.#ghostContainer) return;
        this.#ghostSignature = null;
        this.syncGhost(this.#lastGhostPosition).catch(err => {
            console.warn("Augur: Nexus | Failed to refresh site placement ghost.", err);
        });
    }

    static async handleCanvasClick(position, { shiftKey = false } = {}) {
        if (shiftKey) return;
        await this.createSite(position);
    }

    static async createSite(position) {
        const scene = canvas.scene;
        if (!scene || isNexusSiteToolSuppressedScene(scene)) {
            ui.notifications.warn("Sites are not available in this scene.");
            return;
        }

        const state = SitePanel.getState();
        const selectedIcon = SitePanel.getSelectedIcon();
        if (!selectedIcon?.src) {
            ui.notifications.warn("No site icon is currently available.");
            return;
        }
        if (state.sceneTypeAvailable === false) {
            const requirement = state.sceneTypeRequiresText || `${state.sceneTypeRequiresLabel || "This scene type"} required`;
            ui.notifications.warn(requirement);
            return;
        }
        if (state.sceneType === "existing" && !state.linkedSceneId) {
            ui.notifications.warn("Choose a linked scene before placing an Existing Scene site.");
            return;
        }
        if (state.sceneType === "existing" && state.linkedSceneId) {
            const linkedScene = game.scenes.get(state.linkedSceneId);
            const validation = NexusLineageManager.validateSceneParent(linkedScene, { parentSceneId: scene.id });
            if (!validation.valid) {
                ui.notifications.warn(validation.message || "That scene cannot be adopted here.");
                return;
            }
        }
        if (state.showImageControls && !state.sceneImageSrc) {
            ui.notifications.warn("Choose an image before placing a From Image site.");
            return;
        }

        const siteName = (state.siteName || SitePanel.DEFAULT_NAME || "Site").trim() || "Site";
        const siteId = foundry.utils.randomID();
        const placement = this.#getPlacementPosition(position, state);
        const size = state.iconSize || 100;
        const iconDimensions = await SiteIconGeometry.resolveDimensions(selectedIcon.src, size);
        const rotation = this.#normalizeRotation(state.rotation || 0);
        const record = SiteRecordManager.normalizeRecord({
            siteId,
            siteName,
            siteGenre: state.genreId,
            siteGenreLabel: state.genreLabel,
            siteSceneType: state.sceneType,
            siteSceneTypeLabel: state.sceneTypeLabel,
            siteScenePresetId: state.sceneTypePresetId || null,
            siteScenePresetLabel: state.sceneTypePresetLabel || "",
            siteSceneBiomeId: state.sceneTypeBiomeId || null,
            siteSceneBiomeLabel: state.sceneTypeBiomeLabel || "",
            siteSceneBiomeFieldLabel: state.sceneTypeBiomeFieldLabel || "Biome",
            siteSceneImageSrc: state.sceneImageSrc || "",
            siteSceneImageName: state.sceneImageName || "",
            linkedSceneId: state.linkedSceneId,
            linkedSceneName: state.linkedSceneName,
            siteIconRole: state.iconRole,
            siteIconRoleLabel: state.iconRoleLabel,
            iconId: state.iconId,
            iconSrc: selectedIcon.src,
            iconSize: iconDimensions.height,
            siteIconAspectRatio: iconDimensions.aspectRatio,
            rotation,
            showLabel: state.showLabel,
            labelFontSize: state.labelFontSize,
            labelFontFamily: state.labelFontFamily,
            siteColor: state.iconColor,
            siteLabelColor: state.labelColor || state.iconColor,
            siteTheme: state.themeId,
            siteThemeLabel: state.themeLabel,
            mapColorId: state.mapColorId,
            mapColorLabel: state.mapColorLabel,
            siteSize: state.sizeId,
            siteSizeLabel: state.sizeLabel,
            roomCount: state.roomCount,
            autoSortScenes: state.autoSortScenes,
            parentSceneId: scene.id,
            parentSceneName: scene.name,
            placeableDocumentName: "Tile"
        });
        const placedRecord = await SiteRecordManager.upsertSceneRecord(scene, record);
        const createdTile = placedRecord ? await NexusMarkerService.createSiteMarker(placedRecord, placement, {
            markerKind: "site-placement",
            canOrbit: true,
            iconSize: iconDimensions.height,
            rotation,
            showLabel: state.showLabel,
            labelFontSize: state.labelFontSize,
            labelFontFamily: state.labelFontFamily,
            labelColor: state.labelColor || state.iconColor,
            snapToGrid: !!state.snapToGrid
        }) : null;

        if (!createdTile) {
            ui.notifications.error("Failed to place the site marker.");
            return;
        }

        await SiteSceneVisibilityManager.applySceneVisibility(scene);

        if (state.sceneType === "existing" && state.linkedSceneId) {
            const linkedScene = game.scenes.get(state.linkedSceneId);
            if (linkedScene) {
                await NexusSceneNavigationManager.setSceneNavigation(linkedScene, {
                    parentSceneId: scene.id,
                    parentSiteId: siteId,
                    transitionStyle: "focus-note",
                    transitionContext: {
                        placeableId: createdTile.id,
                        documentName: "Tile",
                        moduleId: MODULE_ID,
                        flagKey: "marker.target.siteId",
                        flagValue: siteId
                    }
                });
                await NexusSceneFolderManager.placeExistingSceneInParentFolder(scene, linkedScene, {
                    autoSort: state.autoSortScenes !== false
                });
                const linkedRecord = await SiteRecordManager.persistLinkedScene(placedRecord, linkedScene.id, linkedScene.name);
                await linkedScene.update({
                    [`flags.${MODULE_ID}.siteScene`]: true,
                    [`flags.${MODULE_ID}.site`]: linkedRecord
                });
            }
            SitePanel.clearLinkedSceneSelection();
        }

        if (state.randomizeAfterPlacement) {
            await SitePanel.randomizeNextSite();
        }

        Hooks.callAll("augurNexusLineageChanged");
        ui.notifications.info(`Created site "${siteName}".`);
    }

    static transformActiveGesture({ rotationDelta = 0, iconSizeDelta = 0, resetIconSize = false } = {}) {
        SitePanel.transformPlacementStyle?.({ rotationDelta, iconSizeDelta, resetIconSize });
        this.refreshGhost();
        return true;
    }

    static #getPlacementPosition(position, state = SitePanel.getState()) {
        if (!state?.snapToGrid) return { x: position.x, y: position.y };
        const gridSize = canvas.grid?.size ?? canvas.dimensions?.size ?? 0;
        if (!gridSize) return { x: position.x, y: position.y };
        const halfGrid = gridSize / 2;
        return {
            x: Math.round(position.x / halfGrid) * halfGrid,
            y: Math.round(position.y / halfGrid) * halfGrid
        };
    }

    static async #ensureGhostContainer(state, signature) {
        const layer = canvas.stage;
        if (!layer) return;

        if (!this.#ghostContainer) {
            this.#ghostContainer = new PIXI.Container();
            this.#ghostContainer.eventMode = "none";
            this.#ghostContainer.zIndex = 999999;
            this.#ghostContainer.visible = false;
            layer.sortableChildren = true;
            layer.addChild(this.#ghostContainer);
        } else {
            this.#ghostContainer.removeChildren().forEach(child => child.destroy?.());
        }

        this.#ghostSignature = signature;
        const texture = await foundry.canvas.loadTexture(state.iconSrc);
        if (!texture) return;
        if (this.#ghostSignature !== signature || !this.#ghostContainer) return;

        const iconSprite = new PIXI.Sprite(texture);
        iconSprite.anchor.set(0.5, 0.5);
        const dimensions = SiteIconGeometry.dimensionsFromTexture(texture, state.iconSize || 100);
        iconSprite.width = dimensions.width;
        iconSprite.height = dimensions.height;
        iconSprite.tint = PIXI.utils.string2hex(state.iconColor || "#ffffff");
        iconSprite.alpha = 0.85;
        iconSprite.rotation = this.#toRadians(state.rotation || 0);
        this.#ghostContainer.addChild(iconSprite);

        const textStyle = new PIXI.TextStyle({
            fontFamily: SiteLabelManager.resolveFontFamily(state),
            fontSize: SiteLabelManager.resolveFontSize(state),
            fill: state.labelColor || state.iconColor || "#ffffff",
            stroke: "#000000",
            strokeThickness: 4,
            align: "center"
        });
        if (state.showLabel !== false) {
            const label = new PIXI.Text(state.siteName || "Site", textStyle);
            label.anchor.set(0.5, 0);
            label.position.set(0, (dimensions.height / 2) + SiteLabelManager.DEFAULT_OFFSET);
            this.#ghostContainer.addChild(label);
        }
    }


    static #normalizeRotation(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return 0;
        return ((Math.round(numeric) % 360) + 360) % 360;
    }

    static #toRadians(value) {
        return this.#normalizeRotation(value) * (Math.PI / 180);
    }

}




