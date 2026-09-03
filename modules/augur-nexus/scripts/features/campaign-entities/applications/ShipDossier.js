import { deleteShip, getShip, updateShip } from "../../../api/ships.js";
import { openActionMenu, promptTextInput } from "../../../api/ui.js";
import { ConnectionsBoard } from "../../connections/components/ConnectionsBoard.js";
import { ConnectionTargetResolver } from "../../connections/services/ConnectionTargetResolver.js";
import { SiteCoverPicker } from "../../site/applications/SiteCoverPicker.js";
import { SiteCoverCatalog } from "../../site/services/SiteCoverCatalog.js";
import { ShipEntityModel } from "../models/ShipEntityModel.js";
import { ShipProfileViewModel } from "../models/ShipProfileViewModel.js";
import { CampaignEntityActorBridge } from "../services/CampaignEntityActorBridge.js";
import { CampaignEntityDossierRefresh } from "../services/CampaignEntityDossierRefresh.js";
import { CampaignEntityJournalStore } from "../services/CampaignEntityJournalStore.js";
import { CampaignEntityVisibilityManager } from "../services/CampaignEntityVisibilityManager.js";
import { PlayerNpcVisibilityDialog } from "../../nexus/applications/PlayerNpcVisibilityDialog.js";
import { PlayerVisibilityInfoPanel } from "../../nexus/applications/PlayerVisibilityInfoPanel.js";
import { DossierTabPreference } from "../../nexus/services/DossierTabPreference.js";
import { applySessionWindowPlacement, rememberSessionWindowPlacement } from "/modules/augur-nexus/scripts/api/window-placement.js";
import { ShipDataEditor } from "./ShipDataEditor.js";
import { ShipImagePicker } from "./ShipImagePicker.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const PLACEMENT_KEY = "augur-nexus.ship-dossier";

