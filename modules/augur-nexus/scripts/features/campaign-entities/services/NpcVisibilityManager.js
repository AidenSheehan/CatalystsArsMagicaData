import { CampaignEntityVisibilityManager } from "./CampaignEntityVisibilityManager.js";

export class NpcVisibilityManager {
    static VALUES = CampaignEntityVisibilityManager.VALUES;

    static getGlobalPlayerNpcVisibilityPolicy() {
        return CampaignEntityVisibilityManager.getGlobalPlayerVisibilityPolicy("npc");
    }

    static getGlobalPlayerNpcVisibilityPolicyLabel(policy = this.getGlobalPlayerNpcVisibilityPolicy()) {
        return CampaignEntityVisibilityManager.getGlobalPlayerVisibilityPolicyLabel("npc", policy);
    }

    static normalizePlayerVisibility(value = "inherit") {
        return CampaignEntityVisibilityManager.normalizePlayerVisibility(value);
    }

    static getNpcPlayerVisibilityOverride(entity = {}) {
        return CampaignEntityVisibilityManager.getPlayerVisibilityOverride(entity);
    }

    static getNpcPlayerVisibilityLabel(entityOrValue = "inherit") {
        return CampaignEntityVisibilityManager.getPlayerVisibilityLabel(entityOrValue);
    }

    static getNpcPlayerVisibilityIcon(entityOrValue = "inherit") {
        return CampaignEntityVisibilityManager.getPlayerVisibilityIcon(entityOrValue);
    }

    static isNpcVisibleToPlayers(entity = {}) {
        return CampaignEntityVisibilityManager.isVisibleToPlayers(entity);
    }

    static canUserSeeNpc(entity = {}, user = game.user) {
        return CampaignEntityVisibilityManager.canUserSee(entity, user);
    }

    static async setGlobalPlayerNpcVisibilityPolicy(policy = "all") {
        return CampaignEntityVisibilityManager.setGlobalPlayerVisibilityPolicy("npc", policy);
    }

    static async setNpcPlayerVisibilityOverride(idOrUuid, value = "inherit") {
        return CampaignEntityVisibilityManager.setPlayerVisibilityOverride(idOrUuid, "npc", value);
    }
}
