import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { campaign } from '../data/campaign';
import {
  addBackstoryBox,
  removeBackstoryBox,
  toggleRelationship,
  updateBackstoryBox,
  useBackstory,
} from '../data/backstoryStore';
import {
  characterDirectory,
  entityKindLabels,
  isRevealed,
  useDm,
  type DmEntity,
  type EntityKind,
} from '../data/dmStore';
import { updateLore, useLore } from '../data/loreStore';
import { colors, fonts } from '../theme';
import { AddButton } from './AddButton';
import { BackstoryBox } from './BackstoryBox';
import { EditableCard, type EditableField } from './EditableCard';
import { LocationCard } from './LocationCard';
import { PaperCard } from './PaperCard';
import { PartyRow } from './PartyRow';
import { PinToggle } from './PinToggle';

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

/** Everything the DM has pinned, whatever its kind. */
function usePinned() {
  const dm = useDm(campaign.id);
  return dm.entities.filter(entity => entity.pinned);
}

/** Entries of one kind that players can see: pinned by the DM, or written by a player. */
function useVisible(kind: EntityKind) {
  const dm = useDm(campaign.id);
  return dm.entities.filter(entity => entity.kind === kind && isRevealed(entity));
}

/** Events show their date; other kinds show their kind, plus any subtitle. */
function revealedLabel(entry: DmEntity) {
  if (entry.kind === 'event') {
    return entry.subtitle || 'Event';
  }
  return entry.subtitle ? `${entityKindLabels[entry.kind]} · ${entry.subtitle}` : entityKindLabels[entry.kind];
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

/** One revealed entry as players read it. Tapping it opens the entry. */
function RevealedEvent({ entry, style, onOpen }: { entry: DmEntity; style?: object; onOpen?: () => void }) {
  const card = (
    <PaperCard label={revealedLabel(entry)} title={entry.title} style={style}>
      <Paragraphs text={entry.body} />
      {entry.facts.length > 0 ? (
        <View style={styles.factsBlock}>
          <Text style={styles.lootLabel}>Loot recovered</Text>
          <Text style={styles.loot}>{entry.facts.join(' · ')}</Text>
        </View>
      ) : null}
    </PaperCard>
  );
  if (!onOpen) {
    return card;
  }
  return (
    <Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel={`Open ${entry.title}`}>
      {card}
    </Pressable>
  );
}

/** The campaign page: the next session, then everything the DM has pinned. */
export function StorySection() {
  const pinned = usePinned();

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

      {pinned.map(entry => (
        <RevealedEvent key={entry.id} entry={entry} style={styles.gap} />
      ))}

      {pinned.length === 0 ? (
        <Text style={[styles.tabBlurb, styles.gap]}>The story has not been shared yet.</Text>
      ) : null}
    </View>
  );
}

type OpenEntry = (entry: DmEntity) => void;

/** Events the DM has revealed, plus any the player wrote. */
export function EventsSection({ onOpen }: { onOpen: OpenEntry }) {
  const router = useRouter();
  const events = useVisible('event');

  return (
    <View>
      <Text style={styles.tabBlurb}>Everything that has moved the story forward.</Text>
      {events.length === 0 ? <Text style={styles.tabBlurb}>No events have been revealed yet.</Text> : null}
      {events.map((event, index) => (
        <RevealedEvent
          key={event.id}
          entry={event}
          style={index > 0 ? styles.gap : undefined}
          onOpen={() => onOpen(event)}
        />
      ))}
      <View style={styles.gap}>
        <AddButton label="+ Add event" onPress={() => router.push('/journal/new?kind=event' as never)} />
      </View>
    </View>
  );
}

/** Places the DM has revealed, plus any the player wrote. */
export function PlacesSection({ onOpen }: { onOpen: OpenEntry }) {
  const router = useRouter();
  const places = useVisible('location');

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
      <AddButton label="+ Add place" onPress={() => router.push('/journal/new?kind=location' as never)} />
    </View>
  );
}

export type PartyMember = (typeof campaign.roster)[number];

