import { ConnectionStore } from "../../connections/services/ConnectionStore.js";
import { ConnectionTargetResolver } from "../../connections/services/ConnectionTargetResolver.js";
import { FactionEntityModel } from "../models/FactionEntityModel.js";
import { NpcEntityModel } from "../models/NpcEntityModel.js";
import { ShipEntityModel } from "../models/ShipEntityModel.js";
import { CampaignEntityFolderManager } from "./CampaignEntityFolderManager.js";
import { CampaignEntityIndex } from "./CampaignEntityIndex.js";
import { FactionEntityNormalizer } from "./FactionEntityNormalizer.js";
import { NpcEntityNormalizer } from "./NpcEntityNormalizer.js";
import { ShipEntityNormalizer } from "./ShipEntityNormalizer.js";

const MODULE_ID = "augur-nexus";

export class CampaignEntityJournalStore {
    static async createNpc(data = {}) {
        const entity = await NpcEntityNormalizer.normalizeForCreate(data);
        const folder = await CampaignEntityFolderManager.getOrCreateNpcFolder();
        const entry = await JournalEntry.create({
            name: NpcEntityModel.getName(entity),
            folder: folder?.id || null,
            ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER },
            flags: {
                [MODULE_ID]: {
                    campaignEntity: entity
                }
            }
        });

