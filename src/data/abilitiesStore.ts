import { useSyncExternalStore } from 'react';

import { character, type AbilityKey, type SavingThrow, type Skill } from './character';

export type AbilityScores = Record<AbilityKey, number>;

export const abilityOrder: AbilityKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

export const abilityLabels: Record<AbilityKey, string> = {
  STR: 'Strength',
  DEX: 'Dexterity',
  CON: 'Constitution',
  INT: 'Intelligence',
  WIS: 'Wisdom',
  CHA: 'Charisma',
};

/** Ability scores can't go below 1 or above 30, as on a character sheet. */
export function clampScore(score: number) {
  if (!Number.isFinite(score)) {
    return 10;
  }
  return Math.min(30, Math.max(1, Math.round(score)));
}

function seed(): AbilityScores {
  const scores = {} as AbilityScores;
  for (const ability of character.abilities) {
    scores[ability.key] = ability.score;
  }
  return scores;
}

let state: AbilityScores = seed();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

function emit(next: AbilityScores) {
  state = next;
  listeners.forEach(listener => listener());
}

export function setAbilityScores(next: Partial<AbilityScores>) {
  const merged = { ...state };
  for (const key of abilityOrder) {
    const value = next[key];
    if (value !== undefined) {
      merged[key] = clampScore(value);
    }
  }
  emit(merged);
}

export function useAbilityScores() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** The character's proficiency bonus, read once from the sheet data. */
export const proficiencyBonus =
  Number.parseInt(character.proficiencyBonus.replace(/[^0-9]/g, ''), 10) || 2;

/** 5e ability modifier: 8 → -1, 10 → +0, 12 → +1, 20 → +5. */
export function abilityModifier(score: number) {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number) {
  return mod < 0 ? String(mod) : `+${mod}`;
}

export function modifierFor(scores: AbilityScores, key: AbilityKey) {
  return abilityModifier(scores[key]);
}

/** Ability modifier, plus the proficiency bonus when the skill is trained. */
export function skillBonus(scores: AbilityScores, skill: Skill) {
  return modifierFor(scores, skill.ability) + (skill.proficient ? proficiencyBonus : 0);
}

/** The listed saving throws are the proficient ones, so they add the bonus. */
export function savingThrowBonus(scores: AbilityScores, save: SavingThrow) {
  return modifierFor(scores, save.ability) + proficiencyBonus;
}

/** Passive Perception is 10 plus the Perception bonus. */
export function passivePerception(scores: AbilityScores) {
  const perception = character.skills.find(skill => skill.name === 'Perception');
  const base = 10 + modifierFor(scores, 'WIS');
  return base + (perception?.proficient ? proficiencyBonus : 0);
}
