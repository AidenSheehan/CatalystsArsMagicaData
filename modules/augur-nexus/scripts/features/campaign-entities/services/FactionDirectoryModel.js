import { ConnectionSidebarModel } from "../../connections/services/ConnectionSidebarModel.js";
import { ConnectionTargetResolver } from "../../connections/services/ConnectionTargetResolver.js";
import { FactionEntityModel } from "../models/FactionEntityModel.js";
import { CampaignEntityIndex } from "./CampaignEntityIndex.js";
import { CampaignEntityVisibilityManager } from "./CampaignEntityVisibilityManager.js";

export class FactionDirectoryModel {
    static build({ search = "", expandedNodeIds = new Set(), isGM = game.user.isGM } = {}) {
        const factions = CampaignEntityIndex.getFactions({ search });
        const rows = factions.filter(entity => CampaignEntityVisibilityManager.canUserSee(entity, game.user)).map(entity => {
            const target = ConnectionTargetResolver.fromCampaignEntity(entity);
            const nodeId = ConnectionTargetResolver.getNodeId(target);
            const expanded = expandedNodeIds.has(nodeId);
            const connections = ConnectionSidebarModel.buildForTarget(target, { expanded });
            const isPlayerHidden = !CampaignEntityVisibilityManager.isVisibleToPlayers(entity);
            return {
                id: entity.id,
                entityId: entity.id,
                entityType: "faction",
                name: FactionEntityModel.getName(entity),
                subtitle: FactionEntityModel.getSubtitle(entity),
                searchText: FactionEntityModel.getSearchText(entity),
                imageSrc: FactionEntityModel.getImage(entity),
                placementImageSrc: FactionEntityModel.getImage(entity),
                accent: FactionEntityModel.getAccent(entity),
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
            emptyLabel: String(search || "").trim()
                ? "No organizations match this search."
                : "No organizations have been created yet."
        };
    }
}