        await this.#createJournalPage(entry);
        CampaignEntityIndex.upsert(entry);
        Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "createNpc", entity, document: entry });
        return NpcEntityModel.fromDocument(entry);
    }

    static getNpc(idOrUuid) {
        const document = this.resolveNpcDocument(idOrUuid);
        if (!document) return null;
        return NpcEntityModel.fromDocument(document);
    }

    static getNpcs(filters = {}) {
        return CampaignEntityIndex.getNpcs(filters);
    }

    static async updateNpc(idOrUuid, patch = {}, options = {}) {
        const document = this.resolveNpcDocument(idOrUuid);
        if (!document) throw new Error("Person entity could not be found.");
        const current = NpcEntityModel.fromDocument(document);
        const entity = await NpcEntityNormalizer.normalizeForUpdate(current, patch, options);
        await document.update({
            name: NpcEntityModel.getName(entity),
            [`flags.${MODULE_ID}.campaignEntity`]: entity
        });
        CampaignEntityIndex.upsert(document);
        Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "updateNpc", entity, document });
        return NpcEntityModel.fromDocument(document);
    }

    static async deleteNpc(idOrUuid, { deleteJournal = true } = {}) {
        const document = this.resolveNpcDocument(idOrUuid);
        if (!document) return false;
        const entity = NpcEntityModel.fromDocument(document);
        await this.#deleteMarkersForEntity(entity);
        const target = ConnectionTargetResolver.fromCampaignEntity(entity, document);
        if (target) await ConnectionStore.removeConnectionsForTarget(target);
        CampaignEntityIndex.remove(entity.id);

        if (deleteJournal) await document.delete();
        Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "deleteNpc", entity, document: null });
        return true;
    }

    static async createFaction(data = {}) {
        const entity = await FactionEntityNormalizer.normalizeForCreate(data);
        const folder = await CampaignEntityFolderManager.getOrCreateFactionFolder();
        const entry = await JournalEntry.create({
            name: FactionEntityModel.getName(entity),
            folder: folder?.id || null,
            ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER },
            flags: {
                [MODULE_ID]: {
                    campaignEntity: entity
                }
            }
        });

        await this.#createJournalPage(entry);
        CampaignEntityIndex.upsert(entry);
        Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "createFaction", entity, document: entry });
        return FactionEntityModel.fromDocument(entry);
    }

    static getFaction(idOrUuid) {
        const document = this.resolveFactionDocument(idOrUuid);
        if (!document) return null;
        return FactionEntityModel.fromDocument(document);
    }

    static getFactions(filters = {}) {
        return CampaignEntityIndex.getFactions(filters);
    }

    static async updateFaction(idOrUuid, patch = {}, options = {}) {
        const document = this.resolveFactionDocument(idOrUuid);
        if (!document) throw new Error("Organization entity could not be found.");
        const current = FactionEntityModel.fromDocument(document);
        const entity = await FactionEntityNormalizer.normalizeForUpdate(current, patch, options);
        await document.update({
            name: FactionEntityModel.getName(entity),
            [`flags.${MODULE_ID}.campaignEntity`]: entity
        });
        CampaignEntityIndex.upsert(document);
        Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "updateFaction", entity, document });
        return FactionEntityModel.fromDocument(document);
    }

    static async deleteFaction(idOrUuid, { deleteJournal = true } = {}) {
        const document = this.resolveFactionDocument(idOrUuid);
        if (!document) return false;
        const entity = FactionEntityModel.fromDocument(document);
        await this.#deleteMarkersForEntity(entity);
        const target = ConnectionTargetResolver.fromCampaignEntity(entity, document);
        if (target) await ConnectionStore.removeConnectionsForTarget(target);
        CampaignEntityIndex.remove(entity.id);

        if (deleteJournal) await document.delete();
        Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "deleteFaction", entity, document: null });
        return true;
    }

    static async createShip(data = {}) {
        const entity = await ShipEntityNormalizer.normalizeForCreate(data);
        const folder = await CampaignEntityFolderManager.getOrCreateShipFolder();
        const entry = await JournalEntry.create({
            name: ShipEntityModel.getName(entity),
            folder: folder?.id || null,
            ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER },
            flags: { [MODULE_ID]: { campaignEntity: entity } }
        });
        await this.#createJournalPage(entry);
        CampaignEntityIndex.upsert(entry);
        Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "createShip", entity, document: entry });
        return ShipEntityModel.fromDocument(entry);
    }

    static getShip(idOrUuid) {
        const document = this.resolveShipDocument(idOrUuid);
        return document ? ShipEntityModel.fromDocument(document) : null;
    }

    static getShips(filters = {}) {
        return CampaignEntityIndex.getShips(filters);
    }

    static async updateShip(idOrUuid, patch = {}, options = {}) {
        const document = this.resolveShipDocument(idOrUuid);
        if (!document) throw new Error("Ship entity could not be found.");
        const current = ShipEntityModel.fromDocument(document);
        const entity = await ShipEntityNormalizer.normalizeForUpdate(current, patch, options);
        await document.update({
            name: ShipEntityModel.getName(entity),
            [`flags.${MODULE_ID}.campaignEntity`]: entity
        });
        CampaignEntityIndex.upsert(document);
        Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "updateShip", entity, document });
        return ShipEntityModel.fromDocument(document);
    }

    static async deleteShip(idOrUuid, { deleteJournal = true } = {}) {
        const document = this.resolveShipDocument(idOrUuid);
        if (!document) return false;
        const entity = ShipEntityModel.fromDocument(document);
        await this.#deleteMarkersForEntity(entity);
        const target = ConnectionTargetResolver.fromCampaignEntity(entity, document);
        if (target) await ConnectionStore.removeConnectionsForTarget(target);
        CampaignEntityIndex.remove(entity.id);
        if (deleteJournal) await document.delete();
        Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "deleteShip", entity, document: null });
        return true;
    }

    static resolveNpcDocument(idOrUuid) {
        const value = String(idOrUuid || "").trim();
        if (!value) return null;

        if (value.startsWith("JournalEntry.")) {
            const id = value.match(/^JournalEntry\.([^.]+)/)?.[1] || "";
            const document = id ? game.journal.get(id) || null : null;
            return NpcEntityModel.isNpcDocument(document) ? document : null;
        }

        const indexed = CampaignEntityIndex.getNpc(value);
        if (indexed?.journalEntryId) {
            const document = game.journal.get(indexed.journalEntryId) || null;
            if (NpcEntityModel.isNpcDocument(document)) return document;
        }

        const document = game.journal.get(value) || game.journal.find(entry => NpcEntityModel.getFlag(entry)?.id === value) || null;
        return NpcEntityModel.isNpcDocument(document) ? document : null;
    }

    static resolveFactionDocument(idOrUuid) {
        const value = String(idOrUuid || "").trim();
        if (!value) return null;

        if (value.startsWith("JournalEntry.")) {
            const id = value.match(/^JournalEntry\.([^.]+)/)?.[1] || "";
            const document = id ? game.journal.get(id) || null : null;
            return FactionEntityModel.isFactionDocument(document) ? document : null;
        }

        const indexed = CampaignEntityIndex.getFaction(value);
        if (indexed?.journalEntryId) {
            const document = game.journal.get(indexed.journalEntryId) || null;
            if (FactionEntityModel.isFactionDocument(document)) return document;
        }

        const document = game.journal.get(value) || game.journal.find(entry => FactionEntityModel.getFlag(entry)?.id === value) || null;
        return FactionEntityModel.isFactionDocument(document) ? document : null;
    }

    static resolveShipDocument(idOrUuid) {
        const value = String(idOrUuid || "").trim();
        if (!value) return null;
        if (value.startsWith("JournalEntry.")) {
            const id = value.match(/^JournalEntry\.([^.]+)/)?.[1] || "";
            const document = id ? game.journal.get(id) || null : null;
            return ShipEntityModel.isShipDocument(document) ? document : null;
        }
        const indexed = CampaignEntityIndex.getShip(value);
        if (indexed?.journalEntryId) {
            const document = game.journal.get(indexed.journalEntryId) || null;
            if (ShipEntityModel.isShipDocument(document)) return document;
        }
        const document = game.journal.get(value) || game.journal.find(entry => ShipEntityModel.getFlag(entry)?.id === value) || null;
        return ShipEntityModel.isShipDocument(document) ? document : null;
    }

    static resolveCampaignEntityDocument(idOrUuid) {
        return this.resolveNpcDocument(idOrUuid) || this.resolveFactionDocument(idOrUuid) || this.resolveShipDocument(idOrUuid);
    }

    static getJournalPage(entityOrId) {
        const document = typeof entityOrId === "string" ? this.resolveCampaignEntityDocument(entityOrId) : this.resolveCampaignEntityDocument(entityOrId?.id || entityOrId?.uuid);
        if (!document) return null;
        return document.pages?.contents?.find(page => page.type === "text") || null;
    }

    static async getOrCreateJournalPage(entityOrId) {
        const document = typeof entityOrId === "string" ? this.resolveCampaignEntityDocument(entityOrId) : this.resolveCampaignEntityDocument(entityOrId?.id || entityOrId?.uuid);
        if (!document) return null;
        const existing = this.getJournalPage(document.uuid);
        if (existing) return existing;
        return this.#createJournalPage(document);
    }

    static async #createJournalPage(entry) {
        if (!entry) return null;
        const [created] = await entry.createEmbeddedDocuments("JournalEntryPage", [{
            name: "Journal",
            type: "text",
            sort: (entry.pages.size + 1) * CONST.SORT_INTEGER_DENSITY,
            text: {
                content: "",
                format: 1
            }
        }]);
        return created || null;
    }

    static async #deleteMarkersForEntity(entity = {}) {
        if (!entity?.id || !entity?.type) return;
        const { NexusMarkerService } = await import("../../markers/services/NexusMarkerService.js");
        await NexusMarkerService.deleteMarkersForTarget({
            kind: "campaign-entity",
            entityType: entity.type,
            entityId: entity.id
        });
    }
}
