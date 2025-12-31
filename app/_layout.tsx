import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMemoriesStore } from '@/store/memoriesStore';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const hydrate = useMemoriesStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Register the actual modal route file, NOT the route group */}
          <Stack.Screen
            name="(modals)/memory-editor"
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Stack.Screen
            name="(modals)/song-picker"
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Stack.Screen
            name="(modals)/pin-search"
            options={{ presentation: 'modal', headerShown: false }}
          />

          <Stack.Screen name="memory/[id]" options={{ title: 'Memory' }} />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
