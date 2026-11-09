import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AbilityScores } from '../components/AbilityScores';
import { Card } from '../components/Card';
import { CharacterHeader } from '../components/CharacterHeader';
import { CombatHud } from '../components/CombatHud';
import { OrnamentalDivider } from '../components/OrnamentalDivider';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { character } from '../data/character';
import { colors, fonts } from '../theme';

function rollDie(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}

export default function HomeScreen() {
  const router = useRouter();

  const editCharacter = () =>
    Alert.alert('Edit character', 'Editing is disabled in this prototype.');

  const rollInitiative = () => {
    const value = rollDie(20);
    Alert.alert('Initiative', `d20 (${value}) + 3 = ${value + 3}`);
  };

  return (
    <ScreenScaffold>
      <CharacterHeader
        name={character.name}
        subtitle={character.subtitle}
        initials={character.initials}
        onEdit={editCharacter}
      />
      <AbilityScores abilities={character.abilities} />

      <View style={styles.hudWrap}>
        <CombatHud
          armorClass={character.armorClass}
          initiative={character.initiative}
          hp={character.hp}
        />
      </View>

      <OrnamentalDivider label="Journal" />

      <View style={styles.section}>
        <Card title="Latest Entry" onEdit={editCharacter}>
          <Text style={styles.entryTitle}>The Blight</Text>
          <Text style={styles.entryBody} numberOfLines={4}>
            {character.lore.theBlight.split('\n\n')[0]}
          </Text>
          <Pressable
            onPress={() => router.push('/lore' as never)}
            accessibilityRole="link"
            accessibilityLabel="Read the full lore"
            style={styles.linkRow}
          >
            <Text style={styles.link}>Read the full lore</Text>
            <Text style={styles.linkArrow}>→</Text>
          </Pressable>
        </Card>
      </View>

      <View style={styles.section}>
        <Card title="Quick Actions">
          <View style={styles.actionRow}>
            <Pressable
              onPress={rollInitiative}
              accessibilityRole="button"
              style={[styles.actionButton, styles.actionPrimary]}
            >
              <Text style={[styles.actionGlyph, styles.actionGlyphPrimary]}>⚔</Text>
              <Text style={[styles.actionLabel, styles.actionLabelPrimary]}>Roll Initiative</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/skills' as never)}
              accessibilityRole="button"
              style={styles.actionButton}
            >
              <Text style={styles.actionGlyph}>✶</Text>
              <Text style={styles.actionLabel}>Skills</Text>
            </Pressable>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Card title="Equipment" onEdit={editCharacter}>
          <Text style={styles.equipSummary}>
            {character.inventory.length} items · {character.coins.gold} gp ·{' '}
            {character.coins.silver} sp · {character.coins.copper} cp
          </Text>
          <Pressable
            onPress={() => router.push('/inventory' as never)}
            accessibilityRole="link"
            accessibilityLabel="Open inventory"
            style={styles.linkRow}
          >
            <Text style={styles.link}>Open inventory</Text>
            <Text style={styles.linkArrow}>→</Text>
          </Pressable>
        </Card>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  hudWrap: {
    paddingTop: 14,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  entryTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  entryBody: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  link: {
    fontFamily: fonts.data,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
  },
  linkArrow: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.cardAlt,
  },
  actionPrimary: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  actionGlyph: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  actionGlyphPrimary: {
    color: colors.parchment200,
  },
  actionLabel: {
    fontFamily: fonts.data,
    fontSize: 10.5,
    letterSpacing: 0.8,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  actionLabelPrimary: {
    color: colors.parchment200,
  },
  equipSummary: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.textPrimary,
  },
});
