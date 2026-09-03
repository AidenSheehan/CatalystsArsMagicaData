// Unified Nexus Placer workspace. Individual tabs own their own context and listeners.

import { NexusTool } from "../../../support/utils/NexusTool.js";
import { SiteCreateTab } from "./tabs/SiteCreateTab.js";
import { SiteEditTab } from "./tabs/SiteEditTab.js";
import { EntityPlacementTab } from "./tabs/EntityPlacementTab.js";
import { SiteSelectionHighlighter } from "../services/SiteSelectionHighlighter.js";
import { SiteEditor } from "../services/SiteEditor.js";
import { SiteGenerator } from "../services/SiteGenerator.js";
import { NexusMarkerService } from "../../markers/services/NexusMarkerService.js";

export class SitePanel extends NexusTool {
    static TOOL_NAME = "nexus-sites";
    static SESSION_PLACEMENT_KEY = "augur-nexus.site-panel";
    static DEFAULT_GENRE_ID = SiteCreateTab.DEFAULT_GENRE_ID;
    static DEFAULT_THEME_ID = SiteCreateTab.DEFAULT_THEME_ID;
    static DEFAULT_SIZE_ID = SiteCreateTab.DEFAULT_SIZE_ID;
    static DEFAULT_NAME = SiteCreateTab.DEFAULT_NAME;
    static DEFAULT_COLOR = SiteCreateTab.DEFAULT_COLOR;
    static DEFAULT_MAP_COLOR_ID = SiteCreateTab.DEFAULT_MAP_COLOR_ID;
    static MIN_ICON_SIZE = SiteCreateTab.MIN_ICON_SIZE;
    static MAX_ICON_SIZE = SiteCreateTab.MAX_ICON_SIZE;
    static ROOM_COUNT_BY_SIZE = SiteCreateTab.ROOM_COUNT_BY_SIZE;
    static SIZE_OPTIONS = SiteCreateTab.SIZE_OPTIONS;
    static COLOR_OPTIONS = SiteCreateTab.COLOR_OPTIONS;
    static MAP_COLOR_OPTIONS = SiteCreateTab.MAP_COLOR_OPTIONS;
    static ICON_ROLE_OPTIONS = SiteCreateTab.ICON_ROLE_OPTIONS;

    static CREATION_TAB_DEFINITIONS = [
        { id: "site", label: "Site", icon: "fas fa-location-dot", controller: SiteCreateTab, template: "modules/augur-nexus/templates/site/site-generator-panel.hbs" },
        { id: "npc", label: "People", icon: "fas fa-user-astronaut", controller: EntityPlacementTab, template: "modules/augur-nexus/templates/site/entity-placement-tab.hbs", entityType: "npc" },
        { id: "ship", label: "Ship", icon: "fas fa-rocket", controller: EntityPlacementTab, template: "modules/augur-nexus/templates/site/entity-placement-tab.hbs", entityType: "ship" },
        { id: "faction", label: "Orgs", icon: "fas fa-shield-halved", controller: EntityPlacementTab, template: "modules/augur-nexus/templates/site/entity-placement-tab.hbs", entityType: "faction" }
    ];

    static EDIT_TAB_DEFINITION = { id: "edit", label: "Edit", icon: "fas fa-pen-to-square", controller: SiteEditTab, template: "modules/augur-nexus/templates/site/site-edit-panel.hbs" };

    static get TAB_DEFINITIONS() {
        return [
            ...this.CREATION_TAB_DEFINITIONS,
            this.EDIT_TAB_DEFINITION
        ];
    }

    static #instance = null;
    static #activeTab = "site";

