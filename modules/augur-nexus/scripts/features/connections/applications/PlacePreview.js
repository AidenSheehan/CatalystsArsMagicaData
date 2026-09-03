import { openActionMenu, promptTextInput, showInfoDialog } from "../../../api/ui.js";
import { SiteIconPicker } from "../../site/applications/SiteIconPicker.js";
import { SitePanel } from "../../site/applications/SitePanel.js";
import { SiteCoverPicker } from "../../site/applications/SiteCoverPicker.js";
import { SiteCoverCatalog } from "../../site/services/SiteCoverCatalog.js";
import { SiteMapManager } from "../../site/services/SiteMapManager.js";
import { SiteRecordManager } from "../../site/services/SiteRecordManager.js";
import { SiteSceneVisibilityManager } from "../../site/services/SiteSceneVisibilityManager.js";
import { ConnectionsBoard } from "../components/ConnectionsBoard.js";
import { ConnectionDossierRefresh } from "../services/ConnectionDossierRefresh.js";
import { ConnectionTargetResolver } from "../services/ConnectionTargetResolver.js";
import { JournalAssociationService } from "../services/JournalAssociationService.js";
import { PlayerSceneOpenDialog } from "../../nexus/applications/PlayerSceneOpenDialog.js";
import { PlayerNexusVisibilityDialog } from "../../nexus/applications/PlayerNexusVisibilityDialog.js";
import { NexusSceneRenameDialog } from "../../nexus/applications/NexusSceneRenameDialog.js";
import { PlayerVisibilityInfoPanel } from "../../nexus/applications/PlayerVisibilityInfoPanel.js";
import { NexusPlayerSceneAccess } from "../../nexus/services/NexusPlayerSceneAccess.js";
import { NexusSceneOperations } from "../../nexus/services/NexusSceneOperations.js";
import { NexusMarkerService } from "../../markers/services/NexusMarkerService.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const MODULE_ID = "augur-nexus";

