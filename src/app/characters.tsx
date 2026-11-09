import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AddRow } from '../components/AddRow';
import { CampaignHeader } from '../components/CampaignHeader';
import { CharacterRow } from '../components/CharacterRow';
import { OrnamentalDivider } from '../components/OrnamentalDivider';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { SectionHeading } from '../components/SectionHeading';
import { SortToggle, type SortKey } from '../components/SortToggle';
import { campaign, type Npc, type PlayerCharacter } from '../data/campaign';

function sortByName<T extends { name: string }>(items: T[], sort: SortKey, original: T[]): T[] {
  if (sort === 'alpha') return [...items].sort((a, b) => a.name.localeCompare(b.name));
  return [...items].sort((a, b) => original.indexOf(b) - original.indexOf(a));
}

export default function CharactersScreen() {
  const router = useRouter();
  const [sort, setSort] = useState<SortKey>('alpha');

  const players = useMemo(
    () => sortByName(campaign.roster, sort, campaign.roster),
    [sort],
  );
  const npcs = useMemo(
    () => sortByName(campaign.npcs, sort, campaign.npcs),
    [sort],
  );

  const openPlayer = (player: PlayerCharacter) => {
    if (player.isYou) {
      router.push('/character' as never);
      return;
    }
    Alert.alert(
      player.name,
      `${player.name} is played by ${player.playedBy}. This prototype opens Ser Garyth’s sheet.`,
    );
  };

  const openNpc = (npc: Npc) => {
    Alert.alert(npc.name, `${npc.name} · ${npc.role}. NPC sheets are outside this prototype.`);
  };

  return (
    <ScreenScaffold showDice={false}>
      <CampaignHeader
        title="Characters"
        subtitle={campaign.title}
        onBack={() => router.navigate('/' as never)}
        onMore={() => Alert.alert('Characters', 'Roster settings are outside this prototype.')}
      />

      <SectionHeading
        title="Player Characters"
        right={<SortToggle value={sort} onChange={setSort} />}
      />

      <View style={styles.list}>
        {players.map((player) => (
          <CharacterRow
            key={player.id}
            name={player.name}
            meta={player.meta}
            initial={player.initial}
            tint={player.tint}
            badge={player.isYou ? 'YOU' : undefined}
            onPress={() => openPlayer(player)}
          />
        ))}

        <AddRow
          label="Add character"
          onPress={() => Alert.alert('Add character', 'Character creation is not part of this prototype.')}
        />
      </View>

      <OrnamentalDivider />

      <SectionHeading title="NPCs" right={<SortToggle value={sort} onChange={setSort} />} />

      <View style={styles.list}>
        {npcs.map((npc) => (
          <CharacterRow
            key={npc.id}
            name={npc.name}
            meta={npc.role}
            initial={npc.initial}
            tint={npc.tint}
            tone="npc"
            onPress={() => openNpc(npc)}
          />
        ))}

        <AddRow
          label="Add NPC"
          compact
          onPress={() => Alert.alert('Add NPC', 'NPC creation is not part of this prototype.')}
        />
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    gap: 10,
  },
});
