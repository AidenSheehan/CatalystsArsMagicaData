import SceneActors, {FLAG, MODULE_ID} from "../SceneActors.js";
import BattleActorsLayer from "./BattleActorsLayer.js";
import CombatState from "./model/CombatState.js";

export default class BattleActors {

	activeCombat = null;
	isActiveCombat = false;
	encounter = null;
	combatState = new CombatState();
	battlemapScene = null;
	isOrientation = false;

	constructor() {
		console.log('init Yendor\'s Scene Actors: BattleActors')
		this.initHooks();
		this.initListeners();
	}

	init() {
		// game.yendorsSceneActors.scene.unsetFlag(MODULE_ID, FLAG.COMBATANTS);
		// return;
		this.getFlags();
		this.setCombat();
		if (this.isActiveCombat) {
			void this.initCombatants();
		}
		// game.yendorsSceneActors.update();
	}

	getFlags() {
		if (!game.yendorsSceneActors.scene) {
			return;
		}
		game.yendorsSceneActors.isBattlemap = game.yendorsSceneActors.scene.getFlag(MODULE_ID, FLAG.IS_BATTLEMAP) ?? false;
		game.yendorsSceneActors.battlemapId = game.yendorsSceneActors.scene.getFlag(MODULE_ID, FLAG.BATTLEMAP_ID) ?? '';

	}

	setCombat() {

		// Erst mal resetten
		game.yendorsSceneActors.isBattleTotM = false;

		// Gibt es einen aktiven Kampf für die Szene?
		game.combats.forEach((combat) => {
			if (combat.scene.id === game.yendorsSceneActors.scene.id) {
				this.isActiveCombat = true;
				this.activeCombat = combat;
			}
			if (combat.scene.id === game.yendorsSceneActors.battlemapId) {
				game.yendorsSceneActors.isBattleTotM = true;
				if (!game.yendorsSceneActors.battleActorsLayerApp) {
					game.yendorsSceneActors.battleActorsLayerApp = new BattleActorsLayer();
				}
				this.activeCombat = combat;
				// game.combat = combat;
				this.isActiveCombat = true;
			}
		});

		game.yendorsSceneActors.isBattleActorsSelector = game.yendorsSceneActors.isBattlemap && this.isActiveCombat;
	}

	storeNewCombatants() {

		// Muss gespeichert werden?
		let storeData = false;

		// Alle Kämpfer des Turns prüfen
		const combatants = this.activeCombat.turns ?? [];
		combatants.forEach((combatant) => {
			// Gibt es den Kämpfer im Store noch nicht, muss er noch dort abgelegt werden
			if (!game.yendorsSceneActors.storedCombatants.hasOwnProperty(combatant.id))
			{
				const token = canvas.scene.tokens.find(token => token.combatant?.id === combatant?.id);

				const newCombatant = {
					id: combatant.id,
					battlemapTokenId: token.id,
					encounters: {}
				}
				storeData = true;
				game.yendorsSceneActors.storedCombatants[combatant.id] = newCombatant;
			}
		});

		// Falls gespeichert werden muss, dann speichern und dann update
		if (storeData) {
			game.yendorsSceneActors.scene.setFlag(MODULE_ID, FLAG.COMBATANTS, game.yendorsSceneActors.storedCombatants);
			// game.yendorsSceneActors.update();
		}
	}

