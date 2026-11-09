import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onMore?: () => void;
  tall?: boolean;
};

/**
 * Campaign banner used by the campaign-level screens.
 * Same gold treatment as `CharacterHeader`, but the campaign layout:
 * 36pt circular actions, display title and optional campaign subtitle.
 */
export function CampaignHeader({ title, subtitle, onBack, onMore, tall }: Props) {
  return (
    <LinearGradient
      colors={['#2e2110', '#6d5220', '#c9a94e', '#4a3514']}
      locations={[0, 0.34, 0.62, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.wrap, tall && styles.wrapTall]}
    >
      <View style={styles.topRow}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={({ pressed }) => [styles.circle, pressed && styles.circlePressed]}
          >
            <Text style={styles.backGlyph}>‹</Text>
          </Pressable>
        ) : (
          <View style={styles.circleGap} />
        )}

        {onMore ? (
          <Pressable
            onPress={onMore}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Campaign options"
            style={({ pressed }) => [styles.circle, pressed && styles.circlePressed]}
          >
            <Text style={styles.moreGlyph}>•••</Text>
          </Pressable>
        ) : (
          <View style={styles.circleGap} />
        )}
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.title, tall && styles.titleTall]}
          numberOfLines={2}
          accessibilityRole="header"
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  wrapTall: {
    paddingBottom: 22,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 252, 246, 0.45)',
    backgroundColor: 'rgba(41, 19, 9, 0.32)',
  },
  circlePressed: {
    backgroundColor: 'rgba(41, 19, 9, 0.55)',
  },
  circleGap: {
    width: 36,
    height: 36,
  },
  backGlyph: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 30,
    color: colors.textInverse,
    marginTop: -3,
  },
  moreGlyph: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.textInverse,
  },
  content: {
    marginTop: 10,
    gap: 2,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 40,
    color: colors.textInverse,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 2 },
  },
  titleTall: {
    fontSize: 46,
    lineHeight: 50,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 21,
    color: '#fdf3df',
    opacity: 0.94,
  },
});
