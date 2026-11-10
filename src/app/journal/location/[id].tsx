import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Kicker, PaperCard } from '../../../components/PaperCard';
import { SheetScaffold } from '../../../components/SheetScaffold';
import { campaign } from '../../../data/campaign';
import { useDm } from '../../../data/dmStore';
import { colors, fonts } from '../../../theme';

export default function LocationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dm = useDm(campaign.id);
  const place = dm.entities.find(entry => entry.id === id && entry.kind === 'location' && entry.pinned);

  if (!place) {
    return (
      <SheetScaffold journalSection="places">
        <PaperCard title="Place not found">
          <Text style={styles.body}>
            This place has not been shared yet. Return to the Places tab and choose another entry.
          </Text>
        </PaperCard>
      </SheetScaffold>
    );
  }

  const [summary, ...rest] = place.body.split('\n\n');

  return (
    <SheetScaffold journalSection="places">
      <View style={styles.head}>
        <View style={[styles.medallion, { backgroundColor: place.tint }]}>
          <Text style={styles.initial}>{place.initial}</Text>
        </View>
        <View style={styles.headText}>
          <Kicker>{place.subtitle}</Kicker>
          <Text style={styles.title}>{place.title}</Text>
        </View>
      </View>

      <PaperCard label="The place">
        <Text style={styles.lead}>{summary}</Text>
        {rest.map((paragraph, index) => (
          <Text key={index} style={styles.body}>
            {paragraph}
          </Text>
        ))}
      </PaperCard>

      {place.facts.length > 0 ? (
        <PaperCard label="What we know" style={styles.gap}>
          {place.facts.map((fact, index) => (
            <View
              key={fact}
              style={[styles.factRow, index === place.facts.length - 1 && styles.factRowLast]}
            >
              <Text style={styles.bullet}>◆</Text>
              <Text style={styles.fact}>{fact}</Text>
            </View>
          ))}
        </PaperCard>
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
    marginTop: 6,
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
