import { NpcEntityModel } from "../models/NpcEntityModel.js";
import { FactionEntityModel } from "../models/FactionEntityModel.js";
import { ShipEntityModel } from "../models/ShipEntityModel.js";
import { NpcEntityNormalizer } from "./NpcEntityNormalizer.js";
import { FactionEntityNormalizer } from "./FactionEntityNormalizer.js";
import { ShipEntityNormalizer } from "./ShipEntityNormalizer.js";
import { PersonalityTraitRegistry } from "./PersonalityTraitRegistry.js";

export class CampaignEntityIndex {
    static #npcById = new Map();
    static #npcIdByJournalEntryId = new Map();
    static #factionById = new Map();
    static #factionIdByJournalEntryId = new Map();
    static #shipById = new Map();
    static #shipIdByJournalEntryId = new Map();
    static #rebuilt = false;

    static async initialize() {
        await PersonalityTraitRegistry.load();
        this.rebuild();
        this.#registerHooks();
    }

    static rebuild() {
        this.#npcById.clear();
        this.#npcIdByJournalEntryId.clear();
        this.#factionById.clear();
        this.#factionIdByJournalEntryId.clear();
        this.#shipById.clear();
        this.#shipIdByJournalEntryId.clear();
        for (const entry of game.journal?.contents || []) {
            this.upsert(entry);
        }
        this.#rebuilt = true;
        return this.getNpcs();
    }

