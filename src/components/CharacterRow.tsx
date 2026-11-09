import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

type Props = {
  name: string;
  meta: string;
  initial: string;
  tint: string;
  onPress?: () => void;
  tone?: 'player' | 'npc';
  badge?: string;
};

/** Roster row — player (72pt) and NPC (56pt) variants, parchment card style. */
export function CharacterRow({
  name,
  meta,
  initial,
  tint,
  onPress,
  tone = 'player',
  badge,
}: Props) {
  const npc = tone === 'npc';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${meta}${badge ? `, ${badge}` : ''}`}
      style={({ pressed }) => [styles.row, npc && styles.rowNpc, pressed && styles.pressed]}
    >
      <View style={[styles.avatar, npc && styles.avatarNpc, { backgroundColor: tint }]}>
        <Text style={[styles.initial, npc && styles.initialNpc]}>{initial}</Text>
      </View>

      <View style={styles.body}>
        <Text style={[styles.name, npc && styles.nameNpc]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.meta, npc && styles.metaNpc]} numberOfLines={1}>
          {meta}
        </Text>
      </View>

      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}

      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 72,
    paddingVertical: 12,
    paddingHorizontal: 14,
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
  rowNpc: {
    minHeight: 56,
    paddingVertical: 8,
    borderColor: colors.borderSoft,
    backgroundColor: colors.cardAlt,
  },
  pressed: {
    opacity: 0.86,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(61, 32, 0, 0.25)',
  },
  avatarNpc: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  initial: {
    fontFamily: fonts.display,
    fontSize: 21,
    color: colors.textInverse,
  },
  initialNpc: {
    fontSize: 15,
  },
  body: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.body,
    fontSize: 16.5,
    color: colors.textPrimary,
  },
  nameNpc: {
    fontSize: 15,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.textMuted,
    marginTop: 1,
  },
  metaNpc: {
    fontSize: 11.5,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: colors.parchment200,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  badgeText: {
    fontFamily: fonts.data,
    fontSize: 8.5,
    letterSpacing: 1,
    color: colors.textPrimary,
  },
  chevron: {
    fontSize: 24,
    lineHeight: 26,
    color: colors.textMuted,
  },
});
