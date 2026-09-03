import { PersonalityTraitRegistry } from "../services/PersonalityTraitRegistry.js";

const MODULE_ID = "augur-nexus";

export class NpcEntityModel {
    static MODULE_ID = MODULE_ID;
    static ENTITY_TYPE = "npc";

    static getFlag(document) {
        return document?.getFlag?.(MODULE_ID, "campaignEntity")
            || document?.flags?.[MODULE_ID]?.campaignEntity
            || null;
    }

    static isNpcDocument(document) {
        return this.getFlag(document)?.type === this.ENTITY_TYPE;
    }

    static fromDocument(document) {
        const entity = this.getFlag(document);
        if (!entity || entity.type !== this.ENTITY_TYPE) return null;
        return {
            ...entity,
            uuid: document?.uuid || "",
            journalEntryId: document?.id || "",
            journalEntryName: document?.name || entity.display?.name || "Person"
        };
    }

    static getName(entity) {
        return String(entity?.display?.name || entity?.journalEntryName || "New Person").trim() || "New Person";
    }

    static getSubtitle(entity) {
        return [
            entity?.role?.roleLabel || ""
        ].filter(Boolean).join(" - ") || "Person";
    }

    static getImage(entity) {
        return String(entity?.display?.imageSrc || "").trim();
    }

    static getTokenImage(entity) {
        const explicit = String(entity?.display?.tokenImageSrc || "").trim();
        if (explicit) return explicit;

        const src = this.getImage(entity);
        const match = src.match(/^(.*\/portraits\/)([^/]+)\.png$/i);
        if (!match) return src;

        const tokenName = `${match[2].toLocaleLowerCase()}_tk.png`;
        return `${match[1]}tokens/${tokenName}`;
    }

    static getCoverImage(entity) {
        return String(entity?.display?.coverImageSrc || "").trim();
    }

    static getAccent(entity) {
        const color = String(entity?.display?.color || "").trim();
        return /^#[0-9a-f]{6}$/i.test(color) ? color : "#55bdec";
    }

    static getTraits(entity) {
        return PersonalityTraitRegistry.resolveTraits(entity?.personality?.traitIds || []);
    }

    static getProfileRows(entity) {
        return this.getCustomFields(entity)
            .map(field => ({
                label: field.label,
                value: field.value
            }))
            .filter(row => String(row.label || "").trim() && String(row.value || "").trim());
    }

    static getCustomFields(entity) {
        return (Array.isArray(entity?.profile?.customFields) ? entity.profile.customFields : [])
            .map(field => ({
                id: String(field?.id || "").trim(),
                label: String(field?.label || "").trim(),
                value: String(field?.value || "").trim()
            }))
            .filter(field => field.id && field.label);
    }

    static getSearchText(entity) {
        const traitLabels = this.getTraits(entity).map(trait => trait.label);
        return [
            entity?.display?.name,
            entity?.role?.roleLabel,
            entity?.identity?.gender,
            entity?.flavor?.description,
            entity?.flavor?.descriptor,
            entity?.flavor?.drive,
            ...this.getCustomFields(entity).flatMap(field => [field.label, field.value]),
            entity?.sourceModule,
            ...(Array.isArray(entity?.tags) ? entity.tags : []),
            ...traitLabels
        ].filter(Boolean).join(" ").toLocaleLowerCase();
    }
}
