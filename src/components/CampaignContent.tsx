import { Alert, StyleSheet, Text, View } from 'react-native';

import { campaign } from '../data/campaign';
import { character } from '../data/character';
import { useDm, type DmEntity } from '../data/dmStore';
import { updateLore, useLore } from '../data/loreStore';
import { colors, fonts } from '../theme';
import { EditableCard, type EditableField } from './EditableCard';
import { LocationCard } from './LocationCard';
import { PaperCard } from './PaperCard';
import { PartyRow } from './PartyRow';

const appearanceFields: EditableField[] = [
  { key: 'physicalDescription', label: 'Description', multiline: true },
  { key: 'age', label: 'Age' },
  { key: 'height', label: 'Height' },
  { key: 'weight', label: 'Weight' },
  { key: 'eyes', label: 'Eyes' },
  { key: 'hair', label: 'Hair' },
  { key: 'skin', label: 'Skin' },
];

const personalityFields: EditableField[] = [
  { key: 'personalityTraits', label: 'Traits', multiline: true },
  { key: 'ideals', label: 'Ideals', multiline: true },
  { key: 'flaws', label: 'Flaws', multiline: true },
];

/** Entries the DM has pinned, so players can see them, of one kind. */
function useRevealed(kind: DmEntity['kind']) {
  const dm = useDm(campaign.id);
  return dm.entities.filter(entity => entity.pinned && entity.kind === kind);
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split('\n\n')
        .filter(paragraph => paragraph.trim().length > 0)
        .map((paragraph, index) => (
          <Text key={index} style={[styles.paragraph, index > 0 && styles.paragraphGap]}>
            {paragraph}
          </Text>
        ))}
    </>
  );
}

/** One pinned event as players read it. */
function RevealedEvent({ entry, style }: { entry: DmEntity; style?: object }) {
  return (
    <PaperCard label={entry.subtitle || 'Event'} title={entry.title} style={style}>
      <Paragraphs text={entry.body} />
      {entry.facts.length > 0 ? (
        <View style={styles.factsBlock}>
          <Text style={styles.lootLabel}>Loot recovered</Text>
          <Text style={styles.loot}>{entry.facts.join(' · ')}</Text>
        </View>
      ) : null}
    </PaperCard>
  );
}

/** The campaign page: the next session, then the events the DM has pinned. */
export function StorySection() {
  const events = useRevealed('event');

  return (
    <View>
      <PaperCard>
        <View style={styles.nextRow}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateMonth}>{campaign.nextSession.month}</Text>
            <Text style={styles.dateDay}>{campaign.nextSession.day}</Text>
          </View>
          <View style={styles.nextBody}>
            <Text style={styles.cardLabel}>Next session</Text>
            <Text style={styles.nextTitle}>At the table again</Text>
            <Text style={styles.nextMeta}>{campaign.nextSession.time}</Text>
            <Text style={styles.nextMeta}>The Last Hearth · bring your dice</Text>
          </View>
        </View>
      </PaperCard>

      {events.map(entry => (
        <RevealedEvent key={entry.id} entry={entry} style={styles.gap} />
      ))}

      {events.length === 0 ? (
        <Text style={[styles.tabBlurb, styles.gap]}>The story has not been shared yet.</Text>
      ) : null}
    </View>
  );
}

/** Every event the DM has revealed. */
export function EventsSection() {
  const events = useRevealed('event');

  return (
    <View>
      <Text style={styles.tabBlurb}>Everything that has moved the story forward.</Text>
      {events.length === 0 ? <Text style={styles.tabBlurb}>No events have been revealed yet.</Text> : null}
      {events.map((event, index) => (
        <RevealedEvent key={event.id} entry={event} style={index > 0 ? styles.gap : undefined} />
      ))}
    </View>
  );
}

type PlacesProps = {
  onOpen: (location: DmEntity) => void;
};

