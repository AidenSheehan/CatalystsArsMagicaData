import { ConnectionGraphModel } from "../models/ConnectionGraphModel.js";
import { ConnectionCategories } from "./ConnectionCategories.js";
import { ConnectionCategoryPresets } from "./ConnectionCategoryPresets.js";
import { ConnectionChangeNotifier } from "./ConnectionChangeNotifier.js";
import { ConnectionTargetResolver } from "./ConnectionTargetResolver.js";

const MODULE_ID = "augur-nexus";
const SETTING_KEY = "connectionsGraph";
const PLAYER_VISIBILITY_SETTING_KEY = "playerConnectionVisibility";

export class ConnectionStore {
    static PLAYER_VISIBILITY_VALUES = new Set(["inherit", "show", "hide"]);
    static #graphCache = null;

    static getGraph() {
        return foundry.utils.deepClone(this.getGraphContext().graph);
    }

    static getGraphContext() {
        const raw = game.settings.get(MODULE_ID, SETTING_KEY) || {};
        const signature = this.#getGraphSignature(raw);
        if (this.#graphCache?.signature === signature) return this.#graphCache;

        this.#graphCache = this.#buildGraphContext(raw, signature);
        return this.#graphCache;
    }

    static invalidateCache() {
        this.#graphCache = null;
    }

    static async setGraph(graph, { reason = "update" } = {}) {
        const normalized = ConnectionGraphModel.normalizeGraph({
            ...graph,
            updatedTime: Date.now(),
            updateId: foundry.utils.randomID()
        });
        await game.settings.set(MODULE_ID, SETTING_KEY, normalized);
        this.#graphCache = this.#buildGraphContext(normalized, this.#getGraphSignature(normalized));
        ConnectionChangeNotifier.notify(normalized, { reason });
        return normalized;
    }

    static getNode(nodeId) {
        return this.getGraphContext().graph.nodes?.[nodeId] || null;
    }

    static getConnectionEdge(edgeId) {
        return this.getGraphContext().graph.edges?.[edgeId] || null;
    }

    static getConnectionsForNode(nodeId) {
        if (!nodeId) return [];
        const entries = this.getGraphContext().adjacency.get(nodeId) || [];
        return entries
            .filter(connection => this.canUserSeeConnection(connection.edge))
            .filter(connection => !!connection.node)
            .filter(connection => ConnectionTargetResolver.canUserSeeNode(connection.node, game.user));
    }

    static getConnectionView(edge, nodeId, customCategories = this.getCustomCategories()) {
        const category = ConnectionCategories.normalize(
            this.#hasViewValue(edge, nodeId, "category") ? edge.views[nodeId].category : edge?.category,
            edge?.category || "npc",
            customCategories
        );
        const hasViewCategory = this.#hasViewValue(edge, nodeId, "category");
        const role = this.#hasViewValue(edge, nodeId, "role")
            ? String(edge.views[nodeId].role || "")
            : String(hasViewCategory ? ConnectionCategories.roleFor(category) : (edge?.role || ConnectionCategories.roleFor(category)));
        const note = this.#hasViewValue(edge, nodeId, "note")
            ? String(edge.views[nodeId].note || "")
            : String(edge?.note || "");
        const sort = this.#hasViewValue(edge, nodeId, "sort")
            ? Number(edge.views[nodeId].sort || 0)
            : Number(edge?.sort || 100);
        return {
            category,
            role,
            note,
            sort: Number.isFinite(sort) ? sort : 100
        };
    }

    static getConnectionCategoryForNode(edge, nodeId, customCategories = this.getCustomCategories()) {
        return this.getConnectionView(edge, nodeId, customCategories).category;
    }

    static getConnectionRoleForNode(edge, nodeId, customCategories = this.getCustomCategories()) {
        const view = this.getConnectionView(edge, nodeId, customCategories);
        return view.role || ConnectionCategories.roleFor(view.category);
    }

    static getConnectionNoteForNode(edge, nodeId, customCategories = this.getCustomCategories()) {
        return this.getConnectionView(edge, nodeId, customCategories).note;
    }

    static getConnectionSortForNode(edge, nodeId, customCategories = this.getCustomCategories()) {
        return this.getConnectionView(edge, nodeId, customCategories).sort;
    }

    static getGlobalPlayerConnectionVisibilityPolicy() {
        const policy = game.settings.get(MODULE_ID, PLAYER_VISIBILITY_SETTING_KEY) || "all";
        return ["all", "explicit"].includes(policy) ? policy : "all";
    }

    static getGlobalPlayerConnectionVisibilityPolicyLabel(policy = this.getGlobalPlayerConnectionVisibilityPolicy()) {
        if (policy === "explicit") return "Explicit Only";
        return "All Connections";
    }

    static normalizePlayerVisibility(value = "inherit") {
        return this.PLAYER_VISIBILITY_VALUES.has(value) ? value : "inherit";
    }

    static getConnectionPlayerVisibility(edge) {
        return this.normalizePlayerVisibility(edge?.playerVisibility);
    }

    static getConnectionPlayerVisibilityLabel(edgeOrValue = "inherit") {
        const normalized = typeof edgeOrValue === "string"
            ? this.normalizePlayerVisibility(edgeOrValue)
            : this.getConnectionPlayerVisibility(edgeOrValue);
        if (normalized === "show") return "Yes";
        if (normalized === "hide") return "No";
        return "Global";
    }

    static getConnectionPlayerVisibilityIcon(edgeOrValue = "inherit") {
        const normalized = typeof edgeOrValue === "string"
            ? this.normalizePlayerVisibility(edgeOrValue)
            : this.getConnectionPlayerVisibility(edgeOrValue);
        if (normalized === "show") return "fas fa-eye";
        if (normalized === "hide") return "fas fa-eye-slash";
        return "fas fa-layer-group";
    }

    static isConnectionVisibleToPlayers(edge) {
        const normalized = this.getConnectionPlayerVisibility(edge);
        if (normalized === "show") return true;
        if (normalized === "hide") return false;
        return this.getGlobalPlayerConnectionVisibilityPolicy() === "all";
    }

    static canUserSeeConnection(edge, user = game.user) {
        if (user?.isGM) return true;
        return this.isConnectionVisibleToPlayers(edge);
    }

    static async setGlobalPlayerConnectionVisibilityPolicy(policy = "all") {
        if (!game.user.isGM) return this.getGlobalPlayerConnectionVisibilityPolicy();
        const normalized = ["explicit", "all"].includes(policy) ? policy : "all";
        await game.settings.set(MODULE_ID, PLAYER_VISIBILITY_SETTING_KEY, normalized);
        return normalized;
    }

    static async setConnectionPlayerVisibility(edgeId, value = "inherit") {
        if (!game.user.isGM) return null;
        const normalized = this.normalizePlayerVisibility(value);
        return this.updateConnection(edgeId, { playerVisibility: normalized });
    }

    static getCustomCategories() {
        return this.getGraphContext().customCategories;
    }

    static async addConnection(sourceTarget, relatedTarget, options = {}) {
        const graph = this.getGraph();
        const sourceNode = ConnectionGraphModel.normalizeNode(sourceTarget, graph.customCategories);
        const targetNode = ConnectionGraphModel.normalizeNode(relatedTarget, graph.customCategories);
        if (!sourceNode || !targetNode || sourceNode.id === targetNode.id) return null;

        graph.nodes[sourceNode.id] = { ...(graph.nodes[sourceNode.id] || {}), ...sourceNode, updatedTime: Date.now() };
        graph.nodes[targetNode.id] = { ...(graph.nodes[targetNode.id] || {}), ...targetNode, updatedTime: Date.now() };

        const sourceCategory = ConnectionCategories.normalize(
            options.category || options.sourceView?.category || ConnectionCategoryPresets.defaultCategoryForConnection(sourceNode, targetNode, graph.customCategories),
            "npc",
            graph.customCategories
        );
        const targetCategory = ConnectionCategories.normalize(
            options.targetView?.category || ConnectionCategoryPresets.defaultCategoryForConnection(targetNode, sourceNode, graph.customCategories),
            "npc",
            graph.customCategories
        );
        const existing = Object.values(graph.edges).find(edge =>
            ((edge.sourceNodeId === sourceNode.id && edge.targetNodeId === targetNode.id)
                || (edge.sourceNodeId === targetNode.id && edge.targetNodeId === sourceNode.id))
        );
        if (existing) return existing;

        const sourceView = this.#normalizeViewOptions(options.sourceView || {}, {
            category: sourceCategory,
            role: options.role || ConnectionCategories.roleFor(sourceCategory),
            sort: this.#nextSortForNode(graph, sourceNode.id)
        }, graph.customCategories);
        const targetView = this.#normalizeViewOptions(options.targetView || {}, {
            category: targetCategory,
            role: ConnectionCategories.roleFor(targetCategory),
            sort: this.#nextSortForNode(graph, targetNode.id)
        }, graph.customCategories);

        const edge = ConnectionGraphModel.normalizeEdge({
            id: foundry.utils.randomID(),
            sourceNodeId: sourceNode.id,
            targetNodeId: targetNode.id,
            category: sourceView.category,
            role: sourceView.role || ConnectionCategories.roleFor(sourceView.category),
            note: options.note || "",
            sort: sourceView.sort,
            views: {
                [sourceNode.id]: sourceView,
                [targetNode.id]: targetView
            },
            createdTime: Date.now(),
            updatedTime: Date.now()
        }, graph.nodes, graph.customCategories);
        if (!edge) return null;

        graph.edges[edge.id] = edge;
        await this.setGraph(graph, { reason: "addConnection" });
        return edge;
    }

    static async updateConnection(edgeId, patch = {}) {
        const graph = this.getGraph();
        const current = graph.edges?.[edgeId];
        if (!current) return null;
        const next = ConnectionGraphModel.normalizeEdge({
            ...current,
            ...patch,
            category: patch.category ? ConnectionCategories.normalize(patch.category, current.category, graph.customCategories) : current.category,
            updatedTime: Date.now()
        }, graph.nodes, graph.customCategories);
        if (!next) return null;
        graph.edges[next.id] = next;
        await this.setGraph(graph, { reason: "updateConnection" });
        return next;
    }

    static async setConnectionViewForNode(edgeId, nodeId, patch = {}) {
        const graph = this.getGraph();
        const current = graph.edges?.[edgeId];
        if (!current || !nodeId || (current.sourceNodeId !== nodeId && current.targetNodeId !== nodeId)) return null;
        const currentView = this.getConnectionView(current, nodeId, graph.customCategories);
        const nextView = { ...currentView };
        if (Object.hasOwn(patch, "category")) {
            nextView.category = ConnectionCategories.normalize(patch.category, currentView.category, graph.customCategories);
            if (!Object.hasOwn(patch, "role")) nextView.role = ConnectionCategories.roleFor(nextView.category);
        }
        if (Object.hasOwn(patch, "role")) nextView.role = String(patch.role || "");
        if (Object.hasOwn(patch, "note")) nextView.note = String(patch.note || "");
        if (Object.hasOwn(patch, "sort")) {
            const sort = Number(patch.sort);
            if (Number.isFinite(sort)) nextView.sort = sort;
        }

        const next = ConnectionGraphModel.normalizeEdge({
            ...current,
            views: {
                ...(current.views || {}),
                [nodeId]: nextView
            },
            updatedTime: Date.now()
        }, graph.nodes, graph.customCategories);
        if (!next) return null;
        graph.edges[next.id] = next;
        await this.setGraph(graph, { reason: "setConnectionView" });
        return next;
    }

    static async upsertCustomCategory(category = {}) {
        const graph = this.getGraph();
        const label = String(category.label || "").trim();
        if (!label) return null;

        let id = String(category.id || "").trim() || ConnectionCategories.makeCustomCategoryId(label);
        const baseId = id;
        let suffix = 2;
        while ((graph.customCategories?.[id] || ConnectionCategories.isProtected(id)) && id !== category.id) {
            id = `${baseId}-${suffix}`;
            suffix += 1;
        }

        const now = Date.now();
        const normalized = ConnectionCategories.normalizeCustomCategories({
            [id]: {
                ...category,
                id,
                label,
                singular: category.singular || label,
                icon: category.icon || "fas fa-tag",
                color: category.color || "#c9a7ff",
                createdTime: category.createdTime || now,
                updatedTime: now
            }
        })[id];
        if (!normalized) return null;

        graph.customCategories = {
            ...(graph.customCategories || {}),
            [id]: normalized
        };
        await this.setGraph(graph, { reason: "upsertCustomCategory" });
        return normalized;
    }

    static async deleteCustomCategory(categoryId) {
        const graph = this.getGraph();
        if (!categoryId || !graph.customCategories?.[categoryId]) return false;
        delete graph.customCategories[categoryId];
        for (const node of Object.values(graph.nodes || {})) {
            if (node.category === categoryId) node.category = "unassigned";
            if (Array.isArray(node.groupOrder)) {
                node.groupOrder = node.groupOrder.filter(id => id !== categoryId);
                if (!node.groupOrder.length) delete node.groupOrder;
            }
            if (Array.isArray(node.hiddenCategoryIds)) {
                node.hiddenCategoryIds = node.hiddenCategoryIds.filter(id => id !== categoryId);
                if (!node.hiddenCategoryIds.length) delete node.hiddenCategoryIds;
            }
        }
        for (const edge of Object.values(graph.edges || {})) {
            if (edge.category === categoryId) {
                edge.category = "unassigned";
                edge.role = ConnectionCategories.roleFor("unassigned");
            }
            for (const view of Object.values(edge.views || {})) {
                if (view.category !== categoryId) continue;
                view.category = "unassigned";
                view.role = ConnectionCategories.roleFor("unassigned");
            }
        }
        await this.setGraph(graph, { reason: "deleteCustomCategory" });
        return true;
    }

    static getGroupOrderForNode(nodeId) {
        const node = this.getGraphContext().graph.nodes?.[nodeId] || null;
        return Array.isArray(node?.groupOrder) ? [...node.groupOrder] : [];
    }

    static getHiddenCategoryIdsForNode(nodeId) {
        const node = this.getGraphContext().graph.nodes?.[nodeId] || null;
        return Array.isArray(node?.hiddenCategoryIds) ? [...node.hiddenCategoryIds] : [];
    }

    static isCategoryGroupHiddenForNode(nodeId, categoryId) {
        if (!nodeId || !categoryId) return false;
        return this.getHiddenCategoryIdsForNode(nodeId).includes(categoryId);
    }

    static canUserSeeCategoryGroup(nodeId, categoryId, user = game.user) {
        if (user?.isGM) return true;
        return !this.isCategoryGroupHiddenForNode(nodeId, categoryId);
    }

    static async setCategoryGroupHiddenForNode(nodeId, categoryId, hidden = true) {
        if (!game.user.isGM) return false;
        const graph = this.getGraph();
        const node = graph.nodes?.[nodeId] || null;
        if (!node || !categoryId) return false;

        const categories = ConnectionCategories.editable(graph.customCategories);
        const knownIds = new Set(categories.map(category => category.id));
        if (!knownIds.has(categoryId)) return false;

        const hiddenIds = new Set(Array.isArray(node.hiddenCategoryIds) ? node.hiddenCategoryIds.filter(id => knownIds.has(id)) : []);
        if (hidden) hiddenIds.add(categoryId);
        else hiddenIds.delete(categoryId);

        graph.nodes[nodeId] = {
            ...node,
            hiddenCategoryIds: [...hiddenIds],
            updatedTime: Date.now()
        };
        if (!graph.nodes[nodeId].hiddenCategoryIds.length) delete graph.nodes[nodeId].hiddenCategoryIds;

        await this.setGraph(graph, { reason: "setGroupVisibility" });
        return true;
    }

    static async toggleCategoryGroupHiddenForNode(nodeId, categoryId) {
        const hidden = this.isCategoryGroupHiddenForNode(nodeId, categoryId);
        return this.setCategoryGroupHiddenForNode(nodeId, categoryId, !hidden);
    }

    static async moveGroupForNode(nodeId, categoryId, direction = 0, { categoryIds = null } = {}) {
        const graph = this.getGraph();
        const node = graph.nodes?.[nodeId] || null;
        const step = Math.sign(Number(direction || 0));
        if (!node || !categoryId || !step) return false;

        const categories = ConnectionCategories.editable(graph.customCategories);
        const allCategoryIds = categories.map(category => category.id);
        if (!allCategoryIds.includes(categoryId)) return false;

        const currentOrder = Array.isArray(node.groupOrder) ? node.groupOrder : [];
        const orderedIds = [
            ...currentOrder.filter(id => allCategoryIds.includes(id)),
            ...allCategoryIds.filter(id => !currentOrder.includes(id))
        ];

        const movableIds = (Array.isArray(categoryIds) ? categoryIds : orderedIds)
            .map(id => String(id || "").trim())
            .filter(id => orderedIds.includes(id));
        const movableIndex = movableIds.indexOf(categoryId);
        const nextMovableIndex = movableIndex + step;
        if (movableIndex < 0 || nextMovableIndex < 0 || nextMovableIndex >= movableIds.length) return false;

        const neighborId = movableIds[nextMovableIndex];
        const index = orderedIds.indexOf(categoryId);
        const neighborIndex = orderedIds.indexOf(neighborId);
        if (index < 0 || neighborIndex < 0) return false;

        orderedIds.splice(index, 1);
        const adjustedNeighborIndex = orderedIds.indexOf(neighborId);
        orderedIds.splice(step < 0 ? adjustedNeighborIndex : adjustedNeighborIndex + 1, 0, categoryId);

        const defaultOrder = allCategoryIds.join("|");
        const nextOrder = orderedIds.join("|") === defaultOrder ? [] : orderedIds;
        graph.nodes[nodeId] = {
            ...node,
            groupOrder: nextOrder,
            updatedTime: Date.now()
        };
        if (!nextOrder.length) delete graph.nodes[nodeId].groupOrder;

        await this.setGraph(graph, { reason: "moveGroup" });
        return true;
    }

    static async removeConnection(edgeId) {
        const graph = this.getGraph();
        if (!graph.edges?.[edgeId]) return false;
        delete graph.edges[edgeId];
        await this.setGraph(graph, { reason: "removeConnection" });
        return true;
    }

    static async reorderConnectionForNode(edgeId, nodeId, beforeEdgeId = null) {
        const graph = this.getGraph();
        if (!graph.edges?.[edgeId] || !nodeId) return false;
        const edges = Object.values(graph.edges || {})
            .filter(edge => edge.sourceNodeId === nodeId || edge.targetNodeId === nodeId)
            .sort((a, b) => this.getConnectionSortForNode(a, nodeId, graph.customCategories) - this.getConnectionSortForNode(b, nodeId, graph.customCategories) || String(a.id).localeCompare(String(b.id)));
        const movingIndex = edges.findIndex(edge => edge.id === edgeId);
        if (movingIndex < 0) return false;

        const [moving] = edges.splice(movingIndex, 1);
        const targetIndex = beforeEdgeId ? edges.findIndex(edge => edge.id === beforeEdgeId) : -1;
        edges.splice(targetIndex >= 0 ? targetIndex : edges.length, 0, moving);

        edges.forEach((edge, index) => {
            graph.edges[edge.id] = ConnectionGraphModel.normalizeEdge({
                ...edge,
                views: {
                    ...(edge.views || {}),
                    [nodeId]: {
                        ...this.getConnectionView(edge, nodeId, graph.customCategories),
                        sort: (index + 1) * 100
                    }
                },
                updatedTime: Date.now()
            }, graph.nodes, graph.customCategories);
        });
        await this.setGraph(graph, { reason: "reorderConnection" });
        return true;
    }

    static async removeNode(nodeId, { removeEdges = true } = {}) {
        const graph = this.getGraph();
        if (!graph.nodes?.[nodeId]) return false;
        delete graph.nodes[nodeId];
        if (removeEdges) {
            for (const [edgeId, edge] of Object.entries(graph.edges || {})) {
                if (edge.sourceNodeId === nodeId || edge.targetNodeId === nodeId) delete graph.edges[edgeId];
            }
        }
        await this.setGraph(graph, { reason: "removeNode" });
        return true;
    }

    static async removeConnectionsForTarget(target) {
        const nodeId = ConnectionTargetResolver.getNodeId(target);
        return this.removeNode(nodeId, { removeEdges: true });
    }

    static #getGraphSignature(graph = {}) {
        return [
            graph?.updatedTime || 0,
            graph?.updateId || "",
            Object.keys(graph?.nodes || {}).length,
            Object.keys(graph?.edges || {}).length,
            Object.keys(graph?.customCategories || {}).length
        ].join(":");
    }

    static #buildGraphContext(graph, signature = "") {
        const normalized = ConnectionGraphModel.normalizeGraph(graph || {});
        const adjacency = new Map();
        const customCategories = normalized.customCategories || {};

        const pushConnection = (nodeId, edge, relatedNode) => {
            if (!nodeId || !relatedNode) return;
            const bucket = adjacency.get(nodeId) || [];
            bucket.push({ edge, node: relatedNode });
            adjacency.set(nodeId, bucket);
        };

        for (const edge of Object.values(normalized.edges || {})) {
            const sourceNode = normalized.nodes?.[edge.sourceNodeId] || null;
            const targetNode = normalized.nodes?.[edge.targetNodeId] || null;
            if (!sourceNode || !targetNode) continue;
            pushConnection(edge.sourceNodeId, edge, targetNode);
            pushConnection(edge.targetNodeId, edge, sourceNode);
        }

        for (const [nodeId, connections] of adjacency.entries()) {
            connections.sort((a, b) =>
                this.getConnectionSortForNode(a.edge, nodeId, customCategories)
                - this.getConnectionSortForNode(b.edge, nodeId, customCategories)
                || String(a.edge.id).localeCompare(String(b.edge.id))
            );
        }

        return {
            signature: signature || this.#getGraphSignature(normalized),
            graph: normalized,
            customCategories,
            nodes: normalized.nodes || {},
            adjacency
        };
    }

    static #nextSortForNode(graph, nodeId) {
        const sorts = Object.values(graph.edges || {})
            .filter(edge => edge.sourceNodeId === nodeId || edge.targetNodeId === nodeId)
            .map(edge => this.getConnectionSortForNode(edge, nodeId, graph.customCategories));
        return sorts.length ? Math.max(...sorts) + 100 : 100;
    }

    static #normalizeViewOptions(view = {}, fallback = {}, customCategories = {}) {
        const category = ConnectionCategories.normalize(view.category || fallback.category, fallback.category || "npc", customCategories);
        const sort = Number(Object.hasOwn(view, "sort") ? view.sort : fallback.sort);
        return {
            category,
            role: String(Object.hasOwn(view, "role") ? view.role || "" : fallback.role || ConnectionCategories.roleFor(category)),
            note: String(Object.hasOwn(view, "note") ? view.note || "" : fallback.note || ""),
            sort: Number.isFinite(sort) ? sort : 100
        };
    }

    static #hasViewValue(edge, nodeId, key) {
        return !!nodeId && !!edge?.views?.[nodeId] && Object.hasOwn(edge.views[nodeId], key);
    }
}
