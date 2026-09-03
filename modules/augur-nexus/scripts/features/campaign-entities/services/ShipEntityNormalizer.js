import { DossierTabPreference } from "../../nexus/services/DossierTabPreference.js";

const MODULE_ID = "augur-nexus";
const ENTITY_TYPE = "ship";
const SCHEMA_VERSION = 1;

const DEFAULT_ENTITY = {
    type: ENTITY_TYPE,
    schemaVersion: SCHEMA_VERSION,
    sourceModule: MODULE_ID,
    display: { name: "New Ship", imageSrc: "", coverImageSrc: "", color: "#55bdec" },
    profile: { model: "", class: "", role: "", action: "", theme: "", focus: "", customFields: [] },
    access: { playerVisibility: "inherit" },
    dossier: { defaultTab: "profile", hiddenDefaultFields: [] },
    tags: [],
    generation: { generatorId: "", templateId: "", seed: null },
    projections: { actorUuid: null },
    markerRefs: [],
    moduleData: {}
};

export class ShipEntityNormalizer {
    static async normalizeForCreate(data = {}) {
        const now = Date.now();
        return this.#normalizeEntity({
            ...DEFAULT_ENTITY,
            ...data,
            id: this.#normalizeId(data.id || this.#createId()),
            type: ENTITY_TYPE,
            schemaVersion: SCHEMA_VERSION,
            createdTime: Number(data.createdTime || now),
            updatedTime: Number(data.updatedTime || now)
        });
    }

    static async normalizeForUpdate(current = {}, patch = {}, options = {}) {
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
        });
    }

    static #normalizeEntity(entity = {}) {
        return {
            id: this.#normalizeId(entity.id),
            type: ENTITY_TYPE,
            schemaVersion: Number(entity.schemaVersion || SCHEMA_VERSION),
            sourceModule: this.#string(entity.sourceModule || MODULE_ID),
            createdTime: Number(entity.createdTime || Date.now()),
            updatedTime: Number(entity.updatedTime || entity.createdTime || Date.now()),
            display: {
                name: this.#string(entity.display?.name || "New Ship") || "New Ship",
                imageSrc: this.#string(entity.display?.imageSrc),
                coverImageSrc: this.#string(entity.display?.coverImageSrc),
                color: this.#normalizeColor(entity.display?.color || "#55bdec")
            },
            profile: this.#normalizeProfile(entity.profile),
            access: this.#normalizeAccess(entity.access),
            dossier: DossierTabPreference.normalizeDossier(entity.dossier),
            tags: this.#normalizeStringArray(entity.tags),
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

    static #normalizeProfile(profile = {}) {
        return {
            model: this.#string(profile.model),
            class: this.#string(profile.class),
            role: this.#string(profile.role),
            action: this.#string(profile.action),
            theme: this.#string(profile.theme),
            focus: this.#string(profile.focus),
            customFields: this.#normalizeCustomFields(profile.customFields)
        };
    }

    static #normalizeAccess(access = {}) {
        return {
            playerVisibility: this.#normalizePlayerVisibility(access.playerVisibility)
        };
    }

    static #applyStrictPatch(current = {}, patch = {}, { moduleId = "" } = {}) {
        const allowed = {
            display: new Set(["name", "imageSrc", "coverImageSrc", "color"]),
            profile: new Set(["model", "class", "role", "action", "theme", "focus", "customFields"]),
            access: new Set(["playerVisibility"]),
            dossier: new Set(["defaultTab", "hiddenDefaultFields"]),
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
                if (requestedNamespaces.some(id => id !== namespace)) throw new Error("Ship moduleData patches may only update the caller namespace.");
                next.moduleData = { ...(next.moduleData || {}), [namespace]: value?.[namespace] || {} };
                continue;
            }
            if (!allowed[key]) throw new Error(`Unsupported ship update field: ${key}`);
            if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`Ship update field ${key} must be an object patch.`);
            for (const [field, fieldValue] of Object.entries(value)) {
                if (!allowed[key].has(field)) throw new Error(`Unsupported ship update field: ${key}.${field}`);
                next[key] = { ...(next[key] || {}), [field]: fieldValue };
            }
        }
        return next;
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
        return [...new Set((Array.isArray(values) ? values : []).map(value => this.#string(value)).filter(Boolean))];
    }

    static #normalizeCustomFieldId(id) {
        const value = this.#string(id).toLocaleLowerCase().replace(/[^a-z0-9.:-]+/g, "-").replace(/^-+|-+$/g, "");
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
        return value.startsWith("ship.") ? value : `ship.${value || this.#createId()}`;
    }

    static #createId() {
        return globalThis.foundry?.utils?.randomID?.() || Math.random().toString(36).slice(2, 10);
    }

    static #string(value) {
        return String(value || "").trim();
    }
}
