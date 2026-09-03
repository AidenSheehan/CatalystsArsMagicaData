import { NexusMarkerService } from "../../markers/services/NexusMarkerService.js";
import { CampaignEntityJournalStore } from "./CampaignEntityJournalStore.js";
import { CampaignEntityVisibilityManager } from "./CampaignEntityVisibilityManager.js";

const UPDATE_REASONS = new Set([
    "updateNpc",
    "updateShip",
    "updateFaction"
]);

export class CampaignEntityPlacementSync {
    static registerHooks() {
        Hooks.on("augurNexusCampaignEntitiesChanged", payload => {
            if (!UPDATE_REASONS.has(payload?.reason)) return;
            const entity = payload?.entity || this.#entityFromDocument(payload?.document);
            if (!entity?.id || !entity?.type) return;
            NexusMarkerService.syncMarkersForTarget(entity).catch(err => {
                console.warn("Augur Nexus | Failed to sync placed campaign entity markers.", err);
            });
            import("../../site/services/SiteSceneVisibilityManager.js").then(({ SiteSceneVisibilityManager }) => {
                SiteSceneVisibilityManager.applyMarkerVisibilityForTarget(entity).catch(err => {
                    console.warn("Augur Nexus | Failed to sync campaign entity marker visibility.", err);
                });
            });
        });

        Hooks.on("augurNexusCampaignEntityVisibilityChanged", payload => {
            const entity = payload?.entity || null;
            const entities = entity?.id && entity?.type
                ? [entity]
                : CampaignEntityVisibilityManager.getEntitiesForType(payload?.entityType || "npc");
            import("../../site/services/SiteSceneVisibilityManager.js").then(({ SiteSceneVisibilityManager }) => {
                for (const campaignEntity of entities) {
                    SiteSceneVisibilityManager.applyMarkerVisibilityForTarget(campaignEntity).catch(err => {
                        console.warn("Augur Nexus | Failed to sync campaign entity marker visibility.", err);
                    });
                }
            });
        });
    }

    static #entityFromDocument(document) {
        return document?.getFlag?.("augur-nexus", "campaignEntity")
            || document?.flags?.["augur-nexus"]?.campaignEntity
            || null;
    }
}
