// Edit-mode state for Nexus Placer. Site visuals are edited through unified Markers.

export class SiteEditor {
    static #active = false;

    static get isEditMode() {
        return this.#active;
    }

    static activate() {
        this.#active = true;
        Hooks.callAll("augurNexusSiteEditorSelectionChanged");
    }

    static deactivate() {
        this.#active = false;
        Hooks.callAll("augurNexusSiteEditorSelectionChanged");
    }

    static clearSelection() {
        Hooks.callAll("augurNexusSiteEditorSelectionChanged");
    }
}
