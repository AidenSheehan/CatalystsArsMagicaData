import { ConnectionSidebarModel } from "../../connections/services/ConnectionSidebarModel.js";
import { ConnectionTargetResolver } from "../../connections/services/ConnectionTargetResolver.js";
import { ShipEntityModel } from "../models/ShipEntityModel.js";
import { CampaignEntityIndex } from "./CampaignEntityIndex.js";
import { CampaignEntityVisibilityManager } from "./CampaignEntityVisibilityManager.js";

export class ShipDirectoryModel {
    static build({ search = "", expandedNodeIds = new Set(), isGM = game.user.isGM } = {}) {
        const ships = CampaignEntityIndex.getShips({ search });
        const rows = ships.filter(entity => CampaignEntityVisibilityManager.canUserSee(entity, game.user)).map(entity => {
            const target = ConnectionTargetResolver.fromCampaignEntity(entity);
            const nodeId = ConnectionTargetResolver.getNodeId(target);
            const expanded = expandedNodeIds.has(nodeId);
            const connections = ConnectionSidebarModel.buildForTarget(target, { expanded });
            const isPlayerHidden = !CampaignEntityVisibilityManager.isVisibleToPlayers(entity);
            return {
                id: entity.id,
                entityId: entity.id,
                entityType: "ship",
                name: ShipEntityModel.getName(entity),
                subtitle: ShipEntityModel.getSubtitle(entity),
                searchText: ShipEntityModel.getSearchText(entity),
                imageSrc: ShipEntityModel.getImage(entity),
                placementImageSrc: ShipEntityModel.getImage(entity),
                accent: ShipEntityModel.getAccent(entity),
                sourceModule: entity.sourceModule || "",
                tags: entity.tags || [],
                journalEntryId: entity.journalEntryId || "",
                uuid: entity.uuid || "",
                connections,
                isPlayerHidden,
                playerVisibilityValue: CampaignEntityVisibilityManager.getPlayerVisibilityOverride(entity),
                playerVisibilityLabel: CampaignEntityVisibilityManager.getPlayerVisibilityLabel(entity),
                playerVisibilityIcon: CampaignEntityVisibilityManager.getPlayerVisibilityIcon(entity),
                hasOptions: isGM,
                canOpen: true
            };
        });
        return {
            rows,
            hasRows: rows.length > 0,
            isSearching: !!String(search || "").trim(),
            emptyLabel: String(search || "").trim() ? "No ships match this search." : "No ships have been created yet."
        };
    }
}
