import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import type { EditableFeature, FeatureDraft } from '../data/featuresStore';
import { colors, fonts, radius } from '../theme';
import { PaperCard } from './PaperCard';

type Props = {
  feature: EditableFeature;
  startEditing?: boolean;
  onSave: (draft: FeatureDraft) => void;
  onRemove: () => void;
  style?: StyleProp<ViewStyle>;
};

/** A class feature the player can rewrite, or remove, from the Oath & order page. */
export function ClassFeatureCard({ feature, startEditing = false, onSave, onRemove, style }: Props) {
  const [editing, setEditing] = useState(startEditing);
  const [draft, setDraft] = useState<FeatureDraft>({
    name: feature.name,
    subtitle: feature.subtitle,
    description: feature.description,
    charges: feature.charges,
  });

  function open() {
    setDraft({
      name: feature.name,
      subtitle: feature.subtitle,
      description: feature.description,
      charges: feature.charges,
    });
    setEditing(true);
  }

  function save() {
    onSave(draft);
    setEditing(false);
  }

  return (
    <PaperCard
      label={editing ? 'Editing feature' : feature.subtitle || 'Class feature'}
      title={editing ? undefined : feature.name}
      onAction={editing ? () => setEditing(false) : open}
      actionLabel={editing ? 'Cancel editing' : `Edit ${feature.name}`}
      style={style}
    >
      {editing ? (
        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={draft.name}
            onChangeText={name => setDraft(current => ({ ...current, name }))}
            maxLength={60}
            accessibilityLabel="Feature name"
            style={styles.input}
          />
          <Text style={styles.label}>Summary</Text>
          <TextInput
            value={draft.subtitle}
            onChangeText={subtitle => setDraft(current => ({ ...current, subtitle }))}
            maxLength={80}
            accessibilityLabel="Feature summary"
            style={styles.input}
          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={draft.description}
            onChangeText={description => setDraft(current => ({ ...current, description }))}
            multiline
            maxLength={1500}
            textAlignVertical="top"
            accessibilityLabel="Feature description"
            style={[styles.input, styles.multiline]}
          />
          <Text style={styles.label}>Uses per rest (optional)</Text>
          <TextInput
            value={draft.charges}
            onChangeText={charges => setDraft(current => ({ ...current, charges }))}
            maxLength={12}
            accessibilityLabel="Uses per rest"
            style={styles.input}
          />

          <View style={styles.actions}>
            <Pressable onPress={onRemove} accessibilityRole="button" accessibilityLabel={`Remove ${feature.name}`} hitSlop={8}>
              <Text style={styles.remove}>Remove</Text>
            </Pressable>
            <View style={styles.spacer} />
            <Pressable
              onPress={() => setEditing(false)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={save}
              accessibilityRole="button"
              accessibilityLabel="Save feature"
              style={({ pressed }) => [styles.save, pressed && styles.pressed]}
            >
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          {feature.description
            .split('\n\n')
            .filter(paragraph => paragraph.trim().length > 0)
            .map((paragraph, index) => (
              <Text key={index} style={styles.body}>
                {paragraph}
              </Text>
            ))}
          {feature.charges ? (
            <View style={styles.chargeRow}>
              <Text style={styles.chargeGlyph}>◆</Text>
              <Text style={styles.chargeText}>{feature.charges} uses</Text>
            </View>
          ) : null}
        </>
      )}
    </PaperCard>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 4,
  },
  label: {
    marginTop: 6,
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
    color: colors.ink,
    backgroundColor: 'rgba(255, 252, 246, 0.85)',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 3,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  multiline: {
    minHeight: 130,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.ink,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
  },
  spacer: {
    flex: 1,
  },
  remove: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.hp,
  },
  cancel: {
    paddingVertical: 6,
  },
  cancelText: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.muted,
  },
  save: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: colors.green,
  },
  saveText: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.goldLight,
  },
  pressed: {
    opacity: 0.7,
  },
  chargeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  chargeGlyph: {
    fontSize: 7,
    color: colors.goldDark,
  },
  chargeText: {
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
});
