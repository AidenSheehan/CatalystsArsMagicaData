export class FactionEmblemCatalogRegistry {
    static #catalogs = new Map();

    static register(definition = {}) {
        const id = String(definition.id || "").trim();
        if (!id) throw new Error("Faction emblem catalog definitions require an id.");

        const normalized = {
            id,
            moduleId: String(definition.moduleId || "").trim(),
            label: String(definition.label || id).trim(),
            getEmblems: typeof definition.getEmblems === "function" ? definition.getEmblems : () => definition.emblems || []
        };
        this.#catalogs.set(id, normalized);
        Hooks.callAll("augurNexusFactionEmblemCatalogsChanged", { reason: "register", catalog: this.#toPublic(normalized) });
        return this.#toPublic(normalized);
    }

    static list() {
        return [...this.#catalogs.values()]
            .sort((a, b) => a.label.localeCompare(b.label))
            .map(catalog => this.#toPublic(catalog));
    }

    static async getEmblems() {
        const emblems = [];
        for (const catalog of this.#catalogs.values()) {
            const entries = await catalog.getEmblems();
            for (const emblem of Array.isArray(entries) ? entries : []) {
                const normalized = this.#normalizeEmblem(emblem, catalog);
                if (normalized) emblems.push(normalized);
            }
        }
        return emblems.sort((a, b) => a.sortLabel.localeCompare(b.sortLabel));
    }

    static #normalizeEmblem(emblem = {}, catalog) {
        const imageSrc = String(emblem.imageSrc || emblem.src || "").trim();
        if (!imageSrc) return null;
        const id = String(emblem.id || imageSrc).trim();
        const label = String(emblem.label || emblem.name || "Organization Badge").trim();
        const type = String(emblem.type || emblem.category || "").trim();
        return {
            id: `${catalog.id}:${id}`,
            catalogId: catalog.id,
            moduleId: catalog.moduleId,
            label,
            imageSrc,
            type,
            meta: type,
            sortLabel: `${catalog.label} ${type} ${label}`.trim()
        };
    }

    static #toPublic(catalog) {
        return {
            id: catalog.id,
            moduleId: catalog.moduleId,
            label: catalog.label
        };
    }
}
