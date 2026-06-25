export default class SaveableDraggable extends Draggable {

    _onDragMouseUp(event) {

        if (game.yendorsSceneActors.scene && this.app.FLAG_POSITION) {
            game.yendorsSceneActors.scene.setFlag('yendors-scene-actors', this.app.FLAG_POSITION, {left: this.app.position.left, top: this.app.position.top});
        }

        super._onDragMouseUp(event);
    }

}