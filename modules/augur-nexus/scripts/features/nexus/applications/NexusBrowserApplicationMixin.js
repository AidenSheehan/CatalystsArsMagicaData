// Shared Nexus browser behavior for the floating tool and the sidebar tab.

import { confirmDestructiveAction, openActionMenu, promptTextInput } from "../../../api/ui.js";
import { NexusLineageManager } from "../services/NexusLineageManager.js";
import { NexusSceneDeletionCoordinator } from "../services/NexusSceneDeletionCoordinator.js";
import { NexusSceneFolderManager } from "../services/NexusSceneFolderManager.js";
import { NexusSceneOperations } from "../services/NexusSceneOperations.js";
import { NexusSceneNavigationManager } from "../services/NexusSceneNavigationManager.js";
import { NexusSceneTransitionEffects } from "../services/NexusSceneTransitionEffects.js";
import { NexusPlayerSceneAccess } from "../services/NexusPlayerSceneAccess.js";
import { NexusRootSceneCreationManager } from "../services/NexusRootSceneCreationManager.js";
import { NexusFloatingMenu } from "../services/NexusFloatingMenu.js";
import { NexusBrowserRefreshScheduler } from "../services/NexusBrowserRefreshScheduler.js";
import { NexusSceneRenameDialog } from "./NexusSceneRenameDialog.js";
import { PlayerSceneOpenDialog } from "./PlayerSceneOpenDialog.js";
import { PlayerNexusVisibilityDialog } from "./PlayerNexusVisibilityDialog.js";
import { PlayerConnectionVisibilityDialog } from "./PlayerConnectionVisibilityDialog.js";
import { PlayerNpcVisibilityDialog } from "./PlayerNpcVisibilityDialog.js";
import { PlayerVisibilityInfoPanel } from "./PlayerVisibilityInfoPanel.js";
import { PlacePreview } from "../../connections/applications/PlacePreview.js";
import { SiteMapManager } from "../../site/services/SiteMapManager.js";
import { SiteDeletionManager } from "../../site/services/SiteDeletionManager.js";
import { SiteRecordManager } from "../../site/services/SiteRecordManager.js";
import { SiteSceneVisibilityManager } from "../../site/services/SiteSceneVisibilityManager.js";
import { getSiteSceneType } from "../../site/registry/SiteSceneTypeRegistry.js";
import { ConnectionSidebarModel } from "../../connections/services/ConnectionSidebarModel.js";
import { ConnectionCategoryPicker } from "../../connections/applications/ConnectionCategoryPicker.js";
import { ConnectionCategories } from "../../connections/services/ConnectionCategories.js";
import { ConnectionDropResolver } from "../../connections/services/ConnectionDropResolver.js";
import { ConnectionStore } from "../../connections/services/ConnectionStore.js";
import { ConnectionTargetResolver } from "../../connections/services/ConnectionTargetResolver.js";
import { NpcCreateDialog } from "../../campaign-entities/applications/NpcCreateDialog.js";
import { FactionCreateDialog } from "../../campaign-entities/applications/FactionCreateDialog.js";
import { ShipCreateDialog } from "../../campaign-entities/applications/ShipCreateDialog.js";
import { FactionDirectoryModel } from "../../campaign-entities/services/FactionDirectoryModel.js";
import { NpcDirectoryModel } from "../../campaign-entities/services/NpcDirectoryModel.js";
import { ShipDirectoryModel } from "../../campaign-entities/services/ShipDirectoryModel.js";
import { CampaignEntityVisibilityManager } from "../../campaign-entities/services/CampaignEntityVisibilityManager.js";
import { deleteFaction, getFactionGenerators, openFactionDossier, updateFaction } from "../../../api/factions.js";
import { deleteNpc, getNpcGenerators, openNpcDossier, updateNpc } from "../../../api/npcs.js";
import { deleteShip, getShipGenerators, openShipDossier, updateShip } from "../../../api/ships.js";
import { LegacySciFiCompatibility } from "../../../support/compatibility/LegacySciFiCompatibility.js";

const SCIFI_MODULE_URL = "https://foundryvtt.com/packages/augur-scifi";
const PATREON_URL = "https://www.patreon.com/TheAugur";

const ROOT_SCENE_MENU_OPTIONS = [
    { id: "empty", label: "Empty Scene", icon: "fas fa-file", kind: "empty" },
    { id: "image", label: "From Image", icon: "fas fa-image", kind: "image" },
    { id: "instant-dungeons-generator", label: "Dungeon Generator", icon: "fas fa-dungeon", kind: "sceneType" },
    { id: "hexlands-generator", label: "Hexmap Generator", icon: "fas fa-cubes-stacked", kind: "sceneType" },
    { id: "augur-scifi-solar-system", label: "Solar System", icon: "fas fa-solar-system", kind: "sceneType" },
    { id: "augur-scifi-sector", label: "Sector Generator", icon: "fas fa-map", kind: "sceneType" }
];

