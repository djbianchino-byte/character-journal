import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, TAB_BAR_HEIGHT } from '../theme';
import { DiceButton } from './DiceButton';
import { TabBar } from './TabBar';

type Props = {
  children: ReactNode;
  showDice?: boolean;
};

/** Shared parchment shell: gradient background, scroll area, dice FAB and tab bar. */
export function ScreenScaffold({ children, showDice = true }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.frame}>
        <LinearGradient
          colors={['#f5e7ca', '#fbf3dd', '#f0e0c0']}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safe} edges={['top']}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: TAB_BAR_HEIGHT + (showDice ? 92 : 24) },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
          {showDice ? <DiceButton /> : null}
          <TabBar />
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // On web the prototype is shown as a centred phone-width column.
    backgroundColor: Platform.OS === 'web' ? '#e2cfab' : colors.parchmentBg,
    alignItems: 'center',
  },
  frame: {
    flex: 1,
    width: '100%',
    ...Platform.select({
      web: {
        maxWidth: 430,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'rgba(61, 32, 0, 0.28)',
        shadowColor: colors.shadow,
        shadowOpacity: 0.25,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 0 },
      },
      default: {},
    }),
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    // Base spacing; the dice button adds extra room above the tab bar.
  },
});
