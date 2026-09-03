import { PersonalityTraitRegistry } from "./PersonalityTraitRegistry.js";
import { DossierTabPreference } from "../../nexus/services/DossierTabPreference.js";

const MODULE_ID = "augur-nexus";
const ENTITY_TYPE = "npc";
const SCHEMA_VERSION = 1;

const DEFAULT_ENTITY = {
    type: ENTITY_TYPE,
    schemaVersion: SCHEMA_VERSION,
    sourceModule: MODULE_ID,
    display: {
        name: "New Person",
        imageSrc: "",
        tokenImageSrc: "",
        coverImageSrc: "",
        color: "#55bdec"
    },
    identity: {
        gender: ""
    },
    role: {
        roleId: "",
        roleLabel: ""
    },
    personality: {
        traitIds: []
    },
    access: {
        playerVisibility: "inherit"
    },
    dossier: {
        defaultTab: "profile", hiddenDefaultFields: []
    },
    flavor: {
        description: "",
        descriptor: "",
        drive: "",
        action: "",
        theme: "",
        focus: ""
    },
    profile: {
        customFields: []
    },
    tags: [],
    generation: {
        generatorId: "",
        templateId: "",
        seed: null
    },
    projections: {
        actorUuid: null
    },
    markerRefs: [],
    moduleData: {}
};

