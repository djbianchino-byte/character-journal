import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AddButton } from '../components/AddButton';
import { ClassFeatureCard } from '../components/ClassFeatureCard';
import { Kicker, PaperCard } from '../components/PaperCard';
import { SheetScaffold } from '../components/SheetScaffold';
import { attacks, spells } from '../data/features';
import {
  addFeature,
  removeFeature,
  updateFeature,
  useClassFeatures,
} from '../data/featuresStore';
import { colors, fonts } from '../theme';

export default function FeaturesScreen() {
  const features = useClassFeatures();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <SheetScaffold active="features">
      <View style={styles.intro}>
        <Kicker>Oath &amp; order</Kicker>
        <Text style={styles.title}>Paladin of the Dawn</Text>
        <Text style={styles.subtitle}>Level 3 · sacred vows, radiant steel, and a little mercy.</Text>
      </View>

      <PaperCard label="Spellcasting" title="Prepared prayers">
        <View style={styles.spellStats}>
          <View style={styles.spellStat}>
            <Text style={styles.spellStatLabel}>Save DC</Text>
            <Text style={styles.spellStatValue}>{spells.saveDc}</Text>
          </View>
          <View style={styles.spellStatDivider} />
          <View style={styles.spellStat}>
            <Text style={styles.spellStatLabel}>Slots</Text>
            <Text style={styles.spellStatValue}>
              {spells.slots.total - spells.slots.used} / {spells.slots.total}
            </Text>
          </View>
          <View style={styles.spellStatDivider} />
          <View style={styles.spellStat}>
            <Text style={styles.spellStatLabel}>Ability</Text>
            <Text style={styles.spellStatValue}>CHA</Text>
          </View>
        </View>

        {spells.prepared.map(spell => (
          <View key={spell.name} style={styles.spellRow}>
            <View style={styles.slotDot}>
              <Text style={styles.slotDotText}>{spell.level}</Text>
            </View>
            <View style={styles.spellBody}>
              <Text style={styles.spellName}>{spell.name}</Text>
              <Text style={styles.spellNote}>{spell.note}</Text>
            </View>
          </View>
        ))}
      </PaperCard>

      <PaperCard label="Attacks" style={styles.gap}>
        {attacks.map(attack => (
          <View key={attack.id} style={styles.attackRow}>
            <View style={styles.attackBody}>
              <Text style={styles.attackName}>{attack.name}</Text>
              <Text style={styles.attackDetail}>{attack.detail}</Text>
            </View>
            <Text style={styles.attackDamage}>{attack.damage}</Text>
          </View>
        ))}
      </PaperCard>

      {features.map(feature => (
        <ClassFeatureCard
          key={feature.id}
          feature={feature}
          startEditing={feature.id === editingId}
          onSave={draft => updateFeature(feature.id, draft)}
          onRemove={() => removeFeature(feature.id)}
          style={styles.gap}
        />
      ))}

      <View style={styles.gap}>
        <AddButton label="+ Add feature" onPress={() => setEditingId(addFeature())} />
      </View>
    </SheetScaffold>
  );
}

const styles = StyleSheet.create({
  intro: {
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 31,
    lineHeight: 34,
    color: colors.ink,
    marginTop: 2,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.muted,
    marginTop: 3,
  },
  gap: {
    marginTop: 11,
  },
  spellStats: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
    paddingBottom: 9,
    marginBottom: 4,
  },
  spellStat: {
    flex: 1,
    alignItems: 'center',
  },
  spellStatDivider: {
    width: StyleSheet.hairlineWidth,
    height: 26,
    backgroundColor: colors.borderSoft,
  },
  spellStatLabel: {
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  spellStatValue: {
    fontFamily: fonts.numeral,
    fontSize: 20,
    lineHeight: 23,
    color: colors.ink,
  },
  spellRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  slotDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotDotText: {
    fontFamily: fonts.numeral,
    fontSize: 10,
    lineHeight: 12,
    color: colors.ink,
  },
  spellBody: {
    flex: 1,
  },
  spellName: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 20,
    color: colors.ink,
  },
  spellNote: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: colors.muted,
  },
  attackRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  attackBody: {
    flex: 1,
  },
  attackName: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 21,
    color: colors.ink,
  },
  attackDetail: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: colors.muted,
  },
  attackDamage: {
    fontFamily: fonts.numeral,
    fontSize: 15,
    lineHeight: 20,
    color: colors.ink,
    textAlign: 'right',
    maxWidth: 100,
  },
});
