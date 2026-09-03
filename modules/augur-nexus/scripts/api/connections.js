// Public connections API for dependent modules.

import { ConnectionsBoard } from "../features/connections/components/ConnectionsBoard.js";
import { ConnectionStore } from "../features/connections/services/ConnectionStore.js";
import { ConnectionTargetResolver } from "../features/connections/services/ConnectionTargetResolver.js";

export function removeConnectionsForTarget(target = {}) {
    return ConnectionStore.removeConnectionsForTarget(target);
}

export function addConnection(sourceTarget, relatedTarget, options = {}) {
    return ConnectionStore.addConnection(sourceTarget, relatedTarget, options);
}

export function getSceneConnectionTarget(sceneOrId) {
    const sceneId = typeof sceneOrId === "string" ? sceneOrId : sceneOrId?.id || null;
    return ConnectionTargetResolver.fromSceneReference({ sceneId });
}

export function createConnectionsBoardController({ target, isGM = game.user.isGM, activeCategory = "all" } = {}) {
    return new ConnectionsBoard({ target, isGM, activeCategory });
}
