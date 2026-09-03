import { NexusLineageManager } from "../../nexus/services/NexusLineageManager.js";
import { NexusSceneNavigationManager } from "../../nexus/services/NexusSceneNavigationManager.js";
import { NexusSceneDeletionCoordinator } from "../../nexus/services/NexusSceneDeletionCoordinator.js";
import { SiteJournalManager } from "./SiteJournalManager.js";
import { SiteLabelManager } from "./SiteLabelManager.js";
import { SiteRecordManager } from "./SiteRecordManager.js";

const MODULE_ID = "augur-nexus";

export class SiteDeletionManager {
    static async deleteSite(placeable, { parentScene = canvas.scene } = {}) {
        const plan = this.buildDeletePlan(placeable, { parentScene });
        if (!plan) return false;
        return this.#executeDeletePlan(plan);
    }

    static async deleteSiteRecord(siteRecord, { parentScene = null } = {}) {
        const plan = this.buildDeletePlanFromRecord(siteRecord, { parentScene });
        if (!plan) return false;
        return this.#executeDeletePlan(plan);
    }

    static async deleteSiteIdentity({ parentScene = null, siteId = null, journalEntryId = null, pageId = null, siteName = "Site" } = {}) {
        const record = parentScene && siteId ? SiteRecordManager.resolveSite({
            parentScene,
            siteId,
            journalEntryId,
            pageId
        }) : null;
        if (record) return this.deleteSiteRecord(record, { parentScene });
        if (!parentScene || !siteId) return false;

        const placeable = SiteRecordManager.findSitePlaceable(parentScene, siteId);
        const doc = placeable?.document || placeable || null;
        const label = doc
            ? SiteLabelManager.findLabel(parentScene, siteId, doc.documentName === "Tile" ? doc.id : null)
            : SiteLabelManager.findLabel(parentScene, siteId);

        await this.#deleteSiteArtifacts({
            parentScene,
            doc,
            documentName: doc?.documentName || "Tile",
            flags: {},
            siteId,
            siteName,
            linkedScene: null,
            linkedSceneId: null,
            journalEntryId,
            journalPageId: pageId,
            labelId: label?.id || null,
            branchImpact: null
        });
        this.#notifyDeleted({ siteName }, "site");
        return true;
    }

    static async #executeDeletePlan(plan) {
        if (!plan) return false;

        if (!plan.linkedScene) {
            await this.#deleteSiteArtifacts(plan);
            this.#notifyDeleted(plan, "site");
            return true;
        }

        const choice = await this.#confirmLinkedSiteDelete(plan);
        if (!choice || choice === "cancel") return false;

        if (choice === "site-only") {
            await this.#detachLinkedScene(plan);
            await this.#deleteSiteArtifacts(plan);
            this.#notifyDeleted(plan, "site");
            return true;
        }

        if (choice === "site-and-branch") {
            await NexusSceneDeletionCoordinator.deleteSceneBranch(plan.linkedScene, {
                confirmed: true,
                source: "augur-nexus",
                intent: "delete-site-branch"
            });
            this.#notifyDeleted(plan, "site and scene branch");
            Hooks.callAll("augurNexusLineageChanged");
            return true;
        }

        return false;
    }

    static buildDeletePlan(placeable, { parentScene = canvas.scene } = {}) {
        const doc = placeable?.document || placeable || null;
        const flags = doc?.flags?.[MODULE_ID] || {};
        if (!parentScene || !doc?.id || !flags.site || !flags.siteId) return null;

        const linkedSceneId = flags.siteSceneId || flags.linkedSceneId || null;
        const linkedScene = linkedSceneId ? game.scenes.get(linkedSceneId) || null : null;
        const label = flags.labelId
            ? parentScene.drawings?.get(flags.labelId) || null
            : SiteLabelManager.findLabel(parentScene, flags.siteId, doc.documentName === "Tile" ? doc.id : null);
        const branchImpact = linkedScene ? NexusSceneDeletionCoordinator.getSceneBranchDeleteImpact(linkedScene, {
            source: "augur-nexus",
            intent: "delete-site-branch"
        }) : null;

        return {
            parentScene,
            doc,
            documentName: doc.documentName || "Note",
            flags,
            siteId: flags.siteId,
            siteName: flags.siteName || "Site",
            linkedScene,
            linkedSceneId,
            journalEntryId: flags.journalEntryId || null,
            journalPageId: flags.journalPageId || null,
            labelId: label?.id || flags.labelId || null,
            branchImpact
        };
    }

    static buildDeletePlanFromRecord(siteRecord, { parentScene = null } = {}) {
        const scene = parentScene || SiteRecordManager.getParentScene(siteRecord);
        const record = SiteRecordManager.resolveSite({ parentScene: scene, siteRecord });
        if (!scene || !record?.siteId) return null;

        const placeable = SiteRecordManager.findSitePlaceable(scene, record.siteId, record.placeableId);
        const doc = placeable?.document || placeable || null;
        const linkedSceneId = record.siteSceneId || record.linkedSceneId || null;
        const linkedScene = linkedSceneId ? game.scenes.get(linkedSceneId) || null : null;
        const label = record.labelId
            ? scene.drawings?.get(record.labelId) || null
            : SiteLabelManager.findLabel(scene, record.siteId, doc?.documentName === "Tile" ? doc.id : null);
        const branchImpact = linkedScene ? NexusSceneDeletionCoordinator.getSceneBranchDeleteImpact(linkedScene, {
            source: "augur-nexus",
            intent: "delete-site-branch"
        }) : null;

        return {
            parentScene: scene,
            doc,
            documentName: doc?.documentName || record.placeableDocumentName || "Tile",
            flags: record,
            siteId: record.siteId,
            siteName: record.siteName || "Site",
            linkedScene,
            linkedSceneId,
            journalEntryId: record.journalEntryId || null,
            journalPageId: record.journalPageId || null,
            labelId: label?.id || record.labelId || null,
            branchImpact
        };
    }

    static async #confirmLinkedSiteDelete(plan) {
        const impact = plan.branchImpact || { sceneCount: 0, pageCount: 0, journalEntryCount: 0 };
        const siteName = foundry.utils.escapeHTML(plan.siteName || "Site");
        const linkedSceneName = foundry.utils.escapeHTML(plan.linkedScene?.name || "Linked Scene");
        const impactRows = [
            { singular: "journal page", plural: "journal pages", count: impact.pageCount },
            { singular: "scene in linked branch", plural: "scenes in linked branch", count: impact.sceneCount },
            { singular: "site journal entry", plural: "site journal entries", count: impact.journalEntryCount },
            ...(impact.participantImpacts || []).map(entry => ({
                singular: entry.label,
                plural: `${entry.label}s`,
                count: entry.count
            }))
        ]
            .filter(row => Number(row.count || 0) > 0)
            .map(row => {
                const count = Number(row.count || 0);
                return `<li>${count} ${count === 1 ? row.singular : row.plural}</li>`;
            })
            .join("");

        return foundry.applications.api.DialogV2.wait({
            classes: ["dialog", "augur-nexus", "site-delete-dialog"],
            window: {
                title: "Delete Site",
                icon: "fa-solid fa-triangle-exclamation"
            },
            position: { width: 500 },
            modal: true,
            rejectClose: false,
            content: `
                <div class="nexus-delete-confirm">
                    <p>Delete <strong>${siteName}</strong>?</p>
                    <p>This site is linked to <strong>${linkedSceneName}</strong>.</p>
                    ${impactRows ? `<ul>${impactRows}</ul>` : ""}
                    <p>Choose whether to keep the linked scene branch or delete it with the site.</p>
                </div>
            `,
            buttons: [
                {
                    action: "site-only",
                    label: "Delete Site Only",
                    icon: "fa-solid fa-map-pin",
                    class: "site-delete-choice keep-scene",
                    callback: () => "site-only"
                },
                {
                    action: "site-and-branch",
                    label: "Delete Site + Scene Branch",
                    icon: "fa-solid fa-trash",
                    class: "site-delete-choice delete-branch",
                    default: false,
                    callback: () => "site-and-branch"
                },
                {
                    action: "cancel",
                    label: "Cancel",
                    icon: "fa-solid fa-xmark",
                    class: "site-delete-choice cancel",
                    type: "button",
                    default: true,
                    callback: () => "cancel"
                }
            ]
        });
    }

    static async #detachLinkedScene(plan) {
        if (!plan.linkedScene) return;

        await NexusSceneNavigationManager.setSceneNavigation(plan.linkedScene, {
            parentSceneId: null,
            parentSiteId: null
        });
        await NexusLineageManager.clearSceneParent(plan.linkedScene, {
            expectedParentSceneId: plan.parentScene?.id || null,
            expectedParentSiteId: plan.siteId || null
        });
        await plan.linkedScene.unsetFlag(MODULE_ID, "site");
        await plan.linkedScene.unsetFlag(MODULE_ID, "siteScene");
    }

    static async #deleteSiteArtifacts(plan) {
        try {
            await this.#deleteSiteMarkers(plan);
        } catch (err) {
            console.warn("Augur Nexus | Failed to delete all site markers during site cleanup.", err);
        }
        if (plan.journalEntryId && plan.journalPageId) {
            await SiteJournalManager.removeSitePage(plan.journalEntryId, plan.journalPageId);
        }
        await SiteRecordManager.removeSceneRecord(plan.parentScene, plan.siteId, {
            placeableId: plan.doc?.id || null,
            linkedSceneId: plan.linkedSceneId || null
        });
        if (plan.labelId) {
            await plan.parentScene.deleteEmbeddedDocuments("Drawing", [plan.labelId]).catch(err => {
                console.warn("Augur Nexus | Failed to delete site label during site cleanup.", err);
            });
        }
        if (plan.doc?.id) {
            await plan.parentScene.deleteEmbeddedDocuments(plan.documentName, [plan.doc.id]).catch(err => {
                console.warn("Augur Nexus | Failed to delete site placeable during site cleanup.", err);
            });
        }
        Hooks.callAll("augurNexusLineageChanged");
    }

    static async #deleteSiteMarkers(plan) {
        const { NexusMarkerService } = await import("../../markers/services/NexusMarkerService.js");
        await NexusMarkerService.deleteMarkersForTarget({
            kind: "nexus-site",
            parentSceneId: plan.parentScene?.id || null,
            siteId: plan.siteId
        });
    }

    static #notifyDeleted(plan, deletedThing) {
        ui.notifications.info(`Deleted ${deletedThing} "${plan.siteName || "Site"}".`);
    }
}