	async initCombatants() {

		// Kein aktiver Kampf, dann muss auch nichts initialisiert werden
		if (!this.activeCombat) {
			return;
		}

		// Die richtige Szene wählen
		this.battlemapScene = game.yendorsSceneActors.scene;

		// Dann die gespeicherten Daten für die Kämpfer holen.
		if (game.yendorsSceneActors.isBattleTotM) {
			this.battlemapScene = game.scenes.get(game.yendorsSceneActors.battlemapId);
		}

		this.combatState = Object.assign(new CombatState(), this.battlemapScene.getFlag(MODULE_ID, FLAG.COMBAT_STATE)) ?? new CombatState();
		this.isOrientation = this.battlemapScene?.getFlag(MODULE_ID, FLAG.IS_BATTLEMAP_ORIENTATION) ?? false;
		game.yendorsSceneActors.storedCombatants = this.battlemapScene?.getFlag(MODULE_ID, FLAG.COMBATANTS) ?? {};

		const combatants = this.activeCombat.turns ?? [];

		// Jetzt werden sie noch mit weiteren Daten aus dem Flag (Store) ergänzt
		combatants.every((combatant) => {
			combatant.isActive = this.activeCombat.current?.combatantId === combatant.id;
			combatant.isCurrentTarget = false;
			combatant.battlemapTokenId = game.yendorsSceneActors.storedCombatants[combatant.id]?.battlemapTokenId ?? '';
			combatant.actor.isNameRevealed = combatant.actor.getFlag(MODULE_ID, FLAG.ACTOR_IS_NAME_REVEALED) ?? false;
			combatant.shownName = combatant.token?.name;
			if (!combatant.actor.isNameRevealed && combatant.isNPC) {
				combatant.shownName = 'Unbekannt';
			}
			combatant.encounters = new Collection();

			// Die Gegner des Akteurs in der Collection ablegen
			// Dafür werden die IDs aller Gegber aus dem Store geprüft
			Object.values(game.yendorsSceneActors.storedCombatants[combatant.id]?.encounters ?? {}).forEach((encounter) => {
				const encounterCombatant = this.activeCombat.combatants.get(encounter.id);
				if (encounterCombatant) {

					const activeCombatant = this.getActiveCombatant();

					// Handelt es sich um den Gegner des aktiven Kämpfers
					// if (combatant.id === activeCombatant?.id) {
					// 	encounterCombatant.isCurrentTarget = true;
					// }
					combatant.encounters.set(encounter.id, encounterCombatant);
				}
			});
			return true;
		})

		game.yendorsSceneActors.combatants = this.activeCombat.turns;

		// Bei Bedarf noch speichern
		if (game.yendorsSceneActors.isBattlemap) {
			this.storeNewCombatants();
		}
	}

	addEncounterByClick() {
		const tokens = canvas.tokens?.controlled ?? [];
		tokens.forEach((token) => {
			game.yendorsSceneActors.combatants.every((combatant) => {
				if (combatant.tokenId === token.id) {
					this.addEncounter(combatant);
					return false;
				}
				return true;
			});
		})
	}

	addEncounterByAttack(attackerTokenId) {
		const attackerCombatant = game.yendorsSceneActors.combatants.find(combatant => combatant.tokenId === attackerTokenId);

		if (!attackerCombatant) {
			return;
		}

		game.user.targets.forEach(target => {
			if (target.actor?.id) {
				if (!attackerCombatant.encounters.find(encounter => encounter.id === target.combatant.id)) {
					const encounter = game.yendorsSceneActors.combatants.find(combatant => combatant.id === target.combatant?.id);
					if (encounter) {
						void this.addEncounter(encounter, attackerCombatant, false);
					}
				}
			}
		})
	}

	addEncounterByTarget(combatantId) {
		const combatant = this.activeCombat.combatants.get(combatantId);
		this.addEncounter(combatant);
	}

	async addEncounter(encounterToAdd, combatant = null, init = true) {

		const activeCombatant = combatant ?? this.getActiveCombatant();

		if (this.getActiveCombatant()?.id === encounterToAdd.id) {
			return;
		}

		let tokenId = '';
		canvas.scene.tokens.forEach((token) => {
			if (token.actorId === encounterToAdd.actorId) {
				tokenId = token.id;
			}
		})

		const encounter = {
			id: encounterToAdd.id,
			battlemapTokenId: tokenId
		}

		activeCombatant.encounters.set(encounterToAdd.id, encounterToAdd);
		game.yendorsSceneActors.storedCombatants[activeCombatant.id].encounters[encounterToAdd.id] = encounter;
		await game.yendorsSceneActors.scene.setFlag(MODULE_ID, FLAG.COMBATANTS, game.yendorsSceneActors.storedCombatants);

		let updateOptions = {};
		if (!init) {
			updateOptions.updateOnlyUI = true;
		}
		SceneActors.devLog('update by func addEncounter')
		await game.yendorsSceneActors.update(updateOptions);
	}

	async removeEncounter(combatantId, encounterId) {

		delete game.yendorsSceneActors.storedCombatants[combatantId].encounters[encounterId];
		await game.yendorsSceneActors.scene.unsetFlag(MODULE_ID, FLAG.COMBATANTS);
		await game.yendorsSceneActors.scene.setFlag(MODULE_ID, FLAG.COMBATANTS, game.yendorsSceneActors.storedCombatants);

		SceneActors.devLog('update by func removeEncounter')
		void game.yendorsSceneActors.update();
	}

