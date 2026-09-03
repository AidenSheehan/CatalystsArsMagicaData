import { getNpc, getNpcGeneratorProfileOptions, updateNpc } from "../../../api/npcs.js";
import { promptTextInput } from "../../../api/ui.js";
import { NpcEntityModel } from "../models/NpcEntityModel.js";
import { NpcPortraitPicker } from "./NpcPortraitPicker.js";
import { NpcTraitPicker } from "./NpcTraitPicker.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const FIELD_DEFINITIONS = [
    { key: "descriptor", label: "Descriptor", path: "flavor.descriptor" },
    { key: "drive", label: "Drive", path: "flavor.drive" },
    { key: "action", label: "Action", path: "flavor.action" },
    { key: "theme", label: "Theme", path: "flavor.theme" },
    { key: "focus", label: "Focus", path: "flavor.focus" }
];

export class NpcDataEditor extends HandlebarsApplicationMixin(ApplicationV2) {
    #npcId = "";
    #candidate = null;
    #onSave = null;

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-npc-data-editor",
        classes: ["augur-nexus", "npc-data-editor"],
        tag: "div",
        window: { title: "Edit Person", resizable: true, minimizable: true },
        position: { width: 440, height: 560 },
        actions: {
            save: NpcDataEditor._onSave,
            closeEditor: NpcDataEditor._onCloseEditor,
            toggleCombo: NpcDataEditor._onToggleCombo,
            selectComboOption: NpcDataEditor._onSelectComboOption,
            renameNpc: NpcDataEditor._onRenameNpc,
            changePortrait: NpcDataEditor._onChangePortrait,
            editTraits: NpcDataEditor._onEditTraits,
            addCustomField: NpcDataEditor._onAddCustomField,
            deleteCustomField: NpcDataEditor._onDeleteCustomField,
            toggleDefaultField: NpcDataEditor._onToggleDefaultField,
            moveCustomFieldUp: NpcDataEditor._onMoveCustomFieldUp,
            moveCustomFieldDown: NpcDataEditor._onMoveCustomFieldDown
        }
    };

    static PARTS = { content: { template: "modules/augur-nexus/templates/campaign-entities/npc-data-editor.hbs" } };

    static show({ npcId = "", candidate = null, onSave = null } = {}) {
        if (!game.user.isGM || (!npcId && !candidate)) return null;
        const app = new this({ npcId, candidate, onSave });
        app.render(true, { focus: true });
        return app;
    }

    constructor({ npcId = "", candidate = null, onSave = null } = {}, options = {}) {
        super(options);
        this.#npcId = npcId || "";
        this.#candidate = candidate ? foundry.utils.deepClone(candidate) : null;
        this.#onSave = typeof onSave === "function" ? onSave : null;
    }

    async _prepareContext() {
        const entity = this.#getEntity();
        const profileOptions = await getNpcGeneratorProfileOptions(entity?.generation?.generatorId || "");
        const roleOptions = this.#buildRoleOptions(profileOptions.roles || [], entity);
        const traits = NpcEntityModel.getTraits(entity);
        const hiddenDefaultFields = this.#getHiddenDefaultFields(entity);

        return {
            missing: !entity,
            npc: entity ? {
                id: entity.id,
                name: NpcEntityModel.getName(entity),
                subtitle: NpcEntityModel.getSubtitle(entity),
                imageSrc: NpcEntityModel.getImage(entity)
            } : { name: "Missing Person" },
            role: {
                value: entity?.role?.roleLabel || "",
                options: roleOptions,
                hidden: hiddenDefaultFields.has("role")
            },
            traits,
            hasTraits: traits.length > 0,
            fields: FIELD_DEFINITIONS.map(definition => {
                const value = this.#getFieldValue(entity, definition.path);
                return {
                    ...definition,
                    value,
                    hidden: hiddenDefaultFields.has(definition.key),
                    options: this.#buildOptions(profileOptions.fields?.[definition.key] || [], value)
                };
            }),
            customFields: NpcEntityModel.getCustomFields(entity)
        };
    }

    _onRender(context, options) {
        super._onRender(context, options);
        this.setPosition(this.#getCenteredPosition());
        this.element.querySelector("form")?.addEventListener("submit", event => {
            event.preventDefault();
            this.#saveForm();
        });
        this.element.addEventListener("focusin", event => {
            if (!event.target?.closest?.(".npc-data-combo")) this.#closeCombos();
        });
        this.element.addEventListener("click", event => {
            if (!event.target?.closest?.(".npc-data-combo")) this.#closeCombos();
        });
    }

    static async _onSave() { return this.#saveForm(); }
    static async _onCloseEditor() { await this.close(); }

    static async _onRenameNpc() {
        const app = this;
        const entity = app.#getEntity();
        if (!entity) return;
        const nextName = await promptTextInput({ title: "Rename Person", label: "Name", value: NpcEntityModel.getName(entity), confirmLabel: "Rename" });
        if (!nextName) return;
        if (app.#candidate) {
            app.#candidate.display = { ...(app.#candidate.display || {}), name: nextName };
            if (app.#onSave) await app.#onSave(foundry.utils.deepClone(app.#candidate));
        } else {
            await updateNpc(entity.id, { display: { name: nextName } });
            if (app.#onSave) await app.#onSave(getNpc(app.#npcId));
        }
        app.render({ parts: ["content"] });
    }

    static async _onChangePortrait() {
        const app = this;
        const entity = app.#getEntity();
        if (!entity) return;
        new NpcPortraitPicker({ currentPortraitSrc: NpcEntityModel.getImage(entity), onSelect: selection => app.#setPortrait(selection?.src || "") }).render(true, { focus: true });
    }

    static async _onEditTraits() {
        const app = this;
        const entity = app.#getEntity();
        if (!entity) return;
        NpcTraitPicker.show({
            npcId: app.#candidate ? "" : entity.id,
            selectedTraitIds: entity.personality?.traitIds || [],
            onSave: traitIds => app.#candidate ? app.#setTraitIds(traitIds) : app.#refreshSavedEntity()
        });
    }

    static async _onToggleCombo(event, target) {
        const app = this;
        const key = target?.dataset?.comboKey || "";
        if (!key) return;
        const combo = app.element.querySelector(`[data-combo="${CSS.escape(key)}"]`);
        if (!combo) return;
        const wasOpen = combo.classList.contains("open");
        app.#closeCombos();
        if (!wasOpen) app.#positionComboMenu(combo);
        combo.classList.toggle("open", !wasOpen);
        combo.querySelector("input")?.focus();
    }

    static async _onSelectComboOption(event, target) {
        const app = this;
        const key = target?.dataset?.comboKey || "";
        const value = target?.dataset?.comboValue || "";
        const combo = key ? app.element.querySelector(`[data-combo="${CSS.escape(key)}"]`) : null;
        const input = combo?.querySelector("input");
        if (!input) return;
        input.value = value;
        const selectedIdInput = combo.querySelector("input[type='hidden']");
        if (selectedIdInput) selectedIdInput.value = target?.dataset?.comboId || "";
        app.#closeCombos();
        input.focus();
    }

    static async _onAddCustomField() {
        const app = this;
        const container = app.element.querySelector("[data-custom-fields]");
        if (!container) return;
        const id = `field.${foundry.utils.randomID()}`;
        const row = document.createElement("div");
        row.className = "npc-data-custom-field-row";
        row.dataset.customFieldRow = id;
        row.innerHTML = app.#renderCustomFieldRow({ id, label: "", value: "" });
        app.#wireCustomFieldRow(row);
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
        const patch = this.#buildPatch(form, entity);
        try {
            const updated = this.#candidate ? this.#applyCandidatePatch(entity, patch) : await updateNpc(entity.id, patch);
            ui.notifications.info(this.#candidate ? "Person candidate updated." : "Person updated.");
            if (this.#onSave) await this.#onSave(updated);
            await this.close();
        } catch (err) {
            console.error(err);
            ui.notifications.error(this.#candidate ? "Failed to update person candidate." : "Failed to update person.");
        }
    }

    #getEntity() { return this.#candidate || getNpc(this.#npcId); }

    #buildPatch(form, entity) {
        const formData = new FormData(form);
        const roleLabel = String(formData.get("role.roleLabel") || "").trim();
        const roleId = String(formData.get("role.roleId") || "").trim();
        const currentRoleLabel = String(entity.role?.roleLabel || "");
        return {
            role: {
                roleId: roleId || (roleLabel === currentRoleLabel ? entity.role?.roleId : this.#idFromLabel(roleLabel)),
                roleLabel
            },
            dossier: { hiddenDefaultFields: this.#collectHiddenDefaultFields(form) },
            flavor: {
                descriptor: String(formData.get("flavor.descriptor") || "").trim(),
                drive: String(formData.get("flavor.drive") || "").trim(),
                action: String(formData.get("flavor.action") || "").trim(),
                theme: String(formData.get("flavor.theme") || "").trim(),
                focus: String(formData.get("flavor.focus") || "").trim()
            },
            profile: { customFields: this.#collectCustomFields(form) }
        };
    }

    async #setPortrait(path) {
        const entity = this.#getEntity();
        if (!entity || !path) return;
        if (this.#candidate) {
            this.#candidate.display = { ...(this.#candidate.display || {}), imageSrc: path };
            if (this.#onSave) await this.#onSave(foundry.utils.deepClone(this.#candidate));
        } else {
            await updateNpc(entity.id, { display: { imageSrc: path } });
            if (this.#onSave) await this.#onSave(getNpc(this.#npcId));
        }
        this.render({ parts: ["content"] });
    }

    async #setTraitIds(traitIds = []) {
        const entity = this.#getEntity();
        if (!entity) return;
        if (this.#candidate) {
            this.#candidate.personality = { ...(this.#candidate.personality || {}), traitIds };
            if (this.#onSave) await this.#onSave(foundry.utils.deepClone(this.#candidate));
        } else {
            await updateNpc(entity.id, { personality: { traitIds } });
            if (this.#onSave) await this.#onSave(getNpc(this.#npcId));
        }
        this.render({ parts: ["content"] });
    }

    async #refreshSavedEntity() {
        if (this.#onSave) await this.#onSave(getNpc(this.#npcId));
        this.render({ parts: ["content"] });
    }

    #applyCandidatePatch(entity, patch) {
        this.#candidate = foundry.utils.mergeObject(foundry.utils.deepClone(entity), patch, { inplace: false, recursive: true });
        return foundry.utils.deepClone(this.#candidate);
    }

    #buildRoleOptions(options = [], entity = null) {
        const currentId = entity?.role?.roleId || "";
        const currentLabel = entity?.role?.roleLabel || "";
        const roles = [...options];
        if (currentLabel && !roles.some(role => role.id === currentId || role.label === currentLabel)) roles.push({ id: currentId || this.#idFromLabel(currentLabel), label: currentLabel });
        return roles.map(role => ({ ...role, value: role.label, selected: (currentId && role.id === currentId) || role.label === currentLabel }));
    }

    #buildOptions(options = [], currentValue = "") {
        const values = new Set((options || []).map(option => String(option?.value || option?.label || option || "").trim()).filter(Boolean));
        if (currentValue) values.add(currentValue);
        return [...values].map(value => ({ value, label: value, selected: value === currentValue }));
    }

    #getFieldValue(entity, path) {
        if (!entity || !path) return "";
        return String(path.split(".").reduce((value, key) => value?.[key], entity) || "");
    }

    #closeCombos() {
        for (const combo of this.element.querySelectorAll(".npc-data-combo.open")) combo.classList.remove("open", "drop-up");
    }

    #getHiddenDefaultFields(entity = {}) {
        return new Set(Array.isArray(entity?.dossier?.hiddenDefaultFields) ? entity.dossier.hiddenDefaultFields : []);
    }

    #collectHiddenDefaultFields(form) {
        return [...form.querySelectorAll("input[name='defaultFieldHidden']:checked")].map(input => input.value).filter(Boolean);
    }

    #collectCustomFields(form) {
        return [...form.querySelectorAll("[data-custom-field-row]")].map(row => ({
            id: row.querySelector("[name='customField.id']")?.value || row.dataset.customFieldRow || "",
            label: row.querySelector("[name='customField.label']")?.value || "",
            value: row.querySelector("[name='customField.value']")?.value || ""
        })).filter(field => String(field.label || "").trim() || String(field.value || "").trim());
    }

    #renderCustomFieldRow(field = {}) {
        const safe = value => foundry.utils.escapeHTML(String(value || ""));
        return `
            <input type="hidden" name="customField.id" value="${safe(field.id)}">
            <input type="text" name="customField.label" value="${safe(field.label)}" placeholder="Field" autocomplete="off">
            <input type="text" name="customField.value" value="${safe(field.value)}" placeholder="Value" autocomplete="off">
            <button type="button" class="npc-data-custom-field-move" data-action="moveCustomFieldUp" title="Move field up" aria-label="Move field up"><i class="fas fa-arrow-up"></i></button>
            <button type="button" class="npc-data-custom-field-move" data-action="moveCustomFieldDown" title="Move field down" aria-label="Move field down"><i class="fas fa-arrow-down"></i></button>
            <button type="button" class="npc-data-custom-field-delete" data-action="deleteCustomField" title="Delete field" aria-label="Delete field"><i class="fas fa-trash"></i></button>
        `;
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

    #positionComboMenu(combo) {
        combo.classList.remove("drop-up");
        const menu = combo.querySelector(".npc-data-combo-menu");
        const fields = combo.closest(".npc-data-editor-fields");
        if (!menu || !fields) return;
        const comboRect = combo.getBoundingClientRect();
        const fieldsRect = fields.getBoundingClientRect();
        const menuHeight = Math.min(menu.scrollHeight || 188, 188);
        const spaceBelow = fieldsRect.bottom - comboRect.bottom;
        const spaceAbove = comboRect.top - fieldsRect.top;
        if (spaceBelow < menuHeight + 8 && spaceAbove > spaceBelow) combo.classList.add("drop-up");
    }

    #idFromLabel(label = "") {
        return String(label || "").trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    #getCenteredPosition() {
        const width = Math.max(380, Math.min(460, window.innerWidth - 40));
        const height = Math.max(500, Math.min(640, window.innerHeight - 40));
        return { width, height, left: Math.max(20, Math.round((window.innerWidth - width) / 2)), top: Math.max(20, Math.round((window.innerHeight - height) / 2)) };
    }
}