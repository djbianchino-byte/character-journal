import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EntityEditForm, type EntityFormValues } from '../../../components/EntityEditForm';
import { Kicker, PaperCard } from '../../../components/PaperCard';
import { SheetScaffold } from '../../../components/SheetScaffold';
import { campaign } from '../../../data/campaign';
import { characterDirectory, entityKindLabels, isRevealed, updateEntity, useDm, type DmEntity } from '../../../data/dmStore';
import { colors, fonts } from '../../../theme';

export default function JournalEntryScreen() {
  const { eid } = useLocalSearchParams<{ eid: string }>();
  const dm = useDm(campaign.id);
  const entry = dm.entities.find(item => item.id === eid);

  if (!entry || !isRevealed(entry)) {
    return (
      <SheetScaffold journalSection="places">
        <PaperCard title="Not shared yet">
          <Text style={styles.body}>This entry has not been shared with you.</Text>
        </PaperCard>
      </SheetScaffold>
    );
  }

  return <EntryDetail key={entry.id} entry={entry} />;
}

function EntryDetail({ entry }: { entry: DmEntity }) {
  const dm = useDm(campaign.id);
  const [editing, setEditing] = useState(false);
  const directory = characterDirectory(dm.entities);
  const involved = directory.filter(person => entry.linked.includes(person.id));
  const canEdit = entry.author === 'player';
  const section = entry.kind === 'event' ? 'events' : entry.kind === 'location' ? 'places' : 'characters';

  function save(values: EntityFormValues) {
    updateEntity(campaign.id, entry.id, values);
    setEditing(false);
  }

  return (
    <SheetScaffold journalSection={section}>
      <View style={styles.head}>
        <View style={[styles.medallion, { backgroundColor: entry.tint }]}>
          <Text style={styles.initial}>{entry.initial}</Text>
        </View>
        <View style={styles.headText}>
          <Kicker>{entry.subtitle ? `${entityKindLabels[entry.kind]} · ${entry.subtitle}` : entityKindLabels[entry.kind]}</Kicker>
          <Text style={styles.title}>{entry.title}</Text>
        </View>
      </View>

      <PaperCard
        label={entityKindLabels[entry.kind]}
        title={editing ? undefined : entry.title}
        onAction={canEdit ? () => setEditing(current => !current) : undefined}
        actionLabel={editing ? 'Cancel editing' : `Edit ${entry.title}`}
      >
        {editing ? (
          <EntityEditForm
            kind={entry.kind}
            characters={directory}
            initial={{ title: entry.title, subtitle: entry.subtitle, body: entry.body, linked: entry.linked }}
            saveLabel="Save"
            onSave={save}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <View>
            {entry.body
              ? entry.body.split('\n\n').map((paragraph, index) => (
                  <Text key={index} style={[styles.body, index > 0 && styles.gap]}>
                    {paragraph}
                  </Text>
                ))
              : <Text style={styles.empty}>No details written yet.</Text>}
          </View>
        )}
      </PaperCard>

      {!editing && involved.length > 0 ? (
        <PaperCard label="Characters involved" style={styles.gap}>
          {involved.map((person, index) => (
            <View key={person.id} style={[styles.person, index === involved.length - 1 && styles.personLast]}>
              <Text style={styles.personName}>{person.name}</Text>
              <Text style={styles.personMeta}>{person.subtitle}</Text>
            </View>
          ))}
        </PaperCard>
      ) : null}

      {!canEdit ? (
        <Text style={[styles.note, styles.gap]}>Written by the DM. Only the DM can change this.</Text>
      ) : null}
    </SheetScaffold>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  medallion: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: fonts.display,
    fontSize: 25,
    lineHeight: 27,
    color: colors.cream,
  },
  headText: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 29,
    lineHeight: 32,
    color: colors.ink,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.ink,
  },
  empty: {
    fontFamily: fonts.displayItalic,
    fontSize: 14,
    lineHeight: 19,
    color: colors.muted,
  },
  gap: {
    marginTop: 11,
  },
  person: {
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  personLast: {
    borderBottomWidth: 0,
  },
  personName: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 20,
    color: colors.ink,
  },
  personMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  note: {
    fontFamily: fonts.displayItalic,
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
    textAlign: 'center',
  },
});
