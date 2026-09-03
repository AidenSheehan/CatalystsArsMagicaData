// Public site contribution API for dependent modules.

import { getSiteGenre } from "../features/site/registry/SiteGenreRegistry.js";
import { registerSiteSceneType } from "../features/site/registry/SiteSceneTypeRegistry.js";
import { SiteLabelManager } from "../features/site/services/SiteLabelManager.js";
import { SiteRecordManager } from "../features/site/services/SiteRecordManager.js";
import { SiteInteractionPolicy } from "../features/site/services/SiteInteractionPolicy.js";
import { DEFAULT_SITE_ICON_SRC } from "../features/site/services/SiteIconDefaults.js";
import { NexusSceneFolderManager } from "../features/nexus/services/NexusSceneFolderManager.js";
import { NexusLineageManager } from "../features/nexus/services/NexusLineageManager.js";
import { NexusSceneNavigationManager } from "../features/nexus/services/NexusSceneNavigationManager.js";
import { NexusMarkerService } from "../features/markers/services/NexusMarkerService.js";

const MODULE_ID = "augur-nexus";

export function registerSceneType(definition) {
    return registerSiteSceneType(definition);
}

export function registerSiteInteractionSuppressor(moduleId, predicate) {
    return SiteInteractionPolicy.registerSuppressor(moduleId, predicate);
}

export function unregisterSiteInteractionSuppressor(moduleId) {
    return SiteInteractionPolicy.unregisterSuppressor(moduleId);
}

export async function createLinkedSceneSite(parentScene, linkedScene, siteData = {}) {
    if (!parentScene) throw new Error("No parent scene provided.");
    if (!linkedScene) throw new Error("No linked scene provided.");
    const validation = NexusLineageManager.validateSceneParent(linkedScene, { parentSceneId: parentScene.id });
    if (!validation.valid) throw new Error(validation.message || "Invalid Nexus scene lineage.");

    const siteId = siteData.siteId || foundry.utils.randomID();
    const siteName = siteData.siteName || linkedScene.name;
    const iconSrc = siteData.iconSrc || DEFAULT_SITE_ICON_SRC;
    const x = Math.round(siteData.x ?? 0);
    const y = Math.round(siteData.y ?? 0);
    const record = SiteRecordManager.normalizeRecord({
        siteId,
        siteName,
        siteGenre: siteData.siteGenre || "scifi",
        siteGenreLabel: siteData.siteGenreLabel || "Sci-Fi",
        siteSceneType: siteData.siteSceneType || "augur-scifi-solar-system",
        siteSceneTypeLabel: siteData.siteSceneTypeLabel || "Solar System",
        siteSceneBiomeId: siteData.siteSceneBiomeId || null,
        siteSceneBiomeLabel: siteData.siteSceneBiomeLabel || "",
        linkedSceneId: linkedScene.id,
        linkedSceneName: linkedScene.name,
        iconId: siteData.iconId || null,
        iconSrc,
        siteColor: siteData.siteColor || "#7edcff",
        siteLabelColor: siteData.siteLabelColor || siteData.siteColor || "#7edcff",
        labelFontFamily: siteData.labelFontFamily || SiteLabelManager.FONT_FAMILY,
        siteTheme: siteData.siteTheme || "space",
        siteThemeLabel: siteData.siteThemeLabel || "Space",
        siteIconRole: siteData.siteIconRole || "system",
        siteIconRoleLabel: siteData.siteIconRoleLabel || "System",
        mapColorId: siteData.mapColorId || "blue",
        mapColorLabel: siteData.mapColorLabel || "Blue",
        siteSize: siteData.siteSize || "small",
        siteSizeLabel: siteData.siteSizeLabel || "Small",
        roomCount: siteData.roomCount || 1,
        autoSortScenes: siteData.autoSortScenes !== false,
        parentSceneId: parentScene.id,
        parentSceneName: parentScene.name,
        linkedSceneId: linkedScene.id,
        siteSceneId: linkedScene.id,
        linkedSceneName: linkedScene.name,
        iconSize: siteData.iconSize ?? 32,
        showLabel: siteData.showLabel !== false,
        labelFontSize: siteData.labelFontSize || SiteLabelManager.getDefaultFontSize(siteData.iconSize ?? 32),
        placeableDocumentName: "Tile"
    }, { parentScene });

    const placedRecord = await SiteRecordManager.upsertSceneRecord(parentScene, record);
    const note = placedRecord ? await NexusMarkerService.createSiteMarker(placedRecord, { x, y }, {
        markerKind: "site-placement",
        canOrbit: true,
        iconSize: siteData.iconSize ?? 32,
        showLabel: siteData.showLabel !== false,
        labelFontSize: siteData.labelFontSize || SiteLabelManager.getDefaultFontSize(siteData.iconSize ?? 32),
        labelFontFamily: siteData.labelFontFamily || SiteLabelManager.FONT_FAMILY,
        labelColor: siteData.siteLabelColor || siteData.siteColor || "#7edcff",
        snapToGrid: !!siteData.snapToGrid
    }) : null;

    await NexusSceneNavigationManager.setSceneNavigation(linkedScene, {
        parentSceneId: parentScene.id,
        parentSiteId: siteId,
        transitionStyle: "focus-note",
        transitionContext: {
                        placeableId: note?.id || null,
                        documentName: "Tile",
                        moduleId: MODULE_ID,
                        flagKey: "marker",
                        flagValue: siteId
                    }
                });
    await NexusSceneFolderManager.placeExistingSceneInParentFolder(parentScene, linkedScene, {
        autoSort: siteData.autoSortScenes !== false
    });
    await linkedScene.update({
        [`flags.${MODULE_ID}.siteScene`]: true,
        [`flags.${MODULE_ID}.site`]: {
            ...placedRecord,
            linkedSceneId: linkedScene.id,
            siteSceneId: linkedScene.id,
            linkedSceneName: linkedScene.name
        }
    });

    Hooks.callAll("augurNexusLineageChanged");
    return { siteId, record: placedRecord, page: null, note: note || null, scene: linkedScene };
}

export function getSiteGenerationProfile(genreId, state = {}) {
    const genre = getSiteGenre(genreId);

    return {
        genreId: genre.id,
        requiredPackId: genre.requiredPackId ?? "__default__",
        generationOverrides: genre.resolveGenerationOverrides?.(state) || {}
    };
}

