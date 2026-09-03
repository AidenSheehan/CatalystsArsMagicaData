import { CampaignEntityIndex } from "./services/CampaignEntityIndex.js";
import { CampaignEntityActorBridge } from "./services/CampaignEntityActorBridge.js";
import { CampaignEntityPlacementSync } from "./services/CampaignEntityPlacementSync.js";
import { CampaignEntityDossierRefresh } from "./services/CampaignEntityDossierRefresh.js";

export function registerCampaignEntitiesFeature() {
    CampaignEntityDossierRefresh.registerHooks();
    CampaignEntityActorBridge.registerHooks();
    CampaignEntityPlacementSync.registerHooks();

    Hooks.once("ready", async () => {
        try {
            await CampaignEntityIndex.initialize();
        } catch (err) {
            console.error("Augur Nexus | Failed to initialize campaign entities.", err);
        }
    });
}
