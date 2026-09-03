// Create tab for the Sites workspace. This owns placement state, persistence, and create-form listeners.

import { Log } from "../../../../support/utils/Logger.js";
import { SiteIconPicker } from "../SiteIconPicker.js";
import { SiteScenePicker } from "../SiteScenePicker.js";
import { isNexusSiteToolSuppressedScene } from "../../../../support/toolbar/NexusToolContext.js";
import { NexusImageSceneManager } from "../../../nexus/services/NexusImageSceneManager.js";
import { getDefaultSiteGenre, getSiteGenre, getSiteGenres } from "../../registry/SiteGenreRegistry.js";
import { getSiteSceneType, getSiteSceneTypes } from "../../registry/SiteSceneTypeRegistry.js";
import { SiteLabelManager } from "../../services/SiteLabelManager.js";

const MODULE_ID = "augur-nexus";
const FilePicker = foundry.applications.apps.FilePicker.implementation;

export class SiteCreateTab {
    static TOOL_NAME = "nexus-sites";
    static DEFAULT_GENRE_ID = getDefaultSiteGenre().id;
    static DEFAULT_THEME_ID = "castle";
    static DEFAULT_SIZE_ID = "small";
    static DEFAULT_NAME = "Ancient Site";
    static DEFAULT_COLOR = "#ffffff";
    static DEFAULT_MAP_COLOR_ID = "green";
    static MIN_ICON_SIZE = 50;
    static MAX_ICON_SIZE = 256;
    static ROOM_COUNT_BY_SIZE = {
        small: 5,
        medium: 8,
        large: 12,
        sprawling: 16
    };
    static SIZE_OPTIONS = [
        { id: "small", label: "Small" },
        { id: "medium", label: "Medium" },
        { id: "large", label: "Large" },
        { id: "sprawling", label: "Sprawling" }
    ];
    static COLOR_OPTIONS = [
        { value: "#ffffff", label: "White" },
        { value: "#f4d35e", label: "Gold" },
        { value: "#ff8c42", label: "Orange" },
        { value: "#ff5964", label: "Red" },
        { value: "#c77dff", label: "Violet" },
        { value: "#7bdff2", label: "Cyan" },
        { value: "#4ecdc4", label: "Teal" },
        { value: "#95d36e", label: "Lime" }
    ];
    static MAP_COLOR_OPTIONS = [
        { id: "blue", label: "Blue", value: "#57b3ff" },
        { id: "green", label: "Green", value: "#7de37d" },
        { id: "yellow", label: "Yellow", value: "#e6d36a" },
        { id: "orange", label: "Orange", value: "#ff9b4a" },
        { id: "red", label: "Red", value: "#ff6262" },
        { id: "magenta", label: "Magenta", value: "#d96cff" },
        { id: "white", label: "White", value: "#f3f4f6" }
    ];
    static ICON_ROLE_OPTIONS = [
        { id: "landmark", label: "Landmark" },
        { id: "entrance", label: "Entrance" }
    ];

