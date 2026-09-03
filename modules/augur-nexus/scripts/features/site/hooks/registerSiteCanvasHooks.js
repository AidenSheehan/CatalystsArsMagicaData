// Canvas hook wiring for Sites interactions. This keeps drag and placement behavior out of the bootstrap file.

import { Log } from "../../../support/utils/Logger.js";
import { PlacePreview } from "../../connections/applications/PlacePreview.js";
import { openActionMenu } from "../../../api/ui.js";
import { SiteGenerator } from "../services/SiteGenerator.js";
import { SiteEditor } from "../services/SiteEditor.js";
import { SitePanel } from "../applications/SitePanel.js";
import { SiteInteractionPolicy } from "../services/SiteInteractionPolicy.js";
import { SiteSceneVisibilityManager } from "../services/SiteSceneVisibilityManager.js";
import { SiteMapManager } from "../services/SiteMapManager.js";
import { SiteRecordManager } from "../services/SiteRecordManager.js";
import { SiteDeletionManager } from "../services/SiteDeletionManager.js";
import { SiteSelectionHighlighter } from "../services/SiteSelectionHighlighter.js";
import { SiteLabelManager } from "../services/SiteLabelManager.js";
import { NexusMarkerService } from "../../markers/services/NexusMarkerService.js";
import { NexusMarkerTargetActions } from "../../markers/services/NexusMarkerTargetActions.js";
import { EntityPlacementTab } from "../applications/tabs/EntityPlacementTab.js";
import { NexusPlacementGestureController } from "../services/NexusPlacementGestureController.js";
import { NexusPlayerSceneAccess } from "../../nexus/services/NexusPlayerSceneAccess.js";
import { PlayerNexusVisibilityDialog } from "../../nexus/applications/PlayerNexusVisibilityDialog.js";
import { PlayerSceneOpenDialog } from "../../nexus/applications/PlayerSceneOpenDialog.js";
import { PlayerVisibilityInfoPanel } from "../../nexus/applications/PlayerVisibilityInfoPanel.js";
import { PlayerNpcVisibilityDialog } from "../../nexus/applications/PlayerNpcVisibilityDialog.js";
import { CampaignEntityActorBridge } from "../../campaign-entities/services/CampaignEntityActorBridge.js";
import { openNexusMarkerEditorForPlaceable, openNexusSiteEditorForPlaceable, refreshNexusToolbarForScene } from "../../../support/toolbar/NexusToolContext.js";

let canvasMouseDownHandler = null;
let canvasRightDownHandler = null;
let canvasMouseMoveHandler = null;
let canvasMouseUpHandler = null;
let dropCanvasDataHookRegistered = false;

function getScreenPosition(event) {
    const original = event.data?.originalEvent || {};
    const global = event.data?.global || {};
    return {
        left: Number(original.clientX ?? global.x ?? 0),
        top: Number(original.clientY ?? global.y ?? 0)
    };
}

function getCanvasDropPosition(data = {}, event = null) {
    const dataX = Number(data.x);
    const dataY = Number(data.y);
    if (Number.isFinite(dataX) && Number.isFinite(dataY)) return { x: dataX, y: dataY };
    const eventX = Number(event?.clientX);
    const eventY = Number(event?.clientY);
    if (Number.isFinite(eventX) && Number.isFinite(eventY) && canvas?.canvasCoordinatesFromClient) {
        return canvas.canvasCoordinatesFromClient({ x: eventX, y: eventY });
    }
    return null;
}

function getSceneDefaultMarkerIconSize() {
    const numeric = Number(canvas.grid?.size ?? canvas.dimensions?.size ?? NexusMarkerService.DEFAULT_ICON_SIZE);
    if (!Number.isFinite(numeric)) return NexusMarkerService.DEFAULT_ICON_SIZE;
    return Math.min(240, Math.max(32, Math.round(numeric)));
}

