// Scene linkage for Sites. Nexus navigation owns scene transitions and back behavior.

import { Log } from "../../../support/utils/Logger.js";
import { SiteJournalManager } from "./SiteJournalManager.js";
import { SiteRecordManager } from "./SiteRecordManager.js";
import { SitePanel } from "../applications/SitePanel.js";
import { getSiteSceneType, normalizeResolvedSiteScene } from "../registry/SiteSceneTypeRegistry.js";
import { NexusSceneFolderManager } from "../../nexus/services/NexusSceneFolderManager.js";
import { NexusSceneNavigationManager } from "../../nexus/services/NexusSceneNavigationManager.js";
import { NexusSceneTransitionEffects } from "../../nexus/services/NexusSceneTransitionEffects.js";
import { NexusPlayerSceneAccess } from "../../nexus/services/NexusPlayerSceneAccess.js";
import { NexusMarkerService } from "../../markers/services/NexusMarkerService.js";

const MODULE_ID = "augur-nexus";

export class SiteMapManager {
    static ENRICHER_ID = "augur-nexus-open-site-map";
    static OPEN_MAP_PATTERN = /@AugurNexusOpenSiteMap\[([^\]]+)\]\{([^}]+)\}/g;

    static registerNoteHooks() {
        Hooks.on("refreshNote", note => {
            const flags = note?.document?.flags?.[MODULE_ID] || {};
            if (!flags.site || !note.controlIcon) return;

            note.controlIcon.bg.alpha = 0;
            note.controlIcon.border.alpha = 0;
            if (note.controlIcon.icon) note.controlIcon.icon.alpha = 1;
        });
    }

    static registerJournalEnricher() {
        const enrichers = CONFIG.TextEditor.enrichers;
        if (enrichers.some(entry => entry.id === this.ENRICHER_ID)) return;

        enrichers.push({
            id: this.ENRICHER_ID,
            pattern: this.OPEN_MAP_PATTERN,
            enricher: this._enrichOpenMap.bind(this),
            onRender: this._onRenderOpenMap.bind(this)
        });
    }

    static async _enrichOpenMap(match, options) {
        const [, siteId, label] = match;
        const pageUuid = options.relativeTo?.uuid || "";
        const wrapper = document.createElement("span");
        wrapper.classList.add("augur-nexus-open-site-map");

        const button = document.createElement("button");
        button.type = "button";
        button.dataset.augurNexusOpenSiteMap = "true";
        button.dataset.siteId = siteId;
        button.dataset.pageUuid = pageUuid;
        button.textContent = label || "Open Map";
        button.style.marginTop = "10px";
        button.style.padding = "6px 10px";
        button.style.border = "1px solid rgba(255,255,255,0.2)";
        button.style.borderRadius = "6px";
        button.style.background = "rgba(36, 24, 10, 0.9)";
        button.style.color = "#f4e4c1";
        button.style.cursor = "pointer";

        wrapper.appendChild(button);
        return wrapper;
    }

    static _onRenderOpenMap(element) {
        const button = element.querySelector("button[data-augur-nexus-open-site-map]");
        if (!button || button.dataset.bound === "true") return;
        button.dataset.bound = "true";
        button.addEventListener("click", async event => {
            event.preventDefault();
            event.stopPropagation();

            if (!game.user.isGM) {
                ui.notifications.warn("Only the GM can create or open site scenes.");
                return;
            }

            const pageUuid = button.dataset.pageUuid;
            if (!pageUuid) return;

            const page = await fromUuid(pageUuid);
            if (!page) {
                ui.notifications.error("Could not resolve the site journal page.");
                return;
            }

            page.parent?.sheet?.close();

            const originalLabel = button.textContent;
            button.disabled = true;
            button.textContent = "Opening...";
            try {
                await this.openSite({ page });
            } catch (err) {
                Log.error("Failed to open site map.", err);
                ui.notifications.error("Failed to open the site map.");
            } finally {
                button.disabled = false;
                button.textContent = originalLabel;
            }
        });
    }

    static async openSite({ page = null, journalEntryId = null, pageId = null, parentSceneId = null, siteId = null, siteRecord = null, placeable = null } = {}) {
        const parentScene = parentSceneId ? game.scenes.get(parentSceneId) || null : null;
        const record = SiteRecordManager.resolveSite({ page, journalEntryId, pageId, parentScene, siteId, siteRecord, placeable });
        if (!record) throw new Error("Could not resolve the site record.");
        return this.openFromSiteRecord(record);
    }

    static async openSiteShortcut({ parentScene = canvas.scene, placeable = null } = {}) {
        const record = SiteRecordManager.resolveSite({ parentScene, placeable });
        if (!record?.siteId) throw new Error("Could not resolve the site record.");

        if (game.user.isGM) {
            return this.openSite({
                siteRecord: record,
                parentSceneId: record.parentSceneId,
                siteId: record.siteId,
                placeable
            });
        }

        const sceneId = record.siteSceneId || record.linkedSceneId || null;
        const scene = sceneId ? game.scenes.get(sceneId) || null : null;
        if (!scene || !NexusPlayerSceneAccess.canUserViewScene(scene)) {
            ui.notifications.warn("This site scene is not currently available to view.");
            return null;
        }

        await scene.view();
        return scene;
    }

    static async openFromJournalPage(page) {
        const record = SiteRecordManager.fromPage(page);
        if (!record) throw new Error("Journal page is not a valid Augur Nexus site page.");
        return this.openFromSiteRecord(record, { page });
    }

    static async openFromSiteRecord(record, { page = null } = {}) {
        SitePanel.dismiss();

        const siteRecord = SiteRecordManager.normalizeRecord(record);
        if (!siteRecord?.siteId) throw new Error("Site record is missing a site id.");

        const sceneType = getSiteSceneType(siteRecord.siteSceneType || "empty");
        if (!sceneType) throw new Error(`Unknown site scene type: ${siteRecord.siteSceneType}`);

        const autoSortScenes = siteRecord.autoSortScenes !== false;
        const existing = this._getLinkedScene(siteRecord.siteSceneId || siteRecord.linkedSceneId);
        const parentScene = game.scenes.get(siteRecord.parentSceneId);
        if (!parentScene) throw new Error("No parent scene found for this site.");

        if (sceneType.id === "existing") {
            if (!existing) {
                ui.notifications.error("This site does not have a valid linked scene.");
                throw new Error("The linked scene for this site could not be found.");
            }

            await NexusSceneFolderManager.placeExistingSceneInParentFolder(parentScene, existing, { autoSort: autoSortScenes });
            await this._prepareResolvedScene(existing, parentScene, siteRecord, sceneType);
            const persisted = await this._persistSceneLink(siteRecord, existing.id);
            return this._enterScene(existing, { ...persisted, siteSceneId: existing.id });
        }

        if (existing) {
            await NexusSceneFolderManager.placeExistingSceneInParentFolder(parentScene, existing, { autoSort: autoSortScenes });
            return this._enterScene(existing, { ...siteRecord, siteSceneId: existing.id });
        }

        let siteScene;
        let afterEnter = null;
        if (typeof sceneType.resolveScene === "function") {
            const pageAdapter = page || SiteRecordManager.createPageAdapter(siteRecord);
            const resolved = normalizeResolvedSiteScene(await sceneType.resolveScene({
                existingScene: existing,
                parentScene,
                page: pageAdapter,
                pageFlags: siteRecord,
                siteRecord,
                manager: this,
                moduleId: MODULE_ID
            }));
            if (!resolved?.scene) throw new Error(`Scene type '${sceneType.id}' did not return a scene.`);
            siteScene = resolved.scene;
            afterEnter = resolved.afterEnter;
            await NexusSceneFolderManager.placeExistingSceneInParentFolder(parentScene, siteScene, { autoSort: autoSortScenes });
            await this._prepareResolvedScene(siteScene, parentScene, siteRecord, sceneType);
        } else {
            siteScene = await this._createSiteScene(parentScene, siteRecord, sceneType);
        }

        const persisted = await this._persistSceneLink(siteRecord, siteScene.id);
        await this._enterScene(siteScene, { ...persisted, siteSceneId: siteScene.id });
        if (afterEnter) {
            await afterEnter(siteScene, {
                parentScene,
                page: page || SiteRecordManager.createPageAdapter(persisted),
                pageFlags: persisted,
                siteRecord: persisted,
                sceneType,
                manager: this,
                moduleId: MODULE_ID
            });
        }
        return siteScene;
    }

    static _getLinkedScene(sceneId) {
        if (!sceneId) return null;
        return game.scenes.get(sceneId) || null;
    }

    static _resolveSitePage({ journalEntryId = null, pageId = null, parentSceneId = null, siteId = null } = {}) {
        if (journalEntryId && pageId) {
            return game.journal.get(journalEntryId)?.pages.get(pageId) || null;
        }

        if (parentSceneId && siteId) {
            const parentScene = game.scenes.get(parentSceneId);
            const resolvedJournalEntryId = parentScene?.getFlag(MODULE_ID, "siteJournalId") || null;
            if (!resolvedJournalEntryId) return null;
            return SiteJournalManager.findSitePage(resolvedJournalEntryId, siteId);
        }

        return null;
    }

    static async _enterScene(targetScene, siteFlags) {
        const parentScene = siteFlags.parentSceneId ? game.scenes.get(siteFlags.parentSceneId) : null;
        const visibleSiteNote = await this._getVisibleSiteNote(siteFlags.siteId, parentScene);
        await NexusSceneTransitionEffects.transitionToScene(targetScene, {
            fromScene: parentScene,
            focusPlaceable: visibleSiteNote
        });
        return targetScene;
    }

    static async _getVisibleSiteNote(siteId, scene) {
        if (!siteId || !scene || canvas.scene?.id !== scene.id) return null;
        const marker = await NexusMarkerService.findMarkerForTarget({
            kind: "nexus-site",
            parentSceneId: scene.id,
            siteId
        }, { scene });
        if (marker) {
            return canvas.tiles?.placeables?.find(tile => tile.document.id === marker.id)
                || marker;
        }
        return canvas.tiles?.placeables?.find(tile => tile.document.flags?.[MODULE_ID]?.siteId === siteId)
            || canvas.notes?.placeables?.find(note => note.document.flags?.[MODULE_ID]?.siteId === siteId)
            || null;
    }

    static async _createSiteScene(parentScene, record, sceneType) {
        const siteRecord = SiteRecordManager.normalizeRecord(record, { parentScene });
        const createData = await NexusSceneFolderManager.getChildSceneCreateData(parentScene, {
            autoSort: siteRecord.autoSortScenes !== false
        });
        const scene = await Scene.create({
            name: siteRecord.siteName,
            folder: createData.folderId || null,
            sort: createData.sort
        });
        await this._prepareResolvedScene(scene, parentScene, siteRecord, sceneType);
        return scene;
    }

    static async _prepareResolvedScene(scene, parentScene, record, sceneType) {
        const siteRecord = SiteRecordManager.normalizeRecord(record, { parentScene });
        const parentPlaceable = await NexusMarkerService.findMarkerForTarget({
            kind: "nexus-site",
            parentSceneId: parentScene.id,
            siteId: siteRecord.siteId
        }, { scene: parentScene });
        const parentDocument = parentPlaceable?.document || parentPlaceable || null;

        await NexusSceneNavigationManager.setSceneNavigation(scene, {
            parentSceneId: parentScene.id,
            parentSiteId: siteRecord.siteId || null,
            transitionStyle: "focus-note",
            transitionContext: {
                noteId: parentDocument?.documentName === "Note" ? parentDocument.id : null,
                placeableId: parentDocument?.id || null,
                documentName: parentDocument?.documentName || "Tile",
                moduleId: MODULE_ID,
                flagKey: parentDocument?.flags?.[MODULE_ID]?.marker ? "marker" : "siteId",
                flagValue: siteRecord.siteId || null
            }
        });

        const nextRecord = SiteRecordManager.normalizeRecord({
            ...siteRecord,
            linkedSceneId: scene.id,
            siteSceneId: scene.id,
            linkedSceneName: scene.name
        }, { parentScene });

        await scene.update({
            flags: {
                [MODULE_ID]: {
                    siteScene: true,
                    site: {
                        ...nextRecord,
                        siteSceneType: sceneType?.id || nextRecord.siteSceneType || "empty",
                        siteSceneTypeLabel: sceneType?.label || nextRecord.siteSceneTypeLabel || "Empty Scene"
                    }
                }
            }
        });
    }

    static async _persistSceneLink(record, sceneId) {
        const siteRecord = SiteRecordManager.normalizeRecord(record);
        const linkedScene = sceneId ? game.scenes.get(sceneId) : null;
        const persisted = await SiteRecordManager.persistLinkedScene(siteRecord, sceneId, linkedScene?.name || "");
        Hooks.callAll("augurNexusLineageChanged");
        return persisted || siteRecord;
    }

    static _getSiteNoteDocument(scene, siteId) {
        if (!scene || !siteId) return null;
        return scene.notes?.contents?.find(note => note.flags?.[MODULE_ID]?.siteId === siteId)
            || scene.tiles?.contents?.find(tile => tile.flags?.[MODULE_ID]?.siteId === siteId)
            || null;
    }
}


