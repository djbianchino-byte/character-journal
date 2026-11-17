import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DmEntity } from '../data/dmStore';
import { pickImage } from '../data/pickImage';
import { colors, fonts } from '../theme';
import { EntityAvatar } from './EntityAvatar';

type Props = {
  entity: DmEntity;
  onChange: (imageUri: string | null) => void;
};

/** Lets the entry's owner swap the initials bubble for a dropped-in image. */
export function EntityImageEditor({ entity, onChange }: Props) {
  async function choose() {
    const uri = await pickImage();
    if (uri) {
      onChange(uri);
    }
  }

  return (
    <View style={styles.row}>
      <EntityAvatar
        initial={entity.initial}
        tint={entity.tint}
        imageUri={entity.imageUri}
        size={58}
        onPress={choose}
        accessibilityLabel={`Change image for ${entity.title}`}
      />
      <View style={styles.body}>
        <Text style={styles.hint}>
          {entity.imageUri ? 'Image in place of the initials.' : 'Add an image to replace the initials.'}
        </Text>
        <View style={styles.links}>
          <Pressable onPress={choose} accessibilityRole="button" hitSlop={6}>
            <Text style={styles.link}>{entity.imageUri ? 'Change image' : 'Add image'}</Text>
          </Pressable>
          {entity.imageUri ? (
            <Pressable
              onPress={() => onChange(null)}
              accessibilityRole="button"
              accessibilityLabel={`Remove image from ${entity.title}`}
              hitSlop={6}
            >
              <Text style={styles.remove}>Remove image</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    lineHeight: 16,
    color: colors.muted,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  link: {
    fontFamily: fonts.display,
    fontSize: 16,
    lineHeight: 19,
    color: colors.ink,
    textDecorationLine: 'underline',
  },
  remove: {
    fontFamily: fonts.display,
    fontSize: 15,
    lineHeight: 19,
    color: colors.hp,
  },
});
