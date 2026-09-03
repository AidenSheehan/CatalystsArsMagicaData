import { NexusSceneTransitionEffects } from "./NexusSceneTransitionEffects.js";

const MODULE_ID = "augur-nexus";
const DEFAULT_FRESHNESS_MS = 30_000;
const CONTENT_DOCUMENT_TYPES = [
    "Token",
    "Tile",
    "Wall",
    "Drawing",
    "AmbientLight",
    "AmbientSound",
    "Note",
    "MeasuredTemplate",
    "Region"
];

export class NexusDestructiveGenerationSafety {
    static async confirmDestructiveSceneGeneration({
        scene = canvas.scene,
        ownerModuleId = "",
        generatorType = "map",
        freshnessMs = DEFAULT_FRESHNESS_MS,
        legacyGeneratedSceneTest = null,
        newSceneName = null,
        promptTitle = "Generate Map",
        promptVerb = "generate"
    } = {}) {
        if (!scene) {
            ui.notifications.warn("Choose an active scene before generating.");
            return { action: "cancel", scene: null, createdScene: false };
        }

        const ownerId = String(ownerModuleId || "").trim();
        if (!ownerId) {
            throw new Error("Destructive scene generation requires an ownerModuleId.");
        }

        if (this.isSceneEmptyForOverwrite(scene)) {
            return { action: "overwrite", scene, createdScene: false };
        }

        if (this.#isFreshGeneratedScene(scene, ownerId, freshnessMs)) {
            return { action: "overwrite", scene, createdScene: false };
        }

        const legacyGenerated = typeof legacyGeneratedSceneTest === "function"
            ? legacyGeneratedSceneTest(scene) === true
            : false;

        const choice = await this.#promptOverwriteChoice(scene, {
            promptTitle,
            promptVerb,
            legacyGenerated
        });
        if (!choice || choice === "cancel") {
            return { action: "cancel", scene, createdScene: false };
        }

        if (choice === "create-new") {
            const created = await this.#createEmptyGenerationScene(scene, {
                name: newSceneName || `${scene.name || "Scene"} - Generated`
            });
            if (!created) return { action: "cancel", scene, createdScene: false };
            return { action: "create-new", scene: created, createdScene: true };
        }

        return { action: "overwrite", scene, createdScene: false };
    }

    static async markDestructiveSceneGenerationComplete(scene, {
        ownerModuleId = "",
        generatorType = "map",
        generationId = foundry.utils.randomID(),
        lastGeneratedAt = Date.now()
    } = {}) {
        if (!scene) return null;
        const ownerId = String(ownerModuleId || "").trim();
        if (!ownerId) {
            throw new Error("Destructive scene generation completion requires an ownerModuleId.");
        }

        const current = foundry.utils.deepClone(scene.getFlag(MODULE_ID, "destructiveGeneration") || {});
        const byModule = current.byModule && typeof current.byModule === "object"
            ? current.byModule
            : {};
        byModule[ownerId] = {
            generatorType,
            generationId,
            lastGeneratedAt
        };

        const next = {
            ...current,
            byModule
        };
        await scene.setFlag(MODULE_ID, "destructiveGeneration", next);
        return byModule[ownerId];
    }

    static getDestructiveSceneGenerationRecord(scene, ownerModuleId) {
        if (!scene || !ownerModuleId) return null;
        const record = scene.getFlag(MODULE_ID, "destructiveGeneration")?.byModule?.[ownerModuleId] || null;
        if (!record || typeof record !== "object") return null;
        return record;
    }

    static isSceneEmptyForOverwrite(scene) {
        if (!scene) return false;
        if (this.#hasSceneImage(scene)) return false;

        return CONTENT_DOCUMENT_TYPES.every(type => this.#embeddedCount(scene, type) === 0);
    }

    static #isFreshGeneratedScene(scene, ownerModuleId, freshnessMs) {
        const record = this.getDestructiveSceneGenerationRecord(scene, ownerModuleId);
        const lastGeneratedAt = Number(record?.lastGeneratedAt);
        if (!Number.isFinite(lastGeneratedAt)) return false;

        const maxAge = Math.max(0, Number(freshnessMs) || DEFAULT_FRESHNESS_MS);
        return Date.now() - lastGeneratedAt <= maxAge;
    }

    static #hasSceneImage(scene) {
        const paths = [
            "background.src",
            "foreground.src",
            "img"
        ];
        return paths.some(path => {
            const value = foundry.utils.getProperty(scene, path);
            return typeof value === "string" && value.trim().length > 0;
        });
    }

    static #embeddedCount(scene, type) {
        try {
            const collection = scene.getEmbeddedCollection(type);
            return Number(collection?.size ?? collection?.length ?? collection?.contents?.length ?? 0);
        } catch (_err) {
            return 1;
        }
    }

    static async #promptOverwriteChoice(scene, { promptTitle, promptVerb, legacyGenerated }) {
        const sceneName = foundry.utils.escapeHTML(scene.name || "Current Scene");
        const verb = foundry.utils.escapeHTML(promptVerb || "generate");
        const legacyWarning = legacyGenerated
            ? "<p class=\"nexus-delete-confirm-warning\">This scene was generated before overwrite safety tracking was added.</p>"
            : "";

        return foundry.applications.api.DialogV2.wait({
            classes: ["dialog", "augur-nexus", "destructive-generation-dialog"],
            window: {
                title: promptTitle || "Generate Map",
                icon: "fa-solid fa-triangle-exclamation"
            },
            position: { width: 500 },
            modal: true,
            rejectClose: false,
            content: `
                <div class="nexus-delete-confirm">
                    <p>Generate into current scene?</p>
                    <p>The generator is about to ${verb} into <strong>${sceneName}</strong>. Existing map elements in this scene will be removed.</p>
                    <p>You can create a new scene instead if you want to keep the current one unchanged.</p>
                    ${legacyWarning}
                </div>
            `,
            buttons: [
                {
                    action: "cancel",
                    label: "Cancel",
                    icon: "fa-solid fa-xmark",
                    type: "button",
                    default: true,
                    callback: () => "cancel"
                },
                {
                    action: "create-new",
                    label: "Create New Scene",
                    icon: "fa-solid fa-plus",
                    callback: () => "create-new"
                },
                {
                    action: "overwrite",
                    label: "Overwrite Scene",
                    icon: "fa-solid fa-triangle-exclamation",
                    class: "nexus-delete-confirm-submit",
                    callback: () => "overwrite"
                }
            ]
        });
    }

    static async #createEmptyGenerationScene(sourceScene, { name }) {
        const createData = {
            name,
            navigation: true,
            folder: sourceScene?.folder?.id || null
        };

        const scene = await Scene.create(createData);
        if (!scene) return null;
        await NexusSceneTransitionEffects.transitionToScene(scene, { transitionStyle: "none" });
        return scene;
    }
}
