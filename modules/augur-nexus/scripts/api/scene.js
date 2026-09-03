// Public scene API for dependent modules.

import { getSceneBackgroundColor } from "../support/compatibility/SceneBackgroundCompatibility.js";
import { SceneUtils } from "../support/utils/SceneUtils.js";
import { NexusSceneFolderManager } from "../features/nexus/services/NexusSceneFolderManager.js";
import { NexusLineageManager } from "../features/nexus/services/NexusLineageManager.js";
import { NexusSceneNavigationManager } from "../features/nexus/services/NexusSceneNavigationManager.js";
import { NexusSceneTransitionEffects } from "../features/nexus/services/NexusSceneTransitionEffects.js";
import { NexusDestructiveGenerationSafety } from "../features/nexus/services/NexusDestructiveGenerationSafety.js";
import { deleteSceneBranch as deleteSceneBranchInternal } from "./deletion.js";

export function clearScene(scene, types) {
    return SceneUtils.clearScene(scene, types);
}

export function configureScene(scene, options) {
    return SceneUtils.configureScene(scene, options);
}

export function resizeScene(scene, width, height, extraData = {}) {
    return SceneUtils.resizeScene(scene, width, height, extraData);
}

export function getChildSceneCreateData(parentScene, options = {}) {
    return NexusSceneFolderManager.getChildSceneCreateData(parentScene, options);
}

export function placeSceneInParentFolder(parentScene, childScene, options = {}) {
    return NexusSceneFolderManager.placeExistingSceneInParentFolder(parentScene, childScene, options);
}

export function placeSceneInFamilyFolder(scene, options = {}) {
    return NexusSceneFolderManager.placeSceneInFamilyFolder(scene, options);
}

export function getParentScene(scene) {
    return NexusLineageManager.getParentScene(scene);
}

export function getChildScenes(scene) {
    return NexusLineageManager.getChildScenes(scene);
}

export function validateSceneParent(scene, options = {}) {
    return NexusLineageManager.validateSceneParent(scene, options);
}

export function collectSceneBranch(scene) {
    return NexusLineageManager.collectSceneBranch(scene);
}

export function getBrokenLineageScenes() {
    return NexusLineageManager.getBrokenLineageScenes();
}

export function repairBrokenLineage(options = {}) {
    return NexusLineageManager.repairBrokenLineage(options);
}

export function setSceneParent(scene, options = {}) {
    return NexusLineageManager.setSceneParent(scene, options);
}

export function clearSceneParent(scene, options = {}) {
    return NexusLineageManager.clearSceneParent(scene, options);
}

export function deleteSceneBranch(scene) {
    return deleteSceneBranchInternal(scene, { confirmed: true });
}

export function getSceneNavigation(scene) {
    return NexusSceneNavigationManager.getSceneNavigation(scene);
}

export function setSceneNavigation(scene, options = {}) {
    return NexusSceneNavigationManager.setSceneNavigation(scene, options);
}

export function transitionToScene(targetScene, options = {}) {
    return NexusSceneTransitionEffects.transitionToScene(targetScene, options);
}

export function confirmDestructiveSceneGeneration(options = {}) {
    return NexusDestructiveGenerationSafety.confirmDestructiveSceneGeneration(options);
}

export function markDestructiveSceneGenerationComplete(scene, options = {}) {
    return NexusDestructiveGenerationSafety.markDestructiveSceneGenerationComplete(scene, options);
}

export function isSceneEmptyForOverwrite(scene) {
    return NexusDestructiveGenerationSafety.isSceneEmptyForOverwrite(scene);
}

export function getDestructiveSceneGenerationRecord(scene, ownerModuleId) {
    return NexusDestructiveGenerationSafety.getDestructiveSceneGenerationRecord(scene, ownerModuleId);
}

export { getSceneBackgroundColor };

