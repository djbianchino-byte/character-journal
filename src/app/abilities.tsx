import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AbilitiesPanel } from '../components/AbilitiesPanel';
import { ABILITY_HEIGHT, colors, fonts, HEADER_HEIGHT, radius, SHEET_WIDTH } from '../theme';

export default function AbilitiesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [progress] = useState(() => new Animated.Value(0));

  const framed = Platform.OS === 'web' && width >= 560;
  const sheetHeight = framed ? Math.min(844, height - 48) : height;
  const sheetTop = framed ? (height - sheetHeight) / 2 : 0;
  const anchor = sheetTop + (framed ? 0 : insets.top) + HEADER_HEIGHT + ABILITY_HEIGHT;

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
        style={[styles.scrim, { top: anchor }]}
        onPress={close}
        accessibilityRole="button"
        accessibilityLabel="Close abilities and skills"
      />

      <Animated.View
        style={[
          styles.drop,
          framed
            ? { left: (width - SHEET_WIDTH) / 2, width: SHEET_WIDTH, paddingHorizontal: 0 }
            : { left: 12, right: 12 },
          {
            top: anchor,
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
        <View style={[styles.sheet, framed && styles.sheetFramed]}>
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
            style={{ maxHeight: sheetHeight - anchor - 40 }}
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            <AbilitiesPanel />
          </ScrollView>
        </View>
      </Animated.View>
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
});
