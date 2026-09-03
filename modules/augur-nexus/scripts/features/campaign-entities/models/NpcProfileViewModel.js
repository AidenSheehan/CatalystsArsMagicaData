import { NpcEntityModel } from "./NpcEntityModel.js";

export class NpcProfileViewModel {
    static fromEntity(entity = {}, options = {}) {
        return this.fromNpcLike(entity, options);
    }

    static fromCandidate(candidate = {}, options = {}) {
        return this.fromNpcLike(candidate, options);
    }

    static fromNpcLike(npc = {}, options = {}) {
        const traits = NpcEntityModel.getTraits(npc);
        const hiddenDefaultFields = new Set(Array.isArray(npc?.dossier?.hiddenDefaultFields) ? npc.dossier.hiddenDefaultFields : []);
        const isVisible = chip => chip.value && !hiddenDefaultFields.has(chip.key);
        return {
            name: NpcEntityModel.getName(npc),
            subtitle: NpcEntityModel.getSubtitle(npc),
            imageSrc: NpcEntityModel.getImage(npc),
            accent: NpcEntityModel.getAccent(npc),
            traits,
            hasTraits: traits.length > 0,
            profileRows: NpcEntityModel.getProfileRows(npc),
            linkedActor: options.linkedActor || null,
            identityChips: [
                { key: "descriptor", label: "Descriptor", value: npc.flavor?.descriptor || "" },
                { key: "role", label: "Role", value: npc.role?.roleLabel || "" },
                { key: "drive", label: "Drive", value: npc.flavor?.drive || "" }
            ].filter(isVisible),
            chips: [
                { key: "action", label: "Action", value: npc.flavor?.action || "" },
                { key: "theme", label: "Theme", value: npc.flavor?.theme || "" },
                { key: "focus", label: "Focus", value: npc.flavor?.focus || "" }
            ].filter(isVisible),
            showTabs: options.showTabs === true,
            showActions: options.showActions === true,
            showBody: options.showBody !== false,
            tabs: {
                isProfileTab: options.activeTab !== "journal",
                isJournalTab: options.activeTab === "journal"
            },
            emptyTraitsLabel: options.emptyTraitsLabel || "No personality traits selected."
        };
    }
}