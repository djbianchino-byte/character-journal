import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { CampaignHeader } from '../components/CampaignHeader';
import { Card } from '../components/Card';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { campaign } from '../data/campaign';
import { colors, fonts } from '../theme';

export default function SessionNotesScreen() {
  const router = useRouter();
  const notes = campaign.lastSession;

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/' as never);
  };

  return (
    <ScreenScaffold showDice={false}>
      <CampaignHeader
        title="Session Notes"
        subtitle={`${campaign.title} · ${notes.date}`}
        onBack={goBack}
      />

      <View style={styles.stack}>
        <Card title={`Recap · ${notes.title}`}>
          {notes.recap.map((entry) => (
            <View key={entry.slice(0, 24)} style={styles.bulletRow}>
              <Text style={styles.bullet}>◆</Text>
              <Text style={styles.bulletText}>{entry}</Text>
            </View>
          ))}

          <View style={styles.rule} />

          <Text style={styles.attendanceLabel}>ATTENDED BY</Text>
          <Text style={styles.attendance}>{notes.attendance.join(' · ')}</Text>
        </Card>

        <Card title="Loot & Leads">
          {notes.loot.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <Text style={styles.bullet}>◆</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </Card>

        <Card title="Next Session">
          <Text style={styles.nextTime}>{campaign.nextSession.time}</Text>
          <Text style={styles.nextBody}>
            The Knights of the North convene in the Crown Room. Bring the ledger, the lantern, and
            an answer for Lady Craden.
          </Text>
        </Card>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  stack: {
    padding: 16,
    gap: 12,
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
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderSoft,
    marginVertical: 10,
  },
  attendanceLabel: {
    fontFamily: fonts.data,
    fontSize: 9.5,
    letterSpacing: 1.2,
    color: colors.textMuted,
  },
  attendance: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.textPrimary,
    marginTop: 2,
  },
  nextTime: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 27,
    color: colors.textPrimary,
  },
  nextBody: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.textPrimary,
    marginTop: 4,
  },
});
