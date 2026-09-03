import { ConnectionCategories } from "./ConnectionCategories.js";
import { ConnectionCategoryPresets } from "./ConnectionCategoryPresets.js";
import { ConnectionStore } from "./ConnectionStore.js";
import { ConnectionTargetResolver } from "./ConnectionTargetResolver.js";
import { SiteRecordManager } from "../../site/services/SiteRecordManager.js";

const MAX_BADGES = 3;

export class ConnectionSidebarModel {
    static getNodeIdForLineageRow(row) {
        return ConnectionTargetResolver.getNodeId(this.#targetFromLineageRow(row));
    }

    static buildForLineageRow(row, { expanded = false } = {}) {
        const target = this.#targetFromLineageRow(row);
        return this.buildForTarget(target, { expanded });
    }

    static buildForTarget(target, { expanded = false } = {}) {
        const nodeId = ConnectionTargetResolver.getNodeId(target);
        if (!nodeId) return this.#empty();

        if (!expanded) return this.buildSummaryForTarget(target);

        const customCategories = ConnectionStore.getCustomCategories();
        const connections = ConnectionStore.getConnectionsForNode(nodeId);
        if (!connections.length) return this.#empty({ nodeId });

        const categories = this.#orderCategories(ConnectionCategories.editable(customCategories), nodeId, target);
        const cards = connections.map(({ edge, node }) => this.#buildCard(edge, node, nodeId, customCategories));
        const groups = categories
            .map(category => {
                const categoryCards = cards.filter(card => card.categoryId === category.id);
                const hiddenForPlayers = ConnectionStore.isCategoryGroupHiddenForNode(nodeId, category.id);
                const playerVisible = ConnectionStore.canUserSeeCategoryGroup(nodeId, category.id, game.user);
                return {
                    ...category,
                    orderIndex: categories.findIndex(candidate => candidate.id === category.id),
                    hiddenForPlayers,
                    playerVisible,
                    count: categoryCards.length,
                    cards: categoryCards
                };
            })
            .filter(group => group.count > 0)
            .filter(group => game.user.isGM || group.playerVisible);

        groups.forEach((group, index) => {
            group.canMoveUp = index > 0;
            group.canMoveDown = index < groups.length - 1;
            group.visibleIndex = index;
        });

        const total = groups.reduce((sum, group) => sum + group.count, 0);
        return {
            nodeId,
            expanded,
            hasConnections: total > 0,
            total,
            badges: groups.slice(0, MAX_BADGES).map(group => ({
                id: group.id,
                icon: group.icon,
                color: group.color,
                count: group.count,
                label: group.label
            })),
            badgeOverflow: Math.max(0, groups.length - MAX_BADGES),
            groups
        };
    }

    static buildSummaryForLineageRow(row, { expanded = false } = {}) {
        const target = this.#targetFromLineageRow(row);
        return this.buildSummaryForTarget(target, { expanded });
    }

    static buildSummaryForTarget(target, { expanded = false } = {}) {
        const nodeId = ConnectionTargetResolver.getNodeId(target);
        if (!nodeId) return this.#empty();

        const customCategories = ConnectionStore.getCustomCategories();
        const connections = ConnectionStore.getConnectionsForNode(nodeId);
        if (!connections.length) return this.#empty({ nodeId, expanded });

        const categories = this.#orderCategories(ConnectionCategories.editable(customCategories), nodeId, target);
        const countsByCategory = new Map();
        for (const { edge } of connections) {
            const categoryId = ConnectionStore.getConnectionCategoryForNode(edge, nodeId, customCategories);
            countsByCategory.set(categoryId, (countsByCategory.get(categoryId) || 0) + 1);
        }

        const groups = categories
            .map(category => {
                const hiddenForPlayers = ConnectionStore.isCategoryGroupHiddenForNode(nodeId, category.id);
                const playerVisible = ConnectionStore.canUserSeeCategoryGroup(nodeId, category.id, game.user);
                return {
                    ...category,
                    count: countsByCategory.get(category.id) || 0,
                    hiddenForPlayers,
                    playerVisible
                };
            })
            .filter(group => group.count > 0)
            .filter(group => game.user.isGM || group.playerVisible);

        const total = groups.reduce((sum, group) => sum + group.count, 0);
        return {
            nodeId,
            expanded,
            hasConnections: total > 0,
            total,
            badges: groups.slice(0, MAX_BADGES).map(group => ({
                id: group.id,
                icon: group.icon,
                color: group.color,
                count: group.count,
                label: group.label
            })),
            badgeOverflow: Math.max(0, groups.length - MAX_BADGES),
            groups: []
        };
    }

    static #targetFromLineageRow(row = {}) {
        if (row.parentSceneId && row.siteId) {
            const parentScene = game.scenes.get(row.parentSceneId) || null;
            const siteRecord = parentScene ? SiteRecordManager.resolveSite({ parentScene, siteId: row.siteId }) : null;
            if (!siteRecord && row.sceneId) {
                return ConnectionTargetResolver.fromSceneReference({ sceneId: row.sceneId });
            }
            return ConnectionTargetResolver.fromSiteReference({
                parentSceneId: row.parentSceneId,
                siteId: row.siteId
            });
        }

        if (row.sceneId) return ConnectionTargetResolver.fromSceneReference({ sceneId: row.sceneId });
        return null;
    }

    static #buildCard(edge, node, currentNodeId = "", customCategories = {}) {
        const displayNode = ConnectionTargetResolver.resolveDisplayNodeSync(node) || { id: "", name: "Missing connection", missing: true };
        const view = ConnectionStore.getConnectionView(edge, currentNodeId, customCategories);
        const categoryId = ConnectionCategories.normalize(view.category || displayNode.category, "npc", customCategories);
        const category = ConnectionCategories.get(categoryId, customCategories);
        return {
            edgeId: edge.id,
            nodeId: displayNode.id,
            name: displayNode.name || "Unknown",
            img: displayNode.img || "",
            icon: category.icon,
            categoryId,
            color: category.color,
            subtitle: displayNode.missing ? "Missing" : (displayNode.embeddedLabel || view.role || category.singular),
            note: String(view.note || "").trim(),
            missing: !!displayNode.missing,
            uuid: displayNode.uuid || "",
            documentType: displayNode.documentType || "",
            draggable: !!ConnectionTargetResolver.getDragData(displayNode),
            playerVisibilityLabel: ConnectionStore.getConnectionPlayerVisibilityLabel(edge),
            playerVisibilityIcon: ConnectionStore.getConnectionPlayerVisibilityIcon(edge),
            isPlayerHidden: !ConnectionStore.isConnectionVisibleToPlayers(edge)
        };
    }

    static #orderCategories(categories = [], nodeId = "", target = null) {
        const categoryIds = new Set(categories.map(category => category.id));
        const order = ConnectionStore.getGroupOrderForNode(nodeId).filter(id => categoryIds.has(id));
        return ConnectionCategoryPresets.orderCategories(categories, { target, order });
    }

    static #empty(extra = {}) {
        return {
            nodeId: "",
            expanded: false,
            hasConnections: false,
            total: 0,
            badges: [],
            badgeOverflow: 0,
            groups: [],
            ...extra
        };
    }
}
