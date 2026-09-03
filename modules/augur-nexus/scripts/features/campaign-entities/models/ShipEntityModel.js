const MODULE_ID = "augur-nexus";

export class ShipEntityModel {
    static MODULE_ID = MODULE_ID;
    static ENTITY_TYPE = "ship";

    static getFlag(document) {
        return document?.getFlag?.(MODULE_ID, "campaignEntity")
            || document?.flags?.[MODULE_ID]?.campaignEntity
            || null;
    }

    static isShipDocument(document) {
        return this.getFlag(document)?.type === this.ENTITY_TYPE;
    }

    static fromDocument(document) {
        const entity = this.getFlag(document);
        if (!entity || entity.type !== this.ENTITY_TYPE) return null;
        return { ...entity, uuid: document?.uuid || "", journalEntryId: document?.id || "", journalEntryName: document?.name || entity.display?.name || "Ship" };
    }

    static getName(entity) {
        return String(entity?.display?.name || entity?.journalEntryName || "New Ship").trim() || "New Ship";
    }

    static getSubtitle(entity) {
        return [entity?.profile?.model, entity?.profile?.class].filter(Boolean).join(" - ") || "Ship";
    }

    static getImage(entity) {
        return String(entity?.display?.imageSrc || "").trim();
    }

    static getCoverImage(entity) {
        return String(entity?.display?.coverImageSrc || "").trim();
    }

    static getAccent(entity) {
        const color = String(entity?.display?.color || "").trim();
        return /^#[0-9a-f]{6}$/i.test(color) ? color : "#55bdec";
    }

    static getCustomFields(entity) {
        return (Array.isArray(entity?.profile?.customFields) ? entity.profile.customFields : [])
            .map(field => ({ id: String(field?.id || "").trim(), label: String(field?.label || "").trim(), value: String(field?.value || "").trim() }))
            .filter(field => field.id && field.label);
    }

    static getProfileRows(entity) {
        return this.getCustomFields(entity).map(field => ({ label: field.label, value: field.value })).filter(row => row.label && row.value);
    }

    static getSearchText(entity) {
        return [
            entity?.display?.name,
            entity?.profile?.model,
            entity?.profile?.class,
            entity?.profile?.role,
            entity?.profile?.action,
            entity?.profile?.theme,
            entity?.profile?.focus,
            ...this.getCustomFields(entity).flatMap(field => [field.label, field.value]),
            entity?.sourceModule,
            ...(Array.isArray(entity?.tags) ? entity.tags : [])
        ].filter(Boolean).join(" ").toLocaleLowerCase();
    }
}
