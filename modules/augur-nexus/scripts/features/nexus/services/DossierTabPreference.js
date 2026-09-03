const DEFAULT_TAB = "profile";
const TABS = new Set(["profile", "journal"]);

export class DossierTabPreference {
    static DEFAULT_TAB = DEFAULT_TAB;

    static normalizeTab(value, fallback = DEFAULT_TAB) {
        const normalized = String(value || "").trim().toLocaleLowerCase();
        if (TABS.has(normalized)) return normalized;
        return TABS.has(fallback) ? fallback : DEFAULT_TAB;
    }

    static normalizeDossier(dossier = {}) {
        return {
            defaultTab: this.normalizeTab(dossier?.defaultTab),
            hiddenDefaultFields: this.normalizeHiddenDefaultFields(dossier?.hiddenDefaultFields)
        };
    }

    static normalizeHiddenDefaultFields(fields = []) {
        return [...new Set((Array.isArray(fields) ? fields : [])
            .map(field => String(field || '').trim())
            .filter(Boolean))];
    }

    static getDefaultTab(source = {}) {
        return this.normalizeTab(source?.dossier?.defaultTab);
    }

    static getTabLabel(tab) {
        return this.normalizeTab(tab) === "journal" ? "Journal" : "Profile";
    }

    static buildMenuItems(current, onSelect) {
        const active = this.normalizeTab(current);
        const icons = {
            profile: "fas fa-table-list",
            journal: "fas fa-book-open"
        };

        return ["profile", "journal"].map(tab => ({
            id: `default-tab-${tab}`,
            label: active === tab ? `${this.getTabLabel(tab)} (Current)` : this.getTabLabel(tab),
            icon: icons[tab],
            onSelect: () => onSelect?.(tab)
        }));
    }
}
