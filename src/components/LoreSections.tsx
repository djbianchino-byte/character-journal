import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Character } from '../data/character';
import { colors, fonts } from '../theme';
import { Card } from './Card';
import { OrnamentalDivider } from './OrnamentalDivider';

type Props = {
  lore: Character['lore'];
  onEdit?: () => void;
  onAddRelationship?: () => void;
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field} accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

/** Character lore: appearance/personality, backstory and relationships. */
export function LoreSections({ lore, onEdit, onAddRelationship }: Props) {
  return (
    <View>
      <Card title="Appearance & Personality" onEdit={onEdit} style={styles.cardSpacing}>
        <Text style={styles.heading}>Physical Description</Text>
        <Text style={styles.body}>{lore.physicalDescription}</Text>

        <View style={styles.rule} />

        <View style={styles.grid}>
          <Field label="Age" value={lore.age} />
          <Field label="Height" value={lore.height} />
          <Field label="Weight" value={lore.weight} />
        </View>
        <View style={styles.grid}>
          <Field label="Eyes" value={lore.eyes} />
          <Field label="Hair" value={lore.hair} />
          <Field label="Skin" value={lore.skin} />
        </View>

        <View style={styles.rule} />

        <Text style={styles.subheading}>PERSONALITY TRAITS</Text>
        <Text style={styles.body}>{lore.personalityTraits}</Text>

        <Text style={styles.subheading}>IDEALS</Text>
        <Text style={styles.body}>{lore.ideals}</Text>

        <Text style={styles.subheading}>FLAWS</Text>
        <Text style={styles.body}>{lore.flaws}</Text>
      </Card>

      <OrnamentalDivider label="Backstory" />

      <Card title="Backstory" style={styles.cardSpacing}>
        <Text style={styles.heading}>Early Life</Text>
        <Text style={styles.body}>{lore.earlyLife}</Text>

        <View style={styles.rule} />

        <Text style={styles.heading}>The Blight</Text>
        {lore.theBlight.split('\n\n').map((paragraph) => (
          <Text key={paragraph.slice(0, 24)} style={[styles.body, styles.paragraph]}>
            {paragraph}
          </Text>
        ))}
      </Card>

      <OrnamentalDivider label="Relationships" />

      <Card title="Relationships" style={styles.cardSpacing}>
        {lore.relationships.map((relationship) => (
          <View
            key={relationship.name}
            style={styles.relationship}
            accessibilityLabel={`${relationship.name}, ${relationship.role}`}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{relationship.initial}</Text>
            </View>
            <View style={styles.relationshipBody}>
              <Text style={styles.relationshipName}>{relationship.name}</Text>
              <Text style={styles.relationshipRole}>{relationship.role}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
        ))}

        <Pressable
          onPress={onAddRelationship}
          accessibilityRole="button"
          accessibilityLabel="Add relationship"
          style={styles.addButton}
        >
          <Text style={styles.addGlyph}>＋</Text>
          <Text style={styles.addLabel}>Add relationship</Text>
        </Pressable>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  cardSpacing: {
    marginHorizontal: 16,
    marginBottom: 4,
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subheading: {
    fontFamily: fonts.data,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.textMuted,
    marginTop: 12,
    marginBottom: 4,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  paragraph: {
    marginTop: 6,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderSoft,
    marginVertical: 12,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  field: {
    flex: 1,
    backgroundColor: colors.cardAlt,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  fieldLabel: {
    fontFamily: fonts.data,
    fontSize: 9.5,
    letterSpacing: 1,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 1,
  },
  relationship: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.parchmentEdge,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.parchment200,
  },
  relationshipBody: {
    flex: 1,
  },
  relationshipName: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  relationshipRole: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 22,
    color: colors.textMuted,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.borderSoft,
  },
  addGlyph: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  addLabel: {
    fontFamily: fonts.data,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
});
