import ModuleSettings, {SETTINGS} from "./menu/ModuleSettings.js";
import SceneActorsSelector from "./apps/SceneActorsSelector.js";
import SceneActorsLayer from "./apps/SceneActorsLayer.js";
import SceneActorsMenuLayer from "./menu/SceneActorsMenuLayer.js";
import BattleActors from "./battle_actors/BattleActors.js";
import ModuleDocumentation from "./documentation/ModuleDocumentation.js";

export const MODULE_ID = 'yendors-scene-actors';

export const FLAG = {
	ACTORS: 'sceneActors',
	ITEMS: 'sceneItems',
	COMBATANTS: 'sceneCombatants',
	COMBAT_STATE: 'combatState',
	PLAYER_CHARACTERS: 'playerCharacters',
	ITEM_FOCUS_ID: 'actorFocusId',
	ACTOR_IS_NAME_REVEALED: 'isNameRevealed',
	IS_DISABLED: 'isDisabled',
	SHOW_TOOLBAR: 'showToolbar',
	SHOW_ACTORS_TO_GM: 'showActorsToGM',
	SHOW_ACTORS_TO_PLAYERS: 'showActorsToPlayers',
	CANVAS_SCALE: 'canvasScale',
	SHOW_PC: 'showPC',
	SHOW_NPC: 'showNPC',
	IS_BATTLEMAP: 'isBattlemap',
	IS_BATTLEMAP_ORIENTATION: 'isBattlemapOrientation',
	BATTLEMAP_ID: 'battlemapId',
}

export const SCENE_ITEM_TYPE = {
	ACTOR: 'actor',
	ITEM: 'item'
}

export default class SceneActors {

	static actorDefault = {
		showOnScene: false,
		rotateOnScene: false,
		fullAvatar: false,
		isNameRevealed: false,
		sceneItemType: SCENE_ITEM_TYPE.ACTOR
	}

	static itemDefault = {
		showOnScene: false,
		rotateOnScene: false,
		fullAvatar: false,
		amount: 1,
		sceneItemType: SCENE_ITEM_TYPE.ITEM,
		isLocked: true
	}

	static FORCE_DEV = false;

	MODULE_ID = 'yendors-scene-actors';
	FLAG_IS_DISABLED = 'isDisabled';
	FLAG_SHOW_TOOLBAR = 'showToolbar'
	FLAG_SHOW_ACTORS_TO_GM = 'showActorsToGM';
	FLAG_SHOW_ACTORS_TO_PLAYERS = 'showActorsToPlayers';
	FLAG_CANVAS_SCALE = 'canvasScale';

	scene = null;
	actors = {};
	items = {};
	itemsDetail = [];
	playerCharacters = {};
	actorsDetail = [];
	playerCharactersDetail = [];
	shownItems = [];
	itemFocusId = null;
	show = false;
	sceneActorsSelectorApp = null;
	sceneActorsLayerApp = null;
	battleActorsLayerApp = null;
	isDisabled = false;
	showToolbar = false;
	showPC = true;
	showNPC = true;
	showActorsToGM = true;
	showActorsToPlayers = true;
	hideActorsTemp = false;
	canvasScale = 1;
	battleActors = null;
	isBattleActorsEnabled = false;
	isBattlemap = false;
	isBattleTotM = false;
	battlemapId = '';
	isBattleActorsSelector = false;
	storedCombatants = {};
	combatants = [];
	initCanvasWasReady = false;

