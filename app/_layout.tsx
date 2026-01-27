import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getDatabase } from '../src/db/database';
import { colors, fonts } from '../src/constants';
import { useI18n, useTheme, SubscriptionProvider } from '../src/hooks';
import { useLocaleStore, useThemeStore, usePaywallStore } from '../src/stores';
import { useOnboardingStore } from '../src/stores/onboardingStore';

function AppContent() {
  const theme = useTheme();
  const { t } = useI18n();
  const router = useRouter();
  const segments = useSegments();
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const isOnboardingLoaded = useOnboardingStore((state) => state.isLoaded);

  useEffect(() => {
    if (!isOnboardingLoaded) return;
    const isOnboardingRoute = segments[0] === 'onboarding';

    if (!hasCompletedOnboarding && !isOnboardingRoute) {
      router.replace('/onboarding');
      return;
    }

    if (hasCompletedOnboarding && isOnboardingRoute) {
      router.replace('/');
    }
  }, [hasCompletedOnboarding, isOnboardingLoaded, router, segments]);

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerBackButtonDisplayMode: 'minimal',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: fonts.display,
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="chapter/new"
          options={{
            title: t('navigation.newChapter'),
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="chapter/[id]"
          options={{
            title: t('navigation.chapter'),
          }}
        />
        <Stack.Screen
          name="chapter/edit/[id]"
          options={{
            title: t('navigation.editChapter'),
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="memory/new"
          options={{
            title: t('navigation.newMemory'),
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="memory/[id]"
          options={{
            title: t('navigation.memory'),
          }}
        />
        <Stack.Screen
          name="memory/edit/[id]"
          options={{
            title: t('navigation.editMemory'),
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="export"
          options={{
            title: t('settings.exportTitle'),
          }}
        />
        <Stack.Screen
          name="badges"
          options={{
            title: t('badges.allBadges'),
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const loadTheme = useThemeStore((state) => state.loadTheme);
  const loadLocale = useLocaleStore((state) => state.loadLocale);
  const loadOnboardingState = useOnboardingStore((state) => state.loadOnboardingState);
  const loadPaywallState = usePaywallStore((state) => state.loadPaywallState);

  useEffect(() => {
    async function initializeApp() {
      try {
        await Promise.all([getDatabase(), loadTheme(), loadLocale(), loadOnboardingState(), loadPaywallState()]);
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsReady(true);
      }
    }

    initializeApp();
  }, [loadTheme, loadLocale, loadPaywallState]);

  if (!isReady) {
    return (
      <GestureHandlerRootView style={styles.gestureRoot}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SubscriptionProvider>
        <AppContent />
      </SubscriptionProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
