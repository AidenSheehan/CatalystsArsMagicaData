export class WindowPlacementMemory {
    static #positions = new Map();

    static apply(app, key, options = {}) {
        if (!app || !key) return null;
        const remembered = this.#positions.get(key);
        const position = remembered || this.#getFallbackPosition(app, options);
        if (!position) return null;
        const clamped = this.#clampPosition(position);
        app.setPosition(clamped);
        return clamped;
    }

    static remember(app, key) {
        if (!app || !key) return null;
        const position = this.#extractPosition(app);
        if (!position) return null;
        const clamped = this.#clampPosition(position);
        this.#positions.set(key, clamped);
        return clamped;
    }

    static clear(key = "") {
        if (key) this.#positions.delete(key);
        else this.#positions.clear();
    }

    static #getFallbackPosition(app, options = {}) {
        if (options.position) return options.position;
        if (options.fallback === "default") return this.#getDefaultPosition(app, options);
        if (options.fallback === "center" || !options.fallback) return this.#getCenteredPosition(app, options);
        return null;
    }

    static #getDefaultPosition(app, options = {}) {
        const defaults = app.options?.position || app.constructor?.DEFAULT_OPTIONS?.position || {};
        const position = {
            left: Number(defaults.left ?? 20),
            top: Number(defaults.top ?? 20)
        };
        const width = Number(options.width ?? defaults.width);
        const height = Number(options.height ?? defaults.height);
        if (Number.isFinite(width)) position.width = width;
        if (Number.isFinite(height)) position.height = height;
        return position;
    }

    static #getCenteredPosition(app, options = {}) {
        const current = this.#extractPosition(app) || {};
        const width = Number(options.width || current.width || app.position?.width || app.options?.position?.width || 700);
        const height = Number(options.height || current.height || app.position?.height || app.options?.position?.height || 620);
        const safeWidth = Math.min(Math.max(width, 320), Math.max(320, window.innerWidth - 40));
        const safeHeight = Math.min(Math.max(height, 240), Math.max(240, window.innerHeight - 40));
        return {
            width: safeWidth,
            height: safeHeight,
            left: Math.max(20, Math.round((window.innerWidth - safeWidth) / 2)),
            top: Math.max(20, Math.round((window.innerHeight - safeHeight) / 2))
        };
    }

    static #extractPosition(app) {
        const position = app.position || {};
        const left = Number(position.left ?? app.element?.offsetLeft ?? NaN);
        const top = Number(position.top ?? app.element?.offsetTop ?? NaN);
        if (!Number.isFinite(left) || !Number.isFinite(top)) return null;

        const extracted = { left, top };
        const width = Number(position.width ?? app.element?.offsetWidth ?? app.options?.position?.width);
        const height = Number(position.height ?? app.element?.offsetHeight ?? app.options?.position?.height);
        if (Number.isFinite(width)) extracted.width = width;
        if (Number.isFinite(height)) extracted.height = height;
        return extracted;
    }

    static #clampPosition(position = {}) {
        const hasWidth = Number.isFinite(Number(position.width));
        const hasHeight = Number.isFinite(Number(position.height));
        const width = hasWidth ? Math.min(Math.max(Number(position.width), 320), Math.max(320, window.innerWidth - 40)) : 700;
        const height = hasHeight ? Math.min(Math.max(Number(position.height), 240), Math.max(240, window.innerHeight - 40)) : 620;
        const maxLeft = Math.max(20, window.innerWidth - width - 20);
        const maxTop = Math.max(20, window.innerHeight - height - 20);
        const clamped = {
            left: Math.min(Math.max(20, Number(position.left || 20)), maxLeft),
            top: Math.min(Math.max(20, Number(position.top || 20)), maxTop)
        };
        if (hasWidth) clamped.width = width;
        if (hasHeight) clamped.height = height;
        return clamped;
    }
}