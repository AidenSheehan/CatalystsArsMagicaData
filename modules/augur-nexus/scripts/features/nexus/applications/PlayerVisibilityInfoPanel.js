const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const INFO_CONTENT = {
    visibility: {
        title: "Visible To Players",
        icon: "fas fa-eye",
        intro: "Controls whether players can see this place in Nexus and on the parent map.",
        rows: [
            {
                icon: "fas fa-layer-group",
                label: "Global",
                text: "Use the world default from Player Visibility."
            },
            {
                icon: "fas fa-eye",
                label: "Yes",
                text: "Show this place to players even if the global setting is Explicit Only."
            },
            {
                icon: "fas fa-eye-slash",
                label: "No",
                text: "Hide this place from players even if the global setting shows all Nexus scenes."
            }
        ],
        note: "GMs still see hidden places in Nexus. Hidden map pins appear translucent for GMs and are unavailable to players."
    },
    sceneOpen: {
        title: "Player Scene Open",
        icon: "fas fa-door-open",
        intro: "Controls whether players can use Nexus buttons to open an existing scene on their own client.",
        rows: [
            {
                icon: "fas fa-layer-group",
                label: "Global",
                text: "Use the world default from Player Scene Viewing."
            },
            {
                icon: "fas fa-door-open",
                label: "Allowed",
                text: "Players may open this scene from Nexus if Foundry permissions and vision also allow it."
            },
            {
                icon: "fas fa-ban",
                label: "Blocked",
                text: "Players cannot open this scene from Nexus, even if it remains visible in the Nexus tab."
            }
        ],
        note: "This does not control whether the place appears in Nexus or on the map. Use Visible To Players for that."
    },
    connectionVisibility: {
        title: "Connection Visibility",
        icon: "fas fa-share-nodes",
        intro: "Controls whether players can see an individual Nexus connection.",
        rows: [
            {
                icon: "fas fa-layer-group",
                label: "Global",
                text: "Use the world default from Connection Visibility."
            },
            {
                icon: "fas fa-eye",
                label: "Yes",
                text: "Show this connection to players even if the global setting is Explicit Only."
            },
            {
                icon: "fas fa-eye-slash",
                label: "No",
                text: "Hide this connection from players even if the global setting shows all connections."
            }
        ],
        note: "GMs still see hidden connections. This hides the relationship, not the connected object itself."
    },
    npcVisibility: {
        title: "People Visibility",
        icon: "fas fa-user",
        intro: "Controls whether players can see this person in Nexus and through Person connections.",
        rows: [
            {
                icon: "fas fa-layer-group",
                label: "Global",
                text: "Use the world default from People Visibility."
            },
            {
                icon: "fas fa-eye",
                label: "Yes",
                text: "Show this person to players even if the global setting is Explicit Only."
            },
            {
                icon: "fas fa-eye-slash",
                label: "No",
                text: "Hide this person from players even if the global setting shows all people."
            }
        ],
        note: "GMs still see hidden people in Nexus. Hidden Persons are not shown to players in People or through visible connections."
    },
    campaignEntityVisibility: {
        title: "Entity Visibility",
        icon: "fas fa-users-viewfinder",
        intro: "Controls whether players can see this person, organization, or ship in Nexus, on the map, and through visible connections.",
        rows: [
            {
                icon: "fas fa-layer-group",
                label: "Global",
                text: "Use the world default for this entity type."
            },
            {
                icon: "fas fa-eye",
                label: "Yes",
                text: "Show this entity to players even if the global setting is Explicit Only."
            },
            {
                icon: "fas fa-eye-slash",
                label: "No",
                text: "Hide this entity from players even if the global setting shows all entities of this type."
            }
        ],
        note: "GMs still see hidden entities in Nexus. Hidden entities are not shown to players in their tab, on map markers, or through visible connections."
    }
};

export class PlayerVisibilityInfoPanel extends HandlebarsApplicationMixin(ApplicationV2) {
    #topic = "visibility";

    static DEFAULT_OPTIONS = {
        id: "augur-nexus-player-visibility-info",
        classes: ["augur-nexus", "player-visibility-info"],
        tag: "div",
        window: {
            title: "Player Visibility",
            resizable: false,
            minimizable: false
        },
        position: {
            width: 460,
            height: "auto"
        }
    };

    static PARTS = {
        main: {
            template: "modules/augur-nexus/templates/nexus/player-visibility-info.hbs"
        }
    };

    static show(topic = "visibility") {
        const app = new this({ topic });
        app.render(true, { focus: true });
        return app;
    }

    constructor({ topic = "visibility" } = {}, options = {}) {
        super(options);
        this.#topic = INFO_CONTENT[topic] ? topic : "visibility";
    }

    _prepareContext() {
        return INFO_CONTENT[this.#topic];
    }
}
