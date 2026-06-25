import CombatState from "./model/CombatState.js";
import SceneActors from "../SceneActors.js";
import MagePriestAttackDialog from "../dialog/MagePriestAttackDialog.js";

export default class BattleActorsLayer extends Application {

	static get defaultOptions() {

		const options = super.defaultOptions;
		mergeObject(options, {
			classes: ["battle_actors_layer"],
			title: "Yendor's Scene Actors",
			dragDrop: [{dragSelector: null, dropSelector: null}],
		});
		options.template = 'modules/yendors-scene-actors/templates/battle_actors_layer.html';
		options.resizable = false;

		return options;
	}

	async getData(options) {
		const data = await super.getData(options);
		const state = game.yendorsSceneActors.battleActors.combatState;

		const isBattleInit = game.yendorsSceneActors.battleActors.activeCombat.turn === null;

		let activeCombatant = game.yendorsSceneActors.battleActors.getActiveCombatant();
		if (isBattleInit) {
			const userCharId = game.user.character.id;
			activeCombatant = game.yendorsSceneActors.combatants.find(combatant => combatant.actorId === userCharId);
		}

		const activeEncounter = game.yendorsSceneActors.combatants.find(combatant => combatant.id === state.defenderId);

		data.mustRollInitiative = false;

		let combatText = ''
		switch (state.state) {
			case CombatState.STATE.START:
				if (isBattleInit) {
					if (!activeCombatant) {
						combatText = `Ein Kampf beginnt! Du scheinst jedoch nicht beteiligt zu sein.`;
					} else {
						data.mustRollInitiative = !activeCombatant.initiative;
						if (data.mustRollInitiative) {
							combatText = `<i class="fa fa-dice"></i> Ein Kampf beginnt! Bitte die Initiative für <strong>${activeCombatant.shownName}</strong> würfeln.`;
						} else {
							combatText = `<i class="fa fa-swords"></i> Der Kampf beginnt gleich!`;
						}
					}
				} else {
					combatText = `<strong>${activeCombatant.shownName}</strong> ist an der Reihe!`;
				}
				break;
			case CombatState.STATE.DEFENDER:
				if (state.attackType === 'spell' || state.attackType === 'ritual') {
					combatText = `<i class="fas fa-wand"></i> <strong>${activeCombatant.shownName}</strong> zaubert einen ${state.weaponName}. Wird <strong>${activeEncounter.shownName}</strong> darauf reagieren?`;
				} else if (state.attackType === 'liturgy' || state.attackType === 'ceremony') {
					combatText = `<i class="fas fa-jedi"></i> <strong>${activeCombatant.shownName}</strong> wirkt die Liturgie „${state.weaponName}“. Wird <strong>${activeEncounter.shownName}</strong> darauf reagieren?`;
				} else {
					if (state.attackType === 'meleeweapon') {
						combatText = `<i class="fa fa-sword"></i> Angriff von <strong>${activeCombatant.shownName}</strong> mit ${state.weaponName}. <strong>${activeEncounter.shownName}</strong> versucht sich zu verteidigen.`;
					} else if (state.attackType === 'rangeweapon') {
						combatText = `<i class="fa fa-bow-arrow"></i> Angriff von <strong>${activeCombatant.shownName}</strong> mit ${state.weaponName}. <strong>${activeEncounter.shownName}</strong> versucht sich zu verteidigen.`;
					} else {
						combatText = `<i class="fa fa-sword"></i> Angriff von <strong>${activeCombatant.shownName}</strong> mit ${state.weaponName}. <strong>${activeEncounter.shownName}</strong> versucht sich zu verteidigen.`;
					}
				}
				break;

			case CombatState.STATE.ATTACK_FAILED:

				if (state.attackType === 'spell' || state.attackType === 'ritual') {
					combatText = `<i class="far fa-wand"></i> Der Zauber „${state.weaponName}“ von <strong>${activeCombatant.shownName}</strong>`;
					if (activeEncounter) {
						combatText += ` auf <strong>${activeEncounter.shownName}</strong>`;
					}
					combatText += ` ist gescheitert.`;
				} else if (state.attackType === 'liturgy' || state.attackType === 'ceremony') {
					combatText = `<i class="far fa-jedi"></i> Die Liturgie „${state.weaponName}“ von <strong>${activeCombatant.shownName}</strong>`;
					if (activeEncounter) {
						combatText += ` auf <strong>${activeEncounter.shownName}</strong>`;
					}
					combatText += ` ist gescheitert.`;
				} else {
					combatText = `<i class="far fa-dagger"></i> Der Angriff von <strong>${activeCombatant.shownName}</strong>`;
					if (activeEncounter) {
						combatText += ` auf <strong>${activeEncounter.shownName}</strong>`;
					}
					combatText += ` ist gescheitert.`;
				}
				break;

			case CombatState.STATE.ATTACK_PARRIED:
				combatText = `<i class="fa fa-shield-check"></i> <strong>${activeEncounter.shownName}</strong> hat den Angriff von <strong>${activeCombatant.shownName}</strong> verteidigt.`;
				break;

			case CombatState.STATE.ATTACK_SUCCEEDED:
				if (state.attackType === 'spell' || state.attackType === 'ritual') {
					combatText = `<i class="fas fa-wand-sparkles"></i> Der Zauber „${state.weaponName}“ von <strong>${activeCombatant.shownName}</strong>`;
					if (activeEncounter) {
						combatText += ` auf <strong>${activeEncounter.shownName}</strong>`;
					}
					combatText += ` war erfolgreich.`;
				} else if (state.attackType === 'liturgy' || state.attackType === 'ceremony') {
					combatText = `<i class="fas fa-wand-jedi"></i> Die Liturgie „${state.weaponName}“ von <strong>${activeCombatant.shownName}</strong>`;
					if (activeEncounter) {
						combatText += ` auf <strong>${activeEncounter.shownName}</strong>`;
					}
					combatText += ` war erfolgreich.`;
				} else {
					combatText = `<i class="fa fa-sword"></i> Der Angriff von <strong>${activeCombatant.shownName}</strong>`;
					if (activeEncounter) {
						combatText += ` auf <strong>${activeEncounter.shownName}</strong>`;
					}
					combatText += ` war erfolgreich.`;
				}
				break;

			case CombatState.STATE.IS_CONCENTRATING:
				if (activeCombatant.actor.system.isMage) {
					combatText = `<strong>${activeCombatant.shownName}</strong> konzentriert sich auf einen <strong>Zauber</strong>.`;
				}
				if (activeCombatant.actor.system.isPriest) {
					combatText = `<strong>${activeCombatant.shownName}</strong> konzentriert sich auf eine <strong>Liturgie</strong>.`;
				}
				break;
		}

		let userHasPermission = false;
		let canAttack = false;

		if (activeCombatant) {

			userHasPermission = activeCombatant.actor.permission > 2;

			// Kann der Spieler gerade attackieren?
			canAttack = true;

			// Der Kampf hat noch nicht begonnen
			if (isBattleInit) {
				canAttack = false;
			}

			// Nicht die nötigen Rechte?
			if (canAttack && !userHasPermission) {
				canAttack = false;
			}
			// Wir warten nicht auf die Verteidigung des Gegners
			if (canAttack && state.state === CombatState.STATE.DEFENDER) {
				canAttack = false;
			}

			activeCombatant.encounters.forEach((encounter) => {

				let canDefend = true;

				// Wir warten auf die Verteidigung des Gegners
				if (state.state !== CombatState.STATE.DEFENDER) {
					canDefend = false;
				}
				// Kann sich der Akteur gerade verteidigen?
				if (canDefend && encounter.id !== activeEncounter.id) {
					canDefend = false;
				}
				// Nicht die nötigen Rechte?
				if (canDefend && encounter?.actor.permission < 3) {
					canDefend = false;
				}
				encounter.canDefend = canDefend;

				encounter.wornWeapons = this.getCombatantWeapons(encounter.actor);

			})
		}

		// Soll der Button zum Zug beenden angezeigt werden?
		const showFinishTurn = canAttack && !data.rollInitiative;

		// Soll der Button zum Zug beenden hervorgehoben werden?
		const highlightFinishTurn = state.state !== CombatState.STATE.START;

		data.isMage = activeCombatant?.actor.system.isMage ?? false;
		data.isPriest = activeCombatant?.actor.system.isPriest ?? false;
		data.activeCombatant = activeCombatant;
		data.isUserCombatant = data.activeCombatant?.actorId === game.user.character.id;
		data.userHasPermission = userHasPermission;
		data.combatState = state;
		data.combatText = combatText;
		data.canAttack = canAttack;
		data.showFinishTurn = showFinishTurn;
		data.highlightFinishTurn = highlightFinishTurn;
		data.userInfoPanel = '';
		data.userActionPanel = '';
		data.combatActionPanel = '';
		if (userHasPermission) {
			data.userInfoPanel = this.getUserInfoPanel(activeCombatant);
			data.userActionPanel = this.getUserActionPanel(activeCombatant);
			data.combatActionPanel = this.getCombatActionPanel();
		}

		// data.isStart = data.combatState.state === CombatState.STATE.START;
		// data.isDefender = data.combatState.state === CombatState.STATE.DEFENDER;
		// data.isAttackFailed = data.combatState.state === CombatState.STATE.ATTACK_FAILED;

		return data;
	}