export class PlacePreview extends HandlebarsApplicationMixin(ApplicationV2) {
    #scene = null;
    #record = null;
    #target = null;
    #sourceCover = null;
    #presentation = null;
    #connectionsBoard = null;
    #connectionsChangedHook = null;
    #playerAccessChangedHook = null;
    #sceneUpdatedHook = null;
    #lastModel = null;
    #positionInitialized = false;

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-place-preview",
        classes: ["augur-nexus", "site-preview", "place-preview"],
        tag: "div",
        window: {
            title: "Connections",
            resizable: true,
            minimizable: true
        },
        position: {
            width: 700,
            height: 620
        },
        actions: {
            openPlaceScene: PlacePreview._onOpenPlaceScene,
            openPlaceActions: PlacePreview._onOpenPlaceActions,
            createJournalPage: PlacePreview._onCreateJournalPage
        }
    };

    static PARTS = {
        content: {
            template: "modules/augur-nexus/templates/connections/place-preview.hbs",
            templates: [
                "modules/augur-nexus/templates/connections/connections-board.hbs",
                "modules/augur-nexus/templates/site/site-cover-picker.hbs"
            ]
        }
    };

    get title() {
        return this.#lastModel?.place?.name || this.#target?.name || this.#record?.siteName || this.#scene?.name || "Connections";
    }

    static show({ scene = null, sceneId = null, record = null, parentScene = canvas.scene, siteId = null, placeable = null, page = null, target = null, sourceCover = null, presentation = null } = {}) {
        if (target?.kind === "nexus-site" || record || siteId || placeable || page) {
            const resolvedRecord = record
                ? SiteRecordManager.normalizeRecord(record)
                : SiteRecordManager.resolveSite({
                    siteRecord: record,
                    parentScene: target?.parentSceneId ? game.scenes.get(target.parentSceneId) || parentScene : parentScene,
                    siteId: target?.siteId || siteId,
                    placeable,
                    page
            });
            if (!resolvedRecord) return null;
            const app = new this({ record: resolvedRecord, sourceCover, presentation });
            app.render(true, { focus: true });
            return app;
        }

        const resolved = scene || (sceneId ? game.scenes.get(sceneId) || null : null);
        if (!resolved) return null;
        const app = new this({ scene: resolved, sourceCover, presentation });
        app.render(true, { focus: true });
        return app;
    }

    constructor({ scene = null, record = null, target = null, sourceCover = null, presentation = null } = {}, options = {}) {
        super(options);
        this.#scene = scene || null;
        this.#record = record ? SiteRecordManager.normalizeRecord(record) : null;
        this.#target = null;
        this.#sourceCover = this.#normalizeSourceCover(sourceCover || target);
        this.#presentation = this.#normalizePresentation(presentation || target);
        ConnectionDossierRefresh.watch(this);
        this.#connectionsChangedHook = () => this.refreshConnectionDossier();
        this.#playerAccessChangedHook = scene => {
            if (!scene || this.#isRelatedScene(scene)) this.refreshConnectionDossier();
        };
        this.#sceneUpdatedHook = scene => {
            if (this.#isRelatedScene(scene)) this.refreshConnectionDossier();
        };
        Hooks.on("augurNexusConnectionsChanged", this.#connectionsChangedHook);
        Hooks.on("augurNexusPlayerSceneAccessChanged", this.#playerAccessChangedHook);
        Hooks.on("updateScene", this.#sceneUpdatedHook);
    }

    async _prepareContext() {
        this.#scene = this.#scene?.id ? game.scenes.get(this.#scene.id) || this.#scene : this.#scene;
        this.#record = this.#refreshRecord();
        const target = this.#getTarget();
        this.#target = target;
        if (!this.#connectionsBoard) this.#connectionsBoard = new ConnectionsBoard({ target, isGM: game.user.isGM });
        else this.#connectionsBoard.setTarget(target);

        const journalPage = await JournalAssociationService.getJournalPage(target);
        const journalContent = await this.#enrichJournalContent(journalPage);
        const cover = this.#buildCover();
        const openScene = this.#buildOpenSceneModel();

        const model = {
            place: {
                name: target?.name || "Place",
                subtitle: this.#getSubtitle(),
                icon: this.#presentation?.iconSrc || target?.img || "",
                openSceneLabel: openScene.label,
                canOpenScene: openScene.visible,
                openSceneDisabled: openScene.disabled,
                openSceneTitle: openScene.title,
                openSceneUnavailableReason: openScene.unavailableReason || ""
            },
            journal: {
                hasPage: !!journalPage,
                entryId: journalPage?.parent?.id || "",
                pageId: journalPage?.id || "",
                content: journalContent,
                hasContent: !!String(journalPage?.text?.content || "").trim()
            },
            connections: {
                board: this.#connectionsBoard.getContext()
            },
            backgroundStyle: cover?.src ? `background-image: url('${cover.src}');` : "",
            isGM: game.user.isGM,
            canShowPlaceActions: game.user.isGM && this.#presentation?.actionMode !== "none"
        };
        this.#lastModel = model;
        return model;
    }

    _onRender(context, options) {
        super._onRender(context, options);
        if (this.window?.title) this.window.title.textContent = this.title;
        this.#connectionsBoard?.activateListeners(this.element, this);
        if (!this.#positionInitialized) {
            this.setPosition(this.#getCenteredPosition());
            this.#positionInitialized = true;
        }
    }

    async close(options) {
        ConnectionDossierRefresh.unwatch(this);
        if (this.#connectionsChangedHook) Hooks.off("augurNexusConnectionsChanged", this.#connectionsChangedHook);
        if (this.#playerAccessChangedHook) Hooks.off("augurNexusPlayerSceneAccessChanged", this.#playerAccessChangedHook);
        if (this.#sceneUpdatedHook) Hooks.off("updateScene", this.#sceneUpdatedHook);
        return super.close(options);
    }

    matchesConnectionDossierJournal({ entryId, pageId } = {}) {
        const journal = this.#lastModel?.journal || null;
        if (!journal?.entryId) return false;
        if (pageId) return journal.pageId === pageId;
        return journal.entryId === entryId;
    }

    refreshConnectionDossier() {
        if (this.rendered === false) return;
        this.render({ parts: ["content"] });
    }

    async #enrichJournalContent(page) {
        const content = page?.text?.content || "";
        if (!String(content).trim()) return "";
        try {
            return foundry.applications.ux.TextEditor.implementation.enrichHTML(content, {
                relativeTo: page,
                secrets: page.isOwner
            });
        } catch (err) {
            console.warn("Augur: Nexus | Failed to enrich place journal content.", err);
            return content;
        }
    }

    static async _onOpenPlaceScene(event, target) {
        const app = this;
        const unavailableReason = target?.dataset?.unavailableReason || "";
        if (unavailableReason) {
            await app.#showUnavailableSceneDialog(unavailableReason);
            return;
        }

        if (app.#record?.siteId) {
            if (!game.user.isGM) {
                await app.#viewLinkedSiteScene();
                return;
            }
            await app.close();
            await SiteMapManager.openSite({
                siteRecord: app.#record,
                parentSceneId: app.#record.parentSceneId,
                siteId: app.#record.siteId
            });
            return;
        }
        if (!app.#scene) return;
        if (!NexusPlayerSceneAccess.canUserViewScene(app.#scene)) {
            ui.notifications.warn("This scene is not currently available to view.");
            return;
        }
        await app.close();
        await app.#scene.view();
    }

    static async _onOpenPlaceActions(event, target) {
        const app = this;
        if (!game.user.isGM) return;
        const items = [{
            id: "edit-journal",
            label: "Edit Journal",
            icon: "fas fa-book-open",
            onSelect: () => app.#editJournal()
        }];

        if (app.#presentation?.actionMode !== "minimal") {
            items.push(
                {
                    id: "rename",
                    label: "Rename",
                    icon: "fas fa-pen",
                    onSelect: () => app.#renamePlace()
                },
                {
                    id: "change-icon",
                    label: "Change Icon",
                    icon: "fas fa-icons",
                    onSelect: () => app.#changeIcon()
                },
                {
                    id: "change-cover",
                    label: "Change Cover Image",
                    icon: "fas fa-image",
                    onSelect: () => app.#changeCoverImage(target)
                },
                {
                    id: "player-nexus-visibility",
                    label: `Visible To Players: ${app.#getPlayerVisibilityLabel()}`,
                    icon: "fas fa-eye",
                    onSelect: () => app.#openPlayerVisibilityMenu(target)
                },
                {
                    id: "player-view-access",
                    label: `Player Scene Open: ${app.#getPlayerViewAccessLabel()}`,
                    icon: "fas fa-door-open",
                    onSelect: () => app.#openPlayerViewAccessMenu(target)
                }
            );
        }

        openActionMenu({
            anchor: target,
            className: "place-preview-actions-menu",
            items
        });
    }

    static async _onCreateJournalPage() {
        const app = this;
        await app.#editJournal();
    }

    async #editJournal() {
        const page = await JournalAssociationService.getOrCreateJournalPage(this.#target || this.#getTarget());
        if (!page) {
            ui.notifications.warn("Could not create journal notes for this object.");
            return;
        }
        this.render({ parts: ["content"] });
        JournalAssociationService.openPage(page, { edit: true });
    }

    async #renamePlace() {
        if (!game.user.isGM) return;

        if (!this.#record?.siteId) {
            if (this.#scene) NexusSceneRenameDialog.show(this.#scene);
            return;
        }

        const nextName = await promptTextInput({
            title: "Rename Site",
            label: "Site Name",
            value: this.#record.siteName || "",
            confirmLabel: "Rename"
        });
        if (!nextName) return;

        const parentScene = SiteRecordManager.getParentScene(this.#record);
        if (!parentScene) return;

        const linkedScene = this.#getLinkedSiteScene();
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
        if (!game.user.isGM || (!this.#scene && !this.#record)) return;
        SiteCoverPicker.show({
            current: this.#getCoverImageSrc(),
            sourceCover: this.#sourceCover,
            onSelect: path => this.#setCoverImage(path || "")
        });
    }

    async #changeIcon() {
        if (!game.user.isGM || (!this.#scene && !this.#record)) return;
        const allBuiltInIcons = await SitePanel.getAllBuiltInIcons();
        const currentIconId = this.#record?.siteIcon || this.#getPlaceFlags().iconId || null;
        const currentIconSrc = this.#record?.siteIconSrc || this.#getPlaceFlags().iconSrc || "";
        const currentRole = this.#record?.siteIconRole || "landmark";

        new SiteIconPicker(allBuiltInIcons, currentIconId, currentRole, selection => {
            if (typeof selection === "object" && selection?.id === "custom") {
                void this.#setIcon({
                    iconId: "custom",
                    iconSrc: selection.src || ""
                });
                return;
            }

            const nextIcon = allBuiltInIcons.find(icon => icon.id === selection && (icon.role || "landmark") === currentRole)
                || allBuiltInIcons.find(icon => icon.id === selection)
                || null;
            void this.#setIcon({
                iconId: selection || null,
                iconSrc: nextIcon?.src || currentIconSrc || ""
            });
        }, {
            currentCustomIconSrc: currentIconId === "custom" ? currentIconSrc : "",
            allBuiltInIcons,
            showThemeIconsOnly: false,
            filterByRole: !!this.#record,
            themeIconsOnlyLabel: "Show Role Icons Only"
        }).render(true);
    }

    async #setIcon({ iconId = null, iconSrc = "" } = {}) {
        if (!game.user.isGM) return;
        if (this.#record?.siteId) {
            const parentScene = SiteRecordManager.getParentScene(this.#record);
            if (!parentScene) return;
            this.#record = SiteRecordManager.normalizeRecord({
                ...this.#record,
                siteIcon: iconId,
                siteIconSrc: iconSrc || ""
            }, { parentScene });
            await SiteRecordManager.upsertSceneRecord(parentScene, this.#record);
            await SiteRecordManager.syncRecordToVisuals(parentScene, this.#record);
            Hooks.callAll("augurNexusLineageChanged");
            this.render({ parts: ["content"] });
            return;
        }

        if (!this.#scene) return;
        await this.#scene.setFlag(MODULE_ID, "placePreview", {
            ...this.#getPlaceFlags(),
            iconId: iconId || null,
            iconSrc: iconSrc || ""
        });
        await NexusMarkerService.syncMarkersForTarget({
            kind: "nexus-scene",
            sceneId: this.#scene.id
        });
        Hooks.callAll("augurNexusLineageChanged");
        this.render({ parts: ["content"] });
    }

    async #setCoverImage(path) {
        if (!game.user.isGM) return;
        if (this.#record?.siteId) {
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
            return;
        }

        if (!this.#scene) return;
        await this.#scene.setFlag(MODULE_ID, "placePreview", {
            ...this.#getPlaceFlags(),
            coverImageSrc: path || ""
        });
        this.render({ parts: ["content"] });
    }

    #buildCover() {
        const sourceCover = this.#getSourceCover();
        if (this.#record?.siteId) {
            const src = this.#record.coverImageSrc
                || sourceCover?.src
                || this.#getAbstractCover(this.#record.siteId || this.#record.siteName || "site");
            return { src, isCustom: !!this.#record.coverImageSrc };
        }

        const flags = this.#getPlaceFlags();
        const src = flags.coverImageSrc
            || sourceCover?.src
            || this.#getAbstractCover(this.#scene?.id || this.#scene?.name || this.#target?.id || "place");
        return {
            src,
            isCustom: !!flags.coverImageSrc
        };
    }

    #getPlaceFlags() {
        return this.#scene?.getFlag(MODULE_ID, "placePreview") || {};
    }

    #getCoverImageSrc() {
        if (this.#record?.siteId) return this.#record.coverImageSrc || "";
        return this.#getPlaceFlags().coverImageSrc || "";
    }

    #refreshRecord() {
        if (!this.#record?.siteId) return null;
        const parentScene = SiteRecordManager.getParentScene(this.#record);
        return SiteRecordManager.resolveSite({ parentScene, siteId: this.#record.siteId }) || this.#record;
    }

    #getTarget() {
        if (this.#record?.siteId) return ConnectionTargetResolver.fromSiteRecord(this.#record);
        const flags = this.#getPlaceFlags();
        return {
            ...ConnectionTargetResolver.fromSceneReference({ sceneId: this.#scene?.id || null }),
            img: flags.iconSrc || "",
            subtitle: this.#getSubtitle()
        };
    }

    #getAbstractCover(seedValue = "") {
        return SiteCoverCatalog.getAbstractCover(seedValue || "place");
    }

    #getSourceCover() {
        if (this.#sourceCover?.src) return this.#sourceCover;
        if (this.#target?.sourceCoverSrc) return this.#normalizeSourceCover(this.#target);
        return null;
    }

    #normalizeSourceCover(sourceCover = null) {
        const src = String(sourceCover?.src || sourceCover?.sourceCoverSrc || "").trim();
        if (!src) return null;
        return {
            src,
            label: String(sourceCover?.label || sourceCover?.sourceCoverLabel || "Source Background").trim() || "Source Background"
        };
    }

    #normalizePresentation(presentation = null) {
        const actionMode = ["full", "minimal", "none"].includes(presentation?.actionMode) ? presentation.actionMode : "";
        return {
            iconSrc: String(presentation?.iconSrc || "").trim(),
            suppressActions: presentation?.suppressActions === true,
            actionMode: actionMode || (presentation?.suppressActions === true ? "none" : "full")
        };
    }

    #getSubtitle() {
        if (this.#record?.siteId) {
            return [this.#record.siteGenreLabel, this.#record.siteSceneTypeLabel].filter(Boolean).join(" - ") || "Nexus Site";
        }
        const lineage = this.#scene?.getFlag(MODULE_ID, "lineage") || {};
        const parent = lineage.parentSceneId ? game.scenes.get(lineage.parentSceneId) || null : null;
        if (parent) return `Scene - ${parent.name}`;
        return "Nexus Place";
    }

    #buildOpenSceneModel() {
        if (game.user.isGM) {
            return {
                visible: true,
                disabled: false,
                label: this.#record ? (this.#getLinkedSiteSceneId() ? "Open Site Scene" : "Create Site Scene") : "Open Scene",
                title: "",
                unavailableReason: ""
            };
        }

        const scene = this.#record ? this.#getLinkedSiteScene() : this.#scene;
        if (!scene) {
            return {
                visible: true,
                disabled: true,
                label: "Scene Not Created",
                title: "Ask the GM to open or generate this scene first.",
                unavailableReason: "missing-scene"
            };
        }

        const allowed = NexusPlayerSceneAccess.canUserViewScene(scene);
        if (!allowed) {
            return {
                visible: true,
                disabled: true,
                label: "Scene Locked",
                title: "Ask the GM to allow player viewing from this panel.",
                unavailableReason: "locked"
            };
        }

        return {
            visible: true,
            disabled: false,
            label: this.#record ? "View Site Scene" : "View Scene",
            title: "",
            unavailableReason: ""
        };
    }

    #getLinkedSiteSceneId() {
        return this.#record?.siteSceneId || this.#record?.linkedSceneId || null;
    }

    #getLinkedSiteScene() {
        const sceneId = this.#getLinkedSiteSceneId();
        return sceneId ? game.scenes.get(sceneId) || null : null;
    }

    #isRelatedScene(scene) {
        if (!scene?.id) return false;
        if (this.#scene?.id === scene.id) return true;
        return this.#getLinkedSiteSceneId() === scene.id;
    }

    async #viewLinkedSiteScene() {
        const scene = this.#getLinkedSiteScene();
        if (!scene || !NexusPlayerSceneAccess.canUserViewScene(scene)) {
            ui.notifications.warn("This site scene is not currently available to view.");
            return;
        }
        await this.close();
        await scene.view();
    }

    async #showUnavailableSceneDialog(reason) {
        if (reason === "missing-scene") {
            await showInfoDialog({
                title: "Scene Not Created",
                message: `
                    <p>This scene has not been created yet.</p>
                    <p>Ask the GM to open this panel and press <strong>Open/Create Scene</strong> once. After the scene exists, players can view it if Player Scene Open allows it.</p>
                `
            });
            return;
        }

        await showInfoDialog({
            title: "Scene Locked",
            message: `
                <p>This scene is not currently available for player viewing.</p>
                <p>Ask the GM to open this panel, use the <strong>...</strong> menu, and set <strong>Player Scene Open</strong> to <strong>Allowed</strong>.</p>
            `
        });
    }

    #getPlayerViewScene() {
        return this.#record ? this.#getLinkedSiteScene() : this.#scene;
    }

    #getPlayerViewAccessLabel() {
        return NexusPlayerSceneAccess.getSceneViewLabel(this.#getPlayerViewScene());
    }

    #getPlayerVisibilityScene() {
        return this.#record ? this.#getLinkedSiteScene() : this.#scene;
    }

    #getPlayerVisibilityOptions() {
        if (!this.#record?.siteId) return null;
        const parentScene = SiteRecordManager.getParentScene(this.#record);
        if (!parentScene) return null;
        return {
            scene: parentScene,
            siteId: this.#record.siteId,
            linkedScene: this.#getLinkedSiteScene(),
            record: this.#record
        };
    }

    #getPlayerVisibilityLabel() {
        const siteOptions = this.#getPlayerVisibilityOptions();
        if (siteOptions) return SiteSceneVisibilityManager.getSitePlayerVisibilityLabel(siteOptions);

        return NexusPlayerSceneAccess.getSceneNexusVisibilityLabel(this.#getPlayerVisibilityScene());
    }

    #getPlayerVisibilityIcon() {
        const siteOptions = this.#getPlayerVisibilityOptions();
        if (siteOptions) return SiteSceneVisibilityManager.getSitePlayerVisibilityIcon(siteOptions);

        return NexusPlayerSceneAccess.getNexusVisibilityIcon(
            NexusPlayerSceneAccess.getSceneNexusVisibilityOverride(this.#getPlayerVisibilityScene())
        );
    }

    #openPlayerVisibilityMenu(anchor) {
        const siteOptions = this.#getPlayerVisibilityOptions();
        const scene = this.#getPlayerVisibilityScene();
        if (!siteOptions && !scene) {
            ui.notifications.warn("Create or link a scene before setting player visibility.");
            return;
        }

        const current = siteOptions
            ? SiteSceneVisibilityManager.getSitePlayerVisibilityOverride(siteOptions)
            : NexusPlayerSceneAccess.getSceneNexusVisibilityOverride(scene);
        openActionMenu({
            anchor,
            className: "place-preview-player-access-menu",
            items: [
                {
                    id: "inherit",
                    label: current === "inherit" ? "Global (Current)" : "Global",
                    icon: "fas fa-layer-group",
                    onSelect: () => this.#setPlayerVisibility("inherit")
                },
                {
                    id: "show",
                    label: current === "show" ? "Yes (Current)" : "Yes",
                    icon: "fas fa-eye",
                    onSelect: () => this.#setPlayerVisibility("show")
                },
                {
                    id: "hide",
                    label: current === "hide" ? "No (Current)" : "No",
                    icon: "fas fa-eye-slash",
                    onSelect: () => this.#setPlayerVisibility("hide")
                },
                {
                    id: "change-global",
                    label: "Change Global Setting...",
                    icon: "fas fa-sliders",
                    onSelect: () => PlayerNexusVisibilityDialog.show()
                },
                {
                    id: "player-visibility-info",
                    label: "What's this?",
                    icon: "fas fa-circle-info",
                    onSelect: () => PlayerVisibilityInfoPanel.show("visibility")
                }
            ]
        });
    }

    async #setPlayerVisibility(value) {
        const siteOptions = this.#getPlayerVisibilityOptions();
        if (siteOptions) {
            await SiteSceneVisibilityManager.setSitePlayerVisibilityOverride({
                parentScene: siteOptions.scene,
                siteId: siteOptions.siteId,
                linkedScene: siteOptions.linkedScene,
                value
            });
            this.#record = SiteRecordManager.resolveSite({
                parentScene: siteOptions.scene,
                siteId: siteOptions.siteId
            }) || this.#record;
            this.render({ parts: ["content"] });
            return;
        }

        const scene = this.#getPlayerVisibilityScene();
        if (!scene) return;
        await NexusPlayerSceneAccess.setSceneNexusVisibilityOverride(scene, value);
        this.render({ parts: ["content"] });
    }

    #openPlayerViewAccessMenu(anchor) {
        const scene = this.#getPlayerViewScene();
        if (!scene) {
            ui.notifications.warn("Create or link a scene before setting player view access.");
            return;
        }

        const current = NexusPlayerSceneAccess.getSceneViewOverride(scene);
        openActionMenu({
            anchor,
            className: "place-preview-player-access-menu",
            items: [
                {
                    id: "inherit",
                    label: current === "inherit" ? "Global (Current)" : "Global",
                    icon: "fas fa-layer-group",
                    onSelect: () => this.#setPlayerViewAccess(scene, "inherit")
                },
                {
                    id: "allow",
                    label: current === "allow" ? "Allowed (Current)" : "Allowed",
                    icon: "fas fa-eye",
                    onSelect: () => this.#setPlayerViewAccess(scene, "allow")
                },
                {
                    id: "block",
                    label: current === "block" ? "Blocked (Current)" : "Blocked",
                    icon: "fas fa-eye-slash",
                    onSelect: () => this.#setPlayerViewAccess(scene, "block")
                },
                {
                    id: "change-global",
                    label: "Change Global Setting...",
                    icon: "fas fa-sliders",
                    onSelect: () => PlayerSceneOpenDialog.show()
                },
                {
                    id: "player-scene-open-info",
                    label: "What's this?",
                    icon: "fas fa-circle-info",
                    onSelect: () => PlayerVisibilityInfoPanel.show("sceneOpen")
                }
            ]
        });
    }

    async #setPlayerViewAccess(scene, value) {
        await NexusPlayerSceneAccess.setSceneViewOverride(scene, value);
        this.render({ parts: ["content"] });
    }

    #getCenteredPosition() {
        const width = Math.min(700, window.innerWidth - 40);
        const height = Math.max(620, Math.min(740, window.innerHeight - 40));
        return {
            width,
            height,
            left: 20,
            top: 72
        };
    }
}
