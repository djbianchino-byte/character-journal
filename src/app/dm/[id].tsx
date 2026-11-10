import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { InfoRow, Kicker, PaperCard } from '../../components/PaperCard';
import { PaperScreen } from '../../components/PaperScreen';
import { useCampaigns } from '../../data/campaignList';
import { colors, fonts } from '../../theme';

export default function DmCampaignScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const campaigns = useCampaigns();
  const item = campaigns.find(entry => entry.id === id);

  function leave() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/' as never);
  }

  if (!item) {
    return (
      <PaperScreen kicker="Dungeon master" title="Campaign not found" onBack={leave}>
        <PaperCard>
          <Text style={styles.body}>This table is no longer in your list. Go back and choose another campaign.</Text>
        </PaperCard>
      </PaperScreen>
    );
  }

  return (
    <PaperScreen kicker="Dungeon master" title={item.title} onBack={leave}>
      <PaperCard label="Invite code">
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.body}>Players enter this code on the join screen to sit at your table.</Text>
      </PaperCard>

      <PaperCard label="The table">
        <InfoRow label="Game master" value="You" />
        <InfoRow label="Players" value={String(item.playerCount)} last />
        {item.playerCount === 0 ? (
          <Text style={styles.empty}>No players have joined yet. Share the code to fill your seats.</Text>
        ) : null}
      </PaperCard>

      <PaperCard label="Next session">
        <Text style={styles.body}>{item.nextSession}</Text>
      </PaperCard>

      <PaperCard label="About">
        <Kicker>{item.title}</Kicker>
        <Text style={[styles.body, styles.gap]}>{item.description}</Text>
      </PaperCard>
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  code: {
    fontFamily: fonts.numeral,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: 4,
    color: colors.ink,
    marginBottom: 6,
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
    marginTop: 10,
  },
  gap: {
    marginTop: 6,
  },
});