	getCombatActionPanel() {

		const $panel = $('<div class="combat_action_panel"></div>');



		return $panel.html();
	}

	getUserInfoPanel(combatant) {

		let html = `<div class="user_info_panel">`;
		html += `<div class="user_panel_inner">`;
		html += `<div class="user_panel_headline">${combatant.actor.name}</div>`

		const healthWidth = combatant.actor.system.status.wounds.value / combatant.actor.system.status.wounds.max * 100

		html += `<div class="status_bar health_bar">`
		html += `<div class="status_bar_track" style="width:${healthWidth}%"></div>`
		html += `<div class="status_bar_label">`
		html += `<span class="status_bar_type">LeP</span>`
		html += `<span class="status_bar_value">${combatant.actor.system.status.wounds.value} / ${combatant.actor.system.status.wounds.max}</span>`
		html += `</div>`;
		html += `</div>`;

		if (combatant.actor.system.isMage) {

			const aspWidth = combatant.actor.system.status.astralenergy.value / combatant.actor.system.status.astralenergy.max * 100

			html += `<div class="status_bar asp_bar">`
			html += `<div class="status_bar_track" style="width:${aspWidth}%"></div>`
			html += `<div class="status_bar_label">`
			html += `<span class="status_bar_type">AsP</span>`
			html += `<span class="status_bar_value">${combatant.actor.system.status.astralenergy.value} / ${combatant.actor.system.status.astralenergy.max}</span>`
			html += `</div>`;
			html += `</div>`;
		}

		if (combatant.actor.system.isPriest) {

			const kapWidth = combatant.actor.system.status.karmaenergy.value / combatant.actor.system.status.karmaenergy.max * 100

			html += `<div class="status_bar kap_bar">`
			html += `<div class="status_bar_track" style="width:${kapWidth}%"></div>`
			html += `<div class="status_bar_label">`
			html += `<span class="status_bar_type">KaP</span>`
			html += `<span class="status_bar_value">${combatant.actor.system.status.karmaenergy.value} / ${combatant.actor.system.status.karmaenergy.max}</span>`
			html += `</div>`;
			html += `</div>`;
		}

		html += `</div>`;
		html += `</div>`;

		return html;
	}

