import { FactionEntityModel } from "../features/campaign-entities/models/FactionEntityModel.js";
import { CampaignEntityIndex } from "../features/campaign-entities/services/CampaignEntityIndex.js";
import { CampaignEntityJournalStore } from "../features/campaign-entities/services/CampaignEntityJournalStore.js";
import { CampaignEntityVisibilityManager } from "../features/campaign-entities/services/CampaignEntityVisibilityManager.js";
import { FactionEmblemCatalogRegistry } from "../features/campaign-entities/services/FactionEmblemCatalogRegistry.js";
import { FactionGeneratorRegistry } from "../features/campaign-entities/services/FactionGeneratorRegistry.js";

export async function createFaction(data = {}) {
    return CampaignEntityJournalStore.createFaction(data);
}

export function getFaction(idOrUuid) {
    return CampaignEntityJournalStore.getFaction(idOrUuid);
}

export function getFactions(filters = {}) {
    return CampaignEntityJournalStore.getFactions(filters);
}

export async function updateFaction(idOrUuid, patch = {}, options = {}) {
    return CampaignEntityJournalStore.updateFaction(idOrUuid, patch, options);
}

export async function deleteFaction(idOrUuid, options = {}) {
    return CampaignEntityJournalStore.deleteFaction(idOrUuid, options);
}

export async function openFactionDossier(idOrUuid) {
    const faction = getFaction(idOrUuid);
    if (!faction) {
        ui.notifications.warn("That faction could not be found.");
        return null;
    }
    if (!CampaignEntityVisibilityManager.canUserSee(faction)) {
        ui.notifications.warn("That faction is not currently visible.");
        return null;
    }
    const { FactionDossier } = await import("../features/campaign-entities/applications/FactionDossier.js");
    return FactionDossier.show({ factionId: faction.id });
}

export function rebuildFactionIndex() {
    return CampaignEntityIndex.rebuild();
}

export function getFactionConnectionTarget(idOrEntity) {
    const entity = typeof idOrEntity === "string" ? getFaction(idOrEntity) : idOrEntity;
    if (!entity) return null;
    return {
        id: `nexus-entity:${entity.id}`,
        kind: "nexus-entity",
        entityId: entity.id,
        entityType: "faction",
        uuid: entity.uuid || "",
        name: FactionEntityModel.getName(entity),
        img: FactionEntityModel.getImage(entity),
        category: "faction",
        subtitle: FactionEntityModel.getSubtitle(entity)
    };
}

export function registerFactionGenerator(definition = {}) {
    return FactionGeneratorRegistry.register(definition);
}

export function getFactionGenerators() {
    return FactionGeneratorRegistry.list();
}

export function getFactionGeneratorOptions(generatorId) {
    return FactionGeneratorRegistry.getOptions(generatorId);
}

export function getFactionGeneratorProfileOptions(generatorId) {
    return FactionGeneratorRegistry.getProfileOptions(generatorId);
}

export function generateFaction(generatorId, options = {}) {
    return FactionGeneratorRegistry.generate(generatorId, options);
}

export function registerFactionEmblemCatalog(definition = {}) {
    return FactionEmblemCatalogRegistry.register(definition);
}

export function getFactionEmblemCatalogs() {
    return FactionEmblemCatalogRegistry.list();
}

export function getFactionEmblems() {
    return FactionEmblemCatalogRegistry.getEmblems();
}

export function getFactionPlayerVisibility(idOrEntity) {
    const entity = typeof idOrEntity === "string" ? getFaction(idOrEntity) : idOrEntity;
    return CampaignEntityVisibilityManager.getPlayerVisibilityOverride(entity);
}

export async function setFactionPlayerVisibility(idOrUuid, value = "inherit") {
    return CampaignEntityVisibilityManager.setPlayerVisibilityOverride(idOrUuid, "faction", value);
}

export function canUserSeeFaction(idOrEntity, user = game.user) {
    const entity = typeof idOrEntity === "string" ? getFaction(idOrEntity) : idOrEntity;
    return CampaignEntityVisibilityManager.canUserSee(entity, user);
}
