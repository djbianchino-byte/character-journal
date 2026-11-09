import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '../theme';

type Props = {
  title?: string;
  onEdit?: () => void;
  editLabel?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Parchment card with a ruled inner border and optional edit action. */
export function Card({ title, onEdit, editLabel = 'Edit', children, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      {title ? (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {onEdit ? (
            <Pressable
              onPress={onEdit}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={editLabel}
            >
              <Text style={styles.edit}>✎</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    shadowColor: colors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  title: {
    fontFamily: fonts.data,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
  edit: {
    fontSize: 16,
    color: colors.textPrimary,
  },
});
