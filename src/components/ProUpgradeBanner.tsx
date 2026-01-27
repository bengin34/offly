import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';
import { useSubscription } from '../hooks/useSubscriptions';
import { hideProUpgradeBanner } from '../config/dev';
import { spacing, fontSize, fonts, borderRadius } from '../constants/colors';

const ROTATION_INTERVAL = 10000; // 10 seconds

type ProUpgradeBannerProps = {
  style?: object;
};

export function ProUpgradeBanner({ style }: ProUpgradeBannerProps) {
  const theme = useTheme();
  const { t } = useI18n();
  const { isPro, isLoading, presentPaywall } = useSubscription();
  const [messageIndex, setMessageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const messages = t('proBanner.messages') as unknown as Array<{ title: string; subtitle: string }>;

  useEffect(() => {
    if (!messages || messages.length <= 1) return;

    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Change message
        setMessageIndex((prev) => (prev + 1) % messages.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [messages, fadeAnim]);

  if (isPro || hideProUpgradeBanner) return null;

  const currentMessage = messages?.[messageIndex] ?? { title: t('proBanner.title'), subtitle: t('proBanner.subtitle') };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.border },
        style,
      ]}
    >
      <View style={styles.left}>
        <View style={[styles.iconWrap, { backgroundColor: theme.primary }]}>
          <Ionicons name="sparkles" size={16} color={theme.white} />
        </View>
        <Animated.View style={[styles.textBlock, { opacity: fadeAnim }]}>
          <Text style={[styles.title, { color: theme.text }]}>{currentMessage.title}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {currentMessage.subtitle}
          </Text>
        </Animated.View>
      </View>
      <TouchableOpacity
        style={[styles.cta, { backgroundColor: theme.primary }, isLoading && styles.ctaDisabled]}
        onPress={() => void presentPaywall()}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.white} />
        ) : (
          <Text style={[styles.ctaText, { color: theme.white }]}>{t('proBanner.cta')}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSize.sm,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.xs,
  },
  cta: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
  },
  ctaDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    fontFamily: fonts.ui,
    fontSize: fontSize.md,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
