import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { EditableCard, type EditableField } from '../../components/EditableCard';
import { LocationCard } from '../../components/LocationCard';
import { InfoRow, Kicker, PaperCard } from '../../components/PaperCard';
import { PartyRow } from '../../components/PartyRow';
import { SheetScaffold } from '../../components/SheetScaffold';
import { campaign } from '../../data/campaign';
import { character } from '../../data/character';
import { journalSections, type JournalSection } from '../../data/journal';
import { updateLore, useLore } from '../../data/loreStore';
import { colors, fonts } from '../../theme';

const artifactTints = ['#6f512b', '#5f6b8a', '#7a5c1f', '#4f5f4a'];

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

function resolveSection(value: string | undefined): JournalSection {
  const match = journalSections.find(section => section.key === value);
  return match ? match.key : 'campaign';
}

export default function JournalScreen() {
  const router = useRouter();
  const { section } = useLocalSearchParams<{ section?: string }>();
  const current = resolveSection(section);
  const lore = useLore();

  function openCharacter(name: string, playedBy: string, isYou?: boolean) {
    if (isYou) {
      router.push('/' as never);
      return;
    }
    Alert.alert(name, `This sheet is played by ${playedBy}.`);
  }

  return (
    <SheetScaffold active="journal" journalSection={current}>
      <View style={styles.intro}>
        <Kicker>The journal of Ser Garyth</Kicker>
        <Text style={styles.title}>{campaign.title}</Text>
      </View>

      {current === 'hero' ? (
        <View>
          <PaperCard label="The character" title={character.name}>
            <Text style={styles.subtitle}>{character.subtitle}</Text>
            <InfoRow label="Level" value={String(character.level)} />
            <InfoRow label="Armor class" value={String(character.armorClass)} />
            <InfoRow label="Hit points" value={`${character.hp.current} / ${character.hp.max}`} last />
          </PaperCard>

          <PaperCard label="The party" style={styles.gap}>
            {campaign.roster.map(player => (
              <PartyRow
                key={player.id}
                name={player.name}
                initial={player.initial}
                meta={player.isYou ? `${player.meta} · you` : `${player.meta} · played by ${player.playedBy}`}
                tint={player.tint}
                isYou={player.isYou}
                onPress={() => openCharacter(player.name, player.playedBy, player.isYou)}
              />
            ))}

            <Text style={styles.npcLabel}>Faces in the vale</Text>
            {campaign.npcs.map(npc => (
              <PartyRow
                key={npc.id}
                name={npc.name}
                initial={npc.initial}
                meta={npc.role}
                tint={npc.tint}
                onPress={() => Alert.alert(npc.name, npc.role)}
              />
            ))}
          </PaperCard>
        </View>
      ) : null}

      {current === 'lore' ? (
        <View>
          <EditableCard
            label="Appearance"
            fields={appearanceFields}
            values={lore}
            onSave={updateLore}
          />
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
      ) : null}

      {current === 'campaign' ? (
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

          <PaperCard label="Last session" title={campaign.lastSession.title} style={styles.gap}>
            <Text style={styles.sessionDate}>{campaign.lastSession.date}</Text>
            <Text style={styles.attendance}>
              Present: {campaign.lastSession.attendance.join(' · ')}
            </Text>
            <View style={styles.rule} />
            {campaign.lastSession.recap.map((line, index) => (
              <Text key={index} style={styles.paragraph}>
                {line}
              </Text>
            ))}
            <Text style={styles.lootLabel}>Loot recovered</Text>
            <Text style={styles.loot}>{campaign.lastSession.loot.join(' · ')}</Text>
          </PaperCard>

          {campaign.story.map(chapter => (
            <PaperCard key={chapter.title} title={chapter.title} style={styles.gap}>
              <Text style={styles.paragraph}>{chapter.body}</Text>
            </PaperCard>
          ))}

          {campaign.artifacts.map((artifact, index) => (
            <PaperCard
              key={artifact.id}
              label={artifact.kind}
              title={artifact.name}
              style={styles.gap}
            >
              <View style={styles.artifactHead}>
                <View
                  style={[
                    styles.artifactMedallion,
                    { backgroundColor: artifactTints[index % artifactTints.length] },
                  ]}
                >
                  <Text style={styles.artifactInitial}>{artifact.initial}</Text>
                </View>
                <Text style={styles.artifactSummary}>{artifact.summary}</Text>
              </View>
              <Text style={styles.paragraph}>{artifact.detail}</Text>
            </PaperCard>
          ))}
        </View>
      ) : null}

      {current === 'places' ? (
        <View>
          <Text style={styles.tabBlurb}>
            Places the party has visited, or heard whispered about.
          </Text>
          {campaign.locations.map(location => (
            <LocationCard
              key={location.id}
              location={location}
              onPress={() => router.push(`/journal/location/${location.id}` as never)}
            />
          ))}
        </View>
      ) : null}

      {current === 'events' ? (
        <View>
          <Text style={styles.tabBlurb}>
            Everything that has moved the story forward, newest first.
          </Text>
          {campaign.events.map((event, index) => (
            <PaperCard
              key={event.id}
              label={event.when}
              title={event.title}
              style={index > 0 ? styles.gap : undefined}
            >
              <Text style={styles.paragraph}>{event.summary}</Text>
            </PaperCard>
          ))}
        </View>
      ) : null}
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
  sessionDate: {
    fontFamily: fonts.displayItalic,
    fontSize: 15,
    lineHeight: 19,
    color: colors.muted,
  },
  attendance: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    lineHeight: 16,
    color: colors.inkSoft,
    marginTop: 2,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderSoft,
    marginVertical: 10,
  },
  paragraph: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.ink,
    marginTop: 4,
  },
  lootLabel: {
    marginTop: 11,
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
  artifactHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  artifactMedallion: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artifactInitial: {
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 21,
    color: colors.cream,
  },
  artifactSummary: {
    flex: 1,
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    lineHeight: 18,
    color: colors.muted,
  },
});