	constructor() {

		loadTemplates([
			"modules/yendors-scene-actors/templates/module_info_de.html",
			"modules/yendors-scene-actors/templates/module_info_en.html",
			"modules/yendors-scene-actors/templates/parts/actor_item.html",
			"modules/yendors-scene-actors/templates/parts/item_item.html",
			"modules/yendors-scene-actors/templates/parts/actor_avatar.html",
			"modules/yendors-scene-actors/templates/parts/scene_settings.html",
			"modules/yendors-scene-actors/templates/parts/combatant_item.html",
			"modules/yendors-scene-actors/templates/parts/combatant_avatar.html",
			"modules/yendors-scene-actors/templates/parts/combat_actions.html",
			"modules/yendors-scene-actors/templates/parts/encounter_avatar.html",
			"modules/yendors-scene-actors/templates/parts/actor_health_bar.html",
		]);

		Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
			return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
		});
		CONFIG.Canvas.layers.sceneActorsMenu = {layerClass: SceneActorsMenuLayer, group: "interface"}
		this.sceneActorsSelectorApp = new SceneActorsSelector()
		this.sceneActorsLayerApp = new SceneActorsLayer();
		if (ModuleSettings.isSystemDSA()) {
			this.isBattleActorsEnabled = game.settings.get(MODULE_ID, SETTINGS.ENABLE_BATTLE_ACTORS);
		}
		if (this.isBattleActorsEnabled) {
			this.battleActors = new BattleActors();
		}
		game.yendorsSceneActors = this;

		this.initHooks();
	}

	async initItems() {
		if (this.isBattleActorsSelector || !this.scene) {
			return;
		}

		this.actors = this.scene?.getFlag(MODULE_ID, FLAG.ACTORS) ?? {};
		this.items = this.scene?.getFlag(MODULE_ID, FLAG.ITEMS) ?? {};
		this.playerCharacters = await game.settings.get(this.MODULE_ID, FLAG.PLAYER_CHARACTERS) ?? {};
		this.itemFocusId = await this.scene.getFlag(this.MODULE_ID, FLAG.ITEM_FOCUS_ID) ?? null;
		this.actorsDetail = [];
		this.playerCharactersDetail = [];
		this.itemsDetail = [];
		this.shownItems = [];
		const flagActors = this.actors;
		const flagPlayerCharacters = this.playerCharacters;


		const isRotateEnabled = game.settings.get(MODULE_ID, SETTINGS.ENABLE_ROTATE_ACTORS);

		// NSCs etc
		Object.keys(flagActors).forEach((actorId) => {
			const actor = game.actors.get(actorId);

			if (actor) {
				actor.showOnScene = flagActors[actorId].showOnScene ?? false;
				actor.rotateOnScene = false;
				actor.fullAvatar = flagActors[actorId].fullAvatar ?? false;
				actor.isNameRevealed = actor.getFlag(MODULE_ID, FLAG.ACTOR_IS_NAME_REVEALED) ?? false;
				actor.showName = game.user.isGM || actor.isNameRevealed;
				actor.sceneItemType = SCENE_ITEM_TYPE.ACTOR;
				actor.showTarget = true;
				actor.isTarget = false;

				if (isRotateEnabled) {
					actor.rotateOnScene = flagActors[actorId].rotateOnScene;
				}
				actor.isOnFocus = (actorId === game.yendorsSceneActors.itemFocusId);
				this.actorsDetail.push(actor);

				if (actor.showOnScene) {
					this.shownItems.push(actor)
				}
			}
		});

		// Spieler-Chars
		Object.keys(flagPlayerCharacters).forEach((actorId) => {
			const playerCharacter = game.actors.get(actorId);

			if (playerCharacter) {
				let properties = SceneActors.actorDefault;
				// Gibt es für die aktuelle Szene schon Einstellungen für den Charakter, werden sie übernommen
				if (flagPlayerCharacters[actorId].hasOwnProperty(this.scene.id)) {
					properties = flagPlayerCharacters[actorId][this.scene.id];
				}

				playerCharacter.isNameRevealed = playerCharacter.getFlag(MODULE_ID, FLAG.ACTOR_IS_NAME_REVEALED) ?? false;
				playerCharacter.showName = game.user.isGM || playerCharacter.isNameRevealed;
				playerCharacter.isOnFocus = (actorId === game.yendorsSceneActors.itemFocusId);
				playerCharacter.showOnScene = properties.showOnScene;
				playerCharacter.rotateOnScene = false;
				playerCharacter.fullAvatar = flagPlayerCharacters[actorId].fullAvatar ?? false;
				playerCharacter.sceneItemType = SCENE_ITEM_TYPE.ACTOR;
				playerCharacter.showTarget = game.user.character?.actorId !== actorId;
				playerCharacter.isTarget = false;
				if (isRotateEnabled) {
					playerCharacter.rotateOnScene = properties.rotateOnScene;
				}
				this.playerCharactersDetail.push(playerCharacter);

				if (properties.showOnScene) {
					this.shownItems.push(playerCharacter)
				}
			}
		});

		Object.entries(this.items).forEach(itemFlag => {

			const [itemId, itemData] = itemFlag;

			let item = game.items.get(itemId);

			if (item) {
				Object.entries(itemData).forEach(entry => {
					const [key, value] = entry;
					item[key] = value;
				})
				this.itemsDetail.push(item);
				if (item.showOnScene) {
					this.shownItems.push(item)
				}
				item.isOnFocus = (item.id === game.yendorsSceneActors.itemFocusId);
			}
		});

		// Targets kennzeichnen
		game.user.targets.forEach(target => {
			const actor = game.actors.get(target.document.actorId);
			if (actor) {
				actor.isTarget = true;
			}
		})

		if (canvas.ready) {
			await this.initSceneTargetTokens();
			this.initCanvasWasReady = true;
		}

		this.itemsDetail.sort(SceneActors.dynamicSort('name'));
		this.shownItems.sort(SceneActors.dynamicSort('name'));
	}

	async initSettings() {
		if (this.scene) {
			this.show = this.scene.getFlag(this.MODULE_ID, 'show') ?? false;
			this.showToolbar = this.scene.getFlag(this.MODULE_ID, this.FLAG_SHOW_TOOLBAR) ?? false;
			this.showActorsToGM = await this.scene.getFlag(this.MODULE_ID, this.FLAG_SHOW_ACTORS_TO_GM) ?? true;
			this.showActorsToPlayers = await this.scene.getFlag(this.MODULE_ID, this.FLAG_SHOW_ACTORS_TO_PLAYERS) ?? true;
			this.canvasScale = await this.scene.getFlag(this.MODULE_ID, this.FLAG_CANVAS_SCALE) ?? 1;
			this.showPC = await this.scene.getFlag(this.MODULE_ID, FLAG.SHOW_PC) ?? true;
			this.showNPC = await this.scene.getFlag(this.MODULE_ID, FLAG.SHOW_NPC) ?? true;
		}
	}

	initBattleActors() {

		if (this.isBattleActorsEnabled) {
			this.battleActors.init();
		}
	}

	async update(updateOptions = {}) {

		const defaultOptions = {
			/**
			 * Soll das Update auch auf Clients ausgeführt werden?
			 */
			emitClients: true,
			/**
			 * Sollen ausgeblendete CanvasLayer wieder eingeblendet werden?
			 */
			forceShowCanvas: false,
			/**
			 * Sollen alle Akteure neu initialisiert werden?
			 */
			initActors: true,
			/**
			 * Soll nur das UI updated werden?
			 */
			updateOnlyUI: false,

		}

		const options = {
			...defaultOptions,
			...updateOptions
		}

		console.log('Yendor\'s Scene Actors: UPDATE');
		if (!this.scene) {
			return;
		}

		if (!options.updateOnlyUI) {
			await this.initSettings();
			await this.initItems();
			this.initBattleActors();
		}

		this.updateApps(true);

		if (options.emitClients) {
			await SceneActors.emitSocket('update', {sceneId: this.scene.id, forceShowCanvas: options.forceShowCanvas})
		}

		if (ui.controls.control.name === "token") {
			if (game.user.isGM) {
				ui.controls.control.tools.find(tool => tool.name === "toggleSceneActors").active = this.show;
			} else {
				ui.controls.control.tools.find(tool => tool.name === "toggleSceneActorsTemp").visible = this.show;
				ui.controls.control.tools.find(tool => tool.name === "toggleSceneActorsTemp").active = !this.hideActorsTemp;
			}
			ui.controls.render();
		}
	}

	async toggleProperty(property) {
		this[property] = !this[property];
		await this.scene.setFlag(this.MODULE_ID, property, game.yendorsSceneActors[property]);

		let emit = false;
		let forceShowCanvas = false;

		if (property === this.FLAG_SHOW_ACTORS_TO_PLAYERS) {
			emit = true;
			forceShowCanvas = true;
		}

		SceneActors.devLog('update by func toggleProperty')
		await this.update({emitClients: emit, forceShowCanvas: forceShowCanvas});
	}

	async increaseCanvasScale() {
		if (this.canvasScale < 1.2) {
			const value = Math.round((this.canvasScale + 0.1) * 100) / 100;
			await this.scene.setFlag(this.MODULE_ID, this.FLAG_CANVAS_SCALE, value);
			SceneActors.devLog('update by func increaseCanvasScale')
			await this.update();
		}
	}

	async decreaseCanvasScale() {
		if (this.canvasScale > 0.5) {
			const value = Math.round((this.canvasScale - 0.1) * 100) / 100;
			await this.scene.setFlag(this.MODULE_ID, this.FLAG_CANVAS_SCALE, value);
			SceneActors.devLog('update by func decreaseCanvasScale')
			await this.update();
		}
	}

	async hotKeyToggleView() {
		if (game.user.isGM) {
			await this.toggleProperty('showActorsToGM')
		} else {
			this.toggleActorsTemp();
		}
	}

	updateApps(force) {
		SceneActors.devLog('updateApps', this)
		if (this.isDisabled) {
			return;
		}

		if (!this.show) {
			this.sceneActorsSelectorApp.close();
			this.sceneActorsLayerApp.close();
			return;
		}

		// Spielleiter
		if (game.user.isGM) {

			// Selector anzeigen
			this.sceneActorsSelectorApp.render(force);

			// Layer anzeigen / ausblenden
			if (this.showActorsToGM && !this.isBattleActorsSelector) {
				this.sceneActorsLayerApp.render(force);
			} else {
				this.sceneActorsLayerApp.close();
			}
			return;
		}

		// Spieler
		if (this.isBattleTotM) {
			this.battleActorsLayerApp?.render(force);
			this.sceneActorsLayerApp.close();
		} else if (this.showActorsToPlayers && !this.hideActorsTemp) {
			this.sceneActorsLayerApp.render(force);
			this.battleActorsLayerApp?.close();
		} else {
			this.sceneActorsLayerApp.close();
			this.battleActorsLayerApp?.close();
		}
	}

	async updateItem(itemId, properties = {}, update = true) {

		let actorData = SceneActors.actorDefault;
		let forceShowClients = properties?.showOnScene ?? false;

		const actor = game.actors.get(itemId);
		const item = game.items.get(itemId);

		if (properties.hasOwnProperty('showOnScene') && !properties.showOnScene) {
			await game.yendorsSceneActors.checkFocusIdWhileRemovingActor(itemId);
		}

		if (actor) {
			if (this.isActorPlayerCharacter(itemId)) {

				if (game.yendorsSceneActors.playerCharacters[itemId].hasOwnProperty(this.scene.id)) {
					actorData = game.yendorsSceneActors.playerCharacters[itemId][this.scene.id];
				}

				const updatedActor = {
					...actorData,
					...properties
				}

				// Die property fullAvatar ist für SCs für alle Szenen gültig und wird speziell behandelt
				if (properties.hasOwnProperty('fullAvatar')) {
					game.yendorsSceneActors.playerCharacters[itemId].fullAvatar = properties.fullAvatar;
					// das wird in der Szenen-Einstellung nicht benötigt.
					delete updatedActor.fullAvatar;
				}

				game.yendorsSceneActors.playerCharacters[itemId][this.scene.id] = updatedActor;

				if (JSON.stringify(SceneActors.actorDefault) === JSON.stringify(game.yendorsSceneActors.playerCharacters[itemId][this.scene.id])) {
					delete game.yendorsSceneActors.playerCharacters[itemId][this.scene.id];
				}

				await game.settings.set(this.MODULE_ID, FLAG.PLAYER_CHARACTERS, game.yendorsSceneActors.playerCharacters);
			} else {

				game.yendorsSceneActors.actors[itemId] = {
					...game.yendorsSceneActors.actors[itemId],
					...properties
				}

				await game.yendorsSceneActors.scene.setFlag(MODULE_ID, FLAG.ACTORS, game.yendorsSceneActors.actors);
			}
		}

		if (item) {

			game.yendorsSceneActors.items[itemId] = {
				...game.yendorsSceneActors.items[itemId],
				...properties
			}
			// Wenn ein Item angezeigt werden soll, sollte es auch mindestens 1x verfügbar sein
			if (properties.hasOwnProperty('showOnScene') && game.yendorsSceneActors.items[itemId].amount < 1) {
				game.yendorsSceneActors.items[itemId].amount = 1;
			}
			await game.yendorsSceneActors.scene.setFlag(MODULE_ID, FLAG.ITEMS, game.yendorsSceneActors.items);
		}


		if (update) {
			SceneActors.devLog('update by func updateActor')
			await this.update({forceShowClients: forceShowClients})
		}
	}

	toggleFullAvatar(itemId) {
		const actor = this.getActorDetail(itemId);
		const item = game.items.get(itemId);
		if (actor) {
			this.updateItem(itemId, {fullAvatar: !actor.fullAvatar}, true);
		}
		if (item) {
			this.updateItem(itemId, {fullAvatar: !item.fullAvatar}, true);
		}
	}

	async toggleSceneActors() {
		this.show = !this.show;
		await this.scene.setFlag('yendors-scene-actors', 'show', this.show);

		SceneActors.devLog('update by func toggleSceneActors')
		await this.update({forceShowCanvas: true});
	}

	async toggleActorFocus(id) {

		const isRemoving = this.itemFocusId === id;

		if (isRemoving) {
			this.itemFocusId = null;
			await this.scene.unsetFlag(this.MODULE_ID, FLAG.ITEM_FOCUS_ID);
		} else {

			const item = game.items.get(id);
			const actor = game.actors.get(id);

			if (actor) {
				if (this.isActorPlayerCharacter(id)) {
					if (!this.playerCharacters[id][this.scene.id]?.showOnScene) {
						await this.updateItem(id, {showOnScene: true}, false)
					}
				} else {
					if (!this.actors[id].showOnScene) {
						await this.updateItem(id, {showOnScene: true}, false)
					}
				}
			}
			if (item && !item.showOnScene) {
				await this.updateItem(id, {showOnScene: true}, false);
			}

			this.itemFocusId = id;
			await this.scene.setFlag(this.MODULE_ID, FLAG.ITEM_FOCUS_ID, id);
		}

		SceneActors.devLog('update by func toggleActorFocus')
		await this.update({forceShowCanvas: !isRemoving});
	}

	/**
	 * Mit dieser Funktion kann ein Spieler temporär die Akteure ausblenden
	 * Ändert der GM etwas an den Szenen-Akteuren, werden sie automatisch wieder eingeblendet
	 */
	toggleActorsTemp() {
		this.hideActorsTemp = !this.hideActorsTemp;
		this.updateApps(true);

		if (ui.controls.control.name === "token") {
			ui.controls.control.tools.find(tool => tool.name === "toggleSceneActorsTemp").active = !this.hideActorsTemp;
			ui.controls.render();
		}
	}

	async toggleItemLock(id) {
		if (game.user.isGM) {
			if (game.yendorsSceneActors.items.hasOwnProperty(id)) {
				game.yendorsSceneActors.items[id].isLocked = !game.yendorsSceneActors.items[id].isLocked;

				const item = game.items.get(id);
				const ownership = item.ownership;

				if (game.yendorsSceneActors.items[id].isLocked && ownership.default === 1) {
					ownership.default = 0;
					await item.update({ownership: ownership}, {diff: false, recursive: false, noHook: true});
				} else if (item.ownership.default < 1) {
					ownership.default = 1;
					await item.update({ownership: ownership}, {diff: false, recursive: false, noHook: true});
				}

				await game.yendorsSceneActors.scene.setFlag(MODULE_ID, FLAG.ITEMS, game.yendorsSceneActors.items);
				void this.update();
			}
		}
	}

	static clickHandlerItemAmount(event, itemId) {
		let amountDelta = 0;

		event.preventDefault();
		event.stopImmediatePropagation();

		if (!game.user.isGM) {
			return;
		}
		amountDelta = 1;
		if (event.ctrlKey) {
			amountDelta = 10;
		}
		if (event.button === 2) {
			amountDelta = -amountDelta;
		}
		game.yendorsSceneActors.changeItemAmount(itemId, amountDelta);
	}

	async changeItemAmount(itemId, amountDelta) {
		if (game.user.isGM) {
			if (game.yendorsSceneActors.items.hasOwnProperty(itemId)) {
				let newAmount = game.yendorsSceneActors.items[itemId].amount + amountDelta;
				if (newAmount < 0) {
					newAmount = 0;
				}
				if (newAmount === 0) {
					await this.updateItem(itemId, {showOnScene: false}, false)
				}
				game.yendorsSceneActors.items[itemId].amount = newAmount;
				await game.yendorsSceneActors.scene.setFlag(MODULE_ID, FLAG.ITEMS, game.yendorsSceneActors.items);
				void this.update();
			}
		}
	}

	async removeItem(itemId) {

		const isCharacter = this.playerCharacters.hasOwnProperty(itemId)
		const isActor = this.actors.hasOwnProperty(itemId)
		const isItem = this.items.hasOwnProperty(itemId)

		if (!isCharacter && !isActor && !isItem) {
			return;
		}

		// Spieler-Charakter
		if (isCharacter) {
			delete this.playerCharacters[itemId];
			await game.settings.set(this.MODULE_ID, FLAG.PLAYER_CHARACTERS, this.playerCharacters);
		}
		// NSC oder Kreatur
		if (isActor) {
			delete this.actors[itemId];
			const deleteKey = FLAG.ACTORS + '.' + itemId
			await this.scene.unsetFlag(this.MODULE_ID, deleteKey);
		}
		if (isItem) {
			delete this.items[itemId];
			const deleteKey = FLAG.ITEMS + '.' + itemId
			await this.scene.unsetFlag(this.MODULE_ID, deleteKey);
		}

		await this.checkFocusIdWhileRemovingActor(itemId);

		SceneActors.devLog('update by func removeActor')
		await this.update()
	}

	async checkFocusIdWhileRemovingActor(itemId) {
		if (itemId === game.yendorsSceneActors.itemFocusId) {
			game.yendorsSceneActors.itemFocusId = null;
			await game.yendorsSceneActors.scene.unsetFlag(this.MODULE_ID, FLAG.ITEM_FOCUS_ID);
		}
	}

	isActorPlayerCharacter(actorId) {
		return this.playerCharacters.hasOwnProperty(actorId);
	}

	getActorDetail(actorId) {
		let actor = this.actorsDetail.find(actor => actor.id === actorId) ?? null;
		if (!actor) {
			actor = this.playerCharactersDetail.find(actor => actor.id === actorId) ?? null;
		}

		return actor;
	}

	async toggleShowName(actorId) {
		const actor = game.actors.get(actorId);
		if (actor) {
			const currentState = actor.isNameRevealed ?? false;
			await actor.setFlag(MODULE_ID, FLAG.ACTOR_IS_NAME_REVEALED, !currentState);
			void this.update();
		}
	}

	static hiddenTargetTokenSpecs = {
		alpha: 0,
		hidden: true,
		border: 0,
		displayName: 0,
		displayBars: 0,
		width: 0.5,
		height: 0.5,
		'flags.yendors-scene-actors': {isSceneTarget: true},
	}

	async createTargetToken(actor) {
		if (!SceneActors.isResponsibleGM()) {
			return;
		}

		// Mal sehen, ob es schon einen Token für den Akteur gibt
		let tokenDocument = this.scene.tokens.find(token => token.actorId === actor.id);

		// Kein Token, dann erstellen
		if (!tokenDocument) {
			const tokenDoc = await actor.getTokenDocument({
				...SceneActors.hiddenTargetTokenSpecs,
				x: canvas?.scene?.width/2,
				y: canvas?.scene?.height/2,
			});

			// Den eigentlichen Token erstellen
			if (tokenDoc && canvas.grid?.grid) {
				const documents = await canvas.scene.createEmbeddedDocuments('Token', [tokenDoc]).catch((e) => {
					console.error(e);
				});
			}
		}

	}

	async deleteTempToken(token) {

		// Targets der User müssen entsprechend entfernt werden
		const target = game.user.targets.find(target => target.id === token.id);
		game.user.targets.delete(target);

		if (SceneActors.isResponsibleGM()) {
			if (token && token.getFlag(MODULE_ID, 'isSceneTarget')) {
				await canvas.scene.deleteEmbeddedDocuments('Token', [token.id])
			}
		}



	}

	async deleteAllTempToken() {
		if (!SceneActors.isResponsibleGM()) {
			return;
		}
		game.yendorsSceneActors.scene.tokens.forEach(token => {
			if (token.getFlag(MODULE_ID, 'isTempToken')) {
				canvas.scene.deleteEmbeddedDocuments('Token', [token.id])
			}
		});
	}

	async deleteAllSceneTargetTokens(scene = null) {
		if (!SceneActors.isResponsibleGM()) {
			return;
		}
		if (!scene) {
			scene = game.yendorsSceneActors.scene;
		}
		scene.tokens.forEach(token => {
			if (token.flags[MODULE_ID]?.isSceneTarget) {
				scene.deleteEmbeddedDocuments('Token', [token.id])
			}
		});
	}

	async initSceneTargetTokens() {
		if (!SceneActors.isResponsibleGM() || game.yendorsSceneActors.isDisabled) {
			return;
		}

		// Spieler: In DSA aus dem meister-Menü
		if (ModuleSettings.isSystemDSA()) {
			const trackedPlayerCharacters = await game.dsa5.apps.gameMasterMenu.getTrackedHeros();
			for (const actor of trackedPlayerCharacters) {
				await this.createTargetToken(actor);
			}
		}

		for (const user of game.users) {
			if (user.character) {
				await this.createTargetToken(user.character);
			}
		}

		for (const actor of this.actorsDetail) {
			await this.createTargetToken(actor);
		}

		for (const actor of this.playerCharactersDetail) {
			await this.createTargetToken(actor);
		}
	}

	async doSocket(data) {
		SceneActors.devLog("Yendor's Scene Actors: Socket Update", data);
		if (data.type === 'update') {
			// temporäres Ausblenden beenden
			if (data.payload.forceShowCanvas) {
				this.hideActorsTemp = false;
			}

			let updateSceneId = this.scene.id;
			if (this.isBattleTotM) {
				updateSceneId = this.battlemapId;
			}

			if (data.payload.sceneId === updateSceneId || data.payload.sceneId === this.battlemapId) {
				SceneActors.devLog('update by func doSocket->update')
				await this.update({emitClients: false});
			}
		}
		if (data.type === 'updateBattleActors') {
			if (SceneActors.isResponsibleGM()) {
				await game.scenes.get(data.payload.sceneId)?.setFlag(MODULE_ID, FLAG.COMBAT_STATE, data.payload.combatState);
				SceneActors.devLog('update by func doSocket->updateBattleActors')
				void this.update();
			}
		}
		if (data.type === 'nextCombatTurn') {
			if (SceneActors.isResponsibleGM()) {
				const combatId = data.payload.combatId;
				const combat = game.combats.find(combat => combat.id === combatId)
				if (combat) {
					combat.nextTurn();
					Hooks.call('combatTurn');
				}
			}
		}
		if (data.type === 'beamToBattlemap') {
			if (SceneActors.isResponsibleGM()) {
				await game.socket.emit("pullToScene", data.payload.battlemapId, data.payload.userId, () => {
				})
				setTimeout(() => {
					game.socket.emit("pullToScene", data.payload.sceneId, data.payload.userId)
				}, 8000)
			}
		}
		if (data.type === 'addItem') {
			if (SceneActors.isResponsibleGM()) {

				const actor = game.actors.get(data.payload.actorId);
				const item = game.items.get(data.payload.itemId)
				if (!actor || !item) {
					return;
				}

				let amount = data.payload.amount;
				if (item.amount < amount) {
					amount = item.amount;
				}

				if (amount < 1) {
					return;
				}

				await this.changeItemAmount(item.id, -amount)

				if (ModuleSettings.isSystemDSA()) {

					let actorItem = actor.items.find(i => game.dsa5.entities.Itemdsa5.areEquals(item, i));
					let updateAmount = amount;

					// Der Actor hat schon so ein Item, wir müssen nur die Anzahl erhöhen
					if (actorItem) {
						const currentAmount = getProperty(actorItem, "system.quantity.value");
						updateAmount = currentAmount + amount;

					} else {
						actorItem = await actor.sheet._addLoot(item);
					}

					actorItem = actorItem.toObject();

					setProperty(actorItem, "system.quantity.value", updateAmount)
					actor.updateEmbeddedDocuments("Item", [actorItem]);
				} else {
					actor.createEmbeddedDocuments('Item', [item.toObject()])
				}
			}
		}
	}

	static emitSocket(type, payload) {
		game.socket.emit('module.yendors-scene-actors', {
			type: type,
			payload: payload
		});
	}

	static dynamicSort(property) {
		var sortOrder = 1;
		if (property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}
		return function (a, b) {
			/* next line works with strings and numbers,
			 * and you may want to customize it to your needs
			 */
			var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
			return result * sortOrder;
		}
	}

	static updateSceneTargetTokens() {

		if (!SceneActors.isResponsibleGM()) return;

		canvas.tokens.getDocuments().forEach(token => {
			const isSceneTarget = token.getFlag(MODULE_ID, 'isSceneTarget');
			const sceneTargetVersion = token.getFlag(MODULE_ID, 'sceneTargetVersion') ?? 1;

			// SceneTargets wurden optimiert und brauchen ein Update
			if (isSceneTarget && sceneTargetVersion < 3) {
				token.update({
					...SceneActors.hiddenTargetTokenSpecs,
					x: canvas?.scene?.width/2,
					y: canvas?.scene?.height/2,
					'flags.yendors-scene-actors.sceneTargetVersion': 3,
				})
			}
		})
	}

	static devLog(label, value) {
		if (game.world.id === 'dsa5-dev' || SceneActors.FORCE_DEV) {
			console.log('DEV Log | ' + label, value);
			if (value !== 'devUndefined') {
			} else {
				// console.log('DEV Log |', label);
			}
		}
	}

	static isResponsibleGM() {
		if (!game.user.isGM) {
			return false;
		}

		const activeGMs = game.users.filter(user => user.isGM && user.active);
		// Gibt es mehr als einen?
		if (activeGMs.length > 1) {
			const isResponsibleGM = game.users.filter(user => user.isGM && user.active).some(other => other.id < game.user.id);

			return isResponsibleGM;
		}

		return true;
	}

	cleanupAdventure(adventure) {
		adventure.scenes.forEach(scene => {
			const tokens = [];
			scene.tokens.forEach((token) => {
				if (token.flags[MODULE_ID]?.isSceneTarget && !Array.isArray(scene.tokens)) {
					// In Collections werden sceneTarget-Tokens entfernt
					scene.tokens.delete(token.id);
				}
				else if (!token.flags[MODULE_ID]?.isSceneTarget && Array.isArray(scene.tokens)) {
					// Arrays bekommen die Tokens, die lein sceneTarget sind, hinzugefügt
					// technisch einfacher für Arrays (bzgl. Index-Verschiebung)
					tokens.push(token);
				}
			})
			if (Array.isArray(scene.tokens)) {
				scene.tokens = tokens;
			}
		})
	}

	initHooks() {
		Hooks.once('ready', async () => {
			// Settings vom User übernehmen
			const clientIsDisabled = await game.settings.get(this.MODULE_ID, this.FLAG_IS_DISABLED);
			this.isDisabled = await game.user.getFlag(this.MODULE_ID, this.FLAG_IS_DISABLED) ?? false;
			if (clientIsDisabled !== this.isDisabled) {
				game.settings.set(this.MODULE_ID, this.FLAG_IS_DISABLED, this.isDisabled);
			}

			void ModuleDocumentation.showNewChangelog(false);

			if (!this.isDisabled) {
				game.socket.on('module.yendors-scene-actors', (data) => {
					this.doSocket(data);
				})
			}
		});

		Hooks.on("canvasInit", async (canvas) => {
			this.initCanvasWasReady = false;
			this.scene = game.scenes.get(canvas.scene.id);
			await this.initSettings();

			// toDo: Irgendwann ausbauen!
			await this.deleteAllTempToken();

			SceneActors.updateSceneTargetTokens();

			if (!this.show) return;

			await this.initItems();
			await this.initBattleActors();
		});

		Hooks.on("canvasReady", async () => {

			if (!this.show) return;

			// War das Canvas beim initialisieren noch nicht bereit, müssen wir jetzt noch mal ...
			if (!this.initCanvasWasReady) {
				await this.initSceneTargetTokens();
			}
		});

		Hooks.on('renderSceneActorsSelector', (app, html) => {

			if (!this.show) return;

			$(app.element[0]).toggleClass('battle_actors_selector', game.yendorsSceneActors?.isBattleActorsSelector)
		})


		Hooks.on('renderCameraViews', () => {

			if (!this.show) return;

			SceneActors.devLog('update by hook renderCameraViews')
			this.update({emitClients: false});
		})

		Hooks.on('updateActor', async (actor, change) => {

			if (!this.show) return;

			setTimeout(() => {
				this.updateApps(true);
			}, 200)

			if (SceneActors.isResponsibleGM()) {
				if (change.system?.status?.hasOwnProperty('wounds') && change.system.status.wounds.value < 1) {
					const combatant = this.combatants.find(combatant => combatant.token.id === actor.token.id);
					if (!combatant.defeated) {
						void BattleActors.toggleCombatantDefeatedStatus(combatant);
					}
				}
			}
		});

		Hooks.on('deleteActor', async (document) => {

			if (!this.show) return;

			await this.removeItem(document.id);
		})
		Hooks.on('deleteItem', async (document) => {

			if (!this.show) return;

			await this.removeItem(document.id);
		})

		Hooks.on('collapseSidebar', async () => {

			if (!this.show) return;

			this.updateApps(true);
		});

		Hooks.on("canvasReady", async () => {
			this.updateApps(true);
		})

		Hooks.on('preCreateAdventure', (adventure) => {
			this.cleanupAdventure(adventure);
		})

		Hooks.on('preUpdateAdventure', (adventure, data) => {
			this.cleanupAdventure(adventure);
			this.cleanupAdventure(data);
		})

		Hooks.on('refreshToken', (token) => {
			if (!token.document.getFlag(MODULE_ID, 'isSceneTarget')) return;

			token.border.alpha = 0;
			token.effects.alpha = 0;
		})
	}
}