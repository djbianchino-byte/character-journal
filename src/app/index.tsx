import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PaperScreen } from '../components/PaperScreen';
import { useCampaigns, type CampaignSummary } from '../data/campaignList';
import { colors, fonts, paperShadow, radius } from '../theme';

export default function CampaignsScreen() {
  const router = useRouter();
  const campaigns = useCampaigns();

  return (
    <PaperScreen kicker="Choose a table" title="Your campaigns">
      {campaigns.map(item => (
        <CampaignCard
          key={item.id}
          item={item}
          onPlay={() => router.push('/character' as never)}
          onRunAsDm={() => router.push(`/dm/${item.id}` as never)}
        />
      ))}

      <Pressable
        onPress={() => router.push('/join' as never)}
        accessibilityRole="button"
        accessibilityLabel="Add another campaign"
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
      >
        <Text style={styles.addText}>+ Add another campaign</Text>
      </Pressable>
    </PaperScreen>
  );
}

type CardProps = {
  item: CampaignSummary;
  onPlay: () => void;
  onRunAsDm: () => void;
};

function CampaignCard({ item, onPlay, onRunAsDm }: CardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.role === 'dm' ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>DM</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.cardMeta}>
        GM {item.gameMaster} · {item.playerCount} {item.playerCount === 1 ? 'player' : 'players'}
      </Text>
      <Text style={styles.cardText} numberOfLines={3}>
        {item.description}
      </Text>
      <Text style={styles.cardNext}>Next session · {item.nextSession}</Text>

      <View style={styles.actions}>
        <Pressable
          onPress={onPlay}
          accessibilityRole="button"
          accessibilityLabel={`Play ${item.title}`}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <Text style={styles.actionText}>Play</Text>
        </Pressable>
        <Pressable
          onPress={onRunAsDm}
          accessibilityRole="button"
          accessibilityLabel={`Run ${item.title} as DM`}
          style={({ pressed }) => [styles.actionPrimary, pressed && styles.pressed]}
        >
          <Text style={styles.actionPrimaryText}>Run as DM</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    ...paperShadow,
  },
  pressed: {
    opacity: 0.75,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 27,
    color: colors.ink,
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: colors.green,
  },
  badgeText: {
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.2,
    color: colors.goldLight,
  },
  cardMeta: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    lineHeight: 16,
    color: colors.muted,
    marginTop: 2,
  },
  cardText: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.inkSoft,
    marginTop: 8,
  },
  cardNext: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.ink,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  action: {
    flex: 1,
    height: 40,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.parchmentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 20,
    color: colors.ink,
  },
  actionPrimary: {
    flex: 1,
    height: 40,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#1c2a17',
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPrimaryText: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 20,
    color: colors.goldLight,
  },
  addButton: {
    height: 50,
    marginTop: 4,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 21,
    color: colors.ink,
  },
});
