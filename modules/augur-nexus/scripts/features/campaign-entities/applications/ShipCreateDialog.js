import { createShip, generateShip, getShipGeneratorOptions, getShipGenerators, openShipDossier } from "../../../api/ships.js";
import { ShipProfileViewModel } from "../models/ShipProfileViewModel.js";
import { ShipDataEditor } from "./ShipDataEditor.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class ShipCreateDialog extends HandlebarsApplicationMixin(ApplicationV2) {
    #selectedGeneratorId = null;
    #selectedTemplateId = "random";
    #generatorOptions = {};
    #candidate = null;

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-ship-create",
        classes: ["augur-nexus", "npc-create-dialog", "ship-create-dialog"],
        tag: "div",
        window: { title: "New Ship", resizable: false, minimizable: false },
        position: { width: 460, height: "auto" },
        actions: {
            acceptCandidate: ShipCreateDialog._onAcceptCandidate,
            cancel: ShipCreateDialog._onCancel,
            rerollCandidate: ShipCreateDialog._onRerollCandidate,
            editCandidate: ShipCreateDialog._onEditCandidate
        }
    };

    static PARTS = { content: { template: "modules/augur-nexus/templates/campaign-entities/ship-create-dialog.hbs", templates: ["modules/augur-nexus/templates/campaign-entities/ship-profile-panel.hbs"] } };

    static show() { const app = new this(); app.render(true, { focus: true }); return app; }

    async _prepareContext() {
        const generators = getShipGenerators();
        if (this.#selectedGeneratorId === null && generators.length) this.#selectedGeneratorId = generators[0].id;
        this.#generatorOptions = this.#selectedGeneratorId ? await getShipGeneratorOptions(this.#selectedGeneratorId) : {};
        const templates = this.#buildOptions(this.#generatorOptions.templates || [], this.#selectedTemplateId || this.#generatorOptions.defaults?.templateId || "random");
        return {
            name: "New Ship",
            generators: [{ id: "", label: "Manual Ship", selected: !this.#selectedGeneratorId }, ...generators.map(generator => ({ ...generator, selected: generator.id === this.#selectedGeneratorId }))],
            hasGenerators: generators.length > 0,
            hasGeneratorSelected: !!this.#selectedGeneratorId,
            generatorOptions: { templates, hasTemplates: templates.length > 0 },
            candidate: this.#candidate ? { profile: ShipProfileViewModel.fromCandidate(this.#candidate), data: this.#candidate } : null,
            hasCandidate: !!this.#candidate
        };
    }

    _onRender(context, options) {
        super._onRender(context, options);
        this.element?.querySelector("form")?.addEventListener("submit", event => { ShipCreateDialog._onCreateShip.call(this, event); });
        this.element?.querySelector("[name='generatorId']")?.addEventListener("change", event => { this.#selectedGeneratorId = event.currentTarget.value || ""; this.#selectedTemplateId = "random"; this.#candidate = null; this.render({ parts: ["content"] }); });
        this.element?.querySelector("[name='generatorTemplateId']")?.addEventListener("change", async event => { this.#selectedTemplateId = event.currentTarget.value || "random"; if (this.#candidate) await this.#generateCandidate(this.element?.querySelector?.("form") || this.element); });
    }

    static async _onCreateShip(event) {
        event?.preventDefault?.();
        const form = this.element?.querySelector?.("form") || this.element;
        const formData = new FormData(form);
        const generatorId = String(formData.get("generatorId") || "").trim();
        if (this.#candidate) return;
        if (generatorId) { await this.#generateCandidate(form); return; }
        const name = String(formData.get("name") || "New Ship").trim() || "New Ship";
        const model = String(formData.get("model") || "").trim();
        const ship = await createShip({ sourceModule: "augur-nexus", display: { name, color: "#55bdec" }, profile: { model } });
        await this.close();
        await openShipDossier(ship.id);
    }

    static async _onCancel() { await this.close(); }
    static async _onRerollCandidate() { await this.#generateCandidate(this.element?.querySelector?.("form") || this.element); }
    static async _onEditCandidate() { if (this.#candidate) ShipDataEditor.show({ candidate: this.#candidate, onSave: updated => { this.#candidate = updated; this.render({ parts: ["content"] }); } }); }
    static async _onAcceptCandidate() { if (!this.#candidate) return; const ship = await createShip(this.#candidate); await this.close(); await openShipDossier(ship.id); }

    async #generateCandidate(form) {
        const formData = new FormData(form);
        const generatorId = String(formData.get("generatorId") || this.#selectedGeneratorId || "").trim();
        if (!generatorId) return;
        this.#selectedGeneratorId = generatorId;
        this.#selectedTemplateId = String(formData.get("generatorTemplateId") || "random").trim() || "random";
        this.#candidate = await generateShip(generatorId, { templateId: this.#selectedTemplateId });
        this.render({ parts: ["content"] });
    }

    #buildOptions(options = [], selectedId = "random") {
        const rows = options.map(option => ({ ...option, selected: option.id === selectedId }));
        if (!rows.some(option => option.id === "random")) rows.unshift({ id: "random", label: "Any", selected: selectedId === "random" });
        return rows.map(option => ({ ...option, label: option.id === "random" ? "Any" : option.label }));
    }
}
