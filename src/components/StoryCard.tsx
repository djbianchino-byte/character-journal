import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { DmEntity } from '../data/dmStore';
import { colors, fonts, paperShadow, radius } from '../theme';
import { PinToggle } from './PinToggle';

const quillIcon = require('../../assets/ui/icon-quill.png');

type Props = {
  entity: DmEntity;
  onTogglePin: () => void;
  onSave: (patch: { title: string; body: string }) => void;
};

/** A story chapter, last session or detail on the DM story page. Editable in place and pinnable. */
export function StoryCard({ entity, onTogglePin, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(entity.title);
  const [body, setBody] = useState(entity.body);

  function startEditing() {
    setTitle(entity.title);
    setBody(entity.body);
    setEditing(true);
  }

  function save() {
    if (title.trim().length > 0) {
      onSave({ title, body });
    }
    setEditing(false);
  }

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.topText}>
          <Text style={styles.kicker}>
            {entity.subtitle ? entity.subtitle : 'Story'}
          </Text>
        </View>
        <View style={styles.actions}>
          <PinToggle pinned={entity.pinned} onToggle={onTogglePin} title={entity.title} />
          <Pressable
            onPress={editing ? () => setEditing(false) : startEditing}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={editing ? `Cancel editing ${entity.title}` : `Edit ${entity.title}`}
          >
            <Image source={quillIcon} style={styles.quill} resizeMode="contain" />
          </Pressable>
        </View>
      </View>

      {editing ? (
        <View style={styles.form}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            maxLength={60}
            accessibilityLabel="Story title"
            style={styles.input}
          />
          <Text style={styles.label}>Story</Text>
          <TextInput
            value={body}
            onChangeText={setBody}
            multiline
            maxLength={1200}
            textAlignVertical="top"
            accessibilityLabel="Story text"
            style={[styles.input, styles.multiline]}
          />
          <View style={styles.formActions}>
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
              accessibilityLabel="Save story"
              style={({ pressed }) => [styles.save, pressed && styles.pressed]}
            >
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>{entity.title}</Text>
          {entity.body.split('\n\n').map((paragraph, index) => (
            <Text key={index} style={[styles.paragraph, index > 0 && styles.paragraphGap]}>
              {paragraph}
            </Text>
          ))}
          {entity.facts.length > 0 ? (
            <View style={styles.facts}>
              <Text style={styles.label}>Loot recovered</Text>
              <Text style={styles.loot}>{entity.facts.join(' · ')}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    ...paperShadow,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  topText: {
    flex: 1,
  },
  kicker: {
    fontFamily: fonts.body,
    fontSize: 9.5,
    lineHeight: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quill: {
    width: 17,
    height: 14,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 25,
    color: colors.ink,
  },
  paragraph: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.ink,
    marginTop: 4,
  },
  paragraphGap: {
    marginTop: 8,
  },
  facts: {
    marginTop: 10,
  },
  label: {
    marginTop: 6,
    marginBottom: 2,
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  loot: {
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    lineHeight: 18,
    color: colors.ink,
  },
  form: {
    gap: 4,
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
    minHeight: 120,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
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
