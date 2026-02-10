import { useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useI18n, useSubscription } from '../src/hooks';
import { useOnboardingStore } from '../src/stores/onboardingStore';
import { OnboardingPage, OnboardingPageData } from '../src/components/OnboardingPage';
import { Background } from '../src/components/Background';
import { spacing, fontSize, fonts, borderRadius } from '../src/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OnboardingScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const { presentPaywall, isPro } = useSubscription();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const pages: OnboardingPageData[] = useMemo(
    () => [
      {
        id: 'photo_overload',
        icon: 'images-outline',
        iconColor: theme.primary,
        title: t('onboarding.screens.photoOverload.title'),
        subtitle: t('onboarding.screens.photoOverload.body'),
      },
      {
        id: 'structured_archive',
        icon: 'albums-outline',
        iconColor: theme.accent,
        title: t('onboarding.screens.structuredArchive.title'),
        subtitle: t('onboarding.screens.structuredArchive.body'),
      },
      {
        id: 'fast_search',
        icon: 'search-outline',
        iconColor: theme.milestone,
        title: t('onboarding.screens.fastSearch.title'),
        subtitle: t('onboarding.screens.fastSearch.body'),
      },
      {
        id: 'best_of_list',
        icon: 'star-outline',
        iconColor: theme.memory,
        title: t('onboarding.screens.bestOfList.title'),
        subtitle: t('onboarding.screens.bestOfList.body'),
      },
      {
        id: 'no_competition',
        icon: 'heart-outline',
        iconColor: theme.error,
        title: t('onboarding.screens.noCompetition.title'),
        subtitle: t('onboarding.screens.noCompetition.body'),
      },
      {
        id: 'private_offline',
        icon: 'shield-checkmark-outline',
        iconColor: theme.success,
        title: t('onboarding.screens.privateOffline.title'),
        subtitle: t('onboarding.screens.privateOffline.body'),
      },
      {
        id: 'simple_start',
        icon: 'sparkles-outline',
        iconColor: theme.primary,
        title: t('onboarding.screens.simpleStart.title'),
        subtitle: t('onboarding.screens.simpleStart.body'),
      },
    ],
    [t, theme]
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    },
    [currentIndex]
  );

  const goToNext = useCallback(() => {
    if (currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
      return;
    }

    // Navigate to baby setup (paywall is shown there after setup)
    router.replace('/baby-setup');
  }, [currentIndex, pages.length, router]);

  const goToBack = useCallback(() => {
    if (currentIndex === 0) return;
    const previousIndex = currentIndex - 1;
    flatListRef.current?.scrollToIndex({
      index: previousIndex,
      animated: true,
    });
    setCurrentIndex(previousIndex);
  }, [currentIndex]);

  const handleSkip = useCallback(() => {
    // Skip carousel and go directly to baby setup
    router.replace('/baby-setup');
  }, [router]);

  const styles = createStyles(theme);
  const isLastPage = currentIndex === pages.length - 1;
  const topInset = Math.max(insets.top, spacing.lg);

  return (
    <View style={styles.container}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Background />

      {/* Pages */}
      <FlatList
        ref={flatListRef}
        data={pages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OnboardingPage data={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        bounces={false}
        style={styles.flatList}
      />

      {/* Bottom section */}
      <View style={[styles.bottomSection, { paddingBottom: spacing.xxl + insets.bottom }]}>
        {/* Pagination dots */}
        <View style={styles.pagination}>
          {pages.map((_, index) => {
            const inputRange = [
              (index - 1) * SCREEN_WIDTH,
              index * SCREEN_WIDTH,
              (index + 1) * SCREEN_WIDTH,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });

            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: theme.primary,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Action button */}
        <TouchableOpacity
          style={[styles.button, isLastPage && styles.buttonPrimary]}
          onPress={goToNext}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, isLastPage && styles.buttonTextPrimary]}>
            {isLastPage ? t('onboarding.createFirstTrip') : t('onboarding.next')}
          </Text>
        </TouchableOpacity>

        {/* Skip button on last page */}
        {isLastPage && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSkip}
          >
            <Text style={styles.secondaryButtonText}>{t('onboarding.skip')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    backButton: {
      position: 'absolute',
      left: spacing.lg,
      zIndex: 10,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backText: {
      marginLeft: 6,
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.textSecondary,
    },
    flatList: {
      flex: 1,
    },
    bottomSection: {
      paddingHorizontal: spacing.xl,
      alignItems: 'center',
    },
    pagination: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    dot: {
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    button: {
      width: '100%',
      paddingVertical: spacing.md + 2,
      minHeight: 48,
      borderRadius: borderRadius.xl,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    buttonPrimary: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
      shadowOpacity: 0.2,
    },
    buttonText: {
      fontSize: fontSize.lg,
      fontFamily: fonts.ui,
      color: theme.text,
    },
    buttonTextPrimary: {
      color: theme.white,
    },
    secondaryButton: {
      width: '100%',
      paddingVertical: spacing.md,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.sm,
    },
    secondaryButtonText: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.textSecondary,
    },
  });
