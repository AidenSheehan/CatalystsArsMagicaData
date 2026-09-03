import { updateNpc } from "../../../api/npcs.js";
import { PersonalityTraitRegistry } from "../services/PersonalityTraitRegistry.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class NpcTraitPicker extends HandlebarsApplicationMixin(ApplicationV2) {
    #npcId = "";
    #selected = [];
    #onSave = null;
    #message = "";

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-npc-trait-picker",
        classes: ["augur-nexus", "npc-trait-picker"],
        tag: "div",
        window: {
            title: "Edit Traits",
            resizable: true,
            minimizable: false
        },
        position: {
            width: 650,
            height: 620
        }
    };

    static PARTS = {
        content: {
            template: "modules/augur-nexus/templates/campaign-entities/npc-trait-picker.hbs"
        }
    };

    static show({ npcId, selectedTraitIds = [], onSave = null } = {}) {
        const app = new this({ npcId, selectedTraitIds, onSave });
        app.render(true, { focus: true });
        return app;
    }

    constructor({ npcId, selectedTraitIds = [], onSave = null } = {}, options = {}) {
        super(options);
        this.#npcId = npcId || "";
        this.#selected = [...new Set((selectedTraitIds || []).map(id => String(id || "").trim()).filter(Boolean))];
        this.#onSave = onSave;
    }

    _attachPartListeners(partId, htmlElement, options) {
        if (super._attachPartListeners) super._attachPartListeners(partId, htmlElement, options);
        const element = htmlElement instanceof HTMLElement ? htmlElement : htmlElement?.[0];
        if (!element) return;

        this.#activateActionListeners(element);
    }

    #activateActionListeners(element) {
        const root = element instanceof HTMLElement ? element : element?.[0] || element;
        root?.querySelectorAll("[data-action='toggleTrait']").forEach(button => {
            if (button.dataset.npcTraitPickerBound) return;
            button.dataset.npcTraitPickerBound = "true";
            button.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                NpcTraitPicker._onToggleTrait.call(this, event, event.currentTarget);
            });
        });

        const saveButton = root?.querySelector("[data-action='saveTraits']");
        if (saveButton && !saveButton.dataset.npcTraitPickerBound) saveButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            NpcTraitPicker._onSaveTraits.call(this, event, event.currentTarget);
        });
        if (saveButton) saveButton.dataset.npcTraitPickerBound = "true";

        const cancelButton = root?.querySelector("[data-action='cancel']");
        if (cancelButton && !cancelButton.dataset.npcTraitPickerBound) cancelButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            NpcTraitPicker._onCancel.call(this, event, event.currentTarget);
        });
        if (cancelButton) cancelButton.dataset.npcTraitPickerBound = "true";
    }

    _onRender(context, options) {
        super._onRender(context, options);
        this.#activateActionListeners(this.element);
    }

    async _prepareContext() {
        const traits = await PersonalityTraitRegistry.load();
        const selectedSet = new Set(this.#selected);
        const selectedOpposites = new Set(this.#selected.map(id => PersonalityTraitRegistry.getTrait(id)?.oppositeId).filter(Boolean));
        const max = PersonalityTraitRegistry.maxTraits;
        return {
            selectedCount: this.#selected.length,
            maxTraits: max,
            limitReached: this.#selected.length >= max,
            message: this.#message,
            currentTraits: PersonalityTraitRegistry.resolveTraits(this.#selected),
            traits: traits.map(trait => {
                const selected = selectedSet.has(trait.id);
                const conflict = !selected && selectedOpposites.has(trait.id);
                const conflictSource = conflict ? this.#selected.find(id => PersonalityTraitRegistry.getTrait(id)?.oppositeId === trait.id) : "";
                return {
                    ...trait,
                    selected,
                    conflict,
                    disabled: conflict,
                    title: conflict ? `Conflicts with ${PersonalityTraitRegistry.getTrait(conflictSource)?.label || conflictSource}` : trait.label
                };
            })
        };
    }

    static async _onToggleTrait(_event, target) {
        const app = this;
        const traitId = target?.dataset?.traitId || "";
        if (!traitId) return;
        app.#message = "";

        if (app.#selected.includes(traitId)) {
            app.#selected = app.#selected.filter(id => id !== traitId);
            app.render({ parts: ["content"] });
            return;
        }

        const trait = PersonalityTraitRegistry.getTrait(traitId);
        if (!trait) return;
        if (trait.oppositeId && app.#selected.includes(trait.oppositeId)) {
            app.#message = `${trait.label} conflicts with ${PersonalityTraitRegistry.getTrait(trait.oppositeId)?.label || trait.oppositeId}.`;
            app.render({ parts: ["content"] });
            return;
        }

        if (app.#selected.length >= PersonalityTraitRegistry.maxTraits) {
            app.#message = `People may have at most ${PersonalityTraitRegistry.maxTraits} personality traits.`;
            app.render({ parts: ["content"] });
            return;
        }

        app.#selected = [...app.#selected, traitId];
        app.render({ parts: ["content"] });
    }

    static async _onSaveTraits() {
        const app = this;
        try {
            const traitIds = PersonalityTraitRegistry.validateTraitIds(app.#selected);
            if (app.#npcId) await updateNpc(app.#npcId, { personality: { traitIds } });
            if (typeof app.#onSave === "function") app.#onSave(traitIds);
            await app.close();
        } catch (err) {
            app.#message = err.message || "Could not save traits.";
            app.render({ parts: ["content"] });
        }
    }

    static async _onCancel() {
        await this.close();
    }
}
