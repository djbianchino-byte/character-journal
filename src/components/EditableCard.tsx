import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import type { LoreFields } from '../data/loreStore';
import { colors, fonts } from '../theme';
import { InfoRow, PaperCard } from './PaperCard';

export type EditableField = {
  key: keyof LoreFields;
  label: string;
  multiline?: boolean;
};

type Props = {
  label: string;
  title?: string;
  fields: EditableField[];
  values: LoreFields;
  onSave: (patch: Partial<LoreFields>) => void;
  style?: StyleProp<ViewStyle>;
};

/** Parchment card whose fields can be edited in place with the quill. */
export function EditableCard({ label, title, fields, values, onSave, style }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<LoreFields>>({});

  function startEditing() {
    const next: Partial<LoreFields> = {};
    for (const field of fields) {
      next[field.key] = values[field.key];
    }
    setDraft(next);
    setEditing(true);
  }

  function save() {
    const patch: Partial<LoreFields> = {};
    for (const field of fields) {
      const value = draft[field.key];
      if (value !== undefined && value !== values[field.key]) {
        patch[field.key] = value;
      }
    }
    if (Object.keys(patch).length > 0) {
      onSave(patch);
    }
    setEditing(false);
  }

  return (
    <PaperCard
      label={label}
      title={title}
      onAction={editing ? () => setEditing(false) : startEditing}
      actionLabel={editing ? 'Cancel editing' : `Edit ${label}`}
      style={style}
    >
      {editing ? (
        <View>
          {fields.map(field => (
            <View key={field.key} style={styles.field}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <TextInput
                value={draft[field.key] ?? ''}
                onChangeText={text => setDraft(current => ({ ...current, [field.key]: text }))}
                multiline={field.multiline}
                accessibilityLabel={field.label}
                style={[styles.input, field.multiline && styles.inputMultiline]}
                textAlignVertical={field.multiline ? 'top' : 'center'}
              />
            </View>
          ))}
          <View style={styles.actions}>
            <Pressable
              onPress={() => setEditing(false)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.action, pressed && styles.pressed]}
            >
              <Text style={styles.actionText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={save}
              accessibilityRole="button"
              style={({ pressed }) => [styles.saveAction, pressed && styles.pressed]}
            >
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        fields.map((field, index) =>
          field.multiline ? (
            <View key={field.key} style={index > 0 ? styles.block : undefined}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              {values[field.key]
                .split('\n\n')
                .map((paragraph, paragraphIndex) => (
                  <Text key={paragraphIndex} style={styles.paragraph}>
                    {paragraph}
                  </Text>
                ))}
            </View>
          ) : (
            <InfoRow
              key={field.key}
              label={field.label}
              value={values[field.key]}
              last={index === fields.length - 1}
            />
          ),
        )
      )}
    </PaperCard>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted,
    marginBottom: 3,
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
  inputMultiline: {
    minHeight: 170,
  },
  block: {
    marginTop: 9,
  },
  paragraph: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.ink,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 14,
    marginTop: 4,
  },
  action: {
    paddingVertical: 6,
  },
  actionText: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.muted,
  },
  saveAction: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
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
});
