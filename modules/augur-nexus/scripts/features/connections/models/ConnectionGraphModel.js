import { ConnectionCategories } from "../services/ConnectionCategories.js";

export class ConnectionGraphModel {
    static normalizeGraph(graph = {}) {
        const customCategories = ConnectionCategories.normalizeCustomCategories(graph?.customCategories || {});
        const nodes = {};
        const edges = {};

        for (const [key, node] of Object.entries(graph?.nodes || {})) {
            const normalized = this.normalizeNode({ id: key, ...node }, customCategories);
            if (normalized) nodes[normalized.id] = normalized;
        }

        for (const [key, edge] of Object.entries(graph?.edges || {})) {
            const normalized = this.normalizeEdge({ id: key, ...edge }, nodes, customCategories);
            if (normalized) edges[normalized.id] = normalized;
        }

        return {
            ...graph,
            version: Number(graph?.version || 1),
            customCategories,
            nodes,
            edges
        };
    }

    static normalizeNode(node = {}, customCategories = {}) {
        const id = String(node.id || "").trim();
        const kind = ["nexus-site", "nexus-scene", "nexus-entity"].includes(node.kind) ? node.kind : "foundry-document";
        if (!id) return null;

        if (kind === "nexus-site" && (!node.parentSceneId || !node.siteId)) return null;
        if (kind === "nexus-scene" && !node.sceneId) return null;
        if (kind === "nexus-entity" && (!node.entityId || !node.entityType)) return null;
        if (kind === "foundry-document" && !node.uuid) return null;

        const normalized = {
            ...node,
            id,
            kind,
            uuid: ["foundry-document", "nexus-entity"].includes(kind) ? String(node.uuid || "") : "",
            documentType: kind === "foundry-document" ? String(node.documentType || "") : "",
            parentSceneId: kind === "nexus-site" ? String(node.parentSceneId || "") : null,
            siteId: kind === "nexus-site" ? String(node.siteId || "") : null,
            sceneId: kind === "nexus-scene" ? String(node.sceneId || "") : null,
            entityId: kind === "nexus-entity" ? String(node.entityId || "") : null,
            entityType: kind === "nexus-entity" ? String(node.entityType || "") : null,
            name: String(node.name || "Unknown"),
            img: String(node.img || ""),
            category: ConnectionCategories.normalize(node.category, kind === "nexus-site" || kind === "nexus-scene" ? "place" : "npc", customCategories),
            groupOrder: this.#normalizeGroupOrder(node.groupOrder, customCategories),
            hiddenCategoryIds: this.#normalizeGroupOrder(node.hiddenCategoryIds, customCategories),
            createdTime: Number(node.createdTime || Date.now()),
            updatedTime: Number(node.updatedTime || node.createdTime || Date.now())
        };

        delete normalized.sourceCoverSrc;
        delete normalized.sourceCoverLabel;
        delete normalized.suppressActions;
        delete normalized.actionMode;
        delete normalized.providerId;
        if (!normalized.groupOrder.length) delete normalized.groupOrder;
        if (!normalized.hiddenCategoryIds.length) delete normalized.hiddenCategoryIds;
        return normalized;
    }

    static normalizeEdge(edge = {}, nodes = {}, customCategories = {}) {
        const id = String(edge.id || "").trim();
        const sourceNodeId = String(edge.sourceNodeId || "").trim();
        const targetNodeId = String(edge.targetNodeId || "").trim();
        if (!id || !sourceNodeId || !targetNodeId || sourceNodeId === targetNodeId) return null;
        if (nodes && (!nodes[sourceNodeId] || !nodes[targetNodeId])) return null;

        const category = ConnectionCategories.normalize(edge.category, nodes?.[targetNodeId]?.category || "npc", customCategories);
        const normalized = {
            ...edge,
            id,
            sourceNodeId,
            targetNodeId,
            category,
            role: String(edge.role || ConnectionCategories.roleFor(category)),
            note: String(edge.note || ""),
            playerVisibility: ["inherit", "show", "hide"].includes(edge.playerVisibility) ? edge.playerVisibility : "inherit",
            sort: Number(edge.sort || 100),
            createdTime: Number(edge.createdTime || Date.now()),
            updatedTime: Number(edge.updatedTime || edge.createdTime || Date.now())
        };
        normalized.views = this.#normalizeEdgeViews(edge.views, { sourceNodeId, targetNodeId, category }, customCategories);
        if (!Object.keys(normalized.views).length) delete normalized.views;
        return normalized;
    }

    static #normalizeEdgeViews(views = {}, edge = {}, customCategories = {}) {
        const normalized = {};
        const allowedNodeIds = new Set([edge.sourceNodeId, edge.targetNodeId].filter(Boolean));
        for (const [nodeId, view] of Object.entries(views || {})) {
            if (!allowedNodeIds.has(nodeId) || !view || typeof view !== "object") continue;
            const normalizedView = this.#normalizeEdgeView(view, edge.category, customCategories);
            if (Object.keys(normalizedView).length) normalized[nodeId] = normalizedView;
        }
        return normalized;
    }

    static #normalizeEdgeView(view = {}, fallbackCategory = "npc", customCategories = {}) {
        const normalized = {};
        if (Object.hasOwn(view, "category")) {
            normalized.category = ConnectionCategories.normalize(view.category, fallbackCategory, customCategories);
        }
        if (Object.hasOwn(view, "role")) normalized.role = String(view.role || "");
        if (Object.hasOwn(view, "note")) normalized.note = String(view.note || "");
        if (Object.hasOwn(view, "sort")) {
            const sort = Number(view.sort);
            if (Number.isFinite(sort)) normalized.sort = sort;
        }
        return normalized;
    }

    static #normalizeGroupOrder(groupOrder = [], customCategories = {}) {
        const knownCategoryIds = new Set(ConnectionCategories.editable(customCategories).map(category => category.id));
        const normalized = [];
        for (const categoryId of Array.isArray(groupOrder) ? groupOrder : []) {
            const id = String(categoryId || "").trim();
            if (!id || !knownCategoryIds.has(id) || normalized.includes(id)) continue;
            normalized.push(id);
        }
        return normalized;
    }
}
