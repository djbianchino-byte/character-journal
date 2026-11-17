import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { itemTypes, type ItemDraft, type ItemType } from '../data/inventoryStore';
import { colors, fonts, radius } from '../theme';

type Props = {
  initial: ItemDraft;
  saveLabel: string;
  onSave: (draft: ItemDraft) => void;
  onCancel: () => void;
  onRemove?: () => void;
};

const qtyFromText = (text: string) => {
  const value = Number.parseInt(text.replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(value) && value > 0 ? value : 1;
};

/** Fields for one inventory item: name, kind, quantity and a short note. */
export function ItemEditor({ initial, saveLabel, onSave, onCancel, onRemove }: Props) {
  const [name, setName] = useState(initial.name);
  const [type, setType] = useState<ItemType>(initial.type);
  const [qty, setQty] = useState(String(initial.qty));
  const [description, setDescription] = useState(initial.description);

  const canSave = name.trim().length >= 2;

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Name</Text>
      <TextInput value={name} onChangeText={setName} maxLength={60} accessibilityLabel="Item name" style={styles.input} />

      <Text style={styles.label}>Kind</Text>
      <View style={styles.types}>
        {itemTypes.map(option => {
          const on = option === type;
          return (
            <Pressable
              key={option}
              onPress={() => setType(option)}
              accessibilityRole="radio"
              accessibilityLabel={option}
              accessibilityState={{ selected: on }}
              style={({ pressed }) => [styles.chip, on && styles.chipOn, pressed && styles.pressed]}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.row}>
        <View style={styles.qtyBlock}>
          <Text style={styles.label}>Qty</Text>
          <TextInput
            value={qty}
            onChangeText={setQty}
            keyboardType="number-pad"
            maxLength={4}
            accessibilityLabel="Quantity"
            style={[styles.input, styles.qtyInput]}
          />
        </View>
        <View style={styles.descBlock}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={300}
            textAlignVertical="top"
            accessibilityLabel="Item description"
            style={[styles.input, styles.multiline]}
          />
        </View>
      </View>

      <View style={styles.actions}>
        {onRemove ? (
          <Pressable onPress={onRemove} accessibilityRole="button" accessibilityLabel={`Remove ${initial.name}`} hitSlop={8}>
            <Text style={styles.remove}>Remove</Text>
          </Pressable>
        ) : null}
        <View style={styles.spacer} />
        <Pressable
          onPress={onCancel}
          accessibilityRole="button"
          style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={() => canSave && onSave({ name, type, qty: qtyFromText(qty), description })}
          disabled={!canSave}
          accessibilityRole="button"
          accessibilityLabel={saveLabel}
          accessibilityState={{ disabled: !canSave }}
          style={({ pressed }) => [styles.save, !canSave && styles.disabled, pressed && canSave && styles.pressed]}
        >
          <Text style={styles.saveText}>{saveLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 4,
  },
  label: {
    marginTop: 6,
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
    color: colors.ink,
    backgroundColor: 'rgba(255, 252, 246, 0.85)',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 3,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 252, 246, 0.6)',
  },
  chipOn: {
    borderColor: colors.border,
    backgroundColor: colors.green,
  },
  chipText: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    color: colors.inkSoft,
  },
  chipTextOn: {
    color: colors.goldLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  qtyBlock: {
    width: 64,
  },
  qtyInput: {
    textAlign: 'center',
    fontFamily: fonts.numeral,
    fontSize: 16,
  },
  descBlock: {
    flex: 1,
  },
  multiline: {
    minHeight: 76,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
  },
  spacer: {
    flex: 1,
  },
  remove: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.hp,
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
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
});
