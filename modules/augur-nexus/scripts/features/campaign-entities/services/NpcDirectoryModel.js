import { ConnectionSidebarModel } from "../../connections/services/ConnectionSidebarModel.js";
import { ConnectionTargetResolver } from "../../connections/services/ConnectionTargetResolver.js";
import { NpcEntityModel } from "../models/NpcEntityModel.js";
import { CampaignEntityIndex } from "./CampaignEntityIndex.js";
import { CampaignEntityVisibilityManager } from "./CampaignEntityVisibilityManager.js";

export class NpcDirectoryModel {
    static build({ search = "", expandedNodeIds = new Set(), isGM = game.user.isGM } = {}) {
        const npcs = CampaignEntityIndex.getNpcs({ search });
        const rows = npcs.filter(entity => CampaignEntityVisibilityManager.canUserSee(entity, game.user)).map(entity => {
            const target = ConnectionTargetResolver.fromCampaignEntity(entity);
            const nodeId = ConnectionTargetResolver.getNodeId(target);
            const expanded = expandedNodeIds.has(nodeId);
            const connections = ConnectionSidebarModel.buildForTarget(target, { expanded });
            const traits = NpcEntityModel.getTraits(entity);
            const isPlayerHidden = !CampaignEntityVisibilityManager.isVisibleToPlayers(entity);
            return {
                id: entity.id,
                entityId: entity.id,
                entityType: "npc",
                name: NpcEntityModel.getName(entity),
                subtitle: NpcEntityModel.getSubtitle(entity),
                searchText: NpcEntityModel.getSearchText(entity),
                roleLabel: entity.role?.roleLabel || "",
                imageSrc: NpcEntityModel.getImage(entity),
                placementImageSrc: NpcEntityModel.getImage(entity),
                accent: NpcEntityModel.getAccent(entity),
                traitCount: traits.length,
                traits: traits.slice(0, 3),
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
                ? "No people match this search."
                : "No people have been created yet."
        };
    }
}
