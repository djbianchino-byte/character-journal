import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AddButton } from '../../../components/AddButton';
import { EntityCard } from '../../../components/EntityCard';
import { InfoRow, PaperCard } from '../../../components/PaperCard';
import { PaperScreen } from '../../../components/PaperScreen';
import { PartyRow } from '../../../components/PartyRow';
import { StoryCard } from '../../../components/StoryCard';
import { TabRow, type TabItem } from '../../../components/TabRow';
import { campaign } from '../../../data/campaign';
import { useCampaigns } from '../../../data/campaignList';
import {
  entityKindLabels,
  setSessionLive,
  togglePin,
  updateEntity,
  useDm,
  type DmEntity,
  type EntityKind,
} from '../../../data/dmStore';
import { colors, fonts } from '../../../theme';

type DmTab = 'story' | 'locations' | 'characters' | 'events' | 'items';

const tabs: TabItem<DmTab>[] = [
  { key: 'story', label: 'Story' },
  { key: 'locations', label: 'Locations' },
  { key: 'characters', label: 'Characters' },
  { key: 'events', label: 'Events' },
  { key: 'items', label: 'Items' },
];

const tabKind: Partial<Record<DmTab, EntityKind>> = {
  locations: 'location',
  characters: 'character',
  events: 'event',
  items: 'item',
};