export class ShipDossier extends HandlebarsApplicationMixin(ApplicationV2) {
    #shipId = "";
    #activeTab = "profile";
    #connectionsBoard = null;
    #connectionsChangedHook = null;
    #entitiesChangedHook = null;
    #lastModel = null;
    #positionInitialized = false;

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-ship-dossier",
        classes: ["augur-nexus", "npc-dossier", "ship-dossier"],
        tag: "div",
        window: { title: "Ship", resizable: true, minimizable: true },
        position: { width: 700, height: 620 }
    };

    static PARTS = {
        content: {
            template: "modules/augur-nexus/templates/campaign-entities/ship-dossier.hbs",
            templates: [
                "modules/augur-nexus/templates/connections/connections-board.hbs",
                "modules/augur-nexus/templates/campaign-entities/ship-profile-panel.hbs",
                "modules/augur-nexus/templates/site/site-cover-picker.hbs"
            ]
        }
    };

    get title() { return this.#lastModel?.ship?.name || "Ship"; }

    static show({ shipId } = {}) {
        if (!shipId) return null;
        const app = new this({ shipId });
        app.render(true, { focus: true });
        return app;
    }

    constructor({ shipId } = {}, options = {}) {
        super(options);
        this.#shipId = shipId || "";
        this.#activeTab = DossierTabPreference.getDefaultTab(getShip(this.#shipId));
        this.#connectionsChangedHook = () => this.refresh();
        this.#entitiesChangedHook = event => { if (!event?.entity || event.entity.id === this.#shipId) this.refresh(); };
        Hooks.on("augurNexusConnectionsChanged", this.#connectionsChangedHook);
        Hooks.on("augurNexusCampaignEntitiesChanged", this.#entitiesChangedHook);
        CampaignEntityDossierRefresh.watch(this);
    }

    async _prepareContext() {
        const entity = getShip(this.#shipId);
        if (!entity) return { missing: true, ship: { name: "Missing Ship" }, connections: { board: null } };
        const target = ConnectionTargetResolver.fromCampaignEntity(entity);
        if (!this.#connectionsBoard) this.#connectionsBoard = new ConnectionsBoard({ target, isGM: game.user.isGM });
        else this.#connectionsBoard.setTarget(target);
        const page = CampaignEntityJournalStore.getJournalPage(entity.id);
        const content = await this.#enrichJournalContent(page);
        const linkedActor = await this.#getLinkedActorContext(entity);
        const model = {
            ship: {
                id: entity.id,
                name: ShipEntityModel.getName(entity),
                profile: ShipProfileViewModel.fromEntity(entity, { showTabs: true, showActions: game.user.isGM, activeTab: this.#activeTab, linkedActor, showBody: this.#activeTab === "profile" })
            },
            dossier: { isProfileTab: this.#activeTab === "profile", isJournalTab: this.#activeTab === "journal" },
            journal: { hasPage: !!page, entryId: page?.parent?.id || entity.journalEntryId || "", pageId: page?.id || "", content, hasContent: !!String(page?.text?.content || "").trim() },
            connections: { board: this.#connectionsBoard.getContext() },
            backgroundStyle: this.#buildBackgroundStyle(entity),
            isGM: game.user.isGM
        };
        this.#lastModel = model;
        return model;
    }

    _attachPartListeners(partId, htmlElement, options) {
        if (super._attachPartListeners) super._attachPartListeners(partId, htmlElement, options);
        this.#activateActionListeners(htmlElement instanceof HTMLElement ? htmlElement : htmlElement?.[0]);
    }

    _onRender(context, options) {
        super._onRender(context, options);
        if (this.window?.title) this.window.title.textContent = this.title;
        this.#activateActionListeners(this.element);
        this.#connectionsBoard?.activateListeners(this.element, this);
        if (!this.#positionInitialized) { applySessionWindowPlacement(this, PLACEMENT_KEY, { fallback: "center" }); this.#positionInitialized = true; }
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

    refreshCampaignEntityDossier() { this.refresh(); }

    refresh() { if (this.rendered !== false) this.render({ parts: ["content"] }); }

    #activateActionListeners(element) {
        if (!element) return;
        element.querySelectorAll("[data-action='setShipDossierTab']").forEach(button => {
            if (button.dataset.shipDossierBound) return;
            button.dataset.shipDossierBound = "true";
            button.addEventListener("click", event => { event.preventDefault(); this.#activeTab = event.currentTarget.dataset.tab === "journal" ? "journal" : "profile"; this.render({ parts: ["content"] }); });
        });
        const actionsButton = element.querySelector("[data-action='openShipActions']");
        if (actionsButton && !actionsButton.dataset.shipDossierBound) actionsButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            this.#openActions(event.currentTarget);
        });
        if (actionsButton) actionsButton.dataset.shipDossierBound = "true";

        const createJournalButton = element.querySelector("[data-action='createShipJournal']");
        if (createJournalButton && !createJournalButton.dataset.shipDossierBound) createJournalButton.addEventListener("click", event => {
            event.preventDefault();
            this.#editJournal({ create: true });
        });
        if (createJournalButton) createJournalButton.dataset.shipDossierBound = "true";

        const openJournalButton = element.querySelector("[data-action='openShipJournal']");
        if (openJournalButton && !openJournalButton.dataset.shipDossierBound) openJournalButton.addEventListener("click", event => {
            event.preventDefault();
            this.#editJournal({ create: false });
        });
        if (openJournalButton) openJournalButton.dataset.shipDossierBound = "true";

        const openLinkedActorButton = element.querySelector("[data-action='openShipLinkedActor']");
        if (openLinkedActorButton && !openLinkedActorButton.dataset.shipDossierBound) openLinkedActorButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            void this.#openLinkedActor();
        });
        if (openLinkedActorButton) openLinkedActorButton.dataset.shipDossierBound = "true";

        const linkActorButton = element.querySelector("[data-action='linkShipActor']");
        if (linkActorButton && !linkActorButton.dataset.shipDossierBound) linkActorButton.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            void this.#linkActor();
        });
        if (linkActorButton) linkActorButton.dataset.shipDossierBound = "true";
    }

    #openActions(anchor) {
        if (!game.user.isGM) return;
        const entity = getShip(this.#shipId);
        if (!entity) return;
        openActionMenu({
            anchor,
            className: "ship-dossier-actions-menu",
            items: [
                { id: "rename", label: "Rename", icon: "fas fa-pen", onSelect: () => this.#renameShip() },
                { id: "edit-ship", label: "Edit Ship", icon: "fas fa-sliders", onSelect: () => this.#editShip() },
                { id: "change-model", label: "Change Model", icon: "fas fa-rocket", onSelect: () => this.#changeShipImage() },
                { id: "open-journal", label: "Edit Journal", icon: "fas fa-book-open", onSelect: () => this.#editJournal() },
                { id: "linked-actor", label: entity.projections?.actorUuid ? "Linked Actor" : "Link Actor", icon: "fas fa-user-circle", onSelect: () => this.#manageActorLink() },
                {
                    id: "default-dossier-tab",
                    label: `Default Tab: ${DossierTabPreference.getTabLabel(DossierTabPreference.getDefaultTab(entity))}`,
                    icon: "fas fa-table-columns",
                    onSelect: () => this.#openDefaultDossierTabMenu(anchor)
                },
                { id: "change-cover", label: "Change Cover Image", icon: "fas fa-image", onSelect: () => this.#changeCoverImage() },
                ...(ShipEntityModel.getCoverImage(entity) ? [{ id: "clear-cover", label: "Clear Cover Image", icon: "fas fa-rotate-left", onSelect: () => this.#setCoverImage("") }] : []),
                {
                    id: "player-ship-visibility",
                    label: `Visible To Players: ${CampaignEntityVisibilityManager.getPlayerVisibilityLabel(entity)}`,
                    icon: CampaignEntityVisibilityManager.getPlayerVisibilityIcon(entity),
                    onSelect: () => this.#openShipVisibilityMenu(anchor)
                },
                { id: "delete", label: "Delete Ship", status: "Permanent", icon: "fas fa-skull-crossbones", danger: true, className: "permanent-danger", onSelect: () => this.#deleteShip() }
            ]
        });
    }

    #openDefaultDossierTabMenu(anchor) {
        const entity = getShip(this.#shipId);
        if (!game.user.isGM || !entity) return;
        openActionMenu({
            anchor,
            className: "ship-dossier-actions-menu",
            items: DossierTabPreference.buildMenuItems(
                DossierTabPreference.getDefaultTab(entity),
                tab => this.#setDefaultDossierTab(tab)
            )
        });
    }

    async #setDefaultDossierTab(tab) {
        const entity = getShip(this.#shipId);
        if (!game.user.isGM || !entity) return;
        const defaultTab = DossierTabPreference.normalizeTab(tab);
        await updateShip(entity.id, { dossier: { defaultTab } });
        this.#activeTab = defaultTab;
        this.refresh();
    }

    #openShipVisibilityMenu(anchor) {
        const entity = getShip(this.#shipId);
        if (!game.user.isGM || !entity) return;
        const current = CampaignEntityVisibilityManager.getPlayerVisibilityOverride(entity);
        openActionMenu({
            anchor,
            className: "nexus-scene-player-access-menu",
            items: [
                { id: "inherit", label: current === "inherit" ? "Global (Current)" : "Global", icon: "fas fa-layer-group", onSelect: () => this.#setShipPlayerVisibility("inherit") },
                { id: "show", label: current === "show" ? "Yes (Current)" : "Yes", icon: "fas fa-eye", onSelect: () => this.#setShipPlayerVisibility("show") },
                { id: "hide", label: current === "hide" ? "No (Current)" : "No", icon: "fas fa-eye-slash", onSelect: () => this.#setShipPlayerVisibility("hide") },
                { id: "change-global", label: "Change Global Setting...", icon: "fas fa-sliders", onSelect: () => PlayerNpcVisibilityDialog.show("ship") },
                { id: "player-visibility-info", label: "What's this?", icon: "fas fa-circle-info", onSelect: () => PlayerVisibilityInfoPanel.show("campaignEntityVisibility") }
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
        const entity = getShip(this.#shipId);
        if (!entity) return;
        const actor = await CampaignEntityActorBridge.getLinkedActor(entity);
        if (!actor) {
            ui.notifications.warn("No linked Actor was found for this ship.");
            return;
        }
        actor.sheet?.render(true);
    }

    async #linkActor() {
        await this.#manageActorLink();
    }

    async #manageActorLink() {
        const entity = getShip(this.#shipId);
        if (!game.user.isGM || !entity) return;
        const result = await CampaignEntityActorBridge.manageActorLink(entity);
        if (result?.action && result.action !== "cancel" && result.action !== "open") this.refresh();
    }

    async #setShipPlayerVisibility(value) {
        const entity = getShip(this.#shipId);
        if (!game.user.isGM || !entity) return;
        await CampaignEntityVisibilityManager.setPlayerVisibilityOverride(entity.id, "ship", value);
        this.refresh();
    }

    async #renameShip() {
        const entity = getShip(this.#shipId);
        if (!entity) return;
        const name = await promptTextInput({ title: "Rename Ship", label: "Name", value: ShipEntityModel.getName(entity), confirmLabel: "Rename" });
        if (!name) return;
        await updateShip(entity.id, { display: { name } });
        this.refresh();
    }

    #editShip() { const entity = getShip(this.#shipId); if (entity) ShipDataEditor.show({ shipId: entity.id, onSave: () => this.refresh() }); }

    #changeShipImage() {
        const entity = getShip(this.#shipId);
        if (!entity) return;
        const moduleData = entity.moduleData?.[entity.sourceModule] || entity.moduleData?.["augur-scifi"] || {};
        new ShipImagePicker({
            currentShipImageSrc: ShipEntityModel.getImage(entity),
            selectedModelId: moduleData.modelId || "",
            onSelect: selection => this.#setShipImage(selection)
        }).render(true, { focus: true });
    }

    async #setShipImage(selection = {}) {
        const entity = getShip(this.#shipId);
        if (!entity || !selection.src) return;
        const moduleId = entity.sourceModule || "augur-scifi";
        const patch = {
            display: { imageSrc: selection.src },
            moduleData: { [moduleId]: { ...(entity.moduleData?.[moduleId] || {}), modelId: selection.modelId || "", styleId: selection.styleId || "" } }
        };
        if (!selection.custom && selection.modelLabel) patch.profile = { model: selection.modelLabel };
        await updateShip(entity.id, patch, { moduleId });
        this.refresh();
    }

    #changeCoverImage() { const entity = getShip(this.#shipId); if (entity) SiteCoverPicker.show({ current: ShipEntityModel.getCoverImage(entity), onSelect: path => this.#setCoverImage(path || "") }); }
    async #setCoverImage(path) { const entity = getShip(this.#shipId); if (entity) { await updateShip(entity.id, { display: { coverImageSrc: path || "" } }); this.refresh(); } }

    async #editJournal({ create = true } = {}) {
        if (!game.user.isGM) return;
        const page = create ? await CampaignEntityJournalStore.getOrCreateJournalPage(this.#shipId) : CampaignEntityJournalStore.getJournalPage(this.#shipId);
        if (!page?.parent) { ui.notifications.warn("No journal page was found for this ship."); return; }
        page.sheet?.render(true);
    }

    async #deleteShip() {
        const entity = getShip(this.#shipId);
        if (!entity) return;
        const confirmed = await foundry.applications.api.DialogV2.confirm({ window: { title: "Delete Ship" }, content: `<p>Delete <strong>${foundry.utils.escapeHTML(ShipEntityModel.getName(entity))}</strong>?</p>`, modal: true, rejectClose: false, yes: { label: "Delete" }, no: { label: "Cancel" } });
        if (!confirmed) return;
        await deleteShip(entity.id);
        await this.close();
    }

    async #enrichJournalContent(page) {
        const content = page?.text?.content || "";
        if (!String(content).trim()) return "";
        try { return foundry.applications.ux.TextEditor.implementation.enrichHTML(content, { relativeTo: page, secrets: page.isOwner }); } catch (_err) { return content; }
    }

    #buildBackgroundStyle(entity) {
        const cover = ShipEntityModel.getCoverImage(entity) || SiteCoverCatalog.getAbstractCover(entity?.id || ShipEntityModel.getName(entity) || "ship");
        return cover ? `background-image: url('${cover}');` : "";
    }

}
