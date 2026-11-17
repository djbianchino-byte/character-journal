import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AbilitiesPanel } from '../components/AbilitiesPanel';
import { DiceFab } from '../components/DiceFab';
import { useSheetFrame } from '../components/useSheetFrame';
import { colors, fonts, radius } from '../theme';

export default function AbilitiesScreen() {
  const router = useRouter();
  const frame = useSheetFrame();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  function close() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/character' as never);
  }

  return (
    <View style={styles.root} pointerEvents="box-none">
      <Pressable
        style={[styles.scrim, { top: frame.anchor }]}
        onPress={close}
        accessibilityRole="button"
        accessibilityLabel="Close abilities and skills"
      />

      <Animated.View
        style={[
          styles.drop,
          { top: frame.anchor, left: frame.left, width: frame.width },
          {
            opacity: progress,
            transform: [
              {
                translateY: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-18, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.sheet, frame.framed && styles.sheetFramed]}>
          <View style={styles.head}>
            <View>
              <Text style={styles.kicker}>Ser Garyth</Text>
              <Text style={styles.title}>Abilities &amp; skills</Text>
            </View>
            <Pressable
              onPress={close}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close abilities and skills"
              style={styles.close}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            style={{ maxHeight: frame.top + frame.height - frame.anchor - 40 }}
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            <AbilitiesPanel />
          </ScrollView>
        </View>
      </Animated.View>

      {/* Drawn after the panel so the d20 stays on top of it. */}
      <View
        pointerEvents="box-none"
        style={{ position: 'absolute', top: frame.top, left: frame.left, width: frame.width, height: frame.height }}
      >
        <DiceFab style={styles.dice} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.scrim,
  },
  drop: {
    position: 'absolute',
  },
  sheet: {
    backgroundColor: colors.parchmentLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: radius.card,
    borderBottomRightRadius: radius.card,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  sheetFramed: {
    borderRadius: radius.card,
    borderTopWidth: 1,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  kicker: {
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 29,
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
  body: {
    paddingTop: 4,
  },
  dice: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 72,
    height: 72,
  },
});
