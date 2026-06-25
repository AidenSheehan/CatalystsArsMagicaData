import {MODULE_ID} from "../../script/SceneActors.js";
import {SETTINGS} from "../../script/menu/ModuleSettings.js";

const moduleJson = await fetch("/modules/yendors-scene-actors/module.json")
const MODULE = await moduleJson.json();

export default class Changelog {

	static showDown = new showdown.Converter();

	entryList = undefined;

	static getVersions() {
		const currentModuleVersion = MODULE.version;
		const seenVersion = game.settings.get(MODULE_ID, SETTINGS.CHANGELOG_VERSION);
		const seenBaseVersion = seenVersion.split(' ')[0];
		const currentBaseVersion = currentModuleVersion.split(' ')[0];
		const currentVersionBuild = currentModuleVersion.split(' ')[1];

		return {
			currentModuleVersion,
			seenVersion,
			seenBaseVersion,
			currentBaseVersion,
			currentVersionBuild,
		}
	}

	static isNewVersion() {
		const {currentModuleVersion, seenVersion} = this.getVersions();
		return currentModuleVersion > seenVersion;
	}

	constructor(changelogData = {}) {
		foundry.utils.mergeObject(this, changelogData);
	}

	async getChangelog() {

		const {
			currentModuleVersion,
			seenBaseVersion,
			currentBaseVersion,
		} = Changelog.getVersions();

		let currentEntry = undefined;
		let entryList = [];

		for (let entry of this.entryList) {
			await this.i18nEntry(entry);
			if (currentEntry === undefined && entry.version >= seenBaseVersion) {
				currentEntry = entry;
			} else {
				entryList.push(entry)
			}
		}

		// Noch kein aktueller Changelog (z.B. Minor-Version mit keinem Eintrag)
		if (!currentEntry) {
			currentEntry = {
				version: currentModuleVersion,
				content: this.getMinorChangesEntryHtml(game.i18n.lang, currentBaseVersion)
			}
		}

		await game.settings.set(MODULE_ID, SETTINGS.CHANGELOG_VERSION, currentModuleVersion);

		return {
			currentEntry,
			entryList
		}
	}

	async i18nEntry(entry) {
		entry.title = entry.title?.de ?? '';

		const language = game.i18n.lang;

		const logPath = `modules/${MODULE_ID}/changelog/v${entry.version}_${language}.md`;

		let text = '';

		await fetch(logPath).then( r => {
			return r.ok ? r.text() : ''
		}).then( t => text = t);

		let html = '';
		if (text) {
			html = Changelog.showDown.makeHtml(text)
		}
		else {
			html = this.getMinorChangesEntryHtml(language, entry.version);
		}

		entry.content = html

		return entry;
	}

	getMinorChangesEntryHtml(lang, version) {

		const html = {
			de: `<p>Dieser Release beinhaltet kleinere Verbesserungen oder Bugfixes. Genauere Informationen finden sich im <a href="https://gitlab.com/yendors-vtt/${MODULE_ID}/-/releases/v${version}" target="_blank">GitLab-Changelog</a>.</p>`,
			en: `<p>This release contains minor improvements and bug fixes. More detailed information can be found in the <a href="https://gitlab.com/yendors-vtt/${MODULE_ID}/-/releases/v${version}" target="_blank">GitLabg changelog</a>.</p>`
		};

		if (html.hasOwnProperty(lang)) {
			return html[lang];
		}

		return html.en;
	}
}