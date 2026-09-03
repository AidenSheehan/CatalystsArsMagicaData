import { CampaignEntityVisibilityManager } from "../../campaign-entities/services/CampaignEntityVisibilityManager.js";

export class PlayerNpcVisibilityDialog {
    static async show(entityType = "npc") {
        if (!game.user.isGM) return null;

        const type = CampaignEntityVisibilityManager.normalizeEntityType(entityType);
        const config = CampaignEntityVisibilityManager.getConfig(type);
        const current = CampaignEntityVisibilityManager.getGlobalPlayerVisibilityPolicy(type);
        const options = [
            {
                value: "all",
                label: `All ${config.pluralLabel}`,
                description: `Players see ${config.pluralLabel.toLocaleLowerCase()} unless one is set to No.`
            },
            {
                value: "explicit",
                label: "Explicit Only",
                description: `Players see only ${config.pluralLabel.toLocaleLowerCase()} specifically set to Yes.`
            }
        ];
        const optionRows = options.map(option => `
            <label class="nexus-player-open-option">
                <input type="radio" name="playerEntityVisibility" value="${option.value}" ${current === option.value ? "checked" : ""}>
                <span>
                    <strong>${option.label}</strong>
                    <small>${option.description}</small>
                </span>
            </label>
        `).join("");

        const result = await foundry.applications.api.DialogV2.wait({
            window: { title: `${config.label} Visibility` },
            position: { width: 460 },
            modal: true,
            rejectClose: false,
            content: `
                <div class="nexus-player-open-dialog">
                    <p>Choose the global default for which Nexus ${config.pluralLabel.toLocaleLowerCase()} are visible to players. ${config.label}-level Visible To Players settings can override this.</p>
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
                    callback: (_event, button) => button.form?.elements?.playerEntityVisibility?.value || current
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
        return CampaignEntityVisibilityManager.setGlobalPlayerVisibilityPolicy(type, result);
    }
}
