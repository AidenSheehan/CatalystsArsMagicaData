const {
  HTMLField, SchemaField, NumberField, StringField, FilePathField, ArrayField
} = foundry.data.fields;

export class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      blockpoints: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
        min: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
      }),
      dodgepoints: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
        min: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
      }),
      readpoints: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 10 }),
        min: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
      }),
      proficiencies: new SchemaField({
        weapons: new ArrayField(new StringField()),
        skills: new ArrayField(new StringField())
      }),
      xp: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
    };
  }
}