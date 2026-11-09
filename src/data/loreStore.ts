import { useSyncExternalStore } from 'react';

import { character, type Character } from './character';

export type LoreFields = Omit<Character['lore'], 'relationships'>;

let lore: LoreFields = (({ relationships: _relationships, ...fields }) => fields)(character.lore);
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return lore;
}

/** Saves edited backstory fields. Prototype store: lives for the app session. */
export function updateLore(patch: Partial<LoreFields>) {
  lore = { ...lore, ...patch };
  listeners.forEach(listener => listener());
}

export function useLore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
