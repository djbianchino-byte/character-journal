import { useSyncExternalStore } from 'react';

export type BackstoryBox = {
  id: string;
  title: string;
  body: string;
};

type BackstoryState = {
  boxes: BackstoryBox[];
  /** Directory ids of characters pinned as relationships. */
  relationshipIds: string[];
};

let state: BackstoryState = {
  boxes: [],
  relationshipIds: ['lore-willow'],
};
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

function emit(next: BackstoryState) {
  state = next;
  listeners.forEach(listener => listener());
}

/** Adds an empty text box to the backstory. Returns its id. */
export function addBackstoryBox() {
  const id = `box-${Date.now()}`;
  emit({ ...state, boxes: [...state.boxes, { id, title: 'New section', body: '' }] });
  return id;
}

export function updateBackstoryBox(id: string, patch: { title?: string; body?: string }) {
  emit({
    ...state,
    boxes: state.boxes.map(box =>
      box.id === id ? { ...box, title: patch.title?.trim() || box.title, body: patch.body ?? box.body } : box,
    ),
  });
}

export function removeBackstoryBox(id: string) {
  emit({ ...state, boxes: state.boxes.filter(box => box.id !== id) });
}

export function toggleRelationship(directoryId: string) {
  const pinned = state.relationshipIds.includes(directoryId);
  emit({
    ...state,
    relationshipIds: pinned
      ? state.relationshipIds.filter(id => id !== directoryId)
      : [...state.relationshipIds, directoryId],
  });
}

export function useBackstory() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
