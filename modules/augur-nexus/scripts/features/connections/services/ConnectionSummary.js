import { ConnectionCategories } from "./ConnectionCategories.js";
import { ConnectionStore } from "./ConnectionStore.js";
import { ConnectionTargetResolver } from "./ConnectionTargetResolver.js";

export class ConnectionSummary {
    static build(target) {
        const nodeId = ConnectionTargetResolver.getNodeId(target);
        const customCategories = ConnectionStore.getCustomCategories();
        const connections = ConnectionStore.getConnectionsForNode(nodeId);
        const counts = new Map(ConnectionCategories.editable(customCategories).map(category => [category.id, 0]));

        for (const { edge, node } of connections) {
            const category = ConnectionCategories.normalize(ConnectionStore.getConnectionCategoryForNode(edge, nodeId, customCategories) || node.category, "npc", customCategories);
            counts.set(category, (counts.get(category) || 0) + 1);
        }

        const rows = ConnectionCategories.editable(customCategories)
            .map(category => ({
                ...category,
                count: counts.get(category.id) || 0
            }))
            .filter(row => row.count > 0);

        const total = rows.reduce((sum, row) => sum + row.count, 0);
        return {
            hasConnections: total > 0,
            rows,
            total
        };
    }
}
