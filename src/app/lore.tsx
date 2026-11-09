import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

import { CharacterHeader } from '../components/CharacterHeader';
import { LoreSections } from '../components/LoreSections';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { character } from '../data/character';

export default function LoreScreen() {
  const router = useRouter();
  const editLore = () => Alert.alert('Edit lore', 'Editing is disabled in this prototype.');
  const addRelationship = () =>
    Alert.alert('Add relationship', 'Relationship editor is not part of this prototype.');

  return (
    <ScreenScaffold>
      <CharacterHeader
        name={character.name}
        subtitle={character.subtitle}
        initials={character.initials}
        compact
        onEdit={editLore}
        onBack={() => router.back()}
      />
      <View style={{ paddingTop: 14 }}>
        <LoreSections
          lore={character.lore}
          onEdit={editLore}
          onAddRelationship={addRelationship}
        />
      </View>
    </ScreenScaffold>
  );
}
