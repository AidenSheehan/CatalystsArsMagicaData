const PARENT_FOLDER_NAME = "Augur Campaign Entities";
const NPC_FOLDER_NAME = "NPCs";
const FACTION_FOLDER_NAME = "Factions";
const SHIP_FOLDER_NAME = "Ships";

export class CampaignEntityFolderManager {
    static async getOrCreateNpcFolder() {
        const parent = await this.#getOrCreateFolder({
            name: PARENT_FOLDER_NAME,
            type: "JournalEntry",
            color: "#1c3246"
        });
        return this.#getOrCreateFolder({
            name: NPC_FOLDER_NAME,
            type: "JournalEntry",
            color: "#21465c",
            parent
        });
    }

    static async getOrCreateFactionFolder() {
        const parent = await this.#getOrCreateFolder({
            name: PARENT_FOLDER_NAME,
            type: "JournalEntry",
            color: "#1c3246"
        });
        return this.#getOrCreateFolder({
            name: FACTION_FOLDER_NAME,
            type: "JournalEntry",
            color: "#2c4f34",
            parent
        });
    }

    static async getOrCreateShipFolder() {
        const parent = await this.#getOrCreateFolder({
            name: PARENT_FOLDER_NAME,
            type: "JournalEntry",
            color: "#1c3246"
        });
        return this.#getOrCreateFolder({
            name: SHIP_FOLDER_NAME,
            type: "JournalEntry",
            color: "#21465c",
            parent
        });
    }

    static async #getOrCreateFolder({ name, type, color, parent = null } = {}) {
        const existing = game.folders.find(folder =>
            folder.name === name
            && folder.type === type
            && ((parent && folder.folder?.id === parent.id) || (!parent && !folder.folder))
        );
        if (existing) return existing;

        return Folder.create({
            name,
            type,
            color,
            folder: parent?.id || null
        });
    }
}
