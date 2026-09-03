import { CampaignEntityJournalStore } from "./CampaignEntityJournalStore.js";

const MODULE_ID = "augur-nexus";

const ENTITY_TYPES = {
    npc: {
        label: "People",
        pluralLabel: "People",
        settingKey: "playerNpcVisibility",
        update: (idOrUuid, patch) => CampaignEntityJournalStore.updateNpc(idOrUuid, patch),
        list: () => CampaignEntityJournalStore.getNpcs()
    },
    faction: {
        label: "Organization",
        pluralLabel: "Organizations",
        settingKey: "playerFactionVisibility",
        update: (idOrUuid, patch) => CampaignEntityJournalStore.updateFaction(idOrUuid, patch),
        list: () => CampaignEntityJournalStore.getFactions()
    },
    ship: {
        label: "Ship",
        pluralLabel: "Ships",
        settingKey: "playerShipVisibility",
        update: (idOrUuid, patch) => CampaignEntityJournalStore.updateShip(idOrUuid, patch),
        list: () => CampaignEntityJournalStore.getShips()
    }
};

export class CampaignEntityVisibilityManager {
    static VALUES = new Set(["inherit", "show", "hide"]);
    static POLICIES = new Set(["all", "explicit"]);

    static getEntityTypes() {
        return Object.keys(ENTITY_TYPES);
    }

    static getConfig(entityOrType = "npc") {
        const type = this.normalizeEntityType(typeof entityOrType === "string" ? entityOrType : entityOrType?.type);
        return ENTITY_TYPES[type];
    }

    static normalizeEntityType(type = "npc") {
        return ENTITY_TYPES[type] ? type : "npc";
    }

    static #getEntityType(entityOrType = "npc") {
        return this.normalizeEntityType(typeof entityOrType === "string" ? entityOrType : entityOrType?.type);
    }

    static normalizePlayerVisibility(value = "inherit") {
        return this.VALUES.has(value) ? value : "inherit";
    }

    static getGlobalPlayerVisibilityPolicy(entityOrType = "npc") {
        const config = this.getConfig(entityOrType);
        const policy = game.settings.get(MODULE_ID, config.settingKey) || "all";
        return this.POLICIES.has(policy) ? policy : "all";
    }

    static getGlobalPlayerVisibilityPolicyLabel(entityOrType = "npc", policy = this.getGlobalPlayerVisibilityPolicy(entityOrType)) {
        if (policy === "explicit") return "Explicit Only";
        return `All ${this.getConfig(entityOrType).pluralLabel}`;
    }

    static getPlayerVisibilityOverride(entityOrValue = "inherit") {
        return typeof entityOrValue === "string"
            ? this.normalizePlayerVisibility(entityOrValue)
            : this.normalizePlayerVisibility(entityOrValue?.access?.playerVisibility);
    }

    static getPlayerVisibilityLabel(entityOrValue = "inherit") {
        const normalized = this.getPlayerVisibilityOverride(entityOrValue);
        if (normalized === "show") return "Yes";
        if (normalized === "hide") return "No";
        return "Global";
    }

    static getPlayerVisibilityIcon(entityOrValue = "inherit") {
        const normalized = this.getPlayerVisibilityOverride(entityOrValue);
        if (normalized === "show") return "fas fa-eye";
        if (normalized === "hide") return "fas fa-eye-slash";
        return "fas fa-layer-group";
    }

    static isVisibleToPlayers(entity = {}) {
        const normalized = this.getPlayerVisibilityOverride(entity);
        if (normalized === "show") return true;
        if (normalized === "hide") return false;
        return this.getGlobalPlayerVisibilityPolicy(entity) === "all";
    }

    static canUserSee(entity = {}, user = game.user) {
        if (user?.isGM) return true;
        return this.isVisibleToPlayers(entity);
    }

    static async setGlobalPlayerVisibilityPolicy(entityOrType = "npc", policy = "all") {
        if (!game.user.isGM) return this.getGlobalPlayerVisibilityPolicy(entityOrType);
        const type = this.#getEntityType(entityOrType);
        const config = this.getConfig(entityOrType);
        const normalized = this.POLICIES.has(policy) ? policy : "all";
        await game.settings.set(MODULE_ID, config.settingKey, normalized);
        Hooks.callAll("augurNexusCampaignEntityVisibilityChanged", {
            reason: "globalSettingChanged",
            entityType: type,
            policy: normalized
        });
        return normalized;
    }

    static async setPlayerVisibilityOverride(idOrUuid, entityOrType = "npc", value = "inherit") {
        if (!game.user.isGM) return null;
        const type = this.#getEntityType(entityOrType);
        const config = this.getConfig(type);
        const normalized = this.normalizePlayerVisibility(value);
        const entity = await config.update(idOrUuid, {
            access: {
                playerVisibility: normalized
            }
        });
        Hooks.callAll("augurNexusCampaignEntityVisibilityChanged", {
            reason: "entityVisibilityOverrideChanged",
            entityType: type,
            entity
        });
        Hooks.callAll("augurNexusConnectionsChanged", {
            graph: game.settings.get(MODULE_ID, "connectionsGraph") || {},
            reason: "campaignEntityVisibilityOverrideChanged"
        });
        return entity;
    }

    static getEntitiesForType(entityOrType = "npc") {
        return this.getConfig(entityOrType).list();
    }
}
