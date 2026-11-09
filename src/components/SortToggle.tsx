import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

export type SortKey = 'alpha' | 'date';

type Props = {
  value: SortKey;
  onChange: (value: SortKey) => void;
};

/** Two-option list sort control (A–Z / Date created), as on the roster and lore screens. */
export function SortToggle({ value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      {(
        [
          { key: 'alpha', label: 'A–Z' },
          { key: 'date', label: 'Date created' },
        ] as const
      ).map((option) => {
        const active = value === option.key;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Sort by ${option.label}`}
            style={[styles.option, active && styles.optionActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  option: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 5,
  },
  optionActive: {
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textFaint,
  },
  labelActive: {
    color: colors.textPrimary,
  },
});
