import SaveableDraggable from "./SaveableDraggable.js";
import SceneActors, {FLAG, MODULE_ID} from "../SceneActors.js";
import CombatState from "../battle_actors/model/CombatState.js";
import BattleActors from "../battle_actors/BattleActors.js";

export default class SceneActorsSelector extends Application {

	FLAG_POSITION = 'selectorPosition'
	FLAG_ACTOR_FOCUS_ID = 'actorFocusId'
	MODULE_ID = 'yendors-scene-actors';
	FLAG_ACTORS = 'sceneActors';

	constructor(app) {
		super(app);
		this.showSettings = false;
		this.isMinimized = false;
	}

	activateListeners(html) {
		super.activateListeners(html)

		const container = html.find(".dragHandler");
		new SaveableDraggable(this, html, container[0], this.options.resizable);

		document.querySelectorAll('.item_remove').forEach((element) => {
			element.addEventListener('click', (event) => {
				const itemId = element.dataset.id;
				game.yendorsSceneActors.removeItem(itemId);
			})
		})

		document.querySelectorAll('.selector_avatar').forEach((element) => {
			if (game.yendorsSceneActors.isBattleActorsSelector) {
				element.addEventListener('mousedown', (event) => {
					if (event.button === 0) {
						const combatantId = element.dataset.combatantId;
						const combatant = game.yendorsSceneActors.combatants.find(combatant => combatant.id === combatantId);
						if (combatant) {
							combatant.token.actor.sheet.render(true)
						}
					}
				})
			} else {
				const itemId = element.dataset.id;
				element.addEventListener('mousedown', (event) => {
					if (event.button === 0) {
						this.toggleItemShowOnScene(itemId);
					}
					if (event.button === 2) {
						this.openItemSheet(itemId);
					}
				})
			}
		})

		document.querySelectorAll('.item_lock').forEach((element) => {
			if (game.user.isGM) {
				element.addEventListener('mousedown', (event) => {
					event.stopImmediatePropagation();
					if (event.button === 0) {
						const id = element.dataset.id;
						game.yendorsSceneActors.toggleItemLock(id);
					}
				})
			}
		})

		document.querySelectorAll('.item_sheet').forEach((element) => {
			element.addEventListener('click', (event) => {
				const itemId = element.dataset.id;
				this.openItemSheet(itemId);
			})
		})

		document.querySelectorAll('.item_show').forEach((element) => {
			element.addEventListener('click', (event) => {
				const actorId = element.dataset.id;
				this.toggleItemShowOnScene(actorId);
			})
			element.addEventListener('contextmenu', (event) => {
				const actorId = element.dataset.id;
				game.yendorsSceneActors.toggleFullAvatar(actorId);
			})
		})

		document.querySelectorAll('.item_focus').forEach((element) => {
			element.addEventListener('click', (event) => {
				const id = element.dataset.id;
				game.yendorsSceneActors.toggleActorFocus(id);
			})
		})

		document.querySelectorAll('.selector_settings').forEach((element) => {
			element.addEventListener('click', (event) => {
				this.showSettings = !this.showSettings;
				this.render();
			})
		})

		document.querySelectorAll('.selector_minimize').forEach((element) => {
			element.addEventListener('click', (event) => {
				this.toggleMinimize();
			})
		})

		document.querySelectorAll('.delete_scene_actors').forEach((element) => {
			element.addEventListener('click', (event) => {
				this.clearScene();
			})
		})

		document.querySelectorAll('.combatant_target').forEach((element) => {
			element.addEventListener('click', (event) => {
				const combatantId = element.dataset.combatant;
				game.yendorsSceneActors.battleActors.addEncounterByTarget(combatantId);
			})
		})

		document.querySelectorAll('.remove_encounter').forEach((element) => {
			element.addEventListener('click', (event) => {
				const combatantId = element.dataset.combatant;
				const encounterId = element.dataset.encounter;
				game.yendorsSceneActors.battleActors.removeEncounter(combatantId, encounterId);
			})
		})

		document.querySelectorAll('.toggle_property').forEach((element) => {
			element.addEventListener('click', (event) => {
				const property = element.dataset.property;
				this.toggleProperty(property)
			})
		})

		document.querySelectorAll('.increase_canvas_scale').forEach((element) => {
			element.addEventListener('click', (event) => {
				game.yendorsSceneActors.increaseCanvasScale()
			})
		})

		document.querySelectorAll('.decrease_canvas_scale').forEach((element) => {
			element.addEventListener('click', (event) => {
				game.yendorsSceneActors.decreaseCanvasScale()
			})
		})

		document.querySelectorAll('.item_amount').forEach((element) => {
			const itemId = element.dataset.id;
			element.addEventListener('mousedown', (event) => {
				SceneActors.clickHandlerItemAmount(event, itemId);
			})
		})

		html.find('.roll_initiative').click((ev) => {
			const combatantId = ev.currentTarget.dataset.combatantId;
			game.yendorsSceneActors.battleActors?.activeCombat?.rollInitiative([combatantId]);
		});

		$('html').on('change', '.is_battlemap', (event) => {
			event.stopImmediatePropagation();
			const isBattlemap = event.target.checked;
			void this.updateIsBattlemap(isBattlemap);
		})

		$('html').on('change', '.is_battlemap_orientation', (event) => {
			event.stopImmediatePropagation();
			const isBattlemapOrientation = event.target.checked;
			void this.updateIsBattlemapOrientation(isBattlemapOrientation);
		})

		document.querySelectorAll('.defeated_toggle').forEach((element) => {
			element.addEventListener('click', () => {
				const combatantId = element.dataset.combatantId;
				const combatant = game.yendorsSceneActors.combatants.find(combatant => combatant.id === combatantId);
				if (combatant) {
					void BattleActors.toggleCombatantDefeatedStatus(combatant);
				}
			})
		})

		$('html').on('change', '.select_battlemap', (event) => {
			void this.updateSettingsProperty(FLAG.BATTLEMAP_ID, event.currentTarget.value);
		})

		html.find('.actor_item').on({
			mouseenter: (event) => {
				const actorId = event.currentTarget.dataset.actorId;
				const actor = game.actors.get(actorId);

				if (actor) {
					const token = actor.token ?? actor.prototypeToken;

					if (!token) {
						return;
					}

					const img = document.createElement("img");
					img.src = token.texture.src;
					const pt = actor.prototypeToken;
					const w = pt.width * canvas.dimensions.size * Math.abs(pt.texture.scaleX) * canvas.stage.scale.x;
					const h = pt.height * canvas.dimensions.size * Math.abs(pt.texture.scaleY) * canvas.stage.scale.y;
					DragDrop.createDragImage(img, w, h);
				}
			}
		})

		html.find('.combatant_item').on({
			mouseenter: (event) => {
				BattleActors.getCombatTracker()?._onCombatantHoverIn(event);
			},
			mouseleave: (event) => {
				BattleActors.getCombatTracker()?._onCombatantHoverOut(event);
			}
		})

		document.querySelectorAll('.combat_action').forEach((element) => {
			element.addEventListener('click', (event) => {
				const action = element.dataset.action;

				switch (action) {
					case 'rollNpcInit':
						const npcList = [];
						game.yendorsSceneActors.combatants.forEach(combatant => {
							if (combatant.isNPC) {
								npcList.push(combatant.id)
							}
						})
						game.yendorsSceneActors.battleActors?.activeCombat?.rollInitiative(npcList);
						break;
					case 'startCombat':
						game.yendorsSceneActors.battleActors?.activeCombat?.startCombat();
						break;
					case 'previousTurn':
						BattleActors.previousTurn();
						break;
					case 'nextTurn':
						BattleActors.nextTurn();
						break;
					case 'stopCombat':
						game.yendorsSceneActors.battleActors?.activeCombat?.endCombat();
						break;
				}
			})
		})

		document.querySelectorAll('.toggle_name').forEach((element) => {
			element.addEventListener('click', () => {
				const actorId = element.dataset.actorId;
				game.yendorsSceneActors.toggleShowName(actorId);
			})
		})
	}

