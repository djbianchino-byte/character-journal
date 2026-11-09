import { useRouter } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import { AbilityScores } from '../components/AbilityScores';
import { CharacterHeader } from '../components/CharacterHeader';
import { SavingThrowsSensesCard } from '../components/SavingThrowsSensesCard';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { SkillsTable } from '../components/SkillsTable';
import { character } from '../data/character';

export default function SkillsScreen() {
  const router = useRouter();
  const editSkills = () => Alert.alert('Edit skills', 'Editing is disabled in this prototype.');

  return (
    <ScreenScaffold>
      <CharacterHeader
        name={character.name}
        subtitle={character.subtitle}
        initials={character.initials}
        compact
        onEdit={editSkills}
        onBack={() => router.back()}
      />
      <AbilityScores abilities={character.abilities} />

      <View style={styles.stack}>
        <SavingThrowsSensesCard
          savingThrows={character.savingThrows}
          passivePerception={character.senses.passivePerception}
          darkvision={character.senses.darkvision}
          onEdit={editSkills}
        />
        <SkillsTable skills={character.skills} proficiencyBonus={character.proficiencyBonus} />
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  stack: {
    padding: 16,
    gap: 12,
  },
});