/** Places the DM has revealed. */
export function PlacesSection({ onOpen }: PlacesProps) {
  const places = useRevealed('location');

  return (
    <View>
      <Text style={styles.tabBlurb}>Places the party has visited, or heard whispered about.</Text>
      {places.length === 0 ? <Text style={styles.tabBlurb}>No places have been revealed yet.</Text> : null}
      {places.map(place => (
        <LocationCard
          key={place.id}
          title={place.title}
          subtitle={place.subtitle}
          summary={place.body.split('\n\n')[0] ?? ''}
          initial={place.initial}
          tint={place.tint}
          onPress={() => onOpen(place)}
        />
      ))}
    </View>
  );
}

export type PartyMember = (typeof campaign.roster)[number];

type CharactersProps = {
  onOpen: (player: PartyMember) => void;
};

/** The party, and the characters the DM has revealed. */
export function CharactersSection({ onOpen }: CharactersProps) {
  const characters = useRevealed('character');

  return (
    <PaperCard label="The party">
      {campaign.roster.map(player => (
        <PartyRow
          key={player.id}
          name={player.name}
          initial={player.initial}
          meta={player.isYou ? `${player.meta} · you` : `${player.meta} · played by ${player.playedBy}`}
          tint={player.tint}
          isYou={player.isYou}
          onPress={() => onOpen(player)}
        />
      ))}

      {characters.length > 0 ? <Text style={styles.npcLabel}>Faces in the vale</Text> : null}
      {characters.map(npc => (
        <PartyRow
          key={npc.id}
          name={npc.title}
          initial={npc.initial}
          meta={npc.subtitle}
          tint={npc.tint}
          onPress={() => Alert.alert(npc.title, npc.subtitle)}
        />
      ))}
    </PaperCard>
  );
}

/** Ser Garyth's backstory. Each card can be edited in place. */
export function BackstorySection() {
  const lore = useLore();

  return (
    <View>
      <EditableCard label="Appearance" fields={appearanceFields} values={lore} onSave={updateLore} />
      <EditableCard
        label="Personality"
        fields={personalityFields}
        values={lore}
        onSave={updateLore}
        style={styles.gap}
      />
      <EditableCard
        label="Early life"
        fields={[{ key: 'earlyLife', label: 'Early life', multiline: true }]}
        values={lore}
        onSave={updateLore}
        style={styles.gap}
      />
      <EditableCard
        label="The blight"
        fields={[{ key: 'theBlight', label: 'The blight', multiline: true }]}
        values={lore}
        onSave={updateLore}
        style={styles.gap}
      />

      <PaperCard label="Relationships" style={styles.gap}>
        {character.lore.relationships.map(person => (
          <PartyRow
            key={person.name}
            name={person.name}
            initial={person.initial}
            meta={person.role}
            tint="#6f512b"
            onPress={() => Alert.alert(person.name, person.role)}
          />
        ))}
      </PaperCard>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: {
    marginTop: 11,
  },
  npcLabel: {
    marginTop: 14,
    marginBottom: 2,
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  tabBlurb: {
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    lineHeight: 19,
    color: colors.muted,
    marginBottom: 10,
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  dateBadge: {
    width: 54,
    height: 58,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: 'rgba(234, 214, 187, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonth: {
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.4,
    color: colors.muted,
  },
  dateDay: {
    fontFamily: fonts.numeral,
    fontSize: 26,
    lineHeight: 28,
    color: colors.ink,
  },
  nextBody: {
    flex: 1,
  },
  cardLabel: {
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  nextTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 25,
    color: colors.ink,
  },
  nextMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.inkSoft,
  },
  paragraph: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.ink,
    marginTop: 4,
  },
  paragraphGap: {
    marginTop: 8,
  },
  factsBlock: {
    marginTop: 10,
  },
  lootLabel: {
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  loot: {
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    lineHeight: 18,
    color: colors.ink,
    marginTop: 2,
  },
});
