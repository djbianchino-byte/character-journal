import { useSyncExternalStore } from 'react';

import { campaign } from './campaign';

export type CampaignRole = 'player' | 'dm';

export type CampaignSummary = {
  id: string;
  code: string;
  role: CampaignRole;
  title: string;
  gameMaster: string;
  playerCount: number;
  description: string;
  nextSession: string;
};

const CODE_CHARACTERS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const initial: CampaignSummary[] = [
  {
    id: campaign.id,
    code: 'ASHEN7',
    role: 'player',
    title: campaign.title,
    gameMaster: campaign.gameMaster,
    playerCount: campaign.playerCount,
    description: campaign.description,
    nextSession: `${campaign.nextSession.month} ${campaign.nextSession.day} · ${campaign.nextSession.time}`,
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
      nextSession: 'Not scheduled',
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
      nextSession: input.nextSession.trim() || 'Not scheduled',
    },
  ];
  emit();
  return code;
}

export function useCampaigns() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
