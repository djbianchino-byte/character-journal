import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PaperScreen } from '../../../components/PaperScreen';
import { addEntity, entityFieldLabels as fieldLabels, entityKindLabels, type EntityKind } from '../../../data/dmStore';
import { colors, fonts, paperShadow, radius } from '../../../theme';

function resolveKind(value: string | undefined): EntityKind {
  return value === 'character' || value === 'event' || value === 'item' || value === 'story' ? value : 'location';
}

export default function NewEntityScreen() {
  const router = useRouter();
  const { id, kind: kindParam } = useLocalSearchParams<{ id: string; kind?: string }>();
  const kind = resolveKind(kindParam);
  const labels = fieldLabels[kind];
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [body, setBody] = useState('');

  const canSave = title.trim().length >= 2;

  function leave() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/' as never);
  }

  function save() {
    if (!canSave) {
      return;
    }
    addEntity(id, { kind, title, subtitle, body });
    leave();
  }

  return (
    <PaperScreen kicker={`New ${entityKindLabels[kind].toLowerCase()}`} title={`Add a ${entityKindLabels[kind].toLowerCase()}`} onBack={leave}>
      <View style={styles.panel}>
        <Text style={styles.label}>{labels.title}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          maxLength={50}
          accessibilityLabel={labels.title}
          style={styles.input}
        />

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
          maxLength={800}
          textAlignVertical="top"
          accessibilityLabel={labels.body}
          style={[styles.input, styles.multiline]}
        />

        <Pressable
          onPress={save}
          disabled={!canSave}
          accessibilityRole="button"
          accessibilityLabel={`Save ${entityKindLabels[kind].toLowerCase()}`}
          accessibilityState={{ disabled: !canSave }}
          style={({ pressed }) => [styles.primary, !canSave && styles.disabled, pressed && canSave && styles.pressed]}
        >
          <Text style={styles.primaryText}>Save</Text>
        </Pressable>
      </View>
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  panel: {
    padding: 16,
    gap: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    ...paperShadow,
  },
  label: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 20,
    color: colors.ink,
    backgroundColor: 'rgba(255, 252, 246, 0.85)',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  multiline: {
    minHeight: 110,
  },
  primary: {
    height: 48,
    marginTop: 6,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#1c2a17',
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.8,
  },
  primaryText: {
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 22,
    color: colors.goldLight,
  },
});
