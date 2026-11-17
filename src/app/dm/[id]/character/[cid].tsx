import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from 'react-native';

import { BackstorySection } from '../../../../components/CampaignContent';
import { PaperCard } from '../../../../components/PaperCard';
import { PaperScreen } from '../../../../components/PaperScreen';
import { campaign } from '../../../../data/campaign';
import { useCampaigns } from '../../../../data/campaignList';
import { colors, fonts } from '../../../../theme';

export default function DmCharacterScreen() {
  const router = useRouter();
  const { id, cid } = useLocalSearchParams<{ id: string; cid: string }>();
  const campaigns = useCampaigns();
  const table = campaigns.find(entry => entry.id === id);
  const player = campaign.roster.find(entry => entry.id === cid);

  function leave() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/' as never);
  }

  if (!table || !player || table.id !== campaign.id) {
    return (
      <PaperScreen kicker="Characters" title="Not found" onBack={leave}>
        <PaperCard>
          <Text style={{ fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19, color: colors.ink }}>
            This character is not part of this table.
          </Text>
        </PaperCard>
      </PaperScreen>
    );
  }

  const kicker = player.meta;

  return (
    <PaperScreen kicker={kicker} title={player.name} onBack={leave}>
      {player.id === 'garyth' ? (
        <BackstorySection />
      ) : (
        <PaperCard label="Backstory">
          <Text style={{ fontFamily: fonts.displayItalic, fontSize: 14, lineHeight: 19, color: colors.muted }}>
            {player.playedBy} has not shared a backstory yet.
          </Text>
        </PaperCard>
      )}
    </PaperScreen>
  );
}
