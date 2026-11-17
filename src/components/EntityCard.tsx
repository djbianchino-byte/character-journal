import { Pressable, StyleSheet, Text, View } from 'react-native';

import { entityKindLabels, type DmEntity } from '../data/dmStore';
import { colors, fonts, paperShadow, radius } from '../theme';
import { EntityAvatar } from './EntityAvatar';
import { PinToggle } from './PinToggle';

type Props = {
  entity: DmEntity;
  onPress: () => void;
  onTogglePin: () => void;
};

/** One location, character, event, item or story detail in a DM list. */
export function EntityCard({ entity, onPress, onTogglePin }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${entity.title}, ${entityKindLabels[entity.kind]}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <EntityAvatar initial={entity.initial} tint={entity.tint} imageUri={entity.imageUri} size={42} />

      <View style={styles.body}>
        <Text style={styles.title}>{entity.title}</Text>
        <Text style={styles.kicker}>
          {entityKindLabels[entity.kind]}
          {entity.subtitle ? ` · ${entity.subtitle}` : ''}
        </Text>
        {entity.body ? (
          <Text style={styles.summary} numberOfLines={2}>
            {entity.body}
          </Text>
        ) : null}
      </View>

      <View style={styles.side}>
        <PinToggle pinned={entity.pinned} onToggle={onTogglePin} title={entity.title} />
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    padding: 12,
    marginBottom: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    ...paperShadow,
  },
  pressed: {
    opacity: 0.75,
  },
  body: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 22,
    color: colors.ink,
  },
  kicker: {
    fontFamily: fonts.body,
    fontSize: 9.5,
    lineHeight: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
    marginTop: 1,
  },
  summary: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.inkSoft,
    marginTop: 4,
  },
  side: {
    alignItems: 'flex-end',
    gap: 6,
  },
  chevron: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 24,
    color: colors.ink,
    opacity: 0.6,
  },
});
