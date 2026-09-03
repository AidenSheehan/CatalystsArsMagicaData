import { SiteRecordManager } from "../../site/services/SiteRecordManager.js";
import { CampaignEntityIndex } from "../../campaign-entities/services/CampaignEntityIndex.js";
import { FactionEntityModel } from "../../campaign-entities/models/FactionEntityModel.js";
import { NpcEntityModel } from "../../campaign-entities/models/NpcEntityModel.js";
import { ShipEntityModel } from "../../campaign-entities/models/ShipEntityModel.js";
import { CampaignEntityVisibilityManager } from "../../campaign-entities/services/CampaignEntityVisibilityManager.js";
import { ConnectionCategories } from "./ConnectionCategories.js";

const SITE_NODE_PREFIX = "nexus-site";
const SCENE_NODE_PREFIX = "nexus-scene";
const ENTITY_NODE_PREFIX = "nexus-entity";
const FOUNDRY_NODE_PREFIX = "foundry";

export class ConnectionTargetResolver {
    static fromSiteRecord(record) {
        const site = SiteRecordManager.normalizeRecord(record);
        if (!site?.parentSceneId || !site?.siteId) return null;
        return {
            id: this.getSiteNodeId(site.parentSceneId, site.siteId),
            kind: "nexus-site",
            parentSceneId: site.parentSceneId,
            siteId: site.siteId,
            linkedSceneId: site.linkedSceneId || site.siteSceneId || null,
            siteSceneId: site.siteSceneId || site.linkedSceneId || null,
            journalEntryId: site.journalEntryId || null,
            journalPageId: site.journalPageId || null,
            name: site.siteName || "Site",
            img: site.siteIconSrc || "",
            category: "place",
            siteColor: site.siteColor || "#ffffff",
            siteGenre: site.siteGenre || "fantasy",
            siteGenreLabel: site.siteGenreLabel || "Fantasy",
            siteSceneType: site.siteSceneType || "empty",
            siteSceneTypeLabel: site.siteSceneTypeLabel || "Empty Scene",
            subtitle: [site.siteGenreLabel, site.siteSceneTypeLabel].filter(Boolean).join(" - ")
        };
    }

    static fromSiteReference({ parentSceneId = null, siteId = null } = {}) {
        const parentScene = parentSceneId ? game.scenes.get(parentSceneId) || null : null;
        const record = parentScene && siteId ? SiteRecordManager.resolveSite({ parentScene, siteId }) : null;
        if (record) return this.fromSiteRecord(record);
        if (!parentSceneId || !siteId) return null;
        return {
            id: this.getSiteNodeId(parentSceneId, siteId),
            kind: "nexus-site",
            parentSceneId,
            siteId,
            name: "Site",
            img: "",
            category: "place"
        };
    }

    static fromSceneReference({ sceneId = null } = {}) {
        const scene = sceneId ? game.scenes.get(sceneId) || null : null;
        if (!scene) return null;
        const placeFlags = scene.getFlag("augur-nexus", "placePreview") || {};
        return {
            id: this.getSceneNodeId(scene.id),
            kind: "nexus-scene",
            sceneId: scene.id,
            name: scene.name || "Scene",
            img: placeFlags.iconSrc || scene.thumb || "",
            category: "place"
        };
    }

    static fromCampaignEntity(entity = {}, document = null) {
        if (!entity?.id) return null;
        if (entity.type === "faction") {
            return {
                id: this.getEntityNodeId(entity.id),
                kind: "nexus-entity",
                entityId: entity.id,
                entityType: entity.type,
                uuid: entity.uuid || document?.uuid || "",
                name: FactionEntityModel.getName(entity),
                img: FactionEntityModel.getImage(entity),
                category: "faction",
                subtitle: FactionEntityModel.getSubtitle(entity)
            };
        }
        if (entity.type === "ship") {
            return {
                id: this.getEntityNodeId(entity.id),
                kind: "nexus-entity",
                entityId: entity.id,
                entityType: entity.type,
                uuid: entity.uuid || document?.uuid || "",
                name: ShipEntityModel.getName(entity),
                img: ShipEntityModel.getImage(entity),
                category: "ship",
                subtitle: ShipEntityModel.getSubtitle(entity)
            };
        }
        if (entity.type !== "npc") return null;
        return {
            id: this.getEntityNodeId(entity.id),
            kind: "nexus-entity",
            entityId: entity.id,
            entityType: entity.type,
            uuid: entity.uuid || document?.uuid || "",
            name: NpcEntityModel.getName(entity),
            img: NpcEntityModel.getImage(entity),
            category: "npc",
            subtitle: NpcEntityModel.getSubtitle(entity)
        };
    }

