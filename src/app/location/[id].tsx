import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AddRow } from '../../components/AddRow';
import { CampaignHeader } from '../../components/CampaignHeader';
import { Card } from '../../components/Card';
import { ScreenScaffold } from '../../components/ScreenScaffold';
import { getLocation } from '../../data/campaign';
import { colors, fonts } from '../../theme';

export default function LocationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const location = getLocation(typeof id === 'string' ? id : undefined);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/lore' as never);
  };

  return (
    <ScreenScaffold showDice={false}>
      <CampaignHeader
        title={location.name}
        subtitle={location.region}
        onBack={goBack}
        onMore={() =>
          Alert.alert(location.name, 'Location settings are outside this prototype.')
        }
      />

      <View style={styles.stack}>
        <Card title="Overview">
          <Text style={styles.summary}>{location.summary}</Text>
          <View style={styles.rule} />
          <Text style={styles.body}>{location.detail}</Text>
        </Card>

        <Card title="Known to the party">
          {location.known.map((fact) => (
            <View key={fact} style={styles.bulletRow}>
              <Text style={styles.bullet}>◆</Text>
              <Text style={styles.bulletText}>{fact}</Text>
            </View>
          ))}
        </Card>

        <Card title="At the table">
          <View style={styles.metaRow}>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>REGION</Text>
              <Text style={styles.metaValue}>{location.region}</Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.metaLabel}>CAMPAIGN</Text>
              <Text style={styles.metaValue}>The Ashen Crown</Text>
            </View>
          </View>
        </Card>

        <AddRow
          label="Add note"
          onPress={() => Alert.alert('Add note', 'Location notes are outside this prototype.')}
        />
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  stack: {
    padding: 16,
    gap: 12,
  },
  summary: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 21,
    color: colors.textPrimary,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderSoft,
    marginVertical: 10,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 21,
    color: colors.textPrimary,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 7,
    lineHeight: 20,
    color: colors.gold,
  },
  bulletText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaBlock: {
    flex: 1,
  },
  metaLabel: {
    fontFamily: fonts.data,
    fontSize: 9.5,
    letterSpacing: 1.1,
    color: colors.textMuted,
  },
  metaValue: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.textPrimary,
    marginTop: 2,
  },
});
