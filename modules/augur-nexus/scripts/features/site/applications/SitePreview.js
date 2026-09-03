import { openActionMenu, promptTextInput } from "../../../api/ui.js";
import { SiteDossierModel } from "../dossier/SiteDossierModel.js";
import { SiteDossierRefresh } from "../dossier/SiteDossierRefresh.js";
import { applySessionWindowPlacement, rememberSessionWindowPlacement } from "/modules/augur-nexus/scripts/api/window-placement.js";
import { SiteDeletionManager } from "../services/SiteDeletionManager.js";
import { SiteJournalManager } from "../services/SiteJournalManager.js";
import { SiteMapManager } from "../services/SiteMapManager.js";
import { SiteRecordManager } from "../services/SiteRecordManager.js";
import { SiteCoverPicker } from "./SiteCoverPicker.js";
import { NexusSceneOperations } from "../../nexus/services/NexusSceneOperations.js";
import { ConnectionsBoard } from "../../connections/components/ConnectionsBoard.js";
import { ConnectionTargetResolver } from "../../connections/services/ConnectionTargetResolver.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const PLACEMENT_KEY = "augur-nexus.site-dossier";

const MODULE_ID = "augur-nexus";

export class SitePreview extends HandlebarsApplicationMixin(ApplicationV2) {
    #record = null;
    #activeDossierTab = "profile";
    #connectionsBoard = null;
    #connectionsChangedHook = null;
    #lastModel = null;
    #positionInitialized = false;

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-site-preview",
        classes: ["augur-nexus", "site-preview"],
        tag: "div",
        window: {
            title: "Site Preview",
            resizable: true,
            minimizable: true
        },
        position: {
            width: 1180,
            height: 700
        },
        actions: {
            openSiteScene: SitePreview._onOpenSiteScene,
            setDossierTab: SitePreview._onSetDossierTab,
            openJournalPage: SitePreview._onOpenJournalPage,
            createJournalPage: SitePreview._onCreateJournalPage,
            openSiteActions: SitePreview._onOpenSiteActions
        }
    };

    static PARTS = {
        content: {
            template: "modules/augur-nexus/templates/site/site-preview.hbs",
            templates: [
                "modules/augur-nexus/templates/connections/connections-board.hbs",
                "modules/augur-nexus/templates/site/site-cover-picker.hbs"
            ]
        }
    };

    static show({ record = null, parentScene = canvas.scene, siteId = null, placeable = null, page = null } = {}) {
        const resolved = SiteRecordManager.resolveSite({ siteRecord: record, parentScene, siteId, placeable, page });
        if (!resolved) return null;
        const app = new this({ record: resolved });
        app.render(true, { focus: true });
        return app;
    }

    constructor({ record } = {}, options = {}) {
        super(options);
        this.#record = SiteRecordManager.normalizeRecord(record);
        SiteDossierRefresh.watch(this);
        this.#connectionsChangedHook = () => this.refreshSiteDossier();
        Hooks.on("augurNexusConnectionsChanged", this.#connectionsChangedHook);
    }

    async _prepareContext() {
        const latestRecord = SiteRecordManager.resolveSite({
            parentScene: SiteRecordManager.getParentScene(this.#record),
            siteId: this.#record?.siteId || null
        }) || this.#record;
        this.#record = SiteRecordManager.normalizeRecord(latestRecord);
        const model = await SiteDossierModel.build({
            record: this.#record,
            activeTab: this.#activeDossierTab,
            isGM: game.user.isGM
        });
        const target = ConnectionTargetResolver.fromSiteRecord(this.#record);
        if (!this.#connectionsBoard) this.#connectionsBoard = new ConnectionsBoard({ target, isGM: game.user.isGM });
        else this.#connectionsBoard.setTarget(target);
        model.connections.board = this.#connectionsBoard.getContext();
        this.#lastModel = model;
        return model;
    }

    _onRender(context, options) {
        super._onRender(context, options);
        this.#connectionsBoard?.activateListeners(this.element, this);
        if (!this.#positionInitialized) {
            applySessionWindowPlacement(this, PLACEMENT_KEY, { fallback: "center" });
            this.#positionInitialized = true;
        }
    }

    async close(options) {
        rememberSessionWindowPlacement(this, PLACEMENT_KEY);
        SiteDossierRefresh.unwatch(this);
        if (this.#connectionsChangedHook) Hooks.off("augurNexusConnectionsChanged", this.#connectionsChangedHook);
        return super.close(options);
    }

    matchesSiteJournal({ entryId, pageId } = {}) {
        const journal = this.#lastModel?.journal || null;
        if (!journal?.entryId) return false;
        if (pageId) return journal.pageId === pageId;
        return journal.entryId === entryId;
    }

    refreshSiteDossier() {
        if (this.rendered === false) return;
        this.render({ parts: ["content"] });
    }

    static async _onOpenSiteScene() {
        const app = this;
        if (!game.user.isGM || !app.#record?.siteId) return;

        try {
            await app.close();
            await SiteMapManager.openSite({
                siteRecord: app.#record,
                parentSceneId: app.#record.parentSceneId,
                siteId: app.#record.siteId
            });
        } catch (err) {
            console.error(err);
            ui.notifications.error("Failed to open the selected site.");
        }
    }

    static async _onSetDossierTab(event, target) {
        const app = this;
        app.#activeDossierTab = target?.dataset?.tab === "journal" ? "journal" : "profile";
        app.render({ parts: ["content"] });
    }

    static async _onOpenJournalPage() {
        const app = this;
        const page = SiteDossierModel.getJournalPage(app.#record);
        if (!page?.parent) {
            ui.notifications.warn("No journal notes exist for this site.");
            return;
        }

        app.#openJournalPage(page, { edit: game.user.isGM });
    }

    static async _onCreateJournalPage() {
        const app = this;
        const page = await app.#getOrCreateJournalPage();
        if (!page) return;

        app.#activeDossierTab = "journal";
        app.render({ parts: ["content"] });
        app.#openJournalPage(page, { edit: true });
    }

    static async _onOpenSiteActions(event, target) {
        const app = this;
        if (!game.user.isGM || !app.#record?.siteId) return;

        openActionMenu({
            anchor: target,
            className: "site-preview-actions-menu",
            items: [
                {
                    id: "rename-site",
                    label: "Rename Site",
                    icon: "fas fa-pen",
                    onSelect: () => app.#renameSite()
                },
                {
                    id: "open-journal",
                    label: "Edit Journal",
                    icon: "fas fa-book-open",
                    onSelect: () => app.#editJournal()
                },
                {
                    id: "change-cover",
                    label: "Change Cover Image",
                    icon: "fas fa-image",
                    onSelect: () => app.#changeCoverImage(target)
                },
                ...(app.#record.coverImageSrc ? [{
                    id: "clear-cover",
                    label: "Clear Cover Image",
                    icon: "fas fa-rotate-left",
                    onSelect: () => app.#setCoverImage("")
                }] : []),
                {
                    id: "delete-site",
                    label: "Delete Site",
                    status: "Permanent",
                    icon: "fas fa-skull-crossbones",
                    danger: true,
                    className: "permanent-danger",
                    onSelect: () => app.#deleteSite()
                }
            ]
        });
    }

    async #editJournal() {
        const page = await this.#getOrCreateJournalPage();
        if (!page) return;

        this.#activeDossierTab = "journal";
        this.render({ parts: ["content"] });
        this.#openJournalPage(page, { edit: true });
    }

    async #getOrCreateJournalPage() {
        if (!game.user.isGM) return null;
        const parentScene = SiteRecordManager.getParentScene(this.#record);
        if (!parentScene || !this.#record?.siteId) return null;

        const page = await SiteJournalManager.getOrCreateSitePage(parentScene, this.#record);
        if (!page) {
            ui.notifications.warn("Could not create journal notes for this site.");
            return null;
        }

        this.#record = SiteRecordManager.normalizeRecord({
            ...this.#record,
            journalEntryId: page.parent?.id || null,
            journalPageId: page.id || null,
            legacyJournalBacked: false
        }, { parentScene });
        await SiteRecordManager.upsertSceneRecord(parentScene, this.#record);
        await SiteRecordManager.syncRecordToVisuals(parentScene, this.#record);
        return page;
    }

    #openJournalPage(page, { edit = false } = {}) {
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

    async #renameSite() {
        const nextName = await promptTextInput({
            title: "Rename Site",
            label: "Site Name",
            value: this.#record?.siteName || "",
            confirmLabel: "Rename"
        });
        if (!nextName) return;

        const parentScene = SiteRecordManager.getParentScene(this.#record);
        if (!parentScene) return;

        const linkedScene = this.#record.linkedSceneId ? game.scenes.get(this.#record.linkedSceneId) : null;
        if (linkedScene && linkedScene.name !== nextName) {
            await NexusSceneOperations.renameScene(linkedScene, nextName);
        }

        this.#record = SiteRecordManager.normalizeRecord({
            ...this.#record,
            siteName: nextName,
            linkedSceneName: linkedScene?.name || this.#record.linkedSceneName || ""
        }, { parentScene });
        await SiteRecordManager.upsertSceneRecord(parentScene, this.#record);
        await SiteRecordManager.syncRecordToVisuals(parentScene, this.#record);
        Hooks.callAll("augurNexusLineageChanged");
        this.render({ parts: ["content"] });
    }

    #changeCoverImage(target) {
        if (!game.user.isGM) return;
        SiteCoverPicker.show({
            current: this.#record.coverImageSrc || "",
            onSelect: path => this.#setCoverImage(path || "")
        });
    }

    async #setCoverImage(path) {
        if (!game.user.isGM) return;
        const parentScene = SiteRecordManager.getParentScene(this.#record);
        if (!parentScene) return;

        this.#record = SiteRecordManager.normalizeRecord({
            ...this.#record,
            coverImageSrc: path || ""
        }, { parentScene });
        await SiteRecordManager.upsertSceneRecord(parentScene, this.#record);
        await SiteRecordManager.syncRecordToVisuals(parentScene, this.#record);
        Hooks.callAll("augurNexusLineageChanged");
        this.render({ parts: ["content"] });
    }

    async #deleteSite() {
        const parentScene = SiteRecordManager.getParentScene(this.#record);

        await this.close();
        await SiteDeletionManager.deleteSiteRecord(this.#record, { parentScene });
    }

}
