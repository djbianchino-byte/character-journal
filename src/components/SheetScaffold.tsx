import { useRouter } from 'expo-router';
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

import { character } from '../data/character';
import { journalSections, type JournalSection } from '../data/journal';
import { colors, fonts, radius, SHEET_WIDTH } from '../theme';
import { AbilityStrip } from './AbilityStrip';
import { GoldHeader } from './GoldHeader';

const paper = require('../../assets/ui/paper-texture.jpg');
const bookIcon = require('../../assets/ui/rail-book.png');
const openBookIcon = require('../../assets/ui/rail-open-book.png');
const pouchIcon = require('../../assets/ui/rail-pouch.png');
const classIcon = require('../../assets/ui/rail-class.png');
const acIcon = require('../../assets/ui/rail-ac.png');
const initiativeIcon = require('../../assets/ui/rail-initiative.png');
const heartIcon = require('../../assets/ui/rail-heart.png');
const d20Icon = require('../../assets/ui/rail-d20.png');

export type RailKey = 'journal' | 'inventory' | 'features';

type Props = {
  children: ReactNode;
  variant?: 'home' | 'page';
  active?: RailKey;
  /** Set while a journal page is open; shows the section buttons on the rail. */
  journalSection?: JournalSection;
  onEdit?: () => void;
};

/**
 * The parchment sheet used by every screen: textured paper, gold identity
 * banner, fixed ability strip, floating bookmark rail and d20.
 */
