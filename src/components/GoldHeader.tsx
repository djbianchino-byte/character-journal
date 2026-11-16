import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { profileClassLine, useProfile } from '../data/profileStore';
import { colors, fonts, HEADER_HEIGHT } from '../theme';

const handIcon = require('../../assets/ui/hand.png');
const quillIcon = require('../../assets/ui/icon-quill.png');
const portrait = require('../../assets/ui/portrait-garyth.jpg');

type Props = {
  showBack?: boolean;
  onBack?: () => void;
  onEdit?: () => void;
};

/** Gold parchment banner with the character identity, portrait and actions. */
export function GoldHeader({ showBack = true, onBack, onEdit }: Props) {
  const router = useRouter();
  const profile = useProfile();

  function edit() {
    if (onEdit) {
      onEdit();
      return;
    }
    router.push('/profile' as never);
  }

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[
          'rgba(215, 189, 87, 0.18)',
          'rgba(215, 189, 87, 0.52)',
          'rgba(140, 92, 26, 0.6)',
          'rgba(41, 19, 9, 0.82)',
        ]}
        locations={[0, 0.42, 0.76, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.actions}>
        {showBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={14}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
          >
            <Image source={handIcon} style={styles.hand} resizeMode="contain" />
          </Pressable>
        ) : (
          <View style={styles.backButton} />
        )}

        <Pressable
          onPress={edit}
          hitSlop={14}
          accessibilityRole="button"
          accessibilityLabel="Edit character"
          style={styles.editButton}
        >
          <Image source={quillIcon} style={styles.quill} resizeMode="contain" />
        </Pressable>
      </View>

      <View style={styles.summary}>
        <Pressable
          onPress={edit}
          accessibilityRole="button"
          accessibilityLabel="Edit name, class and level"
          style={styles.identity}
        >
          <Text numberOfLines={1} style={styles.name}>
            {profile.name}
          </Text>
          <Text numberOfLines={1} style={styles.classLine}>
            {profileClassLine(profile)}
          </Text>
          <Text numberOfLines={1} style={styles.played}>
            played by {profile.playedBy}
          </Text>
        </Pressable>

        <Pressable
          onPress={edit}
          accessibilityRole="button"
          accessibilityLabel="Change profile picture"
          style={styles.portraitFrame}
        >
          <Image
            source={profile.avatarUri ? { uri: profile.avatarUri } : portrait}
            style={[styles.portrait, !profile.avatarUri && styles.portraitArt]}
            resizeMode="cover"
          />
        </Pressable>
      </View>

      <LinearGradient
        colors={['rgba(41, 19, 9, 0)', 'rgba(41, 19, 9, 0.38)']}
        style={styles.fade}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: HEADER_HEIGHT,
    paddingHorizontal: 24,
    paddingTop: 12,
    overflow: 'hidden',
  },
  actions: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 30,
    justifyContent: 'center',
  },
  hand: {
    width: 35,
    height: 24,
  },
  editButton: {
    width: 44,
    height: 36,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  quill: {
    width: 34,
    height: 28,
  },
  summary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  identity: {
    flex: 1,
    paddingRight: 12,
    paddingBottom: 8,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 38,
    color: colors.cream,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(41, 19, 9, 0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  classLine: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 20,
    color: colors.cream,
  },
  played: {
    fontFamily: fonts.displayItalic,
    fontSize: 16,
    lineHeight: 20,
    color: 'rgba(255, 252, 246, 0.9)',
  },
  portraitFrame: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderColor: '#2a1600',
    borderRadius: 2,
    backgroundColor: '#2a1600',
    overflow: 'hidden',
    shadowColor: '#1c0f02',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  portrait: {
    width: '100%',
    height: '100%',
  },
  // The artwork has a dark frame baked into its edges; zoom it out of view.
  portraitArt: {
    transform: [{ scale: 1.16 }],
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 26,
  },
});
