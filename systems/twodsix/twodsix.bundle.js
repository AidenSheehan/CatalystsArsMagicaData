const migrationFileNames = ["2021_12_29_19_02_28_reset-migration-schema-version","2022-01-03-06-15-30-merge-contacts","2022_4_27_09_05_00_fix_move_units","2023_01_20_09_48_00_refactor_conditions","2023_04_01_014_41_00_refactor_damageTypes","2023_06_21_08_18_refactor_item_effect","2023_06_29_14_29_fix_badMigration","2023_08_09_11_51_fix_fractional_string_settings","2023_08_30_12_58_add_associatedSkill_to_spells","2023_09_16_08_232_fix_bad_Equipped_state","2023_10_21_09_05_add_finance_values","2023_11_29_13_35_refactor_rangeLabels","2023_12_30_10_32_refactor_rangeModifier","2024_01_08_17_12_refactor_range","2024_04_01_08_28_migrate_data","2024_04_12_12_31_migrate_age","2024_07_01_12_28_migrate_disabled","2025_01_20_09_11_refactor_armorPiercing","6_2025_05_28_08_09_rename_commonFunds"];
const handlebarsTemplateFiles = ["systems/twodsix/templates/misc/setting-partial.hbs","systems/twodsix/templates/misc/revised-document-partial.hbs","systems/twodsix/templates/misc/revised-compendium-index-partial.hbs","systems/twodsix/templates/misc/navigation-tabs.hbs","systems/twodsix/templates/misc/advanced-settings.hbs","systems/twodsix/templates/items/weapon-sheet.hbs","systems/twodsix/templates/items/trait-sheet.hbs","systems/twodsix/templates/items/tool-sheet.hbs","systems/twodsix/templates/items/storage-sheet.hbs","systems/twodsix/templates/items/spell-sheet.hbs","systems/twodsix/templates/items/skills-sheet.hbs","systems/twodsix/templates/items/ship_position-sheet.hbs","systems/twodsix/templates/items/psiAbility-sheet.hbs","systems/twodsix/templates/items/junk-sheet.hbs","systems/twodsix/templates/items/item-sheet.hbs","systems/twodsix/templates/items/equipment-sheet.hbs","systems/twodsix/templates/items/consumable-sheet.hbs","systems/twodsix/templates/items/computer-sheet.hbs","systems/twodsix/templates/items/component-sheet.hbs","systems/twodsix/templates/items/augment-sheet.hbs","systems/twodsix/templates/items/armor-sheet.hbs","systems/twodsix/templates/items/parts/weapon-sheet-tabbed.hbs","systems/twodsix/templates/items/parts/weapon-sheet-flat.hbs","systems/twodsix/templates/items/parts/useConsumableForRoll.hbs","systems/twodsix/templates/items/parts/reference-footer.hbs","systems/twodsix/templates/items/parts/item-type.hbs","systems/twodsix/templates/items/parts/image-name.hbs","systems/twodsix/templates/items/parts/footer.hbs","systems/twodsix/templates/items/parts/consumables-part.hbs","systems/twodsix/templates/items/parts/component-sheet-tabbed.hbs","systems/twodsix/templates/items/parts/component-sheet-flat.hbs","systems/twodsix/templates/items/parts/common-parts.hbs","systems/twodsix/templates/items/parts/aoe-parts.hbs","systems/twodsix/templates/items/parts/weapon-parts/weapon-modifiers.hbs","systems/twodsix/templates/items/parts/weapon-parts/weapon-magazine.hbs","systems/twodsix/templates/items/parts/weapon-parts/weapon-description.hbs","systems/twodsix/templates/items/parts/weapon-parts/weapon-customCTModifier.hbs","systems/twodsix/templates/items/parts/weapon-parts/weapon-attack.hbs","systems/twodsix/templates/items/parts/component-parts/component-price.hbs","systems/twodsix/templates/items/parts/component-parts/component-power.hbs","systems/twodsix/templates/items/parts/component-parts/component-general.hbs","systems/twodsix/templates/items/parts/component-parts/component-displacement.hbs","systems/twodsix/templates/items/parts/component-parts/component-attack.hbs","systems/twodsix/templates/items/dialogs/create-consumable.hbs","systems/twodsix/templates/chat/throw-dialog.hbs","systems/twodsix/templates/chat/select-skill.hbs","systems/twodsix/templates/chat/request-roll-dialog.hbs","systems/twodsix/templates/chat/initiative-dialog.hbs","systems/twodsix/templates/chat/damage-message.hbs","systems/twodsix/templates/actors/vehicle-sheet.hbs","systems/twodsix/templates/actors/traveller-sheet.hbs","systems/twodsix/templates/actors/space-object-sheet.hbs","systems/twodsix/templates/actors/ship-sheet.hbs","systems/twodsix/templates/actors/robot-sheet.hbs","systems/twodsix/templates/actors/npc-sheet.hbs","systems/twodsix/templates/actors/healing-dialog.hbs","systems/twodsix/templates/actors/damage-dialog.hbs","systems/twodsix/templates/actors/battle-sheet.hbs","systems/twodsix/templates/actors/animal-sheet.hbs","systems/twodsix/templates/actors/parts/vehicle/vehicle-integrity-table.hbs","systems/twodsix/templates/actors/parts/vehicle/vehicle-detailed-armor.hbs","systems/twodsix/templates/actors/parts/vehicle/vehicle-components.hbs","systems/twodsix/templates/actors/parts/ship/ship-status.hbs","systems/twodsix/templates/actors/parts/ship/ship-state-grid.hbs","systems/twodsix/templates/actors/parts/ship/ship-power-management.hbs","systems/twodsix/templates/actors/parts/ship/ship-positions.hbs","systems/twodsix/templates/actors/parts/ship/ship-notes.hbs","systems/twodsix/templates/actors/parts/ship/ship-hull.hbs","systems/twodsix/templates/actors/parts/ship/ship-finance.hbs","systems/twodsix/templates/actors/parts/ship/ship-crew.hbs","systems/twodsix/templates/actors/parts/ship/ship-components-single.hbs","systems/twodsix/templates/actors/parts/ship/ship-components-double.hbs","systems/twodsix/templates/actors/parts/ship/ship-component-single-item.hbs","systems/twodsix/templates/actors/parts/ship/ship-component-double-item.hbs","systems/twodsix/templates/actors/parts/ship/ship-characteristics.hbs","systems/twodsix/templates/actors/parts/ship/ship-cargo.hbs","systems/twodsix/templates/actors/parts/ship/interface-overlay-2.hbs","systems/twodsix/templates/actors/parts/common/popup-state.hbs","systems/twodsix/templates/actors/parts/common/item-storage.hbs","systems/twodsix/templates/actors/parts/common/component-status.hbs","systems/twodsix/templates/actors/parts/common/armament-qty.hbs","systems/twodsix/templates/actors/parts/actor/actor-ucf.hbs","systems/twodsix/templates/actors/parts/actor/actor-stat-psi.hbs","systems/twodsix/templates/actors/parts/actor/actor-stat-1.hbs","systems/twodsix/templates/actors/parts/actor/actor-skills.hbs","systems/twodsix/templates/actors/parts/actor/actor-skill-item.hbs","systems/twodsix/templates/actors/parts/actor/actor-overlay-1.hbs","systems/twodsix/templates/actors/parts/actor/actor-npc-consumable.hbs","systems/twodsix/templates/actors/parts/actor/actor-notes.hbs","systems/twodsix/templates/actors/parts/actor/actor-movement.hbs","systems/twodsix/templates/actors/parts/actor/actor-items.hbs","systems/twodsix/templates/actors/parts/actor/actor-interface-bg.hbs","systems/twodsix/templates/actors/parts/actor/actor-info.hbs","systems/twodsix/templates/actors/parts/actor/actor-finances.hbs","systems/twodsix/templates/actors/parts/actor/actor-effects.hbs","systems/twodsix/templates/actors/parts/actor/actor-core-buttons.hbs","systems/twodsix/templates/actors/parts/actor/actor-consumable.hbs","systems/twodsix/templates/actors/parts/actor/actor-characteristics.hbs","systems/twodsix/templates/actors/parts/actor/actor-characteristics-table.hbs","systems/twodsix/templates/actors/parts/actor/actor-characteristics-rotate.hbs","systems/twodsix/templates/actors/parts/actor/actor-characteristics-atom.hbs","systems/twodsix/templates/actors/parts/actor/actor-bgi-std.hbs","systems/twodsix/templates/actors/parts/actor/actor-bgi-robot.hbs","systems/twodsix/templates/actors/parts/actor/actor-bgi-cd.hbs","systems/twodsix/templates/actors/parts/actor/actor-bgi-animal.hbs","systems/twodsix/templates/actors/parts/actor/actor-attachment-consumable-list.hbs","systems/twodsix/templates/actors/parts/actor/actor-animal-robot-protection.hbs","systems/twodsix/templates/actors/parts/actor/actor-animal-robot-damage.hbs"];
const hookScriptFiles = ["activeEffects","addGMControlButtons","autoCompleteIntegration","diceTrayIntegration","dragRulerIntegration","dropItemOnToken","hooks","itemPilesIntegration","ready","renderChatMessage","renderSettingsConfig","setup","timeIntegration","updateFinances"];

const CHARACTERISTICS = Object.freeze({
  "strength": "STR",
  "dexterity": "DEX",
  "endurance": "END",
  "intelligence": "INT",
  "education": "EDU",
  "socialStanding": "SOC",
  "psionicStrength": "PSI",
  "stamina": "STA",
  "lifeblood": "LFB",
  "alternative1": "ALT1",
  "alternative2": "ALT2",
  "alternative3": "ALT3",
  "morale": "MOR"
});
const DIFFICULTY_VARIANTS = Object.freeze({
  "CE": "CE",
  "CEL": "CEL",
  "AC": "AC",
  "CU": "CU",
  "Nomad": "Nomad"
});
const AUTOFIRE_VARIANTS = Object.freeze({
  "CE": "CE",
  "CEL": "CEL",
  "CT": "CT",
  "CU": "CU"
});
const RULESETS = Object.freeze({
  CT: {
    key: "CT",
    name: "Classic Traveller",
    settings: {
      initiativeFormula: "2d6 + @characteristics.dexterity.value/100",
      difficultyListUsed: "CE",
      difficultiesAsTargetNumber: false,
      autofireRulesUsed: "CT",
      modifierForZeroCharacteristic: 0,
      termForAdvantage: "advantage",
      termForDisadvantage: "disadvantage",
      absoluteBonusValueForEachTimeIncrement: 1,
      criticalNaturalAffectsEffect: false,
      absoluteCriticalEffectValue: 99,
      ShowLawLevel: true,
      rangeModifierType: "CT_Bands",
      ShowWeaponType: true,
      ShowDamageType: false,
      ShowRateOfFire: true,
      ShowRecoil: true,
      ShowDoubleTap: false,
      showLifebloodStamina: false,
      lifebloodInsteadOfCharacteristics: false,
      minorWoundsRollModifier: 0,
      seriousWoundsRollModifier: 0,
      mortgagePayment: 240,
      massProductionDiscount: "0.10",
      maxEncumbrance: "3000 * @characteristics.strength.value",
      defaultMovement: 25,
      defaultMovementUnits: "m",
      addEffectForShipDamage: false,
      unarmedDamage: "1d6",
      showTimeframe: false,
      showHullAndArmor: "armorHullStruc",
      showSpells: false,
      useNationality: false,
      animalsUseHits: false,
      robotsUseHits: false,
      animalsUseLocations: false,
      displayReactionMorale: true,
      showComponentRating: true,
      showComponentDM: true,
      encumbranceFraction: "0.33334",
      encumbranceModifier: -1,
      useDegreesOfSuccess: "none",
      targetDMList: "Cover (full) -4, Evade (short) -1, Evade (medium) -2, Evade (long) -4, Darkness (total) -9, Darkness (partial) -6",
      armorDamageFormula: "@damage",
      addEffectToDamage: false,
      addEffectToManualDamage: false,
      weightModifierForWornArmor: "0",
      chainBonus: "0, 0, 0, 0, 0, 0",
      psiTalentsRequireRoll: false,
      xd6RollStyle: false,
      shipWeaponType: "CT",
      shipDamageType: "CT"
    }
  },
  CE: {
    key: "CE",
    name: "Cepheus Engine",
    settings: {
      initiativeFormula: "2d6 + @characteristics.dexterity.mod",
      difficultyListUsed: "CE",
      difficultiesAsTargetNumber: false,
      autofireRulesUsed: "CE",
      modifierForZeroCharacteristic: -2,
      termForAdvantage: "advantage",
      termForDisadvantage: "disadvantage",
      absoluteBonusValueForEachTimeIncrement: 1,
      criticalNaturalAffectsEffect: false,
      absoluteCriticalEffectValue: 99,
      ShowLawLevel: true,
      rangeModifierType: "CE_Bands",
      ShowWeaponType: true,
      ShowDamageType: true,
      ShowRateOfFire: true,
      ShowRecoil: true,
      ShowDoubleTap: false,
      showLifebloodStamina: false,
      lifebloodInsteadOfCharacteristics: false,
      minorWoundsRollModifier: 0,
      seriousWoundsRollModifier: 0,
      mortgagePayment: 240,
      massProductionDiscount: "0.10",
      maxEncumbrance: "12 * @characteristics.strength.current",
      defaultMovement: 6,
      defaultMovementUnits: "m",
      addEffectForShipDamage: false,
      unarmedDamage: "1d6",
      showTimeframe: true,
      showHullAndArmor: "armorHullStruc",
      showSpells: false,
      useNationality: false,
      animalsUseHits: false,
      robotsUseHits: false,
      animalsUseLocations: false,
      displayReactionMorale: true,
      showComponentRating: true,
      showComponentDM: true,
      encumbranceFraction: "0.1667",
      encumbranceModifier: -1,
      useDegreesOfSuccess: "CE",
      targetDMList: "Aiming +1, Cover (half) -1, Cover (three quarter) -2, Cover (full) -4, Movement -1, Dodges -1, Prone (ranged) -2, Prone (melee) +2, Recoil in Zero G -2",
      armorDamageFormula: "@damage - @effectiveArmor",
      addEffectToDamage: true,
      weightModifierForWornArmor: "1",
      chainBonus: "-2, -1, -1, 1, 1, 2",
      psiTalentsRequireRoll: true,
      xd6RollStyle: false,
      shipWeaponType: "CE",
      shipDamageType: "component"
    }
  },
  CEL: {
    key: "CEL",
    name: "Cepheus Light",
    settings: {
      initiativeFormula: "2d6 + @skills.Tactics_",
      difficultyListUsed: "CEL",
      difficultiesAsTargetNumber: true,
      autofireRulesUsed: "CEL",
      ShowDoubleTap: true,
      modifierForZeroCharacteristic: -2,
      termForAdvantage: "advantage",
      termForDisadvantage: "disadvantage",
      absoluteBonusValueForEachTimeIncrement: 1,
      criticalNaturalAffectsEffect: true,
      absoluteCriticalEffectValue: 99,
      showLifebloodStamina: false,
      lifebloodInsteadOfCharacteristics: false,
      rangeModifierType: "doubleBand",
      minorWoundsRollModifier: 0,
      seriousWoundsRollModifier: 0,
      mortgagePayment: 240,
      massProductionDiscount: "0.10",
      maxEncumbrance: "3 * @characteristics.strength.value",
      defaultMovement: 9,
      defaultMovementUnits: "m",
      addEffectForShipDamage: false,
      unarmedDamage: "max(@characteristics.strength.mod, 1)",
      showTimeframe: false,
      showHullAndArmor: "threshold",
      showSpells: false,
      useNationality: false,
      animalsUseHits: false,
      robotsUseHits: false,
      animalsUseLocations: false,
      displayReactionMorale: false,
      showComponentRating: true,
      showComponentDM: true,
      encumbranceFraction: "0.334",
      encumbranceModifier: -1,
      useDegreesOfSuccess: "none",
      targetDMList: "Obscured -1, Cover (hard) -2, Cover (heavy) -3, Cover (total) -4, Running -1, Prone (ranged) -2, Darkness -2, Dim Light -1, Shield -1, Overwatch w/Shield -2",
      armorDamageFormula: "@damage - @effectiveArmor",
      addEffectToDamage: true,
      weightModifierForWornArmor: "1",
      chainBonus: "0, 0, 0, 0, 0, 0",
      psiTalentsRequireRoll: false,
      xd6RollStyle: false
    }
  },
  CEFTL: {
    key: "CEFTL",
    name: "Cepheus Faster Than Light",
    settings: {
      initiativeFormula: "2d6 + @skills.Tactics",
      difficultyListUsed: "CEL",
      difficultiesAsTargetNumber: true,
      autofireRulesUsed: "CEL",
      ShowDoubleTap: false,
      modifierForZeroCharacteristic: -2,
      termForAdvantage: "advantage",
      termForDisadvantage: "disadvantage",
      absoluteBonusValueForEachTimeIncrement: 1,
      criticalNaturalAffectsEffect: true,
      absoluteCriticalEffectValue: 99,
      showLifebloodStamina: false,
      lifebloodInsteadOfCharacteristics: false,
      rangeModifierType: "doubleBand",
      minorWoundsRollModifier: 0,
      seriousWoundsRollModifier: 0,
      maxEncumbrance: "0",
      defaultMovement: 10,
      defaultMovementUnits: "m",
      addEffectForShipDamage: false,
      unarmedDamage: "max(@characteristics.strength.mod, 1)",
      showTimeframe: false,
      showHullAndArmor: "threshold",
      showSpells: false,
      useNationality: false,
      animalsUseHits: false,
      robotsUseHits: false,
      animalsUseLocations: false,
      displayReactionMorale: false,
      showComponentRating: false,
      showComponentDM: false,
      encumbranceFraction: "0.334",
      encumbranceModifier: 0,
      useDegreesOfSuccess: "none",
      targetDMList: "Obscured -1, Cover (hard) -2, Cover (heavy) -3, Cover (total) -4, Running -1, Prone (ranged) -2, Darkness -2, Dim Light -1, Shield -1, Overwatch w/Shield -2",
      armorDamageFormula: "@damage - @effectiveArmor",
      addEffectToDamage: true,
      weightModifierForWornArmor: "1",
      chainBonus: "0, 0, 0, 0, 0, 0",
      psiTalentsRequireRoll: false,
      xd6RollStyle: false
    }
  },
  CEATOM: {
    key: "CEATOM",
    name: "Cepheus Atom",
    settings: {
      initiativeFormula: "2d6 + @skills.Combat",
      difficultyListUsed: "CEL",
      difficultiesAsTargetNumber: true,
      autofireRulesUsed: "CEL",
      ShowDoubleTap: false,
      modifierForZeroCharacteristic: -2,
      termForAdvantage: "advantage",
      termForDisadvantage: "disadvantage",
      absoluteBonusValueForEachTimeIncrement: 1,
      criticalNaturalAffectsEffect: true,
      absoluteCriticalEffectValue: 99,
      lifebloodInsteadOfCharacteristics: true,
      showLifebloodStamina: false,
      showContaminationBelowLifeblood: true,
      rangeModifierType: "doubleBand",
      minorWoundsRollModifier: -1,
      seriousWoundsRollModifier: -1,
      maxEncumbrance: "2 * @characteristics.endurance.value",
      defaultMovement: 10,
      defaultMovementUnits: "m",
      unarmedDamage: "max(@characteristics.strength.mod, 1)",
      showTimeframe: false,
      showHullAndArmor: "threshold",
      showSpells: false,
      useNationality: true,
      animalsUseHits: false,
      robotsUseHits: true,
      animalsUseLocations: true,
      displayReactionMorale: true,
      showComponentRating: false,
      showComponentDM: false,
      encumbranceFraction: "0.5",
      encumbranceModifier: 0,
      useDegreesOfSuccess: "none",
      targetDMList: "",
      armorDamageFormula: "@damage - @effectiveArmor",
      addEffectToDamage: true,
      weightModifierForWornArmor: "1",
      chainBonus: "0, 0, 0, 0, 0, 0",
      psiTalentsRequireRoll: false,
      xd6RollStyle: false
    }
  },
  BARBARIC: {
    key: "BARBARIC",
    name: "Barbaric!",
    settings: {
      initiativeFormula: "2d6 + @skills.Combat",
      difficultyListUsed: "CEL",
      difficultiesAsTargetNumber: true,
      autofireRulesUsed: "CE",
      ShowDoubleTap: false,
      modifierForZeroCharacteristic: -2,
      termForAdvantage: "advantage",
      termForDisadvantage: "disadvantage",
      absoluteBonusValueForEachTimeIncrement: 1,
      criticalNaturalAffectsEffect: true,
      absoluteCriticalEffectValue: 4,
      lifebloodInsteadOfCharacteristics: true,
      showLifebloodStamina: false,
      showContaminationBelowLifeblood: false,
      rangeModifierType: "doubleBand",
      minorWoundsRollModifier: -1,
      seriousWoundsRollModifier: -1,
      maxEncumbrance: "2 * @characteristics.endurance.value",
      defaultMovement: 10,
      defaultMovementUnits: "m",
      unarmedDamage: "1d6",
      showTimeframe: false,
      showSpells: true,
      useNationality: true,
      animalsUseHits: false,
      robotsUseHits: false,
      animalsUseLocations: true,
      displayReactionMorale: true,
      showComponentRating: false,
      showComponentDM: false,
      encumbranceFraction: "0.5",
      encumbranceModifier: 0,
      useDegreesOfSuccess: "none",
      targetDMList: "",
      armorDamageFormula: "@damage - @effectiveArmor",
      addEffectToDamage: true,
      weightModifierForWornArmor: "1",
      chainBonus: "0, 0, 0, 0, 0, 0",
      psiTalentsRequireRoll: false,
      xd6RollStyle: false
    }
  },
  CEQ: {
    key: "CEQ",
    name: "Cepheus Quantum",
    settings: {
      initiativeFormula: "1d1",
      difficultyListUsed: "CEL",
      difficultiesAsTargetNumber: true,
      autofireRulesUsed: "CE",
      ShowDoubleTap: false,
      modifierForZeroCharacteristic: -2,
      termForAdvantage: "advantage",
      termForDisadvantage: "disadvantage",
      absoluteBonusValueForEachTimeIncrement: 1,
      criticalNaturalAffectsEffect: false,
      absoluteCriticalEffectValue: 99,
      lifebloodInsteadOfCharacteristics: true,
      showLifebloodStamina: false,
      showContaminationBelowLifeblood: false,
      rangeModifierType: "doubleBand",
      minorWoundsRollModifier: 0,
      seriousWoundsRollModifier: 0,
      maxEncumbrance: "0",
      defaultMovement: 9,
      defaultMovementUnits: "m",
      addEffectForShipDamage: false,
      unarmedDamage: "max(@characteristics.strength.mod, 1)",
      showTimeframe: false,
      showHullAndArmor: "threshold",
      showSpells: false,
      useNationality: false,
      animalsUseHits: false,
      robotsUseHits: false,
      animalsUseLocations: false,
      displayReactionMorale: false,
      showComponentRating: false,
      showComponentDM: false,
      encumbranceFraction: "0.334",
      encumbranceModifier: 0,
      useDegreesOfSuccess: "none",
      targetDMList: "",
      armorDamageFormula: "@damage - @effectiveArmor",
      addEffectToDamage: true,
      chainBonus: "0, 0, 0, 0, 0, 0",
      psiTalentsRequireRoll: false,
      xd6RollStyle: false
    }
  },
  CD: {
    key: "CD",
    name: "Cepheus Deluxe",
    settings: {
      initiativeFormula: "2d6 + @skills.Tactics + @characteristics.intelligence.mod",
      difficultyListUsed: "CE",
      difficultiesAsTargetNumber: true,
      autofireRulesUsed: "CEL",
      ShowDoubleTap: true,
      modifierForZeroCharacteristic: -2,
      termForAdvantage: "advantage",
      termForDisadvantage: "disadvantage",
      absoluteBonusValueForEachTimeIncrement: 1,
      criticalNaturalAffectsEffect: true,
      absoluteCriticalEffectValue: 99,
      showLifebloodStamina: true,
      lifebloodInsteadOfCharacteristics: false,
      showContaminationBelowLifeblood: false,
      ShowLawLevel: false,
      rangeModifierType: "doubleBand",
      ShowWeaponType: true,
      ShowDamageType: false,
      ShowRateOfFire: true,
      ShowRecoil: true,
      minorWoundsRollModifier: -1,
      seriousWoundsRollModifier: -2,
      mortgagePayment: 320,
      massProductionDiscount: "0.10",
      maxEncumbrance: "3 * (7 + @characteristics.strength.mod)",
      defaultMovement: 10,
      defaultMovementUnits: "m",
      addEffectForShipDamage: false,
      unarmedDamage: "max(@characteristics.strength.mod, 1)",
      showTimeframe: false,
      showHullAndArmor: "armorOnly",
      showSpells: false,
      useNationality: false,
      animalsUseHits: false,
      robotsUseHits: false,
      animalsUseLocations: false,
      displayReactionMorale: true,
      showComponentRating: true,
      showComponentDM: true,
      encumbranceFraction: "0.334",
      encumbranceModifier: -2,
      useDegreesOfSuccess: "none",
      targetDMList: "Obscured -1, Cover (hard) -2, Cover (heavy) -3, Cover (total) -4, Running -1, Prone (ranged) -2, Darkness -2, Dim Light -1, Shield -1, Overwatch w/Shield -2",
      armorDamageFormula: "@damage - @effectiveArmor",
      addEffectToDamage: true,
      weightModifierForWornArmor: "1",
      chainBonus: "0, 0, 0, 1, 1, 1",
      reverseHealingOrder: true,
      psiTalentsRequireRoll: false,
      xd6RollStyle: false,
      shipWeaponType: "CD",
      shipDamageType: "surfaceInternal"
    }
  },
  CDEE: {
    key: "CDEE",
    name: "Cepheus Deluxe Enhanced Edition",
    settings: {
      initiativeFormula: "2d6 + @skills.Tactics + @characteristics.intelligence.mod",
      difficultyListUsed: "CE",
      difficultiesAsTargetNumber: true,
      autofireRulesUsed: "CEL",
      ShowDoubleTap: false,
      modifierForZeroCharacteristic: -2,
      termForAdvantage: "advantage",
      termForDisadvantage: "disadvantage",
      absoluteBonusValueForEachTimeIncrement: 1,
      criticalNaturalAffectsEffect: true,
      absoluteCriticalEffectValue: 99,
      showLifebloodStamina: true,
      lifebloodInsteadOfCharacteristics: false,
      showContaminationBelowLifeblood: false,
      ShowLawLevel: false,
      rangeModifierType: "doubleBand",
      ShowWeaponType: true,
      ShowDamageType: false,
      ShowRateOfFire: true,
      ShowRecoil: true,
      minorWoundsRollModifier: -1,
      seriousWoundsRollModifier: -2,
      mortgagePayment: 320,
      massProductionDiscount: "0.10",
      maxEncumbrance: "3 * (7 + @characteristics.strength.mod)",
      defaultMovement: 10,
      defaultMovementUnits: "m",
      addEffectForShipDamage: false,
      unarmedDamage: "max(@characteristics.strength.mod, 1)",
      showTimeframe: false,
      showHullAndArmor: "armorOnly",
      showSpells: false,
      useNationality: false,
      animalsUseHits: false,
      robotsUseHits: false,
      animalsUseLocations: false,
      displayReactionMorale: true,
      showComponentRating: true,
      showComponentDM: true,
      encumbranceFraction: "0.334",
      encumbranceModifier: -2,
      useDegreesOfSuccess: "none",
      targetDMList: "Obscured -1, Cover (hard) -2, Cover (heavy) -3, Cover (total) -4, Running -1, Prone (ranged) -2, Darkness -2, Dim Light -1, Shield -1, Overwatch w/Shield -2",
      armorDamageFormula: "@damage - @effectiveArmor",
      addEffectToDamage: true,
      weightModifierForWornArmor: "1",
      chainBonus: "0, 0, 0, 1, 1, 1",
      reverseHealingOrder: true,
      psiTalentsRequireRoll: false,
      xd6RollStyle: false,
      shipWeaponType: "CD",
      shipDamageType: "surfaceInternal"
    }
  },
  CLU: {
    key: "CLU",
    name: "Cepheus Light Upgraded",
    settings: {
      initiativeFormula: "2d6 + @skills.Tactics + @characteristics.intelligence.mod",
      difficultyListUsed: "CE",
      difficultiesAsTargetNumber: true,
      autofireRulesUsed: "CEL",
      ShowDoubleTap: true,
      modifierForZeroCharacteristic: -2,
      termForAdvantage: "advantage",
      termForDisadvantage: "disadvantage",
      absoluteBonusValueForEachTimeIncrement: 1,
      criticalNaturalAffectsEffect: true,
      absoluteCriticalEffectValue: 99,
      showLifebloodStamina: true,
      lifebloodInsteadOfCharacteristics: false,
      showContaminationBelowLifeblood: false,
      ShowLawLevel: false,
      rangeModifierType: "doubleBand",
      ShowWeaponType: true,
      ShowDamageType: false,
      ShowRateOfFire: true,
      ShowRecoil: true,
      minorWoundsRollModifier: -1,
      seriousWoundsRollModifier: -2,
      mortgagePayment: 320,
      massProductionDiscount: "0.10",
      maxEncumbrance: "3*(7 + @characteristics.strength.mod)",
      defaultMovement: 10,
      defaultMovementUnits: "m",
      addEffectForShipDamage: false,
      unarmedDamage: "max(@characteristics.strength.mod, 1)",
      showTimeframe: false,
      showHullAndArmor: "armorOnly",
      showSpells: false,
      useNationality: false,
      animalsUseHits: false,
      robotsUseHits: false,
      animalsUseLocations: false,
      displayReactionMorale: true,
      showComponentRating: true,
      showComponentDM: true,
      encumbranceFraction: "0.334",
      encumbranceModifier: -2,
      useDegreesOfSuccess: "none",
      targetDMList: "Obscured -1, Cover (hard) -2, Cover (heavy) -3, Cover (total) -4, Running -1, Prone (ranged) -2, Darkness -2, Dim Light -1, Shield -1, Overwatch w/Shield -2",
      armorDamageFormula: "@damage - @effectiveArmor",
      addEffectToDamage: true,
      weightModifierForWornArmor: "1",
      chainBonus: "0, 0, 0, 1, 1, 1",
      reverseHealingOrder: true,
      psiTalentsRequireRoll: false,
      xd6RollStyle: false,
      shipWeaponType: "CD",
      shipDamageType: "surfaceInternal"
    }
  },
  SOC: {
    key: "SOC",
    name: "The Sword of Cepheus",
    settings: {
      initiativeFormula: "2d6 + @skills.Tactics",
      difficultyListUsed: "CEL",
      difficultiesAsTargetNumber: true,
      autofireRulesUsed: "CE",
      ShowDoubleTap: false,
      modifierForZeroCharacteristic: -2,
      termForAdvantage: "advantage",
      termForDisadvantage: "disadvantage",
      absoluteBonusValueForEachTimeIncrement: 1,
      criticalNaturalAffectsEffect: true,
      absoluteCriticalEffectValue: 99,
      showLifebloodStamina: false,
      lifebloodInsteadOfCharacteristics: false,
      showContaminationBelowLifeblood: false,
      ShowLawLevel: false,
      rangeModifierType: "doubleBand",
      ShowWeaponType: true,
      ShowDamageType: false,
      ShowRateOfFire: true,
      ShowRecoil: true,
      minorWoundsRollModifier: -1,
      seriousWoundsRollModifier: -2,
      mortgagePayment: 240,
      massProductionDiscount: "0.10",
      maxEncumbrance: "3*(@characteristics.strength.value)",
      defaultMovement: 10,
      defaultMovementUnits: "m",
      addEffectForShipDamage: false,
      unarmedDamage: "max(@characteristics.strength.mod, 1)",
      showTimeframe: false,
      showHullAndArmor: "armorOnly",
      showSpells: true,
      useNationality: true,
      animalsUseHits: false,
      robotsUseHits: false,
      animalsUseLocations: false,
      displayReactionMorale: true,
      showComponentRating: false,
      showComponentDM: false,
      encumbranceFraction: "0.334",
      encumbranceModifier: -1,
      useDegreesOfSuccess: "none",
      targetDMList: "Obscured -1, Cover (good) -2, Cover (heavy) -3, Cover (total) -4, Running -1, Prone (ranged) -2, Darkness -2, Dim Light -1, Shield -1",
      armorDamageFormula: "@damage - @effectiveArmor",
      addEffectToDamage: true,
      weightModifierForWornArmor: "1",
      chainBonus: "0, 0, 0, 0, 0, 0",
      xd6RollStyle: false
    }
  },
  AC: {
    key: "AC",
    name: "Alpha Cephei",
    settings: {
      initiativeFormula: "2d6 + @skills.Tactics",
      difficultyListUsed: "AC",
      difficultiesAsTargetNumber: true,
      autofireRulesUsed: "CEL",
      ShowDoubleTap: true,
      modifierForZeroCharacteristic: -2,
      termForAdvantage: "advantage",
      termForDisadvantage: "disadvantage",
      absoluteBonusValueForEachTimeIncrement: 1,
      criticalNaturalAffectsEffect: true,
      absoluteCriticalEffectValue: 99,
      showLifebloodStamina: false,
      lifebloodInsteadOfCharacteristics: false,
      rangeModifierType: "doubleBand",
      minorWoundsRollModifier: 0,
      seriousWoundsRollModifier: 0,
      mortgagePayment: 240,
      massProductionDiscount: "0.10",
      maxEncumbrance: "3*(@characteristics.strength.value)",
      defaultMovement: 6,
      defaultMovementUnits: "m",
      addEffectForShipDamage: false,
      unarmedDamage: "max(@characteristics.strength.mod, 1)",
      showTimeframe: false,
      showHullAndArmor: "threshold",
      showSpells: false,
      useNationality: false,
      animalsUseHits: false,
      robotsUseHits: false,
      animalsUseLocations: false,
      displayReactionMorale: false,
      showComponentRating: true,
      showComponentDM: true,
      encumbranceFraction: "0.334",
      encumbranceModifier: -1,
      useDegreesOfSuccess: "none",
      targetDMList: "Aim +1, Obscured -1, Cover (hard) -2, Cover (heavy) -3, Cover (total) -4, Running -1, Prone (ranged) -2, Prone (melee) +1, Darkness -3, Dim Light -1, Shield -1, Overwatch w/shield -2, Behind someone (if missed, 50% chance of hitting other) -2",
      armorDamageFormula: "@damage - @effectiveArmor",
      addEffectToDamage: true,
      weightModifierForWornArmor: "1",
      chainBonus: "0, 0, 0, 0, 0, 0",
      psiTalentsRequireRoll: false,
      xd6RollStyle: false,
      shipWeaponType: "AC",
      shipDamageType: "AC"
    }
  },
  CU: {
    key: "CU",
    name: "Cepheus Universal",
    settings: {
      initiativeFormula: "2d6 + min( 1, max( @skills.Tactics, 0)) + min( 1, max( @skills.Recon, 0))",
      difficultyListUsed: "CU",
      difficultiesAsTargetNumber: false,
      autofireRulesUsed: "CU",
      modifierForZeroCharacteristic: -2,
      termForAdvantage: "advantage",
      termForDisadvantage: "disadvantage",
      absoluteBonusValueForEachTimeIncrement: 1,
      criticalNaturalAffectsEffect: false,
      absoluteCriticalEffectValue: 99,
      ShowLawLevel: false,
      rangeModifierType: "CU_Bands",
      ShowWeaponType: true,
      ShowDamageType: true,
      ShowRateOfFire: true,
      ShowRecoil: false,
      ShowDoubleTap: false,
      showLifebloodStamina: false,
      lifebloodInsteadOfCharacteristics: false,
      minorWoundsRollModifier: 0,
      seriousWoundsRollModifier: 0,
      mortgagePayment: 240,
      massProductionDiscount: "0.10",
      maxEncumbrance: "6 * @characteristics.strength.current",
      defaultMovement: 6,
      defaultMovementUnits: "m",
      addEffectForShipDamage: false,
      unarmedDamage: "1d6 + min( 1, max( -1, @characteristics.strength.mod))",
      showTimeframe: true,
      showHullAndArmor: "armorHullStruc",
      showSpells: false,
      useNationality: false,
      animalsUseHits: false,
      robotsUseHits: false,
      animalsUseLocations: false,
      displayReactionMorale: true,
      showComponentRating: true,
      showComponentDM: true,
      encumbranceFraction: "0.3334",
      encumbranceModifier: -1,
      useDegreesOfSuccess: "CE",
      targetDMList: "Aiming +1, Aiming w/scope +2, Cover (partial) -3, Movement -1, Dodges -1, Frenzy Fire -2, Into Hand-to-Hand -2",
      armorDamageFormula: "@damage - @effectiveArmor",
      addEffectToDamage: true,
      weightModifierForWornArmor: "1",
      chainBonus: "-2, -1, -1, 1, 1, 2",
      psiTalentsRequireRoll: false,
      xd6RollStyle: false,
      shipWeaponType: "CE",
      shipDamageType: "CU"
    }
  },
  OTHER: {
    key: "OTHER",
    name: "Other",
    settings: {
      useDegreesOfSuccess: "other",
      rangeModifierType: "singleBand",
      armorDamageFormula: "@damage - @effectiveArmor",
      chainBonus: "-3, -2, -1, 1, 2, 3",
      xd6RollStyle: false
    }
  }
});
const ROLLTYPES = Object.freeze({
  Advantage: { key: "Advantage", formula: "3d6kh2" },
  Normal: { key: "Normal", formula: "2d6" },
  Disadvantage: { key: "Disadvantage", formula: "3d6kl2" }
});
const WeightlessItems = ["skills", "trait", "spell", "psiAbility"];
const CONSUMABLES = Object.freeze({
  air: "TWODSIX.Items.Consumable.Types.air",
  drugs: "TWODSIX.Items.Consumable.Types.drugs",
  food: "TWODSIX.Items.Consumable.Types.food",
  fuel: "TWODSIX.Items.Consumable.Types.fuel",
  magazine: "TWODSIX.Items.Consumable.Types.magazine",
  power_cell: "TWODSIX.Items.Consumable.Types.power_cell",
  software: "TWODSIX.Items.Consumable.Types.software",
  processor: "TWODSIX.Items.Consumable.Types.processor",
  suite: "TWODSIX.Items.Consumable.Types.suite",
  other: "TWODSIX.Items.Consumable.Types.other"
});
const DIFFICULTIES = Object.freeze({
  CE: {
    Simple: { mod: 6, target: 2 },
    Easy: { mod: 4, target: 4 },
    Routine: { mod: 2, target: 6 },
    Average: { mod: 0, target: 8 },
    Difficult: { mod: -2, target: 10 },
    VeryDifficult: { mod: -4, target: 12 },
    Formidable: { mod: -6, target: 14 },
    Impossible: { mod: -8, target: 16 }
  },
  CEL: {
    Routine: { mod: 2, target: 4 },
    Average: { mod: 0, target: 6 },
    Difficult: { mod: -2, target: 8 },
    VeryDifficult: { mod: -4, target: 10 },
    Formidable: { mod: -6, target: 12 }
  },
  AC: {
    Routine: { mod: 2, target: 4 },
    Simple: { mod: 0, target: 6 },
    Average: { mod: -2, target: 8 },
    Difficult: { mod: -4, target: 10 },
    VeryDifficult: { mod: -6, target: 12 },
    Formidable: { mod: -8, target: 14 },
    Impossible: { mod: -10, target: 16 }
  },
  CU: {
    Easy: { mod: 4, target: 4 },
    Routine: { mod: 2, target: 6 },
    Average: { mod: 0, target: 8 },
    Difficult: { mod: -2, target: 10 },
    VeryDifficult: { mod: -4, target: 12 },
    Formidable: { mod: -6, target: 14 }
  },
  Nomad: {
    Easy: { mod: 1, target: 7 },
    Average: { mod: 0, target: 8 },
    Difficult: { mod: -1, target: 9 },
    Formidable: { mod: -2, target: 10 },
    Impossible: { mod: -4, target: 12 }
  }
});
const SHIP_ACTION_TYPE = Object.freeze({
  skillRoll: "skillRoll",
  chatMessage: "chatMessage",
  fireEnergyWeapons: "fireEnergyWeapons",
  executeMacro: "executeMacro"
});
const MovementTypes = {
  burrow: "TWODSIX.Actor.Movement.MovementBurrow",
  climb: "TWODSIX.Actor.Movement.MovementClimb",
  fly: "TWODSIX.Actor.Movement.MovementFly",
  swim: "TWODSIX.Actor.Movement.MovementSwim",
  walk: "TWODSIX.Actor.Movement.MovementWalk",
  hover: "TWODSIX.Actor.Movement.MovementHover"
};
const MovementUnits = {
  ft: "TWODSIX.Actor.Movement.DistFt",
  mi: "TWODSIX.Actor.Movement.DistMi",
  m: "TWODSIX.Actor.Movement.DistM",
  km: "TWODSIX.Actor.Movement.DistKm",
  pc: "TWODSIX.Actor.Movement.DistPc",
  gu: "TWODSIX.Actor.Movement.DistGU"
};
const areaTargetTypes = {
  none: {
    label: "TWODSIX.Target.None",
    template: ""
  },
  radius: {
    label: "TWODSIX.Target.Radius",
    template: "circle"
  },
  sphere: {
    label: "TWODSIX.Target.Sphere",
    template: "circle"
  },
  cylinder: {
    label: "TWODSIX.Target.Cylinder",
    template: "circle"
  },
  cone: {
    label: "TWODSIX.Target.Cone",
    template: "cone"
  },
  square: {
    label: "TWODSIX.Target.Square",
    template: "rect"
  },
  cube: {
    label: "TWODSIX.Target.Cube",
    template: "rect"
  },
  line: {
    label: "TWODSIX.Target.Line",
    template: "ray"
  },
  wall: {
    label: "TWODSIX.Target.Wall",
    template: "ray"
  }
};
const PricingOptions = {
  perUnit: "TWODSIX.Items.Component.perUnit",
  perCompTon: "TWODSIX.Items.Component.perCompTon",
  perHullTon: "TWODSIX.Items.Component.perHullTon",
  per100HullTon: "TWODSIX.Items.Component.per100HullTon",
  pctHull: "TWODSIX.Items.Component.pctHull",
  pctHullPerUnit: "TWODSIX.Items.Component.pctHullPerUnit"
};
const PowerOptions = {
  perUnit: "TWODSIX.Items.Component.powerPerUnit",
  perCompTon: "TWODSIX.Items.Component.powerPerCompTon",
  perHullTon: "TWODSIX.Items.Component.powerPerHullTon"
};
const HullPricingOptions = {
  perUnit: "TWODSIX.Items.Component.perUnit",
  perCompTon: "TWODSIX.Items.Component.perCompTon",
  perHullTon: "TWODSIX.Items.Component.perHullTon",
  per100HullTon: "TWODSIX.Items.Component.per100HullTon"
};
const CharacteristicDisplayTypes = {
  core: "TWODSIX.Actor.CharDisplay.Core",
  base: "TWODSIX.Actor.CharDisplay.Base",
  alternate: "TWODSIX.Actor.CharDisplay.Alternate",
  all: "TWODSIX.Actor.CharDisplay.All"
};
const ComponentStates = {
  operational: "TWODSIX.Items.Component.operational",
  damaged: "TWODSIX.Items.Component.damaged",
  destroyed: "TWODSIX.Items.Component.destroyed",
  off: "TWODSIX.Items.Component.off"
};
const ComponentTypes = {
  accomodations: "TWODSIX.Items.Component.accomodations",
  ammo: "TWODSIX.Items.Component.ammo",
  armament: "TWODSIX.Items.Component.armament",
  armor: "TWODSIX.Items.Component.armor",
  bridge: "TWODSIX.Items.Component.bridge",
  cargo: "TWODSIX.Items.Component.cargo",
  computer: "TWODSIX.Items.Component.computer",
  dock: "TWODSIX.Items.Component.dock",
  drive: "TWODSIX.Items.Component.drive",
  drone: "TWODSIX.Items.Component.drone",
  electronics: "TWODSIX.Items.Component.electronics",
  fuel: "TWODSIX.Items.Component.fuel",
  hull: "TWODSIX.Items.Component.hull",
  mount: "TWODSIX.Items.Component.mount",
  other: "TWODSIX.Items.Component.other",
  otherExternal: "TWODSIX.Items.Component.otherExternal",
  otherInternal: "TWODSIX.Items.Component.otherInternal",
  power: "TWODSIX.Items.Component.power",
  sensor: "TWODSIX.Items.Component.sensor",
  shield: "TWODSIX.Items.Component.shield",
  software: "TWODSIX.Items.Component.software",
  storage: "TWODSIX.Items.Component.storage",
  vehicle: "TWODSIX.Items.Component.vehicle"
};
const ShipWeaponTypes = {
  CT: {
    pulseLaser: "TWODSIX.Items.Component.PulseLaser",
    beamLaser: "TWODSIX.Items.Component.BeamLaser",
    missiles: "TWODSIX.Items.Component.Missiles",
    sandcaster: "TWODSIX.Items.Component.Sandcaster",
    other: "TWODSIX.Items.Component.Other"
  },
  CD: {
    light: "TWODSIX.Items.Component.Light",
    intermediate: "TWODSIX.Items.Component.Intermediate",
    heavy: "TWODSIX.Items.Component.Heavy",
    main: "TWODSIX.Items.Component.Main",
    //mesonGun: "TWODSIX.Items.Component.MesonGun",
    //graviticDisruptor: "TWODSIX.Items.Component.GraviticDisruptor",
    missiles: "TWODSIX.Items.Component.Missiles",
    nuclearMissiles: "TWODSIX.Items.Component.NuclearMissiles",
    torpedoes: "TWODSIX.Items.Component.Torpedoes",
    sandcaster: "TWODSIX.Items.Component.Sandcaster",
    special: "TWODSIX.Items.Component.Special",
    other: "TWODSIX.Items.Component.Other"
  },
  CE: {
    pulseLaser: "TWODSIX.Items.Component.PulseLaser",
    beamLaser: "TWODSIX.Items.Component.BeamLaser",
    particleBeam: "TWODSIX.Items.Component.ParticleBeam",
    fusionGun: "TWODSIX.Items.Component.FusionGun",
    mesonGun: "TWODSIX.Items.Component.MesonGun",
    missiles: "TWODSIX.Items.Component.Missiles",
    nuclearMissiles: "TWODSIX.Items.Component.NuclearMissiles",
    torpedoes: "TWODSIX.Items.Component.Torpedoes",
    sandcaster: "TWODSIX.Items.Component.Sandcaster",
    special: "TWODSIX.Items.Component.Special",
    other: "TWODSIX.Items.Component.Other"
  },
  AC: {
    pulseLaser: "TWODSIX.Items.Component.PulseLaser",
    beamLaser: "TWODSIX.Items.Component.BeamLaser",
    particleBeam: "TWODSIX.Items.Component.ParticleBeam",
    particleCluster: "TWODSIX.Items.Component.ParticleCluster",
    fusionGun: "TWODSIX.Items.Component.FusionGun",
    fusionBeam: "TWODSIX.Items.Component.FusionBeam",
    garviticLance: "TWODSIX.Items.Component.GraviticLance",
    mesonGun: "TWODSIX.Items.Component.MesonGun",
    missiles: "TWODSIX.Items.Component.Missiles",
    plasmaBeam: "TWODSIX.Items.Component.PlasmaBeam",
    nuclearMissiles: "TWODSIX.Items.Component.NuclearMissiles",
    sandcaster: "TWODSIX.Items.Component.Sandcaster",
    special: "TWODSIX.Items.Component.Special",
    other: "TWODSIX.Items.Component.Other"
  }
};
const ShipArmorTypesCD = {
  unarmored: "TWODSIX.Ship.ArmorCD.Unarmored",
  light: "TWODSIX.Ship.ArmorCD.Light",
  heavy: "TWODSIX.Ship.ArmorCD.Heavy",
  massive: "TWODSIX.Ship.ArmorCD.Massive"
};
const ShipDamageRules = {
  component: "TWODSIX.Ship.DamageStyle.Component",
  hullWCrit: "TWODSIX.Ship.DamageStyle.HullWithCrit",
  hullOnly: "TWODSIX.Ship.DamageStyle.HullOnly",
  surfaceInternal: "TWODSIX.Ship.DamageStyle.SurfaceOrInternal",
  CT: "TWODSIX.Ship.DamageStyle.ClassicTraveller",
  AC: "TWODSIX.Ship.DamageStyle.AlphaCephei",
  CU: "TWODSIX.Ship.DamageStyle.CepheusUniversal"
};
const TimeUnits = {
  none: "TWODSIX.Actor.Skills.Timeframe.none",
  sec: "TWODSIX.Actor.Skills.Timeframe.secs",
  min: "TWODSIX.Actor.Skills.Timeframe.mins",
  hrs: "TWODSIX.Actor.Skills.Timeframe.hrs",
  days: "TWODSIX.Actor.Skills.Timeframe.days",
  weeks: "TWODSIX.Actor.Skills.Timeframe.weeks",
  months: "TWODSIX.Actor.Skills.Timeframe.months",
  rounds: "TWODSIX.Actor.Skills.Timeframe.rounds"
};
const VehicleProtection = {
  armorOnly: "TWODSIX.Vehicle.ProtectionType.ArmorOnly",
  threshold: "TWODSIX.Vehicle.ProtectionType.Threshold",
  armorHullStruc: "TWODSIX.Vehicle.ProtectionType.ArmorHullStruc",
  detailedArmor: "TWODSIX.Vehicle.ProtectionType.DetailedArmor"
};
const AnimalNiche = {
  herbivore: "TWODSIX.Animal.NicheType.Herbivore",
  omnivore: "TWODSIX.Animal.NicheType.Omnivore",
  carnivore: "TWODSIX.Animal.NicheType.Carnivore",
  scavenger: "TWODSIX.Animal.NicheType.Scavenger",
  other: "TWODSIX.Animal.NicheType.Other"
};
const HerbivoreType = {
  filter: "TWODSIX.Animal.Subtype.Filter",
  intermittent: "TWODSIX.Animal.Subtype.Intermittent",
  grazer: "TWODSIX.Animal.Subtype.Grazer"
};
const OmnivoreType = {
  gatherer: "TWODSIX.Animal.Subtype.Gatherer",
  hunter: "TWODSIX.Animal.Subtype.Hunter",
  eater: "TWODSIX.Animal.Subtype.Eater"
};
const CarnivoreType = {
  pouncer: "TWODSIX.Animal.Subtype.Pouncer",
  chaser: "TWODSIX.Animal.Subtype.Chaser",
  trapper: "TWODSIX.Animal.Subtype.Trapper",
  siren: "TWODSIX.Animal.Subtype.Siren",
  killer: "TWODSIX.Animal.Subtype.Killer"
};
const ScavengerType = {
  hijacker: "TWODSIX.Animal.Subtype.Hijacker",
  intimidator: "TWODSIX.Animal.Subtype.Intimidator",
  carrionEater: "TWODSIX.Animal.Subtype.CarrionEater",
  reducer: "TWODSIX.Animal.Subtype.Reducer"
};
const AnimalLocations = {
  city: "TWODSIX.Animal.Locations.CityUrban",
  plains: "TWODSIX.Animal.Locations.PlainsGrassland",
  hills: "TWODSIX.Animal.Locations.HillsMountains",
  desert: "TWODSIX.Animal.Locations.DesertBadlands",
  swamp: "TWODSIX.Animal.Locations.SwampAquatic",
  forest: "TWODSIX.Animal.Locations.ForestJungle"
};
const SuccessTypes = {
  none: "TWODSIX.Chat.Roll.DegreesOfSuccess.none",
  CE: "TWODSIX.Chat.Roll.DegreesOfSuccess.CE",
  other: "TWODSIX.Chat.Roll.DegreesOfSuccess.other"
};
const AllAnimalTypes = Object.assign({}, HerbivoreType, OmnivoreType, CarnivoreType, ScavengerType);
const EQUIPPED_STATES = {
  backpack: "TWODSIX.Actor.Items.LocationState.backpack",
  equipped: "TWODSIX.Actor.Items.LocationState.equipped",
  vehicle: "TWODSIX.Actor.Items.LocationState.vehicle",
  ship: "TWODSIX.Actor.Items.LocationState.ship",
  base: "TWODSIX.Actor.Items.LocationState.base"
};
const EQUIPPED_TOGGLE_OPTIONS = {
  core: "TWODSIX.Actor.Items.LocationState.core",
  default: "TWODSIX.Actor.Items.LocationState.default",
  all: "TWODSIX.Actor.Items.LocationState.all"
};
const RANGE_MODIFIERS_TYPES = {
  none: "TWODSIX.Chat.Roll.RangeModifierTypes.none",
  CT_Bands: "TWODSIX.Chat.Roll.RangeModifierTypes.CT_Bands",
  CE_Bands: "TWODSIX.Chat.Roll.RangeModifierTypes.CE_Bands",
  CU_Bands: "TWODSIX.Chat.Roll.RangeModifierTypes.CU_Bands",
  singleBand: "TWODSIX.Chat.Roll.RangeModifierTypes.singleBand",
  doubleBand: "TWODSIX.Chat.Roll.RangeModifierTypes.doubleBand"
};
const CE_WEAPON_RANGE_TYPES = {
  long: {
    closeQuarters: "TWODSIX.Chat.Roll.WeaponRangeTypes.closeQuarters",
    extendedReach: "TWODSIX.Chat.Roll.WeaponRangeTypes.extendedReach",
    thrown: "TWODSIX.Chat.Roll.WeaponRangeTypes.thrown",
    pistol: "TWODSIX.Chat.Roll.WeaponRangeTypes.pistol",
    rifle: "TWODSIX.Chat.Roll.WeaponRangeTypes.rifle",
    shotgun: "TWODSIX.Chat.Roll.WeaponRangeTypes.shotgun",
    assaultWeapon: "TWODSIX.Chat.Roll.WeaponRangeTypes.assaultWeapon",
    rocket: "TWODSIX.Chat.Roll.WeaponRangeTypes.rocket",
    none: "TWODSIX.Chat.Roll.WeaponRangeTypes.none"
  },
  short: {
    closeQuarters: "TWODSIX.Chat.Roll.WeaponRangeTypes.CQ",
    extendedReach: "TWODSIX.Chat.Roll.WeaponRangeTypes.reach",
    thrown: "TWODSIX.Chat.Roll.WeaponRangeTypes.thrown",
    pistol: "TWODSIX.Chat.Roll.WeaponRangeTypes.pistol",
    rifle: "TWODSIX.Chat.Roll.WeaponRangeTypes.rifle",
    shotgun: "TWODSIX.Chat.Roll.WeaponRangeTypes.shotgun",
    assaultWeapon: "TWODSIX.Chat.Roll.WeaponRangeTypes.AW",
    rocket: "TWODSIX.Chat.Roll.WeaponRangeTypes.rocket",
    none: "TWODSIX.Chat.Roll.WeaponRangeTypes.none"
  }
};
const CU_WEAPON_RANGE_TYPES = {
  long: {
    personal: "TWODSIX.Chat.Roll.WeaponRangeTypes.personal",
    close: "TWODSIX.Chat.Roll.WeaponRangeTypes.close",
    short: "TWODSIX.Chat.Roll.WeaponRangeTypes.short",
    medium: "TWODSIX.Chat.Roll.WeaponRangeTypes.medium",
    shotgun: "TWODSIX.Chat.Roll.WeaponRangeTypes.shotgun",
    thrown: "TWODSIX.Chat.Roll.WeaponRangeTypes.thrown",
    long: "TWODSIX.Chat.Roll.WeaponRangeTypes.long",
    veryLong: "TWODSIX.Chat.Roll.WeaponRangeTypes.veryLong",
    distant: "TWODSIX.Chat.Roll.WeaponRangeTypes.distant",
    none: "TWODSIX.Chat.Roll.WeaponRangeTypes.none"
  },
  short: {
    personal: "TWODSIX.Chat.Roll.WeaponRangeTypes.pers",
    close: "TWODSIX.Chat.Roll.WeaponRangeTypes.close",
    short: "TWODSIX.Chat.Roll.WeaponRangeTypes.short",
    medium: "TWODSIX.Chat.Roll.WeaponRangeTypes.medium",
    shotgun: "TWODSIX.Chat.Roll.WeaponRangeTypes.shotgun",
    thrown: "TWODSIX.Chat.Roll.WeaponRangeTypes.thr",
    long: "TWODSIX.Chat.Roll.WeaponRangeTypes.long",
    veryLong: "TWODSIX.Chat.Roll.WeaponRangeTypes.vLong",
    distant: "TWODSIX.Chat.Roll.WeaponRangeTypes.dist",
    none: "TWODSIX.Chat.Roll.WeaponRangeTypes.none"
  }
};
const CT_WEAPON_RANGE_TYPES = {
  long: {
    hands: "TWODSIX.Chat.Roll.WeaponRangeTypes.hands",
    claws: "TWODSIX.Chat.Roll.WeaponRangeTypes.claws",
    teeth: "TWODSIX.Chat.Roll.WeaponRangeTypes.teeth",
    horns: "TWODSIX.Chat.Roll.WeaponRangeTypes.horns",
    hooves: "TWODSIX.Chat.Roll.WeaponRangeTypes.hooves",
    stinger: "TWODSIX.Chat.Roll.WeaponRangeTypes.stinger",
    thrasher: "TWODSIX.Chat.Roll.WeaponRangeTypes.thrasher",
    club: "TWODSIX.Chat.Roll.WeaponRangeTypes.club",
    dagger: "TWODSIX.Chat.Roll.WeaponRangeTypes.dagger",
    blade: "TWODSIX.Chat.Roll.WeaponRangeTypes.blade",
    foil: "TWODSIX.Chat.Roll.WeaponRangeTypes.foil",
    cutlass: "TWODSIX.Chat.Roll.WeaponRangeTypes.cutlass",
    sword: "TWODSIX.Chat.Roll.WeaponRangeTypes.sword",
    broadsword: "TWODSIX.Chat.Roll.WeaponRangeTypes.broadsword",
    bayonet: "TWODSIX.Chat.Roll.WeaponRangeTypes.bayonet",
    spear: "TWODSIX.Chat.Roll.WeaponRangeTypes.spear",
    halberd: "TWODSIX.Chat.Roll.WeaponRangeTypes.halberd",
    pike: "TWODSIX.Chat.Roll.WeaponRangeTypes.pike",
    cudgel: "TWODSIX.Chat.Roll.WeaponRangeTypes.cudgel",
    bodyPistol: "TWODSIX.Chat.Roll.WeaponRangeTypes.bodyPistol",
    autoPistol: "TWODSIX.Chat.Roll.WeaponRangeTypes.autoPistol",
    revolver: "TWODSIX.Chat.Roll.WeaponRangeTypes.revolver",
    carbine: "TWODSIX.Chat.Roll.WeaponRangeTypes.carbine",
    rifle: "TWODSIX.Chat.Roll.WeaponRangeTypes.rifle",
    autoRifle: "TWODSIX.Chat.Roll.WeaponRangeTypes.autoRifle",
    shotgun: "TWODSIX.Chat.Roll.WeaponRangeTypes.shotgun",
    submachinegun: "TWODSIX.Chat.Roll.WeaponRangeTypes.submachinegun",
    laserCarbine: "TWODSIX.Chat.Roll.WeaponRangeTypes.laserCarbine",
    laserRifle: "TWODSIX.Chat.Roll.WeaponRangeTypes.laserRifle",
    custom: "TWODSIX.Chat.Roll.WeaponRangeTypes.custom",
    none: "TWODSIX.Chat.Roll.WeaponRangeTypes.none"
  },
  short: {
    hands: "TWODSIX.Chat.Roll.WeaponRangeTypes.hands",
    claws: "TWODSIX.Chat.Roll.WeaponRangeTypes.claws",
    teeth: "TWODSIX.Chat.Roll.WeaponRangeTypes.teeth",
    horns: "TWODSIX.Chat.Roll.WeaponRangeTypes.horns",
    hooves: "TWODSIX.Chat.Roll.WeaponRangeTypes.hooves",
    stinger: "TWODSIX.Chat.Roll.WeaponRangeTypes.stinger",
    thrasher: "TWODSIX.Chat.Roll.WeaponRangeTypes.thras",
    club: "TWODSIX.Chat.Roll.WeaponRangeTypes.club",
    dagger: "TWODSIX.Chat.Roll.WeaponRangeTypes.dagger",
    blade: "TWODSIX.Chat.Roll.WeaponRangeTypes.blade",
    foil: "TWODSIX.Chat.Roll.WeaponRangeTypes.foil",
    cutlass: "TWODSIX.Chat.Roll.WeaponRangeTypes.cutl",
    sword: "TWODSIX.Chat.Roll.WeaponRangeTypes.sword",
    broadsword: "TWODSIX.Chat.Roll.WeaponRangeTypes.brdswd",
    bayonet: "TWODSIX.Chat.Roll.WeaponRangeTypes.bynt",
    spear: "TWODSIX.Chat.Roll.WeaponRangeTypes.spear",
    halberd: "TWODSIX.Chat.Roll.WeaponRangeTypes.halb",
    pike: "TWODSIX.Chat.Roll.WeaponRangeTypes.pike",
    cudgel: "TWODSIX.Chat.Roll.WeaponRangeTypes.cudgel",
    bodyPistol: "TWODSIX.Chat.Roll.WeaponRangeTypes.bPistl",
    autoPistol: "TWODSIX.Chat.Roll.WeaponRangeTypes.aPistl",
    revolver: "TWODSIX.Chat.Roll.WeaponRangeTypes.revolver",
    carbine: "TWODSIX.Chat.Roll.WeaponRangeTypes.carbine",
    rifle: "TWODSIX.Chat.Roll.WeaponRangeTypes.rifle",
    autoRifle: "TWODSIX.Chat.Roll.WeaponRangeTypes.AR",
    shotgun: "TWODSIX.Chat.Roll.WeaponRangeTypes.shotgun",
    submachinegun: "TWODSIX.Chat.Roll.WeaponRangeTypes.subm",
    laserCarbine: "TWODSIX.Chat.Roll.WeaponRangeTypes.LC",
    laserRifle: "TWODSIX.Chat.Roll.WeaponRangeTypes.LR",
    custom: "TWODSIX.Chat.Roll.WeaponRangeTypes.cust",
    none: "TWODSIX.Chat.Roll.WeaponRangeTypes.none"
  }
};
const CT_ARMOR_TYPES = {
  nothing: "TWODSIX.Chat.Roll.ArmorTypes.nothing",
  jack: "TWODSIX.Chat.Roll.ArmorTypes.jack",
  mesh: "TWODSIX.Chat.Roll.ArmorTypes.mesh",
  cloth: "TWODSIX.Chat.Roll.ArmorTypes.cloth",
  reflec: "TWODSIX.Chat.Roll.ArmorTypes.reflec",
  ablat: "TWODSIX.Chat.Roll.ArmorTypes.ablat",
  combat: "TWODSIX.Chat.Roll.ArmorTypes.combat"
};
const TARGET_DM = {};
const AUG_LOCATIONS = {
  Head: "TWODSIX.Items.Augmentation.Head",
  Torso: "TWODSIX.Items.Augmentation.Torso",
  Arms: "TWODSIX.Items.Augmentation.Arms",
  Legs: "TWODSIX.Items.Augmentation.Legs",
  "Full-Body": "TWODSIX.Items.Augmentation.FullBody",
  None: "TWODSIX.Items.Augmentation.None"
};
const ITEM_TYPE_SELECT = {
  armor: "TWODSIX.Items.Items.AssignArmor",
  augment: "TWODSIX.Items.Items.AssignAugment",
  computer: "TWODSIX.Items.Items.AssignComputer",
  consumable: "TWODSIX.Items.Items.AssignConsumable",
  equipment: "TWODSIX.Items.Items.AssignEquipment",
  junk: "TWODSIX.Items.Items.AssignJunk",
  psiAbility: "TWODSIX.Items.Items.AssignPsiAbility",
  storage: "TWODSIX.Items.Items.MoveStorage",
  spell: "TWODSIX.Items.Items.AssignSpell",
  tool: "TWODSIX.Items.Items.AssignTool",
  weapon: "TWODSIX.Items.Items.AssignWeapon"
};
const CU_DAMAGE_TYPES = {
  acid: "TWODSIX.DamageType.Acid",
  ballistic: "TWODSIX.DamageType.Ballistic",
  disintegrate: "TWODSIX.DamageType.Disintegrate",
  electrical: "TWODSIX.DamageType.Electrical",
  entangle: "TWODSIX.DamageType.Entangle",
  fire: "TWODSIX.DamageType.Fire",
  laser: "TWODSIX.DamageType.Laser",
  melee: "TWODSIX.DamageType.Melee",
  plasma: "TWODSIX.DamageType.Plasma",
  poison: "TWODSIX.DamageType.Poison",
  stun: "TWODSIX.DamageType.Stun",
  psionic: "TWODSIX.DamageType.Psionic"
};
const DAMAGECOLORS = Object.freeze({
  minorWoundTint: "#ffff00",
  // Yellow
  seriousWoundTint: "#ff0000",
  // Red
  deadTint: "#ffffff"
  // White
});
const effectType = Object.freeze({
  dead: "EFFECT.StatusDead",
  wounded: "EFFECT.StatusWounded",
  unconscious: "EFFECT.StatusUnconscious",
  encumbered: "EFFECT.StatusEncumbered"
});
const TWODSIX$1 = {
  CHARACTERISTICS,
  CONSUMABLES,
  DIFFICULTY_VARIANTS,
  AUTOFIRE_VARIANTS,
  ROLLTYPES,
  DIFFICULTIES,
  RULESETS,
  SHIP_ACTION_TYPE,
  MovementUnits,
  MovementType: MovementTypes,
  PricingOptions,
  PowerOptions,
  HullPricingOptions,
  ComponentStates,
  ComponentTypes,
  CharacteristicDisplayTypes,
  TimeUnits,
  VehicleProtection,
  AnimalNiche,
  HerbivoreType,
  OmnivoreType,
  CarnivoreType,
  ScavengerType,
  AllAnimalTypes,
  AnimalLocations,
  areaTargetTypes,
  SuccessTypes,
  EQUIPPED_STATES,
  EQUIPPED_TOGGLE_OPTIONS,
  RANGE_MODIFIERS_TYPES,
  CE_WEAPON_RANGE_TYPES,
  CU_WEAPON_RANGE_TYPES,
  CT_WEAPON_RANGE_TYPES,
  CT_ARMOR_TYPES,
  TARGET_DM,
  AUG_LOCATIONS,
  ITEM_TYPE_SELECT,
  CU_DAMAGE_TYPES,
  effectType,
  DAMAGECOLORS,
  WeightlessItems,
  ShipWeaponTypes,
  ShipDamageRules,
  ShipArmorTypesCD
};

var __defProp$1e = Object.defineProperty;
var __name$1e = (target, value) => __defProp$1e(target, "name", { value, configurable: true });
function advantageDisadvantageTerm(rollType) {
  switch (rollType.toLocaleLowerCase()) {
    case "advantage":
      return game.settings.get("twodsix", "termForAdvantage");
    case "disadvantage":
      return game.settings.get("twodsix", "termForDisadvantage");
    default:
      return game.i18n.localize(rollType);
  }
}
__name$1e(advantageDisadvantageTerm, "advantageDisadvantageTerm");

var __defProp$1d = Object.defineProperty;
var __name$1d = (target, value) => __defProp$1d(target, "name", { value, configurable: true });
function registerSetting(key, scope, config, defaultValue, type, onChange, choices, localize) {
  const settingData = {
    name: game.i18n.localize(`TWODSIX.Settings.${key}.name`),
    //localization doesn't function at this point FVTT automatically localizes later
    hint: game.i18n.localize(`TWODSIX.Settings.${key}.hint`),
    scope,
    config,
    default: localize && type !== Array ? game.i18n.localize(defaultValue) : defaultValue,
    type,
    onChange,
    choices,
    localize
  };
  game.settings.register("twodsix", key, settingData);
}
__name$1d(registerSetting, "registerSetting");
function booleanSetting(key, defaultValue, config = false, scope = "world", onChange) {
  registerSetting(key.replace(".", ""), scope, config, defaultValue, Boolean, onChange);
  return key;
}
__name$1d(booleanSetting, "booleanSetting");
function numberSetting(key, defaultValue, config = false, scope = "world", onChange) {
  registerSetting(key.replace(".", ""), scope, config, defaultValue, Number, onChange);
  return key;
}
__name$1d(numberSetting, "numberSetting");
function stringChoiceSetting(key, defaultValue, localize = false, choices, config = false, scope = "world", onChange) {
  registerSetting(key.replace(".", ""), scope, config, defaultValue, String, onChange, choices, localize);
  return key;
}
__name$1d(stringChoiceSetting, "stringChoiceSetting");
function arrayChoiceSetting(key, defaultValue, localize = false, choices, config = false, scope = "world", onChange) {
  registerSetting(key.replace(".", ""), scope, config, defaultValue, Array, onChange, choices, localize);
  return key;
}
__name$1d(arrayChoiceSetting, "arrayChoiceSetting");
function stringSetting(key, defaultValue, config = false, scope = "world", onChange, localize) {
  registerSetting(key.replace(".", ""), scope, config, defaultValue, String, onChange, void 0, localize);
  return key;
}
__name$1d(stringSetting, "stringSetting");
function largeStringSetting(key, defaultValue, config = false, scope = "world", onChange) {
  registerSetting(key.replace(".", ""), scope, config, defaultValue, String, onChange, "textarea");
  return key;
}
__name$1d(largeStringSetting, "largeStringSetting");
function colorSetting(key, defaultValue, choices = "Color", config = false, scope = "world", onChange) {
  registerSetting(key.replace(".", ""), scope, config, defaultValue, String, onChange, choices);
  return key;
}
__name$1d(colorSetting, "colorSetting");
function camelCase(string) {
  return string.trim().toLowerCase().replace(/\W+(.)/g, (m, chr) => chr.toUpperCase());
}
__name$1d(camelCase, "camelCase");

var __defProp$1c = Object.defineProperty;
var __name$1c = (target, value) => __defProp$1c(target, "name", { value, configurable: true });
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
__name$1c(isObject, "isObject");
function mergeDeep(target, ...sources) {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
}
__name$1c(mergeDeep, "mergeDeep");
function getCharShortName(char) {
  switch (char) {
    case "ALT1":
      return game.settings.get("twodsix", "alternativeShort1");
    case "ALT2":
      return game.settings.get("twodsix", "alternativeShort2");
    case "ALT3":
      return game.settings.get("twodsix", "alternativeShort3");
    case "LFB":
    case "STA":
    case "HIT":
      return game.i18n.localize("TWODSIX.Items.Skills." + char);
    default:
      return game.i18n.localize(game.settings.get("twodsix", "short" + char));
  }
}
__name$1c(getCharShortName, "getCharShortName");
function simplifySkillName(skillName) {
  return skillName.replace(/\W/g, "");
}
__name$1c(simplifySkillName, "simplifySkillName");
function ObjectbyString(o, s) {
  s = s.replace(/\[(\w+)\]/g, ".$1");
  s = s.replace(/^\./, "");
  const a = s.split(".");
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
}
__name$1c(ObjectbyString, "ObjectbyString");
function sortObj(obj) {
  return Object.keys(obj).sort().reduce(function(result, key) {
    result[key] = obj[key];
    return result;
  }, {});
}
__name$1c(sortObj, "sortObj");
function sortByItemName(itemArray) {
  return itemArray.sort(function(a, b) {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    if (aName < bName) {
      return -1;
    } else if (aName > bName) {
      return 1;
    } else {
      return 0;
    }
  });
}
__name$1c(sortByItemName, "sortByItemName");
function addSign(value) {
  return `${value <= 0 ? "" : "+"}${value}`;
}
__name$1c(addSign, "addSign");
function capitalizeFirstLetter(inputString) {
  if (inputString[0]) {
    return inputString[0].toUpperCase() + inputString.slice(1);
  } else {
    return "";
  }
}
__name$1c(capitalizeFirstLetter, "capitalizeFirstLetter");
function getCharacteristicFromDisplayLabel(char, actor) {
  let tempObject = {};
  let charObject = {};
  if (actor) {
    charObject = actor.system["characteristics"];
    for (const key in charObject) {
      tempObject[key] = charObject[key].displayShortLabel;
    }
  } else {
    tempObject = TWODSIX.CHARACTERISTICS;
  }
  return getKeyByValue(tempObject, char);
}
__name$1c(getCharacteristicFromDisplayLabel, "getCharacteristicFromDisplayLabel");
function roundToDecimal(num, decimalPlaces) {
  const p = Math.pow(10, decimalPlaces);
  const e = Number.EPSILON * num * p;
  return Math.round(num * p + e) / p;
}
__name$1c(roundToDecimal, "roundToDecimal");
function roundToMaxDecimals(num, maxDecimals) {
  const decimalsToShow = Math.min(maxDecimals, Math.max(0, maxDecimals - Math.floor(Math.log10(Math.abs(num)))));
  return roundToDecimal(num, decimalsToShow);
}
__name$1c(roundToMaxDecimals, "roundToMaxDecimals");
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => JSON.stringify(object[key]) === JSON.stringify(value));
}
__name$1c(getKeyByValue, "getKeyByValue");
function removeStringElement(arr, value) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
__name$1c(removeStringElement, "removeStringElement");

var __defProp$1b = Object.defineProperty;
var __name$1b = (target, value) => __defProp$1b(target, "name", { value, configurable: true });
function calcModFor(characteristic) {
  let modifier = 0;
  if (game.settings.get("twodsix", "ruleset") !== "CT") {
    modifier = Math.floor((characteristic - 6) / 3);
    if (characteristic <= 0) {
      modifier = game.settings.get("twodsix", "modifierForZeroCharacteristic");
    }
  }
  return modifier;
}
__name$1b(calcModFor, "calcModFor");
function getDataFromDropEvent(ev) {
  try {
    return JSON.parse(ev.dataTransfer?.getData("text/plain"));
  } catch (err) {
    const pdfRef = ev.dataTransfer?.getData("text/html");
    if (pdfRef) {
      return getHTMLLink(pdfRef);
    } else {
      const uriRef = ev.dataTransfer?.getData("text/uri-list");
      if (uriRef) {
        return {
          type: "html",
          href: uriRef,
          label: "Weblink"
        };
      }
      throw new Error(game.i18n.localize("TWODSIX.Errors.DropFailedWith").replace("_ERROR_MSG_", err));
    }
  }
}
__name$1b(getDataFromDropEvent, "getDataFromDropEvent");
async function getDocFromDropData(dropData) {
  let doc;
  if (game.modules.get("monks-enhanced-journal")?.active && dropData.itemId && dropData.uuid.includes("JournalEntry")) {
    const journalEntry = await fromUuid(dropData.uuid);
    const lootItems = journalEntry.getFlag("monks-enhanced-journal", "items");
    doc = lootItems.find((it) => it._id === dropData.itemId);
    if (doc.system.consumables?.length > 0) {
      doc.system.consumables = [];
    }
  } else if (dropData.uuid) {
    doc = await fromUuid(dropData.uuid);
  } else {
    if (dropData.type === "Item") {
      doc = game.items.get(dropData._id ?? dropData.data?._id);
    } else if (dropData.type === "Actor") {
      doc = game.actors.get(dropData._id ?? dropData.data?._id);
    }
  }
  if (!doc) {
    throw new Error(game.i18n.localize("TWODSIX.Errors.CouldNotFindItem").replace("_ITEM_ID_", dropData.uuid));
  }
  if (doc.pack) {
    const pack = game.packs.get(doc.pack);
    doc = await pack?.getDocument(doc._id);
  }
  return doc;
}
__name$1b(getDocFromDropData, "getDocFromDropData");
function getHTMLLink(dropString) {
  const re = new RegExp(/<a href="(.+?)">(.*?)<\/a>/gm);
  const parsedResult = re.exec(dropString);
  const isPDF = dropString.includes("/pdfjs/");
  if (parsedResult) {
    return {
      type: isPDF ? "pdf" : "html",
      href: parsedResult[1] ?? "",
      label: parsedResult[2] ?? ""
    };
  } else {
    return {
      type: isPDF ? "pdf" : "html",
      href: "",
      label: ""
    };
  }
}
__name$1b(getHTMLLink, "getHTMLLink");
function openPDFLink(ev, target) {
  const sourceString = target.closest(".item-reference")?.dataset?.link;
  if (sourceString) {
    const [code, page] = sourceString.split(" ");
    const selectedPage = parseInt(page);
    if (ui["pdfpager"]) {
      ui["pdfpager"].openPDFByCode(code, { page: selectedPage });
    } else {
      ui.notifications.warn("TWODSIX.Warnings.PDFPagerNotInstalled", { localize: true });
    }
  } else {
    ui.notifications.warn("TWODSIX.Warnings.NoSpecfiedLink", { localize: true });
  }
}
__name$1b(openPDFLink, "openPDFLink");
async function deletePDFLink(ev, target) {
  const index = parseInt(target.dataset.index);
  if (index > -1) {
    const newRefArray = foundry.utils.duplicate(this.document.system.docReference);
    newRefArray.splice(index, 1);
    await this.document.update({ "system.docReference": newRefArray });
  }
}
__name$1b(deletePDFLink, "deletePDFLink");
async function addPDFLink() {
  const newRefArray = foundry.utils.duplicate(this.document.system.docReference);
  newRefArray.push("");
  await this.document.update({ "system.docReference": newRefArray });
}
__name$1b(addPDFLink, "addPDFLink");
async function changeReference(ev) {
  ev.preventDefault();
  const newValue = ev.target.value;
  const index = ev.target.dataset.index;
  if (index) {
    const newRefArray = foundry.utils.duplicate(this.document.system.docReference);
    newRefArray[index] = newValue;
    await this.document.update({ "system.docReference": newRefArray });
  } else {
    console.log("No update index");
  }
}
__name$1b(changeReference, "changeReference");
async function openJournalEntry() {
  if (this.document.system.pdfReference.type === "JournalEntry") {
    const journalToOpen = await fromUuid(this.document.system.pdfReference.href);
    if (journalToOpen) {
      journalToOpen.sheet.render({ force: true });
    } else {
      ui.notifications.warn("TWODSIX.Warnings.NoJournalFound", { localize: true });
    }
  }
}
__name$1b(openJournalEntry, "openJournalEntry");
async function deleteReference(ev) {
  ev.preventDefault();
  if (this.document.system.pdfReference.href !== "") {
    await this.document.update({ "system.pdfReference.type": "", "system.pdfReference.href": "", "system.pdfReference.label": "" });
  } else {
    ui.notifications.warn("TWODSIX.Warnings.NoSpecfiedLink", { localize: true });
  }
}
__name$1b(deleteReference, "deleteReference");
function isDisplayableSkill(skill) {
  if (skill.getFlag("twodsix", "untrainedSkill")) {
    return false;
  } else if (skill.system.trainingNotes !== "" || skill.system.value >= 0 || skill.actor?.system.skills[simplifySkillName(skill.name)] > 0) {
    return true;
  } else if (!game.settings.get("twodsix", "hideUntrainedSkills")) {
    return true;
  } else {
    return false;
  }
}
__name$1b(isDisplayableSkill, "isDisplayableSkill");
async function confirmRollFormula(initFormula, title) {
  const returnText = await new Promise((resolve) => {
    new foundry.applications.api.DialogV2({
      window: { title },
      content: `<label for="outputFormula">Formula</label><input type="text" name="outputFormula" value="` + initFormula + `"></input>`,
      buttons: [
        {
          action: "roll",
          icon: "fa-solid fa-dice",
          label: "TWODSIX.Rolls.Roll",
          default: true,
          callback: /* @__PURE__ */ __name$1b((event, button, dialog) => {
            resolve(dialog.element.querySelector('[name="outputFormula"]')?.value);
          }, "callback")
        }
      ]
    }).render({ force: true });
  });
  return returnText ?? "";
}
__name$1b(confirmRollFormula, "confirmRollFormula");
async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
__name$1b(wait, "wait");
function getDamageTypes(isWeapon) {
  if (game.settings.get("twodsix", "ruleset") === "CU") {
    return TWODSIX$1.CU_DAMAGE_TYPES;
  } else {
    const returnObject = {};
    const damageTypeOptions = game.settings.get("twodsix", "damageTypeOptions");
    if (damageTypeOptions !== "") {
      let protectionTypeLabels = damageTypeOptions.split(",");
      protectionTypeLabels = protectionTypeLabels.map((s) => s.trim());
      for (const type of protectionTypeLabels) {
        Object.assign(returnObject, { [camelCase(type)]: type });
      }
    }
    if (isWeapon) {
      Object.assign(returnObject, { "NONE": "---" });
    }
    return returnObject;
  }
}
__name$1b(getDamageTypes, "getDamageTypes");
function getRollTypeSelectObject() {
  const returnObj = {};
  Object.keys(TWODSIX$1.ROLLTYPES).forEach((key) => {
    returnObj[key] = advantageDisadvantageTerm(key);
  });
  return returnObj;
}
__name$1b(getRollTypeSelectObject, "getRollTypeSelectObject");
function getDifficultiesSelectObject(difficultyList = TWODSIX$1.DIFFICULTIES[game.settings.get("twodsix", "difficultyListUsed")]) {
  const returnObj = {};
  const useTargetDiff = game.settings.get("twodsix", "difficultiesAsTargetNumber");
  Object.keys(difficultyList).forEach((key) => {
    const value = difficultyList[key];
    const label = useTargetDiff ? `${value.target}+` : `${value.mod >= 0 ? `+` : ``}${value.mod}`;
    returnObj[key] = `${game.i18n.localize(key)} (${label})`;
  });
  return returnObj;
}
__name$1b(getDifficultiesSelectObject, "getDifficultiesSelectObject");
function getConsumableOptions(item) {
  const returnObj = { "": "---" };
  if (item.system.consumableData?.length > 0) {
    for (const consumable of item.system.consumableData) {
      returnObj[consumable.id] = consumable.name;
    }
  }
  return returnObj;
}
__name$1b(getConsumableOptions, "getConsumableOptions");
function getRangeTypes(labelType = "short") {
  switch (game.settings.get("twodsix", "rangeModifierType")) {
    case "CT_Bands":
      return TWODSIX$1.CT_WEAPON_RANGE_TYPES[labelType];
    case "CE_Bands":
      return TWODSIX$1.CE_WEAPON_RANGE_TYPES[labelType];
    case "CU_Bands":
      return TWODSIX$1.CU_WEAPON_RANGE_TYPES[labelType];
    default:
      return {};
  }
}
__name$1b(getRangeTypes, "getRangeTypes");

var __defProp$1a = Object.defineProperty;
var __name$1a = (target, value) => __defProp$1a(target, "name", { value, configurable: true });
function generateTargetDMObject() {
  const modifierObject = {};
  const parseString = game.settings.get("twodsix", "targetDMList");
  if (parseString !== "") {
    let i = 0;
    const customDMs = parseString.replace(/[\t\n\r]/gm, " ").split(",");
    for (const modifier of customDMs) {
      const re = new RegExp(/([^\|]+)(?:\s+)([+-]?\d+?)(?:\s*\|*\s*)(.*)$/gm);
      const parsedResult = re.exec(modifier);
      if (parsedResult) {
        const keyValue = `key${i}`;
        Object.assign(modifierObject, {
          [keyValue]: {
            label: parsedResult[1].trim() || game.i18n.localize("TWODSIX.Ship.Unknown"),
            value: parseInt(parsedResult[2]) || 0,
            key: keyValue,
            statusKey: CONFIG.statusEffects.find((se) => parsedResult[3].trim() === game.i18n.localize(se.name))?.id || "",
            linkString: parsedResult[3].trim() || ""
          }
        });
        ++i;
      }
    }
  }
  TWODSIX$1.TARGET_DM = modifierObject;
}
__name$1a(generateTargetDMObject, "generateTargetDMObject");
function getTargetDMSelectObject() {
  const returnValue = {};
  for (const key of Object.keys(TWODSIX$1.TARGET_DM)) {
    Object.assign(returnValue, {
      [key]: `${TWODSIX$1.TARGET_DM[key].label} (${TWODSIX$1.TARGET_DM[key].value})`
    });
  }
  return returnValue;
}
__name$1a(getTargetDMSelectObject, "getTargetDMSelectObject");
function getTargetStatusModifiers(targetActor) {
  const returnValue = [];
  if (!TWODSIX$1.TARGET_DM && game.settings.get("twodsix", "targetDMList") !== "") {
    generateTargetDMObject();
  }
  const targetDMObject = Object.values(TWODSIX$1.TARGET_DM);
  if (targetActor) {
    for (const statusApplied of Array.from(targetActor.statuses)) {
      const linkedDM = targetDMObject.find((targetDM) => targetDM.statusKey === statusApplied);
      if (linkedDM) {
        returnValue.push(linkedDM.key);
      }
    }
    for (const trait of targetActor.itemTypes.trait) {
      const linkedDM = targetDMObject.find((targetDM) => targetDM.linkString === trait.name);
      if (linkedDM) {
        returnValue.push(linkedDM.key);
      }
    }
  }
  return returnValue;
}
__name$1a(getTargetStatusModifiers, "getTargetStatusModifiers");

var __defProp$19 = Object.defineProperty;
var __name$19 = (target, value) => __defProp$19(target, "name", { value, configurable: true });
const _TwodsixRollSettings = class _TwodsixRollSettings {
  constructor(settings, aSkill, anItem, sourceActor) {
    this.difficulties = settings?.difficulties ? settings.difficulties : TWODSIX$1.DIFFICULTIES[game.settings.get("twodsix", "difficultyListUsed")];
    const skill = aSkill?.system;
    let skillValue = 0;
    const difficulty = skill?.difficulty ? this.difficulties[skill.difficulty] : this.difficulties.Average;
    const gear = anItem?.system;
    const itemName = anItem?.name ?? "";
    const characteristic = settings?.rollModifiers?.characteristic ?? (aSkill && game.settings.get("twodsix", "ruleset") !== "CT" ? skill.characteristic : "NONE");
    const itemUUID = settings?.flags?.itemUUID ?? anItem?.uuid ?? aSkill?.uuid ?? "";
    const tokenUUID = settings?.flags?.tokenUUID ?? sourceActor?.getActiveTokens()[0]?.document.uuid ?? "";
    const actorUUID = settings?.flags?.actorUUID ?? sourceActor?.uuid ?? "";
    let rollClass = "";
    this.bonusDamage = settings?.bonusDamage ?? "";
    let woundsValue = 0;
    let encumberedValue = 0;
    let selectedActor = sourceActor;
    let displayLabel = "";
    if (aSkill && !selectedActor) {
      selectedActor = aSkill.actor;
    } else if (anItem && !selectedActor) {
      selectedActor = anItem.actor;
    }
    if (selectedActor) {
      if (selectedActor.type === "ship") {
        displayLabel = characteristic;
      } else {
        if (game.settings.get("twodsix", "useWoundedStatusIndicators")) {
          woundsValue = selectedActor.system.conditions.woundedEffect ?? 0;
        }
        if (game.settings.get("twodsix", "useEncumbranceStatusIndicators")) {
          const fullCharLabel = getKeyByValue(TWODSIX$1.CHARACTERISTICS, characteristic);
          encumberedValue = ["strength", "dexterity", "endurance"].includes(fullCharLabel) ? selectedActor.system.conditions.encumberedEffect ?? 0 : 0;
        }
        if (aSkill) {
          skillValue = selectedActor.system.skills[simplifySkillName(aSkill.name)] ?? aSkill.system.value;
        }
        const joat = selectedActor.getUntrainedSkill()?.system?.value ?? CONFIG.Item.dataModels.skills.schema.getInitialValue().value;
        if (joat > skillValue) {
          skillValue = joat;
          this.skillName = game.i18n.localize("TWODSIX.Actor.Skills.JOAT");
        } else {
          this.skillName = aSkill?.name ?? "?";
        }
        if (!settings?.displayLabel) {
          const fullCharLabel = getKeyByValue(TWODSIX$1.CHARACTERISTICS, characteristic);
          displayLabel = selectedActor.system["characteristics"][fullCharLabel]?.displayShortLabel ?? "";
        }
      }
      if (anItem) {
        if (anItem.type === "weapon") {
          rollClass = "Attack";
        } else if (anItem.type === "component") {
          if (anItem.system.subtype === "armament") {
            rollClass = "ShipWeapon";
          } else {
            rollClass = "ShipAction";
          }
        } else if (anItem.type === "spell") {
          rollClass = "Spell";
        } else if (anItem.type === "psiAbility") {
          rollClass = "PsionicAbility";
        } else {
          rollClass = "Item";
        }
      } else if (aSkill) {
        rollClass = "Skill";
      } else if (characteristic !== "NONE" && characteristic !== "") {
        rollClass = "Characteristic";
      } else {
        rollClass = "Unknown";
      }
    }
    this.difficulty = settings?.difficulty ?? difficulty;
    this.shouldRoll = false;
    this.rollType = settings?.rollType ?? aSkill?.system?.rolltype ?? "Normal";
    this.rollMode = settings?.rollMode ?? game.settings.get("core", "rollMode");
    this.skillRoll = !!(settings?.skillRoll ?? aSkill);
    this.itemRoll = !!anItem;
    this.isPsionicAbility = this.itemRoll ? anItem.type === "psiAbility" : false;
    this.itemName = settings?.itemName ?? itemName;
    this.showRangeModifier = (game.settings.get("twodsix", "rangeModifierType") !== "none" && anItem?.type === "weapon" && settings?.rollModifiers?.rangeLabel) ?? false;
    this.showTargetModifier = Object.keys(TWODSIX$1.TARGET_DM).length > 1;
    this.showArmorWeaponModifier = game.settings.get("twodsix", "rangeModifierType") === "CT_Bands" || game.settings.get("twodsix", "ruleset") === "CT";
    this.displayLabel = settings?.displayLabel ?? displayLabel;
    this.extraFlavor = settings?.extraFlavor ?? "";
    this.selectedTimeUnit = "none";
    this.timeRollFormula = "1d6";
    this.rollModifiers = {
      rof: settings?.rollModifiers?.rof ?? 0,
      characteristic,
      wounds: woundsValue,
      skillValue: skillValue ?? 0,
      item: anItem?.type === "component" ? parseInt(gear?.rollModifier, 10) || 0 : gear?.skillModifier ?? 0,
      //need to check for component that uses rollModifier (needs a refactor)
      componentDamage: anItem?.type === "component" ? gear?.hits * game.settings.get("twodsix", "componentDamageDM") || 0 : 0,
      attachments: anItem?.system?.consumables?.length > 0 ? anItem?.getConsumableBonus("skillModifier") ?? 0 : 0,
      other: settings?.rollModifiers?.other ?? 0,
      encumbered: encumberedValue,
      dodgeParry: settings?.rollModifiers?.dodgeParry ?? 0,
      dodgeParryLabel: settings?.rollModifiers?.dodgeParryLabel ?? "",
      weaponsHandling: settings?.rollModifiers?.weaponsHandling ?? 0,
      weaponsRange: settings?.rollModifiers?.weaponsRange ?? 0,
      rangeLabel: settings?.rollModifiers?.rangeLabel ?? "",
      targetModifier: settings?.rollModifiers?.targetModifier?.length > 0 ? settings.rollModifiers.targetModifier : [],
      targetModifierOverride: settings?.rollModifiers?.targetModifierOverride ?? false,
      appliedEffects: {},
      chain: settings?.rollModifiers?.chain ?? 0,
      selectedSkill: aSkill?.uuid || settings?.rollModifiers?.selectedSkill,
      skillLevelMax: settings?.rollModifiers?.skillLevelMax ?? void 0,
      armorModifier: settings?.rollModifiers?.armorModifier ?? 0,
      armorLabel: settings?.rollModifiers?.armorLabel ?? ""
    };
    this.flags = {
      rollClass,
      tokenUUID,
      itemUUID,
      actorUUID,
      bonusDamage: this.bonusDamage
    };
  }
  static async create(showThrowDialog, settings, skill, item, sourceActor) {
    const twodsixRollSettings = new _TwodsixRollSettings(settings, skill, item, sourceActor);
    if (sourceActor) {
      twodsixRollSettings.rollModifiers.appliedEffects = getCustomModifiers(sourceActor, twodsixRollSettings.rollModifiers.characteristic, skill);
    }
    if (showThrowDialog) {
      let title;
      if (item && skill) {
        title = `${item.name} ${game.i18n.localize("TWODSIX.Actor.using")} ${twodsixRollSettings.skillName}`;
        twodsixRollSettings.itemName = item.name ?? "Unknown Item";
      } else if (skill) {
        title = twodsixRollSettings.skillName || "";
        if (_getTranslatedCharacteristicList(skill.actor)[twodsixRollSettings.rollModifiers.characteristic] === void 0) {
          twodsixRollSettings.rollModifiers.characteristic = "NONE";
        }
      } else {
        title = twodsixRollSettings.displayLabel ?? "";
      }
      await twodsixRollSettings._throwDialog(title, skill);
      if (skill && skill.actor) {
        if (twodsixRollSettings.rollModifiers.characteristic === "NONE") {
          twodsixRollSettings.displayLabel = "";
        } else {
          const fullCharLabel = getKeyByValue(TWODSIX$1.CHARACTERISTICS, twodsixRollSettings.rollModifiers.characteristic);
          twodsixRollSettings.displayLabel = sourceActor?.system["characteristics"][fullCharLabel]?.displayShortLabel ?? "";
        }
      } else if (skill) {
        twodsixRollSettings.displayLabel = "";
        twodsixRollSettings.rollModifiers.characteristic = "NONE";
      }
    } else {
      twodsixRollSettings.shouldRoll = true;
    }
    return twodsixRollSettings;
  }
  async _throwDialog(title, skill) {
    const template = "systems/twodsix/templates/chat/throw-dialog.hbs";
    const dialogData = {
      rollType: this.rollType,
      rollTypes: getRollTypeSelectObject(),
      difficulty: getKeyByValue(this.difficulties, this.difficulty),
      difficultyList: getDifficultiesSelectObject(this.difficulties),
      skillsList: skill?.actor?.getSkillNameList(),
      rollMode: this.rollMode,
      rollModes: CONFIG.Dice.rollModes,
      characteristicList: _getTranslatedCharacteristicList(skill?.actor),
      initialChoice: this.rollModifiers.characteristic,
      initialSkill: this.rollModifiers.selectedSkill,
      rollModifiers: this.rollModifiers,
      skillLabel: this.skillName,
      itemLabel: this.itemName,
      showRangeModifier: this.showRangeModifier,
      showTargetModifier: this.showTargetModifier,
      showArmorWeaponModifier: this.showArmorWeaponModifier,
      armorModifier: this.rollModifiers.armorModifier,
      armorLabel: this.rollModifiers.armorLabel,
      targetModifier: this.rollModifiers.targetModifier,
      targetModifierOverride: this.rollModifiers.targetModifierOverride,
      targetDMList: getTargetDMSelectObject(),
      skillRoll: this.skillRoll,
      itemRoll: this.itemRoll,
      timeUnits: TWODSIX$1.TimeUnits,
      selectedTimeUnit: this.selectedTimeUnit,
      timeRollFormula: this.timeRollFormula,
      showConditions: game.settings.get("twodsix", "useWoundedStatusIndicators") || game.settings.get("twodsix", "useEncumbranceStatusIndicators"),
      showWounds: game.settings.get("twodsix", "useWoundedStatusIndicators"),
      showEncumbered: game.settings.get("twodsix", "useEncumbranceStatusIndicators"),
      isPsionicAbility: this.isPsionicAbility,
      isComponent: ["ShipAction", "ShipWeapon"].includes(this.flags.rollClass)
    };
    const buttons = [
      {
        action: "ok",
        label: "TWODSIX.Rolls.Roll",
        icon: "fa-solid fa-dice",
        default: true,
        callback: /* @__PURE__ */ __name$19((event, button, dialog) => {
          const formElements = dialog.element.querySelector(".standard-form").elements;
          this.shouldRoll = true;
          this.difficulty = this.difficulties[formElements["difficulty"]?.value];
          this.rollType = formElements["rollType"]?.value;
          this.rollMode = formElements["rollMode"]?.value;
          this.rollModifiers.chain = dialogData.skillRoll ? parseInt(formElements["rollModifiers.chain"]?.value || 0, 10) : this.rollModifiers.chain;
          this.rollModifiers.characteristic = dialogData.skillRoll ? formElements["rollModifiers.characteristic"]?.value : this.rollModifiers.characteristic;
          this.rollModifiers.item = dialogData.itemRoll ? parseInt(formElements["rollModifiers.item"]?.value || 0, 10) : this.rollModifiers.item;
          this.rollModifiers.componentDamage = dialogData.isComponent ? parseInt(formElements["rollModifiers.componentDamage"]?.value || 0, 10) : this.rollModifiers.componentDamage;
          this.rollModifiers.rof = dialogData.itemRoll && dialogData.rollModifiers.rof ? parseInt(formElements["rollModifiers.rof"]?.value || 0, 10) : this.rollModifiers.rof;
          this.rollModifiers.dodgeParry = dialogData.itemRoll && dialogData.rollModifiers.dodgeParry ? parseInt(formElements["rollModifiers.dodgeParry"]?.value || 0, 10) : this.rollModifiers.dodgeParry;
          this.rollModifiers.weaponsHandling = dialogData.itemRoll && dialogData.rollModifiers.weaponsHandling ? parseInt(formElements["rollModifiers.weaponsHandling"]?.value || 0, 10) : this.rollModifiers.weaponsHandling;
          this.rollModifiers.weaponsRange = dialogData.showRangeModifier ? parseInt(formElements["rollModifiers.weaponsRange"]?.value || 0, 10) : this.rollModifiers.weaponsRange;
          this.rollModifiers.attachments = dialogData.itemRoll && dialogData.rollModifiers.attachments ? parseInt(formElements["rollModifiers.attachments"]?.value || 0, 10) : this.rollModifiers.attachments;
          this.rollModifiers.other = parseInt(formElements["rollModifiers.other"].value || 0, 10);
          this.rollModifiers.wounds = dialogData.showWounds ? parseInt(formElements["rollModifiers.wounds"]?.value || 0, 10) : 0;
          this.rollModifiers.selectedSkill = dialogData.skillRoll ? formElements["rollModifiers.selectedSkill"]?.value : "";
          this.rollModifiers.targetModifier = dialogData.showTargetModifier && formElements["rollModifiers.targetModifier"] ? formElements["rollModifiers.targetModifier"].value : this.rollModifiers.targetModifier;
          this.rollModifiers.armorModifier = dialogData.showArmorWeaponModifier ? parseInt(formElements["rollModifiers.armorModifier"]?.value || 0, 10) : 0;
          if (!dialogData.showEncumbered || !["strength", "dexterity", "endurance"].includes(getKeyByValue(TWODSIX$1.CHARACTERISTICS, this.rollModifiers.characteristic))) {
            this.rollModifiers.encumbered = 0;
          } else {
            const dialogEncValue = parseInt(formElements["rollModifiers.encumbered"]?.value, 10);
            if (dialogData.initialChoice === this.rollModifiers.characteristic || dialogEncValue !== dialogData.rollModifiers.encumbered) {
              this.rollModifiers.encumbered = isNaN(dialogEncValue) ? 0 : dialogEncValue;
            } else {
              this.rollModifiers.encumbered = skill?.actor?.system.conditions.encumberedEffect ?? (isNaN(dialogEncValue) ? 0 : dialogEncValue);
            }
          }
          this.selectedTimeUnit = formElements["timeUnit"]?.value;
          this.timeRollFormula = formElements["timeRollFormula"]?.value;
        }, "callback")
      },
      {
        action: "cancel",
        icon: "fa-solid fa-xmark",
        label: "Cancel",
        callback: /* @__PURE__ */ __name$19(() => {
          this.shouldRoll = false;
        }, "callback")
      }
    ];
    const html = await foundry.applications.handlebars.renderTemplate(template, dialogData);
    await foundry.applications.api.DialogV2.wait({
      window: { title, icon: "fa-solid fa-dice" },
      content: html,
      buttons,
      render: handleRender$1,
      close: /* @__PURE__ */ __name$19(() => {
        Promise.resolve();
      }, "close"),
      rejectClose: false
    });
  }
};
__name$19(_TwodsixRollSettings, "TwodsixRollSettings");
let TwodsixRollSettings = _TwodsixRollSettings;
function handleRender$1(ev, htmlRend) {
  htmlRend.element.querySelector(".select-skill")?.addEventListener("change", () => {
    const characteristicElement = htmlRend.element.querySelector('[name="rollModifiers.characteristic"]');
    let newSkill;
    if (characteristicElement) {
      const newSkillUuid = htmlRend.element.querySelector('[name="rollModifiers.selectedSkill"]')?.value;
      if (newSkillUuid) {
        newSkill = fromUuidSync(newSkillUuid);
        characteristicElement.value = newSkill?.system.characteristic || "NONE";
      }
    }
    let newTitle = "";
    const titleElement = htmlRend.element.querySelector(".window-title");
    if (titleElement) {
      const usingWord = " " + game.i18n.localize("TWODSIX.Actor.using") + " ";
      if (titleElement.innerText.includes(usingWord)) {
        newTitle = `${titleElement.innerText.substring(0, titleElement.innerText.indexOf(usingWord))}${usingWord}${newSkill?.name}`;
      } else {
        newTitle = newSkill?.name || "";
      }
      titleElement.innerText = newTitle;
    }
  });
}
__name$19(handleRender$1, "handleRender");
function _getTranslatedCharacteristicList(actor) {
  const returnValue = {};
  if (actor) {
    returnValue["STR"] = getCharacteristicLabelWithMod(actor, "strength");
    returnValue["DEX"] = getCharacteristicLabelWithMod(actor, "dexterity");
    returnValue["END"] = getCharacteristicLabelWithMod(actor, "endurance");
    returnValue["INT"] = getCharacteristicLabelWithMod(actor, "intelligence");
    returnValue["EDU"] = getCharacteristicLabelWithMod(actor, "education");
    returnValue["SOC"] = getCharacteristicLabelWithMod(actor, "socialStanding");
    if (!["base", "core"].includes(game.settings.get("twodsix", "showAlternativeCharacteristics"))) {
      returnValue["ALT1"] = getCharacteristicLabelWithMod(actor, "alternative1");
      returnValue["ALT2"] = getCharacteristicLabelWithMod(actor, "alternative2");
    }
    if (["all"].includes(game.settings.get("twodsix", "showAlternativeCharacteristics"))) {
      returnValue["ALT3"] = getCharacteristicLabelWithMod(actor, "alternative3");
    }
    if (!["alternate", "core"].includes(game.settings.get("twodsix", "showAlternativeCharacteristics"))) {
      returnValue["PSI"] = getCharacteristicLabelWithMod(actor, "psionicStrength");
    }
  }
  returnValue["NONE"] = "---";
  return returnValue;
}
__name$19(_getTranslatedCharacteristicList, "_getTranslatedCharacteristicList");
function getCharacteristicLabelWithMod(actor, characteristic) {
  return actor.system.characteristics[characteristic].displayShortLabel + "(" + (actor.system.characteristics[characteristic].mod >= 0 ? "+" : "") + actor.system.characteristics[characteristic].mod + ")";
}
__name$19(getCharacteristicLabelWithMod, "getCharacteristicLabelWithMod");
function _genUntranslatedCharacteristicList() {
  const returnValue = {};
  returnValue["STR"] = game.i18n.localize("TWODSIX.Items.Skills.STR");
  returnValue["DEX"] = game.i18n.localize("TWODSIX.Items.Skills.DEX");
  returnValue["END"] = game.i18n.localize("TWODSIX.Items.Skills.END");
  returnValue["INT"] = game.i18n.localize("TWODSIX.Items.Skills.INT");
  returnValue["EDU"] = game.i18n.localize("TWODSIX.Items.Skills.EDU");
  returnValue["SOC"] = game.i18n.localize("TWODSIX.Items.Skills.SOC");
  if (!["base", "core"].includes(game.settings.get("twodsix", "showAlternativeCharacteristics"))) {
    returnValue["ALT1"] = game.settings.get("twodsix", "alternativeShort1");
    returnValue["ALT2"] = game.settings.get("twodsix", "alternativeShort2");
  }
  if (["all"].includes(game.settings.get("twodsix", "showAlternativeCharacteristics"))) {
    returnValue["ALT3"] = game.settings.get("twodsix", "alternativeShort3");
  }
  if (!["alternate", "core"].includes(game.settings.get("twodsix", "showAlternativeCharacteristics"))) {
    returnValue["PSI"] = game.i18n.localize("TWODSIX.Items.Skills.PSI");
  }
  returnValue["NONE"] = "---";
  return returnValue;
}
__name$19(_genUntranslatedCharacteristicList, "_genUntranslatedCharacteristicList");
function getCharacteristicList(actor) {
  let returnValue = {};
  if (actor) {
    returnValue = _getTranslatedCharacteristicList(actor);
  } else {
    returnValue = _genUntranslatedCharacteristicList();
  }
  return returnValue;
}
__name$19(getCharacteristicList, "getCharacteristicList");
function getCustomModifiers(selectedActor, characteristic, skill) {
  const characteristicKey = getKeyByValue(TWODSIX$1.CHARACTERISTICS, characteristic);
  const simpleSkillRef = skill ? `system.skills.` + simplifySkillName(skill.name) : ``;
  const returnObject = [];
  const customEffects = selectedActor.appliedEffects.filter((eff) => !eff.statuses.has("encumbered") && !eff.statuses.has("wounded"));
  for (const effect of customEffects) {
    for (const change of effect.changes) {
      if (change.key === `system.characteristics.${characteristicKey}.mod` || change.key === `system.characteristics.${characteristicKey}.value` || change.key === simpleSkillRef && simpleSkillRef) {
        returnObject.push({
          name: effect.name,
          stat: change.key.replace("system.", ""),
          value: addSign(change.value)
        });
      }
    }
  }
  return returnObject;
}
__name$19(getCustomModifiers, "getCustomModifiers");
function getInitialSettingsFromFormula(parseString, actor) {
  const difficulties = TWODSIX$1.DIFFICULTIES[game.settings.get("twodsix", "difficultyListUsed")];
  const re = new RegExp(/^(.[^\/\+=]*?) ?(?:\/([\S]+))? ?(?:(\d{0,2})\+)? ?(?:=(\w*))? ?$/);
  const parsedResult = re.exec(parseString);
  if (parsedResult !== null) {
    const [, parsedSkills, char, diff] = parsedResult;
    let difficulty = void 0;
    let otherMod = 0;
    if (diff) {
      let diffSelected = parseInt(diff, 10);
      otherMod = diffSelected % 2 ? 1 : 0;
      diffSelected += diffSelected % 2;
      difficulty = Object.values(difficulties).find((dif) => dif.target === diffSelected);
    }
    let skill = void 0;
    if (parsedSkills !== "" && parsedSkills !== "None") {
      skill = actor.getBestSkill(parsedSkills, !char);
      if (!skill) {
        ui.notifications.error(game.i18n.localize("TWODSIX.Ship.ActorLacksSkill").replace("_ACTOR_NAME_", actor.name ?? "").replace("_SKILL_", parsedSkills));
        return false;
      }
    }
    let characteristicKey = "";
    const charObject = actor?.system["characteristics"] ?? {};
    const charObjectArray = Object.values(charObject);
    if (!char && skill) {
      characteristicKey = getKeyByValue(TWODSIX$1.CHARACTERISTICS, skill.system.characteristic);
    } else if (char) {
      const charOptions = char.split("|").map((str) => str.trim());
      let candidateCharObject = void 0;
      const candidateCharObjects = charObjectArray.filter((ch) => charOptions.includes(ch.displayShortLabel) || charOptions.includes(ch.shortLabel));
      if (candidateCharObjects.length > 0) {
        candidateCharObject = candidateCharObjects.reduce((prev, current) => prev.mod > current.mod ? prev : current);
      }
      characteristicKey = candidateCharObject?.key ?? getCharacteristicFromDisplayLabel(char, actor);
    }
    let shortLabel = "NONE";
    let displayLabel = "NONE";
    if (charObject && characteristicKey) {
      shortLabel = charObject[characteristicKey].shortLabel;
      displayLabel = charObject[characteristicKey].displayShortLabel;
    }
    const returnValues = {
      skill,
      skillRoll: parsedSkills === "None" ? false : !!skill,
      displayLabel,
      rollModifiers: {
        characteristic: shortLabel,
        other: otherMod
      }
    };
    if (diff) {
      returnValues["difficulty"] = difficulty;
    }
    return returnValues;
  } else {
    ui.notifications.error("TWODSIX.Ship.CannotParseArgument", { localize: true });
    return false;
  }
}
__name$19(getInitialSettingsFromFormula, "getInitialSettingsFromFormula");

var Crit = /* @__PURE__ */ ((Crit2) => {
  Crit2[Crit2["neither"] = 0] = "neither";
  Crit2[Crit2["success"] = 1] = "success";
  Crit2[Crit2["fail"] = 2] = "fail";
  return Crit2;
})(Crit || {});

var __defProp$18 = Object.defineProperty;
var __name$18 = (target, value) => __defProp$18(target, "name", { value, configurable: true });
Hooks.on("advanceTime", async (timeUsed, timeUnit) => {
  if (game.users.activeGM === game.user) {
    await advanceTime(timeUsed, timeUnit);
  }
});
async function advanceTime(timeUsed, timeUnit) {
  if (game.modules.get("foundryvtt-simple-calendar")?.active) {
    await advanceTimeSC(timeUsed, timeUnit);
  } else {
    await advanceTimeCore(timeUsed, timeUnit);
  }
}
__name$18(advanceTime, "advanceTime");
async function advanceTimeSC(timeUsed, timeUnit) {
  switch (timeUnit) {
    case "sec":
      await SimpleCalendar.api.changeDate({ seconds: timeUsed });
      break;
    case "min":
      await SimpleCalendar.api.changeDate({ minute: timeUsed });
      break;
    case "hrs":
      await SimpleCalendar.api.changeDate({ hour: timeUsed });
      break;
    case "days":
      await SimpleCalendar.api.changeDate({ day: timeUsed });
      break;
    case "weeks":
      await SimpleCalendar.api.changeDate({ day: timeUsed * 7 });
      break;
    case "months":
      await SimpleCalendar.api.changeDate({ month: timeUsed });
      break;
    case "rounds":
      await SimpleCalendar.api.changeDate({ seconds: timeUsed * CONFIG.time.roundTime });
      break;
  }
}
__name$18(advanceTimeSC, "advanceTimeSC");
async function advanceTimeCore(timeUsed, timeUnit) {
  let timeInSecs = timeUsed;
  switch (timeUnit) {
    case "sec":
      break;
    case "min":
      timeInSecs *= 60;
      break;
    case "hrs":
      timeInSecs *= 3600;
      break;
    case "days":
      timeInSecs *= 86400;
      break;
    case "weeks":
      timeInSecs *= 604800;
      break;
    case "months":
      timeInSecs *= 2628288;
      break;
    case "rounds":
      timeInSecs *= CONFIG.time.roundTime;
      break;
  }
  await game.time.advance(timeInSecs);
}
__name$18(advanceTimeCore, "advanceTimeCore");

var timeIntegration = /*#__PURE__*/Object.freeze({
  __proto__: null,
  advanceTime: advanceTime
});

var __defProp$17 = Object.defineProperty;
var __name$17 = (target, value) => __defProp$17(target, "name", { value, configurable: true });
const _TwodsixDiceRoll = class _TwodsixDiceRoll {
  constructor(rollSettings, actor, skill = null, item = null) {
    this.roll = null;
    this.rollSettings = rollSettings;
    this.actor = actor;
    this.skill = rollSettings.rollModifiers.selectedSkill ? fromUuidSync(rollSettings.rollModifiers.selectedSkill) : skill;
    this.item = item;
  }
  async evaluateRoll() {
    await this.createRoll();
    this.naturalTotal = this.roll?.dice[0].results.reduce((total, dice) => {
      return dice.active ? total + dice.result : total;
    }, 0) || 0;
    this.calculateEffect();
  }
  async createRoll() {
    const difficultiesAsTargetNumber = game.settings.get("twodsix", "difficultiesAsTargetNumber");
    const rollType = TWODSIX$1.ROLLTYPES[this.rollSettings.rollType].formula;
    const formulaData = {};
    let formula = rollType;
    let totalModifier = 0;
    if (!difficultiesAsTargetNumber) {
      formula += `${getOperatorString(this.rollSettings.difficulty.mod)} @difficultyMod`;
      formulaData.difficultyMod = Math.abs(this.rollSettings.difficulty.mod);
      totalModifier += this.rollSettings.difficulty.mod;
    }
    if (this.skill) {
      let skillValue = this.actor.system.skills[simplifySkillName(this.skill.name)];
      if (this.rollSettings.rollModifiers.skillLevelMax) {
        skillValue = Math.min(skillValue, this.rollSettings.rollModifiers.skillLevelMax);
      }
      formula += `${getOperatorString(skillValue)} @skillValue`;
      formulaData.skillValue = Math.abs(skillValue);
      formulaData.actualSkillValue = skillValue;
      totalModifier += skillValue;
    }
    this.modifierList = this.getRollModifierList();
    for (const modifierName of this.modifierList) {
      let modifierValue = 0;
      if (modifierName === "characteristic") {
        modifierValue = this.actor.getCharacteristicModifier(this.rollSettings.rollModifiers[modifierName]);
      } else if (modifierName === "targetModifier") {
        for (const targetMod of this.rollSettings.rollModifiers.targetModifier) {
          modifierValue += TWODSIX$1.TARGET_DM[targetMod].value;
        }
      } else {
        modifierValue = this.rollSettings.rollModifiers[modifierName];
      }
      formula += `${getOperatorString(modifierValue)} @${modifierName}`;
      formulaData[modifierName] = Math.abs(modifierValue);
      totalModifier += modifierValue;
    }
    if (game.settings.get("twodsix", "xd6RollStyle")) {
      this.roll = await new Roll(`${2 + Math.abs(totalModifier)}d6k${totalModifier < 0 ? "l" : "h"}2`, formulaData).evaluate();
    } else {
      this.roll = await new Roll(formula, formulaData).evaluate();
    }
  }
  getCrit() {
    const CRITICAL_EFFECT_VALUE = game.settings.get("twodsix", "absoluteCriticalEffectValue");
    if (this.isNaturalCritSuccess()) {
      return Crit.success;
    } else if (this.isNaturalCritFail()) {
      return Crit.fail;
    } else if (this.effect >= CRITICAL_EFFECT_VALUE) {
      return Crit.success;
    } else if (this.effect <= -CRITICAL_EFFECT_VALUE) {
      return Crit.fail;
    }
    return Crit.neither;
  }
  isNaturalCritSuccess() {
    return this.naturalTotal == 12;
  }
  isNaturalCritFail() {
    return this.naturalTotal == 2;
  }
  isSuccess() {
    return this.effect >= 0;
  }
  calculateEffect() {
    let effect;
    if (game.settings.get("twodsix", "difficultiesAsTargetNumber")) {
      effect = (this.roll?.total || 0) - this.rollSettings.difficulty.target;
    } else {
      effect = (this.roll?.total || 0) - TWODSIX$1.DIFFICULTIES[game.settings.get("twodsix", "difficultyListUsed")].Average.target;
    }
    if (this.isNaturalCritSuccess()) {
      console.log(`Got a natural 12 with Effect ${effect}!`);
      if (effect < 0 && game.settings.get("twodsix", "criticalNaturalAffectsEffect")) {
        console.log("Setting Effect to 0 due to natural 12!");
        effect = 0;
      }
    } else if (this.isNaturalCritFail()) {
      console.log(`Got a natural 2 with Effect ${effect}!`);
      if (effect >= 0 && game.settings.get("twodsix", "criticalNaturalAffectsEffect")) {
        console.log("Setting Effect to -1 due to natural 2!");
        effect = -1;
      }
    }
    this.effect = effect;
  }
  getDegreeOfSuccess() {
    if (game.settings.get("twodsix", "overrideSuccessWithNaturalCrit")) {
      if (this.naturalTotal === 2) {
        return game.i18n.localize("TWODSIX.Chat.Roll.DegreesOfSuccess.ExceptionalFailure");
      } else if (this.naturalTotal === 12) {
        return game.i18n.localize("TWODSIX.Chat.Roll.DegreesOfSuccess.ExceptionalSuccess");
      }
    }
    if (game.settings.get("twodsix", "useDegreesOfSuccess") === "CE") {
      if (this.effect <= -6) {
        return game.i18n.localize("TWODSIX.Chat.Roll.DegreesOfSuccess.ExceptionalFailure");
      } else if (this.effect <= -1) {
        return game.i18n.localize("TWODSIX.Chat.Roll.DegreesOfSuccess.Failure");
      } else if (this.effect <= 5) {
        return game.i18n.localize("TWODSIX.Chat.Roll.DegreesOfSuccess.Success");
      } else if (this.effect >= 6) {
        return game.i18n.localize("TWODSIX.Chat.Roll.DegreesOfSuccess.ExceptionalSuccess");
      } else {
        return "";
      }
    } else if (game.settings.get("twodsix", "useDegreesOfSuccess") === "other") {
      if (this.effect <= -6) {
        return game.i18n.localize("TWODSIX.Chat.Roll.DegreesOfSuccess.ExceptionalFailure");
      } else if (this.effect <= -2) {
        return game.i18n.localize("TWODSIX.Chat.Roll.DegreesOfSuccess.AverageFailure");
      } else if (this.effect === -1) {
        return game.i18n.localize("TWODSIX.Chat.Roll.DegreesOfSuccess.MarginalFailure");
      } else if (this.effect === 0) {
        return game.i18n.localize("TWODSIX.Chat.Roll.DegreesOfSuccess.MarginalSuccess");
      } else if (this.effect <= 5) {
        return game.i18n.localize("TWODSIX.Chat.Roll.DegreesOfSuccess.AverageSuccess");
      } else if (this.effect >= 6) {
        return game.i18n.localize("TWODSIX.Chat.Roll.DegreesOfSuccess.ExceptionalSuccess");
      } else {
        return "";
      }
    } else {
      return "";
    }
  }
  getRollModifierList() {
    const returnValue = [];
    if (this.rollSettings.rollModifiers.chain) {
      returnValue.push("chain");
    }
    if (this.rollSettings.rollModifiers.characteristic !== "NONE" && this.actor) {
      returnValue.push("characteristic");
    }
    if (this.rollSettings.itemRoll) {
      returnValue.push("item");
      if (this.rollSettings.rollModifiers.componentDamage) {
        returnValue.push("componentDamage");
      }
      if (this.rollSettings.rollModifiers.rof) {
        returnValue.push("rof");
      }
      if (this.rollSettings.rollModifiers.dodgeParry) {
        returnValue.push("dodgeParry");
      }
      if (this.rollSettings.rollModifiers.weaponsHandling) {
        returnValue.push("weaponsHandling");
      }
      if (this.rollSettings.rollModifiers.weaponsRange) {
        returnValue.push("weaponsRange");
      }
      if (this.rollSettings.rollModifiers.armorModifier) {
        returnValue.push("armorModifier");
      }
      if (this.rollSettings.rollModifiers.targetModifier?.length > 0) {
        returnValue.push("targetModifier");
      }
      if (this.rollSettings.rollModifiers.attachments) {
        returnValue.push("attachments");
      }
    }
    if (this.rollSettings.rollModifiers.other) {
      returnValue.push("other");
    }
    if (game.settings.get("twodsix", "useWoundedStatusIndicators") && this.rollSettings.rollModifiers.wounds < 0) {
      returnValue.push("wounds");
    }
    if (game.settings.get("twodsix", "useEncumbranceStatusIndicators") && this.rollSettings.rollModifiers.encumbered < 0) {
      returnValue.push("encumbered");
    }
    return returnValue;
  }
  async sendToChat(difficultyList) {
    const rollingString = game.i18n.localize("TWODSIX.Rolls.Rolling");
    const usingString = game.i18n.localize("TWODSIX.Actor.using");
    const difficulty = game.i18n.localize(getKeyByValue(difficultyList, this.rollSettings.difficulty));
    const showModifiers = game.settings.get("twodsix", "showModifierDetails");
    let flavorText = ``;
    if (game.settings.get("twodsix", "showItemIconsInChat")) {
      if (this.rollSettings.itemRoll && this.item?.img) {
        flavorText += `<section style="align-self: center;"><img src=${this.item.img} class="chat-image"></section>`;
      } else if (this.rollSettings.skillRoll && this.skill?.img) {
        flavorText += `<section style="align-self: center;"><img src=${this.skill.img} class="chat-image"></section>`;
      }
    }
    let flavorTable = `<table class="flavor-table"><tr><th>${game.i18n.localize("TWODSIX.Chat.Roll.Modifier")}</th><th>${game.i18n.localize("TWODSIX.Chat.Roll.Description")}</th><th class="centre">${game.i18n.localize("TWODSIX.Chat.Roll.DM")}</th></tr>`;
    if (this.roll?.dice[0]?.values) {
      const diceDetails = getDiceSymbols(this.roll.dice[0].values);
      flavorTable += `<tr><td>${game.i18n.localize("TWODSIX.Chat.Roll.Dice")}</td><td style= "font-size: larger;">${diceDetails}</td><td class="centre">${this.roll.dice[0].total}</td></tr>`;
    }
    flavorText += `<section><p><b>${rollingString}</b>: ${difficulty}`;
    flavorTable += `<tr><td>${game.i18n.localize("TWODSIX.Chat.Roll.Difficulty")}</td><td>${difficulty}</td>`;
    if (game.settings.get("twodsix", "difficultiesAsTargetNumber")) {
      flavorText += showModifiers ? `(${this.rollSettings.difficulty.target}+)` : ``;
      flavorTable += `<td class="centre">${this.rollSettings.difficulty.target}+</td></tr>`;
    } else {
      const difficultyMod = addSign(this.rollSettings.difficulty.mod);
      flavorText += showModifiers ? `(${difficultyMod})` : ``;
      flavorTable += `<td class="centre">${difficultyMod}</td></tr>`;
    }
    if (this.rollSettings.rollType != TWODSIX$1.ROLLTYPES.Normal.key) {
      const rollType = advantageDisadvantageTerm(this.rollSettings.rollType);
      flavorText += ` ${game.i18n.localize("TWODSIX.Rolls.With")} ${rollType}`;
      flavorTable += `<tr><td>${game.i18n.localize("TWODSIX.Chat.Roll.Type")}</td><td>${rollType}</td><td class="centre">&mdash;</td></tr>`;
    }
    if (this.skill) {
      const skillValue = addSign(this.roll.data.actualSkillValue);
      flavorText += ` ${usingString} ${this.skill.name}` + (showModifiers ? `(${skillValue})` : ``) + ` ${game.i18n.localize("TWODSIX.itemTypes.skill")}`;
      flavorTable += `<tr><td>${game.i18n.localize("TWODSIX.Chat.Roll.SkillModifier")}</td><td>${this.skill.name}</td><td class="centre">${skillValue}</td></tr>`;
    }
    for (const modifierName of this.modifierList) {
      const description = game.i18n.localize(`TWODSIX.Chat.Roll.${capitalizeFirstLetter(modifierName)}`);
      if (modifierName === "characteristic") {
        const characteristicValue = addSign(this.actor.getCharacteristicModifier(this.rollSettings.rollModifiers.characteristic));
        const charShortName = this.rollSettings.displayLabel;
        flavorText += (this.rollSettings.skillRoll ? ` &` : ` ${usingString}`) + ` ${charShortName}` + (showModifiers ? `(${characteristicValue})` : ``) + ` ${description}`;
        flavorTable += `<tr><td>${description}</td><td>${charShortName}</td><td class="centre">${characteristicValue}</td></tr>`;
      } else if (modifierName === "targetModifier") {
        let modValue = 0;
        for (const modifier of this.rollSettings.rollModifiers.targetModifier) {
          const modifierObj = TWODSIX$1.TARGET_DM[modifier];
          flavorTable += `<tr><td>${description}</td><td>${modifierObj.label}</td><td class="centre">${modifierObj.value}</td></tr>`;
          modValue += modifierObj.value;
        }
        if (modValue !== 0) {
          const modValueStr = addSign(modValue);
          flavorText += ` + ${description}`;
          flavorText += showModifiers ? `(${modValueStr})` : ``;
        }
      } else {
        switch (modifierName) {
          case "item":
            flavorText += (this.rollSettings.skillRoll ? ` &` : ` ${usingString}`) + ` ${this.rollSettings.itemName}`;
            flavorTable += `<tr><td>${game.i18n.localize("TWODSIX.Chat.Roll." + (this.item?.type === "psiAbility" ? "AbilityModifier" : "ItemModifier"))}</td><td>${this.rollSettings.itemName}</td>`;
            break;
          case "chain":
            flavorText += ` ${game.i18n.localize("TWODSIX.Chat.Roll.WithChainBonus")}`;
            flavorTable += `<tr><td>${description}</td><td>${game.i18n.localize("TWODSIX.Chat.Roll.Bonus")}</td>`;
            break;
          case "attachments":
          case "rof":
          case "weaponsHandling":
          case "weaponsRange":
          case "dodgeParry":
          case "armorModifier":
          case "componentDamage":
            flavorText += ` + ${description}`;
            flavorTable += `<tr><td>${game.i18n.localize("TWODSIX.Chat.Roll.Attack")}</td><td>${description}</td>`;
            break;
          case "wounds":
          case "encumbered":
            flavorText += ` + ${description}`;
            flavorTable += `<tr><td>${game.i18n.localize("TWODSIX.Chat.Roll.Condition")}</td><td>${description}</td>`;
            break;
          case "other":
            flavorText += ` + ${description}`;
            flavorTable += `<tr><td>${description}</td><td>&mdash;</td>`;
            break;
        }
        const modValue = addSign(this.rollSettings.rollModifiers[modifierName]);
        flavorText += showModifiers ? `(${modValue})` : ``;
        flavorTable += `<td class="centre">${modValue}</td></tr>`;
      }
    }
    flavorText += `</p>`;
    flavorTable += `</table>`;
    if (this.rollSettings.rollModifiers.appliedEffects.length > 0 && showModifiers) {
      flavorTable += `<section style="margin-top: 1em;">${game.i18n.localize("TWODSIX.ActiveEffects.IncludingEffects")}</section>`;
      flavorTable += `<table><tr><th>${game.i18n.localize("TWODSIX.ActiveEffects.Source")}</th><th>${game.i18n.localize("TWODSIX.Chat.Roll.Modifier")}</th><th>${game.i18n.localize("TWODSIX.Chat.Roll.DM")}</th></tr>`;
      for (const appliedAE of this.rollSettings.rollModifiers.appliedEffects) {
        flavorTable += `<tr><td>${appliedAE.name}</td><td>${appliedAE.stat}</td><td class="centre">${appliedAE.value}</td></tr>`;
      }
      flavorTable += `</table>`;
    }
    if (this.rollSettings.itemRoll && this.item?.system?.features !== "" && this.item?.system.features && game.settings.get("twodsix", "showFeaturesInChat")) {
      flavorText += `<p><b>${game.i18n.localize("TWODSIX.Items.Weapon.Features")}</b>: ${this.item.system.features}</p>`;
    }
    let timeToComplete = ``;
    if (game.settings.get("twodsix", "showTimeframe") && this.rollSettings.selectedTimeUnit !== "none") {
      if (Roll.validate(this.rollSettings.timeRollFormula)) {
        const timeUsed = (await new Roll(this.rollSettings.timeRollFormula).evaluate()).total;
        const timeUnit = this.rollSettings.selectedTimeUnit;
        timeToComplete = `${timeUsed.toString()} ${game.i18n.localize(TWODSIX$1.TimeUnits[timeUnit])}`;
        if (game.settings.get("twodsix", "autoIncrementTime")) {
          if (game.users.activeGM === game.user) {
            advanceTime(timeUsed, timeUnit);
          } else {
            game.socket?.emit("system.twodsix", ["advanceTime", timeUsed, timeUnit]);
          }
        }
      }
    }
    let degreeOfSuccess = ``;
    if (!["Attack", "ShipWeapon", "Unknown"].includes(this.rollSettings.flags.rollClass) && game.settings.get("twodsix", "useDegreesOfSuccess") !== "none") {
      degreeOfSuccess = this.getDegreeOfSuccess();
    }
    flavorText += `<section class="card-buttons"><button type="button" data-action="expand" data-tooltip="${game.i18n.localize("TWODSIX.Rolls.ToggleDetails")}"><i class="fa-solid fa-circle-question" ></i></button>`;
    if (this.isSuccess() && !game.settings.get("twodsix", "automateDamageRollOnHit") && (this.item?.type === "weapon" || this.item?.type === "component" && this.item?.system?.subtype === "armament")) {
      flavorText += `<button type="button" data-action="damage" data-tooltip="${game.i18n.localize("TWODSIX.Rolls.RollDamage")}"><i class="fa-solid fa-person-burst" ></i></button>`;
    } else if (this.rollSettings.skillRoll && this.item?.type !== "weapon" && !(this.item?.type === "component" && this.item?.system?.subtype === "armament")) {
      flavorText += `<button type="button" data-action="chain" data-tooltip="${game.i18n.localize("TWODSIX.Rolls.RollChain")}"><i class="fa-solid fa-link" ></i></button>`;
      flavorText += `<button type="button" data-action="opposed" data-tooltip="${game.i18n.localize("TWODSIX.Rolls.RollOpposed")}"><i class="fa-solid fa-down-left-and-up-right-to-center" ></i></button>`;
    }
    flavorText += `</section></section>`;
    const flavor = (this.rollSettings.extraFlavor ? `<section>${this.rollSettings.extraFlavor}</section>` : ``) + `<section class="flavor-message"><section class="flavor-line">` + flavorText + `</section><section class="dice-chattip" style="display: none;">` + flavorTable + `</section></section>`;
    let title = "";
    if (this.item) {
      title = "TWODSIX.Chat.Roll.Types.ItemRoll";
    } else if (this.skill) {
      title = "TWODSIX.Chat.Roll.Types.SkillRoll";
    } else if (this.modifierList?.includes("characteristic")) {
      title = "TWODSIX.Chat.Roll.Types.CharRoll";
    } else {
      title = "TWODSIX.Chat.Roll.Types.OtherRoll";
    }
    await this.roll?.toMessage(
      {
        title: game.i18n.localize(title),
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        rolls: [this.roll],
        flavor,
        //rollMode: this.rollSettings.rollMode,
        flags: {
          "core.canPopout": true,
          "twodsix.crit": this.getCrit(),
          "twodsix.effect": this.effect,
          "twodsix.degreeOfSuccess": degreeOfSuccess,
          "twodsix.timeframe": timeToComplete,
          "twodsix.itemUUID": this.rollSettings.flags.itemUUID ?? "",
          "twodsix.tokenUUID": this.rollSettings.flags.tokenUUID ?? "",
          "twodsix.rollClass": this.rollSettings.flags.rollClass ?? "",
          "twodsix.actorUUID": this.rollSettings.flags.actorUUID ?? "",
          "twodsix.bonusDamage": this.rollSettings.flags.bonusDamage ?? "",
          "twodsix.attackType": this.rollSettings.flags.attackType ?? ""
        }
      },
      { rollMode: this.rollSettings.rollMode }
    );
  }
};
__name$17(_TwodsixDiceRoll, "TwodsixDiceRoll");
let TwodsixDiceRoll = _TwodsixDiceRoll;
function getOperatorString(value) {
  if (isNaN(value)) {
    return ``;
  } else if (value < 0) {
    return ` -`;
  } else {
    return ` +`;
  }
}
__name$17(getOperatorString, "getOperatorString");
function getDiceSymbols(values) {
  let returnVal = ``;
  for (const value of values) {
    returnVal += `<i class="fa-solid fa-dice-` + [`one">`, `two">`, `three">`, `four">`, `five">`, `six">`][value - 1] + `</i> `;
  }
  return returnVal;
}
__name$17(getDiceSymbols, "getDiceSymbols");

var __defProp$16 = Object.defineProperty;
var __name$16 = (target, value) => __defProp$16(target, "name", { value, configurable: true });
const _Attribute = class _Attribute {
  constructor(characteristic, actor) {
    this.damage = 0;
    if (actor.type !== "ship") {
      this.original = actor.system.characteristics[characteristic];
    }
  }
  current() {
    return this.original.value - this.totalDamage();
  }
  mod() {
    return calcModFor(this.current());
  }
  totalDamage() {
    return this.damage + this.original.damage;
  }
};
__name$16(_Attribute, "Attribute");
let Attribute = _Attribute;
const _Stats$1 = class _Stats {
  constructor(actor, damageValue, armorPiercingValue, damageType, damageLabel, parryArmor = 0, canOnlyBeBlocked = false, dice = []) {
    this.edited = false;
    this.damageCharacteristics = [];
    this.useLifebloodStamina = false;
    this.useLifebloodEndurance = false;
    this.useLifebloodOnly = false;
    this.strength = new Attribute("strength", actor);
    this.dexterity = new Attribute("dexterity", actor);
    this.endurance = new Attribute("endurance", actor);
    this.stamina = new Attribute("stamina", actor);
    this.lifeblood = new Attribute("lifeblood", actor);
    this.actor = actor;
    this.damageValue = damageValue;
    this.damageType = damageType;
    const damageLabels = getDamageTypes(true);
    this.damageLabel = damageLabels[damageType] || damageLabel;
    this.dice = dice;
    this.armorPiercingValue = armorPiercingValue;
    if (actor.type !== "ship") {
      this.primaryArmor = this.damageType === "psionic" ? 0 : actor.system.primaryArmor.value;
      this.secondaryArmor = actor.getSecondaryProtectionValue(damageType);
      this.parryArmor = parryArmor;
      this.canOnlyBeBlocked = canOnlyBeBlocked;
      this.effectiveArmor = this.calcEffectiveArmor();
    }
    this.damageCharacteristics = getDamageCharacteristics(this.actor.type);
    this.damageFormula = game.settings.get("twodsix", "armorDamageFormula");
    this.useCUData = game.settings.get("twodsix", "ruleset") === "CU";
    if (game.settings.get("twodsix", "animalsUseHits") && actor.type === "animal" || game.settings.get("twodsix", "robotsUseHits") && actor.type === "robot") {
      this.useLifebloodStamina = false;
      this.useLifebloodEndurance = false;
      this.useLifebloodOnly = true;
    } else if (game.settings.get("twodsix", "lifebloodInsteadOfCharacteristics")) {
      this.useLifebloodStamina = false;
      this.useLifebloodEndurance = true;
      this.useLifebloodOnly = false;
    } else if (game.settings.get("twodsix", "showLifebloodStamina")) {
      this.useLifebloodStamina = true;
      this.useLifebloodEndurance = false;
      this.useLifebloodOnly = false;
    }
    this.reduceStats();
  }
  calcEffectiveArmor() {
    if (game.settings.get("twodsix", "ruleset") === "CU") {
      const totalBlocked = blockedByArmor(this.damageValue, this.secondaryArmor) + this.parryArmor;
      return Math.max(totalBlocked - this.armorPiercingValue, 0);
    }
    const primaryFractional = this.primaryArmor > 0 && this.primaryArmor < 1;
    const secondaryFractional = this.secondaryArmor > 0 && this.secondaryArmor < 1;
    let effectiveArmorValue = 0;
    if (primaryFractional && secondaryFractional) {
      const combinedArmor = stackArmorValues(this.primaryArmor, this.secondaryArmor);
      effectiveArmorValue = blockedByArmor(this.damageValue, combinedArmor);
    } else if (primaryFractional || secondaryFractional) {
      effectiveArmorValue = blockedByArmor(this.damageValue, this.primaryArmor) + blockedByArmor(this.damageValue, this.secondaryArmor);
    } else {
      effectiveArmorValue = Math.floor(this.primaryArmor) + Math.floor(this.secondaryArmor);
    }
    return Math.max(effectiveArmorValue - this.armorPiercingValue, 0);
  }
  currentDamage() {
    let retValue = 0;
    for (const characteristic of this.damageCharacteristics) {
      retValue += this[characteristic].damage;
    }
    return retValue;
  }
  totalDamage() {
    const rollData = foundry.utils.duplicate(this.actor.getRollData());
    Object.assign(rollData, { damage: this.damageValue, effectiveArmor: this.effectiveArmor });
    const damageFormula = this.armorPiercingValue === 9999 ? "@damage" : this.damageFormula;
    if (Roll.validate(damageFormula)) {
      const totalDamage = Roll.safeEval(Roll.replaceFormulaData(damageFormula, rollData, { missing: "0", warn: true }));
      return Math.round(Math.max(totalDamage, 0));
    }
    return Math.max(this.damageValue - this.effectiveArmor, 0);
  }
  remaining() {
    return this.totalDamage() - this.currentDamage();
  }
  totalCurrent() {
    let retValue = 0;
    for (const characteristic of this.damageCharacteristics) {
      retValue += this[characteristic].current();
    }
    return retValue;
  }
  setDamage(damageValue) {
    this.damageValue = damageValue;
    if (!this.edited) {
      this.reduceStats();
    }
  }
  setArmor(effectiveArmor) {
    this.effectiveArmor = effectiveArmor;
    if (!this.edited) {
      this.reduceStats();
    }
  }
  unallocatedDamage() {
    let retValue = this.totalDamage();
    for (const characteristic of this.damageCharacteristics) {
      retValue -= this[characteristic].damage;
    }
    return retValue;
  }
  updateActor() {
    this.actor.prepareData();
    for (const characteristic of this.damageCharacteristics) {
      this[characteristic].original = this.actor.system.characteristics[characteristic];
    }
    if (!this.edited) {
      this.reduceStats();
    }
  }
  reduceStats() {
    let remaining = this.totalDamage();
    for (const characteristic of this.damageCharacteristics) {
      this[characteristic].damage = 0;
      if (remaining > 0) {
        if (remaining <= this[characteristic].current()) {
          this[characteristic].damage = remaining;
          remaining = 0;
        } else {
          remaining -= this[characteristic].current();
          this[characteristic].damage = this[characteristic].current();
        }
      }
    }
  }
  async applyDamage() {
    let charName = "";
    const charArray = {};
    for (const characteristic of this.damageCharacteristics) {
      charName = "system.characteristics." + characteristic + ".damage";
      charArray[charName] = this[characteristic].totalDamage();
    }
    await this.actor.update(charArray);
  }
};
__name$16(_Stats$1, "Stats");
let Stats$1 = _Stats$1;
const _DamageDialogHandler = class _DamageDialogHandler {
  constructor(stats) {
    this.hooks = {};
    this.stats = stats;
    this.hooks["updateActor"] = Hooks.on("updateActor", this.hookUpdate.bind(this));
    this.hooks["updateToken"] = Hooks.on("updateToken", this.hookUpdate.bind(this));
  }
  hookUpdate() {
    this.stats.updateActor();
    this.refresh();
  }
  setHtml(html) {
    this.html = html.element;
    this.registerEventListeners();
    this.refresh();
  }
  refresh() {
    this.html.querySelector(".applied-damage").textContent = this.stats.totalDamage().toString();
    for (const characteristic of this.stats.damageCharacteristics) {
      const chrHtml = this.html.querySelector(`.${characteristic}`);
      const stat = this.stats[characteristic];
      if (chrHtml) {
        if (!this.stats.edited) {
          chrHtml.querySelector(`.damage-input`).value = stat.damage;
        }
        if (characteristic === this.stats.damageCharacteristics[0] && stat.current() !== 0 && this.stats.currentDamage() - stat.damage > 0) {
          if (!chrHtml.querySelector(`.damage-input`)?.classList.contains("orange-border")) {
            chrHtml.querySelector(`.damage-input`)?.classList.add("orange-border");
            if (stat.original.damage === 0) {
              ui.notifications.warn("TWODSIX.Warnings.DecreaseEnduranceFirst", { localize: true });
            }
          }
        } else {
          chrHtml.querySelector(`.damage-input`)?.classList.remove("orange-border");
        }
        chrHtml.querySelector(`.original-value`).innerHTML = stat.original.value.toString();
        chrHtml.querySelector(`.original-current`).innerHTML = stat.original.current.toString();
        chrHtml.querySelector(`.result-value`).innerHTML = stat.current().toString();
        if (chrHtml.querySelector(`.current-mod`)) {
          chrHtml.querySelector(`.current-mod`).innerHTML = stat.original.mod.toString();
        }
        if (chrHtml.querySelector(`.mod`)) {
          chrHtml.querySelector(`.mod`).innerHTML = stat.mod().toString();
        }
      }
    }
    if (this.stats.unallocatedDamage() !== 0) {
      this.html.querySelector(".unalocated-damage-text")?.classList.add("orange");
    } else {
      this.html.querySelector(".unalocated-damage-text")?.classList.remove("orange");
    }
    this.html.querySelector(".unalocated-damage").innerHTML = this.stats.unallocatedDamage().toString();
    const characterDead = this.html.querySelector(".character-dead");
    if (characterDead) {
      if (this.stats.totalCurrent() === 0) {
        characterDead.style.display = "";
      } else {
        characterDead.style.display = "none";
      }
    }
  }
  registerEventListeners() {
    this.html.querySelectorAll(".damage")?.forEach((el) => {
      el.addEventListener("input", (ev) => {
        this.stats.setDamage(this.getNumericValueFromEvent(ev));
        this.refresh();
      });
    });
    this.html.querySelectorAll(".armor")?.forEach((el) => {
      el.addEventListener("input", (ev) => {
        this.stats.setArmor(this.getNumericValueFromEvent(ev));
        this.refresh();
      });
    });
    this.html.querySelectorAll(".damage-input")?.forEach((el) => {
      el.addEventListener("input", (ev) => {
        const value = this.getNumericValueFromEvent(ev, true);
        const stat = this.stats[ev.currentTarget.dataset.stat];
        this.stats.edited = true;
        stat.damage = value;
        this.refresh();
      });
    });
  }
  getNumericValueFromEvent(ev, upper) {
    const value = parseInt(ev.currentTarget.value, 10);
    const newVal = isNaN(value) ? 0 : value;
    if (newVal < 0) {
      ui.notifications.warn("TWODSIX.Warnings.StatValBelowZero", { localize: true });
      ev.currentTarget.value = 0;
      return 0;
    }
    if (upper) {
      const stat = this.stats[ev.currentTarget.dataset.stat];
      const current = stat.original.current;
      if (value > current) {
        ev.currentTarget.value = current;
        ui.notifications.warn("TWODSIX.Warnings.MaxStatVal", { localize: true });
        return current;
      }
    }
    return newVal;
  }
  unRegisterListeners() {
    Object.entries(this.hooks).forEach(([hookName, hook]) => Hooks.off(hookName, hook));
  }
};
__name$16(_DamageDialogHandler, "DamageDialogHandler");
let DamageDialogHandler = _DamageDialogHandler;
async function renderDamageDialog(damageData) {
  const { damageId, damageValue, armorPiercingValue, damageType, damageLabel, canBeParried, canBeBlocked, dice } = damageData;
  let actor = damageData.actor;
  if (!actor.uuid) {
    actor = await fromUuid(damageData.targetUuid);
  }
  const actorUsersNonGM = game.users?.filter((user) => user.active && actor && actor.testUserPermission(user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) && !user.isGM) || null;
  if (game.user?.isGM && actorUsersNonGM?.length > 0 || !game.user?.isGM && !actor.isOwner) {
    return;
  }
  const template = "systems/twodsix/templates/actors/damage-dialog.hbs";
  const canOnlyBeBlocked = canBeBlocked && !canBeParried;
  const parryArmor = canBeParried || canBeBlocked ? await getParryValue(actor, canOnlyBeBlocked) : 0;
  const stats = new Stats$1(actor, damageValue, armorPiercingValue, damageType, damageLabel, parryArmor, canOnlyBeBlocked, dice);
  const damageDialogHandler = new DamageDialogHandler(stats);
  const renderedHtml = await foundry.applications.handlebars.renderTemplate(template, { stats: damageDialogHandler.stats });
  const title = game.i18n.localize("TWODSIX.Damage.DealDamageTo").replace("_ACTOR_NAME_", actor.name);
  await foundry.applications.api.DialogV2.wait({
    window: {
      title,
      icon: "fa-solid fa-person-burst"
    },
    content: renderedHtml,
    buttons: [
      {
        action: "ok",
        label: "TWODSIX.Damage.DealDamage",
        icon: "fa-solid fa-hand-fist",
        default: true,
        callback: /* @__PURE__ */ __name$16(() => {
          stats.edited = true;
          stats.applyDamage();
          game.socket?.emit("system.twodsix", ["destroyDamageDialog", damageId]);
          Hooks.call("destroyDamageDialog", damageId);
        }, "callback")
      },
      {
        action: "cancel",
        icon: "fa-solid fa-xmark",
        label: "Cancel",
        callback: /* @__PURE__ */ __name$16(() => {
        }, "callback")
      }
    ],
    close: /* @__PURE__ */ __name$16(() => damageDialogHandler.unRegisterListeners(), "close"),
    render: /* @__PURE__ */ __name$16((ev, html) => {
      damageDialogHandler.setHtml(html);
    }, "render"),
    rejectClose: false
  }, { id: damageId });
}
__name$16(renderDamageDialog, "renderDamageDialog");
function destroyDamageDialog(damageId) {
  Object.values(ui.windows).forEach((foundryWindow) => {
    if (foundryWindow instanceof Dialog && foundryWindow.id === damageId) {
      foundryWindow.close();
    }
  });
}
__name$16(destroyDamageDialog, "destroyDamageDialog");
function getDamageCharacteristics(actorType) {
  if (game.settings.get("twodsix", "animalsUseHits") && actorType === "animal" || game.settings.get("twodsix", "robotsUseHits") && actorType === "robot") {
    return ["lifeblood"];
  } else if (game.settings.get("twodsix", "lifebloodInsteadOfCharacteristics")) {
    return ["endurance", "strength"];
  } else if (game.settings.get("twodsix", "showLifebloodStamina")) {
    return ["stamina", "lifeblood"];
  } else {
    return ["endurance", "strength", "dexterity"];
  }
}
__name$16(getDamageCharacteristics, "getDamageCharacteristics");
async function getParryValue(actor, canOnlyBeBlocked) {
  let returnValue = 0;
  if (game.settings.get("twodsix", "ruleset") === "CU") {
    const meleeSkill = actor.getBestSkill(game.i18n.localize("TWODSIX.Items.Skills.MeleeCombat") + "| Melee Combat | Melee", false);
    if (meleeSkill) {
      const weaponsList = actor.itemTypes.weapon.filter((it) => itemCanBlock(it, canOnlyBeBlocked));
      if (weaponsList?.length > 0) {
        weaponsList.sort((a, b) => b.system.parryAV - a.system.parryAV);
        const weapon = weaponsList[0];
        if (weapon.system.parryAV > 0) {
          const tmpSettings = {
            difficulty: TWODSIX$1.DIFFICULTIES.CU.Average,
            rollModifiers: { char: "DEX" },
            extraFlavor: `${game.i18n.localize("TWODSIX.Rolls.MakesParryRoll")} ${weapon.name}(AV: ${weapon.system.parryAV})`
          };
          const settings = await TwodsixRollSettings.create(false, tmpSettings, meleeSkill, void 0, actor);
          if (settings.shouldRoll) {
            const returnRoll = await meleeSkill.skillRoll(false, settings);
            if (returnRoll?.effect >= 0) {
              returnValue = weapon.system.parryAV;
            }
          }
        }
      } else {
        ui.notifications.warn("TWODSIX.Warnings.CantFind" + (canOnlyBeBlocked ? "Shield" : "MeleeWeapon"), { localize: true });
      }
    } else {
      ui.notifications.warn("TWODSIX.Warnings.CantFindMeleeSkill", { localize: true });
    }
  }
  return returnValue;
}
__name$16(getParryValue, "getParryValue");
function itemCanBlock(weapon, canBeBlocked) {
  let returnValue = weapon.system.damageType === "melee" && weapon.system.equipped === "equipped" && Number.isInteger(weapon.system.parryAV);
  if (canBeBlocked) {
    returnValue = returnValue && weapon.system.isShield;
  }
  return returnValue;
}
__name$16(itemCanBlock, "itemCanBlock");
function blockedByArmor(damage, armor) {
  if (armor > 0 && armor < 1) {
    return Math.floor(damage * armor);
  }
  if (armor <= 0) {
    return 0;
  }
  return Math.floor(armor);
}
__name$16(blockedByArmor, "blockedByArmor");
function stackArmorValues(base, add) {
  const isFrac = /* @__PURE__ */ __name$16((v) => v > 0 && v < 1, "isFrac");
  if (isFrac(base) && isFrac(add)) {
    const combined = 1 - (1 - base) * (1 - add);
    return Math.max(0, Math.min(1, combined));
  }
  return base + add;
}
__name$16(stackArmorValues, "stackArmorValues");

var __defProp$15 = Object.defineProperty;
var __name$15 = (target, value) => __defProp$15(target, "name", { value, configurable: true });
async function applyToAllActors(fn) {
  const validActorTypes = Object.keys(CONFIG.Actor.dataModels);
  const allActors = game.actors?.filter((act) => validActorTypes.includes(act.type)) ?? [];
  for (const scene of game.scenes ?? []) {
    for (const token of scene.tokens ?? []) {
      if (token.actor && !token.actorLink && validActorTypes.includes(token.actor.type)) {
        allActors.push(token.actor);
      }
    }
  }
  for (const actor of allActors) {
    await fn(actor);
  }
  const actorPacks = game.packs.filter((pack) => pack.metadata.type === "Actor" && pack.metadata.packageType !== "system");
  await applyToAllPacks(fn, actorPacks);
  return Promise.resolve();
}
__name$15(applyToAllActors, "applyToAllActors");
async function applyToAllItems(fn) {
  const itemPacks = game.packs.filter((pack) => pack.metadata.type === "Item" && pack.metadata.packageType !== "system");
  await applyToAllPacks(fn, itemPacks);
  const validItemsTypes = Object.keys(CONFIG.Item.dataModels);
  const allItems = game.items?.filter((itm) => validItemsTypes.includes(itm.type)) ?? [];
  for (const item of allItems) {
    await fn(item);
  }
  return Promise.resolve();
}
__name$15(applyToAllItems, "applyToAllItems");
async function applyToAllPacks(fn, packs) {
  for (const pack of packs) {
    const wasLocked = pack.locked;
    try {
      if (pack.locked) {
        await pack.configure({ locked: false });
      }
      const validTypes = pack.metadata.type === "Actor" ? Object.keys(CONFIG.Actor.dataModels) : pack.metadata.type === "Item" ? Object.keys(CONFIG.Item.dataModels) : [];
      for (const doc of await pack.getDocuments()) {
        if (!validTypes.includes(doc.type)) {
          console.log(`Skipping document with invalid type in pack ${pack.collection}:`, doc);
          continue;
        }
        try {
          await fn(doc);
        } catch (docError) {
          console.warn(`Error applying function to document in pack ${pack.collection}:`, docError);
        }
      }
      if (wasLocked) {
        await pack.configure({ locked: true });
      }
    } catch (packError) {
      console.warn(`Error processing pack ${pack.collection}:`, packError);
    }
  }
}
__name$15(applyToAllPacks, "applyToAllPacks");

var __defProp$14 = Object.defineProperty;
var __name$14 = (target, value) => __defProp$14(target, "name", { value, configurable: true });
const _TwodsixShipActions = class _TwodsixShipActions {
  static async chatMessage(msgStr, extra) {
    const speakerData = ChatMessage.getSpeaker({ actor: extra.actor });
    if (msgStr.startsWith("/r") || msgStr.startsWith("/R")) {
      const parsedText = msgStr.split("#");
      let rollText = parsedText[0].substring(msgStr.indexOf(" ") + 1).trim();
      const flavorText = parsedText.length > 1 ? parsedText[1].trim() : game.i18n.localize("TWODSIX.Ship.MakesChatRollAction").replace("_ACTION_NAME_", extra.actionName || game.i18n.localize("TWODSIX.Ship.Unknown")).replace("_POSITION_NAME_", extra.positionName || game.i18n.localize("TWODSIX.Ship.Unknown"));
      const useInvertedShiftClick = game.settings.get("twodsix", "invertSkillRollShiftClick");
      const showRollDiag = useInvertedShiftClick ? extra.event["shiftKey"] : !extra.event["shiftKey"];
      if (showRollDiag) {
        rollText = await confirmRollFormula(rollText, extra.positionName + " " + game.i18n.localize("TWODSIX.Ship.ActionRollFormula"));
      }
      if (Roll.validate(rollText)) {
        const rollData = extra.actor.getRollData() ?? {};
        Object.assign(rollData, { ship: extra.ship.getRollData() });
        const msg = await new Roll(rollText, rollData).toMessage({
          title: game.i18n.localize("TWODSIX.Chat.Roll.Types.ShipAction"),
          speaker: speakerData,
          flavor: flavorText,
          type: CONST.CHAT_MESSAGE_STYLES.OTHER
        });
        return msg;
      }
    }
    return ChatMessage.create({ content: msgStr, speaker: speakerData });
  }
  static async skillRoll(text, extra) {
    const useInvertedShiftClick = game.settings.get("twodsix", "invertSkillRollShiftClick");
    const showTrowDiag = useInvertedShiftClick ? extra.event["shiftKey"] : !extra.event["shiftKey"];
    const settings = getInitialSettingsFromFormula(text, extra.actor);
    if (settings) {
      Object.assign(settings, {
        extraFlavor: game.i18n.localize("TWODSIX.Ship.MakesChatRollAction").replace("_ACTION_NAME_", extra.actionName || game.i18n.localize("TWODSIX.Ship.Unknown")).replace("_POSITION_NAME_", extra.positionName || game.i18n.localize("TWODSIX.Ship.Unknown")),
        flags: { tokenUUID: extra.ship?.uuid }
      });
      Object.assign(settings.rollModifiers, { item: extra.diceModifier ? parseInt(extra.diceModifier) : 0 });
      const skill = settings.skill;
      delete settings.skill;
      if (!settings.skillRoll) {
        if (settings.rollModifiers.characteristic) {
          extra.actor.characteristicRoll({ rollModifiers: settings.rollModifiers, difficulty: settings.difficulty }, true);
        } else {
          return false;
        }
      } else {
        const options = await TwodsixRollSettings.create(showTrowDiag, settings, skill, extra.component, extra.actor);
        if (!options.shouldRoll) {
          return false;
        }
        if (extra.component) {
          return await extra.component.skillRoll(false, options);
        } else {
          return await skill.skillRoll(false, options);
        }
      }
    } else {
      ui.notifications.error("TWODSIX.Ship.CannotParseArgument", { localize: true });
      return false;
    }
  }
  static async fireEnergyWeapons(text, extra) {
    const skillTextAndComponentId = text.trim().split("=");
    if (skillTextAndComponentId.length > 1 && !extra.component) {
      const componentId = skillTextAndComponentId[1];
      extra.component = extra.ship?.items.find((item) => item.id === componentId);
    }
    const skillText = skillTextAndComponentId[0];
    const result = await _TwodsixShipActions.skillRoll(skillText, extra);
    if (!result) {
      return false;
    }
    const usingCompStr = extra.component ? game.i18n.localize("TWODSIX.Ship.WhileUsing") + extra.component.name + ` ` : "";
    if (game.settings.get("twodsix", "automateDamageRollOnHit") && extra.component?.system?.subtype === "armament") {
      if (result.effect >= 0 && extra.component) {
        if (extra.component.system.ammoLink !== "none") {
          const linkedAmmo = extra.ship?.items.get(extra.component.system.ammoLink);
          if (linkedAmmo) {
            extra.component = linkedAmmo;
          }
        }
        const bonusDamage = game.settings.get("twodsix", "addEffectForShipDamage") ? result.effect.toString() : "";
        await extra.component.rollDamage(game.settings.get("core", "rollMode"), bonusDamage, true, false, result.effect);
      } else {
        await _TwodsixShipActions.chatMessage(game.i18n.localize("TWODSIX.Ship.ActionMisses").replace("_WHILE_USING_", usingCompStr).replace("_EFFECT_VALUE_", result.effect.toString()), extra);
      }
    }
  }
  static async executeMacro(macroName, extra) {
    const foundMacros = await game.macros.find((macro) => macro.name === macroName);
    if (!foundMacros) {
      ui.notifications.warn(game.i18n.localize("TWODSIX.Warnings.MacroNotFound").replace("_MACRO_NAME_", macroName));
    } else {
      if (foundMacros.canExecute) {
        const scope = { actor: extra.actor, ship: extra.ship, component: extra.component };
        foundMacros.execute(scope);
      } else {
        ui.notifications.warn("TWODSIX.Warnings.PlayerDoesNotHavePermission", { localize: true });
      }
    }
  }
};
__name$14(_TwodsixShipActions, "TwodsixShipActions");
_TwodsixShipActions.availableMethods = {
  [TWODSIX$1.SHIP_ACTION_TYPE.chatMessage]: {
    action: _TwodsixShipActions.chatMessage,
    name: "TWODSIX.Ship.Chat",
    placeholder: "TWODSIX.Ship.chatPlaceholder",
    tooltip: "TWODSIX.Ship.chatTooltip"
  },
  [TWODSIX$1.SHIP_ACTION_TYPE.skillRoll]: {
    action: _TwodsixShipActions.skillRoll,
    name: "TWODSIX.Ship.SkillRoll",
    placeholder: "TWODSIX.Ship.skillPlaceholder",
    tooltip: "TWODSIX.Ship.skillTooltip"
  },
  [TWODSIX$1.SHIP_ACTION_TYPE.fireEnergyWeapons]: {
    action: _TwodsixShipActions.fireEnergyWeapons,
    name: "TWODSIX.Ship.UseAComponent",
    placeholder: "TWODSIX.Ship.firePlaceholder",
    tooltip: "TWODSIX.Ship.fireTooltip"
  },
  [TWODSIX$1.SHIP_ACTION_TYPE.executeMacro]: {
    action: _TwodsixShipActions.executeMacro,
    name: "TWODSIX.Ship.ExecuteMacro",
    placeholder: "TWODSIX.Ship.macroPlaceholder",
    tooltip: "TWODSIX.Ship.MacroTooltip"
  }
};
let TwodsixShipActions = _TwodsixShipActions;

var __defProp$13 = Object.defineProperty;
var __name$13 = (target, value) => __defProp$13(target, "name", { value, configurable: true });
function updateFinances(actor, update, financeDiff) {
  if (["traveller"].includes(actor.type)) {
    if (Object.keys(financeDiff.finances).length > 0) {
      updateFinanceValues(actor, update, financeDiff);
    } else if (Object.keys(financeDiff.financeValues).length > 0) {
      updateFinanceText(actor, update, financeDiff);
    }
  }
}
__name$13(updateFinances, "updateFinances");
function updateShipFinances(actor, update, financeDiff) {
  if (["ship"].includes(actor.type)) {
    if (financeDiff.financesCash) {
      foundry.utils.mergeObject(update.system, { commonFunds: financeDiff.financesCash / 1e6 });
    } else if (financeDiff.commonFunds) {
      foundry.utils.mergeObject(update.system, { financeValues: { cash: financeDiff.commonFunds * 1e6 } });
    }
  }
}
__name$13(updateShipFinances, "updateShipFinances");
function updateFinanceValues(actor, update, financeDiff) {
  const updateMods = {};
  for (const financeField in financeDiff.finances) {
    if (financeField !== "financial-notes") {
      const isDelta = ["+", "-"].includes(update.system.finances[financeField][0]);
      if (isDelta) {
        const delta = getParsedFinanceText(update.system.finances[financeField]);
        foundry.utils.mergeObject(updateMods, {
          financeValues: {
            [financeField]: actor.system.financeValues[financeField] + parseFloat(delta.num) * getMultiplier(delta.units)
          }
        });
        const parsedText = getParsedFinanceText(actor.system.finances[financeField]);
        foundry.utils.mergeObject(updateMods, {
          finances: {
            [financeField]: convertNumberToFormatedText(
              updateMods.financeValues[financeField],
              getMultiplier(parsedText.units) > getMultiplier(delta.units) ? parsedText.units : delta.units
            )
          }
        });
      } else {
        const parsedText = getParsedFinanceText(update.system.finances[financeField]);
        if (parsedText) {
          foundry.utils.mergeObject(updateMods, {
            financeValues: {
              [financeField]: parseLocaleNumber(parsedText.num) * getMultiplier(parsedText.units)
            }
          });
        }
      }
    }
  }
  foundry.utils.mergeObject(update.system, updateMods);
}
__name$13(updateFinanceValues, "updateFinanceValues");
function updateFinanceText(actor, update, financeDiff) {
  const financeTextUpdates = {};
  for (const financeField in financeDiff.financeValues) {
    const parsedText = getParsedFinanceText(actor.system.finances[financeField]);
    const newValue = financeDiff.financeValues[financeField];
    foundry.utils.mergeObject(financeTextUpdates, {
      [financeField]: convertNumberToFormatedText(newValue, parsedText.units)
    });
  }
  foundry.utils.mergeObject(update.system, { finances: financeTextUpdates });
}
__name$13(updateFinanceText, "updateFinanceText");
function convertNumberToFormatedText(newValue, units) {
  const numberDigits = newValue === 0 ? 1 : Math.floor(Math.log10(Math.abs(newValue))) + 1;
  if (units) {
    newValue /= getMultiplier(units);
  }
  return "".concat(
    newValue.toLocaleString(game.i18n.lang, { minimumSignificantDigits: numberDigits }),
    units ? " " + units : ""
  );
}
__name$13(convertNumberToFormatedText, "convertNumberToFormatedText");
function parseLocaleNumber(stringNumber) {
  if (stringNumber) {
    const thousandSeparator = Intl.NumberFormat(game.i18n.lang).formatToParts(11111)[1].value;
    const decimalSeparator = Intl.NumberFormat(game.i18n.lang).formatToParts(1.1)[1].value;
    return parseFloat(
      stringNumber.replace(new RegExp("\\" + thousandSeparator, "g"), "").replace(new RegExp("\\" + decimalSeparator), ".")
    );
  } else {
    return NaN;
  }
}
__name$13(parseLocaleNumber, "parseLocaleNumber");
function getParsedFinanceText(financeString) {
  const re = new RegExp(/^(?<pre>\D*?)(?<num>[0-9,.\-+]*)(?<sp>\s*)(?<units>.*?)$/);
  const parsedResult = re.exec(financeString);
  return parsedResult?.groups;
}
__name$13(getParsedFinanceText, "getParsedFinanceText");
function getMultiplier(units) {
  switch (units[0]) {
    case "G":
      return 1e9;
    case "M":
      return 1e6;
    case "k":
    case "K":
      return 1e3;
    default:
      return 1;
  }
}
__name$13(getMultiplier, "getMultiplier");

var updateFinances$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getMultiplier: getMultiplier,
  getParsedFinanceText: getParsedFinanceText,
  parseLocaleNumber: parseLocaleNumber,
  updateFinances: updateFinances,
  updateShipFinances: updateShipFinances
});

var __defProp$12 = Object.defineProperty;
var __name$12 = (target, value) => __defProp$12(target, "name", { value, configurable: true });
function checkForDamageStat(update, actorType) {
  if (update.effects?.length > 0) {
    const damageCharacteristics = getDamageCharacteristics(actorType);
    for (const effect of update.effects) {
      for (const change of effect.changes) {
        for (const char of damageCharacteristics) {
          if (change.key.includes(char)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
__name$12(checkForDamageStat, "checkForDamageStat");
async function applyWoundedEffect(selectedActor) {
  const tintToApply = getIconTint(selectedActor);
  const oldWoundState = selectedActor.effects.find((eff) => eff.statuses.has("wounded"));
  const isCurrentlyDead = selectedActor.effects.find((eff) => eff.statuses.has("dead"));
  if (!tintToApply) {
    if (isCurrentlyDead) {
      await setConditionState("dead", selectedActor, false);
    }
    if (oldWoundState) {
      await setWoundedState(selectedActor, false, tintToApply);
    }
  } else {
    if (tintToApply === TWODSIX$1.DAMAGECOLORS.deadTint) {
      if (!isCurrentlyDead) {
        await setConditionState("dead", selectedActor, true);
      }
      if (oldWoundState) {
        await setWoundedState(selectedActor, false, tintToApply);
      }
      await setConditionState("unconscious", selectedActor, false);
    } else {
      if (isCurrentlyDead) {
        await setConditionState("dead", selectedActor, false);
      }
      if (selectedActor.type !== "animal" && selectedActor.type !== "robot" && !isCurrentlyDead) {
        await checkUnconsciousness(selectedActor, oldWoundState, tintToApply);
      }
      if (tintToApply !== oldWoundState?.tint.css) {
        await setWoundedState(selectedActor, true, tintToApply);
      }
    }
  }
}
__name$12(applyWoundedEffect, "applyWoundedEffect");
async function applyEncumberedEffect(selectedActor) {
  const isCurrentlyEncumbered = selectedActor.effects.filter((eff) => eff.statuses.has("encumbered"));
  let state = false;
  let ratio = 0;
  let aeToKeep = void 0;
  const maxEncumbrance = selectedActor.system.encumbrance.max;
  if (selectedActor.system.hits.value > 0) {
    if (maxEncumbrance === 0 && selectedActor.system.encumbrance.value > 0) {
      state = true;
      ratio = 1;
    } else if (maxEncumbrance > 0) {
      ratio = /*selectedActor.getActorEncumbrance()*/
      selectedActor.system.encumbrance.value / maxEncumbrance;
      state = ratio > parseFloat(game.settings.get("twodsix", "encumbranceFraction"));
    }
  }
  if (isCurrentlyEncumbered.length > 0) {
    if (state === true) {
      aeToKeep = isCurrentlyEncumbered.pop();
    }
    if (isCurrentlyEncumbered.length > 0) {
      const idList = isCurrentlyEncumbered.map((i) => i.id);
      await selectedActor.deleteEmbeddedDocuments("ActiveEffect", idList);
    }
  }
  if (state === true) {
    const modifier = getEncumbranceModifier(ratio).toString();
    let changeData;
    if (game.settings.get("twodsix", "ruleset") === "CT") {
      changeData = [
        {
          key: "system.characteristics.strength.value",
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: modifier
        },
        {
          key: "system.characteristics.dexterity.value",
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: modifier
        },
        {
          key: "system.characteristics.endurance.value",
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: modifier
        }
      ];
    } else {
      changeData = [{
        key: "system.conditions.encumberedEffect",
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: modifier
      }];
    }
    if (game.settings.get("twodsix", "ruleset") === "CU") {
      changeData.push({
        key: "system.movement.walk",
        mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
        value: 0.75
      });
    }
    if (!aeToKeep) {
      await selectedActor.createEmbeddedDocuments("ActiveEffect", [{
        name: game.i18n.localize(TWODSIX$1.effectType.encumbered),
        img: "systems/twodsix/assets/icons/weight.svg",
        changes: changeData,
        statuses: ["encumbered"]
      }], { dontSync: true, noHook: true });
    } else {
      if (changeData[0].value !== aeToKeep.changes[0].value) {
        await aeToKeep.update({ changes: changeData });
      }
    }
  }
}
__name$12(applyEncumberedEffect, "applyEncumberedEffect");
async function checkUnconsciousness(selectedActor, oldWoundState, tintToApply) {
  const isAlreadyUnconscious = selectedActor.effects.some((eff) => eff.statuses.has("unconscious"));
  const isAlreadyDead = selectedActor.effects.some((eff) => eff.statuses.has("dead"));
  const rulesSet = game.settings.get("twodsix", "ruleset");
  if (!isAlreadyUnconscious && !isAlreadyDead) {
    if (["CE", "AC", "CU", "OTHER"].includes(rulesSet)) {
      if (isUnconsciousCE(selectedActor.system)) {
        await setConditionState("unconscious", selectedActor, true);
      }
    } else if (["CT"].includes(rulesSet)) {
      if (oldWoundState === void 0 && [TWODSIX$1.DAMAGECOLORS.minorWoundTint, TWODSIX$1.DAMAGECOLORS.seriousWoundTint].includes(tintToApply)) {
        await setConditionState("unconscious", selectedActor, true);
      }
    } else if (oldWoundState?.tint.css !== TWODSIX$1.DAMAGECOLORS.seriousWoundTint && tintToApply === TWODSIX$1.DAMAGECOLORS.seriousWoundTint) {
      if (["CEQ", "CEATOM", "BARBARIC"].includes(rulesSet)) {
        await setConditionState("unconscious", selectedActor, true);
      } else {
        const setDifficulty = Object.values(TWODSIX$1.DIFFICULTIES[game.settings.get("twodsix", "difficultyListUsed")]).find((e) => e.target === 8);
        const returnRoll = await selectedActor.characteristicRoll({
          rollModifiers: { characteristic: "END" },
          difficulty: setDifficulty,
          extraFlavor: game.i18n.localize("TWODSIX.Rolls.MakesUncRoll")
        }, false);
        if (returnRoll && returnRoll.effect < 0) {
          await setConditionState("unconscious", selectedActor, true);
        }
      }
    }
  }
}
__name$12(checkUnconsciousness, "checkUnconsciousness");
async function setConditionState(effectStatus, targetActor, state) {
  const isAlreadySet = targetActor.effects.filter((eff) => eff.statuses.has(effectStatus));
  const targetEffect = CONFIG.statusEffects.find((statusEffect) => statusEffect.id === effectStatus);
  if (isAlreadySet.length > 1) {
    for (let i = 1; i < isAlreadySet.length; i++) {
      await targetActor.toggleStatusEffect(targetEffect.id, { active: false });
    }
  }
  if (isAlreadySet.length > 0 !== state) {
    if (targetEffect) {
      if (effectStatus === "dead") {
        await targetActor.toggleStatusEffect(targetEffect.id, { active: state, overlay: false });
      } else {
        await targetActor.toggleStatusEffect(targetEffect.id, { active: state });
      }
    }
  }
}
__name$12(setConditionState, "setConditionState");
async function setWoundedState(targetActor, state, tint) {
  const isAlreadySet = targetActor?.effects.filter((eff) => eff.statuses.has("wounded"));
  let currentEffectId = "";
  if (isAlreadySet?.length > 0) {
    const idList = isAlreadySet.map((i) => i.id);
    if (state) {
      currentEffectId = idList.pop();
    }
    if (idList.length > 0) {
      await targetActor.deleteEmbeddedDocuments("ActiveEffect", idList);
    }
  }
  if (state) {
    let woundModifier = 0;
    switch (tint) {
      case TWODSIX$1.DAMAGECOLORS.minorWoundTint:
        woundModifier = game.settings.get("twodsix", "minorWoundsRollModifier");
        break;
      case TWODSIX$1.DAMAGECOLORS.seriousWoundTint:
        woundModifier = game.settings.get("twodsix", "seriousWoundsRollModifier");
        break;
    }
    let changeData = {};
    if (game.settings.get("twodsix", "ruleset") === "AC" && tint === TWODSIX$1.DAMAGECOLORS.seriousWoundTint) {
      changeData = { key: "system.movement.walk", mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE, value: 1.5 };
    } else {
      changeData = { key: "system.conditions.woundedEffect", mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: woundModifier.toString() };
    }
    if (!currentEffectId) {
      await targetActor.createEmbeddedDocuments("ActiveEffect", [{
        name: game.i18n.localize(TWODSIX$1.effectType.wounded),
        img: "icons/svg/blood.svg",
        tint,
        changes: [changeData],
        statuses: ["wounded"]
      }]);
    } else {
      const currentEfffect = targetActor.effects.get(currentEffectId);
      if (currentEfffect.tint !== tint) {
        await targetActor.updateEmbeddedDocuments("ActiveEffect", [{ _id: currentEffectId, tint, changes: [changeData] }]);
      }
    }
  }
}
__name$12(setWoundedState, "setWoundedState");
function getIconTint(selectedActor) {
  const selectedTraveller = selectedActor.system;
  if (selectedActor.type === "animal" && game.settings.get("twodsix", "animalsUseHits") || selectedActor.type === "robot" && game.settings.get("twodsix", "robotsUseHits")) {
    return getHitsTint(selectedTraveller);
  } else {
    switch (game.settings.get("twodsix", "ruleset")) {
      case "CD":
      case "CLU":
      case "CDEE":
        return getCDWoundTint(selectedTraveller);
      case "CEL":
      case "CEFTL":
      case "SOC":
      case "CT":
        return getCELWoundTint(selectedTraveller);
      case "CE":
      case "AC":
      case "OTHER":
        return getCEWoundTint(selectedTraveller);
      case "CEQ":
      case "CEATOM":
      case "BARBARIC":
        return getCEAWoundTint(selectedTraveller);
      case "CU":
        return getCUWoundTint(selectedTraveller);
      default:
        return "";
    }
  }
}
__name$12(getIconTint, "getIconTint");
function getHitsTint(selectedTraveller) {
  let returnVal = "";
  if (selectedTraveller.characteristics.lifeblood.current <= 0) {
    returnVal = TWODSIX$1.DAMAGECOLORS.deadTint;
  } else if (selectedTraveller.characteristics.lifeblood.current < selectedTraveller.characteristics.lifeblood.value / 3) {
    returnVal = TWODSIX$1.DAMAGECOLORS.seriousWoundTint;
  } else if (selectedTraveller.characteristics.lifeblood.current < 2 * selectedTraveller.characteristics.lifeblood.value / 3) {
    returnVal = TWODSIX$1.DAMAGECOLORS.minorWoundTint;
  }
  return returnVal;
}
__name$12(getHitsTint, "getHitsTint");
function getCDWoundTint(selectedTraveller) {
  let returnVal = "";
  if (selectedTraveller.characteristics.lifeblood.current <= 0 && selectedTraveller.characteristics.stamina.current <= 0) {
    returnVal = TWODSIX$1.DAMAGECOLORS.deadTint;
  } else if (selectedTraveller.characteristics.lifeblood.current < selectedTraveller.characteristics.lifeblood.value / 2) {
    returnVal = TWODSIX$1.DAMAGECOLORS.seriousWoundTint;
  } else if (selectedTraveller.characteristics.lifeblood.damage > 0) {
    returnVal = TWODSIX$1.DAMAGECOLORS.minorWoundTint;
  }
  return returnVal;
}
__name$12(getCDWoundTint, "getCDWoundTint");
function getCELWoundTint(selectedTraveller) {
  let returnVal = "";
  const testArray = [selectedTraveller.characteristics.strength, selectedTraveller.characteristics.dexterity, selectedTraveller.characteristics.endurance];
  const maxNonZero = testArray.filter((chr) => chr.value !== 0).length;
  const currentZero = testArray.filter((chr) => chr.current <= 0 && chr.value !== 0).length;
  if (currentZero === maxNonZero) {
    returnVal = TWODSIX$1.DAMAGECOLORS.deadTint;
  } else if (currentZero > 0) {
    if (currentZero > 1) {
      returnVal = TWODSIX$1.DAMAGECOLORS.seriousWoundTint;
    } else {
      returnVal = TWODSIX$1.DAMAGECOLORS.minorWoundTint;
    }
  }
  return returnVal;
}
__name$12(getCELWoundTint, "getCELWoundTint");
function getCEWoundTint(selectedTraveller) {
  let returnVal = "";
  const testArray = [selectedTraveller.characteristics.strength, selectedTraveller.characteristics.dexterity, selectedTraveller.characteristics.endurance];
  const maxNonZero = testArray.filter((chr) => chr.value !== 0).length;
  const currentZero = testArray.filter((chr) => chr.current <= 0 && chr.value !== 0).length;
  const numDamaged = testArray.filter((chr) => chr.damage > 0 && chr.value !== 0).length;
  if (currentZero === maxNonZero) {
    returnVal = TWODSIX$1.DAMAGECOLORS.deadTint;
  } else if (numDamaged > 0) {
    if (maxNonZero > 1) {
      if (numDamaged === maxNonZero) {
        returnVal = TWODSIX$1.DAMAGECOLORS.seriousWoundTint;
      } else {
        returnVal = TWODSIX$1.DAMAGECOLORS.minorWoundTint;
      }
    } else {
      if (testArray.filter((chr) => chr.damage >= chr.value / 2 && chr.value !== 0).length) {
        returnVal = TWODSIX$1.DAMAGECOLORS.seriousWoundTint;
      } else {
        returnVal = TWODSIX$1.DAMAGECOLORS.minorWoundTint;
      }
    }
  }
  return returnVal;
}
__name$12(getCEWoundTint, "getCEWoundTint");
function getCUWoundTint(selectedTraveller) {
  let returnVal = "";
  const testArray = [selectedTraveller.characteristics.strength, selectedTraveller.characteristics.dexterity, selectedTraveller.characteristics.endurance];
  const currentZero = testArray.filter((chr) => chr.current <= 0 && chr.value !== 0).length;
  if (currentZero === 3) {
    returnVal = TWODSIX$1.DAMAGECOLORS.deadTint;
  } else if (currentZero === 2) {
    returnVal = TWODSIX$1.DAMAGECOLORS.seriousWoundTint;
  } else if (currentZero === 1) {
    returnVal = TWODSIX$1.DAMAGECOLORS.minorWoundTint;
  }
  return returnVal;
}
__name$12(getCUWoundTint, "getCUWoundTint");
function isUnconsciousCE(selectedTraveller) {
  const testArray = [selectedTraveller.characteristics.strength, selectedTraveller.characteristics.dexterity, selectedTraveller.characteristics.endurance];
  return testArray.filter((chr) => chr.current <= 0 && chr.value !== 0).length === 2;
}
__name$12(isUnconsciousCE, "isUnconsciousCE");
function getCEAWoundTint(selectedTraveller) {
  let returnVal = "";
  const lfbCharacteristic = game.settings.get("twodsix", "lifebloodInsteadOfCharacteristics") ? "strength" : "lifeblood";
  const endCharacteristic = game.settings.get("twodsix", "lifebloodInsteadOfCharacteristics") ? "endurance" : "stamina";
  const currentHits = selectedTraveller.characteristics[lfbCharacteristic].current + selectedTraveller.characteristics[endCharacteristic].current;
  if (currentHits <= 0) {
    returnVal = TWODSIX$1.DAMAGECOLORS.deadTint;
  } else if (selectedTraveller.characteristics[lfbCharacteristic].current < selectedTraveller.characteristics[lfbCharacteristic].value / 2) {
    returnVal = TWODSIX$1.DAMAGECOLORS.seriousWoundTint;
  } else if (selectedTraveller.characteristics[endCharacteristic].current <= 0) {
    returnVal = TWODSIX$1.DAMAGECOLORS.minorWoundTint;
  }
  return returnVal;
}
__name$12(getCEAWoundTint, "getCEAWoundTint");
function getEncumbranceModifier(ratio) {
  const ruleset = game.settings.get("twodsix", "ruleset");
  if (ratio === 0) {
    return 0;
  } else if (["CE"].includes(ruleset)) {
    if (ratio <= game.settings.get("twodsix", "encumbranceFraction")) {
      return 0;
    } else if (ratio <= game.settings.get("twodsix", "encumbranceFraction") * 2) {
      return game.settings.get("twodsix", "encumbranceModifier");
    } else {
      if (ratio <= game.settings.get("twodsix", "encumbranceFraction") * 3) {
        return game.settings.get("twodsix", "encumbranceModifier") * 2;
      } else {
        return game.settings.get("twodsix", "encumbranceModifier") * 20;
      }
    }
  } else if (["CU", "CT"].includes(ruleset)) {
    if (ratio <= 1 / 3) {
      return 0;
    } else if (ratio <= 2 / 3) {
      return game.settings.get("twodsix", "encumbranceModifier");
    } else {
      return game.settings.get("twodsix", "encumbranceModifier") * 2;
    }
  } else {
    return game.settings.get("twodsix", "encumbranceModifier");
  }
}
__name$12(getEncumbranceModifier, "getEncumbranceModifier");

var __defProp$11 = Object.defineProperty;
var __name$11 = (target, value) => __defProp$11(target, "name", { value, configurable: true });
const _TwodsixActiveEffect = class _TwodsixActiveEffect extends ActiveEffect {
  /**
   * Is there some system logic that makes this active effect ineligible for application?  Accounts for equipped status
   * @type {boolean}
   * @override
   */
  get isSuppressed() {
    if (this.parent instanceof Item) {
      if (["trait"].includes(this.parent.type)) {
        return false;
      } else if (["storage", "junk"].includes(this.parent.type) || this.parent.system.equipped !== "equipped") {
        return true;
      }
    }
    return false;
  }
  /**
   * Perform follow-up operations after a Document of this type is created.
   * Post-creation operations occur for all clients after the creation is broadcast.
   * @param {object} data               The initial data object provided to the document creation request
   * @param {object} options            Additional options which modify the creation request
   * @param {string} userId             The id of the User requesting the document update
   * @see {Document#_onCreate}
   * @override
   */
  async _onCreate(data, options, userId) {
    await super._onCreate(data, options, userId);
    if (game.userId === userId && this.parent?.type === "traveller") {
      await checkEncumbranceStatus(this);
    }
    if (data.changes?.length === 0) {
      data.changes.push({});
    }
  }
  /**
   * Perform follow-up operations after a Document of this type is updated.
   * Post-update operations occur for all clients after the update is broadcast.
   * @param {object} changed            The differential data that was changed relative to the documents prior values
   * @param {object} options            Additional options which modify the update request
   * @param {string} userId             The id of the User requesting the document update
   * @see {Document#_onUpdate}
   * @override
   */
  async _onUpdate(changed, options, userId) {
    await super._onUpdate(changed, options, userId);
    if (game.userId === userId && this.parent?.type === "traveller") {
      await checkEncumbranceStatus(this);
    }
  }
  /**
   * Perform follow-up operations after a Document of this type is deleted.
   * Post-deletion operations occur for all clients after the deletion is broadcast.
   * @param {object} options            Additional options which modify the deletion request
   * @param {string} userId             The id of the User requesting the document update
   * @see {Document#_onDelete}
   * @override
   */
  async _onDelete(options, userId) {
    await super._onDelete(options, userId);
    if (game.userId === userId && this.parent?.type === "traveller") {
      await checkEncumbranceStatus(this);
    }
  }
};
__name$11(_TwodsixActiveEffect, "TwodsixActiveEffect");
let TwodsixActiveEffect = _TwodsixActiveEffect;
async function checkEncumbranceStatus(activeEffect) {
  if (game.settings.get("twodsix", "useEncumbranceStatusIndicators") && (changesEncumbranceStat(activeEffect) || activeEffect.statuses.has("dead"))) {
    if (activeEffect.statuses.size === 0) {
      await applyEncumberedEffect(activeEffect.parent);
    } else {
      const notEncumbered = !activeEffect.statuses.has("encumbered");
      const notUnc = !activeEffect.statuses.has("unconscious");
      if (notEncumbered && notUnc) {
        await applyEncumberedEffect(activeEffect.parent);
      }
    }
  }
}
__name$11(checkEncumbranceStatus, "checkEncumbranceStatus");
function changesEncumbranceStat(activeEffect) {
  if (activeEffect.changes.length > 0) {
    for (const change of activeEffect.changes) {
      if (change.key) {
        if (change.key.includes("system.characteristics.strength.value") || change.key.includes("system.characteristics.strength.current") || change.key.includes("system.characteristics.strength.mod") || change.key.includes("system.characteristics.endurance.value") && ["CEATOM", "BARBARIC"].includes(game.settings.get("twodsix", "ruleset")) || change.key.includes("system.encumbrance.max") || change.key.includes("system.encumbrance.value")) {
          return true;
        }
      }
    }
  }
  return false;
}
__name$11(changesEncumbranceStat, "changesEncumbranceStat");

var __defProp$10 = Object.defineProperty;
var __name$10 = (target, value) => __defProp$10(target, "name", { value, configurable: true });
function generateShipDamageReport(ship, damagePayload) {
  if (!ship || !damagePayload) {
    console.log("No ship and/or damage payload");
    return;
  }
  if (!damagePayload.isArmament) {
    ui.notifications.warn("TWODSIX.Ship.NotShipWeapon", { localize: true });
    return;
  }
  const damageList = [];
  let radReport = game.i18n.localize("TWODSIX.Ship.None");
  const damage = damagePayload.damageValue ?? 0;
  const radDamage = damagePayload.radDamage ?? 0;
  const currentArmor = ship.system.shipStats.armor.value ?? 0;
  const currentHull = ship.system.shipStats.hull.value ?? 0;
  const weaponType = damagePayload.shipWeaponType;
  const effect = damagePayload.effect;
  const damageRules = game.settings.get("twodsix", "shipDamageType");
  const netDamage = damage - (weaponType === "mesonGun" || damageRules === "CT" ? 0 : currentArmor);
  if (netDamage <= 0 && radDamage <= 0) {
    ui.notifications.warn("TWODSIX.Ship.NoDamage", { localize: true });
    return;
  }
  if (netDamage > 0) {
    switch (damageRules) {
      case "component": {
        const hitArray = getCEDamageEffects(netDamage);
        damageList.push(...getCEDamageLocationObject(hitArray, currentHull, currentArmor, weaponType));
        break;
      }
      case "hullOnly": {
        damageList.push({ location: "hull", hits: Math.clamp(netDamage, 0, currentHull) });
        break;
      }
      case "hullWCrit": {
        const maxHull = ship.system.shipStats.hull.max ?? 0;
        const appliedHits = Math.clamp(netDamage, 0, currentHull);
        damageList.push({ location: "hull", hits: appliedHits });
        damageList.push(...get10PctCriticals(currentHull, currentHull - appliedHits, maxHull, effect));
        break;
      }
      case "surfaceInternal": {
        damageList.push(...getCDDamageList(damage, weaponType, ship, effect));
        break;
      }
      case "CT": {
        damageList.push(...getCTDamageList(damage));
        break;
      }
      case "AC": {
        damageList.push(...getACDamageList(damage, weaponType, ship));
        break;
      }
      case "CU": {
        const { hull, component } = getCUDamageEffects(netDamage);
        damageList.push({ location: "hull", hits: hull });
        damageList.push(...getCUDamageList(component));
        break;
      }
    }
  }
  if (radDamage > 0) {
    switch (damageRules) {
      case "component": {
        radReport = getCERadDamage(weaponType, currentArmor);
        break;
      }
      case "hullOnly":
      case "hullWCrit": {
        radReport = game.i18n.format("TWODSIX.Ship.DamageMessages.AllCrew", { dose: "[[/r 2D6*20]]" });
        break;
      }
      case "surfaceInternal": {
        radReport = getCDRadDamage(radDamage, ship);
        break;
      }
      case "AC": {
        radReport = getACRadDamage(radDamage);
        break;
      }
    }
  }
  sendReportToMessage(damageList, radReport, ship);
}
__name$10(generateShipDamageReport, "generateShipDamageReport");
async function sendReportToMessage(damageList, radReport, ship) {
  const systemDamageHtml = generateDamageTable(damageList);
  let enrichedRadReport = "";
  if (Array.isArray(radReport)) {
    enrichedRadReport = generateDamageTable(radReport);
  } else {
    enrichedRadReport = await foundry.applications.ux.TextEditor.implementation.enrichHTML(radReport, { secrets: ship.isOwner });
  }
  const flavorText = `
    <section class="flavor-message">
      <section class="flavor-line">${game.i18n.localize("TWODSIX.Chat.DamageReport")}</section>
      <section>
        <fieldset>
          <legend>${game.i18n.localize("TWODSIX.Chat.Roll.ComponentDamage")}</legend>
          ${systemDamageHtml}
        </fieldset>
      </section>
      <section>
        <fieldset>
          <legend>${game.i18n.localize("TWODSIX.Actor.RadiationExposure")}</legend>
          ${enrichedRadReport}
        </fieldset>
      </section>
    </section>
  `;
  await ChatMessage.create({
    flavor: flavorText,
    speaker: ChatMessage.getSpeaker({ actor: ship })
  });
}
__name$10(sendReportToMessage, "sendReportToMessage");
function generateDamageTable(damageList) {
  if (damageList.length === 0) {
    return `<span>${game.i18n.localize("TWODSIX.Ship.None")}</span>`;
  }
  let systemDamageHtml = `<table class="flavor-table"><tr><th>${game.i18n.localize("TWODSIX.Ship.Systems")}</th><th class="centre">${game.i18n.localize("TWODSIX.Items.Component.hits")}</th></tr>`;
  for (const row of damageList) {
    if (row.location === "destroyed") {
      return `<span>${game.i18n.localize("TWODSIX.Ship.DamageMessages.ShipDestroyed")}</span>`;
    }
    let componentName = game.i18n.localize(row.location === "j-drive" ? game.settings.get("twodsix", "jDriveLabel") : `TWODSIX.Items.Component.${row.location}`);
    if (componentName.includes("TWODSIX")) {
      componentName = row.location;
    }
    let numberOfHits = row.hits.toString();
    if (["CT", "surfaceInternal", "AC"].includes(game.settings.get("twodsix", "shipDamageType"))) {
      if (row.hits >= game.settings.get("twodsix", "maxComponentHits") && !["hull", "armor"].includes(row.location)) {
        numberOfHits = game.i18n.localize("TWODSIX.Items.Component.destroyed");
      }
    }
    systemDamageHtml += `<tr><td>${componentName}</td><td class="centre">${numberOfHits}</td></tr>`;
  }
  systemDamageHtml += `</table>`;
  return systemDamageHtml;
}
__name$10(generateDamageTable, "generateDamageTable");
function getCEDamageEffects(damage) {
  const effects = [];
  const baseTable = [
    { min: -Infinity, max: 0, hits: [] },
    { min: 1, max: 4, hits: [1] },
    { min: 5, max: 8, hits: [1, 1] },
    { min: 9, max: 12, hits: [2] },
    { min: 13, max: 16, hits: [1, 1, 1] },
    { min: 17, max: 20, hits: [1, 1, 2] },
    { min: 21, max: 24, hits: [2, 2] },
    { min: 25, max: 28, hits: [3] },
    { min: 29, max: 32, hits: [3, 1] },
    { min: 33, max: 36, hits: [3, 2] },
    { min: 37, max: 40, hits: [3, 2, 1] },
    { min: 41, max: 44, hits: [3, 3] }
  ];
  if (damage <= 44) {
    for (const row of baseTable) {
      if (damage >= row.min && damage <= row.max) {
        effects.push(...row.hits);
        break;
      }
    }
  } else if (damage > 44) {
    effects.push(3, 3);
    const extra = damage - 44;
    if (extra > 0) {
      const singleHits = Math.floor(extra / 3);
      for (let i = 0; i < singleHits; i++) {
        effects.push(1);
      }
      const doubleHits = Math.floor(extra / 6);
      for (let i = 0; i < doubleHits; i++) {
        effects.push(2);
      }
    }
  }
  return effects.length > 0 ? effects : [];
}
__name$10(getCEDamageEffects, "getCEDamageEffects");
function getCEDamageLocationObject(hitArray, currentHull, currentArmor, weaponType) {
  const returnValue = [];
  const externalHitCE = ["hull", "sensor", "m-drive", "turret", "hull", "armor", "hull", "fuel", "m-drive", "sensor", "hull"];
  const internalHitCE = ["structure", "power", "j-drive", "bay", "structure", "crew", "structure", "hold", "j-drive", "power", "structure"];
  for (const value of hitArray) {
    const internalHit = currentHull <= 0 || weaponType === "mesonGun";
    const newLocation = rollHitTable(internalHit ? internalHitCE : externalHitCE, value);
    if (newLocation.location === "armor" && currentArmor <= 0) {
      newLocation.location = "hull";
    }
    returnValue.push({ location: newLocation.location, hits: newLocation.hits });
  }
  return returnValue;
}
__name$10(getCEDamageLocationObject, "getCEDamageLocationObject");
const crewDamageTableCE = [
  {
    min: -Infinity,
    max: 4,
    radiation: "TWODSIX.Ship.DamageMessages.NoRad",
    dose: "0"
  },
  {
    min: 5,
    max: 8,
    radiation: "TWODSIX.Ship.DamageMessages.SingleCrew",
    dose: "[[/r 2D6*10]]"
  },
  {
    min: 9,
    max: 10,
    radiation: "TWODSIX.Ship.DamageMessages.SingleCrew",
    dose: "[[/r 4D6*10]]"
  },
  {
    min: 11,
    max: 11,
    radiation: "TWODSIX.Ship.DamageMessages.AllCrew",
    dose: "[[/r 2D6*10]]"
  },
  {
    min: 12,
    max: Infinity,
    radiation: "TWODSIX.Ship.DamageMessages.AllCrew",
    dose: "[[/r 4D6*10]]"
  }
];
function getCERadDamage(weaponType, currentArmor) {
  const rollDM = weaponType === "mesonGun" || currentArmor < 0 ? 0 : -currentArmor;
  const damageRoll = getMultipleRolls(1, 6, 2) + rollDM;
  for (const row of crewDamageTableCE) {
    if (damageRoll >= row.min && damageRoll <= row.max) {
      return game.i18n.format(row.radiation, { dose: row.dose });
    }
  }
  return "Unknown";
}
__name$10(getCERadDamage, "getCERadDamage");
function getCDDamageList(damage, weaponType, ship, effect) {
  const returnValue = [];
  if (["sandcaster", "special", "other"].includes(weaponType)) {
    console.log("Calculation of damage not possible for this weapon");
    return returnValue;
  }
  let adjWeaponType = weaponType;
  let armorType = getCDArmorType(ship.system.shipStats.armor.name);
  const criticalArmorList = { unarmored: "unarmored", light: "unarmored", heavy: "light", massive: "heavy" };
  if (effect >= 6 && Object.hasOwn(criticalArmorList, armorType)) {
    armorType = criticalArmorList[armorType];
  }
  const penetrationMatrix = {
    light: { unarmored: "internal", light: "surface", heavy: "none", massive: "none" },
    intermediate: { unarmored: "critical", light: "internal", heavy: "surface", massive: "none" },
    heavy: { unarmored: "destroyed", light: "critical", heavy: "internal", massive: "surface" },
    main: { unarmored: "destroyed", light: "destroyed", heavy: "critical", massive: "internal" }
  };
  switch (weaponType) {
    case "missile":
      adjWeaponType = "light";
      break;
    case "torpedoes":
    case "nuclearMissile":
      adjWeaponType = "intermediate";
      break;
  }
  if (!penetrationMatrix[adjWeaponType] || !penetrationMatrix[adjWeaponType][armorType]) {
    console.warn(`Unknown weaponType (${weaponType}) or armorType (${armorType || ship.system.shipStats.armor.name}) in getCDDamageList`);
    return [{ location: "Unknown Armor or Weapon Type", hits: 0 }];
  }
  const hitType = penetrationMatrix[adjWeaponType][armorType];
  if (hitType === "destroyed") {
    return [{ location: "destroyed", hits: Infinity }];
  } else if (hitType === "none") {
    return [];
  }
  const hitTypeMap = {
    internal: getInternalHitCD,
    surface: getSurfaceHitCD,
    critical: getCriticalHitCD
  };
  if (hitTypeMap[hitType]) {
    return generateDamageList(damage, hitTypeMap[hitType]);
  }
  return [];
}
__name$10(getCDDamageList, "getCDDamageList");
function getInternalHitCD() {
  const hitTable = ["breach", "power", "j-drive", "armament", "m-drive", "breach", "cargo", "crew", "sensor", "bridge", "special"];
  return rollHitTable(hitTable, 1, getCriticalHitCD);
}
__name$10(getInternalHitCD, "getInternalHitCD");
function getSurfaceHitCD() {
  const hitTable = ["none", "none", "none", "none", "none", "breach", "breach", "armament", "armament", "electronics", "special"];
  return rollHitTable(hitTable, 1, getInternalHitCD);
}
__name$10(getSurfaceHitCD, "getSurfaceHitCD");
function getCriticalHitCD() {
  const hitTable = ["power", "m-drive", "j-drive", "crew", "electronics", "destroyed"];
  return rollHitTable(hitTable, game.settings.get("twodsix", "maxComponentHits"));
}
__name$10(getCriticalHitCD, "getCriticalHitCD");
function getCDRadDamage(rads, ship) {
  const returnValue = [];
  const radsCD = ["none", "none", "none", "none", "sensor", "sensor", "electronics", "electronics", "crew", "crew", "critical"];
  const armorType = getCDArmorType(ship.system.shipStats.armor.name);
  const currentArmor = ship.system.shipStats.armor.value ?? 0;
  const armorDM = getCDArmorDM(armorType);
  const radDM = Math.max(rads - 1, 0) + armorDM;
  for (let i = 0; i < rads; i++) {
    const locationRoll = Math.clamp(getMultipleRolls(1, 6, 2) + radDM - 2, 0, 10);
    let newLocation = radsCD[locationRoll];
    if (newLocation === "critical") {
      returnValue.push(getCriticalHitCD());
    } else if (newLocation !== "none") {
      if (newLocation === "armor" && currentArmor <= 0) {
        newLocation = "hull";
      }
      returnValue.push({ location: newLocation, hits: 1 });
    }
  }
  return returnValue;
}
__name$10(getCDRadDamage, "getCDRadDamage");
function getCDArmorDM(armorKey) {
  if (!armorKey) {
    return 0;
  }
  const armorTypesDM = { unarmored: 0, light: -1, heavy: -2, massive: -4 };
  return Object.hasOwn(armorTypesDM, armorKey) ? armorTypesDM[armorKey] : 0;
}
__name$10(getCDArmorDM, "getCDArmorDM");
function getCDArmorType(armorDescription) {
  const armorLower = armorDescription.toLowerCase();
  for (const key of Object.keys(TWODSIX$1.ShipArmorTypesCD)) {
    const localized = game.i18n.localize(TWODSIX$1.ShipArmorTypesCD[key]).toLowerCase();
    if (armorLower.includes(localized)) {
      return key;
    }
  }
  return "";
}
__name$10(getCDArmorType, "getCDArmorType");
function get10PctCriticals(currentHull, futureHull, maxHull, effect) {
  const results = [];
  const critTable = [
    "sensor",
    "power",
    "fuel",
    "armament",
    "armor",
    "hull",
    "m-drive",
    "cargo",
    "j-drive",
    "crew",
    "bridge"
  ];
  if (effect >= 6) {
    results.push(rollHitTable(critTable, effect));
  }
  const pctCurrent = Math.clamp(Math.floor(currentHull / maxHull * 10), 0, 9);
  const pctFuture = Math.clamp(Math.floor(futureHull / maxHull * 10), 0, 9);
  const numCrits = Math.max(0, pctCurrent - pctFuture);
  for (let i = 0; i < numCrits; i++) {
    results.push(rollHitTable(critTable, 1));
  }
  return results;
}
__name$10(get10PctCriticals, "get10PctCriticals");
function getCTDamageList(damage) {
  return generateDamageList(damage, getHitCT);
}
__name$10(getCTDamageList, "getCTDamageList");
function getHitCT() {
  const hitTable = ["power", "m-drive", "j-drive", "fuel", "hull", "hull", "cargo", "computer", "armament", "armament", "special"];
  return rollHitTable(hitTable, 1, getCriticalHitCT);
}
__name$10(getHitCT, "getHitCT");
function getCriticalHitCT() {
  const hitTable = ["power", "m-drive", "j-drive", "crew", "computer", "destroyed"];
  return rollHitTable(hitTable, game.settings.get("twodsix", "maxComponentHits"));
}
__name$10(getCriticalHitCT, "getCriticalHitCT");
function getACDamageList(damage, weaponType, ship) {
  if (damage > (ship.system.shipStats.armor.value ?? 0) || weaponType === "mesonGun") {
    return generateDamageList(damage, getHitAC);
  } else {
    return [];
  }
}
__name$10(getACDamageList, "getACDamageList");
function getHitAC() {
  const hitTable = ["breach", "power", "j-drive", "armament", "m-drive", "armor", "cargo", "crew", "computer", "bridge", "special"];
  const result = rollHitTable(hitTable, 1, getCriticalHitAC);
  if (result.location === "crew") {
    result.hits = getMultipleRolls(1, 6, 2);
  }
  return result;
}
__name$10(getHitAC, "getHitAC");
function getCriticalHitAC() {
  const hitTable = ["power", "m-drive", "j-drive", "crew", "computer", "destroyed"];
  let result = rollHitTable(hitTable, game.settings.get("twodsix", "maxComponentHits"));
  if (result.location === "crew") {
    result = { location: "crew - critical", hits: getMultipleRolls(1, 6, 4) };
  }
  return result;
}
__name$10(getCriticalHitAC, "getCriticalHitAC");
function getRadHitAC() {
  const hitTable = ["none", "crew", "crew", "computer", "computer", "critical"];
  let result = rollHitTable(hitTable, 1);
  if (result.location === "critical") {
    result = { location: "crew - critical", hits: getMultipleRolls(1, 6, 4) };
  } else if (result.location === "crew") {
    result.hits = getMultipleRolls(1, 6, 2);
  }
  return result;
}
__name$10(getRadHitAC, "getRadHitAC");
function getACRadDamage(radDamage) {
  return generateDamageList(radDamage, getRadHitAC);
}
__name$10(getACRadDamage, "getACRadDamage");
function getCUDamageEffects(damage) {
  const baseTable = [
    { min: -Infinity, max: 0, hull: 0, component: 0 },
    { min: 1, max: 4, hull: 1, component: 0 },
    { min: 5, max: 6, hull: 2, component: 1 },
    { min: 7, max: 8, hull: 3, component: 2 },
    { min: 9, max: 16, hull: 6, component: 2 },
    { min: 17, max: 24, hull: 16, component: 3 },
    { min: 25, max: 32, hull: 18, component: 3 },
    { min: 33, max: 40, hull: 30, component: 4 },
    { min: 41, max: 60, hull: 42, component: 4 },
    { min: 61, max: 80, hull: 80, component: 5 },
    { min: 81, max: 100, hull: 160, component: 5 },
    { min: 101, max: Infinity, hull: 360, component: 6 }
  ];
  for (const row of baseTable) {
    if (damage >= row.min && damage <= row.max) {
      return { hull: row.hull, component: row.component };
    }
  }
  console.log("Unknown lookup for CU damage table.");
  return { hull: 0, component: 0 };
}
__name$10(getCUDamageEffects, "getCUDamageEffects");
function getCUDamageList(hits) {
  return generateDamageList(hits, getHitCU);
}
__name$10(getCUDamageList, "getCUDamageList");
function getHitCU() {
  const hitTable = ["sensor", "sensor", "power", "ftl-drive", "armor", "armament", "screen", "m-drive", "crew", "special", "special"];
  return rollHitTable(hitTable, 1, getIncidentalHitCU);
}
__name$10(getHitCU, "getHitCU");
function getIncidentalHitCU() {
  const hitTable = ["fire", "fire", "fire", "cargo", "cargo", "fuel", "accomodations", "hanger", "tractor-beam", "life-support", "life-support"];
  return rollHitTable(hitTable, 1);
}
__name$10(getIncidentalHitCU, "getIncidentalHitCU");
function rollHitTable(table, defaultHits = 1, cascadeRoll) {
  let tableRoll;
  if (table.length === 11) {
    tableRoll = Math.clamp(getMultipleRolls(1, 6, 2) - 2, 0, 10);
  } else {
    tableRoll = Math.clamp(getRandomInteger(0, table.length - 1), 0, table.length - 1);
  }
  let hitLocation = table[tableRoll];
  let hits = defaultHits;
  if (cascadeRoll && hitLocation === "special") {
    const special = cascadeRoll();
    hitLocation = special.location;
    hits = special.hits;
  }
  return { location: hitLocation, hits };
}
__name$10(rollHitTable, "rollHitTable");
function generateDamageList(damage, hitGenerator) {
  const returnValue = [];
  for (let i = 0; i < damage; i++) {
    const newDamage = hitGenerator();
    if (newDamage.location === "destroyed") {
      return [{ location: "destroyed", hits: Infinity }];
    } else if (newDamage.location !== "none") {
      returnValue.push({ location: newDamage.location, hits: newDamage.hits });
    }
  }
  return returnValue;
}
__name$10(generateDamageList, "generateDamageList");
function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
__name$10(getRandomInteger, "getRandomInteger");
function getMultipleRolls(min, max, repeats) {
  let returnValue = 0;
  for (let i = 0; i < repeats; i++) {
    returnValue += getRandomInteger(min, max);
  }
  return returnValue;
}
__name$10(getMultipleRolls, "getMultipleRolls");

var __defProp$$ = Object.defineProperty;
var __name$$ = (target, value) => __defProp$$(target, "name", { value, configurable: true });
const _TwodsixActor = class _TwodsixActor extends Actor {
  /** @override */
  /**
   * Perform preliminary operations before an Actor of this type is created.
   * Pre-creation operations only occur for the client which requested the operation.
   * @param {object} data               The initial data object provided to the document creation request.
   * @param {object} options            Additional options which modify the creation request.
   * @param {User} userId                 The User requesting the document creation.
   * @returns {Promise<boolean|void>}   A return value of false indicates the creation operation should be cancelled.
   * @see {Document#_preCreate}
   * @protected
   */
  async _preCreate(data, options, userId) {
    const allowed = await super._preCreate(data, options, userId);
    let isDefaultImg = false;
    const changeData = {};
    switch (this.type) {
      case "traveller":
      case "animal":
      case "robot": {
        foundry.utils.mergeObject(changeData, {
          system: {
            movement: {
              walk: this.system.movement.walk || game.settings.get("twodsix", "defaultMovement"),
              units: this.system.movement.units || game.settings.get("twodsix", "defaultMovementUnits")
            }
          }
        });
        if (this.img === foundry.documents.BaseActor.DEFAULT_ICON) {
          isDefaultImg = true;
          if (game.settings.get("twodsix", "defaultTokenSettings") && this.type === "traveller") {
            foundry.utils.mergeObject(changeData, {
              prototypeToken: {
                displayName: CONST.TOKEN_DISPLAY_MODES.OWNER,
                displayBars: CONST.TOKEN_DISPLAY_MODES.OWNER,
                sight: {
                  enabled: true,
                  visonMode: "basic",
                  brightness: 1
                },
                disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
                bar1: {
                  attribute: "hits"
                }
              }
            });
          }
          let newImage = "";
          if (this.type === "traveller") {
            newImage = "systems/twodsix/assets/icons/default_actor.png";
          } else if (this.type === "animal") {
            newImage = "systems/twodsix/assets/icons/alien-bug.svg";
          } else if (this.type === "robot") {
            newImage = "systems/twodsix/assets/icons/default_robot.svg";
          } else {
            newImage = foundry.documents.BaseActor.DEFAULT_ICON;
          }
          foundry.utils.mergeObject(changeData, {
            img: newImage
          });
        }
        const newHits = this.getCurrentHits(this.system.characteristics);
        foundry.utils.mergeObject(changeData, {
          system: {
            hits: {
              value: newHits.value,
              max: newHits.max
            }
          }
        });
        if (this.type === "animal") {
          foundry.utils.mergeObject(changeData, {
            system: {
              characteristics: {
                education: { label: "Instinct", displayShortLabel: "INS" },
                socialStanding: { label: "Pack", displayShortLabel: "PAK" }
              }
            }
          });
        }
        const items = this.items.map((i) => i.toObject());
        let isUpdated = false;
        const untrainedSkillData = this.createUntrainedSkillData();
        if (untrainedSkillData) {
          const item = new CONFIG.Item.documentClass(untrainedSkillData);
          items.push(item.toObject());
          isUpdated = true;
          foundry.utils.mergeObject(changeData, { system: { untrainedSkill: untrainedSkillData._id } });
        }
        if (game.settings.get("twodsix", "autoAddUnarmed")) {
          const unarmedData = this.createUnarmedData();
          if (unarmedData) {
            unarmedData.system.skill = unarmedData.system.skill || untrainedSkillData?._id || "";
            const item = new CONFIG.Item.documentClass(unarmedData);
            items.push(item.toObject());
            isUpdated = true;
          }
        }
        if (isUpdated) {
          this.updateSource({ items });
        }
        break;
      }
      case "ship": {
        if (this.img === foundry.documents.BaseActor.DEFAULT_ICON) {
          isDefaultImg = true;
          foundry.utils.mergeObject(changeData, {
            img: "systems/twodsix/assets/icons/default_ship.png"
          });
        }
        break;
      }
      case "vehicle": {
        if (this.img === foundry.documents.BaseActor.DEFAULT_ICON) {
          isDefaultImg = true;
          foundry.utils.mergeObject(changeData, {
            img: "systems/twodsix/assets/icons/default_vehicle.png"
          });
        }
        break;
      }
      case "space-object": {
        if (this.img === foundry.documents.BaseActor.DEFAULT_ICON) {
          isDefaultImg = true;
          foundry.utils.mergeObject(changeData, {
            img: "systems/twodsix/assets/icons/default_space-object.png"
          });
        }
        break;
      }
    }
    this.updateSource(changeData);
    if (game.settings.get("twodsix", "useSystemDefaultTokenIcon") && isDefaultImg) {
      this.prototypeToken.updateSource({
        texture: { src: foundry.documents.BaseActor.DEFAULT_ICON }
        //'icons/svg/mystery-man.svg'
      });
    }
    return allowed;
  }
  /**
   * Perform preliminary operations before a Document of this type is updated.
   * Pre-update operations only occur for the client which requested the operation.
   * @param {object} data            The data object that is changed - NOT always relative to the documents prior values
   * @param {object} options            Additional options which modify the update request
   * @param {documents.BaseUser} user   The User requesting the document update
   * @returns {Promise<boolean|void>}   A return value of false indicates the update operation should be cancelled.
   * @see {Document#_preUpdate}
   * @protected
   */
  async _preUpdate(data, options, user) {
    const allowed = await super._preUpdate(data, options, user);
    let deltaHits = 0;
    if (data?.system?.characteristics && ["traveller", "animal", "robot"].includes(this.type)) {
      const charDiff = foundry.utils.diffObject(this.system._source.characteristics, data.system.characteristics);
      if (Object.keys(charDiff).length > 0) {
        deltaHits = this.getDeltaHits(charDiff);
      }
      if (deltaHits !== 0) {
        Object.assign(options, { deltaHits });
        if (game.modules.get("splatter")?.active) {
          const newHits = Math.clamp(this.system.hits.value - deltaHits, 0, this.system.hits.max);
          foundry.utils.mergeObject(data, { "system.hits.value": newHits });
        }
      }
    }
    if (this.type === "traveller") {
      const financeDiff = {
        finances: data?.system?.finances ? foundry.utils.diffObject(this.system._source.finances, data.system.finances) : {},
        financeValues: data?.system?.financeValues ? foundry.utils.diffObject(this.system._source.financeValues, data.system.financeValues) : {}
        //v12 stopped passing diffferential
      };
      if (Object.keys(financeDiff.finances).length > 0 || Object.keys(financeDiff.financeValues).length > 0) {
        updateFinances(this, data, financeDiff);
      }
    } else if (this.type === "ship") {
      const financeDiff = {
        financesCash: data?.system?.financeValues?.cash !== this.system._source.financeValues?.cash ? data.system?.financeValues?.cash : void 0,
        commonFunds: data?.system?.commonFunds !== this.system._source.commonFunds ? data.system?.commonFunds : void 0
      };
      if (financeDiff.financesCash !== void 0 || financeDiff.commonFunds !== void 0) {
        updateShipFinances(this, data, financeDiff);
      }
    }
    return allowed;
  }
  /**
   * Perform follow-up operations after a Document of this type is updated.
   * Post-update operations occur for all clients after the update is broadcast.
   * @param {object} changed            The differential data that was changed relative to the documents prior values
   * @param {object} options            Additional options which modify the update request
   * @param {string} userId             The id of the User requesting the document update
   * @see {Document#_onUpdate}
   * @protected
   */
  async _onUpdate(changed, options, userId) {
    await super._onUpdate(changed, options, userId);
    if (options.diff && game.user?.id === userId) {
      if (!!options.deltaHits && ["traveller", "animal", "robot"].includes(this.type)) {
        if (game.settings.get("twodsix", "useWoundedStatusIndicators")) {
          await applyWoundedEffect(this);
        }
      }
      if (game.settings.get("twodsix", "useEncumbranceStatusIndicators") && this.type === "traveller") {
        if (isEncumbranceChange(changed)) {
          await applyEncumberedEffect(this);
        }
      }
    }
    if (!!options.deltaHits && this.isOwner) {
      this.scrollDamage(options.deltaHits);
    }
  }
  async _onDelete() {
    if (this.type === "traveller") {
      if (this.id) {
        deleteIdFromShipPositions(this.id);
      }
    }
  }
  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareDerivedData() {
    super.prepareDerivedData();
    switch (this.type) {
      case "traveller":
      case "animal":
      case "robot":
        this._prepareActorDerivedData();
        break;
      case "ship":
        if (game.settings.get("twodsix", "useShipAutoCalcs")) {
          this._prepareShipDerivedData();
        }
        this._checkCrewTitles();
        this._updateCharacteristics();
        break;
      case "vehicle":
      case "space-object":
        break;
      default:
        console.warn(`Unknown actor type: ${this.type}`);
    }
  }
  /**
  * Check Crew Titles for missing and set to localized default
  */
  _checkCrewTitles() {
    for (const pos in this.system.crewLabel) {
      if (this.system.crewLabel[pos] === "") {
        this.system.crewLabel[pos] = game.i18n.localize("TWODSIX.Ship.Crew." + pos.toUpperCase());
      }
    }
  }
  /**
  * Update Ship characteristics - used for morale
  */
  _updateCharacteristics() {
    for (const cha of Object.keys(this.system.characteristics)) {
      const characteristic = this.system.characteristics[cha];
      characteristic.current = characteristic.value - characteristic.damage;
      characteristic.mod = calcModFor(characteristic.current);
    }
  }
  /**
   * Prepare Character type specific data
   * Note that first pass at Active Effects already applied during  ActiveEffects.applyActiveEffects call prior to calculating prepare derived data
   */
  async _prepareActorDerivedData() {
    const { system } = this;
    for (const cha of Object.keys(system.characteristics)) {
      const characteristic = system.characteristics[cha];
      characteristic.current = characteristic.value - characteristic.damage;
      characteristic.mod = calcModFor(characteristic.current);
      if (characteristic.displayShortLabel === "") {
        characteristic.displayShortLabel = getCharShortName(characteristic.shortLabel);
      }
    }
    const newHitsValue = this.getCurrentHits(system.characteristics);
    this.system.hits.value = newHitsValue.value;
    this.system.hits.max = newHitsValue.max;
    const actorSkills = this.itemTypes.skills.map(
      (skill) => [simplifySkillName(skill.name ?? ""), Math.max(skill.system.value, this.getUntrainedSkill()?.system.value ?? CONFIG.Item.dataModels.skills.schema.getInitialValue().value)]
    );
    const handler = {
      has: /* @__PURE__ */ __name$$((target, property) => {
        return property[property.length - 1] !== "_" ? true : property.slice(0, -1) in target;
      }, "has"),
      get: /* @__PURE__ */ __name$$((target, property) => {
        if (property[property.length - 1] === "_") {
          const newName = property[property.length - 1] === "_" ? property.slice(0, -1) : property;
          return newName in target && target[newName] > 0 ? target[newName] : 0;
        } else {
          return property in target ? target[property] : this.getUntrainedSkill()?.system.value ?? CONFIG.Item.dataModels.skills.schema.getInitialValue().value;
        }
      }, "get")
    };
    system.skills = new Proxy(Object.fromEntries(actorSkills), handler);
    if (this.type === "traveller") {
      const armorValues = this.getArmorValues();
      system.primaryArmor.value = armorValues.primaryArmor;
      system.secondaryArmor.value = armorValues.secondaryArmor;
      system.radiationProtection.value = armorValues.radiationProtection;
      system.layersWorn = armorValues.layersWorn;
      system.wearingNonstackable = armorValues.wearingNonstackable;
      system.armorType = armorValues.CTLabel;
      system.armorDM = armorValues.armorDM || 0;
      system.reflectOn = armorValues.reflectOn;
      system.protectionTypes = armorValues.protectionTypes.length > 0 ? ": " + armorValues.protectionTypes.map((x) => game.i18n.localize(x)).join(", ") : "";
      system.totalArmor = armorValues.totalArmor;
      system.primaryArmor.base = system.primaryArmor.value;
      if (this.overrides.system?.primaryArmor?.value) {
        system.totalArmor += this.overrides.system.primaryArmor.value - system.primaryArmor.base;
      }
    }
    system.encumbrance.value = this.getActorEncumbrance();
    const allCustomKeys = this.appliedEffects.flatMap((e) => e.changes.filter((c) => c.mode === CONST.ACTIVE_EFFECT_MODES.CUSTOM).map((c) => c.key)).filter((k) => k);
    const customKeys = [...new Set(allCustomKeys)].filter((k) => k !== "system.encumbrance.max");
    const derivedKeys = this._getDerivedDataKeys().filter((k) => k !== "system.encumbrance.max" && !customKeys.includes(k));
    if (derivedKeys.length > 0) {
      this.applyActiveEffects(derivedKeys);
    }
    if (customKeys.length > 0) {
      this.applyActiveEffects(customKeys);
    }
    if (this.overrides.system?.encumbrance?.max !== void 0) {
      delete this.overrides.system.encumbrance.max;
    }
    system.encumbrance.max = this.getMaxEncumbrance(true);
    this.applyActiveEffects(["system.encumbrance.max"]);
  }
  /**
   * Method to evaluate the armor and radiation protection values for all armor worn.
   * @returns {object} An object of the total for primaryArmor, secondaryArmor, and radiationProteciton
   * @public
   */
  getArmorValues() {
    const returnValue = {
      primaryArmor: 0,
      secondaryArmor: 0,
      radiationProtection: 0,
      layersWorn: 0,
      wearingNonstackable: false,
      CTLabel: "nothing",
      armorDM: 0,
      reflectOn: false,
      protectionTypes: [],
      totalArmor: 0
    };
    const armorItems = this.itemTypes.armor;
    const useMaxArmorValue = game.settings.get("twodsix", "useMaxArmorValue");
    const damageTypes = getDamageTypes(false);
    const ruleset = game.settings.get("twodsix", "ruleset");
    let reflectDM = 0;
    for (const armor of armorItems) {
      if (armor.system.equipped === "equipped") {
        if (armor.system.armorType === "reflec") {
          returnValue.reflectOn = true;
          reflectDM = armor.system.armorDM;
        } else {
          returnValue.CTLabel = armor.system.armorType;
          returnValue.armorDM = armor.system.armorDM;
        }
        returnValue.layersWorn += 1;
        if (armor.system.nonstackable) {
          returnValue.wearingNonstackable = true;
        }
        if (ruleset === "CT") {
          continue;
        }
        const protectionDetails = armor.system.secondaryArmor.protectionTypes.map((type) => `${damageTypes[type]}`);
        protectionDetails.forEach((type) => {
          if (!returnValue.protectionTypes.includes(type)) {
            returnValue.protectionTypes.push(type);
          }
        });
        const totalArmor = stackArmorValues(armor.system.secondaryArmor.value, armor.system.armor);
        if (useMaxArmorValue) {
          returnValue.primaryArmor = Math.max(armor.system.armor, returnValue.primaryArmor);
          if (totalArmor > returnValue.totalArmor) {
            returnValue.secondaryArmor = armor.system.secondaryArmor.value;
            returnValue.totalArmor = totalArmor;
          }
          returnValue.radiationProtection = Math.max(armor.system.radiationProtection.value, returnValue.radiationProtection);
        } else {
          returnValue.primaryArmor = stackArmorValues(returnValue.primaryArmor, armor.system.armor);
          returnValue.secondaryArmor = stackArmorValues(returnValue.secondaryArmor, armor.system.secondaryArmor.value);
          returnValue.totalArmor = stackArmorValues(returnValue.totalArmor, totalArmor);
          returnValue.radiationProtection += armor.system.radiationProtection.value;
        }
      }
    }
    if (returnValue.reflectOn && returnValue.CTLabel === "nothing") {
      returnValue.CTLabel = "reflec";
      returnValue.armorDM = reflectDM;
    }
    return returnValue;
  }
  /**
   * Method to evaluate the secondary armor value depending on the damge type and actor type. Returns the effective value
   * for the secondary armor.
   * @param {string} damageType  The damage type key to check against secondary armor
   * @returns {number} The value added to effective armor due to secondary armor
   * @public
   */
  getSecondaryProtectionValue(damageType) {
    let returnValue = 0;
    if (damageType !== "NONE" && damageType !== "" && damageType) {
      if (["traveller"].includes(this.type)) {
        const armorItems = this.itemTypes.armor;
        const useMaxArmorValue = game.settings.get("twodsix", "useMaxArmorValue");
        for (const armor of armorItems) {
          if (armor.system.equipped === "equipped" && armor.system.secondaryArmor.protectionTypes.includes(damageType)) {
            if (useMaxArmorValue) {
              returnValue = Math.max(armor.system.secondaryArmor.value, returnValue);
            } else {
              returnValue = stackArmorValues(returnValue, armor.system.secondaryArmor.value);
            }
          }
        }
      } else if (["robot", "animal"].includes(this.type)) {
        if (this.system.secondaryArmor.protectionTypes.includes(damageType)) {
          returnValue = this.system.secondaryArmor.value;
        }
      }
    }
    return returnValue;
  }
  /**
   * Calculate the maximum encumbrance for this actor, using the configured formula and optionally excluding the encumbrance bonus.
   *
   * The formula is defined in system settings ('maxEncumbrance') and may reference any actor data (e.g., STR mod, skills).
   * If the Item Piles module is active and the actor is a merchant, returns Infinity.
   *
   * @param {boolean} [includeOffset=true]  Whether to include system.encumbrance.bonus in the calculation.
   * @returns {number} The calculated maximum encumbrance (clamped to zero or above).
   */
  getMaxEncumbrance(includeOffset = true) {
    if (game.modules.get("item-piles")?.active) {
      if (this.getFlag("item-piles", "data.enabled") && this.getFlag("item-piles", "data.type") === "merchant") {
        return Infinity;
      }
    }
    let maxEncumbrance = 0;
    const encumbFormula = game.settings.get("twodsix", "maxEncumbrance");
    if (Roll.validate(encumbFormula)) {
      const rollData = foundry.utils.deepClone(this.system);
      if (game.settings.get("twodsix", "ruleset") === "CT") {
        const encumberedEffect = this.effects.find((eff) => eff.statuses.has("encumbered"));
        if (encumberedEffect) {
          for (const change of encumberedEffect.changes) {
            const rollKey = change.key.replace("system.", "");
            foundry.utils.mergeObject(rollData, { [rollKey]: foundry.utils.getProperty(this, change.key) - parseInt(change.value) });
          }
        }
      }
      maxEncumbrance = Roll.safeEval(Roll.replaceFormulaData(encumbFormula, rollData, { missing: "0", warn: false }));
    }
    if (includeOffset) {
      maxEncumbrance += this.system.encumbrance.offset || 0;
    }
    return Math.max(maxEncumbrance, 0);
  }
  getActorEncumbrance() {
    let encumbrance = 0;
    const actorItems = this.items.filter((i) => ![...TWODSIX$1.WeightlessItems, "ship_position", "storage"].includes(i.type));
    for (const item of actorItems) {
      encumbrance += getEquipmentWeight(item);
    }
    return encumbrance;
  }
  _prepareShipDerivedData() {
    const calcShipStats = {
      power: {
        max: 0,
        used: 0,
        systems: 0,
        jDrive: 0,
        mDrive: 0,
        sensors: 0,
        weapons: 0
      },
      weight: {
        systems: 0,
        cargo: 0,
        vehicles: 0,
        fuel: 0,
        available: 0,
        baseHull: 0
      },
      cost: {
        baseHullValue: 0,
        percentHull: 0,
        componentValue: 0,
        total: 0
      },
      bandwidth: {
        used: 0,
        available: 0
      }
    };
    if (!this.system.shipStats.mass.max || this.system.shipStats.mass.max <= 0) {
      const calcDisplacement = estimateDisplacement(this);
      if (calcDisplacement && calcDisplacement > 0) {
        this.update({ "system.shipStats.mass.max": calcDisplacement });
      }
    }
    const massProducedMultiplier = this.system.isMassProduced ? 1 - parseFloat(game.settings.get("twodsix", "massProductionDiscount")) : 1;
    this.itemTypes.component.forEach((item) => {
      const anComponent = item.system;
      const powerForItem = getPower(item);
      const weightForItem = getWeight(item);
      allocatePower(anComponent, powerForItem, item);
      allocateWeight(anComponent, weightForItem);
      calculateComponentCost(anComponent, weightForItem, this, massProducedMultiplier);
      calculateBandwidth(anComponent);
    });
    this.itemTypes.component.filter((it) => ["pctHull", "pctHullPerUnit"].includes(it.system.pricingBasis) && !["fuel", "cargo", "vehicle"].includes(it.system.subtype)).forEach((item) => {
      item.system.installedCost = calcShipStats.cost.baseHullValue * Number(item.system.price) / 100;
      if (item.system.pricingBasis === "pctHullPerUnit") {
        item.system.installedCost *= item.system.quantity;
      }
    });
    calcShipStats.power.used = calcShipStats.power.jDrive + calcShipStats.power.mDrive + calcShipStats.power.sensors + calcShipStats.power.weapons + calcShipStats.power.systems;
    calcShipStats.weight.available = this.system.shipStats.mass.max - (calcShipStats.weight.vehicles ?? 0) - (calcShipStats.weight.cargo ?? 0) - (calcShipStats.weight.fuel ?? 0) - (calcShipStats.weight.systems ?? 0);
    calcShipStats.cost.total = calcShipStats.cost.componentValue + calcShipStats.cost.baseHullValue * (1 + calcShipStats.cost.percentHull / 100);
    updateShipData(this);
    function estimateDisplacement(shipActor) {
      let returnValue = 0;
      shipActor.itemTypes.component.filter((item) => item.system.isBaseHull).forEach((item) => {
        returnValue += getWeight(item);
      });
      return Math.round(returnValue);
    }
    __name$$(estimateDisplacement, "estimateDisplacement");
    function calculateComponentCost(anComponent, weightForItem, shipActor, multiplier) {
      if (!["fuel", "cargo", "ammo", "vehicle"].includes(anComponent.subtype)) {
        if (anComponent.subtype === "hull" && anComponent.isBaseHull) {
          switch (anComponent.pricingBasis) {
            case "perUnit":
              anComponent.installedCost = Number(anComponent.price) * anComponent.quantity * multiplier;
              break;
            case "perCompTon":
              anComponent.installedCost = Number(anComponent.price) * weightForItem * multiplier;
              break;
            case "perHullTon":
              anComponent.installedCost = (shipActor.system.shipStats.mass.max || calcShipStats.weight.baseHull) * Number(anComponent.price) * multiplier;
              break;
            case "per100HullTon":
              anComponent.installedCost = (shipActor.system.shipStats.mass.max || calcShipStats.weight.baseHull) * Number(anComponent.price) / 100 * multiplier;
              break;
          }
          calcShipStats.cost.baseHullValue += anComponent.installedCost;
        } else {
          switch (anComponent.pricingBasis) {
            case "perUnit":
              anComponent.installedCost = Number(anComponent.price) * anComponent.quantity * multiplier;
              break;
            case "perCompTon":
              anComponent.installedCost = Number(anComponent.price) * weightForItem * multiplier;
              break;
            case "pctHull":
              calcShipStats.cost.percentHull += Number(anComponent.price);
              break;
            case "pctHullPerUnit":
              calcShipStats.cost.percentHull += Number(anComponent.price) * anComponent.quantity;
              break;
            case "perHullTon":
              anComponent.installedCost = Number(anComponent.price) * (shipActor.system.shipStats.mass.max || calcShipStats.weight.baseHull) * multiplier;
              break;
            case "per100HullTon":
              anComponent.installedCost = Number(anComponent.price) / 100 * (shipActor.system.shipStats.mass.max || calcShipStats.weight.baseHull) * multiplier;
              break;
          }
          if (!["pctHull", "pctHullPerUnit"].includes(anComponent.pricingBasis)) {
            calcShipStats.cost.componentValue += anComponent.installedCost;
          }
        }
      }
    }
    __name$$(calculateComponentCost, "calculateComponentCost");
    function calculateBandwidth(anComponent) {
      if (game.settings.get("twodsix", "showBandwidth") && ["operational", "damaged"].includes(anComponent.status)) {
        if (anComponent.subtype === "computer") {
          calcShipStats.bandwidth.available += anComponent.bandwidth;
        } else if (anComponent.subtype === "software") {
          calcShipStats.bandwidth.used += anComponent.bandwidth;
        }
      }
    }
    __name$$(calculateBandwidth, "calculateBandwidth");
    function allocateWeight(anComponent, weightForItem) {
      switch (anComponent.subtype) {
        case "vehicle":
          calcShipStats.weight.vehicles += weightForItem;
          break;
        case "cargo":
        case "ammo":
          calcShipStats.weight.cargo += weightForItem;
          break;
        case "fuel":
          calcShipStats.weight.fuel += weightForItem;
          break;
        case "hull":
          if (anComponent.isBaseHull) {
            calcShipStats.weight.baseHull += weightForItem;
          } else {
            calcShipStats.weight.systems += weightForItem;
          }
          break;
        default:
          calcShipStats.weight.systems += weightForItem;
          break;
      }
    }
    __name$$(allocateWeight, "allocateWeight");
    function allocatePower(anComponent, powerForItem, item) {
      if (anComponent.generatesPower) {
        calcShipStats.power.max += powerForItem;
      } else {
        switch (anComponent.subtype) {
          case "drive": {
            const componentName = item.name?.toLowerCase() ?? "";
            const jDriveLabel = game.i18n.localize(game.settings.get("twodsix", "jDriveLabel")).toLowerCase();
            const mDriveLabel = game.i18n.localize("TWODSIX.Ship.MDrive").toLowerCase();
            if (componentName.includes("j-drive") || componentName.includes("j drive") || componentName.includes(jDriveLabel)) {
              calcShipStats.power.jDrive += powerForItem;
            } else if (componentName.includes("m-drive") || componentName.includes("m drive") || componentName.includes(mDriveLabel)) {
              calcShipStats.power.mDrive += powerForItem;
            } else {
              calcShipStats.power.systems += powerForItem;
            }
            break;
          }
          case "sensor":
            calcShipStats.power.sensors += powerForItem;
            break;
          case "armament":
            calcShipStats.power.weapons += powerForItem;
            break;
          default:
            calcShipStats.power.systems += powerForItem;
            break;
        }
      }
    }
    __name$$(allocatePower, "allocatePower");
    function updateShipData(shipActor) {
      shipActor.system.shipStats.power.value = roundToMaxDecimals(calcShipStats.power.used, 1);
      shipActor.system.shipStats.power.max = roundToMaxDecimals(calcShipStats.power.max, 1);
      shipActor.system.reqPower.systems = roundToMaxDecimals(calcShipStats.power.systems, 1);
      shipActor.system.reqPower["m-drive"] = roundToMaxDecimals(calcShipStats.power.mDrive, 1);
      shipActor.system.reqPower["j-drive"] = roundToMaxDecimals(calcShipStats.power.jDrive, 1);
      shipActor.system.reqPower.sensors = roundToMaxDecimals(calcShipStats.power.sensors, 1);
      shipActor.system.reqPower.weapons = roundToMaxDecimals(calcShipStats.power.weapons, 1);
      shipActor.system.shipStats.bandwidth.value = Math.round(calcShipStats.bandwidth.used);
      shipActor.system.shipStats.bandwidth.max = Math.round(calcShipStats.bandwidth.available);
      shipActor.system.weightStats.vehicles = roundToMaxDecimals(calcShipStats.weight.vehicles, 2);
      shipActor.system.weightStats.cargo = roundToMaxDecimals(calcShipStats.weight.cargo, 2);
      shipActor.system.weightStats.fuel = roundToMaxDecimals(calcShipStats.weight.fuel, 2);
      shipActor.system.weightStats.systems = roundToMaxDecimals(calcShipStats.weight.systems, 2);
      shipActor.system.weightStats.available = roundToMaxDecimals(calcShipStats.weight.available, 2);
      shipActor.system.shipValue = calcShipStats.cost.total.toLocaleString(game.i18n.lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      shipActor.system.mortgageCost = (calcShipStats.cost.total / game.settings.get("twodsix", "mortgagePayment") * 1e6).toLocaleString(game.i18n.lang, { maximumFractionDigits: 0 });
      shipActor.system.maintenanceCost = (calcShipStats.cost.total * 1e-3 * 1e6 / 12).toLocaleString(game.i18n.lang, { maximumFractionDigits: 0 });
    }
    __name$$(updateShipData, "updateShipData");
  }
  async damageActor(damagePayload, showDamageDialog = true) {
    if (!damagePayload?.damageValue || damagePayload.damageValue < 0) {
      console.log("Invalid damage value");
      return;
    }
    if (showDamageDialog) {
      const damageData = foundry.utils.duplicate(damagePayload);
      Object.assign(damageData, {
        damageId: "damage-" + foundry.utils.randomID(),
        actor: this,
        targetUuid: this.uuid
      });
      game.socket?.emit("system.twodsix", ["createDamageDialog", damageData]);
      Hooks.call("createDamageDialog", damageData);
    } else {
      const canOnlyBeBlocked = damagePayload.canBeBlocked && !damagePayload.canBeParried;
      const parryArmor = damagePayload.canBeParried || damagePayload.canBeBlocked ? await getParryValue(this, canOnlyBeBlocked) : 0;
      const stats = new Stats$1(this, damagePayload.damageValue, damagePayload.armorPiercingValue, damagePayload.damageType, damagePayload.damageLabel, parryArmor, canOnlyBeBlocked, damagePayload.dice);
      await stats.applyDamage();
    }
  }
  async healActor(healing, dice) {
    if (["traveller", "animal", "robot"].includes(this.type)) {
      if (!game.settings.get("twodsix", "autoDamageTarget")) {
        const healingData = {};
        Object.assign(healingData, {
          healingId: "healing-" + foundry.utils.randomID(),
          actor: this,
          targetUuid: this.uuid,
          healingValue: healing,
          dice
        });
        game.socket?.emit("system.twodsix", ["createHealingDialog", healingData]);
        Hooks.call("createHealingDialog", healingData);
      } else {
        let damageCharacteristics = [];
        if (game.settings.get("twodsix", "reverseHealingOrder")) {
          damageCharacteristics = getDamageCharacteristics(this.type).reverse();
        } else {
          damageCharacteristics = getDamageCharacteristics(this.type);
        }
        const charArray = {};
        for (const characteristic of damageCharacteristics) {
          const cur_damage = this.system.characteristics[characteristic].damage;
          if (cur_damage > 0) {
            const new_damage = Math.max(0, cur_damage - healing);
            const char_id = "system.characteristics." + characteristic + ".damage";
            charArray[char_id] = new_damage;
            healing -= cur_damage - new_damage;
          }
          if (healing < 1) {
            break;
          }
        }
        await this.update(charArray);
      }
    }
  }
  getDeltaHits(charDiff) {
    const newCharacteristics = foundry.utils.mergeObject(this.system.characteristics, charDiff);
    const updatedHitValues = this.getCurrentHits(newCharacteristics);
    const deltaHits = this.system.hits.value - updatedHitValues.value;
    if (deltaHits !== 0 && game.settings.get("twodsix", "showHitsChangesInChat")) {
      const appliedType = deltaHits > 0 ? game.i18n.localize("TWODSIX.Actor.damage") : game.i18n.localize("TWODSIX.Actor.healing");
      const actionWord = game.i18n.localize("TWODSIX.Actor.Applied");
      ChatMessage.create({ flavor: `${actionWord} ${appliedType}: ${Math.abs(deltaHits)}`, speaker: ChatMessage.getSpeaker({ actor: this }), whisper: ChatMessage.getWhisperRecipients("GM") });
    }
    return isNaN(deltaHits) ? 0 : deltaHits;
  }
  getCurrentHits(currentCharacteristics) {
    const hitsCharacteristics = getDamageCharacteristics(this.type);
    return Object.entries(currentCharacteristics).reduce((hits, [key, chr]) => {
      if (hitsCharacteristics.includes(key)) {
        hits.value += chr.value - chr.damage;
        hits.max += chr.value;
      }
      return hits;
    }, { value: 0, max: 0, lastDelta: 0 });
  }
  getCharacteristicModifier(characteristic) {
    if (characteristic === "NONE") {
      return 0;
    } else if (["vehicle", "space-object"].includes(this.type)) {
      return 0;
    } else {
      const keyByValue = getKeyByValue(TWODSIX$1.CHARACTERISTICS, characteristic);
      return this.system.characteristics[keyByValue].mod;
    }
  }
  async characteristicRoll(tmpSettings, showThrowDialog, showInChat = true) {
    if (!tmpSettings.rollModifiers?.characteristic) {
      ui.notifications.error("TWODSIX.Errors.NoCharacteristicForRoll", { localize: true });
      return;
    }
    if (!tmpSettings.difficulty) {
      const difficultyObject = TWODSIX$1.DIFFICULTIES[game.settings.get("twodsix", "difficultyListUsed")];
      tmpSettings.difficulty = game.settings.get("twodsix", "ruleset") === "CU" ? difficultyObject.Routine : difficultyObject.Average;
    }
    const settings = await TwodsixRollSettings.create(showThrowDialog, tmpSettings, void 0, void 0, this);
    if (!settings.shouldRoll) {
      return;
    }
    const diceRoll = new TwodsixDiceRoll(settings, this);
    await diceRoll.evaluateRoll();
    if (showInChat) {
      await diceRoll.sendToChat(settings.difficulties);
    }
    return diceRoll;
  }
  getUntrainedSkill() {
    return this.items.get(this.system.untrainedSkill);
  }
  createUntrainedSkillData() {
    if (this.system.untrainedSkill) {
      if (this.items.get(this.system.untrainedSkill)) {
        return;
      }
    }
    const existingSkill = this.itemTypes.skills?.find((sk) => sk.name === game.i18n.localize("TWODSIX.Actor.Skills.Untrained"));
    if (existingSkill) {
      return;
    }
    return buildUntrainedSkillData();
  }
  createUnarmedData() {
    if (this.items?.getName(game.i18n.localize("TWODSIX.Items.Weapon.Unarmed"))) {
      return;
    }
    const bandSetting = game.settings.get("twodsix", "rangeModifierType");
    let rangeSetting = "";
    if (bandSetting === "CT_Bands") {
      rangeSetting = "hands";
    } else if (bandSetting === "CE_Bands") {
      rangeSetting = "closeQuarters";
    } else if (bandSetting === "CU_Bands") {
      rangeSetting = "personal";
    }
    return {
      "name": game.i18n.localize("TWODSIX.Items.Weapon.Unarmed"),
      "type": "weapon",
      "img": "systems/twodsix/assets/icons/unarmed.svg",
      "system": {
        "armorPiercing": 0,
        "description": game.i18n.localize("TWODSIX.Items.Weapon.UnarmedDescription"),
        "type": "weapon",
        "damage": game.settings.get("twodsix", "unarmedDamage") || "1d6",
        "quantity": 1,
        "skill": this.getUntrainedSkill()?.id || "",
        "equipped": "equipped",
        "damageType": game.settings.get("twodsix", "ruleset") === "CU" ? "melee" : "bludgeoning",
        "range": "Melee",
        "rangeBand": rangeSetting,
        "handlingModifiers": game.settings.get("twodsix", "ruleset") === "CT" ? "STR 6/-2 9/1" : ""
      }
    };
  }
  static resetUntrainedSkill() {
    applyToAllActors(async (actor) => {
      if (["traveller", "animal", "robot"].includes(actor.type)) {
        await correctMissingUntrainedSkill(actor);
        const itemUpdates = [];
        for (const item of actor.items) {
          if (!["skills", "trait"].includes(item.type)) {
            const skill = actor.items.get(item.system.skill);
            if (skill && skill.getFlag("twodsix", "untrainedSkill")) {
              const associatedSkill = actor.getBestSkill(item.system.associatedSkillName, false);
              itemUpdates.push({ _id: item.id, "system.skill": associatedSkill?.id ?? "" });
            }
          }
        }
        if (itemUpdates.length > 0) {
          actor.updateEmbeddedDocuments("Item", itemUpdates);
        }
      }
    });
  }
  static setUntrainedSkillForItems() {
    applyToAllActors(async (actor) => {
      if (["traveller", "animal", "robot"].includes(actor.type)) {
        await correctMissingUntrainedSkill(actor);
        const itemUpdates = [];
        const untrainedSkill = actor.getUntrainedSkill();
        for (const item of actor.items) {
          if (!["skills", "trait"].includes(item.type)) {
            const attachedSkill = await actor.items.get(item.system.skill);
            if (!attachedSkill || untrainedSkill.system.value === actor.system.skills[simplifySkillName(attachedSkill?.name)] && !attachedSkill?.getFlag("twodsix", "untrainedSkill")) {
              const associatedSkill = actor.getBestSkill(item.system.associatedSkillName, false);
              itemUpdates.push({ _id: item.id, "system.skill": associatedSkill?.id ?? untrainedSkill.id });
            }
          }
        }
        if (itemUpdates.length > 0) {
          await actor.updateEmbeddedDocuments("Item", itemUpdates);
        }
      }
    });
  }
  /**
   * Method to modify Traveller, Robot or Animal actor from token bar input. Special processing for "hits" attribute.
   * @param {string} attribute    The characteristic attribute (full name) being changed or generic "hits" attribute
   * @param {number} value  The change to the attribute (either a delta or direct value)
   * @param {boolean} isDelta Whether the value is a delta or an absolute number
   * @param {boolean} isBar Whether the value is a bar on token
   * @returns {Promise}
   * @public
   */
  async modifyTokenAttribute(attribute, value, isDelta, isBar) {
    if (attribute === "hits" && ["traveller", "animal", "robot"].includes(this.type)) {
      const hits = foundry.utils.getProperty(this.system, attribute);
      const delta = isDelta ? -1 * value : hits.value - value;
      if (delta > 0) {
        this.damageActor({ damageValue: delta, armorPiercingValue: 9999, damageType: "NONE", damageLabel: "NONE", canBeParried: false }, false);
        return;
      } else if (delta < 0) {
        this.healActor(-delta);
        return;
      }
    }
    return super.modifyTokenAttribute(attribute, value, isDelta, isBar);
  }
  /**
   * Function to add a dropped skill to an actor
   * @param {TwodsixItem} skill    The skill document
   * @returns {Promise} A boolean promise of whether the drop was sucessful
   * @private
   */
  async _addDroppedSkills(skill) {
    const sameActor = this.items.get(skill._id);
    if (sameActor) {
      console.log(`Twodsix | Moved Skill ${skill.name} to another position in the skill list`);
      return false;
    }
    const matching = this.items.find((it) => it.name === skill.name && it.type === "skills");
    if (matching) {
      console.log(`Twodsix | Skill ${skill.name} already on character ${this.name}.`);
      let updateValue = matching.system.value + 1;
      if (game.settings.get("twodsix", "hideUntrainedSkills") && updateValue < 0) {
        updateValue = 0;
      }
      await matching.update({ "system.value": updateValue });
      return false;
    }
    const addedSkill = (await this.createEmbeddedDocuments("Item", [foundry.utils.duplicate(skill)]))[0];
    if (addedSkill.system.value < 0 || !addedSkill.system.value) {
      if (!game.settings.get("twodsix", "hideUntrainedSkills")) {
        const skillValue = CONFIG.Item.dataModels.skills.schema.getInitialValue().value ?? -3;
        addedSkill.update({ "system.value": skillValue });
      } else {
        addedSkill.update({ "system.value": 0 });
      }
    }
    console.log(`Twodsix | Added Skill ${addedSkill.name} to character`);
    return !!addedSkill;
  }
  /**
   * Method to add a dropped item to an actor
   * @param {TwodsixItem} item  The original item document
   * @returns {Promise} A boolean promise of whether the drop was sucessful
   * @private
   */
  async _addDroppedEquipment(item) {
    const sameActor = this.items.get(item._id);
    if (sameActor) {
      return false;
    }
    let numberToMove = item.system?.quantity ?? 1;
    if (item.actor && game.settings.get("twodsix", "transferDroppedItems")) {
      if (item.system.quantity > 1) {
        numberToMove = await getMoveNumber(item);
        if (numberToMove >= item.system.quantity) {
          await item.update({ "system.equipped": "ship" });
          numberToMove = item.system.quantity;
          await item.delete();
        } else if (numberToMove === 0) {
          return false;
        } else {
          await item.update({ "system.quantity": item.system.quantity - numberToMove });
        }
      } else if (item.system.quantity === 1) {
        await item.update({ "system.equipped": "ship" });
        await item.delete();
      } else {
        return false;
      }
    }
    let dupItem = {};
    if (item.type === "component") {
      dupItem = this.items.find((it) => it.name === item.name && it.type === item.type && it.system.subtype === item.system.subtype);
    } else {
      dupItem = this.items.find((it) => it.name === item.name && it.type === item.type);
    }
    if (dupItem) {
      console.log(`Twodsix | Item ${item.name} already on character ${this.name}.`);
      if (dupItem.type !== "skills" && dupItem.type !== "trait" && dupItem.type !== "ship_position") {
        const newQuantity = dupItem.system.quantity + numberToMove;
        await dupItem.update({ "system.quantity": newQuantity });
      }
      return false;
    }
    const itemCopy = foundry.utils.duplicate(item);
    itemCopy.system.quantity = numberToMove;
    itemCopy.system.equipped = "backpack";
    if (Object.hasOwn(itemCopy, "_id")) {
      delete itemCopy._id;
    }
    if (Object.hasOwn(itemCopy, "uuid")) {
      delete itemCopy.uuid;
    }
    if (itemCopy.effects?.length > 0) {
      for (const effect of itemCopy.effects) {
        effect.disabled = false;
        effect.transfer = game.settings.get("twodsix", "useItemActiveEffects");
      }
    }
    itemCopy.system.skill = this.getBestSkill(itemCopy.system.associatedSkillName, false)?.id ?? this.getUntrainedSkill()?.id;
    itemCopy.system.consumables = [];
    itemCopy.system.useConsumableForAttack = "";
    if (itemCopy.type === "consumable") {
      itemCopy.system.parentName = "";
      itemCopy.system.parentType = "";
    }
    const addedItem = (await this.createEmbeddedDocuments("Item", [itemCopy]))[0];
    if (game.settings.get("twodsix", "useEncumbranceStatusIndicators") && this.type === "traveller" && !TWODSIX$1.WeightlessItems.includes(addedItem.type)) {
      await applyEncumberedEffect(this);
    }
    console.log(`Twodsix | Added Item ${addedItem.name} to character`);
    return !!addedItem;
  }
  async handleDroppedItem(droppedItem) {
    if (!droppedItem) {
      return false;
    }
    switch (this.type) {
      case "traveller":
        if (droppedItem.type === "skills") {
          return await this._addDroppedSkills(droppedItem);
        } else if (!["component", "ship_position"].includes(droppedItem.type)) {
          return await this._addDroppedEquipment(droppedItem);
        }
        break;
      case "animal":
        if (droppedItem.type === "skills") {
          return this._addDroppedSkills(droppedItem);
        } else if (["weapon", "trait"].includes(droppedItem.type)) {
          return await this._addDroppedEquipment(droppedItem);
        }
        break;
      case "robot":
        if (droppedItem.type === "skills") {
          return await this._addDroppedSkills(droppedItem);
        } else if (["weapon", "trait", "augment"].includes(droppedItem.type)) {
          return await this._addDroppedEquipment(droppedItem);
        }
        break;
      case "ship":
        if (!TWODSIX$1.WeightlessItems.includes(droppedItem.type)) {
          return await this._addDroppedEquipment(droppedItem);
        }
        break;
      case "vehicle":
        if (![...TWODSIX$1.WeightlessItems, "cargo"].includes(droppedItem.type)) {
          return await this._addDroppedEquipment(droppedItem);
        }
        break;
    }
    ui.notifications.warn("TWODSIX.Warnings.CantDragOntoActor", { localize: true });
    return false;
  }
  /**
   * Handle a dropped ActiveEffect on the Actor.
   * @param {TwodsixActiveEffect} droppedEffect         Dropped ActiveEffect
   * @returns {Promise<boolean>}
   *
   */
  async handleDroppedActiveEffect(droppedEffect) {
    if (!droppedEffect || droppedEffect.target === this) {
      return false;
    }
    const keepId = !this.effects.has(droppedEffect.id);
    await TwodsixActiveEffect.create(droppedEffect.toObject(), { parent: this, keepId });
    return true;
  }
  /**
   * Handle a dropped Folder on the Actor.
   * @param {FolderData} folder         Extracted folder document
   * @returns {Promise<void>}
   *
   */
  async handleDroppedFolder(folder) {
    if (folder?.type === "Item" && folder?.contents.length > 0) {
      const confirmed = await foundry.applications.api.DialogV2.confirm({
        window: { title: game.i18n.localize("TWODSIX.Warnings.AddMultipleItems") },
        content: game.i18n.localize("TWODSIX.Warnings.ConfirmDrop")
      });
      if (confirmed) {
        for (const it of folder.contents) {
          const itemToDrop = it.uuid.startsWith("Compendium") ? await fromUuid(it.uuid) : it;
          await this.handleDroppedItem(itemToDrop);
        }
      }
    } else {
      ui.notifications.warn("TWODSIX.Warnings.CantDropFolder", { localize: true });
    }
  }
  /**
   * Handle a dropped list of items (names or uuid's) onto the Actor.
   * @param {string} list         Comma separated list of item names or uuid's
   * @returns {Promise<void>}
   * @async
   */
  async handleDroppedList(list) {
    const itemReferences = list.split(",").map((str) => str.trim());
    for (const itemRef of itemReferences) {
      const newItem = foundry.utils.parseUuid(itemRef)?.id ? await fromUuid(itemRef) : game.items.getName(itemRef);
      if (newItem?.name) {
        await this.handleDroppedItem(newItem);
      } else {
        ui.notifications.warn(`${game.i18n.localize("TWODSIX.Warnings.CantFindItem")}: ${itemRef}`);
      }
    }
  }
  /**
   * Method to handle a dropped damage payload
   * @param {any} damagePayload The damage paylod being dropped (includes damage amount, AP value and damage type & label)
   * @param {boolean} showDamageDialog Whethter to show apply damage dialog
   * @returns {boolean}
   * @private
   */
  async handleDamageData(damagePayload, showDamageDialog) {
    if (!this.isOwner && !showDamageDialog) {
      ui.notifications.error("TWODSIX.Warnings.LackPermissionToDamage", { localize: true });
      return false;
    }
    if (["traveller", "animal", "robot"].includes(this.type)) {
      await this.damageActor(damagePayload, this.isOwner ? showDamageDialog : true);
      return true;
    } else if (["ship"].includes(this.type)) {
      generateShipDamageReport(this, damagePayload);
    } else {
      ui.notifications.warn("TWODSIX.Warnings.CantAutoDamage", { localize: true });
      return false;
    }
  }
  /**
   * Apply transformations to this Actor's data caused by Active Effects.
   *
   * Behavior is controlled by the optional `onlyKeys` list:
   * - When `onlyKeys` is omitted, this is the "base pass": apply effects that target
   *   non-derived keys, excluding CUSTOM mode. Statuses are updated.
   * - When `onlyKeys` is provided, apply only those changes whose key is explicitly listed.
   *   This is used for selective passes on derived properties and CUSTOM mode effects.
   *
   * Notes:
   * - Status icons are cleared only in the base pass (when `onlyKeys` is not provided).
   * - If the Item Piles module marks this actor as a merchant, derived-key passes are skipped.
   * - CUSTOM mode effects are deferred to later passes when all derived data is stable.
   *
   * Typical usage pattern (4 passes):
   * 1) Base pass: `applyActiveEffects()` (invoked automatically during Actor.prepareData before `prepareDerivedData()`)
   *    - Applies non-derived keys, non-CUSTOM modes only
   * 2) Derived pass: `applyActiveEffects(this._getDerivedDataKeys().filter(k => k !== "system.encumbrance.max"))`
   *    - Applies characteristic mods, skills, armor values (non-CUSTOM modes)
   * 3) CUSTOM pass: `applyActiveEffects(customKeys)` where customKeys are all CUSTOM mode effect keys
   *    - Applies CUSTOM formulas that may reference derived data
   * 4) Targeted override: `applyActiveEffects(["system.encumbrance.max"])`
   *    - Final override for encumbrance max after calculation
   *
   * @param {string[]} [onlyKeys] Restrict application to these data paths; when omitted, applies only to
   *                              non-derived keys (base pass).
   * @returns {void}
   * @override This overrides the core FVTT method to account for modifying derived data in multiple passes
   */
  applyActiveEffects(onlyKeys) {
    if (onlyKeys && game.modules.get("item-piles")?.active && this.getFlag("item-piles", "data.enabled")) {
      return;
    }
    if (onlyKeys) {
      this._aeCallDepth = (this._aeCallDepth || 0) + 1;
      if (this._aeCallDepth > 10) {
        console.warn(`Active Effects exceeded maximum depth for keys: ${onlyKeys.join(", ")} - possible circular dependency`);
        ui.notifications.warn("TWODSIX.Warnings.ActiveEffectsLoop", { localize: true });
        this._aeCallDepth = 0;
        return;
      }
    } else {
      this._aeCallDepth = 0;
    }
    const overrides = {};
    if (!onlyKeys) {
      this.statuses.clear();
    }
    const effects = onlyKeys ? this.appliedEffects : this.allApplicableEffects();
    const changes = [];
    for (const effect of effects) {
      if (!onlyKeys && !effect.active) {
        continue;
      }
      let filtered = effect.changes;
      if (onlyKeys) {
        filtered = filtered.filter((change) => onlyKeys.includes(change.key));
      } else {
        const derivedData = this._getDerivedDataKeys();
        filtered = filtered.filter(
          (change) => !derivedData.includes(change.key) && change.mode !== CONST.ACTIVE_EFFECT_MODES.CUSTOM
        );
      }
      changes.push(...filtered.map((change) => {
        const c = foundry.utils.deepClone(change);
        c.effect = effect;
        c.priority = c.priority ?? change.mode * 10 + (onlyKeys ? -100 : 0);
        return c;
      }));
      for (const statusId of effect.statuses) {
        this.statuses.add(statusId);
      }
    }
    changes.sort((a, b) => a.priority - b.priority);
    for (const change of changes) {
      if (!change.key) {
        continue;
      }
      const result = change.effect.apply(this, change);
      Object.assign(overrides, result);
    }
    if (onlyKeys) {
      this.overrides = foundry.utils.mergeObject(this.overrides, foundry.utils.expandObject(overrides));
      this._aeCallDepth = Math.max(0, (this._aeCallDepth || 0) - 1);
    } else {
      this.overrides = foundry.utils.expandObject(overrides);
    }
  }
  /**
   * Build a list of system data keys that are considered "derived data" for this actor.
   * These keys are used to determine which properties can be affected by derived or custom active effects.
   * The list includes characteristic modifiers, skill keys, and (for travellers) special system values.
   *
   * @returns {string[]} An array of string keys representing derived data paths for this actor.
   * @private
   */
  _getDerivedDataKeys() {
    const derivedData = [];
    if (["traveller", "robot", "animal"].includes(this.type)) {
      for (const char of Object.keys(this.system.characteristics)) {
        derivedData.push(`system.characteristics.${char}.mod`);
      }
      for (const skill of this.itemTypes.skills) {
        derivedData.push(`system.skills.${simplifySkillName(skill.name)}`);
      }
      if (this.type === "traveller") {
        derivedData.push(
          "system.encumbrance.max",
          "system.encumbrance.value",
          "system.primaryArmor.value",
          "system.secondaryArmor.value",
          "system.radiationProtection.value"
        );
      }
    }
    return [...new Set(derivedData)];
  }
  /**
   * Display changes to health as scrolling combat text.
   * Adapt the font size relative to the Actor's HP total to emphasize more significant blows.
   * @param {number} damageApplied  The change in hit points that was applied
   * @public
   */
  scrollDamage(damageApplied) {
    if (!damageApplied) {
      return;
    }
    const tokens = this.isToken ? [this.token?.object] : this.getActiveTokens(true);
    for (const t of tokens) {
      const pct = Math.clamp(Math.abs(damageApplied) / this.system.hits.max, 0, 1);
      canvas.interface.createScrollingText(t.center, (-damageApplied).signedString(), {
        anchor: CONST.TEXT_ANCHOR_POINTS.TOP,
        fontSize: 22 + 32 * pct,
        // Range between [22, 54]
        fill: -damageApplied < 0 ? 16711680 : 65280,
        stroke: 0,
        strokeThickness: 4,
        jitter: 0.25
      });
    }
  }
  /**
   * Get skills level pairs.
   * @return {any} an object with skill name /level pairs
   * @public
   */
  getSkillNameList() {
    const returnObject = {};
    const skillsArray = sortByItemName(this.itemTypes.skills);
    if (!skillsArray) {
      console.warn("TWODSIX - No skills to list!");
      return returnObject;
    } else {
      if (skillsArray.length > Object.keys(this.system.skills)?.length) {
        ui.notifications.warn("TWODSIX.Warnings.SkillsWithDuplicateNames", { localize: true });
      }
      for (const skill of skillsArray) {
        if (!game.settings.get("twodsix", "hideUntrainedSkills") || (skill.system.value >= 0 || this.system.skills[simplifySkillName(skill.name)] >= 0) || skill.getFlag("twodsix", "untrainedSkill") || skill._id === this.system.untrainedSkill) {
          Object.assign(returnObject, { [skill.uuid]: `${skill.name} (${this.system.skills[simplifySkillName(skill.name)]})` });
        }
      }
    }
    return returnObject;
  }
  /**
   * Generate a unique skill name for actor based on input name by adding numbers to end of string
   * @param {string} skillName   Input Itme Name
   * @returns {string} Unique skill name based on skillName
   * @static
   */
  generateUniqueSkillName(skillName) {
    while (simplifySkillName(skillName + "_") in this.system.skills) {
      const lastChar = skillName.slice(-1);
      if (!isNaN(lastChar)) {
        skillName = skillName.slice(0, -1) + (parseInt(lastChar) + 1).toString();
      } else {
        skillName = skillName + " 2";
      }
    }
    return skillName;
  }
  /**
   * Method stub to execute a ship action as a method from Token Action HUD.
   * @action {object} Ship Action type
   * @extra {object} Object of data defining the ship action
   * @public
   */
  doShipAction(action, extra) {
    if (this.type === "ship") {
      TwodsixShipActions.availableMethods[action.type].action(action.command, extra);
    }
  }
  /**
   * Returns skill with highest value from an actor based on a list of skills
   * @param {string} skillList A string of skills separated by pipe, e.g. "Admin | Combat"
   * @param {boolean} includeChar Whether to include default charactrisic in selection
   * @returns {TwodsixItem|undefined} the skill document selected
   */
  getBestSkill(skillList, includeChar) {
    if (skillList === void 0) {
      return void 0;
    }
    let skill = void 0;
    const skillOptions = skillList.split("|").map((str) => str.trim());
    const skillObjects = this.itemTypes.skills?.filter((itm) => skillOptions.includes(itm.name));
    if (skillObjects?.length > 0) {
      skill = skillObjects.reduce((prev, current) => {
        const prevValue = this.system.skills[simplifySkillName(prev.name)] + (includeChar ? this.getCharMoD(prev.system.characteristic) : 0);
        const currentValue = this.system.skills[simplifySkillName(current.name)] + (includeChar ? this.getCharMoD(current.system.characteristic) : 0);
        return prevValue > currentValue ? prev : current;
      });
    }
    if (!skill) {
      skill = this.itemTypes.skills.find((itm) => itm.name === game.i18n.localize("TWODSIX.Actor.Skills.Untrained"));
    }
    return skill;
  }
  /**
   * Returns characteristic modifier based on the core short label (not the display label)
   * @param {string} charShort A string of the core short characteristic label (uncustomized). This is the static label and not the display label.
   * @returns {number} the characteristic value
   */
  getCharMoD(charShort) {
    if (charShort !== "NONE" && charShort) {
      const key = getKeyByValue(TWODSIX$1.CHARACTERISTICS, charShort);
      return (
        /*ObjectbyString(this.overrides, `system.characteristics.${key}`) ??*/
        this.system.characteristics[key]?.mod ?? 0
      );
    } else {
      return 0;
    }
  }
  /**
   * Removes (damages) psionic characteristic and spreads excess to regular damage
   * @param {number} psiCost The number of psi points to remove
   */
  async removePsiPoints(psiCost) {
    if (psiCost > 0) {
      const netPoints = Math.min(this.system.characteristics.psionicStrength.current, psiCost);
      await this.update({ "system.characteristics.psionicStrength.damage": this.system.characteristics.psionicStrength.damage + netPoints });
      if (netPoints < psiCost) {
        await this.damageActor({ damageValue: psiCost - netPoints, armorPiercingValue: 9999, damageType: "psionic", damageLabel: game.i18n.localize("TWODSIX.DamageType.Psionic"), canBeParried: false }, false);
      }
    }
  }
};
__name$$(_TwodsixActor, "TwodsixActor");
let TwodsixActor = _TwodsixActor;
function getPower(item) {
  if (["operational", "damaged"].includes(item.system.status)) {
    const pf = item.system.powerDraw || 0;
    if (item.system.powerBasis === "perUnit") {
      let quant = item.system.quantity || 1;
      if (item.system.subtype === "armament" && item.system.availableQuantity) {
        quant = parseInt(item.system.availableQuantity);
      }
      return quant * pf;
    } else if (item.system.powerBasis === "perHullTon") {
      return pf * (item.actor?.system.shipStats.mass.max ?? 0);
    } else if (item.system.powerBasis === "perCompTon") {
      return pf * getWeight(item);
    }
  }
  return 0;
}
__name$$(getPower, "getPower");
function getWeight(item) {
  const quant = item.system.quantity ?? 1;
  let wf = 0;
  if (item.system.weightIsPct) {
    wf = (item.system.weight ?? 0) / 100 * (item.actor?.system.shipStats.mass.max ?? 0);
  } else {
    wf = item.system.weight ?? 0;
  }
  return wf * quant;
}
__name$$(getWeight, "getWeight");
async function deleteIdFromShipPositions(actorId) {
  const allShips = game.actors?.contents.filter((actor) => actor.type === "ship") ?? [];
  for (const scene of game.scenes ?? []) {
    for (const token of scene.tokens ?? []) {
      if (token.actor && !token.actorLink && token.actor.type === "ship") {
        allShips.push(token.actor);
      }
    }
  }
  for (const ship of allShips) {
    if (ship.system.shipPositionActorIds[actorId]) {
      await ship.update({ [`system.shipPositionActorIds.-=${actorId}`]: null });
    }
  }
}
__name$$(deleteIdFromShipPositions, "deleteIdFromShipPositions");
function getEquipmentWeight(item) {
  if (!TWODSIX$1.WeightlessItems.includes(item.type)) {
    if (["backpack", "equipped"].includes(item.system.equipped)) {
      let q = item.system.quantity || 0;
      const w = item.system.weight || 0;
      if (item.type === "armor" && item.system.equipped === "equipped") {
        if (item.system.isPowered) {
          q = Math.max(0, q - 1);
        } else {
          q = Math.max(0, q - 1 + Number(game.settings.get("twodsix", "weightModifierForWornArmor")));
        }
      }
      return q * w;
    }
  }
  return 0;
}
__name$$(getEquipmentWeight, "getEquipmentWeight");
async function getMoveNumber(itemData) {
  const returnNumber = await foundry.applications.api.DialogV2.prompt({
    window: {
      title: "TWODSIX.Actor.Items.QuantityToTransfer",
      icon: "fa-solid fa-clipboard-question"
    },
    content: `<div style="display: flex; align-items: center; gap: 2ch; justify-content: center;"><img src="` + itemData.img + `" data-tooltip = "` + itemData.name + `" width="50" height="50"> ` + itemData.name + `</div><div><label for='amount'>` + game.i18n.localize("TWODSIX.Actor.Items.Amount") + `</label><input type="number" name="amount" value="` + itemData.system.quantity + `" max="` + itemData.system.quantity + `" min = "0"></input></div>`,
    ok: {
      icon: "fa-solid fa-arrow-right-arrow-left",
      label: "TWODSIX.Actor.Items.Transfer",
      default: true,
      callback: /* @__PURE__ */ __name$$((event, button) => button.form.elements.amount.valueAsNumber, "callback")
    }
  });
  return parseInt(returnNumber || 0);
}
__name$$(getMoveNumber, "getMoveNumber");
async function correctMissingUntrainedSkill(actor) {
  if (["traveller", "robot", "animal"].includes(actor.type)) {
    const untrainedSkill = actor.getUntrainedSkill();
    if (!untrainedSkill) {
      console.log(`TWODSIX: Fixing missing untrained skill in ${actor.id} (${actor.name}).`);
      const existingSkill = await actor.itemTypes.skills?.find((sk) => sk.name === game.i18n.localize("TWODSIX.Actor.Skills.Untrained") || sk.getFlag("twodsix", "untrainedSkill"));
      if (existingSkill) {
        await actor.update({ "system.untrainedSkill": existingSkill.id });
      } else {
        const untrainedSkillData = actor.createUntrainedSkillData();
        if (untrainedSkillData) {
          await actor.createEmbeddedDocuments("Item", [untrainedSkillData]);
          await actor.update({ "system.untrainedSkill": untrainedSkillData["_id"] });
        }
      }
    } else if (!untrainedSkill.getFlag("twodsix", "untrainedSkill")) {
      console.log(`TWODSIX: Fixing missing untrained flag in ${actor.id} (${actor.name}).`);
      await untrainedSkill.setFlag("twodsix", "untrainedSkill", true);
    }
  }
}
__name$$(correctMissingUntrainedSkill, "correctMissingUntrainedSkill");
function buildUntrainedSkillData() {
  return {
    "name": game.i18n.localize("TWODSIX.Actor.Skills.Untrained"),
    "type": "skills",
    "_id": foundry.utils.randomID(),
    "system": { "characteristic": "NONE" },
    "flags": { "twodsix": { "untrainedSkill": true } },
    "img": "./systems/twodsix/assets/icons/jack-of-all-trades.svg"
  };
}
__name$$(buildUntrainedSkillData, "buildUntrainedSkillData");
function isEncumbranceChange(changed) {
  if (changed.system?.characteristics?.strength) {
    return true;
  } else if (changed.system?.characteristics?.endurance && ["CEATOM", "BARBARIC"].includes(game.settings.get("twodsix", "ruleset"))) {
    return true;
  }
  return false;
}
__name$$(isEncumbranceChange, "isEncumbranceChange");

var __defProp$_ = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __name$_ = (target, value) => __defProp$_(target, "name", { value, configurable: true });
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
var _moveTime, _initialLayer, _events;
const _ItemTemplate = class _ItemTemplate extends foundry.canvas.placeables.MeasuredTemplate {
  constructor() {
    super(...arguments);
    /**
     * Track the timestamp when the last mouse move event was captured.
     * @type {number}
     */
    __privateAdd(this, _moveTime, 0);
    /* -------------------------------------------- */
    /**
     * The initially active CanvasLayer to re-activate after the workflow is complete.
     * @type {CanvasLayer}
     */
    __privateAdd(this, _initialLayer);
    /* -------------------------------------------- */
    /**
     * Track the bound event handlers so they can be properly canceled later.
     * @type {object}
     */
    __privateAdd(this, _events);
  }
  /* -------------------------------------------- */
  /**
   * A factory method to create an AbilityTemplate instance using provided data from an TwodsixItem instance
   * @param {TwodsixItem} item               The Item object for which to construct the template
   * @param {object} [options={}]       Options to modify the created template.
   * @returns {ItemTemplate|null}    The template object, or null if the item does not produce a template
   */
  static fromItem(item, options = {}) {
    const target = item.system.target ?? {};
    const templateShape = TWODSIX$1.areaTargetTypes[target.type]?.template;
    if (!templateShape) {
      return null;
    }
    const templateData = foundry.utils.mergeObject({
      t: templateShape,
      user: game.user?.id,
      distance: target.value,
      direction: 0,
      x: 0,
      y: 0,
      fillColor: game.user?.color,
      flags: { twodsix: { origin: item.uuid } }
    }, options);
    switch (templateShape) {
      case "cone":
        templateData.angle = CONFIG.MeasuredTemplate.defaults.angle;
        break;
      case "rect":
        templateData.distance = Math.hypot(target.value, target.value);
        templateData.width = target.value;
        templateData.direction = 45;
        break;
      case "ray":
        templateData.width = target.width ?? canvas.dimensions?.distance;
        break;
    }
    const cls = CONFIG.MeasuredTemplate.documentClass;
    const template = new cls(foundry.utils.deepClone(templateData), { parent: canvas.scene });
    const object = new this(template);
    object.item = item;
    object.actorSheet = item.actor?.sheet || null;
    return object;
  }
  /* -------------------------------------------- */
  /**
   * Creates a preview of the spell template.
   * @returns {Promise}  A promise that resolves with the final measured template if created.
   */
  drawPreview() {
    const initialLayer = canvas.activeLayer;
    this.draw();
    this.layer.activate();
    this.layer.preview?.addChild(this);
    if (this.actorSheet?.state > 0) {
      this.actorSheet?.minimize();
    }
    return this.activatePreviewListeners(initialLayer);
  }
  /* -------------------------------------------- */
  /**
   * Activate listeners for the template preview
   * @param {CanvasLayer} initialLayer  The initially active CanvasLayer to re-activate after the workflow is complete
   * @returns {Promise}                 A promise that resolves with the final measured template if created.
   */
  activatePreviewListeners(initialLayer) {
    return new Promise((resolve, reject) => {
      __privateSet(this, _initialLayer, initialLayer);
      __privateSet(this, _events, {
        cancel: this._onCancelPlacement.bind(this),
        confirm: this._onConfirmPlacement.bind(this),
        move: this._onMovePlacement.bind(this),
        resolve,
        reject,
        rotate: this._onRotatePlacement.bind(this)
      });
      canvas.stage.on("mousemove", __privateGet(this, _events).move);
      canvas.stage.on("mousedown", __privateGet(this, _events).confirm);
      canvas.app.view.oncontextmenu = __privateGet(this, _events).cancel;
      canvas.app.view.onwheel = __privateGet(this, _events).rotate;
    });
  }
  /* -------------------------------------------- */
  /**
   * Shared code for when template placement ends by being confirmed or canceled.
   * @param {Event} event  Triggering event that ended the placement.
   */
  async _finishPlacement(event) {
    this.layer._onDragLeftCancel(event);
    canvas.stage.off("mousemove", __privateGet(this, _events).move);
    canvas.stage.off("mousedown", __privateGet(this, _events).confirm);
    canvas.app.view.oncontextmenu = null;
    canvas.app.view.onwheel = null;
    __privateGet(this, _initialLayer).activate();
    if (this.actorSheet?.state > 0) {
      await this.actorSheet.maximize();
    }
  }
  /* -------------------------------------------- */
  /**
   * Move the template preview when the mouse moves.
   * @param {Event} event  Triggering mouse event.
   */
  _onMovePlacement(event) {
    event.stopPropagation();
    const now = Date.now();
    if (now - __privateGet(this, _moveTime) <= 20) {
      return;
    }
    const center = event.data.getLocalPosition(this.layer);
    const snapped = this.getSnappedPosition(center);
    this.document.updateSource(snapped);
    this.refresh();
    __privateSet(this, _moveTime, now);
  }
  /* -------------------------------------------- */
  /**
   * Rotate the template preview by 3˚ increments when the mouse wheel is rotated.
   * @param {Event} event  Triggering mouse event.
   */
  _onRotatePlacement(event) {
    if (event.ctrlKey) {
      event.preventDefault();
    }
    event.stopPropagation();
    const delta = canvas.grid.type > CONST.GRID_TYPES.SQUARE ? 30 : 15;
    const snap = event.shiftKey ? delta : 5;
    const update = { direction: this.document.direction + snap * Math.sign(event.deltaY) };
    this.document.updateSource(update);
    this.refresh();
  }
  /* -------------------------------------------- */
  /**
   * Confirm placement when the left mouse button is clicked.
   * @param {Event} event  Triggering mouse event.
   */
  async _onConfirmPlacement(event) {
    await this._finishPlacement(event);
    const destination = this.getSnappedPosition(this.document);
    this.document.updateSource(destination);
    const newTemplates = await canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [this.document.toObject()]);
    __privateGet(this, _events).resolve(newTemplates[0]);
  }
  /* -------------------------------------------- */
  /**
   * Cancel placement when the right mouse button is clicked.
   * @param {Event} event  Triggering mouse event.
   */
  async _onCancelPlacement(event) {
    await this._finishPlacement(event);
    __privateGet(this, _events).reject();
  }
};
_moveTime = new WeakMap();
_initialLayer = new WeakMap();
_events = new WeakMap();
__name$_(_ItemTemplate, "ItemTemplate");
let ItemTemplate = _ItemTemplate;
function checkTokenInTemplate(token, template) {
  const grid = canvas.scene?.grid;
  const { x: tempx, y: tempy } = template;
  const startX = token.document.width >= 1 ? 0.5 : token.document.width / 2;
  const startY = token.document.height >= 1 ? 0.5 : token.document.height / 2;
  for (let x = startX; x < token.document.width; x++) {
    for (let y = startY; y < token.document.width; y++) {
      const curr = { x: token.document.x + x * grid.size - tempx, y: token.document.y + y * grid.size - tempy };
      const contains = template.object.shape?.contains(curr.x, curr.y);
      if (contains) {
        return true;
      }
    }
  }
  return false;
}
__name$_(checkTokenInTemplate, "checkTokenInTemplate");
function targetTokensInTemplate(template) {
  const tokens = canvas.tokens?.placeables;
  template.object._refreshShape();
  const arrayOfTokenIds = [];
  if (tokens?.length > 0) {
    for (const tok of tokens) {
      if (checkTokenInTemplate(tok, template)) {
        arrayOfTokenIds.push(tok.id);
      }
    }
    game.user?._onUpdateTokenTargets(arrayOfTokenIds);
  }
}
__name$_(targetTokensInTemplate, "targetTokensInTemplate");

var __defProp$Z = Object.defineProperty;
var __name$Z = (target, value) => __defProp$Z(target, "name", { value, configurable: true });
const _TwodsixItem = class _TwodsixItem extends Item {
  /**
   * Perform preliminary operations before a Document of this type is created.
   * Pre-creation operations only occur for the client which requested the operation.
   * Modifications to the pending document before it is persisted should be performed with this.updateSource().
   * @param {object} data               The initial data object provided to the document creation request
   * @param {object} options            Additional options which modify the creation request
   * @param {documents.BaseUser} user   The User requesting the document creation
   * @returns {Promise<boolean|void>}   A return value of false indicates the creation operation should be cancelled.
   * @protected
   */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    const updates = {};
    if (this.img === "" || this.img === foundry.documents.BaseItem.DEFAULT_ICON) {
      if (this.type === "weapon") {
        Object.assign(updates, { img: "systems/twodsix/assets/icons/default_weapon.png" });
      } else if (this.type === "spell") {
        const defaultSkill = game.settings.get("twodsix", "sorcerySkill") ?? "";
        Object.assign(updates, {
          img: "systems/twodsix/assets/icons/spell-book.svg",
          "system.associatedSkillName": defaultSkill
        });
      } else if (this.type === "component") {
        Object.assign(updates, { img: "systems/twodsix/assets/icons/components/other.svg" });
      } else if (this.type === "computer") {
        Object.assign(updates, { img: "systems/twodsix/assets/icons/components/computer.svg" });
      } else if (this.type === "psiAbility") {
        Object.assign(updates, { img: "systems/twodsix/assets/icons/extra-lucid.svg" });
      }
    }
    if (this.type === "skills" && game.settings.get("twodsix", "hideUntrainedSkills") && !this.getFlag("twodsix", "untrainedSkill") && this.system.value < 0) {
      Object.assign(updates, { "system.value": 0 });
    }
    if (!["trait", "skills", "ship_position", "component"].includes(this.type)) {
      if (!["spell"].includes(this.type)) {
        if (this.system.consumables?.length > 0) {
          Object.assign(updates, { "system.consumables": [] });
        }
        Object.assign(updates, { "system.useConsumableForAttack": "" });
      }
      if (this.actor) {
        if (this.system.associatedSkillName === "") {
          Object.assign(updates, { "system.skill": this.actor.system.untrainedSkill });
        } else {
          const tempSkill = this.actor.getBestSkill(this.system.associatedSkillName, false);
          Object.assign(updates, { "system.skill": tempSkill?.id ?? this.actor.system.untrainedSkill });
        }
      }
    }
    if (this.type === "weapon" && !Object.keys(data.system ?? {}).includes("damage")) {
      Object.assign(updates, { "system.damage": game.settings.get("twodsix", "defaultWeaponDamage") });
    }
    Object.assign(updates, { "system.type": this.type });
    await this.updateSource(updates);
  }
  /**
   * Perform follow-up operations after a Document of this type is updated.
   * Post-update operations occur for all clients after the update is broadcast.
   * @param {object} changed            The differential data that was changed relative to the documents prior values
   * @param {object} options            Additional options which modify the update request
   * @param {string} userId             The id of the User requesting the document update
   * @see {Document#_onUpdate}
   * @protected
   */
  async _onUpdate(changed, options, userId) {
    await super._onUpdate(changed, options, userId);
    if (game.user?.id === userId) {
      const owningActor = this.actor;
      if (game.settings.get("twodsix", "useEncumbranceStatusIndicators") && owningActor?.type === "traveller" && !options.dontSync) {
        if (!TWODSIX$1.WeightlessItems.includes(this.type) && changed.system) {
          if (Object.hasOwn(changed.system, "weight") || Object.hasOwn(changed.system, "quantity") || Object.hasOwn(changed.system, "equipped") && this.system.weight > 0) {
            await applyEncumberedEffect(owningActor);
          }
        }
      }
      if (game.settings.get("twodsix", "useWoundedStatusIndicators") && owningActor) {
        if (checkForDamageStat(changed, owningActor.type) && ["traveller", "animal", "robot"].includes(owningActor.type)) {
          await applyWoundedEffect(owningActor);
        }
      }
    }
    if (game.settings.get("twodsix", "showTLonItemsTab")) {
      if ([...TWODSIX$1.WeightlessItems, "ship_position"].includes(this.type)) {
        return;
      } else if (this.isEmbedded || this.inCompendium) {
        return;
      } else if (changed.system?.techLevel) {
        ui.items.render();
      }
    }
  }
  static async create(data, options) {
    const item = await super.create(data, options);
    return item;
  }
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();
    if (this.getFlag("twodsix", "untrainedSkill")) {
      this.name = game.i18n.localize("TWODSIX.Actor.Skills.Untrained");
    }
  }
  /**
   * Augment the basic item data with additional dynamic data.
   */
  prepareDerivedData() {
    super.prepareDerivedData();
    this.system.canProcess = this.type === "consumable" && ["processor", "suite"].includes(this.system.subtype);
    if (![...TWODSIX$1.WeightlessItems, "ship_position"].includes(this.type)) {
      this.prepareConsumableData();
    }
  }
  sortByName(a, b) {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  }
  /**
   * Prepares consumable and attachment item data linked to gear items.
   *
   * This method processes the consumables array associated with an item,
   * retrieving the actual item instances from the parent actor and separating
   * them into consumables and attachments based on their isAttachment flag.
   * Both arrays are sorted alphabetically by name.
   *
   * @function prepareConsumableData
   * @memberof TwodsixItem
   * @returns {void}
   */
  prepareConsumableData() {
    const gear = this.system;
    if (gear.consumables?.length > 0 && this.actor) {
      const allConsumables = gear.consumables.map((id) => this.actor.items.get(id)).filter((item) => item != null);
      gear.consumableData = allConsumables.filter((item) => !item?.system.isAttachment) ?? [];
      if (gear.consumableData.length > 0) {
        gear.consumableData.sort(this.sortByName);
      }
      gear.attachmentData = allConsumables.filter((item) => item?.system.isAttachment) ?? [];
      if (gear.attachmentData.length > 0) {
        gear.attachmentData.sort(this.sortByName);
      }
    } else {
      gear.consumableData = [];
      gear.attachmentData = [];
    }
  }
  async addConsumable(consumableId, gear = this.system) {
    if (gear.consumables != void 0) {
      if (gear.consumables.includes(consumableId)) {
        console.log(`Twodsix | Consumable already exists for item ${this.id}`);
      } else {
        await this.update({ "system.consumables": gear.consumables.concat(consumableId) }, {});
      }
    } else {
      ui.notifications.error(`Twodsix | Consumable can't be added to item ${this.id}`);
    }
  }
  async removeConsumable(consumableId, gear = this.system) {
    const updatedConsumables = gear.consumables.filter((cId) => {
      return cId !== consumableId && cId !== null && this.actor?.items.get(cId) !== void 0;
    });
    const updateData = { "system.consumables": updatedConsumables };
    if (gear.useConsumableForAttack === consumableId) {
      updateData["system.useConsumableForAttack"] = "";
    }
    await this.update(updateData, {});
  }
  //////// WEAPON ////////
  /**
   * Perform a weapon attack.
   * @param attackType {string} Type of autofire attack (e.g. 'single', 'auto-full', 'auto-burst')
   * @param showThrowDialog {boolean} Whether to show roll/through dialog
   * @param rateOfFireCE {number} Fire rate / consumables used
   * @param showInChat Whehter to show attack in chat
   */
  async performAttack(attackType, showThrowDialog, rateOfFireCE, showInChat = true, overrideSettings) {
    if (this.type !== "weapon") {
      return;
    }
    const weapon = this.system;
    let skill = void 0;
    if (weapon.skill || overrideSettings?.skillName) {
      if (overrideSettings?.skillName && overrideSettings?.skillName !== "---") {
        skill = this.actor?.items.getName(overrideSettings?.skillName);
      } else {
        skill = this.actor?.items.get(weapon.skill);
      }
      skill ?? (skill = game.settings.get("twodsix", "hideUntrainedSkills") ? this.actor?.getUntrainedSkill() : void 0);
    }
    if (!skill) {
      ui.notifications.error("TWODSIX.Errors.NoSkillForSkillRoll", { localize: true });
      return;
    }
    const tmpSettings = this.initializeAttackSettings();
    if (overrideSettings) {
      foundry.utils.mergeObject(tmpSettings, overrideSettings);
    }
    if (!overrideSettings?.rollModifiers?.characteristic || overrideSettings?.skillName === "---" && overrideSettings?.rollModifiers?.characteristic === "NONE") {
      tmpSettings.rollModifiers.characteristic = skill.system.characteristic || "NONE";
    }
    tmpSettings.rollType = overrideSettings?.rollType || skill.system.rolltype || "Normal";
    const isAOE = await this.drawItemTemplate();
    const { weaponType, isAutoFull, usedAmmo, numberOfAttacks } = this.getFireModeParams(rateOfFireCE, attackType, tmpSettings, isAOE);
    const useCTBands = game.settings.get("twodsix", "rangeModifierType") === "CT_Bands";
    const targetTokens = Array.from(game.user.targets);
    const controlledTokens = this.actor?.getActiveTokens();
    if (targetTokens.length === 0 && useCTBands) {
      Object.assign(tmpSettings.rollModifiers, { armorModifier: 0, armorLabel: game.i18n.localize("TWODSIX.Ship.Unknown") });
    } else if (targetTokens.length === 1) {
      const dodgeParryInfo = this.getDodgeParryValues(targetTokens[0], isAOE);
      Object.assign(tmpSettings.rollModifiers, dodgeParryInfo);
      if (useCTBands) {
        const weaponArmorInfo = this.getWeaponArmorValues(targetTokens[0], weaponType, isAutoFull);
        Object.assign(tmpSettings.rollModifiers, weaponArmorInfo);
      }
    }
    if (this.system.handlingModifiers !== "") {
      Object.assign(tmpSettings.rollModifiers, { weaponsHandling: this.getWeaponsHandlingMod(rateOfFireCE) });
    }
    if (controlledTokens?.length === 1) {
      const { rangeModifier, rangeLabel } = this.calculateRangeAndLabel(controlledTokens, targetTokens, weaponType, isAutoFull, tmpSettings);
      Object.assign(tmpSettings.rollModifiers, {
        weaponsRange: rangeModifier,
        rangeLabel
      });
    }
    const appliedStatuses = targetTokens.length === 1 ? getTargetStatusModifiers(targetTokens[0].actor) : [];
    Object.assign(tmpSettings.rollModifiers, {
      targetModifier: appliedStatuses
    });
    Object.assign(tmpSettings.rollModifiers, { targetModifierOverride: targetTokens.length > 1 });
    const settings = await TwodsixRollSettings.create(showThrowDialog, tmpSettings, skill, this, this.actor);
    if (!settings.shouldRoll) {
      return;
    }
    if (!await this.consumeAmmo(this, usedAmmo)) {
      return;
    }
    if (targetTokens.length > numberOfAttacks && !isAOE) {
      ui.notifications.warn("TWODSIX.Warnings.TooManyTargets", { localize: true });
    }
    await this.executeAttackRolls(numberOfAttacks, targetTokens, controlledTokens, weaponType, isAutoFull, settings, showInChat, isAOE, attackType);
  }
  /**
   * Initializes the default settings for an attack roll.
   * @returns {object} The default attack roll settings.
   */
  initializeAttackSettings() {
    return {
      rollType: "Normal",
      bonusDamage: "0",
      rollModifiers: {
        characteristic: "NONE",
        other: 0
      }
    };
  }
  /**
   * Consumes ammunition for a weapon attack.
   * @param {TwodsixItem} itemUsed The item being used system data.
   * @param {number} usedAmmo The amount of ammunition to consume.
   * @returns {Promise<boolean>} Whether the ammunition was successfully consumed.
   */
  async consumeAmmo(itemUsed, usedAmmo) {
    const magazine = itemUsed.system.useConsumableForAttack ? this.actor?.items.get(itemUsed.system.useConsumableForAttack) : void 0;
    if (magazine) {
      try {
        await magazine.consume(usedAmmo);
      } catch (err) {
        if (err.name === "NoAmmoError") {
          if (this.type === "weapon") {
            ui.notifications.error("TWODSIX.Errors.NoAmmo", { localize: true });
          } else {
            ui.notifications.error("TWODSIX.Errors.EmptyConsumable", { localize: true });
          }
        } else {
          console.error(`Error consuming ammo for weapon ${this.name}:`, err);
          throw err;
        }
        return false;
      }
    }
    return true;
  }
  /**
   * Executes multiple attack rolls for a weapon attack, applying modifiers and handling damage for each roll.
   * @param {number} numberOfAttacks - The number of attack rolls to execute.
   * @param {Token[]} targetedTokens - The tokens targeted by the attack.
   * @param {Token[]} controlledTokens - The tokens controlled by the actor performing the attack.
   * @param {string} weaponType - The type of weapon being used (e.g., rifle, pistol).
   * @param {boolean} isAutoFull - Whether the attack is a full-auto attack.
   * @param {TwodsixRollSettings} settings - The settings used for the attack roll.
   * @param {boolean} showInChat - Whether to display the attack roll results in the chat.
   * @param {boolean} isAOE - Whether the attack is an area-of-effect attack.
   * @returns {Promise<void>} A promise that resolves when all attack rolls and damage handling are complete.
   */
  async executeAttackRolls(numberOfAttacks, targetedTokens, controlledTokens, weaponType, isAutoFull, settings, showInChat, isAOE, attackType) {
    const targetModifiers = [...settings.rollModifiers.targetModifier];
    Object.assign(settings.flags, { attackType: attackType ?? "" });
    for (let i = 0; i < numberOfAttacks; i++) {
      const targetToken = targetedTokens[i % targetedTokens.length];
      if (targetedTokens.length > 1) {
        this.updateRollModifiers(settings, targetToken, controlledTokens, weaponType, isAutoFull, isAOE, targetModifiers);
      }
      const roll = await this.skillRoll(false, settings, showInChat);
      if (game.settings.get("twodsix", "automateDamageRollOnHit") && roll?.isSuccess()) {
        await this.handleDamageRoll(roll, settings, targetedTokens, i, isAOE, showInChat);
      }
    }
  }
  /**
   * Updates the roll modifiers for a weapon attack based on various factors such as dodge/parry, armor, range, and target statuses.
   * @param {TwodsixRollSettings} settings - The settings used for the attack roll.
   * @param {Token} targetToken - The token representing the target of the attack.
   * @param {Token[]} controlledTokens - The tokens controlled by the actor performing the attack.
   * @param {string} weaponType - The type of weapon being used (e.g., rifle, pistol).
   * @param {boolean} isAutoFull - Whether the attack is a full-auto attack.
   * @param {boolean} isAOE - Whether the attack is an area-of-effect attack.
   * @param {any[]} targetModifiers - A list of target-specific modifiers to apply.
   */
  updateRollModifiers(settings, targetToken, controlledTokens, weaponType, isAutoFull, isAOE, targetModifiers) {
    const dodgeParryInfo = this.getDodgeParryValues(targetToken, isAOE);
    Object.assign(settings.rollModifiers, dodgeParryInfo);
    if (game.settings.get("twodsix", "rangeModifierType") === "CT_Bands") {
      const weaponArmorInfo = this.getWeaponArmorValues(targetToken, weaponType, isAutoFull);
      Object.assign(settings.rollModifiers, weaponArmorInfo);
    }
    if (controlledTokens.length === 1 && targetToken) {
      const targetRange = canvas.grid.measurePath([controlledTokens[0], targetToken]).distance;
      const rangeData = this.getRangeModifier(targetRange, weaponType, isAutoFull);
      Object.assign(settings.rollModifiers, { weaponsRange: rangeData.rangeModifier });
      Object.assign(settings, { rollType: rangeData.rollType });
    }
    if (targetModifiers.length > 0) {
      Object.assign(settings.rollModifiers, { targetModifier: targetModifiers });
    } else {
      Object.assign(settings.rollModifiers, { targetModifier: getTargetStatusModifiers(targetToken.actor) });
    }
  }
  getAppliedStatuses(targetTokens) {
    if (targetTokens.length === 1) {
      return getTargetStatusModifiers(targetTokens[0].actor);
    }
    return [];
  }
  /**
   * Handles the damage roll for a successful attack.
   * @param {TwodsixDiceRoll} roll The result of the attack roll.
   * @param {TwodsixRollSettings} settings The settings used for the attack roll.
   * @param {Token[]} targetTokens The list of target tokens.
   * @param {number} attackIndex The index of the current attack in a multi-attack sequence.
   * @param {boolean} isAOE Whether the attack is an area-of-effect attack.
   * @param {boolean} showInChat Whehter to show attack in chat
   * @returns {Promise<void>}
   */
  async handleDamageRoll(roll, settings, targetTokens, attackIndex, isAOE, showInChat) {
    const addEffect = game.settings.get("twodsix", "addEffectToDamage");
    let totalBonusDamage = addEffect ? `${roll.effect}` : ``;
    if (settings.bonusDamage !== "0" && settings.bonusDamage !== "") {
      totalBonusDamage += (addEffect ? ` + ` : ``) + `${settings.bonusDamage}`;
    }
    const damagePayload = await this.rollDamage(settings.rollMode, totalBonusDamage, showInChat, false, roll.effect) || null;
    if (targetTokens.length >= 1 && damagePayload) {
      if (isAOE) {
        for (const target of targetTokens) {
          target.actor.handleDamageData(damagePayload, !game.settings.get("twodsix", "autoDamageTarget"));
        }
      } else {
        targetTokens[attackIndex % targetTokens.length].actor.handleDamageData(damagePayload, !game.settings.get("twodsix", "autoDamageTarget"));
      }
    }
  }
  /**
   * A method to get the weapon fire mode parameters.
   * @param {number} rateOfFireCE  The rate of fire used
   * @param {string} attackType The type of attack (e.g. burst, double-tap, etc.)
   * @param {object} tmpSettings the temporary settings object for the roll
   * @returns {object} { weaponType, isAutoFull, usedAmmo, numberOfAttacks }
   */
  getFireModeParams(rateOfFireCE, attackType, tmpSettings, isAOE) {
    const ruleSet = game.settings.get("twodsix", "ruleset");
    const weapon = this.system;
    let numberOfAttacks = 1;
    let bonusDamage = "0";
    let isAutoFull = false;
    let skillLevelMax = void 0;
    const rof = parseInt(weapon.rateOfFire, 10);
    const rateOfFire = rateOfFireCE ?? (!isNaN(rof) ? rof : 1);
    if (attackType !== "single" && !rateOfFire) {
      ui.notifications.error("TWODSIX.Errors.NoROFForAttack", { localize: true });
    }
    let usedAmmo = rateOfFire;
    let weaponTypeOverride = "";
    const autoFireRules = game.settings.get("twodsix", "autofireRulesUsed");
    switch (attackType) {
      case "single":
        if (game.settings.get("twodsix", "rangeModifierType") === "CT_Bands") {
          if (weapon.rangeBand === "autoRifle") {
            weaponTypeOverride = "rifle";
          } else if (weapon.rangeBand === "submachinegun") {
            weaponTypeOverride = "autoPistol";
          }
        }
        break;
      case "auto-full":
        numberOfAttacks = isAOE ? 1 : getNumberOfAttacks(autoFireRules, rateOfFire);
        if (autoFireRules === "CEL") {
          usedAmmo = 3 * rateOfFire;
        }
        skillLevelMax = ruleSet === "CDEE" ? 1 : void 0;
        isAutoFull = true;
        break;
      case "auto-burst":
        if (autoFireRules !== "CT") {
          bonusDamage = ruleSet === "CDEE" ? `${rateOfFire}d6kh` : rateOfFire.toString();
        }
        break;
      case "burst-attack-dm":
        Object.assign(tmpSettings.rollModifiers, { rof: _TwodsixItem.burstAttackDM(rateOfFire) });
        break;
      case "burst-bonus-damage":
        bonusDamage = _TwodsixItem.burstBonusDamage(rateOfFire);
        break;
      case "double-tap":
        if (["CD", "CLU"].includes(ruleSet)) {
          bonusDamage = "1d6";
        } else if (["AC", "CEL"].includes(ruleSet)) {
          bonusDamage = "1";
        } else {
          Object.assign(tmpSettings.rollModifiers, { rof: 1 });
        }
        usedAmmo = 2;
        break;
    }
    Object.assign(tmpSettings, { bonusDamage });
    Object.assign(tmpSettings.rollModifiers, { skillLevelMax });
    const weaponType = weaponTypeOverride || weapon.rangeBand;
    return { weaponType, isAutoFull, usedAmmo, numberOfAttacks };
  }
  /**
   * A method to get the weapons range modifer based on the weapon type and measured range (distance).
   * Valid for Classic Traveller, Cepheus Engine, and Cepheus Universal band types as well as other rule sets with range values.
   * @param {number} range  The measured distance to the target
   * @param {string} weaponBand The type of weapon used - as key string
   * @param {boolean} isAutoFull - Whether the attack is a full-auto attack.
   * @returns {object} {rangeModifier: rangeModifier, rollType: rollType}
   */
  getRangeModifier(range, weaponBand, isAutoFull) {
    let rangeModifier = 0;
    let rollType = "Normal";
    const rangeModifierType = game.settings.get("twodsix", "rangeModifierType");
    const ammoModifier = this.getAmmoRangeModifier(rangeModifierType);
    if (typeof this.system.range !== "string") {
      if (typeof this.system.range === "number" && !["CE_Bands", "CT_Bands", "CU_Bands"].includes(rangeModifierType)) {
        console.warn("Bad weapon system.range value - should be string");
      } else {
        console.warn("Invalid weapon system.range value:", this.system.range);
      }
      return { rangeModifier: 0, rollType: "Normal" };
    }
    const rangeValues = this.system.range?.split("/", 2).map((s) => parseFloat(s));
    if (rangeModifierType === "none") ; else if (["CE_Bands", "CT_Bands", "CU_Bands"].includes(rangeModifierType)) {
      const targetBand = getRangeBand(range);
      if (targetBand !== "unknown") {
        rangeModifier = this.getRangeBandModifier(weaponBand, targetBand, isAutoFull, range);
      }
    } else if (this.isMeleeWeapon()) {
      if (range > game.settings.get("twodsix", "meleeRange")) {
        rangeModifier = INFEASIBLE;
      }
    } else if (isNaN(rangeValues[0])) ; else if (range <= game.settings.get("twodsix", "meleeRange")) {
      if (range > (rangeModifierType === "singleBand" ? rangeValues[0] : rangeValues[1] ?? rangeValues[0])) {
        rangeModifier = INFEASIBLE;
      } else if (game.settings.get("twodsix", "termForAdvantage").toLowerCase() === this.system.meleeRangeModifier.toLowerCase()) {
        rollType = "Advantage";
      } else if (game.settings.get("twodsix", "termForDisadvantage").toLowerCase() === this.system.meleeRangeModifier.toLowerCase()) {
        rollType = "Disadvantage";
      } else {
        rangeModifier = parseInt(this.system.meleeRangeModifier) || 0;
      }
    } else if (rangeModifierType === "singleBand") {
      if (range <= rangeValues[0] * 0.25 * ammoModifier) {
        rangeModifier = 1;
      } else if (range <= rangeValues[0] * ammoModifier) ; else if (range <= rangeValues[0] * 2 * ammoModifier) {
        rangeModifier = -2;
      } else if (range <= rangeValues[0] * 4 * ammoModifier) {
        rangeModifier = -4;
      } else {
        rangeModifier = INFEASIBLE;
      }
    } else if (rangeModifierType === "doubleBand") {
      if (rangeValues[0] > rangeValues[1]) ; else if (range <= rangeValues[0] * ammoModifier) ; else if (range <= rangeValues[1] * ammoModifier) {
        rangeModifier = -2;
      } else {
        rangeModifier = INFEASIBLE;
      }
    }
    return { rangeModifier, rollType };
  }
  /**
   * A method to return ammo range modifier.
   * @param {string} rangeModifierType  The type of range modifier (setting)
   * @returns {number} range modifier DM
   */
  getAmmoRangeModifier(rangeModifierType) {
    let returnValue = 1;
    if (["singleBand", "doubleBand"].includes(rangeModifierType) && this.system.useConsumableForAttack) {
      const magazine = this.actor?.items.get(this.system.useConsumableForAttack);
      if (magazine?.system.ammoRangeModifier !== "" && magazine?.system.ammoRangeModifier !== "0") {
        const modifierVal = parseFloat(magazine.system.ammoRangeModifier);
        if (!isNaN(modifierVal)) {
          returnValue = 1 + modifierVal / 100;
        }
      }
    }
    return returnValue;
  }
  /**
   * A method to get the dodge / parry modifer based on the target's corresponding skill used for attack.
   * @param {Token} target  The target token
   * @param {boolean} isAOE Is an area-of-effect attack (cannot be dodged)
   * @returns {object} {dodgeParry: dodgeParryModifier, dodgeParryLabel: skillName}
   */
  getDodgeParryValues(target, isAOE) {
    let dodgeParryModifier = 0;
    let skillName = "";
    if (game.settings.get("twodsix", "useDodgeParry") && target && !isAOE) {
      const weaponSkill = this.actor?.items.get(this.system.skill);
      skillName = weaponSkill?.getFlag("twodsix", "untrainedSkill") ? this.system.associatedSkillName : weaponSkill?.name;
      const targetMatchingSkill = target.actor?.itemTypes.skills?.find((sk) => sk.name === skillName);
      dodgeParryModifier = -targetMatchingSkill?.system.value || 0;
    }
    return { dodgeParry: dodgeParryModifier, dodgeParryLabel: skillName };
  }
  /**
   * A method to determine whether weapon is a melee weapon.
   * @returns {boolean} Whether item is a melee weapon
   */
  isMeleeWeapon() {
    if (this.type !== "weapon") {
      return false;
    } else if (this.system.weaponType.toLowerCase() === "melee" || this.system.range.toLowerCase() === "melee") {
      return true;
    } else {
      const rangeModifierType = game.settings.get("twodsix", "rangeModifierType");
      switch (rangeModifierType) {
        case "none":
          return false;
        case "CE_Bands":
          return ["closeQuarters", "extendedReach"].includes(this.system.rangeBand);
        case "CU_Bands":
          return ["close", "personal"].includes(this.system.rangeBand);
        case "CT_Bands":
          return !["bodyPistol", "autoPistol", "revolver", "carbine", "rifle", "autoRifle", "shotgun", "submachinegun", "laserCarbine", "laserRifle", "custom", "none"].includes(this.system.rangeBand);
        case "singleBand":
        case "doubleBand":
          if (parseInt(this.system.range) === 0 || this.system.range === "") {
            return false;
          } else {
            const rangeValues = this.system.range.split("/", 2).map((s) => parseFloat(s));
            const upperValue = rangeModifierType === "singleBand" ? rangeValues[0] : rangeValues[1] ?? rangeValues[0];
            return upperValue > 0 && upperValue <= game.settings.get("twodsix", "meleeRange");
          }
        default:
          return false;
      }
    }
  }
  /**
   * A method to parse and return the weapon's handling modifier based on attacker's characteristics.
   * @param {number} rateOfFire The weapon rate of fire (needed for CU)
   * @returns {number} The DM for the actor firing the weapon used
   */
  getWeaponsHandlingMod(rateOfFire) {
    let rofOffset = 0;
    if (game.settings.get("twodsix", "ruleset") === "CU") {
      if (rateOfFire === 4) {
        rofOffset = 1;
      } else if (rateOfFire >= 10) {
        rofOffset = 2;
      }
    }
    let weaponHandlingMod = 0;
    const re = new RegExp(/^(\w+)\s+([0-9]+)-?\/(.+)\s+([0-9]+)\+?\/(.+)/gm);
    const parsedResult = re.exec(this.system.handlingModifiers);
    if (parsedResult) {
      const checkCharacteristic = getCharacteristicFromDisplayLabel(parsedResult[1], this.actor);
      if (checkCharacteristic) {
        const charValue = game.settings.get("twodsix", "ruleset") === "CU" ? this.actor.system.characteristics[checkCharacteristic].current : this.actor.system.characteristics[checkCharacteristic].value;
        if (charValue <= parseInt(parsedResult[2], 10) + rofOffset) {
          weaponHandlingMod = getValueFromRollFormula(parsedResult[3], this);
        } else if (charValue >= parseInt(parsedResult[4], 10) + rofOffset) {
          weaponHandlingMod = getValueFromRollFormula(parsedResult[5], this);
        }
      }
    }
    return weaponHandlingMod;
  }
  /**
   * Perform a skill roll / check based on input settings.
   * @param {boolean} showThrowDialog  Whether to show roll/through dialog
   * @param {TwodsixRollSettings|undefined} tmpSettings Roll settings to use
   * @param {boolean} showInChat Whether to show attack in chat
   * @returns {TwodsixDiceRoll | void} Results of dice roll, if made
   */
  async skillRoll(showThrowDialog, tmpSettings, showInChat = true) {
    let skill = null;
    let item;
    let workingActor = this.actor;
    const usesConsumable = this.system;
    if (this.type == "skills") {
      skill = this;
      item = void 0;
    } else if (this.type === "spell") {
      const skillList = `${game.settings.get("twodsix", "sorcerySkill")}|` + this.system?.associatedSkillName;
      skill = workingActor.getBestSkill(skillList, false);
      item = this;
    } else if (this.type === "component") {
      workingActor = await fromUuid(tmpSettings?.flags.actorUUID);
      skill = workingActor?.items.getName(tmpSettings?.skillName);
      item = this;
    } else if (usesConsumable.skill) {
      skill = this.actor?.items.get(usesConsumable.skill);
      item = this;
    }
    if (!skill) {
      skill = workingActor?.getUntrainedSkill();
      if (!skill) {
        ui.notifications.error("TWODSIX.Errors.NoSkillForSkillRoll", { localize: true });
        return;
      }
    }
    if (!tmpSettings) {
      const workingSettings = {};
      if (this.type === "spell") {
        Object.assign(workingSettings, { difficulties: {} });
        for (let i = 1; i <= game.settings.get("twodsix", "maxSpellLevel"); i++) {
          const levelKey = game.i18n.localize("TWODSIX.Items.Spells.Level") + " " + i;
          Object.assign(workingSettings.difficulties, { [levelKey]: { mod: -i, target: i + 6 } });
        }
        const level = game.i18n.localize("TWODSIX.Items.Spells.Level") + " " + (this.system.value > Object.keys(workingSettings.difficulties).length ? Object.keys(workingSettings.difficulties).length : this.system.value);
        Object.assign(workingSettings, { difficulty: workingSettings.difficulties[level] });
        await this.drawItemTemplate();
      } else if (this.type === "psiAbility") {
        if (this.system.difficulty) {
          Object.assign(workingSettings, { difficulty: TWODSIX$1.DIFFICULTIES[game.settings.get("twodsix", "difficultyListUsed")][this.system.difficulty] });
        }
      }
      tmpSettings = await TwodsixRollSettings.create(showThrowDialog, workingSettings, skill, item, workingActor);
      if (!tmpSettings.shouldRoll) {
        return;
      }
    }
    if (usesConsumable.useConsumableForAttack && item?.type != "weapon") {
      if (!await this.consumeAmmo(item, 1)) {
        return;
      }
    }
    const diceRoll = new TwodsixDiceRoll(tmpSettings, workingActor, skill, item);
    await diceRoll.evaluateRoll();
    if (showInChat) {
      await diceRoll.sendToChat(tmpSettings.difficulties);
    }
    return diceRoll;
  }
  /**
   * Dialog to determine number of psi points used for action. Returns either a number or undefined (canceled points)
   * @param {number} diceRollEffect Results effect of psionic skill check
   * @returns {number|undefined} The number of psi points used or undefined if selection cancelled
   */
  async processPsiPoints(diceRollEffect) {
    let psiCost;
    if (diceRollEffect < 0) {
      psiCost = Math.min(1, this.system.psiCost);
    } else {
      try {
        psiCost = await foundry.applications.api.DialogV2.prompt({
          window: { title: "TWODSIX.Items.Psionics.PsiCost" },
          content: `<input name="psiCost" value="${this.system.psiCost}" type="number" min="1" max="10" step="1" autofocus>`,
          ok: {
            label: "TWODSIX.Items.Psionics.UsePoints",
            callback: /* @__PURE__ */ __name$Z((event, button) => Math.round(button.form.elements.psiCost.valueAsNumber), "callback")
          }
        });
      } catch {
        console.log("No psionic points selected");
        return;
      }
      if (isNaN(psiCost) || psiCost <= 0) {
        ui.notifications.warn("TWODSIX.Warnings.PsiUsageGTZero", { localize: true });
        return;
      }
    }
    await this.actor.removePsiPoints(psiCost);
    return psiCost;
  }
  /**
   * Send item description to chat.
   */
  sendDescriptionToChat() {
    const picture = this.img;
    const capType = game.i18n.localize(`TYPES.Item.${this.type}`).capitalize();
    let msg = `<div style="display: inline-flex;"><img src="${picture}" alt="" class="chat-image"></img><span style="align-self: center; text-align: center; padding-left: 1ch;"><strong>${capType}: ${this.name}</strong></span></div><div>${this.system["description"]}</div>`;
    if (this.system.features) {
      msg += `<div>${game.i18n.localize("TWODSIX.Items.Component.Features")}: ${this.system.features}</div>`;
    }
    ChatMessage.create({ content: msg, speaker: ChatMessage.getSpeaker({ actor: this.actor }) });
  }
  /**
   * Send message to chat when using a psionic action.
   * @param {number} pointsUsed The number of psi points used for action
   * @param {DICE_ROLL_MODES} rollMode The roll mode used, if any
   * @param {number} rollEffect the effect of the skill roll,used for damage calcs if necessary
   * @private
   */
  async sendPsiUseToChat(pointsUsed, rollMode, rollEffect = 0) {
    const picture = this.img;
    const capType = game.i18n.localize(`TYPES.Item.${this.type}`).capitalize();
    let msg = `<div style="display: inline-flex;"><img src="${picture}" alt="" class="chat-image"></img><span style="padding-left: 1ch;">${game.i18n.localize("TWODSIX.Items.Psionics.Used")} ${capType}: ${this.name}, ${pointsUsed} ${game.i18n.localize("TWODSIX.Items.Psionics.Pts")}</span></div>`;
    if (!game.settings.get("twodsix", "automateDamageRollOnHit") && this.system.damage !== "" && this.system.damage !== "0" && pointsUsed > 0 && rollEffect >= 0) {
      msg += `<section class="card-buttons"><button type="button" data-action="damage" data-tooltip="${game.i18n.localize("TWODSIX.Rolls.RollDamage")}"><i class="fa-solid fa-person-burst" style="margin-left: 3px;"></i></button></section>`;
    }
    const flags = {
      "core.canPopout": true,
      "twodsix.itemUUID": this.uuid ?? "",
      "twodsix.tokenUUID": this.actor?.token?.uuid ?? "",
      "twodsix.actorUUID": this.actor?.uuid ?? "",
      "twodsix.bonusDamage": "",
      "twodsix.effect": rollEffect
    };
    const messageContent = {
      content: msg,
      flags,
      speaker: ChatMessage.getSpeaker({ actor: this.actor })
    };
    if (rollMode !== "publicroll") {
      const showToUsers = game.users.filter((user) => user.isGM || game.userId === user.id);
      Object.assign(messageContent, { whisper: showToUsers });
    }
    await ChatMessage.create(messageContent);
  }
  /**
   * Handle skill and talent rolls.
   * @param {boolean} showTrowDiag  Whether to show the throw dialog or not
   * @private
   */
  async doSkillTalentRoll(showThrowDiag, tmpSettings) {
    if (this.type === "psiAbility") {
      if (["core", "alternate"].includes(game.settings.get("twodsix", "showAlternativeCharacteristics"))) {
        ui.notifications.warn("TWODSIX.Warnings.NotUsingPsiStrength", { localize: true });
      } else {
        this.doPsiAction(showThrowDiag);
      }
    } else {
      await this.skillRoll(showThrowDiag, tmpSettings);
    }
  }
  /**
   * Handle psionic ability / talent.
   * @param {boolean} showTrowDiag  Whether to show the throw dialog or not
   * @private
   */
  async doPsiAction(showThrowDiag) {
    let psiCost;
    let rollEffect = 0;
    let rollMode = "gmroll";
    if (this.actor.system.characteristics.psionicStrength.current <= 0) {
      ui.notifications.warn("TWODSIX.Warnings.NoPsiPoints", { localize: true });
    } else {
      await this.drawItemTemplate();
      if (!game.settings.get("twodsix", "psiTalentsRequireRoll")) {
        psiCost = await this.processPsiPoints(0);
      } else {
        const diceRoll = await this.skillRoll(showThrowDiag);
        if (diceRoll) {
          rollMode = diceRoll.rollSettings.rollMode;
          rollEffect = diceRoll.effect;
          psiCost = await this.processPsiPoints(rollEffect);
        } else {
          return;
        }
      }
      if (psiCost !== void 0) {
        await this.sendPsiUseToChat(psiCost, rollMode, rollEffect);
        if (this.system.damage !== "" && this.system.damage !== "0" && game.settings.get("twodsix", "automateDamageRollOnHit") && rollEffect >= 0) {
          const bonusDamage = game.settings.get("twodsix", "addEffectToDamage") && rollEffect !== 0 ? ` ${rollEffect}` : ``;
          const damagePayload = await this.rollDamage(rollMode || game.settings.get("core", "rollMode"), bonusDamage, true, showThrowDiag, rollEffect);
          if (damagePayload?.damageValue > 0) {
            const targetTokens = Array.from(game.user.targets);
            if (targetTokens.length > 0) {
              await targetTokens[0].actor.handleDamageData(damagePayload, !game.settings.get("twodsix", "autoDamageTarget"));
            }
          }
        }
      }
    }
  }
  async rollDamage(rollMode, bonusDamage = "", showInChat = true, confirmFormula = false, effect = 0) {
    const consumableDamage = this.getConsumableBonusDamage();
    if (!this.system.damage && !consumableDamage) {
      ui.notifications.warn("TWODSIX.Warnings.NoDamageForWeapon", { localize: true });
      return;
    } else {
      let rollFormula = this.system.damage + (bonusDamage !== "0" && bonusDamage !== "" ? " + " + bonusDamage : "") + (consumableDamage != "" ? " + " + consumableDamage : "");
      if (confirmFormula) {
        rollFormula = await confirmRollFormula(rollFormula, game.i18n.localize("TWODSIX.Damage.DamageFormula"));
      }
      rollFormula = rollFormula.replace(/dd/ig, "d6*10");
      let damage = {};
      let apValue = 0;
      if (Roll.validate(rollFormula)) {
        damage = new Roll(rollFormula, this.actor?.getRollData());
        await damage.evaluate();
        apValue += this.getValueFromRollFormula("armorPiercing");
        apValue += this.getConsumableBonus("armorPiercing");
      } else {
        ui.notifications.error("TWODSIX.Errors.InvalidRollFormula", { localize: true });
        return;
      }
      let radDamage = {};
      if (this.type === "component") {
        if (Roll.validate(this.system.radDamage)) {
          const radFormula = this.system.radDamage.replace(/dd/ig, "d6*10");
          radDamage = new Roll(radFormula, this.actor?.getRollData());
          await radDamage.evaluate();
        }
      }
      let damageType = this.getConsumableDamageType();
      if (damageType === "" || damageType === "NONE") {
        damageType = this.system.damageType ?? "NONE";
      }
      const damageLabels = getDamageTypes(true);
      let shipWeaponType = "";
      let shipWeaponLabel = "";
      const isArmament = this.type === "component" && ["armament", "ammo"].includes(this.system?.subtype);
      if (isArmament) {
        shipWeaponType = this.system.shipWeaponType || "";
        shipWeaponLabel = TWODSIX$1.ShipWeaponTypes[game.settings.get("twodsix", "shipWeaponType")][this.system.shipWeaponType] || "unknown";
      }
      const contentData = {};
      const flavor = `${game.i18n.localize("TWODSIX.Rolls.DamageUsing")} ${this.name}`;
      const canBeBlocked = game.settings.get("twodsix", "ruleset") === "CU" && damageType === "melee";
      const canBeParried = canBeBlocked && ["personal", "close"].includes(this.system.rangeBand);
      Object.assign(contentData, {
        flavor,
        roll: damage,
        dice: getDiceResults(damage),
        //damage.terms[0]["results"]
        armorPiercingValue: apValue,
        damageValue: damage.total && damage.total > 0 ? damage.total : 0,
        damageType,
        damageLabel: damageLabels[damageType] || "",
        canBeParried,
        canBeBlocked,
        shipWeaponType,
        shipWeaponTypeLabel: shipWeaponLabel,
        isArmament,
        effect
      });
      if (radDamage.total) {
        Object.assign(contentData, {
          radDamage: radDamage.total,
          radRoll: radDamage,
          radDice: getDiceResults(radDamage)
        });
      }
      if (showInChat) {
        const html = await foundry.applications.handlebars.renderTemplate("systems/twodsix/templates/chat/damage-message.hbs", contentData);
        const transfer = JSON.stringify(
          {
            type: "damageItem",
            payload: contentData
          }
        );
        await damage.toMessage({
          title: game.i18n.localize("TWODSIX.Damage.DamageCard"),
          speaker: this.actor ? ChatMessage.getSpeaker({ actor: this.actor }) : null,
          content: html,
          style: CONST.CHAT_MESSAGE_STYLES.OTHER,
          flags: {
            "core.canPopout": true,
            "twodsix.transfer": transfer,
            "twodsix.itemUUID": this.uuid,
            "twodsix.rollClass": "Damage",
            "twodsix.tokenUUID": this.actor?.getActiveTokens()[0]?.document.uuid ?? "",
            "twodsix.actorUUID": this.actor?.uuid ?? ""
          }
        }, { rollMode });
      }
      return contentData;
    }
  }
  getConsumableBonusDamage() {
    let returnValue = "";
    if (this.system.useConsumableForAttack && this.actor) {
      const magazine = this.actor.items.get(this.system.useConsumableForAttack);
      if (magazine?.type === "consumable") {
        returnValue = magazine.system?.bonusDamage;
      }
    }
    return returnValue;
  }
  getConsumableBonus(key) {
    let returnValue = 0;
    if (this.system.attachmentData) {
      for (const attach of this.system.attachmentData) {
        if (attach.system.subtype !== "software" || attach.system.softwareActive) {
          if (foundry.utils.hasProperty(attach.system, key)) {
            if (typeof attach.system[key] === "number") {
              returnValue += attach.system[key];
            } else {
              returnValue += attach.getValueFromRollFormula(key);
            }
          }
        }
      }
    }
    if (this.system.useConsumableForAttack && this.actor) {
      const magazine = this.actor.items.get(this.system.useConsumableForAttack);
      if (magazine?.type === "consumable") {
        if (foundry.utils.hasProperty(magazine.system, key)) {
          if (typeof magazine.system[key] === "number") {
            returnValue += magazine.system[key];
          } else {
            returnValue += magazine.getValueFromRollFormula(key);
          }
        }
      }
    }
    return returnValue;
  }
  getConsumableDamageType() {
    let returnValue = "";
    if (this.system.useConsumableForAttack && this.actor) {
      const magazine = this.actor.items.get(this.system.useConsumableForAttack);
      returnValue = magazine ? magazine.system.damageType : "NONE";
    }
    return returnValue;
  }
  static burstAttackDM(number) {
    if (number === null) {
      return 0;
    }
    if (number >= 100) {
      return 4;
    } else if (number >= 20) {
      return 3;
    } else if (number >= 10) {
      return 2;
    } else if (number >= 3) {
      return 1;
    } else {
      return 0;
    }
  }
  static burstBonusDamage(number) {
    if (number === null) {
      return "0";
    }
    if (number >= 100) {
      return "4d6";
    } else if (number >= 20) {
      return "3d6";
    } else if (number >= 10) {
      return "2d6";
    } else if (number >= 4) {
      return "1d6";
    } else if (number >= 3) {
      return "1";
    } else {
      return "0";
    }
  }
  static simplifySkillName(skillName) {
    return skillName.replace(/\W/g, "");
  }
  /**
   * A function to resolve autofire mode when a weapon is fired without selecting mode.
   * Through an NPC sheet or macro, typically.
   */
  async resolveUnknownAutoMode(showThrowDialog = true, tmpSettings) {
    let attackType = "single";
    let rof;
    const modes = (this.system.rateOfFire ?? "").split(/[-/]/);
    switch (game.settings.get("twodsix", "autofireRulesUsed")) {
      case TWODSIX$1.RULESETS.CEL.key:
        if (this.shouldShowCELAutoFireDialog()) {
          attackType = await promptForCELROF(this);
        }
        rof = attackType === "single" ? 1 : Number(modes[0]);
        await this.performAttack(attackType, showThrowDialog, rof, true, tmpSettings);
        break;
      case TWODSIX$1.RULESETS.CT.key:
        if (modes.length > 1) {
          attackType = await promptForCTROF(modes);
          rof = attackType === "single" ? 1 : Number(modes[1]);
          await this.performAttack(attackType, showThrowDialog, rof, true, tmpSettings);
        } else {
          await this.performAttack(attackType, showThrowDialog, Number(modes[0]), true, tmpSettings);
        }
        break;
      case TWODSIX$1.RULESETS.CE.key:
        if (modes.length > 1) {
          await promptAndAttackForCE(modes, this);
        } else {
          await this.performAttack(attackType, showThrowDialog, Number(modes[0]), true, tmpSettings);
        }
        break;
      case TWODSIX$1.RULESETS.CU.key:
        if (modes[0] > 1) {
          attackType = await promptForCTROF(modes);
          rof = attackType === "single" ? 1 : Number(modes[0]);
          await this.performAttack(attackType, showThrowDialog, rof, true, tmpSettings);
        } else {
          await this.performAttack(attackType, showThrowDialog, 1, true, tmpSettings);
        }
        break;
      default:
        await this.performAttack(attackType, showThrowDialog, 1, true, tmpSettings);
        break;
    }
  }
  shouldShowCELAutoFireDialog() {
    const rateOfFire = this.system.rateOfFire;
    return (
      /*(game.settings.get('twodsix', 'autofireRulesUsed') === TWODSIX.RULESETS.CEL.key) && */
      Number(rateOfFire) > 1 || this.system.doubleTap && game.settings.get("twodsix", "ShowDoubleTap")
    );
  }
  /*public shouldShowCEAutoFireDialog(): boolean {
    const modes = ((<Weapon>this.system).rateOfFire ?? "").split(/[-/]/);
    return (
      (game.settings.get('twodsix', 'autofireRulesUsed') === TWODSIX.RULESETS.CE.key) &&
      (modes.length > 1)
    );
  }*/
  //////// CONSUMABLE ////////
  /**
   * A function decrement a consumable selected consumbles from inventory.
   * @param {number} quantity The amount to decrement consumable count
   */
  async consume(quantity) {
    const consumableLeft = this.system.currentCount - quantity;
    if (consumableLeft >= 0) {
      await this.update({ "system.currentCount": consumableLeft }, {});
    } else {
      throw { name: "NoAmmoError" };
    }
  }
  /**
   * A function refill selected consumbles from inventory.
   */
  async refill() {
    const consumable = this.system;
    if (consumable.currentCount < consumable.max) {
      if (consumable.quantity > 1) {
        if (consumable.currentCount > 0) {
          const partialConsumable = foundry.utils.duplicate(this);
          partialConsumable.system.quantity = 1;
          await this.actor?.createEmbeddedDocuments("Item", [partialConsumable]);
        }
        await this.update({
          "system.quantity": consumable.quantity - 1,
          "system.currentCount": consumable.max
        }, {});
      } else {
        throw { name: "TooLowQuantityError" };
      }
    }
  }
  /**
   * A method for returning the weapons-armor modifier based on target and weapon type used - Classic Traveller
   * @param {Token} targetToken Token for target
   * @param {string} weaponType Weapon's type description, (e.g., club, rifle, hands). Can be an override based on fire mode (e.g. auto rifle in single fire mode)
   * @param {boolean} isAuto is full auto fire
   * @returns {object} Object of {armorModifier:number, armorLabel:string}
   */
  getWeaponArmorValues(targetToken, weaponType, isAuto) {
    let armorModifier = 0;
    let armorLabel = "";
    if (weaponType !== "none") {
      const targetActor = targetToken?.actor;
      const lookupRow = weaponType === "custom" ? this.getCustomArmorMod(isAuto) : CT_Armor_Table[weaponType];
      if (targetActor && lookupRow) {
        if (targetActor.type === "traveller") {
          const wornArmor = targetActor.itemTypes.armor.filter((armor) => armor.system.equipped === "equipped");
          if (wornArmor.length > 2) {
            ui.notifications.warn("TWODSIX.Warnings.TooManyLayersOnTarget", { localize: true });
          } else if (targetActor.system.reflectOn && wornArmor.length === 2) {
            const armor0Mod = lookupRow[wornArmor[0].system.armorType] + (wornArmor[0].system.armorDM ?? 0);
            const armor1Mod = lookupRow[wornArmor[1].system.armorType] + (wornArmor[1].system.armorDM ?? 0);
            armorModifier = armor0Mod < armor1Mod ? armor0Mod : armor1Mod;
            armorLabel = armor0Mod < armor1Mod ? wornArmor[0].system.armorType : wornArmor[1].system.armorType;
          } else if (wornArmor.length === 1) {
            armorModifier = lookupRow[wornArmor[0].system.armorType] + (wornArmor[0].system.armorDM ?? 0);
            armorLabel = wornArmor[0].system.armorType;
          } else if (wornArmor.length === 0) {
            armorModifier = lookupRow["nothing"];
            armorLabel = "nothing";
          }
        } else if (["animal", "robot"].includes(targetActor.type)) {
          armorModifier = lookupRow[targetActor.system.armorType] + (targetActor.system.armorDM ?? 0);
          armorLabel = targetActor.system.armorType;
        }
      } else {
        ui.notifications.error("TWODSIX.Errors.InvalidWeaponArmor", { localize: true });
      }
    }
    armorLabel = game.i18n.localize(armorLabel !== "" ? TWODSIX$1.CT_ARMOR_TYPES[armorLabel] : "TWODSIX.Ship.Unknown");
    return { armorModifier, armorLabel };
  }
  /**
   * A method for returning an object of custom armor values for a weapon in CT
   * @param {boolean} isAuto Is full automatic fire
   * @returns {object} Object of protection values versus different armor types
   */
  getCustomArmorMod(isAuto) {
    return {
      nothing: parseCustomCTValue(this.system.customCT.armor.nothing, isAuto),
      jack: parseCustomCTValue(this.system.customCT.armor.jack, isAuto),
      mesh: parseCustomCTValue(this.system.customCT.armor.mesh, isAuto),
      cloth: parseCustomCTValue(this.system.customCT.armor.cloth, isAuto),
      reflec: parseCustomCTValue(this.system.customCT.armor.reflec, isAuto),
      ablat: parseCustomCTValue(this.system.customCT.armor.ablat, isAuto),
      combat: parseCustomCTValue(this.system.customCT.armor.combat, isAuto)
    };
  }
  /**
   * A method for returning range modifier based on RangeTable constant
   * @param {string} weaponBand   Weapon's range description, (.e.g., close quarters, thrown, rifle)
   * @param {string} targetDistanceBand Qualitative distance to target, (e.g. close, short, very long)
   * @param {number} range Range to target, in meters
   * @param {boolean} isAuto Is full automatic fire
   * @returns {number} Range Modifier
   */
  getRangeBandModifier(weaponBand, targetDistanceBand, isAuto, range) {
    const rangeSettings = game.settings.get("twodsix", "rangeModifierType");
    let returnVal = 0;
    if (targetDistanceBand !== "unknown" && weaponBand !== "none") {
      try {
        switch (rangeSettings) {
          case "CE_Bands":
            returnVal = CE_Range_Table[weaponBand][targetDistanceBand];
            break;
          case "CU_Bands": {
            if (weaponBand === "thrown") {
              const maxThrow = 10 + this.actor?.system.characteristics.strength.value - this.system.weight;
              if (range < maxThrow / 2) {
                returnVal = 0;
              } else if (range > maxThrow) {
                returnVal = INFEASIBLE;
              } else {
                returnVal = -2;
              }
            } else {
              returnVal = CU_Range_Table[weaponBand][targetDistanceBand];
            }
            break;
          }
          case "CT_Bands": {
            const lookupRow = weaponBand === "custom" ? this.getCustomRangeMod(isAuto) : CT_Range_Table[weaponBand];
            returnVal = lookupRow[targetDistanceBand] || 0;
            break;
          }
          default:
            console.log("Not a valid weapon range band type");
            break;
        }
      } catch {
        ui.notifications.error("TWODSIX.Errors.InvalidRangeBand", { localize: true });
      }
    }
    return returnVal;
  }
  /**
   * A method for returning an object of custom range modifiers for a weapon in CT
   * @param {boolean} isAuto Is full automatic fire
   * @returns {object} Object of range modifiers versus different range bands
   */
  getCustomRangeMod(isAuto) {
    return {
      close: parseCustomCTValue(this.system.customCT.range.close, isAuto),
      short: parseCustomCTValue(this.system.customCT.range.short, isAuto),
      medium: parseCustomCTValue(this.system.customCT.range.medium, isAuto),
      long: parseCustomCTValue(this.system.customCT.range.long, isAuto),
      veryLong: parseCustomCTValue(this.system.customCT.range.veryLong, isAuto)
    };
  }
  /**
   * A method for drawing a measured template for an item action - accounting for consumables
   * having attachements with AOE's
   */
  async drawItemTemplate() {
    let returnValue = false;
    const magazine = this.system.useConsumableForAttack ? this.actor?.items.get(this.system.useConsumableForAttack) : void 0;
    const itemForAOE = magazine?.system.target.type !== "none" && magazine ? magazine : this;
    if (itemForAOE.system.target?.type !== "none") {
      returnValue = true;
      try {
        const template = await ItemTemplate.fromItem(itemForAOE)?.drawPreview();
        if (template && game.settings.get("twodsix", "autoTargetAOE")) {
          targetTokensInTemplate(template);
        }
      } catch {
        ui.notifications.error("TWODSIX.Errors.CantPlaceTemplate", { localize: true });
      }
    }
    return returnValue;
  }
  /**
   * A method for getting a value from an item's roll formula
   * @param {string} key The item.system object key for the formula
   * @returns {number} The deterministic value as a number from a roll formula
   */
  getValueFromRollFormula(key) {
    let returnValue = 0;
    if (foundry.utils.hasProperty(this.system, key)) {
      if (Roll.validate(this.system[key])) {
        try {
          const replacedFormula = Roll.replaceFormulaData(this.system[key], this.actor?.getRollData(), { missing: "0", warn: true });
          returnValue += replacedFormula ? Roll.safeEval(replacedFormula) : 0;
        } catch (error) {
          console.log("Invalid formula", error);
          ui.notifications.warn(game.i18n.localize("TWODSIX.Warnings.InvalidFormula") + this.name);
        }
      }
    }
    return returnValue;
  }
  /**
   * Calculates the range modifier and range label for a weapon attack.
   * @param {Token[]} controlledTokens - The tokens controlled by the actor performing the attack.
   * @param {Token[]} targetTokens - The tokens targeted by the attack.
   * @param {string} weaponType - The type of weapon being used (e.g., rifle, pistol).
   * @param {boolean} isAutoFull - Whether the attack is a full-auto attack.
   * @param {object} tmpSettings - Temporary settings for the attack roll.
   * @returns {object} An object containing the range modifier and range label.
   * @property {number} rangeModifier - The calculated range modifier for the attack.
   * @property {string} rangeLabel - The label describing the range of the attack.
   */
  calculateRangeAndLabel(controlledTokens, targetTokens, weaponType, isAutoFull, tmpSettings) {
    let rangeLabel = "";
    let rangeModifier = 0;
    const isQualitativeBands = ["CE_Bands", "CT_Bands", "CU_Bands"].includes(game.settings.get("twodsix", "rangeModifierType"));
    const localizePrefix = "TWODSIX.Chat.Roll.RangeBandTypes.";
    if (targetTokens.length === 1) {
      const targetRange = canvas.grid.measurePath([controlledTokens[0], targetTokens[0]]).distance;
      const rangeData = this.getRangeModifier(targetRange, weaponType, isAutoFull);
      rangeModifier = rangeData.rangeModifier;
      if (rangeData.rollType !== tmpSettings.rollType) {
        Object.assign(tmpSettings, { rollType: tmpSettings.rollType === "Normal" ? rangeData.rollType : "Normal" });
      }
      if (isQualitativeBands) {
        rangeLabel = this.system.rangeBand === "none" ? game.i18n.localize(localizePrefix + "none") : `${game.i18n.localize("TWODSIX.Chat.Roll.WeaponRangeTypes." + weaponType)} @ ${game.i18n.localize(localizePrefix + getRangeBand(targetRange))}`;
      } else {
        const ammoMultiplier = this.getAmmoRangeModifier(game.settings.get("twodsix", "rangeModifierType"));
        const effectiveRange = this.system.range.split("/").map((str) => (parseFloat(str) * ammoMultiplier).toLocaleString(game.i18n.lang, { maximumFractionDigits: 1 })).join("/").replace("NaN", game.i18n.localize(this.isMeleeWeapon() ? "TWODSIX.DamageType.Melee" : "TWODSIX.Ship.Unknown"));
        rangeLabel = `${effectiveRange} @ ${targetRange.toLocaleString(game.i18n.lang, { maximumFractionDigits: 1 })}${canvas.scene.grid.units}`;
      }
    } else if (targetTokens.length === 0) {
      rangeLabel = isQualitativeBands && this.system.rangeBand === "none" ? game.i18n.localize(localizePrefix + "none") : game.i18n.localize("TWODSIX.Ship.Unknown");
    }
    return { rangeModifier, rangeLabel };
  }
};
__name$Z(_TwodsixItem, "TwodsixItem");
let TwodsixItem = _TwodsixItem;
function parseCustomCTValue(inputString, isAuto) {
  const parsedInput = inputString.split("/");
  let returnVal = 0;
  if (parsedInput.length > 0) {
    returnVal = parseInt(parsedInput[isAuto ? 1 : 0]);
    if (isNaN(returnVal) && isAuto) {
      returnVal = parseInt(parsedInput[0]);
    }
  }
  return returnVal || 0;
}
__name$Z(parseCustomCTValue, "parseCustomCTValue");
async function onRollDamage(ev, target) {
  ev.preventDefault();
  ev.stopPropagation();
  const itemId = target.closest(".item").dataset.itemId;
  let item = this.actor.items.get(itemId);
  if (item.system.subtype === "armament" && item.system.ammoLink && item.system.ammoLink !== "none") {
    const linkedAmmo = this.actor.items.get(item.system.ammoLink);
    if (linkedAmmo) {
      item = linkedAmmo;
    }
  }
  let bonusDamageFormula = String(target.dataset.bonusDamage || 0);
  if (game.settings.get("twodsix", "addEffectToManualDamage") && game.settings.get("twodsix", "addEffectToDamage")) {
    const lastMessage = game.messages?.contents.pop();
    if (lastMessage?.getFlag("twodsix", "effect")) {
      const effectDM = String(lastMessage.getFlag("twodsix", "effect"));
      if (bonusDamageFormula === "0") {
        bonusDamageFormula = effectDM;
      } else {
        bonusDamageFormula += `+` + effectDM;
      }
    }
  }
  const useInvertedShiftClick = game.settings.get("twodsix", "invertSkillRollShiftClick");
  const showFormulaDialog = useInvertedShiftClick ? ev["shiftKey"] : !ev["shiftKey"];
  await item.rollDamage(item.type === "psiAbility" ? "gmroll" : game.settings.get("core", "rollMode"), bonusDamageFormula, true, showFormulaDialog);
}
__name$Z(onRollDamage, "onRollDamage");
function getDiceResults(inputRoll) {
  const returnValue = [];
  for (const die of inputRoll.dice) {
    returnValue.push(die.results);
  }
  return returnValue.flat(2);
}
__name$Z(getDiceResults, "getDiceResults");
function getValueFromRollFormula(rollFormula, item) {
  let returnValue = 0;
  if (Roll.validate(rollFormula)) {
    try {
      returnValue = Roll.safeEval(Roll.replaceFormulaData(rollFormula, item.actor?.getRollData(), { missing: "0", warn: true })) ?? 0;
    } catch (error) {
      console.log("Invalid formula", error);
      ui.notifications.warn(game.i18n.localize("TWODSIX.Warnings.InvalidFormula") + item.name);
    }
  }
  return returnValue;
}
__name$Z(getValueFromRollFormula, "getValueFromRollFormula");
async function promptForCELROF(weapon) {
  if (weapon.system.doubleTap && game.settings.get("twodsix", "ShowDoubleTap")) {
    return await foundry.applications.api.DialogV2.wait({
      window: { title: "TWODSIX.Dialogs.ROFPickerTitle" },
      content: "",
      buttons: [
        {
          action: "single",
          label: "TWODSIX.Dialogs.ROFSingle",
          default: true
        },
        {
          action: "double-tap",
          label: "TWODSIX.Dialogs.ROFDoubleTap"
        }
      ],
      rejectClose: false
    });
  } else {
    return await foundry.applications.api.DialogV2.wait({
      window: { title: "TWODSIX.Dialogs.ROFPickerTitle" },
      content: "",
      buttons: [
        {
          action: "single",
          label: "TWODSIX.Dialogs.ROFSingle",
          default: true
        },
        {
          action: "auto-burst",
          label: "TWODSIX.Dialogs.ROFBurst"
        },
        {
          action: "auto-full",
          label: "TWODSIX.Dialogs.ROFFull"
        }
      ],
      rejectClose: false
    });
  }
}
__name$Z(promptForCELROF, "promptForCELROF");
async function promptAndAttackForCE(modes, item) {
  const buttons = [];
  for (const mode of modes) {
    const number = Number(mode);
    const attackDM = TwodsixItem.burstAttackDM(number);
    const bonusDamage = TwodsixItem.burstBonusDamage(number);
    if (number === 1) {
      buttons.push({
        action: "single",
        label: "TWODSIX.Dialogs.ROFSingle",
        default: true,
        callback: /* @__PURE__ */ __name$Z(() => {
          item.performAttack("single", true, 1);
        }, "callback")
      });
    } else if (number > 1) {
      let key = game.i18n.localize("TWODSIX.Rolls.AttackDM") + " +" + attackDM;
      buttons.push({
        action: `burst${number}`,
        label: key,
        callback: /* @__PURE__ */ __name$Z(() => {
          item.performAttack("burst-attack-dm", true, number);
        }, "callback")
      });
      key = game.i18n.localize("TWODSIX.Rolls.BonusDamage") + " +" + bonusDamage;
      buttons.push({
        action: `bonus${number}`,
        label: key,
        callback: /* @__PURE__ */ __name$Z(() => {
          item.performAttack("burst-bonus-damage", true, number);
        }, "callback")
      });
    }
  }
  await foundry.applications.api.DialogV2.wait({
    window: { title: "TWODSIX.Dialogs.ROFPickerTitle" },
    content: "",
    buttons,
    rejectClose: false
  });
}
__name$Z(promptAndAttackForCE, "promptAndAttackForCE");
async function promptForCTROF(modes) {
  if (parseInt(modes[0]) === 0) {
    return "auto-full";
  } else {
    return await foundry.applications.api.DialogV2.wait({
      window: { title: "TWODSIX.Dialogs.ROFPickerTitle" },
      content: "",
      buttons: [
        {
          action: "single",
          label: "TWODSIX.Dialogs.ROFSingle",
          default: true
        },
        {
          action: "auto-full",
          label: "TWODSIX.Dialogs.ROFFull"
        }
      ],
      rejectClose: false
    });
  }
}
__name$Z(promptForCTROF, "promptForCTROF");
function getRangeBand(range) {
  const rangeModifierType = game.settings.get("twodsix", "rangeModifierType");
  const units = canvas.scene.grid.units.toLowerCase();
  if (units === "ft" || units === "feet") {
    range /= 3.28;
  }
  if (rangeModifierType === "CE_Bands") {
    if (range < 1.5) {
      return "personal";
    } else if (range <= 3) {
      return "close";
    } else if (range <= 12) {
      return "short";
    } else if (range <= 50) {
      return "medium";
    } else if (range <= 250) {
      return "long";
    } else if (range <= 500) {
      return "veryLong";
    } else if (range > 500) {
      return "distant";
    } else {
      return "unknown";
    }
  } else if (rangeModifierType === "CT_Bands") {
    if (range < 1) {
      return "close";
    } else if (range <= 5) {
      return "short";
    } else if (range <= 50) {
      return "medium";
    } else if (range <= 250) {
      return "long";
    } else if (range <= 500) {
      return "veryLong";
    } else if (range > 500) {
      return "distant";
    } else {
      return "unknown";
    }
  } else if (rangeModifierType === "CU_Bands") {
    if (range < 1.5) {
      return "personal";
    } else if (range <= 3) {
      return "close";
    } else if (range <= 15) {
      return "short";
    } else if (range <= 50) {
      return "medium";
    } else if (range <= 250) {
      return "long";
    } else if (range <= 500) {
      return "veryLong";
    } else if (range > 500) {
      return "distant";
    } else {
      return "unknown";
    }
  } else {
    return "unknown";
  }
}
__name$Z(getRangeBand, "getRangeBand");
const INFEASIBLE = -99;
const CE_Range_Table = Object.freeze({
  closeQuarters: { personal: 0, close: -2, short: INFEASIBLE, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE, distant: INFEASIBLE },
  extendedReach: { personal: -2, close: 0, short: INFEASIBLE, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE, distant: INFEASIBLE },
  thrown: { personal: INFEASIBLE, close: 0, short: -2, medium: -2, long: INFEASIBLE, veryLong: INFEASIBLE, distant: INFEASIBLE },
  pistol: { personal: -2, close: 0, short: 0, medium: -2, long: -4, veryLong: INFEASIBLE, distant: INFEASIBLE },
  rifle: { personal: -4, close: -2, short: 0, medium: 0, long: 0, veryLong: -2, distant: -4 },
  shotgun: { personal: -2, close: 0, short: -2, medium: -2, long: -4, veryLong: INFEASIBLE, distant: INFEASIBLE },
  assaultWeapon: { personal: -2, close: 0, short: 0, medium: 0, long: -2, veryLong: -4, distant: -6 },
  rocket: { personal: -4, close: -2, short: -2, medium: 0, long: 0, veryLong: -2, distant: -4 }
});
const CU_Range_Table = Object.freeze({
  personal: { personal: 0, close: -1, short: INFEASIBLE, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE, distant: INFEASIBLE },
  close: { personal: -1, close: 0, short: INFEASIBLE, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE, distant: INFEASIBLE },
  short: { personal: 2, close: 2, short: 0, medium: -2, long: -4, veryLong: INFEASIBLE, distant: INFEASIBLE },
  medium: { personal: 2, close: 2, short: 0, medium: 0, long: -2, veryLong: -4, distant: INFEASIBLE },
  shotgun: { personal: 2, close: 2, short: 1, medium: 0, long: -2, veryLong: -4, distant: INFEASIBLE },
  long: { personal: 2, close: 2, short: 0, medium: 0, long: 0, veryLong: -2, distant: -4 },
  veryLong: { personal: 2, close: 2, short: 0, medium: 0, long: 0, veryLong: 0, distant: -2 },
  distant: { personal: 2, close: 2, short: 0, medium: 0, long: 0, veryLong: 0, distant: 0 }
});
const CT_Range_Table = Object.freeze({
  hands: { close: 2, short: 1, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  claws: { close: 1, short: 2, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  teeth: { close: 2, short: 0, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  horns: { close: -1, short: 1, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  hooves: { close: -1, short: 2, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  stinger: { close: 4, short: 2, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  thrasher: { close: 5, short: 1, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  club: { close: 1, short: 2, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  dagger: { close: 1, short: -1, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  blade: { close: 1, short: 1, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  foil: { close: -1, short: 0, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  cutlass: { close: -4, short: 2, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  sword: { close: -2, short: 1, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  broadsword: { close: -8, short: 3, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  bayonet: { close: -1, short: 2, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  spear: { close: -2, short: 1, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  halberd: { close: 0, short: 1, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  pike: { close: -4, short: 4, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  cudgel: { close: 0, short: 0, medium: INFEASIBLE, long: INFEASIBLE, veryLong: INFEASIBLE },
  bodyPistol: { close: 2, short: 1, medium: -6, long: INFEASIBLE, veryLong: INFEASIBLE },
  autoPistol: { close: 1, short: 2, medium: -4, long: -6, veryLong: INFEASIBLE },
  revolver: { close: 1, short: 2, medium: -3, long: -5, veryLong: INFEASIBLE },
  carbine: { close: -4, short: 1, medium: -2, long: -4, veryLong: -5 },
  rifle: { close: -4, short: 1, medium: 0, long: -1, veryLong: -3 },
  autoRifle: { close: -8, short: 0, medium: 2, long: 1, veryLong: -2 },
  shotgun: { close: -8, short: 1, medium: 3, long: -6, veryLong: INFEASIBLE },
  submachinegun: { close: -4, short: 3, medium: 3, long: -3, veryLong: -9 },
  laserCarbine: { close: -2, short: 1, medium: 1, long: 1, veryLong: 0 },
  laserRifle: { close: -4, short: 2, medium: 2, long: 2, veryLong: 1 }
});
const CT_Armor_Table = Object.freeze({
  hands: { nothing: 1, jack: -1, mesh: -4, cloth: -4, reflec: 0, ablat: -1, combat: -6 },
  claws: { nothing: 3, jack: 0, mesh: 0, cloth: 1, reflec: -1, ablat: -3, combat: -7 },
  teeth: { nothing: 2, jack: 1, mesh: -1, cloth: 0, reflec: -2, ablat: -4, combat: -7 },
  horns: { nothing: 2, jack: 1, mesh: 0, cloth: -1, reflec: 2, ablat: -2, combat: -5 },
  hooves: { nothing: 3, jack: 3, mesh: 2, cloth: 2, reflec: 3, ablat: 2, combat: -6 },
  stinger: { nothing: 4, jack: 3, mesh: 0, cloth: 1, reflec: 2, ablat: 0, combat: -6 },
  thrasher: { nothing: 7, jack: 7, mesh: 4, cloth: 4, reflec: 7, ablat: 4, combat: 0 },
  club: { nothing: 0, jack: 0, mesh: -2, cloth: -3, reflec: 0, ablat: -2, combat: -7 },
  dagger: { nothing: 0, jack: -1, mesh: -4, cloth: -4, reflec: 0, ablat: -2, combat: -7 },
  blade: { nothing: 0, jack: -1, mesh: -4, cloth: -4, reflec: 0, ablat: -2, combat: -7 },
  foil: { nothing: 2, jack: 0, mesh: -4, cloth: -3, reflec: 2, ablat: -2, combat: -6 },
  cutlass: { nothing: 4, jack: 3, mesh: -2, cloth: -3, reflec: 4, ablat: -2, combat: -6 },
  sword: { nothing: 3, jack: 3, mesh: -3, cloth: -3, reflec: 3, ablat: -2, combat: -6 },
  broadsword: { nothing: 5, jack: 5, mesh: 1, cloth: 0, reflec: 5, ablat: 1, combat: -4 },
  bayonet: { nothing: 2, jack: 1, mesh: 0, cloth: -1, reflec: 2, ablat: -2, combat: -6 },
  spear: { nothing: 1, jack: 0, mesh: -2, cloth: -2, reflec: -1, ablat: -3, combat: -6 },
  halberd: { nothing: 4, jack: 3, mesh: -2, cloth: -3, reflec: 4, ablat: -2, combat: -5 },
  pike: { nothing: 1, jack: 0, mesh: -2, cloth: -2, reflec: -1, ablat: -3, combat: -6 },
  cudgel: { nothing: 0, jack: 0, mesh: -2, cloth: -3, reflec: 0, ablat: -2, combat: -7 },
  bodyPistol: { nothing: 0, jack: 0, mesh: -2, cloth: -4, reflec: -4, ablat: -2, combat: -7 },
  autoPistol: { nothing: 1, jack: 1, mesh: -1, cloth: -3, reflec: 1, ablat: -1, combat: -5 },
  revolver: { nothing: 1, jack: 1, mesh: -1, cloth: -3, reflec: 1, ablat: -1, combat: -5 },
  carbine: { nothing: 2, jack: 2, mesh: 0, cloth: -3, reflec: 2, ablat: -1, combat: -5 },
  rifle: { nothing: 3, jack: 3, mesh: 0, cloth: -3, reflec: 2, ablat: 1, combat: -5 },
  autoRifle: { nothing: 6, jack: 6, mesh: 2, cloth: -1, reflec: 6, ablat: 3, combat: -3 },
  shotgun: { nothing: 5, jack: 5, mesh: -1, cloth: -3, reflec: 5, ablat: 2, combat: -5 },
  submachinegun: { nothing: 5, jack: 5, mesh: 0, cloth: -3, reflec: 5, ablat: 2, combat: -4 },
  laserCarbine: { nothing: 2, jack: 2, mesh: 1, cloth: 1, reflec: -8, ablat: -7, combat: -6 },
  laserRifle: { nothing: 3, jack: 3, mesh: 2, cloth: 2, reflec: -8, ablat: -7, combat: -6 }
});
function getNumberOfAttacks(autoFireRulesUsed, rateOfFire) {
  let returnValue = rateOfFire;
  switch (autoFireRulesUsed) {
    case "CT":
      returnValue = 2;
      break;
    case "CU":
      if (rateOfFire === 4) {
        returnValue = 2;
      } else if (rateOfFire === 10 || rateOfFire === 20) {
        returnValue = 3;
      }
      break;
  }
  return returnValue;
}
__name$Z(getNumberOfAttacks, "getNumberOfAttacks");

var __defProp$Y = Object.defineProperty;
var __name$Y = (target, value) => __defProp$Y(target, "name", { value, configurable: true });
const _TwodsixCombatant = class _TwodsixCombatant extends Combatant {
  _getInitiativeFormula() {
    if (this.actor.type === "ship") {
      return game.settings.get("twodsix", "shipInitiativeFormula");
    } else {
      return game.settings.get("twodsix", "initiativeFormula");
    }
  }
};
__name$Y(_TwodsixCombatant, "TwodsixCombatant");
let TwodsixCombatant = _TwodsixCombatant;

var __defProp$X = Object.defineProperty;
var __name$X = (target, value) => __defProp$X(target, "name", { value, configurable: true });
const _AbstractTwodsixItemSheet = class _AbstractTwodsixItemSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ItemSheetV2
) {
  async _onRender(context, options) {
    await super._onRender(context, options);
    if (game.user.isOwner && this.options.dragDrop) {
      this.options.dragDrop.forEach((selector) => {
        new foundry.applications.ux.DragDrop({
          dragSelector: selector.dragSelector,
          dropSelector: selector.dropSelector,
          callbacks: {
            dragstart: this._onDragStart.bind(this),
            dragover: this._onDragOver.bind(this),
            drop: this._onDrop.bind(this)
          }
        }).bind(this.element);
      });
    }
  }
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.item = this.item;
    context.system = this.item.system;
    context.owner = this.actor;
    if (this.actor) {
      const skillsList = [];
      for (const skill of context.owner.itemTypes.skills) {
        if (isDisplayableSkill(skill) || skill.getFlag("twodsix", "untrainedSkill") === game.settings.get("twodsix", "hideUntrainedSkills")) {
          skillsList.push(skill);
        }
      }
      context.skillsList = sortByItemName(skillsList);
    }
    return context;
  }
  /*******************
   *
   * Drag Drop Handling
   *
   *******************/
  /** @override */
  _canDragDrop() {
    return this.isEditable && this.item.isOwner;
  }
  /**
   * Callback actions which occur at the beginning of a drag start workflow.
   * @param {DragEvent} ev       The originating DragEvent
   * @protected
   */
  _onDragStart(ev) {
    if ("link" in ev.target.dataset || this.options.sheetType === "ShipPositionSheet") {
      return;
    }
    const consumableId = ev.currentTarget.closest(".consumable")?.dataset.consumableId;
    if (consumableId) {
      const draggedConsumable = this.item.actor?.items.get(consumableId);
      if (draggedConsumable) {
        const dragData = {
          type: "Item",
          uuid: draggedConsumable.uuid
        };
        ev.dataTransfer.setData("text/plain", JSON.stringify(dragData));
      }
    }
  }
  /**
   * An event that occurs when a drag workflow moves over a drop target.
   * @param {DragEvent} ev
   * @protected
   */
  _onDragOver() {
  }
  /**
   * Callback actions which occur when dropping.  TWODSIX Specific!
   * @param {DragEvent} ev The originating DragEvent
   */
  async _onDrop(ev) {
    if (ev.target.classList.contains("ProseMirror") || ev.target.parentElement.className.includes("ProseMirror")) {
      return;
    }
    ev.preventDefault();
    try {
      const dropData = getDataFromDropEvent(ev);
      this.check(!dropData, "DraggingSomething");
      if (["html", "pdf"].includes(dropData.type)) {
        if (dropData.href) {
          await this.item.update({
            "system.pdfReference.type": dropData.type,
            "system.pdfReference.href": dropData.href,
            "system.pdfReference.label": dropData.label
          });
        }
      } else if (["JournalEntry", "JournalEntryPage"].includes(dropData.type)) {
        const journalEntry = await fromUuid(dropData.uuid);
        if (journalEntry) {
          await this.item.update({
            "system.pdfReference.type": "JournalEntry",
            "system.pdfReference.href": dropData.uuid,
            "system.pdfReference.label": journalEntry.name
          });
        }
      } else if (dropData.type === "Item") {
        this.check(!this.item.isOwned, "OnlyOwnedItems");
        this.check(TWODSIX$1.WeightlessItems.includes(this.item.type), "TraitsandSkillsNoConsumables");
        this.check(dropData.type !== "Item", "OnlyDropItems");
        const itemData = await getDocFromDropData(dropData);
        this.check(itemData.type !== "consumable", "OnlyDropConsumables");
        this.check(this.item.type === "consumable" && itemData.system.isAttachment, "CantDropAttachOnConsumables");
        let itemId;
        if (this.item.actor?.items.get(itemData._id)) {
          itemId = itemData._id;
          const previousItem = itemData.actor.items.find((it) => it.system.consumables?.includes(itemId));
          if (previousItem) {
            await previousItem.removeConsumable(itemId, previousItem.system);
          }
        } else {
          const newItem = await this.item.actor?.createEmbeddedDocuments("Item", [foundry.utils.duplicate(itemData)]);
          if (!newItem) {
            throw new Error(`Somehow could not create item ${itemData}`);
          }
          itemId = newItem[0].id;
        }
        await this.item.addConsumable(itemId);
      }
      this.render();
    } catch (err) {
      console.error(`Twodsix drop error| ${err}`);
      ui.notifications.error(err);
    }
  }
  check(cond, err) {
    if (cond) {
      throw new Error(game.i18n.localize(`TWODSIX.Errors.${err}`));
    }
  }
};
__name$X(_AbstractTwodsixItemSheet, "AbstractTwodsixItemSheet");
let AbstractTwodsixItemSheet = _AbstractTwodsixItemSheet;
function onPasteStripFormatting(event) {
  if (event.originalEvent && event.originalEvent.clipboardData && event.originalEvent.clipboardData.getData) {
    event.preventDefault();
    const text = event.originalEvent.clipboardData.getData("text/plain");
    window.document.execCommand("insertText", false, text);
  } else if (event.clipboardData && event.clipboardData.getData) {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    window.document.execCommand("insertText", false, text);
  }
}
__name$X(onPasteStripFormatting, "onPasteStripFormatting");

var __defProp$W = Object.defineProperty;
var __name$W = (target, value) => __defProp$W(target, "name", { value, configurable: true });
const _AbstractTwodsixActorSheet = class _AbstractTwodsixActorSheet extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ActorSheetV2
) {
  /**
   * Return the type of the current Actor
   * @type {String}
   */
  get actorType() {
    return this.actor.type;
  }
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.owner = this.actor;
    context.actor = context.owner;
    context.system = this.actor.system;
    context.dtypes = ["String", "Number", "Boolean"];
    context.settings = {
      ShowRangeBandAndHideRange: ["CE_Bands", "CT_Bands", "CU_Bands"].includes(game.settings.get("twodsix", "rangeModifierType")),
      rangeTypes: getRangeTypes("short"),
      ExperimentalFeatures: game.settings.get("twodsix", "ExperimentalFeatures"),
      autofireRulesUsed: game.settings.get("twodsix", "autofireRulesUsed"),
      showAlternativeCharacteristics: game.settings.get("twodsix", "showAlternativeCharacteristics"),
      lifebloodInsteadOfCharacteristics: game.settings.get("twodsix", "lifebloodInsteadOfCharacteristics"),
      showContaminationBelowLifeblood: game.settings.get("twodsix", "showContaminationBelowLifeblood"),
      showLifebloodStamina: game.settings.get("twodsix", "showLifebloodStamina"),
      showHeroPoints: game.settings.get("twodsix", "showHeroPoints"),
      showIcons: game.settings.get("twodsix", "showIcons"),
      showStatusIcons: game.settings.get("twodsix", "showStatusIcons"),
      showInitiativeButton: game.settings.get("twodsix", "showInitiativeButton"),
      useProseMirror: game.settings.get("twodsix", "useProseMirror"),
      useFoundryStandardStyle: game.settings.get("twodsix", "useFoundryStandardStyle"),
      showReferences: game.settings.get("twodsix", "usePDFPagerForRefs"),
      showSpells: game.settings.get("twodsix", "showSpells"),
      dontShowStatBlock: game.settings.get("twodsix", "showLifebloodStamina") || game.settings.get("twodsix", "lifebloodInsteadOfCharacteristics"),
      hideUntrainedSkills: game.settings.get("twodsix", "hideUntrainedSkills"),
      damageTypes: getDamageTypes(false),
      Infinity: Infinity,
      usePDFPager: game.settings.get("twodsix", "usePDFPagerForRefs"),
      showActorReferences: game.settings.get("twodsix", "showActorReferences"),
      useCTData: game.settings.get("twodsix", "ruleset") === "CT",
      useCUData: game.settings.get("twodsix", "ruleset") === "CU"
    };
    if (!["ship", "vehicle", "space-object"].includes(this.actor.type)) {
      context.untrainedSkill = this.actor.getUntrainedSkill();
      if (!context.untrainedSkill) {
        const existingSkill = this.actor.itemTypes.skills?.find((sk) => sk.name === game.i18n.localize("TWODSIX.Actor.Skills.Untrained") || sk.getFlag("twodsix", "untrainedSkill"));
        if (existingSkill) {
          context.untrainedSkill = existingSkill;
        } else {
          ui.notifications.warn("TWODSIX.Warnings.MissingUntrainedSkill", { localize: true });
        }
      }
      setCharacteristicDisplay(context);
      if (this.actor.type === "traveller") {
        context.system.characteristics.displayOrder = getDisplayOrder(context);
      }
    }
    this._prepareItemContainers(context);
    if (!["ship", "vehicle", "space-object"].includes(this.actor.type)) {
      this._prepareTooltips(context);
    }
    context.config = TWODSIX$1;
    return context;
  }
  /** @override */
  async _onRender(context, options) {
    await super._onRender(context, options);
    if (!context.editable) {
      return;
    }
    this.handleContentEditable(this.element);
    if (this.actor.type !== "ship") {
      this.element.querySelectorAll(".item-value-edit")?.forEach((el) => {
        el.addEventListener("input", this._onItemValueEdit.bind(this));
      });
      this.element.querySelectorAll(".condition-icon")?.forEach((el) => {
        el.addEventListener("click", this._onEditEffect.bind(this));
      });
      this.element.querySelectorAll(".condition-icon")?.forEach((el) => {
        el.addEventListener("contextmenu", this._onDeleteEffect.bind(this));
      });
      this.element.querySelectorAll(".effect-control")?.forEach((el) => {
        el.addEventListener("click", this._modifyEffect.bind(this));
      });
    }
    this.element.querySelectorAll(`[name="reference"]`)?.forEach((el) => el.addEventListener("change", changeReference.bind(this)));
    if (game.user.isOwner && this.options.dragDrop) {
      this.options.dragDrop.forEach((selector) => {
        new foundry.applications.ux.DragDrop({
          dragSelector: selector.dragSelector,
          dropSelector: selector.dropSelector,
          callbacks: {
            dragstart: this._onDragStart.bind(this),
            dragover: this._onDragOver.bind(this),
            drop: this._onDrop.bind(this)
          }
        }).bind(this.element);
      });
    }
  }
  /**
   * Handle delete item for actor sheet.
   * @param {Event} ev   The originating click event
   */
  static async _onItemDelete(ev, target) {
    const li = target.closest(".item");
    const toDeleteItem = this.actor.items.get(li.dataset.itemId) || null;
    if (!toDeleteItem) {
      return;
    }
    const confirmed = await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("TWODSIX.Actor.Items.DeleteItem") },
      content: `<strong>${game.i18n.localize("TWODSIX.Actor.DeleteOwnedItem")}: ${toDeleteItem?.name}</strong>`
    });
    if (!confirmed) {
      return;
    }
    const selectedActor = this.actor ?? this.token?.actor;
    if (!selectedActor) {
      console.log("Invalid Actor");
      return;
    }
    if (foundry.utils.hasProperty(toDeleteItem, "system.equipped")) {
      await toDeleteItem.update({ "system.equipped": "ship" });
    }
    const updates = [];
    if (toDeleteItem.type === "consumable" && !["ship", "vehicle", "space-object"].includes(selectedActor.type)) {
      for (const i of selectedActor.items.filter((it) => !TWODSIX$1.WeightlessItems.includes(it.type))) {
        const current = Array.isArray(i.system.consumables) ? foundry.utils.duplicate(i.system.consumables) : [];
        const filtered = current.filter((id) => id !== toDeleteItem.id);
        const update = { _id: i.id };
        let changed = false;
        if (filtered.length !== current.length) {
          update["system.consumables"] = filtered;
          changed = true;
        }
        if (i.system.useConsumableForAttack === toDeleteItem.id) {
          update["system.useConsumableForAttack"] = "";
          changed = true;
        }
        if (changed) {
          updates.push(update);
        }
      }
    } else if (toDeleteItem.system?.subtype === "ammo") {
      const linkedArmaments = this.actor.itemTypes.component?.filter((it) => it.system.subtype === "armament" && it.system.ammoLink === toDeleteItem.id) ?? [];
      for (const arm of linkedArmaments) {
        updates.push({ _id: arm.id, "system.ammoLink": "none" });
      }
    }
    if (updates.length) {
      await selectedActor.updateEmbeddedDocuments("Item", updates, { render: false });
    }
    await selectedActor.deleteEmbeddedDocuments("Item", [toDeleteItem.id]);
  }
  /**
   * Handle clickable weapon attacks.
   * @param {Event} ev   The originating click event
   * @param {HTMLElement} target  HTMLElement clicked
   */
  static async _onPerformAttack(ev, target) {
    const attackType = target.dataset.attackType || "single";
    const rof = target.dataset.rof ? parseInt(target.dataset.rof, 10) : 1;
    const item = getItemFromTarget(target, this.actor);
    const showThrowDiag = game.settings.get("twodsix", "invertSkillRollShiftClick") ? ev["shiftKey"] : !ev["shiftKey"];
    if (this.options.sheetType?.includes("TwodsixNPCSheet") || ["robot", "animal"].includes(this.actor.type)) {
      await item.resolveUnknownAutoMode(true);
    } else {
      await item.performAttack(attackType, showThrowDiag, rof);
    }
  }
  /**
   * An event that occurs when a drag workflow begins for a draggable item on the sheet.
   * @param {DragEvent} event       The initiating drag start event
   * @returns {Promise<void>}
   * @protected
   */
  _onDragStart(ev) {
    let li = ev.currentTarget.closest(".item");
    let dragData;
    if (li?.dataset) {
      if ("link" in event.target.dataset) {
        return;
      }
      if (li.dataset.itemId) {
        const item = this.actor.items.get(li.dataset.itemId);
        dragData = item.toDragData();
      }
    } else {
      li = ev.currentTarget.closest(".effect");
      if (li?.dataset.uuid) {
        const effect = fromUuidSync(li.dataset.uuid);
        dragData = effect.toDragData();
      }
    }
    if (!dragData) {
      return;
    }
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }
  /**
   * An event that occurs when a drag workflow moves over a drop target.
   * @param {DragEvent} event
   * @protected
   */
  _onDragOver(ev) {
    super._onDragOver(ev);
  }
  /* -------------------------------------------- */
  /**
   * Handle show in chat click
   * @param {Event} ev   The originating click event
   * @static
   */
  static _onShowInChat(ev, target) {
    const item = getItemFromTarget(target, this.actor);
    if (item) {
      item.sendDescriptionToChat();
    }
  }
  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} ev   The originating click event
   * @static
   */
  static async _onItemCreate(ev, target) {
    ev.preventDefault();
    const { type, subtype } = target.dataset;
    const itemType = type === "skills" ? "skill" : type;
    let itemName = game.i18n.localize("TWODSIX.Items.Items.New") + " ";
    if (type === "component") {
      itemName += game.i18n.localize("TWODSIX.Items.Component." + (subtype || "otherInternal"));
    } else {
      itemName += game.i18n.localize("TWODSIX.itemTypes." + itemType);
    }
    if (type === "skills") {
      itemName = this.actor.generateUniqueSkillName(itemName);
    }
    const itemData = {
      name: itemName,
      type,
      system: {}
    };
    updateWithItemSpecificValues(itemData, itemType, ["component", "consumable"].includes(itemType) ? subtype : "", this.actor);
    await this.actor.createEmbeddedDocuments("Item", [itemData]);
  }
  /**
   * Handle editing an item
   * @param {Event} ev   The originating click event
   * @static
   */
  static _onItemEdit(ev, target) {
    const li = target.closest(".item");
    const item = this.actor.items.get(li.dataset.itemId);
    item?.sheet?.render({ force: true });
  }
  /**
   * Handle selecting an item element to edit
   * @param {Event} ev   The originating click event
   * @static
   */
  static _onItemSelect(ev, target) {
    target.select();
  }
  /**
   * Handle editing a consumable
   * @param {Event} ev   The originating click event
   * @static
   */
  static _onEditConsumable(ev, target) {
    const li = target.closest(".consumable-row");
    const item = this.actor.items.get(li.dataset.consumableId);
    item?.sheet?.render({ force: true });
  }
  /**
   * Process dropped information.
   */
  async _onDrop(ev) {
    ev.preventDefault();
    const dropData = getDataFromDropEvent(ev);
    const actor = this.actor;
    if (!dropData) {
      console.log(`Twodsix | Dragging something that can't be dragged`);
      return false;
    }
    if (actor.type === "traveller" && dropData.type === "Actor") {
      ui.notifications.warn("TWODSIX.Warnings.CantDragActorOntoActor", { localize: true });
      return false;
    }
    if (dropData.type === "damageItem") {
      const useInvertedShiftClick = game.settings.get("twodsix", "invertSkillRollShiftClick");
      const showDamageDialog = useInvertedShiftClick ? ev["shiftKey"] : !ev["shiftKey"];
      return actor.handleDamageData(dropData.payload, showDamageDialog);
    } else if (dropData.type === "Scene") {
      if (actor.type === "ship") {
        const scene = await fromUuid(dropData.uuid);
        await actor.update({ "system.deckPlan": scene.id });
      }
      return false;
    } else if (["html", "pdf", "JournalEntry"].includes(dropData.type)) {
      if (dropData.href) {
        await this.actor.update({ system: { pdfReference: { type: dropData.type, href: dropData.href, label: dropData.label } } });
      } else if (dropData.uuid) {
        await this.actor.update({ system: { pdfReference: { type: dropData.type, href: dropData.uuid, label: dropData.type } } });
      }
      return false;
    } else if (dropData.type === "Item") {
      const droppedItem = await getDocFromDropData(dropData);
      return await this.processDroppedItem(ev, droppedItem);
    } else if (dropData.type === "ActiveEffect") {
      const droppedEffect = await fromUuid(dropData.uuid);
      await this.onDropActiveEffect(ev, droppedEffect);
    } else if (dropData.type === "Folder") {
      const droppedFolder = await fromUuid(dropData.uuid);
      await this.actor.handleDroppedFolder(droppedFolder);
    } else if (dropData.type === "ItemList") {
      await this.actor.handleDroppedList(dropData.parseString);
    } else {
      console.log(`Unknown Drop Type ${dropData.type}`);
      return false;
    }
  }
  async processDroppedItem(ev, dropedItem) {
    const sameActor = this.actor.items.get(dropedItem._id);
    if (sameActor) {
      const dropTargetId = ev.target.closest("[data-item-id]")?.dataset?.itemId;
      const targetItem = this.actor.items.get(dropTargetId);
      const sortSetting = ["ship", "vehicle"].includes(this.actor.type) ? "allowDragDropOfListsShip" : "allowDragDropOfListsActor";
      if (dropTargetId !== "" && !targetItem?.getFlag("twodsix", "untrainedSkill") && game.settings.get("twodsix", sortSetting) && !sameActor.getFlag("twodsix", "untrainedSkill")) {
        console.log(`Twodsix | Moved item ${dropedItem.name} to another position in the ITEM list`);
        return !!await this._onSortItem(ev, dropedItem);
      } else {
        return false;
      }
    }
    return await this.actor.handleDroppedItem(dropedItem);
  }
  /**
   * Handle a dropped Active Effect on the Actor Sheet.
   * The default implementation creates an Active Effect embedded document on the Actor.
   * @param {DragEvent} ev       The initiating drop event
   * @param {TwodsixActiveEffect} effect   The dropped ActiveEffect document
   * @returns {Promise<void>}
   * @protected
   */
  async onDropActiveEffect(ev, effect) {
    if (!this.actor.isOwner) {
      return;
    }
    this.actor.handleDroppedActiveEffect(effect);
  }
  _prepareItemContainers(context) {
    const actor = this.actor;
    context.container = actor.itemTypes;
    const items = actor.items;
    const component = {};
    const counters = { numberOfSkills: 0, skillRanks: 0, buildPoints: 0 };
    const summaryStatus = {};
    const skillsList = [];
    const skillGroups = {};
    const statusOrder = { "operational": 1, "damaged": 2, "destroyed": 3, "off": 0 };
    for (const it of items) {
      if (["traveller", "animal", "robot"].includes(actor.type)) {
        if (it.type === "skills") {
          this._processSkillItem(it, actor, skillGroups, skillsList, counters);
        }
      }
      if (["traveller"].includes(actor.type) && it.type === "consumable") {
        const parentItem = actor.items.find((i) => i.system.consumables?.includes(it.id));
        if (parentItem) {
          it.system.parentName = parentItem.name;
          it.system.parentType = parentItem.type;
        }
      }
      if (["robot"].includes(actor.type) && it.type === "augment") {
        counters.buildPoints += it.system.buildPoints ?? 0;
      }
      if (it.type === "component") {
        if (component[it.system.subtype] === void 0) {
          component[it.system.subtype] = [];
          summaryStatus[it.system.subtype] = {
            status: it.system.status,
            uuid: it.uuid
          };
        }
        if (it.system.subtype === "armament" && it.system.ammoLink !== "none") {
          const linkedAmmo = actor.items.get(it.system.ammoLink);
          if (linkedAmmo) {
            it.system.ammoDamage = linkedAmmo.system.damage;
          }
        }
        component[it.system.subtype].push(it);
        if (statusOrder[summaryStatus[it.system.subtype].status] < statusOrder[it.system.status]) {
          summaryStatus[it.system.subtype] = {
            status: it.system.status,
            uuid: it.uuid
          };
        }
      }
    }
    context.container.equipmentAndTools = actor.itemTypes.equipment.concat(actor.itemTypes.tool).concat(actor.itemTypes.computer);
    context.container.storageAndJunk = actor.itemTypes.storage.concat(actor.itemTypes.junk);
    context.container.skillsList = skillsList;
    context.container.skillGroups = sortObj(skillGroups);
    if (["traveller"].includes(actor.type)) {
      context.jackOfAllTrades = context.untrainedSkill ? _AbstractTwodsixActorSheet.untrainedToJoat(context.untrainedSkill.system.value) : 0;
      context.numberOfSkills = counters.numberOfSkills + (context.jackOfAllTrades > 0 ? 1 : 0);
      context.numberListedSkills = counters.numberOfSkills;
      context.skillRanks = counters.skillRanks + context.jackOfAllTrades;
    } else if (["ship", "vehicle"].includes(actor.type)) {
      context.componentObject = sortObj(component);
      context.componentObject.allCargo = [...component.cargo ?? [], ...component.ammo ?? []];
      context.summaryStatus = sortObj(summaryStatus);
      context.storage = items.filter((i) => ![...TWODSIX$1.WeightlessItems, "ship_position", "component"].includes(i.type));
      context.container.nonCargo = actor.itemTypes.component.filter((i) => !["cargo", "ammo"].includes(i.system.subtype));
    } else if (["robot"].includes(actor.type)) {
      context.buildPoints = counters.buildPoints;
    }
    context.effects = Array.from(actor.allApplicableEffects());
    const sortSetting = ["ship", "vehicle"].includes(this.type) ? "allowDragDropOfListsShip" : "allowDragDropOfListsActor";
    const sortLabel = game.settings.get("twodsix", sortSetting) ? "sort" : "name";
    for (const key of Object.keys(context.container)) {
      if (key !== "skillGroups") {
        context.container[key].sort(
          (a, b) => sortLabel === "sort" ? a[sortLabel] - b[sortLabel] : a[sortLabel].localeCompare(b[sortLabel])
        );
      } else {
        for (const groupKey of Object.keys(context.container.skillGroups)) {
          const group = context.container.skillGroups[groupKey];
          group.sort(
            (a, b) => sortLabel === "sort" ? a[sortLabel] - b[sortLabel] : a[sortLabel].localeCompare(b[sortLabel])
          );
        }
      }
    }
  }
  /**
   * Precompute all tooltips for characteristics, skills, encumbrance, armor, and info fields,
   * and store them under context.tooltips for use in Handlebars templates.
   * @param {object} context - The sheet context object to augment with tooltips.
   */
  _prepareTooltips(context) {
    context.tooltips = {};
    for (const [key, char] of Object.entries(context.system.characteristics)) {
      if (!char.displayChar) {
        continue;
      }
      foundry.utils.mergeObject(context.tooltips, {
        [`characteristics.${key}`]: {
          value: computeTwodsixTooltip(this.actor, `system.characteristics.${key}.value`),
          mod: computeTwodsixTooltip(this.actor, `system.characteristics.${key}.mod`)
        }
      });
    }
    if (context.container?.skillsList) {
      for (const skill of context.container.skillsList) {
        foundry.utils.mergeObject(context.tooltips, {
          [`skills.${simplifySkillName(skill.name)}`]: computeTwodsixTooltip(this.actor, `system.skills.${simplifySkillName(skill.name)}`)
        });
      }
    }
    const fieldsToProcess = [
      "age.value",
      "radiationDose.value",
      "movement.walk",
      "encumbrance.max",
      "encumbrance.offset",
      "encumbrance.value",
      "primaryArmor.value",
      "secondaryArmor.value",
      "radiationProtection.value",
      "armorDM",
      "armorType",
      "reaction.attack",
      "reaction.flee",
      "moraleDM",
      "xpNotes",
      "description",
      "contacts",
      "bio"
    ];
    for (const field of fieldsToProcess) {
      if (foundry.utils.hasProperty(context.system, field)) {
        if (field === "encumbrance.offset") {
          foundry.utils.setProperty(context.tooltips, "encumbrance.max", [context.tooltips.encumbrance.max ?? "", computeTwodsixTooltip(this.actor, `system.${field}`)].join(" "));
        } else {
          foundry.utils.setProperty(context.tooltips, field, computeTwodsixTooltip(this.actor, `system.${field}`));
        }
      }
    }
  }
  static untrainedToJoat(skillValue) {
    if (game.settings.get("twodsix", "ruleset") === "CT") {
      return skillValue >= 0 ? 1 : 0;
    } else {
      return skillValue - CONFIG.Item.dataModels.skills.schema.getInitialValue().value;
    }
  }
  static joatToUntrained(joatValue) {
    if (game.settings.get("twodsix", "ruleset") === "CT") {
      return joatValue > 0 ? 0 : CONFIG.Item.dataModels.skills.schema.getInitialValue().value;
    } else {
      return joatValue + CONFIG.Item.dataModels.skills.schema.getInitialValue().value;
    }
  }
  /**
   * Handle when the roll initiative button is pressed.
   * @param {Event} ev   The originating click event
   * @param {HTMLElement} target The target element
   * @private
   */
  static async _onRollInitiative(ev) {
    if (!canvas.tokens?.ownedTokens.find((t) => t.actor?.id === this.actor.id)) {
      ui.notifications.warn("TWODSIX.Warnings.NoActiveToken", { localize: true });
      return;
    } else if (this.token?.combatant && this.token?.combatant.initiative !== null) {
      ui.notifications.warn("TWODSIX.Warnings.ActorHasInitiativeAlready", { localize: true });
      return;
    } else if (!this.actor.isToken && game.combat?.combatants?.find((c) => c.actor?.id === this.actor.id)?.initiative) {
      ui.notifications.warn("TWODSIX.Warnings.ActorHasInitiativeAlready", { localize: true });
      return;
    }
    const useInvertedShiftClick = game.settings.get("twodsix", "invertSkillRollShiftClick");
    const showThrowDiag = useInvertedShiftClick ? ev["shiftKey"] : !ev["shiftKey"];
    const dialogData = {
      shouldRoll: false,
      rollType: "Normal",
      rollTypes: getRollTypeSelectObject(),
      diceModifier: "",
      rollMode: game.settings.get("core", "rollMode"),
      rollModes: CONFIG.Dice.rollModes,
      rollFormula: game.settings.get("twodsix", "initiativeFormula")
    };
    if (showThrowDiag) {
      await this.initiativeDialog(dialogData);
      if (dialogData.shouldRoll) {
        if (dialogData.rollType !== "Normal") {
          if (dialogData.rollType === "Advantage") {
            dialogData.rollFormula = dialogData.rollFormula.replace("2d6", "3d6kh2");
          } else if (dialogData.rollType === "Disadvantage") {
            dialogData.rollFormula = dialogData.rollFormula.replace("2d6", "3d6kl2");
          }
        }
        if (dialogData.diceModifier !== "") {
          dialogData.rollFormula += "+" + dialogData.diceModifier;
        }
      } else {
        return;
      }
    }
    if (this.token?.combatant?.id) {
      game.combat?.rollInitiative(this.token.combatant.id, { formula: dialogData.rollFormula, messageOptions: { rollMode: dialogData.rollMode } });
    } else {
      this.actor.rollInitiative({ createCombatants: true, rerollInitiative: false, initiativeOptions: { formula: dialogData.rollFormula, messageOptions: { rollMode: dialogData.rollMode } } });
    }
  }
  async initiativeDialog(dialogData) {
    const template = "systems/twodsix/templates/chat/initiative-dialog.hbs";
    const buttons = [
      {
        action: "ok",
        label: "TWODSIX.Rolls.Roll",
        icon: "fa-solid fa-dice",
        default: true,
        callback: /* @__PURE__ */ __name$W((event2, button, dialog) => {
          const formElements = dialog.element.querySelector(".standard-form").elements;
          dialogData.shouldRoll = true;
          dialogData.rollType = formElements["rollType"]?.value;
          dialogData.diceModifier = formElements["diceModifier"]?.value;
          dialogData.rollMode = formElements["rollMode"]?.value;
          dialogData.rollFormula = formElements["rollFormula"]?.value;
        }, "callback")
      },
      {
        action: "cancel",
        icon: "fa-solid fa-xmark",
        label: "Cancel",
        callback: /* @__PURE__ */ __name$W(() => {
          dialogData.shouldRoll = false;
        }, "callback")
      }
    ];
    const html = await foundry.applications.handlebars.renderTemplate(template, dialogData);
    return new Promise((resolve) => {
      new foundry.applications.api.DialogV2({
        window: { title: "TWODSIX.Rolls.RollInitiative", icon: "fa-solid fa-dice" },
        content: html,
        buttons,
        submit: /* @__PURE__ */ __name$W(() => {
          resolve();
        }, "submit")
      }).render({ force: true });
    });
  }
  /**
   * Handle clickable skill and talent rolls.
   * @param {Event} ev   The originating click event
   * @param {HTMLElement} target  HTML element clicked
   * @static
   */
  static async _onSkillTalentRoll(ev, target) {
    const showThrowDiag = game.settings.get("twodsix", "invertSkillRollShiftClick") ? ev["shiftKey"] : !ev["shiftKey"];
    const item = getItemFromTarget(target, this.actor);
    if (item) {
      item.doSkillTalentRoll(showThrowDiag);
    }
  }
  /**
   * Handle clickable characteristics rolls.
   * @param {Event} ev   The originating click event
   * @param {HTMLElement} target  the clicked html element
   * @static
   */
  static async _onRollChar(ev, target) {
    const shortChar = target.dataset.label;
    const showThrowDiag = game.settings.get("twodsix", "invertSkillRollShiftClick") ? ev["shiftKey"] : !ev["shiftKey"];
    await this.actor.characteristicRoll({ rollModifiers: { characteristic: shortChar } }, showThrowDiag);
  }
  /**
   * Update an item value when edited on skill or inventory tab.
   * @param {Event} ev  The originating input event
   * @private
   */
  async _onItemValueEdit(ev) {
    const newValue = parseInt(ev.currentTarget["value"], 10);
    const li = ev.currentTarget.closest(".item");
    const itemSelected = this.actor.items.get(li.dataset.itemId);
    if (itemSelected && Number.isInteger(newValue)) {
      if (itemSelected.type === "skills") {
        await itemSelected.update({ "system.value": newValue });
      } else if (itemSelected.type === "consumable") {
        await itemSelected.update({ "system.quantity": newValue });
      }
    }
  }
  /**
   * Handle when the clicking on status icon.
   * @param {Event} ev   The originating click event
   * @private
   */
  async _onEditEffect(ev) {
    const target = ev.currentTarget;
    const effectUuid = target.dataset.uuid;
    const selectedEffect = await fromUuid(effectUuid);
    if (selectedEffect) {
      await new foundry.applications.sheets.ActiveEffectConfig({ document: selectedEffect }).render({ force: true });
    }
  }
  /**
   * Handle when the right clicking on status icon.
   * @param {Event} ev   The originating click event
   * @private
   */
  async _onDeleteEffect(ev) {
    const target = ev.currentTarget;
    const effectUuid = target.dataset.uuid;
    const selectedEffect = await fromUuid(effectUuid);
    if (await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("TWODSIX.ActiveEffects.DeleteEffect") },
      content: game.i18n.localize("TWODSIX.ActiveEffects.ConfirmDelete")
    })) {
      await selectedEffect.delete();
    }
  }
  //THIS NEEDS TO BE CHECKED LATER
  async _modifyEffect(ev) {
    ev.preventDefault();
    const target = ev.currentTarget;
    const action = target.dataset.controlaction;
    if (action === "delete") {
      await this._onDeleteEffect(ev);
    } else if (action === "edit") {
      await this._onEditEffect(ev);
    } else if (action === "toggle") {
      const selectedEffect = await fromUuid(target.dataset.uuid);
      if (selectedEffect) {
        await selectedEffect.update({ disabled: !selectedEffect.disabled });
      }
    } else if (action === "create") {
      await this.actor.createEmbeddedDocuments("ActiveEffect", [{
        name: game.i18n.localize("TWODSIX.ActiveEffects.NewEffect"),
        icon: "icons/svg/aura.svg",
        origin: "Custom",
        disabled: false,
        description: ""
      }]);
    } else {
      console.log("Unknown Action");
    }
  }
  static async _onAdjustCounter(ev, target) {
    const modifier = parseInt(target.dataset.value, 10);
    const field = target.closest(".combined-buttons")?.dataset.field;
    const li = target.closest(".item");
    const itemSelected = this.actor.items.get(li.dataset.itemId);
    if (itemSelected && field) {
      if (field === "hits") {
        const newHits = itemSelected.system.hits + modifier;
        if (newHits <= game.settings.get("twodsix", "maxComponentHits") && newHits >= 0) {
          await itemSelected.update({ "system.hits": newHits });
        }
        if (newHits === game.settings.get("twodsix", "maxComponentHits")) {
          await itemSelected.update({ "system.status": "destroyed" });
        } else if (newHits > 0 && itemSelected.system.status !== "off") {
          await itemSelected.update({ "system.status": "damaged" });
        } else if (newHits === 0 && itemSelected.system.status !== "off") {
          await itemSelected.update({ "system.status": "operational" });
        }
      } else if (field === "ammo") {
        const newAmmo = itemSelected.system.ammunition.value + modifier;
        if (newAmmo >= 0 && newAmmo <= itemSelected.system.ammunition.max) {
          await itemSelected.update({ "system.ammunition.value": newAmmo });
        }
      }
    }
  }
  static async _onReloadMagazine(ev, target) {
    const li = target.closest(".item");
    const itemSelected = this.actor.items.get(li.dataset.itemId);
    if (itemSelected.system.ammoLink === "none") {
      ui.notifications.warn("TWODSIX.Warnings.NoLinkedAmmo", { localize: true });
      return;
    }
    const sourceAmmo = this.actor.items.get(itemSelected.system.ammoLink);
    if (!sourceAmmo) {
      ui.notifications.warn("TWODSIX.Warnings.AmmoNotFound", { localize: true });
      await itemSelected.update({ "system.ammoLink": "none" });
      return;
    }
    if (sourceAmmo.system.quantity <= 0) {
      ui.notifications.warn("TWODSIX.Warnings.NoAmmoToReload", { localize: true });
      return;
    }
    const reloadAmount = Math.max(0, Math.min(itemSelected.system.ammunition.max - itemSelected.system.ammunition.value, sourceAmmo.system.quantity));
    await this.actor.updateEmbeddedDocuments("Item", [
      { _id: itemSelected.id, "system.ammunition.value": itemSelected.system.ammunition.value + reloadAmount },
      { _id: sourceAmmo.id, "system.quantity": sourceAmmo.system.quantity - reloadAmount }
    ]);
  }
  //These aren't necessary with change to prosemirror
  handleContentEditable(element) {
    element.querySelectorAll('div[contenteditable="true"][data-edit]')?.forEach((el) => {
      el.addEventListener("focusout", this._onChangeContenteditable.bind(this));
    });
    element.querySelectorAll('div[contenteditable="true"][data-edit]')?.forEach((el) => {
      el.addEventListener("paste", onPasteStripFormatting.bind(this));
    });
  }
  /** @override */
  // Not really needed with change to prosemirror
  async _onChangeContenteditable(ev) {
    if (ev.currentTarget?.name !== "type") {
      const formField = ev.currentTarget?.closest('div[contenteditable="true"][data-edit]');
      if (formField) {
        const target = formField.dataset?.edit;
        const newValue = formField.closest('div[contenteditable="true"][data-edit]').innerHTML;
        if (target) {
          this.actor.update({ [target]: newValue });
        }
      }
    }
  }
  /**
   * Processes a skill item for an actor, updating skill counters and organizing skills into groups.
   *
   * - Increments the number of skills and total skill ranks if the skill is trained.
   * - Adds displayable skills to the skills list.
   * - For traveller actors, organizes skills into groups and ensures displaySkillGroup is initialized.
   *
   * @param item - The skill item to process.
   * @param actor - The actor owning the skill.
   * @param skillGroups - An object mapping skill group labels to arrays of skill items.
   * @param skillsList - The array to which displayable skills are added.
   * @param counters - An object containing skill counters: numberOfSkills and skillRanks.
   */
  _processSkillItem(item, actor, skillGroups, skillsList, counters) {
    var _a;
    if (item.system.value >= 0 && !item.getFlag("twodsix", "untrainedSkill")) {
      counters.numberOfSkills++;
      counters.skillRanks += Number(item.system.value);
    }
    if (isDisplayableSkill(item)) {
      if (actor.type === "traveller") {
        const groupLabel = item.system.groupLabel || game.i18n.localize("TWODSIX.Actor.Skills.NoGroup");
        skillGroups[groupLabel] ?? (skillGroups[groupLabel] = []);
        skillGroups[groupLabel].push(item);
        (_a = actor.system.displaySkillGroup)[groupLabel] ?? (_a[groupLabel] = false);
      }
      skillsList.push(item);
    }
  }
};
__name$W(_AbstractTwodsixActorSheet, "AbstractTwodsixActorSheet");
_AbstractTwodsixActorSheet.DEFAULT_OPTIONS = {
  actions: {
    itemCreate: _AbstractTwodsixActorSheet._onItemCreate,
    itemEdit: _AbstractTwodsixActorSheet._onItemEdit,
    itemDelete: _AbstractTwodsixActorSheet._onItemDelete,
    editConsumable: _AbstractTwodsixActorSheet._onEditConsumable,
    openPDFLink,
    deleteReference,
    adjustCounter: _AbstractTwodsixActorSheet._onAdjustCounter,
    reloadMagazine: _AbstractTwodsixActorSheet._onReloadMagazine,
    showChat: _AbstractTwodsixActorSheet._onShowInChat,
    performAttack: _AbstractTwodsixActorSheet._onPerformAttack,
    skillTalentRoll: _AbstractTwodsixActorSheet._onSkillTalentRoll,
    rollChar: _AbstractTwodsixActorSheet._onRollChar,
    rollDamage: onRollDamage,
    rollInitiative: _AbstractTwodsixActorSheet._onRollInitiative,
    selectItem: _AbstractTwodsixActorSheet._onItemSelect,
    openJournalEntry
  }
};
let AbstractTwodsixActorSheet = _AbstractTwodsixActorSheet;
function setCharacteristicDisplay(context) {
  const charMode = game.settings.get("twodsix", "showAlternativeCharacteristics");
  context.system.characteristics.alternative1.displayChar = ["alternate", "all"].includes(charMode) && (context.system.characteristics.alternative1.value !== 0 || !game.settings.get("twodsix", "omitALTifZero"));
  context.system.characteristics.alternative2.displayChar = ["alternate", "all"].includes(charMode) && (context.system.characteristics.alternative2.value !== 0 || !game.settings.get("twodsix", "omitALTifZero"));
  context.system.characteristics.alternative3.displayChar = ["all"].includes(charMode) && (context.system.characteristics.alternative3.value !== 0 || !game.settings.get("twodsix", "omitALTifZero"));
  context.system.characteristics.dexterity.displayChar = true;
  context.system.characteristics.education.displayChar = context.system.characteristics.education.value !== 0 || !game.settings.get("twodsix", "omitALTifZero");
  context.system.characteristics.endurance.displayChar = true;
  context.system.characteristics.intelligence.displayChar = context.system.characteristics.intelligence.value !== 0 || !game.settings.get("twodsix", "omitALTifZero");
  context.system.characteristics.lifeblood.displayChar = false;
  context.system.characteristics.psionicStrength.displayChar = ["base", "all"].includes(charMode) && (context.system.characteristics.psionicStrength.value !== 0 || !game.settings.get("twodsix", "omitPSIifZero"));
  context.system.characteristics.socialStanding.displayChar = context.system.characteristics.socialStanding.value !== 0 || !game.settings.get("twodsix", "omitALTifZero");
  context.system.characteristics.stamina.displayChar = false;
  context.system.characteristics.strength.displayChar = true;
}
__name$W(setCharacteristicDisplay, "setCharacteristicDisplay");
function getDisplayOrder(context) {
  const returnValue = ["strength", "intelligence", "dexterity", "education", "endurance", "socialStanding"];
  const charMode = game.settings.get("twodsix", "showAlternativeCharacteristics");
  switch (charMode) {
    case "core":
      break;
    case "base":
      if (context.system.characteristics.psionicStrength.value !== 0 || !game.settings.get("twodsix", "omitPSIifZero")) {
        returnValue.push("psionicStrength");
      }
      break;
    case "alternate":
    case "all": {
      const altList = ["alternative1", "alternative2", "alternative3"];
      if (charMode === "alternate") {
        altList.pop();
      } else {
        altList.push("psionicStrength");
      }
      for (const key of altList) {
        const displaySetting = key === "psionicStrength" ? game.settings.get("twodsix", "omitPSIifZero") : game.settings.get("twodsix", "omitALTifZero");
        if (context.system.characteristics[key].value !== 0 || !displaySetting) {
          returnValue.push(key);
        }
      }
      break;
    }
  }
  return returnValue;
}
__name$W(getDisplayOrder, "getDisplayOrder");
function updateWithItemSpecificValues(itemData, type, subtype = "otherInternal", actor) {
  switch (type) {
    case "skills":
      if (!game.settings.get("twodsix", "hideUntrainedSkills")) {
        const initialValue = CONFIG.Item.dataModels.skills.schema.getInitialValue().value;
        itemData.system.value = initialValue;
      } else {
        itemData.system.value = 0;
      }
      break;
    case "weapon":
      if (game.settings.get("twodsix", "hideUntrainedSkills")) {
        itemData.system.skill = actor.getUntrainedSkill().id;
      }
      if (!itemData.img) {
        itemData.img = "systems/twodsix/assets/icons/default_weapon.png";
      }
      break;
    case "component":
      itemData.system.subtype = subtype || "otherInternal";
      if (subtype === "power") {
        itemData.system.generatesPower = true;
      }
      itemData.system.status = "operational";
      itemData.img = "systems/twodsix/assets/icons/components/" + itemData.system.subtype + ".svg";
      break;
    case "spell":
      if (!itemData.img) {
        itemData.img = "systems/twodsix/assets/icons/spell-book.svg";
      }
      if (!itemData.system.associatedSkillName) {
        itemData.system.associatedSkillName = game.settings.get("twodsix", "sorcerySkill") ?? "";
      }
      break;
    case "consumable":
      itemData.system.subtype = "other";
      if (subtype === "attachment") {
        itemData.system.isAttachment = true;
        itemData.name = game.i18n.localize("TWODSIX.Items.Equipment.NewAttachment");
      } else {
        itemData.system.max = 1;
      }
      break;
    case "psiAbility":
      if (!itemData.img) {
        itemData.img = "systems/twodsix/assets/icons/extra-lucid.svg";
      }
      break;
  }
}
__name$W(updateWithItemSpecificValues, "updateWithItemSpecificValues");
function getItemFromTarget(target, actor) {
  const itemId = target.closest(".item").dataset.itemId;
  return actor.items.get(itemId);
}
__name$W(getItemFromTarget, "getItemFromTarget");
function computeTwodsixTooltip(actor, field) {
  if (!actor) {
    return "";
  }
  const modes = [
    `<i class="fa-regular fa-circle-question"></i>`,
    `<i class="fa-regular fa-circle-xmark"></i>`,
    `<i class="fa-solid fa-circle-plus"></i>`,
    `<i class="fa-regular fa-circle-down"></i>`,
    `<i class="fa-regular fa-circle-up"></i>`,
    `<i class="fa-solid fa-shuffle"></i>`
  ];
  if (foundry.utils.getProperty(actor.overrides, field) === void 0) {
    return "";
  }
  let tooltip = field.includes("Armor") ? `- ` : ``;
  const baseText = game.i18n.localize("TWODSIX.ActiveEffects.BaseValue");
  const modifierText = game.i18n.localize("TWODSIX.ActiveEffects.Modifiers");
  let baseValue;
  if (field.startsWith("system.skills.")) {
    const simplifiedName = field.slice(14);
    const coreSkill = actor.itemTypes.skills.find((sk) => simplifySkillName(sk.name) === simplifiedName);
    baseValue = coreSkill?.system.value;
  } else if (["system.encumbrance.max", "system.encumbrance.offset"].includes(field)) {
    baseValue = actor.getMaxEncumbrance(false);
  } else if (field.endsWith(".mod")) {
    baseValue = calcModFor(foundry.utils.getProperty(actor._source, field.replace("mod", "value")));
  } else if (["system.primaryArmor.value"].includes(field) && actor.type === "traveller") {
    baseValue = actor.system.primaryArmor.base;
  } else {
    baseValue = foundry.utils.getProperty(actor._source, field);
  }
  if (baseValue === foundry.utils.getProperty(actor, field)) {
    baseValue = void 0;
  }
  tooltip += `${baseText}: ${isNaN(baseValue) ? "?" : baseValue}. ${modifierText}: `;
  const effectStrings = [];
  for (const effect of actor.appliedEffects) {
    const realChanges = effect.changes.filter((ch) => ch.key === field);
    if (realChanges.length > 0) {
      const changesStr = realChanges.map(
        (change) => `${modes[change.mode] || ""}(${change.value})`
      ).join(", ");
      effectStrings.push(`${effect.name}: ${changesStr}`);
    }
  }
  tooltip += effectStrings.length > 0 ? effectStrings.join("; ") : game.i18n.localize("TWODSIX.ActiveEffects.None");
  return tooltip;
}
__name$W(computeTwodsixTooltip, "computeTwodsixTooltip");

var __defProp$V = Object.defineProperty;
var __name$V = (target, value) => __defProp$V(target, "name", { value, configurable: true });
const _TwodsixTravellerSheet = class _TwodsixTravellerSheet extends foundry.applications.api.HandlebarsApplicationMixin(AbstractTwodsixActorSheet) {
  /** @inheritDoc */
  _initializeApplicationOptions(options) {
    const applicationOptions = super._initializeApplicationOptions(options);
    if (applicationOptions.sheetType !== "TwodsixNPCSheet") {
      applicationOptions.position.width = game.settings.get("twodsix", "defaultActorSheetWidth");
      applicationOptions.position.height = game.settings.get("twodsix", "defaultActorSheetHeight");
      applicationOptions.dragDrop = [{ dragSelector: ".item", dropSelector: null }, { dragSelector: ".effect", dropSelector: null }];
    } else {
      applicationOptions.dragDrop = [{ dragSelector: ".item-name", dropSelector: null }];
    }
    return applicationOptions;
  }
  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    if (game.settings.get("twodsix", "useProseMirror")) {
      const TextEditorImp = foundry.applications.ux.TextEditor.implementation;
      context.richText = {
        description: await TextEditorImp.enrichHTML(context.system.description, { secrets: this.document.isOwner }),
        contacts: await TextEditorImp.enrichHTML(context.system.contacts, { secrets: this.document.isOwner }),
        bio: await TextEditorImp.enrichHTML(context.system.bio, { secrets: this.document.isOwner }),
        notes: await TextEditorImp.enrichHTML(context.system.notes, { secrets: this.document.isOwner }),
        xpNotes: await TextEditorImp.enrichHTML(context.system.xpNotes, { secrets: this.document.isOwner })
      };
    }
    Object.assign(context.settings, {
      ShowDoubleTap: game.settings.get("twodsix", "ShowDoubleTap"),
      showSkillCountsRanks: game.settings.get("twodsix", "showSkillCountsRanks"),
      useNationality: game.settings.get("twodsix", "useNationality"),
      showAllCharWithTable: game.settings.get("twodsix", "showAllCharWithTable"),
      showSkillGroups: game.settings.get("twodsix", "showSkillGroups"),
      useCEAutofireRules: game.settings.get("twodsix", "autofireRulesUsed") === TWODSIX$1.RULESETS.CE.key,
      useCTAutofireRules: game.settings.get("twodsix", "autofireRulesUsed") === TWODSIX$1.RULESETS.CT.key,
      useCELAutofireRules: game.settings.get("twodsix", "autofireRulesUsed") === TWODSIX$1.RULESETS.CEL.key,
      useCUAutofireRules: game.settings.get("twodsix", "autofireRulesUsed") === TWODSIX$1.RULESETS.CU.key,
      showTotalArmor: game.settings.get("twodsix", "showTotalArmor") && !(this.actor.system.totalArmor > 0 && this.actor.system.totalArmor < 1),
      //total armor doesn't make sense with armor that blocks a percentage
      showTraitAE: game.settings.get("twodsix", "showTraitAE")
    });
    context.ACTIVE_EFFECT_MODES = Object.entries(CONST.ACTIVE_EFFECT_MODES).reduce((ret, entry) => {
      const [key, value] = entry;
      ret[value] = key;
      return ret;
    }, {});
    for (const effect of context.effects) {
      if (["dead", "unconscious", "wounded", "encumbered"].includes(Array.from(effect.statuses)[0])) {
        effect.sourceLabel = game.i18n.localize("TWODSIX.ActiveEffects.Condition");
      } else if (effect.origin && !effect.origin?.includes("Compendium")) {
        const attachedItem = fromUuidSync(effect.origin);
        if (attachedItem) {
          effect.sourceLabel = attachedItem.name ?? game.i18n.localize("TWODSIX.ActiveEffects.UnknownSource");
        } else {
          effect.sourceLabel = effect.parent.name;
        }
      } else if (effect.parent.documentName === "Item") {
        effect.sourceLabel = effect.parent.name;
      } else {
        effect.sourceLabel = game.i18n.localize("TWODSIX.ActiveEffects.UnknownSource");
      }
    }
    return context;
  }
  async _onRender(context, options) {
    await super._onRender(context, options);
    if (this.options.sheetType === "TwodsixTravellerSheet") {
      this.element.querySelector(".window-content").classList.add("overlap-header");
      this.element.querySelector(".window-header").classList.add("transparent-header");
    }
    if (!context.editable) {
      return;
    }
    this.element.querySelector(".joat-skill-input")?.addEventListener("input", this._updateJoatSkill.bind(this));
    this.element.querySelector(".joat-skill-input")?.addEventListener("blur", this._onJoatSkillBlur.bind(this));
  }
  /**
   * Handle when the joat skill is changed.
   * @param {Event} ev   The originating click event
   * @private
   */
  async _updateJoatSkill(ev) {
    const joatValue = parseInt(ev.currentTarget.value, 10);
    const skillValue = AbstractTwodsixActorSheet.joatToUntrained(joatValue);
    if (!isNaN(joatValue) && joatValue >= 0 && skillValue <= 0) {
      const untrainedSkill = this.actor.getUntrainedSkill();
      untrainedSkill.update({ "system.value": skillValue });
    } else if (ev.currentTarget.value !== "") {
      ev.currentTarget.value = "";
    }
  }
  /**
   * Handle when user tabs out and leaves blank value.
   * @param {Event} ev   The originating click event
   * @private
   */
  async _onJoatSkillBlur(ev) {
    if (isNaN(parseInt(ev.currentTarget.value, 10))) {
      const skillValue = this.actor.getUntrainedSkill().system.value;
      ev.currentTarget.value = AbstractTwodsixActorSheet.untrainedToJoat(skillValue);
    }
  }
  getConsumableItem(ev, target) {
    const itemId = target.closest(".consumable-row").dataset.consumableId;
    return this.actor.items.get(itemId);
  }
  static _onToggleAttachmentsList(ev, target) {
    ev.preventDefault();
    const item = this.actor.items.get(target.dataset.itemId);
    const newState = !target.open;
    item.showAttachmentsList = newState;
    target.open = newState;
  }
  static _onToggleConsumablesList(ev, target) {
    ev.preventDefault();
    const item = this.actor.items.get(target.dataset.itemId);
    const newState = !target.open;
    item.showConsumablesList = newState;
    target.open = newState;
  }
  static async _onAdjustConsumableCount(ev, target) {
    const modifier = parseInt(target.dataset.value, 10);
    const item = this.getConsumableItem(ev, target);
    await item.consume(modifier);
  }
  static async _onRefillConsumable(ev, target) {
    const item = this.getConsumableItem(ev, target);
    try {
      await item.refill();
    } catch (err) {
      if (err.name === "TooLowQuantityError") {
        const refillAction = ["magazine", "power_cell"].includes(item.system.subtype) ? "Reload" : "Refill";
        const refillWord = game.i18n.localize(`TWODSIX.Actor.Items.${refillAction}`).toLocaleLowerCase();
        const tooFewString = game.i18n.localize("TWODSIX.Errors.TooFewToReload");
        ui.notifications.error(tooFewString.replace("_NAME_", item.name?.toLocaleLowerCase() || "???").replace("_REFILL_ACTION_", refillWord));
      } else {
        throw err;
      }
    }
  }
  /**
   * Handle auto add of weapons consumables.
   * @param {Event} ev   The originating click event
   * @param {HTMLElement} target THe clicked html element
   * @private
   */
  static async _onAutoAddConsumable(ev, target) {
    const weaponSelected = this.actor.items.get(target.closest(".item")?.dataset.itemId);
    const max = weaponSelected.system.ammo;
    if (max > 0 && !weaponSelected.system.consumableData?.length) {
      const newConsumableData = {
        name: game.i18n.localize("TWODSIX.Items.Consumable.Types.magazine") + ": " + weaponSelected.name,
        type: "consumable",
        system: {
          subtype: "magazine",
          quantity: 1,
          currentCount: max,
          max,
          equipped: weaponSelected.system.equipped
        }
      };
      const newConsumable = await weaponSelected.actor.createEmbeddedDocuments("Item", [newConsumableData]);
      await weaponSelected.addConsumable(newConsumable[0].id);
      await weaponSelected.update({ "system.useConsumableForAttack": newConsumable[0].id });
    }
  }
  /**
   * Handle toggling the state of an Owned Item within the Actor.
   * @param {Event} ev   The originating click event.
   * @param {HTMLElement} target The DOM element clicked
   * @static
   */
  static async _onToggleItem(ev, target) {
    if (target) {
      const li = target.closest(".item");
      const itemSelected = this.actor.items.get(li.dataset.itemId);
      const newSuspendedState = getNewEquippedState(itemSelected);
      const itemUpdates = [];
      itemUpdates.push({ _id: itemSelected.id, "system.equipped": newSuspendedState });
      for (const consumeableID of itemSelected.system.consumables) {
        const consumableSelected = await itemSelected.actor.items.get(consumeableID);
        if (consumableSelected) {
          itemUpdates.push({ _id: consumableSelected.id, "system.equipped": newSuspendedState });
        }
      }
      await this.actor.updateEmbeddedDocuments("Item", itemUpdates);
      if (this.actor.system.layersWorn > 1 && this.actor.system.wearingNonstackable && itemSelected.type === "armor") {
        ui.notifications.warn("TWODSIX.Warnings.WearingMultipleLayers", { localize: true });
      }
    }
  }
  /**
   * Handle toggling the view state of an Item class.
   * @param {Event} ev   The originating click event.
   * @private
   */
  static async _onViewToggle(ev, target) {
    const itemType = target.dataset.itemType;
    await this.actor.update({ [`system.hideStoredItems.${itemType}`]: !this.actor.system.hideStoredItems[itemType] });
  }
  /**
   * Handle toggling the active consumable.
   * @param {Event} ev   The originating click event.
   * @param {HTMLElement} target The clicked DOM rlement
   * @private
   */
  static async _onToggleConsumable(ev, target) {
    const parentItem = await this.actor.items.get(target.dataset.parentId);
    const consumable = await this.actor.items.get(target.dataset.consumableId);
    if (parentItem?.type === "weapon" && !["software", "processor", "suite"].includes(consumable.system.subtype)) {
      if (parentItem?.system.useConsumableForAttack !== consumable.id) {
        await parentItem.update({ "system.useConsumableForAttack": consumable.id });
      }
    } else {
      if (consumable.system.subtype === "software") {
        await consumable.update({ "system.softwareActive": !consumable.system.softwareActive });
      }
    }
  }
  /**
   * Handle toggling the skill header.
   * @param {Event} event   The originating click event.
   * @param {HTMLElement} target The clicked DOM element
   * @static
   */
  static async _onSkillHeaderToggle(ev, target) {
    const parentKey = target.dataset.parentKey;
    if (parentKey) {
      this.actor.update({ [`system.displaySkillGroup.${parentKey}`]: !this.actor.system.displaySkillGroup[parentKey] });
    }
  }
};
__name$V(_TwodsixTravellerSheet, "TwodsixTravellerSheet");
_TwodsixTravellerSheet.DEFAULT_OPTIONS = {
  classes: ["twodsix", "sheet", "actor"],
  position: {
    width: 900,
    height: 780
  },
  window: {
    resizable: true,
    icon: "fa-solid fa-user-astronaut"
  },
  form: {
    submitOnChange: true,
    submitOnClose: true
  },
  actions: {
    adjustConsumable: _TwodsixTravellerSheet._onAdjustConsumableCount,
    refillConsumable: _TwodsixTravellerSheet._onRefillConsumable,
    autoCreateConsumable: _TwodsixTravellerSheet._onAutoAddConsumable,
    toggleConsumable: _TwodsixTravellerSheet._onToggleConsumable,
    toggleItem: _TwodsixTravellerSheet._onToggleItem,
    toggleView: _TwodsixTravellerSheet._onViewToggle,
    toggleSkillHeader: _TwodsixTravellerSheet._onSkillHeaderToggle,
    toggleAttachmentsList: _TwodsixTravellerSheet._onToggleAttachmentsList,
    toggleConsumablesList: _TwodsixTravellerSheet._onToggleConsumablesList
  },
  tag: "form",
  sheetType: "TwodsixTravellerSheet"
};
_TwodsixTravellerSheet.PARTS = {
  main: {
    template: "systems/twodsix/templates/actors/traveller-sheet.hbs",
    scrollable: [".skills", ".character-inventory", ".inventory", ".finances", ".info", ".effects", ".actor-notes"]
  }
};
_TwodsixTravellerSheet.TABS = {
  primary: {
    tabs: [
      { id: "skills" },
      { id: "inventory" },
      { id: "finances" },
      { id: "info" },
      { id: "effects" },
      { id: "actorNotes" }
    ],
    initial: "skills"
  }
};
let TwodsixTravellerSheet = _TwodsixTravellerSheet;
const _TwodsixNPCSheet = class _TwodsixNPCSheet extends foundry.applications.api.HandlebarsApplicationMixin(TwodsixTravellerSheet) {
};
__name$V(_TwodsixNPCSheet, "TwodsixNPCSheet");
_TwodsixNPCSheet.DEFAULT_OPTIONS = {
  sheetType: "TwodsixNPCSheet",
  classes: ["twodsix", "sheet", "npc-actor"],
  position: {
    width: 830,
    height: 500
  },
  window: {
    resizable: true,
    icon: "fa-solid fa-person"
  },
  form: {
    submitOnChange: true,
    submitOnClose: true
  },
  tag: "form"
};
_TwodsixNPCSheet.PARTS = {
  main: {
    template: "systems/twodsix/templates/actors/npc-sheet.hbs"
  }
};
let TwodsixNPCSheet = _TwodsixNPCSheet;
function getNewEquippedState(itemSelected) {
  const currentState = itemSelected.system.equipped;
  if (!currentState) {
    return "backpack";
  } else {
    switch (game.settings.get("twodsix", "equippedToggleStates")) {
      case "all":
        return { "vehicle": "ship", "ship": "base", "base": "backpack", "backpack": "equipped", "equipped": "vehicle" }[currentState];
      case "core":
        return { "vehicle": "backpack", "ship": "backpack", "base": "backpack", "backpack": "equipped", "equipped": "backpack" }[currentState];
      case "default":
      default:
        return { "vehicle": "backpack", "ship": "backpack", "base": "backpack", "backpack": "equipped", "equipped": "ship" }[currentState];
    }
  }
}
__name$V(getNewEquippedState, "getNewEquippedState");

var __defProp$U = Object.defineProperty;
var __name$U = (target, value) => __defProp$U(target, "name", { value, configurable: true });
const _TwodsixShipPositionSheet = class _TwodsixShipPositionSheet extends foundry.applications.api.HandlebarsApplicationMixin(AbstractTwodsixItemSheet) {
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.nonCargoComponents = this.item.actor?.itemTypes.component.filter((i) => !["cargo", "ammo"].includes(i.system.subtype)) ?? [];
    context.availableActions = TwodsixShipActions.availableMethods;
    const actions = this.item.system.actions ?? [];
    context.sortedActions = Object.entries(actions).map(([id, ret]) => {
      ret.id = id;
      ret.placeholder = TwodsixShipActions.availableMethods[ret.type].placeholder;
      ret.tooltip = TwodsixShipActions.availableMethods[ret.type].tooltip;
      return ret;
    });
    context.sortedActions.sort((a, b) => a.order > b.order ? 1 : -1);
    context.hasShipActor = !!this.actor;
    if (context.hasShipActor) {
      const shipPositionActorIds = Object.entries(this.actor?.system?.shipPositionActorIds ?? {}).filter(([, shipPositionId]) => shipPositionId === this.item.id);
      if (shipPositionActorIds.length > 0) {
        const actorIds = shipPositionActorIds.map(([actorId]) => actorId);
        context.actors = actorIds.map((actorId) => game.actors?.get(actorId)).filter((x) => x !== void 0);
      } else {
        context.actors = [];
      }
    }
    return context;
  }
  static async createActionFromSkill(position, skill) {
    const actions = position.system.actions;
    const skillData = skill.system;
    const difficulties = TWODSIX$1.DIFFICULTIES[game.settings.get("twodsix", "difficultyListUsed")];
    let command = skill.name ?? "";
    if (skillData.characteristic && skillData.characteristic !== "NONE") {
      command += `/${skillData.characteristic}`;
    }
    command += ` ${difficulties[skillData.difficulty].target}+`;
    const newAction = {
      [foundry.utils.randomID()]: {
        "order": Object.keys(actions).length,
        "name": skill.name,
        "icon": skill.img ?? "",
        "type": TWODSIX$1.SHIP_ACTION_TYPE.skillRoll,
        "command": command,
        "component": ""
      }
    };
    const newActions = foundry.utils.duplicate(Object.assign(actions, newAction));
    await position.update({ "system.actions": newActions });
  }
  _onDragStart(event) {
    if (event.dataTransfer !== null && event.target !== null && event.target.dataset.drag === "actor") {
      const actor = game.actors?.get(event.target.dataset.id);
      event.dataTransfer.setData("text/plain", JSON.stringify({
        "type": "Actor",
        "data": actor,
        //NOT CERTAIN WHAT TO DO ABOUT THIS ONE
        "id": actor?.id,
        "uuid": actor?.uuid
      }));
    } else {
      super._onDragStart(event);
    }
  }
  async _onDrop(event) {
    event.preventDefault();
    const dropData = getDataFromDropEvent(event);
    const droppedObject = await getDocFromDropData(dropData);
    if (droppedObject.type === "skills") {
      await _TwodsixShipPositionSheet.createActionFromSkill(this.item, droppedObject);
    } else if (["traveller", "robot"].includes(droppedObject.type)) {
      return await _TwodsixShipPositionSheet.assignActorToPosition(this, droppedObject.id);
    } else {
      ui.notifications.error("TWODSIX.Ship.InvalidDocumentForShipPosition", { localize: true });
      return false;
    }
    return true;
  }
  static async _onDeleteAction(event, target) {
    const deleteId = target.dataset.id;
    if (deleteId) {
      await this.item.update({ [`system.actions.-=${deleteId}`]: null });
    }
  }
  static async _onDeleteActor(event, target) {
    const deleteId = target.dataset.id;
    if (deleteId) {
      await this.actor?.update({ [`system.shipPositionActorIds.-=${deleteId}`]: null });
      this.render();
    }
  }
  static async _onCreateAction() {
    const actions = this.item.system.actions;
    actions[foundry.utils.randomID()] = {
      "order": Object.values(actions).length === 0 ? 1 : Math.max(...Object.values(actions).map((itm) => itm.order)) + 1,
      "name": game.i18n.localize("TWODSIX.Ship.NewAction"),
      "icon": "icons/svg/dice-target.svg",
      "command": "",
      "component": "",
      "type": TWODSIX$1.SHIP_ACTION_TYPE.chatMessage
    };
    await this.item.update({ "system.actions": actions });
  }
  static _onShowActor(event, target) {
    const actorId = target.closest(".ship-position-details-actor").dataset.id;
    if (actorId) {
      const targetActor = game.actors.get(actorId);
      targetActor.sheet.render({ force: true });
    }
  }
  static async _onAddActor() {
    if (!this.actor?.isOwner) {
      return false;
    }
    const actorOptions = game.actors.filter((a) => a.isOwner && ["traveller", "robot"].includes(a.type)).map((a) => ({ value: a.id, label: a.name }));
    if (!actorOptions || actorOptions.length === 0) {
      ui.notifications.warn("TWODSIX.Warnings.NoAvailableActors", { localize: true });
      return false;
    }
    const html = new foundry.data.fields.StringField({
      label: game.i18n.localize("TWODSIX.Ship.Travellers"),
      required: true
    }).toFormGroup({}, {
      options: actorOptions,
      name: "actorId",
      value: ""
    }).outerHTML;
    const actorId = await foundry.applications.api.DialogV2.prompt({
      content: html,
      ok: {
        callback: /* @__PURE__ */ __name$U((event, button) => button.form.elements.actorId.value, "callback"),
        label: "Select"
      },
      window: {
        title: "TWODSIX.Ship.SelectActor",
        icon: "fa-solid fa-folder"
      }
    });
    if (!actorId) {
      return false;
    }
    const actor = game.actors.get(actorId);
    if (!actor) {
      return false;
    }
    return await _TwodsixShipPositionSheet.assignActorToPosition(this, actorId);
  }
  static async assignActorToPosition(sheet, actorId) {
    if (sheet.actor) {
      const shipPositionActorIds = sheet.actor.system.shipPositionActorIds;
      const currentShipPositionId = shipPositionActorIds[actorId];
      await sheet.actor.update({ [`system.shipPositionActorIds.${actorId}`]: sheet.item.id });
      sheet.render();
      if (currentShipPositionId) {
        const prevItem = sheet.actor.items.get(currentShipPositionId);
        prevItem?.sheet?.render();
      }
      return true;
    } else {
      ui.notifications.error("TWODSIX.Ship.CantDropActorIfPositionIsNotOnShip", { localize: true });
      return false;
    }
  }
};
__name$U(_TwodsixShipPositionSheet, "TwodsixShipPositionSheet");
/** @override */
_TwodsixShipPositionSheet.DEFAULT_OPTIONS = {
  sheetType: "TwodsixShipPositionSheet",
  classes: ["twodsix", "sheet", "item"],
  dragDrop: [{ dropSelector: null, dragSelector: ".ship-position-details-actor" }],
  position: {
    width: "auto",
    height: "auto"
  },
  window: {
    resizable: true,
    icon: "fa-solid fa-gamepad"
  },
  form: {
    submitOnChange: true,
    submitOnClose: true
  },
  actions: {
    deleteAction: _TwodsixShipPositionSheet._onDeleteAction,
    createAction: _TwodsixShipPositionSheet._onCreateAction,
    deleteActor: _TwodsixShipPositionSheet._onDeleteActor,
    showActor: _TwodsixShipPositionSheet._onShowActor,
    addActor: _TwodsixShipPositionSheet._onAddActor
  },
  tag: "form"
};
_TwodsixShipPositionSheet.PARTS = {
  main: {
    template: "systems/twodsix/templates/items/ship_position-sheet.hbs",
    scrollable: [".ship-positions-list"]
  }
};
let TwodsixShipPositionSheet = _TwodsixShipPositionSheet;

var __defProp$T = Object.defineProperty;
var __name$T = (target, value) => __defProp$T(target, "name", { value, configurable: true });
const _TwodsixShipSheet = class _TwodsixShipSheet extends foundry.applications.api.HandlebarsApplicationMixin(AbstractTwodsixActorSheet) {
  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.dtypes = ["String", "Number", "Boolean"];
    if (this.actor.system.shipPositionActorIds) {
      context.shipPositions = this.actor.itemTypes.ship_position.map((shipPosition) => {
        const shipPositionActorIds = Object?.entries(this.actor.system.shipPositionActorIds)?.filter(([, shipPositionId]) => shipPositionId === shipPosition.id);
        if (shipPositionActorIds?.length > 0) {
          const actorIds = shipPositionActorIds.map(([actorId]) => actorId);
          shipPosition.system.actors = actorIds.map((actorId) => game.actors?.get(actorId)).filter((x) => x !== void 0);
        } else {
          shipPosition.system.actors = [];
        }
        const actions = shipPosition.system.actions ?? [];
        shipPosition.system.sortedActions = Object.entries(actions).map(([id, ret]) => {
          ret.id = id;
          return ret;
        });
        shipPosition.system.sortedActions?.sort((a, b) => a.order > b.order ? 1 : -1);
        return shipPosition;
      });
      context.shipPositions.sort((a, b) => a.system.order - b.system.order);
    } else {
      context.shipPositions = [];
    }
    Object.assign(context.settings, {
      showSingleComponentColumn: game.settings.get("twodsix", "showSingleComponentColumn"),
      showBandwidth: game.settings.get("twodsix", "showBandwidth"),
      showWeightUsage: game.settings.get("twodsix", "showWeightUsage"),
      useShipAutoCalc: game.settings.get("twodsix", "useShipAutoCalcs"),
      showComponentSummaryIcons: game.settings.get("twodsix", "showComponentSummaryIcons"),
      allowDragDropOfListsShip: game.settings.get("twodsix", "allowDragDropOfListsShip"),
      maxComponentHits: game.settings.get("twodsix", "maxComponentHits"),
      jDriveLabel: game.settings.get("twodsix", "jDriveLabel") || "TWODSIX.Ship.JDrive",
      showComponentRating: game.settings.get("twodsix", "showComponentRating"),
      showComponentDM: game.settings.get("twodsix", "showComponentDM"),
      showCost: game.settings.get("twodsix", "showCost"),
      showCombatPosition: game.settings.get("twodsix", "showCombatPosition"),
      singleComponentClass: `components-stored-single` + (game.settings.get("twodsix", "showComponentRating") ? ` rating` : ` no-rating`) + (game.settings.get("twodsix", "showComponentDM") ? ` dm` : ` no-dm`) + (game.settings.get("twodsix", "showCost") ? ` cost` : ` no-cost`),
      useMCr: game.settings.get("twodsix", "showCommonFundsMCr")
    });
    if (context.settings.useProseMirror) {
      const TextEditorImp = foundry.applications.ux.TextEditor.implementation;
      context.richText = {
        cargo: await TextEditorImp.enrichHTML(this.actor.system.cargo, { secrets: this.document.isOwner }),
        financeNotes: await TextEditorImp.enrichHTML(this.actor.system.financeNotes, { secrets: this.document.isOwner }),
        notes: await TextEditorImp.enrichHTML(this.actor.system.notes, { secrets: this.document.isOwner })
      };
    }
    return context;
  }
  async _onRender(context, options) {
    await super._onRender(context, options);
    if (this.options.sheetType === "TwodsixShipSheet") {
      this.element.querySelector(".window-content").classList.add("overlap-header");
      this.element.querySelector(".window-header").classList.add("transparent-header-ship");
    }
  }
  static _onExecuteAction(ev, target) {
    if (target !== null) {
      let actorId;
      const shipPosEl = target.closest(".ship-position");
      const shipPosActors = shipPosEl.querySelectorAll(".ship-position-actor-token");
      if (shipPosActors.length === 1) {
        actorId = shipPosActors[0].dataset.id;
      } else if (shipPosActors.length === 0) {
        ui.notifications.warn("TWODSIX.Ship.NoActorsForAction", { localize: true });
        return null;
      } else {
        actorId = shipPosEl.querySelector(".ship-position-actor-token.force-border")?.dataset.id;
      }
      const actionId = target.dataset.id;
      const shipPositionId = shipPosEl.dataset.id;
      _TwodsixShipSheet.performShipAction(ev, shipPositionId, actorId, actionId, this.actor);
    }
  }
  static performShipAction(ev, positionId, actorId, actionId, shipActor) {
    if (!actorId) {
      ui.notifications.warn("TWODSIX.Ship.ActorMustBeSelectedForAction", { localize: true });
      return false;
    }
    const shipPosition = shipActor.items.get(positionId);
    const action = shipPosition?.system?.actions[actionId];
    if (action) {
      const component = shipActor.items.find((item) => item.id === action.component);
      const extra = {
        actor: game.actors?.get(actorId),
        ship: shipActor,
        component,
        event: ev,
        actionName: action.name,
        positionName: shipPosition?.name ?? "",
        diceModifier: ""
      };
      TwodsixShipActions.availableMethods[action.type].action(action.command, extra);
      return true;
    }
  }
  static _onShipPositionCreate() {
    const shipPositions = this.actor.itemTypes.ship_position;
    this.actor.createEmbeddedDocuments("Item", [{ "type": "ship_position", name: "New Position", order: shipPositions.length }]);
  }
  static async _onShipPositionEdit(ev, target) {
    if (target !== null) {
      if (this.actor) {
        const shipActor = this.actor;
        for (const actorId in shipActor.system?.shipPositionActorIds) {
          const actor = game.actors?.get(actorId);
          if (actor === void 0) {
            await shipActor.update({ [`system.shipPositionActorIds.-=${actorId}`]: null });
          }
        }
      }
      const shipPositionId = target.closest(".ship-position").dataset.id;
      const positionItem = this.actor?.items?.get(shipPositionId);
      await positionItem?.sheet.render({ force: true });
    }
  }
  static async _onShipPositionDelete(ev, target) {
    if (target !== null && await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("TWODSIX.Ship.DeletePosition") },
      content: game.i18n.localize("TWODSIX.Ship.ConfirmDeletePosition")
    })) {
      const shipPositionId = target.closest(".ship-position").dataset.id;
      this.actor.items.get(shipPositionId).system.actors?.forEach(async (actor) => {
        if (actor.id && actor.id in this.actor.system.shipPositionActorIds) {
          if (actor.id) {
            await this.actor.update({ [`system.shipPositionActorIds.-=${actor.id}`]: null });
          }
        }
      });
      await this.actor.deleteEmbeddedDocuments("Item", [shipPositionId]);
    }
  }
  static async _onShipPositionCopy(ev, target) {
    if (target !== null) {
      const shipPositionId = target.closest(".ship-position").dataset.id;
      const positionItem = this.actor?.items?.get(shipPositionId);
      const posData = foundry.utils.duplicate(positionItem);
      await TwodsixItem.create(posData, {});
    }
  }
  static _onShipActorClick(ev, target) {
    if (target) {
      const hasClass = target.classList.contains("force-border");
      target.closest(".ship-position-box").querySelectorAll(".ship-position-actor-token")?.forEach((token) => {
        if (target !== token) {
          token.classList.remove("force-border");
        } else if (!hasClass) {
          target.classList.add("force-border");
        }
      });
    }
  }
  static _onToggleComponent(ev, target) {
    if (target) {
      const li = target.closest(".item");
      const itemSelected = this.actor.items.get(li.dataset.itemId);
      if (!itemSelected) {
        return;
      }
      const type = target.dataset.type;
      if (type === "status") {
        const stateTransitions = { "operational": "damaged", "damaged": "destroyed", "destroyed": "off", "off": "operational" };
        const newState = ev.shiftKey ? itemSelected.system.status === "off" ? "operational" : "off" : stateTransitions[itemSelected.system.status];
        itemSelected.update({ "system.status": newState });
      } else if (type === "popup") {
        itemSelected.update({ "system.isExtended": !itemSelected.system.isExtended });
      }
    }
  }
  static _onAdjustFuelType() {
    this.actor.update({ "system.shipStats.fuel.isRefined": !this.actor.system.shipStats.fuel.isRefined });
  }
  static async _onDeckplanClick() {
    if (this.actor.system?.deckPlan) {
      const deckPlan = game.scenes?.get(this.actor.system.deckPlan);
      await deckPlan?.view();
    }
  }
  static _onDeckplanUnlink() {
    if (this.actor.system?.deckPlan) {
      this.actor.update({ "system.deckPlan": "" });
    }
  }
  _onDragStart(ev) {
    if (ev.dataTransfer !== null && ev.target !== null && ev.target.dataset?.drag === "actor") {
      const actor = game.actors?.get(ev.target.dataset.id);
      ev.dataTransfer.setData("text/plain", JSON.stringify({
        "type": "Actor",
        "data": actor,
        //Not Certain if this should be system instead
        "actorId": actor?.id,
        //Why did this refer to ship actor previously?
        "id": actor?.id,
        //Necesssary?
        "uuid": actor?.uuid
      }));
    } else if (ev.target?.classList.contains("ship-position-action")) {
      return;
    } else {
      super._onDragStart(ev);
    }
  }
  async _onDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.dataTransfer === null || ev.target === null) {
      return false;
    }
    try {
      const dropData = getDataFromDropEvent(ev);
      if (dropData.type === "html" || dropData.type === "pdf") {
        await super._onDrop(ev);
        return true;
      } else if (dropData.type === "damageItem") {
        return this.actor.handleDamageData(dropData.payload, false);
      }
      const droppedObject = await getDocFromDropData(dropData);
      if (["traveller", "robot"].includes(droppedObject.type)) {
        const actorId = droppedObject._id;
        const currentShipPositionId = this.actor.system.shipPositionActorIds[actorId];
        if (ev.target !== null && ev.target?.closest(".ship-position")) {
          const shipPositionId = ev.target.closest(".ship-position").dataset.id;
          await this.actor.update({ [`system.shipPositionActorIds.${actorId}`]: shipPositionId });
          this.actor.items.get(shipPositionId)?.sheet?.render();
        } else {
          await this.actor.update({ [`system.shipPositionActorIds.-=${actorId}`]: null });
        }
        this.actor.items.get(currentShipPositionId)?.sheet?.render();
        return true;
      } else if (droppedObject.type === "skills" && ev.target !== null && ev.target?.closest(".ship-position")) {
        if (ev.currentTarget.className === "ship-position-box") {
          const shipPositionId = ev.target.closest(".ship-position").dataset.id;
          const shipPosition = this.actor.items.get(shipPositionId);
          await TwodsixShipPositionSheet.createActionFromSkill(shipPosition, droppedObject);
          return true;
        } else {
          return false;
        }
      } else if (["vehicle", "ship"].includes(droppedObject.type)) {
        await this._addVehicleCraftToComponents(droppedObject, dropData.uuid);
        return true;
      } else if (droppedObject.type === "animal") {
        ui.notifications.warn("TWODSIX.Warnings.AnimalsCantHoldPositions", { localize: true });
        return false;
      } else if (["equipment", "weapon", "armor", "augment", "storage", "tool", "consumable", "computer", "junk"].includes(droppedObject.type)) {
        await this.processDroppedItem(ev, droppedObject);
        return true;
      } else if (ev.currentTarget.className === "ship-position-box ship-position-add-box" && droppedObject.type === "ship_position") {
        return false;
      } else {
        await super._onDrop(ev);
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  async _addVehicleCraftToComponents(droppedObject, uuid) {
    const newComponent = {
      name: droppedObject.name,
      img: droppedObject.img,
      type: "component",
      system: {
        docReference: droppedObject.type === "ship" ? "" : droppedObject.system.docReference,
        price: droppedObject.type === "ship" ? droppedObject.system.shipValue : droppedObject.system.cost,
        quantity: 1,
        status: "operational",
        subtype: "vehicle",
        techLevel: droppedObject.system.techLevel,
        weight: droppedObject.type === "ship" ? droppedObject.system.shipStats.mass.max : droppedObject.system.weight,
        actorLink: uuid
      }
    };
    await this.actor.createEmbeddedDocuments("Item", [newComponent]);
  }
  static async _onDocumentLink(ev, target) {
    const documentUuid = target.dataset.uuid;
    const selectedDocument = await fromUuid(documentUuid);
    selectedDocument?.sheet?.render({ force: true });
  }
};
__name$T(_TwodsixShipSheet, "TwodsixShipSheet");
_TwodsixShipSheet.DEFAULT_OPTIONS = {
  sheetType: "TwodsixShipSheet",
  classes: ["twodsix", "ship", "actor"],
  position: {
    width: 944,
    height: 820
  },
  window: {
    resizable: true,
    icon: "fa-solid fa-rocket"
  },
  form: {
    submitOnChange: true,
    submitOnClose: true
  },
  dragDrop: [
    //{dropSelector: ".ship-positions-list", dragSelector: ".drag"}, UNKNOWN NEED
    { dropSelector: ".ship-position-box", dragSelector: ".ship-position-actor-token" },
    { dragSelector: ".item", dropSelector: null }
  ],
  actions: {
    editPosition: _TwodsixShipSheet._onShipPositionEdit,
    deletePosition: _TwodsixShipSheet._onShipPositionDelete,
    copyPosition: _TwodsixShipSheet._onShipPositionCopy,
    selectShipActor: _TwodsixShipSheet._onShipActorClick,
    executeAction: _TwodsixShipSheet._onExecuteAction,
    createPosition: _TwodsixShipSheet._onShipPositionCreate,
    toggleComponent: _TwodsixShipSheet._onToggleComponent,
    selectDeckplan: _TwodsixShipSheet._onDeckplanClick,
    deleteDeckplan: _TwodsixShipSheet._onDeckplanUnlink,
    adjustFuelType: _TwodsixShipSheet._onAdjustFuelType,
    itemLink: _TwodsixShipSheet._onDocumentLink
  },
  tag: "form"
};
_TwodsixShipSheet.PARTS = {
  main: {
    template: "systems/twodsix/templates/actors/ship-sheet.hbs",
    scrollable: ["", ".ship-tabs-info", ".ship-positions", ".ship-crew", ".ship-component", ".ship-storage", ".storage-wrapper", ".finances", ".ship-notes", ".overlap-header"]
  }
};
_TwodsixShipSheet.TABS = {
  primary: {
    tabs: [
      { id: "shipPositions" },
      { id: "shipCrew" },
      { id: "shipComponent" },
      { id: "shipStorage" },
      { id: "shipCargo" },
      { id: "shipFinance" },
      { id: "shipNotes" }
    ],
    initial: "shipPositions"
  }
};
let TwodsixShipSheet = _TwodsixShipSheet;

var __defProp$S = Object.defineProperty;
var __name$S = (target, value) => __defProp$S(target, "name", { value, configurable: true });
const _TwodsixItemSheet = class _TwodsixItemSheet extends foundry.applications.api.HandlebarsApplicationMixin(AbstractTwodsixItemSheet) {
  /* -------------------------------------------- */
  /** @inheritDoc */
  _configureRenderParts(options) {
    let parts = super._configureRenderParts(options);
    const path = "systems/twodsix/templates/items";
    parts = foundry.utils.mergeObject(parts, { "main.template": `${path}/${this.item.type}-sheet.hbs` });
    return parts;
  }
  /** @inheritDoc */
  _initializeApplicationOptions(options) {
    const applicationOptions = super._initializeApplicationOptions(options);
    applicationOptions.window.icon = getItemIcon(applicationOptions.document.type);
    return applicationOptions;
  }
  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.settings = {
      ShowLawLevel: game.settings.get("twodsix", "ShowLawLevel"),
      ShowRangeBandAndHideRange: ["CE_Bands", "CT_Bands", "CU_Bands"].includes(game.settings.get("twodsix", "rangeModifierType")),
      ShowWeaponType: game.settings.get("twodsix", "ShowWeaponType"),
      ShowDamageType: game.settings.get("twodsix", "ShowDamageType"),
      ShowRateOfFire: game.settings.get("twodsix", "ShowRateOfFire"),
      ShowRecoil: game.settings.get("twodsix", "ShowRecoil"),
      ShowDoubleTap: game.settings.get("twodsix", "ShowDoubleTap"),
      usePDFPager: game.settings.get("twodsix", "usePDFPagerForRefs"),
      showComponentRating: game.settings.get("twodsix", "showComponentRating"),
      showComponentDM: game.settings.get("twodsix", "showComponentDM"),
      difficultyList: getDifficultiesSelectObject(),
      useItemAEs: game.settings.get("twodsix", "useItemActiveEffects"),
      useTabbedViews: game.settings.get("twodsix", "useTabbedViews"),
      damageTypes: getDamageTypes(["weapon", "consumable"].includes(this.item.type)),
      rangeTypes: getRangeTypes("long"),
      useCTData: game.settings.get("twodsix", "ruleset") === "CT",
      useCUData: game.settings.get("twodsix", "ruleset") === "CU",
      rollTypes: getRollTypeSelectObject(),
      augLocations: TWODSIX$1.AUG_LOCATIONS,
      consumableOptions: getConsumableOptions(this.item),
      itemTypes: TWODSIX$1.ITEM_TYPE_SELECT,
      psiTalentsRequireRoll: game.settings.get("twodsix", "psiTalentsRequireRoll"),
      ShipWeaponTypes: TWODSIX$1.ShipWeaponTypes[game.settings.get("twodsix", "shipWeaponType")] ?? {}
    };
    if (this.item.type === "skills") {
      context.settings.characteristicsList = getCharacteristicList(this.item.actor);
      if (Object.keys(context.settings.characteristicsList).includes(this.item.system.characteristic)) {
        context.system.initialCharacteristic = this.item.system.characteristic;
      } else {
        context.system.initialCharacteristic = "NONE";
      }
    }
    context.config = foundry.utils.duplicate(TWODSIX$1);
    if (this.actor && this.item.type === "consumable") {
      const onComputer = this.actor.items.find((it) => it.type === "computer" && it.system.consumables.includes(this.item.id));
      if (onComputer) {
        delete context.config.CONSUMABLES.processor;
        delete context.config.CONSUMABLES.suite;
      }
    }
    if (this.item.type === "weapon") {
      context.disableMeleeRangeDM = typeof this.item.system.range === "string" ? this.item.system.range.toLowerCase() === "melee" : false;
    }
    context.isStoredInCargo = ["cargo", "ammo"].includes(this.item.system.subtype);
    context.isWeapon = ["armament", "ammo"].includes(this.item.system.subtype);
    context.ammoList = { none: game.i18n.localize("TWODSIX.Ship.None") };
    if (this.item.system.subtype === "armament" && this.item.actor) {
      this.item.actor.itemTypes.component?.filter((i) => i.system.subtype === "ammo")?.forEach((a) => context.ammoList[a.id] = a.name);
    }
    if (["ammo"].includes(this.item.system.subtype)) {
      delete context.config.PricingOptions.perHullTon;
      delete context.config.PricingOptions.per100HullTon;
      delete context.config.PricingOptions.pctHull;
      delete context.config.PricingOptions.pctHullPerUnit;
    }
    context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.item.system.description, { secrets: this.document.isOwner });
    context.tabs = this.getApplicableTabs(context.tabs);
    return context;
  }
  /**
   * Adjusts the TABS constant based on the item type.
   * @returns {object}
   */
  getApplicableTabs(tabs) {
    if (this.item.type === "weapon") {
      delete tabs.displacement;
      delete tabs.power;
      delete tabs.price;
    } else if (this.item.type === "component") {
      delete tabs.magazine;
      delete tabs.modifiers;
      if (["cargo", "ammo"].includes(this.item.system.subtype)) {
        delete tabs.power;
      }
      if (!["armament", "mount", "ammo"].includes(this.item.system.subtype)) {
        delete tabs.attack;
      }
    }
    return tabs;
  }
  /** @override */
  async _onRender(context, options) {
    await super._onRender(context, options);
    if (!context.editable) {
      return;
    }
    this.handleContentEditable(this.element);
    this.element.querySelector(".consumable-use-consumable-for-attack")?.addEventListener("change", this._onChangeUseConsumableForAttack.bind(this));
    this.element.querySelector(`[name="system.subtype"]`)?.addEventListener("change", this._changeSubtype.bind(this));
    this.element.querySelector(`[name="system.isBaseHull"]`)?.addEventListener("change", this._changeIsBaseHull.bind(this));
    this.element.querySelector(`[name="item.type"]`)?.addEventListener("change", this._changeType.bind(this));
    this.element.querySelector(`[name="system.nonstackable"]`)?.addEventListener("change", this._changeNonstackable.bind(this));
    this.element.querySelector(`[name="name"]`)?.addEventListener("change", this._changeName.bind(this));
    this.element.querySelectorAll(`[name="reference"]`)?.forEach((el) => el.addEventListener("change", changeReference.bind(this)));
  }
  async _changeName(ev) {
    if (this.item.type !== "skills" || !this.item.actor) {
      return;
    }
    ev.preventDefault();
    const newName = this.item.actor.generateUniqueSkillName(ev.target.value);
    if (newName !== ev.target.value) {
      console.log("TWODSIX: replacing skill name with unique value");
      ev.target.value = newName;
      await this.item.update({ "name": newName });
    }
  }
  async _changeSubtype(ev) {
    ev.preventDefault();
    const chosenSubtype = ev.target.value;
    await this.item.update({ "system.subtype": chosenSubtype });
    if (this.item.type === "component") {
      const updates = {};
      const componentImagePath = "systems/twodsix/assets/icons/components/";
      if (this.item.img.includes(componentImagePath)) {
        Object.assign(updates, { "img": componentImagePath + chosenSubtype + ".svg" });
      }
      const anComponent = this.item.system;
      if (anComponent.weightIsPct && ["cargo", "ammo"].includes(chosenSubtype)) {
        Object.assign(updates, { "system.weightIsPct": false });
      }
      if (chosenSubtype !== "hull" && anComponent.isBaseHull) {
        Object.assign(updates, { "system.isBaseHull": false });
      }
      if (["fuel", "cargo", "ammo", "storage", "vehicle"].includes(chosenSubtype)) {
        Object.assign(updates, { "system.hardened": false });
      }
      if (["ammo"].includes(chosenSubtype) && !["perUnit", "perCompTon"].includes(anComponent.pricingBasis)) {
        Object.assign(updates, { "system.pricingBasis": "perUnit" });
      }
      if (Object.keys(updates).length !== 0) {
        await this.item.update(updates);
      }
    } else if (this.item.type === "consumable") {
      if (["software", "processor", "suite"].includes(this.item.system.subtype)) {
        await this.item.update({ "system.isAttachment": true });
      }
      if (this.item.actor) {
        const parentItem = this.item.actor.items.find((it) => it.system.consumables?.includes(this.item.id));
        if (parentItem) {
          parentItem.sheet.render(false);
        }
      }
    }
  }
  async _changeType(event) {
    const duplicateItem = this.item.toJSON();
    const newType = event.currentTarget.value;
    duplicateItem.system.priorType = this.item.type;
    if (duplicateItem.system.priorType === "spell" && duplicateItem.system.associatedSkillName === game.settings.get("twodsix", "sorcerySkill")) {
      duplicateItem.system.associatedSkillName = "";
    } else if (newType === "spell" && duplicateItem.system.associatedSkillName === "") {
      duplicateItem.system.associatedSkillName = game.settings.get("twodsix", "sorcerySkill");
    }
    duplicateItem.system.type = newType;
    duplicateItem.type = newType;
    const options = { renderSheet: true };
    if (this.item.pack) {
      options.pack = this.item.pack;
    } else {
      options.parent = this.item.parent;
    }
    const newItem = await TwodsixItem.create(duplicateItem, options);
    if (newItem) {
      if (this.item.pack) {
        await this.item.delete({ pack: this.item.pack });
      } else {
        if (duplicateItem.system.priorType === "consumable" && this.item.parent) {
          const attachedTo = this.item.parent?.items.filter((it) => it.system.consumables?.includes(this.item.id));
          for (const holdingItem of attachedTo) {
            await holdingItem.removeConsumable(this.item.id);
          }
        }
        await this.item.delete();
      }
    }
  }
  /* -------------------------------------------- */
  /** @override */
  // Not really needed with change to prosemirror
  async _onChangeContenteditable(event) {
    if (event.currentTarget?.name !== "type") {
      const formField = event.currentTarget?.closest('div[contenteditable="true"][data-edit]');
      if (formField) {
        const target = formField.dataset?.edit;
        const newValue = formField.closest('div[contenteditable="true"][data-edit]').innerHTML;
        if (target) {
          this.item.update({ [target]: newValue });
        }
      }
    }
  }
  /* -------------------------------------------- */
  async _changeIsBaseHull() {
    const anComponent = this.item.system;
    const newValue = !anComponent.isBaseHull;
    await this.item.update({ "system.isBaseHull": newValue });
    if (newValue && anComponent.weightIsPct) {
      await this.item.update({ "system.weightIsPct": false });
    }
  }
  _changeNonstackable() {
    if (this.item.actor) {
      const newValue = !this.item.system.nonstackable;
      if (this.item.actor.system.layersWorn > 1 && newValue && this.item.system.equipped === "equipped") {
        ui.notifications.warn("TWODSIX.Warnings.WearingMultipleLayers", { localize: true });
      }
    }
  }
  static async _onCreateEffect() {
    if (this.actor?.type === "ship" || this.actor?.type === "vehicle") {
      ui.notifications.warn("TWODSIX.Warnings.CantEditCreateInCargo", { localize: true });
    } else {
      const newId = foundry.utils.randomID();
      if (game.settings.get("twodsix", "useItemActiveEffects")) {
        if (await fromUuid(this.item.uuid)) {
          TwodsixActiveEffect.create({
            origin: void 0,
            //UUID? this.item.uuid
            icon: this.item.img,
            tint: "#ffffff",
            name: this.item.name,
            description: "",
            transfer: game.settings.get("twodsix", "useItemActiveEffects"),
            disabled: false,
            _id: newId
          }, { renderSheet: true, parent: this.item });
        } else {
          ui.notifications.warn("TWODSIX.Warnings.CantCreateEffect", { localize: true });
        }
      }
    }
  }
  static async _onEditEffect() {
    if (this.actor?.type === "ship" || this.actor?.type === "vehicle") {
      ui.notifications.warn("TWODSIX.Warnings.CantEditCreateInCargo", { localize: true });
    } else if (await fromUuid(this.item.uuid)) {
      const editSheet = await this.item.effects.contents[0].sheet?.render({ force: true });
      try {
        editSheet?.bringToFront();
      } catch (err) {
        console.log(err);
      }
    } else {
      ui.notifications.warn("TWODSIX.Warnings.CantEditEffect", { localize: true });
    }
  }
  static async _onDeleteEffect() {
    if (await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("TWODSIX.ActiveEffects.DeleteEffect") },
      content: game.i18n.localize("TWODSIX.ActiveEffects.ConfirmDelete")
    })) {
      if (await fromUuid(this.item.uuid)) {
        await this.item.deleteEmbeddedDocuments("ActiveEffect", [], { deleteAll: true });
        if (this.item.actor) {
          this.item.actor.sheet.render(false);
        }
      } else {
        ui.notifications.warn("TWODSIX.Warnings.CantDeleteEffect", { localize: true });
      }
    }
  }
  getConsumable(target) {
    if (target) {
      const consumableId = target.closest(".consumable").dataset.consumableId;
      return this.item.actor?.items.get(consumableId);
    } else {
      return void 0;
    }
  }
  static _onEditConsumable(event, target) {
    this.getConsumable(target)?.sheet?.render({ force: true });
  }
  static async _onDeleteConsumable(event, target) {
    const consumable = this.getConsumable(target);
    if (!consumable) {
      await this.item.removeConsumable("");
    } else {
      const body = game.i18n.localize("TWODSIX.Items.Consumable.RemoveConsumableFrom").replace("_CONSUMABLE_NAME_", consumable.name).replace("_ITEM_NAME_", this.item.name);
      if (await foundry.applications.api.DialogV2.confirm({
        window: { title: game.i18n.localize("TWODSIX.Items.Consumable.RemoveConsumable") },
        content: body
      })) {
        if (consumable && consumable.id) {
          await this.item.removeConsumable(consumable.id);
          this.render();
        }
      }
    }
  }
  static async _onCreateConsumable() {
    if (!this.item.isOwned) {
      console.error(`Twodsix | Consumables can only be created for owned items`);
      return;
    }
    const template = "systems/twodsix/templates/items/dialogs/create-consumable.hbs";
    const consumablesList = foundry.utils.duplicate(TWODSIX$1.CONSUMABLES);
    if (this.item.type === "computer" || this.item.type === "consumable" && ["processor", "suite"].includes(this.item.system.subtype)) {
      delete consumablesList["processor"];
      delete consumablesList["suite"];
    }
    const html = await foundry.applications.handlebars.renderTemplate(template, {
      consumables: consumablesList
    });
    new foundry.applications.api.DialogV2({
      window: { title: `${game.i18n.localize("TWODSIX.Items.Items.New")} ${game.i18n.localize("TWODSIX.itemTypes.consumable")}` },
      content: html,
      buttons: [
        {
          action: "ok",
          label: "TWODSIX.Create",
          default: true,
          callback: /* @__PURE__ */ __name$S(async (event, button, dialog) => {
            const dialogElement = dialog.element;
            const max = parseInt(dialogElement.querySelector(".consumable-max")?.value, 10) || 0;
            let equippedState = "";
            if (this.item.type !== "skills" && this.item.type !== "trait" && this.item.type !== "ship_position") {
              equippedState = this.item.system.equipped ?? "backpack";
            }
            const newConsumableData = {
              name: dialogElement.querySelector(".consumable-name")?.value || game.i18n.localize("TYPES.Item.consumable"),
              type: "consumable",
              system: {
                subtype: dialogElement.querySelector(".consumable-subtype")?.value,
                quantity: parseInt(dialogElement.querySelector(".consumable-quantity")?.value, 10) || 0,
                currentCount: max,
                max,
                equipped: equippedState,
                isAttachment: ["processor", "software", "suite"].includes(dialogElement.querySelector(".consumable-subtype")?.value) && this.item.type !== "consumable",
                parentName: this.item.name,
                parentType: this.item.type
              }
            };
            const newConsumable = await this.item.actor?.createEmbeddedDocuments("Item", [newConsumableData]);
            if (newConsumable) {
              await this.item.addConsumable(newConsumable[0].id);
              this.render();
            }
          }, "callback")
        },
        {
          action: "cancel",
          label: "Cancel"
        }
      ]
    }).render({ force: true });
  }
  static async _onCreateAttachment() {
    const newConsumableData = {
      name: game.i18n.localize("TWODSIX.Items.Equipment.NewAttachment"),
      type: "consumable",
      system: {
        subtype: "other",
        quantity: 1,
        isAttachment: true,
        parentName: this.item.name,
        parentType: this.item.type
      }
    };
    const newConsumable = await this.item.actor?.createEmbeddedDocuments("Item", [newConsumableData]) || {};
    await this.item.addConsumable(newConsumable[0].id);
    this.render();
  }
  async _onChangeUseConsumableForAttack(event) {
    await this.item.update({ "system.useConsumableForAttack": event.currentTarget.value });
  }
  //These aren't necessary with change to prosemirror
  handleContentEditable(element) {
    element.querySelectorAll('div[contenteditable="true"][data-edit]')?.forEach((el) => {
      el.addEventListener("focusout", this._onChangeContenteditable.bind(this));
    });
    element.querySelectorAll('div[contenteditable="true"][data-edit]')?.forEach((el) => {
      el.addEventListener("paste", onPasteStripFormatting.bind(this));
    });
  }
};
__name$S(_TwodsixItemSheet, "TwodsixItemSheet");
/** @override */
_TwodsixItemSheet.DEFAULT_OPTIONS = {
  sheetType: "TwodsixItemSheet",
  classes: ["twodsix", "sheet", "item"],
  dragDrop: [{ dropSelector: null, dragSelector: ".consumable" }],
  position: {
    width: 600,
    height: 700
  },
  window: {
    resizable: true
  },
  form: {
    submitOnChange: true,
    submitOnClose: true
  },
  actions: {
    createConsumable: _TwodsixItemSheet._onCreateConsumable,
    createAttachment: _TwodsixItemSheet._onCreateAttachment,
    editConsumable: _TwodsixItemSheet._onEditConsumable,
    deleteConsumable: _TwodsixItemSheet._onDeleteConsumable,
    editActiveEffect: _TwodsixItemSheet._onEditEffect,
    createActiveEffect: _TwodsixItemSheet._onCreateEffect,
    deleteActiveEffect: _TwodsixItemSheet._onDeleteEffect,
    openPDFLink,
    deletePDFLink,
    addPDFLink,
    openJournalEntry,
    deleteReference
  },
  tag: "form"
};
_TwodsixItemSheet.PARTS = {
  main: {
    template: "",
    //systems/twodsix/templates/items/item-sheet.hbs
    scrollable: [""]
  }
};
_TwodsixItemSheet.TABS = {
  primary: {
    tabs: [
      { id: "description", icon: "fa-solid fa-book", label: "TWODSIX.Items.Equipment.Description" },
      { id: "modifiers", icon: "fa-solid fa-dice", label: "TWODSIX.Items.Weapon.Modifiers" },
      { id: "attack", icon: "fa-solid fa-burst", label: "TWODSIX.Items.Weapon.Attack" },
      { id: "magazine", icon: "fa-solid fa-battery-full", label: "TWODSIX.Items.Weapon.Consumables" },
      { id: "displacement", icon: "fa-solid fa-weight-hanging", label: "TWODSIX.Items.Component.Displacement" },
      { id: "power", icon: "fa-solid fa-bolt", label: "TWODSIX.Items.Component.Power" },
      { id: "price", icon: "fa-solid fa-coins", label: "TWODSIX.Items.Component.Price" }
    ],
    initial: "description"
  }
};
let TwodsixItemSheet = _TwodsixItemSheet;
function getItemIcon(type) {
  const iconMap = {
    spell: "fa-solid fa-wand-sparkles",
    weapon: "fa-solid fa-gun",
    armor: "fa-solid fa-shield",
    consumable: "fa-solid fa-battery-full",
    augment: "fa-solid fa-users-rays",
    ship_position: "fa-solid fa-gamepad",
    computer: "fa-solid fa-computer",
    junk: "fa-solid fa-trash-can",
    component: "fa-solid fa-gears",
    psiAbility: "fa-solid fa-head-side-virus",
    skills: "fa-solid fa-person-running",
    trait: "fa-solid fa-image-portrait",
    equipment: "fa-solid fa-toolbox",
    tool: "fa-solid fa-hammer"
  };
  return iconMap[type] || "";
}
__name$S(getItemIcon, "getItemIcon");

var __defProp$R = Object.defineProperty;
var __name$R = (target, value) => __defProp$R(target, "name", { value, configurable: true });
function registerHandlebarsHelpers() {
  let showedError = false;
  Handlebars.registerHelper("twodsix_isOdd", (num) => {
    return num % 2 == 1;
  });
  Handlebars.registerHelper("twodsix_product", (num1, num2) => {
    return (num1 ?? 0) * (num2 ?? 0);
  });
  Handlebars.registerHelper("twodsix_capitalize", (str) => {
    if (typeof str !== "string") {
      return "";
    } else {
      const thing = str;
      return str.charAt(0).toLocaleUpperCase() + (thing.length > 1 ? thing.slice(1) : "");
    }
  });
  Handlebars.registerHelper("twodsix_titleCase", (str) => {
    if (typeof str !== "string") {
      return "";
    } else {
      return str.toLowerCase().split(" ").map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(" ");
    }
  });
  Handlebars.registerHelper("twodsix_limitLength", function(inStr, len) {
    if (!inStr) {
      return "";
    } else {
      return inStr.length > len ? "(...)" : inStr;
    }
  });
  Handlebars.registerHelper("twodsix_skillCharacteristic", (actor, characteristic) => {
    const characteristicElement = actor.system.characteristics[getKeyByValue(TWODSIX$1.CHARACTERISTICS, characteristic)];
    if (characteristicElement) {
      const mod = characteristicElement.mod;
      const abbreviatedCharName = characteristicElement.displayShortLabel;
      return abbreviatedCharName + "(" + (mod < 0 ? "" : "+") + mod + ")";
    } else if ("NONE" === characteristic) {
      return game.i18n.localize("TWODSIX.Items.Skills.NONE");
    } else {
      if (!showedError) {
        ui.notifications.error("TWODSIX.Handlebars.CantShowCharacteristic", { localize: true });
        showedError = true;
      }
      return "XXX";
    }
  });
  Handlebars.registerHelper("twodsix_localizeConsumable", (type) => {
    return game.i18n.localize(`TWODSIX.Items.Consumable.Types.${type}`);
  });
  Handlebars.registerHelper("twodsix_refillText", (subtype, quantity) => {
    const refillWord = ["magazine", "power_cell"].includes(subtype) ? "Reload" : "Refill";
    return `${game.i18n.localize(`TWODSIX.Actor.Items.${refillWord}`)} (${quantity - 1})`;
  });
  Handlebars.registerHelper("twodsix_skillTotal", (actor, skillItem) => {
    const characteristicElement = actor.system.characteristics[getKeyByValue(TWODSIX$1.CHARACTERISTICS, skillItem.system.characteristic)];
    let adjValue = actor.system.skills[simplifySkillName(skillItem.name)] ?? skillItem.system.value;
    if (adjValue === CONFIG.Item.dataModels.skills.schema.getInitialValue().value && !game.settings.get("twodsix", "hideUntrainedSkills")) {
      adjValue = actor.items.find((i) => i._id === actor.system.untrainedSkill).system.value;
    }
    if (characteristicElement) {
      if (!characteristicElement.current) {
        characteristicElement.current = characteristicElement.value - characteristicElement.damage;
      }
      const mod = characteristicElement.mod;
      return Number(adjValue) + mod;
    } else {
      return adjValue;
    }
  });
  Handlebars.registerHelper("twodsix_adjustedSkillValue", (actor, skillItem) => {
    const adjValue = actor.system.skills[simplifySkillName(skillItem.name)];
    return adjValue !== skillItem.system.value ? adjValue : `&#8212;`;
  });
  Handlebars.registerHelper("twodsix_invertSkillRollShiftClick", () => {
    if (game.settings.get("twodsix", "invertSkillRollShiftClick")) {
      return game.i18n.localize("TWODSIX.Actor.Skills.InvertedSkillRollTooltip");
    } else {
      return game.i18n.localize("TWODSIX.Actor.Skills.SkillRollTooltip");
    }
  });
  Handlebars.registerHelper("twodsix_hideUntrainedSkills", (inData) => {
    if (inData === -1) {
      return game.settings.get("twodsix", "hideUntrainedSkills");
    } else {
      return inData.value && (game.settings.get("twodsix", "hideUntrainedSkills") && inData.value < 0 && inData.trainingNotes === "");
    }
  });
  Handlebars.registerHelper("twodsix_burstModes", (weapon) => {
    const modes = (weapon.system.rateOfFire ?? "").split(/[-/]/);
    modes.shift();
    return modes;
  });
  Handlebars.registerHelper("twodsix_useCELAuto", (weapon) => {
    return parseInt(weapon.system.rateOfFire) > 1 || weapon.system.doubleTap && game.settings.get("twodsix", "ShowDoubleTap");
  });
  Handlebars.registerHelper("twodsix_useCUAuto", (weapon) => {
    return parseInt(weapon.system.rateOfFire) > 1;
  });
  Handlebars.registerHelper("twodsix_useCTAuto", (weapon) => {
    const modes = (weapon.system.rateOfFire ?? "").split(/[-/]/);
    return modes.length > 1;
  });
  Handlebars.registerHelper("twodsix_useCTSingle", (weapon) => {
    const modes = (weapon.system.rateOfFire ?? "").split(/[-/]/);
    return Number(modes[0]) === 1;
  });
  Handlebars.registerHelper("twodsix_CTBurstSize", (weapon) => {
    const modes = (weapon.system.rateOfFire ?? "").split(/[-/]/);
    if (modes.length > 1) {
      return Number(modes[1]);
    } else {
      return 1;
    }
  });
  Handlebars.registerHelper("twodsix_burstAttackDM", (burstSize) => {
    const number = Number(burstSize);
    return TwodsixItem.burstAttackDM(number);
  });
  Handlebars.registerHelper("twodsix_burstBonusDamage", (burstSize) => {
    const number = Number(burstSize);
    return TwodsixItem.burstBonusDamage(number);
  });
  Handlebars.registerHelper("twodsix_filterSkills", (skill) => {
    return skill != null && !skill.getFlag("twodsix", "untrainedSkill") && skill.type === "skills";
  });
  Handlebars.registerHelper("alternativeShort1", () => {
    return game.settings.get("twodsix", "alternativeShort1");
  });
  Handlebars.registerHelper("alternativeShort2", () => {
    return game.settings.get("twodsix", "alternativeShort2");
  });
  Handlebars.registerHelper("alternativeShort3", () => {
    return game.settings.get("twodsix", "alternativeShort3");
  });
  Handlebars.registerHelper("skillName", (skillName) => {
    return simplifySkillName(skillName);
  });
  Handlebars.registerHelper("replace", (text, key, value) => {
    return text.replaceAll(key, value);
  });
  Handlebars.registerHelper("twodsix_getComponentIcon", (componentType) => {
    const iconMap = {
      accomodations: "fa-solid fa-bed",
      ammo: "fa-solid fa-bomb",
      armament: "fa-solid fa-crosshairs",
      armor: "fa-solid fa-grip-vertical",
      bridge: "fa-solid fa-person-seat",
      cargo: "fa-solid fa-boxes-stacked",
      computer: "fa-solid fa-computer",
      dock: "fa-solid fa-arrow-right-arrow-left",
      drive: "fa-solid fa-up-down-left-right",
      drone: "fa-solid fa-satellite",
      electronics: "fa-solid fa-microchip",
      fuel: "fa-solid fa-gas-pump",
      hull: "fa-solid fa-rocket",
      mount: "fa-regular fa-circle-dot",
      otherExternal: "fa-solid fa-right-from-bracket",
      otherInternal: "fa-solid fa-right-to-bracket",
      power: "fa-solid fa-atom",
      sensor: "fa-solid fa-solar-panel",
      shield: "fa-solid fa-shield-halved",
      software: "fa-solid fa-code",
      storage: "fa-solid fa-boxes-stacked",
      vehicle: "fa-solid fa-shuttle-space"
    };
    return iconMap[componentType] || "fa-solid fa-circle-question";
  });
  Handlebars.registerHelper("twodsix_getEquippedIcon", (equipped) => {
    const equippedIconMap = {
      backpack: "fa-solid fa-person-hiking",
      equipped: "fa-solid fa-child-reaching",
      ship: "fa-solid fa-shuttle-space",
      vehicle: "fa-solid fa-truck-plane",
      base: "fa-solid fa-house-user"
    };
    return equippedIconMap[equipped] || "fa-solid fa-person-hiking";
  });
  Handlebars.registerHelper("twodsix_showTimeframe", () => {
    return game.settings.get("twodsix", "showTimeframe");
  });
  Handlebars.registerHelper("twodsix_hideItem", (display, itemLocation) => {
    return display && ["ship", "vehicle", "base"].includes(itemLocation);
  });
  Handlebars.registerHelper("twodsix_getProcessingPower", (item) => {
    if (!item) {
      return 0;
    } else {
      let bandwidth = 0;
      if (item.system.attachmentData) {
        for (const attch of item.system.attachmentData) {
          if (attch.system.subtype === "software" && attch.system.softwareActive) {
            bandwidth += attch.system.bandwidth;
          }
        }
      }
      return bandwidth;
    }
  });
  Handlebars.registerHelper("twodsix_die_style", (die) => {
    let style = "roll die d6";
    if (die.discarded) {
      style += " discarded";
    }
    if (die.result === 6) {
      style += " max";
    } else if (die.result === 1) {
      style += " min";
    }
    return style;
  });
  Handlebars.registerHelper("concat", (...args) => args.slice(0, args.length - 1).join(""));
  Handlebars.registerHelper("getComponentCost", (item) => {
    if (item.system.installedCost) {
      const maxDigits = item.system.installedCost < 0.1 ? 2 : 1;
      return item.system.installedCost.toLocaleString(game.i18n.lang, { minimumFractionDigits: maxDigits, maximumFractionDigits: maxDigits });
    } else {
      return "\u2014";
    }
  });
  Handlebars.registerHelper("getComponentWeight", (item) => {
    return getWeight(item).toLocaleString(game.i18n.lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  });
  Handlebars.registerHelper("getComponentPrice", (item) => {
    if (item.system.subtype === "cargo") {
      return Number(item.system.purchasePrice).toLocaleString(game.i18n.lang, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    } else {
      return Number(item.system.price).toLocaleString(game.i18n.lang, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    }
  });
  Handlebars.registerHelper("getComponentPower", (item) => {
    const retValue = getPower(item).toLocaleString(game.i18n.lang, { maximumFractionDigits: 1 });
    return item.system.generatesPower ? "+" + retValue : retValue;
  });
  Handlebars.registerHelper("getComponentMaxHits", () => {
    return game.settings.get("twodsix", "maxComponentHits");
  });
  Handlebars.registerHelper("getCharacteristicList", (actor) => {
    return getCharacteristicList(actor);
  });
  Handlebars.registerHelper("makePieImage", (text) => {
    const re = new RegExp(/(\d+)(\s?)\/(\s?)(\d+)/gm);
    const parsedResult = re.exec(text);
    let inputPercentage = 0.5;
    if (parsedResult) {
      inputPercentage = Number(parsedResult[1]) / Number(parsedResult[4]);
      if (inputPercentage > 1) {
        inputPercentage = 1;
      }
      if (inputPercentage < 0) {
        inputPercentage = 0;
      }
    }
    const degrees = Math.round(inputPercentage * 360);
    return `background-image: conic-gradient(var(--s2d6-pie-color) ${degrees}deg, var(--s2d6-pie-background-color) ${degrees}deg); border-radius: 50%; border: 1px solid;`;
  });
  Handlebars.registerHelper("makeFireArc", (startAngle = 0, endAngle = 0) => {
    let wedgeDegrees = (endAngle - startAngle + 360) % 360;
    const minAngle = 10;
    if (wedgeDegrees < minAngle && (startAngle || endAngle)) {
      wedgeDegrees = minAngle;
      startAngle = startAngle < minAngle / 2 ? 0 : startAngle - minAngle / 2;
    }
    return `background-image: conic-gradient(from ${startAngle}deg, var(--s2d6-pie-color) ${wedgeDegrees}deg, var(--s2d6-pie-background-color) ${wedgeDegrees}deg); border-radius: 50%; border: 1px solid; height: 3ch; width: 3ch;`;
  });
  Handlebars.registerHelper("twodsix_canBePopup", (item) => {
    return ["armament", "mount"].includes(item.system.subtype);
  });
  Handlebars.registerHelper("twodsix_canBeEquipped", (item) => {
    return ![...TWODSIX$1.WeightlessItems, "ship_position", "component"].includes(item.type);
  });
  Handlebars.registerHelper("twodsix_getTLString", (itemData) => {
    if ([...TWODSIX$1.WeightlessItems, "ship_position"].includes(itemData.type)) {
      return "";
    } else if (itemData.system?.techLevel !== null && itemData.system?.techLevel !== void 0) {
      if (isNaN(itemData.system.techLevel)) {
        return "";
      } else {
        return `(${game.i18n.localize("TWODSIX.Items.Equipment.TL")} ${itemData.system.techLevel})`;
      }
    } else {
      return "";
    }
  });
  Handlebars.registerHelper("debug", function(context) {
    console.log(context);
    return JSON.stringify(context);
  });
  Handlebars.registerHelper("iff", function(v1, operator, v2, options) {
    let expression;
    switch (operator) {
      case "==":
        expression = v1 == v2;
        break;
      case "===":
        expression = v1 === v2;
        break;
      case "!=":
        expression = v1 != v2;
        break;
      case "!==":
        expression = v1 !== v2;
        break;
      case "<":
        expression = v1 < v2;
        break;
      case "<=":
        expression = v1 <= v2;
        break;
      case ">":
        expression = v1 > v2;
        break;
      case ">=":
        expression = v1 >= v2;
        break;
      case "&&":
        expression = v1 && v2;
        break;
      case "||":
        expression = v1 || v2;
        break;
      default:
        return options.inverse(this);
    }
    return expression ? options.fn(this) : options.inverse(this);
  });
}
__name$R(registerHandlebarsHelpers, "registerHandlebarsHelpers");

var __defProp$Q = Object.defineProperty;
var __name$Q = (target, value) => __defProp$Q(target, "name", { value, configurable: true });
const _AdvancedSettings = class _AdvancedSettings extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  constructor(object, settings, options) {
    super(object, options);
    this.settings = settings;
  }
  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.useTabbedViews = game.settings.get("twodsix", "useTabbedViews");
    context.settings = {};
    for (const group in this.settings) {
      const subgroupSettings = this.settings[group].map((settingName) => {
        const setting = game.settings.settings.get("twodsix." + settingName);
        setting.value = game.settings.get(setting.namespace ?? setting.module, settingName);
        if (setting.choices === "Color") {
          setting.htmlType = "Color";
        } else if (setting.choices === "textarea") {
          setting.htmlType = "Textarea";
        } else if (setting.choices) {
          setting.htmlType = setting.type === Array ? "MultiSelect" : "Select";
        } else {
          setting.htmlType = setting.type.name;
        }
        return [settingName, setting];
      });
      context.settings[group] = Object.fromEntries(subgroupSettings);
    }
    context.dtypes = ["String", "Number", "Boolean"];
    context.buttons = [
      { type: "submit", icon: "fa-solid fa-save", label: "Save" },
      { type: "cancel", icon: "fa-solid fa-circle-x", label: "Cancel" }
    ];
    return context;
  }
  /**
   * Process form submission for the sheet
   * @this {MyApplication}                      The handler is called with the application as its bound scope
   * @param {SubmitEvent} event                   The originating form submission event
   * @param {HTMLFormElement} form                The form element that was submitted
   * @param {FormDataExtended} formData           Processed data for the submitted form
   * @returns {Promise<void>}
   */
  static async onSubmit(event, form, formData) {
    if (event.type === "submit") {
      const settings = foundry.utils.expandObject(formData.object);
      for (const [key, value] of Object.entries(settings)) {
        if (key !== "submit" && key !== "cancel") {
          await game.settings.set("twodsix", key, value);
        }
      }
    }
  }
  static registerMenu(cls, menuName, icon, restricted = true) {
    const localizationPrefix = "TWODSIX.Settings.settingsInterface";
    game.settings.registerMenu("twodsix", menuName, {
      name: game.i18n.localize(`${localizationPrefix}.${menuName}.name`),
      label: game.i18n.localize(`${localizationPrefix}.${menuName}.name`),
      hint: game.i18n.localize(`${localizationPrefix}.${menuName}.hint`),
      icon: `fa-solid fa-${icon}`,
      type: cls,
      restricted
    });
  }
  /**
   * Prepare a record of form tabs.
   * @returns {Record<string, Partial<ApplicationTab>>}
   */
  getTabs(settings, initialTab) {
    const tabs = {};
    for (const key of Object.keys(settings)) {
      tabs[key] = {
        id: key,
        group: "primary",
        icon: getSettingIcon(key),
        label: `TWODSIX.Settings.menuLabels.${key}`,
        active: initialTab === key,
        cssClass: initialTab === key ? "active" : ""
      };
    }
    return tabs;
  }
};
__name$Q(_AdvancedSettings, "AdvancedSettings");
let AdvancedSettings = _AdvancedSettings;
function getSettingIcon(settingSubtype) {
  const iconMap = {
    general: "fa-solid fa-gear",
    roll: "fa-solid fa-dice-six",
    characteristics: "fa-solid fa-clipboard-user",
    formulas: "fa-solid fa-calculator",
    damage: "fa-solid fa-burst",
    movement: "fa-solid fa-person-walking",
    encumbrance: "fa-solid fa-weight-scale",
    wounds: "fa-solid fa-user-injured",
    ship: "fa-solid fa-rocket",
    animals_robots: "fa-solid fa-ghost",
    weapon: "fa-solid fa-gun",
    token: "fa-solid fa-chess-pawn",
    actor: "fa-regular fa-person",
    dragDrop: "fa-solid fa-square-caret-down",
    style: "fa-solid fa-file-code"
  };
  return iconMap[settingSubtype] || "fa-solid fa-circle-question";
}
__name$Q(getSettingIcon, "getSettingIcon");

var __defProp$P = Object.defineProperty;
var __name$P = (target, value) => __defProp$P(target, "name", { value, configurable: true });
const _DisplaySettings = class _DisplaySettings extends foundry.applications.api.HandlebarsApplicationMixin(AdvancedSettings) {
  constructor(object, options) {
    super(object, _DisplaySettings.settings, options);
    /** @override */
    this.tabGroups = {
      primary: "general"
      //set default tab
    };
  }
  static create() {
    _DisplaySettings.settings = _DisplaySettings.registerSettings();
    return _DisplaySettings;
  }
  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.tabs = this.getTabs(_DisplaySettings.settings, this.tabGroups.primary);
    return context;
  }
  static registerSettings() {
    const settings = {
      general: [],
      token: [],
      actor: [],
      ship: []
    };
    settings.token.push(booleanSetting("defaultTokenSettings", true));
    settings.token.push(booleanSetting("useSystemDefaultTokenIcon", false));
    settings.ship.push(booleanSetting("showSingleComponentColumn", false));
    settings.ship.push(booleanSetting("showBandwidth", false));
    settings.general.push(booleanSetting("useFoundryStandardStyle", false, false, "world", refreshWindow));
    settings.actor.push(booleanSetting("useWoundedStatusIndicators", false));
    settings.actor.push(booleanSetting("useEncumbranceStatusIndicators", false));
    settings.ship.push(booleanSetting("showWeightUsage", false));
    settings.general.push(booleanSetting("showActorReferences", true));
    settings.general.push(booleanSetting("usePDFPagerForRefs", false));
    settings.actor.push(booleanSetting("showIcons", false));
    settings.actor.push(booleanSetting("useEncumbrance", false));
    settings.actor.push(booleanSetting("showStatusIcons", true));
    settings.actor.push(booleanSetting("showRangeSpeedNoUnits", false));
    settings.actor.push(booleanSetting("showInitiativeButton", false));
    settings.actor.push(booleanSetting("showSkillCountsRanks", true));
    settings.ship.push(booleanSetting("showComponentSummaryIcons", false));
    settings.actor.push(booleanSetting("showSpells", false));
    settings.general.push(booleanSetting("showModifierDetails", false));
    settings.general.push(booleanSetting("showFeaturesInChat", false));
    settings.general.push(colorSetting("defaultColor", "#29aae1", "Color", false, "world", changeDefaultColor));
    settings.general.push(colorSetting("lightColor", "#00e5ff", "Color", false, "world", changeLightColor));
    settings.general.push(colorSetting("damageStatColor", "#b52c2c", "Color", false, "world", changeDamageColor));
    settings.general.push(colorSetting("battleColor", "#29aae1", "Color", false, "world", changeBattleColor));
    settings.general.push(booleanSetting("showHitsChangesInChat", false));
    settings.token.push(booleanSetting("reduceStatusIcons", false, false, "world", updateStatusIcons));
    settings.general.push(booleanSetting("useTabbedViews", false));
    settings.actor.push(booleanSetting("showAllCharWithTable", true));
    settings.general.push(booleanSetting("showTLonItemsTab", false, false, "world", setDocumentPartials));
    settings.actor.push(booleanSetting("omitPSIifZero", false));
    settings.actor.push(booleanSetting("omitALTifZero", false));
    settings.actor.push(stringChoiceSetting("equippedToggleStates", "default", true, TWODSIX$1.EQUIPPED_TOGGLE_OPTIONS));
    settings.actor.push(booleanSetting("showSkillGroups", false));
    settings.ship.push(stringSetting("jDriveLabel", "TWODSIX.Ship.JDrive", false, "world", updateJDrive, true));
    settings.ship.push(booleanSetting("showCost", false));
    settings.actor.push(booleanSetting("showTotalArmor", false));
    settings.general.push(booleanSetting("showItemIconsInChat", true));
    settings.actor.push(numberSetting("defaultActorSheetWidth", 915, false, "world", refreshWindow));
    settings.actor.push(numberSetting("defaultActorSheetHeight", 718, false, "world", refreshWindow));
    settings.ship.push(booleanSetting("showCombatPosition", false));
    settings.ship.push(booleanSetting("showCommonFundsMCr", true));
    const nonCargoTypes = foundry.utils.duplicate(TWODSIX$1.ComponentTypes);
    delete nonCargoTypes.cargo;
    delete nonCargoTypes.ammo;
    settings.ship.push(arrayChoiceSetting("componentsIgnored", [], true, nonCargoTypes));
    settings.token.push(booleanSetting("showMovementColors", false));
    settings.actor.push(booleanSetting("showTraitAE", true));
    return settings;
  }
};
__name$P(_DisplaySettings, "DisplaySettings");
/** @override */
_DisplaySettings.DEFAULT_OPTIONS = {
  classes: ["twodsix"],
  position: {
    width: 675,
    height: "auto"
  },
  window: {
    resizable: true,
    contentClasses: ["standard-form"],
    title: "TWODSIX.Settings.settingsInterface.displaySettings.name",
    icon: "fa-solid fa-tv"
  },
  form: {
    handler: AdvancedSettings.onSubmit,
    closeOnSubmit: true,
    submitOnChange: false,
    submitOnClose: false
  },
  tag: "form"
};
_DisplaySettings.PARTS = {
  main: {
    template: "systems/twodsix/templates/misc/advanced-settings.hbs",
    scrollable: [""]
  }
};
let DisplaySettings = _DisplaySettings;
const refreshWindow = /* @__PURE__ */ __name$P(function() {
  window.location.reload();
}, "refreshWindow");
const changeDefaultColor = /* @__PURE__ */ __name$P(function() {
  if (game.settings.get("twodsix", "defaultColor") === "") {
    game.settings.set("twodsix", "defaultColor", "#29aae1");
  }
  document.documentElement.style.setProperty("--s2d6-default-color", game.settings.get("twodsix", "defaultColor"));
}, "changeDefaultColor");
const changeBattleColor = /* @__PURE__ */ __name$P(function() {
  if (game.settings.get("twodsix", "battleColor") === "") {
    game.settings.set("twodsix", "battleColor", "#29aae1");
  }
  document.documentElement.style.setProperty("--s2d6-battle-color", game.settings.get("twodsix", "battleColor"));
}, "changeBattleColor");
const changeLightColor = /* @__PURE__ */ __name$P(function() {
  if (game.settings.get("twodsix", "lightColor") === "") {
    game.settings.set("twodsix", "lightColor", "#00e5ff");
  }
  document.documentElement.style.setProperty("--s2d6-light-color", game.settings.get("twodsix", "lightColor"));
}, "changeLightColor");
const changeDamageColor = /* @__PURE__ */ __name$P(function() {
  if (game.settings.get("twodsix", "damageStatColor") === "") {
    game.settings.set("twodsix", "damageStatColor", "#b52c2c");
  }
  document.documentElement.style.setProperty("--s2d6-damage-stat-color", game.settings.get("twodsix", "damageStatColor"));
}, "changeDamageColor");
const updateStatusIcons = /* @__PURE__ */ __name$P(function() {
  if (game.settings.get("twodsix", "reduceStatusIcons")) {
    CONFIG.statusEffects = CONFIG.statusEffects.filter((se) => [
      "dead",
      "unconscious",
      "stun",
      "sleep",
      "prone",
      "restrain",
      "paralysis",
      "fly",
      "blind",
      "corrode",
      "burning",
      "poison",
      "invisible",
      "target",
      "encumbered",
      "wounded",
      "aiming",
      "fatigued",
      "cover",
      "thrust",
      "irradiated",
      "target-lock"
    ].includes(se.id));
  } else {
    window.location.reload();
  }
}, "updateStatusIcons");
const setDocumentPartials = /* @__PURE__ */ __name$P(function() {
  if (game.settings.get("twodsix", "showTLonItemsTab")) {
    foundry.applications.sidebar.tabs.ItemDirectory._entryPartial = "systems/twodsix/templates/misc/revised-document-partial.hbs";
    foundry.applications.sidebar.apps.Compendium._entryPartial = "systems/twodsix/templates/misc/revised-compendium-index-partial.hbs";
  } else {
    foundry.applications.sidebar.tabs.ItemDirectory._entryPartial = game.settings.get("twodsix", "defaultItemPartial");
    foundry.applications.sidebar.apps.Compendium._entryPartial = game.settings.get("twodsix", "defaultCompendiumPartial");
  }
  ui.items.render();
}, "setDocumentPartials");
const updateJDrive = /* @__PURE__ */ __name$P(function(value) {
  if (value === "") {
    game.settings.set("twodsix", "jDriveLabel", "TWODSIX.Ship.JDrive");
  }
}, "updateJDrive");

var __defProp$O = Object.defineProperty;
var __name$O = (target, value) => __defProp$O(target, "name", { value, configurable: true });
const _RulesetSettings = class _RulesetSettings extends foundry.applications.api.HandlebarsApplicationMixin(AdvancedSettings) {
  constructor(object, options) {
    super(object, _RulesetSettings.settings, options);
    /** @override */
    this.tabGroups = {
      primary: "general"
      //set default tab
    };
  }
  static create() {
    _RulesetSettings.settings = _RulesetSettings.registerSettings();
    return _RulesetSettings;
  }
  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const ruleset = TWODSIX$1.RULESETS[game.settings.get("twodsix", "ruleset")];
    const rulesetSettings = TWODSIX$1.RULESETS[ruleset.key].settings;
    const settings = Object.entries(rulesetSettings).map(([settingName, value]) => {
      return game.settings.get("twodsix", settingName) === value;
    });
    const modified = game.i18n.localize("TWODSIX.Settings.settingsInterface.rulesetSettings.modified");
    const rulesetName = ruleset.name + (settings.every((v) => v) ? "" : ` (${modified})`);
    context.intro = `<h2>${game.i18n.localize(`TWODSIX.Settings.settingsInterface.rulesetSettings.intro`)}: ${rulesetName}</h2>`;
    context.tabs = this.getTabs(_RulesetSettings.settings, this.tabGroups.primary);
    return context;
  }
  static registerSettings() {
    const DEFAULT_INITIATIVE_FORMULA = "2d6 + @characteristics.dexterity.mod";
    const DEFAULT_SHIP_INITIATIVE_FORMULA = "2d6";
    const DEFAULT_MAX_ENCUMBRANCE_FORMULA = "12 * @characteristics.strength.current";
    const settings = {
      general: [],
      roll: [],
      characteristics: [],
      damage: [],
      movement: [],
      encumbrance: [],
      wounds: [],
      ship: [],
      animals_robots: []
    };
    settings.general.push(stringSetting("initiativeFormula", DEFAULT_INITIATIVE_FORMULA, false, "world"));
    settings.damage.push(stringSetting("armorDamageFormula", "@damage - @effectiveArmor", false, "world"));
    settings.damage.push(booleanSetting("useMaxArmorValue", false, false, "world", refreshWindow));
    settings.ship.push(stringSetting("shipInitiativeFormula", DEFAULT_SHIP_INITIATIVE_FORMULA, false, "world"));
    settings.roll.push(stringChoiceSetting("difficultyListUsed", TWODSIX$1.RULESETS.CE.key, false, TWODSIX$1.DIFFICULTY_VARIANTS));
    settings.roll.push(booleanSetting("difficultiesAsTargetNumber", false));
    settings.general.push(stringChoiceSetting("autofireRulesUsed", TWODSIX$1.RULESETS.CE.key, false, TWODSIX$1.AUTOFIRE_VARIANTS));
    settings.characteristics.push(numberSetting("modifierForZeroCharacteristic", -2));
    settings.roll.push(stringSetting("termForAdvantage", "advantage"));
    settings.roll.push(stringSetting("termForDisadvantage", "disadvantage"));
    settings.roll.push(numberSetting("absoluteBonusValueForEachTimeIncrement", -1));
    settings.general.push(numberSetting("maxSkillLevel", 9));
    settings.roll.push(booleanSetting("criticalNaturalAffectsEffect", false));
    settings.roll.push(numberSetting("absoluteCriticalEffectValue", 99));
    settings.characteristics.push(booleanSetting("showLifebloodStamina", false));
    settings.wounds.push(numberSetting("minorWoundsRollModifier", 0));
    settings.wounds.push(numberSetting("seriousWoundsRollModifier", 0));
    settings.characteristics.push(booleanSetting("lifebloodInsteadOfCharacteristics", false));
    settings.characteristics.push(booleanSetting("showContaminationBelowLifeblood", true));
    settings.characteristics.push(booleanSetting("showHeroPoints", false));
    settings.characteristics.push(stringChoiceSetting("showAlternativeCharacteristics", "base", true, TWODSIX$1.CharacteristicDisplayTypes));
    settings.characteristics.push(stringSetting("shortSTR", "TWODSIX.Items.Skills.STR", false, "world", updateSTRShortLabel, true));
    settings.characteristics.push(stringSetting("shortDEX", "TWODSIX.Items.Skills.DEX", false, "world", updateDEXShortLabel, true));
    settings.characteristics.push(stringSetting("shortEND", "TWODSIX.Items.Skills.END", false, "world", updateENDShortLabel, true));
    settings.characteristics.push(stringSetting("shortINT", "TWODSIX.Items.Skills.INT", false, "world", updateINTShortLabel, true));
    settings.characteristics.push(stringSetting("shortEDU", "TWODSIX.Items.Skills.EDU", false, "world", updateEDUShortLabel, true));
    settings.characteristics.push(stringSetting("shortSOC", "TWODSIX.Items.Skills.SOC", false, "world", updateSOCShortLabel, true));
    settings.characteristics.push(stringSetting("shortPSI", "TWODSIX.Items.Skills.PSI", false, "world", updatePSIShortLabel, true));
    settings.characteristics.push(stringSetting("alternativeShort1", "ALT1"));
    settings.characteristics.push(stringSetting("alternativeShort2", "ALT2"));
    settings.characteristics.push(stringSetting("alternativeShort3", "ALT3"));
    settings.ship.push(numberSetting("maxComponentHits", 3));
    settings.ship.push(numberSetting("mortgagePayment", 240, false));
    settings.ship.push(stringSetting("massProductionDiscount", "0.10", false));
    settings.wounds.push(booleanSetting("reverseHealingOrder", false));
    settings.encumbrance.push(stringSetting("maxEncumbrance", DEFAULT_MAX_ENCUMBRANCE_FORMULA, false, "world"));
    settings.encumbrance.push(stringSetting("encumbranceFraction", "0.5", false));
    settings.encumbrance.push(numberSetting("encumbranceModifier", -1, false));
    settings.encumbrance.push(stringSetting("weightModifierForWornArmor", "1.0", false));
    settings.movement.push(numberSetting("defaultMovement", 10));
    settings.movement.push(stringChoiceSetting("defaultMovementUnits", "m", true, TWODSIX$1.MovementUnits));
    settings.movement.push(stringSetting("encumbFractionOneSquare", "0.5"));
    settings.movement.push(stringSetting("encumbFraction75pct", "0.33"));
    settings.ship.push(booleanSetting("addEffectForShipDamage", false));
    settings.damage.push(stringSetting("unarmedDamage", "1d6", false, "world"));
    settings.roll.push(booleanSetting("showTimeframe", false));
    settings.roll.push(booleanSetting("autoIncrementTime", false));
    settings.general.push(stringChoiceSetting("showHullAndArmor", "armorOnly", true, TWODSIX$1.VehicleProtection));
    settings.general.push(stringSetting("sorcerySkill", "Sorcery", false, "world"));
    settings.general.push(numberSetting("maxSpellLevel", 7, false, "world"));
    settings.general.push(booleanSetting("useNationality", false));
    settings.animals_robots.push(booleanSetting("animalsUseHits", false));
    settings.animals_robots.push(booleanSetting("robotsUseHits", false));
    settings.animals_robots.push(booleanSetting("animalsUseLocations", false));
    settings.animals_robots.push(booleanSetting("animalTypesIndependentofNiche", false));
    settings.animals_robots.push(booleanSetting("displayReactionMorale", false));
    settings.damage.push(booleanSetting("useDodgeParry", false));
    settings.damage.push(largeStringSetting("damageTypeOptions", "", false, "world"));
    settings.damage.push(booleanSetting("addEffectToDamage", true, false, "world", checkManualDamageSetting));
    settings.damage.push(booleanSetting("addEffectToManualDamage", false, false, "world", checkManualDamageSetting));
    settings.roll.push(stringChoiceSetting("useDegreesOfSuccess", "none", true, TWODSIX$1.SuccessTypes));
    settings.roll.push(booleanSetting("overrideSuccessWithNaturalCrit", false));
    settings.general.push(stringChoiceSetting("rangeModifierType", "none", true, TWODSIX$1.RANGE_MODIFIERS_TYPES));
    settings.general.push(numberSetting("meleeRange", 2, false, "world"));
    settings.roll.push(largeStringSetting("targetDMList", "", false, "world", generateTargetDMObject));
    settings.roll.push(stringSetting("chainBonus", "", false, "world"));
    settings.roll.push(booleanSetting("psiTalentsRequireRoll", false));
    settings.roll.push(booleanSetting("xd6RollStyle", false));
    settings.ship.push(numberSetting("componentDamageDM", 0, false));
    const weaponTypeLookup = Object.keys(TWODSIX$1.ShipWeaponTypes).reduce((acc, key) => {
      acc[key] = key;
      return acc;
    }, {});
    settings.ship.push(stringChoiceSetting("shipWeaponType", "CE", false, weaponTypeLookup));
    settings.ship.push(stringChoiceSetting("shipDamageType", "component", true, TWODSIX$1.ShipDamageRules));
    return settings;
  }
};
__name$O(_RulesetSettings, "RulesetSettings");
/** @override */
_RulesetSettings.DEFAULT_OPTIONS = {
  classes: ["twodsix"],
  position: {
    width: 675,
    height: "auto"
  },
  window: {
    resizable: true,
    contentClasses: ["standard-form"],
    title: "TWODSIX.Settings.settingsInterface.rulesetSettings.name",
    icon: "fa-solid fa-gavel"
  },
  form: {
    handler: AdvancedSettings.onSubmit,
    closeOnSubmit: true,
    submitOnChange: false,
    submitOnClose: false
  },
  tag: "form"
};
_RulesetSettings.PARTS = {
  main: {
    template: "systems/twodsix/templates/misc/advanced-settings.hbs",
    scrollable: [""]
  }
};
let RulesetSettings = _RulesetSettings;
const checkManualDamageSetting = /* @__PURE__ */ __name$O(function() {
  if (!game.settings.get("twodsix", "addEffectToDamage") && game.settings.get("twodsix", "addEffectToManualDamage")) {
    game.settings.set("twodsix", "addEffectToManualDamage", false);
    ui.notifications.warn("TWODSIX.Warnings.ResetEffectForManualDamage", { localize: true });
  }
}, "checkManualDamageSetting");
const updateSTRShortLabel = /* @__PURE__ */ __name$O(function(value) {
  if (!value) {
    game.settings.set("twodsix", "shortSTR", "TWODSIX.Items.Skills.STR");
  }
}, "updateSTRShortLabel");
const updateDEXShortLabel = /* @__PURE__ */ __name$O(function(value) {
  if (!value) {
    game.settings.set("twodsix", "shortDEX", "TWODSIX.Items.Skills.DEX");
  }
}, "updateDEXShortLabel");
const updateENDShortLabel = /* @__PURE__ */ __name$O(function(value) {
  if (!value) {
    game.settings.set("twodsix", "shortEND", "TWODSIX.Items.Skills.END");
  }
}, "updateENDShortLabel");
const updateINTShortLabel = /* @__PURE__ */ __name$O(function(value) {
  if (!value) {
    game.settings.set("twodsix", "shortINT", "TWODSIX.Items.Skills.INT");
  }
}, "updateINTShortLabel");
const updateEDUShortLabel = /* @__PURE__ */ __name$O(function(value) {
  if (!value) {
    game.settings.set("twodsix", "shortEDU", "TWODSIX.Items.Skills.EDU");
  }
}, "updateEDUShortLabel");
const updateSOCShortLabel = /* @__PURE__ */ __name$O(function(value) {
  if (!value) {
    game.settings.set("twodsix", "shortSOC", "TWODSIX.Items.Skills.SOC");
  }
}, "updateSOCShortLabel");
const updatePSIShortLabel = /* @__PURE__ */ __name$O(function(value) {
  if (!value) {
    game.settings.set("twodsix", "shortPSI", "TWODSIX.Items.Skills.PSI");
  }
}, "updatePSIShortLabel");

var __defProp$N = Object.defineProperty;
var __name$N = (target, value) => __defProp$N(target, "name", { value, configurable: true });
const _ItemSettings = class _ItemSettings extends foundry.applications.api.HandlebarsApplicationMixin(AdvancedSettings) {
  constructor(object, options) {
    super(object, _ItemSettings.settings, options);
    /** @override */
    this.tabGroups = {
      primary: "weapon"
      //set default tab
    };
  }
  static create() {
    _ItemSettings.settings = _ItemSettings.registerSettings();
    return _ItemSettings;
  }
  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.tabs = this.getTabs(_ItemSettings.settings, this.tabGroups.primary);
    return context;
  }
  static registerSettings() {
    const settings = {
      weapon: [],
      ship: []
    };
    settings.weapon.push(booleanSetting("ShowLawLevel", false));
    settings.weapon.push(booleanSetting("ShowWeaponType", false));
    settings.weapon.push(booleanSetting("ShowDamageType", false));
    settings.weapon.push(booleanSetting("ShowRateOfFire", true));
    settings.weapon.push(booleanSetting("ShowRecoil", false));
    settings.weapon.push(booleanSetting("ShowDoubleTap", false));
    settings.weapon.push(stringSetting("defaultWeaponDamage", "1d6", false));
    settings.weapon.push(booleanSetting("autoTargetAOE", false));
    settings.ship.push(booleanSetting("showComponentRating", true));
    settings.ship.push(booleanSetting("showComponentDM", true));
    return settings;
  }
};
__name$N(_ItemSettings, "ItemSettings");
/** @override */
_ItemSettings.DEFAULT_OPTIONS = {
  classes: ["twodsix"],
  position: {
    width: 675,
    height: "auto"
  },
  window: {
    resizable: true,
    contentClasses: ["standard-form"],
    title: "TWODSIX.Settings.settingsInterface.itemSettings.name",
    icon: "fa-solid fa-bars"
  },
  form: {
    handler: AdvancedSettings.onSubmit,
    closeOnSubmit: true,
    submitOnChange: false,
    submitOnClose: false
  },
  tag: "form"
};
_ItemSettings.PARTS = {
  main: {
    template: "systems/twodsix/templates/misc/advanced-settings.hbs",
    scrollable: [""]
  }
};
let ItemSettings = _ItemSettings;

var __defProp$M = Object.defineProperty;
var __name$M = (target, value) => __defProp$M(target, "name", { value, configurable: true });
const _DebugSettings = class _DebugSettings extends foundry.applications.api.HandlebarsApplicationMixin(AdvancedSettings) {
  constructor(object, options) {
    super(object, _DebugSettings.settings, options);
    /** @override */
    this.tabGroups = {
      primary: "general"
      //set default tab
    };
  }
  static create() {
    _DebugSettings.settings = _DebugSettings.registerSettings();
    return _DebugSettings;
  }
  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.tabs = this.getTabs(_DebugSettings.settings, this.tabGroups.primary);
    return context;
  }
  static registerSettings() {
    const settings = {
      general: [],
      style: [],
      dragDrop: []
    };
    settings.general.push(booleanSetting("ExperimentalFeatures", false));
    settings.general.push(stringSetting("systemMigrationVersion", ""));
    settings.style.push(booleanSetting("useModuleFixStyle", false, false, "world", refreshWindow));
    settings.general.push(booleanSetting("useShipAutoCalcs", false, false, "world", refreshWindow));
    settings.style.push(booleanSetting("useProseMirror", false));
    settings.dragDrop.push(booleanSetting("allowDropOnIcon", false));
    settings.dragDrop.push(booleanSetting("allowDragDropOfListsActor", false));
    settings.dragDrop.push(booleanSetting("allowDragDropOfListsShip", false));
    settings.general.push(booleanSetting("useItemActiveEffects", true, false, "world", deactivateActorAE));
    return settings;
  }
};
__name$M(_DebugSettings, "DebugSettings");
/** @override */
_DebugSettings.DEFAULT_OPTIONS = {
  classes: ["twodsix"],
  position: {
    width: 675,
    height: "auto"
  },
  window: {
    resizable: true,
    contentClasses: ["standard-form"],
    title: "TWODSIX.Settings.settingsInterface.debugSettings.name",
    icon: "fa-solid fa-flask"
  },
  form: {
    handler: AdvancedSettings.onSubmit,
    closeOnSubmit: true,
    submitOnChange: false,
    submitOnClose: false
  },
  tag: "form"
};
_DebugSettings.PARTS = {
  main: {
    template: "systems/twodsix/templates/misc/advanced-settings.hbs",
    scrollable: [""]
  }
};
let DebugSettings = _DebugSettings;
async function deactivateActorAE() {
  await applyToAllActors(toggleActorItemAEs);
  await applyToAllItems(toggleItemAEs);
}
__name$M(deactivateActorAE, "deactivateActorAE");
async function toggleActorItemAEs(actor) {
  for (const item of actor.items) {
    await toggleItemAEs(item);
  }
}
__name$M(toggleActorItemAEs, "toggleActorItemAEs");
async function toggleItemAEs(item) {
  for (const effect of item.effects.contents) {
    if (effect.transfer !== game.settings.get("twodsix", "useItemActiveEffects")) {
      await effect.update({ "transfer": game.settings.get("twodsix", "useItemActiveEffects") });
    }
  }
}
__name$M(toggleItemAEs, "toggleItemAEs");

var __defProp$L = Object.defineProperty;
var __name$L = (target, value) => __defProp$L(target, "name", { value, configurable: true });
const registerSettings = /* @__PURE__ */ __name$L(function() {
  RulesetSettings.registerMenu(RulesetSettings.create(), "rulesetSettings", "gavel");
  ItemSettings.registerMenu(ItemSettings.create(), "itemSettings", "bars");
  DisplaySettings.registerMenu(DisplaySettings.create(), "displaySettings", "tv");
  DebugSettings.registerMenu(DebugSettings.create(), "debugSettings", "flask");
  const rulesetOptions = Object.entries(TWODSIX$1.RULESETS).map(([id, ruleset]) => {
    return [id, ruleset["name"]];
  }).sort(function(a, b) {
    if (a[1] < b[1]) {
      return -1;
    }
    if (a[1] > b[1]) {
      return 1;
    }
    return 0;
  });
  stringChoiceSetting("ruleset", TWODSIX$1.RULESETS["CE"].key, false, Object.fromEntries(rulesetOptions), true);
  game.settings.register("twodsix", "overrideDamageRoll", {
    name: game.i18n.localize("TWODSIX.Settings.overrideDamageRoll.name"),
    hint: game.i18n.localize("TWODSIX.Settings.overrideDamageRoll.hint"),
    scope: "world",
    config: true,
    requiresReload: true,
    type: Boolean,
    default: false,
    onChange: _overrideDamageRollSetting
  });
  booleanSetting("automateDamageRollOnHit", true, true, game.settings.get("twodsix", "overrideDamageRoll") ? "world" : "client");
  booleanSetting("autoDamageTarget", false, true, "world");
  booleanSetting("hideUntrainedSkills", false, true, "world", _onHideUntrainedSkillsChange);
  booleanSetting("invertSkillRollShiftClick", false, true);
  booleanSetting("transferDroppedItems", false, true);
  booleanSetting("autoAddUnarmed", false, true);
  booleanSetting("NoDuplicatesOnHotbar", false, true, "client");
  stringSetting("defaultItemPartial", foundry.applications.sidebar.tabs.ItemDirectory._entryPartial, false, "client");
  stringSetting("defaultCompendiumPartial", foundry.applications.sidebar.apps.Compendium._entryPartial, false, "client");
  function _onHideUntrainedSkillsChange(setting) {
    if (!setting) {
      TwodsixActor.resetUntrainedSkill();
    } else {
      TwodsixActor.setUntrainedSkillForItems();
    }
  }
  __name$L(_onHideUntrainedSkillsChange, "_onHideUntrainedSkillsChange");
  function _overrideDamageRollSetting(setting) {
    const currentValue = game.settings.get("twodsix", "automateDamageRollOnHit");
    if (currentValue !== void 0) {
      const setScope = setting ? "world" : "client";
      game.settings.set("twodsix", "automateDamageRollOnHit", currentValue, { scope: setScope, default: currentValue, config: true, type: Boolean });
    }
  }
  __name$L(_overrideDamageRollSetting, "_overrideDamageRollSetting");
}, "registerSettings");
function switchCss(fileName) {
  const head = document.getElementsByTagName("head")[0];
  const mainCss = document.createElement("style");
  mainCss.textContent = ` @import "${fileName}" layer(system); `;
  head.insertBefore(mainCss, head.lastChild);
}
__name$L(switchCss, "switchCss");

function __variableDynamicImportRuntime0__$1(path) {
  switch (path) {
    case '../migrations/2021_12_29_19_02_28_reset-migration-schema-version.ts': return Promise.resolve().then(function () { return _2021_12_29_19_02_28_resetMigrationSchemaVersion; });
    case '../migrations/2022-01-03-06-15-30-merge-contacts.ts': return Promise.resolve().then(function () { return _20220103061530MergeContacts; });
    case '../migrations/2022_4_27_09_05_00_fix_move_units.ts': return Promise.resolve().then(function () { return _2022_4_27_09_05_00_fix_move_units; });
    case '../migrations/2023_01_20_09_48_00_refactor_conditions.ts': return Promise.resolve().then(function () { return _2023_01_20_09_48_00_refactor_conditions; });
    case '../migrations/2023_04_01_014_41_00_refactor_damageTypes.ts': return Promise.resolve().then(function () { return _2023_04_01_014_41_00_refactor_damageTypes; });
    case '../migrations/2023_06_21_08_18_refactor_item_effect.ts': return Promise.resolve().then(function () { return _2023_06_21_08_18_refactor_item_effect; });
    case '../migrations/2023_06_29_14_29_fix_badMigration.ts': return Promise.resolve().then(function () { return _2023_06_29_14_29_fix_badMigration; });
    case '../migrations/2023_08_09_11_51_fix_fractional_string_settings.ts': return Promise.resolve().then(function () { return _2023_08_09_11_51_fix_fractional_string_settings; });
    case '../migrations/2023_08_30_12_58_add_associatedSkill_to_spells.ts': return Promise.resolve().then(function () { return _2023_08_30_12_58_add_associatedSkill_to_spells; });
    case '../migrations/2023_09_16_08_232_fix_bad_Equipped_state.ts': return Promise.resolve().then(function () { return _2023_09_16_08_232_fix_bad_Equipped_state; });
    case '../migrations/2023_10_21_09_05_add_finance_values.ts': return Promise.resolve().then(function () { return _2023_10_21_09_05_add_finance_values; });
    case '../migrations/2023_11_29_13_35_refactor_rangeLabels.ts': return Promise.resolve().then(function () { return _2023_11_29_13_35_refactor_rangeLabels; });
    case '../migrations/2023_12_30_10_32_refactor_rangeModifier.ts': return Promise.resolve().then(function () { return _2023_12_30_10_32_refactor_rangeModifier; });
    case '../migrations/2024_01_08_17_12_refactor_range.ts': return Promise.resolve().then(function () { return _2024_01_08_17_12_refactor_range; });
    case '../migrations/2024_04_01_08_28_migrate_data.ts': return Promise.resolve().then(function () { return _2024_04_01_08_28_migrate_data; });
    case '../migrations/2024_04_12_12_31_migrate_age.ts': return Promise.resolve().then(function () { return _2024_04_12_12_31_migrate_age; });
    case '../migrations/2024_07_01_12_28_migrate_disabled.ts': return Promise.resolve().then(function () { return _2024_07_01_12_28_migrate_disabled; });
    case '../migrations/2025_01_20_09_11_refactor_armorPiercing.ts': return Promise.resolve().then(function () { return _2025_01_20_09_11_refactor_armorPiercing; });
    case '../migrations/6_2025_05_28_08_09_rename_commonFunds.ts': return Promise.resolve().then(function () { return _6_2025_05_28_08_09_rename_commonFunds; });
    default: return new Promise(function(resolve, reject) {
      (typeof queueMicrotask === 'function' ? queueMicrotask : setTimeout)(
        reject.bind(null, new Error("Unknown variable dynamic import: " + path))
      );
    })
   }
 }
var __defProp$K = Object.defineProperty;
var __name$K = (target, value) => __defProp$K(target, "name", { value, configurable: true });
async function migrateWorld(version) {
  await migrationFileNames.sort().reduce(async (prev, migrationName) => {
    await prev;
    if (migrationName > version) {
      const migration = await __variableDynamicImportRuntime0__$1(`../migrations/${migrationName}.ts`);
      console.log("Migrating", migrationName);
      await migration.migrate();
      console.log("Done migrating", migrationName);
      await game.settings.set("twodsix", "systemMigrationVersion", migrationName);
    }
  }, Promise.resolve());
  console.log("Done with all migrations");
}
__name$K(migrateWorld, "migrateWorld");

var __defProp$J = Object.defineProperty;
var __name$J = (target, value) => __defProp$J(target, "name", { value, configurable: true });
async function rollItemMacro(itemId, itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) {
    actor = game.actors.tokens[speaker.token];
  }
  if (!actor && speaker.actor) {
    actor = game.actors.get(speaker.actor);
  }
  const item = actor ? actor.items.get(itemId) ?? actor.items.getName(itemName) : void 0;
  if (!item) {
    const unattachedItem = game.items.get(itemId) ?? game.items.getName(itemName);
    if (unattachedItem?.type != "weapon" && !actor && unattachedItem) {
      await unattachedItem.skillRoll(true);
    } else {
      ui.notifications.warn(game.i18n.localize("TWODSIX.Warnings.ActorMissingItem").replace("_ITEM_ID_", itemId));
    }
  } else {
    if (item.type != "weapon") {
      await item.skillRoll(!game.settings.get("twodsix", "invertSkillRollShiftClick"));
    } else {
      await item.resolveUnknownAutoMode(true);
    }
  }
}
__name$J(rollItemMacro, "rollItemMacro");

var __defProp$I = Object.defineProperty;
var __name$I = (target, value) => __defProp$I(target, "name", { value, configurable: true });
const _TwodsixVehicleSheet = class _TwodsixVehicleSheet extends foundry.applications.api.HandlebarsApplicationMixin(AbstractTwodsixActorSheet) {
  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    Object.assign(context.settings, {
      showHullAndArmor: game.settings.get("twodsix", "showHullAndArmor"),
      showRangeSpeedNoUnits: game.settings.get("twodsix", "showRangeSpeedNoUnits"),
      maxComponentHits: game.settings.get("twodsix", "maxComponentHits")
    });
    if (game.settings.get("twodsix", "useProseMirror")) {
      const TextEditorImp = foundry.applications.ux.TextEditor.implementation;
      context.richText = {
        description: await TextEditorImp.enrichHTML(context.system.description, { secrets: this.document.isOwner })
      };
    }
    return context;
  }
  static _onToggleComponent(ev, target) {
    if (target) {
      const vehicleSystem = target.dataset.key;
      const stateTransitions = { "operational": "damaged", "damaged": "destroyed", "destroyed": "off", "off": "operational" };
      if (vehicleSystem) {
        const newState = ev.shiftKey ? this.actor.system.systemStatus[vehicleSystem] === "off" ? "operational" : "off" : stateTransitions[this.actor.system.systemStatus[vehicleSystem]];
        this.actor.update({ [`system.systemStatus.${vehicleSystem}`]: newState });
      } else {
        const li = target.closest(".item");
        const itemSelected = this.actor.items.get(li.dataset.itemId);
        if (!itemSelected) {
          return;
        }
        const type = target.dataset.type;
        if (type === "status") {
          const newState = ev.shiftKey ? itemSelected.system.status === "off" ? "operational" : "off" : stateTransitions[itemSelected.system.status];
          itemSelected.update({ "system.status": newState });
        } else if (type === "popup") {
          itemSelected.update({ "system.isExtended": !itemSelected.system.isExtended });
        }
      }
    }
  }
  /**
   * Handle clickable skill rolls.
   * @param {Event} ev   The originating click event
   * @private
   */
  static async _onSkillRollVehicle(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const useInvertedShiftClick = game.settings.get("twodsix", "invertSkillRollShiftClick");
    const showThrowDiag = useInvertedShiftClick ? ev["shiftKey"] : !ev["shiftKey"];
    const selectedActor = getControlledTraveller();
    if (selectedActor) {
      let skill = selectedActor.items.getName(this.actor.system.skillToOperate);
      if (!skill) {
        skill = selectedActor.items.find((itm) => itm.name === game.i18n.localize("TWODSIX.Actor.Skills.Untrained") && itm.type === "skills");
      }
      const tmpSettings = {
        rollModifiers: { other: this.actor.system.maneuver.agility ? parseInt(this.actor.system.maneuver.agility) : 0 },
        event: ev
      };
      const settings = await TwodsixRollSettings.create(showThrowDiag, tmpSettings, skill, void 0, selectedActor);
      if (!settings.shouldRoll) {
        return;
      }
      await skill?.skillRoll(showThrowDiag, settings);
    } else {
      ui.notifications.warn("TWODSIX.Warnings.NoActorSelected", { localize: true });
    }
  }
};
__name$I(_TwodsixVehicleSheet, "TwodsixVehicleSheet");
_TwodsixVehicleSheet.DEFAULT_OPTIONS = {
  sheetType: "TwodsixVehicleSheet",
  classes: ["twodsix", "vehicle", "actor"],
  dragDrop: [{ dragSelector: ".item", dropSelector: null }],
  position: {
    width: 835,
    height: 600
  },
  window: {
    resizable: true,
    icon: "fa-solid fa-truck-plane"
  },
  form: {
    submitOnChange: true,
    submitOnClose: true
  },
  actions: {
    toggleComponent: _TwodsixVehicleSheet._onToggleComponent,
    rollSkillVehicle: _TwodsixVehicleSheet._onSkillRollVehicle
  },
  tag: "form"
};
_TwodsixVehicleSheet.PARTS = {
  main: {
    template: "systems/twodsix/templates/actors/vehicle-sheet.hbs",
    scrollable: ["", ".vehicle-storage", ".vehicle-components"]
  }
};
_TwodsixVehicleSheet.TABS = {
  primary: {
    tabs: [
      { id: "stats", icon: "fa-solid fa-chart-bar", label: "TWODSIX.Vehicle.Tabs.Stats" },
      { id: "components", icon: "fa-solid fa-gears", label: "TWODSIX.Vehicle.Tabs.Components" },
      { id: "cargo", icon: "fa-solid fa-boxes-stacked", label: "TWODSIX.Vehicle.Tabs.Cargo" },
      { id: "storage", icon: "fa-solid fa-vault", label: "TWODSIX.Vehicle.Tabs.Storage" },
      { id: "description", icon: "fa-solid fa-book", label: "TWODSIX.Vehicle.Tabs.Description" }
    ],
    initial: "stats"
  }
};
let TwodsixVehicleSheet = _TwodsixVehicleSheet;
function getControlledTraveller() {
  if (game.user?.isGM !== true) {
    if (game.user?.character) {
      return game.user.character;
    } else {
      const playerId = game.userId;
      if (playerId !== null) {
        const character = game.actors?.find((a) => a.permission === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER && a.type === "traveller" && !!a.getActiveTokens()[0]);
        if (character != null) {
          return game.actors?.get(character.id);
        }
      }
    }
  } else {
    if (canvas.tokens?.controlled !== void 0) {
      const selectedToken = canvas.tokens?.controlled.find((ct) => ct.actor?.type === "traveller");
      if (selectedToken) {
        return selectedToken.actor;
      }
    }
  }
}
__name$I(getControlledTraveller, "getControlledTraveller");

var __defProp$H = Object.defineProperty;
var __name$H = (target, value) => __defProp$H(target, "name", { value, configurable: true });
const _TwodsixAnimalSheet = class _TwodsixAnimalSheet extends foundry.applications.api.HandlebarsApplicationMixin(AbstractTwodsixActorSheet) {
  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    if (game.settings.get("twodsix", "useProseMirror")) {
      const TextEditorImp = foundry.applications.ux.TextEditor.implementation;
      context.richText = {
        description: await TextEditorImp.enrichHTML(context.system.description, { secrets: this.document.isOwner }),
        notes: await TextEditorImp.enrichHTML(context.system.notes, { secrets: this.document.isOwner })
      };
    }
    Object.assign(context.settings, {
      useHits: game.settings.get("twodsix", "animalsUseHits"),
      animalsUseLocations: game.settings.get("twodsix", "animalsUseLocations"),
      displayReactionMorale: game.settings.get("twodsix", "displayReactionMorale"),
      useAllAnimalTypes: game.settings.get("twodsix", "animalTypesIndependentofNiche")
    });
    return context;
  }
  static async _onRollReaction() {
    const reaction = this.actor.system.reaction;
    let rollString = "2d6";
    if (this.actor.system.woundedEffect) {
      rollString += " + @woundedEffect";
    }
    const roll = await new Roll(rollString, this.actor.getRollData()).roll({ rollMode: CONST.DICE_ROLL_MODES.PRIVATE });
    let flavor = "";
    if (isNaN(reaction.flee) || isNaN(reaction.attack) || reaction.flee >= reaction.attack) {
      ui.notifications.warn("TWODSIX.Warnings.InvalidReactionInputs", { localize: true });
    } else {
      if (roll.total >= reaction.attack) {
        flavor = game.i18n.localize("TWODSIX.Animal.AttacksMessage");
      } else if (roll.total <= reaction.flee) {
        flavor = game.i18n.localize("TWODSIX.Animal.FleesMessage");
      } else {
        flavor = game.i18n.localize("TWODSIX.Animal.NoReactionMessage");
      }
      await roll.toMessage(
        {
          title: game.i18n.localize("TWODSIX.Animal.Reaction"),
          speaker: ChatMessage.getSpeaker({ alias: this.actor.name }),
          flavor,
          style: CONST.CHAT_MESSAGE_STYLES.OTHER
        },
        { rollMode: CONST.DICE_ROLL_MODES.PRIVATE }
      );
    }
  }
  static async _onRollMorale() {
    let rollString = "2d6";
    if (this.actor.system.woundedEffect) {
      rollString += " + @woundedEffect";
    }
    if (this.actor.system.moraleDM) {
      rollString += " + @moraleDM";
    }
    const roll = await new Roll(rollString, this.actor.getRollData()).roll({ rollMode: CONST.DICE_ROLL_MODES.PRIVATE });
    let flavor = "";
    if (roll.total <= 5) {
      flavor = game.i18n.localize("TWODSIX.Animal.Retreat");
    } else if (roll.total <= 8) {
      flavor = game.i18n.localize("TWODSIX.Animal.FightingWithdrawal");
    } else if (roll.total <= 11) {
      flavor = game.i18n.localize("TWODSIX.Animal.KeepFighting");
    } else if (roll.total <= 15) {
      flavor = game.i18n.localize("TWODSIX.Animal.Advance");
    } else {
      flavor = game.i18n.localize("TWODSIX.Animal.FightToTheDeath");
    }
    await roll.toMessage(
      {
        title: game.i18n.localize("TWODSIX.Animal.MoraleRoll"),
        speaker: ChatMessage.getSpeaker({ alias: this.actor.name }),
        flavor,
        style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        rolls: [roll]
      },
      { rollMode: CONST.DICE_ROLL_MODES.PRIVATE }
    );
  }
};
__name$H(_TwodsixAnimalSheet, "TwodsixAnimalSheet");
_TwodsixAnimalSheet.DEFAULT_OPTIONS = {
  sheetType: "TwodsixAnimalSheet",
  classes: ["twodsix", "sheet", "animal-actor"],
  dragDrop: [{ dragSelector: ".item-name", dropSelector: null }],
  position: {
    width: 720,
    height: 470
  },
  window: {
    resizable: true,
    icon: "fa-solid fa-hippo"
  },
  form: {
    submitOnChange: true,
    submitOnClose: true
  },
  actions: {
    rollReaction: _TwodsixAnimalSheet._onRollReaction,
    rollMorale: _TwodsixAnimalSheet._onRollMorale
  },
  tag: "form"
};
_TwodsixAnimalSheet.PARTS = {
  main: {
    template: "systems/twodsix/templates/actors/animal-sheet.hbs"
    //scrollable: ['']
  }
};
let TwodsixAnimalSheet = _TwodsixAnimalSheet;

var __defProp$G = Object.defineProperty;
var __name$G = (target, value) => __defProp$G(target, "name", { value, configurable: true });
const _TwodsixRobotSheet = class _TwodsixRobotSheet extends AbstractTwodsixActorSheet {
  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    if (game.settings.get("twodsix", "useProseMirror")) {
      const TextEditorImp = foundry.applications.ux.TextEditor.implementation;
      context.richText = {
        description: await TextEditorImp.enrichHTML(context.system.description, { secrets: this.document.isOwner }),
        notes: await TextEditorImp.enrichHTML(context.system.notes, { secrets: this.document.isOwner })
      };
    }
    Object.assign(context.settings, {
      useHits: game.settings.get("twodsix", "robotsUseHits")
    });
    return context;
  }
};
__name$G(_TwodsixRobotSheet, "TwodsixRobotSheet");
_TwodsixRobotSheet.DEFAULT_OPTIONS = {
  sheetType: "TwodsixRobotSheet",
  classes: ["twodsix", "sheet", "robot-actor"],
  dragDrop: [{ dragSelector: ".item-name", dropSelector: null }],
  position: {
    width: "auto",
    height: 600
  },
  window: {
    resizable: true,
    icon: "fa-solid fa-robot"
  },
  form: {
    submitOnChange: true,
    submitOnClose: true
  },
  actions: {
    rollReaction: _TwodsixRobotSheet._onRollReaction,
    rollMorale: _TwodsixRobotSheet._onRollMorale
  },
  tag: "form"
};
_TwodsixRobotSheet.PARTS = {
  main: {
    template: "systems/twodsix/templates/actors/robot-sheet.hbs"
    //scrollable: ['']
  }
};
let TwodsixRobotSheet = _TwodsixRobotSheet;

var __defProp$F = Object.defineProperty;
var __name$F = (target, value) => __defProp$F(target, "name", { value, configurable: true });
function simplifyRollFormula(formula, { preserveFlavor = false } = {}) {
  let roll;
  try {
    roll = new Roll(formula);
  } catch (err) {
    console.warn(`Unable to simplify formula '${formula}': ${err}`);
  }
  Roll.validate(roll.formula);
  if (!preserveFlavor) {
    roll.terms = Roll.parse(roll.formula.replace(foundry.dice.terms.RollTerm.FLAVOR_REGEXP, ""));
  }
  roll.terms = _simplifyOperatorTerms(roll.terms);
  if (/[*/]/.test(roll.formula)) {
    if (roll.isDeterministic && !/d\(/.test(roll.formula) && (!/\[/.test(roll.formula) || !preserveFlavor)) {
      return Roll.safeEval(roll.formula).toString();
    } else {
      return roll.constructor.getFormula(roll.terms);
    }
  }
  roll.terms = _expandParentheticalTerms(roll.terms);
  roll.terms = Roll.simplifyTerms(roll.terms);
  let { poolTerms, diceTerms, mathTerms, numericTerms } = _groupTermsByType(roll.terms);
  numericTerms = _simplifyNumericTerms(numericTerms ?? []);
  diceTerms = _simplifyDiceTerms(diceTerms ?? []);
  const simplifiedTerms = [diceTerms, poolTerms, mathTerms, numericTerms].flat().filter(Boolean);
  if (simplifiedTerms[0]?.operator === "+") {
    simplifiedTerms.shift();
  }
  return roll.constructor.getFormula(simplifiedTerms);
}
__name$F(simplifyRollFormula, "simplifyRollFormula");
function _simplifyOperatorTerms(terms) {
  return terms.reduce((acc, term) => {
    const prior = acc[acc.length - 1];
    const ops = /* @__PURE__ */ new Set([prior?.operator, term.operator]);
    if (ops.has(void 0)) {
      acc.push(term);
    } else if (ops.has("+") && ops.has("-")) {
      acc.splice(-1, 1, new foundry.dice.terms.OperatorTerm({ operator: "-" }));
    } else if (ops.has("-") && ops.size === 1) {
      acc.splice(-1, 1, new foundry.dice.terms.OperatorTerm({ operator: "+" }));
    } else if (!ops.has("+")) {
      acc.push(term);
    }
    return acc;
  }, []);
}
__name$F(_simplifyOperatorTerms, "_simplifyOperatorTerms");
function _simplifyNumericTerms(terms) {
  const simplified = [];
  const { annotated, unannotated } = _separateAnnotatedTerms(terms);
  if (unannotated.length) {
    const staticBonus = Roll.safeEval(Roll.getFormula(unannotated));
    if (staticBonus === 0) {
      return [...annotated];
    }
    if (staticBonus > 0) {
      simplified.push(new foundry.dice.terms.OperatorTerm({ operator: "+" }));
    }
    simplified.push(new foundry.dice.terms.NumericTerm({ number: staticBonus }));
  }
  return [...simplified, ...annotated];
}
__name$F(_simplifyNumericTerms, "_simplifyNumericTerms");
function _simplifyDiceTerms(terms) {
  const { annotated, unannotated } = _separateAnnotatedTerms(terms);
  const diceQuantities = unannotated.reduce((obj, curr, i) => {
    if (curr instanceof foundry.dice.terms.OperatorTerm) {
      return obj;
    }
    const key = `${unannotated[i - 1].operator}${curr.faces}`;
    obj[key] = (obj[key] ?? 0) + curr.number;
    return obj;
  }, {});
  const simplified = Object.entries(diceQuantities).flatMap(([key, number]) => [
    new foundry.dice.terms.OperatorTerm({ operator: key.charAt(0) }),
    new foundry.dice.terms.Die({ number, faces: parseInt(key.slice(1)) })
  ]);
  return [...simplified, ...annotated];
}
__name$F(_simplifyDiceTerms, "_simplifyDiceTerms");
function _expandParentheticalTerms(terms) {
  terms = terms.reduce((acc, term) => {
    if (term instanceof foundry.dice.terms.ParentheticalTerm) {
      if (term.isDeterministic) {
        term = new foundry.dice.terms.NumericTerm({ number: Roll.safeEval(term.term) });
      } else {
        const subterms = new Roll(term.term).terms;
        term = _expandParentheticalTerms(subterms);
      }
    }
    acc.push(term);
    return acc;
  }, []);
  return _simplifyOperatorTerms(terms.flat());
}
__name$F(_expandParentheticalTerms, "_expandParentheticalTerms");
function _groupTermsByType(terms) {
  if (!(terms[0] instanceof foundry.dice.terms.OperatorTerm)) {
    terms.unshift(new foundry.dice.terms.OperatorTerm({ operator: "+" }));
  }
  return terms.reduce((obj, term, i) => {
    let type;
    if (term instanceof foundry.dice.terms.DiceTerm) {
      type = foundry.dice.terms.DiceTerm;
    } else if (term instanceof foundry.dice.terms.FunctionTerm && term.isDeterministic) {
      type = foundry.dice.terms.NumericTerm;
    } else {
      type = term.constructor;
    }
    const key = `${type.name.charAt(0).toLowerCase()}${type.name.substring(1)}s`;
    (obj[key] = obj[key] ?? []).push(terms[i - 1], term);
    return obj;
  }, {});
}
__name$F(_groupTermsByType, "_groupTermsByType");
function _separateAnnotatedTerms(terms) {
  return terms.reduce((obj, curr, i) => {
    if (curr instanceof foundry.dice.terms.OperatorTerm) {
      return obj;
    }
    obj[curr.flavor ? "annotated" : "unannotated"].push(terms[i - 1], curr);
    return obj;
  }, { annotated: [], unannotated: [] });
}
__name$F(_separateAnnotatedTerms, "_separateAnnotatedTerms");

var __defProp$E = Object.defineProperty;
var __name$E = (target, value) => __defProp$E(target, "name", { value, configurable: true });
const _TwodsixSpaceObjectSheet = class _TwodsixSpaceObjectSheet extends foundry.applications.api.HandlebarsApplicationMixin(AbstractTwodsixActorSheet) {
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    if (game.settings.get("twodsix", "useProseMirror")) {
      const TextEditorImp = foundry.applications.ux.TextEditor.implementation;
      context.richText = {
        description: await TextEditorImp.enrichHTML(context.system.description, { secrets: this.document.isOwner }),
        notes: await TextEditorImp.enrichHTML(context.system.notes, { secrets: this.document.isOwner })
      };
    }
    return context;
  }
  static async _onRollSODamage() {
    const actor = this.actor;
    let rollFormula = await confirmRollFormula(actor.system.damage, game.i18n.localize("TWODSIX.Damage.DamageFormula"));
    rollFormula = rollFormula.replace(/dd/ig, "d6*10");
    rollFormula = simplifyRollFormula(rollFormula);
    let damage = {};
    if (Roll.validate(rollFormula)) {
      damage = new Roll(rollFormula, actor.system);
      await damage.evaluate();
    } else {
      ui.notifications.error("TWODSIX.Errors.InvalidRollFormula", { localize: true });
      return;
    }
    const contentData = {};
    const flavor = game.i18n.localize("TWODSIX.Damage.Damage");
    const damageLabels = getDamageTypes(true);
    const damageType = "NONE";
    Object.assign(contentData, {
      flavor,
      roll: damage,
      dice: getDiceResults(damage),
      //damage.terms[0]["results"]
      armorPiercingValue: 0,
      damageValue: damage.total && damage.total > 0 ? damage.total : 0,
      damageType,
      damageLabel: damageLabels[damageType] ?? ""
    });
    const html = await foundry.applications.handlebars.renderTemplate("systems/twodsix/templates/chat/damage-message.hbs", contentData);
    const transfer = JSON.stringify(
      {
        type: "damageItem",
        payload: contentData
      }
    );
    await damage.toMessage({
      title: game.i18n.localize("TWODSIX.Damage.DamageCard"),
      speaker: this.actor ? ChatMessage.getSpeaker({ actor }) : null,
      content: html,
      style: CONST.CHAT_MESSAGE_STYLES.OTHER,
      rolls: [damage],
      flags: {
        "core.canPopout": true,
        "transfer": transfer,
        "twodsix.itemUUID": "",
        "twodsix.rollClass": "Damage",
        "twodsix.tokenUUID": this.actor.getActiveTokens()[0]?.document.uuid ?? ""
      }
    });
  }
};
__name$E(_TwodsixSpaceObjectSheet, "TwodsixSpaceObjectSheet");
/** @override */
_TwodsixSpaceObjectSheet.DEFAULT_OPTIONS = {
  sheetType: "TwodsixSpaceObjectSheet",
  classes: ["twodsix", "space-object", "actor"],
  dragDrop: [{ dragSelector: ".item", dropSelector: null }],
  position: {
    width: "auto",
    height: "auto"
  },
  window: {
    resizable: false,
    icon: "fa-solid fa-satellite"
  },
  form: {
    submitOnChange: true,
    submitOnClose: true
  },
  actions: {
    rollSODamage: _TwodsixSpaceObjectSheet._onRollSODamage
  },
  tag: "form"
};
_TwodsixSpaceObjectSheet.PARTS = {
  main: {
    template: "systems/twodsix/templates/actors/space-object-sheet.hbs"
    //scrollable: ['']
  }
};
let TwodsixSpaceObjectSheet = _TwodsixSpaceObjectSheet;

var __defProp$D = Object.defineProperty;
var __name$D = (target, value) => __defProp$D(target, "name", { value, configurable: true });
function addCustomEnrichers() {
  CONFIG.TextEditor.enrichers.push(
    {
      id: "displayTable",
      pattern: /@DisplayTable\[(.+?)\](?:{(.+?)})?/gm,
      enricher: enrichDisplayTable
    },
    {
      id: "rollTable",
      pattern: /@Table\[(.+?)\](?:{(.+?)})?/gm,
      enricher: rollTable,
      onRender: addTableRollListener
    },
    {
      id: "rollSkill",
      pattern: /@SkillRoll(?:\[(.*?)\])?(?:{(.*?)})?/gm,
      enricher: rollSkill,
      onRender: addSkillRollListener
    },
    {
      id: "itemList",
      pattern: /@ItemList\s?(.+)/gm,
      enricher: itemList,
      onRender: addItemListTransfer
    }
  );
}
__name$D(addCustomEnrichers, "addCustomEnrichers");
function addTableRollListener(enrichedContent) {
  enrichedContent.querySelector(".table-roll")?.addEventListener("click", handleTableRoll);
}
__name$D(addTableRollListener, "addTableRollListener");
function addSkillRollListener(enrichedContent) {
  enrichedContent.querySelector(".skill-roll")?.addEventListener("click", handleSkillRoll);
}
__name$D(addSkillRollListener, "addSkillRollListener");
function addItemListTransfer(enrichedContent) {
  const link = enrichedContent.querySelector(".item-list");
  if (link) {
    link.addEventListener("dragstart", (ev) => {
      ev.dataTransfer.setData("text/plain", JSON.stringify(link.dataset));
    });
  }
}
__name$D(addItemListTransfer, "addItemListTransfer");
async function enrichDisplayTable(match, options) {
  if (options.relativeTo?.getFlag("twodsix", "disableEnrichment")) {
    return;
  }
  const table = findTable(match[1], options);
  const tableName = match[2] ?? table?.name;
  const a = document.createElement("div");
  if (table) {
    a.classList.add("display-table");
    const html = displayTable(match[1], table, tableName);
    a.innerHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(html, { secrets: table.isOwner });
  } else {
    a.dataset.tableId = match[1];
    if (match[2]) {
      a.dataset.tableName = match[2];
    }
    a.classList.add("content-link");
    a.classList.add("broken");
    a.innerHTML = `<i class="fas fa-unlink"></i> ${tableName}`;
  }
  return a;
}
__name$D(enrichDisplayTable, "enrichDisplayTable");
async function rollTable(match, options) {
  if (options.relativeTo?.getFlag("twodsix", "disableEnrichment")) {
    return;
  }
  const table = findTable(match[1], options);
  const tableName = match[2] ?? table?.name;
  const a = document.createElement("a");
  if (table) {
    a.classList.add("inline-roll");
    a.classList.add("table-roll");
    a.dataset.tableId = table.uuid;
    a.dataset.tableName = table.name;
    a.innerHTML = `<i class="fas fa-dice"></i><i class="fas fa-th-list"></i> ${tableName}`;
  } else {
    a.dataset.tableId = match[1];
    if (match[2]) {
      a.dataset.tableName = match[2];
    }
    a.classList.add("content-link");
    a.classList.add("broken");
    a.innerHTML = `<i class="fas fa-unlink"></i> ${tableName}`;
  }
  return a;
}
__name$D(rollTable, "rollTable");
async function rollSkill(match, options) {
  if (options.relativeTo?.getFlag("twodsix", "disableEnrichment")) {
    return;
  }
  const skillName = match[1] || "";
  const descrip = match[2] || match[1];
  const a = document.createElement("a");
  a.classList.add("inline-roll");
  a.classList.add("skill-roll");
  a.dataset.parseString = skillName;
  a.innerHTML = `<i class="fa-solid fa-dice"></i> ${descrip}`;
  return a;
}
__name$D(rollSkill, "rollSkill");
async function itemList(match, options) {
  if (options.relativeTo?.getFlag("twodsix", "disableEnrichment")) {
    return;
  }
  const itemRef = match[1].split(",").map((str) => str.trim());
  const a = document.createElement("a");
  a.classList.add("item-list");
  a.classList.add("content-link");
  a.setAttribute("draggable", true);
  a.dataset.parseString = itemRef.join(", ");
  a.dataset.type = "ItemList";
  const list = [];
  for (const strRef of itemRef) {
    if (foundry.utils.parseUuid(strRef)?.id) {
      const tempName = fromUuidSync(strRef)?.name;
      list.push(tempName ? tempName : `<i class="fa-solid fa-link-slash"></i>`);
    } else {
      list.push(strRef);
    }
  }
  a.innerHTML = `<i class="fa-solid fa-box-open"></i> ${list.join(", ")}`;
  return a;
}
__name$D(itemList, "itemList");
function displayTable(uuid, table, tableName) {
  if (!table) {
    return "";
  }
  let html = `
  <table>
      <caption class="table-caption">${tableName}</caption>
      <tr>
          <th style="text-transform: uppercase; text-align: left;">@Table[${uuid}]{${table.formula}}</th>
          <th style="text-align: left;">${game.i18n.localize("TWODSIX.Table.TableResults")}</th>
      </tr>`;
  for (const result of table.results) {
    html += `
      <tr>
          <td>${result.range[0]}`;
    if (result.range[1] != result.range[0]) {
      html += ` - ${result.range[1]}`;
    }
    if (result.documentCollection == "RollTable") {
      const subTable = findTable(result.text);
      if (subTable?.uuid != table.uuid) {
        let subTableName = result.text;
        if (subTableName.startsWith(table.name)) {
          subTableName = subTableName.slice(table.name.length);
          if (subTableName.startsWith(" - ")) {
            subTableName = subTableName.slice(3);
          }
        }
        html += `</td>
                  <td>${subTable?.description} @UUID[RollTable.${result.documentId}]{${subTableName}}</td>
              </tr>`;
      } else {
        html += `</td>
                  <td>${result.text}</td>
              </tr>`;
      }
    } else if (result.documentCollection == "Item" && result.documentId) {
      html += `</td>
              <td>@UUID[Item.${result.documentId}]{${result.text}}</td>
          </tr>`;
    } else {
      html += `</td>
              <td>${result.text}</td>
          </tr>`;
    }
  }
  html += `</table>`;
  return html;
}
__name$D(displayTable, "displayTable");
function findTable(tableName, options) {
  const table = game.tables.find((i) => i.name.toLowerCase() == tableName.toLowerCase()) || fromUuidSync(tableName);
  if (!table) {
    if (!options?.noWarnings) {
      sendWarning("TWODSIX.Warnings.tableNotFound", { id: tableName });
    }
    return null;
  }
  if (!(table instanceof RollTable)) {
    if (!options?.noWarning) {
      sendWarning("TWODSIX.Warnings.typeMismatch", { id: tableName });
    }
    return null;
  }
  return table;
}
__name$D(findTable, "findTable");
function sendWarning(msg, params) {
  if (!params) {
    return ui.notifications.warn(msg, { localize: true });
  } else {
    return ui.notifications.warn(game.i18n.format(game.i18n.localize(msg), params));
  }
}
__name$D(sendWarning, "sendWarning");
async function handleTableRoll(event) {
  event.preventDefault();
  event.stopPropagation();
  const tableId = event.currentTarget.dataset.tableId;
  const tableName = event.currentTarget.dataset.tableName;
  const table = fromUuidSync(tableId) || findTable(tableName);
  if (table) {
    if (event.type == "click") {
      table.draw();
    } else {
      table.sheet.render({ force: true });
    }
  }
}
__name$D(handleTableRoll, "handleTableRoll");
async function handleSkillRoll(event) {
  event.preventDefault();
  event.stopPropagation();
  const parseString = event.currentTarget.dataset.parseString;
  const actorToUse = getControlledTraveller();
  if (actorToUse) {
    const parsedValues = getInitialSettingsFromFormula(parseString, actorToUse);
    if (parsedValues) {
      if (!parsedValues.skillRoll) {
        actorToUse.characteristicRoll({ rollModifiers: parsedValues.rollModifiers, difficulty: parsedValues.difficulty }, true);
      } else {
        const skill = parsedValues.skill;
        if (event.type == "click") {
          delete parsedValues.skill;
          const settings = await TwodsixRollSettings.create(true, parsedValues, skill, void 0, actorToUse);
          if (!settings.shouldRoll) {
            return;
          }
          await skill.skillRoll(false, settings);
        } else {
          skill.sheet.render({ force: true });
        }
      }
    }
  } else {
    ui.notifications.warn("TWODSIX.Warnings.NoActorSelected", { localize: true });
  }
}
__name$D(handleSkillRoll, "handleSkillRoll");

var __defProp$C = Object.defineProperty;
var __name$C = (target, value) => __defProp$C(target, "name", { value, configurable: true });
const fields$5 = foundry.data.fields;
function makeResourceField(initialValue, initialMax, schemaOptions = {}) {
  return new fields$5.SchemaField({
    value: new fields$5.NumberField({ required: true, integer: true, initial: initialValue }),
    max: new fields$5.NumberField({ required: true, integer: true, initial: initialMax }),
    min: new fields$5.NumberField({ required: true, integer: true, initial: 0 }),
    label: new fields$5.StringField({ required: true })
  }, schemaOptions);
}
__name$C(makeResourceField, "makeResourceField");
function makeValueField(initialValue = 0, schemaOptions = {}) {
  return new fields$5.SchemaField({
    value: new fields$5.NumberField({ required: true, integer: true, initial: initialValue })
  }, schemaOptions);
}
__name$C(makeValueField, "makeValueField");
function migrateStringToNumber(source, field) {
  if (Object.hasOwn(source, field)) {
    if (typeof source[field] !== "number") {
      source[field] = parseLocaleNumber(source[field]) || 0;
    }
  }
}
__name$C(migrateStringToNumber, "migrateStringToNumber");
function migrateNumberToString(source, field) {
  if (Object.hasOwn(source, field)) {
    if (typeof source[field] !== "string") {
      source[field] = source[field]?.toString() || "0";
    }
  }
}
__name$C(migrateNumberToString, "migrateNumberToString");
function migrateStringToStringArray(source, field) {
  if (Object.hasOwn(source, field)) {
    if (typeof source[field] !== "object") {
      source[field] = [source[field] ?? ""];
    }
  }
}
__name$C(migrateStringToStringArray, "migrateStringToStringArray");

var __defProp$B = Object.defineProperty;
var __name$B = (target, value) => __defProp$B(target, "name", { value, configurable: true });
const fields$4 = foundry.data.fields;
const requiredInteger$4 = { required: true, nullable: false, integer: true };
const requiredBlankString$4 = { required: true, blank: true, initial: "" };
const _TwodsixActorBaseData = class _TwodsixActorBaseData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const schema = {};
    schema.name = new fields$4.StringField({ ...requiredBlankString$4 });
    schema.characteristics = new fields$4.SchemaField({
      strength: makeCharacteristicField("strength", "STR"),
      dexterity: makeCharacteristicField("dexterity", "DEX"),
      endurance: makeCharacteristicField("endurance", "END"),
      intelligence: makeCharacteristicField("intelligence", "INT"),
      education: makeCharacteristicField("education", "EDU"),
      socialStanding: makeCharacteristicField("socialStanding", "SOC"),
      psionicStrength: makeCharacteristicField("psionicStrength", "PSI"),
      stamina: makeCharacteristicField("stamina", "STA"),
      lifeblood: makeCharacteristicField("lifeblood", "LFB"),
      alternative1: makeCharacteristicField("alternative1", "ALT1"),
      alternative2: makeCharacteristicField("alternative2", "ALT2"),
      alternative3: makeCharacteristicField("alternative3", "ALT3")
    });
    schema.characteristicEdit = new fields$4.BooleanField();
    schema.primaryArmor = makeValueField();
    schema.radiationProtection = makeValueField();
    schema.armorType = new fields$4.StringField({ required: true, blank: false, initial: "nothing" });
    schema.armorDM = new fields$4.NumberField({ ...requiredInteger$4, initial: 0 });
    schema.conditions = new fields$4.SchemaField({
      woundedEffect: new fields$4.NumberField({ ...requiredInteger$4, initial: 0 }),
      encumberedEffect: new fields$4.NumberField({ ...requiredInteger$4, initial: 0 })
    });
    const numberConfig = { required: true, nullable: true, min: 0, step: 0.1, initial: null };
    schema.movement = new fields$4.SchemaField({
      burrow: new fields$4.NumberField({ ...numberConfig, label: TWODSIX$1.MovementType.burrow }),
      climb: new fields$4.NumberField({ ...numberConfig, label: TWODSIX$1.MovementType.climb }),
      fly: new fields$4.NumberField({ ...numberConfig, label: TWODSIX$1.MovementType.fly }),
      swim: new fields$4.NumberField({ ...numberConfig, label: TWODSIX$1.MovementType.swim }),
      walk: new fields$4.NumberField({ ...numberConfig, label: TWODSIX$1.MovementType.walk }),
      units: new fields$4.StringField({ required: true, nullable: true, blank: false, initial: "m", label: "TWODSIX.Actor.Movement.MovementUnits" }),
      hover: new fields$4.BooleanField({ required: true, initial: false, label: TWODSIX$1.MovementType.hover })
    });
    schema.docReference = new fields$4.ArrayField(new fields$4.StringField({ ...requiredBlankString$4 }), { initial: [""] });
    schema.pdfReference = new fields$4.SchemaField({
      type: new fields$4.StringField({ ...requiredBlankString$4 }),
      href: new fields$4.StringField({ ...requiredBlankString$4 }),
      label: new fields$4.StringField({ ...requiredBlankString$4 })
    });
    schema.radiationDose = makeResourceField(0, 0);
    schema.encumbrance = new fields$4.SchemaField({
      value: new fields$4.NumberField({ required: true, integer: false, initial: 0 }),
      max: new fields$4.NumberField({ required: true, integer: false, initial: 0 }),
      min: new fields$4.NumberField({ required: true, integer: false, initial: 0 }),
      offset: new fields$4.NumberField({ required: true, integer: false, initial: 0 })
    });
    schema.hits = new fields$4.SchemaField({
      value: new fields$4.NumberField({ ...requiredInteger$4, initial: 21 }),
      max: new fields$4.NumberField({ ...requiredInteger$4, initial: 21 }),
      min: new fields$4.NumberField({ ...requiredInteger$4, initial: 0 }),
      lastDelta: new fields$4.NumberField({ ...requiredInteger$4, initial: 0 })
    });
    schema.untrainedSkill = new fields$4.StringField({ ...requiredBlankString$4 });
    schema.description = new fields$4.HTMLField({ ...requiredBlankString$4 });
    schema.notes = new fields$4.HTMLField({ ...requiredBlankString$4 });
    schema.bio = new fields$4.HTMLField({ ...requiredBlankString$4 });
    return schema;
  }
  static migrateData(source) {
    if ("docReference" in source) {
      migrateStringToStringArray(source, "docReference");
      if (source.docReference.length === 0) {
        source.docReference = [""];
      }
    }
    return super.migrateData(source);
  }
};
__name$B(_TwodsixActorBaseData, "TwodsixActorBaseData");
let TwodsixActorBaseData = _TwodsixActorBaseData;
function makeCharacteristicField(key, shortName, schemaOptions = {}) {
  return new fields$4.SchemaField({
    key: new fields$4.StringField({ required: true, blank: true, initial: key }),
    value: new fields$4.NumberField({ ...requiredInteger$4, initial: 7, min: 0 }),
    damage: new fields$4.NumberField({ ...requiredInteger$4, initial: 0, min: 0 }),
    label: new fields$4.StringField({ required: true, blank: true, initial: key.capitalize() }),
    shortLabel: new fields$4.StringField({ required: true, blank: true, initial: shortName }),
    displayShortLabel: new fields$4.StringField({ required: true, blank: true })
  }, schemaOptions);
}
__name$B(makeCharacteristicField, "makeCharacteristicField");

var __defProp$A = Object.defineProperty;
var __name$A = (target, value) => __defProp$A(target, "name", { value, configurable: true });
const fields$3 = foundry.data.fields;
const requiredInteger$3 = { required: true, nullable: false, integer: true };
const requiredBlankString$3 = { required: true, blank: true, initial: "" };
const _TravellerData = class _TravellerData extends TwodsixActorBaseData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.homeWorld = new fields$3.StringField({ ...requiredBlankString$3 });
    schema.nationality = new fields$3.StringField({ ...requiredBlankString$3 });
    schema.species = new fields$3.StringField({ ...requiredBlankString$3 });
    schema.age = new fields$3.SchemaField({
      value: new fields$3.NumberField({ required: true, nullable: true, integer: false, initial: 18 }),
      min: new fields$3.NumberField({ required: true, nullable: true, integer: false, initial: 0 })
    });
    schema.gender = new fields$3.StringField({ ...requiredBlankString$3 });
    schema.heroPoints = new fields$3.NumberField({ ...requiredInteger$3, initial: 2 });
    schema.contacts = new fields$3.HTMLField({ ...requiredBlankString$3 });
    schema.secondaryArmor = makeValueField();
    schema.finances = new fields$3.SchemaField({
      cash: new fields$3.StringField({ required: true, blank: true, initial: "0" }),
      pension: new fields$3.StringField({ required: true, blank: true, initial: "0" }),
      payments: new fields$3.StringField({ required: true, blank: true, initial: "0" }),
      debt: new fields$3.StringField({ required: true, blank: true, initial: "0" }),
      livingCosts: new fields$3.StringField({ required: true, blank: true, initial: "0" }),
      "financial-notes": new fields$3.StringField({ ...requiredBlankString$3 })
    });
    schema.financeValues = new fields$3.SchemaField({
      cash: new fields$3.NumberField({ required: true, nullable: false, integer: false, initial: 0 }),
      pension: new fields$3.NumberField({ required: true, nullable: false, integer: false, initial: 0 }),
      payment: new fields$3.NumberField({ required: true, nullable: false, integer: false, initial: 0 }),
      debt: new fields$3.NumberField({ required: true, nullable: false, integer: false, initial: 0 }),
      livingCosts: new fields$3.NumberField({ required: true, nullable: false, integer: false, initial: 0 })
    });
    schema.hideStoredItems = new fields$3.SchemaField({
      weapon: new fields$3.BooleanField({ required: true, initial: false }),
      armor: new fields$3.BooleanField({ required: true, initial: false }),
      augment: new fields$3.BooleanField({ required: true, initial: false }),
      equipment: new fields$3.BooleanField({ required: true, initial: false }),
      consumable: new fields$3.BooleanField({ required: true, initial: false }),
      attachment: new fields$3.BooleanField({ required: true, initial: false }),
      junk: new fields$3.BooleanField({ required: true, initial: false })
    });
    schema.experience = new fields$3.SchemaField({
      value: new fields$3.NumberField({ ...requiredInteger$3, initial: 0 }),
      totalEarned: new fields$3.NumberField({ ...requiredInteger$3, initial: 0 })
    });
    schema.xpNotes = new fields$3.HTMLField({ ...requiredBlankString$3 });
    schema.displaySkillGroup = new fields$3.ObjectField({ required: true, initial: {} });
    return schema;
  }
  static migrateData(source) {
    if ("age" in source) {
      migrateStringToNumber(source.age, "value");
    }
    return super.migrateData(source);
  }
};
__name$A(_TravellerData, "TravellerData");
let TravellerData = _TravellerData;
const _AnimalData = class _AnimalData extends TwodsixActorBaseData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.homeWorld = new fields$3.StringField({ ...requiredBlankString$3 });
    schema.species = new fields$3.StringField({ ...requiredBlankString$3 });
    schema.animalType = new fields$3.SchemaField({
      niche: new fields$3.StringField({ required: true, blank: false, initial: "herbivore" }),
      subtype: new fields$3.StringField({ required: true, blank: false, initial: "filter" })
    });
    schema.location = new fields$3.StringField({ required: true, blank: false, initial: "plains" });
    schema.size = new fields$3.StringField({ ...requiredBlankString$3 });
    schema.numberAppearing = new fields$3.StringField({ required: true, blank: false, initial: "1d6" });
    schema.reaction = new fields$3.SchemaField({
      attack: new fields$3.NumberField({ ...requiredInteger$3, initial: 9 }),
      flee: new fields$3.NumberField({ ...requiredInteger$3, initial: 6 })
    });
    schema.moraleDM = new fields$3.StringField({ ...requiredBlankString$3 });
    schema.secondaryArmor = new fields$3.SchemaField({
      value: new fields$3.NumberField({ required: true, integer: true, initial: 0 }),
      protectionTypes: new fields$3.ArrayField(new fields$3.StringField({ blank: false }))
    });
    return schema;
  }
};
__name$A(_AnimalData, "AnimalData");
let AnimalData = _AnimalData;
const _RobotData = class _RobotData extends TwodsixActorBaseData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.size = new fields$3.StringField({ ...requiredBlankString$3 });
    schema.locomotionType = new fields$3.StringField({ ...requiredBlankString$3 });
    schema.locomotionType = new fields$3.StringField({ ...requiredBlankString$3 });
    schema.price = new fields$3.StringField({ ...requiredBlankString$3 });
    schema.chassis = new fields$3.StringField({ ...requiredBlankString$3 });
    schema.techLevel = new fields$3.NumberField({ ...requiredInteger$3, initial: 0 });
    schema.operationalTime = new fields$3.StringField({ ...requiredBlankString$3 });
    schema.secondaryArmor = new fields$3.SchemaField({
      value: new fields$3.NumberField({ required: true, integer: true, initial: 0 }),
      protectionTypes: new fields$3.ArrayField(new fields$3.StringField({ blank: false }))
    });
    schema.maxBuildPoints = new fields$3.NumberField({ ...requiredInteger$3, initial: 0 });
    return schema;
  }
};
__name$A(_RobotData, "RobotData");
let RobotData = _RobotData;

var __defProp$z = Object.defineProperty;
var __name$z = (target, value) => __defProp$z(target, "name", { value, configurable: true });
const fields$2 = foundry.data.fields;
const requiredInteger$2 = { required: true, nullable: false, integer: true };
const requiredBlankString$2 = { required: true, blank: true, initial: "" };
const _TwodsixVehicleBaseData = class _TwodsixVehicleBaseData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const schema = {};
    schema.name = new fields$2.StringField({ ...requiredBlankString$2 });
    schema.techLevel = new fields$2.NumberField({ ...requiredInteger$2, initial: 0 });
    schema.docReference = new fields$2.ArrayField(new fields$2.StringField({ ...requiredBlankString$2 }), { initial: [""] });
    schema.pdfReference = new fields$2.SchemaField({
      type: new fields$2.StringField({ ...requiredBlankString$2 }),
      href: new fields$2.StringField({ ...requiredBlankString$2 }),
      label: new fields$2.StringField({ ...requiredBlankString$2 })
    });
    schema.description = new fields$2.HTMLField({ ...requiredBlankString$2 });
    schema.notes = new fields$2.HTMLField({ ...requiredBlankString$2 });
    return schema;
  }
  static migrateData(source) {
    if ("docReference" in source) {
      migrateStringToStringArray(source, "docReference");
      if (source.docReference.length === 0) {
        source.docReference = [""];
      }
    }
    return super.migrateData(source);
  }
};
__name$z(_TwodsixVehicleBaseData, "TwodsixVehicleBaseData");
let TwodsixVehicleBaseData = _TwodsixVehicleBaseData;
const _ShipData = class _ShipData extends TwodsixVehicleBaseData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.deckPlan = new fields$2.StringField({ ...requiredBlankString$2 });
    schema.crew = makeCrewField();
    schema.crewLabel = makeCrewField();
    schema.cargo = new fields$2.HTMLField({ ...requiredBlankString$2 });
    schema.financeNotes = new fields$2.HTMLField({ ...requiredBlankString$2 });
    schema.maintenanceCost = new fields$2.StringField({ required: true, blank: true, initial: "0" });
    schema.mortgageCost = new fields$2.StringField({ required: true, blank: true, initial: "0" });
    schema.shipValue = new fields$2.StringField({ required: true, blank: true, initial: "0" });
    schema.isMassProduced = new fields$2.BooleanField({ required: true, initial: false });
    schema.commonFunds = new fields$2.NumberField({ required: true, nullable: false, integer: false, initial: 0 });
    schema.financeValues = new fields$2.SchemaField({
      cash: new fields$2.NumberField({ required: true, nullable: false, integer: false, initial: 0 })
    });
    schema.reqPower = new fields$2.SchemaField({
      systems: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 }),
      "m-drive": new fields$2.NumberField({ ...requiredInteger$2, initial: 0 }),
      "j-drive": new fields$2.NumberField({ ...requiredInteger$2, initial: 0 }),
      sensors: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 }),
      weapons: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 })
    });
    schema.weightStats = new fields$2.SchemaField({
      systems: new fields$2.NumberField({ required: true, nullable: false, integer: false, initial: 0 }),
      cargo: new fields$2.NumberField({ required: true, nullable: false, integer: false, initial: 0 }),
      fuel: new fields$2.NumberField({ required: true, nullable: false, integer: false, initial: 0 }),
      vehicles: new fields$2.NumberField({ required: true, nullable: false, integer: false, initial: 0 }),
      available: new fields$2.NumberField({ required: true, nullable: false, integer: false, initial: 0 })
    });
    schema.shipPositionActorIds = new fields$2.ObjectField({ required: true, initial: {} });
    schema.shipStats = new fields$2.SchemaField({
      hull: makeResourceField(0, 0),
      fuel: new fields$2.SchemaField({
        value: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 }),
        max: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 }),
        min: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 }),
        isRefined: new fields$2.BooleanField({ required: true, initial: true })
      }),
      power: makeResourceField(0, 0),
      armor: new fields$2.SchemaField({
        name: new fields$2.StringField({ ...requiredBlankString$2 }),
        weight: new fields$2.StringField({ ...requiredBlankString$2 }),
        cost: new fields$2.StringField({ ...requiredBlankString$2 }),
        value: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 }),
        max: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 }),
        min: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 })
      }),
      mass: makeResourceField(0, 0),
      fuel_tanks: new fields$2.SchemaField({
        name: new fields$2.StringField({ ...requiredBlankString$2 }),
        weight: new fields$2.StringField({ ...requiredBlankString$2 }),
        cost: new fields$2.StringField({ ...requiredBlankString$2 })
      }),
      drives: new fields$2.SchemaField({
        overdrive: new fields$2.BooleanField({ required: true, initial: false }),
        jDrive: new fields$2.SchemaField({
          rating: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 })
        }),
        mDrive: new fields$2.SchemaField({
          rating: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 })
        })
      }),
      bandwidth: makeResourceField(0, 0)
    });
    schema.combatPosition = new fields$2.NumberField({ ...requiredInteger$2, initial: 0 });
    schema.characteristics = new fields$2.SchemaField({ morale: makeCharacteristicField("morale", "MOR") });
    return schema;
  }
  static migrateData(source) {
    if ("finances" in source) {
      if (typeof source.finances === "string" && source.financeNotes === "") {
        source.financeNotes = source.finances;
      }
    }
    return super.migrateData(source);
  }
};
__name$z(_ShipData, "ShipData");
let ShipData = _ShipData;
function makeCrewField() {
  return new fields$2.SchemaField({
    captain: new fields$2.StringField({ ...requiredBlankString$2 }),
    pilot: new fields$2.StringField({ ...requiredBlankString$2 }),
    astrogator: new fields$2.StringField({ ...requiredBlankString$2 }),
    engineer: new fields$2.StringField({ ...requiredBlankString$2 }),
    maintenance: new fields$2.StringField({ ...requiredBlankString$2 }),
    gunner: new fields$2.StringField({ ...requiredBlankString$2 }),
    medic: new fields$2.StringField({ ...requiredBlankString$2 }),
    admin: new fields$2.StringField({ ...requiredBlankString$2 }),
    steward: new fields$2.StringField({ ...requiredBlankString$2 }),
    broker: new fields$2.StringField({ ...requiredBlankString$2 }),
    marine: new fields$2.StringField({ ...requiredBlankString$2 }),
    other: new fields$2.StringField({ ...requiredBlankString$2 })
  });
}
__name$z(makeCrewField, "makeCrewField");
const _VehicleData = class _VehicleData extends TwodsixVehicleBaseData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.cargoList = new fields$2.StringField({ ...requiredBlankString$2 });
    schema.cargoCapacity = new fields$2.StringField({ ...requiredBlankString$2 });
    schema.cost = new fields$2.StringField({ ...requiredBlankString$2 });
    schema.crew = new fields$2.SchemaField({
      operators: new fields$2.StringField({ ...requiredBlankString$2 }),
      passengers: new fields$2.StringField({ ...requiredBlankString$2 })
    });
    schema.damageStats = new fields$2.SchemaField({
      armor: makeResourceField(0, 0),
      armorLabel: new fields$2.StringField({ ...requiredBlankString$2 }),
      hull: makeResourceField(0, 0),
      structure: makeResourceField(0, 0),
      threshold: new fields$2.SchemaField({
        regular: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 }),
        critical: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 })
      }),
      detailedArmor: new fields$2.SchemaField({
        front: makeResourceField(0, 0),
        rear: makeResourceField(0, 0),
        sides: makeResourceField(0, 0)
      })
    });
    schema.features = new fields$2.StringField({ ...requiredBlankString$2 });
    schema.maneuver = new fields$2.SchemaField({
      speed: new fields$2.StringField({ required: true, blank: true, initial: "0" }),
      speedUnits: new fields$2.StringField({ required: true, blank: true, initial: "km/h" }),
      range: new fields$2.StringField({ required: true, blank: true, initial: "0" }),
      rangeUnits: new fields$2.StringField({ required: true, blank: true, initial: "km" }),
      agility: new fields$2.StringField({ ...requiredBlankString$2 })
    });
    schema.skillToOperate = new fields$2.StringField({ ...requiredBlankString$2 });
    schema.systemStatus = new fields$2.SchemaField({
      cargo: new fields$2.StringField({ required: true, blank: false, initial: "operational" }),
      cockpit: new fields$2.StringField({ required: true, blank: false, initial: "operational" }),
      computers: new fields$2.StringField({ required: true, blank: false, initial: "operational" }),
      electronics: new fields$2.StringField({ required: true, blank: false, initial: "operational" }),
      limbs: new fields$2.StringField({ required: true, blank: false, initial: "operational" }),
      propulsion: new fields$2.StringField({ required: true, blank: false, initial: "operational" }),
      powerPlant: new fields$2.StringField({ required: true, blank: false, initial: "operational" }),
      sensors: new fields$2.StringField({ required: true, blank: false, initial: "operational" })
    });
    schema.weaponsType = new fields$2.StringField({ ...requiredBlankString$2 });
    schema.openVehicle = new fields$2.BooleanField({ required: true, initial: false });
    schema.traits = new fields$2.StringField({ ...requiredBlankString$2 });
    schema.weight = new fields$2.StringField({ ...requiredBlankString$2 });
    schema.shippingSize = new fields$2.StringField({ ...requiredBlankString$2 });
    schema.spaces = new fields$2.SchemaField({
      value: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 }),
      max: new fields$2.NumberField({ ...requiredInteger$2, initial: 0 })
    });
    return schema;
  }
};
__name$z(_VehicleData, "VehicleData");
let VehicleData = _VehicleData;
const _SpaceObjectData = class _SpaceObjectData extends TwodsixVehicleBaseData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.features = new fields$2.StringField({ ...requiredBlankString$2 });
    schema.count = makeResourceField(0, 0);
    schema.damage = new fields$2.StringField({ required: true, blank: true, initial: "3D6" });
    schema.thrust = new fields$2.NumberField({ ...requiredInteger$2, initial: 0 });
    schema.roundsActive = new fields$2.NumberField({ ...requiredInteger$2, initial: 0 });
    return schema;
  }
};
__name$z(_SpaceObjectData, "SpaceObjectData");
let SpaceObjectData = _SpaceObjectData;

var __defProp$y = Object.defineProperty;
var __name$y = (target, value) => __defProp$y(target, "name", { value, configurable: true });
const fields$1 = foundry.data.fields;
const requiredInteger$1 = { required: true, nullable: false, integer: true };
const requiredBlankString$1 = { required: true, blank: true, initial: "" };
const _TwodsixItemBaseData = class _TwodsixItemBaseData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const schema = {};
    schema.name = new fields$1.StringField({ required: false, blank: true, nullable: true, initial: "" });
    schema.description = new fields$1.HTMLField({ ...requiredBlankString$1 });
    schema.type = new fields$1.StringField({ ...requiredBlankString$1 });
    schema.docReference = new fields$1.ArrayField(new fields$1.StringField({ ...requiredBlankString$1 }), { initial: [""] });
    schema.pdfReference = new fields$1.SchemaField({
      type: new fields$1.StringField({ ...requiredBlankString$1 }),
      href: new fields$1.StringField({ ...requiredBlankString$1 }),
      label: new fields$1.StringField({ ...requiredBlankString$1 })
    });
    schema.priorType = new fields$1.StringField({ required: true, blank: false, initial: "unknown" });
    return schema;
  }
  static migrateData(source) {
    if ("docReference" in source) {
      migrateStringToStringArray(source, "docReference");
      if (source.docReference.length === 0) {
        source.docReference = [""];
      }
    }
    return super.migrateData(source);
  }
};
__name$y(_TwodsixItemBaseData, "TwodsixItemBaseData");
let TwodsixItemBaseData = _TwodsixItemBaseData;
const _GearData = class _GearData extends TwodsixItemBaseData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.techLevel = new fields$1.NumberField({ ...requiredInteger$1, initial: 0 });
    schema.shortdescr = new fields$1.StringField({ ...requiredBlankString$1 });
    schema.quantity = new fields$1.NumberField({ ...requiredInteger$1, initial: 1 });
    schema.weight = new fields$1.NumberField({ required: true, nullable: false, integer: false, initial: 0 });
    schema.price = new fields$1.NumberField({ required: true, nullable: false, integer: false, initial: 0 });
    schema.traits = new fields$1.ArrayField(new fields$1.StringField({ blank: false }));
    schema.consumables = new fields$1.ArrayField(new fields$1.StringField({ blank: false }));
    schema.useConsumableForAttack = new fields$1.StringField({ ...requiredBlankString$1 });
    schema.skillModifier = new fields$1.NumberField({ ...requiredInteger$1, initial: 0 });
    schema.skill = new fields$1.StringField({ ...requiredBlankString$1 });
    schema.associatedSkillName = new fields$1.StringField({ ...requiredBlankString$1 });
    schema.equipped = new fields$1.StringField({ required: true, blank: false, initial: "backpack" });
    return schema;
  }
  static migrateData(source) {
    if ("weight" in source) {
      migrateStringToNumber(source, "weight");
    }
    if ("price" in source) {
      migrateStringToNumber(source, "price");
    }
    return super.migrateData(source);
  }
};
__name$y(_GearData, "GearData");
let GearData = _GearData;
function makeTargetTemplate() {
  return new fields$1.SchemaField({
    value: new fields$1.NumberField({ required: true, nullable: true, integer: false, initial: null }),
    width: new fields$1.NumberField({ required: true, nullable: true, integer: false, initial: null }),
    units: new fields$1.StringField({ required: true, blank: true, initial: "m" }),
    type: new fields$1.StringField({ required: true, blank: true, initial: "none" })
  });
}
__name$y(makeTargetTemplate, "makeTargetTemplate");

var __defProp$x = Object.defineProperty;
var __name$x = (target, value) => __defProp$x(target, "name", { value, configurable: true });
const fields = foundry.data.fields;
const requiredInteger = { required: true, nullable: false, integer: true };
const requiredBlankString = { required: true, blank: true, initial: "" };
const _WeaponData = class _WeaponData extends GearData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.target = makeTargetTemplate();
    schema.range = new fields.StringField({ ...requiredBlankString });
    schema.damage = new fields.StringField({ required: true, blank: true, initial: "" });
    schema.damageBonus = new fields.NumberField({ required: true, nullable: true, integer: true, initial: 0 });
    schema.magazineSize = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.ammo = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.magazineCost = new fields.NumberField({ required: true, nullable: false, integer: false, initial: 0 });
    schema.lawLevel = new fields.StringField({ ...requiredBlankString });
    schema.rangeBand = new fields.StringField({ required: true, blank: false, initial: "none" });
    schema.weaponType = new fields.StringField({ ...requiredBlankString });
    schema.damageType = new fields.StringField({ required: true, blank: false, initial: "NONE" });
    schema.rateOfFire = new fields.StringField({ ...requiredBlankString });
    schema.doubleTap = new fields.BooleanField({ required: true, initial: false });
    schema.recoil = new fields.BooleanField({ required: true, initial: false });
    schema.features = new fields.StringField({ ...requiredBlankString });
    schema.armorPiercing = new fields.StringField({ required: true, blank: false, initial: "0" });
    schema.parryAV = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.isShield = new fields.BooleanField({ required: true, initial: false });
    schema.handlingModifiers = new fields.StringField({ ...requiredBlankString });
    schema.meleeRangeModifier = new fields.StringField({ required: true, blank: true, initial: "0" });
    schema.customCT = new fields.SchemaField({
      armor: new fields.SchemaField({
        nothing: new fields.StringField({ required: true, blank: true, initial: "0" }),
        jack: new fields.StringField({ required: true, blank: true, initial: "0" }),
        mesh: new fields.StringField({ required: true, blank: true, initial: "0" }),
        cloth: new fields.StringField({ required: true, blank: true, initial: "0" }),
        reflec: new fields.StringField({ required: true, blank: true, initial: "0" }),
        ablat: new fields.StringField({ required: true, blank: true, initial: "0" }),
        combat: new fields.StringField({ required: true, blank: true, initial: "0" })
      }),
      range: new fields.SchemaField({
        close: new fields.StringField({ required: true, blank: true, initial: "0" }),
        short: new fields.StringField({ required: true, blank: true, initial: "0" }),
        medium: new fields.StringField({ required: true, blank: true, initial: "0" }),
        long: new fields.StringField({ required: true, blank: true, initial: "0" }),
        veryLong: new fields.StringField({ required: true, blank: true, initial: "0" })
      })
    });
    return schema;
  }
  static migrateData(source) {
    if ("ammo" in source) {
      migrateStringToNumber(source, "ammo");
      if (!Number.isInteger(source.ammo)) {
        source.ammo = Math.trunc(source.ammo);
      }
      if (source.ammo < 0) {
        source.ammo = 0;
      }
    }
    if ("armorPiercing" in source) {
      if (typeof source.armorPiercing !== "string") {
        migrateNumberToString(source, "armorPiercing");
      }
    }
    return super.migrateData(source);
  }
};
__name$x(_WeaponData, "WeaponData");
let WeaponData = _WeaponData;
const _ArmorData = class _ArmorData extends GearData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.armor = new fields.NumberField({ required: true, nullable: false, integer: false, initial: 0 });
    schema.armorDM = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.secondaryArmor = new fields.SchemaField({
      value: new fields.NumberField({ required: true, nullable: false, integer: false, initial: 0 }),
      protectionTypes: new fields.ArrayField(new fields.StringField({ blank: false }))
    });
    schema.radiationProtection = makeValueField(0);
    schema.isPowered = new fields.BooleanField({ required: true, initial: false });
    schema.nonstackable = new fields.BooleanField({ required: true, initial: false });
    schema.armorType = new fields.StringField({ required: true, blank: false, initial: "nothing" });
    return schema;
  }
};
__name$x(_ArmorData, "ArmorData");
let ArmorData = _ArmorData;
const _AugmentData = class _AugmentData extends GearData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.auglocation = new fields.StringField({ required: true, blank: false, initial: "None" });
    schema.bonus = new fields.StringField({ required: true, blank: true, initial: "stat increase" });
    schema.buildPoints = new fields.NumberField({ ...requiredInteger, initial: 0 });
    return schema;
  }
};
__name$x(_AugmentData, "AugmentData");
let AugmentData = _AugmentData;
const _TraitData = class _TraitData extends TwodsixItemBaseData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.value = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.shortdescr = new fields.StringField({ ...requiredBlankString });
    schema.subtype = new fields.StringField({ ...requiredBlankString });
    schema.prereq = new fields.StringField({ ...requiredBlankString });
    schema.key = new fields.StringField({ required: true, blank: false, initial: "key" });
    return schema;
  }
};
__name$x(_TraitData, "TraitData");
let TraitData = _TraitData;
const _SkillData = class _SkillData extends TraitData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.value = new fields.NumberField({ ...requiredInteger, initial: -3 });
    schema.characteristic = new fields.StringField({ required: true, blank: false, initial: "NONE" });
    schema.difficulty = new fields.StringField({ required: true, blank: false, initial: "Average" });
    schema.rolltype = new fields.StringField({ required: true, blank: false, initial: "Normal" });
    schema.trainingNotes = new fields.StringField({ ...requiredBlankString });
    schema.groupLabel = new fields.StringField({ ...requiredBlankString });
    return schema;
  }
};
__name$x(_SkillData, "SkillData");
let SkillData = _SkillData;
const _SpellData = class _SpellData extends TraitData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.target = makeTargetTemplate();
    schema.circle = new fields.StringField({ ...requiredBlankString });
    schema.duration = new fields.StringField({ ...requiredBlankString });
    schema.associatedSkillName = new fields.StringField({ ...requiredBlankString });
    schema.damage = new fields.StringField({ ...requiredBlankString });
    schema.damageType = new fields.StringField({ required: true, blank: false, initial: "NONE" });
    return schema;
  }
};
__name$x(_SpellData, "SpellData");
let SpellData = _SpellData;
const _PsiAbilityData = class _PsiAbilityData extends TraitData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.target = makeTargetTemplate();
    schema.duration = new fields.StringField({ ...requiredBlankString });
    schema.associatedSkillName = new fields.StringField({ ...requiredBlankString });
    schema.skill = new fields.StringField({ ...requiredBlankString });
    schema.range = new fields.StringField({ ...requiredBlankString });
    schema.rangeBand = new fields.StringField({ required: true, blank: false, initial: "none" });
    schema.damage = new fields.StringField({ ...requiredBlankString });
    schema.damageType = new fields.StringField({ required: true, blank: false, initial: "psionic" });
    schema.psiCost = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.difficulty = new fields.StringField({ required: true, blank: false, initial: "Average" });
    schema.skillModifier = new fields.NumberField({ ...requiredInteger, initial: 0 });
    return schema;
  }
};
__name$x(_PsiAbilityData, "PsiAbilityData");
let PsiAbilityData = _PsiAbilityData;
const _ConsumableData = class _ConsumableData extends GearData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.currentCount = new fields.NumberField({ ...requiredInteger, initial: 1 });
    schema.max = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.subtype = new fields.StringField({ required: true, blank: false, initial: "other" });
    schema.armorPiercing = new fields.StringField({ required: true, blank: false, initial: "0" });
    schema.bonusDamage = new fields.StringField({ ...requiredBlankString });
    schema.ammoRangeModifier = new fields.StringField({ required: true, blank: false, initial: "0" });
    schema.isAttachment = new fields.BooleanField({ required: true, initial: false });
    schema.bandwidth = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.softwareActive = new fields.BooleanField({ required: true, initial: true });
    schema.damageType = new fields.StringField({ required: true, blank: false, initial: "NONE" });
    schema.parentName = new fields.StringField({ ...requiredBlankString });
    schema.parentType = new fields.StringField({ ...requiredBlankString });
    schema.target = makeTargetTemplate();
    return schema;
  }
  static migrateData(source) {
    if ("ammoRangeModifier" in source) {
      if (source.ammoRangeModifier === "") {
        source.ammoRangeModifier = "0";
      }
    }
    if ("armorPiercing" in source) {
      if (typeof source.armorPiercing !== "string") {
        migrateNumberToString(source, "armorPiercing");
      }
    }
    return super.migrateData(source);
  }
};
__name$x(_ConsumableData, "ConsumableData");
let ConsumableData = _ConsumableData;
const _ComponentData = class _ComponentData extends GearData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.subtype = new fields.StringField({ required: true, blank: false, initial: "otherInternal" });
    schema.powerDraw = new fields.NumberField({ required: true, nullable: false, integer: false, initial: 0 });
    schema.rating = new fields.StringField({ ...requiredBlankString });
    schema.availableQuantity = new fields.StringField({ ...requiredBlankString });
    schema.hits = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.damage = new fields.StringField({ ...requiredBlankString });
    schema.radDamage = new fields.StringField({ ...requiredBlankString });
    schema.range = new fields.StringField({ ...requiredBlankString });
    schema.status = new fields.StringField({ required: true, blank: false, initial: "operational" });
    schema.weightIsPct = new fields.BooleanField({ required: true, initial: false });
    schema.isIllegal = new fields.BooleanField({ required: true, initial: false });
    schema.purchasePrice = new fields.NumberField({ required: true, nullable: false, integer: false, initial: 0 });
    schema.cargoLocation = new fields.StringField({ ...requiredBlankString });
    schema.generatesPower = new fields.BooleanField({ required: true, initial: false });
    schema.isRefined = new fields.BooleanField({ required: true, initial: false });
    schema.features = new fields.StringField({ ...requiredBlankString });
    schema.pricingBasis = new fields.StringField({ required: true, blank: false, initial: "perUnit" });
    schema.powerBasis = new fields.StringField({ required: true, blank: false, initial: "perUnit" });
    schema.isBaseHull = new fields.BooleanField({ required: true, initial: false });
    schema.rollModifier = new fields.StringField({ ...requiredBlankString });
    schema.rateOfFire = new fields.StringField({ ...requiredBlankString });
    schema.armorPiercing = new fields.StringField({ required: true, blank: false, initial: "0" });
    schema.actorLink = new fields.StringField({ ...requiredBlankString });
    schema.hardened = new fields.BooleanField({ required: true, initial: false });
    schema.ammunition = makeResourceField(0, 0);
    schema.isPopup = new fields.BooleanField({ required: true, initial: false });
    schema.isExtended = new fields.BooleanField({ required: true, initial: false });
    schema.bandwidth = new fields.NumberField({ ...requiredInteger, initial: 0 });
    schema.fireArc = new fields.SchemaField({
      startAngle: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      endAngle: new fields.NumberField({ ...requiredInteger, initial: 0 })
    });
    schema.shipWeaponType = new fields.StringField({ ...requiredBlankString });
    schema.ammoLink = new fields.StringField({ required: true, blank: false, initial: "none" });
    return schema;
  }
  static migrateData(source) {
    if ("purchasePrice" in source) {
      migrateStringToNumber(source, "purchasePrice");
    }
    if ("armorPiercing" in source) {
      if (typeof source.armorPiercing !== "string") {
        migrateNumberToString(source, "armorPiercing");
      }
    }
    if ("shipWeaponType" in source) {
      if (source.shipWeaponType === "") {
        source.shipWeaponType = "other";
      }
    }
    return super.migrateData(source);
  }
};
__name$x(_ComponentData, "ComponentData");
let ComponentData = _ComponentData;
const _ShipPositionData = class _ShipPositionData extends TwodsixItemBaseData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.name = new fields.StringField({ ...requiredBlankString });
    schema.icon = new fields.StringField({ ...requiredBlankString });
    schema.actions = new fields.ObjectField({ required: true, initial: {} });
    schema.order = new fields.NumberField({ ...requiredInteger, initial: 0 });
    return schema;
  }
};
__name$x(_ShipPositionData, "ShipPositionData");
let ShipPositionData = _ShipPositionData;
const _ComputerData = class _ComputerData extends GearData {
  static defineSchema() {
    const schema = super.defineSchema();
    schema.processingPower = new fields.NumberField({ ...requiredInteger, initial: 0 });
    return schema;
  }
};
__name$x(_ComputerData, "ComputerData");
let ComputerData = _ComputerData;
const _JunkStorageData = class _JunkStorageData extends GearData {
  static defineSchema() {
    const schema = super.defineSchema();
    return schema;
  }
};
__name$x(_JunkStorageData, "JunkStorageData");
let JunkStorageData = _JunkStorageData;

var __defProp$w = Object.defineProperty;
var __name$w = (target, value) => __defProp$w(target, "name", { value, configurable: true });
const _TwodsixBattleSheet = class _TwodsixBattleSheet extends foundry.applications.api.HandlebarsApplicationMixin(TwodsixShipSheet) {
  /** @inheritDoc */
  _initializeApplicationOptions(options) {
    const applicationOptions = super._initializeApplicationOptions(options);
    applicationOptions.dragDrop = [{ dragSelector: ".item", dropSelector: null }];
    return applicationOptions;
  }
  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    if (game.settings.get("twodsix", "useShipAutoCalcs")) {
      context.actor.system.shipStats.bandwidth.value = this.actor.system._source.shipStats.bandwidth.value;
      context.actor.system.shipStats.bandwidth.max = this.actor.system._source.shipStats.bandwidth.max;
      context.actor.system.shipStats.power.value = this.actor.system._source.shipStats.power.value;
      context.actor.system.shipStats.power.max = this.actor.system._source.shipStats.power.max;
    }
    const positionData = [];
    const allPositions = this.actor.itemTypes.ship_position.sort(comparePositions);
    for (const position of allPositions) {
      const actions = {};
      let defaultAction = "";
      for (const action in position.system.actions) {
        Object.assign(actions, { [action]: position.system.actions[action].name });
        if (!defaultAction) {
          defaultAction = action;
        }
      }
      const actors = {};
      let defaultActor = "";
      for (const actor of position.system.actors) {
        Object.assign(actors, { [actor.id]: actor.name });
        if (!defaultActor) {
          defaultActor = actor.id;
        }
      }
      positionData.push({ id: position.id, name: position.name, actions, actors, defaultActor, defaultAction });
    }
    Object.assign(context, { positionData });
    const componentsToIgnore = game.settings.get("twodsix", "componentsIgnored");
    context.container.nonCargoForDamage = context.container.nonCargo?.filter((comp) => !componentsToIgnore.includes(comp.system.subtype));
    return context;
  }
  static _onPositionClick(ev, target) {
    if (target !== null) {
      const li = target.closest(".item");
      const selectedPositionId = li?.dataset.itemId;
      let selectedActorId = "";
      let selectedActionId = "";
      if (selectedPositionId) {
        if (li?.querySelector("[name='selectedActor']").length > 0) {
          selectedActorId = li.querySelector("[name='selectedActor']")?.value;
        }
        if (li?.querySelector("[name='selectedAction']").length > 0) {
          selectedActionId = li.querySelector("[name='selectedAction']")?.value;
        }
      }
      TwodsixShipSheet.performShipAction(ev, selectedPositionId, selectedActorId, selectedActionId, this.actor);
    }
  }
};
__name$w(_TwodsixBattleSheet, "TwodsixBattleSheet");
_TwodsixBattleSheet.DEFAULT_OPTIONS = {
  sheetType: "TwodsixBattleSheet",
  classes: ["twodsix", "battle", "actor"],
  position: {
    width: 850,
    height: 730
  },
  window: {
    resizable: true,
    icon: "fa-solid fa-rocket"
  },
  form: {
    submitOnChange: true,
    submitOnClose: true
  },
  actions: {
    positionClick: _TwodsixBattleSheet._onPositionClick
  },
  tag: "form"
};
_TwodsixBattleSheet.PARTS = {
  main: {
    template: "systems/twodsix/templates/actors/battle-sheet.hbs",
    scrollable: ["battle-content-container"]
  }
};
let TwodsixBattleSheet = _TwodsixBattleSheet;
function comparePositions(a, b) {
  return a.system.order - b.system.order;
}
__name$w(comparePositions, "comparePositions");

var __defProp$v = Object.defineProperty;
var __name$v = (target, value) => __defProp$v(target, "name", { value, configurable: true });
const _TwodsixGamePause = class _TwodsixGamePause extends foundry.applications.ui.GamePause {
  /** @override */
  async _renderHTML(context, _options) {
    const svgImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' preserveAspectRatio='xMidYMid meet' version='1.0' viewBox='0 0 300 300'%3E%3Cg fill='%2329aaff' stroke='none'%3E%3Cpath d='M1636 2943 c-37 -37 -54 -71 -75 -153 -14 -52 -73 -179 -97 -209 -7 -9 -173 99 -213 139 -100 99 -161 134 -161 93 0 -10 -11 -42 -25 -71 -28 -59 -31 -95 -14 -152 7 -21 9 -54 5 -73 l-7 -35 -50 19 c-99 38 -155 72 -225 139 -69 66 -108 89 -122 75 -16 -15 -4 -161 17 -225 13 -36 28 -91 36 -123 11 -52 11 -57 -4 -53 -9 2 -43 7 -76 10 -33 4 -103 20 -155 37 -80 26 -100 29 -124 20 -25 -10 -28 -15 -22 -42 15 -75 56 -154 97 -189 67 -56 119 -107 119 -116 0 -5 -98 -11 -218 -12 -119 -2 -219 -6 -221 -8 -2 -2 3 -12 12 -22 10 -10 17 -21 17 -25 0 -8 107 -109 167 -156 29 -23 59 -54 68 -71 l15 -29 -39 -21 c-58 -29 -207 -70 -257 -70 -23 0 -46 -5 -49 -11 -21 -33 154 -151 256 -173 15 -3 36 -14 49 -24 l22 -18 -84 -79 c-67 -65 -94 -84 -143 -100 -102 -34 -85 -62 70 -116 129 -45 176 -53 225 -39 19 5 36 8 38 5 2 -2 -6 -24 -18 -49 -22 -46 -111 -136 -135 -136 -6 0 -19 -8 -29 -19 -21 -23 -11 -33 67 -57 54 -17 60 -17 105 -1 44 16 132 23 144 12 21 -21 -58 -235 -107 -292 -19 -23 -35 -48 -35 -57 0 -22 40 -30 116 -23 53 4 79 13 143 50 43 25 94 52 115 61 58 24 58 32 -15 -232 -30 -111 -24 -116 82 -62 108 55 143 82 164 128 21 44 44 72 60 72 20 0 37 -78 46 -205 4 -66 8 -121 8 -122 4 -15 37 7 78 49 35 38 53 67 62 101 14 56 63 113 70 81 5 -26 34 -66 118 -161 40 -45 81 -96 91 -114 25 -46 38 -46 53 -2 7 21 30 74 52 118 25 49 42 97 43 124 6 89 26 94 75 19 29 -45 47 -59 123 -99 49 -26 93 -54 98 -63 13 -24 35 -19 40 9 3 13 3 78 1 142 -6 153 -1 162 76 133 78 -30 122 -55 160 -90 26 -24 36 -28 47 -19 8 6 11 15 9 20 -3 4 -8 80 -11 167 l-6 160 45 -9 c24 -4 66 -23 93 -41 44 -29 57 -33 130 -35 55 -1 87 2 99 11 17 12 12 20 -62 107 -99 116 -133 167 -133 197 0 28 6 30 105 36 44 2 105 12 135 21 30 9 76 22 102 28 l48 12 -54 33 c-30 17 -100 75 -156 129 l-102 97 39 12 c21 6 67 25 103 41 36 16 94 40 130 52 96 32 99 35 70 66 -35 38 -131 84 -198 96 -31 6 -78 20 -104 31 -41 17 -46 23 -38 39 11 20 89 69 109 69 19 0 72 39 161 120 82 74 82 74 54 82 -67 18 -219 20 -284 5 -36 -9 -79 -18 -96 -21 l-31 -5 22 64 c20 56 56 120 76 135 3 3 10 16 14 30 4 13 33 50 63 82 l55 58 -180 0 c-142 0 -183 -3 -199 -15 -22 -17 -48 -20 -39 -5 4 6 9 23 11 38 3 15 25 58 49 95 49 76 78 153 73 191 l-3 25 -88 -29 c-88 -30 -130 -48 -239 -100 -32 -16 -60 -24 -64 -19 -3 5 -5 64 -5 130 1 66 -4 129 -9 140 -25 45 -141 0 -192 -74 -12 -18 -30 -42 -41 -54 l-20 -22 -18 34 c-10 19 -28 69 -40 112 -11 43 -35 122 -53 176 l-33 98 -27 -28z m104 -442 c117 -26 263 -88 352 -151 24 -17 54 -38 68 -47 43 -28 173 -166 215 -228 70 -103 129 -234 151 -333 56 -251 35 -473 -66 -689 -154 -331 -482 -562 -840 -593 -341 -30 -620 66 -851 291 -94 92 -127 137 -198 269 -25 47 -76 184 -89 240 -21 88 -35 230 -28 282 4 29 10 78 13 108 7 73 66 248 111 333 146 271 383 445 717 525 54 13 376 8 445 -7z' transform='translate(0.000000,300.000000) scale(0.100000,-0.100000)'/%3E%3Cpath d='M1339 2416 c-129 -23 -262 -77 -377 -153 -59 -39 -202 -170 -202 -184 0 -6 -9 -20 -21 -32 -55 -59 -139 -246 -165 -372 -18 -84 -20 -266 -5 -352 55 -299 257 -560 536 -689 296 -137 658 -109 932 73 74 49 183 151 230 217 21 28 42 56 48 61 21 19 93 190 116 275 34 124 34 339 0 460 -94 341 -348 592 -690 681 -98 26 -297 33 -402 15z' transform='translate(0.000000,300.000000) scale(0.100000,-0.100000)'/%3E%3C/g%3E%3C/svg%3E";
    const replaceCode = `%23` + game.settings.get("twodsix", "defaultColor").substring(1);
    const img = document.createElement("img");
    img.src = svgImage.replace("%2329aaff", replaceCode);
    if (context.spin) {
      img.classList.add("fa-spin");
    }
    const caption = document.createElement("figcaption");
    caption.innerText = context.text;
    return [img, caption];
  }
};
__name$v(_TwodsixGamePause, "TwodsixGamePause");
let TwodsixGamePause = _TwodsixGamePause;

var __defProp$u = Object.defineProperty;
var __name$u = (target, value) => __defProp$u(target, "name", { value, configurable: true });
const _TwodsixChatLog = class _TwodsixChatLog extends foundry.applications.sidebar.tabs.ChatLog {
  /** @inheritDoc */
  _initializeApplicationOptions(options) {
    const applicationOptions = super._initializeApplicationOptions(options);
    applicationOptions.actions = assignNewActions(applicationOptions.actions);
    return applicationOptions;
  }
  /**
   * Get context menu entries for chat messages in the log.
   * @returns {ContextMenuEntry[]}
   * @inheritDoc
   */
  _getEntryContextOptions() {
    const options = super._getEntryContextOptions();
    return newContextOptions(options);
  }
};
__name$u(_TwodsixChatLog, "TwodsixChatLog");
let TwodsixChatLog = _TwodsixChatLog;
const _TwodsixChatPopout = class _TwodsixChatPopout extends foundry.applications.sidebar.apps.ChatPopout {
  /** @inheritDoc */
  _initializeApplicationOptions(options) {
    const applicationOptions = super._initializeApplicationOptions(options);
    applicationOptions.actions = assignNewActions(applicationOptions.actions);
    Object.assign(applicationOptions.actions, { expandRoll: onExpandRoll });
    return applicationOptions;
  }
  /**
   * Get context menu entries for chat messages in the log.
   * @returns {ContextMenuEntry[]}
   * @inheritDoc
   */
  _getEntryContextOptions() {
    const options = super._getEntryContextOptions();
    return newContextOptions(options);
  }
};
__name$u(_TwodsixChatPopout, "TwodsixChatPopout");
let TwodsixChatPopout = _TwodsixChatPopout;
function assignNewActions(coreActions) {
  return Object.assign(coreActions, {
    opposed: onChatCardAction,
    chain: onChatCardAction,
    expand: onChatCardAction,
    abilityCheck: onChatCardAction,
    damage: onChatCardAction
  });
}
__name$u(assignNewActions, "assignNewActions");
function newContextOptions(coreContext) {
  const canApply = /* @__PURE__ */ __name$u((li) => {
    const message = game.messages.get(li.dataset?.messageId);
    return message?.isRoll && message?.isContentVisible && canvas.tokens?.controlled.length;
  }, "canApply");
  coreContext.push(
    {
      name: game.i18n.localize("TWODSIX.Chat.Roll.ApplyDamage"),
      icon: '<i class="fas fa-user-minus"></i>',
      condition: canApply,
      callback: /* @__PURE__ */ __name$u((li) => applyChatCardDamage(li, 1), "callback")
    },
    {
      name: game.i18n.localize("TWODSIX.Chat.Roll.ApplyDestructiveDamage"),
      icon: '<i class="fas fa-user-injured"></i>',
      condition: canApply,
      callback: /* @__PURE__ */ __name$u((li) => applyChatCardDamage(li, 10), "callback")
    },
    {
      name: game.i18n.localize("TWODSIX.Chat.Roll.ApplyReducedDamage"),
      icon: '<i class="fas fa-user-shield"></i>',
      condition: canApply,
      callback: /* @__PURE__ */ __name$u((li) => applyChatCardDamage(li, 0.1), "callback")
    },
    {
      name: game.i18n.localize("TWODSIX.Chat.Roll.ApplyHealing"),
      icon: '<i class="fas fa-user-plus"></i>',
      condition: canApply,
      callback: /* @__PURE__ */ __name$u((li) => applyChatCardDamage(li, -1), "callback")
    }
  );
  return coreContext;
}
__name$u(newContextOptions, "newContextOptions");
async function onChatCardAction(event, target) {
  event.preventDefault();
  const button = target;
  const messageId = target.closest("[data-message-id]")?.dataset.messageId;
  const message = game.messages.get(messageId);
  if (!message) {
    return;
  }
  const action = button.dataset.action;
  if (action === "expand") {
    onExpandClick(message);
    return;
  } else if (action === "abilityCheck") {
    makeRequestedRoll(message);
    return;
  } else {
    const actor = await getChatCardActor(message);
    if (!actor) {
      return;
    }
    const isTargettedAction = ["chain", "opposed"].includes(action);
    if (!(isTargettedAction || game.user.isGM || actor.isOwner)) {
      return;
    }
    const storedData = message.getFlag("twodsix", "itemUUID");
    const item = storedData ? await fromUuid(storedData) : {};
    if (!item) {
      const err = game.i18n.format("TWODSIX.Errors.ActionWarningNoItem", { item: storedData, name: actor.name });
      return ui.notifications.error(err);
    }
    const useInvertedShiftClick = game.settings.get("twodsix", "invertSkillRollShiftClick");
    const showFormulaDialog = useInvertedShiftClick ? event["shiftKey"] : !event["shiftKey"];
    const bonusDamage = message.getFlag("twodsix", "bonusDamage");
    const effect = message.getFlag("twodsix", "effect") ?? 0;
    const addEffect = game.settings.get("twodsix", "addEffectToDamage");
    let totalBonusDamage = addEffect ? `${effect}` : ``;
    if (bonusDamage !== "0" && bonusDamage !== "") {
      totalBonusDamage += (addEffect ? ` + ` : ``) + `${bonusDamage}`;
    }
    switch (action) {
      case "damage":
        await item.rollDamage(game.settings.get("core", "rollMode"), totalBonusDamage, true, showFormulaDialog, effect);
        break;
      case "opposed":
        makeSecondaryRoll(message, "opposed", showFormulaDialog);
        break;
      case "chain":
        makeSecondaryRoll(message, "chain", showFormulaDialog);
        break;
    }
  }
}
__name$u(onChatCardAction, "onChatCardAction");
function applyChatCardDamage(li, multiplier) {
  const message = game.messages.get(li.dataset?.messageId);
  const transfer = message.getFlag("twodsix", "transfer") ? JSON.parse(message.getFlag("twodsix", "transfer")) : void 0;
  const effect = transfer?.payload.damageValue ?? message.getFlag("twodsix", "effect") ?? message.rolls[0]?.total;
  if (effect > 0) {
    return Promise.all(canvas.tokens.controlled.map((t) => {
      const targetActor = t.actor;
      if (["traveller", "robot", "animal", "ship"].includes(targetActor.type)) {
        const damage = Math.floor(effect * multiplier);
        if (damage > 0) {
          const damagePayload = transfer?.payload ?? { armorPiercingValue: 0, damageLabel: "", damageType: "", dice: message.rolls[0]?.dice[0]?.results };
          Object.assign(damagePayload, { damageValue: damage });
          targetActor.handleDamageData(damagePayload, true);
        } else if (multiplier < 0 && !["ship"].includes(targetActor.type)) {
          targetActor.healActor(effect, transfer?.payload.dice ?? message.rolls[0]?.dice[0]?.results);
        } else {
          ui.notifications.warn("TWODSIX.Warnings.CantAutoRepair", { localize: true });
        }
      } else {
        ui.notifications.warn("TWODSIX.Warnings.CantAutoDamage", { localize: true });
      }
    }));
  } else {
    ui.notifications.warn("TWODSIX.Warnings.NoDamageToApply", { localize: true });
  }
}
__name$u(applyChatCardDamage, "applyChatCardDamage");
async function getChatCardActor(message) {
  const actor = await fromUuid(message.getFlag("twodsix", "actorUUID"));
  if (actor) {
    return actor;
  } else {
    return null;
  }
}
__name$u(getChatCardActor, "getChatCardActor");
async function onExpandClick(message) {
  if (message.flavor) {
    if (message.flavor.includes('class="dice-chattip" style="display:none"')) {
      message.update({ flavor: message.flavor.replace('class="dice-chattip" style="display:none"', 'class="dice-chattip" style="display:contents"') });
    } else {
      message.update({ flavor: message.flavor.replace('class="dice-chattip" style="display:contents"', 'class="dice-chattip" style="display:none"') });
    }
  }
}
__name$u(onExpandClick, "onExpandClick");
async function makeSecondaryRoll(message, type, showDialog) {
  const secondActor = getControlledTraveller();
  if (!secondActor) {
    ui.notifications.warn("TWODSIX.Warnings.NoActorSelected", { localize: true });
    return;
  }
  const skillList = secondActor.getSkillNameList();
  const selectedSkillUuid = await skillDialog(skillList);
  const originalEffect = message.getFlag("twodsix", "effect");
  if (selectedSkillUuid === false) {
    return;
  } else if (selectedSkillUuid === "") {
    ui.notifications.warn("TWODSIX.Warnings.NoSkillSelected", { localize: true });
    return;
  }
  const selectedSkill = await fromUuid(selectedSkillUuid);
  const tempSettings = {};
  switch (type) {
    case "opposed":
      Object.assign(tempSettings, {
        extraFlavor: game.i18n.localize("TWODSIX.Rolls.MakesOpposedRoll")
      });
      break;
    case "chain":
      Object.assign(tempSettings, {
        extraFlavor: game.i18n.localize("TWODSIX.Rolls.MakesChainRoll"),
        rollModifiers: { chain: getChainRollBonus(originalEffect) }
      });
      break;
  }
  const settings = await TwodsixRollSettings.create(showDialog, tempSettings, selectedSkill, void 0, secondActor);
  if (!settings.shouldRoll) {
    return;
  }
  const roll = await selectedSkill.skillRoll(showDialog, settings, true);
  let winnerName = "";
  if (roll && type === "opposed") {
    if (originalEffect > roll.effect) {
      winnerName = (await fromUuid(message.getFlag("twodsix", "actorUUID"))).name;
    } else if (roll.effect > originalEffect) {
      winnerName = secondActor.name;
    }
    if (winnerName === "") {
      ChatMessage.create({ content: game.i18n.localize("TWODSIX.Chat.Roll.TiedRoll"), speaker: ChatMessage.getSpeaker({ actor: secondActor }) });
    } else {
      ChatMessage.create({ content: `${winnerName} ${game.i18n.localize("TWODSIX.Chat.Roll.WinsRoll")}`, speaker: ChatMessage.getSpeaker({ actor: secondActor }) });
    }
  }
}
__name$u(makeSecondaryRoll, "makeSecondaryRoll");
async function skillDialog(skillList) {
  let returnValue = "";
  let options = ``;
  for (const [key, value] of Object.entries(skillList)) {
    options += `<option value="${key}">${value}</option>`;
  }
  const select = `<select name="item-select">${options}</select>`;
  const content = `<form><div class="form-group"><label>${game.i18n.localize("TWODSIX.Rolls.SkillName")} (${game.i18n.localize("TWODSIX.Actor.Skills.Level")}): ${select}</label></div></form>`;
  const buttons = [
    {
      action: "ok",
      label: "TWODSIX.Rolls.SelectSkill",
      icon: "fa-solid fa-list",
      default: true,
      callback: /* @__PURE__ */ __name$u((event, button, dialog) => {
        returnValue = dialog.element.querySelector("select[name='item-select']").value;
      }, "callback")
    },
    {
      action: "cancel",
      icon: "fa-solid fa-xmark",
      label: "Cancel",
      callback: /* @__PURE__ */ __name$u(() => {
        returnValue = false;
      }, "callback")
    }
  ];
  return new Promise((resolve) => {
    new foundry.applications.api.DialogV2({
      window: { title: "TWODSIX.Rolls.SelectSkill" },
      content,
      buttons,
      submit: /* @__PURE__ */ __name$u(() => {
        resolve(returnValue);
      }, "submit")
    }).render({ force: true });
  });
}
__name$u(skillDialog, "skillDialog");
function getChainRollBonus(effect) {
  const ranges = game.settings.get("twodsix", "chainBonus").split(",").map((str) => parseInt(str));
  if (ranges.length !== 6) {
    return 0;
  } else {
    if (effect <= -6) {
      return ranges[0];
    } else if (effect <= -2) {
      return ranges[1];
    } else if (effect === -1) {
      return ranges[2];
    } else if (effect === 0) {
      return ranges[3];
    } else if (effect <= 5) {
      return ranges[4];
    } else if (effect >= 6) {
      return ranges[5];
    }
  }
}
__name$u(getChainRollBonus, "getChainRollBonus");
async function makeRequestedRoll(message) {
  const messageSettings = message.getFlag("twodsix", "rollSettings");
  const tmpSettings = {
    difficulty: messageSettings.difficulty,
    rollType: messageSettings.rollType,
    rollMode: messageSettings.rollMode,
    itemRoll: messageSettings.itemId !== "NONE",
    skillName: messageSettings.skillName,
    skillRoll: messageSettings.skillName !== "---" || messageSettings.itemId !== "NONE",
    rollModifiers: {
      characteristic: messageSettings.characteristic || "NONE",
      other: messageSettings.other
    }
  };
  const rollingActorsUuids = messageSettings.userActorList[game.user.id];
  if (rollingActorsUuids?.length > 0) {
    for (const actorUuid of rollingActorsUuids) {
      const actor = fromUuidSync(actorUuid);
      const selectedSkill = messageSettings.skillName !== "---" ? await actor.items.find((it) => it.name === messageSettings.skillName && it.type === "skills") ?? actor.items.get(actor.system.untrainedSkill) : void 0;
      if (messageSettings.itemId && messageSettings.itemId !== "NONE") {
        const item = actor.items.get(messageSettings.itemId) ?? actor.items.getName(messageSettings.itemName);
        if (item) {
          if (item.type === "weapon") {
            if (selectedSkill) {
              tmpSettings.rollModifiers.selectedSkill = selectedSkill.uuid;
            }
            await item.resolveUnknownAutoMode(true, tmpSettings);
          } else {
            const rollSettings = await TwodsixRollSettings.create(false, tmpSettings, selectedSkill, item, actor);
            await item.doSkillTalentRoll(false, rollSettings);
          }
        } else {
          ui.notifications.warn("TWODSIX.Warnings.CantFindItemOnActor", { localize: true });
        }
      } else {
        let selectedCharacteristic = messageSettings.characteristic !== "---" ? messageSettings.characteristic : "NONE";
        if (selectedSkill && selectedCharacteristic === "NONE") {
          selectedCharacteristic = selectedSkill.system.characteristic ?? "NONE";
        }
        tmpSettings.rollModifiers.characteristic = selectedCharacteristic;
        const rollSettings = await TwodsixRollSettings.create(false, tmpSettings, selectedSkill, void 0, actor);
        if (rollSettings.shouldRoll) {
          const diceRoll = new TwodsixDiceRoll(rollSettings, actor);
          await diceRoll.evaluateRoll();
          diceRoll.sendToChat(TWODSIX$1.DIFFICULTIES[game.settings.get("twodsix", "difficultyListUsed")]);
        }
      }
    }
  }
}
__name$u(makeRequestedRoll, "makeRequestedRoll");
function onExpandRoll(event, target) {
  event.preventDefault();
  target.classList.toggle("expanded");
}
__name$u(onExpandRoll, "onExpandRoll");

var __defProp$t = Object.defineProperty;
var __name$t = (target, value) => __defProp$t(target, "name", { value, configurable: true });
const _TwodsixTokenRuler = class _TwodsixTokenRuler extends foundry.canvas.placeables.tokens.TokenRuler {
  /**
   * Get the style to be used to highlight the grid offset.
   * @param {DeepReadonly<Omit<TokenRulerWaypoint, "index"|"center"|"size"|"ray">>} waypoint    The waypoint
   * @param {DeepReadonly<GridOffset3D>} offset  An occupied grid offset at the given waypoint that is to be highlighted
   * @returns {{color?: PIXI.ColorSource; alpha?: number; texture?: PIXI.Texture; matrix?: PIXI.Matrix | null}}
   *   The color, alpha, texture, and texture matrix to be used to draw the grid space.
   *   If the alpha is 0, the grid space is not highlighted.
   * @protected
   */
  _getGridHighlightStyle(waypoint, offset) {
    let { color, alpha } = super._getGridHighlightStyle(waypoint, offset);
    if (game.settings.get("twodsix", "showMovementColors")) {
      const user = game.users.get(waypoint.userId);
      color = getMoveColorType(this.token, waypoint.measurement.cost) ?? user?.color ?? 0;
      alpha = 0.5;
    }
    return { color, alpha };
  }
};
__name$t(_TwodsixTokenRuler, "TwodsixTokenRuler");
let TwodsixTokenRuler = _TwodsixTokenRuler;
const colors = {
  "walk": "lime",
  "dash": "yellow",
  "run": "orange",
  "jump": "lime",
  "not": "red"
};
function adjustMovementForEncumbrance(actorData, movementSpeed, rulesSet) {
  if (!game.settings.get("twodsix", "useEncumbrance")) {
    return movementSpeed;
  }
  const encumbrance = actorData.encumbrance.value;
  const maxEncumbrance = actorData.encumbrance.max;
  switch (rulesSet) {
    case "CEATOM":
    case "BARBARIC":
      if (encumbrance > maxEncumbrance) {
        return 0;
      } else if (encumbrance > maxEncumbrance / 2) {
        return movementSpeed * 0.5;
      }
      break;
    case "CE":
      if (encumbrance > maxEncumbrance) {
        return 0;
      } else if (encumbrance > maxEncumbrance / 2) {
        return 1.5;
      } else if (encumbrance > maxEncumbrance / 6) {
        return movementSpeed * 0.75;
      }
      break;
    case "OTHER": {
      const fractionOneSquare = parseFloat(game.settings.get("twodsix", "encumbFractionOneSquare"));
      const fraction75pct = parseFloat(game.settings.get("twodsix", "encumbFraction75pct"));
      if (encumbrance > maxEncumbrance) {
        return 0;
      } else if (encumbrance > maxEncumbrance * fractionOneSquare) {
        return 1.5;
      } else if (encumbrance > maxEncumbrance * fraction75pct) {
        return movementSpeed * 0.75;
      }
      break;
    }
    default:
      if (encumbrance > maxEncumbrance) {
        return 0;
      }
  }
  return movementSpeed;
}
__name$t(adjustMovementForEncumbrance, "adjustMovementForEncumbrance");
function determineMovementColor(distance, movementSpeed, canRun) {
  if (distance <= movementSpeed) {
    return colors["walk"];
  } else if (distance <= 2 * movementSpeed) {
    return colors["dash"];
  } else if (canRun && distance <= 3 * movementSpeed) {
    return colors["run"];
  } else {
    return colors["not"];
  }
}
__name$t(determineMovementColor, "determineMovementColor");
function getMoveColorType(token, distance) {
  const actor = token.actor;
  const actorType = actor.type;
  const rulesSet = game.settings.get("twodsix", "ruleset");
  let movementSpeed = 0;
  if (actorType === "ship") {
    movementSpeed = token.actor.system.shipStats.drives.jDrive?.rating;
    if (token.scene.grid.units === "pc" && movementSpeed) {
      return distance <= movementSpeed ? colors["jump"] : colors["not"];
    }
    return;
  } else if (actorType === "vehicle") {
    return;
  } else if (["traveller", "animal", "robot"].includes(actorType)) {
    movementSpeed = token.actor.system.movement.walk;
    const actorData = actor.system;
    movementSpeed = adjustMovementForEncumbrance(actorData, movementSpeed, rulesSet);
    if (movementSpeed === 0) {
      return colors["not"];
    }
    const canRun = ["CEATOM", "BARBARIC", "CE", "CU"].includes(rulesSet);
    return determineMovementColor(distance, movementSpeed, canRun);
  }
  return;
}
__name$t(getMoveColorType, "getMoveColorType");

function __variableDynamicImportRuntime0__(path) {
  switch (path) {
    case './module/hooks/activeEffects.ts': return Promise.resolve().then(function () { return activeEffects; });
    case './module/hooks/addGMControlButtons.ts': return Promise.resolve().then(function () { return addGMControlButtons; });
    case './module/hooks/autoCompleteIntegration.ts': return Promise.resolve().then(function () { return autoCompleteIntegration; });
    case './module/hooks/diceTrayIntegration.ts': return Promise.resolve().then(function () { return diceTrayIntegration; });
    case './module/hooks/dragRulerIntegration.ts': return Promise.resolve().then(function () { return dragRulerIntegration; });
    case './module/hooks/dropItemOnToken.ts': return Promise.resolve().then(function () { return dropItemOnToken; });
    case './module/hooks/hooks.ts': return Promise.resolve().then(function () { return hooks; });
    case './module/hooks/itemPilesIntegration.ts': return Promise.resolve().then(function () { return itemPilesIntegration; });
    case './module/hooks/ready.ts': return Promise.resolve().then(function () { return ready; });
    case './module/hooks/renderChatMessage.ts': return Promise.resolve().then(function () { return renderChatMessage; });
    case './module/hooks/renderSettingsConfig.ts': return Promise.resolve().then(function () { return renderSettingsConfig; });
    case './module/hooks/setup.ts': return Promise.resolve().then(function () { return setup; });
    case './module/hooks/timeIntegration.ts': return Promise.resolve().then(function () { return timeIntegration; });
    case './module/hooks/updateFinances.ts': return Promise.resolve().then(function () { return updateFinances$1; });
    default: return new Promise(function(resolve, reject) {
      (typeof queueMicrotask === 'function' ? queueMicrotask : setTimeout)(
        reject.bind(null, new Error("Unknown variable dynamic import: " + path))
      );
    })
   }
 }
hookScriptFiles.forEach((hookFile) => __variableDynamicImportRuntime0__(`./module/hooks/${hookFile}.ts`));
Hooks.once("init", async function() {
  console.log(
    `%cTWODSIX | Initializing system
%c
     _____                   _     _
    |_   _|_      _____   __| |___(_)_  __
      | | \\ \\ /\\ / / _ \\ / _\` / __| \\ \\/ /
      | |  \\ V  V / (_) | (_| \\__ \\ |>  <
      |_|   \\_/\\_/ \\___/ \\__,_|___/_/_/\\_\\
    `,
    "color: #ffffff; font-weight: bold; font-size: 16px;",
    // Style for the header
    "color:rgba(41, 170, 225, 1); font-weight: normal; font-size: 12px;"
    // Style for the ASCII art
  );
  game["twodsix"] = {
    TwodsixActor,
    TwodsixItem,
    TwodsixActiveEffect,
    rollItemMacro,
    TwodsixDiceRoll,
    TwodsixRollSettings
  };
  CONFIG.ActiveEffect.legacyTransferral = false;
  CONFIG.ActiveEffect.sidebarIcon = "fa-solid fa-person-rays";
  CONFIG.Actor.documentClass = TwodsixActor;
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Actors.unregisterSheet("core", foundry.applications.sheets.ActorSheetV2);
  foundry.documents.collections.Actors.registerSheet("twodsix", TwodsixTravellerSheet, {
    types: ["traveller"],
    label: "TWODSIX.SheetTypes.TravellerSheet",
    makeDefault: true
  });
  foundry.documents.collections.Actors.registerSheet("twodsix", TwodsixNPCSheet, {
    types: ["traveller"],
    label: "TWODSIX.SheetTypes.NPCSheet",
    makeDefault: false
  });
  foundry.documents.collections.Actors.registerSheet("twodsix", TwodsixRobotSheet, {
    types: ["robot"],
    label: "TWODSIX.SheetTypes.RobotSheet",
    makeDefault: true
  });
  foundry.documents.collections.Actors.registerSheet("twodsix", TwodsixShipSheet, {
    types: ["ship"],
    label: "TWODSIX.SheetTypes.ShipSheet",
    makeDefault: true
  });
  foundry.documents.collections.Actors.registerSheet("twodsix", TwodsixBattleSheet, {
    types: ["ship"],
    label: "TWODSIX.SheetTypes.BattleSheet",
    makeDefault: false
  });
  foundry.documents.collections.Actors.registerSheet("twodsix", TwodsixVehicleSheet, {
    types: ["vehicle"],
    label: "TWODSIX.SheetTypes.VehicleSheet",
    makeDefault: true
  });
  foundry.documents.collections.Actors.registerSheet("twodsix", TwodsixAnimalSheet, {
    types: ["animal"],
    label: "TWODSIX.SheetTypes.AnimalSheet",
    makeDefault: true
  });
  foundry.documents.collections.Actors.registerSheet("twodsix", TwodsixSpaceObjectSheet, {
    types: ["space-object"],
    label: "TWODSIX.SheetTypes.SpaceObjectSheet",
    makeDefault: true
  });
  Object.assign(CONFIG.Actor.dataModels, {
    "traveller": TravellerData,
    "animal": AnimalData,
    "robot": RobotData,
    "ship": ShipData,
    "vehicle": VehicleData,
    "space-object": SpaceObjectData
  });
  CONFIG.Item.documentClass = TwodsixItem;
  Object.assign(CONFIG.Item.dataModels, {
    "equipment": GearData,
    "weapon": WeaponData,
    "armor": ArmorData,
    "augment": AugmentData,
    "storage": JunkStorageData,
    "tool": GearData,
    "junk": JunkStorageData,
    "skills": SkillData,
    "spell": SpellData,
    "trait": TraitData,
    "consumable": ConsumableData,
    "component": ComponentData,
    "ship_position": ShipPositionData,
    "computer": ComputerData,
    "psiAbility": PsiAbilityData
  });
  foundry.documents.collections.Items.unregisterSheet("core", foundry.applications.sheets.ItemSheetV2);
  const baseItemTypes = Object.keys(CONFIG.Item.dataModels).filter((ot) => ot !== "ship_position");
  foundry.documents.collections.Items.registerSheet("twodsix", TwodsixItemSheet, { types: baseItemTypes, makeDefault: true, label: "TWODSIX.SheetTypes.ItemSheet" });
  foundry.documents.collections.Items.registerSheet("twodsix", TwodsixShipPositionSheet, { types: ["ship_position"], makeDefault: true, label: "TWODSIX.SheetTypes.ShipPositionSheet" });
  CONFIG.ActiveEffect.documentClass = TwodsixActiveEffect;
  CONFIG.Combatant.documentClass = TwodsixCombatant;
  registerHandlebarsHelpers();
  registerSettings();
  CONFIG.Dice.rolls.push(TwodsixDiceRoll);
  addCustomEnrichers();
  CONFIG.fontDefinitions["Asap"] = {
    editor: true,
    fonts: [
      { urls: ["systems/twodsix/fonts/Asap-Regular.woff2", "systems/twodsix/fonts/Asap-Regular.ttf"] },
      { urls: ["systems/twodsix/fonts/Asap-Bold.woff2", "systems/twodsix/fonts/Asap-Bold.ttf"], weight: 700 },
      { urls: ["systems/twodsix/fonts/Asap-Italic.woff2", "systems/twodsix/fonts/Asap-Italic.ttf"], style: "italic" },
      { urls: ["systems/twodsix/fonts/Asap-BoldItalic.woff2", "systems/twodsix/fonts/Asap-BoldItalic.ttf"], style: "italic", weight: 700 }
    ]
  };
  CONFIG.time.roundTime = 6;
  let sheetName = "systems/twodsix/styles/";
  if (game.settings.get("twodsix", "useFoundryStandardStyle")) {
    sheetName += "twodsix_basic.css";
  } else {
    sheetName += "twodsix.css";
  }
  switchCss(sheetName);
  if (!game.settings.get("twodsix", "useFoundryStandardStyle")) {
    document.documentElement.style.setProperty("--s2d6-default-color", game.settings.get("twodsix", "defaultColor"));
    document.documentElement.style.setProperty("--s2d6-light-color", game.settings.get("twodsix", "lightColor"));
    document.documentElement.style.setProperty("--s2d6-battle-color", game.settings.get("twodsix", "battleColor"));
  }
  document.documentElement.style.setProperty("--s2d6-damage-stat-color", game.settings.get("twodsix", "damageStatColor"));
  if (game.settings.get("twodsix", "useModuleFixStyle") && !game.settings.get("twodsix", "useFoundryStandardStyle")) {
    switchCss("systems/twodsix/styles/twodsix_moduleFix.css");
  }
  await foundry.applications.handlebars.loadTemplates(handlebarsTemplateFiles);
  CONFIG.Item.compendiumIndexFields.push("system.techLevel");
  CONFIG.ui.pause = TwodsixGamePause;
  CONFIG.ui.chat = TwodsixChatLog;
  CONFIG.ChatMessage.popoutClass = TwodsixChatPopout;
  CONFIG.Token.rulerClass = TwodsixTokenRuler;
});
Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag("twodsix");
});

var __defProp$s = Object.defineProperty;
var __name$s = (target, value) => __defProp$s(target, "name", { value, configurable: true });
async function migrate$i() {
  console.log("Reset migration schema version");
}
__name$s(migrate$i, "migrate");

var _2021_12_29_19_02_28_resetMigrationSchemaVersion = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$i
});

var __defProp$r = Object.defineProperty;
var __name$r = (target, value) => __defProp$r(target, "name", { value, configurable: true });
async function mergeContacts(actor) {
  const actorData = actor.system;
  const contacts = actorData.contacts;
  const allies = actorData.allies;
  const enemies = actorData.enemies;
  if (actor.type === "traveller" && (allies || enemies)) {
    let contactAddition = "";
    if (contacts) {
      contactAddition += `Contacts:<br>${contacts}`;
    }
    if (allies) {
      contactAddition += `<br><br>Allies:<br>${allies}`;
    }
    if (enemies) {
      contactAddition += `<br><br>Enemies:<br>${enemies}`;
    }
    await actor.update({ "system.contacts": contactAddition, "system.allies": "", "system.enemies": "" });
  }
  return Promise.resolve();
}
__name$r(mergeContacts, "mergeContacts");
async function migrate$h() {
  await applyToAllActors(mergeContacts);
  return Promise.resolve();
}
__name$r(migrate$h, "migrate");

var _20220103061530MergeContacts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$h
});

var __defProp$q = Object.defineProperty;
var __name$q = (target, value) => __defProp$q(target, "name", { value, configurable: true });
async function adjustMovementUnits(actor) {
  const actorData = actor.system;
  if (actorData.movement?.units) {
    switch (actorData.movement?.units) {
      case "TWODSIX.Actor.Movement.DistFt":
        await actor.update({ "system.movement.units": "ft" });
        break;
      case "TWODSIX.Actor.Movement.DistMi":
        await actor.update({ "system.movement.units": "mi" });
        break;
      case "TWODSIX.Actor.Movement.DistM":
        await actor.update({ "system.movement.units": "m" });
        break;
      case "TWODSIX.Actor.Movement.DistKm":
        await actor.update({ "system.movement.units": "km" });
        break;
      case "TWODSIX.Actor.Movement.DistPc":
        await actor.update({ "system.movement.units": "pc" });
        break;
      case "TWODSIX.Actor.Movement.DistGU":
        await actor.update({ "system.movement.units": "gu" });
        break;
      default:
        console.log("nothing changed");
        break;
    }
  }
  return Promise.resolve();
}
__name$q(adjustMovementUnits, "adjustMovementUnits");
async function migrate$g() {
  await applyToAllActors(adjustMovementUnits);
  return Promise.resolve();
}
__name$q(migrate$g, "migrate");

var _2022_4_27_09_05_00_fix_move_units = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$g
});

var __defProp$p = Object.defineProperty;
var __name$p = (target, value) => __defProp$p(target, "name", { value, configurable: true });
async function refactorConditions(actor) {
  const encumberedEffect = actor.effects.find((eff) => [game.i18n.localize(TWODSIX$1.effectType.encumbered), "Encumbered"].includes(eff.name));
  if (encumberedEffect) {
    const changeData = { key: "system.conditions.encumberedEffect", mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: encumberedEffect.changes[0].value };
    await actor.updateEmbeddedDocuments("ActiveEffect", [{ _id: encumberedEffect.id, changes: [changeData] }]);
  }
  const woundedEffect = actor.effects.find((eff) => [game.i18n.localize(TWODSIX$1.effectType.wounded), "Wounded"].includes(eff.name));
  if (woundedEffect) {
    const changeData = { key: "system.conditions.woundedEffect", mode: CONST.ACTIVE_EFFECT_MODES.ADD, value: woundedEffect.changes[0].value };
    await actor.updateEmbeddedDocuments("ActiveEffect", [{ _id: woundedEffect.id, changes: [changeData] }]);
  }
}
__name$p(refactorConditions, "refactorConditions");
async function migrate$f() {
  await applyToAllActors(refactorConditions);
  return Promise.resolve();
}
__name$p(migrate$f, "migrate");

var _2023_01_20_09_48_00_refactor_conditions = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$f
});

var __defProp$o = Object.defineProperty;
var __name$o = (target, value) => __defProp$o(target, "name", { value, configurable: true });
async function refactorDamageTypes(item) {
  if (["weapon", "armor", "consumable"].includes(item.type)) {
    const damageTypeList = getDamageTypesMigrate();
    if (["weapon", "consumable"].includes(item.type)) {
      const damageType = camelCase(item.system.damageType);
      item.update({ "system.damageType": damageTypeList[damageType] ? damageType : "NONE" });
    } else if (item.type === "armor" && !Array.isArray(item.system.secondaryArmor.protectionTypes)) {
      const protectionArray = [];
      let protectionTypes = item.system.secondaryArmor.protectionTypes.split(",");
      protectionTypes = protectionTypes.map((s) => camelCase(s));
      for (const protType of protectionTypes) {
        if (damageTypeList[protType]) {
          protectionArray.push(protType);
        }
      }
      item.update({ "system.secondaryArmor.protectionTypes": protectionArray });
    }
  }
}
__name$o(refactorDamageTypes, "refactorDamageTypes");
function getDamageTypesMigrate() {
  const returnObject = {};
  let protectionTypeLabels = "Ballistic, Bludgeoning, Corrosive, EMP, Energy, Fire, Laser, Piercing, Plasma, Poison, Psionic, Rad, Slashing, Smoke, Stun".split(",");
  protectionTypeLabels = protectionTypeLabels.map((s) => s.trim());
  for (const type of protectionTypeLabels) {
    Object.assign(returnObject, { [camelCase(type)]: type });
  }
  return returnObject;
}
__name$o(getDamageTypesMigrate, "getDamageTypesMigrate");
async function migrate$e() {
  await applyToAllItems(refactorDamageTypes);
  return Promise.resolve();
}
__name$o(migrate$e, "migrate");

var _2023_04_01_014_41_00_refactor_damageTypes = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$e
});

var __defProp$n = Object.defineProperty;
var __name$n = (target, value) => __defProp$n(target, "name", { value, configurable: true });
async function refactorLinkedEffects(actor) {
  if (["traveller", "animal", "robot"].includes(actor.type)) {
    const itemEffects = actor.effects.filter((eff) => eff.getFlag("twodsix", "sourceId"));
    for (const effect of itemEffects) {
      const linkedItem = await fromUuid(effect.origin);
      if (linkedItem) {
        await linkedItem.effects.contents[0].update({ "transfer": game.settings.get("twodsix", "useItemActiveEffects"), "disabled": false, "sourceLabel": linkedItem.name });
        await effect.delete();
      }
    }
    const woundedEffects = actor.effects.find((eff) => eff.statuses.has("bleeding"));
    if (woundedEffects) {
      woundedEffects.update({ "statuses": ["wounded"] });
    }
  }
}
__name$n(refactorLinkedEffects, "refactorLinkedEffects");
async function refactorItemTransfer(item) {
  if (item.effects.size > 0) {
    for (const effect of item.effects.contents) {
      if (effect.transfer !== game.settings.get("twodsix", "useItemActiveEffects")) {
        await effect.update({ "transfer": game.settings.get("twodsix", "useItemActiveEffects") });
      }
    }
  }
}
__name$n(refactorItemTransfer, "refactorItemTransfer");
async function migrate$d() {
  await applyToAllActors(refactorLinkedEffects);
  await applyToAllItems(refactorItemTransfer);
  return Promise.resolve();
}
__name$n(migrate$d, "migrate");

var _2023_06_21_08_18_refactor_item_effect = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$d
});

var __defProp$m = Object.defineProperty;
var __name$m = (target, value) => __defProp$m(target, "name", { value, configurable: true });
async function radProtectionObject(actor) {
  if (["traveller", "animal", "robot"].includes(actor.type)) {
    if (!isNaN(actor.system.radiationProtection)) {
      actor.update({ "system.radiationProtection": { value: 0 } });
      console.log(`Updating actor[${actor.id}] radiation protection`);
    }
  }
}
__name$m(radProtectionObject, "radProtectionObject");
async function clearBadMessages() {
  for (const messageId of Array.from(game.messages.invalidDocumentIds)) {
    try {
      const badMessage = game.messages.getInvalid(messageId);
      await badMessage.delete();
    } catch (err) {
      console.log(`Bad message [${messageId}] cannot be deleted. ${err}`);
    }
  }
}
__name$m(clearBadMessages, "clearBadMessages");
async function migrate$c() {
  await applyToAllActors(radProtectionObject);
  await clearBadMessages();
  return Promise.resolve();
}
__name$m(migrate$c, "migrate");

var _2023_06_29_14_29_fix_badMigration = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$c
});

var __defProp$l = Object.defineProperty;
var __name$l = (target, value) => __defProp$l(target, "name", { value, configurable: true });
async function migrate$b() {
  for (const settingKey of ["massProductionDiscount", "encumbFractionOneSquare", "encumbFraction75pct"]) {
    if (typeof await game.settings.get("twodsix", settingKey) === "number") {
      const numValue = await game.settings.get("twodsix", settingKey);
      await game.settings.set("twodsix", settingKey, numValue.toString());
      console.log(`Migrated ${numValue} for ${settingKey} to string`);
    }
  }
  return Promise.resolve();
}
__name$l(migrate$b, "migrate");

var _2023_08_09_11_51_fix_fractional_string_settings = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$b
});

var __defProp$k = Object.defineProperty;
var __name$k = (target, value) => __defProp$k(target, "name", { value, configurable: true });
async function refactorSpellSkill(item) {
  if (item.system.associatedSkillName === "" && item.type === "spell") {
    const defaultSkill = await game.settings.get("twodsix", "sorcerySkill") ?? "";
    await item.update({ "system.associatedSkillName": defaultSkill });
  }
}
__name$k(refactorSpellSkill, "refactorSpellSkill");
async function migrate$a() {
  await applyToAllItems(refactorSpellSkill);
  console.log("Associated skill for spells migrated");
  return Promise.resolve();
}
__name$k(migrate$a, "migrate");

var _2023_08_30_12_58_add_associatedSkill_to_spells = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$a
});

var __defProp$j = Object.defineProperty;
var __name$j = (target, value) => __defProp$j(target, "name", { value, configurable: true });
async function checkEquippedState(actor) {
  if (["traveller", "animal", "robot", "ship"].includes(actor.type)) {
    for (const item of actor.items) {
      await checkItemEquippedState(item);
    }
  }
}
__name$j(checkEquippedState, "checkEquippedState");
async function checkItemEquippedState(item) {
  if (!["skills", "trait", "spell", "component", "ship_position", "psiAbility"].includes(item.type)) {
    if (typeof item.system.equipped !== "string") {
      await item.update({ "system.equipped": "backpack" });
      console.log("Migrated " + item.name + (item.actor ? " on " + item.actor.name : ""));
    }
  }
}
__name$j(checkItemEquippedState, "checkItemEquippedState");
async function migrate$9() {
  await applyToAllActors(checkEquippedState);
  const allItems = game.items?.contents ?? [];
  for (const item of allItems) {
    await checkItemEquippedState(item);
  }
  console.log("Equipped States Migrated");
  return Promise.resolve();
}
__name$j(migrate$9, "migrate");

var _2023_09_16_08_232_fix_bad_Equipped_state = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$9
});

var __defProp$i = Object.defineProperty;
var __name$i = (target, value) => __defProp$i(target, "name", { value, configurable: true });
async function migrateFinanceValues(actor) {
  if (["traveller"].includes(actor.type)) {
    const updates = {};
    for (const financeField in actor.system.finances) {
      if (financeField !== "financial-notes") {
        const parsedText = getParsedFinanceText(actor.system.finances[financeField]);
        if (parsedText) {
          const newValue = parseLocaleNumber(parsedText.num) * getMultiplier(parsedText.units);
          Object.assign(updates, { [financeField]: newValue });
        }
      }
    }
    actor.update({ "system.financeValues": updates });
  }
}
__name$i(migrateFinanceValues, "migrateFinanceValues");
async function migrate$8() {
  await applyToAllActors(migrateFinanceValues);
  console.log("Finance Values Migrated");
  return Promise.resolve();
}
__name$i(migrate$8, "migrate");

var _2023_10_21_09_05_add_finance_values = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$8
});

var __defProp$h = Object.defineProperty;
var __name$h = (target, value) => __defProp$h(target, "name", { value, configurable: true });
async function refactorRangeBands(item) {
  if (item.type === "weapon") {
    if (Object.hasOwn(TWODSIX$1.CE_WEAPON_RANGE_TYPES.long, item.system.rangeBand)) {
      return;
    }
    if (item.system.rangeBand.toLowerCase().includes("shotgun") || item.name.toLowerCase().includes("shotgun")) {
      item.update({ "system.rangeBand": "shotgun" });
    } else if (item.system.rangeBand.toLowerCase().includes("pistol") || item.name.toLowerCase().includes("pistol")) {
      item.update({ "system.rangeBand": "pistol" });
    } else if (item.system.rangeBand.toLowerCase().includes("revolver") || item.name.toLowerCase().includes("revolver")) {
      item.update({ "system.rangeBand": "pistol" });
    } else if (item.system.rangeBand.toLowerCase().includes("assualt") || item.name.toLowerCase().includes("assault")) {
      item.update({ "system.rangeBand": "assaultWeapon" });
    } else if (item.system.rangeBand.toLowerCase().includes("machine") || item.name.toLowerCase().includes("machine")) {
      item.update({ "system.rangeBand": "assaultWeapon" });
    } else if (item.system.rangeBand.toLowerCase().includes("rifle") || item.name.toLowerCase().includes("rifle")) {
      item.update({ "system.rangeBand": "rifle" });
    } else if (item.system.rangeBand.toLowerCase().includes("melee") || item.name.toLowerCase().includes("melee")) {
      item.update({ "system.rangeBand": "extendedReach" });
    } else if (item.system.rangeBand.toLowerCase().includes("rocket") || item.name.toLowerCase().includes("rocket")) {
      item.update({ "system.rangeBand": "rocket" });
    } else if (item.system.rangeBand === "" || item.system.rangeBand === "0") {
      item.update({ "system.rangeBand": "closeQuarters" });
    } else {
      item.update({ "system.rangeBand": "none" });
    }
  }
}
__name$h(refactorRangeBands, "refactorRangeBands");
async function migrate$7() {
  await applyToAllItems(refactorRangeBands);
  console.log("Range Band Migration Complete");
  return Promise.resolve();
}
__name$h(migrate$7, "migrate");

var _2023_11_29_13_35_refactor_rangeLabels = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$7
});

var __defProp$g = Object.defineProperty;
var __name$g = (target, value) => __defProp$g(target, "name", { value, configurable: true });
async function refactorMeleeRangeModifier(item) {
  if (item.type === "weapon") {
    if (typeof item.system.meleeRangeModifier === "number") {
      const newString = item.system.meleeRangeModifier.toString();
      item.update({ "system.meleeRangeModifier": newString });
    }
  }
}
__name$g(refactorMeleeRangeModifier, "refactorMeleeRangeModifier");
async function refactorWeapons$1(actor) {
  for (const weapon of actor.itemTypes.weapon) {
    refactorMeleeRangeModifier(weapon);
  }
}
__name$g(refactorWeapons$1, "refactorWeapons");
async function migrate$6() {
  await applyToAllItems(refactorMeleeRangeModifier);
  await applyToAllActors(refactorWeapons$1);
  console.log("Range Modifier Migration Complete");
  return Promise.resolve();
}
__name$g(migrate$6, "migrate");

var _2023_12_30_10_32_refactor_rangeModifier = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$6
});

var __defProp$f = Object.defineProperty;
var __name$f = (target, value) => __defProp$f(target, "name", { value, configurable: true });
async function refactorRange(item) {
  if (item.type === "weapon") {
    if (typeof item.system.range === "number") {
      const newString = item.system.range === 0 ? "" : item.system.range.toString();
      await item.update({ "system.range": newString });
    }
  }
}
__name$f(refactorRange, "refactorRange");
async function refactorWeapons(actor) {
  for (const weapon of actor.itemTypes.weapon) {
    await refactorRange(weapon);
  }
}
__name$f(refactorWeapons, "refactorWeapons");
async function migrate$5() {
  await applyToAllItems(refactorRange);
  await applyToAllActors(refactorWeapons);
  console.log("Range Migration Complete");
  return Promise.resolve();
}
__name$f(migrate$5, "migrate");

var _2024_01_08_17_12_refactor_range = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$5,
  refactorRange: refactorRange
});

var __defProp$e = Object.defineProperty;
var __name$e = (target, value) => __defProp$e(target, "name", { value, configurable: true });
async function convertToNumber(item) {
  const updates = { system: {} };
  migrateLocaleStringToNumber(item, updates, "price");
  migrateLocaleStringToNumber(item, updates, "weight");
  migrateLocaleStringToNumber(item, updates, "purchasePrice");
  migrateLocaleStringToNumber(item, updates, "ammo");
  if (Object.keys(updates.system).length > 0) {
    await item.update(updates);
  }
}
__name$e(convertToNumber, "convertToNumber");
async function convertItemNumbers(actor) {
  for (const item of actor.items.contents) {
    await convertToNumber(item);
  }
}
__name$e(convertItemNumbers, "convertItemNumbers");
async function migrate$4() {
  await applyToAllItems(convertToNumber);
  await applyToAllActors(convertItemNumbers);
  console.log("price, weight, purchasePrice and ammo Migration Complete");
  return Promise.resolve();
}
__name$e(migrate$4, "migrate");
function migrateLocaleStringToNumber(item, updates, field) {
  if (Object.hasOwn(item.system, field)) {
    if (typeof item.system[field] === "string") {
      Object.assign(updates.system, { [field]: parseLocaleNumber(item.system[field]) || 0 });
    }
  }
}
__name$e(migrateLocaleStringToNumber, "migrateLocaleStringToNumber");

var _2024_04_01_08_28_migrate_data = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$4
});

var __defProp$d = Object.defineProperty;
var __name$d = (target, value) => __defProp$d(target, "name", { value, configurable: true });
async function convertAgeToNumber(actor) {
  if (actor.type === "traveller") {
    if (Object.hasOwn(actor.system.age, "value")) {
      if (typeof actor.system.age.value !== "number") {
        await actor.update({ "system.age.value": Number(actor.system.age.value) || 0 });
      }
    }
  }
}
__name$d(convertAgeToNumber, "convertAgeToNumber");
async function applyToInvalid() {
  for (const invalID of game.actors.invalidDocumentIds) {
    const tempActor = await game.actors.getInvalid(invalID);
    await convertAgeToNumber(tempActor);
  }
}
__name$d(applyToInvalid, "applyToInvalid");
async function migrate$3() {
  await applyToAllActors(convertAgeToNumber);
  await applyToInvalid();
  console.log("Age Migration Complete");
  return Promise.resolve();
}
__name$d(migrate$3, "migrate");

var _2024_04_12_12_31_migrate_age = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$3
});

var __defProp$c = Object.defineProperty;
var __name$c = (target, value) => __defProp$c(target, "name", { value, configurable: true });
async function resetActorDisabled(actor) {
  if (["traveller", "animal", "robot"].includes(actor.type)) {
    const applicableEffects = Array.from(actor.allApplicableEffects());
    for (const effect of applicableEffects) {
      if (effect.parent?.documentName === "Item" && (effect.disabled || !effect.transfer)) {
        await effect.update({ "disabled": false, transfer: game.settings.get("twodsix", "useItemActiveEffects") });
      }
    }
  }
}
__name$c(resetActorDisabled, "resetActorDisabled");
async function resetItemDisabled(item) {
  for (const effect of item.effects.contents) {
    if (effect.disabled || !effect.transfer) {
      await effect.update({ "disabled": false, transfer: game.settings.get("twodsix", "useItemActiveEffects") });
    }
  }
}
__name$c(resetItemDisabled, "resetItemDisabled");
async function migrate$2() {
  await applyToAllActors(resetActorDisabled);
  await applyToAllItems(resetItemDisabled);
  console.log("Disabled Migration Complete");
  return Promise.resolve();
}
__name$c(migrate$2, "migrate");

var _2024_07_01_12_28_migrate_disabled = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$2
});

var __defProp$b = Object.defineProperty;
var __name$b = (target, value) => __defProp$b(target, "name", { value, configurable: true });
async function refactorArmorPiercing(item) {
  if (foundry.utils.hasProperty(item.system, "armorPiercing")) {
    if (typeof item.system.armorPiercing === "number") {
      const newString = item.system.armorPiercing === 0 ? "0" : item.system.armorPiercing.toString();
      await item.update({ "system.armorPiercing": newString });
    }
  }
}
__name$b(refactorArmorPiercing, "refactorArmorPiercing");
async function refactorItems(actor) {
  for (const item of actor.items) {
    await refactorArmorPiercing(item);
  }
}
__name$b(refactorItems, "refactorItems");
async function migrate$1() {
  await applyToAllItems(refactorArmorPiercing);
  await applyToAllActors(refactorItems);
  console.log("Armor Piercing Migration Complete");
  return Promise.resolve();
}
__name$b(migrate$1, "migrate");

var _2025_01_20_09_11_refactor_armorPiercing = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate$1
});

var __defProp$a = Object.defineProperty;
var __name$a = (target, value) => __defProp$a(target, "name", { value, configurable: true });
async function refactorCommonFunds(actor) {
  if (actor.type === "ship") {
    if (foundry.utils.hasProperty(actor.system, "commonFunds")) {
      await actor.update({ "system.financeValues": { cash: actor.system.commonFunds * 1e6 } });
    }
  }
}
__name$a(refactorCommonFunds, "refactorCommonFunds");
async function migrate() {
  await applyToAllActors(refactorCommonFunds);
  console.log("Common Funds Migration Complete");
  return Promise.resolve();
}
__name$a(migrate, "migrate");

var _6_2025_05_28_08_09_rename_commonFunds = /*#__PURE__*/Object.freeze({
  __proto__: null,
  migrate: migrate
});

var __defProp$9 = Object.defineProperty;
var __name$9 = (target, value) => __defProp$9(target, "name", { value, configurable: true });
Hooks.on("applyActiveEffect", (actor, change, current) => {
  if (change.mode !== CONST.ACTIVE_EFFECT_MODES.CUSTOM) {
    return;
  }
  if (current == void 0) {
    return;
  }
  let update = 0;
  let operator = "+";
  let changeFormula = change.value;
  if (foundry.utils.getType(changeFormula) !== "string") {
    changeFormula = changeFormula.toString();
  } else {
    changeFormula = changeFormula.trim();
  }
  if (["+", "/", "-", "*", "="].includes(changeFormula[0])) {
    operator = changeFormula[0];
    changeFormula = changeFormula.slice(1);
  }
  const formula = Roll.replaceFormulaData(changeFormula, actor, { missing: "0", warn: false });
  const ct = foundry.utils.getType(current);
  if (Roll.validate(formula)) {
    const r = Roll.safeEval(formula);
    switch (ct) {
      case "string": {
        const currentAsFloat = Number.parseFloat(current);
        if (Number.isInteger(currentAsFloat)) {
          update = calculateUpdate(parseInt(current), parseInt(r), operator, change.key);
        } else {
          update = calculateUpdate(currentAsFloat, r, operator, change.key);
        }
        break;
      }
      case "number": {
        update = calculateUpdate(current, r, operator, change.key);
        break;
      }
    }
  } else if (ct === "string") {
    update = operator === "+" ? current + changeFormula : changeFormula;
  }
  foundry.utils.setProperty(actor, change.key, update);
});
function isArmorKey(key) {
  return key.includes("armor") || key.includes("Armor");
}
__name$9(isArmorKey, "isArmorKey");
function calculateUpdate(current, effectChange, operator, key = "") {
  if (operator === "+" && isArmorKey(key)) {
    return stackArmorValues(current, effectChange);
  }
  switch (operator) {
    case "+":
      return current + effectChange;
    case "-":
      return current - effectChange;
    case "=":
      return effectChange;
    case "*":
      return current * effectChange;
    case "/":
      return current / effectChange;
    default:
      return current;
  }
}
__name$9(calculateUpdate, "calculateUpdate");

var activeEffects = /*#__PURE__*/Object.freeze({
  __proto__: null
});

var __defProp$8 = Object.defineProperty;
var __name$8 = (target, value) => __defProp$8(target, "name", { value, configurable: true });
Hooks.on("getSceneControlButtons", (controls) => {
  if (game.user.isGM) {
    controls.tokens.tools.requestRoll = {
      name: "requestRoll",
      title: "TWODSIX.Chat.Roll.RequestRoll",
      icon: "fa-solid fa-dice",
      button: true,
      visible: game.user.isGM,
      toolclip: {
        src: "systems/twodsix/assets/toolclips/requestRollToolClip.webm",
        heading: "TWODSIX.Chat.Roll.RequestRoll",
        items: foundry.applications.ui.SceneControls.buildToolclipItems([{ paragraph: "TWODSIX.Chat.Roll.RequestRollDescription" }, "selectAlt", "selectMultiple"])
      },
      onChange: /* @__PURE__ */ __name$8(async (event, active) => {
        if (active) {
          await requestRoll();
        }
      }, "onChange")
    };
  }
});
async function requestRoll() {
  const tokenData = getSelectedTokenData();
  const skillsList = getAllSkills();
  const itemsList = getAllRollableItems();
  if (Object.keys(tokenData).length > 0) {
    const selections = await throwDialog(skillsList, itemsList, tokenData);
    if (selections.shouldRoll) {
      selections.userActorList = getUserActorList(selections, tokenData);
      let flavor = `<section>${game.i18n.localize("TWODSIX.Chat.Roll.GMRequestsRoll")}<section>`;
      if (selections.itemId && selections.itemId !== "NONE") {
        flavor = flavor.replace("_TYPE_", itemsList[selections.itemId]);
      } else if (selections.skillName !== "---") {
        flavor = flavor.replace("_TYPE_", selections.skillName);
      } else if (selections.characteristic !== "NONE") {
        flavor = flavor.replace("_TYPE_", selections.characteristic);
      } else {
        flavor = flavor.replace("_TYPE_", game.i18n.localize("TWODSIX.Chat.Roll.normal"));
      }
      flavor += `<section class="card-buttons"><button type="button" data-action="abilityCheck" data-tooltip="${game.i18n.localize("TWODSIX.Chat.Roll.AbilityCheck")}"><i class="fa-solid fa-dice"></i></button><section>`;
      ChatMessage.create({
        flavor,
        flags: {
          twodsix: {
            rollSettings: selections
          }
        },
        whisper: Object.keys(selections.userActorList),
        sound: "sounds/notify.wav"
      });
    }
  }
}
__name$8(requestRoll, "requestRoll");
function getUserActorList(selections, tokenData) {
  const returnData = {};
  for (const tokenId of selections.selectedTokens) {
    if (tokenData[tokenId].userId) {
      if (tokenData[tokenId].userId in returnData) {
        returnData[tokenData[tokenId].userId].push(tokenData[tokenId].token.actor.uuid);
      } else {
        returnData[tokenData[tokenId].userId] = [tokenData[tokenId].token.actor.uuid];
      }
    }
  }
  return returnData;
}
__name$8(getUserActorList, "getUserActorList");
function getAllSkills() {
  const skillList = {};
  let selectedActors = canvas.tokens.controlled.map((t) => t.actor);
  if (selectedActors.length === 0) {
    selectedActors = game.users.filter((user) => !user.isGM && user.active).map((u) => u.character);
  }
  for (const actor of selectedActors) {
    for (const skill of actor.itemTypes.skills) {
      if (!(simplifySkillName(skill.name) in skillList)) {
        Object.assign(skillList, { [simplifySkillName(skill.name)]: skill.name });
      }
    }
  }
  const sortedSkills = sortObj(skillList);
  return { "NONE": "---", ...sortedSkills };
}
__name$8(getAllSkills, "getAllSkills");
function getAllRollableItems() {
  const itemList = {};
  let selectedActors = canvas.tokens.controlled.map((t) => t.actor);
  if (selectedActors.length === 0) {
    selectedActors = game.users.filter((user) => !user.isGM && user.active).map((u) => u.character);
  }
  for (const actor of selectedActors) {
    for (const item of actor.items) {
      if (["weapon", "tool", "equipment", "computer", "augment"].includes(item.type)) {
        if (!(item.name in itemList)) {
          itemList[item.id] = item.name;
        }
      }
    }
  }
  return { "NONE": "---", ...sortObj(itemList) };
}
__name$8(getAllRollableItems, "getAllRollableItems");
async function throwDialog(skillsList, itemsList, tokenData) {
  const template = "systems/twodsix/templates/chat/request-roll-dialog.hbs";
  const tokenNames = {};
  for (const tokenId in tokenData) {
    tokenNames[tokenId] = tokenData[tokenId].token.name ?? tokenData[tokenId].token.actor.name;
  }
  const dialogData = {
    initialTokens: Object.keys(tokenData),
    allTokenNames: tokenNames,
    rollType: "Normal",
    rollTypes: getRollTypeSelectObject(),
    difficulty: "Average",
    difficultyList: getDifficultiesSelectObject(),
    skillsList,
    itemsList,
    showItemList: Object.keys(tokenData).length === 1,
    rollMode: game.settings.get("core", "rollMode"),
    rollModes: CONFIG.Dice.rollModes,
    characteristicList: _genUntranslatedCharacteristicList(),
    initialChoice: "NONE",
    initialSkill: "NONE",
    initialItem: "NONE",
    other: 0
  };
  const returnValue = {};
  const buttons = [
    {
      action: "ok",
      label: "TWODSIX.Chat.Roll.RequestRoll",
      icon: "fa-solid fa-message",
      default: true,
      callback: /* @__PURE__ */ __name$8((event, button, dialog) => {
        const formElements = dialog.element.querySelector(".standard-form").elements;
        returnValue.selectedTokens = formElements["selectedTokens"] ? Array.from(formElements["selectedTokens"].selectedOptions)?.map((({ value }) => value)) : [];
        returnValue.difficulty = TWODSIX$1.DIFFICULTIES[game.settings.get("twodsix", "difficultyListUsed")][formElements["difficulty"]?.value];
        returnValue.rollType = formElements["rollType"]?.value;
        returnValue.rollMode = formElements["rollMode"]?.value;
        returnValue.characteristic = formElements["characteristic"]?.value;
        returnValue.selectedSkill = formElements["selectedSkill"]?.value;
        returnValue.skillName = skillsList[formElements["selectedSkill"]?.value];
        if (dialogData.showItemList) {
          returnValue.itemId = formElements["selectedItem"]?.value;
          returnValue.itemName = itemsList[returnValue.itemId];
        }
        returnValue.shouldRoll = returnValue.selectedTokens.length > 0;
        returnValue.other = parseInt(formElements["other"]?.value || 0);
      }, "callback")
    },
    {
      action: "cancel",
      icon: "fa-solid fa-xmark",
      label: "Cancel",
      callback: /* @__PURE__ */ __name$8(() => {
        returnValue.shouldRoll = false;
      }, "callback")
    }
  ];
  const html = await foundry.applications.handlebars.renderTemplate(template, dialogData);
  await foundry.applications.api.DialogV2.wait({
    window: { title: "TWODSIX.Chat.Roll.RequestRoll", icon: "fa-solid fa-dice" },
    content: html,
    buttons,
    render: handleRender,
    submit: /* @__PURE__ */ __name$8(() => {
      Promise.resolve();
    }, "submit"),
    rejectClose: false
  });
  return returnValue;
}
__name$8(throwDialog, "throwDialog");
function handleRender(ev, htmlRend) {
  const getFormElements = /* @__PURE__ */ __name$8(() => htmlRend.element.querySelector(".standard-form")?.elements, "getFormElements");
  const getSelectedActor = /* @__PURE__ */ __name$8((form) => {
    const tokenId = form["selectedTokens"].selectedOptions[0]?.value;
    return tokenId ? game.canvas.tokens.get(tokenId)?.actor : void 0;
  }, "getSelectedActor");
  const updateFormFields = /* @__PURE__ */ __name$8((form, skill) => {
    form["characteristic"].value = skill?.system.characteristic || "NONE";
    form["difficulty"].value = skill?.system.difficulty || "Average";
    form["rollType"].value = skill?.system.rolltype || "Normal";
    if (skill) {
      form["selectedSkill"].value = simplifySkillName(skill.name) || "NONE";
    }
  }, "updateFormFields");
  const onSkillChange = /* @__PURE__ */ __name$8(() => {
    const form = getFormElements();
    const skillName = form["selectedSkill"]?.value;
    if (skillName && skillName !== "NONE") {
      const actor = getSelectedActor(form);
      const skill = actor?.itemTypes.skills.find((sk) => simplifySkillName(sk.name) === skillName);
      updateFormFields(form, skill);
    } else {
      updateFormFields(form);
    }
  }, "onSkillChange");
  const onItemChange = /* @__PURE__ */ __name$8(() => {
    const form = getFormElements();
    const itemId = form["selectedItem"]?.value;
    if (itemId && itemId !== "NONE") {
      const actor = getSelectedActor(form);
      const item = actor?.items.get(itemId);
      const skill = actor?.items.get(item?.system.skill);
      updateFormFields(form, skill);
    } else {
      updateFormFields(form);
    }
  }, "onItemChange");
  htmlRend.element.querySelector(".select-skill")?.addEventListener("change", onSkillChange);
  htmlRend.element.querySelector(".select-item")?.addEventListener("change", onItemChange);
}
__name$8(handleRender, "handleRender");
function getSelectedTokenData() {
  const returnValue = {};
  const validTokens = canvas.tokens.controlled.filter((t) => ["traveller", "animal", "robot"].includes(t.actor.type));
  for (const token of validTokens) {
    returnValue[token.id] = {
      userId: getControllingUser(token),
      token
    };
  }
  return returnValue;
}
__name$8(getSelectedTokenData, "getSelectedTokenData");
function getControllingUser(token) {
  let userId = "";
  const ownerType = CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
  const owningUsers = game.users.filter((user) => !user.isGM && user.active && token.actor.testUserPermission(user, ownerType));
  if (owningUsers.length > 1) {
    const characterUser = owningUsers.find((user) => user.character.id === token.actor.id);
    if (characterUser) {
      userId = characterUser.id;
    } else {
      const randomSelection = Math.floor(Math.random() * owningUsers.length);
      userId = owningUsers[randomSelection].id;
    }
  } else if (owningUsers.length === 1) {
    userId = owningUsers[0].id;
  } else {
    userId = game.users.find((user) => user.isGM && user.active && token.actor.testUserPermission(user, ownerType))?.id;
    if (!userId) {
      userId = game.users.find((user) => user.isGM && user.active)?.id;
    }
  }
  return userId;
}
__name$8(getControllingUser, "getControllingUser");

var addGMControlButtons = /*#__PURE__*/Object.freeze({
  __proto__: null
});

var __defProp$7 = Object.defineProperty;
var __name$7 = (target, value) => __defProp$7(target, "name", { value, configurable: true });
Hooks.on("aipSetup", (packageConfig) => {
  const api = game.modules.get("autocomplete-inline-properties")?.API;
  if (api) {
    const DATA_MODE = api.CONST.DATA_MODE;
    const config = {
      packageName: "twodsix",
      sheetClasses: [
        {
          name: "ActiveEffectConfig",
          fieldConfigs: [
            {
              selector: `.tab[data-tab="effects"] .key input[type="text"]`,
              defaultpath: "system",
              showButton: true,
              allowHotkey: true,
              dataMode: DATA_MODE.OWNING_ACTOR_DATA
            },
            {
              selector: `.tab[data-tab="effects"] .value input[type="text"]`,
              defaultpath: "system",
              showButton: true,
              allowHotkey: true,
              dataMode: DATA_MODE.OWNING_ACTOR_DATA
            }
          ]
        },
        {
          name: "TwodsixItemSheet",
          fieldConfigs: ["system"].flatMap((key) => [
            {
              selector: `input[type="text"][name="${key}.damage"]`,
              showButton: true,
              allowHotkey: true,
              dataMode: DATA_MODE.OWNING_ACTOR_ROLL_DATA,
              inlinePrefix: "@"
            },
            {
              selector: `input[type="text"][name="${key}.bonusDamage"]`,
              showButton: true,
              allowHotkey: true,
              dataMode: DATA_MODE.OWNING_ACTOR_ROLL_DATA,
              inlinePrefix: "@"
            }
          ])
        },
        {
          name: "AdvancedSettings",
          fieldConfigs: [
            {
              selector: `input[type="text"][name="initiativeFormula"]`,
              showButton: true,
              allowHotkey: true,
              dataMode: DATA_MODE.CUSTOM,
              customDataGetter: /* @__PURE__ */ __name$7(() => _getTravellerData(), "customDataGetter"),
              inlinePrefix: "@"
            },
            {
              selector: `input[type="text"][name="shipInitiativeFormula"]`,
              showButton: true,
              allowHotkey: true,
              dataMode: DATA_MODE.CUSTOM,
              customDataGetter: /* @__PURE__ */ __name$7(() => _getShipData(), "customDataGetter"),
              inlinePrefix: "@"
            },
            {
              selector: `input[type="text"][name="maxEncumbrance"]`,
              showButton: true,
              allowHotkey: true,
              dataMode: DATA_MODE.CUSTOM,
              customDataGetter: /* @__PURE__ */ __name$7(() => _getTravellerData(), "customDataGetter"),
              inlinePrefix: "@"
            },
            {
              selector: `input[type="text"][name="unarmedDamage"]`,
              showButton: true,
              allowHotkey: true,
              dataMode: DATA_MODE.CUSTOM,
              customDataGetter: /* @__PURE__ */ __name$7(() => _getTravellerData(), "customDataGetter"),
              inlinePrefix: "@"
            },
            {
              selector: `input[type="text"][name="armorDamageFormula"]`,
              showButton: true,
              allowHotkey: true,
              dataMode: DATA_MODE.CUSTOM,
              customDataGetter: /* @__PURE__ */ __name$7(() => _getArmorData(), "customDataGetter"),
              inlinePrefix: "@"
            }
          ]
        }
        // Add more sheet classes if necessary
      ]
    };
    packageConfig.push(config);
  }
});
function _getTravellerData() {
  const returnObject = CONFIG.Actor.dataModels.traveller.schema.getInitialValue();
  const characteristicList = returnObject.characteristics;
  Object.assign(returnObject, { characteristics: {} });
  for (const char of Object.keys(characteristicList)) {
    Object.assign(returnObject.characteristics, { [char]: { mod: 0 } });
  }
  Object.assign(returnObject, { skills: {} });
  return returnObject;
}
__name$7(_getTravellerData, "_getTravellerData");
function _getShipData() {
  const returnObject = CONFIG.Actor.dataModels.ship.schema.getInitialValue();
  return returnObject;
}
__name$7(_getShipData, "_getShipData");
function _getArmorData() {
  const returnObject = _getTravellerData();
  Object.assign(returnObject, { damage: "", effectiveArmor: "" });
  return returnObject;
}
__name$7(_getArmorData, "_getArmorData");

var autoCompleteIntegration = /*#__PURE__*/Object.freeze({
  __proto__: null
});

var diceTrayIntegration = /*#__PURE__*/Object.freeze({
  __proto__: null
});

var __defProp$6 = Object.defineProperty;
var __name$6 = (target, value) => __defProp$6(target, "name", { value, configurable: true });
Hooks.once("dragRuler.ready", (SpeedProvider) => {
  const _TwodsixSpeedProvider = class _TwodsixSpeedProvider extends SpeedProvider {
    get colors() {
      return [
        { id: "walk", default: 65280, name: "TWODSIX.speeds.walk" },
        { id: "dash", default: 16776960, name: "TWODSIX.speeds.dash" },
        { id: "run", default: 16744448, name: "TWODSIX.speeds.run" },
        { id: "jump", default: 65280, name: "TWODSIX.speeds.jump" }
      ];
    }
    getRanges(token) {
      const actor = token.actor;
      const actorType = actor.type;
      const rulesSet = game.settings.get("twodsix", "ruleset");
      let movementSpeed = 0;
      if (actorType === "ship") {
        movementSpeed = token.actor.system.shipStats.drives.jDrive.rating;
        if (token.scene.grid.units === "pc") {
          return [
            { range: movementSpeed, color: "jump" }
          ];
        } else {
          return [];
        }
      } else if (actorType === "vehicle") {
        return [];
      } else if (["traveller", "animal", "robot"].includes(actorType)) {
        movementSpeed = token.actor.system.movement.walk;
        const actorData = actor.system;
        switch (rulesSet) {
          case "CEATOM":
          case "BARBARIC":
            if (actorData.encumbrance.value > actorData.encumbrance.max && game.settings.get("twodsix", "useEncumbrance")) {
              return [];
            } else if (actorData.encumbrance.value > actorData.encumbrance.max / 2 && game.settings.get("twodsix", "useEncumbrance")) {
              movementSpeed *= 0.5;
            }
            return [
              { range: movementSpeed, color: "walk" },
              { range: movementSpeed * 2, color: "dash" }
            ];
          case "CD":
          case "CEL":
          case "CLU":
          case "CDEE":
          case "AC":
            if (actorData.encumbrance.value > actorData.encumbrance.max && game.settings.get("twodsix", "useEncumbrance")) {
              return [];
            } else if (actorData.encumbrance.value > actorData.encumbrance.max / 3 && game.settings.get("twodsix", "useEncumbrance")) {
              return [
                { range: movementSpeed, color: "walk" }
              ];
            } else {
              return [
                { range: movementSpeed, color: "walk" },
                { range: movementSpeed * 2, color: "dash" }
              ];
            }
          case "CE":
            if (actorData.encumbrance.value > actorData.encumbrance.max && game.settings.get("twodsix", "useEncumbrance")) {
              return [];
            } else if (actorData.encumbrance.value > actorData.encumbrance.max / 2 && game.settings.get("twodsix", "useEncumbrance")) {
              return [
                { range: 1.5, color: "walk" }
              ];
            } else if (actorData.encumbrance.value > actorData.encumbrance.max / 6 && game.settings.get("twodsix", "useEncumbrance")) {
              movementSpeed *= 0.75;
            }
            return [
              { range: movementSpeed, color: "walk" },
              { range: movementSpeed * 2, color: "dash" },
              { range: movementSpeed * 3, color: "run" }
            ];
          case "OTHER":
            if (actorData.encumbrance.value > actorData.encumbrance.max && game.settings.get("twodsix", "useEncumbrance")) {
              return [];
            } else if (actorData.encumbrance.value > actorData.encumbrance.max * parseFloat(game.settings.get("twodsix", "encumbFractionOneSquare")) && game.settings.get("twodsix", "useEncumbrance")) {
              return [
                { range: 1.5, color: "walk" }
              ];
            } else if (actorData.encumbrance.value > actorData.encumbrance.max * parseFloat(game.settings.get("twodsix", "encumbFraction75pct")) && game.settings.get("twodsix", "useEncumbrance")) {
              movementSpeed *= 0.75;
            }
            return [
              { range: movementSpeed, color: "walk" },
              { range: movementSpeed * 2, color: "dash" },
              { range: movementSpeed * 3, color: "run" }
            ];
          case "CU":
            if (actorData.encumbrance.value > actorData.encumbrance.max && game.settings.get("twodsix", "useEncumbrance")) {
              return [];
            } else {
              return [
                { range: movementSpeed, color: "walk" },
                { range: movementSpeed * 2, color: "dash" },
                { range: movementSpeed * 3, color: "run" }
              ];
            }
          case "CEQ":
          case "CEFTL":
          case "CT":
          //NEED TO CHECK THIS
          default:
            return [
              { range: movementSpeed, color: "walk" },
              { range: movementSpeed * 2, color: "dash" }
            ];
        }
      } else {
        return [];
      }
    }
  };
  __name$6(_TwodsixSpeedProvider, "TwodsixSpeedProvider");
  let TwodsixSpeedProvider = _TwodsixSpeedProvider;
  dragRuler.registerSystem("twodsix", TwodsixSpeedProvider);
});

var dragRulerIntegration = /*#__PURE__*/Object.freeze({
  __proto__: null
});

var __defProp$5 = Object.defineProperty;
var __name$5 = (target, value) => __defProp$5(target, "name", { value, configurable: true });
Hooks.on("dropCanvasData", (canvasObject, dropData) => {
  if ((["damageItem", "ActiveEffect", "Folder", "ItemList"].includes(dropData.type) || dropData.type === "Item" && !game.modules.get("item-piles")?.active) && game.settings.get("twodsix", "allowDropOnIcon")) {
    catchDrop(canvasObject, dropData).then();
    return false;
  }
});
async function catchDrop(canvasObject, dropData) {
  const foundTokens = getTokensAtLocation(canvasObject, dropData.x, dropData.y);
  if (foundTokens?.length === 0 || !foundTokens) {
    ui.notifications?.info("TWODSIX.Warnings.NoTargetFound", { localize: true });
    return false;
  } else if (foundTokens.length === 1) {
    const targetActor = foundTokens[0]?.actor;
    if (targetActor?.isOwner) {
      switch (dropData.type) {
        case "damageItem":
          return targetActor.handleDamageData(dropData.payload, !game.settings.get("twodsix", "autoDamageTarget"));
        case "Item": {
          const droppedItem = await getDocFromDropData(dropData);
          return await targetActor.handleDroppedItem(droppedItem);
        }
        case "ActiveEffect": {
          const droppedEffect = await fromUuid(dropData.uuid);
          return await targetActor.handleDroppedActiveEffect(droppedEffect);
        }
        case "Folder": {
          const folder = await fromUuid(dropData.uuid);
          return targetActor.handleDroppedFolder(folder);
        }
        case "ItemList": {
          return targetActor.handleDroppedList(dropData.parseString);
        }
        default: {
          ui.notifications.warn("TWODSIX.Warnings.CantDropOnToken", { localize: true });
          return false;
        }
      }
    } else {
      ui.notifications?.warn("TWODSIX.Warnings.LackPermissionToDamage", { localize: true });
      return false;
    }
  } else if (foundTokens.length > 1) {
    ui.notifications?.warn("TWODSIX.Warnings.MultipleActorsFound", { localize: true });
    return false;
  }
}
__name$5(catchDrop, "catchDrop");
function getTokensAtLocation(canvasObject, x, y) {
  const controllable = canvasObject.tokens?.placeables.filter((obj) => obj.visible && obj.actor && obj.control instanceof Function);
  const foundTokens = controllable?.filter((obj) => {
    return Number.between(x, obj.x, obj.x + obj.w) && Number.between(y, obj.y, obj.y + obj.h);
  });
  return foundTokens;
}
__name$5(getTokensAtLocation, "getTokensAtLocation");

var dropItemOnToken = /*#__PURE__*/Object.freeze({
  __proto__: null
});

var __defProp$4 = Object.defineProperty;
var __name$4 = (target, value) => __defProp$4(target, "name", { value, configurable: true });
const _HealingAttribute = class _HealingAttribute {
  constructor(characteristic, actor) {
    this.healing = 0;
    if (actor.type !== "ship") {
      this.original = actor.system.characteristics[characteristic];
    }
  }
  newCurrent() {
    return this.original.current + this.healing;
  }
  newMod() {
    return calcModFor(this.newCurrent());
  }
  newDamage() {
    return this.current.damage - this.healing;
  }
};
__name$4(_HealingAttribute, "HealingAttribute");
let HealingAttribute = _HealingAttribute;
const _Stats = class _Stats {
  constructor(actor, healingValue, dice = []) {
    this.edited = false;
    this.damageCharacteristics = [];
    this.useLifebloodStamina = false;
    this.useLifebloodEndurance = false;
    this.useLifebloodOnly = false;
    this.strength = new HealingAttribute("strength", actor);
    this.dexterity = new HealingAttribute("dexterity", actor);
    this.endurance = new HealingAttribute("endurance", actor);
    this.stamina = new HealingAttribute("stamina", actor);
    this.lifeblood = new HealingAttribute("lifeblood", actor);
    this.actor = actor;
    this.healingValue = healingValue;
    this.dice = dice;
    this.damageCharacteristics = getDamageCharacteristics(this.actor.type);
    if (game.settings.get("twodsix", "animalsUseHits") && actor.type === "animal" || game.settings.get("twodsix", "robotsUseHits") && actor.type === "robot") {
      this.useLifebloodStamina = false;
      this.useLifebloodEndurance = false;
      this.useLifebloodOnly = true;
    } else if (game.settings.get("twodsix", "lifebloodInsteadOfCharacteristics")) {
      this.useLifebloodStamina = false;
      this.useLifebloodEndurance = true;
      this.useLifebloodOnly = false;
    } else if (game.settings.get("twodsix", "showLifebloodStamina")) {
      this.useLifebloodStamina = true;
      this.useLifebloodEndurance = false;
      this.useLifebloodOnly = false;
    }
    this.increaseStats();
  }
  totalAppliedHealing() {
    let retValue = 0;
    for (const characteristic of this.damageCharacteristics) {
      retValue += this[characteristic].healing;
    }
    return retValue;
  }
  maxHealing() {
    return this.healingValue;
  }
  totalNewCurrent() {
    let retValue = 0;
    for (const characteristic of this.damageCharacteristics) {
      retValue += this[characteristic].newCurrent();
    }
    return retValue;
  }
  setInitialHealing(healingValue) {
    this.healingValue = healingValue;
    if (!this.edited) {
      this.increaseStats();
    }
  }
  unallocatedHealing() {
    return this.maxHealing() - this.totalAppliedHealing();
  }
  updateActor() {
    this.actor.prepareData();
    for (const characteristic of this.damageCharacteristics) {
      this[characteristic].original = this.actor.system.characteristics[characteristic];
    }
    if (!this.edited) {
      this.increaseStats();
    }
  }
  increaseStats() {
    let remaining = this.maxHealing();
    for (const characteristic of this.damageCharacteristics) {
      this[characteristic].healing = 0;
      if (remaining > 0) {
        if (remaining <= this[characteristic].original.damage) {
          this[characteristic].healing = remaining;
          remaining = 0;
        } else {
          remaining -= this[characteristic].original.damage;
          this[characteristic].healing = this[characteristic].original.damage;
        }
      }
    }
  }
  async applyHealing() {
    let charName = "";
    const charArray = {};
    for (const characteristic of this.damageCharacteristics) {
      charName = "system.characteristics." + characteristic + ".damage";
      charArray[charName] = Math.clamp(this[characteristic].original.damage - this[characteristic].healing, 0, this[characteristic].original.value);
    }
    await this.actor.update(charArray);
    if (this.actor.sheet?.rendered) {
      this.actor.sheet.render({ force: false });
    }
  }
};
__name$4(_Stats, "Stats");
let Stats = _Stats;
const _HealingDialogHandler = class _HealingDialogHandler {
  constructor(stats) {
    this.hooks = {};
    this.stats = stats;
    this.hooks["updateActor"] = Hooks.on("updateActor", this.hookUpdate.bind(this));
    this.hooks["updateToken"] = Hooks.on("updateToken", this.hookUpdate.bind(this));
  }
  hookUpdate() {
    this.stats.updateActor();
    this.refresh();
  }
  setHtml(html) {
    this.html = html.element;
    this.registerEventListeners();
    this.refresh();
  }
  refresh() {
    for (const characteristic of this.stats.damageCharacteristics) {
      const chrHtml = this.html.querySelector(`.${characteristic}`);
      const stat = this.stats[characteristic];
      if (chrHtml) {
        if (!this.stats.edited) {
          chrHtml.querySelector(`.healing-input`).value = stat.healing;
        }
        if (characteristic === this.stats.damageCharacteristics[0] && stat.newCurrent() !== stat.original.value && this.stats.healingValue - stat.healing > 0) {
          if (!chrHtml.querySelector(`.healing-input`)?.classList.contains("orange-border")) {
            chrHtml.querySelector(`.healing-input`)?.classList.add("orange-border");
          }
        } else {
          chrHtml.querySelector(`.healing-input`)?.classList.remove("orange-border");
        }
        chrHtml.querySelector(`.original-value`).innerHTML = stat.original.value.toString();
        chrHtml.querySelector(`.original-current`).innerHTML = stat.original.current.toString();
        chrHtml.querySelector(`.result-value`).innerHTML = stat.newCurrent().toString();
        if (chrHtml.querySelector(`.current-mod`)) {
          chrHtml.querySelector(`.current-mod`).innerHTML = stat.original.mod.toString();
        }
        if (chrHtml.querySelector(`.mod`)) {
          chrHtml.querySelector(`.mod`).innerHTML = stat.newMod().toString();
        }
      }
    }
    if (this.stats.unallocatedHealing() !== 0) {
      this.html.querySelector(".unalocated-healing-text")?.classList.add("orange");
    } else {
      this.html.querySelector(".unalocated-healing-text")?.classList.remove("orange");
    }
    this.html.querySelector(".unalocated-healing").innerHTML = this.stats.unallocatedHealing().toString();
  }
  registerEventListeners() {
    this.html.querySelectorAll(".healing-input")?.forEach((el) => {
      el.addEventListener("input", (ev) => {
        const value = this.getNumericValueFromEvent(ev, true);
        const stat = this.stats[ev.currentTarget.dataset.stat];
        this.stats.edited = true;
        stat.healing = Math.clamp(value, 0, stat.original.damage);
        this.refresh();
      });
    });
  }
  getNumericValueFromEvent(ev, upper) {
    const value = parseInt(ev.currentTarget.value, 10);
    const newVal = isNaN(value) ? 0 : value;
    if (newVal < 0) {
      ui.notifications.warn("TWODSIX.Warnings.StatValBelowZero", { localize: true });
      ev.currentTarget.value = 0;
      return 0;
    }
    if (upper) {
      const stat = this.stats[ev.currentTarget.dataset.stat];
      const currentDamage = stat.original.damage;
      if (value > currentDamage) {
        ev.currentTarget.value = currentDamage;
        ui.notifications.warn("TWODSIX.Warnings.MaxStatVal", { localize: true });
        return currentDamage;
      }
    }
    return newVal;
  }
  unRegisterListeners() {
    Object.entries(this.hooks).forEach(([hookName, hook]) => Hooks.off(hookName, hook));
  }
};
__name$4(_HealingDialogHandler, "HealingDialogHandler");
let HealingDialogHandler = _HealingDialogHandler;
async function renderHealingDialog(healingeData) {
  const { healingId, healingValue, dice } = healingeData;
  let actor = healingeData.actor;
  if (!actor.uuid) {
    actor = await fromUuid(healingeData.targetUuid);
  }
  const actorUsersNonGM = game.users?.filter((user) => user.active && actor && actor.testUserPermission(user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) && !user.isGM) || null;
  if (game.user?.isGM && actorUsersNonGM?.length > 0 || !game.user?.isGM && !actor.isOwner) {
    return;
  }
  const template = "systems/twodsix/templates/actors/healing-dialog.hbs";
  const stats = new Stats(actor, healingValue, dice);
  const healingDialogHandler = new HealingDialogHandler(stats);
  const renderedHtml = await foundry.applications.handlebars.renderTemplate(template, { stats: healingDialogHandler.stats });
  const title = game.i18n.format("TWODSIX.Healing.ApplyHealingTo", { actorName: actor.name });
  await foundry.applications.api.DialogV2.wait({
    window: {
      title,
      icon: "fa-solid fa-heart-circle-plus"
    },
    content: renderedHtml,
    buttons: [
      {
        action: "ok",
        label: "TWODSIX.Healing.ApplyHealing",
        icon: "fa-solid fa-kit-medical",
        default: true,
        callback: /* @__PURE__ */ __name$4(() => {
          stats.edited = true;
          stats.applyHealing();
          game.socket?.emit("system.twodsix", ["destroyHealingDialog", healingId]);
          Hooks.call("destroyHealingDialog", healingId);
        }, "callback")
      },
      {
        action: "cancel",
        icon: "fa-solid fa-xmark",
        label: "Cancel",
        callback: /* @__PURE__ */ __name$4(() => {
        }, "callback")
      }
    ],
    close: /* @__PURE__ */ __name$4(() => healingDialogHandler.unRegisterListeners(), "close"),
    render: /* @__PURE__ */ __name$4((ev, html) => {
      healingDialogHandler.setHtml(html);
    }, "render"),
    rejectClose: false
  }, { id: healingId });
}
__name$4(renderHealingDialog, "renderHealingDialog");
function destroyHealingDialog(healingId) {
  Object.values(ui.windows).forEach((foundryWindow) => {
    if (foundryWindow instanceof Dialog && foundryWindow.id === healingId) {
      foundryWindow.close();
    }
  });
}
__name$4(destroyHealingDialog, "destroyHealingDialog");

Hooks.on("createDamageDialog", renderDamageDialog);
Hooks.on("destroyDamageDialog", destroyDamageDialog);
Hooks.on("createHealingDialog", renderHealingDialog);
Hooks.on("destroyHealingDialog", destroyHealingDialog);

var hooks = /*#__PURE__*/Object.freeze({
  __proto__: null
});

Hooks.once("item-piles-ready", async function() {
  game.itempiles.API.addSystemIntegration({
    "VERSION": "4.1.2",
    // The actor class type is the type of actor that will be used for the default item pile actor that is created on first item drop.
    "ACTOR_CLASS_TYPE": "traveller",
    // The item quantity attribute is the path to the attribute on items that denote how many of that item that exists
    "ITEM_QUANTITY_ATTRIBUTE": "system.quantity",
    // The item price attribute is the path to the attribute on each item that determine how much it costs
    "ITEM_PRICE_ATTRIBUTE": "system.price",
    // Item filters actively remove items from the item pile inventory UI that users cannot loot, such as spells, feats, and classes
    "ITEM_FILTERS": [
      {
        "path": "type",
        "filters": "skills,trait,spell,ship_position,psiAbility"
      },
      {
        "path": "name",
        "filters": game.i18n.localize("TWODSIX.Items.Weapon.Unarmed")
      }
    ],
    "PILE_DEFAULTS": {
      "merchantColumns": [{
        "label": "TWODSIX.Actor.Items.TL",
        "path": "system.techLevel",
        "formatting": "{#}",
        "mapping": {}
      }]
    },
    // Item similarities determines how item piles detect similarities and differences in the system
    "ITEM_SIMILARITIES": ["name", "type", "techLevel"],
    // Currencies in item piles is a versatile system that can accept actor attributes (a number field on the actor's sheet) or items (actual items in their inventory)
    // In the case of attributes, the path is relative to the "actor.system"
    // In the case of items, it is recommended you export the item with `.toObject()` and strip out any module data
    "CURRENCIES": [
      {
        type: "attribute",
        name: "TWODSIX.Credits",
        img: "systems/twodsix/assets/icons/id-card.svg",
        abbreviation: "Cr {#}",
        data: {
          path: "system.financeValues.cash"
        },
        primary: true,
        exchangeRate: 1
      }
    ],
    "CURRENCY_DECIMAL_DIGITS": 0.01
    /*"CSS_VARIABLES": {
      "even-color": "#00000080",
      "odd-color": "#00000000",
    }*/
  });
});

var itemPilesIntegration = /*#__PURE__*/Object.freeze({
  __proto__: null
});

var __defProp$3 = Object.defineProperty;
var __name$3 = (target, value) => __defProp$3(target, "name", { value, configurable: true });
function createItemMacro(dropData, slot) {
  if (dropData.type === "Item") {
    addItemMacro(dropData, slot).then();
    return false;
  }
}
__name$3(createItemMacro, "createItemMacro");
async function addItemMacro(dropData, slot) {
  const item = await fromUuid(dropData.uuid);
  if (item?.id) {
    if (dropData.type === "Macro") {
      await game.user?.assignHotbarMacro(game.macros?.get(item.id) || null, slot);
    } else {
      let itemName = "";
      let img = "";
      let command = "";
      if (dropData.type === "Item") {
        itemName = item.name || "";
        command = `game.twodsix.rollItemMacro("${item.id ? item.id : item._id}", "${itemName}");`;
        img = item.img || foundry.documents.BaseMacro.DEFAULT_ICON;
        if (itemName === "") {
          const origItem = game.items?.get(item.id);
          itemName = origItem?.name || "???";
          img = origItem?.img || foundry.documents.BaseMacro.DEFAULT_ICON;
        }
      } else if (dropData.type === "RollTable") {
        const newTable = game.tables?.get(item.id);
        if (newTable) {
          itemName = newTable.name || "???";
          img = newTable.img || foundry.documents.BaseMacro.DEFAULT_ICON;
          command = `game.tables.get("${item.id}").draw();`;
        }
      } else {
        return;
      }
      let macro = game.macros?.getName(itemName);
      if (!macro) {
        macro = await Macro.create({
          command,
          name: itemName,
          type: "script",
          img,
          flags: { "twodsix.itemMacro": true }
        }, { renderSheet: false });
      } else {
        if (macro.command !== command) {
          if (await foundry.applications.api.DialogV2.confirm({
            window: { title: game.i18n.localize("TWODSIX.Dialogs.ReplaceMacroCommand") },
            content: game.i18n.localize("TWODSIX.Warnings.MacroNameExists")
          })) {
            await macro.update({ command });
          }
        }
        if (Object.values(game.user.hotbar).includes(macro.id) && game.settings.get("twodsix", "NoDuplicatesOnHotbar")) {
          return;
        }
      }
      await game.user?.assignHotbarMacro(macro, slot);
    }
  }
}
__name$3(addItemMacro, "addItemMacro");

var __defProp$2 = Object.defineProperty;
var __name$2 = (target, value) => __defProp$2(target, "name", { value, configurable: true });
Hooks.once("ready", async function() {
  if (game.modules.get("combat-utility-belt")?.active) {
    if (game.settings.get("combat-utility-belt", "removeDefaultEffects")) {
      game.settings.set("combat-utility-belt", "removeDefaultEffects", false);
    }
  }
  if (game.settings.get("twodsix", "damageTypeOptions") === "" && game.settings.get("twodsix", "ruleset") !== "CU") {
    game.settings.set("twodsix", "damageTypeOptions", game.i18n.localize("TWODSIX.Settings.defaultDamageOptions"));
  }
  if (!Roll.validate(game.settings.get("twodsix", "maxEncumbrance"))) {
    ui.notifications.warn("TWODSIX.Warnings.EncumbranceFormulaInvalid", { localize: true });
  }
  let worldVersion = game.settings.get("twodsix", "systemMigrationVersion");
  if (worldVersion == "null" || worldVersion == null) {
    worldVersion = "";
  }
  if (game.users.activeGM?.isSelf) {
    await migrateWorld(worldVersion);
  }
  if (game.users.activeGM?.isSelf) {
    await applyToAllActors(async (actor) => {
      await correctMissingUntrainedSkill(actor);
    });
  }
  if (game.users.activeGM?.isSelf) {
    if (game.release.build < 306) {
      await applyToAllActors(toggleTokenEffect);
    }
  }
  game.socket?.on("system.twodsix", (data) => {
    Hooks.call(data[0], ...data.slice(1));
  });
  Hooks.on("hotbarDrop", (_bar, data, slot) => createItemMacro(data, slot));
  if (game.settings.get("twodsix", "reduceStatusIcons")) {
    updateStatusIcons();
  }
  switch (game.settings.get("core", "language")) {
    case "en":
      break;
    case "es":
      switchCss("systems/twodsix/styles/twodsix_es_changes.css");
      break;
    case "de":
      switchCss("systems/twodsix/styles/twodsix_de_changes.css");
      break;
    case "sv":
      switchCss("systems/twodsix/styles/twodsix_sv_changes.css");
      break;
    case "fr":
      switchCss("systems/twodsix/styles/twodsix_fr_changes.css");
      break;
  }
  if (game.settings.get("twodsix", "showTLonItemsTab")) {
    setDocumentPartials();
  }
  const uiSettings = foundry.utils.duplicate(game.settings.get("core", "uiConfig"));
  const useStandardStyle = game.settings.get("twodsix", "useFoundryStandardStyle");
  uiSettings.colorScheme.applications = useStandardStyle ? "light" : "dark";
  uiSettings.colorScheme.interface = useStandardStyle ? "light" : "dark";
  await game.settings.set("core", "uiConfig", uiSettings);
  for (const pack of game.packs) {
    if (pack.metadata.type === "Item") {
      pack.getIndex({ fields: ["system.techLevel"] });
    }
  }
  generateTargetDMObject();
  if (game.settings.get("twodsix", "chainBonus") === "") {
    const ruleset = game.settings.get("twodsix", "ruleset");
    const rulesetChainBonus = TWODSIX$1.RULESETS[ruleset]?.settings.chainBonus;
    game.settings.set("twodsix", "chainBonus", rulesetChainBonus ?? "");
  }
});
async function toggleTokenEffect(actor) {
  if (!actor.inCompendium) {
    await toggleFirstActiveEffect(actor, true);
  }
}
__name$2(toggleTokenEffect, "toggleTokenEffect");
async function toggleFirstActiveEffect(actor, isToken) {
  if (actor.isToken === isToken && actor.isOwner) {
    const actorEffects = Array.from(actor.allApplicableEffects());
    if (actorEffects.length > 0) {
      await actorEffects[0].update({ "disabled": !actorEffects[0].disabled });
      await actorEffects[0].update({ "disabled": !actorEffects[0].disabled });
    }
  }
}
__name$2(toggleFirstActiveEffect, "toggleFirstActiveEffect");

var ready = /*#__PURE__*/Object.freeze({
  __proto__: null
});

Hooks.on("renderChatMessageHTML", (app, htmlElement) => {
  const damageMessage = htmlElement.querySelector(".damage-message");
  if (damageMessage) {
    damageMessage.setAttribute("draggable", "true");
    damageMessage.addEventListener("dragstart", (ev) => {
      return ev.dataTransfer?.setData("text/plain", app.getFlag("twodsix", "transfer"));
    });
  }
  const diceTotal = htmlElement.querySelector(".dice-total");
  if (!damageMessage && diceTotal?.textContent.length > 0 && app.isContentVisible) {
    const effect = app.getFlag("twodsix", "effect");
    if (!isNaN(Number(effect))) {
      const sumString = game.i18n.localize("TWODSIX.Rolls.sum").capitalize();
      const effectString = game.i18n.localize("TWODSIX.Rolls.Effect");
      let diceTotalText = `${sumString}: ${diceTotal.textContent} ${effectString}: ${effect}
`;
      if (game.settings.get("twodsix", "useDegreesOfSuccess") !== "none" && app.getFlag("twodsix", "degreeOfSuccess") !== "" && app.getFlag("twodsix", "degreeOfSuccess")) {
        diceTotalText += `${app.getFlag("twodsix", "degreeOfSuccess")}
`;
      }
      if (game.settings.get("twodsix", "showTimeframe") && app.getFlag("twodsix", "timeframe") !== "" && app.getFlag("twodsix", "timeframe")) {
        const timeframe = app.getFlag("twodsix", "timeframe");
        const timeString = game.i18n.localize("TWODSIX.Rolls.Timeframe");
        diceTotalText += `${timeString}: ${timeframe}
`;
      }
      diceTotal.textContent = diceTotalText;
    }
    const crit = app.getFlag("twodsix", "crit");
    if (crit && crit == Crit.success) {
      diceTotal.classList.add("crit-success-roll");
    } else if (crit && crit == Crit.fail) {
      diceTotal.classList.add("crit-fail-roll");
    }
  }
});

var renderChatMessage = /*#__PURE__*/Object.freeze({
  __proto__: null
});

var __defProp$1 = Object.defineProperty;
var __name$1 = (target, value) => __defProp$1(target, "name", { value, configurable: true });
async function createWarningDialog(event, message) {
  event.preventDefault();
  event.stopPropagation();
  const currentTarget = event.currentTarget;
  if (currentTarget) {
    if (await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("TWODSIX.Settings.hideUntrainedSkills.warning") },
      content: message
    })) {
      currentTarget["checked"] = !currentTarget["checked"];
    }
  }
}
__name$1(createWarningDialog, "createWarningDialog");
Hooks.on("updateSetting", async (setting) => {
  const ruleset = game.settings.get("twodsix", "ruleset");
  if (Object.keys(TWODSIX$1.RULESETS[ruleset].settings).includes(setting.key.slice(8))) {
    if (game.settings.sheet.rendered) {
      game.settings.sheet.render({ force: true });
    }
  }
});
Hooks.on("renderAdvancedSettings", async (app, htmlElement) => {
  const ruleset = game.settings.get("twodsix", "ruleset");
  const rulesetSettings = TWODSIX$1.RULESETS[ruleset].settings;
  Object.entries(rulesetSettings).forEach(([settingName, value]) => {
    let el = htmlElement.querySelector(`[name="${settingName}"]`);
    if (el) {
      const isChanged = game.settings.get("twodsix", settingName) !== value;
      if (el.type === "checkbox") {
        el = el.parentNode;
      }
      el.style.border = isChanged ? "1px solid orange" : "1px solid green";
    }
  });
});
Hooks.on("renderSettingsConfig", async (app, html) => {
  const htmlElement = html instanceof jQuery ? html.get(0) : html;
  const ruleset = game.settings.get("twodsix", "ruleset");
  const rulesetSettings = TWODSIX$1.RULESETS[ruleset].settings;
  const settings = Object.entries(rulesetSettings).map(([settingName, value]) => {
    return game.settings.get("twodsix", settingName) === value;
  });
  if (!settings.every((v) => v)) {
    const modified = game.i18n.localize("TWODSIX.Settings.settingsInterface.rulesetSettings.modified");
    const selectedRuleset = htmlElement.querySelector(`[name="twodsix.ruleset"] option[value="${ruleset}"]`);
    selectedRuleset.textContent = `${TWODSIX$1.RULESETS[ruleset].name} (${modified})`;
    selectedRuleset.classList.add("modified-ruleset");
    const newOption = document.createElement("option");
    newOption.value = `${ruleset}`;
    newOption.text = `${TWODSIX$1.RULESETS[ruleset].name}`;
    selectedRuleset.after(newOption);
  }
  htmlElement.querySelector('[name="twodsix.ruleset"]')?.addEventListener("change", async (ev) => {
    if (await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("TWODSIX.Dialogs.rulesetChange.title") },
      content: game.i18n.localize("TWODSIX.Dialogs.rulesetChange.content")
    })) {
      const newRuleset = ev.target.value;
      const newRulesetSettings = TWODSIX$1.RULESETS[newRuleset].settings;
      await game.settings.set("twodsix", "ruleset", newRuleset);
      Object.entries(newRulesetSettings).forEach(([settingName, value]) => {
        game.settings.set("twodsix", settingName, value);
        console.log(`${newRuleset} ${settingName} = ${value}`);
      });
    }
  });
  htmlElement.querySelector('[name="twodsix.hideUntrainedSkills"]')?.addEventListener("click", async (event) => {
    const continueText = game.i18n.localize("TWODSIX.Settings.hideUntrainedSkills.continue");
    const currentTarget = event.currentTarget;
    if (currentTarget) {
      if (game.settings.get("twodsix", "hideUntrainedSkills") && !currentTarget["checked"]) {
        const warningResetText = game.i18n.localize("TWODSIX.Settings.hideUntrainedSkills.warningReset");
        createWarningDialog(event, `${warningResetText}<br>${continueText}<br>`);
      } else if (!game.settings.get("twodsix", "hideUntrainedSkills") && currentTarget["checked"]) {
        const warningUpdateWeaponText = game.i18n.localize("TWODSIX.Settings.hideUntrainedSkills.warningUpdateWeapon");
        createWarningDialog(event, `${warningUpdateWeaponText}<br>${continueText}<br>`);
      }
    }
  });
});

var renderSettingsConfig = /*#__PURE__*/Object.freeze({
  __proto__: null
});

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
const _TwodsixSystem = class _TwodsixSystem {
  //Nothing here yet
};
__name(_TwodsixSystem, "TwodsixSystem");
let TwodsixSystem = _TwodsixSystem;

Hooks.once("setup", async function() {
  CONFIG.statusEffects.push(
    { id: "aiming", name: "EFFECT.StatusAiming", img: "systems/twodsix/assets/icons/aiming.svg" },
    { id: "cover", name: "EFFECT.StatusInCover", img: "systems/twodsix/assets/icons/defensive-wall.svg" },
    { id: "fatigued", name: "EFFECT.StatusFatigued", img: "systems/twodsix/assets/icons/tired-eye.svg" },
    { id: "encumbered", name: "EFFECT.StatusEncumbered", img: "systems/twodsix/assets/icons/weight.svg" },
    { id: "irradiated", name: "EFFECT.StatusIrradiated", img: "systems/twodsix/assets/icons/irradiated.svg" },
    { id: "thrust", name: "EFFECT.StatusThrust", img: "systems/twodsix/assets/icons/thrust.svg" },
    { id: "target-lock", name: "EFFECT.StatusTargetLock", img: "systems/twodsix/assets/icons/convergence-target.svg" }
  );
  const woundedSE = CONFIG.statusEffects.find((se) => se.id === "bleeding");
  if (woundedSE) {
    woundedSE.id = "wounded";
    woundedSE.name = "EFFECT.StatusWounded";
  }
  window["Twodsix"] = new TwodsixSystem();
});

var setup = /*#__PURE__*/Object.freeze({
  __proto__: null
});
//# sourceMappingURL=twodsix.bundle.js.map
