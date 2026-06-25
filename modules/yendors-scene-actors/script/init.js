import SceneActors from "./SceneActors.js";
import ModuleSettings from "./menu/ModuleSettings.js";

Hooks.once('init', async function () {
		console.log("Initializing Yendor's Scene Actors module")

		await ModuleSettings.init();
		new SceneActors();
	}
)

