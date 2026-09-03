export const CONNECTION_CATEGORIES = [
    { id: "all", label: "All", singular: "Connection", icon: "fas fa-share-nodes", color: "#f0b84c" },
    { id: "faction", label: "Organizations", singular: "Organization", icon: "fas fa-shield-halved", color: "#83c95f" },
    { id: "npc", label: "People", singular: "Person", icon: "fas fa-user", color: "#55bdec" },
    { id: "ship", label: "Ships", singular: "Ship", icon: "fas fa-rocket", color: "#55bdec" },
    { id: "member", label: "Members", singular: "Member", icon: "fas fa-users", color: "#2fb7d6" },
    { id: "crew", label: "Crew", singular: "Crew", icon: "fas fa-user-group", color: "#2fb7d6" },
    { id: "affiliation", label: "Affiliations", singular: "Affiliation", icon: "fas fa-link", color: "#5dbb83" },
    { id: "rival", label: "Rivals", singular: "Rival", icon: "fas fa-crosshairs", color: "#ff7a66" },
    { id: "monster", label: "Enemies", singular: "Enemy", icon: "fas fa-skull", color: "#ff5b4e" },
    { id: "place", label: "Places", singular: "Place", icon: "fas fa-location-dot", color: "#b46cff" },
    { id: "item", label: "Items", singular: "Item", icon: "fas fa-suitcase", color: "#f0a92f" },
    { id: "unassigned", label: "Unassigned", singular: "Connection", icon: "fas fa-inbox", color: "#a8b0bd" }
];

const CATEGORY_BY_ID = new Map(CONNECTION_CATEGORIES.map(category => [category.id, category]));
const EDITABLE_CATEGORY_IDS = CONNECTION_CATEGORIES
    .filter(category => category.id !== "all")
    .map(category => category.id);
const PROTECTED_CATEGORY_IDS = new Set(CONNECTION_CATEGORIES.map(category => category.id));

export class ConnectionCategories {
    static all(customCategories = {}) {
        return [
            ...CONNECTION_CATEGORIES.map(category => ({ ...category, custom: false, protected: true })),
            ...Object.values(this.normalizeCustomCategories(customCategories))
        ];
    }

    static editable(customCategories = {}) {
        return [
            ...EDITABLE_CATEGORY_IDS.map(id => this.get(id)),
            ...Object.values(this.normalizeCustomCategories(customCategories))
        ];
    }

    static get(id, customCategories = {}) {
        const customCategory = this.normalizeCustomCategories(customCategories)?.[id];
        if (customCategory) return { ...customCategory };
        const category = CATEGORY_BY_ID.get(id) || CATEGORY_BY_ID.get("unassigned");
        return { ...category };
    }

    static normalize(id, fallback = "npc", customCategories = {}) {
        if (id === "site") return "place";
        if (id === "all") return "all";
        if (this.normalizeCustomCategories(customCategories)?.[id]) return id;
        if (CATEGORY_BY_ID.has(id)) return id;
        if (this.normalizeCustomCategories(customCategories)?.[fallback]) return fallback;
        return CATEGORY_BY_ID.has(fallback) && fallback !== "all" ? fallback : "unassigned";
    }

    static isCustom(id, customCategories = {}) {
        return !!this.normalizeCustomCategories(customCategories)?.[id];
    }

    static isProtected(id) {
        return PROTECTED_CATEGORY_IDS.has(id);
    }

    static makeCustomCategoryId(label = "") {
        const base = String(label || "")
            .trim()
            .toLocaleLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            || "category";
        return `custom-${base}`;
    }

    static normalizeCustomCategories(customCategories = {}) {
        const normalized = {};
        for (const [key, category] of Object.entries(customCategories || {})) {
            const id = String(category?.id || key || "").trim();
            if (!id || PROTECTED_CATEGORY_IDS.has(id) || id === "all") continue;
            const label = String(category?.label || "Custom Category").trim() || "Custom Category";
            normalized[id] = {
                id,
                label,
                singular: String(category?.singular || label).trim() || label,
                icon: String(category?.icon || "fas fa-tag").trim() || "fas fa-tag",
                color: this.#normalizeColor(category?.color || "#c9a7ff"),
                custom: true,
                protected: false,
                createdTime: Number(category?.createdTime || Date.now()),
                updatedTime: Number(category?.updatedTime || category?.createdTime || Date.now())
            };
        }
        return normalized;
    }

    static defaultForDocument(documentType) {
        switch (documentType) {
            case "Item":
                return "item";
            case "Scene":
            case "JournalEntry":
            case "JournalEntryPage":
                return "place";
            case "Actor":
            default:
                return "npc";
        }
    }

    static roleFor(categoryId) {
        switch (this.normalize(categoryId)) {
            case "member":
                return "Member";
            case "crew":
                return "Crew";
            case "affiliation":
                return "Affiliation";
            case "rival":
                return "Rival";
            case "faction":
                return "Organization";
            case "ship":
                return "Ship";
            case "monster":
                return "Enemy";
            case "place":
                return "Linked Place";
            case "item":
                return "Item";
            case "unassigned":
                return "Unassigned";
            case "npc":
            default:
                return "Contact";
        }
    }

    static #normalizeColor(color) {
        const value = String(color || "").trim();
        return /^#[0-9a-f]{6}$/i.test(value) ? value : "#c9a7ff";
    }
}