function getLegacySitePlaceableAtPosition(position) {
    if (!position) return null;
    const tile = canvas.tiles?.placeables?.filter(tile => {
        const flags = tile.document.flags?.["augur-nexus"] || {};
        if (!flags.site) return false;
        const bounds = tile.bounds || tile.getBounds?.() || null;
        if (bounds?.contains?.(position.x, position.y)) return true;
        const x = Number(tile.document.x || 0);
        const y = Number(tile.document.y || 0);
        const width = Number(tile.document.width || 0);
        const height = Number(tile.document.height || 0);
        return position.x >= x && position.x <= x + width && position.y >= y && position.y <= y + height;
    }).sort((a, b) => Number(b.document.sort ?? 0) - Number(a.document.sort ?? 0))[0] || null;
    if (tile) return tile;

    return canvas.notes?.placeables?.find(note => {
        const flags = note.document.flags?.["augur-nexus"] || {};
        if (!flags.site) return false;
        const bounds = note.bounds || note.getBounds?.() || null;
        if (bounds?.contains?.(position.x, position.y)) return true;
        const radius = Number(note.document.iconSize || flags.iconSize || 100) / 2;
        return Math.hypot(position.x - Number(note.document.x || 0), position.y - Number(note.document.y || 0)) <= radius;
    }) || null;
}

function getLinkedSiteScene(record) {
    const sceneId = record?.siteSceneId || record?.linkedSceneId || null;
    return sceneId ? game.scenes.get(sceneId) || null : null;
}

function openSiteVisibilityMenu({ parentScene, record, position }) {
    const linkedScene = getLinkedSiteScene(record);
    const current = SiteSceneVisibilityManager.getSitePlayerVisibilityOverride({
        scene: parentScene,
        siteId: record.siteId,
        linkedScene,
        record
    });
    const setVisibility = value => SiteSceneVisibilityManager.setSitePlayerVisibilityOverride({
        parentScene,
        siteId: record.siteId,
        linkedScene,
        value
    });

    openActionMenu({
        position,
        className: "nexus-site-context-menu",
        items: [
            {
                id: "inherit",
                label: current === "inherit" ? "Global (Current)" : "Global",
                icon: "fas fa-layer-group",
                onSelect: () => setVisibility("inherit")
            },
            {
                id: "show",
                label: current === "show" ? "Yes (Current)" : "Yes",
                icon: "fas fa-eye",
                onSelect: () => setVisibility("show")
            },
            {
                id: "hide",
                label: current === "hide" ? "No (Current)" : "No",
                icon: "fas fa-eye-slash",
                onSelect: () => setVisibility("hide")
            },
            {
                id: "change-global",
                label: "Change Global Setting...",
                icon: "fas fa-sliders",
                onSelect: () => PlayerNexusVisibilityDialog.show()
            },
            {
                id: "player-visibility-info",
                label: "What's this?",
                icon: "fas fa-circle-info",
                onSelect: () => PlayerVisibilityInfoPanel.show("visibility")
            }
        ]
    });
}

function openSiteViewAccessMenu({ scene, position }) {
    if (!scene) {
        ui.notifications.warn("Create or link a scene before setting player view access.");
        return;
    }

    const current = NexusPlayerSceneAccess.getSceneViewOverride(scene);
    openActionMenu({
        position,
        className: "nexus-site-context-menu",
        items: [
            {
                id: "inherit",
                label: current === "inherit" ? "Global (Current)" : "Global",
                icon: "fas fa-layer-group",
                onSelect: () => NexusPlayerSceneAccess.setSceneViewOverride(scene, "inherit")
            },
            {
                id: "allow",
                label: current === "allow" ? "Allowed (Current)" : "Allowed",
                icon: "fas fa-eye",
                onSelect: () => NexusPlayerSceneAccess.setSceneViewOverride(scene, "allow")
            },
            {
                id: "block",
                label: current === "block" ? "Blocked (Current)" : "Blocked",
                icon: "fas fa-eye-slash",
                onSelect: () => NexusPlayerSceneAccess.setSceneViewOverride(scene, "block")
            },
            {
                id: "change-global",
                label: "Change Global Setting...",
                icon: "fas fa-sliders",
                onSelect: () => PlayerSceneOpenDialog.show()
            },
            {
                id: "player-scene-open-info",
                label: "What's this?",
                icon: "fas fa-circle-info",
                onSelect: () => PlayerVisibilityInfoPanel.show("sceneOpen")
            }
        ]
    });
}

