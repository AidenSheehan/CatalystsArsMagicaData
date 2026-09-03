import { SiteCoverCatalog } from "../services/SiteCoverCatalog.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const FilePicker = foundry.applications.apps.FilePicker.implementation;

export class SiteCoverPicker extends HandlebarsApplicationMixin(ApplicationV2) {
    #current = "";
    #sourceCover = null;
    #onSelect = null;

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-site-cover-picker",
        classes: ["augur-nexus", "site-cover-picker-dialog"],
        tag: "div",
        window: {
            title: "Select Cover Image",
            resizable: true,
            minimizable: false
        },
        position: {
            width: 760,
            height: 560
        }
    };

    static PARTS = {
        main: {
            template: "modules/augur-nexus/templates/site/site-cover-picker.hbs"
        }
    };

    static show({ current = "", sourceCover = null, onSelect = null } = {}) {
        const app = new this({ current, sourceCover, onSelect });
        app.render(true, { focus: true });
        return app;
    }

    constructor({ current = "", sourceCover = null, onSelect = null } = {}, options = {}) {
        super(options);
        this.#current = current || "";
        this.#sourceCover = this.#normalizeSourceCover(sourceCover);
        this.#onSelect = onSelect;
    }

    _prepareContext() {
        const covers = SiteCoverCatalog.getIncludedCovers().map(cover => ({
            ...cover,
            active: cover.src === this.#current
        }));

        return {
            covers,
            sourceCover: this.#sourceCover ? {
                ...this.#sourceCover,
                active: !this.#current
            } : null,
            customActive: !!this.#current && !SiteCoverCatalog.includes(this.#current),
            customSrc: this.#current
        };
    }

    _attachPartListeners(partId, htmlElement, options) {
        super._attachPartListeners(partId, htmlElement, options);

        const el = htmlElement instanceof HTMLElement ? htmlElement : htmlElement[0];
        if (!el) return;

        el.querySelectorAll("[data-cover-src]").forEach(item => {
            item.addEventListener("click", event => {
                event.preventDefault();
                this.#selectCover(event.currentTarget.dataset.coverSrc || "");
            });
        });

        el.querySelector("[data-action='useSourceCover']")?.addEventListener("click", event => {
            event.preventDefault();
            this.#selectSourceCover();
        });

        el.querySelector("[data-action='pickCustomCover']")?.addEventListener("click", event => {
            event.preventDefault();
            this.#openCustomPicker(event.currentTarget);
        });
    }

    async #selectCover(src) {
        if (!src) return;
        await this.#onSelect?.(src);
        this.close();
    }

    async #selectSourceCover() {
        await this.#onSelect?.("");
        this.close();
    }

    #openCustomPicker(target) {
        const rect = target?.getBoundingClientRect?.() || { top: 120, left: 120 };
        new FilePicker({
            type: "image",
            current: this.#current || "",
            callback: async path => {
                if (!path) return;
                await this.#onSelect?.(path);
                this.close();
            },
            top: rect.top,
            left: rect.left
        }).render({ force: true });
    }

    #normalizeSourceCover(sourceCover = null) {
        const src = String(sourceCover?.src || sourceCover?.sourceCoverSrc || "").trim();
        if (!src) return null;
        return {
            src,
            label: String(sourceCover?.label || sourceCover?.sourceCoverLabel || "Source Background").trim() || "Source Background"
        };
    }
}
