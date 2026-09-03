import { openActionMenu, promptTextInput } from "../../../api/ui.js";
import { deleteFaction, getFaction, updateFaction } from "../../../api/factions.js";
import { ConnectionsBoard } from "../../connections/components/ConnectionsBoard.js";
import { ConnectionStore } from "../../connections/services/ConnectionStore.js";
import { ConnectionTargetResolver } from "../../connections/services/ConnectionTargetResolver.js";
import { SiteCoverPicker } from "../../site/applications/SiteCoverPicker.js";
import { SiteCoverCatalog } from "../../site/services/SiteCoverCatalog.js";
import { FactionEntityModel } from "../models/FactionEntityModel.js";
import { FactionProfileViewModel } from "../models/FactionProfileViewModel.js";
import { CampaignEntityDossierRefresh } from "../services/CampaignEntityDossierRefresh.js";
import { CampaignEntityJournalStore } from "../services/CampaignEntityJournalStore.js";
import { CampaignEntityVisibilityManager } from "../services/CampaignEntityVisibilityManager.js";
import { PlayerNpcVisibilityDialog } from "../../nexus/applications/PlayerNpcVisibilityDialog.js";
import { PlayerVisibilityInfoPanel } from "../../nexus/applications/PlayerVisibilityInfoPanel.js";
import { DossierTabPreference } from "../../nexus/services/DossierTabPreference.js";
import { applySessionWindowPlacement, rememberSessionWindowPlacement } from "/modules/augur-nexus/scripts/api/window-placement.js";
import { FactionDataEditor } from "./FactionDataEditor.js";
import { FactionEmblemPicker } from "./FactionEmblemPicker.js";
import { NpcCreateDialog } from "./NpcCreateDialog.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
const PLACEMENT_KEY = "augur-nexus.faction-dossier";

