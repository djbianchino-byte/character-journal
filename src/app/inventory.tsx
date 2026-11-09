import { StyleSheet, Text, View } from 'react-native';

import { Kicker, PaperCard } from '../components/PaperCard';
import { SheetScaffold } from '../components/SheetScaffold';
import { character, type InventoryItem } from '../data/character';
import { colors, fonts } from '../theme';

const groups: { label: string; types: InventoryItem['type'][] }[] = [
  { label: 'Consumables', types: ['Consumable'] },
  { label: 'Gear & treasure', types: ['Gear', 'Treasure'] },
];

export default function InventoryScreen() {
  const equipped = character.inventory.filter(
    item => item.type === 'Weapon' || item.type === 'Armor',
  );

  return (
    <SheetScaffold active="inventory">
      <View style={styles.intro}>
        <Kicker>Pack &amp; kit</Kicker>
        <Text style={styles.title}>What Garyth carries</Text>
        <Text style={styles.subtitle}>Weapons, supplies, and the small things worth keeping.</Text>
      </View>

      <View style={styles.coinRow}>
        <Coin label="Gold" value={character.coins.gold} />
        <Coin label="Silver" value={character.coins.silver} />
        <Coin label="Copper" value={character.coins.copper} />
      </View>

      <PaperCard label="Equipped" style={styles.gap}>
        {equipped.map(item => (
          <ItemRow key={item.name} item={item} />
        ))}
      </PaperCard>

      {groups.map(group => {
        const items = character.inventory.filter(item => group.types.includes(item.type));
        if (items.length === 0) return null;
        return (
          <PaperCard key={group.label} label={group.label} style={styles.gap}>
            {items.map(item => (
              <ItemRow key={item.name} item={item} />
            ))}
          </PaperCard>
        );
      })}

      <PaperCard label="Attunement" style={styles.gap}>
        <View style={styles.attuneRow}>
          {[0, 1, 2].map(slot => (
            <View key={slot} style={[styles.attuneSlot, slot === 0 && styles.attuneFilled]}>
              <Text style={[styles.attuneGlyph, slot === 0 && styles.attuneGlyphFilled]}>
                {slot === 0 ? '◆' : '◇'}
              </Text>
              <Text style={styles.attuneLabel}>{slot === 0 ? 'Holy Symbol' : 'Empty'}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.attuneNote}>1 of 3 attunement slots filled.</Text>
      </PaperCard>
    </SheetScaffold>
  );
}

function Coin({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.coin}>
      <Text style={styles.coinLabel}>{label}</Text>
      <Text style={styles.coinValue}>{value}</Text>
    </View>
  );
}

function ItemRow({ item }: { item: InventoryItem }) {
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemBody}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>
          {item.type}
          {item.description ? ` · ${item.description}` : ''}
        </Text>
      </View>
      <Text style={styles.itemQty}>{item.qty}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 31,
    lineHeight: 34,
    color: colors.ink,
    marginTop: 2,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.muted,
    marginTop: 3,
  },
  coinRow: {
    flexDirection: 'row',
    gap: 8,
  },
  coin: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: colors.card,
    paddingVertical: 8,
    alignItems: 'center',
  },
  coinLabel: {
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  coinValue: {
    fontFamily: fonts.numeral,
    fontSize: 23,
    lineHeight: 25,
    color: colors.ink,
  },
  gap: {
    marginTop: 11,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  itemBody: {
    flex: 1,
  },
  itemName: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 20,
    color: colors.ink,
  },
  itemDescription: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    lineHeight: 15,
    color: colors.inkSoft,
    marginTop: 1,
  },
  itemQty: {
    fontFamily: fonts.display,
    fontSize: 16,
    lineHeight: 20,
    color: colors.ink,
  },
  attuneRow: {
    flexDirection: 'row',
    gap: 8,
  },
  attuneSlot: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 3,
  },
  attuneFilled: {
    borderColor: colors.border,
    backgroundColor: 'rgba(233, 211, 155, 0.45)',
  },
  attuneGlyph: {
    fontSize: 9,
    color: colors.muted,
  },
  attuneGlyphFilled: {
    color: colors.goldDark,
  },
  attuneLabel: {
    fontFamily: fonts.body,
    fontSize: 9.5,
    lineHeight: 13,
    color: colors.ink,
    textAlign: 'center',
  },
  attuneNote: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 10.5,
    lineHeight: 14,
    color: colors.muted,
  },
});
