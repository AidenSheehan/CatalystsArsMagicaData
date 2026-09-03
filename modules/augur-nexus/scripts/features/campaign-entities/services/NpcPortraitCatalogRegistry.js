export class NpcPortraitCatalogRegistry {
    static #catalogs = new Map();

    static register(definition = {}) {
        const id = String(definition.id || "").trim();
        if (!id) throw new Error("NPC portrait catalog definitions require an id.");

        const normalized = {
            id,
            moduleId: String(definition.moduleId || "").trim(),
            label: String(definition.label || id).trim(),
            getPortraits: typeof definition.getPortraits === "function" ? definition.getPortraits : () => definition.portraits || []
        };
        this.#catalogs.set(id, normalized);
        Hooks.callAll("augurNexusNpcPortraitCatalogsChanged", { reason: "register", catalog: this.#toPublic(normalized) });
        return this.#toPublic(normalized);
    }

    static list() {
        return [...this.#catalogs.values()]
            .sort((a, b) => a.label.localeCompare(b.label))
            .map(catalog => this.#toPublic(catalog));
    }

    static async getPortraits() {
        const portraits = [];
        for (const catalog of this.#catalogs.values()) {
            const entries = await catalog.getPortraits();
            for (const portrait of Array.isArray(entries) ? entries : []) {
                const normalized = this.#normalizePortrait(portrait, catalog);
                if (normalized) portraits.push(normalized);
            }
        }
        return portraits.sort((a, b) => a.sortLabel.localeCompare(b.sortLabel));
    }

    static #normalizePortrait(portrait = {}, catalog) {
        const imageSrc = String(portrait.imageSrc || portrait.src || "").trim();
        if (!imageSrc) return null;
        const id = String(portrait.id || imageSrc).trim();
        const label = String(portrait.label || portrait.name || this.#labelFromPath(imageSrc)).trim();
        const gender = String(portrait.gender || "").trim();
        const speciesLabel = String(portrait.speciesLabel || portrait.species || portrait.speciesId || "").trim();
        return {
            id: `${catalog.id}:${id}`,
            catalogId: catalog.id,
            moduleId: catalog.moduleId,
            label,
            imageSrc,
            gender,
            speciesId: String(portrait.speciesId || "").trim(),
            speciesLabel,
            meta: [speciesLabel, gender].filter(Boolean).join(" - "),
            sortLabel: `${catalog.label} ${speciesLabel} ${gender} ${label}`.trim()
        };
    }

    static #labelFromPath(path = "") {
        return String(path || "")
            .split(/[\\/]/)
            .pop()
            ?.replace(/\.[^.]+$/, "")
            ?.replace(/^yusuf_/i, "")
            ?.replace(/_/g, " ") || "Portrait";
    }

    static #toPublic(catalog) {
        return {
            id: catalog.id,
            moduleId: catalog.moduleId,
            label: catalog.label
        };
    }
}
