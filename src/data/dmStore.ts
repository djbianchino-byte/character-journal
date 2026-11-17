import { useSyncExternalStore } from 'react';

import { campaign } from './campaign';
import { character } from './character';

export type EntityKind = 'location' | 'character' | 'event' | 'item';

/** Who wrote an entry. Players can only edit their own entries. */
export type EntityAuthor = 'dm' | 'player';

export const entityKindLabels: Record<EntityKind, string> = {
  location: 'Location',
  character: 'Character',
  event: 'Event',
  item: 'Item',
};

/** Labels for the three fields of each kind, shared by the add and edit forms. */
export const entityFieldLabels: Record<EntityKind, { title: string; subtitle: string; body: string }> = {
  location: { title: 'Name', subtitle: 'Region', body: 'Summary' },
  character: { title: 'Name', subtitle: 'Role', body: 'Description' },
  event: { title: 'Title', subtitle: 'When', body: 'Summary' },
  item: { title: 'Name', subtitle: 'Kind', body: 'Description' },
};

const kindTints: Record<EntityKind, string> = {
  location: '#6f512b',
  character: '#5f6b8a',
  event: '#7a5c1f',
  item: '#4f5f4a',
};

export type DmEntity = {
  id: string;
  kind: EntityKind;
  title: string;
  subtitle: string;
  body: string;
  facts: string[];
  initial: string;
  tint: string;
  pinned: boolean;
  author: EntityAuthor;
  /** Ids of characters involved in this entry. */
  linked: string[];
};

type CampaignDm = {
  live: boolean;
  entities: DmEntity[];
};

const EMPTY: CampaignDm = { live: false, entities: [] };

function initialFor(title: string) {
  return title.trim().charAt(0).toUpperCase() || '?';
}

function seed(entity: Omit<DmEntity, 'author' | 'linked'>): DmEntity {
  return { ...entity, author: 'dm', linked: [] };
}

function seedEntities(): DmEntity[] {
  const locations = campaign.locations.map(place =>
    seed({
      id: `location-${place.id}`,
      kind: 'location',
      title: place.name,
      subtitle: place.region,
      body: `${place.summary}\n\n${place.detail}`,
      facts: place.known,
      initial: place.initial,
      tint: place.tint,
      pinned: false,
    }),
  );

  const characters = campaign.npcs.map(npc =>
    seed({
      id: `character-${npc.id}`,
      kind: 'character',
      title: npc.name,
      subtitle: npc.role,
      body: '',
      facts: [],
      initial: npc.initial,
      tint: npc.tint,
      pinned: false,
    }),
  );

  const timeline = campaign.events.map(event =>
    seed({
      id: `event-${event.id}`,
      kind: 'event',
      title: event.title,
      subtitle: event.when,
      body: event.summary,
      facts: [],
      initial: initialFor(event.title),
      tint: kindTints.event,
      pinned: false,
    }),
  );

  // Chapters and the last session are events; artifacts are items. All start pinned
  // so players see them on their campaign page.
  const chapters = campaign.story.map((chapter, index) =>
    seed({
      id: `event-chapter-${index}`,
      kind: 'event',
      title: chapter.title,
      subtitle: '',
      body: chapter.body,
      facts: [],
      initial: initialFor(chapter.title),
      tint: kindTints.event,
      pinned: true,
    }),
  );

  const lastSession = seed({
    id: 'event-last-session',
    kind: 'event',
    title: campaign.lastSession.title,
    subtitle: campaign.lastSession.date,
    body: [
      `Present: ${campaign.lastSession.attendance.join(' · ')}`,
      ...campaign.lastSession.recap,
    ].join('\n\n'),
    facts: campaign.lastSession.loot,
    initial: initialFor(campaign.lastSession.title),
    tint: kindTints.event,
    pinned: true,
  });

  const artifacts = campaign.artifacts.map(artifact =>
    seed({
      id: `item-artifact-${artifact.id}`,
      kind: 'item',
      title: artifact.name,
      subtitle: artifact.kind,
      body: `${artifact.summary}\n\n${artifact.detail}`,
      facts: [],
      initial: artifact.initial,
      tint: kindTints.item,
      pinned: true,
    }),
  );

  return [...locations, ...characters, ...timeline, ...chapters, lastSession, ...artifacts];
}

