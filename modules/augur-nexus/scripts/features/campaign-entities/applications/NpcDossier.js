import { openActionMenu, promptTextInput } from "../../../api/ui.js";
import { deleteNpc, getNpc, updateNpc } from "../../../api/npcs.js";
import { ConnectionsBoard } from "../../connections/components/ConnectionsBoard.js";
import { ConnectionTargetResolver } from "../../connections/services/ConnectionTargetResolver.js";
import { SiteCoverPicker } from "../../site/applications/SiteCoverPicker.js";
import { SiteCoverCatalog } from "../../site/services/SiteCoverCatalog.js";
import { PlayerNpcVisibilityDialog } from "../../nexus/applications/PlayerNpcVisibilityDialog.js";
import { PlayerVisibilityInfoPanel } from "../../nexus/applications/PlayerVisibilityInfoPanel.js";
import { DossierTabPreference } from "../../nexus/services/DossierTabPreference.js";
import { applySessionWindowPlacement, rememberSessionWindowPlacement } from "/modules/augur-nexus/scripts/api/window-placement.js";
import { NpcEntityModel } from "../models/NpcEntityModel.js";
import { NpcProfileViewModel } from "../models/NpcProfileViewModel.js";
import { CampaignEntityDossierRefresh } from "../services/CampaignEntityDossierRefresh.js";
import { CampaignEntityActorBridge } from "../services/CampaignEntityActorBridge.js";
import { CampaignEntityJournalStore } from "../services/CampaignEntityJournalStore.js";
import { CampaignEntityVisibilityManager } from "../services/CampaignEntityVisibilityManager.js";
import { NpcVisibilityManager } from "../services/NpcVisibilityManager.js";
import { NpcDataEditor } from "./NpcDataEditor.js";
import { NpcPortraitPicker } from "./NpcPortraitPicker.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const PLACEMENT_KEY = "augur-nexus.npc-dossier";