function openSiteContextMenu({ parentScene, placeable, position }) {
    if (!game.user.isGM) return;

    const record = SiteRecordManager.resolveSite({ parentScene, placeable });
    if (!record?.siteId) return;

    const linkedScene = getLinkedSiteScene(record);
    const visibilityLabel = SiteSceneVisibilityManager.getSitePlayerVisibilityLabel({
        scene: parentScene,
        siteId: record.siteId,
        linkedScene,
        record
    });
    const playerSceneOpenLabel = linkedScene
        ? NexusPlayerSceneAccess.getSceneViewLabel(linkedScene)
        : "Create Scene First";

    openActionMenu({
        position,
        className: "nexus-site-context-menu",
        items: [
            {
                id: "open-site-scene",
                label: linkedScene ? "Open Site Scene" : "Create Site Scene",
                icon: "fas fa-door-open",
                onSelect: () => SiteMapManager.openSiteShortcut({ parentScene, placeable })
            },
            {
                id: "edit-site",
                label: "Edit Site",
                icon: "fas fa-pen-to-square",
                onSelect: () => openNexusSiteEditorForPlaceable(placeable)
            },
            {
                id: "player-nexus-visibility",
                label: `Visible To Players: ${visibilityLabel}`,
                icon: SiteSceneVisibilityManager.getSitePlayerVisibilityIcon({ scene: parentScene, siteId: record.siteId, linkedScene, record }),
                onSelect: () => openSiteVisibilityMenu({ parentScene, record, position })
            },
            {
                id: "player-view-access",
                label: `Player Scene Open: ${playerSceneOpenLabel}`,
                icon: "fas fa-door-open",
                unavailable: !linkedScene,
                onSelect: () => openSiteViewAccessMenu({ scene: linkedScene, position })
            },
            {
                id: "delete-site",
                label: "Delete Site",
                status: "Permanent",
                icon: "fas fa-skull-crossbones",
                danger: true,
                className: "permanent-danger",
                onSelect: () => SiteDeletionManager.deleteSite(placeable, { parentScene })
            }
        ]
    });
}

function runMarkerAction(action, failureMessage = "Marker action failed.") {
    Promise.resolve()
        .then(action)
        .catch(err => {
            Log.error(failureMessage, err);
            ui.notifications.error(failureMessage);
        });
}

function openMarkerVisibilityMenu({ placeable, state, position }) {
    const current = state?.value || "inherit";
    const setVisibility = value => NexusMarkerTargetActions.setVisibilityState(placeable, value);
    const actionState = NexusMarkerTargetActions.getActionState(placeable);
    const isCampaignEntity = actionState?.target?.kind === "campaign-entity";
    const globalAction = isCampaignEntity
        ? () => PlayerNpcVisibilityDialog.show(actionState.target.entityType || "npc")
        : () => PlayerNexusVisibilityDialog.show();

    openActionMenu({
        position,
        className: "nexus-site-context-menu",
        items: [
            {
                id: "inherit",
                label: current === "inherit" ? "Global (Current)" : "Global",
                icon: "fas fa-layer-group",
                onSelect: () => runMarkerAction(() => setVisibility("inherit"), "Failed to update marker visibility.")
            },
            {
                id: "show",
                label: current === "show" ? "Yes (Current)" : "Yes",
                icon: "fas fa-eye",
                onSelect: () => runMarkerAction(() => setVisibility("show"), "Failed to update marker visibility.")
            },
            {
                id: "hide",
                label: current === "hide" ? "No (Current)" : "No",
                icon: "fas fa-eye-slash",
                onSelect: () => runMarkerAction(() => setVisibility("hide"), "Failed to update marker visibility.")
            },
            {
                id: "change-global",
                label: "Change Global Setting...",
                icon: "fas fa-sliders",
                onSelect: globalAction
            },
            {
                id: "player-visibility-info",
                label: "What's this?",
                icon: "fas fa-circle-info",
                onSelect: () => PlayerVisibilityInfoPanel.show(isCampaignEntity ? "campaignEntityVisibility" : "visibility")
            }
        ]
    });
}

