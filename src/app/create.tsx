import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PaperScreen } from '../components/PaperScreen';
import { createCampaign } from '../data/campaignList';
import { colors, fonts, paperShadow, radius } from '../theme';

export default function CreateCampaignScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [nextSession, setNextSession] = useState('');

  const canCreate = title.trim().length >= 3;

  function leave() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/' as never);
  }

  function create() {
    if (!canCreate) {
      return;
    }
    const id = createCampaign({ title, description, nextSession });
    router.dismissAll();
    router.push(`/dm/${id}` as never);
  }

  return (
    <PaperScreen kicker="Run a table" title="Create a campaign" onBack={leave}>
      <View style={styles.panel}>
        <Text style={styles.label}>Campaign name</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. The Ashen Crown"
          placeholderTextColor={colors.muted}
          maxLength={40}
          returnKeyType="next"
          accessibilityLabel="Campaign name"
          style={styles.input}
        />

        <Text style={styles.label}>Short description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="What is the story about?"
          placeholderTextColor={colors.muted}
          multiline
          maxLength={240}
          textAlignVertical="top"
          accessibilityLabel="Short description"
          style={[styles.input, styles.inputMultiline]}
        />

        <Text style={styles.label}>Next session</Text>
        <TextInput
          value={nextSession}
          onChangeText={setNextSession}
          placeholder="e.g. Saturday, 7:00 PM"
          placeholderTextColor={colors.muted}
          maxLength={40}
          accessibilityLabel="Next session"
          style={styles.input}
        />

        <Text style={styles.hint}>You will get an invite code to share with your players.</Text>

        <Pressable
          onPress={create}
          disabled={!canCreate}
          accessibilityRole="button"
          accessibilityLabel="Create campaign"
          accessibilityState={{ disabled: !canCreate }}
          style={({ pressed }) => [
            styles.primary,
            !canCreate && styles.primaryDisabled,
            pressed && canCreate && styles.pressed,
          ]}
        >
          <Text style={styles.primaryText}>Create campaign</Text>
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
  inputMultiline: {
    minHeight: 84,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
    marginTop: 4,
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
  primaryDisabled: {
    opacity: 0.4,
  },
  primaryText: {
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 22,
    color: colors.goldLight,
  },
  pressed: {
    opacity: 0.8,
  },
});
