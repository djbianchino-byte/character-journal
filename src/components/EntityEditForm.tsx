import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { entityFieldLabels, type DirectoryCharacter, type EntityKind } from '../data/dmStore';
import { colors, fonts, radius } from '../theme';
import { CharacterPicker } from './CharacterPicker';

export type EntityFormValues = {
  title: string;
  subtitle: string;
  body: string;
  linked: string[];
};

type Props = {
  kind: EntityKind;
  initial: EntityFormValues;
  characters: DirectoryCharacter[];
  saveLabel: string;
  onSave: (values: EntityFormValues) => void;
  onCancel: () => void;
};

/** Fields for a place, event or character a player writes, plus the characters involved. */
export function EntityEditForm({ kind, initial, characters, saveLabel, onSave, onCancel }: Props) {
  const labels = entityFieldLabels[kind];
  const [title, setTitle] = useState(initial.title);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [body, setBody] = useState(initial.body);
  const [linked, setLinked] = useState(initial.linked);

  const canSave = title.trim().length >= 2;

  return (
    <View style={styles.form}>
      <Text style={styles.label}>{labels.title}</Text>
      <TextInput value={title} onChangeText={setTitle} maxLength={60} accessibilityLabel={labels.title} style={styles.input} />

      <Text style={styles.label}>{labels.subtitle}</Text>
      <TextInput
        value={subtitle}
        onChangeText={setSubtitle}
        maxLength={60}
        accessibilityLabel={labels.subtitle}
        style={styles.input}
      />

      <Text style={styles.label}>{labels.body}</Text>
      <TextInput
        value={body}
        onChangeText={setBody}
        multiline
        maxLength={1200}
        textAlignVertical="top"
        accessibilityLabel={labels.body}
        style={[styles.input, styles.multiline]}
      />

      <Text style={styles.label}>Characters involved</Text>
      <CharacterPicker characters={characters} selected={linked} onChange={setLinked} />

      <View style={styles.actions}>
        <Pressable
          onPress={onCancel}
          accessibilityRole="button"
          style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={() => canSave && onSave({ title, subtitle, body, linked })}
          disabled={!canSave}
          accessibilityRole="button"
          accessibilityLabel={saveLabel}
          accessibilityState={{ disabled: !canSave }}
          style={({ pressed }) => [styles.save, !canSave && styles.disabled, pressed && canSave && styles.pressed]}
        >
          <Text style={styles.saveText}>{saveLabel}</Text>
        </Pressable>
      </View>
    </View>
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
    minHeight: 150,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 14,
    marginTop: 10,
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
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
});
