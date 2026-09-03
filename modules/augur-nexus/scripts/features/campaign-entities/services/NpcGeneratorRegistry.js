export class NpcGeneratorRegistry {
    static #generators = new Map();

    static register(definition = {}) {
        const id = String(definition.id || "").trim();
        if (!id) throw new Error("NPC generator definitions require an id.");
        if (typeof definition.generate !== "function") {
            throw new Error(`NPC generator ${id} must provide a generate(options) function.`);
        }

        const normalized = {
            id,
            moduleId: String(definition.moduleId || "").trim(),
            label: String(definition.label || id).trim(),
            description: String(definition.description || "").trim(),
            icon: String(definition.icon || "fas fa-user-plus").trim(),
            getOptions: typeof definition.getOptions === "function" ? definition.getOptions : null,
            getProfileOptions: typeof definition.getProfileOptions === "function" ? definition.getProfileOptions : null,
            generate: definition.generate
        };
        this.#generators.set(id, normalized);
        Hooks.callAll("augurNexusNpcGeneratorsChanged", { reason: "register", generator: this.#toPublic(normalized) });
        return this.#toPublic(normalized);
    }

    static get(id) {
        const generator = this.#generators.get(String(id || "").trim());
        return generator || null;
    }

    static list() {
        return [...this.#generators.values()]
            .sort((a, b) => a.label.localeCompare(b.label))
            .map(generator => this.#toPublic(generator));
    }

    static async getOptions(id) {
        const generator = this.get(id);
        if (!generator?.getOptions) return {};
        const options = await generator.getOptions();
        return this.#normalizeOptions(options);
    }

    static async getProfileOptions(id) {
        const generator = this.get(id);
        if (!generator?.getProfileOptions) return {};
        const options = await generator.getProfileOptions();
        return this.#normalizeProfileOptions(options);
    }

    static async generate(id, options = {}) {
        const generator = this.get(id);
        if (!generator) throw new Error(`Unknown NPC generator: ${id}`);
        return generator.generate(options);
    }

    static #toPublic(generator) {
        return {
            id: generator.id,
            moduleId: generator.moduleId,
            label: generator.label,
            description: generator.description,
            icon: generator.icon,
            hasOptions: !!generator.getOptions,
            hasProfileOptions: !!generator.getProfileOptions
        };
    }

    static #normalizeOptions(options = {}) {
        return {
            roles: this.#normalizeOptionList(options.roles),
            genders: this.#normalizeOptionList(options.genders),
            defaults: {
                roleId: String(options.defaults?.roleId || "random").trim() || "random",
                gender: String(options.defaults?.gender || "random").trim() || "random"
            }
        };
    }

    static #normalizeOptionList(options = []) {
        return (Array.isArray(options) ? options : []).map(option => ({
            id: String(option?.id || "").trim(),
            label: String(option?.label || option?.name || option?.id || "").trim()
        })).filter(option => option.id && option.label);
    }

    static #normalizeProfileOptions(options = {}) {
        const fields = {};
        for (const [key, values] of Object.entries(options.fields || {})) {
            fields[key] = this.#normalizeValueList(values);
        }
        return {
            roles: this.#normalizeOptionList(options.roles),
            fields
        };
    }

    static #normalizeValueList(values = []) {
        return [...new Set((Array.isArray(values) ? values : [])
            .map(value => String(value || "").trim())
            .filter(Boolean))]
            .map(value => ({ value, label: value }));
    }
}
