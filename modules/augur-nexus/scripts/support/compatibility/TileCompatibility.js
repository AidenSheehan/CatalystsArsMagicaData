import { isV14OrNewer } from "./FoundryVersion.js";

function applyTopLeftDocumentAnchor(texture = {}) {
    return {
        ...texture,
        anchorX: texture.anchorX ?? 0,
        anchorY: texture.anchorY ?? 0
    };
}

function applyTextureAnchorMode(texture = {}, anchorMode = "top-left") {
    switch (anchorMode) {
        case "native":
        case "preserve":
            return texture;
        case "top-left":
        default:
            return applyTopLeftDocumentAnchor(texture);
    }
}

function hasFiniteNumber(value) {
    return Number.isFinite(Number(value));
}

function getSceneDimensions(scene) {
    const dimensions = scene?.dimensions || canvas?.dimensions;
    if (!dimensions) return null;

    const width = Number(dimensions.sceneWidth ?? dimensions.width);
    const height = Number(dimensions.sceneHeight ?? dimensions.height);
    const size = Number(dimensions.size ?? canvas?.grid?.size ?? 100);

    if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
    return { width, height, size };
}

function getTileClampBounds(scene, data = {}) {
    const dimensions = getSceneDimensions(scene);
    if (!dimensions) return null;
    const rect = getSceneRect(scene);

    const width = Number(data.width);
    const height = Number(data.height);
    if (!Number.isFinite(width) || !Number.isFinite(height)) return null;

    const securityBuffer = Math.max(dimensions.size / 5, 20);
    return {
        minX: rect.x + ((width - securityBuffer) * -1),
        minY: rect.y + ((height - securityBuffer) * -1),
        maxX: rect.x + rect.width - securityBuffer,
        maxY: rect.y + rect.height - securityBuffer
    };
}

function getSceneRect(scene) {
    const dimensions = scene?.dimensions || canvas?.dimensions;
    const rect = dimensions?.sceneRect || canvas?.dimensions?.sceneRect;
    if (rect) {
        return {
            x: Number(rect.x) || 0,
            y: Number(rect.y) || 0,
            width: Number(rect.width ?? dimensions?.width) || 0,
            height: Number(rect.height ?? dimensions?.height) || 0
        };
    }

    return {
        x: 0,
        y: 0,
        width: Number(dimensions?.sceneWidth ?? dimensions?.width) || 0,
        height: Number(dimensions?.sceneHeight ?? dimensions?.height) || 0
    };
}

function getCenterPreservingTopLeftPosition({ x, y, width, height, rotation } = {}) {
    if (!isV14OrNewer()) return { x, y };
    if (![x, y, width, height, rotation].every(hasFiniteNumber)) return { x, y };

    const radians = Math.toRadians(Number(rotation) || 0);
    if (!radians) return { x, y };

    const halfWidth = Number(width) / 2;
    const halfHeight = Number(height) / 2;
    const centerX = Number(x) + halfWidth;
    const centerY = Number(y) + halfHeight;

    const rotatedHalfX = (halfWidth * Math.cos(radians)) - (halfHeight * Math.sin(radians));
    const rotatedHalfY = (halfWidth * Math.sin(radians)) + (halfHeight * Math.cos(radians));

    return {
        x: centerX - rotatedHalfX,
        y: centerY - rotatedHalfY
    };
}

function getVisualTopLeftFromCenterPreservingPosition({ x, y, width, height, rotation } = {}) {
    if (!isV14OrNewer()) return { x, y };
    if (![x, y, width, height, rotation].every(hasFiniteNumber)) return { x, y };

    const radians = Math.toRadians(Number(rotation) || 0);
    if (!radians) return { x, y };

    const halfWidth = Number(width) / 2;
    const halfHeight = Number(height) / 2;
    const centerX = Number(x) + (halfWidth * Math.cos(radians)) - (halfHeight * Math.sin(radians));
    const centerY = Number(y) + (halfWidth * Math.sin(radians)) + (halfHeight * Math.cos(radians));

    return {
        x: centerX - halfWidth,
        y: centerY - halfHeight
    };
}

export function normalizeTileCreateData(data, { anchorMode = "top-left" } = {}) {
    if (!isV14OrNewer()) return data;
    return {
        ...data,
        texture: applyTextureAnchorMode(data.texture, anchorMode)
    };
}

export function normalizeTileUpdateData(data, { anchorMode = "top-left" } = {}) {
    if (!isV14OrNewer()) return data;
    if (!data.texture) return data;
    return {
        ...data,
        texture: applyTextureAnchorMode(data.texture, anchorMode)
    };
}

export function getTopLeftAnchorCompensatedPosition(data) {
    return getCenterPreservingTopLeftPosition(data);
}

export function getTopLeftAnchorVisualPosition(data) {
    return getVisualTopLeftFromCenterPreservingPosition(data);
}

export function wouldClampTileCreateData(scene, data, options) {
    const { requireTopLeftInsideScene = false, ...normalizeOptions } = options || {};
    const normalized = normalizeTileCreateData(data, normalizeOptions);
    const bounds = getTileClampBounds(scene, normalized);
    if (!bounds) return false;

    const x = Number(normalized.x);
    const y = Number(normalized.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return true;

    if (requireTopLeftInsideScene) {
        const rect = getSceneRect(scene);
        if (x < rect.x || y < rect.y) return true;
    }

    return x < bounds.minX || x > bounds.maxX || y < bounds.minY || y > bounds.maxY;
}

export function canCreateTileWithoutClamp(scene, data, options) {
    return !wouldClampTileCreateData(scene, data, options);
}
