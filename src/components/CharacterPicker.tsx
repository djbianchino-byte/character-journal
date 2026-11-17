import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DirectoryCharacter } from '../data/dmStore';
import { colors, fonts } from '../theme';

type Props = {
  characters: DirectoryCharacter[];
  selected: string[];
  onChange: (ids: string[]) => void;
};

/** Choose existing characters to involve in a place, event or character. */
export function CharacterPicker({ characters, selected, onChange }: Props) {
  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter(entry => entry !== id) : [...selected, id]);
  }

  if (characters.length === 0) {
    return <Text style={styles.empty}>No characters to choose from yet.</Text>;
  }

  return (
    <View>
      {characters.map((character, index) => {
        const on = selected.includes(character.id);
        return (
          <Pressable
            key={character.id}
            onPress={() => toggle(character.id)}
            accessibilityRole="checkbox"
            accessibilityLabel={character.name}
            accessibilityState={{ checked: on }}
            style={[styles.row, index === characters.length - 1 && styles.rowLast]}
          >
            <Text style={[styles.mark, on && styles.markOn]}>{on ? '◆' : '◇'}</Text>
            <View style={styles.body}>
              <Text style={styles.name}>{character.name}</Text>
              {character.subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{character.subtitle}</Text> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  mark: {
    width: 14,
    fontSize: 9,
    color: colors.muted,
  },
  markOn: {
    color: colors.goldDark,
  },
  body: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 20,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    lineHeight: 15,
    color: colors.muted,
  },
  empty: {
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    lineHeight: 19,
    color: colors.muted,
  },
});
