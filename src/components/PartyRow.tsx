import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius } from '../theme';

type Props = {
  name: string;
  initial: string;
  meta: string;
  tint: string;
  isYou?: boolean;
  onPress?: () => void;
};

/** Party / NPC row used inside the journal. */
export function PartyRow({ name, initial, meta, tint, isYou, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${meta}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.medallion, { backgroundColor: tint }]}>
        <Text style={styles.initial}>{initial}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {meta}
        </Text>
      </View>

      {isYou ? (
        <View style={styles.you}>
          <Text style={styles.youText}>YOU</Text>
        </View>
      ) : (
        <Text style={styles.chevron}>›</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    gap: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  pressed: {
    opacity: 0.7,
  },
  medallion: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 20,
    color: colors.cream,
  },
  body: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 20,
    color: colors.ink,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  you: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  youText: {
    fontFamily: fonts.body,
    fontSize: 8,
    letterSpacing: 1,
    color: colors.ink,
  },
  chevron: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 22,
    color: colors.ink,
    opacity: 0.6,
  },
});