	initHooks() {

		// Kampfbeginn
		Hooks.on('combatStart', () => {
			if (game.user.isGM) {
				if (this.battlemapScene) {
					game.scenes.preload(this.battlemapScene?.id, true);
				}
				this.combatState.state = CombatState.STATE.START;
				this.combatUpdate();
			}
		})

		// Es passiert was im Kampftracker
		// z.B. nächster Zug oder Kampf beendet
		Hooks.on("renderDSA5CombatTracker", async (app, html, data) => {
			if (SceneActors.isResponsibleGM()) {
				// Kein Kampf mehr? --> Reset!
				if (game.yendorsSceneActors.isBattlemap && !game.combat) {
					await this.resetBattleActors();
					// Update!
					SceneActors.devLog('update by hook renderDSA5CombatTracker 1')
					void game.yendorsSceneActors.update();
				} else if (SceneActors.isResponsibleGM() && game.combat && !game.combat.round) {
					SceneActors.devLog('update by hook renderDSA5CombatTracker 2')
					void game.yendorsSceneActors.update();
				}
			} else {
				game.yendorsSceneActors.updateApps(true);
			}
			if (game.yendorsSceneActors.isBattlemap) {
				BattleActors.selectCurrentToken(game.yendorsSceneActors.battleActors.getActiveCombatant());
			}
		})

		// Nächster Zug
		Hooks.on('combatTurn', async () => this.onCombatTurn())
		// Bzw. Nächste Runde
		Hooks.on('combatRound', async () => this.onCombatTurn())

		// KAMPFRUNDE: Daten für Liturgie oder Zauber-Angriff anlegen
		Hooks.on('renderDSA5SpellDialog', (app) => {
			const attackerTokenId = app.dialogData.speaker.token;
			if (game.yendorsSceneActors.isBattlemap) {
				this.addEncounterByAttack(attackerTokenId);
			}
			this.combatState.weaponName = app.dialogData?.source?.name ?? null;
			this.combatState.attackType = app.dialogData?.source?.type ?? null;
		})

		// KAMPFRUNDE: Daten für profanen Angriff anlegen
		Hooks.on('renderDSA5CombatDialog', (app) => {
			if (!app.dialogData.mode || app.dialogData.mode === 'parry') {
				return;
			}

			const attackerTokenId = app.dialogData.speaker.token;
			if (game.yendorsSceneActors.isBattlemap) {
				this.addEncounterByAttack(attackerTokenId);
			}
			this.combatState.weaponName = app.dialogData?.source?.name ?? null;
			this.combatState.attackType = app.dialogData?.source?.type ?? null;
		})

		// KAMPFRUNDE: Nach der Probe
		Hooks.on('postProcessDSARoll', (chatOptions, testData, rerenderMessage, hideDamage) => {

			SceneActors.devLog('BETA postProcessDSARoll', {chatOptions, testData} );
			const currentCombatantActorId = this.getActiveCombatant()?.actorId;

			// Fehlt der Angreifer noch?
			if (!this.combatState.attackerId) {
				// Dann kommt der Angriff von der Battlemap
				if (testData.speaker.actor !== currentCombatantActorId) {
					// Der Angriff hat mit der eigentlichen Reihenfolge nichts zu tun -> STOP!
					return;
				}
				this.combatState.attackerId = this.getActiveCombatant().id;
			}


			// Kann ein Angriff verteidigt werden?
			this.combatState.isDefendable = false;
			// Nahkampf und Fernkampf-Attaken sind prinzipiell erst mal verteidigbar
			const defendableAttacks = ['meleeweapon', 'rangeweapon', 'trait'];
			if (defendableAttacks.includes(this.combatState.attackType)) {
				this.combatState.isDefendable = true;
			}
			// Zauber und Liturgien mit Effektformel sind verteidigbar
			if (testData.hasOwnProperty('calculatedEffectFormula') && testData.calculatedEffectFormula) {
				this.combatState.isDefendable = true;
			}

			// Der neue Zug ist am Beginn, es wurde eine Kampfhandlung ausgeführt
			// Der Erfolg muss noch ausgewertet werden
			// Wie gehts weiter? => state setzen
			if (this.combatState.state !== CombatState.STATE.DEFENDER) {

				this.combatState.attackSuccess = testData.successLevel > 0;
				if (!this.combatState.attackSuccess) {
					this.combatState.state = CombatState.STATE.ATTACK_FAILED;
				} else if (this.combatState.isDefendable) {
					this.combatState.state = CombatState.STATE.DEFENDER;
				} else {
					this.combatState.state = CombatState.STATE.ATTACK_SUCCEEDED;
				}


				// Noch kein Ziel, dann wird es noch hinzugefügt
				if (!this.combatState.defenderId) {
					game.user.targets.forEach(target => {
						if (target.actor?.id) {
							const combatant = game.yendorsSceneActors.combatants.find(combatant => combatant.actorId === target.actor.id);
							this.combatState.defenderId = combatant.id;
						}
					})
				}

				// Kann die Aktion verteidigt werden?
				if (this.combatState.isDefendable) {
					// Dann noch auf die Chat-Nachricht bzgl. Verteidigung warten ...
					Hooks.on('renderChatMessage', this.searchOpposedMessage);
				} else {
					// ... ansonsten gleich updaten
					void this.combatUpdate();
				}
			}
		})

		// KAMPFRUNDE: Nach einer entsprechenden Gegner-Chat-Message suchen
		Hooks.on('renderChatMessageDSA5Roll', this.searchOpposedMessage);

		// KAMPFRUNDE: Nachdem der Gegner reagiert hat
		Hooks.on('finishOpposedTest', (attacker, defender, opposedResult, options) => {

			// Der Angriff war erfolgreich und der Gegner verteidigt sich
			if (this.combatState.state === CombatState.STATE.DEFENDER) {
				if (opposedResult.winner === "defender") {
					this.combatState.state = CombatState.STATE.ATTACK_PARRIED
				} else {
					this.combatState.state = CombatState.STATE.ATTACK_SUCCEEDED
				}

				void this.combatUpdate();
			}
		})
	}


