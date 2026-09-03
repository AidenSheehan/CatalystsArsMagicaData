import { ConnectionTargetResolver } from "./ConnectionTargetResolver.js";

export class ConnectionDropResolver {
    static async fromEvent(event) {
        const data = this.#getDropData(event);
        if (!data) return null;

        if (data.kind === "nexus-site" || data.kind === "nexus-scene" || data.kind === "nexus-entity" || data.type === "AugurNexusSite" || data.type === "AugurNexusNode" || data.type === "AugurNexusEntity") {
            return ConnectionTargetResolver.fromNodePayload(data);
        }

        const uuid = data.uuid || this.#uuidFromData(data);
        if (!uuid) return null;
        if (String(uuid).startsWith("Scene.")) return null;
        return ConnectionTargetResolver.fromUuid(uuid);
    }

    static #getDropData(event) {
        const raw = event?.dataTransfer?.getData("text/plain")
            || event?.dataTransfer?.getData("application/json")
            || "";
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch (_err) {
            return null;
        }
    }

    static #uuidFromData(data = {}) {
        const type = data.type || data.documentName || "";
        const id = data.id || data._id || "";
        if (!type || !id) return "";
        if (type === "Scene") return "";

        if (type === "JournalEntryPage" && data.parentUuid) return `${data.parentUuid}.JournalEntryPage.${id}`;
        if (type === "JournalEntryPage" && data.journalEntryId) return `JournalEntry.${data.journalEntryId}.JournalEntryPage.${id}`;
        return `${type}.${id}`;
    }
}
