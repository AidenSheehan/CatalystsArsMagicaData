import { NpcEntityModel } from "../models/NpcEntityModel.js";
import { ShipEntityModel } from "../models/ShipEntityModel.js";
import { FactionEntityModel } from "../models/FactionEntityModel.js";
import { CampaignEntityJournalStore } from "./CampaignEntityJournalStore.js";
import { NexusMarkerService } from "../../markers/services/NexusMarkerService.js";
import { SiteLabelManager } from "../../site/services/SiteLabelManager.js";

const MODULE_ID = "augur-nexus";
const ENTITY_REF_FLAG = "campaignEntityRef";
const SUPPORTED_ENTITY_TYPES = new Set(["npc", "ship", "faction"]);

export class CampaignEntityActorBridge {
    static #registered = false;

    static registerHooks() {
        if (this.#registered) return;
        this.#registered = true;

        Hooks.on("dropCanvasData", (_canvas, data, event) => {
            if (data?.type !== "AugurNexusEntity" || data?.kind !== "nexus-entity") return undefined;
            if (!SUPPORTED_ENTITY_TYPES.has(data.entityType)) return undefined;

            this.handleCanvasDropAsMarker(data, event).catch(err => {
                console.error("Augur Nexus | Failed to place campaign entity marker.", err);
                ui.notifications.error("Could not place that Nexus entity on the scene.");
            });
            return false;
        });
    }

    static async handleCanvasDropAsMarker(data = {}, event = null) {
        if (!game.user.isGM) {
            ui.notifications.warn("Only the GM can place Nexus entity markers.");
            return null;
        }
        if (!canvas?.scene) return null;
        if (!canvas.dimensions?.rect?.contains(data.x, data.y)) return null;

        const entity = this.#resolveEntity(data.entityId, data.entityType);
        if (!entity) {
            ui.notifications.warn("That Nexus entity could not be found.");
            return null;
        }

        const iconSize = this.#getSceneDefaultIconSize();
        const marker = await NexusMarkerService.placeExistingEntity(entity, {
            x: data.x,
            y: data.y
        }, {
            iconSize,
            labelFontSize: SiteLabelManager.getDefaultFontSize(iconSize),
            snapToGrid: false
        });
        if (marker) {
            const { openNexusMarkerEditorForPlaceable } = await import("../../../support/toolbar/NexusToolContext.js");
            openNexusMarkerEditorForPlaceable(marker);
        }
        return marker;
    }

    static async handleCanvasDrop(data = {}, event = null) {
        const entity = this.#resolveEntity(data.entityId, data.entityType);
        if (!entity) {
            ui.notifications.warn("That Nexus entity could not be found.");
            return null;
        }
        return this.createTokenForEntity(entity, {
            x: data.x,
            y: data.y,
            elevation: data.elevation
        }, { event });
    }

    static async createTokenForEntity(entity = {}, position = {}, { event = null, deleteMarker = null } = {}) {
        if (!game.user.can("TOKEN_CREATE")) {
            ui.notifications.warn("You do not have permission to create new Tokens.");
            return null;
        }
        if (!canvas?.scene || !canvas?.tokens) return null;
        if (!canvas.dimensions?.rect?.contains(position.x, position.y)) return null;

        let actor = await this.getLinkedActor(entity);
        if (!actor) {
            actor = await this.promptLinkActor(entity);
            if (!actor) return null;
        }
        if (!actor.isOwner) {
            ui.notifications.warn(`You do not have permission to create a token for ${actor.name}.`);
            return null;
        }

        const token = await actor.getTokenDocument({
            hidden: game.user.isGM && event?.altKey,
            sort: Math.max(canvas.tokens.getMaxSort() + 1, 0)
        }, { parent: canvas.scene });
        const model = this.#modelFor(entity);
        const entityTokenImage = (typeof model.getTokenImage === "function" ? model.getTokenImage(entity) : model.getImage(entity)) || model.getImage(entity) || "";
        const tokenTextureSrc = String(token.texture?.src || "").trim();
        const textureUpdate = entityTokenImage && (!tokenTextureSrc || tokenTextureSrc === CONST.DEFAULT_TOKEN)
            ? { texture: { ...(token.texture?.toObject?.() || token.texture || {}), src: entityTokenImage } }
            : {};

        const dropPosition = CONFIG.Token.objectClass._getDropActorPosition(token, {
            x: position.x,
            y: position.y,
            elevation: position.elevation
        }, { snap: !event?.shiftKey });

        token.updateSource({
            ...dropPosition,
            ...textureUpdate,
            [`flags.${MODULE_ID}.${ENTITY_REF_FLAG}`]: this.#buildEntityRef(entity)
        });
        canvas.tokens.activate();
        const created = await token.constructor.create(token, { parent: canvas.scene });
        if (created && deleteMarker) await NexusMarkerService.deleteMarker(deleteMarker, { notify: false });
        return created;
    }

    static async convertMarkerToToken(placeable, { event = null } = {}) {
        const doc = placeable?.document || placeable || null;
        const record = NexusMarkerService.getMarkerRecord(doc);
        if (!record?.behavior?.canConvertToToken || record.target?.kind !== "campaign-entity") return null;

        const entity = this.#resolveEntity(record.target.entityId, record.target.entityType);
        if (!entity) {
            ui.notifications.warn("That Nexus entity could not be found.");
            return null;
        }

        const position = {
            x: Number(doc.x || 0) + (Number(doc.width || 0) / 2),
            y: Number(doc.y || 0) + (Number(doc.height || 0) / 2),
            elevation: doc.elevation
        };
        const token = await this.createTokenForEntity(entity, position, { event, deleteMarker: placeable });
        if (token) ui.notifications.info(`Converted ${record.presentation?.name || "entity"} marker to a token.`);
        return token;
    }

    static async getLinkedActor(entity = {}) {
        const actor = await this.#getLinkedActor(entity);
        if (!actor) return null;
        if (actor.isOwner && !actor.getFlag(MODULE_ID, ENTITY_REF_FLAG)) {
            await actor.update({
                [`flags.${MODULE_ID}.${ENTITY_REF_FLAG}`]: this.#buildEntityRef(entity)
            });
        }
        if (entity.projections?.actorUuid !== actor.uuid) await this.#writeActorProjection(entity, actor.uuid);
        return actor;
    }

    static async promptLinkActor(entity = {}) {
        const result = await this.manageActorLink(entity);
        return result?.actor || null;
    }

    static async manageActorLink(entity = {}) {
        const linkOptions = await this.#openLinkDialog(entity);
        if (!linkOptions) return { action: "cancel" };

        if (linkOptions.action === "open") {
            const actor = await this.getLinkedActor(entity);
            if (!actor) {
                ui.notifications.warn("No linked Actor was found.");
                return { action: "missing" };
            }
            actor.sheet?.render(true);
            return { action: "open", actor };
        }

        if (linkOptions.action === "unlink") {
            await this.unlinkActor(entity);
            ui.notifications.info(`Actor unlinked from ${this.#modelFor(entity).getName(entity)}.`);
            return { action: "unlink" };
        }

        if (!linkOptions.actorUuid) return { action: "cancel" };

        const actor = await fromUuid(linkOptions.actorUuid);
        if (!actor || actor.documentName !== "Actor") {
            ui.notifications.warn("That Actor could not be found.");
            return { action: "missing" };
        }

        await this.linkActor(entity, actor, linkOptions);
        ui.notifications.info(`${actor.name} linked to ${this.#modelFor(entity).getName(entity)}.`);
        return { action: "link", actor };
    }

    static async linkActor(entity = {}, actor = null, { renameActor = false, useActorImage = false, useTokenImage = false } = {}) {
        if (!actor || actor.documentName !== "Actor") return null;
        if (!actor.isOwner) {
            ui.notifications.warn(`You do not have permission to link ${actor.name}.`);
            return null;
        }

        const update = {
            [`flags.${MODULE_ID}.${ENTITY_REF_FLAG}`]: this.#buildEntityRef(entity)
        };
        const model = this.#modelFor(entity);
        const imageSrc = model.getImage(entity);
        const tokenImageSrc = (typeof model.getTokenImage === "function" ? model.getTokenImage(entity) : imageSrc) || CONST.DEFAULT_TOKEN;
        if (renameActor) update.name = model.getName(entity);
        if (imageSrc && useActorImage) update.img = imageSrc;
        if (tokenImageSrc && useTokenImage) foundry.utils.setProperty(update, "prototypeToken.texture.src", tokenImageSrc);

        await actor.update(update);
        await this.#writeActorProjection(entity, actor.uuid);
        return actor;
    }

    static async unlinkActor(entity = {}) {
        const actor = await this.#getLinkedActor(entity);
        if (actor?.isOwner) {
            await actor.update({ [`flags.${MODULE_ID}.-=${ENTITY_REF_FLAG}`]: null });
        }
        await this.#writeActorProjection(entity, null);
        return true;
    }

    static async #getLinkedActor(entity = {}) {
        const actorUuid = String(entity?.projections?.actorUuid || "").trim();
        const linked = actorUuid ? await fromUuid(actorUuid) : null;
        if (linked?.documentName === "Actor") return linked;

        const entityId = String(entity?.id || "").trim();
        const entityType = String(entity?.type || "").trim();
        if (!entityId || !entityType) return null;

        return game.actors?.find?.(actor => {
            const ref = actor.getFlag(MODULE_ID, ENTITY_REF_FLAG) || {};
            return ref.id === entityId && ref.type === entityType;
        }) || null;
    }