export class NpcDossier extends HandlebarsApplicationMixin(ApplicationV2) {
    #npcId = "";
    #activeTab = "profile";
    #connectionsBoard = null;
    #connectionsChangedHook = null;
    #entitiesChangedHook = null;
    #lastModel = null;
    #positionInitialized = false;

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-npc-dossier",
        classes: ["augur-nexus", "npc-dossier"],
        tag: "div",
        window: {
            title: "Person",
            resizable: true,
            minimizable: true
        },
        position: {
            width: 700,
            height: 620
        }
    };

    static PARTS = {
        content: {
            template: "modules/augur-nexus/templates/campaign-entities/npc-dossier.hbs",
            templates: [
                "modules/augur-nexus/templates/connections/connections-board.hbs",
                "modules/augur-nexus/templates/campaign-entities/npc-profile-panel.hbs",
                "modules/augur-nexus/templates/site/site-cover-picker.hbs"
            ]
        }
    };

    get title() {
        return this.#lastModel?.npc?.name || "Person";
    }

    static show({ npcId } = {}) {
        if (!npcId) return null;
        const entity = getNpc(npcId);
        if (entity && !NpcVisibilityManager.canUserSeeNpc(entity)) {
            ui.notifications.warn("That person is not currently visible.");
            return null;
        }
        const app = new this({ npcId });
        app.render(true, { focus: true });
        return app;
    }

    constructor({ npcId } = {}, options = {}) {
        super(options);
        this.#npcId = npcId || "";
        this.#activeTab = DossierTabPreference.getDefaultTab(getNpc(this.#npcId));
        this.#connectionsChangedHook = () => this.refresh();
        this.#entitiesChangedHook = event => {
            if (!event?.entity || event.entity.id === this.#npcId) this.refresh();
        };
        Hooks.on("augurNexusConnectionsChanged", this.#connectionsChangedHook);
        Hooks.on("augurNexusCampaignEntitiesChanged", this.#entitiesChangedHook);
        CampaignEntityDossierRefresh.watch(this);
    }

    async _prepareContext() {
        const entity = getNpc(this.#npcId);
        if (entity && !NpcVisibilityManager.canUserSeeNpc(entity)) {
            return {
                missing: true,
                npc: { name: "Hidden Person" },
                connections: { board: null }
            };
        }
        if (!entity) {
            return {
                missing: true,
                npc: { name: "Missing Person" },
                connections: { board: null }
            };
        }

        const target = ConnectionTargetResolver.fromCampaignEntity(entity);
        if (!this.#connectionsBoard) this.#connectionsBoard = new ConnectionsBoard({ target, isGM: game.user.isGM });
        else this.#connectionsBoard.setTarget(target);

        const page = CampaignEntityJournalStore.getJournalPage(entity.id);
        const content = await this.#enrichJournalContent(page);
        const linkedActor = await this.#getLinkedActorContext(entity);
        const model = {
            npc: {
                id: entity.id,
                name: NpcEntityModel.getName(entity),
                profile: NpcProfileViewModel.fromEntity(entity, {
                    showTabs: true,
                    showActions: game.user.isGM,
                    activeTab: this.#activeTab,
                    linkedActor,
                    showBody: this.#activeTab === "profile"
                })
            },
            dossier: {
                isProfileTab: this.#activeTab === "profile",
                isJournalTab: this.#activeTab === "journal"
            },
            journal: {
                hasPage: !!page,
                entryId: page?.parent?.id || entity.journalEntryId || "",
                pageId: page?.id || "",
                content,
                hasContent: !!String(page?.text?.content || "").trim()
            },
            connections: {
                board: this.#connectionsBoard.getContext()
            },
            backgroundStyle: this.#buildBackgroundStyle(entity),
            isGM: game.user.isGM
        };
        this.#lastModel = model;
        return model;
    }

    _attachPartListeners(partId, htmlElement, options) {
        if (super._attachPartListeners) super._attachPartListeners(partId, htmlElement, options);
        const element = htmlElement instanceof HTMLElement ? htmlElement : htmlElement?.[0];
        if (!element) return;

        this.#activateActionListeners(element);
    }

    #activateActionListeners(element) {
        const root = element instanceof HTMLElement ? element : element?.[0] || element;
        root?.querySelectorAll("[data-action='setNpcDossierTab']").forEach(button => {
            if (button.dataset.npcDossierBound) return;
            button.dataset.npcDossierBound = "true";
            button.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                NpcDossier._onSetDossierTab.call(this, event, event.currentTarget);
            });
        });

        const actionsButton = root?.querySelector("[data-action='openNpcActions']");
        if (actionsButton && !actionsButton.dataset.npcDossierBound) actionsButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            NpcDossier._onOpenNpcActions.call(this, event, event.currentTarget);
        });
        if (actionsButton) actionsButton.dataset.npcDossierBound = "true";

        const createJournalButton = root?.querySelector("[data-action='createNpcJournal']");
        if (createJournalButton && !createJournalButton.dataset.npcDossierBound) createJournalButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            NpcDossier._onCreateNpcJournal.call(this, event, event.currentTarget);
        });
        if (createJournalButton) createJournalButton.dataset.npcDossierBound = "true";

        const openJournalButton = root?.querySelector("[data-action='openNpcJournal']");
        if (openJournalButton && !openJournalButton.dataset.npcDossierBound) openJournalButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            NpcDossier._onOpenNpcJournal.call(this, event, event.currentTarget);
        });
        if (openJournalButton) openJournalButton.dataset.npcDossierBound = "true";

        const openLinkedActorButton = root?.querySelector("[data-action='openNpcLinkedActor']");
        if (openLinkedActorButton && !openLinkedActorButton.dataset.npcDossierBound) openLinkedActorButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            void this.#openLinkedActor();
        });
        if (openLinkedActorButton) openLinkedActorButton.dataset.npcDossierBound = "true";

        const linkActorButton = root?.querySelector("[data-action='linkNpcActor']");
        if (linkActorButton && !linkActorButton.dataset.npcDossierBound) linkActorButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            void this.#linkActor();
        });
        if (linkActorButton) linkActorButton.dataset.npcDossierBound = "true";
    }

    _onRender(context, options) {
        super._onRender(context, options);
        if (this.window?.title) this.window.title.textContent = this.title;
        this.#activateActionListeners(this.element);
        this.#connectionsBoard?.activateListeners(this.element, this);
        if (!this.#positionInitialized) {
            applySessionWindowPlacement(this, PLACEMENT_KEY, { fallback: "center" });
            this.#positionInitialized = true;
        }
    }

    async close(options) {
        rememberSessionWindowPlacement(this, PLACEMENT_KEY);
        CampaignEntityDossierRefresh.unwatch(this);
        if (this.#connectionsChangedHook) Hooks.off("augurNexusConnectionsChanged", this.#connectionsChangedHook);
        if (this.#entitiesChangedHook) Hooks.off("augurNexusCampaignEntitiesChanged", this.#entitiesChangedHook);
        return super.close(options);
    }

    matchesCampaignEntityJournal({ entryId, pageId } = {}) {
        const journal = this.#lastModel?.journal || null;
        if (!journal?.entryId) return false;
        if (pageId) return journal.pageId === pageId;
        return journal.entryId === entryId;
    }

    refreshCampaignEntityDossier() {
        this.refresh();
    }

    refresh() {
        if (this.rendered === false) return;
        this.render({ parts: ["content"] });
    }

    static async _onSetDossierTab(_event, target) {
        this.#activeTab = target?.dataset?.tab === "journal" ? "journal" : "profile";
        this.render({ parts: ["content"] });
    }

    static async _onOpenNpcActions(_event, target) {
        const app = this;
        if (!game.user.isGM) return;
        const entity = getNpc(app.#npcId);
        if (!entity) return;
        openActionMenu({
            anchor: target,
            className: "npc-dossier-actions-menu",
            items: [
                {
                    id: "rename",
                    label: "Rename",
                    icon: "fas fa-pen",
                    onSelect: () => app.#renameNpc()
                },
                {
                    id: "edit-npc",
                    label: "Edit Person",
                    icon: "fas fa-sliders",
                    onSelect: () => app.#editNpc()
                },
                {
                    id: "change-portrait",
                    label: "Change Portrait",
                    icon: "fas fa-user-circle",
                    onSelect: () => app.#changePortrait()
                },
                {
                    id: "open-journal",
                    label: "Edit Journal",
                    icon: "fas fa-book-open",
                    onSelect: () => app.#editJournal()
                },
                {
                    id: "linked-actor",
                    label: entity.projections?.actorUuid ? "Linked Actor" : "Link Actor",
                    icon: "fas fa-user-circle",
                    onSelect: () => app.#manageActorLink()
                },
                {
                    id: "default-dossier-tab",
                    label: `Default Tab: ${DossierTabPreference.getTabLabel(DossierTabPreference.getDefaultTab(entity))}`,
                    icon: "fas fa-table-columns",
                    onSelect: () => app.#openDefaultDossierTabMenu(target)
                },
                {
                    id: "change-cover",
                    label: "Change Cover Image",
                    icon: "fas fa-image",
                    onSelect: () => app.#changeCoverImage()
                },
                ...(NpcEntityModel.getCoverImage(getNpc(app.#npcId)) ? [{
                    id: "clear-cover",
                    label: "Clear Cover Image",
                    icon: "fas fa-rotate-left",
                    onSelect: () => app.#setCoverImage("")
                }] : []),
                {
                    id: "player-npc-visibility",
                    label: `Visible To Players: ${CampaignEntityVisibilityManager.getPlayerVisibilityLabel(entity)}`,
                    icon: CampaignEntityVisibilityManager.getPlayerVisibilityIcon(entity),
                    onSelect: () => app.#openNpcVisibilityMenu(target)
                },
                {
                    id: "delete",
                    label: "Delete Person",
                    status: "Permanent",
                    icon: "fas fa-skull-crossbones",
                    danger: true,
                    className: "permanent-danger",
                    onSelect: () => app.#deleteNpc()
                }
            ]
        });
    }

    #openDefaultDossierTabMenu(anchor) {
        const entity = getNpc(this.#npcId);
        if (!game.user.isGM || !entity) return;
        openActionMenu({
            anchor,
            className: "npc-dossier-actions-menu",
            items: DossierTabPreference.buildMenuItems(
                DossierTabPreference.getDefaultTab(entity),
                tab => this.#setDefaultDossierTab(tab)
            )
        });
    }

    async #setDefaultDossierTab(tab) {
        const entity = getNpc(this.#npcId);
        if (!game.user.isGM || !entity) return;
        const defaultTab = DossierTabPreference.normalizeTab(tab);
        await updateNpc(entity.id, { dossier: { defaultTab } });
        this.#activeTab = defaultTab;
        this.refresh();
    }

    #openNpcVisibilityMenu(anchor) {
        const entity = getNpc(this.#npcId);
        if (!game.user.isGM || !entity) return;
        const current = CampaignEntityVisibilityManager.getPlayerVisibilityOverride(entity);
        openActionMenu({
            anchor,
            className: "nexus-scene-player-access-menu",
            items: [
                {
                    id: "inherit",
                    label: current === "inherit" ? "Global (Current)" : "Global",
                    icon: "fas fa-layer-group",
                    onSelect: () => this.#setNpcPlayerVisibility("inherit")
                },
                {
                    id: "show",
                    label: current === "show" ? "Yes (Current)" : "Yes",
                    icon: "fas fa-eye",
                    onSelect: () => this.#setNpcPlayerVisibility("show")
                },
                {
                    id: "hide",
                    label: current === "hide" ? "No (Current)" : "No",
                    icon: "fas fa-eye-slash",
                    onSelect: () => this.#setNpcPlayerVisibility("hide")
                },
                {
                    id: "change-global",
                    label: "Change Global Setting...",
                    icon: "fas fa-sliders",
                    onSelect: () => PlayerNpcVisibilityDialog.show("npc")
                },
                {
                    id: "player-visibility-info",
                    label: "What's this?",
                    icon: "fas fa-circle-info",
                    onSelect: () => PlayerVisibilityInfoPanel.show("campaignEntityVisibility")
                }
            ]
        });
    }

    async #getLinkedActorContext(entity) {
        const actor = await CampaignEntityActorBridge.getLinkedActor(entity);
        if (!actor) return null;
        return {
            name: actor.name || "Actor",
            uuid: actor.uuid || "",
            type: actor.type || "Actor"
        };
    }

    async #openLinkedActor() {
        const entity = getNpc(this.#npcId);
        if (!entity) return;
        const actor = await CampaignEntityActorBridge.getLinkedActor(entity);
        if (!actor) {
            ui.notifications.warn("No linked Actor was found for this person.");
            return;
        }
        actor.sheet?.render(true);
    }

    async #linkActor() {
        await this.#manageActorLink();
    }

    async #manageActorLink() {
        const entity = getNpc(this.#npcId);
        if (!game.user.isGM || !entity) return;
        const result = await CampaignEntityActorBridge.manageActorLink(entity);
        if (result?.action && result.action !== "cancel" && result.action !== "open") this.refresh();
    }

    async #setNpcPlayerVisibility(value) {
        const entity = getNpc(this.#npcId);
        if (!game.user.isGM || !entity) return;
        await CampaignEntityVisibilityManager.setPlayerVisibilityOverride(entity.id, "npc", value);
        this.refresh();
    }

    static async _onCreateNpcJournal() {
        await this.#editJournal({ create: true });
    }

    static async _onOpenNpcJournal() {
        await this.#editJournal({ create: false });
    }

    async #renameNpc() {
        const entity = getNpc(this.#npcId);
        if (!entity) return;
        const name = await promptTextInput({
            title: "Rename Person",
            label: "Name",
            value: NpcEntityModel.getName(entity),
            confirmLabel: "Rename"
        });
        if (!name) return;
        await updateNpc(entity.id, { display: { name } });
        this.refresh();
    }

    #editNpc() {
        const entity = getNpc(this.#npcId);
        if (!game.user.isGM || !entity) return;
        NpcDataEditor.show({
            npcId: entity.id,
            onSave: () => this.refresh()
        });
    }

    #changePortrait() {
        const entity = getNpc(this.#npcId);
        if (!game.user.isGM || !entity) return;
        new NpcPortraitPicker({
            currentPortraitSrc: NpcEntityModel.getImage(entity),
            onSelect: selection => this.#setPortrait(selection?.src || "")
        }).render(true, { focus: true });
    }

    async #setPortrait(path) {
        const entity = getNpc(this.#npcId);
        if (!game.user.isGM || !entity || !path) return;
        await updateNpc(entity.id, { display: { imageSrc: path } });
        this.refresh();
    }

    #changeCoverImage() {
        const entity = getNpc(this.#npcId);
        if (!game.user.isGM || !entity) return;
        SiteCoverPicker.show({
            current: NpcEntityModel.getCoverImage(entity),
            onSelect: path => this.#setCoverImage(path || "")
        });
    }

    async #setCoverImage(path) {
        const entity = getNpc(this.#npcId);
        if (!game.user.isGM || !entity) return;
        await updateNpc(entity.id, { display: { coverImageSrc: path || "" } });
        this.refresh();
    }

    async #editJournal({ create = true } = {}) {
        if (!game.user.isGM) return;
        const page = create
            ? await CampaignEntityJournalStore.getOrCreateJournalPage(this.#npcId)
            : CampaignEntityJournalStore.getJournalPage(this.#npcId);
        if (!page?.parent) {
            ui.notifications.warn("No journal page was found for this person.");
            return;
        }
        page.sheet?.render(true);
    }

    async #deleteNpc() {
        const entity = getNpc(this.#npcId);
        if (!entity) return;
        const confirmed = await foundry.applications.api.DialogV2.confirm({
            window: { title: "Delete Person" },
            content: `<p>Delete <strong>${foundry.utils.escapeHTML(NpcEntityModel.getName(entity))}</strong>?</p>`,
            modal: true,
            rejectClose: false,
            yes: { label: "Delete" },
            no: { label: "Cancel" }
        });
        if (!confirmed) return;
        await deleteNpc(entity.id);
        await this.close();
    }

    async #enrichJournalContent(page) {
        const content = page?.text?.content || "";
        if (!String(content).trim()) return "";
        try {
            return foundry.applications.ux.TextEditor.implementation.enrichHTML(content, {
                relativeTo: page,
                secrets: page.isOwner
            });
        } catch (_err) {
            return content;
        }
    }

    #buildBackgroundStyle(entity) {
        const cover = NpcEntityModel.getCoverImage(entity)
            || SiteCoverCatalog.getAbstractCover(entity?.id || NpcEntityModel.getName(entity) || "npc");
        return cover ? `background-image: url('${cover}');` : "";
    }

}