let state: Record<string, CampaignDm> = {
  [campaign.id]: { live: false, entities: seedEntities() },
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

function update(campaignId: string, next: CampaignDm) {
  state = { ...state, [campaignId]: next };
  listeners.forEach(listener => listener());
}

function currentFor(campaignId: string) {
  return state[campaignId] ?? EMPTY;
}

/** Entries a player can see: anything the DM pinned, plus anything a player wrote. */
export function isRevealed(entity: DmEntity) {
  return entity.pinned || entity.author === 'player';
}

export type DirectoryCharacter = {
  id: string;
  name: string;
  initial: string;
  subtitle: string;
  tint: string;
  /** Where the character comes from. */
  source: 'party' | 'lore' | 'dm' | 'player';
};

/**
 * Every character a player can refer to: the party, the backstory's
 * relationships, and the DM's and players' character entries.
 */
export function characterDirectory(entities: DmEntity[]): DirectoryCharacter[] {
  const party: DirectoryCharacter[] = campaign.roster.map(player => ({
    id: player.id,
    name: player.name,
    initial: player.initial,
    subtitle: player.meta,
    tint: player.tint,
    source: 'party',
  }));
  const lore: DirectoryCharacter[] = character.lore.relationships.map(person => ({
    id: `lore-${person.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: person.name,
    initial: person.initial,
    subtitle: person.role,
    tint: '#6f512b',
    source: 'lore',
  }));
  const entries: DirectoryCharacter[] = entities
    .filter(entity => entity.kind === 'character')
    .map(entity => ({
      id: entity.id,
      name: entity.title,
      initial: entity.initial,
      subtitle: entity.subtitle,
      tint: entity.tint,
      source: entity.author === 'player' ? 'player' : 'dm',
    }));
  return [...party, ...lore, ...entries];
}

export function addEntity(
  campaignId: string,
  input: {
    kind: EntityKind;
    title: string;
    subtitle: string;
    body: string;
    author?: EntityAuthor;
    linked?: string[];
  },
  pinned = false,
) {
  const title = input.title.trim();
  const id = `${input.kind}-${Date.now()}`;
  const current = currentFor(campaignId);
  update(campaignId, {
    ...current,
    entities: [
      ...current.entities,
      {
        id,
        kind: input.kind,
        title,
        subtitle: input.subtitle.trim(),
        body: input.body.trim(),
        facts: [],
        initial: initialFor(title),
        tint: kindTints[input.kind],
        pinned,
        author: input.author ?? 'dm',
        linked: input.linked ?? [],
      },
    ],
  });
  return id;
}

export function updateEntity(
  campaignId: string,
  entityId: string,
  patch: { title?: string; subtitle?: string; body?: string; facts?: string[]; linked?: string[] },
) {
  const current = currentFor(campaignId);
  update(campaignId, {
    ...current,
    entities: current.entities.map(entity =>
      entity.id === entityId
        ? {
            ...entity,
            title: patch.title?.trim() || entity.title,
            subtitle: patch.subtitle?.trim() ?? entity.subtitle,
            body: patch.body?.trim() ?? entity.body,
            facts: patch.facts ?? entity.facts,
            linked: patch.linked ?? entity.linked,
          }
        : entity,
    ),
  });
}

export function togglePin(campaignId: string, entityId: string) {
  const current = currentFor(campaignId);
  update(campaignId, {
    ...current,
    entities: current.entities.map(entity =>
      entity.id === entityId ? { ...entity, pinned: !entity.pinned } : entity,
    ),
  });
}

export function setSessionLive(campaignId: string, live: boolean) {
  update(campaignId, { ...currentFor(campaignId), live });
}

/** DM content for one campaign: its entities and whether a session is running. */
export function useDm(campaignId: string) {
  const all = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return all[campaignId] ?? EMPTY;
}
