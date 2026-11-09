import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { CampaignHeader } from '../components/CampaignHeader';
import { OrnamentalDivider } from '../components/OrnamentalDivider';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { campaign } from '../data/campaign';
import { colors, fonts } from '../theme';

export default function CampaignScreen() {
  const router = useRouter();

  const openNotes = () => router.push('/notes' as never);

  return (
    <ScreenScaffold showDice={false}>
      <CampaignHeader
        title={campaign.title}
        tall
        onMore={() => Alert.alert('Campaign options', 'Campaign settings are outside this prototype.')}
      />

      <View style={styles.metaRow}>
        <Text style={styles.gameMaster}>Run by {campaign.gameMaster}</Text>
        <View style={styles.playerPill}>
          <Text style={styles.playerPillText}>{campaign.playerCount} PLAYERS</Text>
        </View>
      </View>

      <Text style={styles.description}>{campaign.description}</Text>

      <OrnamentalDivider />

      <View style={styles.section}>
        <View style={styles.sessionCard}>
          <LinearGradient
            colors={['#e8d79a', '#d7bd57']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dateBadge}
          >
            <Text style={styles.dateMonth}>{campaign.nextSession.month}</Text>
            <Text style={styles.dateDay}>{campaign.nextSession.day}</Text>
          </LinearGradient>

          <View style={styles.sessionBody}>
            <Text style={styles.sessionLabel}>NEXT SESSION</Text>
            <Text style={styles.sessionTime}>{campaign.nextSession.time}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Pressable
          onPress={openNotes}
          accessibilityRole="button"
          accessibilityLabel="Last session’s notes"
          style={({ pressed }) => [styles.notesRow, pressed && styles.pressed]}
        >
          <View style={styles.notesIcon}>
            <Text style={styles.notesGlyph}>❧</Text>
          </View>
          <Text style={styles.notesLabel}>Last session’s notes</Text>
          <Text style={styles.notesChevron}>›</Text>
        </Pressable>
      </View>

      <OrnamentalDivider label="Explore" />

      <View style={styles.section}>
        <View style={styles.quickRow}>
          <QuickTile
            glyph="❖"
            label="Characters"
            detail={`${campaign.playerCount} players`}
            onPress={() => router.navigate('/characters' as never)}
          />
          <QuickTile
            glyph="❧"
            label="Lore"
            detail={`${campaign.locations.length} locations`}
            onPress={() => router.navigate('/lore' as never)}
          />
          <QuickTile
            glyph="⚄"
            label="Tabletop"
            detail="Dice & tools"
            onPress={() => router.navigate('/tabletop' as never)}
          />
        </View>
      </View>
    </ScreenScaffold>
  );
}

function QuickTile({
  glyph,
  label,
  detail,
  onPress,
}: {
  glyph: string;
  label: string;
  detail: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${detail}`}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <Text style={styles.tileGlyph}>{glyph}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileDetail}>{detail}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  gameMaster: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.textPrimary,
  },
  playerPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.parchment200,
  },
  playerPillText: {
    fontFamily: fonts.data,
    fontSize: 9,
    letterSpacing: 0.9,
    color: colors.textPrimary,
  },
  description: {
    paddingHorizontal: 16,
    paddingTop: 10,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textPrimary,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 4,
  },
  dateBadge: {
    width: 56,
    height: 56,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateMonth: {
    fontFamily: fonts.data,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.textPrimary,
  },
  dateDay: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 26,
    color: colors.textPrimary,
  },
  sessionBody: {
    flex: 1,
  },
  sessionLabel: {
    fontFamily: fonts.data,
    fontSize: 10.5,
    letterSpacing: 1.4,
    color: colors.gold,
  },
  sessionTime: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 27,
    color: colors.textPrimary,
    marginTop: 1,
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  notesIcon: {
    width: 28,
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold400,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesGlyph: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  notesLabel: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textPrimary,
  },
  notesChevron: {
    fontSize: 24,
    lineHeight: 26,
    color: colors.textMuted,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.cardAlt,
  },
  tileGlyph: {
    fontSize: 17,
    color: colors.textPrimary,
  },
  tileLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textPrimary,
  },
  tileDetail: {
    fontFamily: fonts.data,
    fontSize: 8.5,
    letterSpacing: 0.5,
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.85,
  },
});
