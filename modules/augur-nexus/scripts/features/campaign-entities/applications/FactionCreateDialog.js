import { createFaction, generateFaction, getFactionGeneratorOptions, getFactionGenerators, openFactionDossier } from "../../../api/factions.js";
import { FactionProfileViewModel } from "../models/FactionProfileViewModel.js";
import { FactionDataEditor } from "./FactionDataEditor.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class FactionCreateDialog extends HandlebarsApplicationMixin(ApplicationV2) {
    #selectedGeneratorId = null;
    #selectedTypeId = "random";
    #generatorOptions = {};
    #candidate = null;

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-faction-create",
        classes: ["augur-nexus", "npc-create-dialog", "faction-create-dialog"],
        tag: "div",
        window: {
            title: "New Organization",
            resizable: false,
            minimizable: false
        },
        position: {
            width: 420,
            height: "auto"
        },
        actions: {
            acceptCandidate: FactionCreateDialog._onAcceptCandidate,
            cancel: FactionCreateDialog._onCancel,
            rerollCandidate: FactionCreateDialog._onRerollCandidate,
            editCandidate: FactionCreateDialog._onEditCandidate
        }
    };

    static PARTS = {
        content: {
            template: "modules/augur-nexus/templates/campaign-entities/faction-create-dialog.hbs",
            templates: [
                "modules/augur-nexus/templates/campaign-entities/faction-profile-panel.hbs"
            ]
        }
    };

    static show() {
        const app = new this();
        app.render(true, { focus: true });
        return app;
    }

    async _prepareContext() {
        const generators = getFactionGenerators();
        if (this.#selectedGeneratorId === null && generators.length) this.#selectedGeneratorId = generators[0].id;
        this.#generatorOptions = this.#selectedGeneratorId ? await getFactionGeneratorOptions(this.#selectedGeneratorId) : {};
        const types = this.#buildOptions(this.#generatorOptions.types || [], this.#selectedTypeId || this.#generatorOptions.defaults?.typeId || "random");
        return {
            name: "New Organization",
            generators: [
                { id: "", label: "Manual Organization", selected: !this.#selectedGeneratorId },
                ...generators.map(generator => ({ ...generator, selected: generator.id === this.#selectedGeneratorId }))
            ],
            hasGenerators: generators.length > 0,
            hasGeneratorSelected: !!this.#selectedGeneratorId,
            selectedGeneratorId: this.#selectedGeneratorId,
            generatorOptions: {
                types,
                hasTypes: types.length > 0
            },
            candidate: this.#candidate ? {
                profile: FactionProfileViewModel.fromCandidate(this.#candidate),
                data: this.#candidate
            } : null,
            hasCandidate: !!this.#candidate
        };
    }

    _onRender(context, options) {
        super._onRender(context, options);
        this.element?.querySelector("form")?.addEventListener("submit", event => {
            FactionCreateDialog._onCreateFaction.call(this, event);
        });
        this.element?.querySelector("[name='generatorId']")?.addEventListener("change", event => {
            this.#selectedGeneratorId = event.currentTarget.value || "";
            this.#selectedTypeId = "random";
            this.#candidate = null;
            this.render({ parts: ["content"] });
        });
        this.element?.querySelector("[name='generatorTypeId']")?.addEventListener("change", async event => {
            this.#selectedTypeId = event.currentTarget.value || "random";
            if (this.#candidate) await this.#generateCandidate(this.element?.querySelector?.("form") || this.element);
        });
    }

    static async _onCreateFaction(event) {
        event?.preventDefault?.();
        const form = this.element?.querySelector?.("form") || this.element;
        const formData = new FormData(form);
        const generatorId = String(formData.get("generatorId") || "").trim();
        if (this.#candidate) return;
        if (generatorId) {
            await this.#generateCandidate(form);
            return;
        }

        const name = String(formData.get("name") || "New Organization").trim() || "New Organization";
        const type = String(formData.get("type") || "").trim();
        const faction = await createFaction({
            sourceModule: "augur-nexus",
            display: { name, color: "#83c95f" },
            profile: { type }
        });
        await this.close();
        await openFactionDossier(faction.id);
    }

    static async _onCancel() {
        await this.close();
    }

    static async _onRerollCandidate() {
        const form = this.element?.querySelector?.("form") || this.element;
        await this.#generateCandidate(form);
    }

    static async _onEditCandidate() {
        if (!this.#candidate) return;
        FactionDataEditor.show({
            candidate: this.#candidate,
            onSave: updated => {
                this.#candidate = updated;
                this.render({ parts: ["content"] });
            }
        });
    }

    static async _onAcceptCandidate() {
        if (!this.#candidate) return;
        const faction = await createFaction(this.#candidate);
        await this.close();
        await openFactionDossier(faction.id);
    }

    async #generateCandidate(form) {
        const formData = new FormData(form);
        const generatorId = String(formData.get("generatorId") || this.#selectedGeneratorId || "").trim();
        if (!generatorId) return;
        this.#selectedGeneratorId = generatorId;
        this.#selectedTypeId = String(formData.get("generatorTypeId") || "random").trim() || "random";
        this.#candidate = await generateFaction(generatorId, { typeId: this.#selectedTypeId });
        this.render({ parts: ["content"] });
    }

    #buildOptions(options = [], selectedId = "random") {
        const rows = options.map(option => ({ ...option, selected: option.id === selectedId }));
        if (!rows.some(option => option.id === "random")) {
            rows.unshift({ id: "random", label: "Any", selected: selectedId === "random" });
        }
        return rows.map(option => ({ ...option, label: option.id === "random" ? "Any" : option.label }));
    }
}
