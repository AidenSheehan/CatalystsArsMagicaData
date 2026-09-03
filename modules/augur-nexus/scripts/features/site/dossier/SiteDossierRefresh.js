export class SiteDossierRefresh {
    static #apps = new Set();
    static #registered = false;

    static registerHooks() {
        if (this.#registered) return;
        this.#registered = true;

        Hooks.on("updateJournalEntryPage", page => this.#refreshForPage(page));
        Hooks.on("deleteJournalEntryPage", page => this.#refreshForPage(page));
        Hooks.on("updateJournalEntry", entry => this.#refreshForEntry(entry));
        Hooks.on("deleteJournalEntry", entry => this.#refreshForEntry(entry));
        Hooks.on("augurNexusLineageChanged", () => this.#refreshAll());
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
        this.#refreshMatching({ entryId, pageId });
    }

    static #refreshForEntry(entry) {
        const entryId = entry?.id || null;
        if (!entryId) return;
        this.#refreshMatching({ entryId, pageId: null });
    }

    static #refreshMatching({ entryId, pageId }) {
        for (const app of Array.from(this.#apps)) {
            if (!app?.matchesSiteJournal?.({ entryId, pageId })) continue;
            app.refreshSiteDossier?.();
        }
    }

    static #refreshAll() {
        for (const app of Array.from(this.#apps)) {
            app.refreshSiteDossier?.();
        }
    }
}
