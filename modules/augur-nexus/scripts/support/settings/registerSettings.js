// Client and world settings that back the Sites workflow.

import { ConnectionChangeNotifier } from "../../features/connections/services/ConnectionChangeNotifier.js";
import { SiteSceneVisibilityManager } from "../../features/site/services/SiteSceneVisibilityManager.js";

const MODULE_ID = "augur-nexus";

async function syncSitePlayerVisibility() {
    for (const scene of game.scenes?.contents || []) {
        await SiteSceneVisibilityManager.applySceneVisibility(scene);
    }
}

export function registerNexusSettings() {
    game.settings.register(MODULE_ID, "siteCustomIconFolder", {
        scope: "client",
        config: false,
        type: Object,
        default: {
            source: "data",
            path: ""
        }
    });

    game.settings.register(MODULE_ID, "npcCustomPortraitFolder", {
        scope: "client",
        config: false,
        type: Object,
        default: {
            source: "data",
            path: ""
        }
    });

    game.settings.register(MODULE_ID, "shipCustomImageFolder", {
        scope: "client",
        config: false,
        type: Object,
        default: {
            source: "data",
            path: ""
        }
    });

    game.settings.register(MODULE_ID, "siteSceneRootFolderId", {
        scope: "world",
        config: false,
        type: String,
        default: ""
    });

    game.settings.register(MODULE_ID, "connectionsGraph", {
        scope: "world",
        config: false,
        type: Object,
        default: {
            version: 1,
            customCategories: {},
            nodes: {},
            edges: {}
        },
        onChange: graph => {
            ConnectionChangeNotifier.notify(graph, { reason: "settingChanged" });
        }
    });

    game.settings.register(MODULE_ID, "placeJournalEntryId", {
        scope: "world",
        config: false,
        type: String,
        default: ""
    });

    game.settings.register(MODULE_ID, "connectionDossierJournalEntryId", {
        scope: "world",
        config: false,
        type: String,
        default: ""
    });

    game.settings.register(MODULE_ID, "playerSceneViewing", {
        scope: "world",
        config: true,
        name: "Player Scene Viewing",
        hint: "Controls whether players can use Nexus buttons to view linked Nexus scenes on their own clients. Foundry scene ownership and token vision still apply.",
        type: String,
        default: "all",
        choices: {
            explicit: "Explicit Only",
            all: "All Nexus Scenes"
        },
        onChange: () => {
            ui.nexus?.render?.();
            Hooks.callAll("augurNexusPlayerSceneAccessChanged");
        }
    });

    game.settings.register(MODULE_ID, "playerNexusVisibility", {
        scope: "world",
        config: true,
        name: "Player Visibility",
        hint: "Controls which Nexus scenes and site pins are visible to players. Visible To Players settings can override this.",
        type: String,
        default: "all",
        choices: {
            explicit: "Explicit Only",
            all: "All Nexus Scenes"
        },
        onChange: () => {
            ui.nexus?.render?.();
            Hooks.callAll("augurNexusPlayerSceneAccessChanged");
            syncSitePlayerVisibility().catch(err => {
                console.warn("Failed to sync site player visibility.", err);
            });
        }
    });

    game.settings.register(MODULE_ID, "playerConnectionVisibility", {
        scope: "world",
        config: true,
        name: "Connection Visibility",
        hint: "Controls which Nexus connections are visible to players. Connection-level Visible To Players settings can override this.",
        type: String,
        default: "all",
        choices: {
            explicit: "Explicit Only",
            all: "All Connections"
        },
        onChange: () => {
            ui.nexus?.render?.();
            Hooks.callAll("augurNexusConnectionsChanged", {
                graph: game.settings.get(MODULE_ID, "connectionsGraph") || {},
                reason: "connectionVisibilitySettingChanged"
            });
        }
    });

    game.settings.register(MODULE_ID, "playerNpcVisibility", {
        scope: "world",
        config: true,
        name: "People Visibility",
        hint: "Controls which Nexus people are visible to players. Person-level Visible To Players settings can override this.",
        type: String,
        default: "all",
        choices: {
            explicit: "Explicit Only",
            all: "All People"
        },
        onChange: policy => {
            ui.nexus?.render?.();
            Hooks.callAll("augurNexusCampaignEntityVisibilityChanged", { reason: "entityVisibilitySettingChanged", entityType: "npc", policy });
            Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "entityVisibilitySettingChanged", entityType: "npc" });
            Hooks.callAll("augurNexusConnectionsChanged", {
                graph: game.settings.get(MODULE_ID, "connectionsGraph") || {},
                reason: "entityVisibilitySettingChanged"
            });
        }
    });

    game.settings.register(MODULE_ID, "playerFactionVisibility", {
        scope: "world",
        config: true,
        name: "Organization Visibility",
        hint: "Controls which Nexus organizations are visible to players. Organization-level Visible To Players settings can override this.",
        type: String,
        default: "all",
        choices: {
            explicit: "Explicit Only",
            all: "All Organizations"
        },
        onChange: policy => {
            ui.nexus?.render?.();
            Hooks.callAll("augurNexusCampaignEntityVisibilityChanged", { reason: "entityVisibilitySettingChanged", entityType: "faction", policy });
            Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "entityVisibilitySettingChanged", entityType: "faction" });
            Hooks.callAll("augurNexusConnectionsChanged", {
                graph: game.settings.get(MODULE_ID, "connectionsGraph") || {},
                reason: "entityVisibilitySettingChanged"
            });
        }
    });

    game.settings.register(MODULE_ID, "playerShipVisibility", {
        scope: "world",
        config: true,
        name: "Ship Visibility",
        hint: "Controls which Nexus ships are visible to players. Ship-level Visible To Players settings can override this.",
        type: String,
        default: "all",
        choices: {
            explicit: "Explicit Only",
            all: "All Ships"
        },
        onChange: policy => {
            ui.nexus?.render?.();
            Hooks.callAll("augurNexusCampaignEntityVisibilityChanged", { reason: "entityVisibilitySettingChanged", entityType: "ship", policy });
            Hooks.callAll("augurNexusCampaignEntitiesChanged", { reason: "entityVisibilitySettingChanged", entityType: "ship" });
            Hooks.callAll("augurNexusConnectionsChanged", {
                graph: game.settings.get(MODULE_ID, "connectionsGraph") || {},
                reason: "entityVisibilitySettingChanged"
            });
        }
    });

    game.settings.register(MODULE_ID, "cinematicSceneTransitions", {
        scope: "world",
        config: true,
        name: "Cinematic Scene Transitions",
        hint: "Use zoom and fade camera transitions when moving through Nexus scenes. Disable this if Nexus navigation should leave scene views alone.",
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_ID, "entityPlacementCreatesSceneConnections", {
        scope: "world",
        config: true,
        name: "Entity placement creates scene connections",
        hint: "When people, ships, or organizations are placed as Nexus scene markers, automatically connect the current scene to that entity.",
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_ID, "nexusBrowserShowIcons", {
        scope: "client",
        config: false,
        type: Boolean,
        default: true
    });

    game.settings.register(MODULE_ID, "siteGeneratorState", {
        scope: "client",
        config: false,
        type: Object,
        default: {
            genreId: "fantasy",
            themeId: "castle",
            sceneType: "empty",
            sizeId: "small",
            iconRole: "landmark",
            iconId: null,
            customIconSrc: "",
            iconColor: "#ffffff",
            iconSizeMode: "scene-default",
            customIconSize: null,
            mapColorId: "green",
            snapToGrid: false,
            autoSortScenes: true,
            randomizeAfterPlacement: false
        }
    });
}
