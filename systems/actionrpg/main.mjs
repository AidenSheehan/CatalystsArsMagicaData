import {CharacterData} from "./DataModels/character.mjs";

Hooks.once("init", () => {
  // Configure custom Document implementations.
  //CONFIG.Actor.documentClass = SystemActor;
 // CONFIG.Item.documentClass = SystemItem;

  // Configure System Data Models.
  CONFIG.Actor.dataModels = {
    character: CharacterData
  };
  /*CONFIG.Item.dataModels = {
    weapon: WeaponDataModel,
    spell: SpellDataModel
  };*/

  // Configure trackable attributes.
  CONFIG.Actor.trackableAttributes = {
    character: {
      bar: ["resources.blockpoints", "resources.dodgepoints"],
      value: ["readpoints"]
    }
  };
});