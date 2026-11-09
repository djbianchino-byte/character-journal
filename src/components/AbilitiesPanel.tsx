import { StyleSheet, Text, View } from 'react-native';

import { character } from '../data/character';
import { colors, fonts } from '../theme';
import { PaperCard } from './PaperCard';

/** Saving throws, senses and skills. Shown in the drop-down opened from the ability strip. */
export function AbilitiesPanel() {
  return (
    <>
      <PaperCard label="Saving throw proficiencies">
        <View style={styles.savesRow}>
          {character.savingThrows.map((save, index) => (
            <View
              key={save.ability}
              style={[styles.saveCell, index > 0 && styles.saveCellDivider]}
            >
              <Text style={styles.saveLabel}>{save.ability}</Text>
              <Text style={styles.saveValue}>{save.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionRule} />

        <Text style={styles.blockLabel}>Senses</Text>
        <View style={styles.senseRow}>
          <Text style={styles.senseValue}>{character.senses.passivePerception}</Text>
          <Text style={styles.senseLabel}>Passive Perception</Text>
        </View>
        <Text style={styles.darkvision}>Darkvision {character.senses.darkvision}</Text>
      </PaperCard>

      <PaperCard label="Skills" style={styles.skillsCard}>
        <View style={styles.bonusRow}>
          <Text style={styles.bonusLabel}>Proficiency Bonus</Text>
          <Text style={styles.bonusValue}>{character.proficiencyBonus}</Text>
          <View style={styles.bonusDivider} />
          <Text style={styles.bonusLabel}>Passive Perception</Text>
          <Text style={styles.bonusValue}>{character.senses.passivePerception}</Text>
        </View>

        <View style={styles.columnRow}>
          <Text style={styles.column}>Skill</Text>
          <Text style={styles.column}>Ability</Text>
          <Text style={styles.columnBonus}>Bonus</Text>
        </View>

        {character.skills.map(skill => (
          <View key={skill.name} style={styles.skillRow}>
            <Text style={[styles.marker, skill.proficient && styles.markerOn]}>
              {skill.proficient ? '◆' : '◇'}
            </Text>
            <Text style={styles.skillName} numberOfLines={1}>
              {skill.name}
            </Text>
            <Text style={styles.ability}>{skill.ability}</Text>
            <Text style={styles.skillBonus}>{skill.bonus}</Text>
          </View>
        ))}

        <Text style={styles.legend}>◆ proficient · ◇ untrained</Text>
      </PaperCard>
    </>
  );
}

const styles = StyleSheet.create({
  savesRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  saveCell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  saveCellDivider: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: colors.borderSoft,
  },
  saveLabel: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 24,
    color: colors.ink,
  },
  saveValue: {
    fontFamily: fonts.numeral,
    fontSize: 22,
    lineHeight: 24,
    color: colors.ink,
  },
  sectionRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderSoft,
    marginVertical: 11,
  },
  blockLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.ink,
    marginBottom: 6,
  },
  senseRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  senseValue: {
    fontFamily: fonts.numeral,
    fontSize: 22,
    lineHeight: 24,
    color: colors.ink,
  },
  senseLabel: {
    fontFamily: fonts.display,
    fontSize: 16,
    lineHeight: 19,
    color: colors.ink,
  },
  darkvision: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
    color: colors.inkSoft,
    marginTop: 3,
  },
  skillsCard: {
    marginTop: 12,
  },
  bonusRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 7,
    marginBottom: 8,
  },
  bonusLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: colors.muted,
  },
  bonusValue: {
    fontFamily: fonts.numeral,
    fontSize: 17,
    lineHeight: 19,
    color: colors.ink,
  },
  bonusDivider: {
    width: StyleSheet.hairlineWidth,
    height: 14,
    backgroundColor: colors.borderSoft,
    marginHorizontal: 2,
  },
  columnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingBottom: 5,
    marginBottom: 2,
  },
  column: {
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
    flex: 1,
  },
  columnBonus: {
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
    width: 38,
    textAlign: 'right',
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  marker: {
    width: 18,
    fontSize: 9,
    color: colors.muted,
    opacity: 0.6,
  },
  markerOn: {
    color: colors.goldDark,
    opacity: 1,
  },
  skillName: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 21,
    color: colors.ink,
    paddingRight: 6,
  },
  ability: {
    width: 38,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1,
    textAlign: 'center',
    color: colors.muted,
  },
  skillBonus: {
    width: 38,
    fontFamily: fonts.numeral,
    fontSize: 18,
    lineHeight: 21,
    color: colors.ink,
    textAlign: 'right',
  },
  legend: {
    marginTop: 9,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 14,
    color: colors.muted,
    opacity: 0.85,
  },
});
