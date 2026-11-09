import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { InfoRow, Kicker, PaperCard } from '../../../components/PaperCard';
import { SheetScaffold } from '../../../components/SheetScaffold';
import { campaign } from '../../../data/campaign';
import { colors, fonts } from '../../../theme';

export default function LocationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const location = campaign.locations.find(entry => entry.id === id);

  if (!location) {
    return (
      <SheetScaffold>
        <PaperCard title="Place not found">
          <Text style={styles.body}>
            This page is missing from the journal. Return to the Places tab and choose another entry.
          </Text>
        </PaperCard>
      </SheetScaffold>
    );
  }

  return (
    <SheetScaffold journalSection="places">
      <View style={styles.head}>
        <View style={[styles.medallion, { backgroundColor: location.tint }]}>
          <Text style={styles.initial}>{location.initial}</Text>
        </View>
        <View style={styles.headText}>
          <Kicker>{location.region}</Kicker>
          <Text style={styles.title}>{location.name}</Text>
        </View>
      </View>

      <PaperCard label="The place">
        <Text style={styles.lead}>{location.summary}</Text>
        <Text style={styles.body}>{location.detail}</Text>
      </PaperCard>

      <PaperCard label="What we know" style={styles.gap}>
        {location.known.map((fact, index) => (
          <View
            key={fact}
            style={[styles.factRow, index === location.known.length - 1 && styles.factRowLast]}
          >
            <Text style={styles.bullet}>◆</Text>
            <Text style={styles.fact}>{fact}</Text>
          </View>
        ))}
      </PaperCard>

      <PaperCard label="At a glance" style={styles.gap}>
        <InfoRow label="Region" value={location.region} />
        <InfoRow label="Status" value={location.featured ? 'Visited' : 'Rumoured'} last />
      </PaperCard>
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
  lead: {
    fontFamily: fonts.displayItalic,
    fontSize: 15,
    lineHeight: 20,
    color: colors.muted,
    marginBottom: 7,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.ink,
  },
  gap: {
    marginTop: 11,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  factRowLast: {
    borderBottomWidth: 0,
  },
  bullet: {
    fontSize: 6,
    color: colors.goldDark,
    marginTop: 6,
  },
  fact: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.ink,
  },
});