export default function DmCampaignScreen() {
  const router = useRouter();
  const { id, tab } = useLocalSearchParams<{ id: string; tab?: string }>();
  const campaigns = useCampaigns();
  const item = campaigns.find(entry => entry.id === id);
  const dm = useDm(id);
  const [pinning, setPinning] = useState(false);

  const active: DmTab = tabs.some(entry => entry.key === tab) ? (tab as DmTab) : 'story';

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

  const campaignId = item.id;
  // The sample party belongs to The Ashen Crown only.
  const hasParty = campaignId === campaign.id;
  const pinned = dm.entities.filter(entry => entry.pinned);
  const unpinned = dm.entities.filter(entry => !entry.pinned);

  function changeTab(next: DmTab) {
    setPinning(false);
    router.setParams({ tab: next });
  }

  function openEntity(entity: DmEntity) {
    router.push(`/dm/${campaignId}/entity/${entity.id}` as never);
  }

  function addNew(kind: EntityKind) {
    router.push(`/dm/${campaignId}/new?kind=${kind}` as never);
  }

  function listFor(kind: EntityKind) {
    return dm.entities.filter(entry => entry.kind === kind);
  }

  const currentKind = tabKind[active];

  return (
    <PaperScreen kicker="Dungeon master" title={item.title} onBack={leave}>
      <PaperCard label="Invite code">
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.body}>Players enter this code on the join screen to sit at your table.</Text>
      </PaperCard>

      <PaperCard label="Next session" style={styles.gap}>
        <Text style={styles.nextTitle}>{item.nextSession}</Text>
        <Text style={styles.body}>
          {dm.live ? 'The table is live. End the session when you wrap up.' : 'Not started yet.'}
        </Text>
        <AddButton
          label={dm.live ? 'End session' : 'Start session'}
          primary={!dm.live}
          onPress={() => setSessionLive(campaignId, !dm.live)}
        />
      </PaperCard>

      <PaperCard style={styles.gap}>
        <View style={styles.pinnedHead}>
          <Text style={styles.pinnedLabel}>Pinned to home</Text>
          <Pressable
            onPress={() => setPinning(current => !current)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={pinning ? 'Done pinning' : 'Pin something to home'}
          >
            <Text style={styles.pinnedToggle}>{pinning ? 'Done' : '+ Pin'}</Text>
          </Pressable>
        </View>

        {pinned.length === 0 ? (
          <Text style={styles.empty}>
            Nothing is pinned yet. Pin a location, character, event, item or story detail to keep it here.
          </Text>
        ) : (
          pinned.map((entity, index) => (
            <View key={entity.id} style={[styles.pinRow, index === pinned.length - 1 && styles.pinRowLast]}>
              <Pressable
                onPress={() => openEntity(entity)}
                accessibilityRole="button"
                accessibilityLabel={`Open ${entity.title}`}
                style={styles.pinOpen}
              >
                <Text style={styles.pinKind}>{entityKindLabels[entity.kind]}</Text>
                <Text style={styles.pinTitle}>{entity.title}</Text>
              </Pressable>
              <Pressable
                onPress={() => togglePin(campaignId, entity.id)}
                accessibilityRole="button"
                accessibilityLabel={`Unpin ${entity.title}`}
                hitSlop={8}
              >
                <Text style={styles.unpin}>Unpin</Text>
              </Pressable>
            </View>
          ))
        )}

        {pinning ? (
          unpinned.length === 0 ? (
            <Text style={styles.empty}>Everything is already pinned.</Text>
          ) : (
            unpinned.map((entity, index) => (
              <Pressable
                key={entity.id}
                onPress={() => togglePin(campaignId, entity.id)}
                accessibilityRole="button"
                accessibilityLabel={`Pin ${entity.title}`}
                style={[styles.pinRow, index === unpinned.length - 1 && styles.pinRowLast]}
              >
                <View style={styles.pinOpen}>
                  <Text style={styles.pinKind}>{entityKindLabels[entity.kind]}</Text>
                  <Text style={styles.pinTitle}>{entity.title}</Text>
                </View>
                <Text style={styles.pinAction}>Pin</Text>
              </Pressable>
            ))
          )
        ) : null}
      </PaperCard>

      <View style={styles.gap}>
        <TabRow tabs={tabs} active={active} onChange={changeTab} />
      </View>

      {active === 'story' ? (
        <View>
          <PaperCard label="The table">
            <InfoRow label="Game master" value="You" />
            <InfoRow label="Players" value={String(item.playerCount)} last />
          </PaperCard>

          {listFor('story').map(entity => (
            <View key={entity.id} style={styles.gap}>
              <StoryCard
                entity={entity}
                onTogglePin={() => togglePin(campaignId, entity.id)}
                onSave={patch => updateEntity(campaignId, entity.id, patch)}
              />
            </View>
          ))}

          <View style={styles.gap}>
            <AddButton label="+ Add detail" onPress={() => addNew('story')} />
          </View>

          <Text style={styles.sectionLabel}>Artifacts</Text>
          {listFor('item').length === 0 ? (
            <Text style={styles.empty}>No artifacts yet.</Text>
          ) : (
            listFor('item').map(entity => (
              <EntityCard
                key={entity.id}
                entity={entity}
                onPress={() => openEntity(entity)}
                onTogglePin={() => togglePin(campaignId, entity.id)}
              />
            ))
          )}
        </View>
      ) : null}

      {active === 'characters' && hasParty ? (
        <View style={styles.gap}>
          <PaperCard label="The party">
            {campaign.roster.map(player => (
              <PartyRow
                key={player.id}
                name={player.name}
                initial={player.initial}
                meta={player.isYou ? `${player.meta} · your character` : `${player.meta} · played by ${player.playedBy}`}
                tint={player.tint}
                isYou={player.isYou}
                onPress={() => router.push(`/dm/${campaignId}/character/${player.id}` as never)}
              />
            ))}
          </PaperCard>
        </View>
      ) : null}

      {currentKind ? (
        <View style={styles.gap}>
          {listFor(currentKind).length === 0 ? (
            <Text style={styles.empty}>Nothing here yet.</Text>
          ) : (
            listFor(currentKind).map(entity => (
              <EntityCard
                key={entity.id}
                entity={entity}
                onPress={() => openEntity(entity)}
                onTogglePin={() => togglePin(campaignId, entity.id)}
              />
            ))
          )}
          <AddButton
            label={`+ Add ${entityKindLabels[currentKind].toLowerCase()}`}
            onPress={() => addNew(currentKind)}
          />
        </View>
      ) : null}
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
  nextTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 25,
    color: colors.ink,
    marginBottom: 4,
  },
  empty: {
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    lineHeight: 19,
    color: colors.muted,
  },
  sectionLabel: {
    marginTop: 16,
    marginBottom: 8,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  gap: {
    marginTop: 11,
  },
  pinnedHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pinnedLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  pinnedToggle: {
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  pinRowLast: {
    borderBottomWidth: 0,
  },
  pinOpen: {
    flex: 1,
  },
  pinKind: {
    fontFamily: fonts.body,
    fontSize: 9.5,
    lineHeight: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  pinTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 21,
    color: colors.ink,
  },
  unpin: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.hp,
  },
  pinAction: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.green,
  },
});