    static async #openLinkDialog(entity = {}) {
        const model = this.#modelFor(entity);
        const name = model.getName(entity);
        const imageSrc = model.getImage(entity) || CONST.DEFAULT_TOKEN;
        const safe = value => foundry.utils.escapeHTML(String(value || ""));
        const actorImageId = `nexus-linked-actor-image-${foundry.utils.randomID()}`;
        const actorNameId = `nexus-linked-actor-name-${foundry.utils.randomID()}`;
        const actorMetaId = `nexus-linked-actor-meta-${foundry.utils.randomID()}`;
        const renameActorId = `nexus-link-actor-rename-${foundry.utils.randomID()}`;
        const useActorImageId = `nexus-link-actor-image-${foundry.utils.randomID()}`;
        const useTokenImageId = `nexus-link-token-image-${foundry.utils.randomID()}`;
        const linkedActor = await this.#getLinkedActor(entity);
        let selectedActor = linkedActor || null;

        const updateActorPreview = root => {
            const actorName = root?.querySelector?.(`#${CSS.escape(actorNameId)}`);
            const actorMeta = root?.querySelector?.(`#${CSS.escape(actorMetaId)}`);
            const actorImage = root?.querySelector?.(`#${CSS.escape(actorImageId)}`);
            const confirmButton = root?.querySelector?.("button[data-action='confirm']");
            if (actorName) actorName.textContent = selectedActor?.name || "Drop an Actor here";
            if (actorMeta) actorMeta.textContent = selectedActor
                ? `${selectedActor.type || "Actor"} actor${linkedActor && selectedActor.uuid === linkedActor.uuid ? " - linked" : ""}`
                : "No actor selected";
            if (actorImage) actorImage.src = selectedActor?.img || CONST.DEFAULT_TOKEN;
            if (confirmButton) confirmButton.disabled = !selectedActor;
        };

