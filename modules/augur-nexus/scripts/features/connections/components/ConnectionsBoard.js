import { openActionMenu, promptTextInput } from "../../../api/ui.js";
import { ConnectionCategoryPicker } from "../applications/ConnectionCategoryPicker.js";
import { ConnectionCategories } from "../services/ConnectionCategories.js";
import { ConnectionCategoryPresets } from "../services/ConnectionCategoryPresets.js";
import { ConnectionDropResolver } from "../services/ConnectionDropResolver.js";
import { ConnectionStore } from "../services/ConnectionStore.js";
import { ConnectionTargetResolver } from "../services/ConnectionTargetResolver.js";
import { PlayerConnectionVisibilityDialog } from "../../nexus/applications/PlayerConnectionVisibilityDialog.js";
import { PlayerVisibilityInfoPanel } from "../../nexus/applications/PlayerVisibilityInfoPanel.js";

export class ConnectionsBoard {
    #target = null;
    #isGM = false;
    #activeCategory = "all";

    constructor({ target, isGM = game.user.isGM, activeCategory = "all" } = {}) {
        this.#target = target;
        this.#isGM = isGM;
        this.#activeCategory = ConnectionCategories.normalize(activeCategory);
    }

    get activeCategory() {
        return this.#activeCategory;
    }

    setTarget(target) {
        this.#target = target;
    }

    setCategory(categoryId) {
        this.#activeCategory = ConnectionCategories.normalize(categoryId, "all", ConnectionStore.getCustomCategories());
    }