    static #iconCatalogs = new Map();
    static #themeCatalogs = new Map();
    static #app = null;
    static #generatedName = SiteCreateTab.DEFAULT_NAME;
    static #nameDirty = false;
    static #advancedOpen = false;
    static #state = {
        siteName: SiteCreateTab.DEFAULT_NAME,
        genreId: SiteCreateTab.DEFAULT_GENRE_ID,
        themeId: SiteCreateTab.DEFAULT_THEME_ID,
        sceneType: "empty",
        linkedSceneId: null,
        linkedSceneName: "",
        sceneImageSrc: "",
        sceneImageName: "",
        sceneTypePresetId: null,
        sceneTypeBiomeId: null,
        sizeId: SiteCreateTab.DEFAULT_SIZE_ID,
        iconRole: "landmark",
        iconId: null,
        customIconSrc: "",
        iconColor: SiteCreateTab.DEFAULT_COLOR,
        iconSizeMode: "scene-default",
        customIconSize: null,
        rotation: 0,
        labelFontSizeMode: "auto",
        customLabelFontSize: null,
        labelFontFamily: SiteLabelManager.FONT_FAMILY,
        labelColor: SiteCreateTab.DEFAULT_COLOR,
        showLabel: true,
        mapColorId: SiteCreateTab.DEFAULT_MAP_COLOR_ID,
        snapToGrid: false,
        autoSortScenes: true,
        randomizeAfterPlacement: false
    };

    constructor(app = null) {
        this.app = app;
        SiteCreateTab.#app = app;
    }

    render(force, options) {
        return this.app?.render(force, options);
    }

    static loadPersistentState() {
        this.#loadPersistentState();
    }

    static getState() {
        const icon = this.getSelectedIcon();
        const theme = this.getSelectedTheme();
        const sizeId = this.#state.sizeId;
        const sceneType = this.#getCurrentSceneType();

        return {
            siteName: this.#state.siteName,
            genreId: this.#state.genreId,
            genreLabel: this.#getCurrentGenre().label,
            themeId: this.#state.themeId,
            themeLabel: theme?.label || "Site",
            sceneType: sceneType?.id || "empty",
            sceneTypeLabel: sceneType?.label || "Empty Scene",
            linkedSceneId: this.#state.linkedSceneId || null,
            linkedSceneName: this.#state.linkedSceneName || "",
            sceneImageSrc: this.#state.sceneImageSrc || "",
            sceneImageName: this.#state.sceneImageName || "",
            sceneTypePresetId: this.#state.sceneTypePresetId || sceneType?.defaultPresetId || "",
            sceneTypePresetLabel: this.#getCurrentSceneTypePreset()?.label || "",
            sceneTypeBiomeId: this.#state.sceneTypeBiomeId || sceneType?.defaultBiomeId || "",
            sceneTypeBiomeLabel: this.#getCurrentSceneTypeBiome()?.label || "",
            sceneTypeBiomeIconSrc: this.#getCurrentSceneTypeBiome()?.iconSrc || "",
            sceneTypeBiomeFieldLabel: sceneType?.biomeLabel || "Biome",
            sceneTypeNameLabel: sceneType?.siteNameLabel || "Site Name",
            sceneTypeNamePlaceholder: sceneType?.siteNamePlaceholder || "Site",
            sizeId,
            sizeLabel: this.getSizeLabel(sizeId),
            iconRole: this.#state.iconRole || "landmark",
            iconRoleLabel: this.getIconRoleLabel(this.#state.iconRole),
            roomCount: this.ROOM_COUNT_BY_SIZE[sizeId] || this.ROOM_COUNT_BY_SIZE[this.DEFAULT_SIZE_ID],
            iconId: this.#state.iconId || icon?.id || null,
            iconSrc: icon?.src || "",
            customIconSrc: this.#state.customIconSrc || "",
            iconColor: this.#state.iconColor || this.DEFAULT_COLOR,
            iconSize: this.#getEffectiveIconSize(),
            rotation: this.#normalizeRotation(this.#state.rotation),
            iconSizeUsesSceneDefault: this.#state.iconSizeMode !== "custom",
            labelFontSize: this.#getEffectiveLabelFontSize(),
            labelFontSizeUsesAuto: this.#state.labelFontSizeMode !== "custom",
            labelFontFamily: SiteLabelManager.resolveFontFamily(this.#state),
            labelColor: this.#state.labelColor || this.#state.iconColor || this.DEFAULT_COLOR,
            showLabel: this.#state.showLabel !== false,
            mapColorId: this.#state.mapColorId || this.DEFAULT_MAP_COLOR_ID,
            mapColorLabel: this.getMapColorLabel(this.#state.mapColorId),
            mapColorValue: this.getMapColorValue(this.#state.mapColorId),
            snapToGrid: this.#state.snapToGrid !== false,
            autoSortScenes: this.#state.autoSortScenes !== false,
            randomizeAfterPlacement: !!this.#state.randomizeAfterPlacement,
            showPresetControls: !!sceneType?.showPresetControls && (sceneType?.presetOptions?.length > 0),
            sceneTypePresetOptions: sceneType?.presetOptions || [],
            showBiomeControls: !!sceneType?.showBiomeControls && (sceneType?.biomeOptions?.length > 0),
            showVisualBiomeControls: !!sceneType?.showBiomeControls && (sceneType?.biomeOptions?.some(option => !!option.iconSrc)),
            showImageControls: !!sceneType?.showImageControls,
            sceneTypeBiomeOptions: sceneType?.biomeOptions || [],
            sceneTypeAvailable: sceneType?.available !== false,
            sceneTypeRequiresLabel: sceneType?.requiresLabel || "",
            sceneTypeRequiresVersion: sceneType?.minimumModuleVersion || "",
            sceneTypeRequiresText: SiteCreateTab.#getSceneTypeRequirementText(sceneType),
            sceneTypeRequiresUrl: sceneType?.requiresUrl || ""
        };
    }

    static clearLinkedSceneSelection() {
        this.#setLinkedScene(null);
        this.#savePersistentState();
        this.#app?.render();
    }
    static async getIconCatalog(genreId = this.#state.genreId) {
        if (this.#iconCatalogs.has(genreId)) return this.#iconCatalogs.get(genreId);
        const genre = getSiteGenre(genreId);

        try {
            const response = await fetch(genre.iconCatalogPath);
            if (!response.ok) throw new Error(`Failed to load icon catalog (${response.status}).`);
            const catalog = await response.json();
            this.#iconCatalogs.set(genreId, catalog);
            return catalog;
        } catch (err) {
            Log.error("Failed to load site icon catalog.", err);
            const fallback = { icons: [] };
            this.#iconCatalogs.set(genreId, fallback);
            return fallback;
        }
    }

    static async getThemeCatalog(genreId = this.#state.genreId) {
        if (this.#themeCatalogs.has(genreId)) return this.#themeCatalogs.get(genreId);
        const genre = getSiteGenre(genreId);

        try {
            const response = await fetch(genre.themeCatalogPath);
            if (!response.ok) throw new Error(`Failed to load site theme catalog (${response.status}).`);
            const catalog = await response.json();
            this.#themeCatalogs.set(genreId, catalog);
            this.#normalizeState();
            return catalog;
        } catch (err) {
            Log.error("Failed to load site theme catalog.", err);
            const fallback = { themes: [] };
            this.#themeCatalogs.set(genreId, fallback);
            return fallback;
        }
    }

    static async getAllBuiltInIcons() {
        const genres = getSiteGenres();
        const catalogs = await Promise.all(genres.map(genre => this.getIconCatalog(genre.id)));
        return catalogs.flatMap((catalog, index) => {
            const genre = genres[index];
            return (catalog?.icons || []).map(icon => ({
                ...icon,
                genreId: genre.id,
                genreLabel: genre.label
            }));
        });
    }

    static getSelectedTheme() {
        const themes = this.#getSortedThemes();
        return themes.find(theme => theme.id === this.#state.themeId) || themes[0] || null;
    }

    static getSelectedIcon() {
        const icons = this.#iconCatalogs.get(this.#state.genreId)?.icons || [];
        return this.#resolveIconSelection(icons);
    }

    static async randomizeNextSite() {
        const sceneType = this.#getCurrentSceneType();
        if (sceneType?.randomizeBiomeOnNextSite) {
            this.#randomizeSceneTypeBiomeSelection({ preserveGeneratedName: true });
        }

        if (typeof sceneType?.suggestName === "function" && !sceneType?.showThemeControls) {
            const nextName = this.#getSuggestedSiteName();
            const currentName = (this.#state.siteName || "").trim();
            const previousGeneratedName = this.#generatedName;
            if (!currentName || currentName === previousGeneratedName || !this.#nameDirty) {
                this.#state.siteName = nextName;
                this.#nameDirty = false;
            }
            this.#generatedName = nextName;
            this.#savePersistentState();
            this.#app?.render();
            return;
        }

        await this.getThemeCatalog();
        const themes = this.#getSortedThemes();
        if (!themes.length) return;

        const nextTheme = themes[Math.floor(Math.random() * themes.length)];
        this.#applyThemeSelection(nextTheme.id);
        this.#savePersistentState();
        this.#app?.render();
    }

    static getSizeLabel(sizeId) {
        return this.SIZE_OPTIONS.find(size => size.id === sizeId)?.label || "Small";
    }

    static getIconRoleLabel(iconRole) {
        return this.ICON_ROLE_OPTIONS.find(option => option.id === iconRole)?.label || "Landmark";
    }

    static getMapColorLabel(mapColorId) {
        return this.MAP_COLOR_OPTIONS.find(option => option.id === mapColorId)?.label || "Green";
    }

    static getMapColorValue(mapColorId) {
        return this.MAP_COLOR_OPTIONS.find(option => option.id === mapColorId)?.value || "#7de37d";
    }

    static #getDefaultPersistentState() {
        return {
            genreId: this.DEFAULT_GENRE_ID,
            themeId: this.DEFAULT_THEME_ID,
            sceneType: "empty",
            sceneTypePresetId: null,
            sceneTypeBiomeId: null,
            sceneImageSrc: "",
            sceneImageName: "",
            sizeId: this.DEFAULT_SIZE_ID,
            iconRole: "landmark",
            iconId: null,
            customIconSrc: "",
            iconColor: this.DEFAULT_COLOR,
            iconSizeMode: "scene-default",
            customIconSize: null,
            rotation: 0,
            labelFontSizeMode: "auto",
            customLabelFontSize: null,
            labelFontFamily: SiteLabelManager.FONT_FAMILY,
            labelColor: this.DEFAULT_COLOR,
            showLabel: true,
            mapColorId: this.DEFAULT_MAP_COLOR_ID,
            snapToGrid: false,
            autoSortScenes: true,
            randomizeAfterPlacement: false
        };
    }

    static #getPersistentStateSnapshot() {
        return {
            genreId: this.#state.genreId,
            themeId: this.#state.themeId,
            sceneType: this.#state.sceneType || "empty",
            sceneTypePresetId: this.#state.sceneTypePresetId || null,
            sceneTypeBiomeId: this.#state.sceneTypeBiomeId || null,
            sceneImageSrc: this.#state.sceneImageSrc || "",
            sceneImageName: this.#state.sceneImageName || "",
            sizeId: this.#state.sizeId,
            iconRole: this.#state.iconRole || "landmark",
            iconId: this.#state.iconId,
            customIconSrc: this.#state.customIconSrc || "",
            iconColor: this.#state.iconColor,
            iconSizeMode: this.#state.iconSizeMode === "custom" ? "custom" : "scene-default",
            customIconSize: this.#state.customIconSize,
            rotation: this.#normalizeRotation(this.#state.rotation),
            labelFontSizeMode: this.#state.labelFontSizeMode === "custom" ? "custom" : "auto",
            customLabelFontSize: this.#state.customLabelFontSize,
            labelFontFamily: SiteLabelManager.resolveFontFamily(this.#state),
            labelColor: this.#state.labelColor || this.#state.iconColor || this.DEFAULT_COLOR,
            showLabel: this.#state.showLabel !== false,
            mapColorId: this.#state.mapColorId,
            snapToGrid: this.#state.snapToGrid !== false,
            autoSortScenes: this.#state.autoSortScenes !== false,
            randomizeAfterPlacement: !!this.#state.randomizeAfterPlacement
        };
    }

    static #loadPersistentState() {
        if (!game?.settings) return;
        const persisted = game.settings.get(MODULE_ID, "siteGeneratorState") || {};
        this.#state = {
            ...this.#state,
            ...this.#getDefaultPersistentState(),
            ...persisted,
            linkedSceneId: null,
            linkedSceneName: ""
        };
    }

    static #savePersistentState() {
        if (!game?.settings) return;
        void game.settings.set(MODULE_ID, "siteGeneratorState", this.#getPersistentStateSnapshot());
    }

    static #getCurrentGenre() {
        return getSiteGenre(this.#state.genreId);
    }

    static #getCurrentSceneType() {
        return getSiteSceneType(this.#state.sceneType);
    }

    static #getCurrentSceneTypePreset() {
        const sceneType = this.#getCurrentSceneType();
        const options = sceneType?.presetOptions || [];
        return options.find(option => option.id === this.#state.sceneTypePresetId) || options[0] || null;
    }

    static #getCurrentSceneTypeBiome() {
        const sceneType = this.#getCurrentSceneType();
        const options = sceneType?.biomeOptions || [];
        return options.find(option => option.id === this.#state.sceneTypeBiomeId) || options[0] || null;
    }

    static #getSceneTypeIconSelection() {
        const sceneType = this.#getCurrentSceneType();
        if (sceneType?.siteIconSource !== "sceneTypeBiome") return null;

        const option = this.#getCurrentSceneTypeBiome();
        if (!option?.iconSrc) return null;

        return {
            id: `${sceneType.id}:${option.id}`,
            label: option.label || sceneType.biomeLabel || "Scene Type Icon",
            src: option.iconSrc,
            role: this.#state.iconRole || "landmark"
        };
    }

    static #getSceneDefaultIconSize() {
        const sceneGridSize = canvas.grid?.size ?? canvas.dimensions?.size ?? 100;
        return this.#clampIconSize(sceneGridSize);
    }

    static #getEffectiveIconSize() {
        if (this.#state.iconSizeMode !== "custom") {
            return this.#getSceneDefaultIconSize();
        }
        return this.#clampIconSize(this.#state.customIconSize);
    }

    static #getEffectiveLabelFontSize() {
        const iconSize = this.#getEffectiveIconSize();
        if (this.#state.labelFontSizeMode !== "custom") {
            return SiteLabelManager.getDefaultFontSize(iconSize);
        }
        return SiteLabelManager.clampFontSize(this.#state.customLabelFontSize);
    }

    static #resetLabelFontSizeToAuto() {
        this.#state.labelFontSizeMode = "auto";
        this.#state.customLabelFontSize = null;
    }

    static transformPlacementStyle({ rotationDelta = 0, iconSizeDelta = 0, resetIconSize = false } = {}) {
        if (rotationDelta) {
            this.#state.rotation = this.#normalizeRotation(Number(this.#state.rotation || 0) + Number(rotationDelta || 0));
        }

        if (resetIconSize) {
            this.#state.iconSizeMode = "scene-default";
            this.#state.customIconSize = null;
            this.#resetLabelFontSizeToAuto();
        } else if (iconSizeDelta) {
            const nextSize = this.#clampIconSize(this.#getEffectiveIconSize() + Number(iconSizeDelta || 0));
            this.#state.iconSizeMode = "custom";
            this.#state.customIconSize = nextSize;
            this.#resetLabelFontSizeToAuto();
        }

        this.#savePersistentState();
        return this.getState();
    }

    static #clampIconSize(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return 100;
        return Math.min(this.MAX_ICON_SIZE, Math.max(this.MIN_ICON_SIZE, Math.round(numeric)));
    }

    static #normalizeRotation(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return 0;
        return ((Math.round(numeric) % 360) + 360) % 360;
    }

    static #getSortedThemes() {
        return [...(this.#themeCatalogs.get(this.#state.genreId)?.themes || [])].sort((a, b) => (a.label || "").localeCompare(b.label || ""));
    }

    static #resolveIconSelection(icons = []) {
        const iconRole = this.#state.iconRole || "landmark";
        const sceneTypeIcon = this.#getSceneTypeIconSelection();
        if (sceneTypeIcon) return sceneTypeIcon;

        if (this.#state.customIconSrc) {
            return {
                id: this.#state.iconId || "custom",
                label: this.#state.iconId === "custom" ? "Custom Icon" : "Selected Icon",
                src: this.#state.customIconSrc,
                role: iconRole
            };
        }

        if (!icons.length) return null;

        const matchingIcons = icons.filter(icon => (icon.role || "landmark") === iconRole);
        const selectedIcon = icons.find(icon => icon.id === this.#state.iconId);
        if (selectedIcon && (selectedIcon.role || "landmark") === iconRole) {
            return selectedIcon;
        }

        const sceneTypeDefaultIconId = this.#getCurrentSceneType()?.defaultIconId || null;
        if (sceneTypeDefaultIconId) {
            const sceneTypeDefault = icons.find(icon => icon.id === sceneTypeDefaultIconId && (icon.role || "landmark") === iconRole);
            if (sceneTypeDefault) return sceneTypeDefault;
        }

        const theme = this.getSelectedTheme();
        const defaultIconByRole = theme?.defaultIconByRole || {};
        const defaultIconId = defaultIconByRole[iconRole] || theme?.iconId || null;
        if (defaultIconId) {
            const roleDefault = icons.find(icon => icon.id === defaultIconId && (icon.role || "landmark") === iconRole);
            if (roleDefault) return roleDefault;
        }

        return matchingIcons[0] || icons[0] || null;
    }

    static #pickSuggestedName(theme) {
        const names = theme?.defaultNames || [];
        if (!names.length) return this.DEFAULT_NAME;
        const index = Math.floor(Math.random() * names.length);
        return names[index];
    }

    static #getSuggestedSiteName() {
        const sceneType = this.#getCurrentSceneType();
        if (this.#state.sceneType === "existing") {
            return this.#state.linkedSceneName || "Linked Scene";
        }
        if (typeof sceneType?.suggestName === "function") {
            return sceneType.suggestName(this.getState()) || this.DEFAULT_NAME;
        }
        const sceneTypePreset = this.#getCurrentSceneTypePreset();
        if (sceneTypePreset?.suggestedName) {
            return sceneTypePreset.suggestedName;
        }
        const sceneTypeBiome = this.#getCurrentSceneTypeBiome();
        if (sceneTypeBiome?.suggestedName) {
            return sceneTypeBiome.suggestedName;
        }
        return this.#pickSuggestedName(this.getSelectedTheme()) || this.DEFAULT_NAME;
    }

    static #getThemeDefaultIconId(theme = this.getSelectedTheme(), iconRole = this.#state.iconRole) {
        const defaultIconByRole = theme?.defaultIconByRole || {};
        return defaultIconByRole[iconRole] || theme?.iconId || null;
    }

    static #getSceneTypeRequirementText(sceneType) {
        if (!sceneType?.requiresLabel) return "";
        if (sceneType.minimumModuleVersion) {
            return `${sceneType.requiresLabel} Module ${sceneType.minimumModuleVersion}+ required`;
        }
        return `${sceneType.requiresLabel} Module required`;
    }

    static #normalizeState({ preserveGeneratedName = false } = {}) {
        const genre = this.#getCurrentGenre();
        const themes = this.#getSortedThemes();
        const sceneType = this.#getCurrentSceneType();

        if (!themes.some(theme => theme.id === this.#state.themeId) && themes.length > 0) {
            this.#state.themeId = themes.find(theme => theme.id === genre.defaultThemeId)?.id || themes[0].id;
        }

        if (!this.SIZE_OPTIONS.some(size => size.id === this.#state.sizeId)) {
            this.#state.sizeId = this.DEFAULT_SIZE_ID;
        }
        if (!sceneType) {
            this.#state.sceneType = "empty";
        }
        if (!sceneType?.showImageControls) {
            this.#state.sceneImageSrc = "";
            this.#state.sceneImageName = "";
        } else if (this.#state.sceneImageSrc && !this.#state.sceneImageName) {
            this.#state.sceneImageName = NexusImageSceneManager.getImageSceneName(this.#state.sceneImageSrc);
        }
        const sceneTypePresetOptions = sceneType?.presetOptions || [];
        const hasPresetOption = sceneTypePresetOptions.some(option => option.id === this.#state.sceneTypePresetId);
        if (!sceneTypePresetOptions.length) {
            this.#state.sceneTypePresetId = null;
        } else if (!hasPresetOption) {
            this.#state.sceneTypePresetId = sceneType?.defaultPresetId || sceneTypePresetOptions[0]?.id || null;
        }
        const sceneTypeBiomeOptions = sceneType?.biomeOptions || [];
        const hasBiomeOption = sceneTypeBiomeOptions.some(option => option.id === this.#state.sceneTypeBiomeId);
        if (!sceneTypeBiomeOptions.length) {
            this.#state.sceneTypeBiomeId = null;
        } else if (!hasBiomeOption) {
            this.#state.sceneTypeBiomeId = sceneType?.defaultBiomeId || sceneTypeBiomeOptions[0]?.id || null;
        }
        if (!this.#state.linkedSceneId || !game.scenes.get(this.#state.linkedSceneId)) {
            this.#state.linkedSceneId = null;
            this.#state.linkedSceneName = "";
        } else {
            this.#state.linkedSceneName = game.scenes.get(this.#state.linkedSceneId)?.name || this.#state.linkedSceneName || "";
        }
        if (!this.ICON_ROLE_OPTIONS.some(option => option.id === this.#state.iconRole)) {
            this.#state.iconRole = "landmark";
        }
        if (!this.MAP_COLOR_OPTIONS.some(option => option.id === this.#state.mapColorId)) {
            this.#state.mapColorId = this.getSelectedTheme()?.mapColorId || genre.defaultMapColorId || this.DEFAULT_MAP_COLOR_ID;
        }
        if (!this.COLOR_OPTIONS.some(color => color.value === this.#state.iconColor)) {
            this.#state.iconColor = this.DEFAULT_COLOR;
        }
        if (!this.COLOR_OPTIONS.some(color => color.value === this.#state.labelColor)) {
            this.#state.labelColor = this.#state.iconColor || this.DEFAULT_COLOR;
        }
        this.#state.autoSortScenes = this.#state.autoSortScenes !== false;
        if (this.#state.iconId === "custom") {
            this.#state.customIconSrc = this.#state.customIconSrc || "";
            if (!this.#state.customIconSrc) this.#state.iconId = null;
        } else {
            this.#state.customIconSrc = "";
        }
        if (this.#state.iconSizeMode === "custom") {
            this.#state.customIconSize = this.#clampIconSize(this.#state.customIconSize);
        } else {
            this.#state.iconSizeMode = "scene-default";
            this.#state.customIconSize = null;
        }

        const selectedIcon = this.getSelectedIcon();
        if (selectedIcon?.id) {
            this.#state.iconId = selectedIcon.id;
        }

        if (!preserveGeneratedName) {
            const nextName = this.#getSuggestedSiteName();
            const currentName = (this.#state.siteName || "").trim();
            if (!currentName || currentName === this.#generatedName) {
                this.#state.siteName = nextName;
                this.#nameDirty = false;
            }
            this.#generatedName = nextName;
        }
    }

    static #applyThemeSelection(themeId) {
        this.#state.themeId = themeId;
        const nextTheme = this.getSelectedTheme();
        this.#state.mapColorId = nextTheme?.mapColorId || this.DEFAULT_MAP_COLOR_ID;
        this.#state.iconId = this.#getThemeDefaultIconId(nextTheme, this.#state.iconRole);
        this.#state.customIconSrc = "";
        this.#normalizeState();

        const nextName = this.#state.sceneType === "existing"
            ? (this.#state.linkedSceneName || "Linked Scene")
            : (this.#pickSuggestedName(nextTheme) || this.DEFAULT_NAME);
        const currentName = (this.#state.siteName || "").trim();

        if (!this.#nameDirty || !currentName || currentName === this.#generatedName) {
            this.#state.siteName = nextName;
            this.#nameDirty = false;
        }

        this.#generatedName = nextName;
    }

    static #applyGenreSelection(genreId) {
        const genre = getSiteGenre(genreId);
        this.#state.genreId = genre.id;
        this.#state.themeId = genre.defaultThemeId || this.DEFAULT_THEME_ID;
        this.#state.iconId = null;
        this.#state.customIconSrc = "";
        this.#state.mapColorId = genre.defaultMapColorId || this.DEFAULT_MAP_COLOR_ID;
        this.#normalizeState();
    }

    static #applyIconRoleSelection(iconRole) {
        this.#state.iconRole = iconRole || "landmark";
        this.#state.iconId = this.#getThemeDefaultIconId(this.getSelectedTheme(), this.#state.iconRole);
        this.#state.customIconSrc = "";
        this.#normalizeState({ preserveGeneratedName: true });
    }

    static #applySceneTypeSelection(sceneTypeId) {
        this.#state.sceneType = sceneTypeId || "empty";
        const sceneType = this.#getCurrentSceneType();
        if (this.#state.sceneType !== "existing") {
            this.#state.linkedSceneId = null;
            this.#state.linkedSceneName = "";
        }
        if (!sceneType?.showImageControls) {
            this.#state.sceneImageSrc = "";
            this.#state.sceneImageName = "";
        }
        if (sceneType?.defaultIconId) {
            this.#state.iconId = sceneType.defaultIconId;
            this.#state.customIconSrc = "";
            this.#state.iconRole = "landmark";
        }
        this.#normalizeState();
    }

    static #applySceneTypePresetSelection(presetId) {
        this.#state.sceneTypePresetId = presetId || null;
        this.#normalizeState();
    }

    static #applySceneTypeBiomeSelection(biomeId) {
        this.#state.sceneTypeBiomeId = biomeId || null;
        this.#normalizeState();
    }

    static #randomizeSceneTypeBiomeSelection({ preserveGeneratedName = false } = {}) {
        const options = this.#getCurrentSceneType()?.biomeOptions || [];
        if (!options.length) return null;

        const eligibleOptions = options.length > 1
            ? options.filter(option => option.id !== this.#state.sceneTypeBiomeId)
            : options;
        const nextOption = eligibleOptions[Math.floor(Math.random() * eligibleOptions.length)];
        this.#state.sceneTypeBiomeId = nextOption?.id || null;
        this.#normalizeState({ preserveGeneratedName });
        return nextOption || null;
    }

    static #setLinkedScene(sceneId) {
        const scene = sceneId ? game.scenes.get(sceneId) : null;
        const currentName = (this.#state.siteName || "").trim();
        const nextName = scene?.name || "Linked Scene";
        this.#state.linkedSceneId = scene?.id || null;
        this.#state.linkedSceneName = scene?.name || "";

        if (this.#state.sceneType === "existing" && (!currentName || currentName === this.#generatedName || !this.#nameDirty)) {
            this.#state.siteName = nextName;
            this.#generatedName = nextName;
            this.#nameDirty = false;
        }
    }

    static #setSceneImage(imageSrc) {
        const currentName = (this.#state.siteName || "").trim();
        const nextName = imageSrc ? NexusImageSceneManager.getImageSceneName(imageSrc) : "";
        this.#state.sceneImageSrc = imageSrc || "";
        this.#state.sceneImageName = nextName;

        if (this.#getCurrentSceneType()?.showImageControls && (!currentName || currentName === this.#generatedName || !this.#nameDirty)) {
            this.#state.siteName = nextName || this.#getSuggestedSiteName();
            this.#generatedName = this.#state.siteName;
            this.#nameDirty = false;
        }
    }

    static get showThemeControls() {
        return !!this.#getCurrentSceneType()?.showThemeControls;
    }

    static get showMapColorControls() {
        return !!this.#getCurrentSceneType()?.showMapColorControls && !!this.#getCurrentGenre().supportsMapColorOverrides;
    }

    static get showSizeControls() {
        return !!this.#getCurrentSceneType()?.showSizeControls;
    }

    static get showLinkedSceneControls() {
        return !!this.#getCurrentSceneType()?.showLinkedSceneControls;
    }

    static get showImageControls() {
        return !!this.#getCurrentSceneType()?.showImageControls;
    }

    static get showIconRoleControls() {
        return this.#getCurrentSceneType()?.siteIconSource !== "sceneTypeBiome";
    }

    static get canRerollSiteName() {
        return this.showThemeControls || typeof this.#getCurrentSceneType()?.suggestName === "function";
    }

    static get showRandomizeToggle() {
        const sceneType = this.#getCurrentSceneType();
        return !!sceneType?.showRandomizeToggle || typeof sceneType?.suggestName === "function";
    }

    async _prepareContext() {
        await Promise.all([SiteCreateTab.getIconCatalog(), SiteCreateTab.getThemeCatalog()]);
        const selectedIcon = SiteCreateTab.getSelectedIcon();

        const context = {
            hasSupportedScene: !isNexusSiteToolSuppressedScene(canvas.scene),
            siteName: SiteCreateTab.#state.siteName,
            genres: getSiteGenres(),
            selectedGenreId: SiteCreateTab.#state.genreId,
            selectedThemeId: SiteCreateTab.#state.themeId,
            sceneTypes: getSiteSceneTypes(),
            selectedSceneType: SiteCreateTab.#state.sceneType,
            showThemeControls: SiteCreateTab.showThemeControls,
            showMapColor: SiteCreateTab.showMapColorControls,
            showSizeControls: SiteCreateTab.showSizeControls,
            showLinkedSceneControls: SiteCreateTab.showLinkedSceneControls,
            showPresetControls: !!SiteCreateTab.#getCurrentSceneType()?.showPresetControls && (SiteCreateTab.#getCurrentSceneType()?.presetOptions?.length > 0),
            showBiomeControls: !!SiteCreateTab.#getCurrentSceneType()?.showBiomeControls && (SiteCreateTab.#getCurrentSceneType()?.biomeOptions?.length > 0),
            canRandomizeSceneTypeBiome: !!SiteCreateTab.#getCurrentSceneType()?.randomizeBiomeOnNextSite && (SiteCreateTab.#getCurrentSceneType()?.biomeOptions?.length > 1),
            showImageControls: SiteCreateTab.showImageControls,
            sceneImageSrc: SiteCreateTab.#state.sceneImageSrc || "",
            sceneImageName: SiteCreateTab.#state.sceneImageName || "No Image Selected",
            selectedSceneTypeAvailable: SiteCreateTab.#getCurrentSceneType()?.available !== false,
            selectedSceneTypeRequiresLabel: SiteCreateTab.#getCurrentSceneType()?.requiresLabel || "",
            selectedSceneTypeRequiresVersion: SiteCreateTab.#getCurrentSceneType()?.minimumModuleVersion || "",
            selectedSceneTypeRequiresText: SiteCreateTab.#getSceneTypeRequirementText(SiteCreateTab.#getCurrentSceneType()),
            selectedSceneTypeRequiresUrl: SiteCreateTab.#getCurrentSceneType()?.requiresUrl || "",
            sceneTypeNameLabel: SiteCreateTab.#getCurrentSceneType()?.siteNameLabel || "Site Name",
            sceneTypeNamePlaceholder: SiteCreateTab.#getCurrentSceneType()?.siteNamePlaceholder || "Site",
            selectedSceneTypePresetId: SiteCreateTab.#state.sceneTypePresetId || SiteCreateTab.#getCurrentSceneType()?.defaultPresetId || "",
            sceneTypePresetOptions: SiteCreateTab.#getCurrentSceneType()?.presetOptions || [],
            sceneTypePresetLabel: SiteCreateTab.#getCurrentSceneType()?.presetLabel || "Preset",
            selectedSceneTypeBiomeId: SiteCreateTab.#state.sceneTypeBiomeId || SiteCreateTab.#getCurrentSceneType()?.defaultBiomeId || "",
            sceneTypeBiomeOptions: SiteCreateTab.#getCurrentSceneType()?.biomeOptions || [],
            sceneTypeBiomeLabel: SiteCreateTab.#getCurrentSceneType()?.biomeLabel || "Biome",
            selectedSceneTypeBiome: SiteCreateTab.#getCurrentSceneTypeBiome(),
            linkedSceneId: SiteCreateTab.#state.linkedSceneId || "",
            linkedSceneName: SiteCreateTab.#state.linkedSceneName || "No scene selected",
            selectedSizeId: SiteCreateTab.#state.sizeId,
            showIconRoleControls: SiteCreateTab.showIconRoleControls,
            iconRoles: SiteCreateTab.ICON_ROLE_OPTIONS,
            selectedIconRole: SiteCreateTab.#state.iconRole,
            selectedIconLabel: selectedIcon?.label || "Select Icon",
            selectedIconSrc: selectedIcon?.src || "",
            selectedIconColor: SiteCreateTab.#state.iconColor || SiteCreateTab.DEFAULT_COLOR,
            selectedLabelColor: SiteCreateTab.#state.labelColor || SiteCreateTab.#state.iconColor || SiteCreateTab.DEFAULT_COLOR,
            selectedIconSize: SiteCreateTab.#getEffectiveIconSize(),
            rotation: SiteCreateTab.#normalizeRotation(SiteCreateTab.#state.rotation),
            iconSizeUsesSceneDefault: SiteCreateTab.#state.iconSizeMode !== "custom",
            showResetIconSize: true,
            selectedLabelFontSize: SiteCreateTab.#getEffectiveLabelFontSize(),
            labelFontSizeUsesAuto: SiteCreateTab.#state.labelFontSizeMode !== "custom",
            showResetLabelFontSize: true,
            minLabelFontSize: SiteLabelManager.MIN_FONT_SIZE,
            maxLabelFontSize: SiteLabelManager.MAX_FONT_SIZE,
            selectedLabelFontFamily: SiteLabelManager.resolveFontFamily(SiteCreateTab.#state),
            labelFontOptions: SiteLabelManager.FONT_OPTIONS,
            showLabel: SiteCreateTab.#state.showLabel !== false,
            showLabelToggleInAdvanced: false,
            showLabelColorControls: true,
            showSnapToGrid: true,
            selectedMapColorId: SiteCreateTab.#state.mapColorId || SiteCreateTab.DEFAULT_MAP_COLOR_ID,
            selectedMapColorLabel: SiteCreateTab.getMapColorLabel(SiteCreateTab.#state.mapColorId),
            selectedMapColorValue: SiteCreateTab.getMapColorValue(SiteCreateTab.#state.mapColorId),
            snapToGrid: SiteCreateTab.#state.snapToGrid !== false,
            randomizeAfterPlacement: !!SiteCreateTab.#state.randomizeAfterPlacement,
            autoSortScenes: SiteCreateTab.#state.autoSortScenes !== false,
            showAutoSortMoveWarning: SiteCreateTab.#getCurrentSceneType()?.id === "existing" && SiteCreateTab.#state.autoSortScenes !== false,
            showRandomizeToggle: SiteCreateTab.showRandomizeToggle,
            canRerollSiteName: SiteCreateTab.canRerollSiteName,
            selectedRoomCount: SiteCreateTab.ROOM_COUNT_BY_SIZE[SiteCreateTab.#state.sizeId] || SiteCreateTab.ROOM_COUNT_BY_SIZE[SiteCreateTab.DEFAULT_SIZE_ID],
            colors: SiteCreateTab.COLOR_OPTIONS,
            mapColors: SiteCreateTab.MAP_COLOR_OPTIONS,
            themes: SiteCreateTab.#getSortedThemes(),
            sizes: SiteCreateTab.SIZE_OPTIONS,
            advancedOpen: SiteCreateTab.#advancedOpen
        };
        context.advancedHtml = await foundry.applications.handlebars.renderTemplate(
            "modules/augur-nexus/templates/site/parts/placement-style-advanced.hbs",
            context
        );
        return context;
    }

    _attachPartListeners(partId, htmlElement, options) {
        const el = htmlElement instanceof HTMLElement ? htmlElement : htmlElement[0];
        if (!el) return;

        const nameInput = el.querySelector("input[name='siteName']");
        const themeSelect = el.querySelector("select[name='themeId']");
        const mapColorSelect = el.querySelector("select[name='mapColorId']");
        const sizeSelect = el.querySelector("select[name='sizeId']");
        const sceneTypeSelect = el.querySelector("select[name='sceneType']");
        const presetSelect = el.querySelector("select[name='sceneTypePresetId']");
        const biomeSelect = el.querySelector("select[name='sceneTypeBiomeId']");
        const iconSizeInput = el.querySelector("input[name='iconSize']");
        const iconSizeValue = el.querySelector("[data-site-icon-size-value]");
        const resetIconSizeButton = el.querySelector("[data-action='resetIconSize']");
        const labelFontSizeInput = el.querySelector("input[name='labelFontSize']");
        const labelFontSizeValue = el.querySelector("[data-site-label-font-size-value]");
        const resetLabelFontSizeButton = el.querySelector("[data-action='resetLabelFontSize']");
        const labelFontFamilySelect = el.querySelector("select[name='labelFontFamily']");
        const labelColorButtons = el.querySelectorAll("[data-placement-label-color]");
        const showLabelCheckbox = el.querySelector("input[name='showLabel']");
        const snapToGridCheckbox = el.querySelector("input[name='snapToGrid']");
        const randomizeCheckbox = el.querySelector("input[name='randomizeAfterPlacement']");
        const autoSortScenesCheckbox = el.querySelector("input[name='autoSortScenes']");
        const roomCountLabel = el.querySelector("[data-site-room-count]");
        const advancedDetails = el.querySelector("[data-placement-advanced]");

        if (advancedDetails) {
            advancedDetails.addEventListener("toggle", event => {
                SiteCreateTab.#advancedOpen = !!event.currentTarget.open;
            });
        }

        if (nameInput) {
            nameInput.addEventListener("input", event => {
                SiteCreateTab.#state.siteName = event.currentTarget.value || "";
                const trimmedName = SiteCreateTab.#state.siteName.trim();
                SiteCreateTab.#nameDirty = !!trimmedName && trimmedName !== SiteCreateTab.#generatedName;
            });
        }

        el.querySelectorAll("[data-site-genre-id]").forEach(button => {
            button.addEventListener("click", async event => {
                const nextGenreId = event.currentTarget.dataset.siteGenreId;
                await Promise.all([
                    SiteCreateTab.getIconCatalog(nextGenreId),
                    SiteCreateTab.getThemeCatalog(nextGenreId)
                ]);
                SiteCreateTab.#applyGenreSelection(nextGenreId);
                SiteCreateTab.#savePersistentState();
                if (nameInput) nameInput.value = SiteCreateTab.#state.siteName;
                this.render();
            });
        });

        if (themeSelect) {
            themeSelect.addEventListener("change", event => {
                SiteCreateTab.#applyThemeSelection(event.currentTarget.value);
                SiteCreateTab.#savePersistentState();
                if (nameInput) nameInput.value = SiteCreateTab.#state.siteName;
                this.render();
            });
        }

        if (sceneTypeSelect) {
            sceneTypeSelect.addEventListener("change", event => {
                SiteCreateTab.#applySceneTypeSelection(event.currentTarget.value);
                SiteCreateTab.#savePersistentState();
                this.render();
            });
        }

        if (presetSelect) {
            presetSelect.addEventListener("change", event => {
                SiteCreateTab.#applySceneTypePresetSelection(event.currentTarget.value);
                SiteCreateTab.#savePersistentState();
                if (nameInput) nameInput.value = SiteCreateTab.#state.siteName;
                this.render();
            });
        }

        if (biomeSelect) {
            biomeSelect.addEventListener("change", event => {
                SiteCreateTab.#applySceneTypeBiomeSelection(event.currentTarget.value);
                SiteCreateTab.#savePersistentState();
                if (nameInput) nameInput.value = SiteCreateTab.#state.siteName;
                this.render();
            });
        }

        const visualBiomeSelector = el.querySelector(".site-visual-select.biome-selector");
        if (visualBiomeSelector) {
            const visualBiomeRow = visualBiomeSelector.closest(".site-visual-select-row") || visualBiomeSelector;
            const trigger = visualBiomeSelector.querySelector("[data-action='toggleSceneTypeBiomeList']");
            const randomizeButton = visualBiomeRow.querySelector("[data-action='randomizeSceneTypeBiome']");
            const list = visualBiomeSelector.querySelector("[data-role='sceneTypeBiomeList']");
            const options = visualBiomeSelector.querySelectorAll("[data-action='selectSceneTypeBiome']");

            if (trigger && list) {
                trigger.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    list.classList.toggle("hidden");
                });

                const closeHandler = event => {
                    if (!visualBiomeSelector.contains(event.target)) {
                        list.classList.add("hidden");
                    }
                };

                setTimeout(() => document.addEventListener("click", closeHandler, { once: true }), 0);
            }

            options.forEach(option => {
                option.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    SiteCreateTab.#applySceneTypeBiomeSelection(option.dataset.value);
                    SiteCreateTab.#savePersistentState();
                    if (nameInput) nameInput.value = SiteCreateTab.#state.siteName;
                    this.render();
                });
            });

            if (randomizeButton) {
                randomizeButton.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    SiteCreateTab.#randomizeSceneTypeBiomeSelection({ preserveGeneratedName: true });
                    SiteCreateTab.#savePersistentState();
                    if (nameInput) nameInput.value = SiteCreateTab.#state.siteName;
                    this.render();
                });
            }
        }

        el.querySelectorAll("[data-site-icon-role]").forEach(button => {
            button.addEventListener("click", event => {
                SiteCreateTab.#applyIconRoleSelection(event.currentTarget.dataset.siteIconRole);
                SiteCreateTab.#savePersistentState();
                this.render();
            });
        });

        const rerollThemeButton = el.querySelector("[data-action='rerollTheme']");
        if (rerollThemeButton) {
            rerollThemeButton.addEventListener("click", event => {
                event.preventDefault();
                const themes = SiteCreateTab.#getSortedThemes();
                if (!themes.length) return;
                const nextTheme = themes[Math.floor(Math.random() * themes.length)];
                SiteCreateTab.#applyThemeSelection(nextTheme.id);
                SiteCreateTab.#savePersistentState();
                if (nameInput) nameInput.value = SiteCreateTab.#state.siteName;
                this.render();
            });
        }

        if (sizeSelect) {
            sizeSelect.addEventListener("change", event => {
                SiteCreateTab.#state.sizeId = event.currentTarget.value;
                SiteCreateTab.#savePersistentState();
                if (roomCountLabel) {
                    roomCountLabel.textContent = String(
                        SiteCreateTab.ROOM_COUNT_BY_SIZE[SiteCreateTab.#state.sizeId] || SiteCreateTab.ROOM_COUNT_BY_SIZE[SiteCreateTab.DEFAULT_SIZE_ID]
                    );
                }
            });
        }

        if (mapColorSelect) {
            mapColorSelect.addEventListener("change", event => {
                SiteCreateTab.#state.mapColorId = event.currentTarget.value;
                SiteCreateTab.#savePersistentState();
                this.render();
            });
        }

        if (iconSizeInput) {
            iconSizeInput.addEventListener("input", event => {
                SiteCreateTab.#state.iconSizeMode = "custom";
                SiteCreateTab.#state.customIconSize = SiteCreateTab.#clampIconSize(event.currentTarget.value);
                SiteCreateTab.#resetLabelFontSizeToAuto();
                SiteCreateTab.#savePersistentState();
                if (resetIconSizeButton) resetIconSizeButton.disabled = false;
                if (iconSizeValue) iconSizeValue.textContent = String(SiteCreateTab.#getEffectiveIconSize());
                if (labelFontSizeInput) labelFontSizeInput.value = String(SiteCreateTab.#getEffectiveLabelFontSize());
                if (labelFontSizeValue) labelFontSizeValue.textContent = String(SiteCreateTab.#getEffectiveLabelFontSize());
                if (resetLabelFontSizeButton) resetLabelFontSizeButton.disabled = true;
            });
        }

        if (resetIconSizeButton) {
            resetIconSizeButton.addEventListener("click", event => {
                event.preventDefault();
                SiteCreateTab.#state.iconSizeMode = "scene-default";
                SiteCreateTab.#state.customIconSize = null;
                SiteCreateTab.#resetLabelFontSizeToAuto();
                SiteCreateTab.#savePersistentState();
                const nextSize = SiteCreateTab.#getEffectiveIconSize();
                if (iconSizeInput) iconSizeInput.value = String(nextSize);
                if (iconSizeValue) iconSizeValue.textContent = String(nextSize);
                if (labelFontSizeInput) labelFontSizeInput.value = String(SiteCreateTab.#getEffectiveLabelFontSize());
                if (labelFontSizeValue) labelFontSizeValue.textContent = String(SiteCreateTab.#getEffectiveLabelFontSize());
                if (resetLabelFontSizeButton) resetLabelFontSizeButton.disabled = true;
                resetIconSizeButton.disabled = true;
                this.render();
            });
        }

        if (labelFontSizeInput) {
            labelFontSizeInput.addEventListener("input", event => {
                SiteCreateTab.#state.labelFontSizeMode = "custom";
                SiteCreateTab.#state.customLabelFontSize = SiteLabelManager.clampFontSize(event.currentTarget.value);
                SiteCreateTab.#savePersistentState();
                if (labelFontSizeValue) labelFontSizeValue.textContent = String(SiteCreateTab.#getEffectiveLabelFontSize());
                if (resetLabelFontSizeButton) resetLabelFontSizeButton.disabled = false;
            });
        }

        if (resetLabelFontSizeButton) {
            resetLabelFontSizeButton.addEventListener("click", event => {
                event.preventDefault();
                SiteCreateTab.#resetLabelFontSizeToAuto();
                SiteCreateTab.#savePersistentState();
                const nextSize = SiteCreateTab.#getEffectiveLabelFontSize();
                if (labelFontSizeInput) labelFontSizeInput.value = String(nextSize);
                if (labelFontSizeValue) labelFontSizeValue.textContent = String(nextSize);
                resetLabelFontSizeButton.disabled = true;
            });
        }

        if (labelFontFamilySelect) {
            labelFontFamilySelect.addEventListener("change", event => {
                SiteCreateTab.#state.labelFontFamily = SiteLabelManager.resolveFontFamily({ labelFontFamily: event.currentTarget.value });
                SiteCreateTab.#savePersistentState();
            });
        }

        labelColorButtons.forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                SiteCreateTab.#state.labelColor = event.currentTarget.dataset.placementLabelColor || SiteCreateTab.DEFAULT_COLOR;
                SiteCreateTab.#savePersistentState();
                this.render();
            });
        });

        if (showLabelCheckbox) {
            showLabelCheckbox.addEventListener("change", event => {
                SiteCreateTab.#state.showLabel = !!event.currentTarget.checked;
                SiteCreateTab.#savePersistentState();
                this.render();
            });
        }

        if (snapToGridCheckbox) {
            snapToGridCheckbox.addEventListener("change", event => {
                SiteCreateTab.#state.snapToGrid = !!event.currentTarget.checked;
                SiteCreateTab.#savePersistentState();
            });
        }

        if (randomizeCheckbox) {
            randomizeCheckbox.addEventListener("change", event => {
                SiteCreateTab.#state.randomizeAfterPlacement = !!event.currentTarget.checked;
                SiteCreateTab.#savePersistentState();
            });
        }

        if (autoSortScenesCheckbox) {
            autoSortScenesCheckbox.addEventListener("change", event => {
                SiteCreateTab.#state.autoSortScenes = !!event.currentTarget.checked;
                SiteCreateTab.#savePersistentState();
                this.render();
            });
        }

        const clearButton = el.querySelector("[data-action='clearSiteName']");
        if (clearButton) {
            clearButton.addEventListener("click", event => {
                event.preventDefault();
                SiteCreateTab.#state.siteName = SiteCreateTab.#generatedName || SiteCreateTab.DEFAULT_NAME;
                SiteCreateTab.#nameDirty = false;
                if (nameInput) nameInput.value = SiteCreateTab.#state.siteName;
            });
        }

        const rerollButton = el.querySelector("[data-action='rerollSiteName']");
        if (rerollButton) {
            rerollButton.addEventListener("click", event => {
                event.preventDefault();
                const nextName = SiteCreateTab.#getSuggestedSiteName();
                SiteCreateTab.#generatedName = nextName;
                SiteCreateTab.#state.siteName = nextName;
                SiteCreateTab.#nameDirty = false;
                if (nameInput) nameInput.value = nextName;
            });
        }

        const iconPickerButton = el.querySelector("[data-action='pickSiteIcon']");
        if (iconPickerButton) {
            iconPickerButton.addEventListener("click", async event => {
                event.preventDefault();
                const icons = SiteCreateTab.#iconCatalogs.get(SiteCreateTab.#state.genreId)?.icons || [];
                const allBuiltInIcons = await SiteCreateTab.getAllBuiltInIcons();
                new SiteIconPicker(icons, SiteCreateTab.#state.iconId, SiteCreateTab.#state.iconRole, selection => {
                    if (typeof selection === "object" && selection?.id === "custom") {
                        SiteCreateTab.#state.iconId = "custom";
                        SiteCreateTab.#state.customIconSrc = selection.src || "";
                    } else {
                        const nextIcon = allBuiltInIcons.find(icon => icon.id === selection && (icon.role || "landmark") === SiteCreateTab.#state.iconRole) || null;
                        SiteCreateTab.#state.iconId = selection || null;
                        SiteCreateTab.#state.customIconSrc = nextIcon?.genreId && nextIcon.genreId !== SiteCreateTab.#state.genreId
                            ? (nextIcon.src || "")
                            : "";
                    }
                    SiteCreateTab.#savePersistentState();
                    this.render();
                }, {
                    currentCustomIconSrc: SiteCreateTab.#state.customIconSrc || "",
                    allBuiltInIcons,
                    themeIconsOnlyLabel: "Show Theme Icons Only"
                }).render(true);
            });
        }

        const scenePickerButtons = [...el.querySelectorAll("[data-action='pickLinkedScene']")];
        for (const scenePickerButton of scenePickerButtons) {
            scenePickerButton.addEventListener("click", event => {
                event.preventDefault();
                new SiteScenePicker(SiteCreateTab.#state.linkedSceneId, sceneId => {
                    SiteCreateTab.#setLinkedScene(sceneId);
                    SiteCreateTab.#savePersistentState();
                    this.render();
                }).render(true);
            });
        }

        const imagePickerButtons = [...el.querySelectorAll("[data-action='pickSceneImage']")];
        for (const imagePickerButton of imagePickerButtons) {
            imagePickerButton.addEventListener("click", event => {
                event.preventDefault();
                const rect = event.currentTarget.getBoundingClientRect();
                new FilePicker({
                    type: "image",
                    current: SiteCreateTab.#state.sceneImageSrc || "",
                    callback: path => {
                        SiteCreateTab.#setSceneImage(path);
                        SiteCreateTab.#savePersistentState();
                        this.render();
                    },
                    top: rect.top,
                    left: rect.left
                }).render({ force: true });
            });
        }

        const clearLinkedSceneButton = el.querySelector("[data-action='clearLinkedScene']");
        if (clearLinkedSceneButton) {
            clearLinkedSceneButton.addEventListener("click", event => {
                event.preventDefault();
                SiteCreateTab.#setLinkedScene(null);
                SiteCreateTab.#savePersistentState();
                this.render();
            });
        }

        const viewRequiredModuleButton = el.querySelector("[data-action='viewRequiredModule']");
        if (viewRequiredModuleButton) {
            viewRequiredModuleButton.addEventListener("click", event => {
                event.preventDefault();
                const url = SiteCreateTab.#getCurrentSceneType()?.requiresUrl;
                if (url) window.open(url, "_blank", "noopener,noreferrer");
            });
        }

        el.querySelectorAll("[data-site-color]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                SiteCreateTab.#state.iconColor = event.currentTarget.dataset.siteColor || SiteCreateTab.DEFAULT_COLOR;
                SiteCreateTab.#savePersistentState();
                this.render();
            });
        });
    }

}




