import { getNpcPortraits } from "../../../api/npcs.js";
import { CustomImageFolderBrowser } from "../../shared/services/CustomImageFolderBrowser.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const FilePicker = foundry.applications.apps.FilePicker.implementation;

const MODULE_ID = "augur-nexus";
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];

export class NpcPortraitPicker extends HandlebarsApplicationMixin(ApplicationV2) {
    #onSelect = null;
    #currentCustomFolderPath = "";

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-npc-portrait-picker",
        classes: ["augur-nexus", "npc-portrait-picker-dialog", "site-icon-picker-dialog"],
        tag: "div",
        window: {
            title: "Select Person Portrait",
            resizable: true,
            minimizable: false
        },
        position: {
            width: 860,
            height: 620
        }
    };

    static PARTS = {
        main: {
            template: "modules/augur-nexus/templates/campaign-entities/npc-portrait-picker.hbs"
        }
    };

    constructor({ currentPortraitSrc = "", onSelect = null } = {}, options = {}) {
        super(options);
        this.currentPortraitSrc = currentPortraitSrc || "";
        this.currentTab = options.currentTab || "built-in";
        this.#onSelect = onSelect;
    }

    async _prepareContext() {
        const customFolder = this.#getCustomFolderSetting();
        const [portraits, customBrowser] = await Promise.all([
            getNpcPortraits(),
            this.#getCustomFolderBrowser(customFolder)
        ]);

        return {
            portraits,
            currentPortraitSrc: this.currentPortraitSrc,
            currentTab: this.currentTab,
            customFolderPath: customFolder.path || "",
            currentCustomFolderPath: customBrowser.currentPath || customFolder.path || "",
            currentCustomFolderPathLabel: customBrowser.currentPathLabel || customFolder.path || "",
            customFolderCanGoUp: customBrowser.canGoUp,
            customFolderParentPath: customBrowser.parentPath,
            customFolders: customBrowser.folders,
            hasCustomFolder: !!customFolder.path,
            customPortraits: customBrowser.images,
            pickerLabel: this.currentTab === "custom" ? "Custom" : "Built-In"
        };
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        const el = htmlElement instanceof HTMLElement ? htmlElement : htmlElement?.[0];
        if (!el) return;

        el.querySelectorAll("[data-portrait-tab]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                const nextTab = event.currentTarget.dataset.portraitTab;
                if (!nextTab || nextTab === this.currentTab) return;
                this.currentTab = nextTab;
                this.render();
            });
        });

        el.querySelectorAll("[data-portrait-src]").forEach(card => {
            card.addEventListener("click", event => this.#handlePortraitCardClick(event.currentTarget));
            card.addEventListener("keydown", event => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                this.#handlePortraitCardClick(event.currentTarget);
            });
        });

        const chooseFileButton = el.querySelector("[data-action='chooseCustomPortraitFile']");
        if (chooseFileButton) {
            chooseFileButton.addEventListener("click", event => {
                event.preventDefault();
                this.#openCustomPortraitFilePicker();
            });
        }

        const chooseFolderButton = el.querySelector("[data-action='chooseCustomPortraitFolder']");
        if (chooseFolderButton) {
            chooseFolderButton.addEventListener("click", event => {
                event.preventDefault();
                this.#openCustomFolderPicker();
            });
        }

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

        const clearFolderButton = el.querySelector("[data-action='clearCustomPortraitFolder']");
        if (clearFolderButton) {
            clearFolderButton.addEventListener("click", async event => {
                event.preventDefault();
                await game.settings.set(MODULE_ID, "npcCustomPortraitFolder", {
                    source: "data",
                    path: ""
                });
                this.#currentCustomFolderPath = "";
            this.render();
            });
        }
    }

    #handlePortraitCardClick(card) {
        const src = card.dataset.portraitSrc || "";
        if (!src) return;
        this.#onSelect?.({ src, id: card.dataset.portraitId || "custom" });
        this.close();
    }

    #openCustomFolderPicker() {
        const currentFolder = this.#getCustomFolderSetting();
        const picker = new FilePicker({
            type: "folder",
            current: currentFolder.path || "",
            activeSource: currentFolder.source || "data",
            callback: async (path, pickerApp) => {
                await game.settings.set(MODULE_ID, "npcCustomPortraitFolder", {
                    source: pickerApp.activeSource || currentFolder.source || "data",
                    path: path || ""
                });
                this.currentTab = "custom";
                this.render();
            },
            top: (this.position?.top ?? 100) + 40,
            left: (this.position?.left ?? 100) + 10
        });

        picker.render({ force: true });
    }

    #openCustomPortraitFilePicker() {
        const picker = new FilePicker({
            type: "image",
            callback: path => {
                if (!path) return;
                this.#onSelect?.({ src: path, id: "custom" });
                this.close();
            },
            top: (this.position?.top ?? 100) + 40,
            left: (this.position?.left ?? 100) + 10
        });

        picker.render({ force: true });
    }

    #getCustomFolderSetting() {
        const stored = game.settings.get(MODULE_ID, "npcCustomPortraitFolder") || {};
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

}
