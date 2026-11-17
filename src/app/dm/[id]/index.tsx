import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AddButton } from '../../../components/AddButton';
import { EntityCard } from '../../../components/EntityCard';
import { PaperCard } from '../../../components/PaperCard';
import { PaperScreen } from '../../../components/PaperScreen';
import { PartyRow } from '../../../components/PartyRow';
import { PinToggle } from '../../../components/PinToggle';
import { TabRow, type TabItem } from '../../../components/TabRow';
import { campaign } from '../../../data/campaign';
import {
  nextSessionLine,
  updateCampaign,
  useCampaigns,
  type NextSession,
} from '../../../data/campaignList';
import {
  entityKindLabels,
  setSessionLive,
  togglePin,
  useDm,
  type DmEntity,
  type EntityKind,
} from '../../../data/dmStore';
import { colors, fonts, radius } from '../../../theme';

type DmTab = 'campaign' | 'locations' | 'characters' | 'events' | 'items';

const tabs: TabItem<DmTab>[] = [
  { key: 'campaign', label: 'Campaign' },
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
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const [pinning, setPinning] = useState(false);
  const [addStep, setAddStep] = useState<'kinds' | EntityKind | null>(null);

  const active: DmTab = tabs.some(entry => entry.key === tab) ? (tab as DmTab) : 'campaign';

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

  function addNew(kind: EntityKind, pinnedOnAdd = false) {
    router.push(`/dm/${campaignId}/new?kind=${kind}${pinnedOnAdd ? '&pinned=1' : ''}` as never);
  }

  function listFor(kind: EntityKind) {
    return dm.entities.filter(entry => entry.kind === kind);
  }

  const currentKind = tabKind[active];

  return (
    <PaperScreen kicker="Dungeon master" title={item.title} onBack={leave}>
      <PaperCard>
        <View style={styles.pinnedHead}>
          <Pressable
            onPress={() => setPinnedOpen(open => !open)}
            accessibilityRole="button"
            accessibilityLabel="Pinned to campaign"
            accessibilityState={{ expanded: pinnedOpen }}
            style={styles.pinnedTitle}
          >
            <Text style={styles.pinnedLabel}>Pinned to campaign · {pinned.length}</Text>
            <Text style={styles.chevron}>{pinnedOpen ? '▾' : '▸'}</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setPinnedOpen(true);
              setPinning(current => !current);
            }}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={pinning ? 'Done pinning' : 'Pin something to campaign'}
          >
            <Text style={styles.pinnedToggle}>{pinning ? 'Done' : '+ Pin'}</Text>
          </Pressable>
        </View>

        {pinnedOpen ? (
          <View>
            {pinned.length === 0 ? (
              <Text style={styles.empty}>
                Nothing is pinned yet. Pin a location, character, event or item to reveal it to players.
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
          </View>
        ) : null}
      </PaperCard>

      <PaperCard label="Invite code" style={styles.gap}>
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.body}>Players enter this code on the join screen to sit at your table.</Text>
      </PaperCard>

      <NextSessionCard campaignId={campaignId} session={item.nextSession} live={dm.live} />

      <View style={styles.gap}>
        <TabRow tabs={tabs} active={active} onChange={changeTab} />
      </View>

      {active === 'campaign' ? (
        <View>
          <PaperCard label="About">
            <Text style={styles.body}>{item.description}</Text>
          </PaperCard>

          <View style={styles.gap}>
            {pinned.length === 0 ? (
              <Text style={styles.empty}>Nothing is pinned to the campaign yet.</Text>
            ) : (
              pinned.map(entity => (
                <EntityCard
                  key={entity.id}
                  entity={entity}
                  onPress={() => openEntity(entity)}
                  onTogglePin={() => togglePin(campaignId, entity.id)}
                />
              ))
            )}
            <AddButton
              label={addStep ? 'Close' : '+'}
              primary={!addStep}
              onPress={() => setAddStep(addStep ? null : 'kinds')}
            />

            {addStep === 'kinds' ? (
              <PaperCard label="Add to campaign" style={styles.gap}>
                {(['location', 'character', 'event', 'item'] as EntityKind[]).map((kind, index) => (
                  <Pressable
                    key={kind}
                    onPress={() => setAddStep(kind)}
                    accessibilityRole="button"
                    accessibilityLabel={`Choose ${entityKindLabels[kind]}`}
                    style={[styles.pinRow, index === 3 && styles.pinRowLast]}
                  >
                    <Text style={styles.pinTitle}>{entityKindLabels[kind]}</Text>
                    <Text style={styles.chevron}>›</Text>
                  </Pressable>
                ))}
              </PaperCard>
            ) : null}

            {addStep && addStep !== 'kinds' ? (
              <PaperCard label={`${entityKindLabels[addStep]}s`} style={styles.gap}>
                <Pressable
                  onPress={() => setAddStep('kinds')}
                  accessibilityRole="button"
                  accessibilityLabel="Back to kinds"
                  style={styles.backLink}
                >
                  <Text style={styles.pinnedToggle}>‹ Back</Text>
                </Pressable>

                {listFor(addStep).length === 0 ? (
                  <Text style={styles.empty}>None yet.</Text>
                ) : (
                  listFor(addStep).map((entity, index, all) => (
                    <View key={entity.id} style={[styles.pickRow, index === all.length - 1 && styles.pinRowLast]}>
                      <Text style={[styles.pinTitle, styles.pickTitle]} numberOfLines={1}>
                        {entity.title}
                      </Text>
                      <PinToggle
                        pinned={entity.pinned}
                        onToggle={() => togglePin(campaignId, entity.id)}
                        title={entity.title}
                      />
                    </View>
                  ))
                )}

                <View style={styles.gap}>
                  <AddButton label={`+ Create new ${entityKindLabels[addStep].toLowerCase()}`} onPress={() => addNew(addStep, true)} />
                </View>
              </PaperCard>
            ) : null}
          </View>
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
                meta={player.meta}
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

type NextSessionCardProps = {
  campaignId: string;
  session: NextSession;
  live: boolean;
};

/** What players see for the next session: date, time and meeting place. The DM edits it here. */
function NextSessionCard({ campaignId, session, live }: NextSessionCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<NextSession>(session);

  function open() {
    setDraft(session);
    setEditing(true);
  }

  function save() {
    updateCampaign(campaignId, { nextSession: draft });
    setEditing(false);
  }

  return (
    <PaperCard
      label="Next session"
      onAction={editing ? () => setEditing(false) : open}
      actionLabel={editing ? 'Cancel editing next session' : 'Edit next session'}
      style={styles.gap}
    >
      {editing ? (
        <View style={styles.sessionForm}>
          <View style={styles.sessionRow}>
            <View style={styles.sessionMonth}>
              <Text style={styles.fieldLabel}>Month</Text>
              <TextInput
                value={draft.month}
                onChangeText={month => setDraft(current => ({ ...current, month }))}
                maxLength={9}
                accessibilityLabel="Next session month"
                style={styles.fieldInput}
              />
            </View>
            <View style={styles.sessionDay}>
              <Text style={styles.fieldLabel}>Day</Text>
              <TextInput
                value={draft.day}
                onChangeText={day => setDraft(current => ({ ...current, day }))}
                maxLength={4}
                accessibilityLabel="Next session day"
                style={styles.fieldInput}
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>Time</Text>
          <TextInput
            value={draft.time}
            onChangeText={time => setDraft(current => ({ ...current, time }))}
            maxLength={40}
            accessibilityLabel="Next session time"
            style={styles.fieldInput}
          />

          <Text style={styles.fieldLabel}>Where</Text>
          <TextInput
            value={draft.place}
            onChangeText={place => setDraft(current => ({ ...current, place }))}
            maxLength={40}
            accessibilityLabel="Next session place"
            style={styles.fieldInput}
          />

          <View style={styles.sessionActions}>
            <Pressable
              onPress={() => setEditing(false)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.cancel, pressed && styles.dim]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={save}
              accessibilityRole="button"
              accessibilityLabel="Save next session"
              style={({ pressed }) => [styles.save, pressed && styles.dim]}
            >
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.nextTitle}>{nextSessionLine(session)}</Text>
          {session.place ? <Text style={styles.body}>{session.place}</Text> : null}
        </>
      )}

      <Text style={[styles.body, styles.sessionStatus]}>
        {live ? 'The table is live. End the session when you wrap up.' : 'Not started yet.'}
      </Text>
      <AddButton
        label={live ? 'End session' : 'Start session'}
        primary={!live}
        onPress={() => setSessionLive(campaignId, !live)}
      />
    </PaperCard>
  );
}

const styles = StyleSheet.create({
  pickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  pickTitle: {
    flex: 1,
  },
  backLink: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    marginBottom: 4,
  },
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
  sessionForm: {
    gap: 4,
  },
  sessionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sessionMonth: {
    flex: 1,
  },
  sessionDay: {
    width: 86,
  },
  fieldLabel: {
    marginTop: 6,
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  fieldInput: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
    color: colors.ink,
    backgroundColor: 'rgba(255, 252, 246, 0.85)',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 3,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 14,
    marginTop: 10,
  },
  cancel: {
    paddingVertical: 6,
  },
  cancelText: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.muted,
  },
  save: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: colors.green,
  },
  saveText: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.goldLight,
  },
  dim: {
    opacity: 0.7,
  },
  sessionStatus: {
    marginTop: 8,
  },
  empty: {
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    lineHeight: 19,
    color: colors.muted,
  },
  gap: {
    marginTop: 11,
  },
  pinnedHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pinnedTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pinnedLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  chevron: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
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
    marginTop: 6,
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
