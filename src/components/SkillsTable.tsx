import { StyleSheet, Text, View } from 'react-native';

import type { Skill } from '../data/character';
import { colors, fonts } from '../theme';
import { Card } from './Card';

type Props = {
  skills: Skill[];
  proficiencyBonus: string;
};

/** Skills Card — proficiency bonus + 18-row skill table (PROF · ABILITY · SKILL · BONUS). */
export function SkillsTable({ skills, proficiencyBonus }: Props) {
  return (
    <Card title="Skills">
      <View style={styles.profRow}>
        <Text style={styles.profLabel}>Proficiency Bonus</Text>
        <Text style={styles.profValue}>{proficiencyBonus}</Text>
      </View>

      <View style={styles.headerRow}>
        <Text style={[styles.headCell, styles.profCol]}>PROF</Text>
        <Text style={[styles.headCell, styles.abilityCol]}>ABILITY</Text>
        <Text style={[styles.headCell, styles.skillCol]}>SKILL</Text>
        <Text style={[styles.headCell, styles.bonusCol]}>BONUS</Text>
      </View>

      {skills.map((skill, index) => (
        <View
          key={skill.name}
          style={[styles.row, index % 2 === 1 && styles.rowAlt]}
          accessibilityLabel={`${skill.name}, ${skill.ability}, bonus ${skill.bonus}${
            skill.proficient ? ', proficient' : ''
          }`}
        >
          <View style={styles.profCol}>
            <View style={[styles.checkbox, skill.proficient && styles.checkboxOn]}>
              {skill.proficient ? <Text style={styles.check}>✓</Text> : null}
            </View>
          </View>
          <Text style={[styles.ability, styles.abilityCol]}>{skill.ability}</Text>
          <Text style={[styles.skill, styles.skillCol]} numberOfLines={1}>
            {skill.name}
          </Text>
          <Text style={[styles.bonus, styles.bonusCol]}>{skill.bonus}</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  profRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    backgroundColor: colors.cardAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  profLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  profValue: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textPrimary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headCell: {
    fontFamily: fonts.data,
    fontSize: 9.5,
    letterSpacing: 1,
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.parchmentEdge,
  },
  rowAlt: {
    backgroundColor: 'rgba(234, 214, 187, 0.22)',
  },
  profCol: {
    width: 46,
    alignItems: 'center',
  },
  abilityCol: {
    width: 52,
  },
  skillCol: {
    flex: 1,
  },
  bonusCol: {
    width: 52,
    textAlign: 'right',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  check: {
    fontSize: 10,
    lineHeight: 12,
    color: colors.textInverse,
  },
  ability: {
    fontFamily: fonts.data,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.textMuted,
  },
  skill: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textPrimary,
  },
  bonus: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.textPrimary,
  },
});
