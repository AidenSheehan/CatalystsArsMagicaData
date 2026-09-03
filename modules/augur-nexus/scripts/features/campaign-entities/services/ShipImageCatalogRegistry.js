export class ShipImageCatalogRegistry {
    static #catalogs = new Map();

    static register(definition = {}) {
        const id = String(definition.id || "").trim();
        if (!id) throw new Error("Ship image catalog definitions require an id.");
        const normalized = {
            id,
            moduleId: String(definition.moduleId || "").trim(),
            label: String(definition.label || id).trim(),
            getModels: typeof definition.getModels === "function" ? definition.getModels : () => definition.models || []
        };
        this.#catalogs.set(id, normalized);
        Hooks.callAll("augurNexusShipImageCatalogsChanged", { reason: "register", catalog: this.#toPublic(normalized) });
        return this.#toPublic(normalized);
    }

    static list() {
        return [...this.#catalogs.values()].sort((a, b) => a.label.localeCompare(b.label)).map(catalog => this.#toPublic(catalog));
    }

    static async getModels() {
        const models = [];
        for (const catalog of this.#catalogs.values()) {
            const entries = await catalog.getModels();
            for (const model of Array.isArray(entries) ? entries : []) {
                const normalized = this.#normalizeModel(model, catalog);
                if (normalized) models.push(normalized);
            }
        }
        return models.sort((a, b) => a.label.localeCompare(b.label));
    }

    static #normalizeModel(model = {}, catalog) {
        const modelId = String(model.modelId || model.id || "").trim();
        if (!modelId) return null;
        const variants = (Array.isArray(model.variants) ? model.variants : []).map(variant => ({
            id: String(variant.id || variant.styleId || variant.imageSrc || "").trim(),
            styleId: String(variant.styleId || variant.id || "").trim(),
            styleLabel: String(variant.styleLabel || variant.label || variant.styleId || "Style").trim(),
            imageSrc: String(variant.imageSrc || variant.src || "").trim()
        })).filter(variant => variant.imageSrc);
        if (!variants.length) return null;
        return {
            id: `${catalog.id}:${modelId}`,
            catalogId: catalog.id,
            moduleId: catalog.moduleId,
            modelId,
            label: String(model.modelLabel || model.label || modelId).trim(),
            categoryId: String(model.categoryId || model.category || "ships").trim() || "ships",
            categoryLabel: String(model.categoryLabel || model.categoryName || model.category || "Ships").trim() || "Ships",
            suggestedClasses: Array.isArray(model.suggestedClasses) ? model.suggestedClasses.map(value => String(value || "").trim()).filter(Boolean) : [],
            imageSrc: String(model.imageSrc || variants[0]?.imageSrc || "").trim(),
            variants
        };
    }

    static #toPublic(catalog) {
        return { id: catalog.id, moduleId: catalog.moduleId, label: catalog.label };
    }
}
