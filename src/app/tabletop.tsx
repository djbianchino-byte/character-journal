import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CampaignHeader } from '../components/CampaignHeader';
import { Card } from '../components/Card';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { campaign } from '../data/campaign';
import { colors, fonts } from '../theme';

const DICE = [4, 6, 8, 10, 12, 20] as const;

type Roll = { sides: number; value: number };

function rollDie(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}

export default function TabletopScreen() {
  const router = useRouter();
  const [last, setLast] = useState<Roll | null>(null);
  const [history, setHistory] = useState<Roll[]>([]);

  const partyInitials = useMemo(() => campaign.roster.map((member) => member.initial), []);

  function roll(sides: number) {
    const value = rollDie(sides);
    const next = { sides, value };
    setLast(next);
    setHistory((current) => [next, ...current].slice(0, 5));
  }

  return (
    <ScreenScaffold showDice={false}>
      <CampaignHeader
        title="Tabletop"
        subtitle={campaign.title}
        onBack={() => router.navigate('/' as never)}
        onMore={() => router.push('/notes' as never)}
      />

      <View style={styles.stack}>
        <Card title="Dice Tray">
          <View style={styles.resultWrap}>
            <Text style={styles.resultValue}>{last ? last.value : '—'}</Text>
            <Text style={styles.resultLabel}>
              {last ? `d${last.sides} · ${last.sides === 20 && last.value === 20 ? 'critical!' : 'rolled'}` : 'choose a die'}
            </Text>
          </View>

          <View style={styles.diceRow}>
            {DICE.map((sides) => (
              <Pressable
                key={sides}
                onPress={() => roll(sides)}
                accessibilityRole="button"
                accessibilityLabel={`Roll a ${sides}-sided die`}
                style={({ pressed }) => [styles.die, pressed && styles.diePressed]}
              >
                <Text style={styles.dieLabel}>d{sides}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.historyLabel}>RECENT ROLLS</Text>
          <Text style={styles.history}>
            {history.length === 0
              ? 'No rolls yet.'
              : history.map((entry) => `${entry.value} (d${entry.sides})`).join('  ·  ')}
          </Text>
        </Card>

        <Card title="Next Session">
          <Text style={styles.sessionTitle}>{campaign.nextSession.time}</Text>
          <Text style={styles.body}>{campaign.description}</Text>
          <Pressable
            onPress={() => router.push('/notes' as never)}
            accessibilityRole="link"
            accessibilityLabel="Open last session’s notes"
            style={styles.linkRow}
          >
            <Text style={styles.link}>Last session’s notes</Text>
            <Text style={styles.linkArrow}>→</Text>
          </Pressable>
        </Card>

        <Card title="The Party">
          <View style={styles.partyRow}>
            {campaign.roster.map((member) => (
              <View
                key={member.id}
                style={[styles.partyAvatar, { backgroundColor: member.tint }]}
                accessibilityLabel={member.name}
              >
                <Text style={styles.partyInitial}>{member.initial}</Text>
              </View>
            ))}
            <Text style={styles.partyCount}>
              {partyInitials.length} at the table
            </Text>
          </View>
          <Pressable
            onPress={() => router.navigate('/characters' as never)}
            accessibilityRole="link"
            accessibilityLabel="Open the roster"
            style={styles.linkRow}
          >
            <Text style={styles.link}>Open the roster</Text>
            <Text style={styles.linkArrow}>→</Text>
          </Pressable>
        </Card>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  stack: {
    padding: 16,
    gap: 12,
  },
  resultWrap: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.cardAlt,
  },
  resultValue: {
    fontFamily: fonts.display,
    fontSize: 52,
    lineHeight: 58,
    color: colors.textPrimary,
  },
  resultLabel: {
    fontFamily: fonts.data,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  diceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  die: {
    flexGrow: 1,
    flexBasis: '30%',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.parchment200,
  },
  diePressed: {
    backgroundColor: colors.gold400,
  },
  dieLabel: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textPrimary,
  },
  historyLabel: {
    fontFamily: fonts.data,
    fontSize: 9.5,
    letterSpacing: 1.2,
    color: colors.textMuted,
    marginTop: 14,
  },
  history: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textPrimary,
    marginTop: 2,
  },
  sessionTitle: {
    fontFamily: fonts.display,
    fontSize: 21,
    lineHeight: 26,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
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
  partyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  partyAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(61, 32, 0, 0.25)',
  },
  partyInitial: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.textInverse,
  },
  partyCount: {
    marginLeft: 6,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },
});