    getContext() {
        const target = this.#target;
        const nodeId = ConnectionTargetResolver.getNodeId(target);
        const customCategories = ConnectionStore.getCustomCategories();
        const connections = ConnectionStore.getConnectionsForNode(nodeId);
        const allCards = connections.map(({ edge, node }) => this.#buildCard(edge, node, nodeId, customCategories));

        const editableCategories = this.#orderCategories(ConnectionCategories.editable(customCategories), nodeId, target);
        const allGroups = editableCategories
            .map(category => {
                const groupCards = allCards.filter(card => card.categoryId === category.id);
                const hiddenForPlayers = ConnectionStore.isCategoryGroupHiddenForNode(nodeId, category.id);
                const playerVisible = ConnectionStore.canUserSeeCategoryGroup(nodeId, category.id, game.user);
                return {
                    ...category,
                    hiddenForPlayers,
                    playerVisible,
                    cards: groupCards
                };
            })
            .filter(group => group.cards.length > 0)
            .filter(group => this.#isGM || group.playerVisible);

        const categoryIdsWithCards = new Set(allGroups.map(group => group.id));
        if (this.#activeCategory !== "all" && !categoryIdsWithCards.has(this.#activeCategory)) {
            this.#activeCategory = "all";
        }

        const visibleGroups = allGroups.filter(group => this.#activeCategory === "all" || group.id === this.#activeCategory);
        const visibleCards = visibleGroups.flatMap(group => group.cards);
        const orderedCategories = [
            ConnectionCategories.get("all", customCategories),
            ...editableCategories
        ];
        const categories = orderedCategories
            .filter(category => category.id === "all" || categoryIdsWithCards.has(category.id))
            .map(category => ({
                ...category,
                active: category.id === this.#activeCategory,
                count: category.id === "all"
                    ? allGroups.reduce((sum, group) => sum + group.cards.length, 0)
                    : allGroups.find(group => group.id === category.id)?.cards.length || 0
            }));
        const activeCategory = categories.find(category => category.active) || categories[0] || ConnectionCategories.get("all", customCategories);
        const visibleCategoryIds = visibleGroups.map(group => group.id);

        return {
            target: this.#buildTargetContext(target),
            categories,
            activeCategory: this.#activeCategory,
            activeCategoryIcon: activeCategory?.icon || "fas fa-share-nodes",
            hasConnections: visibleCards.length > 0,
            isGM: this.#isGM,
            groups: visibleGroups.map(group => {
                const visibleIndex = visibleCategoryIds.indexOf(group.id);
                return {
                    ...group,
                    visible: true,
                    canMoveUp: visibleIndex > 0,
                    canMoveDown: visibleIndex >= 0 && visibleIndex < visibleCategoryIds.length - 1
                };
            })
        };
    }

    activateListeners(rootElement, hostApplication) {
        const board = rootElement?.querySelector?.("[data-connections-board]");
        if (!board) return;

        board.querySelectorAll("[data-connection-category]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                this.#activeCategory = ConnectionCategories.normalize(button.dataset.connectionCategory, "all", ConnectionStore.getCustomCategories());
                hostApplication.render({ parts: ["content"] });
            });
        });

        board.querySelectorAll("[data-connection-category-select]").forEach(select => {
            select.addEventListener("change", event => {
                this.#activeCategory = ConnectionCategories.normalize(event.currentTarget.value, "all", ConnectionStore.getCustomCategories());
                hostApplication.render({ parts: ["content"] });
            });
        });

        board.querySelectorAll("[data-connection-group-actions]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                this.#openGroupActions(button, hostApplication);
            });
        });

        board.querySelectorAll("[data-connection-open]").forEach(button => {
            button.addEventListener("click", async event => {
                event.preventDefault();
                const node = ConnectionStore.getNode(button.dataset.connectionNodeId);
                await ConnectionTargetResolver.openNode(node);
            });
        });

        board.querySelectorAll("[data-connection-actions]").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                this.#openCardActions(button, hostApplication);
            });
        });

        board.querySelectorAll("[data-connection-group-move]").forEach(button => {
            button.addEventListener("click", async event => {
                event.preventDefault();
                event.stopPropagation();
                button.blur();
                const categoryId = button.dataset.connectionCategoryId || "";
                const direction = Number(button.dataset.connectionGroupMove || 0);
                const categoryIds = [...board.querySelectorAll(".connections-group[data-connection-category-id]")]
                    .map(group => group.dataset.connectionCategoryId || "")
                    .filter(Boolean);
                const moved = await ConnectionStore.moveGroupForNode(ConnectionTargetResolver.getNodeId(this.#target), categoryId, direction, { categoryIds });
                if (moved) hostApplication.render({ parts: ["content"] });
            });
        });

        board.querySelectorAll("[data-connection-drag]").forEach(card => {
            card.addEventListener("dragstart", event => {
                this.#setConnectionRowDragData(event, card);
                const node = ConnectionStore.getNode(card.dataset.connectionNodeId || "");
                ConnectionTargetResolver.setDragData(event.dataTransfer, node, { effectAllowed: "copyMove" });
            });
        });

        if (!this.#isGM) return;
        board.querySelectorAll(".connection-card").forEach(card => {
            if (!card.hasAttribute("data-connection-drag")) {
                card.addEventListener("dragstart", event => this.#setConnectionRowDragData(event, card));
            }

            card.addEventListener("dragover", event => {
                event.preventDefault();
                event.stopPropagation();
                card.classList.add("is-drop-before");
            });

            card.addEventListener("dragleave", event => {
                if (card.contains(event.relatedTarget)) return;
                card.classList.remove("is-drop-before");
            });

            card.addEventListener("drop", async event => {
                event.preventDefault();
                event.stopPropagation();
                card.classList.remove("is-drop-before");
                await this.#handleDrop(event, hostApplication, card);
            });
        });

        board.querySelectorAll("[data-connection-category-id]").forEach(group => {
            group.addEventListener("dragover", event => {
                event.preventDefault();
                event.stopPropagation();
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
                await this.#handleDrop(event, hostApplication, group);
            });
        });

        board.addEventListener("dragover", event => {
            event.preventDefault();
            board.classList.add("is-drop-target");
        });
        board.addEventListener("dragleave", event => {
            if (board.contains(event.relatedTarget)) return;
            board.classList.remove("is-drop-target");
        });
        board.addEventListener("drop", async event => {
            event.preventDefault();
            board.classList.remove("is-drop-target");
            await this.#handleDrop(event, hostApplication);
        });

        rootElement.querySelectorAll("[data-connections-drop-surface]").forEach(surface => {
            if (surface === board) return;

            surface.addEventListener("dragover", event => {
                event.preventDefault();
                surface.classList.add("is-connection-drop-target");
            });

            surface.addEventListener("dragleave", event => {
                if (surface.contains(event.relatedTarget)) return;
                surface.classList.remove("is-connection-drop-target");
            });

            surface.addEventListener("drop", async event => {
                event.preventDefault();
                surface.classList.remove("is-connection-drop-target");
                const targetElement = event.target instanceof Element ? event.target : event.target?.parentElement;
                if (targetElement?.closest("[data-connections-board]")) return;
                await this.#handleDrop(event, hostApplication);
            });
        });
    }

    #buildTargetContext(target) {
        return {
            ...target,
            color: target?.siteColor || "#ffffff",
            icon: target?.img || "",
            name: target?.name || "Site",
            subtitle: target?.subtitle || ""
        };
    }

    #orderCategories(categories = [], nodeId = "", target = null) {
        const categoryIds = new Set(categories.map(category => category.id));
        const order = ConnectionStore.getGroupOrderForNode(nodeId).filter(id => categoryIds.has(id));
        return ConnectionCategoryPresets.orderCategories(categories, { target, order });
    }

    #buildCard(edge, node, currentNodeId = "", customCategories = {}) {
        const displayNode = ConnectionTargetResolver.resolveDisplayNodeSync(node) || { id: "", name: "Missing connection", missing: true };
        const view = ConnectionStore.getConnectionView(edge, currentNodeId, customCategories);
        const categoryId = ConnectionCategories.normalize(view.category || displayNode.category, "npc", customCategories);
        const category = ConnectionCategories.get(categoryId, customCategories);
        return {
            edgeId: edge.id,
            nodeId: displayNode.id,
            name: displayNode.name || "Unknown",
            subtitle: displayNode.missing ? "Missing" : (displayNode.embeddedLabel || view.role || category.singular),
            img: displayNode.img || "",
            icon: category.icon,
            categoryId,
            color: category.color,
            customCategory: category.custom === true,
            draggable: !!ConnectionTargetResolver.getDragData(displayNode),
            dragType: "node",
            uuid: displayNode.uuid || "",
            note: String(view.note || "").trim(),
            missing: !!displayNode.missing,
            playerVisibilityLabel: ConnectionStore.getConnectionPlayerVisibilityLabel(edge),
            playerVisibilityIcon: ConnectionStore.getConnectionPlayerVisibilityIcon(edge),
            isPlayerHidden: !ConnectionStore.isConnectionVisibleToPlayers(edge)
        };
    }

    #setConnectionRowDragData(event, card) {
        const edgeId = card.dataset.connectionEdgeId || "";
        if (!edgeId || !event.dataTransfer) return;
        event.dataTransfer.setData("application/x-augur-connection-row", JSON.stringify({
            edgeId,
            sourceNodeId: ConnectionTargetResolver.getNodeId(this.#target),
            categoryId: card.dataset.connectionCategoryId || ""
        }));
    }

    async #handleDrop(event, hostApplication, targetElement = null) {
        const handledInternalDrop = await this.#handleInternalConnectionDrop(event, hostApplication, targetElement);
        if (handledInternalDrop) return;

        const relatedTarget = await ConnectionDropResolver.fromEvent(event);
        if (!relatedTarget) {
            ui.notifications.warn("Drop an Actor, Item, Journal, Journal Page, or Nexus place to connect it.");
            return;
        }

        const customCategories = ConnectionStore.getCustomCategories();
        const targetCategoryId = targetElement?.closest?.("[data-connection-category-id]")?.dataset?.connectionCategoryId || "";
        const categoryId = targetCategoryId
            || (this.#activeCategory !== "all" ? this.#activeCategory : "")
            || ConnectionCategoryPresets.defaultCategoryForConnection(this.#target, relatedTarget, customCategories);
        const category = categoryId ? ConnectionCategories.get(categoryId, customCategories) : null;
        const edge = await ConnectionStore.addConnection(this.#target, relatedTarget, category ? {
            category: category.id,
            role: category.singular
        } : {});
        if (!edge) return;
        hostApplication.render({ parts: ["content"] });
    }

    async #handleInternalConnectionDrop(event, hostApplication, targetElement = null) {
        const raw = event.dataTransfer?.getData("application/x-augur-connection-row") || "";
        if (!raw) return false;

        try {
            const payload = JSON.parse(raw);
            if (!payload?.edgeId) return true;

            const currentNodeId = ConnectionTargetResolver.getNodeId(this.#target);
            if (payload.sourceNodeId && payload.sourceNodeId !== currentNodeId) return false;

            const targetCategoryId = targetElement?.closest?.("[data-connection-category-id]")?.dataset?.connectionCategoryId || "";
            if (targetCategoryId && targetCategoryId !== payload.categoryId) {
                const category = ConnectionCategories.get(targetCategoryId, ConnectionStore.getCustomCategories());
                await ConnectionStore.setConnectionViewForNode(payload.edgeId, currentNodeId, { category: category.id });
            }

            const beforeEdgeId = targetElement?.closest?.(".connection-card")?.dataset?.connectionEdgeId || null;
            const sourceNodeId = payload.sourceNodeId || currentNodeId;
            if (sourceNodeId) await ConnectionStore.reorderConnectionForNode(payload.edgeId, sourceNodeId, beforeEdgeId);
            hostApplication.render({ parts: ["content"] });
        } catch (_err) {
            ui.notifications.warn("Could not rearrange that connection.");
        }

        return true;
    }

    #openCardActions(button, hostApplication) {
        if (!this.#isGM) return;
        const edgeId = button.dataset.connectionEdgeId;
        if (!edgeId) return;
        const currentNodeId = ConnectionTargetResolver.getNodeId(this.#target);
        const edge = ConnectionStore.getConnectionEdge(edgeId);
        const hasNote = !!String(ConnectionStore.getConnectionNoteForNode(edge, currentNodeId) || "").trim();

        openActionMenu({
            anchor: button,
            className: "connections-card-actions-menu",
            items: [
                {
                    id: "player-visibility",
                    label: `Visible To Players: ${ConnectionStore.getConnectionPlayerVisibilityLabel(edge)}`,
                    icon: ConnectionStore.getConnectionPlayerVisibilityIcon(edge),
                    onSelect: () => this.#openPlayerVisibilityMenu(button, edgeId, hostApplication)
                },
                {
                    id: "edit-note",
                    label: hasNote ? "Edit Note..." : "Add Note...",
                    icon: "fas fa-note-sticky",
                    onSelect: () => this.#editNote(edgeId, currentNodeId, hostApplication)
                },
                {
                    id: "change-role",
                    label: "Edit Role...",
                    icon: "fas fa-pen-to-square",
                    onSelect: () => this.#editRole(edgeId, currentNodeId, hostApplication)
                },
                {
                    id: "change-category",
                    label: "Change Category...",
                    icon: "fas fa-tags",
                    onSelect: () => this.#openCategoryPicker(edgeId, currentNodeId, hostApplication)
                },
                {
                    id: "remove-connection",
                    label: "Remove Connection",
                    icon: "fas fa-trash",
                    danger: true,
                    onSelect: async () => {
                        await ConnectionStore.removeConnection(edgeId);
                        hostApplication.render({ parts: ["content"] });
                    }
                }
            ]
        });
    }

    #openGroupActions(button, hostApplication) {
        if (!this.#isGM) return;
        const nodeId = ConnectionTargetResolver.getNodeId(this.#target);
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
                        hostApplication.render({ parts: ["content"] });
                    }
                }
            ]
        });
    }

    #openPlayerVisibilityMenu(anchor, edgeId, hostApplication) {
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
                    onSelect: () => this.#setPlayerVisibility(edgeId, "inherit", hostApplication)
                },
                {
                    id: "show",
                    label: current === "show" ? "Yes (Current)" : "Yes",
                    icon: "fas fa-eye",
                    onSelect: () => this.#setPlayerVisibility(edgeId, "show", hostApplication)
                },
                {
                    id: "hide",
                    label: current === "hide" ? "No (Current)" : "No",
                    icon: "fas fa-eye-slash",
                    onSelect: () => this.#setPlayerVisibility(edgeId, "hide", hostApplication)
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

    async #setPlayerVisibility(edgeId, value, hostApplication) {
        await ConnectionStore.setConnectionPlayerVisibility(edgeId, value);
        hostApplication.render({ parts: ["content"] });
    }

    async #editRole(edgeId, nodeId, hostApplication) {
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
        hostApplication.render({ parts: ["content"] });
    }

    async #editNote(edgeId, nodeId, hostApplication) {
        const edge = ConnectionStore.getConnectionEdge(edgeId);
        if (!edge) return;
        const note = await this.#promptConnectionNote(ConnectionStore.getConnectionNoteForNode(edge, nodeId) || "");
        if (note === null) return;
        await ConnectionStore.setConnectionViewForNode(edgeId, nodeId, { note });
        hostApplication.render({ parts: ["content"] });
    }

    async #promptConnectionNote(value = "") {
        const inputId = `augur-connection-note-${foundry.utils.randomID()}`;
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

    async #openCategoryPicker(edgeId, nodeId, hostApplication) {
        const edge = ConnectionStore.getConnectionEdge(edgeId);
        const currentCategoryId = edge ? ConnectionStore.getConnectionCategoryForNode(edge, nodeId, ConnectionStore.getCustomCategories()) : "";
        const categoryId = await ConnectionCategoryPicker.choose({ currentCategoryId, target: this.#target });
        if (!categoryId) return;
        await ConnectionCategoryPicker.assignEdgeCategory(edgeId, categoryId, { nodeId });
        hostApplication.render({ parts: ["content"] });
    }
}
