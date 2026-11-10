import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PaperScreen } from '../components/PaperScreen';
import { addCampaign } from '../data/campaignList';
import { colors, fonts, paperShadow, radius } from '../theme';

type Mode = 'code' | 'scan';

const modes: { key: Mode; label: string }[] = [
  { key: 'code', label: 'Enter code' },
  { key: 'scan', label: 'Scan QR' },
];

/** Accepts a plain invite code, or an invite link carrying ?code=... */
function codeFromScan(data: string) {
  const match = data.match(/[?&]code=([^&#]+)/);
  return match ? decodeURIComponent(match[1]) : data.trim();
}

export default function JoinScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('code');
  const [code, setCode] = useState('');
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const canJoin = code.trim().length >= 4;

  function leave() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/' as never);
  }

  function join(value: string) {
    addCampaign(value);
    leave();
  }

  function handleScan(result: BarcodeScanningResult) {
    if (scanned) {
      return;
    }
    setScanned(true);
    join(codeFromScan(result.data));
  }

  function selectMode(next: Mode) {
    setMode(next);
    setScanned(false);
  }

  return (
    <PaperScreen kicker="Join a table" title="Add a campaign" onBack={leave}>
      <View style={styles.segment} accessibilityRole="tablist">
        {modes.map(item => {
          const selected = item.key === mode;
          return (
            <Pressable
              key={item.key}
              onPress={() => selectMode(item.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              style={[styles.segmentItem, selected && styles.segmentItemActive]}
            >
              <Text style={[styles.segmentText, selected && styles.segmentTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {mode === 'code' ? (
        <View style={styles.panel}>
          <Text style={styles.label}>Invite code</Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="e.g. ASHEN7"
            placeholderTextColor={colors.muted}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={8}
            returnKeyType="join"
            onSubmitEditing={() => canJoin && join(code)}
            accessibilityLabel="Invite code"
            style={styles.input}
          />
          <Text style={styles.hint}>Your GM can share the code from their campaign screen.</Text>
          <Pressable
            onPress={() => join(code)}
            disabled={!canJoin}
            accessibilityRole="button"
            accessibilityLabel="Join campaign"
            accessibilityState={{ disabled: !canJoin }}
            style={({ pressed }) => [
              styles.primary,
              !canJoin && styles.primaryDisabled,
              pressed && canJoin && styles.pressed,
            ]}
          >
            <Text style={styles.primaryText}>Join campaign</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.panel}>
          {!permission ? (
            <Text style={styles.hint}>Checking camera access…</Text>
          ) : !permission.granted ? (
            <View style={styles.permission}>
              <Text style={styles.hint}>The camera reads the QR code your GM shows on their screen.</Text>
              <Pressable
                onPress={requestPermission}
                accessibilityRole="button"
                accessibilityLabel="Allow camera"
                style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
              >
                <Text style={styles.primaryText}>Allow camera</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.scanner}>
              <CameraView
                style={StyleSheet.absoluteFill}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={scanned ? undefined : handleScan}
              />
              <View style={styles.frame} pointerEvents="none" />
            </View>
          )}
          {permission?.granted ? (
            <Text style={styles.hint}>Point the camera at the QR code.</Text>
          ) : null}
        </View>
      )}
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  segmentItem: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: colors.ink,
  },
  segmentText: {
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 20,
    color: colors.ink,
  },
  segmentTextActive: {
    color: colors.cream,
  },
  panel: {
    padding: 16,
    gap: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    ...paperShadow,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  input: {
    fontFamily: fonts.numeral,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 3,
    color: colors.ink,
    backgroundColor: 'rgba(255, 252, 246, 0.85)',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
  },
  primary: {
    height: 48,
    marginTop: 4,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#1c2a17',
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryDisabled: {
    opacity: 0.4,
  },
  primaryText: {
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 22,
    color: colors.goldLight,
  },
  pressed: {
    opacity: 0.8,
  },
  permission: {
    gap: 10,
  },
  scanner: {
    height: 300,
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: colors.ink,
  },
  frame: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderWidth: 2,
    borderColor: colors.gold,
    borderRadius: radius.card,
    margin: 28,
  },
});
