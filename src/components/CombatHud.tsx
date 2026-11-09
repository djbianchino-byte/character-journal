import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme';

type Props = {
  armorClass: number;
  initiative: string;
  hp: { current: number; max: number; temp: number };
};

type TileProps = {
  label: string;
  value: string;
  sub?: string;
  tone?: 'default' | 'hp';
};

function Tile({ label, value, sub, tone = 'default' }: TileProps) {
  return (
    <View
      style={[styles.tile, tone === 'hp' && styles.tileHp]}
      accessibilityLabel={`${label} ${value}${sub ? `, ${sub}` : ''}`}
    >
      <Text style={[styles.tileLabel, tone === 'hp' && styles.tileLabelHp]}>{label}</Text>
      <Text style={[styles.tileValue, tone === 'hp' && styles.tileValueHp]}>{value}</Text>
      {sub ? (
        <Text style={[styles.tileSub, tone === 'hp' && styles.tileSubHp]}>{sub}</Text>
      ) : null}
    </View>
  );
}

/** Floating combat HUD: Armor Class · Initiative · Hit Points. */
export function CombatHud({ armorClass, initiative, hp }: Props) {
  return (
    <View style={styles.wrap}>
      <Tile label="ARMOR CLASS" value={String(armorClass)} sub="Shield" />
      <Tile label="INITIATIVE" value={initiative} sub="Dexterity" />
      <Tile label="HIT POINTS" value={`${hp.current}/${hp.max}`} sub={`Temp ${hp.temp}`} tone="hp" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  tileHp: {
    backgroundColor: colors.hpDark,
    borderColor: '#2b0c0c',
  },
  tileLabel: {
    fontFamily: fonts.data,
    fontSize: 9.5,
    letterSpacing: 1,
    color: colors.textMuted,
  },
  tileLabelHp: {
    color: '#f4d9c4',
  },
  tileValue: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 28,
    color: colors.textPrimary,
    marginTop: 2,
  },
  tileValueHp: {
    color: '#fff3e4',
  },
  tileSub: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textFaint,
  },
  tileSubHp: {
    color: '#e7b9a0',
  },
});