    static ensureBuilt() {
        if (!this.#rebuilt) this.rebuild();
    }

    static upsert(document) {
        const raw = NpcEntityModel.fromDocument(document);
        if (raw?.id) return this.#upsertNpc(raw);
        const factionRaw = FactionEntityModel.fromDocument(document);
        if (factionRaw?.id) return this.#upsertFaction(factionRaw);
        const shipRaw = ShipEntityModel.fromDocument(document);
        if (shipRaw?.id) return this.#upsertShip(shipRaw);
        return null;
    }

    static remove(id) {
        const entityId = String(id || "").trim();
        if (!entityId) return;
        const entity = this.#npcById.get(entityId);
        if (entity?.journalEntryId) this.#npcIdByJournalEntryId.delete(entity.journalEntryId);
        this.#npcById.delete(entityId);
        const faction = this.#factionById.get(entityId);
        if (faction?.journalEntryId) this.#factionIdByJournalEntryId.delete(faction.journalEntryId);
        this.#factionById.delete(entityId);
        const ship = this.#shipById.get(entityId);
        if (ship?.journalEntryId) this.#shipIdByJournalEntryId.delete(ship.journalEntryId);
        this.#shipById.delete(entityId);
    }

    static getNpc(idOrUuid) {
        this.ensureBuilt();
        const value = String(idOrUuid || "").trim();
        if (!value) return null;
        if (this.#npcById.has(value)) return { ...this.#npcById.get(value) };
        return [...this.#npcById.values()].find(entity =>
            entity.uuid === value
            || entity.journalEntryId === value
            || `JournalEntry.${entity.journalEntryId}` === value
        ) || null;
    }

    static getNpcs({ search = "" } = {}) {
        this.ensureBuilt();
        const query = String(search || "").trim().toLocaleLowerCase();
        const rows = [...this.#npcById.values()]
            .sort((a, b) => NpcEntityModel.getName(a).localeCompare(NpcEntityModel.getName(b)));
        if (!query) return rows.map(entity => ({ ...entity }));
        return rows
            .filter(entity => NpcEntityModel.getSearchText(entity).includes(query))
            .map(entity => ({ ...entity }));
    }

    static getFaction(idOrUuid) {
        this.ensureBuilt();
        const value = String(idOrUuid || "").trim();
        if (!value) return null;
        if (this.#factionById.has(value)) return { ...this.#factionById.get(value) };
        return [...this.#factionById.values()].find(entity =>
            entity.uuid === value
            || entity.journalEntryId === value
            || `JournalEntry.${entity.journalEntryId}` === value
        ) || null;
    }

    static getFactions({ search = "" } = {}) {
        this.ensureBuilt();
        const query = String(search || "").trim().toLocaleLowerCase();
        const rows = [...this.#factionById.values()]
            .sort((a, b) => FactionEntityModel.getName(a).localeCompare(FactionEntityModel.getName(b)));
        if (!query) return rows.map(entity => ({ ...entity }));
        return rows
            .filter(entity => FactionEntityModel.getSearchText(entity).includes(query))
            .map(entity => ({ ...entity }));
    }

    static getShip(idOrUuid) {
        this.ensureBuilt();
        const value = String(idOrUuid || "").trim();
        if (!value) return null;
        if (this.#shipById.has(value)) return { ...this.#shipById.get(value) };
        return [...this.#shipById.values()].find(entity =>
            entity.uuid === value || entity.journalEntryId === value || `JournalEntry.${entity.journalEntryId}` === value
        ) || null;
    }

    static getShips({ search = "" } = {}) {
        this.ensureBuilt();
        const query = String(search || "").trim().toLocaleLowerCase();
        const rows = [...this.#shipById.values()].sort((a, b) => ShipEntityModel.getName(a).localeCompare(ShipEntityModel.getName(b)));
        if (!query) return rows.map(entity => ({ ...entity }));
        return rows.filter(entity => ShipEntityModel.getSearchText(entity).includes(query)).map(entity => ({ ...entity }));
    }

    static #upsertNpc(raw) {
        const entity = NpcEntityNormalizer.normalizeExisting(raw);
        const existing = this.#npcById.get(entity.id);
        if (existing?.journalEntryId) this.#npcIdByJournalEntryId.delete(existing.journalEntryId);
        this.#npcById.set(entity.id, entity);
        if (entity.journalEntryId) this.#npcIdByJournalEntryId.set(entity.journalEntryId, entity.id);
        return entity;
    }

    static #upsertFaction(raw) {
        const entity = FactionEntityNormalizer.normalizeExisting(raw);
        const existing = this.#factionById.get(entity.id);
        if (existing?.journalEntryId) this.#factionIdByJournalEntryId.delete(existing.journalEntryId);
        this.#factionById.set(entity.id, entity);
        if (entity.journalEntryId) this.#factionIdByJournalEntryId.set(entity.journalEntryId, entity.id);
        return entity;
    }

    static #upsertShip(raw) {
        const entity = ShipEntityNormalizer.normalizeExisting(raw);
        const existing = this.#shipById.get(entity.id);
        if (existing?.journalEntryId) this.#shipIdByJournalEntryId.delete(existing.journalEntryId);
        this.#shipById.set(entity.id, entity);
        if (entity.journalEntryId) this.#shipIdByJournalEntryId.set(entity.journalEntryId, entity.id);
        return entity;
    }

    static #registerHooks() {
        if (this._registered) return;
        this._registered = true;
        Hooks.on("createJournalEntry", document => {
            if (NpcEntityModel.isNpcDocument(document) || FactionEntityModel.isFactionDocument(document) || ShipEntityModel.isShipDocument(document)) {
                this.upsert(document);
                Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "journalCreate", document });
            }
        });
        Hooks.on("updateJournalEntry", document => {
            const previousId = document?.id ? this.#npcIdByJournalEntryId.get(document.id) : "";
            const previousFactionId = document?.id ? this.#factionIdByJournalEntryId.get(document.id) : "";
            const previousShipId = document?.id ? this.#shipIdByJournalEntryId.get(document.id) : "";
            if (NpcEntityModel.isNpcDocument(document) || FactionEntityModel.isFactionDocument(document) || ShipEntityModel.isShipDocument(document)) {
                this.upsert(document);
                Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "journalUpdate", document });
            } else if (previousId) {
                this.remove(previousId);
                Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "journalUpdateRemoved", document });
            } else if (previousFactionId) {
                this.remove(previousFactionId);
                Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "journalUpdateRemoved", document });
            } else if (previousShipId) {
                this.remove(previousShipId);
                Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "journalUpdateRemoved", document });
            }
        });
        Hooks.on("deleteJournalEntry", document => {
            const entity = NpcEntityModel.fromDocument(document) || FactionEntityModel.fromDocument(document) || ShipEntityModel.fromDocument(document);
            const entityId = entity?.id
                || (document?.id ? this.#npcIdByJournalEntryId.get(document.id) : "")
                || (document?.id ? this.#factionIdByJournalEntryId.get(document.id) : "")
                || (document?.id ? this.#shipIdByJournalEntryId.get(document.id) : "");
            if (!entityId) return;
            this.remove(entityId);
            Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "journalDelete", entity, document });
        });
    }
}
