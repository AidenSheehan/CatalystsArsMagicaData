import { ShipEntityModel } from "./ShipEntityModel.js";

export class ShipProfileViewModel {
    static fromEntity(entity = {}, options = {}) {
        return this.fromShipLike(entity, options);
    }

    static fromCandidate(candidate = {}, options = {}) {
        return this.fromShipLike(candidate, options);
    }

    static fromShipLike(ship = {}, options = {}) {
        const hiddenDefaultFields = new Set(Array.isArray(ship?.dossier?.hiddenDefaultFields) ? ship.dossier.hiddenDefaultFields : []);
        const isVisible = chip => chip.value && !hiddenDefaultFields.has(chip.key);
        return {
            name: ShipEntityModel.getName(ship),
            subtitle: ShipEntityModel.getSubtitle(ship),
            imageSrc: ShipEntityModel.getImage(ship),
            accent: ShipEntityModel.getAccent(ship),
            profileRows: ShipEntityModel.getProfileRows(ship),
            linkedActor: options.linkedActor || null,
            identityChips: [
                { key: "model", label: "Model", value: ship.profile?.model || "" },
                { key: "class", label: "Class", value: ship.profile?.class || "" },
                { key: "role", label: "Role", value: ship.profile?.role || "" }
            ].filter(isVisible),
            chips: [
                { key: "action", label: "Action", value: ship.profile?.action || "" },
                { key: "theme", label: "Theme", value: ship.profile?.theme || "" },
                { key: "focus", label: "Focus", value: ship.profile?.focus || "" }
            ].filter(isVisible),
            showTabs: options.showTabs === true,
            showActions: options.showActions === true,
            showBody: options.showBody !== false,
            tabs: { isProfileTab: options.activeTab !== "journal", isJournalTab: options.activeTab === "journal" },
            emptyLabel: options.emptyLabel || "No ship profile details selected."
        };
    }
}