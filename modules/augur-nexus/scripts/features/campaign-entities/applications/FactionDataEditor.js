import { getFaction, getFactionGeneratorProfileOptions, updateFaction } from "../../../api/factions.js";
import { promptTextInput } from "../../../api/ui.js";
import { FactionEntityModel } from "../models/FactionEntityModel.js";
import { FactionEmblemPicker } from "./FactionEmblemPicker.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const FIELD_DEFINITIONS = [
    { key: "type", label: "Type" },
    { key: "method", label: "Method" },
    { key: "drive", label: "Drive" },
    { key: "action", label: "Action" },
    { key: "theme", label: "Theme" },
    { key: "focus", label: "Focus" }
];

export class FactionDataEditor extends HandlebarsApplicationMixin(ApplicationV2) {
    #factionId = "";
    #candidate = null;
    #onSave = null;

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-faction-data-editor",
        classes: ["augur-nexus", "npc-data-editor", "faction-data-editor"],
        tag: "div",
        window: { title: "Edit Organization", resizable: true, minimizable: true },
        position: { width: 440, height: 560 },
        actions: {
            save: FactionDataEditor._onSave,
            closeEditor: FactionDataEditor._onCloseEditor,
            toggleCombo: FactionDataEditor._onToggleCombo,
            selectComboOption: FactionDataEditor._onSelectComboOption,
            renameFaction: FactionDataEditor._onRenameFaction,
            changeEmblem: FactionDataEditor._onChangeEmblem,
            addCustomField: FactionDataEditor._onAddCustomField,
            deleteCustomField: FactionDataEditor._onDeleteCustomField,
            toggleDefaultField: FactionDataEditor._onToggleDefaultField,
            moveCustomFieldUp: FactionDataEditor._onMoveCustomFieldUp,
            moveCustomFieldDown: FactionDataEditor._onMoveCustomFieldDown
        }
    };

    static PARTS = { content: { template: "modules/augur-nexus/templates/campaign-entities/faction-data-editor.hbs" } };

    static show({ factionId = "", candidate = null, onSave = null } = {}) {
        if (!game.user.isGM || (!factionId && !candidate)) return null;
        const app = new this({ factionId, candidate, onSave });
        app.render(true, { focus: true });
        return app;
    }

    constructor({ factionId = "", candidate = null, onSave = null } = {}, options = {}) {
        super(options);
        this.#factionId = factionId || "";
        this.#candidate = candidate ? foundry.utils.deepClone(candidate) : null;
        this.#onSave = typeof onSave === "function" ? onSave : null;
    }

    async _prepareContext() {
        const entity = this.#getEntity();
        const hiddenDefaultFields = this.#getHiddenDefaultFields(entity);
        const profileOptions = await getFactionGeneratorProfileOptions(entity?.generation?.generatorId || "");
        return {
            missing: !entity,
            faction: entity ? { id: entity.id, name: FactionEntityModel.getName(entity), subtitle: FactionEntityModel.getSubtitle(entity), imageSrc: FactionEntityModel.getImage(entity) } : { name: "Missing Organization" },
            fields: FIELD_DEFINITIONS.map(definition => {
                const value = String(entity?.profile?.[definition.key] || "");
                return { ...definition, value, hidden: hiddenDefaultFields.has(definition.key), options: this.#buildOptions(profileOptions.fields?.[definition.key] || [], value) };
            }),
            customFields: FactionEntityModel.getCustomFields(entity)
        };
    }

    _onRender(context, options) {
        super._onRender(context, options);
        this.setPosition(this.#getCenteredPosition());
        this.element.querySelector("form")?.addEventListener("submit", event => {
            event.preventDefault();
            this.#saveForm();
        });
        this.element.addEventListener("click", event => {
            if (!event.target?.closest?.(".npc-data-combo")) this.#closeCombos();
        });
    }

    static async _onSave() { return this.#saveForm(); }
    static async _onCloseEditor() { await this.close(); }

    static async _onRenameFaction() {
        const entity = this.#getEntity();
        if (!entity) return;
        const name = await promptTextInput({ title: "Rename Organization", label: "Name", value: FactionEntityModel.getName(entity), confirmLabel: "Rename" });
        if (!name) return;
        if (this.#candidate) {
            this.#candidate.display = { ...(this.#candidate.display || {}), name };
            this.#onSave?.(foundry.utils.deepClone(this.#candidate));
        } else {
            await updateFaction(entity.id, { display: { name } });
            this.#onSave?.(getFaction(this.#factionId));
        }
        this.render({ parts: ["content"] });
    }

    static async _onChangeEmblem() {
        const entity = this.#getEntity();
        if (!entity) return;
        new FactionEmblemPicker({ currentEmblemSrc: FactionEntityModel.getImage(entity), onSelect: selection => this.#setEmblem(selection?.src || "") }).render(true, { focus: true });
    }

    static async _onToggleCombo(event, target) {
        const key = target?.dataset?.comboKey || "";
        const combo = key ? this.element.querySelector(`[data-combo="${CSS.escape(key)}"]`) : null;
        if (!combo) return;
        const wasOpen = combo.classList.contains("open");
        this.#closeCombos();
        combo.classList.toggle("open", !wasOpen);
        combo.querySelector("input")?.focus();
    }

    static async _onSelectComboOption(event, target) {
        const key = target?.dataset?.comboKey || "";
        const combo = key ? this.element.querySelector(`[data-combo="${CSS.escape(key)}"]`) : null;
        const input = combo?.querySelector("input");
        if (!input) return;
        input.value = target?.dataset?.comboValue || "";
        this.#closeCombos();
        input.focus();
    }

    static async _onAddCustomField() {
        const container = this.element.querySelector("[data-custom-fields]");
        if (!container) return;
        const id = `field.${foundry.utils.randomID()}`;
        const row = document.createElement("div");
        row.className = "npc-data-custom-field-row";
        row.dataset.customFieldRow = id;
        row.innerHTML = this.#renderCustomFieldRow({ id, label: "", value: "" });
        this.#wireCustomFieldRow(row);
        container.append(row);
        row.querySelector("[name='customField.label']")?.focus();
    }

    static async _onDeleteCustomField(event, target) { target?.closest?.("[data-custom-field-row]")?.remove(); }
    static async _onToggleDefaultField(event, target) { this.#toggleDefaultFieldButton(target); }
    static async _onMoveCustomFieldUp(event, target) { this.#moveCustomField(target, -1); }
    static async _onMoveCustomFieldDown(event, target) { this.#moveCustomField(target, 1); }

    async #saveForm() {
        const entity = this.#getEntity();
        const form = this.element.querySelector("form");
        if (!entity || !form) return;
        const formData = new FormData(form);
        const profile = {};
        for (const field of FIELD_DEFINITIONS) profile[field.key] = String(formData.get(`profile.${field.key}`) || "").trim();
        profile.customFields = this.#collectCustomFields(form);
        const dossier = { hiddenDefaultFields: this.#collectHiddenDefaultFields(form) };
        try {
            const updated = this.#candidate ? this.#applyCandidatePatch(entity, { profile, dossier }) : await updateFaction(entity.id, { profile, dossier });
            ui.notifications.info(this.#candidate ? "Organization candidate updated." : "Organization updated.");
            this.#onSave?.(updated);
            await this.close();
        } catch (err) {
            console.error(err);
            ui.notifications.error(this.#candidate ? "Failed to update organization candidate." : "Failed to update organization.");
        }
    }

    async #setEmblem(path) {
        const entity = this.#getEntity();
        if (!entity || !path) return;
        if (this.#candidate) {
            this.#candidate.display = { ...(this.#candidate.display || {}), imageSrc: path };
            this.#onSave?.(foundry.utils.deepClone(this.#candidate));
        } else {
            await updateFaction(entity.id, { display: { imageSrc: path } });
            this.#onSave?.(getFaction(this.#factionId));
        }
        this.render({ parts: ["content"] });
    }

    #getEntity() { return this.#candidate || getFaction(this.#factionId); }
    #applyCandidatePatch(entity, patch) { this.#candidate = foundry.utils.mergeObject(foundry.utils.deepClone(entity), patch, { inplace: false, recursive: true }); return foundry.utils.deepClone(this.#candidate); }
    #buildOptions(options = [], currentValue = "") {
        const values = new Set((options || []).map(option => String(option?.value || option?.label || option || "").trim()).filter(Boolean));
        if (currentValue) values.add(currentValue);
        return [...values].map(value => ({ value, label: value, selected: value === currentValue }));
    }
    #getHiddenDefaultFields(entity = {}) { return new Set(Array.isArray(entity?.dossier?.hiddenDefaultFields) ? entity.dossier.hiddenDefaultFields : []); }
    #collectHiddenDefaultFields(form) { return [...form.querySelectorAll("input[name='defaultFieldHidden']:checked")].map(input => input.value).filter(Boolean); }
    #collectCustomFields(form) {
        return [...form.querySelectorAll("[data-custom-field-row]")].map(row => ({ id: row.querySelector("[name='customField.id']")?.value || row.dataset.customFieldRow || "", label: row.querySelector("[name='customField.label']")?.value || "", value: row.querySelector("[name='customField.value']")?.value || "" })).filter(field => String(field.label || "").trim() || String(field.value || "").trim());
    }
    #renderCustomFieldRow(field = {}) {
        const safe = value => foundry.utils.escapeHTML(String(value || ""));
        return `<input type="hidden" name="customField.id" value="${safe(field.id)}"><input type="text" name="customField.label" value="${safe(field.label)}" placeholder="Field" autocomplete="off"><input type="text" name="customField.value" value="${safe(field.value)}" placeholder="Value" autocomplete="off"><button type="button" class="npc-data-custom-field-move" data-action="moveCustomFieldUp" title="Move field up" aria-label="Move field up"><i class="fas fa-arrow-up"></i></button><button type="button" class="npc-data-custom-field-move" data-action="moveCustomFieldDown" title="Move field down" aria-label="Move field down"><i class="fas fa-arrow-down"></i></button><button type="button" class="npc-data-custom-field-delete" data-action="deleteCustomField" title="Delete field" aria-label="Delete field"><i class="fas fa-trash"></i></button>`;
    }
    #wireCustomFieldRow(row) {
        row.querySelector("[data-action='deleteCustomField']")?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            row.remove();
        });
        row.querySelector("[data-action='moveCustomFieldUp']")?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            this.#moveCustomField(event.currentTarget, -1);
        });
        row.querySelector("[data-action='moveCustomFieldDown']")?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            this.#moveCustomField(event.currentTarget, 1);
        });
    }

    #toggleDefaultFieldButton(target) {
        const button = target?.closest?.(".npc-data-field-visibility") || target;
        const input = button?.querySelector?.("input[name='defaultFieldHidden']");
        if (!input) return;
        input.checked = !input.checked;
        button.classList.toggle("is-hidden-field", input.checked);
        button.title = input.checked ? "Show field" : "Hide field";
        button.setAttribute("aria-label", button.title);
        const icon = button.querySelector("i");
        icon?.classList.toggle("fa-eye", !input.checked);
        icon?.classList.toggle("fa-eye-slash", input.checked);
    }
    #moveCustomField(target, direction) {
        const row = target?.closest?.("[data-custom-field-row]");
        if (!row) return;
        if (direction < 0 && row.previousElementSibling) row.previousElementSibling.before(row);
        if (direction > 0 && row.nextElementSibling) row.nextElementSibling.after(row);
    }
    #closeCombos() { for (const combo of this.element.querySelectorAll(".npc-data-combo.open")) combo.classList.remove("open", "drop-up"); }
    #getCenteredPosition() {
        const width = Math.max(380, Math.min(460, window.innerWidth - 40));
        const height = Math.max(500, Math.min(640, window.innerHeight - 40));
        return { width, height, left: Math.max(20, Math.round((window.innerWidth - width) / 2)), top: Math.max(20, Math.round((window.innerHeight - height) / 2)) };
    }
}