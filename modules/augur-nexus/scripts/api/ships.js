import { ShipEntityModel } from "../features/campaign-entities/models/ShipEntityModel.js";
import { CampaignEntityIndex } from "../features/campaign-entities/services/CampaignEntityIndex.js";
import { CampaignEntityJournalStore } from "../features/campaign-entities/services/CampaignEntityJournalStore.js";
import { CampaignEntityVisibilityManager } from "../features/campaign-entities/services/CampaignEntityVisibilityManager.js";
import { ShipGeneratorRegistry } from "../features/campaign-entities/services/ShipGeneratorRegistry.js";
import { ShipImageCatalogRegistry } from "../features/campaign-entities/services/ShipImageCatalogRegistry.js";

export async function createShip(data = {}) { return CampaignEntityJournalStore.createShip(data); }
export function getShip(idOrUuid) { return CampaignEntityJournalStore.getShip(idOrUuid); }
export function getShips(filters = {}) { return CampaignEntityJournalStore.getShips(filters); }
export async function updateShip(idOrUuid, patch = {}, options = {}) { return CampaignEntityJournalStore.updateShip(idOrUuid, patch, options); }
export async function deleteShip(idOrUuid, options = {}) { return CampaignEntityJournalStore.deleteShip(idOrUuid, options); }

export async function openShipDossier(idOrUuid) {
    const ship = getShip(idOrUuid);
    if (!ship) {
        ui.notifications.warn("That ship could not be found.");
        return null;
    }
    if (!CampaignEntityVisibilityManager.canUserSee(ship)) {
        ui.notifications.warn("That ship is not currently visible.");
        return null;
    }
    const { ShipDossier } = await import("../features/campaign-entities/applications/ShipDossier.js");
    return ShipDossier.show({ shipId: ship.id });
}

export function rebuildShipIndex() { return CampaignEntityIndex.rebuild(); }

export function getShipConnectionTarget(idOrEntity) {
    const entity = typeof idOrEntity === "string" ? getShip(idOrEntity) : idOrEntity;
    if (!entity) return null;
    return {
        id: `nexus-entity:${entity.id}`,
        kind: "nexus-entity",
        entityId: entity.id,
        entityType: "ship",
        uuid: entity.uuid || "",
        name: ShipEntityModel.getName(entity),
        img: ShipEntityModel.getImage(entity),
        category: "ship",
        subtitle: ShipEntityModel.getSubtitle(entity)
    };
}

export function registerShipGenerator(definition = {}) { return ShipGeneratorRegistry.register(definition); }
export function getShipGenerators() { return ShipGeneratorRegistry.list(); }
export function getShipGeneratorOptions(generatorId) { return ShipGeneratorRegistry.getOptions(generatorId); }
export function getShipGeneratorProfileOptions(generatorId) { return ShipGeneratorRegistry.getProfileOptions(generatorId); }
export function generateShip(generatorId, options = {}) { return ShipGeneratorRegistry.generate(generatorId, options); }

export function registerShipImageCatalog(definition = {}) { return ShipImageCatalogRegistry.register(definition); }
export function getShipImageCatalogs() { return ShipImageCatalogRegistry.list(); }
export function getShipModels() { return ShipImageCatalogRegistry.getModels(); }

export function getShipPlayerVisibility(idOrEntity) {
    const entity = typeof idOrEntity === "string" ? getShip(idOrEntity) : idOrEntity;
    return CampaignEntityVisibilityManager.getPlayerVisibilityOverride(entity);
}

export async function setShipPlayerVisibility(idOrUuid, value = "inherit") {
    return CampaignEntityVisibilityManager.setPlayerVisibilityOverride(idOrUuid, "ship", value);
}

export function canUserSeeShip(idOrEntity, user = game.user) {
    const entity = typeof idOrEntity === "string" ? getShip(idOrEntity) : idOrEntity;
    return CampaignEntityVisibilityManager.canUserSee(entity, user);
}
