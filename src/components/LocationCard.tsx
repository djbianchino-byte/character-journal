import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CampaignLocation } from '../data/campaign';
import { colors, fonts } from '../theme';

type Props = {
  location: CampaignLocation;
  onPress?: () => void;
};

/** Location card: name, region, summary and chevron — used pinned and in lists. */
export function LocationCard({ location, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${location.name}, ${location.region}. ${location.summary}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.top}>
        <View style={[styles.avatar, { backgroundColor: location.tint }]}>
          <Text style={styles.initial}>{location.initial}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={1}>
            {location.name}
          </Text>
          <Text style={styles.region} numberOfLines={1}>
            {location.region}
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>

      <Text style={styles.summary}>{location.summary}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 14,
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
  pressed: {
    opacity: 0.88,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(61, 32, 0, 0.25)',
  },
  initial: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: colors.textInverse,
  },
  body: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.body,
    fontSize: 16.5,
    color: colors.textPrimary,
  },
  region: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: 1,
  },
  chevron: {
    fontSize: 24,
    lineHeight: 26,
    color: colors.textMuted,
  },
  summary: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textPrimary,
  },
});
