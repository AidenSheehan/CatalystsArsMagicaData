import { Log } from "../../../support/utils/Logger.js";

const suppressors = new Map();
const PASSIVE_SITE_CLICK_TOOLS = new Set([
    "tokens:select",
    "augurTools:augur-select"
]);

export class SiteInteractionPolicy {
    static registerSuppressor(moduleId, predicate) {
        if (!moduleId || typeof predicate !== "function") return false;
        suppressors.set(moduleId, predicate);
        return true;
    }

    static unregisterSuppressor(moduleId) {
        if (!moduleId) return false;
        return suppressors.delete(moduleId);
    }

    static canHandlePassiveSiteClick({ controlName = "", toolName = "" } = {}) {
        const normalizedControl = String(controlName || "").trim();
        const normalizedTool = String(toolName || "").trim();
        return PASSIVE_SITE_CLICK_TOOLS.has(`${normalizedControl}:${normalizedTool}`);
    }

    static shouldSuppress(context = {}) {
        for (const [moduleId, predicate] of suppressors.entries()) {
            try {
                if (predicate(context) === true) return true;
            } catch (err) {
                Log.warn(`Site interaction suppressor failed for ${moduleId}.`, err);
            }
        }
        return false;
    }
}
