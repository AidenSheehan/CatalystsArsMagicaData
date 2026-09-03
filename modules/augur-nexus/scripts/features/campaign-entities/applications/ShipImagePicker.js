import { getShipModels } from "../../../api/ships.js";
import { CustomImageFolderBrowser } from "../../shared/services/CustomImageFolderBrowser.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const FilePicker = foundry.applications.apps.FilePicker.implementation;

const MODULE_ID = "augur-nexus";
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];

export class ShipImagePicker extends HandlebarsApplicationMixin(ApplicationV2) {
    #onSelect = null;
    #selectedModelId = "";
    #selectedCategoryId = "all";
    #initialTab = "";
    #currentCustomFolderPath = "";

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-ship-image-picker",
        classes: ["augur-nexus", "npc-portrait-picker-dialog", "site-icon-picker-dialog", "ship-image-picker-dialog"],
        tag: "div",
        window: { title: "Select Ship Model", resizable: true, minimizable: false },
        position: { width: 860, height: 620 }
    };

    static PARTS = { main: { template: "modules/augur-nexus/templates/campaign-entities/ship-image-picker.hbs" } };

    constructor({ currentShipImageSrc = "", selectedModelId = "", onSelect = null } = {}, options = {}) {
        super(options);
        this.currentShipImageSrc = currentShipImageSrc || "";
        this.#selectedModelId = selectedModelId || "";
        this.#selectedCategoryId = options.selectedCategoryId || "all";
        this.currentTab = options.currentTab || "built-in";
        this.#initialTab = options.currentTab || "";
        this.#onSelect = onSelect;
    }

    async _prepareContext() {
        const customFolder = this.#getCustomFolderSetting();
        const models = await getShipModels();
        if (!this.#initialTab) {
            this.currentTab = this.#isBuiltInImage(models, this.currentShipImageSrc) ? "built-in" : "custom";
            this.#initialTab = this.currentTab;
        }
        const categories = this.#buildCategories(models);
        if (!categories.some(category => category.id === this.#selectedCategoryId)) this.#selectedCategoryId = "all";
        const filteredModels = this.#selectedCategoryId === "all"
            ? models
            : models.filter(model => model.categoryId === this.#selectedCategoryId);
        const selectedModel = this.currentTab === "built-in" && this.#selectedModelId
            ? models.find(model => model.modelId === this.#selectedModelId)
            : null;
        const customBrowser = await this.#getCustomFolderBrowser(customFolder);
        return {
            models: filteredModels,
            selectedModel,
            currentShipImageSrc: this.currentShipImageSrc,
            currentTab: this.currentTab,
            pickerLabel: this.currentTab === "custom" ? "Custom" : "Built-In",
            shipModelCategories: categories,
            selectedShipModelCategoryId: this.#selectedCategoryId,
            showShipModelCategories: categories.length > 2,
            customFolderPath: customFolder.path || "",
            currentCustomFolderPath: customBrowser.currentPath || customFolder.path || "",
            currentCustomFolderPathLabel: customBrowser.currentPathLabel || customFolder.path || "",
            customFolderCanGoUp: customBrowser.canGoUp,
            customFolderParentPath: customBrowser.parentPath,
            customFolders: customBrowser.folders,
            hasCustomFolder: !!customFolder.path,
            customImages: customBrowser.images
};
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        const el = htmlElement instanceof HTMLElement ? htmlElement : htmlElement?.[0];
        if (!el) return;

        el.querySelectorAll("[data-ship-image-tab]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                const nextTab = event.currentTarget.dataset.shipImageTab;
                if (!nextTab || nextTab === this.currentTab) return;
                this.currentTab = nextTab;
                this.#selectedModelId = "";
                this.render();
            });
        });

        el.querySelectorAll("[data-ship-model-category]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                const nextCategoryId = event.currentTarget.dataset.shipModelCategory || "all";
                if (nextCategoryId === this.#selectedCategoryId) return;
                this.#selectedCategoryId = nextCategoryId;
                this.#selectedModelId = "";
                this.render();
            });
        });

        el.querySelectorAll("[data-ship-model-id]").forEach(card => {
            card.addEventListener("click", event => {
                event.preventDefault();
                this.#selectedModelId = event.currentTarget.dataset.shipModelId || "";
                this.render();
            });
        });
        el.querySelectorAll("[data-ship-image-src]").forEach(card => {
            card.addEventListener("click", event => {
                event.preventDefault();
                this.#onSelect?.({
                    src: event.currentTarget.dataset.shipImageSrc || "",
                    modelId: event.currentTarget.dataset.modelId || "",
                    modelLabel: event.currentTarget.dataset.modelLabel || "",
                    styleId: event.currentTarget.dataset.styleId || "",
                    custom: event.currentTarget.dataset.customShipImage === "true"
                });
                this.close();
            });
        });
        el.querySelector("[data-action='backToShipModels']")?.addEventListener("click", event => {
            event.preventDefault();
            this.#selectedModelId = "";
            this.render();
        });

        el.querySelector("[data-action='chooseCustomShipImageFile']")?.addEventListener("click", event => {
            event.preventDefault();
            this.#openCustomShipImageFilePicker();
        });

        el.querySelector("[data-action='chooseCustomShipImageFolder']")?.addEventListener("click", event => {
            event.preventDefault();
            this.#openCustomFolderPicker();
        });

        el.querySelector("[data-action='customFolderUp']")?.addEventListener("click", event => {
            event.preventDefault();
            this.#navigateCustomFolder(event.currentTarget.dataset.customFolderParentPath || "");
        });

        el.querySelectorAll("[data-custom-folder-path]").forEach(card => {
            card.addEventListener("click", event => {
                event.preventDefault();
                this.#navigateCustomFolder(event.currentTarget.dataset.customFolderPath || "");
            });
            card.addEventListener("keydown", event => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                this.#navigateCustomFolder(event.currentTarget.dataset.customFolderPath || "");
            });
        });

        el.querySelector("[data-action='clearCustomShipImageFolder']")?.addEventListener("click", async event => {
            event.preventDefault();
            await game.settings.set(MODULE_ID, "shipCustomImageFolder", {
                source: "data",
                path: ""
            });
            this.#currentCustomFolderPath = "";
            this.render();
        });
    }

    #openCustomFolderPicker() {
        const currentFolder = this.#getCustomFolderSetting();
        const picker = new FilePicker({
            type: "folder",
            current: currentFolder.path || "",
            activeSource: currentFolder.source || "data",
            callback: async (path, pickerApp) => {
                await game.settings.set(MODULE_ID, "shipCustomImageFolder", {
                    source: pickerApp.activeSource || currentFolder.source || "data",
                    path: path || ""
                });
                this.currentTab = "custom";
                this.#selectedModelId = "";
                this.render();
            },
            top: (this.position?.top ?? 100) + 40,
            left: (this.position?.left ?? 100) + 10
        });

        picker.render({ force: true });
    }

    #openCustomShipImageFilePicker() {
        const picker = new FilePicker({
            type: "image",
            callback: path => {
                if (!path) return;
                this.#onSelect?.({ src: path, modelId: "", styleId: "", custom: true });
                this.close();
            },
            top: (this.position?.top ?? 100) + 40,
            left: (this.position?.left ?? 100) + 10
        });

        picker.render({ force: true });
    }

    #getCustomFolderSetting() {
        const stored = game.settings.get(MODULE_ID, "shipCustomImageFolder") || {};
        return {
            source: stored.source || "data",
            path: stored.path || ""
        };
    }

    async #getCustomFolderBrowser(folder) {
        if (!folder?.path) return CustomImageFolderBrowser.browse();
        if (!CustomImageFolderBrowser.isWithinRoot(this.#currentCustomFolderPath, folder.path)) {
            this.#currentCustomFolderPath = folder.path;
        }
        return CustomImageFolderBrowser.browse({
            source: folder.source || "data",
            rootPath: folder.path,
            currentPath: this.#currentCustomFolderPath,
            extensions: IMAGE_EXTENSIONS
        });
    }

    #navigateCustomFolder(path = "") {
        const folder = this.#getCustomFolderSetting();
        const nextPath = CustomImageFolderBrowser.normalizePath(path);
        if (!CustomImageFolderBrowser.isWithinRoot(nextPath, folder.path)) return;
        this.#currentCustomFolderPath = nextPath;
        this.render();
    }

    #isBuiltInImage(models = [], imageSrc = "") {
        if (!imageSrc) return true;
        return models.some(model => (model.variants || []).some(variant => variant.imageSrc === imageSrc));
    }

    #buildCategories(models = []) {
        const categories = new Map([["all", { id: "all", label: "All" }]]);
        for (const model of models) {
            const id = String(model.categoryId || "ships").trim() || "ships";
            if (categories.has(id)) continue;
            categories.set(id, { id, label: String(model.categoryLabel || id).trim() || id });
        }
        return [...categories.values()];
    }

}
