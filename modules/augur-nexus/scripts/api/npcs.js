import { NpcEntityModel } from "../features/campaign-entities/models/NpcEntityModel.js";
import { CampaignEntityIndex } from "../features/campaign-entities/services/CampaignEntityIndex.js";
import { CampaignEntityJournalStore } from "../features/campaign-entities/services/CampaignEntityJournalStore.js";
import { NpcGeneratorRegistry } from "../features/campaign-entities/services/NpcGeneratorRegistry.js";
import { NpcPortraitCatalogRegistry } from "../features/campaign-entities/services/NpcPortraitCatalogRegistry.js";
import { NpcVisibilityManager } from "../features/campaign-entities/services/NpcVisibilityManager.js";
import { PersonalityTraitRegistry } from "../features/campaign-entities/services/PersonalityTraitRegistry.js";

export async function createNpc(data = {}) {
    return CampaignEntityJournalStore.createNpc(data);
}

export function getNpc(idOrUuid) {
    return CampaignEntityJournalStore.getNpc(idOrUuid);
}

export function getNpcs(filters = {}) {
    return CampaignEntityJournalStore.getNpcs(filters);
}

export async function updateNpc(idOrUuid, patch = {}, options = {}) {
    return CampaignEntityJournalStore.updateNpc(idOrUuid, patch, options);
}

export async function deleteNpc(idOrUuid, options = {}) {
    return CampaignEntityJournalStore.deleteNpc(idOrUuid, options);
}

export async function openNpcDossier(idOrUuid) {
    const npc = getNpc(idOrUuid);
    if (!npc) {
        ui.notifications.warn("That NPC could not be found.");
        return null;
    }
    if (!NpcVisibilityManager.canUserSeeNpc(npc)) {
        ui.notifications.warn("That NPC is not currently visible.");
        return null;
    }
    const { NpcDossier } = await import("../features/campaign-entities/applications/NpcDossier.js");
    return NpcDossier.show({ npcId: npc.id });
}

export function rebuildNpcIndex() {
    return CampaignEntityIndex.rebuild();
}

export async function getPersonalityTraits() {
    return PersonalityTraitRegistry.load();
}

export function getNpcConnectionTarget(idOrEntity) {
    const entity = typeof idOrEntity === "string" ? getNpc(idOrEntity) : idOrEntity;
    if (!entity) return null;
    return {
        id: `nexus-entity:${entity.id}`,
        kind: "nexus-entity",
        entityId: entity.id,
        entityType: "npc",
        uuid: entity.uuid || "",
        name: NpcEntityModel.getName(entity),
        img: NpcEntityModel.getImage(entity),
        category: "npc",
        subtitle: NpcEntityModel.getSubtitle(entity)
    };
}

export function registerNpcGenerator(definition = {}) {
    return NpcGeneratorRegistry.register(definition);
}

export function getNpcGenerators() {
    return NpcGeneratorRegistry.list();
}

export function getNpcGeneratorOptions(generatorId) {
    return NpcGeneratorRegistry.getOptions(generatorId);
}

export function getNpcGeneratorProfileOptions(generatorId) {
    return NpcGeneratorRegistry.getProfileOptions(generatorId);
}

export function generateNpc(generatorId, options = {}) {
    return NpcGeneratorRegistry.generate(generatorId, options);
}

export function registerNpcPortraitCatalog(definition = {}) {
    return NpcPortraitCatalogRegistry.register(definition);
}

export function getNpcPortraitCatalogs() {
    return NpcPortraitCatalogRegistry.list();
}

export function getNpcPortraits() {
    return NpcPortraitCatalogRegistry.getPortraits();
}

export function getNpcPlayerVisibility(idOrEntity) {
    const entity = typeof idOrEntity === "string" ? getNpc(idOrEntity) : idOrEntity;
    return NpcVisibilityManager.getNpcPlayerVisibilityOverride(entity);
}

export async function setNpcPlayerVisibility(idOrUuid, value = "inherit") {
    return NpcVisibilityManager.setNpcPlayerVisibilityOverride(idOrUuid, value);
}

export function canUserSeeNpc(idOrEntity, user = game.user) {
    const entity = typeof idOrEntity === "string" ? getNpc(idOrEntity) : idOrEntity;
    return NpcVisibilityManager.canUserSeeNpc(entity, user);
}
