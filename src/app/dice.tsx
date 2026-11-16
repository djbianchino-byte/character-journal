import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { attacks } from '../data/features';
import { colors, fonts, radius } from '../theme';

type RollResult = {
  dice: string;
  rolls: number[];
  modifier: number;
  total: number;
};

const dice = [4, 6, 8, 10, 12, 20, 100];

function rollDie(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}

function parseExpression(expression: string) {
  const match = expression.replace(/\s+/g, '').match(/^(\d+)d(\d+)(?:\+(\d+))?$/i);
  if (!match) {
    return { count: 1, sides: 20, modifier: 0 };
  }
  return {
    count: Number(match[1]),
    sides: Number(match[2]),
    modifier: match[3] ? Number(match[3]) : 0,
  };
}

function rollExpression(expression: string): RollResult {
  const { count, sides, modifier } = parseExpression(expression);
  const rolls = Array.from({ length: count }, () => rollDie(sides));
  const total = rolls.reduce((sum, value) => sum + value, 0) + modifier;
  return { dice: expression, rolls, modifier, total };
}

function attackExpression(damage: string) {
  const match = damage.match(/^\d+d\d+(?:\s*\+\s*\d+)?/i);
  return match ? match[0] : '1d8';
}

export default function DiceScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('1d20');
  const [result, setResult] = useState<RollResult | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  function close() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/character' as never);
  }

  function roll() {
    const next = rollExpression(selected);
    setResult(next);
    setHistory(current => [String(next.total), ...current].slice(0, 4));
  }

  return (
    <View style={styles.root}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={close}
        accessibilityRole="button"
        accessibilityLabel="Close dice"
      />

      <View style={styles.card}>
        <View style={styles.head}>
          <View>
            <Text style={styles.kicker}>AT THE TABLE</Text>
            <Text style={styles.title}>Dice &amp; attacks</Text>
          </View>
          <Pressable
            onPress={close}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Close dice"
            style={styles.close}
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <Text style={styles.section}>Standard dice</Text>
        <View style={styles.diceGrid}>
          {dice.map(sides => {
            const expression = `1d${sides}`;
            const active = selected === expression;
            return (
              <Pressable
                key={sides}
                onPress={() => {
                  setSelected(expression);
                  setResult(null);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Select d${sides}`}
                accessibilityState={{ selected: active }}
                style={[styles.die, active && styles.dieActive]}
              >
                <Text style={[styles.dieText, active && styles.dieTextActive]}>d{sides}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>Attacks</Text>
        <View style={styles.attacks}>
          {attacks.map(attack => {
            const expression = attackExpression(attack.damage);
            const active = selected === expression;
            return (
              <Pressable
                key={attack.id}
                onPress={() => {
                  setSelected(expression);
                  setResult(null);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Select ${attack.name}`}
                accessibilityState={{ selected: active }}
                style={[styles.attack, active && styles.attackActive]}
              >
                <View style={styles.attackBody}>
                  <Text style={styles.attackName}>{attack.name}</Text>
                  <Text style={styles.attackDetail}>{attack.detail}</Text>
                </View>
                <Text style={styles.attackDamage}>{attack.damage}</Text>
              </Pressable>
            );
          })}
        </View>

        {result ? (
          <View style={styles.result} accessibilityLiveRegion="polite">
            <Text style={styles.resultTotal}>{result.total}</Text>
            <View style={styles.resultBody}>
              <Text style={styles.resultLabel}>
                {result.dice}
                {result.rolls.length > 1 ? ` · ${result.rolls.join(' + ')}` : ''}
                {result.modifier ? ` + ${result.modifier}` : ''}
              </Text>
              <Text style={styles.resultHint}>Rolled clean. Add it to the story.</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.hint}>Choose a die or an attack, then roll.</Text>
        )}

        {history.length > 0 ? (
          <Text style={styles.history} numberOfLines={2}>
            Recent: {history.join(' · ')}
          </Text>
        ) : null}

        <Pressable
          onPress={roll}
          accessibilityRole="button"
          accessibilityLabel={`Roll ${selected}`}
          style={({ pressed }) => [styles.rollButton, pressed && styles.rollPressed]}
        >
          <Text style={styles.rollText}>Roll {selected}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 358,
    backgroundColor: colors.parchmentLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  kicker: {
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.8,
    color: colors.muted,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 27,
    lineHeight: 30,
    color: colors.ink,
  },
  close: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.ink,
    opacity: 0.7,
  },
  section: {
    marginTop: 14,
    marginBottom: 6,
    fontFamily: fonts.body,
    fontSize: 9.5,
    lineHeight: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  diceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  die: {
    width: 68,
    height: 58,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: 'rgba(234, 214, 187, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dieActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  dieText: {
    fontFamily: fonts.numeral,
    fontSize: 18,
    lineHeight: 21,
    color: colors.ink,
  },
  dieTextActive: {
    color: colors.goldLight,
  },
  attacks: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: 'rgba(234, 214, 187, 0.42)',
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  attack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  attackActive: {
    backgroundColor: 'rgba(233, 211, 155, 0.55)',
  },
  attackBody: {
    flex: 1,
  },
  attackName: {
    fontFamily: fonts.display,
    fontSize: 16,
    lineHeight: 19,
    color: colors.ink,
  },
  attackDetail: {
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    color: colors.muted,
  },
  attackDamage: {
    fontFamily: fonts.numeral,
    fontSize: 13,
    lineHeight: 17,
    color: colors.ink,
    textAlign: 'right',
    maxWidth: 104,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.goldDark,
    borderRadius: radius.card,
    backgroundColor: 'rgba(233, 211, 155, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resultTotal: {
    fontFamily: fonts.numeral,
    fontSize: 34,
    lineHeight: 36,
    color: colors.ink,
  },
  resultBody: {
    flex: 1,
  },
  resultLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 18,
    color: colors.ink,
  },
  resultHint: {
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    color: colors.muted,
  },
  hint: {
    marginTop: 12,
    fontFamily: fonts.displayItalic,
    fontSize: 13,
    lineHeight: 17,
    color: colors.muted,
    textAlign: 'center',
  },
  history: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  rollButton: {
    marginTop: 12,
    height: 46,
    borderRadius: radius.card,
    backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: '#1c2a17',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rollPressed: {
    opacity: 0.86,
  },
  rollText: {
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 22,
    color: colors.goldLight,
  },
});
