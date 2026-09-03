import { getFactionEmblems } from "../../../api/factions.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const FilePicker = foundry.applications.apps.FilePicker.implementation;

export class FactionEmblemPicker extends HandlebarsApplicationMixin(ApplicationV2) {
    #onSelect = null;

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-faction-emblem-picker",
        classes: ["augur-nexus", "npc-portrait-picker-dialog", "site-icon-picker-dialog", "faction-emblem-picker-dialog"],
        tag: "div",
        window: {
            title: "Select Organization Badge",
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
            template: "modules/augur-nexus/templates/campaign-entities/faction-emblem-picker.hbs"
        }
    };

    constructor({ currentEmblemSrc = "", onSelect = null } = {}, options = {}) {
        super(options);
        this.currentEmblemSrc = currentEmblemSrc || "";
        this.currentTab = options.currentTab || "built-in";
        this.#onSelect = onSelect;
    }

    async _prepareContext() {
        return {
            emblems: await getFactionEmblems(),
            currentEmblemSrc: this.currentEmblemSrc,
            currentTab: this.currentTab,
            pickerLabel: this.currentTab === "custom" ? "Custom" : "Built-In"
        };
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);
        const el = htmlElement instanceof HTMLElement ? htmlElement : htmlElement?.[0];
        if (!el) return;

        el.querySelectorAll("[data-emblem-tab]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                this.currentTab = event.currentTarget.dataset.emblemTab || "built-in";
                this.render();
            });
        });

        el.querySelectorAll("[data-emblem-src]").forEach(card => {
            card.addEventListener("click", event => this.#selectCard(event.currentTarget));
        });

        el.querySelector("[data-action='chooseCustomEmblemFile']")?.addEventListener("click", event => {
            event.preventDefault();
            this.#openFilePicker();
        });
    }

    #selectCard(card) {
        const src = card?.dataset?.emblemSrc || "";
        if (!src) return;
        this.#onSelect?.({ src, id: card.dataset.emblemId || "custom" });
        this.close();
    }

    #openFilePicker() {
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
}
