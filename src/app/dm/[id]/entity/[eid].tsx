import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PaperCard } from '../../../../components/PaperCard';
import { PaperScreen } from '../../../../components/PaperScreen';
import { PinToggle } from '../../../../components/PinToggle';
import { entityKindLabels, togglePin, useDm } from '../../../../data/dmStore';
import { colors, fonts } from '../../../../theme';

export default function DmEntityScreen() {
  const router = useRouter();
  const { id, eid } = useLocalSearchParams<{ id: string; eid: string }>();
  const dm = useDm(id);
  const entity = dm.entities.find(item => item.id === eid);

  function leave() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/' as never);
  }

  if (!entity) {
    return (
      <PaperScreen kicker="Dungeon master" title="Not found" onBack={leave}>
        <PaperCard>
          <Text style={styles.body}>This entry is no longer in the campaign.</Text>
        </PaperCard>
      </PaperScreen>
    );
  }

  const label = entityKindLabels[entity.kind];

  return (
    <PaperScreen
      kicker={entity.subtitle ? `${label} · ${entity.subtitle}` : label}
      title={entity.title}
      onBack={leave}
    >
      <View style={styles.pinRow}>
        <PinToggle pinned={entity.pinned} onToggle={() => togglePin(id, entity.id)} title={entity.title} />
      </View>

      {entity.body ? (
        <PaperCard label="About" style={styles.gap}>
          {entity.body.split('\n\n').map((paragraph, index) => (
            <Text key={index} style={[styles.body, index > 0 && styles.paragraphGap]}>
              {paragraph}
            </Text>
          ))}
        </PaperCard>
      ) : null}

      {entity.facts.length > 0 ? (
        <PaperCard label="What we know" style={styles.gap}>
          {entity.facts.map((fact, index) => (
            <View key={fact} style={[styles.factRow, index === entity.facts.length - 1 && styles.factRowLast]}>
              <Text style={styles.bullet}>◆</Text>
              <Text style={styles.fact}>{fact}</Text>
            </View>
          ))}
        </PaperCard>
      ) : null}
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  pinRow: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.ink,
  },
  paragraphGap: {
    marginTop: 8,
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
