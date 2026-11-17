import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AddButton } from '../components/AddButton';
import { ItemEditor } from '../components/ItemEditor';
import { Kicker, PaperCard } from '../components/PaperCard';
import { SheetScaffold } from '../components/SheetScaffold';
import {
  addItem,
  removeItem,
  setCoins,
  updateItem,
  useInventory,
  type Coins,
  type InventoryEntry,
  type ItemType,
} from '../data/inventoryStore';
import { colors, fonts, radius } from '../theme';

const quillIcon = require('../../assets/ui/icon-quill.png');

const groups: { label: string; types: ItemType[] }[] = [
  { label: 'Consumables', types: ['Consumable'] },
  { label: 'Gear & treasure', types: ['Gear', 'Treasure'] },
];

export default function InventoryScreen() {
  const { items, coins } = useInventory();
  const [adding, setAdding] = useState(false);

  const equipped = items.filter(item => item.type === 'Weapon' || item.type === 'Armor');

  return (
    <SheetScaffold active="inventory">
      <View style={styles.intro}>
        <Kicker>Pack &amp; kit</Kicker>
        <Text style={styles.title}>What Garyth carries</Text>
        <Text style={styles.subtitle}>Weapons, supplies, and the small things worth keeping.</Text>
      </View>

      <CoinPurse coins={coins} />

      <PaperCard label="Equipped" style={styles.gap}>
        {equipped.length === 0 ? (
          <Text style={styles.empty}>No weapons or armor carried.</Text>
        ) : (
          equipped.map(item => <ItemRow key={item.id} item={item} />)
        )}
      </PaperCard>

      {groups.map(group => {
        const list = items.filter(item => group.types.includes(item.type));
        return (
          <PaperCard key={group.label} label={group.label} style={styles.gap}>
            {list.length === 0 ? (
              <Text style={styles.empty}>Nothing here yet.</Text>
            ) : (
              list.map(item => <ItemRow key={item.id} item={item} />)
            )}
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

      {adding ? (
        <PaperCard label="New item" style={styles.gap}>
          <ItemEditor
            initial={{ name: '', type: 'Gear', qty: 1, description: '' }}
            saveLabel="Add item"
            onSave={draft => {
              addItem(draft);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        </PaperCard>
      ) : (
        <View style={styles.gap}>
          <AddButton label="+ Add item" onPress={() => setAdding(true)} />
        </View>
      )}
    </SheetScaffold>
  );
}

/** Gold, silver and copper, editable in place. */
function CoinPurse({ coins }: { coins: Coins }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ gold: '', silver: '', copper: '' });

  function startEditing() {
    setDraft({ gold: String(coins.gold), silver: String(coins.silver), copper: String(coins.copper) });
    setEditing(true);
  }

  function save() {
    setCoins({
      gold: Number.parseInt(draft.gold, 10) || 0,
      silver: Number.parseInt(draft.silver, 10) || 0,
      copper: Number.parseInt(draft.copper, 10) || 0,
    });
    setEditing(false);
  }

  const denominations = [
    { key: 'gold', label: 'Gold', value: coins.gold },
    { key: 'silver', label: 'Silver', value: coins.silver },
    { key: 'copper', label: 'Copper', value: coins.copper },
  ] as const;

  return (
    <PaperCard
      label="Coin purse"
      onAction={editing ? () => setEditing(false) : startEditing}
      actionLabel={editing ? 'Cancel editing coins' : 'Edit coins'}
    >
      <View style={styles.coinRow}>
        {denominations.map(denomination =>
          editing ? (
            <View key={denomination.key} style={styles.coin}>
              <Text style={styles.coinLabel}>{denomination.label}</Text>
              <TextInput
                value={draft[denomination.key]}
                onChangeText={text =>
                  setDraft(current => ({ ...current, [denomination.key]: text.replace(/[^0-9]/g, '') }))
                }
                keyboardType="number-pad"
                maxLength={6}
                accessibilityLabel={`${denomination.label} pieces`}
                selectTextOnFocus
                style={styles.coinInput}
              />
            </View>
          ) : (
            <View key={denomination.key} style={styles.coin}>
              <Text style={styles.coinLabel}>{denomination.label}</Text>
              <Text style={styles.coinValue}>{denomination.value}</Text>
            </View>
          ),
        )}
      </View>

      {editing ? (
        <View style={styles.actions}>
          <Pressable
            onPress={() => setEditing(false)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={save}
            accessibilityRole="button"
            accessibilityLabel="Save coins"
            style={({ pressed }) => [styles.save, pressed && styles.pressed]}
          >
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </View>
      ) : null}
    </PaperCard>
  );
}

/** One item; tapping it opens the editor in place. */
function ItemRow({ item }: { item: InventoryEntry }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <View style={styles.editRow}>
        <ItemEditor
          initial={{ name: item.name, type: item.type, qty: item.qty, description: item.description }}
          saveLabel="Save item"
          onSave={draft => {
            updateItem(item.id, draft);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
          onRemove={() => removeItem(item.id)}
        />
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => setEditing(true)}
      accessibilityRole="button"
      accessibilityLabel={`Edit ${item.name}`}
      style={({ pressed }) => [styles.itemRow, pressed && styles.pressed]}
    >
      <View style={styles.itemBody}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>
          {item.type}
          {item.description ? ` · ${item.description}` : ''}
        </Text>
      </View>
      <Image source={quillIcon} style={styles.quill} resizeMode="contain" />
      <Text style={styles.itemQty}>{`x${item.qty}`}</Text>
    </Pressable>
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
  coinInput: {
    width: '100%',
    marginTop: 1,
    paddingVertical: 0,
    fontFamily: fonts.numeral,
    fontSize: 21,
    lineHeight: 25,
    color: colors.ink,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 14,
    marginTop: 10,
  },
  cancel: {
    paddingVertical: 6,
  },
  cancelText: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.muted,
  },
  save: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: colors.green,
  },
  saveText: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.goldLight,
  },
  gap: {
    marginTop: 11,
  },
  empty: {
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    lineHeight: 19,
    color: colors.muted,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  editRow: {
    paddingVertical: 9,
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
  quill: {
    width: 14,
    height: 11,
    marginTop: 4,
    opacity: 0.75,
  },
  pressed: {
    opacity: 0.7,
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
