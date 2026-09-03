import { FactionEntityModel } from "./FactionEntityModel.js";

export class FactionProfileViewModel {
    static fromEntity(entity = {}, options = {}) {
        return this.fromFactionLike(entity, options);
    }

    static fromCandidate(candidate = {}, options = {}) {
        return this.fromFactionLike(candidate, options);
    }

    static fromFactionLike(faction = {}, options = {}) {
        const hiddenDefaultFields = new Set(Array.isArray(faction?.dossier?.hiddenDefaultFields) ? faction.dossier.hiddenDefaultFields : []);
        const isVisible = chip => chip.value && !hiddenDefaultFields.has(chip.key);
        return {
            name: FactionEntityModel.getName(faction),
            subtitle: FactionEntityModel.getSubtitle(faction),
            imageSrc: FactionEntityModel.getImage(faction),
            accent: FactionEntityModel.getAccent(faction),
            profileRows: FactionEntityModel.getProfileRows(faction),
            identityChips: [
                { key: "type", label: "Type", value: faction.profile?.type || "" },
                { key: "method", label: "Method", value: faction.profile?.method || "" },
                { key: "drive", label: "Drive", value: faction.profile?.drive || "" }
            ].filter(isVisible),
            chips: [
                { key: "action", label: "Action", value: faction.profile?.action || "" },
                { key: "theme", label: "Theme", value: faction.profile?.theme || "" },
                { key: "focus", label: "Focus", value: faction.profile?.focus || "" }
            ].filter(isVisible),
            showTabs: options.showTabs === true,
            showActions: options.showActions === true,
            showBody: options.showBody !== false,
            tabs: {
                isProfileTab: options.activeTab !== "journal",
                isJournalTab: options.activeTab === "journal"
            },
            emptyLabel: options.emptyLabel || "No faction profile details selected."
        };
    }
}