	getCombatantWeapons(encounterActor) {
		const weapons = encounterActor.items.filter(weapon => {
			if (weapon.type == "meleeweapon" || weapon.type == "rangeweapon") {
				return weapon.system.worn.value
			}
			return false
		})

		return weapons;
	}

	getUserActionPanel(combatant) {

		const hasTarget = game.user.targets.size > 0;

		let html = `<div class="user_action_panel">`;
		html += `<div class="user_panel_inner">`;
		html += `<div class="user_panel_headline">Mögliche Aktionen</div>`;
		html += `<div class="user_panel_action">`;

		html += `<div class="combatant_action${!hasTarget ? ' disabled' : ''}"${hasTarget ? 'data-action="attack"' : ''}>`;
		html += `<i class="fa fa-sword"></i>`;
		if (hasTarget) {
			html += `<span class="action_txt">Ziel Angreifen</span>`;
		} else {
			html += `<span class="action_txt">Angreifen</span>`;
		}
		html += `</div>`;

		if (combatant.actor.system.isMage) {
			html += `<div class="combatant_action" data-action="magic">`;
			html += `<i class="fas fa-wand"></i>`;
			if (hasTarget) {
				html += `<span class="action_txt">Zauber auf Ziel wirken</span>`;
			} else {
				html += `<span class="action_txt">Zauber wirken</span>`;
			}
			html += `</div>`;
		}

		if (combatant.actor.system.isPriest) {
			html += `<div class="combatant_action" data-action="magic">`;
			html += `<i class="fas fa-jedi"></i>`;
			if (hasTarget) {
				html += `<span class="action_txt">Liturgie auf Ziel wirken</span>`;
			} else {
				html += `<span class="action_txt">Liturgie wirken</span>`;
			}
			html += `</div>`;
		}

		if (game.yendorsSceneActors.battleActors.isOrientation) {
			html += `<div class="combatant_action" data-action="orientation">`;
			html += `<i class="fas fa-eye"></i>`;
			html += `<span class="action_txt">Kurz orientieren (Freie Aktion)</span>`;
			html += `</div>`;
		}

		// html += `<div class="combatant_action">`;
		// html += `<i class="fa fa-hammer"></i>`;
		// if (hasTarget) {
		// 	html += `<span class="action_txt">Talent-Vergleichsprobe</span>`;
		// } else {
		// 	html += `<span class="action_txt">Talent-Probe</span>`;
		// }
		// html += `</div>`;

		html += `</div>`;
		html += `</div>`;
		html += `</div>`;

		return html;
	}

