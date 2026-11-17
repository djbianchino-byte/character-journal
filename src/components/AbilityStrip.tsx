import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  abilityModifier,
  abilityOrder,
  formatModifier,
  useAbilityScores,
} from '../data/abilitiesStore';
import { colors, fonts } from '../theme';

type Props = {
  onPress?: () => void;
};

/** Six ability scores fixed below the banner, closing with an inked rule. */
export function AbilityStrip({ onPress }: Props) {
  const scores = useAbilityScores();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open abilities and skills"
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        {abilityOrder.map(key => (
          <View key={key} style={styles.item}>
            <Text style={styles.label}>{key}</Text>
            <Text style={styles.mod}>{formatModifier(abilityModifier(scores[key]))}</Text>
            <Text style={styles.score}>{scores[key]}</Text>
          </View>
        ))}
      </View>

      <View style={styles.ruleRow}>
        <View style={styles.line} />
        <Text style={styles.sideDiamond}>◆</Text>
        <Text style={styles.diamond}>◆</Text>
        <Text style={styles.sideDiamond}>◆</Text>
        <View style={styles.line} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 75,
    paddingTop: 3,
  },
  pressed: {
    opacity: 0.82,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.display,
    fontSize: 15,
    lineHeight: 16,
    letterSpacing: 3,
    color: colors.ink,
  },
  mod: {
    fontFamily: fonts.numeral,
    fontSize: 28,
    lineHeight: 30,
    color: colors.ink,
  },
  score: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 15,
    color: colors.ink,
    opacity: 0.9,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    height: 10,
    gap: 7,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(61, 32, 0, 0.45)',
  },
  diamond: {
    fontSize: 8,
    color: colors.ink,
  },
  sideDiamond: {
    fontSize: 5,
    color: colors.ink,
    opacity: 0.75,
  },
});