export function SheetScaffold({ children, variant = 'page', active, journalSection, onEdit }: Props) {
  const journalOpen = journalSection !== undefined;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isHome = variant === 'home';
  const framed = Platform.OS === 'web' && width >= 560;

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/' as never);
  }

  return (
    <View style={[styles.root, framed && styles.rootFramed]}>
      <View style={[styles.sheet, framed ? styles.sheetFramed : styles.sheetFull]}>
        <ImageBackground source={paper} resizeMode="cover" style={styles.paper}>
          <SafeAreaView edges={['top']} style={styles.safe}>
            <GoldHeader onBack={goBack} onEdit={onEdit} />
            <AbilityStrip onPress={() => router.push('/abilities' as never)} />

            <View style={styles.body}>
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={[
                  styles.content,
                  isHome ? styles.homeContent : styles.pageContent,
                  { paddingBottom: (isHome ? 214 : 116) + insets.bottom },
                ]}
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="never"
              >
                {children}
              </ScrollView>

              <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
                <View style={styles.railTop}>
                  <RailButton
                    icon={journalOpen ? openBookIcon : bookIcon}
                    label="Open journal"
                    active={journalOpen || active === 'journal'}
                    onPress={() => (journalOpen ? router.replace('/character' as never) : router.push('/journal' as never))}
                  />
                  {journalSection !== undefined ? (
                    <View style={styles.sectionStack} accessibilityRole="tablist">
                      {journalSections.map(section => {
                        const selected = section.key === journalSection;
                        return (
                          <Pressable
                            key={section.key}
                            onPress={() => router.replace(`/journal?section=${section.key}` as never)}
                            accessibilityRole="tab"
                            accessibilityLabel={section.label}
                            accessibilityState={{ selected }}
                            style={({ pressed }) => [
                              styles.sectionTab,
                              selected && styles.sectionTabActive,
                              pressed && styles.railPressed,
                            ]}
                          >
                            <Text style={[styles.sectionText, selected && styles.sectionTextActive]}>
                              {section.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : null}
                  <RailButton
                    icon={pouchIcon}
                    label="Open inventory"
                    active={active === 'inventory'}
                    onPress={() =>
                      active === 'inventory' ? router.replace('/character' as never) : router.push('/inventory' as never)
                    }
                  />
                </View>

                {isHome ? (
                  <View style={styles.railBottom}>
                    <Pressable
                      onPress={() => router.push('/features' as never)}
                      accessibilityRole="button"
                      accessibilityLabel="Open class features"
                      style={styles.classButton}
                    >
                      <Image source={classIcon} style={styles.classIcon} resizeMode="contain" />
                      <View style={styles.classBadge}>
                        <Text style={styles.classBadgeText}>3</Text>
                      </View>
                    </Pressable>

                    <Image
                      source={acIcon}
                      style={styles.acIcon}
                      resizeMode="contain"
                      accessibilityLabel={`Armor class ${character.armorClass}`}
                    />

                    <View style={styles.initiativeRow}>
                      <Image source={initiativeIcon} style={styles.initiativeIcon} resizeMode="contain" />
                      <Text style={styles.initiativeValue}>{character.initiative}</Text>
                    </View>

                    <View style={styles.hpBar}>
                      <Image source={heartIcon} style={styles.heart} resizeMode="contain" />
                      <View style={styles.hpText}>
                        <Text style={styles.hpLabel}>HIT POINTS</Text>
                        <Text style={styles.hpValue}>
                          {character.hp.current} / {character.hp.max}
                        </Text>
                      </View>
                      <View style={styles.temp}>
                        <Text style={styles.tempValue}>{character.hp.temp}</Text>
                        <Text style={styles.tempLabel}>TEMP</Text>
                      </View>
                    </View>
                  </View>
                ) : null}

                <Pressable
                  onPress={() => router.push('/dice' as never)}
                  accessibilityRole="button"
                  accessibilityLabel="Open dice and attacks"
                  style={({ pressed }) => [styles.dice, pressed && styles.dicePressed]}
                >
                  <Image source={d20Icon} style={styles.diceIcon} resizeMode="contain" />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    </View>
  );
}

type RailButtonProps = {
  icon: number;
  label: string;
  active: boolean;
  onPress: () => void;
};

function RailButton({ icon, label, active, onPress }: RailButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [styles.railButton, pressed && styles.railPressed]}
    >
      <Image source={icon} style={[styles.railIcon, !active && styles.railIconIdle]} resizeMode="contain" />
      <View style={[styles.activeMark, !active && styles.activeMarkHidden]} />
    </Pressable>
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
    backgroundColor: colors.parchment,
    overflow: 'hidden',
  },
  sheetFull: {
    flex: 1,
  },
  sheetFramed: {
    width: SHEET_WIDTH,
    height: '100%',
    maxHeight: 844,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    borderRadius: radius.sheet,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.35)',
    shadowColor: '#000000',
    shadowOpacity: 0.55,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
  },
  paper: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
  },
  homeContent: {
    paddingLeft: 74,
    paddingRight: 14,
  },
  pageContent: {
    paddingLeft: 66,
    paddingRight: 12,
  },
  sectionStack: {
    gap: 6,
    marginLeft: 1,
  },
  sectionTab: {
    width: 56,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    backgroundColor: colors.card,
  },
  sectionTabActive: {
    backgroundColor: colors.ink,
  },
  sectionText: {
    fontFamily: fonts.display,
    fontSize: 11,
    lineHeight: 13,
    color: colors.ink,
  },
  sectionTextActive: {
    color: colors.cream,
  },
  railTop: {
    position: 'absolute',
    left: 5,
    top: 10,
    alignItems: 'center',
    gap: 16,
  },
  railButton: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  railPressed: {
    opacity: 0.7,
  },
  railIcon: {
    width: 40,
    height: 38,
  },
  railIconIdle: {
    opacity: 0.72,
  },
  activeMark: {
    width: 5,
    height: 5,
    marginTop: 1,
    backgroundColor: colors.goldDark,
    transform: [{ rotate: '45deg' }],
  },
  activeMarkHidden: {
    backgroundColor: 'transparent',
  },
  railBottom: {
    position: 'absolute',
    left: 7,
    bottom: 10,
    alignItems: 'flex-start',
    gap: 11,
  },
  classButton: {
    width: 52,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classIcon: {
    width: 40,
    height: 51,
  },
  classBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: colors.parchmentLight,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classBadgeText: {
    fontFamily: fonts.numeral,
    fontSize: 10,
    lineHeight: 12,
    color: colors.ink,
  },
  acIcon: {
    width: 45,
    height: 51,
    marginLeft: 2,
  },
  initiativeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingLeft: 2,
  },
  initiativeIcon: {
    width: 31,
    height: 36,
  },
  initiativeValue: {
    fontFamily: fonts.numeral,
    fontSize: 20,
    lineHeight: 22,
    color: colors.ink,
  },
  hpBar: {
    width: 166,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: 'rgba(255, 252, 246, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 6,
  },
  heart: {
    width: 31,
    height: 32,
  },
  hpText: {
    flex: 1,
  },
  hpLabel: {
    fontFamily: fonts.body,
    fontSize: 8,
    lineHeight: 10,
    letterSpacing: 1.1,
    color: colors.muted,
  },
  hpValue: {
    fontFamily: fonts.numeral,
    fontSize: 17,
    lineHeight: 19,
    color: colors.hp,
  },
  temp: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempValue: {
    fontFamily: fonts.numeral,
    fontSize: 11,
    lineHeight: 12,
    color: colors.ink,
  },
  tempLabel: {
    fontFamily: fonts.body,
    fontSize: 4.5,
    lineHeight: 5,
    letterSpacing: 0.4,
    color: colors.muted,
  },
  dice: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 72,
    height: 72,
  },
  dicePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  diceIcon: {
    width: 72,
    height: 72,
  },
});