type CharactersProps = {
  onOpen: (player: PartyMember) => void;
};

/** The party roster. */
export function CharactersSection({ onOpen }: CharactersProps) {
  return (
    <PaperCard label="The party">
      {campaign.roster.map(player => (
        <PartyRow
          key={player.id}
          name={player.name}
          initial={player.initial}
          meta={player.meta}
          tint={player.tint}
          isYou={player.isYou}
          onPress={() => onOpen(player)}
        />
      ))}
    </PaperCard>
  );
}

/** Characters the DM has allowed players to see, and characters players have written. */
export function CharacterListSection({ onOpen }: { onOpen: OpenEntry }) {
  const router = useRouter();
  const dm = useDm(campaign.id);
  const { relationshipIds } = useBackstory();
  const characters = dm.entities.filter(entity => entity.kind === 'character' && isRevealed(entity));

  return (
    <View>
      <Text style={styles.tabBlurb}>Characters the DM has shared, and the ones you have written.</Text>
      {characters.length === 0 ? <Text style={styles.tabBlurb}>No characters have been shared yet.</Text> : null}
      {characters.map(entity => (
        <View key={entity.id} style={styles.characterRow}>
          <Pressable
            onPress={() => onOpen(entity)}
            accessibilityRole="button"
            accessibilityLabel={`Open ${entity.title}`}
            style={styles.characterOpen}
          >
            <View style={[styles.medallion, { backgroundColor: entity.tint }]}>
              <Text style={styles.initial}>{entity.initial}</Text>
            </View>
            <View style={styles.characterBody}>
              <Text style={styles.characterName}>{entity.title}</Text>
              <Text style={styles.characterMeta} numberOfLines={1}>
                {entity.author === 'player' ? 'Written by you' : entity.subtitle}
              </Text>
            </View>
          </Pressable>
          <PinToggle
            pinned={relationshipIds.includes(entity.id)}
            onToggle={() => toggleRelationship(entity.id)}
            title={entity.title}
          />
        </View>
      ))}
      <View style={styles.gap}>
        <AddButton label="+ Add character" onPress={() => router.push('/journal/new?kind=character' as never)} />
      </View>
    </View>
  );
}

/** Ser Garyth's backstory: the built-in cards, the player's own text boxes, and relationships. */
export function BackstorySection() {
  const lore = useLore();
  const { boxes, relationshipIds } = useBackstory();
  const dm = useDm(campaign.id);
  const directory = characterDirectory(dm.entities);
  const relationships = directory.filter(entry => relationshipIds.includes(entry.id));

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

      {boxes.map(box => (
        <BackstoryBox
          key={box.id}
          box={box}
          startEditing={box.body === '' && box.title === 'New section'}
          onSave={patch => updateBackstoryBox(box.id, patch)}
          onRemove={() => removeBackstoryBox(box.id)}
          style={styles.gap}
        />
      ))}

      <View style={styles.gap}>
        <AddButton label="+ Add text box" onPress={() => addBackstoryBox()} />
      </View>

      <PaperCard label="Relationships" style={styles.gap}>
        {relationships.length === 0 ? (
          <Text style={styles.tabBlurb}>No relationships pinned. Pin characters from the Characters tab.</Text>
        ) : null}
        {relationships.map(person => (
          <View key={person.id} style={styles.relationRow}>
            <View style={[styles.medallion, { backgroundColor: person.tint }]}>
              <Text style={styles.initial}>{person.initial}</Text>
            </View>
            <View style={styles.characterBody}>
              <Text style={styles.characterName}>{person.name}</Text>
              <Text style={styles.characterMeta} numberOfLines={1}>
                {person.subtitle}
              </Text>
            </View>
            <PinToggle pinned title={person.name} onToggle={() => toggleRelationship(person.id)} />
          </View>
        ))}
      </PaperCard>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: {
    marginTop: 11,
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
  characterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  characterOpen: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  relationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  medallion: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 20,
    color: colors.cream,
  },
  characterBody: {
    flex: 1,
  },
  characterName: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 20,
    color: colors.ink,
  },
  characterMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
});
