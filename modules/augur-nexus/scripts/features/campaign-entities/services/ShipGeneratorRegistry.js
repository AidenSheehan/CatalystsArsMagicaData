export class ShipGeneratorRegistry {
    static #generators = new Map();

    static register(definition = {}) {
        const id = String(definition.id || "").trim();
        if (!id) throw new Error("Ship generator definitions require an id.");
        if (typeof definition.generate !== "function") throw new Error(`Ship generator ${id} must provide a generate(options) function.`);
        const normalized = {
            id,
            moduleId: String(definition.moduleId || "").trim(),
            label: String(definition.label || id).trim(),
            description: String(definition.description || "").trim(),
            icon: String(definition.icon || "fas fa-rocket").trim(),
            getOptions: typeof definition.getOptions === "function" ? definition.getOptions : null,
            getProfileOptions: typeof definition.getProfileOptions === "function" ? definition.getProfileOptions : null,
            generate: definition.generate
        };
        this.#generators.set(id, normalized);
        Hooks.callAll("augurNexusShipGeneratorsChanged", { reason: "register", generator: this.#toPublic(normalized) });
        return this.#toPublic(normalized);
    }

    static get(id) {
        return this.#generators.get(String(id || "").trim()) || null;
    }

    static list() {
        return [...this.#generators.values()].sort((a, b) => a.label.localeCompare(b.label)).map(generator => this.#toPublic(generator));
    }

    static async getOptions(id) {
        const generator = this.get(id);
        if (!generator?.getOptions) return {};
        const options = await generator.getOptions();
        return {
            templates: this.#normalizeOptionList(options.templates),
            defaults: { templateId: String(options.defaults?.templateId || "random").trim() || "random" }
        };
    }

    static async getProfileOptions(id) {
        const generator = this.get(id);
        if (!generator?.getProfileOptions) return {};
        const options = await generator.getProfileOptions();
        const fields = {};
        for (const [key, values] of Object.entries(options.fields || {})) fields[key] = this.#normalizeValueList(values);
        return { templates: this.#normalizeOptionList(options.templates), fields };
    }

    static async generate(id, options = {}) {
        const generator = this.get(id);
        if (!generator) throw new Error(`Unknown ship generator: ${id}`);
        return generator.generate(options);
    }

    static #normalizeOptionList(options = []) {
        return (Array.isArray(options) ? options : []).map(option => ({
            id: String(option?.id || "").trim(),
            label: String(option?.label || option?.name || option?.id || "").trim()
        })).filter(option => option.id && option.label);
    }

    static #normalizeValueList(values = []) {
        return [...new Set((Array.isArray(values) ? values : []).map(value => String(value || "").trim()).filter(Boolean))]
            .map(value => ({ value, label: value }));
    }

    static #toPublic(generator) {
        return { id: generator.id, moduleId: generator.moduleId, label: generator.label, description: generator.description, icon: generator.icon, hasOptions: !!generator.getOptions, hasProfileOptions: !!generator.getProfileOptions };
    }
}
