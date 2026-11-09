import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

/** Floating d20 button with a transient result bubble (prototype dice roller). */
export function DiceButton() {
  const [result, setResult] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function roll() {
    const value = Math.floor(Math.random() * 20) + 1;
    setResult(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setResult(null), 2600);
  }

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      {result !== null ? (
        <View style={styles.bubble} accessibilityLiveRegion="polite">
          <Text style={styles.bubbleLabel}>d20</Text>
          <Text style={styles.bubbleValue}>{result}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={roll}
        accessibilityRole="button"
        accessibilityLabel="Roll a twenty-sided die"
        style={styles.press}
      >
        <LinearGradient
          colors={['#f6ead2', '#d7a659', '#8a5f1f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.circle}
        >
          <Text style={styles.text}>d20</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 18,
    bottom: 80,
    alignItems: 'flex-end',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  bubbleLabel: {
    fontFamily: fonts.data,
    fontSize: 11,
    color: colors.textMuted,
  },
  bubbleValue: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.textPrimary,
  },
  press: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: colors.shadow,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  circle: {
    flex: 1,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.textPrimary,
  },
});
