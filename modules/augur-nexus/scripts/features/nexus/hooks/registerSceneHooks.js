// Scene lifecycle hooks for Nexus. This owns browser refresh, branch delete interception, and post-delete cleanup.

import { NexusLineageManager } from "../services/NexusLineageManager.js";
import { NexusBrowserRefreshScheduler } from "../services/NexusBrowserRefreshScheduler.js";
import { NexusSceneDeletionCoordinator } from "../services/NexusSceneDeletionCoordinator.js";
import { NexusSceneOperations } from "../services/NexusSceneOperations.js";
import { SiteSceneVisibilityManager } from "../../site/services/SiteSceneVisibilityManager.js";

const MODULE_ID = "augur-nexus";
const SCIFI_ID = "augur-scifi";

function refreshNexusBrowsers(reason = "scene-hooks") {
    NexusBrowserRefreshScheduler.schedule(reason);
}

let repairingBrokenLineage = false;

function repairBrokenLineageAndRefresh(reason = "lineage") {
    if (repairingBrokenLineage) {
        invalidateLineageAndRefresh(reason);
        return;
    }

    const brokenScenes = NexusLineageManager.getBrokenLineageScenes();
    if (!brokenScenes.length) {
        invalidateLineageAndRefresh(reason);
        return;
    }

    repairingBrokenLineage = true;
    NexusLineageManager.repairBrokenLineage()
        .then(repairedScenes => {
            if (repairedScenes.length) {
                console.warn(`Augur Nexus | Repaired broken scene lineage for: ${repairedScenes.map(scene => scene.name).join(", ")}`);
                ui.notifications?.warn?.(`Augur Nexus repaired broken scene lineage for ${repairedScenes.length} scene${repairedScenes.length === 1 ? "" : "s"}.`);
            }
        })
        .catch(err => {
            console.error("Augur Nexus | Failed to repair broken scene lineage.", err);
            ui.notifications?.error?.("Augur Nexus could not repair broken scene lineage.");
        })
        .finally(() => {
            repairingBrokenLineage = false;
            invalidateLineageAndRefresh(`${reason}-repair`);
        });
}

function invalidateLineageAndRefresh(reason = "lineage") {
    NexusLineageManager.invalidateCache(reason);
    refreshNexusBrowsers(reason);
}

function isNexusSiteDocument(document) {
    return !!document?.flags?.[MODULE_ID]?.site || !!document?.flags?.[MODULE_ID]?.sitePage;
}

function isNexusMapMarkerDocument(document) {
    const flags = document?.flags?.[MODULE_ID] || {};
    return !!flags.site || !!flags.sitePage || !!flags.siteLabel || !!flags.marker || !!flags.markerLabel;
}

function isAllowedVisualKey(key, allowedKeys, allowedPrefixes) {
    return allowedKeys.has(key) || allowedPrefixes.some(prefix => key.startsWith(prefix));
}

function isVisualOnlyNexusMarkerUpdate(document, data, options) {
    if (options?.[MODULE_ID]?.visualOnly) return true;
    if (!isNexusMapMarkerDocument(document)) return false;

    const flattened = foundry.utils.flattenObject(data || {});
    const keys = Object.keys(flattened);
    if (!keys.length) return false;

    const documentName = document?.documentName || "";
    if (documentName === "Tile") {
        const allowedKeys = new Set([
            "_id",
            "x",
            "y",
            "width",
            "height",
            "rotation",
            "hidden",
            "alpha",
            "texture.scaleX",
            "texture.scaleY"
        ]);
        const allowedPrefixes = [
            `flags.${MODULE_ID}.marker.placement.`,
            `flags.${MODULE_ID}.marker.presentation.showLabel`,
            `flags.${MODULE_ID}.marker.presentation.labelColor`,
            `flags.${MODULE_ID}.marker.presentation.labelFontSize`,
            `flags.${MODULE_ID}.marker.presentation.labelFontFamily`,
            `flags.${MODULE_ID}.marker.label.`
        ];
        return keys.every(key => isAllowedVisualKey(key, allowedKeys, allowedPrefixes));
    }

    if (documentName === "Drawing") {
        const allowedKeys = new Set([
            "_id",
            "x",
            "y",
            "text",
            "fontSize",
            "fontFamily",
            "textColor",
            "fillColor",
            "fillAlpha",
            "textAlpha",
            "hidden"
        ]);
        const allowedPrefixes = [
            "shape.",
            `flags.${MODULE_ID}.markerLabel.`,
            `flags.${MODULE_ID}.siteLabel.`,
            `flags.${MODULE_ID}.siteId`,
            `flags.${MODULE_ID}.ownerTileId`,
            `flags.${MODULE_ID}.markerId`,
            `flags.${MODULE_ID}.target`,
            `flags.${MODULE_ID}.labelRole`
        ];
        return keys.every(key => isAllowedVisualKey(key, allowedKeys, allowedPrefixes));
    }

    return false;
}

