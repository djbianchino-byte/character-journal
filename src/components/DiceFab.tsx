import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

const d20Icon = require('../../assets/ui/rail-d20.png');

type Props = {
  style?: StyleProp<ViewStyle>;
};

/** The d20 button that opens dice and attacks. Position comes from the parent. */
export function DiceFab({ style }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/dice' as never)}
      accessibilityRole="button"
      accessibilityLabel="Open dice and attacks"
      style={({ pressed }) => [style, pressed && styles.pressed]}
    >
      <Image source={d20Icon} style={styles.icon} resizeMode="contain" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  icon: {
    width: 72,
    height: 72,
  },
});
