import { useSyncExternalStore } from 'react';

import { character } from './character';

export type Profile = {
  name: string;
  ancestry: string;
  className: string;
  level: number;
  playedBy: string;
  /** Photo chosen by the player. Null keeps the default portrait artwork. */
  avatarUri: string | null;
};

const initial: Profile = {
  name: character.name,
  ancestry: 'Human',
  className: 'Paladin',
  level: character.level,
  playedBy: 'Jamie',
  avatarUri: null,
};

let profile: Profile = initial;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return profile;
}

/** Saves the player's edits. Prototype store: lives for the app session. */
export function updateProfile(patch: Partial<Profile>) {
  profile = { ...profile, ...patch };
  listeners.forEach(listener => listener());
}

/** Header line such as "Human Paladin 3". */
export function profileClassLine(value: Profile) {
  return `${value.ancestry} ${value.className} ${value.level}`;
}

export function useProfile() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
