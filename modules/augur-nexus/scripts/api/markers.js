// Public map-marker helpers for dependent modules.

const MODULE_ID = "augur-nexus";

export function getNexusMapMarker(tileOrDocument) {
    const document = tileOrDocument?.document ?? tileOrDocument ?? null;
    if (!document?.id || document.documentName !== "Tile") return null;

    const flags = document.flags?.[MODULE_ID] || {};
    if (flags.site) {
        return {
            kind: "site",
            id: flags.siteId || "",
            label: flags.siteName || "Site",
            labelKind: "Nexus Site",
            labelId: flags.labelId || "",
            ownerTileId: document.id,
            raw: flags
        };
    }

    if (flags.marker?.markerId && flags.marker?.target?.kind) {
        const record = flags.marker;
        const target = record.target || {};
        const presentation = record.presentation || {};
        const behavior = record.behavior || {};
        return {
            kind: markerKind(record),
            id: markerId(record),
            markerId: record.markerId || "",
            placementId: record.markerId || "",
            label: presentation.name || "Marker",
            labelKind: markerLabelKind(record),
            labelId: record.label?.id || "",
            ownerTileId: document.id,
            canOrbit: behavior.canOrbit === true,
            canConvertToToken: behavior.canConvertToToken === true,
            target,
            raw: record
        };
    }

    return null;
}

export function isNexusMapMarker(tileOrDocument) {
    return !!getNexusMapMarker(tileOrDocument);
}

export function findNexusMapMarkerLabel(scene, tileOrDocument) {
    const document = tileOrDocument?.document ?? tileOrDocument ?? null;
    const marker = getNexusMapMarker(document);
    if (!scene || !document || !marker) return null;

    if (marker.labelId) {
        const label = scene.drawings?.get(marker.labelId) || scene.drawings?.contents?.find(drawing => drawing.id === marker.labelId) || null;
        if (label) return label;
    }

    return scene.drawings?.contents?.find(drawing => {
        const flags = drawing.flags?.[MODULE_ID] || {};
        if (marker.markerId) {
            if (!flags.markerLabel) return false;
            if (flags.ownerTileId && flags.ownerTileId === document.id) return true;
            return flags.markerId === marker.markerId;
        }

        if (marker.kind === "site") {
            if (!flags.siteLabel) return false;
            if (flags.ownerTileId && flags.ownerTileId === document.id) return true;
            return !!marker.id && flags.siteId === marker.id;
        }

        if (!flags.markerLabel) return false;
        if (flags.ownerTileId && flags.ownerTileId === document.id) return true;
        return !!marker.markerId && flags.markerId === marker.markerId;
    }) || null;
}

export function buildNexusMapMarkerLabelPositionUpdate(labelOrDocument, tileOrDocument) {
    const label = labelOrDocument?.document ?? labelOrDocument ?? null;
    const tile = tileOrDocument?.document ?? tileOrDocument ?? null;
    if (!label || !tile) return null;

    const width = Number(label.shape?.width || label.width || 96);
    const height = Number(label.shape?.height || label.height || 30);
    const offset = Number(label.flags?.[MODULE_ID]?.offset ?? 8);
    const center = getTileCenter(tile);
    return {
        x: Math.round(center.x - (width / 2)),
        y: Math.round(Number(tile.y || 0) + Math.max(Number(tile.height || 0), 1) + offset),
        "shape.width": width,
        "shape.height": height
    };
}

export function getPlacedEntityKindLabel(type = "") {
    switch (String(type || "").trim()) {
        case "npc": return "NPC";
        case "ship": return "Ship";
        case "faction": return "Faction";
        default: return "Nexus Entity";
    }
}

function markerKind(record = {}) {
    const target = record.target || {};
    if (target.kind === "campaign-entity") return String(target.entityType || "entity").trim() || "entity";
    if (target.kind === "nexus-site") return record.markerKind === "site-placement" ? "site" : "site-reference";
    if (target.kind === "nexus-scene") return "scene-reference";
    if (target.kind === "legacy-scifi-pending") return "pending-scene-reference";
    return "marker";
}

function markerId(record = {}) {
    const target = record.target || {};
    if (target.kind === "campaign-entity") return target.entityId || "";
    if (target.kind === "nexus-site") return target.siteId || "";
    if (target.kind === "nexus-scene") return target.sceneId || "";
    if (target.kind === "legacy-scifi-pending") return target.pageId || target.journalEntryId || "";
    return record.markerId || "";
}

function markerLabelKind(record = {}) {
    const target = record.target || {};
    if (target.kind === "campaign-entity") return getPlacedEntityKindLabel(target.entityType);
    if (target.kind === "nexus-site") return record.markerKind === "site-placement" ? "Nexus Site" : "Nexus Site Reference";
    if (target.kind === "nexus-scene") return "Nexus Scene Reference";
    if (target.kind === "legacy-scifi-pending") return "Pending Sci-Fi Scene";
    return "Nexus Marker";
}

function getTileCenter(tile = {}) {
    return {
        x: Number(tile.x || 0) + (Number(tile.width || 0) / 2),
        y: Number(tile.y || 0) + (Number(tile.height || 0) / 2)
    };
}
