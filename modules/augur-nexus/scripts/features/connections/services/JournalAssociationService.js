import { SiteJournalManager } from "../../site/services/SiteJournalManager.js";
import { SiteRecordManager } from "../../site/services/SiteRecordManager.js";
import { PlaceJournalManager } from "./PlaceJournalManager.js";

const MODULE_ID = "augur-nexus";
const DOSSIER_FLAG = "connectionDossier";

export class JournalAssociationService {
    static FOLDER_NAME = "Augur Nexus Dossiers";
    static ENTRY_SETTING_KEY = "connectionDossierJournalEntryId";
    static #resolvers = [];
    static #defaultResolversRegistered = false;

    static registerResolver(resolver = {}) {
        if (!resolver?.id || typeof resolver.supports !== "function") return false;
        this.#resolvers = this.#resolvers.filter(candidate => candidate.id !== resolver.id);
        this.#resolvers.push(resolver);
        return true;
    }

    static async getJournalPage(target) {
        const resolver = this.#getResolver(target);
        return resolver?.getPage ? await resolver.getPage(target) : null;
    }

    static async getOrCreateJournalPage(target) {
        const resolver = this.#getResolver(target);
        if (!resolver?.getOrCreatePage) return null;
        return resolver.getOrCreatePage(target);
    }

    static async openPage(page, { edit = false } = {}) {
        if (!page?.parent) return;
        if (edit && page.sheet) {
            page.sheet.render(true);
            return;
        }

        page.parent.sheet.render(true, {
            mode: foundry.applications.sheets.journal.JournalEntrySheet.VIEW_MODES.SINGLE,
            pageId: page.id
        });
    }

