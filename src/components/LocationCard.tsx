import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, paperShadow, radius } from '../theme';
import { EntityAvatar } from './EntityAvatar';

type Props = {
  title: string;
  subtitle: string;
  summary: string;
  initial: string;
  tint: string;
  imageUri?: string;
  onPress: () => void;
};

/** Location entry in the journal's Places tab. */
export function LocationCard({ title, subtitle, summary, initial, tint, imageUri, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}${subtitle ? `, ${subtitle}` : ''}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <EntityAvatar initial={initial} tint={tint} imageUri={imageUri} size={44} />

      <View style={styles.body}>
        <Text style={styles.name}>{title}</Text>
        {subtitle ? <Text style={styles.region}>{subtitle}</Text> : null}
        <Text style={styles.summary} numberOfLines={3}>
          {summary}
        </Text>
      </View>

      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    padding: 12,
    marginBottom: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    ...paperShadow,
  },
  pressed: {
    opacity: 0.75,
  },
  body: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 22,
    color: colors.ink,
  },
  region: {
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: colors.muted,
    marginTop: 1,
  },
  summary: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.inkSoft,
    marginTop: 5,
  },
  chevron: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 24,
    color: colors.ink,
    opacity: 0.6,
    marginTop: 8,
  },
});
