// Coalesces bursty Nexus refresh hooks into one browser render.

export class NexusBrowserRefreshScheduler {
    static DEFAULT_DELAY_MS = 50;
    static #callbacks = new Set();
    static #pending = false;
    static #timer = null;
    static #reasons = new Set();

    static register(callback) {
        if (typeof callback !== "function") return null;
        this.#callbacks.add(callback);
        return callback;
    }

    static unregister(callback) {
        if (!callback) return;
        this.#callbacks.delete(callback);
    }

    static schedule(reason = "refresh", { delay = this.DEFAULT_DELAY_MS } = {}) {
        this.#reasons.add(String(reason || "refresh"));
        if (this.#pending) return;

        this.#pending = true;
        this.#timer = setTimeout(() => this.flush(), Math.max(0, Number(delay) || 0));
    }

    static flush() {
        if (this.#timer) {
            clearTimeout(this.#timer);
            this.#timer = null;
        }

        if (!this.#pending && !this.#reasons.size) return;
        this.#pending = false;
        const reasons = [...this.#reasons];
        this.#reasons.clear();

        for (const callback of [...this.#callbacks]) {
            try {
                callback({ reasons });
            } catch (err) {
                console.error("Augur: Nexus | Failed to refresh Nexus browser.", err);
            }
        }
    }
}
