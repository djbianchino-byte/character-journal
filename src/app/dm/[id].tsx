import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { InfoRow, Kicker, PaperCard } from '../../components/PaperCard';
import { PaperScreen } from '../../components/PaperScreen';
import { useCampaigns } from '../../data/campaignList';
import type { JournalSection } from '../../data/journal';
import { colors, fonts } from '../../theme';

/** The lore tabs players can open, named the way the DM talks about them. */
const loreTabs: { section: JournalSection; label: string; blurb: string }[] = [
  { section: 'campaign', label: 'Story', blurb: 'Chapters, last session and artifacts' },
  { section: 'places', label: 'Locations', blurb: 'Towns, ruins and rumours' },
  { section: 'hero', label: 'Characters', blurb: 'The party and faces in the vale' },
  { section: 'events', label: 'Events', blurb: 'What has moved the story forward' },
  { section: 'lore', label: 'Backstory', blurb: 'Appearance, personality and the blight' },
];

export default function DmCampaignScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const campaigns = useCampaigns();
  const item = campaigns.find(entry => entry.id === id);

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

  return (
    <PaperScreen kicker="Dungeon master" title={item.title} onBack={leave}>
      <PaperCard label="Invite code">
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.body}>Players enter this code on the join screen to sit at your table.</Text>
      </PaperCard>

      <PaperCard label="Lore the players see">
        {loreTabs.map((tab, index) => (
          <Pressable
            key={tab.section}
            onPress={() => router.push(`/journal?section=${tab.section}` as never)}
            accessibilityRole="button"
            accessibilityLabel={`Open ${tab.label}`}
            style={({ pressed }) => [
              styles.loreRow,
              index === loreTabs.length - 1 && styles.loreRowLast,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.loreBody}>
              <Text style={styles.loreTitle}>{tab.label}</Text>
              <Text style={styles.loreBlurb}>{tab.blurb}</Text>
            </View>
            <Text style={styles.loreChevron}>›</Text>
          </Pressable>
        ))}
      </PaperCard>

      <PaperCard label="The table">
        <InfoRow label="Game master" value="You" />
        <InfoRow label="Players" value={String(item.playerCount)} last />
        {item.playerCount === 0 ? (
          <Text style={styles.empty}>No players have joined yet. Share the code to fill your seats.</Text>
        ) : null}
      </PaperCard>

      <PaperCard label="Next session">
        <Text style={styles.body}>{item.nextSession}</Text>
      </PaperCard>

      <PaperCard label="About">
        <Kicker>{item.title}</Kicker>
        <Text style={[styles.body, styles.gap]}>{item.description}</Text>
      </PaperCard>
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
    marginTop: 10,
  },
  gap: {
    marginTop: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  loreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  loreRowLast: {
    borderBottomWidth: 0,
  },
  loreBody: {
    flex: 1,
  },
  loreTitle: {
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 22,
    color: colors.ink,
  },
  loreBlurb: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  loreChevron: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 24,
    color: colors.ink,
    opacity: 0.6,
  },
});
