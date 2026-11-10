import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

export type TabItem<K extends string> = {
  key: K;
  label: string;
};

type Props<K extends string> = {
  tabs: TabItem<K>[];
  active: K;
  onChange: (key: K) => void;
};

/** Inked section tabs with a gold underline on the active tab. */
export function TabRow<K extends string>({ tabs, active, onChange }: Props<K>) {
  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {tabs.map(tab => {
          const selected = tab.key === active;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={tab.label}
              style={styles.tab}
            >
              <Text style={[styles.label, selected && styles.labelActive]}>{tab.label}</Text>
              <View style={[styles.underline, selected && styles.underlineActive]} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
    marginBottom: 14,
  },
  content: {
    gap: 16,
    paddingRight: 6,
  },
  tab: {
    paddingBottom: 7,
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 20,
    color: colors.muted,
  },
  labelActive: {
    color: colors.ink,
  },
  underline: {
    height: 2,
    width: '100%',
    marginTop: 2,
    backgroundColor: 'transparent',
  },
  underlineActive: {
    backgroundColor: colors.goldDark,
  },
});
