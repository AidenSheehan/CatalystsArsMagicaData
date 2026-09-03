import { confirmDestructiveAction } from "../../../api/ui.js";
import { NexusSceneOperations } from "./NexusSceneOperations.js";

const MODULE_ID = "augur-nexus";

const participants = new Map();

function normalizeParticipantImpacts(result) {
    if (!result) return [];
    if (Array.isArray(result)) return result;
    if (Array.isArray(result.impacts)) return result.impacts;

    return Object.entries(result)
        .filter(([, count]) => Number(count || 0) > 0)
        .map(([label, count]) => ({ label, count }));
}

function getMatchingParticipants(context) {
    return [...participants.values()].filter(participant => {
        if (typeof participant?.matches !== "function") return false;
        try {
            return participant.matches(context) === true;
        } catch (err) {
            console.warn("Augur Nexus | Scene delete participant match failed.", err);
            return false;
        }
    });
}

function buildOperation(rootScene, operation = {}) {
    return foundry.utils.mergeObject({
        [MODULE_ID]: {
            nexusDeleteHandled: true,
            nexusDeleteRootSceneId: rootScene.id
        }
    }, operation || {}, { inplace: false });
}

export class NexusSceneDeletionCoordinator {
    static registerParticipant(moduleId, participant) {
        if (!moduleId || !participant) return false;
        participants.set(moduleId, { ...participant, moduleId });
        return true;
    }

    static unregisterParticipant(moduleId) {
        return participants.delete(moduleId);
    }

    static getSceneBranchDeleteImpact(rootScene, options = {}) {
        if (!rootScene) return null;

        const branch = options.branch || NexusSceneOperations.collectSceneBranch(rootScene);
        const baseImpact = NexusSceneOperations.getDeleteBranchImpact(rootScene, branch);
        const context = {
            rootScene,
            branch,
            intent: options.intent || "delete-branch",
            source: options.source || "nexus"
        };
        const matchingParticipants = getMatchingParticipants(context);
        const participantImpacts = [];

        for (const participant of matchingParticipants) {
            if (typeof participant.getImpact !== "function") continue;
            try {
                participantImpacts.push(...normalizeParticipantImpacts(participant.getImpact(context)));
            } catch (err) {
                console.warn("Augur Nexus | Scene delete participant impact failed.", err);
            }
        }

        return {
            ...baseImpact,
            branch,
            impacts: [
                { label: "scene", count: baseImpact.sceneCount },
                { label: "site pin", count: baseImpact.noteCount },
                { label: "journal page", count: baseImpact.pageCount },
                { label: "site journal entry", count: baseImpact.journalEntryCount },
                ...participantImpacts
            ],
            participantImpacts
        };
    }

    static async deleteSceneBranch(rootScene, options = {}) {
        if (!rootScene) return false;

        const branch = options.branch || NexusSceneOperations.collectSceneBranch(rootScene);
        const context = {
            rootScene,
            branch,
            intent: options.intent || "delete-branch",
            source: options.source || "nexus"
        };
        const impact = this.getSceneBranchDeleteImpact(rootScene, { ...context, branch });
        const sceneCount = Number(impact?.sceneCount || branch?.length || 0);
        const confirmed = options.confirmed === true
            || options.confirm === false
            || await confirmDestructiveAction({
                title: options.title || "Delete Nexus Branch",
                subject: rootScene.name,
                message: options.message || `Delete <strong>${foundry.utils.escapeHTML(rootScene.name)}</strong> and everything below it in the Nexus tree?`,
                impacts: impact?.impacts || [],
                warning: `${sceneCount} ${sceneCount === 1 ? "scene" : "scenes"} will be permanently deleted.`,
                confirmLabel: options.confirmLabel || "Delete Branch"
            });

        if (!confirmed) return false;

        for (const participant of getMatchingParticipants(context)) {
            if (typeof participant.beforeDelete !== "function") continue;
            await participant.beforeDelete(context);
        }

        await NexusSceneOperations.deleteSceneBranch(
            rootScene,
            buildOperation(rootScene, options.operation),
            { branch }
        );
        return true;
    }
}