    static fromEntityReference({ entityId = null } = {}) {
        const entity = CampaignEntityIndex.getNpc(entityId) || CampaignEntityIndex.getFaction(entityId) || CampaignEntityIndex.getShip(entityId);
        if (!entity) {
            const id = String(entityId || "").trim();
            if (!id) return null;
            const isFaction = id.startsWith("faction.");
            const isShip = id.startsWith("ship.");
            return {
                id: this.getEntityNodeId(id),
                kind: "nexus-entity",
                entityId: id,
                entityType: isShip ? "ship" : isFaction ? "faction" : "npc",
                uuid: "",
                name: isShip ? "Ship" : isFaction ? "Organization" : "Person",
                img: "",
                category: isShip ? "ship" : isFaction ? "faction" : "npc"
            };
        }
        return this.fromCampaignEntity(entity);
    }

    static fromNexusNode(data = {}) {
        if (data.entityId) return this.fromEntityReference({ entityId: data.entityId });

        if (data.parentSceneId && data.siteId) {
            return this.fromSiteReference({
                parentSceneId: data.parentSceneId,
                siteId: data.siteId
            });
        }

        if (data.sceneId) return this.fromSceneReference({ sceneId: data.sceneId });
        return null;
    }

    static fromNodePayload(data = {}) {
        const node = this.fromNexusNode(data);
        if (!node) return null;
        return {
            ...node,
            name: data.name || node.name,
            img: data.iconSrc || data.thumb || node.img
        };
    }

