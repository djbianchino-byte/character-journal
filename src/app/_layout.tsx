import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '../theme';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'IM Fell English': require('../../assets/fonts/IMFellEnglish-Regular.ttf'),
    'IM Fell English Italic': require('../../assets/fonts/IMFellEnglish-Italic.ttf'),
    MedievalSharp: require('../../assets/fonts/MedievalSharp-Regular.ttf'),
    'Kingthings Petrock': require('../../assets/fonts/KingthingsPetrock-Bold.ttf'),
    Lingo: require('../../assets/fonts/Lingo-Regular.ttf'),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.backdrop },
        }}
      >
        <Stack.Screen
          name="abilities"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen
          name="dice"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
