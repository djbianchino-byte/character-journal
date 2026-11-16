import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import {
  BackstorySection,
  CharactersSection,
  EventsSection,
  PlacesSection,
  StorySection,
  type PartyMember,
} from '../../components/CampaignContent';
import { Kicker, InfoRow, PaperCard } from '../../components/PaperCard';
import { SheetScaffold } from '../../components/SheetScaffold';
import { campaign } from '../../data/campaign';
import { character } from '../../data/character';
import { journalSections, type JournalSection } from '../../data/journal';
import { colors, fonts } from '../../theme';

function resolveSection(value: string | undefined): JournalSection {
  const match = journalSections.find(section => section.key === value);
  return match ? match.key : 'campaign';
}

export default function JournalScreen() {
  const router = useRouter();
  const { section } = useLocalSearchParams<{ section?: string }>();
  const current = resolveSection(section);

  function openCharacter(player: PartyMember) {
    if (player.isYou) {
      router.push('/character' as never);
      return;
    }
    Alert.alert(player.name, `This sheet is played by ${player.playedBy}.`);
  }

  return (
    <SheetScaffold active="journal" journalSection={current}>
      <View style={styles.intro}>
        <Kicker>The journal of Ser Garyth</Kicker>
        <Text style={styles.title}>{campaign.title}</Text>
      </View>

      {current === 'party' ? (
        <View>
          <PaperCard label="The character" title={character.name}>
            <Text style={styles.subtitle}>{character.subtitle}</Text>
            <InfoRow label="Level" value={String(character.level)} />
            <InfoRow label="Armor class" value={String(character.armorClass)} />
            <InfoRow label="Hit points" value={`${character.hp.current} / ${character.hp.max}`} last />
          </PaperCard>
          <View style={styles.gap}>
            <CharactersSection onOpen={openCharacter} />
          </View>
        </View>
      ) : null}

      {current === 'lore' ? <BackstorySection /> : null}
      {current === 'campaign' ? <StorySection /> : null}
      {current === 'places' ? (
        <PlacesSection
          onOpen={location => router.push(`/journal/location/${location.id}` as never)}
        />
      ) : null}
      {current === 'events' ? <EventsSection /> : null}
    </SheetScaffold>
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
    fontFamily: fonts.displayItalic,
    fontSize: 15,
    lineHeight: 19,
    color: colors.muted,
    marginBottom: 8,
  },
  gap: {
    marginTop: 11,
  },
});
