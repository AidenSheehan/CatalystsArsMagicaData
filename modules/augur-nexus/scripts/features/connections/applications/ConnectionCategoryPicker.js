import { confirmDestructiveAction } from "../../../api/ui.js";
import { ConnectionCategories } from "../services/ConnectionCategories.js";
import { ConnectionCategoryPresets } from "../services/ConnectionCategoryPresets.js";
import { ConnectionStore } from "../services/ConnectionStore.js";

const CATEGORY_ICON_OPTIONS = [
    "fas fa-tag", "fas fa-star", "fas fa-eye", "fas fa-question", "fas fa-exclamation", "fas fa-bullseye",
    "fas fa-user", "fas fa-users", "fas fa-user-shield", "fas fa-crown", "fas fa-chess-knight", "fas fa-mask",
    "fas fa-shield-halved", "fas fa-flag", "fas fa-building-columns", "fas fa-handshake", "fas fa-scale-balanced",
    "fas fa-skull", "fas fa-paw", "fas fa-dragon", "fas fa-bug", "fas fa-burst", "fas fa-fire",
    "fas fa-location-dot", "fas fa-map", "fas fa-dungeon", "fas fa-house", "fas fa-tent", "fas fa-door-open",
    "fas fa-suitcase", "fas fa-gem", "fas fa-scroll", "fas fa-key", "fas fa-coins", "fas fa-book"
];

const CATEGORY_COLOR_OPTIONS = [
    "#83c95f", "#55bdec", "#ff5b4e", "#b46cff", "#f0a92f", "#c9a7ff",
    "#6ed6e6", "#e76f99", "#f0c84c", "#8ed36f", "#a8b0bd", "#ffffff"
];

export class ConnectionCategoryPicker {
    static async choose({ currentCategoryId = "", target = null } = {}) {
        while (true) {
            const result = await this.#openPicker({ currentCategoryId, target });
            if (!result || typeof result !== "object") return null;
            if (result.action === "assign" && result.categoryId) return result.categoryId;

            if (result.action === "create") {
                const category = await this.#promptCustomCategory();
                if (category?.id) return category.id;
                continue;
            }

            if (result.action === "edit" && result.categoryId) {
                const category = ConnectionCategories.get(result.categoryId, ConnectionStore.getCustomCategories());
                await this.#promptCustomCategory(category);
                continue;
            }
        }
    }

    static async assignEdgeCategory(edgeId, categoryId, { nodeId = "" } = {}) {
        const customCategories = ConnectionStore.getCustomCategories();
        const category = ConnectionCategories.get(categoryId, customCategories);
        if (nodeId) {
            return ConnectionStore.setConnectionViewForNode(edgeId, nodeId, {
                category: category.id
            });
        }
        return ConnectionStore.updateConnection(edgeId, {
            category: category.id
        });
    }

    static async #openPicker({ currentCategoryId = "", target = null } = {}) {
        const customCategories = ConnectionStore.getCustomCategories();
        const categories = ConnectionCategoryPresets.orderCategories(ConnectionCategories.editable(customCategories), { target }).map(category => ({
            ...category,
            active: category.id === currentCategoryId
        }));
        const actionId = `connection-category-action-${foundry.utils.randomID()}`;
        const searchId = `connection-category-search-${foundry.utils.randomID()}`;
        const safe = value => foundry.utils.escapeHTML(String(value || ""));

        const renderRow = category => `
            <div class="connection-category-row" data-category-search-row data-search-text="${safe(category.label.toLocaleLowerCase())}" style="--connection-category-color: ${safe(category.color)};">
                <button type="button" class="connection-category-row-main ${category.active ? "active" : ""}" data-category-action="assign" data-category-id="${safe(category.id)}">
                    <i class="${safe(category.icon)}"></i>
                    <span>${safe(category.label)}</span>
                    ${category.active ? "<strong>Current</strong>" : ""}
                </button>
                ${category.custom ? `
                    <button type="button" class="connection-category-row-actions" data-category-action="manage" data-category-id="${safe(category.id)}" title="Manage ${safe(category.label)}" aria-label="Manage ${safe(category.label)}">
                        <i class="fas fa-ellipsis"></i>
                    </button>
                ` : ""}
            </div>
        `;