        const buttons = [];
        if (linkedActor) {
            buttons.push({
                action: "open",
                label: "Open Actor",
                icon: "fa-solid fa-up-right-from-square",
                callback: () => ({ action: "open" })
            });
            buttons.push({
                action: "unlink",
                label: "Unlink",
                icon: "fa-solid fa-link-slash",
                callback: () => ({ action: "unlink" })
            });
        }
        buttons.push(
            {
                action: "confirm",
                label: linkedActor ? "Update Link" : "Link Actor",
                icon: "fa-solid fa-link",
                default: true,
                callback: () => {
                    if (!selectedActor) return false;
                    return {
                        action: "link",
                        actorUuid: selectedActor.uuid,
                        renameActor: !!document.getElementById(renameActorId)?.checked,
                        useActorImage: !!document.getElementById(useActorImageId)?.checked,
                        useTokenImage: !!document.getElementById(useTokenImageId)?.checked
                    };
                }
            },
            {
                action: "cancel",
                label: "Cancel",
                icon: "fa-solid fa-xmark",
                callback: () => null
            }
        );

        return foundry.applications.api.DialogV2.wait({
            window: { title: `${linkedActor ? "Linked Actor for" : "Link Actor to"} ${name}` },
            position: { width: 520 },
            modal: false,
            rejectClose: false,
            content: `
                <form class="nexus-entity-actor-link-form">
                    <div class="nexus-entity-actor-link-summary">
                        <img src="${safe(imageSrc)}" alt="">
                        <div>
                            <h3>${safe(name)}</h3>
                            <p>${linkedActor ? "Manage the Actor used when placing this entity on scenes. Drop another Actor below to replace it." : `Drop an existing Actor below to use it when placing this ${safe(entity.type || "entity")} on scenes.`}</p>
                        </div>
                    </div>
                    <div class="nexus-entity-actor-drop-zone" data-actor-drop-zone>
                        <img id="${actorImageId}" src="${safe(selectedActor?.img || CONST.DEFAULT_TOKEN)}" alt="">
                        <div>
                            <strong id="${actorNameId}">${safe(selectedActor?.name || "Drop an Actor here")}</strong>
                            <span id="${actorMetaId}">${selectedActor ? `${safe(selectedActor.type || "Actor")} actor${linkedActor ? " - linked" : ""}` : "No actor selected"}</span>
                        </div>
                    </div>
                    <label class="nexus-entity-actor-link-toggle" for="${useActorImageId}">
                        <input id="${useActorImageId}" type="checkbox" checked>
                        <span>Use entity image as Actor portrait</span>
                    </label>
                    <label class="nexus-entity-actor-link-toggle" for="${renameActorId}">
                        <input id="${renameActorId}" type="checkbox" checked>
                        <span>Rename Actor to match entity name</span>
                    </label>
                    <label class="nexus-entity-actor-link-toggle" for="${useTokenImageId}">
                        <input id="${useTokenImageId}" type="checkbox" checked>
                        <span>Use matching entity token image</span>
                    </label>
                </form>
            `,
            buttons,
            render: (_event, dialog) => {
                const root = dialog.element;
                updateActorPreview(root);
                const dropZone = root?.querySelector?.("[data-actor-drop-zone]");
                dropZone?.addEventListener("dragover", event => {
                    event.preventDefault();
                    dropZone.classList.add("is-drop-target");
                });
                dropZone?.addEventListener("dragleave", event => {
                    if (dropZone.contains(event.relatedTarget)) return;
                    dropZone.classList.remove("is-drop-target");
                });
                dropZone?.addEventListener("drop", async event => {
                    event.preventDefault();
                    dropZone.classList.remove("is-drop-target");
                    const actor = await this.#actorFromDropEvent(event);
                    if (!actor) return;
                    selectedActor = actor;
                    updateActorPreview(root);
                });
            }
        });
    }

    static async #actorFromDropEvent(event) {
        let data = null;
        try {
            data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
        } catch (_err) {
            data = null;
        }
        if (data?.type !== "Actor") {
            ui.notifications.warn("Drop an Actor from the sidebar to link it.");
            return null;
        }

        const actor = data.uuid ? await fromUuid(data.uuid) : game.actors?.get?.(data.id);
        if (!actor || actor.documentName !== "Actor") {
            ui.notifications.warn("That Actor could not be found.");
            return null;
        }
        if (actor.inCompendium) {
            ui.notifications.warn("Link a world Actor, not a compendium Actor.");
            return null;
        }
        if (!actor.isOwner) {
            ui.notifications.warn(`You do not have permission to link ${actor.name}.`);
            return null;
        }
        return actor;
    }

    static async #writeActorProjection(entity = {}, actorUuid = "") {
        if (entity.type === "ship") {
            await CampaignEntityJournalStore.updateShip(entity.id, { projections: { actorUuid } });
            return;
        }
        if (entity.type === "faction") {
            await CampaignEntityJournalStore.updateFaction(entity.id, { projections: { actorUuid } });
            return;
        }
        await CampaignEntityJournalStore.updateNpc(entity.id, { projections: { actorUuid } });
    }

    static #resolveEntity(entityId = "", entityType = "") {
        if (entityType === "ship") return CampaignEntityJournalStore.getShip(entityId);
        if (entityType === "faction") return CampaignEntityJournalStore.getFaction(entityId);
        return CampaignEntityJournalStore.getNpc(entityId);
    }

    static #getSceneDefaultIconSize() {
        const numeric = Number(canvas.grid?.size ?? canvas.dimensions?.size ?? NexusMarkerService.DEFAULT_ICON_SIZE);
        if (!Number.isFinite(numeric)) return NexusMarkerService.DEFAULT_ICON_SIZE;
        return Math.min(240, Math.max(32, Math.round(numeric)));
    }

    static #modelFor(entity = {}) {
        if (entity.type === "ship") return ShipEntityModel;
        if (entity.type === "faction") return FactionEntityModel;
        return NpcEntityModel;
    }

    static #buildEntityRef(entity = {}) {
        return {
            id: entity.id,
            type: entity.type,
            name: this.#modelFor(entity).getName(entity),
            sourceModule: entity.sourceModule || "",
            journalEntryId: entity.journalEntryId || "",
            journalEntryUuid: entity.uuid || ""
        };
    }
}
