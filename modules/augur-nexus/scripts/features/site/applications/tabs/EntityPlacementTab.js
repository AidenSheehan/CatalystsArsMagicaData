import {
    createNpc,
    generateNpc,
    getNpcGeneratorOptions,
    getNpcGenerators,
    getNpcs,
    openNpcDossier
} from "../../../../api/npcs.js";
import {
    createShip,
    generateShip,
    getShipGeneratorOptions,
    getShipGenerators,
    getShips,
    openShipDossier
} from "../../../../api/ships.js";
import {
    createFaction,
    generateFaction,
    getFactionGeneratorOptions,
    getFactionGenerators,
    getFactions,
    openFactionDossier
} from "../../../../api/factions.js";
import { NpcDataEditor } from "../../../campaign-entities/applications/NpcDataEditor.js";
import { ShipDataEditor } from "../../../campaign-entities/applications/ShipDataEditor.js";
import { FactionDataEditor } from "../../../campaign-entities/applications/FactionDataEditor.js";
import { NpcEntityModel } from "../../../campaign-entities/models/NpcEntityModel.js";
import { ShipEntityModel } from "../../../campaign-entities/models/ShipEntityModel.js";
import { FactionEntityModel } from "../../../campaign-entities/models/FactionEntityModel.js";
import { NpcProfileViewModel } from "../../../campaign-entities/models/NpcProfileViewModel.js";
import { ShipProfileViewModel } from "../../../campaign-entities/models/ShipProfileViewModel.js";
import { FactionProfileViewModel } from "../../../campaign-entities/models/FactionProfileViewModel.js";
import { SiteCreateTab } from "./SiteCreateTab.js";
import { SiteLabelManager } from "../../services/SiteLabelManager.js";

const PATREON_URL = "https://www.patreon.com/TheAugur";

const CONFIGS = {
    npc: {
        type: "npc",
        label: "People",
        plural: "People",
        icon: "fas fa-user-astronaut",
        generatorLabel: "Generator",
        manualLabel: "Manual Person",
        getGenerators: getNpcGenerators,
        getGeneratorOptions: getNpcGeneratorOptions,
        generate: generateNpc,
        create: createNpc,
        list: getNpcs,
        open: openNpcDossier,
        editor: NpcDataEditor,
        model: NpcEntityModel,
        viewModel: NpcProfileViewModel,
        profilePartial: "modules/augur-nexus/templates/campaign-entities/npc-profile-panel.hbs",
        optionGroups: [
            { key: "roleId", name: "generatorRoleId", label: "Role", source: "roles", defaultKey: "roleId" },
            { key: "gender", name: "generatorGender", label: "Appearance", source: "genders", defaultKey: "gender" }
        ],
        promoTitle: "Sci-Fi person placement",
        promoText: "For Sci-Fi people you can get Augur: Sci-Fi over at Patreon. Fantasy people are coming soon."
    },
    ship: {
        type: "ship",
        label: "Ship",
        plural: "Ships",
        icon: "fas fa-rocket",
        generatorLabel: "Generator",
        manualLabel: "Manual Ship",
        getGenerators: getShipGenerators,
        getGeneratorOptions: getShipGeneratorOptions,
        generate: generateShip,
        create: createShip,
        list: getShips,
        open: openShipDossier,
        editor: ShipDataEditor,
        model: ShipEntityModel,
        viewModel: ShipProfileViewModel,
        profilePartial: "modules/augur-nexus/templates/campaign-entities/ship-profile-panel.hbs",
        optionGroups: [
            { key: "templateId", name: "generatorTemplateId", label: "Template", source: "templates", defaultKey: "templateId" }
        ],
        promoTitle: "Sci-Fi ship placement",
        promoText: "For Sci-Fi ships you can get Augur: Sci-Fi over at Patreon. Fantasy vehicle support is coming soon."
    },
    faction: {
        type: "faction",
        label: "Organizations",
        plural: "Organizations",
        icon: "fas fa-shield-halved",
        generatorLabel: "Generator",
        manualLabel: "Manual Organization",
        getGenerators: getFactionGenerators,
        getGeneratorOptions: getFactionGeneratorOptions,
        generate: generateFaction,
        create: createFaction,
        list: getFactions,
        open: openFactionDossier,
        editor: FactionDataEditor,
        model: FactionEntityModel,
        viewModel: FactionProfileViewModel,
        profilePartial: "modules/augur-nexus/templates/campaign-entities/faction-profile-panel.hbs",
        optionGroups: [
            { key: "typeId", name: "generatorTypeId", label: "Type", source: "types", defaultKey: "typeId" }
        ],
        promoTitle: "Sci-Fi organization placement",
        promoText: "For Sci-Fi organizations you can get Augur: Sci-Fi over at Patreon. Fantasy organizations are coming soon."
    }
};

