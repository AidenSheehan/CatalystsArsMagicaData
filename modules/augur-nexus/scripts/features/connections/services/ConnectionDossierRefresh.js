export class ConnectionDossierRefresh {
    static #apps = new Set();
    static #registered = false;
    static #socketRegistered = false;

    static SOCKET_EVENT = "connectionDossierJournalChanged";

    static registerHooks() {
        if (this.#registered) return;
        this.#registered = true;

        Hooks.on("createJournalEntryPage", page => this.#refreshForPage(page));
        Hooks.on("updateJournalEntryPage", page => this.#refreshForPage(page));
        Hooks.on("deleteJournalEntryPage", page => this.#refreshForPage(page));
        Hooks.on("updateJournalEntry", entry => this.#refreshForEntry(entry));
        Hooks.on("deleteJournalEntry", entry => this.#refreshForEntry(entry));
        this.#registerSocket();
    }

    static watch(app) {
        if (app) this.#apps.add(app);
    }

    static unwatch(app) {
        this.#apps.delete(app);
    }

    static #refreshForPage(page) {
        const entryId = page?.parent?.id || page?.parent?.uuid || null;
        const pageId = page?.id || null;
        this.#refreshMatching({ entryId, pageId }, { broadcast: true });
    }

    static #refreshForEntry(entry) {
        const entryId = entry?.id || null;
        if (!entryId) return;
        this.#refreshMatching({ entryId, pageId: null }, { broadcast: true });
    }

    static #refreshMatching({ entryId, pageId }, { broadcast = false } = {}) {
        for (const app of Array.from(this.#apps)) {
            if (!app?.matchesConnectionDossierJournal?.({ entryId, pageId })) continue;
            app.refreshConnectionDossier?.();
        }
        if (broadcast && game.user?.isGM) this.#broadcast({ entryId, pageId });
    }

    static #registerSocket() {
        if (this.#socketRegistered) return;
        this.#socketRegistered = true;

        const register = () => {
            game.socket?.on("module.augur-nexus", message => {
                if (message?.type !== this.SOCKET_EVENT) return;
                const payload = {
                    entryId: message.entryId || null,
                    pageId: message.pageId || null
                };
                this.#refreshMatching(payload);
                window.setTimeout(() => this.#refreshMatching(payload), 150);
            });
        };

        if (game.socket) register();
        else Hooks.once("ready", register);
    }

    static #broadcast({ entryId, pageId } = {}) {
        if (!entryId || !game.socket) return;
        game.socket.emit("module.augur-nexus", {
            type: this.SOCKET_EVENT,
            entryId,
            pageId: pageId || null
        });
    }
}