    static #getResolver(target) {
        this.#ensureDefaultResolvers();
        return this.#resolvers.find(resolver => {
            try {
                return resolver.supports(target);
            } catch (_err) {
                return false;
            }
        }) || null;
    }

    static #ensureDefaultResolvers() {
        if (this.#defaultResolversRegistered) return;
        this.#defaultResolversRegistered = true;
        this.registerResolver({
            id: "augur-nexus-site",
            supports: target => target?.kind === "nexus-site",
            getPage: target => this.#getSitePage(target),
            getOrCreatePage: target => this.#getOrCreateSitePage(target)
        });
        this.registerResolver({
            id: "augur-nexus-scene",
            supports: target => target?.kind === "nexus-scene",
            getPage: target => this.#getScenePage(target),
            getOrCreatePage: target => this.#getOrCreateScenePage(target)
        });
        this.registerResolver({
            id: "augur-nexus-foundry-document",
            supports: target => target?.kind === "foundry-document" && !!target.uuid,
            getPage: target => this.#getFoundryDocumentPage(target),
            getOrCreatePage: target => this.#getOrCreateFoundryDocumentPage(target)
        });
    }

    static #getSiteRecord(target) {
        const parentScene = target?.parentSceneId ? game.scenes.get(target.parentSceneId) || null : null;
        if (!parentScene || !target?.siteId) return null;

        const record = SiteRecordManager.resolveSite({ parentScene, siteId: target.siteId });
        if (record) return record;

        return SiteRecordManager.normalizeRecord({
            ...target,
            siteName: target.siteName || target.name || "Site",
            siteIconSrc: target.siteIconSrc || target.img || "",
            linkedSceneId: target.linkedSceneId || target.siteSceneId || null,
            siteSceneId: target.siteSceneId || target.linkedSceneId || null,
            parentSceneId: parentScene.id,
            parentSceneName: parentScene.name
        }, { parentScene });
    }

    static #getSitePage(target) {
        const record = this.#getSiteRecord(target);
        if (!record) return null;
        const entryId = record.journalEntryId || game.scenes.get(record.parentSceneId)?.getFlag(MODULE_ID, "siteJournalId") || null;
        if (!entryId) return null;
        if (record.journalPageId) return game.journal.get(entryId)?.pages.get(record.journalPageId) || null;
        return SiteJournalManager.findSitePage(entryId, record.siteId);
    }

    static async #getOrCreateSitePage(target) {
        const record = this.#getSiteRecord(target);
        const parentScene = SiteRecordManager.getParentScene(record);
        if (!record?.siteId || !parentScene) return null;

        const page = await SiteJournalManager.getOrCreateSitePage(parentScene, record);
        if (!page) return null;

        const nextRecord = SiteRecordManager.normalizeRecord({
            ...record,
            journalEntryId: page.parent?.id || null,
            journalPageId: page.id || null,
            legacyJournalBacked: false
        }, { parentScene });
        const existingRecord = SiteRecordManager.getSceneRecord(parentScene, nextRecord.siteId);
        if (existingRecord) {
            await SiteRecordManager.upsertSceneRecord(parentScene, nextRecord);
            await SiteRecordManager.syncRecordToVisuals(parentScene, nextRecord);
        }
        await this.#updateLinkedSiteFlags(nextRecord, page);
        return page;
    }

    static async #updateLinkedSiteFlags(record, page) {
        const linkedSceneId = record?.siteSceneId || record?.linkedSceneId || null;
        const linkedScene = linkedSceneId ? game.scenes.get(linkedSceneId) || null : null;
        if (!linkedScene) return;

        const flags = linkedScene.getFlag(MODULE_ID, "site") || {};
        if (flags.siteId && flags.siteId !== record.siteId) return;

        await linkedScene.update({
            [`flags.${MODULE_ID}.site`]: {
                ...flags,
                siteId: record.siteId,
                siteName: record.siteName || flags.siteName || linkedScene.name,
                siteGenre: record.siteGenre || flags.siteGenre || "fantasy",
                siteGenreLabel: record.siteGenreLabel || flags.siteGenreLabel || "Fantasy",
                siteSceneType: record.siteSceneType || flags.siteSceneType || "empty",
                siteSceneTypeLabel: record.siteSceneTypeLabel || flags.siteSceneTypeLabel || "Empty Scene",
                linkedSceneId: linkedScene.id,
                siteSceneId: linkedScene.id,
                linkedSceneName: linkedScene.name,
                journalEntryId: page.parent?.id || null,
                journalPageId: page.id || null,
                parentSceneId: record.parentSceneId || flags.parentSceneId || null,
                parentSceneName: record.parentSceneName || flags.parentSceneName || ""
            }
        });
    }

    static #getScenePage(target) {
        const scene = target?.sceneId ? game.scenes.get(target.sceneId) || null : null;
        return PlaceJournalManager.getJournalPage(scene);
    }

    static async #getOrCreateScenePage(target) {
        const scene = target?.sceneId ? game.scenes.get(target.sceneId) || null : null;
        return PlaceJournalManager.getOrCreateJournalPage(scene);
    }

    static async #getFoundryDocumentPage(target) {
        const document = target?.uuid ? await fromUuid(target.uuid) : null;
        if (!document) return null;
        if (document.documentName === "JournalEntryPage") return document;
        if (document.documentName === "JournalEntry") return document.pages?.contents?.[0] || null;

        const flags = document.getFlag?.(MODULE_ID, DOSSIER_FLAG) || {};
        const entry = flags.journalEntryId ? game.journal.get(flags.journalEntryId) || null : null;
        return entry && flags.journalPageId ? entry.pages.get(flags.journalPageId) || null : null;
    }

    static async #getOrCreateFoundryDocumentPage(target) {
        const existing = await this.#getFoundryDocumentPage(target);
        if (existing) return existing;

        const document = target?.uuid ? await fromUuid(target.uuid) : null;
        if (!document || document.pack || document.compendium) return null;
        if (document.documentName === "JournalEntryPage") return document;
        if (document.documentName === "JournalEntry") {
            const [page] = await document.createEmbeddedDocuments("JournalEntryPage", [{
                name: document.name || "Notes",
                type: "text",
                sort: (document.pages.size + 1) * CONST.SORT_INTEGER_DENSITY,
                text: { content: "", format: 1 }
            }]);
            return page || null;
        }

        const entry = await this.#getOrCreateSharedEntry();
        if (!entry) return null;
        const [page] = await entry.createEmbeddedDocuments("JournalEntryPage", [{
            name: document.name || "Dossier Notes",
            type: "text",
            sort: (entry.pages.size + 1) * CONST.SORT_INTEGER_DENSITY,
            flags: {
                [MODULE_ID]: {
                    dossierPage: true,
                    targetUuid: document.uuid || target.uuid,
                    targetDocumentType: document.documentName || target.documentType || ""
                }
            },
            text: {
                content: "",
                format: 1
            }
        }]);

        if (page) {
            await document.setFlag(MODULE_ID, DOSSIER_FLAG, {
                journalEntryId: entry.id,
                journalPageId: page.id
            });
        }
        return page || null;
    }

    static #getSharedEntry() {
        const entryId = game.settings.get(MODULE_ID, this.ENTRY_SETTING_KEY) || "";
        return (entryId ? game.journal.get(entryId) : null)
            || game.journal.find(entry => entry.name === "Nexus Dossiers" && entry.folder?.name === this.FOLDER_NAME)
            || null;
    }

    static async #getOrCreateSharedEntry() {
        const existing = this.#getSharedEntry();
        if (existing) {
            const currentId = game.settings.get(MODULE_ID, this.ENTRY_SETTING_KEY) || "";
            if (currentId !== existing.id) await game.settings.set(MODULE_ID, this.ENTRY_SETTING_KEY, existing.id);
            return existing;
        }

        const folder = await this.#getOrCreateFolder();
        const entry = await JournalEntry.create({
            name: "Nexus Dossiers",
            folder: folder?.id || null,
            ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER }
        });
        await game.settings.set(MODULE_ID, this.ENTRY_SETTING_KEY, entry.id);
        return entry;
    }

    static async #getOrCreateFolder() {
        let folder = game.folders.find(folder => folder.name === this.FOLDER_NAME && folder.type === "JournalEntry");
        if (!folder) {
            folder = await Folder.create({
                name: this.FOLDER_NAME,
                type: "JournalEntry",
                color: "#20313a"
            });
        }
        return folder;
    }
}
