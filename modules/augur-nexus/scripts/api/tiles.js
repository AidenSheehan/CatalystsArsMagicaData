// Public tile compatibility helpers for dependent modules.

import {
    normalizeTileCreateData as normalizeTileCreateDataInternal,
    normalizeTileUpdateData as normalizeTileUpdateDataInternal,
    getTopLeftAnchorCompensatedPosition as getTopLeftAnchorCompensatedPositionInternal,
    getTopLeftAnchorVisualPosition as getTopLeftAnchorVisualPositionInternal,
    wouldClampTileCreateData as wouldClampTileCreateDataInternal,
    canCreateTileWithoutClamp as canCreateTileWithoutClampInternal
} from "../support/compatibility/TileCompatibility.js";

export function normalizeTileCreateData(data, options) {
    return normalizeTileCreateDataInternal(data, options);
}

export function normalizeTileUpdateData(data, options) {
    return normalizeTileUpdateDataInternal(data, options);
}

export function getTopLeftAnchorCompensatedPosition(data) {
    return getTopLeftAnchorCompensatedPositionInternal(data);
}

export function getTopLeftAnchorVisualPosition(data) {
    return getTopLeftAnchorVisualPositionInternal(data);
}

export function wouldClampTileCreateData(scene, data, options) {
    return wouldClampTileCreateDataInternal(scene, data, options);
}

export function canCreateTileWithoutClamp(scene, data, options) {
    return canCreateTileWithoutClampInternal(scene, data, options);
}
