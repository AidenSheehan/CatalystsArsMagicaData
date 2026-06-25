import SceneActors, {MODULE_ID} from "../SceneActors.js";
import ModuleSettings, {SETTINGS} from "../menu/ModuleSettings.js";
import MagePriestAttackDialog from "../dialog/MagePriestAttackDialog.js";

export default class SceneActorsLayer extends Application {

	static get defaultOptions() {

		const options = super.defaultOptions;
		mergeObject(options, {
			classes: ["scene_actors_layer"],
			title: "Yendor's Scene Actors",
			dragDrop: [{dragSelector: null, dropSelector: null}],
		});
		options.template = 'modules/yendors-scene-actors/templates/scene_actors_layer.html';
		options.resizable = false;

		return options;
	}

	async getData(options) {
		const data = await super.getData(options);

		const items = game.yendorsSceneActors.shownItems;
		const showTooltips = game.settings.get(MODULE_ID, 'showTooltips');

		// actors.sort(dynamicSort('name'));

		data.itemsLeft = [];
		data.itemFocus = null;
		data.itemsRight = [];
		data.tooltips = {};

		data.general = {};
		data.settings = {};
		data.items = items;
		data.isFocusView = game.yendorsSceneActors.itemFocusId !== null;
		data.isSidebarCollapsed = ui.sidebar._collapsed;
		data.tileSize = '';
		data.canvasScaleClass = ''
		data.general.isGM = game.user.isGM;
		data.general.isDSA5 = ModuleSettings.isSystemDSA();
		data.tooltips.actor = '';
		data.tooltips.item = '';
		data.settings.hoverNames = !game.user.isGM && game.settings.get(MODULE_ID, SETTINGS.ENABLE_HOVER_NAMES);
		data.user = game.user;

		if (game.yendorsSceneActors.canvasScale !== 1) {
			let scaleString = game.yendorsSceneActors.canvasScale.toString();
			scaleString = scaleString.replace('.', '-');
			data.canvasScaleClass = ' scale_' + scaleString;
		}

		if (data.items.length > 8) {
			data.tileSize = 'medium';
		}
		if (data.items.length > 10) {
			data.tileSize = 'small';
		}
		if (data.items.length > 15) {
			data.tileSize = 'xs';
		}

		// Tooltip
		if (showTooltips) {
			data.tooltips.actor = '';
			if (game.user.isGM) {
				data.tooltips.actor = game.i18n.localize("Canvas.tooltipClickActor");
			}

			data.tooltips.item = game.i18n.localize('Canvas.tooltipClickItemPlayer');
			if (game.user.isGM) {
				data.tooltips.item = game.i18n.localize("Canvas.tooltipClickItem");
			}
		}

		// Für die Focus-Ansicht müssen die Daten noch aufbereitet werden
		if (data.isFocusView) {
			const equalizer = (data.items.length % 2) ? 1 : 0;
			const amountLeft = (data.items.length / 2) - equalizer;
			data.items.forEach((actor, index) => {
				if (actor.isOnFocus) {
					data.itemFocus = actor;
				} else if (data.itemsLeft.length < amountLeft) {
					data.itemsLeft.push(actor);
				} else {
					data.itemsRight.push(actor);
				}
			});
		}

		return data;
	}

	async _render(force = false, options = {}) {

		await super._render(force, options);
		this.adjustPosition();

		// Remove the window from candidates for closing via Escape.
		delete ui.windows[this.appId];
	}

	activateListeners(html) {
		super.activateListeners(html)

		document.querySelectorAll('.scene_actor_listener').forEach((element) => {
			const itemId = element.dataset.id;
			element.addEventListener('mousedown', (event) => {

				if (event.button === 0) {
					const actor = game.yendorsSceneActors.getActorDetail(itemId);
					const item = game.items.get(itemId);
					if (game.user.isGM) {
						if (actor || item) {
							if (event.altKey) {
								void game.yendorsSceneActors.updateItem(itemId, {rotateOnScene: !actor.rotateOnScene});
							} else {
								void game.yendorsSceneActors.toggleActorFocus(itemId);
							}
						}
					} else {
						if (actor && actor.permission > 0) {
							actor.sheet.render(true);
						}
						if (item && !item.isLocked) {
							item.sheet.render(true);
						}
					}
				}

				if (event.button === 2) {
					if (game.user.isGM) {
						game.yendorsSceneActors.toggleFullAvatar(itemId);
					}
				}

			})
		})

		document.querySelectorAll('.item_amount').forEach((element) => {
			const itemId = element.dataset.id;
			element.addEventListener('mousedown', (event) => {
				SceneActors.clickHandlerItemAmount(event, itemId);
			})
		})

		document.querySelectorAll('.target_action').forEach((element) => {
			const type = element.dataset.type;
			const actorId = element.dataset.id;
			const actor = game.actors.get(actorId);
			if (!actor) {
				return
			}
			element.addEventListener('mousedown', (event) => {
				event.stopImmediatePropagation();
				switch (type) {
					case 'toggle':
						void this.toggleTarget(actor)
						break;
					case 'attack':
						const tokenId = canvas.scene.tokens.find(token => token.actorId === game.user.character.id);
						if (tokenId) {
							void game.dsa5.dialogs.ActAttackDialog.showDialog(game.user.character, tokenId)
						}
						break;
					case 'talent':
						if (game.user.character) {
							game.user.character?.sheet.render(true);
						} else {
							ui.notifications.info(game.i18n.localize("Canvas.notification.noCharacter"));
						}

						break;
					case 'magic':
						void MagePriestAttackDialog.showDialog({actor: game.user.character});
						break;
				}

			})
		})

		document.querySelectorAll('.actor_name_container').forEach((element) => {
			if (game.user.isGM) {
				element.addEventListener('mousedown', (event) => {
					event.stopImmediatePropagation();
					event.preventDefault();
					if (event.button === 0) {
						const actorId = element.dataset.actorId;
						game.yendorsSceneActors.toggleShowName(actorId);
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
		document.querySelectorAll('.add_to_inventory').forEach((element) => {
			const itemId = element.dataset.id;
			element.addEventListener('mousedown', (event) => {
				event.preventDefault();
				event.stopImmediatePropagation();

				if (game.user.character) {

					let amount = 1;
					if (event.ctrlKey) {
						amount = 10;
					}
					const payload = {
						actorId: game.user.character.id,
						itemId: itemId,
						amount: amount
					}
					SceneActors.emitSocket('addItem', payload)
				}
			})
		})
	}

	async toggleTarget(actor) {
		let tokenDocument = game.yendorsSceneActors.scene.tokens.find(token => token.actorId === actor.id);

		if (tokenDocument) {

			const userTarget = game.user.targets.find(target => target.document.actorId === actor.id);
			if (userTarget) {
				game.user.targets.delete(userTarget);
			} else {
				const targetToken = new Token(tokenDocument);
				targetToken.target = new PIXI.Graphics()
				game.user.targets.add(targetToken);
			}
			void game.yendorsSceneActors.update({emitClients: false});
		}
	}

	adjustPosition() {

		const $interface = $('#interface');
		const $uiRight = $('#ui-right');

		let top = $interface.position().top;
		let left = $interface.position().left + 100;
		let right = document.body.clientWidth - $uiRight.position().left;
		let bottom = document.body.clientHeight - $interface.outerHeight() - top;

		if (!this.element[0]) {
			return;
		}

		this.element[0].style.top = top + 'px';
		this.element[0].style.bottom = bottom + 'px';
		this.element[0].style.left = left + 'px';
		this.element[0].style.right = right + 'px';
	}
}