export function NexusBrowserApplicationMixin(Base) {
    return class NexusBrowserApplication extends Base {
        static PARTS = {
            main: {
                template: "modules/augur-nexus/templates/nexus/nexus-panel.hbs"
            }
        };

        #expandedSceneIds = new Set();
        #activeNexusTab = "sites";
        #searchQuery = "";
        #peopleSearchQuery = "";
        #factionSearchQuery = "";
        #shipSearchQuery = "";
        #wasSearchFocused = false;
        #wasPeopleSearchFocused = false;
        #wasFactionSearchFocused = false;
        #wasShipSearchFocused = false;
        #siteSceneTypesChangedHook = null;
        #connectionsChangedHook = null;
        #playerAccessChangedHook = null;
        #campaignEntitiesChangedHook = null;
        #browserRefreshCallback = null;
        #expandedConnectionNodeIds = new Set();
        #lastLineageRows = [];

        resetNexusBrowserState() {
            this.#searchQuery = "";
            this.#wasSearchFocused = false;
        }

        #normalizeSearchQuery(query) {
            return (query || "").trim().toLocaleLowerCase();
        }

        #pruneExpandedSceneIds(rows) {
            const rowIds = new Set(rows.map(row => row.id));
            for (const sceneId of [...this.#expandedSceneIds]) {
                if (!rowIds.has(sceneId)) this.#expandedSceneIds.delete(sceneId);
            }
        }

        #pruneExpandedConnectionNodeIds(rows, extraNodeIds = []) {
            const nodeIds = new Set([
                ...rows.map(row => ConnectionSidebarModel.getNodeIdForLineageRow(row)).filter(Boolean),
                ...extraNodeIds.filter(Boolean)
            ]);
            for (const nodeId of [...this.#expandedConnectionNodeIds]) {
                if (!nodeIds.has(nodeId)) this.#expandedConnectionNodeIds.delete(nodeId);
            }
        }

        #getDescendantIds(sceneId, rows) {
            if (!sceneId) return [];
            const descendants = [];
            const childIdsByParent = new Map();
            for (const row of rows) {
                if (!row.parentNodeId) continue;
                const childIds = childIdsByParent.get(row.parentNodeId) || [];
                childIds.push(row.id);
                childIdsByParent.set(row.parentNodeId, childIds);
            }

            const visited = new Set();
            const visit = parentId => {
                if (visited.has(parentId)) return;
                visited.add(parentId);
                for (const childId of childIdsByParent.get(parentId) || []) {
                    descendants.push(childId);
                    visit(childId);
                }
            };
            visit(sceneId);
            return descendants;
        }

        #isSceneCollapsed(row) {
            return !!row?.hasChildren && !this.#expandedSceneIds.has(row.id);
        }

        #getCurrentSceneAncestorIds(currentScene, rows) {
            if (!currentScene) return new Set();

            const rowsById = new Map(rows.map(row => [row.id, row]));
            const ancestorIds = new Set();
            const visited = new Set();
            let parentId = rowsById.get(`scene:${currentScene.id}`)?.parentNodeId || null;
            while (parentId) {
                if (visited.has(parentId)) break;
                visited.add(parentId);
                ancestorIds.add(parentId);
                parentId = rowsById.get(parentId)?.parentNodeId || null;
            }
            return ancestorIds;
        }

        #toggleSceneCollapse(sceneId, rows) {
            if (!sceneId) return;
            const row = rows.find(candidate => candidate.id === sceneId);
            if (!row?.hasChildren) return;

            if (this.#expandedSceneIds.has(sceneId)) {
                this.#expandedSceneIds.delete(sceneId);
                for (const descendantId of this.#getDescendantIds(sceneId, rows)) {
                    this.#expandedSceneIds.delete(descendantId);
                }
            } else {
                this.#expandedSceneIds.add(sceneId);
            }
        }

        #collapseAllScenes() {
            this.#expandedSceneIds.clear();
        }

        #scheduleRender(reason = "browser-change") {
            NexusBrowserRefreshScheduler.schedule(reason);
        }

        #emptyDirectory() {
            return {
                rows: [],
                hasRows: false,
                isSearching: false,
                emptyLabel: ""
            };
        }

        #filterLineageRowsForUser(rows, user = game.user) {
            if (user?.isGM) return this.#recalculateLineageChildren(rows);

            const includedIds = new Set();
            const rowsById = new Map(rows.map(row => [row.id, row]));
            const visibleRows = [];

            for (const row of rows) {
                const parentIncluded = !row.parentNodeId || includedIds.has(row.parentNodeId);
                if (!parentIncluded) continue;

                const scene = row.sceneId ? game.scenes.get(row.sceneId) || null : null;
                const siteVisibility = this.#getRowSitePlayerVisibility(row);
                const visible = row.nodeKind === "scene"
                    ? NexusPlayerSceneAccess.canUserSeeSceneInNexus(scene, user)
                    : !!row.parentNodeId && rowsById.has(row.parentNodeId);
                if (!visible || (siteVisibility && !SiteSceneVisibilityManager.canUserSeeSite(siteVisibility.options, user))) continue;

                includedIds.add(row.id);
                visibleRows.push(row);
            }

            return this.#recalculateLineageChildren(visibleRows);
        }

        #recalculateLineageChildren(rows) {
            const childCounts = new Map();
            for (const row of rows) {
                if (!row.parentNodeId) continue;
                childCounts.set(row.parentNodeId, (childCounts.get(row.parentNodeId) || 0) + 1);
            }
            return rows.map(row => ({
                ...row,
                hasChildren: (childCounts.get(row.id) || 0) > 0
            }));
        }

        #getRowSitePlayerVisibility(row) {
            if (!row?.parentSceneId || !row?.siteId) return null;
            const parentScene = game.scenes.get(row.parentSceneId) || null;
            if (!parentScene) return null;

            const record = SiteRecordManager.getSceneRecord(parentScene, row.siteId);
            if (!record) return null;

            const linkedScene = row.sceneId ? game.scenes.get(row.sceneId) || null : null;
            const options = {
                scene: parentScene,
                siteId: row.siteId,
                linkedScene,
                record
            };
            const override = SiteSceneVisibilityManager.getSitePlayerVisibilityOverride(options);
            const isVisible = SiteSceneVisibilityManager.isSiteVisibleToPlayers(options);
            return {
                options,
                override,
                label: SiteSceneVisibilityManager.getSitePlayerVisibilityLabel(options),
                icon: SiteSceneVisibilityManager.getSitePlayerVisibilityIcon(options),
                isHidden: !isVisible
            };
        }

        #getRowPlayerVisibility(row) {
            const siteVisibility = this.#getRowSitePlayerVisibility(row);
            if (siteVisibility) return siteVisibility;

            const scene = row?.sceneId ? game.scenes.get(row.sceneId) || null : null;
            if (!scene) return null;

            const override = NexusPlayerSceneAccess.getSceneNexusVisibilityOverride(scene);
            const isVisible = NexusPlayerSceneAccess.isNexusVisibilityVisible(override);
            return {
                options: { scene },
                override,
                label: NexusPlayerSceneAccess.getNexusVisibilityLabel(override),
                icon: NexusPlayerSceneAccess.getNexusVisibilityIcon(override),
                isHidden: !isVisible
            };
        }

        #toggleConnectionDrawer(nodeId) {
            if (!nodeId) return;
            if (this.#expandedConnectionNodeIds.has(nodeId)) {
                this.#expandedConnectionNodeIds.delete(nodeId);
            } else {
                this.#expandedConnectionNodeIds.add(nodeId);
            }
        }

        #getConnectionTargetFromElement(element) {
            const row = element?.closest?.(".nexus-browser-pill-shell") || element;
            if (!row) return null;
            if (row.dataset.entityId) {
                return ConnectionTargetResolver.fromEntityReference({ entityId: row.dataset.entityId });
            }
            if (row.dataset.parentSceneId && row.dataset.siteId) {
                const parentScene = game.scenes.get(row.dataset.parentSceneId) || null;
                const siteRecord = parentScene ? SiteRecordManager.resolveSite({ parentScene, siteId: row.dataset.siteId }) : null;
                if (!siteRecord && row.dataset.sceneId) {
                    return ConnectionTargetResolver.fromSceneReference({ sceneId: row.dataset.sceneId });
                }
                return ConnectionTargetResolver.fromSiteReference({
                    parentSceneId: row.dataset.parentSceneId,
                    siteId: row.dataset.siteId
                });
            }
            if (row.dataset.sceneId) return ConnectionTargetResolver.fromSceneReference({ sceneId: row.dataset.sceneId });
            return null;
        }

        async #handleConnectionDrop(event, targetElement) {
            if (!game.user.isGM) return;
            const sourceTarget = this.#getConnectionTargetFromElement(targetElement);
            if (!sourceTarget) return;
            const targetNodeId = ConnectionTargetResolver.getNodeId(sourceTarget);
            const rawConnection = event.dataTransfer?.getData("application/x-augur-connection-row") || "";
            if (rawConnection) {
                try {
                    const payload = JSON.parse(rawConnection);
                    if (payload.sourceNodeId && payload.sourceNodeId !== targetNodeId) {
                        // Treat cross-surface drops as copying the connected object, not moving its old edge.
                    } else {
                        const targetCategoryId = targetElement?.closest?.("[data-connection-category-id]")?.dataset?.connectionCategoryId || "";
                        if (payload.edgeId && targetCategoryId && targetCategoryId !== payload.categoryId) {
                            const category = ConnectionCategories.get(targetCategoryId, ConnectionStore.getCustomCategories());
                            await ConnectionStore.setConnectionViewForNode(payload.edgeId, targetNodeId, { category: category.id });
                            return;
                        }

                        const beforeEdgeId = event.target?.closest?.("[data-connection-edge-id]")?.dataset?.connectionEdgeId || null;
                        if (payload.edgeId && payload.sourceNodeId) {
                            await ConnectionStore.reorderConnectionForNode(payload.edgeId, payload.sourceNodeId, beforeEdgeId);
                        }
                        return;
                    }
                } catch (_err) {
                    ui.notifications.warn("Could not reorder that connection.");
                    return;
                }
            }

            const relatedTarget = await ConnectionDropResolver.fromEvent(event);
            if (!relatedTarget) {
                ui.notifications.warn("Drop an Actor, Item, Journal, Journal Page, or Nexus place to connect it.");
                return;
            }
            const targetCategoryId = targetElement?.closest?.("[data-connection-category-id]")?.dataset?.connectionCategoryId || "";
            const category = targetCategoryId ? ConnectionCategories.get(targetCategoryId, ConnectionStore.getCustomCategories()) : null;
            const edge = await ConnectionStore.addConnection(sourceTarget, relatedTarget, category ? {
                category: category.id,
                role: category.custom ? category.label : ConnectionCategories.roleFor(category.id)
            } : {});
            if (edge) {
                this.#expandedConnectionNodeIds.add(ConnectionTargetResolver.getNodeId(sourceTarget));
                this.#scheduleRender("connection-added");
            }
        }

        #getNexusNodeDropPayload(event) {
            for (const type of ["application/json", "text/plain"]) {
                const raw = event.dataTransfer?.getData(type) || "";
                if (!raw) continue;
                try {
                    const payload = JSON.parse(raw);
                    if (payload?.type === "AugurNexusNode") return payload;
                } catch (_err) {
                    // Ignore unrelated drag payloads.
                }
            }
            return null;
        }

        #canAcceptLineageDrop(event) {
            return false;
        }

        #getLineageDropTargetScene(row) {
            if (!row?.classList?.contains("nexus-browser-pill-shell")) return null;
            if (row.dataset.entityId) return null;
            if (row.dataset.nodeKind === "pending-site") return null;
            const sceneId = row.dataset.sceneId || "";
            return sceneId ? game.scenes.get(sceneId) || null : null;
        }

        async #handleLineageDrop(event, targetRow) {
            ui.notifications.info("Moving Nexus branches by drag-and-drop is temporarily disabled.");
            return;
            if (!game.user.isGM) return;
            const payload = this.#getNexusNodeDropPayload(event);
            const sourceScene = payload?.sceneId ? game.scenes.get(payload.sceneId) || null : null;
            const targetScene = this.#getLineageDropTargetScene(targetRow);

            if (!sourceScene || !targetScene) {
                ui.notifications.warn("Drop a scene or linked site pill onto another scene pill to move its Nexus branch.");
                return;
            }

            const validation = NexusLineageManager.validateSceneParent(sourceScene, { parentSceneId: targetScene.id });
            if (!validation.valid) {
                ui.notifications.warn(`${validation.message || "That move would break the Nexus tree."} Place a marker on the canvas instead for exits or backlinks.`);
                return;
            }

            const childCount = Math.max(0, NexusLineageManager.collectSceneBranch(sourceScene).length - 1);
            const sourceName = foundry.utils.escapeHTML(sourceScene.name);
            const targetName = foundry.utils.escapeHTML(targetScene.name);
            const confirmed = await foundry.applications.api.DialogV2.confirm({
                window: { title: "Move Nexus Branch" },
                content: `<p>Move <strong>${sourceName}</strong>${childCount ? ` and ${childCount} child scene${childCount === 1 ? "" : "s"}` : ""} under <strong>${targetName}</strong>?</p>`,
                rejectClose: false,
                modal: true,
                yes: { label: "Move Branch", icon: "fa-solid fa-code-branch" },
                no: { label: "Cancel" }
            });
            if (!confirmed) return;

            try {
                await NexusSceneNavigationManager.setSceneNavigation(sourceScene, {
                    parentSceneId: targetScene.id,
                    parentSiteId: null,
                    transitionStyle: "scene-default",
                    transitionContext: {}
                });
                await NexusSceneFolderManager.placeExistingSceneInParentFolder(targetScene, sourceScene, { autoSort: true });
                Hooks.callAll("augurNexusLineageChanged");
                ui.notifications.info(`Moved "${sourceScene.name}" under "${targetScene.name}".`);
                this.render();
            } catch (err) {
                console.error(err);
                ui.notifications.error(err?.message || "Failed to move the Nexus branch.");
            }
        }

        #openConnectionRowActions(button) {
            if (!game.user.isGM) return;
            const edgeId = button.dataset.connectionEdgeId || "";
            const nodeId = button.dataset.connectionNodeId || "";
            const currentNodeId = button.closest(".nexus-browser-connection-drawer")?.dataset?.connectionTargetId || "";
            if (!edgeId) return;
            const edge = ConnectionStore.getConnectionEdge(edgeId);
            if (!edge) return;
            const hasNote = !!String(ConnectionStore.getConnectionNoteForNode(edge, currentNodeId) || "").trim();

            openActionMenu({
                anchor: button,
                className: "connections-card-actions-menu",
                items: [
                    {
                        id: "player-visibility",
                        label: `Visible To Players: ${ConnectionStore.getConnectionPlayerVisibilityLabel(edge)}`,
                        icon: ConnectionStore.getConnectionPlayerVisibilityIcon(edge),
                        onSelect: () => this.#openSidebarConnectionVisibilityMenu(button, edgeId)
                    },
                    {
                        id: "open",
                        label: "Open",
                        icon: "fas fa-up-right-from-square",
                        onSelect: async () => {
                            const node = ConnectionStore.getNode(nodeId);
                            await ConnectionTargetResolver.openNode(node);
                        }
                    },
                    {
                        id: "edit-note",
                        label: hasNote ? "Edit Note..." : "Add Note...",
                        icon: "fas fa-note-sticky",
                        onSelect: () => this.#editSidebarConnectionNote(edgeId, currentNodeId)
                    },
                    {
                        id: "change-role",
                        label: "Edit Role...",
                        icon: "fas fa-pen-to-square",
                        onSelect: () => this.#editSidebarConnectionRole(edgeId, currentNodeId)
                    },
                    {
                        id: "change-category",
                        label: "Change Category...",
                        icon: "fas fa-tags",
                        onSelect: () => this.#openSidebarCategoryPicker(edgeId, currentNodeId)
                    },
                    {
                        id: "remove",
                        label: "Remove Connection",
                        icon: "fas fa-trash",
                        danger: true,
                        onSelect: async () => {
                            await ConnectionStore.removeConnection(edgeId);
                        }
                    }
                ]
            });
        }

        #openSidebarConnectionVisibilityMenu(anchor, edgeId) {
            const edge = ConnectionStore.getConnectionEdge(edgeId);
            if (!edge) return;

            const current = ConnectionStore.getConnectionPlayerVisibility(edge);
            openActionMenu({
                anchor,
                className: "connections-card-actions-menu",
                items: [
                    {
                        id: "inherit",
                        label: current === "inherit" ? "Global (Current)" : "Global",
                        icon: "fas fa-layer-group",
                        onSelect: () => this.#setSidebarConnectionVisibility(edgeId, "inherit")
                    },
                    {
                        id: "show",
                        label: current === "show" ? "Yes (Current)" : "Yes",
                        icon: "fas fa-eye",
                        onSelect: () => this.#setSidebarConnectionVisibility(edgeId, "show")
                    },
                    {
                        id: "hide",
                        label: current === "hide" ? "No (Current)" : "No",
                        icon: "fas fa-eye-slash",
                        onSelect: () => this.#setSidebarConnectionVisibility(edgeId, "hide")
                    },
                    {
                        id: "change-global",
                        label: "Change Global Setting...",
                        icon: "fas fa-sliders",
                        onSelect: () => PlayerConnectionVisibilityDialog.show()
                    },
                    {
                        id: "player-visibility-info",
                        label: "What's this?",
                        icon: "fas fa-circle-info",
                        onSelect: () => PlayerVisibilityInfoPanel.show("connectionVisibility")
                    }
                ]
            });
        }

        async #setSidebarConnectionVisibility(edgeId, value) {
            await ConnectionStore.setConnectionPlayerVisibility(edgeId, value);
        }

        #openConnectionGroupActions(button) {
            if (!game.user.isGM) return;
            const drawer = button.closest(".nexus-browser-connection-drawer");
            const nodeId = button.dataset.connectionTargetId || drawer?.dataset?.connectionTargetId || "";
            const categoryId = button.dataset.connectionCategoryId || "";
            if (!nodeId || !categoryId) return;

            const hidden = ConnectionStore.isCategoryGroupHiddenForNode(nodeId, categoryId);
            openActionMenu({
                anchor: button,
                className: "connections-card-actions-menu",
                items: [
                    {
                        id: "toggle-group-visibility",
                        label: hidden ? "Show Group To Players" : "Hide Group From Players",
                        icon: hidden ? "fas fa-eye" : "fas fa-eye-slash",
                        onSelect: async () => {
                            await ConnectionStore.toggleCategoryGroupHiddenForNode(nodeId, categoryId);
                        }
                    }
                ]
            });
        }

        async #editSidebarConnectionRole(edgeId, nodeId) {
            const edge = ConnectionStore.getConnectionEdge(edgeId);
            if (!edge) return;
            const view = ConnectionStore.getConnectionView(edge, nodeId);
            const role = await promptTextInput({
                title: "Connection Role",
                label: "Role",
                value: view.role || ConnectionCategories.roleFor(view.category),
                placeholder: "Contact, Threat, Hidden Item...",
                confirmLabel: "Save",
                allowEmpty: false,
                emptyMessage: "Role cannot be empty."
            });
            if (role === null) return;
            await ConnectionStore.setConnectionViewForNode(edgeId, nodeId, { role });
        }

        async #editSidebarConnectionNote(edgeId, nodeId) {
            const edge = ConnectionStore.getConnectionEdge(edgeId);
            if (!edge) return;
            const note = await this.#promptSidebarConnectionNote(ConnectionStore.getConnectionNoteForNode(edge, nodeId) || "");
            if (note === null) return;
            await ConnectionStore.setConnectionViewForNode(edgeId, nodeId, { note });
        }

        async #promptSidebarConnectionNote(value = "") {
            const inputId = `augur-sidebar-connection-note-${foundry.utils.randomID()}`;
            const current = String(value || "");
            const safeValue = foundry.utils.escapeHTML(current);
            const result = await foundry.applications.api.DialogV2.wait({
                window: { title: "Connection Note" },
                position: { width: 430 },
                modal: true,
                rejectClose: false,
                content: `
                    <div class="nexus-text-prompt-form">
                        <label for="${inputId}">Add context for this connection.</label>
                        <input id="${inputId}" type="text" value="${safeValue}" placeholder="Why does this connection matter?" autocomplete="off">
                    </div>
                `,
                buttons: [
                    {
                        action: "confirm",
                        label: "Save",
                        icon: "fa-solid fa-check",
                        default: true,
                        callback: () => document.getElementById(inputId)?.value?.trim() || ""
                    },
                    ...(current.trim() ? [{
                        action: "clear",
                        label: "Clear",
                        icon: "fa-solid fa-eraser",
                        callback: () => ""
                    }] : []),
                    {
                        action: "cancel",
                        label: "Cancel",
                        icon: "fa-solid fa-xmark",
                        callback: () => null
                    }
                ],
                render: (_event, dialog) => {
                    const input = dialog.element?.querySelector?.(`#${CSS.escape(inputId)}`);
                    input?.addEventListener("keydown", event => {
                        if (event.key !== "Enter") return;
                        event.preventDefault();
                        dialog.element?.querySelector("button[data-action='confirm']")?.click();
                    });
                    requestAnimationFrame(() => {
                        input?.focus({ preventScroll: true });
                        input?.select();
                    });
                }
            });
            return typeof result === "string" && result !== "cancel" ? result : null;
        }

        async #openSidebarCategoryPicker(edgeId, nodeId) {
            const edge = ConnectionStore.getConnectionEdge(edgeId);
            if (!edge) return;
            const currentCategoryId = ConnectionStore.getConnectionCategoryForNode(edge, nodeId, ConnectionStore.getCustomCategories());
            const categoryId = await ConnectionCategoryPicker.choose({ currentCategoryId });
            if (!categoryId) return;
            await ConnectionCategoryPicker.assignEdgeCategory(edgeId, categoryId, { nodeId });
        }

        #closeSceneOptionsMenus(rootElement) {
            rootElement?.querySelectorAll("[data-action='toggleSceneOptions'][aria-expanded='true']").forEach(button => {
                button.setAttribute("aria-expanded", "false");
            });
            NexusFloatingMenu.close();
        }

        #closeFloatingMenus(rootElement) {
            this.#closeSceneOptionsMenus(rootElement);
            rootElement?.querySelector("[data-action='toggleRootSceneMenu']")?.setAttribute("aria-expanded", "false");
        }

        async #renameLineageScene(sceneId) {
            const scene = sceneId ? game.scenes.get(sceneId) : null;
            if (!scene) return;
            NexusSceneRenameDialog.show(scene);
        }

        async #configureLineageScene(sceneId) {
            const scene = sceneId ? game.scenes.get(sceneId) : null;
            if (!scene?.sheet) return;
            scene.sheet.render({ force: true });
        }

        async #deleteLineageScene(sceneId) {
            const scene = sceneId ? game.scenes.get(sceneId) : null;
            if (!scene) return;

            try {
                await NexusSceneDeletionCoordinator.deleteSceneBranch(scene);
            } catch (err) {
                console.error(err);
                ui.notifications.error("Failed to delete the selected Nexus branch.");
            }
        }

        async #deleteLineageSite({ parentSceneId = null, siteId = null, journalEntryId = null, pageId = null } = {}) {
            const parentScene = parentSceneId ? game.scenes.get(parentSceneId) || null : null;
            const siteRecord = parentScene ? SiteRecordManager.resolveSite({
                parentScene,
                siteId,
                journalEntryId,
                pageId
            }) : null;
            if (!parentScene || !siteId) return;

            try {
                const siteName = siteRecord?.siteName || "Site";
                const linkedSceneId = siteRecord?.siteSceneId || siteRecord?.linkedSceneId || null;
                if (!linkedSceneId || !game.scenes.get(linkedSceneId)) {
                    const confirmed = await confirmDestructiveAction({
                        title: "Delete Site",
                        subject: siteName,
                        message: `Delete site <strong>${foundry.utils.escapeHTML(siteName)}</strong>?`,
                        warning: "This removes the Site record, journal page, connections, and markers that point to it.",
                        confirmLabel: "Delete Site"
                    });
                    if (!confirmed) return;
                }
                await SiteDeletionManager.deleteSiteIdentity({
                    parentScene,
                    siteId,
                    journalEntryId,
                    pageId,
                    siteName
                });
            } catch (err) {
                console.error(err);
                ui.notifications.error("Failed to delete the selected site.");
            }
        }

        async #setLineageScenePlayerViewAccess(sceneId, value) {
            const scene = sceneId ? game.scenes.get(sceneId) : null;
            if (!scene) return;
            await NexusPlayerSceneAccess.setSceneViewOverride(scene, value);
            this.render();
        }

        async #setLineageSceneNexusVisibility(sceneId, value) {
            const scene = sceneId ? game.scenes.get(sceneId) : null;
            if (!scene) return;
            await NexusPlayerSceneAccess.setSceneNexusVisibilityOverride(scene, value);
            this.render();
        }

        async #setLineagePlayerVisibility({ sceneId = null, parentSceneId = null, siteId = null } = {}, value = "inherit") {
            const parentScene = parentSceneId ? game.scenes.get(parentSceneId) || null : null;
            const linkedScene = sceneId ? game.scenes.get(sceneId) || null : null;
            if (parentScene && siteId) {
                await SiteSceneVisibilityManager.setSitePlayerVisibilityOverride({
                    parentScene,
                    siteId,
                    linkedScene,
                    value
                });
                this.render();
                return;
            }

            await this.#setLineageSceneNexusVisibility(sceneId, value);
        }

        #openLineagePlayerViewAccessMenu(anchor, sceneId) {
            const scene = sceneId ? game.scenes.get(sceneId) : null;
            if (!scene) return;

            const current = NexusPlayerSceneAccess.getSceneViewOverride(scene);
            NexusFloatingMenu.open({
                anchor,
                className: "nexus-scene-player-access-menu",
                onClose: () => anchor.setAttribute("aria-expanded", "false"),
                items: [
                    {
                        id: "inherit",
                        label: current === "inherit" ? "Global (Current)" : "Global",
                        icon: "fas fa-layer-group",
                        onSelect: () => this.#setLineageScenePlayerViewAccess(sceneId, "inherit")
                    },
                    {
                        id: "allow",
                        label: current === "allow" ? "Allowed (Current)" : "Allowed",
                        icon: "fas fa-eye",
                        onSelect: () => this.#setLineageScenePlayerViewAccess(sceneId, "allow")
                    },
                    {
                        id: "block",
                        label: current === "block" ? "Blocked (Current)" : "Blocked",
                        icon: "fas fa-eye-slash",
                        onSelect: () => this.#setLineageScenePlayerViewAccess(sceneId, "block")
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

        #openLineageNexusVisibilityMenu(anchor, { sceneId = null, parentSceneId = null, siteId = null } = {}) {
            const scene = sceneId ? game.scenes.get(sceneId) : null;
            const parentScene = parentSceneId ? game.scenes.get(parentSceneId) || null : null;
            if (!scene && (!parentScene || !siteId)) return;

            const current = parentScene && siteId
                ? SiteSceneVisibilityManager.getSitePlayerVisibilityOverride({ scene: parentScene, siteId, linkedScene: scene })
                : NexusPlayerSceneAccess.getSceneNexusVisibilityOverride(scene);
            const target = { sceneId, parentSceneId, siteId };
            NexusFloatingMenu.open({
                anchor,
                className: "nexus-scene-player-access-menu",
                onClose: () => anchor.setAttribute("aria-expanded", "false"),
                items: [
                    {
                        id: "inherit",
                        label: current === "inherit" ? "Global (Current)" : "Global",
                        icon: "fas fa-layer-group",
                        onSelect: () => this.#setLineagePlayerVisibility(target, "inherit")
                    },
                    {
                        id: "show",
                        label: current === "show" ? "Yes (Current)" : "Yes",
                        icon: "fas fa-eye",
                        onSelect: () => this.#setLineagePlayerVisibility(target, "show")
                    },
                    {
                        id: "hide",
                        label: current === "hide" ? "No (Current)" : "No",
                        icon: "fas fa-eye-slash",
                        onSelect: () => this.#setLineagePlayerVisibility(target, "hide")
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

        #openSceneOptionsMenu(button, rootElement) {
            const sceneId = button.dataset.sceneId;
            const scene = sceneId ? game.scenes.get(sceneId) : null;
            const parentSceneId = button.dataset.parentSceneId || null;
            const siteId = button.dataset.siteId || null;
            const items = [];

            if (scene || (parentSceneId && siteId)) {
                const visibilityLabel = button.dataset.playerVisibilityLabel
                    || (scene ? NexusPlayerSceneAccess.getSceneNexusVisibilityLabel(scene) : "Global");
                items.push({
                    id: "player-nexus-visibility",
                    label: `Visible To Players: ${visibilityLabel}`,
                    icon: button.dataset.playerVisibilityIcon || "fas fa-sitemap",
                    onSelect: () => this.#openLineageNexusVisibilityMenu(button, { sceneId, parentSceneId, siteId })
                });
            }
            if (scene) {
                items.push({
                    id: "player-view-access",
                    label: `Player Scene Open: ${NexusPlayerSceneAccess.getSceneViewLabel(scene)}`,
                    icon: "fas fa-door-open",
                    onSelect: () => this.#openLineagePlayerViewAccessMenu(button, sceneId)
                });
            }
            if (button.dataset.canRename === "true") {
                items.push({
                    id: "rename",
                    label: "Rename",
                    icon: "fas fa-pen",
                    onSelect: () => this.#renameLineageScene(sceneId)
                });
            }
            if (button.dataset.canConfigure === "true") {
                items.push({
                    id: "configure",
                    label: "Configure",
                    icon: "fas fa-cog",
                    onSelect: () => this.#configureLineageScene(sceneId)
                });
            }
            if (button.dataset.canDelete === "true") {
                const isSiteOnly = !scene && parentSceneId && siteId;
                items.push({
                    id: "delete",
                    label: isSiteOnly ? "Delete Site" : "Delete Branch",
                    status: "Permanent",
                    icon: "fas fa-skull-crossbones",
                    danger: true,
                    className: "permanent-danger",
                    onSelect: () => isSiteOnly
                        ? this.#deleteLineageSite({
                            parentSceneId,
                            siteId,
                            journalEntryId: button.dataset.journalEntryId || null,
                            pageId: button.dataset.pageId || null
                        })
                        : this.#deleteLineageScene(sceneId)
                });
            }

            if (!items.length) return;
            this.#closeFloatingMenus(rootElement);
            button.setAttribute("aria-expanded", "true");
            NexusFloatingMenu.open({
                anchor: button,
                items,
                className: "nexus-scene-options-menu",
                onClose: () => button.setAttribute("aria-expanded", "false")
            });
        }

        #openNpcOptionsMenu(button, rootElement) {
            if (!game.user.isGM) return;
            const entityId = button.dataset.entityId || "";
            if (!entityId) return;
            this.#closeFloatingMenus(rootElement);
            const row = this.#getPeopleRows().find(candidate => candidate.entityId === entityId);
            const visibilityLabel = button.dataset.playerVisibilityLabel || row?.playerVisibilityLabel || "Global";
            openActionMenu({
                anchor: button,
                className: "nexus-scene-options-menu",
                items: [
                    {
                        id: "player-npc-visibility",
                        label: `Visible To Players: ${visibilityLabel}`,
                        icon: button.dataset.playerVisibilityIcon || row?.playerVisibilityIcon || "fas fa-layer-group",
                        onSelect: () => this.#openEntityVisibilityMenu(button, entityId, "npc")
                    },
                    {
                        id: "rename",
                        label: "Rename",
                        icon: "fas fa-pen",
                        onSelect: () => this.#renameNpc(entityId)
                    },
                    {
                        id: "delete",
                        label: "Delete Person",
                        status: "Permanent",
                        icon: "fas fa-skull-crossbones",
                        danger: true,
                        className: "permanent-danger",
                        onSelect: () => this.#deleteNpc(entityId)
                    }
                ]
            });
        }

        #openEntityVisibilityMenu(anchor, entityId, entityType = "npc") {
            if (!game.user.isGM || !entityId) return;
            const type = CampaignEntityVisibilityManager.normalizeEntityType(entityType);
            const row = this.#getEntityRows(type).find(candidate => candidate.entityId === entityId);
            const current = CampaignEntityVisibilityManager.normalizePlayerVisibility(row?.playerVisibilityValue || "inherit");
            openActionMenu({
                anchor,
                className: "nexus-scene-player-access-menu",
                items: [
                    {
                        id: "inherit",
                        label: current === "inherit" ? "Global (Current)" : "Global",
                        icon: "fas fa-layer-group",
                        onSelect: () => this.#setEntityPlayerVisibility(entityId, type, "inherit")
                    },
                    {
                        id: "show",
                        label: current === "show" ? "Yes (Current)" : "Yes",
                        icon: "fas fa-eye",
                        onSelect: () => this.#setEntityPlayerVisibility(entityId, type, "show")
                    },
                    {
                        id: "hide",
                        label: current === "hide" ? "No (Current)" : "No",
                        icon: "fas fa-eye-slash",
                        onSelect: () => this.#setEntityPlayerVisibility(entityId, type, "hide")
                    },
                    {
                        id: "change-global",
                        label: "Change Global Setting...",
                        icon: "fas fa-sliders",
                        onSelect: () => PlayerNpcVisibilityDialog.show(type)
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

        async #setEntityPlayerVisibility(entityId, entityType, value) {
            await CampaignEntityVisibilityManager.setPlayerVisibilityOverride(entityId, entityType, value);
            this.render();
        }

        async #renameNpc(entityId) {
            if (!game.user.isGM || !entityId) return;
            const row = this.#getPeopleRows().find(candidate => candidate.entityId === entityId);
            const name = await promptTextInput({
                title: "Rename Person",
                label: "Name",
                value: row?.name || "",
                confirmLabel: "Rename"
            });
            if (!name) return;
            await updateNpc(entityId, { display: { name } });
            this.render();
        }

        async #deleteNpc(entityId) {
            if (!game.user.isGM || !entityId) return;
            const row = this.#getPeopleRows().find(candidate => candidate.entityId === entityId);
            const safeName = foundry.utils.escapeHTML(row?.name || "this person");
            const confirmed = await foundry.applications.api.DialogV2.confirm({
                window: { title: "Delete Person" },
                content: `<p>Delete <strong>${safeName}</strong>?</p>`,
                modal: true,
                rejectClose: false,
                yes: { label: "Delete" },
                no: { label: "Cancel" }
            });
            if (!confirmed) return;
            await deleteNpc(entityId);
            this.render();
        }

        #openFactionOptionsMenu(button, rootElement) {
            if (!game.user.isGM) return;
            const entityId = button.dataset.entityId || "";
            if (!entityId) return;
            this.#closeFloatingMenus(rootElement);
            const row = this.#getFactionRows().find(candidate => candidate.entityId === entityId);
            const visibilityLabel = button.dataset.playerVisibilityLabel || row?.playerVisibilityLabel || "Global";
            openActionMenu({
                anchor: button,
                className: "nexus-scene-options-menu",
                items: [
                    {
                        id: "player-faction-visibility",
                        label: `Visible To Players: ${visibilityLabel}`,
                        icon: button.dataset.playerVisibilityIcon || row?.playerVisibilityIcon || "fas fa-layer-group",
                        onSelect: () => this.#openEntityVisibilityMenu(button, entityId, "faction")
                    },
                    {
                        id: "rename",
                        label: "Rename",
                        icon: "fas fa-pen",
                        onSelect: () => this.#renameFaction(entityId)
                    },
                    {
                        id: "delete",
                        label: "Delete Organization",
                        status: "Permanent",
                        icon: "fas fa-skull-crossbones",
                        danger: true,
                        className: "permanent-danger",
                        onSelect: () => this.#deleteFaction(entityId)
                    }
                ]
            });
        }

        async #renameFaction(entityId) {
            if (!game.user.isGM || !entityId) return;
            const row = this.#getFactionRows().find(candidate => candidate.entityId === entityId);
            const name = await promptTextInput({
                title: "Rename Organization",
                label: "Name",
                value: row?.name || "",
                confirmLabel: "Rename"
            });
            if (!name) return;
            await updateFaction(entityId, { display: { name } });
            this.render();
        }

        async #deleteFaction(entityId) {
            if (!game.user.isGM || !entityId) return;
            const row = this.#getFactionRows().find(candidate => candidate.entityId === entityId);
            const safeName = foundry.utils.escapeHTML(row?.name || "this organization");
            const confirmed = await foundry.applications.api.DialogV2.confirm({
                window: { title: "Delete Organization" },
                content: `<p>Delete <strong>${safeName}</strong>?</p>`,
                modal: true,
                rejectClose: false,
                yes: { label: "Delete" },
                no: { label: "Cancel" }
            });
            if (!confirmed) return;
            await deleteFaction(entityId);
            this.render();
        }

        #openShipOptionsMenu(button, rootElement) {
            if (!game.user.isGM) return;
            const entityId = button.dataset.entityId || "";
            if (!entityId) return;
            this.#closeFloatingMenus(rootElement);
            const row = this.#getShipRows().find(candidate => candidate.entityId === entityId);
            const visibilityLabel = button.dataset.playerVisibilityLabel || row?.playerVisibilityLabel || "Global";
            openActionMenu({
                anchor: button,
                className: "nexus-scene-options-menu",
                items: [
                    {
                        id: "player-ship-visibility",
                        label: `Visible To Players: ${visibilityLabel}`,
                        icon: button.dataset.playerVisibilityIcon || row?.playerVisibilityIcon || "fas fa-layer-group",
                        onSelect: () => this.#openEntityVisibilityMenu(button, entityId, "ship")
                    },
                    { id: "rename", label: "Rename", icon: "fas fa-pen", onSelect: () => this.#renameShip(entityId) },
                    { id: "delete", label: "Delete Ship", status: "Permanent", icon: "fas fa-skull-crossbones", danger: true, className: "permanent-danger", onSelect: () => this.#deleteShip(entityId) }
                ]
            });
        }

        async #renameShip(entityId) {
            if (!game.user.isGM || !entityId) return;
            const row = this.#getShipRows().find(candidate => candidate.entityId === entityId);
            const name = await promptTextInput({ title: "Rename Ship", label: "Name", value: row?.name || "", confirmLabel: "Rename" });
            if (!name) return;
            await updateShip(entityId, { display: { name } });
            this.render();
        }

        async #deleteShip(entityId) {
            if (!game.user.isGM || !entityId) return;
            const row = this.#getShipRows().find(candidate => candidate.entityId === entityId);
            const safeName = foundry.utils.escapeHTML(row?.name || "this ship");
            const confirmed = await foundry.applications.api.DialogV2.confirm({
                window: { title: "Delete Ship" },
                content: `<p>Delete <strong>${safeName}</strong>?</p>`,
                modal: true,
                rejectClose: false,
                yes: { label: "Delete" },
                no: { label: "Cancel" }
            });
            if (!confirmed) return;
            await deleteShip(entityId);
            this.render();
        }

        async #createRootSceneFromMenuOption(option, anchor) {
            const rect = anchor.getBoundingClientRect();
            const position = {
                width: 320,
                left: Math.max(20, window.innerWidth - 630),
                top: Math.max(20, rect.top - 80)
            };

            if (!option.available) {
                await this.#showRootSceneRequirementDialog(option);
            } else if (option.kind === "empty") {
                await NexusRootSceneCreationManager.createEmptyScene({ position });
            } else if (option.kind === "image") {
                NexusRootSceneCreationManager.openImagePicker({
                    position: {
                        left: Math.max(20, window.innerWidth - 660),
                        top: Math.max(20, rect.top - 260)
                    }
                });
            } else if (option.kind === "sceneType" && option.id) {
                await NexusRootSceneCreationManager.createGeneratedScene(option.id);
            }
        }

        #openRootSceneMenu(button, rootElement) {
            const options = this.#getRootSceneMenuOptions();
            if (!options.length) return;

            this.#closeFloatingMenus(rootElement);
            button.setAttribute("aria-expanded", "true");
            NexusFloatingMenu.open({
                anchor: button,
                className: "nexus-root-scene-menu",
                onClose: () => button.setAttribute("aria-expanded", "false"),
                items: options.map(option => ({
                    id: option.id,
                    label: option.label,
                    icon: option.icon,
                    status: option.status,
                    unavailable: option.available === false,
                    onSelect: async () => {
                        try {
                            await this.#createRootSceneFromMenuOption(option, button);
                        } catch (err) {
                            console.error(err);
                            ui.notifications.error("Failed to create the root scene.");
                        } finally {
                            this.render();
                        }
                    }
                }))
            });
        }

        #getBackTarget(scene) {
            if (!scene) return null;
            return NexusSceneNavigationManager.getSceneNavigation(scene)
                || LegacySciFiCompatibility.getBackTarget(scene);
        }

        #getBackTargetScene(scene) {
            const backTarget = this.#getBackTarget(scene);
            const sceneId = backTarget?.parentSceneId || backTarget?.sceneId || null;
            return sceneId ? game.scenes.get(sceneId) || null : null;
        }

        #getRootSceneMenuOptions() {
            return ROOT_SCENE_MENU_OPTIONS.map(option => {
                if (option.kind !== "sceneType") return { ...option, available: true };

                const sceneType = getSiteSceneType(option.id);
                const isRegistered = sceneType?.id === option.id;
                const isAvailable = isRegistered
                    && sceneType.available !== false
                    && typeof sceneType.resolveScene === "function";
                return {
                    ...option,
                    label: isRegistered ? sceneType.label : option.label,
                    available: isAvailable,
                    status: isAvailable ? "" : (sceneType?.requiresLabel ? `Requires ${sceneType.requiresLabel}` : "Unavailable"),
                    requiresLabel: sceneType?.requiresLabel || "",
                    requiresUrl: sceneType?.requiresUrl || "",
                    requiresVersion: sceneType?.minimumModuleVersion || ""
                };
            });
        }

        async #showRootSceneRequirementDialog(option) {
            const label = option?.requiresLabel || option?.label || "the required module";
            const version = option?.requiresVersion ? ` ${option.requiresVersion}+` : "";
            const url = option?.requiresUrl || "";
            const safeLabel = foundry.utils.escapeHTML(label);
            const safeVersion = foundry.utils.escapeHTML(version);

            await foundry.applications.api.DialogV2.wait({
                window: {
                    title: "Module Required",
                    icon: "fa-solid fa-circle-info"
                },
                position: {
                    width: 420
                },
                content: `<p><strong>${safeLabel}${safeVersion}</strong> is required to create this root scene type.</p>`,
                buttons: [
                    {
                        action: "close",
                        label: "Close",
                        icon: "fa-solid fa-xmark"
                    },
                    {
                        action: "viewModule",
                        label: "View Module",
                        icon: "fa-solid fa-up-right-from-square",
                        default: true,
                        callback: () => {
                            if (url) window.open(url, "_blank", "noopener,noreferrer");
                        }
                    }
                ]
            });
        }

        async #openCampaignEntityCreateDialog(type = "") {
            if (this.#hasCampaignEntityCreator(type)) {
                if (type === "faction") return FactionCreateDialog.show();
                if (type === "ship") return ShipCreateDialog.show();
                return NpcCreateDialog.show();
            }
            return this.#showCampaignEntityRequirementDialog(type);
        }

        #hasCampaignEntityCreator(type = "") {
            if (type === "faction") return getFactionGenerators().length > 0;
            if (type === "ship") return getShipGenerators().length > 0;
            return getNpcGenerators().length > 0;
        }

        async #showCampaignEntityRequirementDialog(type = "") {
            const label = type === "faction" ? "organizations" : type === "ship" ? "ships" : "people";
            const safeLabel = foundry.utils.escapeHTML(label);
            const safePatreonUrl = foundry.utils.escapeHTML(PATREON_URL);

            await foundry.applications.api.DialogV2.wait({
                window: {
                    title: "Module Required",
                    icon: "fa-solid fa-circle-info"
                },
                position: {
                    width: 440
                },
                content: `
                    <p>Creating <strong>${safeLabel}</strong> in Nexus is powered by Augur content modules.</p>
                    <p><strong>Augur: Sci-Fi</strong> adds sci-fi themed entities now. An <strong>Augur: Fantasy</strong> module is in the works.</p>
                    <p class="notes">You can follow development and releases on <a href="${safePatreonUrl}" target="_blank" rel="noopener noreferrer">Patreon</a>.</p>
                `,
                buttons: [
                    {
                        action: "close",
                        label: "Close",
                        icon: "fa-solid fa-xmark"
                    },
                    {
                        action: "viewModule",
                        label: "View Module",
                        icon: "fa-solid fa-up-right-from-square",
                        default: true,
                        callback: () => {
                            window.open(SCIFI_MODULE_URL, "_blank", "noopener,noreferrer");
                        }
                    }
                ]
            });
        }

        async #previewLineageNode(row) {
            const nodeKind = row?.dataset?.nodeKind || "scene";
            const parentSceneId = row?.dataset?.parentSceneId || null;
            const siteId = row?.dataset?.siteId || null;

            if (parentSceneId && siteId) {
                const parentScene = game.scenes.get(parentSceneId) || null;
                const siteRecord = parentScene ? SiteRecordManager.resolveSite({ parentScene, siteId }) : null;
                if (!siteRecord && !row?.dataset?.sceneId) return;
                if (!row?.dataset?.sceneId || siteRecord?.placeableId || siteRecord?.journalPageId) {
                    PlacePreview.show({
                        parentScene,
                        siteId
                    });
                    return;
                }
            }

            if (nodeKind === "pending-site") {
                PlacePreview.show({
                    parentScene: game.scenes.get(parentSceneId) || null,
                    siteId
                });
                return;
            }

            if (nodeKind.startsWith("legacy-scifi-pending-")) {
                ui.notifications.info("Generate this Sci-Fi node before previewing it.");
                return;
            }

            const sceneId = row?.dataset?.sceneId || null;
            const scene = sceneId ? game.scenes.get(sceneId) || null : null;
            if (!scene) return;

            const openedSciFiPreview = await LegacySciFiCompatibility.openPreview(scene);
            if (openedSciFiPreview) return;

            PlacePreview.show({ scene });
        }

        async _prepareContext(options) {
            const context = super._prepareContext ? await super._prepareContext(options) : {};
            const isSitesTab = this.#activeNexusTab === "sites";
            const isPeopleTab = this.#activeNexusTab === "people";
            const isFactionsTab = this.#activeNexusTab === "factions";
            const isShipsTab = this.#activeNexusTab === "ships";
            let rootScene = NexusLineageManager.getRootScene();
            let rows = [];
            if (isSitesTab) {
                const lineage = NexusLineageManager.getLineageRows();
                rootScene = lineage.rootScene;
                rows = this.#filterLineageRowsForUser(lineage.rows);
                this.#lastLineageRows = rows;
                this.#pruneExpandedSceneIds(rows);
            }
            const currentScene = canvas.scene || null;
            const parentScene = currentScene ? NexusLineageManager.getParentScene(currentScene) : null;
            const canSeeParentScene = !parentScene || NexusPlayerSceneAccess.canUserSeeSceneInNexus(parentScene);
            const backTarget = this.#getBackTarget(currentScene);
            const backTargetScene = this.#getBackTargetScene(currentScene);
            const canUseBackTarget = game.user.isGM
                ? !!backTarget
                : !!backTargetScene
                    && NexusPlayerSceneAccess.canUserSeeSceneInNexus(backTargetScene)
                    && NexusPlayerSceneAccess.canUserViewScene(backTargetScene);
            const people = isPeopleTab ? this.#getPeopleDirectory() : this.#emptyDirectory();
            const factions = isFactionsTab ? this.#getFactionDirectory() : this.#emptyDirectory();
            const ships = isShipsTab ? this.#getShipDirectory() : this.#emptyDirectory();
            const currentAncestorIds = isSitesTab ? this.#getCurrentSceneAncestorIds(currentScene, rows) : new Set();
            const showSceneIcons = game.settings.get("augur-nexus", "nexusBrowserShowIcons") !== false;
            const canSeeRootScene = !rootScene || NexusPlayerSceneAccess.canUserSeeSceneInNexus(rootScene);
            const canOpenRootScene = !!rootScene
                && canSeeRootScene
                && rootScene.id !== currentScene?.id
                && NexusPlayerSceneAccess.canUserViewScene(rootScene);

            return {
                ...context,
                activeNexusTab: this.#activeNexusTab,
                isSitesTab,
                isPeopleTab,
                isFactionsTab,
                isShipsTab,
                currentSceneName: currentScene?.name || "No active scene",
                rootSceneId: canSeeRootScene ? rootScene?.id || "" : "",
                rootSceneName: canSeeRootScene ? rootScene?.name || "No Nexus scene set" : "Nexus unavailable",
                rootSceneThumb: canSeeRootScene ? rootScene?.thumb || "" : "",
                hasRootScene: !!rootScene && canSeeRootScene,
                canOpenRootScene,
                rootSceneIsCurrent: !!rootScene && rootScene.id === currentScene?.id,
                parentSceneName: canSeeParentScene ? parentScene?.name || "" : "",
                hasParentScene: !!parentScene && canSeeParentScene,
                hasBackTarget: canUseBackTarget,
                canOpenSitesTool: !!currentScene && game.user.isGM,
                isGM: game.user.isGM,
                searchQuery: this.#searchQuery,
                peopleSearchQuery: this.#peopleSearchQuery,
                factionSearchQuery: this.#factionSearchQuery,
                shipSearchQuery: this.#shipSearchQuery,
                showSceneIcons,
                isSearching: !!this.#normalizeSearchQuery(this.#searchQuery),
                isPeopleSearching: !!this.#normalizeSearchQuery(this.#peopleSearchQuery),
                isFactionSearching: !!this.#normalizeSearchQuery(this.#factionSearchQuery),
                isShipSearching: !!this.#normalizeSearchQuery(this.#shipSearchQuery),
                hasRows: rows.length > 0,
                people,
                factions,
                ships,
                rows: rows.map(row => {
                    const connectionNodeId = ConnectionSidebarModel.getNodeIdForLineageRow(row);
                    const expanded = this.#expandedConnectionNodeIds.has(connectionNodeId);
                    const connections = ConnectionSidebarModel.buildForLineageRow(row, { expanded });
                    const playerVisibility = this.#getRowPlayerVisibility(row);
                    return {
                        ...row,
                        connections,
                        isPending: row.nodeKind !== "scene",
                        canDragPlace: game.user.isGM && !!(row.sceneId || (row.parentSceneId && row.siteId) || row.nodeKind?.startsWith?.("legacy-scifi-pending-")),
                        isCollapsed: this.#isSceneCollapsed(row),
                        isCurrentAncestor: currentAncestorIds.has(row.id),
                        hasIcon: !!row.iconSrc,
                        hasPlayerVisibility: !!playerVisibility,
                        isPlayerHidden: !!playerVisibility?.isHidden,
                        playerVisibilityLabel: playerVisibility?.label || "",
                        playerVisibilityIcon: playerVisibility?.icon || "fas fa-sitemap",
                        hasOptions: game.user.isGM && !!(row.canRename || row.canConfigure || row.canDelete || playerVisibility),
                        canOpen: row.nodeKind === "scene"
                            ? row.canOpen && NexusPlayerSceneAccess.canUserViewScene(game.scenes.get(row.sceneId))
                            : game.user.isGM && row.canOpen,
                        indent: `${row.depth * 15}px`,
                        openLabel: row.nodeKind === "pending-site" ? "Open site" : row.nodeKind.startsWith("legacy-scifi-pending-") ? "Generate scene" : "Open scene",
                        nodeTypeLabel: row.nodeKind !== "scene"
                            ? row.typeLabel
                            : row.isRoot
                                ? "Nexus"
                                : row.isCurrent
                                    ? `Current ${row.typeLabel || "Scene"}`
                                    : (row.typeLabel || (row.hasChildren ? "Parent Scene" : "Scene"))
                    };
                })
            };
        }

        #getPeopleDirectory() {
            return NpcDirectoryModel.build({
                search: "",
                expandedNodeIds: this.#expandedConnectionNodeIds,
                isGM: game.user.isGM
            });
        }

        #getPeopleRows() {
            return this.#getPeopleDirectory().rows || [];
        }

        #getFactionDirectory() {
            return FactionDirectoryModel.build({
                search: "",
                expandedNodeIds: this.#expandedConnectionNodeIds,
                isGM: game.user.isGM
            });
        }

        #getFactionRows() {
            return this.#getFactionDirectory().rows || [];
        }

        #getShipDirectory() {
            return ShipDirectoryModel.build({
                search: "",
                expandedNodeIds: this.#expandedConnectionNodeIds,
                isGM: game.user.isGM
            });
        }

        #getShipRows() {
            return this.#getShipDirectory().rows || [];
        }

        #getEntityRows(entityType = "npc") {
            if (entityType === "faction") return this.#getFactionRows();
            if (entityType === "ship") return this.#getShipRows();
            return this.#getPeopleRows();
        }

        #applyLineageFilter(rootElement) {
            const tree = rootElement.querySelector(".nexus-browser-tree");
            const emptyState = rootElement.querySelector(".nexus-browser-empty");
            if (!tree || !emptyState) return;

            const query = this.#normalizeSearchQuery(this.#searchQuery);
            const rowElements = [...tree.querySelectorAll(".nexus-browser-pill-shell")];
            const rows = rowElements.map(element => ({
                element,
                id: element.dataset.nodeId || "",
                parentNodeId: element.dataset.parentNodeId || "",
                depth: Number(element.dataset.depth || 0),
                name: (element.dataset.name || "").toLocaleLowerCase(),
                hasChildren: element.dataset.hasChildren === "true"
            }));

            const rowsById = new Map(rows.map(row => [row.id, row]));
            const childrenByParent = new Map();
            for (const row of rows) {
                if (!row.parentNodeId) continue;
                const bucket = childrenByParent.get(row.parentNodeId) || [];
                bucket.push(row);
                childrenByParent.set(row.parentNodeId, bucket);
            }

            let visibleIds = new Set();
            if (query) {
                const matchingRows = rows.filter(row => row.name.includes(query));
                for (const row of matchingRows) {
                    visibleIds.add(row.id);

                    let parentId = row.parentNodeId || null;
                    while (parentId) {
                        if (visibleIds.has(parentId)) break;
                        visibleIds.add(parentId);
                        parentId = rowsById.get(parentId)?.parentNodeId || null;
                    }

                    for (const childRow of childrenByParent.get(row.id) || []) {
                        visibleIds.add(childRow.id);
                    }
                }
            } else {
                const collapsedDepths = [];
                for (const row of rows) {
                    while (collapsedDepths.length && row.depth <= collapsedDepths.at(-1)) {
                        collapsedDepths.pop();
                    }

                    const hiddenByAncestor = collapsedDepths.length > 0;
                    if (!hiddenByAncestor) visibleIds.add(row.id);
                    if (row.hasChildren && !this.#expandedSceneIds.has(row.id)) collapsedDepths.push(row.depth);
                }
            }

            let visibleCount = 0;
            for (const row of rows) {
                const isVisible = visibleIds.has(row.id);
                row.element.hidden = !isVisible;
                row.element.classList.toggle("search-match", !!query && row.name.includes(query));
                const collapseButton = row.element.querySelector("[data-action='toggleLineageBranch']");
                if (collapseButton) {
                    collapseButton.disabled = !!query;
                    collapseButton.classList.toggle("search-disabled", !!query);
                    collapseButton.tabIndex = query ? -1 : 0;
                }
                if (isVisible) visibleCount += 1;
            }

            tree.classList.toggle("search-active", !!query);
            tree.hidden = visibleCount === 0;
            emptyState.hidden = visibleCount > 0;
            emptyState.textContent = query ? "No scenes match this search." : "No lineage data yet. Use Sites or set the current scene as the Nexus scene.";
        }

        #applyEntityFilter(rootElement, { treeSelector, query, emptyLabel }) {
            const tree = rootElement.querySelector(treeSelector);
            if (!tree) return;

            const section = tree.closest(".nexus-browser-section");
            const emptyState = section?.querySelector(".nexus-browser-empty");
            const normalizedQuery = this.#normalizeSearchQuery(query);
            const rows = [...tree.querySelectorAll(".nexus-browser-pill-shell[data-entity-id]")];

            let visibleCount = 0;
            for (const row of rows) {
                const searchText = String(row.dataset.searchText || row.dataset.name || "").toLocaleLowerCase();
                const isVisible = !normalizedQuery || searchText.includes(normalizedQuery);
                row.hidden = !isVisible;
                row.classList.toggle("search-match", !!normalizedQuery && isVisible);
                if (isVisible) visibleCount += 1;
            }

            tree.classList.toggle("search-active", !!normalizedQuery);
            tree.hidden = visibleCount === 0;
            if (emptyState) {
                if (normalizedQuery && !visibleCount) emptyState.textContent = emptyLabel;
                emptyState.hidden = visibleCount > 0;
            }
        }

        #applyEntityFilters(rootElement) {
            this.#applyEntityFilter(rootElement, {
                treeSelector: ".nexus-browser-people-tree",
                query: this.#peopleSearchQuery,
                emptyLabel: "No people match this search."
            });
            this.#applyEntityFilter(rootElement, {
                treeSelector: ".nexus-browser-faction-tree",
                query: this.#factionSearchQuery,
                emptyLabel: "No organizations match this search."
            });
            this.#applyEntityFilter(rootElement, {
                treeSelector: ".nexus-browser-ship-tree",
                query: this.#shipSearchQuery,
                emptyLabel: "No ships match this search."
            });
        }

        #setEntityDragImage(event, row) {
            const dataTransfer = event.dataTransfer;
            if (!dataTransfer?.setDragImage) return;

            const imageSrc = row.dataset.placementImageSrc || row.dataset.imageSrc || "";
            if (!imageSrc) return;

            const label = row.dataset.name || "Entity";
            const type = row.dataset.entityType || "";
            const preview = document.createElement("div");
            preview.setAttribute("aria-hidden", "true");
            Object.assign(preview.style, {
                position: "fixed",
                left: "-10000px",
                top: "-10000px",
                width: "112px",
                minHeight: "124px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                pointerEvents: "none",
                border: "1px solid rgba(245, 190, 84, 0.78)",
                borderRadius: "8px",
                background: "rgba(6, 8, 14, 0.9)",
                boxShadow: "0 10px 26px rgba(0, 0, 0, 0.48), 0 0 16px rgba(245, 190, 84, 0.22)",
                zIndex: "999999"
            });

            const imageWrap = document.createElement("div");
            Object.assign(imageWrap.style, {
                width: "84px",
                height: "84px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
            });

            const image = document.createElement("img");
            image.src = imageSrc;
            image.alt = "";
            Object.assign(image.style, {
                maxWidth: "84px",
                maxHeight: "84px",
                objectFit: "contain",
                filter: "drop-shadow(0 3px 7px rgba(0, 0, 0, 0.75))"
            });
            imageWrap.append(image);

            const caption = document.createElement("div");
            caption.textContent = type ? `${label} - ${type}` : label;
            Object.assign(caption.style, {
                maxWidth: "96px",
                color: "#f2dec1",
                fontSize: "11px",
                fontWeight: "700",
                lineHeight: "1.15",
                textAlign: "center",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
            });

            preview.append(imageWrap, caption);
            document.body.append(preview);
            dataTransfer.setDragImage(preview, 56, 56);
            setTimeout(() => preview.remove(), 0);
        }

        #setPlaceDragImage(event, row) {
            const dataTransfer = event.dataTransfer;
            if (!dataTransfer?.setDragImage) return;

            const imageSrc = row.dataset.iconSrc || row.dataset.thumb || "";
            if (!imageSrc) return;

            const label = row.dataset.name || "Place";
            const isSite = !!(row.dataset.parentSceneId && row.dataset.siteId);
            const preview = document.createElement("div");
            preview.setAttribute("aria-hidden", "true");
            Object.assign(preview.style, {
                position: "fixed",
                left: "-10000px",
                top: "-10000px",
                width: "112px",
                minHeight: "124px",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                pointerEvents: "none",
                border: "1px solid rgba(245, 190, 84, 0.78)",
                borderRadius: "8px",
                background: "rgba(6, 8, 14, 0.9)",
                boxShadow: "0 10px 26px rgba(0, 0, 0, 0.48), 0 0 16px rgba(245, 190, 84, 0.22)",
                zIndex: "999999"
            });

            const imageWrap = document.createElement("div");
            Object.assign(imageWrap.style, {
                width: "84px",
                height: "84px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
            });

            const image = document.createElement("img");
            image.src = imageSrc;
            image.alt = "";
            Object.assign(image.style, {
                maxWidth: "84px",
                maxHeight: "84px",
                objectFit: "contain",
                filter: "drop-shadow(0 3px 7px rgba(0, 0, 0, 0.75))"
            });
            imageWrap.append(image);

            const caption = document.createElement("div");
            caption.textContent = `${label} - ${isSite ? "site" : "scene"}`;
            Object.assign(caption.style, {
                maxWidth: "96px",
                color: "#f2dec1",
                fontSize: "11px",
                fontWeight: "700",
                lineHeight: "1.15",
                textAlign: "center",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
            });

            preview.append(imageWrap, caption);
            document.body.append(preview);
            dataTransfer.setDragImage(preview, 56, 56);
            setTimeout(() => preview.remove(), 0);
        }

        _onFirstRender(context, options) {
            if (super._onFirstRender) super._onFirstRender(context, options);
            this.#browserRefreshCallback = NexusBrowserRefreshScheduler.register(() => this.render());
            this.#siteSceneTypesChangedHook = Hooks.on("augurNexusSiteSceneTypesChanged", () => this.#scheduleRender("site-scene-types"));
            this.#connectionsChangedHook = Hooks.on("augurNexusConnectionsChanged", () => this.#scheduleRender("connections"));
            this.#playerAccessChangedHook = Hooks.on("augurNexusPlayerSceneAccessChanged", () => this.#scheduleRender("player-access"));
            this.#campaignEntitiesChangedHook = Hooks.on("augurNexusCampaignEntitiesChanged", () => this.#scheduleRender("campaign-entities"));
        }

        async close(options) {
            if (this.#browserRefreshCallback) {
                NexusBrowserRefreshScheduler.unregister(this.#browserRefreshCallback);
                this.#browserRefreshCallback = null;
            }
            if (this.#siteSceneTypesChangedHook) {
                Hooks.off("augurNexusSiteSceneTypesChanged", this.#siteSceneTypesChangedHook);
                this.#siteSceneTypesChangedHook = null;
            }
            if (this.#connectionsChangedHook) {
                Hooks.off("augurNexusConnectionsChanged", this.#connectionsChangedHook);
                this.#connectionsChangedHook = null;
            }
            if (this.#playerAccessChangedHook) {
                Hooks.off("augurNexusPlayerSceneAccessChanged", this.#playerAccessChangedHook);
                this.#playerAccessChangedHook = null;
            }
            if (this.#campaignEntitiesChangedHook) {
                Hooks.off("augurNexusCampaignEntitiesChanged", this.#campaignEntitiesChangedHook);
                this.#campaignEntitiesChangedHook = null;
            }
            return super.close ? super.close(options) : undefined;
        }

        _attachPartListeners(partId, htmlElement, options) {
            if (super._attachPartListeners) super._attachPartListeners(partId, htmlElement, options);
            const el = htmlElement instanceof HTMLElement ? htmlElement : htmlElement[0];
            if (!el) return;

            const searchInput = el.querySelector("[name='nexusSceneSearch']");
            const peopleSearchInput = el.querySelector("[name='nexusPeopleSearch']");
            const factionSearchInput = el.querySelector("[name='nexusFactionSearch']");
            const shipSearchInput = el.querySelector("[name='nexusShipSearch']");
            const clearSearchButton = el.querySelector("[data-action='clearSceneSearch']");
            const clearPeopleSearchButton = el.querySelector("[data-action='clearPeopleSearch']");
            const clearFactionSearchButton = el.querySelector("[data-action='clearFactionSearch']");
            const clearShipSearchButton = el.querySelector("[data-action='clearShipSearch']");
            const collapseAllButton = el.querySelector("[data-action='collapseAllScenes']");

            const setNexusTab = tab => {
                this.#activeNexusTab = ["people", "factions", "ships"].includes(tab) ? tab : "sites";
                this.render();
            };

            el.querySelector("[name='nexusBrowserTab']")?.addEventListener("change", event => {
                setNexusTab(event.currentTarget.value || "sites");
            });

            el.querySelectorAll("[data-action='setNexusTab'][data-tab]").forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    setNexusTab(event.currentTarget.dataset.tab || "sites");
                });
            });

            if (searchInput) {
                if (this.#wasSearchFocused) {
                    requestAnimationFrame(() => {
                        searchInput.focus({ preventScroll: true });
                        const end = searchInput.value.length;
                        searchInput.setSelectionRange(end, end);
                    });
                }

                searchInput.addEventListener("focus", () => {
                    this.#wasSearchFocused = true;
                });

                searchInput.addEventListener("blur", () => {
                    this.#wasSearchFocused = false;
                });

                searchInput.addEventListener("input", event => {
                    const input = event.currentTarget;
                    this.#searchQuery = input.value || "";
                    this.#wasSearchFocused = true;
                    clearSearchButton?.toggleAttribute("hidden", !this.#searchQuery);
                    this.#applyLineageFilter(el);
                });
            }

            if (clearSearchButton) {
                clearSearchButton.toggleAttribute("hidden", !this.#searchQuery);
                clearSearchButton.addEventListener("click", event => {
                    event.preventDefault();
                    this.#searchQuery = "";
                    this.#wasSearchFocused = true;
                    if (searchInput) searchInput.value = "";
                    clearSearchButton.hidden = true;
                    this.#applyLineageFilter(el);
                    searchInput?.focus({ preventScroll: true });
                });
            }

            if (peopleSearchInput) {
                peopleSearchInput.addEventListener("focus", () => {
                    this.#wasPeopleSearchFocused = true;
                });
                peopleSearchInput.addEventListener("blur", () => {
                    this.#wasPeopleSearchFocused = false;
                });
                peopleSearchInput.addEventListener("input", event => {
                    const input = event.currentTarget;
                    this.#peopleSearchQuery = input.value || "";
                    this.#wasPeopleSearchFocused = true;
                    clearPeopleSearchButton?.toggleAttribute("hidden", !this.#peopleSearchQuery);
                    this.#applyEntityFilters(el);
                });
            }

            if (clearPeopleSearchButton) {
                clearPeopleSearchButton.toggleAttribute("hidden", !this.#peopleSearchQuery);
                clearPeopleSearchButton.addEventListener("click", event => {
                    event.preventDefault();
                    this.#peopleSearchQuery = "";
                    this.#wasPeopleSearchFocused = true;
                    if (peopleSearchInput) peopleSearchInput.value = "";
                    clearPeopleSearchButton.hidden = true;
                    this.#applyEntityFilters(el);
                    peopleSearchInput?.focus({ preventScroll: true });
                });
            }

            if (factionSearchInput) {
                factionSearchInput.addEventListener("focus", () => {
                    this.#wasFactionSearchFocused = true;
                });
                factionSearchInput.addEventListener("blur", () => {
                    this.#wasFactionSearchFocused = false;
                });
                factionSearchInput.addEventListener("input", event => {
                    const input = event.currentTarget;
                    this.#factionSearchQuery = input.value || "";
                    this.#wasFactionSearchFocused = true;
                    clearFactionSearchButton?.toggleAttribute("hidden", !this.#factionSearchQuery);
                    this.#applyEntityFilters(el);
                });
            }

            if (clearFactionSearchButton) {
                clearFactionSearchButton.toggleAttribute("hidden", !this.#factionSearchQuery);
                clearFactionSearchButton.addEventListener("click", event => {
                    event.preventDefault();
                    this.#factionSearchQuery = "";
                    this.#wasFactionSearchFocused = true;
                    if (factionSearchInput) factionSearchInput.value = "";
                    clearFactionSearchButton.hidden = true;
                    this.#applyEntityFilters(el);
                    factionSearchInput?.focus({ preventScroll: true });
                });
            }

            if (shipSearchInput) {
                shipSearchInput.addEventListener("focus", () => { this.#wasShipSearchFocused = true; });
                shipSearchInput.addEventListener("blur", () => { this.#wasShipSearchFocused = false; });
                shipSearchInput.addEventListener("input", event => {
                    const input = event.currentTarget;
                    this.#shipSearchQuery = input.value || "";
                    this.#wasShipSearchFocused = true;
                    clearShipSearchButton?.toggleAttribute("hidden", !this.#shipSearchQuery);
                    this.#applyEntityFilters(el);
                });
            }

            if (clearShipSearchButton) {
                clearShipSearchButton.toggleAttribute("hidden", !this.#shipSearchQuery);
                clearShipSearchButton.addEventListener("click", event => {
                    event.preventDefault();
                    this.#shipSearchQuery = "";
                    this.#wasShipSearchFocused = true;
                    if (shipSearchInput) shipSearchInput.value = "";
                    clearShipSearchButton.hidden = true;
                    this.#applyEntityFilters(el);
                    shipSearchInput?.focus({ preventScroll: true });
                });
            }

            collapseAllButton?.addEventListener("click", event => {
                event.preventDefault();
                this.#collapseAllScenes();
                this.render();
            });

            const showIconsToggle = el.querySelector("[name='nexusBrowserShowIcons']");
            showIconsToggle?.addEventListener("change", async event => {
                await game.settings.set("augur-nexus", "nexusBrowserShowIcons", event.currentTarget.checked);
                this.render();
            });

            const toggleRootSceneMenuButton = el.querySelector("[data-action='toggleRootSceneMenu']");
            toggleRootSceneMenuButton?.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                this.#openRootSceneMenu(event.currentTarget, el);
            });

            const createNpcButton = el.querySelector("[data-action='createNpc']");
            createNpcButton?.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                void this.#openCampaignEntityCreateDialog("npc");
            });

            const createFactionButton = el.querySelector("[data-action='createFaction']");
            createFactionButton?.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                void this.#openCampaignEntityCreateDialog("faction");
            });

            const createShipButton = el.querySelector("[data-action='createShip']");
            createShipButton?.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                void this.#openCampaignEntityCreateDialog("ship");
            });

            const setRootButton = el.querySelector("[data-action='setCurrentAsNexus']");
            if (setRootButton) {
                setRootButton.addEventListener("click", async event => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!canvas.scene) return;

                    const sceneName = foundry.utils.escapeHTML(canvas.scene.name);
                    const confirmed = await foundry.applications.api.DialogV2.confirm({
                        window: {
                            title: "Change Campaign Nexus"
                        },
                        content: `<p>Set <strong>${sceneName}</strong> as the campaign Nexus scene?</p>`,
                        rejectClose: false,
                        modal: true,
                        yes: {
                            label: "Set Nexus"
                        },
                        no: {
                            label: "Cancel"
                        }
                    });
                    if (!confirmed) return;

                    await NexusLineageManager.setRootScene(canvas.scene);
                    ui.notifications.info(`Set "${canvas.scene.name}" as the Nexus scene.`);
                    this.render();
                });
            }

            const openRootButton = el.querySelector("[data-action='openRootScene']");
            if (openRootButton) {
                openRootButton.addEventListener("click", async event => {
                    event.preventDefault();
                    const rootScene = NexusLineageManager.getRootScene();
                    if (!rootScene) return;
                    if (!NexusPlayerSceneAccess.canUserViewScene(rootScene)) {
                        ui.notifications.warn("This scene is not currently available to view.");
                        return;
                    }
                    if (game.user.isGM) await NexusSceneTransitionEffects.transitionToScene(rootScene, { transitionStyle: "none" });
                    else await rootScene.view();
                });
            }

            const goBackButton = el.querySelector("[data-action='returnToParentScene']");
            if (goBackButton) {
                goBackButton.addEventListener("click", async event => {
                    event.preventDefault();
                    if (!game.user.isGM) {
                        const targetScene = this.#getBackTargetScene(canvas.scene);
                        if (!targetScene || !NexusPlayerSceneAccess.canUserViewScene(targetScene)) {
                            ui.notifications.warn("No viewable parent scene was found for this view.");
                            return;
                        }
                        await targetScene.view();
                        return;
                    }

                    const returned = await NexusSceneNavigationManager.returnToParent(canvas.scene)
                        || await LegacySciFiCompatibility.returnToParent(canvas.scene);
                    if (!returned) {
                        ui.notifications.warn("No parent scene was found for this view.");
                    }
                });
            }

            const openSitesButton = el.querySelector("[data-action='openSitesTool']");
            if (openSitesButton) {
                openSitesButton.addEventListener("click", event => {
                    event.preventDefault();
                    Hooks.callAll("augurNexusOpenSitesTool");
                });
            }

            el.querySelectorAll("[data-action='toggleLineageBranch']").forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    const sceneId = event.currentTarget.dataset.sceneId;
                    const rows = this.#lastLineageRows.length ? this.#lastLineageRows : NexusLineageManager.getLineageRows().rows;
                    this.#toggleSceneCollapse(sceneId, rows);
                    this.render();
                });
            });

            el.querySelectorAll("[data-action='toggleLineageConnections']").forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.#toggleConnectionDrawer(event.currentTarget.dataset.connectionTargetId || "");
                    this.render();
                });
            });

            el.querySelectorAll("[data-action='openLineageConnectionGroupActions']").forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.#openConnectionGroupActions(event.currentTarget);
                });
            });

            el.querySelectorAll("[data-action='moveLineageConnectionGroup']").forEach(button => {
                button.addEventListener("click", async event => {
                    event.preventDefault();
                    event.stopPropagation();
                    event.currentTarget.blur();
                    const drawer = event.currentTarget.closest(".nexus-browser-connection-drawer");
                    const nodeId = event.currentTarget.dataset.connectionTargetId || drawer?.dataset?.connectionTargetId || "";
                    const categoryId = event.currentTarget.dataset.connectionCategoryId || "";
                    const direction = Number(event.currentTarget.dataset.connectionGroupMove || 0);
                    const categoryIds = [...(drawer?.querySelectorAll(".nexus-browser-connection-group[data-connection-category-id]") || [])]
                        .map(group => group.dataset.connectionCategoryId || "")
                        .filter(Boolean);
                    await ConnectionStore.moveGroupForNode(nodeId, categoryId, direction, { categoryIds });
                });
            });

            el.querySelectorAll("[data-action='openLineageConnection']").forEach(button => {
                button.addEventListener("click", async event => {
                    event.preventDefault();
                    event.stopPropagation();
                    const node = ConnectionStore.getNode(event.currentTarget.dataset.connectionNodeId || "");
                    await ConnectionTargetResolver.openNode(node);
                });
            });

            el.querySelectorAll("[data-action='openLineageConnectionActions']").forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.#openConnectionRowActions(event.currentTarget);
                });
            });

            el.querySelectorAll(".nexus-browser-connection-row").forEach(row => {
                row.addEventListener("dragstart", event => {
                    const edgeId = row.dataset.connectionEdgeId || "";
                    if (!edgeId) return;
                    event.dataTransfer?.setData("application/x-augur-connection-row", JSON.stringify({
                        edgeId,
                        sourceNodeId: row.closest("[data-connection-target-id]")?.dataset.connectionTargetId || "",
                        categoryId: row.closest("[data-connection-category-id]")?.dataset.connectionCategoryId || ""
                    }));

                    const node = ConnectionStore.getNode(row.dataset.connectionNodeId || "");
                    ConnectionTargetResolver.setDragData(event.dataTransfer, node, { effectAllowed: "copyMove" });
                });

                row.addEventListener("dragover", event => {
                    event.preventDefault();
                    row.classList.add("is-drop-before");
                });

                row.addEventListener("dragleave", event => {
                    if (row.contains(event.relatedTarget)) return;
                    row.classList.remove("is-drop-before");
                });

                row.addEventListener("drop", async event => {
                    event.preventDefault();
                    event.stopPropagation();
                    row.classList.remove("is-drop-before");
                    await this.#handleConnectionDrop(event, row);
                });
            });

            el.querySelectorAll(".nexus-browser-connection-drawer").forEach(dropTarget => {
                dropTarget.addEventListener("dragover", event => {
                    event.preventDefault();
                    dropTarget.classList.add("is-connection-drop-target");
                });

                dropTarget.addEventListener("dragleave", event => {
                    if (dropTarget.contains(event.relatedTarget)) return;
                    dropTarget.classList.remove("is-connection-drop-target");
                });

                dropTarget.addEventListener("drop", async event => {
                    event.preventDefault();
                    event.stopPropagation();
                    dropTarget.classList.remove("is-connection-drop-target");
                    await this.#handleConnectionDrop(event, dropTarget);
                });
            });

            el.querySelectorAll("[data-connection-category-id]").forEach(group => {
                group.addEventListener("dragover", event => {
                    event.preventDefault();
                    group.classList.add("is-category-drop-target");
                });

                group.addEventListener("dragleave", event => {
                    if (group.contains(event.relatedTarget)) return;
                    group.classList.remove("is-category-drop-target");
                });

                group.addEventListener("drop", async event => {
                    event.preventDefault();
                    event.stopPropagation();
                    group.classList.remove("is-category-drop-target");
                    await this.#handleConnectionDrop(event, group);
                });
            });

            el.querySelectorAll(".nexus-browser-pill-shell").forEach(row => {
                row.addEventListener("dragover", event => {
                    if (!this.#canAcceptLineageDrop(event)) return;
                    if (!this.#getLineageDropTargetScene(row)) return;
                    event.preventDefault();
                    row.classList.add("is-lineage-drop-target");
                });

                row.addEventListener("dragleave", event => {
                    if (row.contains(event.relatedTarget)) return;
                    row.classList.remove("is-lineage-drop-target");
                });

                row.addEventListener("drop", async event => {
                    if (!this.#getLineageDropTargetScene(row)) return;
                    event.preventDefault();
                    event.stopPropagation();
                    row.classList.remove("is-lineage-drop-target");
                    await this.#handleLineageDrop(event, row);
                });
            });

            el.querySelectorAll(".nexus-browser-pill-shell").forEach(row => {
                row.addEventListener("click", async event => {
                    if (event.target.closest("button")) return;
                    event.preventDefault();
                    this.#closeFloatingMenus(el);
                    if (event.currentTarget.dataset.entityId) {
                        if (event.currentTarget.dataset.entityType === "ship") await openShipDossier(event.currentTarget.dataset.entityId);
                        else if (event.currentTarget.dataset.entityType === "faction") await openFactionDossier(event.currentTarget.dataset.entityId);
                        else await openNpcDossier(event.currentTarget.dataset.entityId);
                        return;
                    }
                    await this.#previewLineageNode(event.currentTarget);
                });
            });

            el.querySelectorAll("[data-action='openNpcDossier']").forEach(button => {
                button.addEventListener("click", async event => {
                    event.preventDefault();
                    event.stopPropagation();
                    await openNpcDossier(event.currentTarget.dataset.entityId || "");
                });
            });

            el.querySelectorAll("[data-action='toggleNpcOptions']").forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.#openNpcOptionsMenu(event.currentTarget, el);
                });
            });

            el.querySelectorAll("[data-action='toggleFactionOptions']").forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.#openFactionOptionsMenu(event.currentTarget, el);
                });
            });

            el.querySelectorAll("[data-action='toggleShipOptions']").forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.#openShipOptionsMenu(event.currentTarget, el);
                });
            });

            el.querySelectorAll("[data-action='openLineageScene']").forEach(button => {
                button.addEventListener("click", async event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.#closeFloatingMenus(el);
                    const buttonEl = event.currentTarget;
                    const nodeKind = buttonEl.dataset.nodeKind || "scene";

                    if (nodeKind === "pending-site") {
                        try {
                            await SiteMapManager.openSite({
                                journalEntryId: buttonEl.dataset.journalEntryId || null,
                                pageId: buttonEl.dataset.pageId || null,
                                parentSceneId: buttonEl.dataset.parentSceneId || null,
                                siteId: buttonEl.dataset.siteId || null
                            });
                        } catch (err) {
                            console.error(err);
                            ui.notifications.error("Failed to open the selected site.");
                        }
                        return;
                    }

                    if (nodeKind.startsWith("legacy-scifi-pending-")) {
                        try {
                            const opened = await LegacySciFiCompatibility.openPendingNode({
                                nodeKind,
                                journalEntryId: buttonEl.dataset.journalEntryId || null,
                                pageId: buttonEl.dataset.pageId || null,
                                parentSceneId: buttonEl.dataset.parentSceneId || null
                            });
                            if (!opened) {
                                ui.notifications.warn("Could not resolve the selected Sci-Fi scene.");
                            }
                        } catch (err) {
                            console.error(err);
                            ui.notifications.error("Failed to open the selected Sci-Fi scene.");
                        }
                        return;
                    }

                    const sceneId = buttonEl.dataset.sceneId;
                    const scene = sceneId ? game.scenes.get(sceneId) : null;
                    if (!scene) return;
                    if (!NexusPlayerSceneAccess.canUserViewScene(scene)) {
                        ui.notifications.warn("This scene is not currently available to view.");
                        return;
                    }
                    if (game.user.isGM) await NexusSceneTransitionEffects.transitionToScene(scene, { transitionStyle: "none" });
                    else await scene.view();
                });
            });

            el.querySelectorAll("[data-nexus-place-drag='true']").forEach(row => {
                row.addEventListener("dragstart", event => {
                    if (event.target?.closest?.(".nexus-browser-connection-row")) return;
                    const nodeKind = row.dataset.nodeKind || "";
                    const payload = {
                        type: "AugurNexusNode",
                        kind: row.dataset.parentSceneId && row.dataset.siteId ? "nexus-site" : "nexus-scene",
                        nodeKind,
                        sceneId: row.dataset.sceneId || null,
                        parentSceneId: row.dataset.parentSceneId || null,
                        siteId: row.dataset.siteId || null,
                        name: row.dataset.name || "Place",
                        iconSrc: row.dataset.iconSrc || "",
                        thumb: row.dataset.thumb || ""
                    };
                    event.dataTransfer?.setData("text/plain", JSON.stringify(payload));
                    event.dataTransfer?.setData("application/json", JSON.stringify(payload));
                    if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
                    this.#setPlaceDragImage(event, row);
                });
            });

            el.querySelectorAll("[data-nexus-entity-drag='true']").forEach(row => {
                row.addEventListener("dragstart", event => {
                    if (event.target?.closest?.(".nexus-browser-connection-row")) return;
                    const iconSrc = row.dataset.placementImageSrc || row.dataset.imageSrc || "";
                    const payload = {
                        type: "AugurNexusEntity",
                        kind: "nexus-entity",
                        entityId: row.dataset.entityId || null,
                        entityType: row.dataset.entityType || "npc",
                        name: row.dataset.name || "Person",
                        iconSrc
                    };
                    event.dataTransfer?.setData("text/plain", JSON.stringify(payload));
                    event.dataTransfer?.setData("application/json", JSON.stringify(payload));
                    if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
                    this.#setEntityDragImage(event, row);
                });
            });

            el.querySelectorAll("[data-action='toggleSceneOptions']").forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.#openSceneOptionsMenu(event.currentTarget, el);
                });
            });

            el.querySelectorAll("[data-action='renameLineageScene']").forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.#closeFloatingMenus(el);
                    void this.#renameLineageScene(event.currentTarget.dataset.sceneId);
                });
            });

            el.querySelectorAll("[data-action='configureLineageScene']").forEach(button => {
                button.addEventListener("click", event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.#closeFloatingMenus(el);
                    void this.#configureLineageScene(event.currentTarget.dataset.sceneId);
                });
            });

            el.querySelectorAll("[data-action='deleteLineageScene']").forEach(button => {
                button.addEventListener("click", async event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.#closeFloatingMenus(el);
                    await this.#deleteLineageScene(event.currentTarget.dataset.sceneId);
                });
            });

            this.#applyLineageFilter(el);
        }
    };
}