	async updateIsBattlemap(isBattlemap) {
		await game.yendorsSceneActors.scene.setFlag(this.MODULE_ID, FLAG.IS_BATTLEMAP, isBattlemap);
		SceneActors.devLog('update by func updateIsBattlemap')
		await game.yendorsSceneActors.update({forceShowCanvas: true});
	}

	async updateIsBattlemapOrientation(isBattlemapOrientation) {
		await game.yendorsSceneActors.scene.setFlag(this.MODULE_ID, FLAG.IS_BATTLEMAP_ORIENTATION, isBattlemapOrientation);
		SceneActors.devLog('update by func updateIsBattlemapOrientation')
		await game.yendorsSceneActors.update({forceShowCanvas: true});
	}

	async updateSettingsProperty(property, value) {
		if (Object.values(FLAG).includes(property)) {
			await game.yendorsSceneActors.scene.setFlag(MODULE_ID, property, value);
			SceneActors.devLog('update by func updateSettingsProperty')
			await game.yendorsSceneActors.update({forceShowCanvas: true});
		}
	}

	toggleItemShowOnScene(itemId) {
		const actor = game.yendorsSceneActors.getActorDetail(itemId);
		const item = game.items.get(itemId);

		if (actor) {
			void game.yendorsSceneActors.updateItem(itemId, {showOnScene: !actor.showOnScene});
		}
		if (item) {
			void game.yendorsSceneActors.updateItem(itemId, {showOnScene: !item.showOnScene});
		}
	}

