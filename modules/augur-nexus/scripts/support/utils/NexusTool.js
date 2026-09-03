// Small base window class for Nexus tools. This handles the common app defaults and cleans up toolbar state when a tool window closes.
// This was amajor headache in the past, I must remember to always use this on the tool/apps.

import { applySessionWindowPlacement, rememberSessionWindowPlacement } from "/modules/augur-nexus/scripts/api/window-placement.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class NexusTool extends HandlebarsApplicationMixin(ApplicationV2) {
    #sessionPlacementInitialized = false;

    static TOOL_NAME = "";
    static SESSION_PLACEMENT_KEY = "";

    static DEFAULT_OPTIONS = {
        tag: "div",
        window: {
            resizable: true
        },
        position: {
            left: 120,
            top: 60
        }
    };

    _onRender(context, options) {
        super._onRender(context, options);
        if (!this.#sessionPlacementInitialized && this.constructor.SESSION_PLACEMENT_KEY) {
            applySessionWindowPlacement(this, this.constructor.SESSION_PLACEMENT_KEY, { fallback: "default" });
            this.#sessionPlacementInitialized = true;
        }
    }

    async close(options) {
        if (this.constructor.SESSION_PLACEMENT_KEY) rememberSessionWindowPlacement(this, this.constructor.SESSION_PLACEMENT_KEY);
        if (ui.controls) {
            const activeTool = ui.controls.tool;
            const toolName = activeTool?.name || activeTool;

            if (!options?.skipToolDeactivate && this.constructor.TOOL_NAME && toolName === this.constructor.TOOL_NAME) {
                ui.controls.activate({ control: "augurTools", tool: "augur-select" });
            }
        }

        return super.close(options);
    }
}