import { StyleSheet, Text, View } from 'react-native';

import type { SavingThrow } from '../data/character';
import { colors, fonts } from '../theme';
import { Card } from './Card';

type Props = {
  savingThrows: SavingThrow[];
  passivePerception: number;
  darkvision: string;
  onEdit?: () => void;
};

/** Card / Saving Throws & Senses — mirrors the Figma 370x217 component. */
export function SavingThrowsSensesCard({
  savingThrows,
  passivePerception,
  darkvision,
  onEdit,
}: Props) {
  return (
    <Card title="Saving Throws & Senses" onEdit={onEdit}>
      <Text style={styles.subheading}>SAVING THROW PROFICIENCIES</Text>
      <View style={styles.throwRow}>
        {savingThrows.map((save) => (
          <View
            key={save.ability}
            style={styles.throwPill}
            accessibilityLabel={`${save.label} saving throw ${save.value}`}
          >
            <Text style={styles.throwAbility}>{save.ability}</Text>
            <Text style={styles.throwValue}>{save.value}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.subheading, styles.subheadingSpaced]}>SENSES</Text>
      <View style={styles.sensesRow}>
        <View style={styles.sense}>
          <Text style={styles.senseValue}>{passivePerception}</Text>
          <Text style={styles.senseLabel}>Passive Perception</Text>
        </View>
        <View style={styles.senseDivider} />
        <View style={styles.sense}>
          <Text style={styles.senseValue}>{darkvision}</Text>
          <Text style={styles.senseLabel}>Darkvision</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  subheading: {
    fontFamily: fonts.data,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.textMuted,
    marginBottom: 8,
  },
  subheadingSpaced: {
    marginTop: 14,
  },
  throwRow: {
    flexDirection: 'row',
    gap: 8,
  },
  throwPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.cardAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  throwAbility: {
    fontFamily: fonts.data,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textMuted,
  },
  throwValue: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textPrimary,
  },
  sensesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingVertical: 10,
  },
  sense: {
    flex: 1,
    alignItems: 'center',
  },
  senseDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: colors.borderSoft,
  },
  senseValue: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textPrimary,
  },
  senseLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
