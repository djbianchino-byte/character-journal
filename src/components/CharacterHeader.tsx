import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

type Props = {
  name: string;
  subtitle: string;
  initials: string;
  onBack?: () => void;
  onEdit?: () => void;
  compact?: boolean;
};

/**
 * Character / Header — gold banner with back + edit actions, identity and portrait.
 * Mirrors the Figma instance (390x178) used on every character screen.
 */
export function CharacterHeader({ name, subtitle, initials, onBack, onEdit, compact }: Props) {
  return (
    <LinearGradient
      colors={['#2e2110', '#7a5c1f', '#c9a94e', '#5b431b']}
      locations={[0, 0.34, 0.62, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.wrap, compact && styles.wrapCompact]}
    >
      <View style={styles.topRow}>
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.iconButton}
        >
          <Text style={styles.backGlyph}>‹</Text>
        </Pressable>
        <Pressable
          onPress={onEdit}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Edit character"
          style={styles.iconButton}
        >
          <Text style={styles.editGlyph}>✎</Text>
        </Pressable>
      </View>

      <View style={styles.summary}>
        <View style={styles.identity}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <Text numberOfLines={2} style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>

        <View style={styles.portrait}>
          <LinearGradient
            colors={['#f3e6cf', '#d7a659']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.portraitInner}
          >
            <Text style={styles.initials}>{initials}</Text>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.borderLine} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  wrapCompact: {
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
  },
  iconButton: {
    minWidth: 44,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backGlyph: {
    fontFamily: fonts.display,
    fontSize: 38,
    lineHeight: 34,
    color: colors.textInverse,
    marginTop: -4,
  },
  editGlyph: {
    fontSize: 19,
    color: colors.textInverse,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  identity: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 38,
    color: colors.textInverse,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 18,
    color: '#fdf3df',
    opacity: 0.92,
    marginTop: 2,
  },
  portrait: {
    width: 92,
    height: 92,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.parchment200,
    backgroundColor: '#3a2a12',
    overflow: 'hidden',
  },
  portraitInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: fonts.display,
    fontSize: 34,
    color: colors.textPrimary,
  },
  borderLine: {
    height: 1,
    backgroundColor: 'rgba(61, 32, 0, 0.25)',
    marginTop: 12,
  },
});
