import { createNpc, generateNpc, getNpcGeneratorOptions, getNpcGenerators, openNpcDossier } from "../../../api/npcs.js";
import { NpcProfileViewModel } from "../models/NpcProfileViewModel.js";
import { NpcDataEditor } from "./NpcDataEditor.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class NpcCreateDialog extends HandlebarsApplicationMixin(ApplicationV2) {
    #selectedGeneratorId = null;
    #selectedGender = "random";
    #selectedRoleId = "random";
    #generatorOptions = {};
    #candidate = null;
    #onCreated = null;
    #openAfterCreate = true;

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-npc-create",
        classes: ["augur-nexus", "npc-create-dialog"],
        tag: "div",
        window: {
            title: "New Person",
            resizable: false,
            minimizable: false
        },
        position: {
            width: 420,
            height: "auto"
        },
        actions: {
            acceptCandidate: NpcCreateDialog._onAcceptCandidate,
            cancel: NpcCreateDialog._onCancel,
            rerollCandidate: NpcCreateDialog._onRerollCandidate,
            editCandidate: NpcCreateDialog._onEditCandidate
        }
    };

    static PARTS = {
        content: {
            template: "modules/augur-nexus/templates/campaign-entities/npc-create-dialog.hbs",
            templates: [
                "modules/augur-nexus/templates/campaign-entities/npc-profile-panel.hbs"
            ]
        }
    };

    static show(options = {}) {
        const app = new this(options);
        app.render(true, { focus: true });
        return app;
    }

    constructor({ onCreated = null, openAfterCreate = true } = {}, options = {}) {
        super(options);
        this.#onCreated = typeof onCreated === "function" ? onCreated : null;
        this.#openAfterCreate = openAfterCreate !== false;
    }

    async _prepareContext() {
        const generators = getNpcGenerators();
        if (this.#selectedGeneratorId === null && generators.length) this.#selectedGeneratorId = generators[0].id;
        this.#generatorOptions = this.#selectedGeneratorId ? await getNpcGeneratorOptions(this.#selectedGeneratorId) : {};
        const roles = this.#buildOptions(this.#generatorOptions.roles || [], this.#selectedRoleId || this.#generatorOptions.defaults?.roleId || "random");
        const genders = this.#buildOptions(this.#generatorOptions.genders || [], this.#selectedGender || this.#generatorOptions.defaults?.gender || "random");
        return {
            name: "New Person",
            generators: [
                {
                    id: "",
                    label: "Manual Person",
                    selected: !this.#selectedGeneratorId
                },
                ...generators.map(generator => ({
                    ...generator,
                    selected: generator.id === this.#selectedGeneratorId
                }))
            ],
            hasGenerators: generators.length > 0,
            hasGeneratorSelected: !!this.#selectedGeneratorId,
            selectedGeneratorId: this.#selectedGeneratorId,
            generatorOptions: {
                roles,
                genders,
                hasRoles: roles.length > 0,
                hasGenders: genders.length > 0
            },
            candidate: this.#candidate ? {
                profile: NpcProfileViewModel.fromCandidate(this.#candidate, {
                    emptyTraitsLabel: "No personality traits rolled."
                }),
                data: this.#candidate
            } : null,
            hasCandidate: !!this.#candidate
        };
    }

    _onRender(context, options) {
        super._onRender(context, options);
        this.element?.querySelector("form")?.addEventListener("submit", event => {
            NpcCreateDialog._onCreateNpc.call(this, event);
        });
        this.element?.querySelector("[name='generatorId']")?.addEventListener("change", event => {
            this.#selectedGeneratorId = event.currentTarget.value || "";
            this.#selectedRoleId = "random";
            this.#selectedGender = "random";
            this.#candidate = null;
            this.render({ parts: ["content"] });
        });
        this.element?.querySelector("[name='generatorRoleId']")?.addEventListener("change", async event => {
            this.#selectedRoleId = event.currentTarget.value || "random";
            if (this.#candidate) await this.#generateCandidate(this.element?.querySelector?.("form") || this.element);
        });
        this.element?.querySelector("[name='generatorGender']")?.addEventListener("change", async event => {
            this.#selectedGender = event.currentTarget.value || "random";
            if (this.#candidate) await this.#generateCandidate(this.element?.querySelector?.("form") || this.element);
        });
    }

    static async _onCreateNpc(event) {
        event?.preventDefault?.();
        const app = this;
        const form = app.element?.querySelector?.("form") || app.element;
        const formData = new FormData(form);
        const generatorId = String(formData.get("generatorId") || "").trim();
        if (app.#candidate) {
            return;
        }
        if (generatorId) {
            await app.#generateCandidate(form);
            return;
        }

        const name = String(formData.get("name") || "New Person").trim() || "New Person";
        const roleLabel = String(formData.get("roleLabel") || "").trim();
        const npc = await createNpc({
            sourceModule: "augur-nexus",
            display: {
                name,
                color: "#55bdec"
            },
            role: {
                roleId: roleLabel.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
                roleLabel
            }
        });
        if (app.#onCreated) await app.#onCreated(npc, { candidate: null });
        await app.close();
        if (app.#openAfterCreate) await openNpcDossier(npc.id);
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
        NpcDataEditor.show({
            candidate: this.#candidate,
            onSave: updated => {
                this.#candidate = updated;
                this.render({ parts: ["content"] });
            }
        });
    }

    static async _onAcceptCandidate() {
        if (!this.#candidate) return;
        const npc = await createNpc(this.#candidate);
        if (this.#onCreated) await this.#onCreated(npc, { candidate: this.#candidate });
        await this.close();
        if (this.#openAfterCreate) await openNpcDossier(npc.id);
    }

    async #generateCandidate(form) {
        const formData = new FormData(form);
        const generatorId = String(formData.get("generatorId") || this.#selectedGeneratorId || "").trim();
        if (!generatorId) return;
        this.#selectedGeneratorId = generatorId;
        this.#selectedRoleId = String(formData.get("generatorRoleId") || "random").trim() || "random";
        this.#selectedGender = String(formData.get("generatorGender") || "random").trim() || "random";
        this.#candidate = await generateNpc(generatorId, {
            roleId: this.#selectedRoleId,
            gender: this.#selectedGender
        });
        this.render({ parts: ["content"] });
    }

    #buildOptions(options = [], selectedId = "random") {
        const rows = options.map(option => ({
            ...option,
            selected: option.id === selectedId
        }));
        if (!rows.some(option => option.id === "random")) {
            rows.unshift({
                id: "random",
                label: "Any",
                selected: selectedId === "random"
            });
        }
        return rows.map(option => ({
            ...option,
            label: option.id === "random" ? "Any" : option.label
        }));
    }
}
