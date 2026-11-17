import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { BackstoryBox as Box } from '../data/backstoryStore';
import { colors, fonts, radius } from '../theme';
import { PaperCard } from './PaperCard';

type Props = {
  box: Box;
  startEditing?: boolean;
  onSave: (patch: { title: string; body: string }) => void;
  onRemove: () => void;
  style?: object;
};

/** A text box the player added to their backstory. Title and text can be edited, and the box removed. */
export function BackstoryBox({ box, startEditing = false, onSave, onRemove, style }: Props) {
  const [editing, setEditing] = useState(startEditing);
  const [title, setTitle] = useState(box.title);
  const [body, setBody] = useState(box.body);

  function open() {
    setTitle(box.title);
    setBody(box.body);
    setEditing(true);
  }

  function save() {
    onSave({ title, body });
    setEditing(false);
  }

  return (
    <PaperCard
      label={editing ? 'Editing section' : undefined}
      title={editing ? undefined : box.title}
      onAction={editing ? () => setEditing(false) : open}
      actionLabel={editing ? 'Cancel editing' : `Edit ${box.title}`}
      style={style}
    >
      {editing ? (
        <View style={styles.form}>
          <Text style={styles.label}>Title</Text>
          <TextInput value={title} onChangeText={setTitle} maxLength={40} accessibilityLabel="Section title" style={styles.input} />
          <Text style={styles.label}>Text</Text>
          <TextInput
            value={body}
            onChangeText={setBody}
            multiline
            maxLength={1500}
            textAlignVertical="top"
            accessibilityLabel="Section text"
            style={[styles.input, styles.multiline]}
          />
          <View style={styles.actions}>
            <Pressable
              onPress={onRemove}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${box.title}`}
              hitSlop={8}
            >
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
              accessibilityLabel="Save section"
              style={({ pressed }) => [styles.save, pressed && styles.pressed]}
            >
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text style={styles.body}>{box.body || 'Nothing written yet. Tap the quill to add some.'}</Text>
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
    minHeight: 170,
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
});
