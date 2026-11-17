import { useSyncExternalStore } from 'react';

import { character, type InventoryItem } from './character';

export type ItemType = InventoryItem['type'];

export const itemTypes: ItemType[] = ['Weapon', 'Armor', 'Consumable', 'Gear', 'Treasure'];

export type InventoryEntry = {
  id: string;
  name: string;
  type: ItemType;
  qty: number;
  description: string;
};

export type Coins = { gold: number; silver: number; copper: number };

export type InventoryState = {
  items: InventoryEntry[];
  coins: Coins;
};

/** Seeded quantities read like "x3"; the store keeps a plain number. */
function parseQty(qty: string) {
  const value = Number.parseInt(qty.replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

let nextId = 0;

function seed(): InventoryState {
  return {
    items: character.inventory.map(item => ({
      id: `item-${nextId++}`,
      name: item.name,
      type: item.type,
      qty: parseQty(item.qty),
      description: item.description ?? '',
    })),
    coins: { ...character.coins },
  };
}

let state: InventoryState = seed();
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

function emit(next: InventoryState) {
  state = next;
  listeners.forEach(listener => listener());
}

export type ItemDraft = {
  name: string;
  type: ItemType;
  qty: number;
  description: string;
};

/** Adds an item to the pack and returns its id. */
export function addItem(draft: ItemDraft) {
  const id = `item-${Date.now()}-${nextId++}`;
  emit({
    ...state,
    items: [
      ...state.items,
      {
        id,
        name: draft.name.trim(),
        type: draft.type,
        qty: Math.max(1, Math.round(draft.qty) || 1),
        description: draft.description.trim(),
      },
    ],
  });
  return id;
}

export function updateItem(id: string, draft: Partial<ItemDraft>) {
  emit({
    ...state,
    items: state.items.map(item =>
      item.id === id
        ? {
            ...item,
            name: draft.name?.trim() || item.name,
            type: draft.type ?? item.type,
            qty: draft.qty === undefined ? item.qty : Math.max(1, Math.round(draft.qty) || 1),
            description: draft.description === undefined ? item.description : draft.description.trim(),
          }
        : item,
    ),
  });
}

export function removeItem(id: string) {
  emit({ ...state, items: state.items.filter(item => item.id !== id) });
}

export function setCoins(patch: Coins) {
  emit({
    ...state,
    coins: {
      gold: Math.max(0, Math.round(patch.gold) || 0),
      silver: Math.max(0, Math.round(patch.silver) || 0),
      copper: Math.max(0, Math.round(patch.copper) || 0),
    },
  });
}

export function useInventory() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
