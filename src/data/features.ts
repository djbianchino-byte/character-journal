export type ClassFeature = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  charges?: string;
};

export type Attack = {
  id: string;
  name: string;
  detail: string;
  damage: string;
};

export const classFeatures: ClassFeature[] = [
  {
    id: 'divine-sense',
    name: 'Divine Sense',
    subtitle: 'Action · 4 uses per long rest',
    description:
      'Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet that is not behind total cover.',
    charges: '4',
  },
  {
    id: 'lay-on-hands',
    name: 'Lay on Hands',
    subtitle: 'Action · pool of 15 hit points',
    description:
      'You have a pool of healing power that replenishes on a long rest. As an action, touch a creature and draw from the pool to restore hit points, or spend 5 points to cure one disease or poison.',
    charges: '15',
  },
  {
    id: 'divine-smite',
    name: 'Divine Smite',
    subtitle: 'On hit · expend a spell slot',
    description:
      'When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage in addition to the weapon damage: 2d8 for a 1st-level slot, plus 1d8 per slot level above 1st.',
  },
  {
    id: 'channel-divinity',
    name: 'Channel Divinity',
    subtitle: 'Channel · 1 use per short rest',
    description:
      'You can channel divine energy to fuel magical effects. You regain expended uses when you finish a short or long rest.',
    charges: '1',
  },
  {
    id: 'fighting-style',
    name: 'Fighting Style: Dueling',
    subtitle: 'Passive',
    description:
      'When you wield a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.',
  },
  {
    id: 'spellcasting',
    name: 'Spellcasting',
    subtitle: 'Charisma · spell save DC 13',
    description:
      'You can prepare a number of paladin spells equal to your Charisma modifier + half your paladin level, rounded down. Your spellcasting ability is Charisma.',
  },
];

export const attacks: Attack[] = [
  {
    id: 'longsword',
    name: 'Longsword',
    detail: 'Melee · +5 to hit',
    damage: '1d8 + 3 slashing',
  },
  {
    id: 'javelin',
    name: 'Javelin',
    detail: 'Ranged 30/120 · +5 to hit',
    damage: '1d6 + 3 piercing',
  },
  {
    id: 'divine-smite',
    name: 'Divine Smite',
    detail: 'On hit · expend a slot',
    damage: '2d8 radiant',
  },
];

export const spells = {
  slots: { total: 3, used: 0 },
  saveDc: 13,
  prepared: [
    { name: 'Bless', level: 1, note: 'Concentration · 3 creatures' },
    { name: 'Cure Wounds', level: 1, note: 'Touch · 1d8 + CHA' },
    { name: 'Shield of Faith', level: 1, note: 'Concentration · +2 AC' },
    { name: 'Divine Favor', level: 1, note: 'Concentration · +1d4 radiant' },
  ],
};
