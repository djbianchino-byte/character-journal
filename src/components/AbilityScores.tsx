import { StyleSheet, Text, View } from 'react-native';

import type { Ability } from '../data/character';
import { colors, fonts } from '../theme';

type Props = {
  abilities: Ability[];
};

/**
 * Ability Scores strip — six 40x65 columns (STR/DEX/CON/INT/WIS/CHA).
 * Kept at the same proportions/order as the Figma component.
 */
export function AbilityScores({ abilities }: Props) {
  return (
    <View style={styles.wrap} accessibilityRole="summary">
      {abilities.map((ability) => (
        <View
          key={ability.key}
          style={styles.item}
          accessibilityLabel={`${ability.label} ${ability.score}, modifier ${ability.mod}`}
        >
          <Text style={styles.label}>{ability.key}</Text>
          <Text style={styles.mod}>{ability.mod}</Text>
          <Text style={styles.score}>{ability.score}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 252, 246, 0.55)',
    borderBottomWidth: 1,
    borderBottomColor: colors.parchmentEdge,
  },
  item: {
    width: 56,
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.display,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.textPrimary,
  },
  mod: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 30,
    color: colors.textPrimary,
  },
  score: {
    fontFamily: fonts.data,
    fontSize: 13,
    color: colors.textMuted,
  },
});