	static get defaultOptions() {

		const options = super.defaultOptions;
		mergeObject(options, {
			width: 300,
			height: 0,
			scrollY: [".scroll_area"],
			title: "Yendor's Scene Actors",
			dragDrop: [{dragSelector: ".iniItem", dropSelector: [".actors_list"]}, {
				dragSelector: ".actor_item",
				dropSelector: null
			}],

		});
		options.classes = ["scene_actors_selector"];
		options.template = 'modules/yendors-scene-actors/templates/scene_actors_selector.html';
		options.resizable = false;

		return options;
	}

	toggleMinimize() {
		this.isMinimized = !this.isMinimized;
		this.render();
	}

	async _render(force = false, options = {}) {
		if (!game.user.isGM) {
			return;
		}

		const position = game.yendorsSceneActors.scene.getFlag(this.MODULE_ID, this.FLAG_POSITION) ?? {
			left: null,
			top: null
		};

		this.position.left = await position.left;
		this.position.top = await position.top;

		await super._render(force, options)
		delete ui.windows[this.appId];

		const $battle_list = this.element.find('.battle_list');
		if ($battle_list.length > 0) {
			const $activeItem = $battle_list.find('.combatant_item.active');
			const itemPosition = $activeItem.position().top;
			const scrollPosition = $battle_list.scrollTop();
			const itemHeight = $activeItem.outerHeight();
			const listHeight = $battle_list.outerHeight();
			// Ist das Item weiter oben?
			if (itemPosition < 0) {
				$battle_list.scrollTop(scrollPosition + itemPosition);
			}
			// Ist das Item weiter unten?
			else if (itemPosition- listHeight + itemHeight  > 0) {
				$battle_list.scrollTop(scrollPosition + itemPosition + itemHeight - listHeight);
			}
		}
	}

