const MODULE_ID = "augur-nexus";

export class SiteLabelManager {
    static DEFAULT_FONT_SIZE = 24;
    static MIN_FONT_SIZE = 14;
    static MAX_FONT_SIZE = 56;
    static FONT_FAMILY = "Signika";
    static FONT_OPTIONS = [
        { family: "Signika", label: "Signika" },
        { family: "Bruno Ace", label: "Bruno Ace" },
        { family: "Modesto Condensed", label: "Modesto" },
        { family: "Arial", label: "Arial" },
        { family: "Georgia", label: "Georgia" },
        { family: "Times New Roman", label: "Times New Roman" },
        { family: "Courier New", label: "Courier New" }
    ];
    static DEFAULT_HEIGHT = 30;
    static DEFAULT_OFFSET = 8;
    static LABEL_FILL_ALPHA = 0.01;
    static LABEL_TEXT_ALPHA = 0.96;
    static HIDDEN_LABEL_TEXT_ALPHA = 0.001;

    static getDefaultFontSize(iconSize = 100) {
        const numeric = Number(iconSize);
        if (!Number.isFinite(numeric)) return this.DEFAULT_FONT_SIZE;
        return this.clampFontSize(Math.round(18 + ((numeric - 50) * 0.13)));
    }

    static clampFontSize(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return this.DEFAULT_FONT_SIZE;
        return Math.min(this.MAX_FONT_SIZE, Math.max(this.MIN_FONT_SIZE, Math.round(numeric)));
    }

    static resolveFontSize(record = {}) {
        return this.clampFontSize(record.labelFontSize || this.getDefaultFontSize(record.iconSize));
    }

    static resolveFontFamily(record = {}) {
        const family = String(record.labelFontFamily || record.fontFamily || this.FONT_FAMILY).trim();
        return this.FONT_OPTIONS.some(option => option.family === family) ? family : this.FONT_FAMILY;
    }

    static findLabel(scene, siteId, tileId = null) {
        if (!scene || !siteId) return null;
        return scene.drawings?.contents?.find(drawing => {
            const flags = drawing.flags?.[MODULE_ID] || {};
            if (!flags.siteLabel) return false;
            if (tileId && flags.ownerTileId === tileId) return true;
            return flags.siteId === siteId;
        }) || null;
    }

    static findLabelForTile(scene, tile) {
        const doc = tile?.document || tile || null;
        if (!scene || !doc) return null;

        const flags = doc.flags?.[MODULE_ID] || {};
        if (flags.labelId) {
            const label = scene.drawings?.get(flags.labelId)
                || scene.drawings?.contents?.find(drawing => drawing.id === flags.labelId)
                || null;
            if (label) return label;
        }

        return this.findLabel(scene, flags.siteId, doc.id);
    }
}
