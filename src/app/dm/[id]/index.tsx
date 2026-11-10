import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import {
  CharactersSection,
  EventsSection,
  LocationDetail,
  PlacesSection,
  StorySection,
  type PartyMember,
} from '../../../components/CampaignContent';
import { InfoRow, PaperCard } from '../../../components/PaperCard';
import { PaperScreen } from '../../../components/PaperScreen';
import { TabRow, type TabItem } from '../../../components/TabRow';
import { campaign, type CampaignLocation } from '../../../data/campaign';
import { useCampaigns } from '../../../data/campaignList';
import { colors, fonts } from '../../../theme';

type DmTab = 'story' | 'locations' | 'characters' | 'events';

const tabs: TabItem<DmTab>[] = [
  { key: 'story', label: 'Story' },
  { key: 'locations', label: 'Locations' },
  { key: 'characters', label: 'Characters' },
  { key: 'events', label: 'Events' },
];

export default function DmCampaignScreen() {
  const router = useRouter();
  const { id, tab } = useLocalSearchParams<{ id: string; tab?: string }>();
  const campaigns = useCampaigns();
  const item = campaigns.find(entry => entry.id === id);
  const active: DmTab = tabs.some(entry => entry.key === tab) ? (tab as DmTab) : 'story';
  const [openPlace, setOpenPlace] = useState<CampaignLocation | null>(null);

  function leave() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/' as never);
  }

  if (!item) {
    return (
      <PaperScreen kicker="Dungeon master" title="Campaign not found" onBack={leave}>
        <PaperCard>
          <Text style={styles.body}>This table is no longer in your list. Go back and choose another campaign.</Text>
        </PaperCard>
      </PaperScreen>
    );
  }

  // The sample lore belongs to The Ashen Crown only; other campaigns start empty.
  const campaignId = item.id;
  const hasLore = campaignId === campaign.id;

  function changeTab(next: DmTab) {
    setOpenPlace(null);
    router.setParams({ tab: next });
  }

  function openCharacter(player: PartyMember) {
    router.push(`/dm/${campaignId}/character/${player.id}` as never);
  }

  return (
    <PaperScreen kicker="Dungeon master" title={item.title} onBack={leave}>
      <PaperCard label="Invite code">
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.body}>Players enter this code on the join screen to sit at your table.</Text>
      </PaperCard>

      <TabRow tabs={tabs} active={active} onChange={changeTab} />

      {!hasLore ? (
        <PaperCard label={tabs.find(entry => entry.key === active)?.label ?? ''}>
          <Text style={styles.empty}>Nothing has been written for this campaign yet.</Text>
        </PaperCard>
      ) : null}

      {hasLore && active === 'story' ? (
        <>
          <PaperCard label="The table">
            <InfoRow label="Game master" value="You" />
            <InfoRow label="Next session" value={item.nextSession} />
            <InfoRow label="Players" value={String(item.playerCount)} last />
          </PaperCard>
          <StorySection />
        </>
      ) : null}

      {hasLore && active === 'locations' ? (
        openPlace ? (
          <>
            <Pressable
              onPress={() => setOpenPlace(null)}
              accessibilityRole="button"
              accessibilityLabel="Back to locations"
              style={({ pressed }) => [styles.back, pressed && styles.pressed]}
            >
              <Text style={styles.backText}>‹ All locations</Text>
            </Pressable>
            <LocationDetail location={openPlace} />
          </>
        ) : (
          <PlacesSection onOpen={setOpenPlace} />
        )
      ) : null}

      {hasLore && active === 'characters' ? <CharactersSection onOpen={openCharacter} /> : null}

      {hasLore && active === 'events' ? <EventsSection /> : null}
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  code: {
    fontFamily: fonts.numeral,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: 4,
    color: colors.ink,
    marginBottom: 6,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.ink,
  },
  empty: {
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    lineHeight: 19,
    color: colors.muted,
  },
  back: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  backText: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 20,
    color: colors.ink,
  },
  pressed: {
    opacity: 0.7,
  },
});
