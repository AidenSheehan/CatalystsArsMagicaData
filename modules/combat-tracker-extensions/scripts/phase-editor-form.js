const moduleId = 'combat-tracker-extensions';
const moduleTitle = 'Combat Tracker Extensions';
import { getModuleSetting } from "./settings-registration.js";
import { SETTINGATTRIBUTE } from "./setting-constants.js"
import { ListEditorForm } from "./list-editor-form.js"

export class CombatTrackerExtensionsPhaseEditorForm extends ListEditorForm {
  constructor(options) {
    super();
    this.formheader = options?.formheader ?? game.i18n.localize("PhaseEditor.Title");
    this.jsonheader = options?.jsonheader ?? "phases";
    this.settingid = options?.settingid ?? SETTINGATTRIBUTE.OPTION_COMBAT_TRACKER_DEFINED_PHASES.ID;
  }

  static get defaultOptions() {
    const defaults = super.defaultOptions;
    const overrides = {
      classes: [moduleId, "phases-editor"],     
      title: moduleTitle +' ' + game.i18n.localize("PhaseEditor.Title")
    };
    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
    return mergedOptions;
  }
  
}