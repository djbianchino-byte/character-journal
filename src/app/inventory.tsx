import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '../components/Card';
import { CharacterHeader } from '../components/CharacterHeader';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { character } from '../data/character';
import { colors, fonts } from '../theme';

const TYPE_STYLE: Record<string, { initial: string; color: string }> = {
  Consumable: { initial: 'C', color: '#5c7a3a' },
  Weapon: { initial: 'W', color: '#7d1d1d' },
  Armor: { initial: 'A', color: '#3d5a80' },
  Gear: { initial: 'G', color: '#6f512b' },
  Treasure: { initial: 'T', color: '#b8892c' },
};

export default function InventoryScreen() {
  const addItem = () => Alert.alert('Add item', 'Item picker is not part of this prototype.');

  return (
    <ScreenScaffold>
      <CharacterHeader
        name={character.name}
        subtitle={character.subtitle}
        initials={character.initials}
        compact
        onEdit={() => Alert.alert('Edit inventory', 'Editing is disabled in this prototype.')}
      />

      <View style={styles.coinRow}>
        <Coin label="Gold" value={character.coins.gold} color="#c9a227" />
        <Coin label="Silver" value={character.coins.silver} color="#b9bcc2" />
        <Coin label="Copper" value={character.coins.copper} color="#b87333" />
      </View>

      <View style={styles.stack}>
        <Card title={`Pack · ${character.inventory.length} items`}>
          {character.inventory.map((item) => {
            const meta = TYPE_STYLE[item.type] ?? TYPE_STYLE.Gear;
            return (
              <View
                key={item.name}
                style={styles.itemRow}
                accessibilityLabel={`${item.name}, ${item.qty}, ${item.type}`}
              >
                <View style={[styles.itemTile, { backgroundColor: meta.color }]}>
                  <Text style={styles.itemInitial}>{meta.initial}</Text>
                </View>
                <View style={styles.itemBody}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemMeta}>
                    {item.type}
                    {item.description ? ` · ${item.description}` : ''}
                  </Text>
                </View>
                <Text style={styles.itemQty}>{item.qty}</Text>
              </View>
            );
          })}

          <Pressable
            onPress={addItem}
            accessibilityRole="button"
            accessibilityLabel="Add item"
            style={styles.addButton}
          >
            <Text style={styles.addGlyph}>＋</Text>
            <Text style={styles.addLabel}>Add item</Text>
          </Pressable>
        </Card>
      </View>
    </ScreenScaffold>
  );
}

function Coin({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.coin} accessibilityLabel={`${value} ${label}`}>
      <View style={[styles.coinDot, { backgroundColor: color }]} />
      <Text style={styles.coinValue}>{value}</Text>
      <Text style={styles.coinLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  coinRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  coin: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  coinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(61,32,0,0.35)',
  },
  coinValue: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.textPrimary,
  },
  coinLabel: {
    fontFamily: fonts.data,
    fontSize: 9.5,
    letterSpacing: 0.8,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  stack: {
    padding: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.parchmentEdge,
  },
  itemTile: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemInitial: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textInverse,
  },
  itemBody: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  itemMeta: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: colors.textMuted,
    marginTop: 1,
  },
  itemQty: {
    fontFamily: fonts.data,
    fontSize: 12,
    color: colors.textMuted,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.borderSoft,
  },
  addGlyph: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  addLabel: {
    fontFamily: fonts.data,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
});
