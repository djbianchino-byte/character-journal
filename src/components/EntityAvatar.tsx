import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

type Props = {
  initial: string;
  tint: string;
  imageUri?: string;
  size?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** An entry's round portrait: its initials, or the image once one is added. */
export function EntityAvatar({
  initial,
  tint,
  imageUri,
  size = 42,
  onPress,
  accessibilityLabel,
}: Props) {
  const circle = (
    <View
      style={[
        styles.frame,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: imageUri ? '#2a1600' : tint,
        },
      ]}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      ) : (
        <Text
          style={[
            styles.initial,
            { fontSize: Math.round(size * 0.45), lineHeight: Math.round(size * 0.52) },
          ]}
        >
          {initial}
        </Text>
      )}
    </View>
  );

  if (!onPress) {
    return circle;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `Change image for ${initial}`}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
    >
      {circle}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initial: {
    fontFamily: fonts.display,
    color: colors.cream,
  },
  pressed: {
    opacity: 0.75,
  },
});
