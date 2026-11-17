import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PaperScreen } from '../components/PaperScreen';
import {
  abilityLabels,
  abilityModifier,
  abilityOrder,
  clampScore,
  formatModifier,
  setAbilityScores,
  useAbilityScores,
  type AbilityScores,
} from '../data/abilitiesStore';
import { updateProfile, useProfile } from '../data/profileStore';
import { colors, fonts, paperShadow, radius } from '../theme';

const portrait = require('../../assets/ui/portrait-garyth.jpg');

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useProfile();
  const scores = useAbilityScores();
  const [name, setName] = useState(profile.name);
  const [ancestry, setAncestry] = useState(profile.ancestry);
  const [className, setClassName] = useState(profile.className);
  const [level, setLevel] = useState(String(profile.level));
  const [playedBy, setPlayedBy] = useState(profile.playedBy);
  const [avatarUri, setAvatarUri] = useState<string | null>(profile.avatarUri);
  const [scoreDraft, setScoreDraft] = useState<Record<string, string>>(() =>
    Object.fromEntries(abilityOrder.map(key => [key, String(scores[key])])),
  );

  const canSave = name.trim().length >= 2;

  function leave() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/character' as never);
  }

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Photos needed', 'Allow access to your photos to choose a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  function save() {
    if (!canSave) {
      return;
    }
    const parsed = Math.round(Number(level));
    const nextScores = {} as AbilityScores;
    for (const key of abilityOrder) {
      nextScores[key] = clampScore(Number.parseInt(scoreDraft[key] ?? '', 10));
    }
    setAbilityScores(nextScores);
    updateProfile({
      name: name.trim(),
      ancestry: ancestry.trim() || profile.ancestry,
      className: className.trim() || profile.className,
      level: Number.isFinite(parsed) ? Math.min(20, Math.max(1, parsed)) : profile.level,
      playedBy: playedBy.trim(),
      avatarUri,
    });
    leave();
  }

  return (
    <PaperScreen kicker="Character" title="Edit character" onBack={leave}>
      <View style={styles.panel}>
        <View style={styles.photoRow}>
          <View style={styles.frame}>
            <Image
              source={avatarUri ? { uri: avatarUri } : portrait}
              style={[styles.image, !avatarUri && styles.imageArt]}
              resizeMode="cover"
            />
          </View>
          <View style={styles.photoActions}>
            <Pressable
              onPress={pickPhoto}
              accessibilityRole="button"
              accessibilityLabel="Choose profile picture"
              style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryText}>Choose photo</Text>
            </Pressable>
            {avatarUri ? (
              <Pressable
                onPress={() => setAvatarUri(null)}
                accessibilityRole="button"
                accessibilityLabel="Use the default portrait"
                hitSlop={8}
              >
                <Text style={styles.link}>Use default portrait</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <Text style={styles.label}>Character name</Text>
        <TextInput value={name} onChangeText={setName} maxLength={40} accessibilityLabel="Character name" style={styles.input} />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Ancestry</Text>
            <TextInput value={ancestry} onChangeText={setAncestry} maxLength={30} accessibilityLabel="Ancestry" style={styles.input} />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Class</Text>
            <TextInput value={className} onChangeText={setClassName} maxLength={30} accessibilityLabel="Class" style={styles.input} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Level</Text>
            <TextInput
              value={level}
              onChangeText={setLevel}
              keyboardType="number-pad"
              maxLength={2}
              accessibilityLabel="Level"
              style={styles.input}
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Played by</Text>
            <TextInput value={playedBy} onChangeText={setPlayedBy} maxLength={30} accessibilityLabel="Played by" style={styles.input} />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Ability scores</Text>
        <View style={styles.abilities}>
          {[0, 2, 4].map(start => (
            <View key={start} style={styles.abilityPair}>
              {abilityOrder.slice(start, start + 2).map(key => {
                const score = Number.parseInt(scoreDraft[key] ?? '', 10);
                const mod = abilityModifier(Number.isFinite(score) ? score : 10);
                return (
                  <View key={key} style={styles.ability}>
                    <Text style={styles.label}>{abilityLabels[key]}</Text>
                    <View style={styles.abilityRow}>
                      <TextInput
                        value={scoreDraft[key] ?? ''}
                        onChangeText={text =>
                          setScoreDraft(current => ({ ...current, [key]: text.replace(/[^0-9]/g, '').slice(0, 2) }))
                        }
                        keyboardType="number-pad"
                        maxLength={2}
                        accessibilityLabel={`${abilityLabels[key]} score`}
                        selectTextOnFocus
                        style={[styles.input, styles.scoreInput]}
                      />
                      <Text style={styles.modifier}>{formatModifier(mod)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <Pressable
          onPress={save}
          disabled={!canSave}
          accessibilityRole="button"
          accessibilityLabel="Save character"
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
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 6,
  },
  frame: {
    width: 96,
    height: 96,
    borderWidth: 3,
    borderColor: '#2a1600',
    borderRadius: 2,
    backgroundColor: '#2a1600',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageArt: {
    transform: [{ scale: 1.16 }],
  },
  photoActions: {
    flex: 1,
    gap: 8,
  },
  secondary: {
    height: 40,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.parchmentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 20,
    color: colors.ink,
  },
  link: {
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    color: colors.muted,
    textDecorationLine: 'underline',
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
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionLabel: {
    marginTop: 12,
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.ink,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderSoft,
    paddingTop: 12,
  },
  abilities: {
    gap: 10,
  },
  abilityPair: {
    flexDirection: 'row',
    gap: 10,
  },
  ability: {
    flex: 1,
    minWidth: 0,
  },
  abilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreInput: {
    flex: 1,
    minWidth: 0,
    textAlign: 'center',
    fontFamily: fonts.numeral,
    fontSize: 17,
  },
  modifier: {
    width: 38,
    fontFamily: fonts.numeral,
    fontSize: 20,
    lineHeight: 23,
    color: colors.ink,
    textAlign: 'center',
  },
  half: {
    flex: 1,
  },
  primary: {
    height: 48,
    marginTop: 8,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#1c2a17',
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 22,
    color: colors.goldLight,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.8,
  },
});