	searchOpposedMessage = (message, html, chatData) => {
		if (html.find('.opposed-message').length) {
			Hooks.off('renderChatMessage', this.searchOpposedMessage);
			this.combatState.opposedMsgId = message.id;
			SceneActors.devLog('BETA postProcessDSARoll: UPDATE', this.combatState)
			void this.combatUpdate();
		}
	}

	async onCombatTurn() {
		// Kampf-Status aktualisieren
		if (SceneActors.isResponsibleGM()) {
			this.encounter = null;
			await game.scenes.get(this.battlemapScene.id).unsetFlag(MODULE_ID, FLAG.COMBAT_STATE);
			await game.scenes.get(this.battlemapScene.id).setFlag(MODULE_ID, FLAG.COMBAT_STATE, new CombatState().toJson());
			this.combatState = new CombatState();
			SceneActors.devLog('update by hook combatTurn')
			void game.yendorsSceneActors.update();
		}
	}

	async combatUpdate() {
		SceneActors.devLog('BETA combatUpdate')

		if (SceneActors.isResponsibleGM()) {
			await this.battlemapScene.setFlag(MODULE_ID, FLAG.COMBAT_STATE, this.combatState.toJson());
			SceneActors.devLog('update by func combatUpdate')
			void game.yendorsSceneActors.update();
		} else {
			const payload = {
				combatState: this.combatState.toJson(),
				sceneId: this.battlemapScene.id,
			}
			await SceneActors.emitSocket('updateBattleActors', payload)
		}

	}

	initListeners() {
		$('html').on('click', (event) => {
			event.stopImmediatePropagation();
			if (event.ctrlKey || event.metaKey) {
				this.addEncounterByClick();
			}
		})
	}

	getActiveCombatant() {
		return this.activeCombat?.combatants.get(this.activeCombat?.current.combatantId)
	}

	getUserHasPermission(actor = null) {
		if (actor === null) {
			actor = this.getActiveCombatant()?.actor;
		}

		return actor?.permission > 2;
	}

	async resetBattleActors() {
		if (this.battlemapScene) {
			await this.battlemapScene.unsetFlag(MODULE_ID, FLAG.COMBATANTS);
			await this.battlemapScene.unsetFlag(MODULE_ID, FLAG.COMBAT_STATE);

			this.activeCombat = null;
			this.isActiveCombat = false;
			this.encounter = null;
			this.combatState = new CombatState();
		}
	}

	static async toggleCombatantDefeatedStatus(combatant) {
		await BattleActors.getCombatTracker()?._onToggleDefeatedStatus(combatant);
		game.yendorsSceneActors.updateApps(true);
	}

	static nextTurn() {
		game.yendorsSceneActors.battleActors?.activeCombat?.nextTurn();
	}

	static previousTurn() {
		const isFirstTurn = game.yendorsSceneActors.battleActors?.activeCombat?.round === 1 && game.yendorsSceneActors.battleActors?.activeCombat?.turn === 0
		if (!isFirstTurn) {
			game.yendorsSceneActors.battleActors?.activeCombat?.previousTurn();
		}
	}

	static selectCurrentToken(combatant) {
		setTimeout(() => {
			if (!combatant) {
				return;
			}
			const token = combatant.token;
			if (!token || !token.object || !token.object.isVisible) {
				return;
			}
			canvas.animatePan({ x: token.x, y: token.y });

			if (!combatant.actor || !combatant.actor.isOwner) {
				return;
			}

			token.object.control({ releaseOthers: true });
		}, 300)
	}

	static getCombatTracker() {
		let combatTracker = null
		game.combats.apps.every(async app => {
			if (app instanceof CombatTracker) {
				combatTracker = app;
				return false;
			}
			return true;
		})
		return combatTracker;
	}
}