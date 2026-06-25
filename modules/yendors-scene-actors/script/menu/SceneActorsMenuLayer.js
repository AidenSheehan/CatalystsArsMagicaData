import {MODULE_ID} from "../SceneActors.js";

export default class SceneActorsMenuLayer extends InteractionLayer {

    constructor() {
        super();

        Hooks.on('getSceneControlButtons', controls => {

            const tokenControls = controls.tokens;

            if (game.user.isGM) {
                    tokenControls.tools.toggleSceneActors = {
                    name: "toggleSceneActors",
                    title: game.i18n.localize("Menu.enableSceneActorsOnScene"),
                    icon: "far fa-street-view",
                    toggle: true,
                    button: false,
                    active: !!game.scenes.active?.getFlag(MODULE_ID, 'show'),
                    onChange: () => game.yendorsSceneActors.toggleSceneActors()
                };
            } else {
                tokenControls.tools.toggleSceneActorsTemp = {
                    name: "toggleSceneActorsTemp",
                    title: game.i18n.localize("Menu.hideSceneActorsOnScene"),
                    icon: "far fa-street-view",
                    visible: !!game.scenes.active?.getFlag(MODULE_ID, 'show'),
                    active: !game.yendorsSceneActors.hideActorsTemp ?? false,
                    toggle: true,
                    button: false,
                    onChange: () => game.yendorsSceneActors.toggleActorsTemp()
                };
            }
        });

    }

    selectObjects(optns) {
        canvas.tokens.selectObjects(optns)
    }
}