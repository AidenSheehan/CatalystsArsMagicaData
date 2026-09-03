import { SitePanel } from "../applications/SitePanel.js";
import { EntityPlacementTab } from "../applications/tabs/EntityPlacementTab.js";
import { NexusMarkerService } from "../../markers/services/NexusMarkerService.js";
import { SiteEditor } from "./SiteEditor.js";
import { SiteGenerator } from "./SiteGenerator.js";
import { SiteSelectionHighlighter } from "./SiteSelectionHighlighter.js";

const TOOL_NAME = "nexus-sites";
const ICON_SIZE_STEP = 10;
const ROTATION_STEP = 45;

export class NexusPlacementGestureController {
    static #active = false;
    static #keydownHandler = null;

    static activate() {
        if (this.#active) return;
        this.#active = true;
        this.#keydownHandler = event => this.#handleKeyDown(event);
        window.addEventListener("keydown", this.#keydownHandler, { capture: true });
    }

    static deactivate() {
        if (!this.#active) return;
        this.#active = false;
        if (this.#keydownHandler) window.removeEventListener("keydown", this.#keydownHandler, { capture: true });
        this.#keydownHandler = null;
    }

    static #handleKeyDown(event) {
        if (!game.user?.isGM) return;
        if (this.#isTextEntry(event.target)) return;

        const activeTool = ui.controls?.tool;
        const toolName = activeTool?.name || activeTool;
        if (toolName !== TOOL_NAME) return;

        const key = String(event.key || "").toLowerCase();
        const command = this.#commandForKey(key);
        if (!command) return;

        const handled = this.#applyCommand(command);
        if (!handled) return;

        event.preventDefault();
        event.stopPropagation();
    }

    static #commandForKey(key) {
        switch (key) {
            case "escape":
                return { cancel: true };
            case "q":
                return { rotationDelta: -ROTATION_STEP };
            case "e":
                return { rotationDelta: ROTATION_STEP };
            case "w":
                return { iconSizeDelta: ICON_SIZE_STEP };
            case "s":
                return { iconSizeDelta: -ICON_SIZE_STEP };
            case "a":
                return { resetIconSize: true };
            default:
                return null;
        }
    }

    static #applyCommand(command) {
        if (command.cancel) return this.#closeSitesTool();

        if (SiteEditor.isEditMode) {
            if (NexusMarkerService.isDragging) return this.#refreshSelectionAfter(NexusMarkerService.transformActiveGesture(null, command));
            return false;
        }

        const activeEntityType = EntityPlacementTab.getActiveEntityType(SitePanel.activeTab);
        if (activeEntityType) {
            const handled = NexusMarkerService.transformActiveGesture(activeEntityType, command);
            if (handled) SitePanel.refreshIfOpen();
            return handled;
        }
        if (SitePanel.activeTab === "site") return SiteGenerator.transformActiveGesture(command);
        return false;
    }

    static #refreshSelectionAfter(handled) {
        if (handled) SiteSelectionHighlighter.refresh();
        return handled;
    }

    static #closeSitesTool() {
        if (NexusMarkerService.isDragging) this.#refreshSelectionAfter(NexusMarkerService.cancelDrag());
        NexusMarkerService.clearGhost();
        SiteGenerator.clearGhost();
        SitePanel.dismiss();
        return true;
    }

    static #isTextEntry(target) {
        if (!target) return false;
        if (target.isContentEditable) return true;
        const tagName = String(target.tagName || "").toLowerCase();
        return ["input", "textarea", "select"].includes(tagName);
    }
}