function openMarkerPlayerAccessMenu({ record, state, position }) {
    const current = state?.value || "inherit";
    const setAccess = value => NexusMarkerTargetActions.setPlayerSceneAccessState(record, value);

    openActionMenu({
        position,
        className: "nexus-site-context-menu",
        items: [
            {
                id: "inherit",
                label: current === "inherit" ? "Global (Current)" : "Global",
                icon: "fas fa-layer-group",
                onSelect: () => runMarkerAction(() => setAccess("inherit"), "Failed to update player scene access.")
            },
            {
                id: "allow",
                label: current === "allow" ? "Allowed (Current)" : "Allowed",
                icon: "fas fa-eye",
                onSelect: () => runMarkerAction(() => setAccess("allow"), "Failed to update player scene access.")
            },
            {
                id: "block",
                label: current === "block" ? "Blocked (Current)" : "Blocked",
                icon: "fas fa-eye-slash",
                onSelect: () => runMarkerAction(() => setAccess("block"), "Failed to update player scene access.")
            },
            {
                id: "change-global",
                label: "Change Global Setting...",
                icon: "fas fa-sliders",
                onSelect: () => PlayerSceneOpenDialog.show()
            },
            {
                id: "player-scene-open-info",
                label: "What's this?",
                icon: "fas fa-circle-info",
                onSelect: () => PlayerVisibilityInfoPanel.show("sceneOpen")
            }
        ]
    });
}

function openMarkerContextMenu({ placeable, position }) {
    if (!game.user.isGM) return;

    const state = NexusMarkerTargetActions.getActionState(placeable);
    if (!state?.record) return;
    const { record, visibility, playerAccess } = state;
    const target = record.target || {};
    const isSceneLikeTarget = target.kind === "nexus-site" || target.kind === "nexus-scene";
    const canShowTokenConversion = target.kind === "campaign-entity"
        && target.entityType !== "faction"
        && record.behavior?.canConvertToToken;
    const items = [
        {
            id: "open-marker",
            label: state.openLabel,
            icon: state.openIcon,
            onSelect: () => runMarkerAction(() => NexusMarkerTargetActions.openTarget(placeable), "Failed to open the selected marker.")
        },
        {
            id: "edit-marker",
            label: "Edit/Move Marker",
            icon: "fas fa-pen-to-square",
            onSelect: () => openNexusMarkerEditorForPlaceable(placeable)
        },
        {
            id: "player-nexus-visibility",
            label: `Visible To Players: ${visibility?.label || "Global"}`,
            icon: visibility?.icon || "fas fa-layer-group",
            unavailable: !visibility?.supported,
            onSelect: () => openMarkerVisibilityMenu({ placeable, state: visibility, position })
        }
    ];

    if (isSceneLikeTarget) {
        items.push({
            id: "player-view-access",
            label: `Player Scene Open: ${playerAccess?.label || "Unavailable"}`,
            icon: playerAccess?.icon || "fas fa-door-open",
            unavailable: !playerAccess?.supported || playerAccess?.unavailable,
            onSelect: () => openMarkerPlayerAccessMenu({ record, state: playerAccess, position })
        });
    }

    if (canShowTokenConversion) {
        items.push({
            id: "convert-entity-token",
            label: "Convert to Token",
            icon: "fas fa-user-circle",
            onSelect: () => CampaignEntityActorBridge.convertMarkerToToken(placeable).catch(err => {
                Log.error("Failed to convert the entity marker to a token.", err);
                ui.notifications.error("Failed to convert the marker to a token.");
            })
        });
    }

    items.push(
        {
            id: "delete-target",
            label: state.deleteTargetLabel,
            status: "Permanent",
            icon: "fas fa-skull-crossbones",
            danger: true,
            className: "permanent-danger",
            unavailable: !state.canDeleteTarget,
            onSelect: () => runMarkerAction(() => NexusMarkerTargetActions.deleteTarget(placeable), "Failed to delete the marker target.")
        },
        {
            id: "delete-marker",
            label: "Remove Marker",
            status: "Scene Only",
            icon: "fas fa-location-dot",
            danger: true,
            onSelect: () => runMarkerAction(() => NexusMarkerTargetActions.deleteMarker(placeable), "Failed to delete the selected marker.")
        }
    );

    openActionMenu({
        position,
        className: "nexus-site-context-menu",
        items
    });
}