    static fromDocument(document, { category = null } = {}) {
        const uuid = document?.uuid || this.#buildUuid(document);
        if (!uuid) return null;
        const documentType = document.documentName || document.constructor?.documentName || "";
        const normalizedCategory = ConnectionCategories.normalize(category, this.#defaultCategoryForDocument(document, documentType));
        const embeddedLabel = this.#getEmbeddedDocumentLabel(document);
        return {
            id: this.getFoundryNodeId(uuid),
            kind: "foundry-document",
            uuid,
            documentType,
            name: document.name || "Unknown",
            img: this.#getDocumentImage(document),
            category: normalizedCategory,
            embeddedLabel
        };
    }

    static async fromUuid(uuid, { category = null } = {}) {
        if (!uuid) return null;
        const document = await fromUuid(uuid);
        if (!document) return null;
        const sourceDocument = await this.#getPreferredSourceDocument(document);
        return this.fromDocument(sourceDocument || document, { category });
    }

    static getSiteNodeId(parentSceneId, siteId) {
        return `${SITE_NODE_PREFIX}:${parentSceneId}:${siteId}`;
    }

    static getSceneNodeId(sceneId) {
        return `${SCENE_NODE_PREFIX}:${sceneId}`;
    }

    static getEntityNodeId(entityId) {
        return `${ENTITY_NODE_PREFIX}:${entityId}`;
    }

    static getFoundryNodeId(uuid) {
        return `${FOUNDRY_NODE_PREFIX}:${uuid}`;
    }

    static getNodeId(target) {
        if (!target) return "";
        if (target.id) return target.id;
        if (target.kind === "nexus-site") return this.getSiteNodeId(target.parentSceneId, target.siteId);
        if (target.kind === "nexus-scene") return this.getSceneNodeId(target.sceneId);
        if (target.kind === "nexus-entity") return this.getEntityNodeId(target.entityId);
        if (target.uuid) return this.getFoundryNodeId(target.uuid);
        return "";
    }

    static async resolveDisplayNode(node) {
        if (!node) return null;
        if (node.kind === "nexus-site") return this.#resolveSiteNode(node);
        if (node.kind === "nexus-scene") return this.#resolveSceneNode(node);
        if (node.kind === "nexus-entity") return this.#resolveEntityNode(node);
        const document = node.uuid ? await fromUuid(node.uuid) : null;
        if (!document) return { ...node, missing: true };
        return {
            ...node,
            name: document.name || node.name,
            img: this.#getDocumentImage(document) || node.img,
            documentType: document.documentName || node.documentType,
            embeddedLabel: this.#getEmbeddedDocumentLabel(document) || node.embeddedLabel || "",
            missing: false
        };
    }

    static resolveDisplayNodeSync(node) {
        if (!node) return null;
        if (node.kind === "nexus-site") return this.#resolveSiteNode(node);
        if (node.kind === "nexus-scene") return this.#resolveSceneNode(node);
        if (node.kind === "nexus-entity") return this.#resolveEntityNode(node);
        const document = this.#getLocalFoundryDocument(node);
        if (!document) return { ...node, missing: this.#isLocalFoundryDocumentNode(node) };
        return {
            ...node,
            name: document.name || node.name,
            img: this.#getDocumentImage(document) || node.img,
            documentType: document.documentName || node.documentType,
            embeddedLabel: this.#getEmbeddedDocumentLabel(document) || node.embeddedLabel || "",
            missing: false
        };
    }

    static async openNode(node) {
        if (!node) return;
        if (node.kind === "nexus-site") {
            const parentScene = game.scenes.get(node.parentSceneId) || null;
            const site = parentScene ? SiteRecordManager.resolveSite({ parentScene, siteId: node.siteId }) : null;
            if (!site) {
                ui.notifications.warn("That connected site could not be found.");
                return;
            }
            const { PlacePreview } = await import("../applications/PlacePreview.js");
            PlacePreview.show({
                parentScene,
                siteId: node.siteId
            });
            return;
        }

        if (node.kind === "nexus-scene") {
            const scene = game.scenes.get(node.sceneId) || null;
            if (!scene) {
                ui.notifications.warn("That connected place could not be found.");
                return;
            }
            const { PlacePreview } = await import("../applications/PlacePreview.js");
            PlacePreview.show({ scene });
            return;
        }

        if (node.kind === "nexus-entity") {
            const entity = CampaignEntityIndex.getNpc(node.entityId) || CampaignEntityIndex.getFaction(node.entityId) || CampaignEntityIndex.getShip(node.entityId);
            if (!entity) {
                ui.notifications.warn("That connected entity could not be found.");
                return;
            }
            if (!CampaignEntityVisibilityManager.canUserSee(entity)) {
                const label = CampaignEntityVisibilityManager.getConfig(entity).label.toLocaleLowerCase();
                ui.notifications.warn(`That ${label} is not currently visible.`);
                return;
            }
            if (entity.type === "faction") {
                const { openFactionDossier } = await import("../../../api/factions.js");
                await openFactionDossier(entity.id);
                return;
            }
            if (entity.type === "ship") {
                const { openShipDossier } = await import("../../../api/ships.js");
                await openShipDossier(entity.id);
                return;
            }
            const { openNpcDossier } = await import("../../../api/npcs.js");
            await openNpcDossier(entity.id);
            return;
        }

        const document = node.uuid ? await fromUuid(node.uuid) : null;
        if (!document) {
            ui.notifications.warn("That connected document could not be found.");
            return;
        }

        if (document.documentName === "JournalEntryPage" && document.parent?.sheet) {
            document.parent.sheet.render(true, {
                mode: foundry.applications.sheets.journal.JournalEntrySheet.VIEW_MODES.SINGLE,
                pageId: document.id
            });
            return;
        }

        document.sheet?.render(true);
    }

    static getDragData(node) {
        if (!node || node.missing) return null;
        if (node.kind === "foundry-document" && node.uuid) {
            const type = node.documentType || this.#documentTypeFromUuid(node.uuid);
            if (!type) return null;
            return {
                type,
                uuid: node.uuid,
                id: this.#documentIdFromUuid(node.uuid),
                name: node.name || type
            };
        }

        if (node.kind === "nexus-site") {
            return {
                type: "AugurNexusNode",
                kind: "nexus-site",
                parentSceneId: node.parentSceneId || null,
                siteId: node.siteId || null,
                sceneId: null,
                name: node.name || "Site",
                iconSrc: node.img || "",
                thumb: ""
            };
        }

        if (node.kind === "nexus-scene") {
            return {
                type: "AugurNexusNode",
                kind: "nexus-scene",
                sceneId: node.sceneId || null,
                parentSceneId: null,
                siteId: null,
                name: node.name || "Place",
                iconSrc: "",
                thumb: node.img || ""
            };
        }

        if (node.kind === "nexus-entity") {
            return {
                type: "AugurNexusEntity",
                kind: "nexus-entity",
                entityId: node.entityId || null,
                entityType: node.entityType || "npc",
                uuid: node.uuid || "",
                name: node.name || (node.entityType === "ship" ? "Ship" : node.entityType === "faction" ? "Organization" : "Person"),
                iconSrc: node.img || ""
            };
        }

        return null;
    }

    static canUserSeeNode(node, user = game.user) {
        if (user?.isGM) return true;
        if (!node) return false;
        if (node.kind !== "nexus-entity") return true;
        const entity = CampaignEntityIndex.getNpc(node.entityId) || CampaignEntityIndex.getFaction(node.entityId) || CampaignEntityIndex.getShip(node.entityId);
        if (!entity) return false;
        return CampaignEntityVisibilityManager.canUserSee(entity, user);
    }

    static #defaultCategoryForDocument(document, documentType = "") {
        if (documentType !== "Actor") return ConnectionCategories.defaultForDocument(documentType);
        return this.#looksLikeMonsterActor(document) ? "monster" : "npc";
    }

    static #looksLikeMonsterActor(actor) {
        if (!actor || actor.type === "character") return false;
        const details = actor.system?.details || {};
        const cr = details.cr?.value ?? details.cr ?? details.challenge?.value ?? details.challenge;
        if (cr !== undefined && cr !== null && String(cr).trim() !== "") return true;

        const typeValue = details.type?.value ?? details.type;
        const typeText = typeof typeValue === "string"
            ? typeValue
            : Array.isArray(typeValue)
                ? typeValue.join(" ")
                : typeValue?.value || typeValue?.label || "";
        if (!String(typeText || "").trim()) return false;

        return actor.type === "npc";
    }

