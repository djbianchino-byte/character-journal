import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { InfoRow, Kicker, PaperCard } from '../components/PaperCard';
import { SheetScaffold } from '../components/SheetScaffold';
import { passivePerception, useAbilityScores } from '../data/abilitiesStore';
import { campaign } from '../data/campaign';
import { useCampaigns } from '../data/campaignList';
import { character } from '../data/character';
import { colors, fonts } from '../theme';

export default function OverviewScreen() {
  const router = useRouter();
  const scores = useAbilityScores();
  const campaigns = useCampaigns();
  const session = campaigns.find(entry => entry.id === campaign.id)?.nextSession ?? {
    month: campaign.nextSession.month,
    day: campaign.nextSession.day,
    time: campaign.nextSession.time,
    place: 'The Last Hearth',
  };
  const when = [session.month, session.day].filter(Boolean).join(' ');

  return (
    <SheetScaffold variant="home">
      <View style={styles.hero}>
        <Kicker>{campaign.title} · Session 12</Kicker>
      </View>

      <PaperCard label="Next at the table" title="Session 13">
        <Text style={styles.meta}>
          {when ? `${when} · ${session.time}` : 'Not scheduled yet.'}
        </Text>
        {session.place ? <Text style={styles.metaSoft}>{session.place} · bring your dice</Text> : null}
        <Pressable
          onPress={() => router.push('/journal' as never)}
          accessibilityRole="button"
          accessibilityLabel="Open the journal"
          style={styles.linkRow}
        >
          <Text style={styles.link}>Open journal</Text>
          <Text style={styles.linkArrow}>›</Text>
        </Pressable>
      </PaperCard>

      <PaperCard label="At a glance" style={styles.gap}>
        <InfoRow label="Proficiency" value={character.proficiencyBonus} />
        <InfoRow label="Passive Perception" value={String(passivePerception(scores))} />
        <InfoRow label="Darkvision" value={character.senses.darkvision} last />
      </PaperCard>

      <Text style={styles.hint}>Tap the ability scores for saving throws and skills.</Text>
    </SheetScaffold>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 4,
    marginBottom: 18,
  },
  quote: {
    marginTop: 7,
    fontFamily: fonts.display,
    fontSize: 27,
    lineHeight: 32,
    color: colors.ink,
  },
  attribution: {
    marginTop: 4,
    fontFamily: fonts.displayItalic,
    fontSize: 15,
    lineHeight: 19,
    color: colors.muted,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
    color: colors.ink,
  },
  metaSoft: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
    marginTop: 2,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 11,
  },
  link: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 20,
    color: colors.ink,
    textDecorationLine: 'underline',
  },
  linkArrow: {
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 20,
    color: colors.ink,
  },
  gap: {
    marginTop: 12,
  },
  hint: {
    marginTop: 16,
    fontFamily: fonts.body,
    fontSize: 11.5,
    lineHeight: 16,
    color: colors.muted,
    textAlign: 'center',
  },
});
