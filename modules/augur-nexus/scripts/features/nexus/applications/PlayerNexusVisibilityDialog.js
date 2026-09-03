import { NexusPlayerSceneAccess } from "../services/NexusPlayerSceneAccess.js";

export class PlayerNexusVisibilityDialog {
    static async show() {
        if (!game.user.isGM) return null;

        const current = NexusPlayerSceneAccess.getGlobalNexusVisibilityPolicy();
        const options = [
            {
                value: "all",
                label: "All Nexus Scenes",
                description: "Players see Nexus scenes and site pins unless a place is set to No."
            },
            {
                value: "explicit",
                label: "Explicit Only",
                description: "Players see only scenes and site pins specifically set to Yes."
            }
        ];
        const optionRows = options.map(option => `
            <label class="nexus-player-open-option">
                <input type="radio" name="playerNexusVisibility" value="${option.value}" ${current === option.value ? "checked" : ""}>
                <span>
                    <strong>${option.label}</strong>
                    <small>${option.description}</small>
                </span>
            </label>
        `).join("");

        const result = await foundry.applications.api.DialogV2.wait({
            window: { title: "Player Visibility" },
            position: { width: 460 },
            modal: true,
            rejectClose: false,
            content: `
                <div class="nexus-player-open-dialog">
                    <p>Choose the global default for which Nexus scenes and site pins are visible to players. Place-level Visible To Players settings can override this.</p>
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
                    callback: (_event, button) => button.form?.elements?.playerNexusVisibility?.value || current
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
        return NexusPlayerSceneAccess.setGlobalNexusVisibilityPolicy(result);
    }
}