export class NpcEntityNormalizer {
    static async normalizeForCreate(data = {}) {
        await PersonalityTraitRegistry.load();
        const now = Date.now();
        const id = this.#normalizeId(data.id || this.#createId());
        const entity = this.#normalizeEntity({
            ...DEFAULT_ENTITY,
            ...data,
            id,
            type: ENTITY_TYPE,
            schemaVersion: SCHEMA_VERSION,
            createdTime: Number(data.createdTime || now),
            updatedTime: Number(data.updatedTime || now)
        });
        return entity;
    }

    static async normalizeForUpdate(current = {}, patch = {}, options = {}) {
        await PersonalityTraitRegistry.load();
        const next = this.#applyStrictPatch(current, patch, options);
        return this.#normalizeEntity({
            ...next,
            id: current.id,
            type: ENTITY_TYPE,
            schemaVersion: current.schemaVersion || SCHEMA_VERSION,
            sourceModule: current.sourceModule || MODULE_ID,
            createdTime: current.createdTime || Date.now(),
            updatedTime: Date.now()
        });
    }

    static normalizeExisting(entity = {}) {
        return this.#normalizeEntity({
            ...DEFAULT_ENTITY,
            ...entity,
            id: this.#normalizeId(entity.id || this.#createId()),
            type: ENTITY_TYPE,
            schemaVersion: Number(entity.schemaVersion || SCHEMA_VERSION)
        }, { allowUnknownTraits: true });
    }

    static #normalizeEntity(entity = {}, { allowUnknownTraits = false } = {}) {
        const display = this.#normalizeDisplay(entity.display);
        const identity = this.#normalizeIdentity(entity.identity);
        const role = this.#normalizeRole(entity.role);
        const personality = this.#normalizePersonality(entity.personality, { allowUnknownTraits });
        const access = this.#normalizeAccess(entity.access);
        const dossier = DossierTabPreference.normalizeDossier(entity.dossier);
        const flavor = this.#normalizeFlavor(entity.flavor);
        const profile = this.#normalizeProfile(entity.profile);
        const tags = this.#normalizeStringArray(entity.tags);

        return {
            id: this.#normalizeId(entity.id),
            type: ENTITY_TYPE,
            schemaVersion: Number(entity.schemaVersion || SCHEMA_VERSION),
            sourceModule: this.#string(entity.sourceModule || MODULE_ID),
            createdTime: Number(entity.createdTime || Date.now()),
            updatedTime: Number(entity.updatedTime || entity.createdTime || Date.now()),
            display,
            identity,
            role,
            personality,
            access,
            dossier,
            flavor,
            profile,
            tags,
            generation: {
                generatorId: this.#string(entity.generation?.generatorId),
                templateId: this.#string(entity.generation?.templateId),
                seed: entity.generation?.seed ?? null
            },
            projections: {
                actorUuid: this.#string(entity.projections?.actorUuid) || null
            },
            markerRefs: this.#normalizeMarkerRefs(entity.markerRefs),
            moduleData: this.#normalizeModuleData(entity.moduleData)
        };
    }

    static #normalizeMarkerRefs(refs = []) {
        return Array.isArray(refs) ? foundry.utils.deepClone(refs).filter(ref => ref?.markerId && ref?.sceneId && ref?.documentId) : [];
    }

    static #normalizeDisplay(display = {}) {
        return {
            name: this.#string(display.name || "New Person") || "New Person",
            imageSrc: this.#string(display.imageSrc),
            tokenImageSrc: this.#string(display.tokenImageSrc),
            coverImageSrc: this.#string(display.coverImageSrc),
            color: this.#normalizeColor(display.color || "#55bdec")
        };
    }

    static #normalizeIdentity(identity = {}) {
        return {
            gender: this.#string(identity.gender)
        };
    }

    static #normalizeRole(role = {}) {
        return {
            roleId: this.#string(role.roleId),
            roleLabel: this.#string(role.roleLabel)
        };
    }

    static #normalizePersonality(personality = {}, options = {}) {
        return {
            traitIds: PersonalityTraitRegistry.validateTraitIds(personality.traitIds || [], {
                allowUnknown: options.allowUnknownTraits === true
            })
        };
    }

    static #normalizeAccess(access = {}) {
        return {
            playerVisibility: this.#normalizePlayerVisibility(access.playerVisibility)
        };
    }

    static #normalizeFlavor(flavor = {}) {
        return {
            description: this.#string(flavor.description),
            descriptor: this.#string(flavor.descriptor),
            drive: this.#string(flavor.drive),
            action: this.#string(flavor.action),
            theme: this.#string(flavor.theme),
            focus: this.#string(flavor.focus)
        };
    }

    static #normalizeProfile(profile = {}) {
        return {
            customFields: this.#normalizeCustomFields(profile.customFields)
        };
    }

    static #applyStrictPatch(current = {}, patch = {}, { moduleId = "" } = {}) {
        const allowed = {
            display: new Set(["name", "imageSrc", "tokenImageSrc", "coverImageSrc", "color"]),
            identity: new Set(["gender"]),
            role: new Set(["roleId", "roleLabel"]),
            personality: new Set(["traitIds"]),
            access: new Set(["playerVisibility"]),
            dossier: new Set(["defaultTab", "hiddenDefaultFields"]),
            flavor: new Set(["description", "descriptor", "drive", "action", "theme", "focus"]),
            profile: new Set(["customFields"]),
            projections: new Set(["actorUuid"])
        };

        const next = foundry.utils.deepClone(current);
        for (const [key, value] of Object.entries(patch || {})) {
            if (key === "tags") {
                next.tags = value;
                continue;
            }

            if (key === "moduleData") {
                const namespace = String(moduleId || "").trim();
                if (!namespace) throw new Error("moduleData updates require a moduleId option.");
                const requestedNamespaces = Object.keys(value || {});
                if (requestedNamespaces.some(id => id !== namespace)) {
                    throw new Error("NPC moduleData patches may only update the caller namespace.");
                }
                next.moduleData = {
                    ...(next.moduleData || {}),
                    [namespace]: value?.[namespace] || {}
                };
                continue;
            }

            if (!allowed[key]) throw new Error(`Unsupported NPC update field: ${key}`);
            if (!value || typeof value !== "object" || Array.isArray(value)) {
                throw new Error(`NPC update field ${key} must be an object patch.`);
            }
            for (const [field, fieldValue] of Object.entries(value)) {
                if (!allowed[key].has(field)) throw new Error(`Unsupported NPC update field: ${key}.${field}`);
                next[key] = {
                    ...(next[key] || {}),
                    [field]: fieldValue
                };
            }
        }
        return next;
    }

    static #normalizeModuleData(moduleData = {}) {
        const normalized = {};
        for (const [moduleId, data] of Object.entries(moduleData || {})) {
            const id = this.#string(moduleId);
            if (!id || !data || typeof data !== "object" || Array.isArray(data)) continue;
            normalized[id] = foundry.utils.deepClone(data);
        }
        return normalized;
    }

    static #normalizeStringArray(values = []) {
        return [...new Set((Array.isArray(values) ? values : [])
            .map(value => this.#string(value))
            .filter(Boolean))];
    }

    static #normalizeCustomFields(fields = []) {
        const usedIds = new Set();
        return (Array.isArray(fields) ? fields : []).map(field => {
            const label = this.#string(field?.label);
            const value = this.#string(field?.value);
            if (!label && !value) return null;
            let id = this.#normalizeCustomFieldId(field?.id || label || this.#createId());
            const baseId = id;
            let suffix = 2;
            while (usedIds.has(id)) {
                id = `${baseId}-${suffix}`;
                suffix += 1;
            }
            usedIds.add(id);
            return { id, label: label || "Field", value };
        }).filter(Boolean);
    }

    static #normalizeCustomFieldId(id) {
        const value = this.#string(id)
            .toLocaleLowerCase()
            .replace(/[^a-z0-9.:-]+/g, "-")
            .replace(/^-+|-+$/g, "");
        return value.startsWith("field.") ? value : `field.${value || this.#createId()}`;
    }

    static #normalizeColor(color) {
        const value = this.#string(color);
        return /^#[0-9a-f]{6}$/i.test(value) ? value : "#55bdec";
    }

    static #normalizePlayerVisibility(value) {
        const normalized = this.#string(value || "inherit");
        return ["inherit", "show", "hide"].includes(normalized) ? normalized : "inherit";
    }

    static #normalizeId(id) {
        const value = this.#string(id);
        return value.startsWith("npc.") ? value : `npc.${value || this.#createId()}`;
    }

    static #createId() {
        return globalThis.foundry?.utils?.randomID?.() || Math.random().toString(36).slice(2, 10);
    }

    static #string(value) {
        return String(value || "").trim();
    }
}
