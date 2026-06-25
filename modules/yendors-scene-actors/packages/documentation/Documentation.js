import Changelog from "./Changelog.js";

const moduleJson = await fetch("/modules/yendors-scene-actors/module.json")
const MODULE = await moduleJson.json();

export default class Documentation extends FormApplication {

	/**
	 * Default Options for this FormApplication
	 */
	static get defaultOptions() {
		const options = super.defaultOptions;
		options.tabs = [
			{ navSelector: ".tabs", contentSelector: ".content", initial: 'info' },
		]

		const classes = ['yendors-dialog'];
		if (this.wrapperClass) {
			classes.push(this.wrapperClass);
		}

		return mergeObject(options, {
			classes: options.classes.concat([this.wrapperClass, 'yendors-dialog']),
			title: MODULE.title,
			template: `${this.templatesDir}module_documentation.html`,
			width: 960,
			height: 800
		});
	}

	static wrapperClass = ''
	static baseDir = `modules/${MODULE.id}/`;
	static templatesDirPart = `packages/documentation/templates/`;
	static templatesDir = `${this.baseDir}${this.templatesDirPart}`

	initialTab = null;

	_changelog;

	get changelog() {
		if (!this._changelog) {
			this._changelog = new Changelog(this.constructor.changelogData);
		}
		return this._changelog;
	}

	templates = [];

	static changelogEntries = undefined;

	static _instance = undefined;

	/**
	 * @returns {Documentation}
	 */
	static get instance() {
		if (!this._instance) {
			void this.init();
		}
		return this._instance;
	}

	static async init() {
		if (!Documentation._instance) {
			Documentation._instance = new this();
		}
	}

	constructor() {
		super();

		loadTemplates([
			`${this.constructor.templatesDir}features_info.html`,
			`${this.constructor.templatesDir}module_documentation.html`,
			`${this.constructor.templatesDir}partials/module_info.html`,
			`${this.constructor.templatesDir}partials/changelog.html`,
		]);
	}

	static async showNewChangelog(force = false) {

		if (force || Changelog.isNewVersion()) {
			this.instance.render(true, {});
			this.instance.initialTab = 'changelog';
		}
	}

	static get changelogData() {
		return {
			moduleId: MODULE.id,
			entryList: this.instance.constructor.changelogEntries
		}
	}

	static get templates() {
		return [];
	}

	async getData(options) {

		const partials = this.templates;
		const module = MODULE;
		const changelog = await this.changelog.getChangelog();

		const templates = {};

		templates.moduleInfo = () => `${this.constructor.templatesDir}partials/module_info.html`;
		templates.changelog = () => `${this.constructor.templatesDir}partials/changelog.html`;

		const data = {
			partials,
			module,
			changelog,
			templates,
			changelogTemplate: templates.changelog,
		}

		return data;
	}

	async _render(force, options = {}) {
		await super._render(force, options);
		if (this.initialTab) {
			this.activateTab(this.initialTab);
			this .initialTab = null;
		}
	}
}