    #tabs = new Map();

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-sites-panel",
        classes: ["augur-nexus", "site-generator-panel", "site-tabs-panel"],
        tag: "div",
        window: {
            title: "Nexus Placer",
            resizable: false,
            minimizable: true
        },
        position: {
            width: 400,
            height: "auto"
        }
    };

    static PARTS = {
        main: {
            template: "modules/augur-nexus/templates/site/site-panel.hbs",
            templates: [
                "modules/augur-nexus/templates/site/entity-placement-tab.hbs",
                "modules/augur-nexus/templates/site/parts/placement-style-advanced.hbs",
                "modules/augur-nexus/templates/site/parts/marker-style-editor.hbs",
                "modules/augur-nexus/templates/campaign-entities/npc-profile-panel.hbs",
                "modules/augur-nexus/templates/campaign-entities/ship-profile-panel.hbs",
                "modules/augur-nexus/templates/campaign-entities/faction-profile-panel.hbs"
            ]
        }
    };

    static show({ tab = "create" } = {}) {
        SiteCreateTab.loadPersistentState();
        this.#activeTab = this.#normalizeTab(tab);
        this.#applyTabMode(this.#activeTab);
        if (!this.#instance) this.#instance = new this();
        this.#instance.render(true);
        return this.#instance;
    }

    static showCreate() {
        return this.show({ tab: "site" });
    }

    static showEdit() {
        return this.show({ tab: "edit" });
    }

    static dismiss(options) {
        if (!this.#instance) return;
        const app = this.#instance;
        this.#instance = null;
        app.close(options);
    }

    static refreshIfOpen() {
        this.#instance?.render();
    }

    static get activeTab() {
        return this.#activeTab;
    }

    static get activeMode() {
        return this.#activeTab === "edit" ? "edit" : "create";
    }

    static getState() {
        return SiteCreateTab.getState();
    }

    static transformPlacementStyle(options = {}) {
        const state = SiteCreateTab.transformPlacementStyle(options);
        this.refreshIfOpen();
        return state;
    }

    static clearLinkedSceneSelection() {
        return SiteCreateTab.clearLinkedSceneSelection();
    }

    static getIconCatalog(...args) {
        return SiteCreateTab.getIconCatalog(...args);
    }

    static getThemeCatalog(...args) {
        return SiteCreateTab.getThemeCatalog(...args);
    }

    static getAllBuiltInIcons(...args) {
        return SiteCreateTab.getAllBuiltInIcons(...args);
    }

    static getSelectedTheme(...args) {
        return SiteCreateTab.getSelectedTheme(...args);
    }

    static getSelectedIcon(...args) {
        return SiteCreateTab.getSelectedIcon(...args);
    }

    static randomizeNextSite(...args) {
        return SiteCreateTab.randomizeNextSite(...args);
    }

    static getSizeLabel(...args) {
        return SiteCreateTab.getSizeLabel(...args);
    }

    static getIconRoleLabel(...args) {
        return SiteCreateTab.getIconRoleLabel(...args);
    }

    static getMapColorLabel(...args) {
        return SiteCreateTab.getMapColorLabel(...args);
    }

    static getMapColorValue(...args) {
        return SiteCreateTab.getMapColorValue(...args);
    }

    static #normalizeTab(tab) {
        if (tab === "create") return "site";
        if (tab === "edit-mode") return "edit";
        return this.TAB_DEFINITIONS.some(definition => definition.id === tab) ? tab : "site";
    }

    static #applyTabMode(tab) {
        if (tab === "edit") {
            SiteEditor.activate();
            SiteGenerator.resetGhost();
            NexusMarkerService.resetGhost();
            return;
        }

        SiteEditor.deactivate();
        NexusMarkerService.clearSelection();
        if (tab !== "site") SiteGenerator.resetGhost();
        if (!EntityPlacementTab.isEntityTab(tab)) NexusMarkerService.resetGhost();
    }

    get activeTab() {
        return SitePanel.#activeTab;
    }

    setActiveTab(tab) {
        const nextTab = SitePanel.#normalizeTab(tab);
        if (SitePanel.#activeTab === nextTab) return;
        SitePanel.#activeTab = nextTab;
        SitePanel.#applyTabMode(nextTab);
        this.render();
    }

    setActiveMode(mode) {
        if (mode === "edit") {
            this.setActiveTab("edit");
            return;
        }
        if (SitePanel.#activeTab === "edit") this.setActiveTab("site");
    }

    getTabController(tabId = this.activeTab) {
        const definition = SitePanel.TAB_DEFINITIONS.find(tab => tab.id === tabId) || SitePanel.TAB_DEFINITIONS[0];
        if (!this.#tabs.has(definition.id)) {
            this.#tabs.set(definition.id, definition.entityType
                ? new definition.controller(this, definition.entityType)
                : new definition.controller(this));
        }
        return this.#tabs.get(definition.id);
    }

    async _prepareContext(options) {
        const activeTab = this.activeTab;
        const definition = SitePanel.TAB_DEFINITIONS.find(tab => tab.id === activeTab) || SitePanel.TAB_DEFINITIONS[0];
        const controller = this.getTabController(activeTab);
        const tabContext = await controller._prepareContext?.(options) || {};
        const tabHtml = await foundry.applications.handlebars.renderTemplate(definition.template, tabContext);

        return {
            ...tabContext,
            activeTab,
            activeMode: SitePanel.activeMode,
            tabHtml,
            isCreateMode: SitePanel.activeMode === "create",
            isEditMode: SitePanel.activeMode === "edit",
            isCreateTab: activeTab === "site",
            isEditTab: activeTab === "edit",
            ariaLabel: "Nexus Placer",
            modeTabs: [
                {
                    id: "create",
                    label: "Creation",
                    icon: "fas fa-wand-magic-sparkles",
                    active: SitePanel.activeMode === "create"
                },
                {
                    id: "edit",
                    label: "Edit",
                    icon: "fas fa-pen-to-square",
                    active: SitePanel.activeMode === "edit"
                }
            ],
            creationTabs: SitePanel.CREATION_TAB_DEFINITIONS.map(tab => ({
                id: tab.id,
                label: tab.label,
                icon: tab.icon,
                active: tab.id === activeTab
            }))
        };
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        const el = htmlElement instanceof HTMLElement ? htmlElement : htmlElement[0];
        if (!el) return;

        el.querySelectorAll("[data-site-mode]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                this.setActiveMode(event.currentTarget.dataset.siteMode);
            });
        });

        el.querySelectorAll("[data-site-tab]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                this.setActiveTab(event.currentTarget.dataset.siteTab);
            });
        });

        this.getTabController()._attachPartListeners?.(partId, htmlElement, options);
    }

    async close(options) {
        SiteEditor.deactivate();
        NexusMarkerService.clearSelection();
        SiteSelectionHighlighter.clear();
        SitePanel.#instance = null;
        return super.close(options);
    }
}

Hooks.on("augurNexusSiteSceneTypesChanged", () => {
    SitePanel.refreshIfOpen();
});

Hooks.on("augurNexusSiteEditorSelectionChanged", () => {
    SitePanel.refreshIfOpen();
});

Hooks.on("augurNexusLineageChanged", () => {
    SitePanel.refreshIfOpen();
});