        return foundry.applications.api.DialogV2.wait({
            window: { title: "Change Category" },
            position: { width: 430 },
            modal: true,
            rejectClose: false,
            content: `
                <div class="connection-category-picker">
                    <div class="connection-category-search">
                        <i class="fas fa-search"></i>
                        <input id="${searchId}" type="search" placeholder="Search categories" autocomplete="off">
                    </div>
                    <input id="${actionId}" type="hidden" value="">
                    <div class="connection-category-list">
                        ${categories.map(renderRow).join("")}
                    </div>
                    <button type="button" class="connection-category-new" data-category-action="create">
                        <i class="fas fa-plus"></i>
                        <span>New Category</span>
                    </button>
                </div>
            `,
            buttons: [
                {
                    action: "confirm",
                    label: "Apply",
                    icon: "fa-solid fa-check",
                    callback: () => {
                        const raw = document.getElementById(actionId)?.value || "";
                        try {
                            return raw ? JSON.parse(raw) : false;
                        } catch (_err) {
                            return false;
                        }
                    }
                },
                {
                    action: "cancel",
                    label: "Cancel",
                    icon: "fa-solid fa-xmark",
                    callback: () => false
                }
            ],
            render: (_event, dialog) => {
                const root = dialog.element;
                const actionInput = root?.querySelector?.(`#${CSS.escape(actionId)}`);
                const confirmButton = root?.querySelector?.("button[data-action='confirm']");
                const submitAction = data => {
                    actionInput.value = JSON.stringify(data);
                    confirmButton?.click();
                };

                root?.querySelectorAll?.("[data-category-action='assign']").forEach(button => {
                    button.addEventListener("click", event => {
                        event.preventDefault();
                        submitAction({ action: "assign", categoryId: button.dataset.categoryId || "" });
                    });
                });

                root?.querySelector("[data-category-action='create']")?.addEventListener("click", event => {
                    event.preventDefault();
                    submitAction({ action: "create" });
                });

                root?.querySelectorAll?.("[data-category-action='manage']").forEach(button => {
                    button.addEventListener("click", event => {
                        event.preventDefault();
                        event.stopPropagation();
                        root.querySelector(".connection-category-inline-menu")?.remove();
                        const categoryId = button.dataset.categoryId || "";
                        const menu = document.createElement("div");
                        menu.className = "connection-category-inline-menu";
                        menu.innerHTML = `
                            <button type="button" data-inline-action="edit">
                                <i class="fas fa-pen"></i>
                                <span>Edit Category</span>
                            </button>
                            <button type="button" class="danger" data-inline-action="delete">
                                <i class="fas fa-trash"></i>
                                <span>Delete Category</span>
                            </button>
                        `;
                        root.append(menu);
                        const rootRect = root.getBoundingClientRect();
                        const buttonRect = button.getBoundingClientRect();
                        menu.style.left = `${Math.max(8, buttonRect.right - rootRect.left - menu.offsetWidth)}px`;
                        menu.style.top = `${buttonRect.bottom - rootRect.top + 4}px`;

                        menu.querySelector("[data-inline-action='edit']")?.addEventListener("click", event => {
                            event.preventDefault();
                            event.stopPropagation();
                            menu.remove();
                            submitAction({ action: "edit", categoryId });
                        });
                        menu.querySelector("[data-inline-action='delete']")?.addEventListener("click", async event => {
                            event.preventDefault();
                            event.stopPropagation();
                            menu.remove();
                            const category = ConnectionCategories.get(categoryId, ConnectionStore.getCustomCategories());
                            const deleted = await this.#deleteCustomCategory(category);
                            if (deleted) submitAction({ action: "deleted", categoryId: category.id });
                        });
                    });
                });

                root?.addEventListener("pointerdown", event => {
                    if (event.target.closest("[data-category-action='manage']")) return;
                    if (event.target.closest(".connection-category-inline-menu")) return;
                    root.querySelector(".connection-category-inline-menu")?.remove();
                });

                const searchInput = root?.querySelector?.(`#${CSS.escape(searchId)}`);
                searchInput?.addEventListener("input", () => {
                    const query = searchInput.value.trim().toLocaleLowerCase();
                    root.querySelectorAll("[data-category-search-row]").forEach(row => {
                        row.hidden = !!query && !String(row.dataset.searchText || "").includes(query);
                    });
                });
                requestAnimationFrame(() => searchInput?.focus({ preventScroll: true }));
            }
        });
    }

    static async #promptCustomCategory(category = null) {
        const isEdit = !!category?.id;
        const ids = {
            label: `connection-category-label-${foundry.utils.randomID()}`,
            icon: `connection-category-icon-${foundry.utils.randomID()}`,
            color: `connection-category-color-${foundry.utils.randomID()}`
        };
        const safe = value => foundry.utils.escapeHTML(String(value || ""));
        const read = () => ({
            id: category?.id || "",
            label: document.getElementById(ids.label)?.value?.trim() || "",
            icon: document.getElementById(ids.icon)?.value?.trim() || "fas fa-tag",
            color: document.getElementById(ids.color)?.value?.trim() || "#c9a7ff",
            createdTime: category?.createdTime || Date.now()
        });

        const result = await foundry.applications.api.DialogV2.wait({
            window: { title: isEdit ? "Edit Category" : "Create Category" },
            position: { width: 420 },
            modal: true,
            rejectClose: false,
            content: `
                <div class="connection-category-dialog">
                    <label for="${ids.label}">Name</label>
                    <input id="${ids.label}" type="text" value="${safe(category?.label || "")}" placeholder="Officers" autocomplete="off">
                    <input id="${ids.icon}" type="hidden" value="${safe(category?.icon || "fas fa-tag")}">
                    <label>Icon</label>
                    <div class="connection-category-icon-grid">
                        ${CATEGORY_ICON_OPTIONS.map(icon => `
                            <button type="button" class="connection-category-icon-option ${icon === (category?.icon || "fas fa-tag") ? "active" : ""}" data-category-icon="${safe(icon)}" title="${safe(icon)}">
                                <i class="${safe(icon)}"></i>
                            </button>
                        `).join("")}
                    </div>
                    <label for="${ids.color}">Color</label>
                    <div class="connection-category-color-row">
                        ${CATEGORY_COLOR_OPTIONS.map(color => `
                            <button type="button" class="connection-category-color-option ${color === (category?.color || "#c9a7ff") ? "active" : ""}" data-category-color="${safe(color)}" style="--connection-category-color: ${safe(color)};" title="${safe(color)}"></button>
                        `).join("")}
                        <input id="${ids.color}" type="color" value="${safe(category?.color || "#c9a7ff")}">
                    </div>
                </div>
            `,
            buttons: [
                {
                    action: "confirm",
                    label: "Save",
                    icon: "fa-solid fa-check",
                    default: true,
                    callback: () => read()
                },
                {
                    action: "cancel",
                    label: "Cancel",
                    icon: "fa-solid fa-xmark",
                    callback: () => false
                }
            ],
            render: (_event, dialog) => {
                const root = dialog.element;
                const input = root?.querySelector?.(`#${CSS.escape(ids.label)}`);
                const iconInput = root?.querySelector?.(`#${CSS.escape(ids.icon)}`);
                const colorInput = root?.querySelector?.(`#${CSS.escape(ids.color)}`);
                root?.querySelectorAll?.("[data-category-icon]").forEach(button => {
                    button.addEventListener("click", event => {
                        event.preventDefault();
                        iconInput.value = button.dataset.categoryIcon || "fas fa-tag";
                        root.querySelectorAll("[data-category-icon]").forEach(candidate => candidate.classList.toggle("active", candidate === button));
                    });
                });
                root?.querySelectorAll?.("[data-category-color]").forEach(button => {
                    button.addEventListener("click", event => {
                        event.preventDefault();
                        colorInput.value = button.dataset.categoryColor || "#c9a7ff";
                        root.querySelectorAll("[data-category-color]").forEach(candidate => candidate.classList.toggle("active", candidate === button));
                    });
                });
                colorInput?.addEventListener("input", () => {
                    root?.querySelectorAll?.("[data-category-color]").forEach(candidate => candidate.classList.remove("active"));
                });
                requestAnimationFrame(() => {
                    input?.focus({ preventScroll: true });
                    input?.select();
                });
            }
        });

        if (!result || result === "cancel" || typeof result !== "object") return null;
        if (!result.label) {
            ui.notifications.warn("Category name cannot be empty.");
            return null;
        }
        return ConnectionStore.upsertCustomCategory(result);
    }

    static async #deleteCustomCategory(category) {
        if (!category?.custom) return false;
        const confirmed = await confirmDestructiveAction({
            title: "Delete Custom Category",
            subject: category.label,
            message: `Delete the custom category <strong>${foundry.utils.escapeHTML(category.label)}</strong>? Connections using it will move to <strong>Unassigned</strong>.`,
            impacts: [{ label: "affected connection", count: this.#countConnectionsInCategory(category.id) }],
            confirmLabel: "Delete Category"
        });
        if (!confirmed) return false;
        await ConnectionStore.deleteCustomCategory(category.id);
        return true;
    }

    static #countConnectionsInCategory(categoryId) {
        const graph = ConnectionStore.getGraph();
        return Object.values(graph.edges || {}).filter(edge =>
            edge.category === categoryId
            || Object.values(edge.views || {}).some(view => view.category === categoryId)
        ).length;
    }
}
