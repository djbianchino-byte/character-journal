export type AbilityKey = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export type Ability = {
  key: AbilityKey;
  label: string;
  mod: string;
  score: number;
};

export type SavingThrow = {
  ability: AbilityKey;
  label: string;
  value: string;
};

export type Skill = {
  name: string;
  ability: AbilityKey;
  mod: string;
  proficient: boolean;
  bonus: string;
};

export type Relationship = {
  initial: string;
  name: string;
  role: string;
};

export type InventoryItem = {
  name: string;
  type: 'Consumable' | 'Weapon' | 'Armor' | 'Gear' | 'Treasure';
  qty: string;
  description?: string;
};

export type Character = {
  name: string;
  subtitle: string;
  initials: string;
  level: number;
  abilities: Ability[];
  armorClass: number;
  initiative: string;
  hp: { current: number; max: number; temp: number };
  savingThrows: SavingThrow[];
  senses: { passivePerception: number; darkvision: string };
  proficiencyBonus: string;
  skills: Skill[];
  lore: {
    physicalDescription: string;
    age: string;
    height: string;
    weight: string;
    eyes: string;
    hair: string;
    skin: string;
    personalityTraits: string;
    ideals: string;
    flaws: string;
    earlyLife: string;
    theBlight: string;
    relationships: Relationship[];
  };
  inventory: InventoryItem[];
  coins: { gold: number; silver: number; copper: number };
};

export const character: Character = {
  name: 'Ser Garyth',
  subtitle: 'Human Paladin 3 · played by Jamie',
  initials: 'SG',
  level: 3,

  abilities: [
    { key: 'STR', label: 'Strength', mod: '+0', score: 10 },
    { key: 'DEX', label: 'Dexterity', mod: '+0', score: 10 },
    { key: 'CON', label: 'Constitution', mod: '+0', score: 10 },
    { key: 'INT', label: 'Intelligence', mod: '+0', score: 10 },
    { key: 'WIS', label: 'Wisdom', mod: '+0', score: 10 },
    { key: 'CHA', label: 'Charisma', mod: '+0', score: 10 },
  ],

  armorClass: 25,
  initiative: '+3',
  hp: { current: 30, max: 30, temp: 0 },

  savingThrows: [
    { ability: 'STR', label: 'Strength', value: '+0' },
    { ability: 'CON', label: 'Constitution', value: '+0' },
  ],

  senses: { passivePerception: 10, darkvision: '120 ft.' },

  proficiencyBonus: '+2',

  skills: [
    { name: 'Acrobatics', ability: 'DEX', mod: '+0', proficient: false, bonus: '+0' },
    { name: 'Animal Handling', ability: 'WIS', mod: '+0', proficient: false, bonus: '+0' },
    { name: 'Arcana', ability: 'INT', mod: '+0', proficient: false, bonus: '+0' },
    { name: 'Athletics', ability: 'STR', mod: '+0', proficient: true, bonus: '+0' },
    { name: 'Deception', ability: 'CHA', mod: '+0', proficient: false, bonus: '+0' },
    { name: 'History', ability: 'INT', mod: '+0', proficient: false, bonus: '+0' },
    { name: 'Insight', ability: 'WIS', mod: '+0', proficient: false, bonus: '+0' },
    { name: 'Intimidation', ability: 'CHA', mod: '+0', proficient: false, bonus: '+0' },
    { name: 'Investigation', ability: 'INT', mod: '+0', proficient: false, bonus: '+0' },
    { name: 'Medicine', ability: 'WIS', mod: '+0', proficient: true, bonus: '+0' },
    { name: 'Nature', ability: 'INT', mod: '+0', proficient: false, bonus: '+0' },
    { name: 'Perception', ability: 'WIS', mod: '+0', proficient: true, bonus: '+0' },
    { name: 'Performance', ability: 'CHA', mod: '+0', proficient: false, bonus: '+0' },
    { name: 'Persuasion', ability: 'CHA', mod: '+0', proficient: false, bonus: '+0' },
    { name: 'Religion', ability: 'INT', mod: '+0', proficient: false, bonus: '+0' },
    { name: 'Sleight of Hand', ability: 'DEX', mod: '+0', proficient: false, bonus: '+0' },
    { name: 'Stealth', ability: 'DEX', mod: '+0', proficient: false, bonus: '+0' },
    { name: 'Survival', ability: 'WIS', mod: '+0', proficient: true, bonus: '+0' },
  ],

  lore: {
    physicalDescription:
      'Tall and wiry, with bark-brown braids and a cloak stitched from leaves.',
    age: '112',
    height: "6'0\"",
    weight: '130 lb',
    eyes: 'Silver-green',
    hair: 'Brown',
    skin: 'Tan',
    personalityTraits:
      'I listen to the wind before I speak. I would rather sleep under stars than any roof.',
    ideals: 'Nature. The wild must be protected from those who poison it.',
    flaws: 'I cannot forgive anyone who harms the wild.',
    earlyLife:
      'Garyth was born in the Hollowvale, an ancient grove where the elders tended the Heartroot, a colossal yew said to be older than the elven kingdoms. His mother was a lorekeeper and his father a scout, and both were often away. Garyth spent most of his childhood alone among the trees, and he came to treat them as playmates. He talked to the moss, named the foxes, and once refused to leave a fallen oak until spring.',
    theBlight:
      "When Garyth was a young adult, a creeping gray rot began spreading from the grove's edge. Leaves curled and the streams ran sluggish. The elders blamed the usual suspects: human loggers, a curse, an angry spirit. They argued for months while the Heartroot's bark turned ashen.\n\nGaryth, impatient and sure he was right, broke with the council. He believed the blight was a symptom of something deeper — a wound in the land itself — and set out to find its source. He has not yet returned.",
    relationships: [
      { initial: 'W', name: 'Willow', role: 'Druid · Childhood friend' },
    ],
  },

  inventory: [
    { name: 'Healing Potion', type: 'Consumable', qty: 'x3', description: 'Restores 2d4 + 2 hit points.' },
    { name: 'Iron Rations', type: 'Consumable', qty: 'x1', description: 'Five days of preserved food.' },
    { name: 'Longsword', type: 'Weapon', qty: 'x1', description: '1d8 slashing, versatile (1d10).' },
    { name: 'Leather Armor', type: 'Armor', qty: 'x1', description: 'Light armor · AC 11 + DEX.' },
    { name: 'Torch', type: 'Consumable', qty: 'x6', description: 'Bright light 20 ft, dim 40 ft.' },
    { name: 'Rope (50 ft)', type: 'Gear', qty: 'x1', description: 'Hemp rope, 50 feet.' },
    { name: 'Crowbar', type: 'Gear', qty: 'x1', description: 'Advantage on Strength checks.' },
    { name: 'Waterskin', type: 'Gear', qty: 'x1', description: 'Holds 4 pints of water.' },
    { name: 'Holy Symbol', type: 'Treasure', qty: 'x1', description: 'A yew-wood sunburst.' },
  ],

  coins: { gold: 124, silver: 18, copper: 7 },
};
