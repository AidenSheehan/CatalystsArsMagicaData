import { NexusPlayerSceneAccess } from "../services/NexusPlayerSceneAccess.js";

export class PlayerSceneOpenDialog {
    static async show() {
        if (!game.user.isGM) return null;

        const current = NexusPlayerSceneAccess.getGlobalViewPolicy();
        const options = [
            {
                value: "all",
                label: "All Nexus Scenes",
                description: "Players can open existing Nexus scenes unless a scene is set to Blocked."
            },
            {
                value: "explicit",
                label: "Explicit Only",
                description: "Players can open only scenes specifically set to Allowed."
            }
        ];
        const optionRows = options.map(option => `
            <label class="nexus-player-open-option">
                <input type="radio" name="playerSceneViewing" value="${option.value}" ${current === option.value ? "checked" : ""}>
                <span>
                    <strong>${option.label}</strong>
                    <small>${option.description}</small>
                </span>
            </label>
        `).join("");

        const result = await foundry.applications.api.DialogV2.wait({
            window: { title: "Player Scene Open" },
            position: { width: 460 },
            modal: true,
            rejectClose: false,
            content: `
                <div class="nexus-player-open-dialog">
                    <p>Choose the global default for whether players can open existing Nexus scenes in view mode. Scene-level Player Scene Open settings can override this.</p>
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
                    callback: (_event, button) => button.form?.elements?.playerSceneViewing?.value || current
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
        return NexusPlayerSceneAccess.setGlobalViewPolicy(result);
    }
}
