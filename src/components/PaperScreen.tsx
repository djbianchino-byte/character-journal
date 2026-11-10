import type { ReactNode } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, radius, SHEET_WIDTH } from '../theme';

const paper = require('../../assets/ui/paper-texture.jpg');
const handIcon = require('../../assets/ui/hand.png');

type Props = {
  kicker: string;
  title: string;
  onBack?: () => void;
  children: ReactNode;
};

/** Parchment page used by the onboarding screens, framed like the character sheet. */
export function PaperScreen({ kicker, title, onBack, children }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const framed = Platform.OS === 'web' && width >= 560;

  return (
    <View style={[styles.root, framed && styles.rootFramed]}>
      <View style={[styles.sheet, framed && styles.sheetFramed]}>
        <ImageBackground source={paper} resizeMode="cover" style={styles.paper}>
          <SafeAreaView edges={['top']} style={styles.safe}>
            <View style={styles.header}>
              {onBack ? (
                <Pressable
                  onPress={onBack}
                  hitSlop={14}
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                  style={styles.back}
                >
                  <Image source={handIcon} style={styles.handIcon} resizeMode="contain" />
                </Pressable>
              ) : null}
              <Text style={styles.kicker}>{kicker}</Text>
              <Text style={styles.title}>{title}</Text>
            </View>

            <ScrollView
              contentContainerStyle={[styles.content, { paddingBottom: 32 + insets.bottom }]}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </SafeAreaView>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backdrop,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rootFramed: {
    padding: 24,
  },
  sheet: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.parchment,
    overflow: 'hidden',
  },
  sheetFramed: {
    width: SHEET_WIDTH,
    height: '100%',
    maxHeight: 844,
    flex: 0,
    borderRadius: radius.sheet,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.35)',
  },
  paper: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 14,
  },
  back: {
    width: 40,
    height: 26,
    justifyContent: 'center',
    marginBottom: 10,
  },
  handIcon: {
    width: 35,
    height: 24,
  },
  kicker: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 35,
    color: colors.ink,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 24,
    gap: 12,
  },
});
