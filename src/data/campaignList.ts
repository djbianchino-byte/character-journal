import { useSyncExternalStore } from 'react';

import { campaign } from './campaign';

export type CampaignSummary = {
  id: string;
  title: string;
  gameMaster: string;
  playerCount: number;
  description: string;
  nextSession: string;
};

const initial: CampaignSummary[] = [
  {
    id: campaign.id,
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

/** Adds a campaign joined with a code or QR. Prototype store: lives for the app session. */
export function addCampaign(code: string) {
  const id = code.trim().toUpperCase();
  if (campaigns.some(item => item.id === id)) {
    return;
  }
  campaigns = [
    ...campaigns,
    {
      id,
      title: `Campaign ${id}`,
      gameMaster: 'Waiting for the GM',
      playerCount: 1,
      description: 'Joined with an invite code. The story will appear once the GM shares it.',
      nextSession: 'Not scheduled',
    },
  ];
  listeners.forEach(listener => listener());
}

export function useCampaigns() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