	async getData(options) {
		const data = await super.getData(options);

		const actors = game.yendorsSceneActors.actorsDetail;
		actors.sort(SceneActors.dynamicSort('name'));

		const playerCharacters = game.yendorsSceneActors.playerCharactersDetail;
		playerCharacters.sort(SceneActors.dynamicSort('name'));

		const items = game.yendorsSceneActors.itemsDetail;
		items.sort(SceneActors.dynamicSort('name'));

		const isBattleActorsSeelctor = game.yendorsSceneActors.isBattleActorsSelector;

		let title = 'SceneActors';
		if (game.yendorsSceneActors.isBattleActorsSelector) {
			title = 'BattleActors';
		}

		data.title = title;
		data.actors = actors;
		data.playerCharacters = playerCharacters;
		data.isNpcEmpty = actors.length === 0;
		data.isItemsEmpty = items.length === 0;
		data.noPlayerCharacters = playerCharacters.length === 0;
		data.items = items;
		data.showSettings = this.showSettings;
		data.showSceneList = !this.isMinimized && !isBattleActorsSeelctor;
		data.showBattleList = !this.isMinimized && isBattleActorsSeelctor;
		data.showToolbar = !this.isMinimized && game.yendorsSceneActors.showToolbar && !isBattleActorsSeelctor;
		data.itemFocusId = game.yendorsSceneActors.itemFocusId;
		data.showTooltips = game.settings.get(this.MODULE_ID, 'showTooltips');
		data.showActorsToGM = game.yendorsSceneActors.showActorsToGM;
		data.showActorsToPlayers = game.yendorsSceneActors.showActorsToPlayers;
		data.isMinCanvasScale = game.yendorsSceneActors.canvasScale === 0.5;
		data.isMaxCanvasScale = game.yendorsSceneActors.canvasScale === 1.2;
		data.showPC = game.yendorsSceneActors.showPC;
		data.showNPC = game.yendorsSceneActors.showNPC;
		data.disabledHint = !game.yendorsSceneActors.showPC && !game.yendorsSceneActors.showNPC;
		data.isBattleActorsEnabled = game.yendorsSceneActors.isBattleActorsEnabled;
		data.isBattleActorsSelector = isBattleActorsSeelctor;
		const scenes = new Scenes();
		game.scenes.forEach(scene => {
			scene.isSelected = game.yendorsSceneActors.battlemapId === scene.id;
			if (scene.id !== game.yendorsSceneActors.scene.id) {
				scenes.set(scene.id, scene);
			}
		})
		data.currentSceneId = game.yendorsSceneActors.scene.id;
		data.availableScenes = scenes;
		data.settings = {
			isBattlemap: game.yendorsSceneActors.isBattlemap,
			isBattlemapOrientation: game.yendorsSceneActors.scene.getFlag(MODULE_ID, FLAG.IS_BATTLEMAP_ORIENTATION),
			battlemapId: game.yendorsSceneActors.battlemapId,
			combatHasStarted: game.yendorsSceneActors.battleActors?.activeCombat?.turn !== null,
			unRolled: false,
			isFirstTurn: false,
			showHealthBar: true,
			turnIsFinished: false,
		}
		if (isBattleActorsSeelctor) {
			const activeCombat = game.yendorsSceneActors.battleActors?.activeCombat;
			data.combatants = game.yendorsSceneActors.combatants
			let unRolled = activeCombat?.turns.some(x => x.isOwner && x.initiative === null && (!game.user.isGM || activeCombat?.combatants.get(x.id).isNPC))
			data.settings.unRolled = unRolled;
			data.settings.isFirstTurn = activeCombat?.round === 1 && activeCombat?.turn === 0;
			data.settings.turnIsFinished = game.yendorsSceneActors.battleActors.combatState.state !== CombatState.STATE.START && game.yendorsSceneActors.battleActors.combatState.state !== CombatState.STATE.DEFENDER;
		}

		return data;
	}

