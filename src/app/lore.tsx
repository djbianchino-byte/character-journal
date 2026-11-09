import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AddRow } from '../components/AddRow';
import { CampaignHeader } from '../components/CampaignHeader';
import { Card } from '../components/Card';
import { LocationCard } from '../components/LocationCard';
import { OrnamentalDivider } from '../components/OrnamentalDivider';
import { ScreenScaffold } from '../components/ScreenScaffold';
import { SectionHeading } from '../components/SectionHeading';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { SortToggle, type SortKey } from '../components/SortToggle';
import { campaign, type CampaignArtifact } from '../data/campaign';
import { colors, fonts } from '../theme';

const TABS = [
  { key: 'story', label: 'Story' },
  { key: 'locations', label: 'Locations' },
  { key: 'events', label: 'Events' },
  { key: 'artifacts', label: 'Artifacts' },
] as const;

type LoreTab = (typeof TABS)[number]['key'];

const ARTIFACT_TINTS = ['#7a5c1f', '#5f6b8a', '#8a4a5e', '#5c7a3a'];

export default function LoreScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<LoreTab>('locations');
  const [sort, setSort] = useState<SortKey>('alpha');

  const featured = campaign.locations.filter((location) => location.featured);
  const rest = useMemo(() => {
    const list = campaign.locations.filter((location) => !location.featured);
    if (sort === 'alpha') return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return [...list].reverse();
  }, [sort]);

  return (
    <ScreenScaffold showDice={false}>
      <CampaignHeader
        title="Lore"
        subtitle={campaign.title}
        onBack={() => router.navigate('/' as never)}
        onMore={() => Alert.alert('Lore', 'Lore settings are outside this prototype.')}
      />

      <SegmentedTabs options={TABS} value={tab} onChange={setTab} />

      <View style={styles.content}>
        {tab === 'story' ? <StoryTab /> : null}

        {tab === 'locations' ? (
          <>
            <SectionHeading title="Important Locations" />
            <View style={styles.list}>
              {featured.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onPress={() => router.push(`/location/${location.id}` as never)}
                />
              ))}
            </View>

            <OrnamentalDivider />

            <SectionHeading
              title="All locations"
              right={<SortToggle value={sort} onChange={setSort} />}
            />
            <View style={styles.list}>
              {rest.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onPress={() => router.push(`/location/${location.id}` as never)}
                />
              ))}

              <AddRow
                label="Add location"
                onPress={() =>
                  Alert.alert('Add location', 'Creating locations is not part of this prototype.')
                }
              />
            </View>
          </>
        ) : null}

        {tab === 'events' ? (
          <>
            <SectionHeading title="Campaign Events" />
            <View style={styles.list}>
              {campaign.events.map((event) => (
                <Card key={event.id}>
                  <Text style={styles.eventWhen}>{event.when}</Text>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventSummary}>{event.summary}</Text>
                </Card>
              ))}
            </View>
          </>
        ) : null}

        {tab === 'artifacts' ? (
          <>
            <SectionHeading title="Artifacts & Relics" />
            <View style={styles.list}>
              {campaign.artifacts.map((artifact, index) => (
                <ArtifactCard
                  key={artifact.id}
                  artifact={artifact}
                  tint={ARTIFACT_TINTS[index % ARTIFACT_TINTS.length]}
                  onPress={() =>
                    Alert.alert(artifact.name, artifact.detail)
                  }
                />
              ))}
            </View>
          </>
        ) : null}
      </View>
    </ScreenScaffold>
  );
}

function StoryTab() {
  return (
    <View style={styles.list}>
      {campaign.story.map((section) => (
        <Card key={section.title}>
          <Text style={styles.storyTitle}>{section.title}</Text>
          <Text style={styles.storyBody}>{section.body}</Text>
        </Card>
      ))}
    </View>
  );
}

function ArtifactCard({
  artifact,
  tint,
  onPress,
}: {
  artifact: CampaignArtifact;
  tint: string;
  onPress: () => void;
}) {
  return (
    <Card style={styles.artifactCard}>
      <View style={styles.artifactRow}>
        <View style={[styles.artifactAvatar, { backgroundColor: tint }]}>
          <Text style={styles.artifactInitial}>{artifact.initial}</Text>
        </View>
        <View style={styles.artifactBody}>
          <Text style={styles.artifactName}>{artifact.name}</Text>
          <Text style={styles.artifactKind}>{artifact.kind}</Text>
        </View>
        <Pressable
          onPress={onPress}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`About ${artifact.name}`}
        >
          <Text style={styles.artifactInfo}>ⓘ</Text>
        </Pressable>
      </View>
      <Text style={styles.artifactSummary}>{artifact.summary}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    gap: 10,
  },
  storyTitle: {
    fontFamily: fonts.display,
    fontSize: 21,
    lineHeight: 26,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  storyBody: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 21,
    color: colors.textPrimary,
  },
  eventWhen: {
    fontFamily: fonts.data,
    fontSize: 9.5,
    letterSpacing: 1.2,
    color: colors.gold,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  eventTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 25,
    color: colors.textPrimary,
    marginBottom: 3,
  },
  eventSummary: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textPrimary,
  },
  artifactCard: {
    gap: 10,
  },
  artifactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  artifactAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(61, 32, 0, 0.25)',
  },
  artifactInitial: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textInverse,
  },
  artifactBody: {
    flex: 1,
  },
  artifactName: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textPrimary,
  },
  artifactKind: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  artifactInfo: {
    fontSize: 17,
    color: colors.textMuted,
    paddingHorizontal: 4,
  },
  artifactSummary: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textPrimary,
  },
});
