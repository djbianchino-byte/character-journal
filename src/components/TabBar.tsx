import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '../theme';

const TABS = [
  { href: '/', label: 'Campaign', glyph: '⚔', match: ['/'] },
  { href: '/characters', label: 'Characters', glyph: '❖', match: ['/characters', '/character'] },
  { href: '/lore', label: 'Lore', glyph: '❧', match: ['/lore'] },
  { href: '/tabletop', label: 'Tabletop', glyph: '⚄', match: ['/tabletop'] },
] as const;

/** Bottom tab navigation (custom, parchment style). */
export function TabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((tab) => {
        const active = tab.match.some(
          (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
        );
        return (
          <Pressable
            key={tab.href}
            onPress={() => {
              if (!active) router.navigate(tab.href as never);
            }}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
          >
            <Text style={[styles.glyph, active && styles.glyphActive]}>{tab.glyph}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            <View style={[styles.indicator, active && styles.indicatorActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 6,
    backgroundColor: '#fbf3dd',
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
  },
  glyph: {
    fontSize: 18,
    lineHeight: 22,
    color: colors.textFaint,
  },
  glyphActive: {
    color: colors.textPrimary,
  },
  label: {
    fontFamily: fonts.data,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.textFaint,
    marginTop: 1,
  },
  labelActive: {
    color: colors.textPrimary,
  },
  indicator: {
    width: 18,
    height: 3,
    borderRadius: 2,
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: colors.textPrimary,
  },
});
