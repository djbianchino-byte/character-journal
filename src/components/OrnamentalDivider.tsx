import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

type Props = {
  label?: string;
};

/**
 * Ornamental Section Divider — thin rule with a central diamond,
 * matching the parchment dividers in the Figma screens.
 */
export function OrnamentalDivider({ label }: Props) {
  return (
    <View style={styles.row} accessibilityRole="header">
      <View style={styles.line} />
      <Text style={styles.diamond}>◆</Text>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Text style={styles.diamond}>◆</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 12,
    gap: 8,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderSoft,
  },
  diamond: {
    fontSize: 9,
    color: colors.textPrimary,
    opacity: 0.8,
  },
  label: {
    fontFamily: fonts.data,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
});
