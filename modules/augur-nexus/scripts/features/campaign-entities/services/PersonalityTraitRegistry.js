const CATALOG_PATH = "modules/augur-nexus/assets/traits/personality/personality_traits.json";
const MAX_TRAITS = 3;

export class PersonalityTraitRegistry {
    static #loaded = false;
    static #traits = [];
    static #traitsById = new Map();

    static get maxTraits() {
        return MAX_TRAITS;
    }

    static async load({ force = false } = {}) {
        if (this.#loaded && !force) return this.getTraits();

        const response = await fetch(CATALOG_PATH);
        if (!response.ok) throw new Error(`Failed to load personality trait catalog: ${response.status}`);
        const catalog = await response.json();
        const traits = this.#normalizeCatalog(catalog);
        this.#validateCatalog(traits);

        this.#traits = traits.sort((a, b) => a.sort - b.sort || a.label.localeCompare(b.label));
        this.#traitsById = new Map(this.#traits.map(trait => [trait.id, trait]));
        this.#loaded = true;
        return this.getTraits();
    }

    static getTraits() {
        return this.#traits.map(trait => ({ ...trait }));
    }

    static getTrait(id) {
        const trait = this.#traitsById.get(String(id || "").trim());
        return trait ? { ...trait } : null;
    }

    static resolveTraits(ids = []) {
        const normalized = [];
        for (const id of Array.isArray(ids) ? ids : []) {
            const trait = this.getTrait(id);
            normalized.push(trait || {
                id: String(id || "").trim(),
                label: String(id || "").trim() || "Unknown",
                iconSrc: "",
                missing: true
            });
        }
        return normalized.filter(trait => trait.id);
    }

    static validateTraitIds(ids = [], { max = MAX_TRAITS, allowUnknown = false } = {}) {
        const selected = [];
        const seen = new Set();

        for (const rawId of Array.isArray(ids) ? ids : []) {
            const id = String(rawId || "").trim();
            if (!id) continue;
            if (seen.has(id)) throw new Error(`Duplicate personality trait: ${id}`);
            const trait = this.#traitsById.get(id);
            if (!trait && !allowUnknown) throw new Error(`Unknown personality trait: ${id}`);
            if (trait?.oppositeId && seen.has(trait.oppositeId)) {
                throw new Error(`Conflicting personality traits: ${id} and ${trait.oppositeId}`);
            }
            seen.add(id);
            selected.push(id);
        }

        if (selected.length > max) throw new Error(`People may have at most ${max} personality traits.`);
        return selected;
    }

    static pickRandomTraits(count = MAX_TRAITS, weights = []) {
        const targetCount = Math.max(0, Math.min(Number(count || 0), MAX_TRAITS));
        const weighted = this.#buildWeightedPool(weights);
        const selected = [];

        while (selected.length < targetCount && weighted.length) {
            const index = Math.floor(Math.random() * weighted.length);
            const [candidate] = weighted.splice(index, 1);
            if (!candidate?.id || selected.includes(candidate.id)) continue;
            const oppositeSelected = candidate.oppositeId && selected.includes(candidate.oppositeId);
            if (oppositeSelected) continue;
            selected.push(candidate.id);
        }

        return selected;
    }

    static #buildWeightedPool(weights = []) {
        const weightById = new Map();
        for (const entry of Array.isArray(weights) ? weights : []) {
            const id = String(entry?.id || "").trim();
            const weight = Math.max(0, Number(entry?.weight || 0));
            if (!id || !weight) continue;
            weightById.set(id, weight);
        }

        const pool = [];
        for (const trait of this.#traits) {
            const weight = weightById.size ? weightById.get(trait.id) || 0 : 1;
            for (let i = 0; i < weight; i += 1) pool.push(trait);
        }
        return pool;
    }

    static #normalizeCatalog(catalog = {}) {
        return (Array.isArray(catalog?.traits) ? catalog.traits : []).map((trait, index) => ({
            id: String(trait?.id || "").trim(),
            label: String(trait?.label || trait?.name || trait?.id || "").trim(),
            oppositeId: String(trait?.oppositeId || "").trim(),
            pairId: String(trait?.pairId || trait?.id || "").trim(),
            sort: Number(trait?.sort || (index + 1) * 10),
            iconSrc: String(trait?.iconSrc || trait?.iconAssetPath || "").trim()
        })).filter(trait => trait.id && trait.label);
    }

    static #validateCatalog(traits = []) {
        const byId = new Map();
        for (const trait of traits) {
            if (byId.has(trait.id)) throw new Error(`Duplicate personality trait catalog id: ${trait.id}`);
            byId.set(trait.id, trait);
        }

        for (const trait of traits) {
            if (!trait.oppositeId) continue;
            const opposite = byId.get(trait.oppositeId);
            if (!opposite) throw new Error(`Trait ${trait.id} references missing opposite ${trait.oppositeId}`);
            if (opposite.oppositeId !== trait.id) {
                throw new Error(`Trait ${trait.id} has non-reciprocal opposite ${trait.oppositeId}`);
            }
        }
    }
}
