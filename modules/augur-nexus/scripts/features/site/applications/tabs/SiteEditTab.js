// Edit tab for existing site markers. This keeps edit mode separate from the placement workflow.

import { SitePanel } from "../SitePanel.js";
import { SiteIconPicker } from "../SiteIconPicker.js";
import { SiteLabelManager } from "../../services/SiteLabelManager.js";
import { SiteSceneVisibilityManager } from "../../services/SiteSceneVisibilityManager.js";
import { NexusMarkerService } from "../../../markers/services/NexusMarkerService.js";

export class SiteEditTab {
    static TOOL_NAME = "nexus-sites";

    constructor(app = null) {
        this.app = app;
    }

    render(force, options) {
        return this.app?.render(force, options);
    }

    async _prepareContext() {
        const scene = canvas.scene || null;
        const sceneSummary = SiteSceneVisibilityManager.getSceneSummary(scene);
        const sceneOptions = SiteSceneVisibilityManager.getSceneOptions(scene);
        const selectedNexusMarker = NexusMarkerService.getSelectedMarkerState();
        const selectedSiteMarker = selectedNexusMarker?.target?.kind === "nexus-site" ? selectedNexusMarker : null;
        const selectedMarker = selectedNexusMarker
            ? {
                    kind: selectedSiteMarker ? "site-marker" : "marker",
                    title: selectedNexusMarker.name || "Marker",
                    subtitle: selectedSiteMarker ? "Site marker" : `${selectedNexusMarker.label || "Nexus"} marker`,
                    iconSrc: selectedNexusMarker.iconSrc || "",
                    iconClass: selectedSiteMarker ? "fas fa-location-dot" : (selectedNexusMarker.icon || "fas fa-circle"),
                    name: selectedNexusMarker.name || "",
                    selectedIconColor: selectedNexusMarker.iconColor || SitePanel.DEFAULT_COLOR,
                    selectedLabelColor: selectedNexusMarker.labelColor || SitePanel.DEFAULT_COLOR,
                    selectedIconSize: selectedNexusMarker.iconSize || 100,
                    selectedLabelFontSize: selectedNexusMarker.labelFontSize || SiteLabelManager.getDefaultFontSize(selectedNexusMarker.iconSize || 100),
                    selectedLabelFontFamily: SiteLabelManager.resolveFontFamily(selectedNexusMarker || {}),
                    showLabel: selectedNexusMarker.showLabel !== false,
                    snapToGrid: !!selectedNexusMarker.snapToGrid,
                    supportsName: !!selectedNexusMarker.supportsLocalPresentation,
                    supportsIconPicker: !!selectedNexusMarker.supportsLocalPresentation,
                    supportsIconRole: false,
                    supportsIconColor: !!selectedNexusMarker.supportsLocalPresentation,
                    supportsSnapToGrid: true,
                    canResetMarkerName: !!selectedNexusMarker.canResetMarkerName,
                    canResetMarkerIcon: !!selectedNexusMarker.canResetMarkerIcon,
                    canResetMarkerIconColor: !!selectedNexusMarker.canResetMarkerIconColor
            }
            : null;
        const selectedIcon = selectedNexusMarker?.iconSrc
            ? { src: selectedNexusMarker.iconSrc, label: selectedNexusMarker.name || "Selected Marker" }
            : null;

        if (selectedSiteMarker?.siteGenre) {
            await SitePanel.getIconCatalog(selectedSiteMarker.siteGenre);
        }

        const context = {
            hasScene: !!scene,
            sceneName: scene?.name || "No Scene",
            siteCount: sceneSummary.siteCount,
            showMarkers: sceneOptions.showMarkers,
            showLabels: sceneOptions.showLabels,
            hasSelection: !!selectedMarker,
            hasSiteSelection: !!selectedSiteMarker,
            hasSiteReferenceSelection: false,
            hasEntitySelection: !!selectedNexusMarker,
            selectedMarkerTitle: selectedMarker?.title || "No marker selected",
            selectedMarkerSubtitle: selectedMarker?.subtitle || "Click a marker on the map to edit it.",
            selectedSiteName: selectedMarker?.title || "No marker selected",
            selectedSiteIconSrc: selectedMarker?.iconSrc || "",
            selectedMarkerIconClass: selectedMarker?.iconClass || "fas fa-location-dot",
            siteName: selectedMarker?.name || "",
            selectedIconLabel: selectedIcon?.label || "Select Icon",
            selectedIconSrc: selectedIcon?.src || "",
            selectedIconRole: selectedSiteMarker?.siteIconRole || "landmark",
            selectedIconColor: selectedMarker?.selectedIconColor || SitePanel.DEFAULT_COLOR,
            selectedLabelColor: selectedMarker?.selectedLabelColor || SitePanel.DEFAULT_COLOR,
            selectedIconSize: selectedMarker?.selectedIconSize || 100,
            selectedLabelFontSize: selectedMarker?.selectedLabelFontSize || SiteLabelManager.getDefaultFontSize(selectedMarker?.selectedIconSize || 100),
            minLabelFontSize: SiteLabelManager.MIN_FONT_SIZE,
            maxLabelFontSize: SiteLabelManager.MAX_FONT_SIZE,
            selectedLabelFontFamily: selectedMarker?.selectedLabelFontFamily || SiteLabelManager.FONT_FAMILY,
            labelFontOptions: SiteLabelManager.FONT_OPTIONS,
            showLabel: selectedMarker?.showLabel !== false,
            showLabelToggleInAdvanced: true,
            showLabelColorControls: true,
            showSnapToGrid: !!selectedMarker?.supportsSnapToGrid,
            snapToGrid: !!selectedMarker?.snapToGrid,
            showRandomizeToggle: false,
            controlsDisabled: !selectedMarker,
            supportsName: !!selectedMarker?.supportsName,
            supportsIconPicker: !!selectedMarker?.supportsIconPicker,
            supportsIconRole: !!selectedMarker?.supportsIconRole,
            supportsIconColor: !!selectedMarker?.supportsIconColor,
            canResetMarkerName: !!selectedMarker?.canResetMarkerName,
            canResetMarkerIcon: !!selectedMarker?.canResetMarkerIcon,
            canResetMarkerIconColor: !!selectedMarker?.canResetMarkerIconColor,
            iconRoles: SitePanel.ICON_ROLE_OPTIONS,
            colors: SitePanel.COLOR_OPTIONS
        };
        context.styleHtml = await foundry.applications.handlebars.renderTemplate(
            "modules/augur-nexus/templates/site/parts/marker-style-editor.hbs",
            context
        );
        return context;
    }

