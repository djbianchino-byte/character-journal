import { useSyncExternalStore } from 'react';

import { classFeatures } from './features';

export type EditableFeature = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  /** Uses per rest, when the feature has any. */
  charges: string;
};

export type FeatureDraft = {
  name: string;
  subtitle: string;
  description: string;
  charges: string;
};

function seed(): EditableFeature[] {
  return classFeatures.map(feature => ({
    id: feature.id,
    name: feature.name,
    subtitle: feature.subtitle,
    description: feature.description,
    charges: feature.charges ?? '',
  }));
}

let state: EditableFeature[] = seed();
let nextId = 0;
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

function emit(next: EditableFeature[]) {
  state = next;
  listeners.forEach(listener => listener());
}

/** Adds a blank feature and returns its id so the card can open in editing mode. */
export function addFeature() {
  const id = `feature-${Date.now()}-${nextId++}`;
  emit([...state, { id, name: 'New feature', subtitle: '', description: '', charges: '' }]);
  return id;
}

export function updateFeature(id: string, draft: FeatureDraft) {
  emit(
    state.map(feature =>
      feature.id === id
        ? {
            ...feature,
            name: draft.name.trim() || feature.name,
            subtitle: draft.subtitle.trim(),
            description: draft.description.trim(),
            charges: draft.charges.trim(),
          }
        : feature,
    ),
  );
}

export function removeFeature(id: string) {
  emit(state.filter(feature => feature.id !== id));
}

export function useClassFeatures() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
