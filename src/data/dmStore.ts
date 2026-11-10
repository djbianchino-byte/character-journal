import { useSyncExternalStore } from 'react';

import { campaign } from './campaign';

export type EntityKind = 'location' | 'character' | 'event' | 'item' | 'story';

export const entityKindLabels: Record<EntityKind, string> = {
  location: 'Location',
  character: 'Character',
  event: 'Event',
  item: 'Item',
  story: 'Story',
};

const kindTints: Record<EntityKind, string> = {
  location: '#6f512b',
  character: '#5f6b8a',
  event: '#7a5c1f',
  item: '#4f5f4a',
  story: '#6b4a24',
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
};

type CampaignDm = {
  live: boolean;
  entities: DmEntity[];
};

const EMPTY: CampaignDm = { live: false, entities: [] };

function initialFor(title: string) {
  return title.trim().charAt(0).toUpperCase() || '?';
}

function seedEntities(): DmEntity[] {
  const locations: DmEntity[] = campaign.locations.map((place, index) => ({
    id: `location-${place.id}`,
    kind: 'location',
    title: place.name,
    subtitle: place.region,
    body: `${place.summary}\n\n${place.detail}`,
    facts: place.known,
    initial: place.initial,
    tint: place.tint,
    pinned: false,
  }));

  const characters: DmEntity[] = campaign.npcs.map(npc => ({
    id: `character-${npc.id}`,
    kind: 'character',
    title: npc.name,
    subtitle: npc.role,
    body: '',
    facts: [],
    initial: npc.initial,
    tint: npc.tint,
    pinned: false,
  }));

  const events: DmEntity[] = campaign.events.map(event => ({
    id: `event-${event.id}`,
    kind: 'event',
    title: event.title,
    subtitle: event.when,
    body: event.summary,
    facts: [],
    initial: initialFor(event.title),
    tint: kindTints.event,
    pinned: false,
  }));

  // Artifacts appear on the story page, so they start revealed to players.
  const items: DmEntity[] = campaign.artifacts.map(artifact => ({
    id: `item-${artifact.id}`,
    kind: 'item',
    title: artifact.name,
    subtitle: artifact.kind,
    body: `${artifact.summary}\n\n${artifact.detail}`,
    facts: [],
    initial: artifact.initial,
    tint: kindTints.item,
    pinned: true,
  }));

  const chapters: DmEntity[] = campaign.story.map((chapter, index) => ({
    id: `story-chapter-${index}`,
    kind: 'story',
    title: chapter.title,
    subtitle: '',
    body: chapter.body,
    facts: [],
    initial: initialFor(chapter.title),
    tint: kindTints.story,
    pinned: true,
  }));

  const lastSession: DmEntity = {
    id: 'story-last-session',
    kind: 'story',
    title: campaign.lastSession.title,
    subtitle: campaign.lastSession.date,
    body: [
      `Present: ${campaign.lastSession.attendance.join(' · ')}`,
      ...campaign.lastSession.recap,
    ].join('\n\n'),
    facts: campaign.lastSession.loot,
    initial: initialFor(campaign.lastSession.title),
    tint: kindTints.story,
    pinned: true,
  };

  return [...locations, ...characters, ...events, ...items, ...chapters, lastSession];
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

export function addEntity(
  campaignId: string,
  input: { kind: EntityKind; title: string; subtitle: string; body: string },
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
        // Story details are written on the story page, so they are revealed by default.
        pinned: input.kind === 'story',
      },
    ],
  });
  return id;
}

export function updateEntity(
  campaignId: string,
  entityId: string,
  patch: { title?: string; subtitle?: string; body?: string },
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
