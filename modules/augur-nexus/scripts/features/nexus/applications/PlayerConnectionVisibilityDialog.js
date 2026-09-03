import { ConnectionStore } from "../../connections/services/ConnectionStore.js";

export class PlayerConnectionVisibilityDialog {
    static async show() {
        if (!game.user.isGM) return null;

        const current = ConnectionStore.getGlobalPlayerConnectionVisibilityPolicy();
        const options = [
            {
                value: "all",
                label: "All Connections",
                description: "Players see Nexus connections unless a connection is set to No."
            },
            {
                value: "explicit",
                label: "Explicit Only",
                description: "Players see only connections specifically set to Yes."
            }
        ];
        const optionRows = options.map(option => `
            <label class="nexus-player-open-option">
                <input type="radio" name="playerConnectionVisibility" value="${option.value}" ${current === option.value ? "checked" : ""}>
                <span>
                    <strong>${option.label}</strong>
                    <small>${option.description}</small>
                </span>
            </label>
        `).join("");

        const result = await foundry.applications.api.DialogV2.wait({
            window: { title: "Connection Visibility" },
            position: { width: 460 },
            modal: true,
            rejectClose: false,
            content: `
                <div class="nexus-player-open-dialog">
                    <p>Choose the global default for which Nexus connections are visible to players. Connection-level Visible To Players settings can override this.</p>
                    <div class="nexus-player-open-options">
                        ${optionRows}
                    </div>
                </div>
            `,
            buttons: [
                {
                    action: "save",
                    label: "Save",
                    icon: "fa-solid fa-check",
                    default: true,
                    callback: (_event, button) => button.form?.elements?.playerConnectionVisibility?.value || current
                },
                {
                    action: "cancel",
                    label: "Cancel",
                    icon: "fa-solid fa-xmark",
                    callback: () => null
                }
            ]
        });

        if (!result) return null;
        return ConnectionStore.setGlobalPlayerConnectionVisibilityPolicy(result);
    }
}
