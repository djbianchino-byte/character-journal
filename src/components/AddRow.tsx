import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '../theme';

type Props = {
  label: string;
  onPress?: () => void;
  compact?: boolean;
};

/** Dashed "add" row used at the end of roster, location and item lists. */
export function AddRow({ label, onPress, compact }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, compact && styles.rowCompact, pressed && styles.pressed]}
    >
      <Text style={styles.plus}>＋</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 56,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.borderSoft,
    backgroundColor: 'rgba(255, 253, 247, 0.55)',
  },
  rowCompact: {
    minHeight: 44,
  },
  pressed: {
    opacity: 0.8,
  },
  plus: {
    fontSize: 19,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  label: {
    fontFamily: fonts.data,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
});
