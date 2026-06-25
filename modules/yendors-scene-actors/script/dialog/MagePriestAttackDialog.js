import CombatState from "../battle_actors/model/CombatState.js";

export default class MagePriestAttackDialog extends Dialog {

	static get defaultOptions() {
		const options = super.defaultOptions;
		mergeObject(options, {
			width: 750,
		});
		return options;
	}

	static async showDialog(combatant) {

		let title = '';
		if (combatant.actor.system.isMage) {
			title = 'Zauber wirken';
		}
		if (combatant.actor.system.isPriest) {
			title = 'Liturgie wirken';
		}

		const dialog = new MagePriestAttackDialog({
			title: title,
			content: await this.getTemplate(combatant),
			buttons: {}
		});
		dialog.combatant = combatant;
		dialog.render(true);
	}

	static async getTemplate(combatant) {
		let skills;
		let title;
		let act;
		if (combatant.actor.system.isMage) {
			skills = combatant.actor.items.filter(skill => skill.type === "spell" || skill.type === "ritual")
			title = 'Zauber';
			act = 'Zaubern';
		}
		if (combatant.actor.system.isPriest) {
			skills = combatant.actor.items.filter(skill => skill.type === "liturgy" || skill.type === "ceremony")
			title = 'Liturgie';
			act = 'Liturgie wirken';
		}

		let html = `<div class="mage_priest_attack">`;
		html += `<div class="skill_header">Wähle einen Zauber, den du wirken willst</div>`;


		html += `<table>`;
		html += `<tr class="skill_item_header">`;
		html += `<td class="skill_item_name">${title}</td>`;
		html += `<td class="skill_item_costs">Kosten</td>`;
		html += `<td class="skill_item_duration">Dauer</td>`;
		html += `<td></td>`;
		html += `<td></td>`;
		html += `<td></td>`;
		html += `</tr>`;

		skills.forEach(skill => {
			html += `<tr class="skill_item" data-item-id="${skill.id}">`;
			html += `<td class="skill_item_name skill_action" data-mode="showSkill"><strong>${skill.name}</strong></td>`;
			html += `<td class="skill_item_costs skill_action">${skill.system.AsPCost.value} AsP</td>`;
			html += `<td class="skill_item_costs skill_action">${skill.system.castingTime.value} Aktionen</td>`;
			const hasToPrepare = Number(skill.system.castingTime.value) > 1;
			const isPrepared = skill.system.castingTime.progress === Number(skill.system.castingTime.value);

			html += `<td>`;
			if (hasToPrepare && skill.system.castingTime.progress > 0) {
				const progress = skill.system.castingTime.progress / Number(skill.system.castingTime.value);
				const transform = this.progressTransformation(progress);
				const progressString = skill.system.castingTime.progress + `/` + skill.system.castingTime.value;

				html += `<div class="progress blue">`;
				html += `<span class="progress-left" style="--transformLeft:${transform.left}">`;
				html += `<span class="progress-bar"></span>`;
				html += `</span>`;
				html += `<span class="progress-right" style="--transformRight:${transform.right}">`;
				html += `<span class="progress-bar"></span>`;
				html += `</span>`;
				html += `<div class="progress-value">${progressString}</div>`;
				html += `</div>`;
			}
			html += `</td>`;

			html += `<td>`;
			if (hasToPrepare) {



				html += `<a class="skill_test skill_action${isPrepared ? '' : ''}" data-mode="concentrate">Konzentrieren</a>`;
			}
			html += `</td>`;

			html += `<td><a class="skill_test skill_action${hasToPrepare && !isPrepared ? ' concentrate' : ''}" data-mode="skillTest">${act}</a></td>`
			html += `</tr>`;
		})
		html += `</table>`;

		html += `</div>`;

		return html;
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.find('.skill_action').on('click', async ev => {
			const mode = ev.currentTarget.dataset.mode;
			const itemId = $(ev.target).closest('.skill_item').data('item-id');
			let skill = this.combatant.actor.items.get(itemId);

			if (mode === 'showSkill') {
				skill.sheet.render(true);
				return;
			}
			if (mode === 'skillTest') {
				this.combatant.actor.setupSpell(skill, {}, null).then(setupData => this.combatant.actor.basicTest(setupData));
				this.close();
			}
			if (mode === 'concentrate') {
				const progress = skill.system.castingTime.progress;
				let modified = skill.system.castingTime.modified;

				const actor = this.combatant.actor;
				let reloadUpdate = { _id: itemId, "system.castingTime.progress": progress + 1 };

				await actor.updateEmbeddedDocuments("Item", [reloadUpdate]);
				const infoMsg = game.i18n.format("SPELL.isReloading", {
					actor: actor.name,
					item: skill.name,
					status: `${progress + 1}/${modified}`,
				});
				await ChatMessage.create(game.dsa5.apps.DSA5_Utility.chatDataSetup(infoMsg));
				game.yendorsSceneActors.battleActors.combatState.state = CombatState.STATE.IS_CONCENTRATING;
				void game.yendorsSceneActors.battleActors.combatUpdate();
				this.close();
			}
		})
	}

	static progressTransformation(progress) {

		const transform = {};

		if (progress >= 0.5) {
			transform.right = "181deg";
			transform.left = `${Math.round(progress * 360 - 179)}deg`;
		} else {
			transform.right = `${Math.round(progress * 360 + 1)}deg`;
			transform.left = 0;
		}

		return transform;
	}
}