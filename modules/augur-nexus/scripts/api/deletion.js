import { NexusSceneDeletionCoordinator } from "../features/nexus/services/NexusSceneDeletionCoordinator.js";

export function deleteSceneBranch(scene, options = {}) {
    return NexusSceneDeletionCoordinator.deleteSceneBranch(scene, options);
}

export function getSceneBranchDeleteImpact(scene, options = {}) {
    return NexusSceneDeletionCoordinator.getSceneBranchDeleteImpact(scene, options);
}

export function registerSceneDeleteParticipant(moduleId, participant) {
    return NexusSceneDeletionCoordinator.registerParticipant(moduleId, participant);
}

export function unregisterSceneDeleteParticipant(moduleId) {
    return NexusSceneDeletionCoordinator.unregisterParticipant(moduleId);
}
