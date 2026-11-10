import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts, radius } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  primary?: boolean;
};

/** Full-width action used at the bottom of lists. */
export function AddButton({ label, onPress, primary }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
      ]}
    >
      <Text style={primary ? styles.primaryText : styles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 46,
    marginTop: 4,
    borderRadius: radius.card,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    borderColor: '#1c2a17',
    backgroundColor: colors.green,
  },
  secondary: {
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  pressed: {
    opacity: 0.75,
  },
  primaryText: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 21,
    color: colors.goldLight,
  },
  secondaryText: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 20,
    color: colors.ink,
  },
});