    _attachPartListeners(partId, htmlElement, options) {
        const el = htmlElement instanceof HTMLElement ? htmlElement : htmlElement[0];
        if (!el) return;

        const nameInput = el.querySelector("input[name='markerName']");
        const applyNameButton = el.querySelector("[data-action='applyMarkerName']");
        const resetNameButton = el.querySelector("[data-action='resetMarkerName']");
        const resetIconButton = el.querySelector("[data-action='resetMarkerIcon']");
        const resetIconColorButton = el.querySelector("[data-action='resetMarkerIconColor']");
        const iconSizeInput = el.querySelector("input[name='iconSize']");
        const iconSizeValue = el.querySelector("[data-site-icon-size-value]");
        const labelFontSizeInput = el.querySelector("input[name='labelFontSize']");
        const labelFontSizeValue = el.querySelector("[data-site-label-font-size-value]");
        const labelFontFamilySelect = el.querySelector("select[name='labelFontFamily']");
        const showLabelCheckbox = el.querySelector("input[name='showLabel']");
        const showMarkersInput = el.querySelector("input[name='sceneShowMarkers']");
        const showLabelsInput = el.querySelector("input[name='sceneShowLabels']");

        if (showMarkersInput) {
            showMarkersInput.addEventListener("change", event => {
                void SiteSceneVisibilityManager.setSceneOptions(canvas.scene, {
                    showMarkers: !!event.currentTarget.checked
                }).then(() => this.app?.render());
            });
        }

        if (showLabelsInput) {
            showLabelsInput.addEventListener("change", event => {
                void SiteSceneVisibilityManager.setSceneOptions(canvas.scene, {
                    showLabels: !!event.currentTarget.checked
                }).then(() => this.app?.render());
            });
        }

        const syncApplyNameButton = () => {
            if (!nameInput || !applyNameButton) return;
            const baselineValue = nameInput.dataset.initialValue ?? "";
            const currentValue = nameInput.value ?? "";
            applyNameButton.hidden = currentValue === baselineValue;
        };

        const updateSelectedMarker = changes => {
            if (NexusMarkerService.getSelectedMarkerState()) return NexusMarkerService.updateSelectedMarker(changes);
            return Promise.resolve(false);
        };

        const applyMarkerName = () => {
            if (!nameInput) return;
            const nextName = nameInput.value || "";
            void updateSelectedMarker({ markerName: nextName }).then(updated => {
                if (updated) this.render();
                else syncApplyNameButton();
            });
        };

        if (nameInput) {
            nameInput.dataset.initialValue = nameInput.value || "";
            syncApplyNameButton();

            nameInput.addEventListener("input", () => {
                syncApplyNameButton();
            });

            nameInput.addEventListener("keydown", event => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                applyMarkerName();
            });

            nameInput.addEventListener("change", () => {
                syncApplyNameButton();
                applyMarkerName();
            });

            nameInput.addEventListener("blur", () => {
                if (applyNameButton?.hidden !== false) return;
                applyMarkerName();
            });
        }

