import {FLAG, MODULE_ID} from "../SceneActors.js";
import ModuleDocumentation from "../documentation/ModuleDocumentation.js";

export const SETTINGS = {
    ENABLE_ROTATE_ACTORS: 'enableRotateActors',
    ENABLE_BATTLE_ACTORS: 'enableBattleActors',
    ENABLE_HOVER_NAMES: 'enableHoverNames',
    CHANGELOG_VERSION: 'changelog',
}

export default class ModuleSettings {

    static isSystemDSA() {
        return game.system?.id === 'dsa5'
    };

    static async init() {

        const FLAG_IS_DISABLED = 'isDisabled';
        const FLAG_SHOW_TOOLTIPS = 'showTooltips';

        game.settings.registerMenu(MODULE_ID, 'changelog', {
            name: "Settings.changelogTitle",
            label: "Settings.changelogButton",
            hint: "Settings.changelogHint",
            type: ModuleDocumentation
        })

        game.settings.register(MODULE_ID, "showChangelogOnUpdate", {
            name: 'Settings.showChangelogTitle',
            hint: 'Settings.showChangelogHint',
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
            restricted: true,
        });

        game.settings.register(MODULE_ID, "changelog", {
            scope: "client",
            config: false,
            type: String,
            default: '0.0.0'
        });

        game.settings.register(MODULE_ID, FLAG_IS_DISABLED, {
            name: 'Settings.disableTitle',
            hint: 'Settings.disableHint',
            scope: "client",
            default: false,
            config: true,
            type: Boolean,
            requiresReload: true,
            onChange: async (value) => {
                await game.user.setFlag(MODULE_ID, FLAG_IS_DISABLED, value)
            }
        })

        game.settings.register(MODULE_ID, FLAG_SHOW_TOOLTIPS, {
            name: 'Settings.tooltipsTitle',
            hint: 'Settings.tooltipsHint',
            scope: "world",
            default: true,
            config: true,
            type: Boolean,
            onChange: () => {
                game.yendorsSceneActors.update();
            }
        })

        game.settings.register(MODULE_ID, SETTINGS.ENABLE_ROTATE_ACTORS, {
            name: 'Settings.rotateActorsTitle',
            hint: 'Settings.rotateActorsHint',
            scope: "client",
            default: false,
            config: true,
            requiresReload: true,
            type: Boolean
        })

        game.settings.register(MODULE_ID, SETTINGS.ENABLE_ROTATE_ACTORS, {
            name: 'Settings.rotateActorsTitle',
            hint: 'Settings.rotateActorsHint',
            scope: "client",
            default: false,
            config: true,
            requiresReload: true,
            type: Boolean
        })

        game.settings.register(MODULE_ID, SETTINGS.ENABLE_HOVER_NAMES, {
            name: 'Settings.hoverNamesTitle',
            hint: 'Settings.hoverNamesHint',
            scope: "world",
            default: false,
            config: true,
            requiresReload: false,
            type: Boolean
        })

        if (ModuleSettings.isSystemDSA()) {
            game.settings.register(MODULE_ID, SETTINGS.ENABLE_BATTLE_ACTORS, {
                name: 'Settings.battleActorsTitle',
                hint: 'Settings.battleActorsHint',
                scope: "world",
                default: false,
                config: true,
                restricted: true,
                requiresReload: true,
                type: Boolean,
            })
        }

        game.settings.register(MODULE_ID, FLAG.PLAYER_CHARACTERS, {
            scope: "world",
            default: {},
            config: false,
            type: Object,
        })

        game.keybindings.register(MODULE_ID, "minMaxSelector", {
            name: "Settings.keyMinMaxSelectorTitle",
            hint: "Settings.keyMinMaxSelectorHint",
            editable: [
                { key: "KeyS" }
            ],
            onDown: () => {
                game.yendorsSceneActors.sceneActorsSelectorApp.toggleMinimize();
                return true;
            },
            restricted: true
        });

        game.keybindings.register(MODULE_ID, "toggleSceneActorsView", {
            name: "Settings.keyToggleSceneActorsViewTitle",
            hint: "Settings.keyToggleSceneActorsViewHint",
            editable: [
                { key: "KeyS", modifiers: [KeyboardManager.MODIFIER_KEYS.ALT] }
            ],
            onDown: () => {
                game.yendorsSceneActors.hotKeyToggleView();
                return true;
            },
            restricted: false
        });

        game.keybindings.register(MODULE_ID, "toggleSceneActors", {
            name: "Settings.keyToggleSceneActorsTitle",
            hint: "Settings.keyToggleSceneActorsHint",
            editable: [
                { key: "KeyS", modifiers: [KeyboardManager.MODIFIER_KEYS.ALT, KeyboardManager.MODIFIER_KEYS.SHIFT] }
            ],
            onDown: () => {
                game.yendorsSceneActors.toggleSceneActors();
                return true;
            },
            restricted: true
        });
    }
}