export function registerSiteCanvasHooks() {
    SiteSelectionHighlighter.registerHooks();

    if (!dropCanvasDataHookRegistered) {
        dropCanvasDataHookRegistered = true;
        Hooks.on("dropCanvasData", (_canvas, data, event) => {
            if (data?.type !== "AugurNexusNode") return undefined;
            const position = getCanvasDropPosition(data, event);
            if (!canvas?.scene || !position) return undefined;
            if (canvas.dimensions?.rect && !canvas.dimensions.rect.contains(position.x, position.y)) return undefined;

            const iconSize = getSceneDefaultMarkerIconSize();
            NexusMarkerService.createReferenceMarkerFromBrowserPayload(data, {
                x: position.x,
                y: position.y
            }, {
                iconSize,
                labelFontSize: SiteLabelManager.getDefaultFontSize(iconSize),
                snapToGrid: false
            }).then(marker => {
                if (marker) openNexusMarkerEditorForPlaceable(marker);
            }).catch(err => {
                Log.error("Failed to place Nexus reference marker.", err);
                ui.notifications.error("Could not place that Nexus marker on the scene.");
            });
            return false;
        });
    }

    Hooks.on("canvasReady", () => {
        SiteGenerator.resetGhost();
        NexusMarkerService.resetGhost();
        NexusPlacementGestureController.activate();
        SiteSceneVisibilityManager.applySceneVisibility(canvas.scene).catch(err => {
            Log.warn("Failed to apply scene site visibility.", err);
        });
        refreshNexusToolbarForScene(canvas.scene);
        canvas.augur?.refreshNoteBridgeListeners?.();

        if (canvasMouseDownHandler) canvas.stage.off("mousedown", canvasMouseDownHandler);
        if (canvasRightDownHandler) canvas.stage.off("rightdown", canvasRightDownHandler);
        if (canvasMouseMoveHandler) canvas.stage.off("mousemove", canvasMouseMoveHandler);
        if (canvasMouseUpHandler) {
            canvas.stage.off("mouseup", canvasMouseUpHandler);
            canvas.stage.off("mouseupoutside", canvasMouseUpHandler);
        }

        canvasMouseDownHandler = async event => {
            const activeControl = ui.controls.control;
            const controlName = activeControl?.name || ui.controls.activeControl || "";
            const activeTool = ui.controls.tool;
            const toolName = activeTool?.name || activeTool;

            const pos = event.data?.getLocalPosition(canvas.stage);
            if (!pos) return;
            const legacySite = getLegacySitePlaceableAtPosition(pos);
            const marker = NexusMarkerService.getMarkerAtPosition(pos);

            if (toolName !== "nexus-sites") {
                if (!legacySite && !marker) return;
                if (!SiteInteractionPolicy.canHandlePassiveSiteClick({ controlName, toolName })) return;
                if (SiteInteractionPolicy.shouldSuppress({
                    scene: canvas.scene,
                    controlName,
                    toolName,
                    event,
                    position: pos,
                    placeable: legacySite || marker
                })) return;

                if (marker) {
                    event.stopPropagation();
                    if (event.data?.originalEvent?.shiftKey) {
                        NexusMarkerTargetActions.openTarget(marker).catch(err => {
                            Log.error("Failed to open the selected Nexus marker.", err);
                            ui.notifications.error("Failed to open the selected marker.");
                        });
                        return;
                    }
                    NexusMarkerTargetActions.previewTarget(marker);
                    return;
                }

                if (event.data?.originalEvent?.shiftKey) {
                    event.stopPropagation();
                    SiteMapManager.openSiteShortcut({ parentScene: canvas.scene, placeable: legacySite }).catch(err => {
                        Log.error("Failed to open the selected site scene.", err);
                        ui.notifications.error("Failed to open the selected site scene.");
                    });
                    return;
                }

                event.stopPropagation();
                PlacePreview.show({ parentScene: canvas.scene, placeable: legacySite });
                return;
            }

            if (!game.user.isGM) {
                ui.notifications.warn("Only the GM can create, edit, delete, or move sites.");
                return;
            }

            if (SiteEditor.isEditMode) {
                const shiftKey = event.data?.originalEvent?.shiftKey || false;
                if (shiftKey) {
                    if (!legacySite && !marker) return;
                    event.stopPropagation();
                    SiteGenerator.clearGhost();
                    NexusMarkerService.clearGhost();
                    if (marker) {
                        NexusMarkerService.deleteMarker(marker).catch(err => {
                            Log.error("Failed to delete the selected marker.", err);
                            ui.notifications.error("Failed to delete the selected marker.");
                        });
                        return;
                    }
                    SiteDeletionManager.deleteSite(legacySite, { parentScene: canvas.scene }).then(() => {
                        SiteEditor.clearSelection();
                    }).catch(err => {
                        Log.error("Failed to delete the selected site.", err);
                        ui.notifications.error("Failed to delete the selected site.");
                    });
                    return;
                }

                const selectedMarker = NexusMarkerService.getSelectedPlaceable();
                if (selectedMarker && marker && selectedMarker.document?.id === marker.document?.id && NexusMarkerService.beginDrag(pos, { placeableId: selectedMarker.document.id })) {
                    SiteGenerator.clearGhost();
                    NexusMarkerService.clearGhost();
                    return;
                }

                SiteGenerator.clearGhost();
                NexusMarkerService.clearGhost();
                try {
                    if (marker) {
                        SiteEditor.clearSelection();
                        NexusMarkerService.selectMarkerAtPosition(pos);
                    } else if (legacySite) {
                        const converted = await NexusMarkerService.convertLegacySitePlaceableToMarker(legacySite, { scene: canvas.scene });
                        if (converted) {
                            SiteEditor.clearSelection();
                            NexusMarkerService.selectMarker(converted);
                        } else {
                            NexusMarkerService.clearSelection();
                            ui.notifications.warn("This older Site note can still be opened or deleted, but cannot be converted for marker editing.");
                        }
                    } else {
                        NexusMarkerService.clearSelection();
                    }
                } catch (err) {
                    Log.error("Failed to select the marker to edit.", err);
                    ui.notifications.error("Failed to select the marker.");
                }
                return;
            }

            const shiftKey = event.data?.originalEvent?.shiftKey || false;
            const activeEntityType = EntityPlacementTab.getActiveEntityType(SitePanel.activeTab);
            if (activeEntityType) {
                if (!shiftKey && NexusMarkerService.beginDrag(pos)) {
                    NexusMarkerService.clearGhost();
                    return;
                }
                NexusMarkerService.handleCanvasClick(pos, activeEntityType, { shiftKey }).catch(err => {
                    Log.error("Failed to handle entity placement interaction.", err);
                    ui.notifications.error("Failed to update the selected entity marker.");
                });
                return;
            }

            if (marker) {
                if (shiftKey) {
                    NexusMarkerService.deleteMarker(marker).catch(err => {
                        Log.error("Failed to delete the selected marker.", err);
                        ui.notifications.error("Failed to delete the selected marker.");
                    });
                    return;
                }
                event.stopPropagation();
                openNexusMarkerEditorForPlaceable(marker);
                return;
            }

            if (legacySite) {
                if (shiftKey) {
                    SiteDeletionManager.deleteSite(legacySite, { parentScene: canvas.scene }).catch(err => {
                        Log.error("Failed to delete the selected legacy site.", err);
                        ui.notifications.error("Failed to delete the selected site.");
                    });
                    return;
                }
                event.stopPropagation();
                openNexusSiteEditorForPlaceable(legacySite).catch(err => {
                    Log.error("Failed to select the site for editing.", err);
                    ui.notifications.error("Failed to select the site for editing.");
                });
                return;
            }

            SiteGenerator.handleCanvasClick(pos, { shiftKey }).catch(err => {
                Log.error("Failed to handle site placement interaction.", err);
                ui.notifications.error("Failed to update the selected site.");
            });
        };

        canvasRightDownHandler = event => {
            if (!game.user.isGM) return;

            const activeControl = ui.controls.control;
            const controlName = activeControl?.name || ui.controls.activeControl || "";
            const activeTool = ui.controls.tool;
            const toolName = activeTool?.name || activeTool;
            const pos = event.data?.getLocalPosition(canvas.stage);
            if (!pos) return;

            const legacySite = getLegacySitePlaceableAtPosition(pos);
            const marker = NexusMarkerService.getMarkerAtPosition(pos);
            if (!legacySite && !marker) return;
            if (!SiteInteractionPolicy.canHandlePassiveSiteClick({ controlName, toolName })) return;
            if (SiteInteractionPolicy.shouldSuppress({
                scene: canvas.scene,
                controlName,
                toolName,
                event,
                position: pos,
                placeable: legacySite || marker
            })) return;

            event.data?.originalEvent?.preventDefault?.();
            event.stopPropagation();
            if (marker) {
                openMarkerContextMenu({
                    placeable: marker,
                    position: getScreenPosition(event)
                });
                return;
            }
            openSiteContextMenu({
                parentScene: canvas.scene,
                placeable: legacySite,
                position: getScreenPosition(event)
            });
        };

        canvasMouseMoveHandler = event => {
            const activeTool = ui.controls.tool;
            const toolName = activeTool?.name || activeTool;
            const pos = event.data?.getLocalPosition(canvas.stage);
            if (!pos) return;

            if (toolName !== "nexus-sites") {
                SiteGenerator.clearGhost();
                NexusMarkerService.clearGhost();
                return;
            }

            if (NexusMarkerService.isDragging) {
                NexusMarkerService.clearGhost();
                NexusMarkerService.updateDrag(pos);
                SiteSelectionHighlighter.refresh();
                return;
            }

            if (SiteEditor.isEditMode) {
                SiteGenerator.clearGhost();
                NexusMarkerService.clearGhost();
                return;
            }

            const activeEntityType = EntityPlacementTab.getActiveEntityType(SitePanel.activeTab);
            if (activeEntityType) {
                SiteGenerator.clearGhost();
                NexusMarkerService.syncGhost(pos, activeEntityType, {
                    shiftKey: event.data?.originalEvent?.shiftKey || false
                }).catch(err => {
                    Log.warn("Failed to update the entity ghost preview.", err);
                });
                return;
            }

            if (SitePanel.activeTab !== "site") {
                SiteGenerator.clearGhost();
                NexusMarkerService.clearGhost();
                return;
            }

            NexusMarkerService.clearGhost();
            SiteGenerator.syncGhost(pos, {
                shiftKey: event.data?.originalEvent?.shiftKey || false
            }).catch(err => {
                Log.warn("Failed to update the site ghost preview.", err);
            });
        };

        canvasMouseUpHandler = event => {
            const activeTool = ui.controls.tool;
            const toolName = activeTool?.name || activeTool;
            if (toolName !== "nexus-sites") {
                return;
            }

            if (NexusMarkerService.isDragging) {
                NexusMarkerService.endDrag().catch(err => {
                    Log.error("Failed to finish marker drag interaction.", err);
                    ui.notifications.error("Failed to move the selected marker.");
                    NexusMarkerService.cancelDrag();
                });
                return;
            }

        };

        canvas.stage.on("mousedown", canvasMouseDownHandler);
        canvas.stage.on("rightdown", canvasRightDownHandler);
        canvas.stage.on("mousemove", canvasMouseMoveHandler);
        canvas.stage.on("mouseup", canvasMouseUpHandler);
        canvas.stage.on("mouseupoutside", canvasMouseUpHandler);
    });
}

