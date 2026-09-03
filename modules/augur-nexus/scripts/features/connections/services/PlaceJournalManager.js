const MODULE_ID = "augur-nexus";

export class PlaceJournalManager {
    static FOLDER_NAME = "Augur Nexus Places";
    static ENTRY_SETTING_KEY = "placeJournalEntryId";

    static getJournalPage(scene) {
        if (!scene) return null;
        const flags = scene.getFlag(MODULE_ID, "placePreview") || {};
        const entry = flags.journalEntryId ? game.journal.get(flags.journalEntryId) || null : this.#getSharedEntry();
        if (!entry) return null;
        if (flags.journalPageId) return entry.pages.get(flags.journalPageId) || null;
        return entry.pages.contents.find(page => page.flags?.[MODULE_ID]?.placePage && page.flags?.[MODULE_ID]?.sceneId === scene.id) || null;
    }

    static async getOrCreateJournalPage(scene) {
        if (!scene) return null;
        const existing = this.getJournalPage(scene);
        if (existing) return existing;

        const entry = await this.#getOrCreateSharedEntry();
        if (!entry) return null;
        const [created] = await entry.createEmbeddedDocuments("JournalEntryPage", [{
            name: scene.name || "Place Notes",
            type: "text",
            sort: (entry.pages.size + 1) * CONST.SORT_INTEGER_DENSITY,
            flags: {
                [MODULE_ID]: {
                    placePage: true,
                    sceneId: scene.id
                }
            },
            text: {
                content: "",
                format: 1
            }
        }]);

        if (created) {
            await scene.setFlag(MODULE_ID, "placePreview", {
                ...(scene.getFlag(MODULE_ID, "placePreview") || {}),
                journalEntryId: entry.id,
                journalPageId: created.id
            });
        }

        return created || null;
    }

    static #getSharedEntry() {
        const entryId = game.settings.get(MODULE_ID, this.ENTRY_SETTING_KEY) || "";
        return (entryId ? game.journal.get(entryId) : null)
            || game.journal.find(entry => entry.name === "Nexus Places" && entry.folder?.name === this.FOLDER_NAME)
            || null;
    }

    static async #getOrCreateSharedEntry() {
        const existing = this.#getSharedEntry();
        if (existing) {
            const currentId = game.settings.get(MODULE_ID, this.ENTRY_SETTING_KEY) || "";
            if (currentId !== existing.id) await game.settings.set(MODULE_ID, this.ENTRY_SETTING_KEY, existing.id);
            return existing;
        }

        const folder = await this.#getOrCreateFolder();
        const entry = await JournalEntry.create({
            name: "Nexus Places",
            folder: folder?.id || null,
            ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER }
        });
        await game.settings.set(MODULE_ID, this.ENTRY_SETTING_KEY, entry.id);
        return entry;
    }

    static async #getOrCreateFolder() {
        let folder = game.folders.find(folder => folder.name === this.FOLDER_NAME && folder.type === "JournalEntry");
        if (!folder) {
            folder = await Folder.create({
                name: this.FOLDER_NAME,
                type: "JournalEntry",
                color: "#1b3140"
            });
        }
        return folder;
    }
}
