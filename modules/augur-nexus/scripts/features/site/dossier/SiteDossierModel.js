import { SiteJournalManager } from "../services/SiteJournalManager.js";
import { SiteRecordManager } from "../services/SiteRecordManager.js";
import { SiteCoverCatalog } from "../services/SiteCoverCatalog.js";
import { ConnectionSummary } from "../../connections/services/ConnectionSummary.js";
import { ConnectionTargetResolver } from "../../connections/services/ConnectionTargetResolver.js";

const MODULE_ID = "augur-nexus";

export class SiteDossierModel {
    static async build({ record, activeTab = "profile", isGM = game.user.isGM } = {}) {
        const site = SiteRecordManager.normalizeRecord(record);
        if (!site?.siteId) return null;

        const page = this.getJournalPage(site);
        const content = await this.enrichJournalContent(page);
        const linkedScene = site.linkedSceneId ? game.scenes.get(site.linkedSceneId) || null : null;
        const tab = activeTab === "journal" ? "journal" : "profile";

        const cover = this.#buildCover(site, linkedScene);
        const connectionTarget = ConnectionTargetResolver.fromSiteRecord(site);

        return {
            site: {
                ...site,
                linkedSceneName: linkedScene?.name || site.linkedSceneName || "",
                hasLinkedScene: !!linkedScene,
                openSceneLabel: linkedScene ? "Open Site Scene" : "Create Site Scene",
                cover,
                rows: this.#buildRows(site, linkedScene)
            },
            connections: {
                target: connectionTarget,
                summary: ConnectionSummary.build(connectionTarget)
            },
            backgroundStyle: cover?.src ? `background-image: url('${cover.src}');` : "",
            dossier: {
                activeTab: tab,
                isProfileTab: tab === "profile",
                isJournalTab: tab === "journal"
            },
            journal: {
                hasPage: !!page,
                entryId: page?.parent?.id || "",
                pageId: page?.id || "",
                name: page?.name || "",
                content,
                hasContent: !!String(page?.text?.content || "").trim()
            },
            isGM
        };
    }

    static getJournalPage(site) {
        if (!site?.journalEntryId && !site?.parentSceneId) return null;
        const entryId = site.journalEntryId || game.scenes.get(site.parentSceneId)?.getFlag(MODULE_ID, "siteJournalId") || null;
        if (!entryId) return null;
        if (site.journalPageId) return game.journal.get(entryId)?.pages.get(site.journalPageId) || null;
        return SiteJournalManager.findSitePage(entryId, site.siteId);
    }

    static async enrichJournalContent(page) {
        const content = page?.text?.content || "";
        if (!String(content).trim()) return "";
        try {
            return foundry.applications.ux.TextEditor.implementation.enrichHTML(content, {
                relativeTo: page,
                secrets: page.isOwner
            });
        } catch (err) {
            console.warn("Augur: Nexus | Failed to enrich site journal content.", err);
            return content;
        }
    }

    static #buildRows(site, linkedScene) {
        return [
            { label: "Genre", value: site.siteGenreLabel },
            { label: "Scene Type", value: site.siteSceneTypeLabel },
            ...(site.siteScenePresetLabel ? [{ label: "Preset", value: site.siteScenePresetLabel }] : []),
            ...(site.siteSceneBiomeLabel ? [{ label: site.siteSceneBiomeFieldLabel || "Biome", value: site.siteSceneBiomeLabel }] : []),
            ...(site.siteSceneImageName ? [{ label: "Image", value: site.siteSceneImageName }] : []),
            ...(site.siteThemeLabel ? [{ label: "Theme", value: site.siteThemeLabel }] : []),
            ...(site.mapColorLabel ? [{ label: "Map Color", value: site.mapColorLabel }] : []),
            ...(site.siteSizeLabel ? [{ label: "Size", value: site.siteSizeLabel }] : []),
            ...(site.roomCount ? [{ label: "Rooms", value: String(site.roomCount) }] : []),
            { label: "Parent Scene", value: site.parentSceneName },
            ...(linkedScene || site.linkedSceneName ? [{ label: "Linked Scene", value: linkedScene?.name || site.linkedSceneName }] : [])
        ].filter(row => row.value);
    }

    static #buildCover(site, linkedScene) {
        const src = site.coverImageSrc
            || linkedScene?.thumb
            || site.siteSceneImageSrc
            || this.#getAbstractCover(site.siteId);

        return {
            src,
            isCustom: !!site.coverImageSrc,
            sourceLabel: site.coverImageSrc
                ? "Custom Cover"
                : linkedScene?.thumb
                    ? "Scene Thumbnail"
                    : site.siteSceneImageSrc
                        ? "Scene Image"
                        : "Abstract Cover"
        };
    }

    static #getAbstractCover(siteId = "") {
        return SiteCoverCatalog.getAbstractCover(siteId || "site");
    }
}
