import { useSyncExternalStore } from 'react';

import { campaign } from './campaign';

export type CampaignRole = 'player' | 'dm';

export type NextSession = {
  month: string;
  day: string;
  time: string;
  place: string;
};

export type CampaignSummary = {
  id: string;
  code: string;
  role: CampaignRole;
  title: string;
  gameMaster: string;
  playerCount: number;
  description: string;
  nextSession: NextSession;
};

const CODE_CHARACTERS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** "NOV 14 · Saturday, 7:00 PM", skipping empty parts. */
export function nextSessionLine(session: NextSession) {
  const date = [session.month, session.day].filter(Boolean).join(' ');
  return [date, session.time].filter(Boolean).join(' · ') || 'Not scheduled';
}

const initial: CampaignSummary[] = [
  {
    id: campaign.id,
    code: 'ASHEN7',
    role: 'player',
    title: campaign.title,
    gameMaster: campaign.gameMaster,
    playerCount: campaign.playerCount,
    description: campaign.description,
    nextSession: {
      month: campaign.nextSession.month,
      day: campaign.nextSession.day,
      time: campaign.nextSession.time,
      place: 'The Last Hearth',
    },
  },
];

let campaigns: CampaignSummary[] = initial;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return campaigns;
}

function emit() {
  listeners.forEach(listener => listener());
}

function newCode() {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARACTERS[Math.floor(Math.random() * CODE_CHARACTERS.length)];
  }
  return code;
}

/** Adds a campaign joined with a code or QR. Prototype store: lives for the app session. */
export function addCampaign(code: string) {
  const id = code.trim().toUpperCase();
  if (campaigns.some(item => item.code === id)) {
    return;
  }
  campaigns = [
    ...campaigns,
    {
      id,
      code: id,
      role: 'player',
      title: `Campaign ${id}`,
      gameMaster: 'Waiting for the GM',
      playerCount: 1,
      description: 'Joined with an invite code. The story will appear once the GM shares it.',
      nextSession: { month: '', day: '', time: '', place: '' },
    },
  ];
  emit();
}

/** Creates a campaign the user runs as DM. Returns its id. */
export function createCampaign(input: { title: string; description: string; nextSession: string }) {
  const code = newCode();
  campaigns = [
    ...campaigns,
    {
      id: code,
      code,
      role: 'dm',
      title: input.title.trim(),
      gameMaster: 'You',
      playerCount: 0,
      description: input.description.trim() || 'No description yet.',
      nextSession: { month: '', day: '', time: input.nextSession.trim(), place: '' },
    },
  ];
  emit();
  return code;
}

/** The DM edits what players see on the next-session card. */
export function updateCampaign(id: string, patch: { nextSession?: NextSession }) {
  campaigns = campaigns.map(item =>
    item.id === id
      ? {
          ...item,
          nextSession: patch.nextSession
            ? {
                month: patch.nextSession.month.trim(),
                day: patch.nextSession.day.trim(),
                time: patch.nextSession.time.trim(),
                place: patch.nextSession.place.trim(),
              }
            : item.nextSession,
        }
      : item,
  );
  emit();
}

export function useCampaigns() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
