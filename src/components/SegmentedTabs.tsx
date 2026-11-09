import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

export type SegmentOption<T extends string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Folder-tab segmented control used for the campaign lore sections. */
export function SegmentedTabs<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {options.map((option) => {
          const active = option.key === value;
          return (
            <Pressable
              key={option.key}
              onPress={() => onChange(option.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={option.label}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    backgroundColor: 'rgba(239, 223, 191, 0.6)',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 2,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: -1.5,
  },
  tabActive: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderBottomColor: colors.card,
  },
  label: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textFaint,
  },
  labelActive: {
    color: colors.textPrimary,
  },
});