function isQuietScifiAnimationTileUpdate(data, options) {
    if (!options?.[SCIFI_ID]?.animationSync) return false;

    const flattened = foundry.utils.flattenObject(data || {});
    const allowedKeys = new Set([
        "_id",
        "x",
        "y",
        `flags.${SCIFI_ID}.orbit.phase`,
        `flags.${SCIFI_ID}.orbit.angle`
    ]);

    return Object.keys(flattened).every(key => allowedKeys.has(key));
}

export function registerSceneHooks() {
    Hooks.on("canvasReady", () => repairBrokenLineageAndRefresh("canvas-ready"));

    for (const hookName of ["createScene", "updateScene", "deleteScene"]) {
        Hooks.on(hookName, () => repairBrokenLineageAndRefresh(hookName));
    }

    Hooks.on("augurNexusLineageChanged", () => repairBrokenLineageAndRefresh("lineage-changed"));
    Hooks.on("augurNexusPlayerSceneAccessChanged", scene => {
        if (!scene?.id) return;
        SiteSceneVisibilityManager.applyMarkerVisibilityForTarget({
            kind: "nexus-scene",
            sceneId: scene.id
        }).catch(err => {
            console.warn("Augur Nexus | Failed to sync scene marker visibility.", err);
        });
        const siteFlags = scene.getFlag?.(MODULE_ID, "site") || {};
        const lineage = scene.getFlag?.(MODULE_ID, NexusLineageManager.LINEAGE_FLAG) || {};
        const parentSceneId = siteFlags.parentSceneId || lineage.parentSceneId || null;
        const siteId = siteFlags.siteId || lineage.parentSiteId || null;
        if (parentSceneId && siteId) {
            SiteSceneVisibilityManager.applyMarkerVisibilityForTarget({
                kind: "nexus-site",
                parentSceneId,
                siteId
            }).catch(err => {
                console.warn("Augur Nexus | Failed to sync linked site marker visibility.", err);
            });
        }
    });

    for (const hookName of ["createNote", "updateNote", "deleteNote", "createTile", "updateTile", "deleteTile", "createDrawing", "updateDrawing", "deleteDrawing", "createJournalEntryPage", "updateJournalEntryPage", "deleteJournalEntryPage"]) {
        Hooks.on(hookName, (document, data, options) => {
            if (hookName === "updateTile" && isQuietScifiAnimationTileUpdate(data, options)) return;
            if ((hookName === "updateNote" || hookName === "updateTile" || hookName === "updateDrawing") && isVisualOnlyNexusMarkerUpdate(document, data, options)) return;
            if (isNexusMapMarkerDocument(document)) invalidateLineageAndRefresh(hookName);
        });
    }

    Hooks.on("preDeleteScene", (scene, options, userId) => {
        if (userId !== game.user.id) return;
        if (options?.[MODULE_ID]?.nexusDeleteHandled) return;

        const childScenes = NexusLineageManager.getChildScenes(scene);
        if (!childScenes.length) return;

        NexusSceneDeletionCoordinator.deleteSceneBranch(scene).catch(err => {
            console.error(err);
            ui.notifications.error("Failed to delete the selected Nexus branch.");
        });

        return false;
    });

    Hooks.on("deleteScene", (scene, options, userId) => {
        if (userId !== game.user.id) return;
        if (options?.[MODULE_ID]?.nexusDeleteHandled) return;

        NexusSceneOperations.cleanupDeletedScene(scene).catch(err => {
            console.error(err);
            ui.notifications.error("Failed to clean Nexus records for the deleted scene.");
        });
    });
}