        if (applyNameButton) {
            applyNameButton.addEventListener("click", event => {
                event.preventDefault();
                applyMarkerName();
            });
        }

        if (resetNameButton) {
            resetNameButton.addEventListener("click", event => {
                event.preventDefault();
                void updateSelectedMarker({ resetMarkerName: true }).then(updated => {
                    if (updated) this.render();
                });
            });
        }

        if (iconSizeInput) {
            iconSizeInput.dataset.appliedValue = String(iconSizeInput.value || "");

            iconSizeInput.addEventListener("input", event => {
                const nextSize = Math.max(SitePanel.MIN_ICON_SIZE, Math.min(SitePanel.MAX_ICON_SIZE, Math.round(Number(event.currentTarget.value) || 100)));
                const nextLabelSize = SiteLabelManager.getDefaultFontSize(nextSize);
                if (iconSizeValue) iconSizeValue.textContent = String(nextSize);
                if (labelFontSizeInput) labelFontSizeInput.value = String(nextLabelSize);
                if (labelFontSizeValue) labelFontSizeValue.textContent = String(nextLabelSize);
            });

            const applyIconSize = event => {
                const nextSize = Math.max(SitePanel.MIN_ICON_SIZE, Math.min(SitePanel.MAX_ICON_SIZE, Math.round(Number(event.currentTarget.value) || 100)));
                if (event.currentTarget.dataset.appliedValue === String(nextSize)) return;
                event.currentTarget.dataset.appliedValue = String(nextSize);
                const nextLabelSize = SiteLabelManager.getDefaultFontSize(nextSize);
                if (iconSizeValue) iconSizeValue.textContent = String(nextSize);
                if (labelFontSizeInput) {
                    labelFontSizeInput.value = String(nextLabelSize);
                    labelFontSizeInput.dataset.appliedValue = String(nextLabelSize);
                }
                if (labelFontSizeValue) labelFontSizeValue.textContent = String(nextLabelSize);
                void updateSelectedMarker({ iconSize: nextSize, labelFontSize: nextLabelSize }).then(updated => {
                    if (updated) this.render();
                });
            };

            iconSizeInput.addEventListener("change", applyIconSize);
            iconSizeInput.addEventListener("mouseup", applyIconSize);
            iconSizeInput.addEventListener("touchend", applyIconSize);
            iconSizeInput.addEventListener("keyup", event => {
                if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(event.key)) return;
                applyIconSize(event);
            });
        }

        if (labelFontSizeInput) {
            labelFontSizeInput.dataset.appliedValue = String(labelFontSizeInput.value || "");

            labelFontSizeInput.addEventListener("input", event => {
                const nextSize = SiteLabelManager.clampFontSize(event.currentTarget.value);
                if (labelFontSizeValue) labelFontSizeValue.textContent = String(nextSize);
            });

            const applyLabelFontSize = event => {
                const nextSize = SiteLabelManager.clampFontSize(event.currentTarget.value);
                if (event.currentTarget.dataset.appliedValue === String(nextSize)) return;
                event.currentTarget.dataset.appliedValue = String(nextSize);
                if (labelFontSizeValue) labelFontSizeValue.textContent = String(nextSize);
                void updateSelectedMarker({ labelFontSize: nextSize }).then(updated => {
                    if (updated) this.render();
                });
            };

            labelFontSizeInput.addEventListener("change", applyLabelFontSize);
            labelFontSizeInput.addEventListener("mouseup", applyLabelFontSize);
            labelFontSizeInput.addEventListener("touchend", applyLabelFontSize);
            labelFontSizeInput.addEventListener("keyup", event => {
                if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(event.key)) return;
                applyLabelFontSize(event);
            });
        }

        if (labelFontFamilySelect) {
            labelFontFamilySelect.addEventListener("change", event => {
                const nextFont = SiteLabelManager.resolveFontFamily({ labelFontFamily: event.currentTarget.value });
                void updateSelectedMarker({ labelFontFamily: nextFont }).then(updated => {
                    if (updated) this.render();
                });
            });
        }

        if (showLabelCheckbox) {
            showLabelCheckbox.addEventListener("change", event => {
                void updateSelectedMarker({ showLabel: !!event.currentTarget.checked }).then(updated => {
                    if (updated) this.render();
                });
            });
        }

        el.querySelectorAll("[data-site-icon-role]").forEach(button => {
            button.addEventListener("click", event => {
                const site = NexusMarkerService.getSelectedMarkerState();
                if (!site) return;

                const nextRole = event.currentTarget.dataset.siteIconRole || "landmark";
                void updateSelectedMarker({
                    siteIconRole: nextRole,
                    siteIconRoleLabel: SitePanel.getIconRoleLabel(nextRole)
                }).then(updated => {
                    if (updated) this.render();
                });
            });
        });

        const iconPickerButton = el.querySelector("[data-action='pickSiteIcon']");
        if (iconPickerButton) {
            iconPickerButton.addEventListener("click", event => {
                event.preventDefault();
                const site = NexusMarkerService.getSelectedMarkerState();
                if (!site) return;

                const icons = Promise.all([
                    SitePanel.getIconCatalog(site.siteGenre),
                    SitePanel.getAllBuiltInIcons()
                ]).then(([catalog, allBuiltInIcons]) => {
                        const currentIconId = allBuiltInIcons.find(icon => icon.src === site.iconSrc)?.id || "custom";
                        new SiteIconPicker(catalog?.icons || [], currentIconId, site.siteIconRole, selection => {
                            if (typeof selection === "object" && selection?.id === "custom") {
                                void updateSelectedMarker({
                                    markerIconSrc: selection.src || ""
                                }).then(updated => {
                                    if (updated) this.render();
                                });
                                return;
                            }

                            const nextIcon = allBuiltInIcons.find(icon => icon.id === selection) || null;
                            void updateSelectedMarker({
                                markerIconSrc: nextIcon?.src || site.iconSrc || ""
                            }).then(updated => {
                                if (updated) this.render();
                            });
                        }, {
                            currentCustomIconSrc: site.iconSrc || "",
                            allBuiltInIcons,
                            themeIconsOnlyLabel: "Show Theme Icons Only",
                            filterByRole: false
                        }).render(true);
                    });

                void icons;
            });
        }

        if (resetIconButton) {
            resetIconButton.addEventListener("click", event => {
                event.preventDefault();
                void updateSelectedMarker({ resetMarkerIcon: true }).then(updated => {
                    if (updated) this.render();
                });
            });
        }

        el.querySelectorAll("[data-site-icon-color]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                const nextColor = event.currentTarget.dataset.siteIconColor || SitePanel.DEFAULT_COLOR;
                void updateSelectedMarker({ markerIconColor: nextColor }).then(updated => {
                    if (updated) this.render();
                });
            });
        });

        if (resetIconColorButton) {
            resetIconColorButton.addEventListener("click", event => {
                event.preventDefault();
                void updateSelectedMarker({ resetMarkerIconColor: true }).then(updated => {
                    if (updated) this.render();
                });
            });
        }

        el.querySelectorAll("[data-placement-label-color]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                const nextColor = event.currentTarget.dataset.placementLabelColor || SitePanel.DEFAULT_COLOR;
                void updateSelectedMarker({ labelColor: nextColor }).then(updated => {
                    if (updated) this.render();
                });
            });
        });

        const snapToGridCheckbox = el.querySelector("input[name='snapToGrid']");
        if (snapToGridCheckbox) {
            snapToGridCheckbox.addEventListener("change", event => {
                void updateSelectedMarker({ snapToGrid: !!event.currentTarget.checked }).then(updated => {
                    if (updated) this.render();
                });
            });
        }

    }
}
