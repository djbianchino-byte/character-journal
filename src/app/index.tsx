import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PaperScreen } from '../components/PaperScreen';
import { useCampaigns } from '../data/campaignList';
import { colors, fonts, paperShadow, radius } from '../theme';

export default function CampaignsScreen() {
  const router = useRouter();
  const campaigns = useCampaigns();

  return (
    <PaperScreen kicker="Choose a table" title="Your campaigns">
      {campaigns.map(item => (
        <Pressable
          key={item.id}
          onPress={() => router.push('/character' as never)}
          accessibilityRole="button"
          accessibilityLabel={`Open ${item.title}`}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>
              GM {item.gameMaster} · {item.playerCount} {item.playerCount === 1 ? 'player' : 'players'}
            </Text>
            <Text style={styles.cardText} numberOfLines={3}>
              {item.description}
            </Text>
            <Text style={styles.cardNext}>Next session · {item.nextSession}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
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

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 27,
    color: colors.ink,
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
  chevron: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 30,
    color: colors.ink,
    opacity: 0.6,
  },
  addButton: {
    height: 50,
    marginTop: 4,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#1c2a17',
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 22,
    color: colors.goldLight,
  },
});
