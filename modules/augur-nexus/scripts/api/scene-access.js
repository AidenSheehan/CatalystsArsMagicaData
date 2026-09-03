import { NexusPlayerSceneAccess } from "../features/nexus/services/NexusPlayerSceneAccess.js";
import { PlayerSceneOpenDialog } from "../features/nexus/applications/PlayerSceneOpenDialog.js";
import { PlayerNexusVisibilityDialog } from "../features/nexus/applications/PlayerNexusVisibilityDialog.js";

export function canUserViewScene(scene, user = game.user) {
    return NexusPlayerSceneAccess.canUserViewScene(scene, user);
}

export function getPlayerSceneViewOverride(scene) {
    return NexusPlayerSceneAccess.getSceneViewOverride(scene);
}

export function getPlayerSceneViewLabel(scene) {
    return NexusPlayerSceneAccess.getSceneViewLabel(scene);
}

export function getGlobalPlayerSceneViewPolicy() {
    return NexusPlayerSceneAccess.getGlobalViewPolicy();
}

export function getGlobalPlayerSceneViewPolicyLabel(policy = undefined) {
    return NexusPlayerSceneAccess.getGlobalViewPolicyLabel(policy);
}

export function setGlobalPlayerSceneViewPolicy(policy = "all") {
    return NexusPlayerSceneAccess.setGlobalViewPolicy(policy);
}

export function configureGlobalPlayerSceneViewPolicy() {
    return PlayerSceneOpenDialog.show();
}

export function setPlayerSceneViewOverride(scene, value = "inherit") {
    return NexusPlayerSceneAccess.setSceneViewOverride(scene, value);
}

export function canUserSeeSceneInNexus(scene, user = game.user) {
    return NexusPlayerSceneAccess.canUserSeeSceneInNexus(scene, user);
}

export function getPlayerNexusVisibilityOverride(scene) {
    return NexusPlayerSceneAccess.getSceneNexusVisibilityOverride(scene);
}

export function getPlayerNexusVisibilityLabel(scene) {
    return NexusPlayerSceneAccess.getSceneNexusVisibilityLabel(scene);
}

export function setPlayerNexusVisibilityOverride(scene, value = "inherit") {
    return NexusPlayerSceneAccess.setSceneNexusVisibilityOverride(scene, value);
}

export function getGlobalPlayerNexusVisibilityPolicy() {
    return NexusPlayerSceneAccess.getGlobalNexusVisibilityPolicy();
}

export function getGlobalPlayerNexusVisibilityPolicyLabel(policy = undefined) {
    return NexusPlayerSceneAccess.getGlobalNexusVisibilityPolicyLabel(policy);
}

export function setGlobalPlayerNexusVisibilityPolicy(policy = "all") {
    return NexusPlayerSceneAccess.setGlobalNexusVisibilityPolicy(policy);
}

export function configureGlobalPlayerNexusVisibilityPolicy() {
    return PlayerNexusVisibilityDialog.show();
}
