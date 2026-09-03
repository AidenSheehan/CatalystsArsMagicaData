import { WindowPlacementMemory } from "../features/nexus/services/WindowPlacementMemory.js";

export function applySessionWindowPlacement(app, key, options = {}) {
    return WindowPlacementMemory.apply(app, key, options);
}

export function rememberSessionWindowPlacement(app, key) {
    return WindowPlacementMemory.remember(app, key);
}

export function clearSessionWindowPlacement(key = "") {
    WindowPlacementMemory.clear(key);
}