import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
      <LinearGradient
        colors={['#f5e7ca', '#fbf3dd', '#f0e0c0']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        {showDice ? <DiceButton /> : null}
        <TabBar />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.parchmentBg,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: TAB_BAR_HEIGHT + 28,
  },
});