    static setDragData(dataTransfer, node, { effectAllowed = "copyMove" } = {}) {
        const payload = this.getDragData(node);
        if (!payload || !dataTransfer) return false;
        dataTransfer.setData("text/plain", JSON.stringify(payload));
        dataTransfer.setData("application/json", JSON.stringify(payload));
        dataTransfer.effectAllowed = effectAllowed;
        return true;
    }

    static #resolveSiteNode(node) {
        const parentScene = game.scenes.get(node.parentSceneId) || null;
        const site = parentScene ? SiteRecordManager.getSceneRecord(parentScene, node.siteId) : null;
        if (!site) return { ...node, missing: true };
        return {
            ...node,
            name: site.siteName || node.name,
            img: site.siteIconSrc || node.img,
            category: "place",
            siteColor: site.siteColor || node.siteColor || "#ffffff",
            subtitle: [site.siteGenreLabel, site.siteSceneTypeLabel].filter(Boolean).join(" - "),
            missing: false
        };
    }

    static #resolveSceneNode(node) {
        const scene = game.scenes.get(node.sceneId) || null;
        if (!scene) return { ...node, missing: true };
        return {
            ...node,
            name: scene.name || node.name,
            img: scene.getFlag("augur-nexus", "placePreview")?.iconSrc || scene.thumb || node.img,
            category: "place",
            missing: false
        };
    }

    static #resolveEntityNode(node) {
        const entity = CampaignEntityIndex.getNpc(node.entityId) || CampaignEntityIndex.getFaction(node.entityId) || CampaignEntityIndex.getShip(node.entityId);
        if (!entity) {
            const isFaction = String(node.entityId || "").startsWith("faction.") || node.entityType === "faction";
            const isShip = String(node.entityId || "").startsWith("ship.") || node.entityType === "ship";
            return { ...node, category: isShip ? "ship" : isFaction ? "faction" : "npc", missing: true };
        }
        if (entity.type === "faction") {
            return {
                ...node,
                id: this.getEntityNodeId(entity.id),
                kind: "nexus-entity",
                entityId: entity.id,
                entityType: entity.type,
                uuid: entity.uuid || node.uuid || "",
                name: FactionEntityModel.getName(entity),
                img: FactionEntityModel.getImage(entity) || node.img,
                category: "faction",
                subtitle: FactionEntityModel.getSubtitle(entity),
                missing: false
            };
        }
        if (entity.type === "ship") {
            return {
                ...node,
                id: this.getEntityNodeId(entity.id),
                kind: "nexus-entity",
                entityId: entity.id,
                entityType: entity.type,
                uuid: entity.uuid || node.uuid || "",
                name: ShipEntityModel.getName(entity),
                img: ShipEntityModel.getImage(entity) || node.img,
                category: "ship",
                subtitle: ShipEntityModel.getSubtitle(entity),
                missing: false
            };
        }
        return {
            ...node,
            id: this.getEntityNodeId(entity.id),
            kind: "nexus-entity",
            entityId: entity.id,
            entityType: entity.type,
            uuid: entity.uuid || node.uuid || "",
            name: NpcEntityModel.getName(entity),
            img: NpcEntityModel.getImage(entity) || node.img,
            category: "npc",
            subtitle: NpcEntityModel.getSubtitle(entity),
            missing: false
        };
    }

    static #buildUuid(document) {
        if (!document?.documentName || !document?.id) return "";
        if (document.documentName === "JournalEntryPage" && document.parent?.uuid) return `${document.parent.uuid}.JournalEntryPage.${document.id}`;
        if (document.parent?.uuid) return `${document.parent.uuid}.${document.documentName}.${document.id}`;
        return `${document.documentName}.${document.id}`;
    }

    static #documentTypeFromUuid(uuid = "") {
        const value = String(uuid || "");
        if (value.startsWith("Compendium.")) {
            const parts = value.split(".");
            return parts.length >= 4 ? parts[2] : "";
        }
        const embeddedMatch = value.match(/^[^.]+\.[^.]+\.([^.]+)\.[^.]+$/);
        if (embeddedMatch) return embeddedMatch[1];
        return value.split(".")[0] || "";
    }

    static #documentIdFromUuid(uuid = "") {
        const value = String(uuid || "");
        if (value.startsWith("Compendium.")) return value.split(".").at(-1) || "";
        const pageMatch = value.match(/^JournalEntry\.[^.]+\.JournalEntryPage\.([^.]+)$/);
        if (pageMatch) return pageMatch[1];
        const embeddedMatch = value.match(/^[^.]+\.[^.]+\.([^.]+)\.([^.]+)$/);
        if (embeddedMatch) return embeddedMatch[2];
        return value.match(/^[^.]+\.([^.]+)$/)?.[1] || "";
    }

    static #getLocalFoundryDocument(node) {
        if (!node?.uuid || String(node.uuid).startsWith("Compendium.")) return null;
        const pageMatch = String(node.uuid).match(/^JournalEntry\.([^.]+)\.JournalEntryPage\.([^.]+)$/);
        if (pageMatch) return game.journal.get(pageMatch[1])?.pages.get(pageMatch[2]) || null;

        const actorItemMatch = String(node.uuid).match(/^Actor\.([^.]+)\.Item\.([^.]+)$/);
        if (actorItemMatch) return game.actors.get(actorItemMatch[1])?.items.get(actorItemMatch[2]) || null;

        const documentType = node.documentType || String(node.uuid).split(".")[0];
        const collection = game.collections?.get(documentType);
        if (!collection) return null;
        const id = String(node.uuid).match(/^[^.]+\.([^.]+)$/)?.[1] || "";
        return id ? collection.get(id) || null : null;
    }

    static #isLocalFoundryDocumentNode(node) {
        return !!node?.uuid
            && !String(node.uuid).startsWith("Compendium.")
            && ["Actor", "Item", "JournalEntry", "JournalEntryPage", "Scene"].includes(node.documentType || String(node.uuid).split(".")[0]);
    }

    static async #getPreferredSourceDocument(document) {
        if (document?.documentName !== "Item" || document.parent?.documentName !== "Actor") return null;
        const sourceUuid = this.#getDocumentSourceUuid(document);
        if (!sourceUuid || sourceUuid === document.uuid) return null;
        try {
            const sourceDocument = await fromUuid(sourceUuid);
            if (sourceDocument?.documentName !== "Item") return null;
            return sourceDocument.parent?.documentName === "Actor" ? null : sourceDocument;
        } catch (_err) {
            return null;
        }
    }

    static #getDocumentSourceUuid(document) {
        return document?.getFlag?.("core", "sourceId")
            || document?.flags?.core?.sourceId
            || document?._stats?.compendiumSource
            || document?._stats?.duplicateSource
            || "";
    }

    static #getEmbeddedDocumentLabel(document) {
        if (document?.documentName !== "Item" || document.parent?.documentName !== "Actor") return "";
        return document.parent?.name ? `Owned by ${document.parent.name}` : "Actor Item";
    }

    static #getDocumentImage(document) {
        return document?.img || document?.thumb || document?.texture?.src || "";
    }
}
