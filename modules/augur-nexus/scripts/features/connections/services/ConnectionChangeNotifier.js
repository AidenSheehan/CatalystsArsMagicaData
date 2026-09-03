export class ConnectionChangeNotifier {
    static #lastSignature = "";

    static notify(graph, { reason = "update" } = {}) {
        const signature = `${graph?.updatedTime || 0}:${graph?.updateId || ""}`;
        if (signature && signature === this.#lastSignature) return;
        this.#lastSignature = signature;
        Hooks.callAll("augurNexusConnectionsChanged", { graph, reason });
    }
}
