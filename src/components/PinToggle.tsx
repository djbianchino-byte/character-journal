import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '../theme';

type Props = {
  pinned: boolean;
  onToggle: () => void;
  title: string;
};

/** Quiet pin control for the top of a card. Pinned items also show on the campaign home. */
export function PinToggle({ pinned, onToggle, title }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={pinned ? `Unpin ${title}` : `Pin ${title}`}
      accessibilityState={{ selected: pinned }}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <Text style={[styles.mark, pinned && styles.markOn]}>{pinned ? '◆' : '◇'}</Text>
      <Text style={[styles.label, pinned && styles.labelOn]}>{pinned ? 'Pinned' : 'Pin'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  pressed: {
    opacity: 0.6,
  },
  mark: {
    fontSize: 8,
    color: colors.muted,
  },
  markOn: {
    color: colors.goldDark,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 9.5,
    lineHeight: 12,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  labelOn: {
    color: colors.ink,
  },
});
