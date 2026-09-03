import { ConnectionCategories } from "./ConnectionCategories.js";

const TARGET_PRESETS = {
    npc: ["affiliation", "npc", "rival", "item"],
    faction: ["member", "affiliation", "ship", "place", "rival", "item"],
    ship: ["crew", "affiliation", "item"],
    place: ["npc", "faction", "ship", "monster", "item", "affiliation"]
};

const DROP_DEFAULTS = {
    npc: {
        faction: "affiliation",
        ship: "affiliation",
        place: "affiliation",
        npc: "npc",
        monster: "rival",
        item: "item"
    },
    faction: {
        npc: "member",
        ship: "ship",
        place: "place",
        faction: "affiliation",
        monster: "rival",
        item: "item"
    },
    ship: {
        npc: "crew",
        faction: "affiliation",
        place: "affiliation",
        ship: "affiliation",
        monster: "affiliation",
        item: "item"
    },
    place: {
        npc: "npc",
        faction: "faction",
        ship: "ship",
        place: "place",
        monster: "monster",
        item: "item"
    }
};

export class ConnectionCategoryPresets {
    static forTarget(target = {}) {
        const targetType = this.getTargetType(target);
        return [...(TARGET_PRESETS[targetType] || [])];
    }

    static orderCategories(categories = [], { target = null, order = [] } = {}) {
        const presetIds = this.forTarget(target);
        const byId = new Map(categories.map(category => [category.id, category]));
        const orderedIds = [
            ...(Array.isArray(order) ? order : []),
            ...presetIds,
            ...categories.map(category => category.id)
        ];
        const used = new Set();
        const ordered = [];

        for (const id of orderedIds) {
            if (used.has(id) || !byId.has(id)) continue;
            used.add(id);
            ordered.push(byId.get(id));
        }

        return ordered;
    }

    static defaultCategoryForConnection(target = {}, relatedTarget = {}, customCategories = {}) {
        const targetType = this.getTargetType(target);
        const relatedCategory = this.getConnectionCategory(relatedTarget, customCategories);
        const categoryId = DROP_DEFAULTS[targetType]?.[relatedCategory] || relatedCategory || "npc";
        return ConnectionCategories.normalize(categoryId, "npc", customCategories);
    }

    static getTargetType(target = {}) {
        if (target?.kind === "nexus-site" || target?.kind === "nexus-scene") return "place";
        if (target?.kind === "nexus-entity") {
            if (target.entityType === "faction") return "faction";
            if (target.entityType === "ship") return "ship";
            return "npc";
        }

        const category = String(target?.category || "").trim();
        if (category === "faction" || category === "ship" || category === "place") return category;
        if (category === "npc" || category === "monster") return "npc";
        return "";
    }

    static getConnectionCategory(target = {}, customCategories = {}) {
        if (target?.kind === "nexus-site" || target?.kind === "nexus-scene") return "place";
        if (target?.kind === "nexus-entity") {
            if (target.entityType === "faction") return "faction";
            if (target.entityType === "ship") return "ship";
            return "npc";
        }
        return ConnectionCategories.normalize(target?.category, "npc", customCategories);
    }
}