const STATES = new Map();

export class EntityPlacementTab {
    constructor(app, type) {
        this.app = app;
        this.type = type;
        this.config = CONFIGS[type];
        if (!this.config) throw new Error(`Unknown Nexus placement entity type: ${type}`);
        if (!STATES.has(type)) STATES.set(type, this.#getDefaultState());
    }

    static isEntityTab(tabId) {
        return Object.hasOwn(CONFIGS, tabId);
    }

    static getConfig(type) {
        return CONFIGS[type] || null;
    }

    static getState(type) {
        return STATES.get(type) || null;
    }

    static getPlacementStyle(type) {
        const state = STATES.get(type) || null;
        if (!state) return null;
        const iconSize = this.#getEffectiveIconSizeStatic(state);
        return {
            ...state,
            iconSize,
            labelFontSize: this.#getEffectiveLabelFontSizeStatic(state, iconSize),
            labelFontFamily: SiteLabelManager.resolveFontFamily(state)
        };
    }

    static transformPlacementStyle(type, { rotationDelta = 0, iconSizeDelta = 0, resetIconSize = false } = {}) {
        const state = STATES.get(type);
        if (!state) return null;

        if (rotationDelta) {
            state.rotation = this.#normalizeRotation(Number(state.rotation || 0) + Number(rotationDelta || 0));
        }

        if (resetIconSize) {
            state.iconSizeMode = "scene-default";
            state.customIconSize = null;
            state.labelFontSizeMode = "auto";
            state.customLabelFontSize = null;
        } else if (iconSizeDelta) {
            state.iconSizeMode = "custom";
            state.customIconSize = this.#clampIconSizeStatic(this.#getEffectiveIconSizeStatic(state) + Number(iconSizeDelta || 0));
            state.labelFontSizeMode = "auto";
            state.customLabelFontSize = null;
        }

        Hooks.callAll("augurNexusEntityPlacementStyleChanged", type);
        return this.getPlacementStyle(type);
    }

    static getActiveEntityType(activeTab) {
        return this.isEntityTab(activeTab) ? activeTab : null;
    }

    static async createEntityForPlacement(type) {
        const config = CONFIGS[type];
        const state = STATES.get(type);
        if (!config || !state) return null;

        if (state.mode === "existing") {
            const entity = config.list({ search: "" }).find(row => row.id === state.selectedEntityId) || null;
            if (!entity) {
                ui.notifications.warn(`Choose an existing ${config.label.toLowerCase()} before placing.`);
                return null;
            }
            return { entity, created: false };
        }

        if (!state.candidate) {
            const tab = state.controller;
            if (!tab) return null;
            await tab.generateCandidate();
        }
        if (!state.candidate) return null;

        const entity = await config.create(state.candidate);
        state.candidate = null;
        state.lastPlacedEntityId = entity?.id || "";
        return entity ? { entity, created: true } : null;
    }

    async _prepareContext() {
        const state = this.#state;
        state.controller = this;

        const generators = this.config.getGenerators();
        if (state.selectedGeneratorId === null && generators.length) state.selectedGeneratorId = generators[0].id;
        const selectedGeneratorId = state.selectedGeneratorId || "";
        const generatorOptions = selectedGeneratorId ? await this.config.getGeneratorOptions(selectedGeneratorId) : {};
        const optionGroups = this.#buildOptionGroups(generatorOptions);
        const existingRows = this.#getExistingRows(state.search);
        if (state.mode === "existing" && existingRows.length && !existingRows.some(row => row.id === state.selectedEntityId)) {
            state.selectedEntityId = existingRows[0].id;
        }
        if (state.mode !== "existing" && selectedGeneratorId && !state.candidate && !state.isGeneratingCandidate) {
            try {
                await this.generateCandidate({ render: false });
            } catch (err) {
                console.warn(`Augur: Nexus | Failed to generate initial ${this.config.label} candidate.`, err);
            }
        }

        const candidateProfile = state.candidate ? this.config.viewModel.fromCandidate(state.candidate, {
            emptyTraitsLabel: "No personality traits rolled.",
            emptyLabel: `No ${this.config.label.toLowerCase()} profile details selected.`
        }) : null;
        const candidateHtml = candidateProfile
            ? await foundry.applications.handlebars.renderTemplate(this.config.profilePartial, { profile: candidateProfile })
            : "";
        const style = this.#getStyleContext();

        const context = {
            entityType: this.type,
            isNpc: this.type === "npc",
            isShip: this.type === "ship",
            isFaction: this.type === "faction",
            label: this.config.label,
            plural: this.config.plural,
            icon: this.config.icon,
            mode: state.mode,
            isNewMode: state.mode !== "existing",
            isExistingMode: state.mode === "existing",
            hasProvider: generators.length > 0,
            promoTitle: this.config.promoTitle,
            promoText: this.config.promoText,
            patreonUrl: PATREON_URL,
            fantasyComingSoon: true,
            generators: generators.map(generator => ({
                ...generator,
                selected: generator.id === selectedGeneratorId
            })),
            selectedGeneratorId,
            hasGeneratorSelected: !!selectedGeneratorId,
            optionGroups,
            hasOptionGroups: optionGroups.length > 0,
            compactGeneratorControls: optionGroups.length === 1,
            candidate: state.candidate ? {
                profile: candidateProfile,
                html: candidateHtml,
                data: state.candidate
            } : null,
            hasCandidate: !!state.candidate,
            search: state.search || "",
            existingRows,
            hasExistingRows: existingRows.length > 0,
            selectedEntityId: state.selectedEntityId || "",
            ...style
        };
        context.advancedHtml = await foundry.applications.handlebars.renderTemplate(
            "modules/augur-nexus/templates/site/parts/placement-style-advanced.hbs",
            context
        );
        return context;
    }

    _attachPartListeners(partId, htmlElement) {
        const el = htmlElement instanceof HTMLElement ? htmlElement : htmlElement[0];
        if (!el) return;
        const root = el.querySelector(`[data-entity-placement="${this.type}"]`);
        if (!root) return;

        root.querySelectorAll("[data-entity-mode]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                this.#state.mode = event.currentTarget.dataset.entityMode === "existing" ? "existing" : "new";
                this.render();
            });
        });

        root.querySelector("[name='generatorId']")?.addEventListener("change", event => {
            this.#state.selectedGeneratorId = event.currentTarget.value || "";
            this.#resetOptionState();
            this.#state.candidate = null;
            this.render();
        });

        for (const group of this.config.optionGroups) {
            root.querySelector(`[name='${group.name}']`)?.addEventListener("change", event => {
                this.#state.options[group.key] = event.currentTarget.value || "random";
                if (this.#state.candidate) this.generateCandidate();
            });
        }

        root.querySelector("[name='entitySearch']")?.addEventListener("input", event => {
            this.#state.search = event.currentTarget.value || "";
            this.render();
        });

        root.querySelectorAll("[data-existing-entity-id]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                this.#state.selectedEntityId = event.currentTarget.dataset.existingEntityId || "";
                this.render();
            });
        });

        root.querySelector("[data-action='generateCandidate']")?.addEventListener("click", event => {
            event.preventDefault();
            this.generateCandidate();
        });

        root.querySelector("[data-action='rerollCandidate']")?.addEventListener("click", event => {
            event.preventDefault();
            this.generateCandidate();
        });

        root.querySelector("[data-action='editCandidate']")?.addEventListener("click", event => {
            event.preventDefault();
            if (!this.#state.candidate) return;
            this.config.editor.show({
                candidate: this.#state.candidate,
                onSave: updated => {
                    this.#state.candidate = updated;
                    this.render();
                }
            });
        });

        root.querySelector("[data-action='clearCandidate']")?.addEventListener("click", event => {
            event.preventDefault();
            this.#state.candidate = null;
            this.render();
        });

        root.querySelector("[data-action='openSelectedEntity']")?.addEventListener("click", async event => {
            event.preventDefault();
            if (this.#state.selectedEntityId) await this.config.open(this.#state.selectedEntityId);
        });

        root.querySelector("[data-action='openPatreon']")?.addEventListener("click", event => {
            event.preventDefault();
            window.open(PATREON_URL, "_blank", "noopener,noreferrer");
        });

        this.#attachStyleListeners(root);
    }

    render(force, options) {
        return this.app?.render(force, options);
    }

    async generateCandidate({ render = true } = {}) {
        const generatorId = this.#state.selectedGeneratorId || "";
        if (!generatorId) return;
        const options = {};
        for (const group of this.config.optionGroups) {
            options[group.key] = this.#state.options[group.key] || "random";
        }
        this.#state.isGeneratingCandidate = true;
        try {
            this.#state.candidate = await this.config.generate(generatorId, options);
        } finally {
            this.#state.isGeneratingCandidate = false;
        }
        if (render) this.render();
    }

    #buildOptionGroups(generatorOptions = {}) {
        return this.config.optionGroups
            .map(group => {
                const selected = this.#state.options[group.key] || generatorOptions.defaults?.[group.defaultKey] || "random";
                this.#state.options[group.key] = selected;
                const options = this.#buildOptions(generatorOptions[group.source] || [], selected);
                return {
                    ...group,
                    options,
                    hasOptions: options.length > 0
                };
            })
            .filter(group => group.hasOptions);
    }

    #buildOptions(options = [], selectedId = "random") {
        const rows = options.map(option => ({
            ...option,
            selected: option.id === selectedId
        }));
        if (!rows.some(option => option.id === "random")) {
            rows.unshift({ id: "random", label: "Any", selected: selectedId === "random" });
        }
        return rows.map(option => ({
            ...option,
            label: option.id === "random" ? "Any" : option.label
        }));
    }

    #getExistingRows(search = "") {
        return this.config.list({ search }).map(entity => ({
            id: entity.id,
            name: this.config.model.getName(entity),
            subtitle: this.config.model.getSubtitle(entity),
            imageSrc: this.config.model.getImage(entity),
            accent: this.config.model.getAccent(entity),
            selected: entity.id === this.#state.selectedEntityId
        }));
    }

    #resetOptionState() {
        this.#state.options = {};
    }

    #getDefaultState() {
        return {
            mode: "new",
            selectedGeneratorId: null,
            selectedEntityId: "",
            search: "",
            options: {},
            advancedOpen: false,
            iconSizeMode: "scene-default",
            customIconSize: null,
            rotation: 0,
            showLabel: true,
            labelFontSizeMode: "auto",
            customLabelFontSize: null,
            labelFontFamily: SiteLabelManager.FONT_FAMILY,
            labelColor: SiteCreateTab.DEFAULT_COLOR,
            snapToGrid: false,
            candidate: null,
            isGeneratingCandidate: false,
            controller: null,
            lastPlacedEntityId: ""
        };
    }

    #getStyleContext() {
        const state = this.#state;
        const iconSize = this.#getEffectiveIconSize();
        const labelFontSize = this.#getEffectiveLabelFontSize(iconSize);
        return {
            advancedOpen: !!state.advancedOpen,
            selectedIconSize: iconSize,
            rotation: EntityPlacementTab.#normalizeRotation(state.rotation),
            iconSizeUsesSceneDefault: state.iconSizeMode !== "custom",
            showResetIconSize: true,
            showLabel: state.showLabel !== false,
            showLabelToggleInAdvanced: true,
            selectedLabelFontSize: labelFontSize,
            labelFontSizeUsesAuto: state.labelFontSizeMode !== "custom",
            showResetLabelFontSize: true,
            minLabelFontSize: SiteLabelManager.MIN_FONT_SIZE,
            maxLabelFontSize: SiteLabelManager.MAX_FONT_SIZE,
            selectedLabelFontFamily: SiteLabelManager.resolveFontFamily(state),
            labelFontOptions: SiteLabelManager.FONT_OPTIONS,
            selectedLabelColor: state.labelColor || SiteCreateTab.DEFAULT_COLOR,
            showLabelColorControls: true,
            colors: SiteCreateTab.COLOR_OPTIONS,
            showSnapToGrid: true,
            snapToGrid: !!state.snapToGrid,
            showRandomizeToggle: false
        };
    }

    #attachStyleListeners(root) {
        const state = this.#state;
        const advancedDetails = root.querySelector("[data-placement-advanced]");
        const iconSizeInput = root.querySelector("input[name='iconSize']");
        const iconSizeValue = root.querySelector("[data-site-icon-size-value]");
        const labelFontSizeInput = root.querySelector("input[name='labelFontSize']");
        const labelFontSizeValue = root.querySelector("[data-site-label-font-size-value]");
        const resetIconSizeButton = root.querySelector("[data-action='resetIconSize']");
        const resetLabelFontSizeButton = root.querySelector("[data-action='resetLabelFontSize']");
        const labelFontFamilySelect = root.querySelector("select[name='labelFontFamily']");
        const showLabelCheckbox = root.querySelector("input[name='showLabel']");
        const snapToGridCheckbox = root.querySelector("input[name='snapToGrid']");

        advancedDetails?.addEventListener("toggle", event => {
            state.advancedOpen = !!event.currentTarget.open;
        });

        iconSizeInput?.addEventListener("input", event => {
            const nextSize = this.#clampIconSize(event.currentTarget.value);
            state.iconSizeMode = "custom";
            state.customIconSize = nextSize;
            state.labelFontSizeMode = "auto";
            state.customLabelFontSize = null;
            const nextLabelFontSize = this.#getEffectiveLabelFontSize(nextSize);
            if (iconSizeValue) iconSizeValue.textContent = String(nextSize);
            if (labelFontSizeInput) labelFontSizeInput.value = String(nextLabelFontSize);
            if (labelFontSizeValue) labelFontSizeValue.textContent = String(nextLabelFontSize);
            if (resetIconSizeButton) resetIconSizeButton.disabled = false;
            if (resetLabelFontSizeButton) resetLabelFontSizeButton.disabled = true;
            this.#notifyStyleChanged();
        });

        labelFontSizeInput?.addEventListener("input", event => {
            state.labelFontSizeMode = "custom";
            state.customLabelFontSize = SiteLabelManager.clampFontSize(event.currentTarget.value);
            if (labelFontSizeValue) labelFontSizeValue.textContent = String(this.#getEffectiveLabelFontSize());
            if (resetLabelFontSizeButton) resetLabelFontSizeButton.disabled = false;
            this.#notifyStyleChanged();
        });

        resetIconSizeButton?.addEventListener("click", event => {
            event.preventDefault();
            state.iconSizeMode = "scene-default";
            state.customIconSize = null;
            state.labelFontSizeMode = "auto";
            state.customLabelFontSize = null;
            const nextSize = this.#getEffectiveIconSize();
            const nextLabelFontSize = this.#getEffectiveLabelFontSize(nextSize);
            if (iconSizeInput) iconSizeInput.value = String(nextSize);
            if (iconSizeValue) iconSizeValue.textContent = String(nextSize);
            if (labelFontSizeInput) labelFontSizeInput.value = String(nextLabelFontSize);
            if (labelFontSizeValue) labelFontSizeValue.textContent = String(nextLabelFontSize);
            resetIconSizeButton.disabled = true;
            if (resetLabelFontSizeButton) resetLabelFontSizeButton.disabled = true;
            this.#notifyStyleChanged();
            this.render();
        });

        resetLabelFontSizeButton?.addEventListener("click", event => {
            event.preventDefault();
            state.labelFontSizeMode = "auto";
            state.customLabelFontSize = null;
            const nextSize = this.#getEffectiveLabelFontSize();
            if (labelFontSizeInput) labelFontSizeInput.value = String(nextSize);
            if (labelFontSizeValue) labelFontSizeValue.textContent = String(nextSize);
            resetLabelFontSizeButton.disabled = true;
            this.#notifyStyleChanged();
            this.render();
        });

        labelFontFamilySelect?.addEventListener("change", event => {
            state.labelFontFamily = SiteLabelManager.resolveFontFamily({ labelFontFamily: event.currentTarget.value });
            this.#notifyStyleChanged();
        });

        showLabelCheckbox?.addEventListener("change", event => {
            state.showLabel = !!event.currentTarget.checked;
            this.#notifyStyleChanged();
            this.render();
        });

        snapToGridCheckbox?.addEventListener("change", event => {
            state.snapToGrid = !!event.currentTarget.checked;
            this.#notifyStyleChanged();
        });

        root.querySelectorAll("[data-placement-label-color]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                state.labelColor = event.currentTarget.dataset.placementLabelColor || SiteCreateTab.DEFAULT_COLOR;
                this.#notifyStyleChanged();
                this.render();
            });
        });
    }

    #clampIconSize(value) {
        return EntityPlacementTab.#clampIconSizeStatic(value);
    }

    #getSceneDefaultIconSize() {
        return EntityPlacementTab.#getSceneDefaultIconSizeStatic();
    }

    #getEffectiveIconSize() {
        return EntityPlacementTab.#getEffectiveIconSizeStatic(this.#state);
    }

    #getEffectiveLabelFontSize(iconSize = null) {
        return EntityPlacementTab.#getEffectiveLabelFontSizeStatic(this.#state, iconSize ?? this.#getEffectiveIconSize());
    }

    static #clampIconSizeStatic(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return 100;
        return Math.min(SiteCreateTab.MAX_ICON_SIZE, Math.max(SiteCreateTab.MIN_ICON_SIZE, Math.round(numeric)));
    }

    static #getEffectiveIconSizeStatic(state = {}) {
        if (state.iconSizeMode !== "custom") return this.#getSceneDefaultIconSizeStatic();
        return this.#clampIconSizeStatic(state.customIconSize ?? state.iconSize ?? 100);
    }

    static #getEffectiveLabelFontSizeStatic(state = {}, iconSize = null) {
        const resolvedIconSize = iconSize ?? this.#getEffectiveIconSizeStatic(state);
        if (state.labelFontSizeMode !== "custom") return SiteLabelManager.getDefaultFontSize(resolvedIconSize);
        return SiteLabelManager.clampFontSize(state.customLabelFontSize ?? state.labelFontSize);
    }

    static #getSceneDefaultIconSizeStatic() {
        const sceneGridSize = canvas.grid?.size ?? canvas.dimensions?.size ?? 100;
        return this.#clampIconSizeStatic(sceneGridSize);
    }

    static #normalizeRotation(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return 0;
        return ((Math.round(numeric) % 360) + 360) % 360;
    }

    #notifyStyleChanged() {
        Hooks.callAll("augurNexusEntityPlacementStyleChanged", this.type);
    }

    get #state() {
        if (!STATES.has(this.type)) STATES.set(this.type, this.#getDefaultState());
        return STATES.get(this.type);
    }
}
