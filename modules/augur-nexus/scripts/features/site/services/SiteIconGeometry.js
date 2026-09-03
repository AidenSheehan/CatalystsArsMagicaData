export class SiteIconGeometry {
    static MIN_ASPECT_RATIO = 0.1;
    static MAX_ASPECT_RATIO = 10;

    static normalizeAspectRatio(value, fallback = 1) {
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) {
            return Math.min(this.MAX_ASPECT_RATIO, Math.max(this.MIN_ASPECT_RATIO, numeric));
        }
        const fallbackNumeric = Number(fallback);
        return Number.isFinite(fallbackNumeric) && fallbackNumeric > 0
            ? Math.min(this.MAX_ASPECT_RATIO, Math.max(this.MIN_ASPECT_RATIO, fallbackNumeric))
            : 1;
    }

    static aspectRatioFromDocument(doc = null, fallback = 1) {
        const width = Number(doc?.width || 0);
        const height = Number(doc?.height || doc?.iconSize || 0);
        if (width > 0 && height > 0) return this.normalizeAspectRatio(width / height, fallback);
        return this.normalizeAspectRatio(fallback);
    }

    static async resolveDimensions(src = "", iconSize = 100, fallbackAspectRatio = 1) {
        const height = this.#normalizeIconSize(iconSize);
        const aspectRatio = await this.resolveAspectRatio(src, fallbackAspectRatio);
        return {
            width: Math.max(1, Math.round(height * aspectRatio)),
            height,
            aspectRatio
        };
    }

    static async resolveAspectRatio(src = "", fallback = 1) {
        const normalizedFallback = this.normalizeAspectRatio(fallback);
        if (!src) return normalizedFallback;

        try {
            const texture = await foundry.canvas.loadTexture(src);
            return this.aspectRatioFromTexture(texture, normalizedFallback);
        } catch (_err) {
            return normalizedFallback;
        }
    }

    static aspectRatioFromTexture(texture = null, fallback = 1) {
        const width = Number(texture?.orig?.width || texture?.width || texture?.baseTexture?.realWidth || 0);
        const height = Number(texture?.orig?.height || texture?.height || texture?.baseTexture?.realHeight || 0);
        if (width > 0 && height > 0) return this.normalizeAspectRatio(width / height, fallback);
        return this.normalizeAspectRatio(fallback);
    }

    static dimensionsFromTexture(texture = null, iconSize = 100, fallbackAspectRatio = 1) {
        const height = this.#normalizeIconSize(iconSize);
        const aspectRatio = this.aspectRatioFromTexture(texture, fallbackAspectRatio);
        return {
            width: Math.max(1, Math.round(height * aspectRatio)),
            height,
            aspectRatio
        };
    }

    static #normalizeIconSize(iconSize = 100) {
        const numeric = Math.round(Number(iconSize) || 100);
        return Math.max(1, numeric);
    }
}