	_onDragStart(event) {
		const actorId = event.currentTarget.dataset.actorId;
		const actor = game.actors.get(actorId);

		if (actor) {
			document.getElementById("drag-preview")?.remove();
			const token = actor.token ?? actor.prototypeToken;

			if (!token) {
				return;
			}

			let dataTransfer = {
				type: "Actor",
				uuid: actor.uuid
			}
			event.dataTransfer.setData("text/plain", JSON.stringify(dataTransfer));

			const img = document.createElement("img");
			img.src = token.texture.src;
			const pt = actor.prototypeToken;
			const w = pt.width * canvas.dimensions.size * Math.abs(pt.texture.scaleX) * canvas.stage.scale.x;
			const h = pt.height * canvas.dimensions.size * Math.abs(pt.texture.scaleY) * canvas.stage.scale.y;
			const preview = DragDrop.createDragImage(img, w, h);

			event.dataTransfer.setDragImage(preview, w / 2, h / 2);
		}
	}

	async _onDrop(event) {

		event.stopPropagation();

		let data;
		try {
			data = JSON.parse(event.dataTransfer.getData('text/plain'));
			const doc = await fromUuid(data?.uuid);

			// Akteure
			if (data.type === 'Actor') {

				// Ein SC kann über den type 'character' definiert sein oder alternativ über die Ownership-Rechte eins Spielers
				const actorOwnership = doc.ownership;
				let isUserCharacter = false;
				for (const [ownerId, permission] of Object.entries(actorOwnership)) {
					if (permission === 3) {
						if (game.users.get(ownerId) && !game.users.get(ownerId).isGM) {
							isUserCharacter = true
						}

					}
				}

				// Spieler-Charaktere
				if (doc.type === 'character' || isUserCharacter) {
					let playerCharacters = game.settings.get(this.MODULE_ID, FLAG.PLAYER_CHARACTERS) ?? {};
					playerCharacters[doc.id] = {}

					game.yendorsSceneActors.playerCharacters = playerCharacters;
					await game.settings.set(this.MODULE_ID, FLAG.PLAYER_CHARACTERS, game.yendorsSceneActors.playerCharacters);

				}
				// NPCs und Kreaturen
				else {
					let actors = game.yendorsSceneActors.scene.getFlag(this.MODULE_ID, FLAG.ACTORS) ?? {};

					actors[doc.id] = SceneActors.actorDefault;

					game.yendorsSceneActors.actors = actors;
					await game.yendorsSceneActors.scene.setFlag(this.MODULE_ID, FLAG.ACTORS, game.yendorsSceneActors.actors);
				}
			}

			// Items
			if (data.type === 'Item') {

				let items = game.yendorsSceneActors.scene.getFlag(this.MODULE_ID, FLAG.ITEMS) ?? {};

				items[doc.id] = SceneActors.itemDefault;

				game.yendorsSceneActors.items = items;
				await game.yendorsSceneActors.scene.setFlag(this.MODULE_ID, FLAG.ITEMS, game.yendorsSceneActors.items);
			}

			SceneActors.devLog('update by func _onDrop')
			await game.yendorsSceneActors.update();

		} catch (err) {
			return false;
		}
	}

	async toggleProperty(property) {
		await game.yendorsSceneActors.toggleProperty(property)
	}

	async clearScene() {
		await game.yendorsSceneActors.scene.unsetFlag(this.MODULE_ID, FLAG.ACTORS);
		this.showSettings = false;
		SceneActors.devLog('update by func clearScene')
		await game.yendorsSceneActors.update();
	}

	async updateSceneActors(emit = true, forceShowCanvas = false) {
		SceneActors.devLog('update by func updateSceneActors')
		await game.yendorsSceneActors.update({emitClients: emit, forceShowCanvas: forceShowCanvas});
	}

	openItemSheet(itemId) {

		const item = game.items.get(itemId);
		const actor = game.actors.get(itemId);

		if (item) {
			item.sheet.render(true, {focus: true});
		}

		if (actor) {
			actor.sheet.render(true, {focus: true});
		}
	}
}