	async _render(force = false, options = {}) {

		await super._render(force, options);
		this.adjustPosition();

		// Remove the window from candidates for closing via Escape.
		delete ui.windows[this.appId];
	}

	activateListeners(html) {
		super.activateListeners(html);

		document.querySelectorAll('.attack_encounter').forEach((element) => {
			element.addEventListener('click', (event) => {
				const encounterId = element.dataset.encounter;
				const mode = element.dataset.mode;

				game.yendorsSceneActors.combatants.every((combatant) => {
					if (encounterId === combatant.id) {
						game.yendorsSceneActors.battleActors.encounter = combatant;
						return false;
					}
					return true;
				})

				const encounterToken = new Token(game.yendorsSceneActors.battleActors.encounter.token);
				encounterToken.target = new PIXI.Graphics()

				game.user.targets.clear();
				if (encounterToken) {
					game.user.targets.add(encounterToken);
					const combatant = game.yendorsSceneActors.battleActors.getActiveCombatant();
					if (combatant) {
						if (mode === 'attack') {
							game.dsa5.dialogs.ActAttackDialog.showDialog(combatant.actor, combatant.tokenId)
						}
					}
				}
			})
		});

		document.querySelectorAll('.defend_encounter').forEach((element) => {
			element.addEventListener('click', (event) => {
				const message = game.messages.get(game.yendorsSceneActors.battleActors.combatState.opposedMsgId)
				game.dsa5.dialogs.ReactToAttackDialog.showDialog(message)
			})
		});

		document.querySelectorAll('.combatant_action').forEach((element) => {
			element.addEventListener('click', (event) => {
				const action = element.dataset.action;
				const combatant = game.yendorsSceneActors.battleActors.getActiveCombatant();
				game.yendorsSceneActors.battleActors.combatState.attackerId = combatant.id;

				if (action === 'attack') {
					if (combatant) {
						game.dsa5.dialogs.ActAttackDialog.showDialog(combatant.actor, combatant.tokenId)
					}
				}
				if (action === 'magic') {
					void MagePriestAttackDialog.showDialog(combatant);
				}
				if (action === 'orientation') {
					SceneActors.emitSocket('beamToBattlemap', {userId: game.user.id, sceneId: game.yendorsSceneActors.scene.id, battlemapId: game.yendorsSceneActors.battleActors.battlemapScene.id})
				}
			})
		});

		html.find('.roll_initiative').click((ev) => {
			const combatantId = ev.currentTarget.dataset.combatantId;
			game.yendorsSceneActors.battleActors?.activeCombat?.rollInitiative([combatantId]);
		});

		html.find('.next_turn').on('click', (ev) => {
			// game.combats.apps[0]._onCombatControl(ev)
			this.clearAllTargets();
			SceneActors.emitSocket('nextCombatTurn', {combatId: game.yendorsSceneActors.battleActors.activeCombat.id})
		});

		document.querySelectorAll('.encounter_listener').forEach((element) => {
			element.addEventListener('click', (event) => {
				const action = element.dataset.action;
				const encounterId = element.dataset.encounter;

				if (action === 'target') {

					if (!game.yendorsSceneActors.battleActors.getUserHasPermission()) {
						return;
					}

					const encounter = game.yendorsSceneActors.combatants.find(combatant => combatant.id === encounterId);

					if (encounter.isCurrentTarget) {
						this.clearAllTargets();
						game.yendorsSceneActors.updateApps();
						return;
					}

					game.yendorsSceneActors.battleActors.encounter = encounter;
					game.yendorsSceneActors.battleActors.combatState.defenderId = encounter.id;

					if (encounter) {

						const encounterToken = new Token(game.yendorsSceneActors.battleActors.encounter.token);
						this.clearAllTargets();
						encounterToken.target = new PIXI.Graphics()
						encounter.isCurrentTarget = true;
						game.user.targets.add(encounterToken);
						game.yendorsSceneActors.updateApps();
					}
				}
			})
		});
	}

	clearAllTargets() {
		game.yendorsSceneActors.combatants.forEach(combatant => {
			combatant.isCurrentTarget = false;
		})
		game.user.targets.clear();
	}


	adjustPosition() {

		const $interface = $('#interface');
		const $uiRight = $('#ui-right');

		let top = $interface.position().top;
		let left = $interface.position().left + 100;
		let right = document.body.clientWidth - $uiRight.position().left;
		let bottom = document.body.clientHeight - $interface.outerHeight() - top;

		if (this.element[0]) {
			this.element[0].style.top = top + 'px';
			this.element[0].style.bottom = bottom + 'px';
			this.element[0].style.left = left + 'px';
			this.element[0].style.right = right + 'px';
		}
	}

}