export class FactionDossier extends HandlebarsApplicationMixin(ApplicationV2) {
    #factionId = "";
    #activeTab = "profile";
    #connectionsBoard = null;
    #connectionsChangedHook = null;
    #entitiesChangedHook = null;
    #lastModel = null;
    #positionInitialized = false;

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-faction-dossier",
        classes: ["augur-nexus", "npc-dossier", "faction-dossier"],
        tag: "div",
        window: {
            title: "Organization",
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
            template: "modules/augur-nexus/templates/campaign-entities/faction-dossier.hbs",
            templates: [
                "modules/augur-nexus/templates/connections/connections-board.hbs",
                "modules/augur-nexus/templates/campaign-entities/faction-profile-panel.hbs",
                "modules/augur-nexus/templates/site/site-cover-picker.hbs"
            ]
        }
    };

    get title() {
        return this.#lastModel?.faction?.name || "Organization";
    }

    static show({ factionId } = {}) {
        if (!factionId) return null;
        const app = new this({ factionId });
        app.render(true, { focus: true });
        return app;
    }

    constructor({ factionId } = {}, options = {}) {
        super(options);
        this.#factionId = factionId || "";
        this.#activeTab = DossierTabPreference.getDefaultTab(getFaction(this.#factionId));
        this.#connectionsChangedHook = () => this.refresh();
        this.#entitiesChangedHook = event => {
            if (!event?.entity || event.entity.id === this.#factionId) this.refresh();
        };
        Hooks.on("augurNexusConnectionsChanged", this.#connectionsChangedHook);
        Hooks.on("augurNexusCampaignEntitiesChanged", this.#entitiesChangedHook);
        CampaignEntityDossierRefresh.watch(this);
    }

    async _prepareContext() {
        const entity = getFaction(this.#factionId);
        if (!entity) {
            return {
                missing: true,
                faction: { name: "Missing Organization" },
                connections: { board: null }
            };
        }

        const target = ConnectionTargetResolver.fromCampaignEntity(entity);
        if (!this.#connectionsBoard) this.#connectionsBoard = new ConnectionsBoard({ target, isGM: game.user.isGM });
        else this.#connectionsBoard.setTarget(target);

        const page = CampaignEntityJournalStore.getJournalPage(entity.id);
        const content = await this.#enrichJournalContent(page);
        const model = {
            faction: {
                id: entity.id,
                name: FactionEntityModel.getName(entity),
                profile: FactionProfileViewModel.fromEntity(entity, {
                    showTabs: true,
                    showActions: game.user.isGM,
                    activeTab: this.#activeTab,
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
        this.#activateActionListeners(htmlElement instanceof HTMLElement ? htmlElement : htmlElement?.[0]);
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

    #activateActionListeners(element) {
        if (!element) return;
        element.querySelectorAll("[data-action='setFactionDossierTab']").forEach(button => {
            if (button.dataset.factionDossierBound) return;
            button.dataset.factionDossierBound = "true";
            button.addEventListener("click", event => {
                event.preventDefault();
                this.#activeTab = event.currentTarget.dataset.tab === "journal" ? "journal" : "profile";
                this.render({ parts: ["content"] });
            });
        });
        element.querySelector("[data-action='openFactionActions']")?.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            this.#openActions(event.currentTarget);
        }, { once: true });
        element.querySelector("[data-action='createFactionJournal']")?.addEventListener("click", event => {
            event.preventDefault();
            this.#editJournal({ create: true });
        }, { once: true });
        element.querySelector("[data-action='openFactionJournal']")?.addEventListener("click", event => {
            event.preventDefault();
            this.#editJournal({ create: false });
        }, { once: true });
        element.querySelector("[data-action='createFactionMember']")?.addEventListener("click", event => {
            event.preventDefault();
            this.#createMember();
        }, { once: true });
    }

    #openActions(anchor) {
        if (!game.user.isGM) return;
        const entity = getFaction(this.#factionId);
        if (!entity) return;
        openActionMenu({
            anchor,
            className: "faction-dossier-actions-menu",
            items: [
                { id: "rename", label: "Rename", icon: "fas fa-pen", onSelect: () => this.#renameFaction() },
                { id: "edit-faction", label: "Edit Organization", icon: "fas fa-sliders", onSelect: () => this.#editFaction() },
                { id: "change-emblem", label: "Change Badge", icon: "fas fa-shield", onSelect: () => this.#changeEmblem() },
                { id: "open-journal", label: "Edit Journal", icon: "fas fa-book-open", onSelect: () => this.#editJournal() },
                {
                    id: "default-dossier-tab",
                    label: `Default Tab: ${DossierTabPreference.getTabLabel(DossierTabPreference.getDefaultTab(entity))}`,
                    icon: "fas fa-table-columns",
                    onSelect: () => this.#openDefaultDossierTabMenu(anchor)
                },
                { id: "change-cover", label: "Change Cover Image", icon: "fas fa-image", onSelect: () => this.#changeCoverImage() },
                ...(FactionEntityModel.getCoverImage(entity) ? [{
                    id: "clear-cover",
                    label: "Clear Cover Image",
                    icon: "fas fa-rotate-left",
                    onSelect: () => this.#setCoverImage("")
                }] : []),
                {
                    id: "player-faction-visibility",
                    label: `Visible To Players: ${CampaignEntityVisibilityManager.getPlayerVisibilityLabel(entity)}`,
                    icon: CampaignEntityVisibilityManager.getPlayerVisibilityIcon(entity),
                    onSelect: () => this.#openFactionVisibilityMenu(anchor)
                },
                { id: "delete", label: "Delete Organization", status: "Permanent", icon: "fas fa-skull-crossbones", danger: true, className: "permanent-danger", onSelect: () => this.#deleteFaction() }
            ]
        });
    }

    #openDefaultDossierTabMenu(anchor) {
        const entity = getFaction(this.#factionId);
        if (!game.user.isGM || !entity) return;
        openActionMenu({
            anchor,
            className: "faction-dossier-actions-menu",
            items: DossierTabPreference.buildMenuItems(
                DossierTabPreference.getDefaultTab(entity),
                tab => this.#setDefaultDossierTab(tab)
            )
        });
    }

    async #setDefaultDossierTab(tab) {
        const entity = getFaction(this.#factionId);
        if (!game.user.isGM || !entity) return;
        const defaultTab = DossierTabPreference.normalizeTab(tab);
        await updateFaction(entity.id, { dossier: { defaultTab } });
        this.#activeTab = defaultTab;
        this.refresh();
    }

    #openFactionVisibilityMenu(anchor) {
        const entity = getFaction(this.#factionId);
        if (!game.user.isGM || !entity) return;
        const current = CampaignEntityVisibilityManager.getPlayerVisibilityOverride(entity);
        openActionMenu({
            anchor,
            className: "nexus-scene-player-access-menu",
            items: [
                { id: "inherit", label: current === "inherit" ? "Global (Current)" : "Global", icon: "fas fa-layer-group", onSelect: () => this.#setFactionPlayerVisibility("inherit") },
                { id: "show", label: current === "show" ? "Yes (Current)" : "Yes", icon: "fas fa-eye", onSelect: () => this.#setFactionPlayerVisibility("show") },
                { id: "hide", label: current === "hide" ? "No (Current)" : "No", icon: "fas fa-eye-slash", onSelect: () => this.#setFactionPlayerVisibility("hide") },
                { id: "change-global", label: "Change Global Setting...", icon: "fas fa-sliders", onSelect: () => PlayerNpcVisibilityDialog.show("faction") },
                { id: "player-visibility-info", label: "What's this?", icon: "fas fa-circle-info", onSelect: () => PlayerVisibilityInfoPanel.show("campaignEntityVisibility") }
            ]
        });
    }

    async #setFactionPlayerVisibility(value) {
        const entity = getFaction(this.#factionId);
        if (!game.user.isGM || !entity) return;
        await CampaignEntityVisibilityManager.setPlayerVisibilityOverride(entity.id, "faction", value);
        this.refresh();
    }

    async #renameFaction() {
        const entity = getFaction(this.#factionId);
        if (!entity) return;
        const name = await promptTextInput({
            title: "Rename Organization",
            label: "Name",
            value: FactionEntityModel.getName(entity),
            confirmLabel: "Rename"
        });
        if (!name) return;
        await updateFaction(entity.id, { display: { name } });
        this.refresh();
    }

    #editFaction() {
        const entity = getFaction(this.#factionId);
        if (!game.user.isGM || !entity) return;
        FactionDataEditor.show({ factionId: entity.id, onSave: () => this.refresh() });
    }

    #changeEmblem() {
        const entity = getFaction(this.#factionId);
        if (!game.user.isGM || !entity) return;
        new FactionEmblemPicker({
            currentEmblemSrc: FactionEntityModel.getImage(entity),
            onSelect: selection => this.#setEmblem(selection?.src || "")
        }).render(true, { focus: true });
    }

    async #setEmblem(path) {
        const entity = getFaction(this.#factionId);
        if (!game.user.isGM || !entity || !path) return;
        await updateFaction(entity.id, { display: { imageSrc: path } });
        this.refresh();
    }

    #changeCoverImage() {
        const entity = getFaction(this.#factionId);
        if (!game.user.isGM || !entity) return;
        SiteCoverPicker.show({
            current: FactionEntityModel.getCoverImage(entity),
            onSelect: path => this.#setCoverImage(path || "")
        });
    }

    async #setCoverImage(path) {
        const entity = getFaction(this.#factionId);
        if (!game.user.isGM || !entity) return;
        await updateFaction(entity.id, { display: { coverImageSrc: path || "" } });
        this.refresh();
    }

    async #editJournal({ create = true } = {}) {
        if (!game.user.isGM) return;
        const page = create
            ? await CampaignEntityJournalStore.getOrCreateJournalPage(this.#factionId)
            : CampaignEntityJournalStore.getJournalPage(this.#factionId);
        if (!page?.parent) {
            ui.notifications.warn("No journal page was found for this organization.");
            return;
        }
        page.sheet?.render(true);
    }

    async #deleteFaction() {
        const entity = getFaction(this.#factionId);
        if (!entity) return;
        const confirmed = await foundry.applications.api.DialogV2.confirm({
            window: { title: "Delete Organization" },
            content: `<p>Delete <strong>${foundry.utils.escapeHTML(FactionEntityModel.getName(entity))}</strong>?</p>`,
            modal: true,
            rejectClose: false,
            yes: { label: "Delete" },
            no: { label: "Cancel" }
        });
        if (!confirmed) return;
        await deleteFaction(entity.id);
        await this.close();
    }

    #createMember() {
        const faction = getFaction(this.#factionId);
        if (!game.user.isGM || !faction) return;
        NpcCreateDialog.show({
            openAfterCreate: false,
            onCreated: async npc => {
                await this.#connectMember(npc);
                this.refresh();
            }
        });
    }

    async #connectMember(npc) {
        const faction = getFaction(this.#factionId);
        if (!faction || !npc) return null;
        const factionTarget = ConnectionTargetResolver.fromCampaignEntity(faction);
        const npcTarget = ConnectionTargetResolver.fromCampaignEntity(npc);
        if (!factionTarget || !npcTarget) return null;
        const role = this.#pickMembershipRole(faction);
        return ConnectionStore.addConnection(factionTarget, npcTarget, {
            category: "member",
            role,
            sourceView: {
                category: "member",
                role
            },
            targetView: {
                category: "affiliation",
                role
            }
        });
    }

    #pickMembershipRole(faction) {
        const moduleData = faction?.moduleData?.[faction.sourceModule] || faction?.moduleData?.["augur-scifi"] || {};
        const roles = Array.isArray(moduleData.membershipRoles) ? moduleData.membershipRoles : [];
        const values = roles.map(role => String(role || "").trim()).filter(Boolean);
        if (values.length) return values[Math.floor(Math.random() * values.length)];
        return String(moduleData.defaultMembershipRole || "").trim() || "Member";
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
        const cover = FactionEntityModel.getCoverImage(entity)
            || SiteCoverCatalog.getAbstractCover(entity?.id || FactionEntityModel.getName(entity) || "faction");
        return cover ? `background-image: url('${cover}');` : "";
    }

}
