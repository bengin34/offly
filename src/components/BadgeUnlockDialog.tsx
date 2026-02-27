import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';
import { Background } from './Background';
import { fonts, fontSize, spacing, borderRadius } from '../constants/colors';
import type { Badge, UnlockedBadge } from '../utils/badges';

interface BadgeUnlockDialogProps {
  badge: Badge;
  unlocked?: UnlockedBadge;
  visible: boolean;
  onClose: () => void;
}

export function BadgeUnlockDialog({
  badge,
  unlocked,
  visible,
  onClose,
}: BadgeUnlockDialogProps) {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const glowLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  const badgeTitleKey = `badgeItems.${badge.id}.title`;
  const badgeDescriptionKey = `badgeItems.${badge.id}.description`;
  const badgeTitle = t(badgeTitleKey);
  const badgeDescription = t(badgeDescriptionKey);
  const displayTitle = badgeTitle === badgeTitleKey ? badge.title : badgeTitle;
  const displayDescription =
    badgeDescription === badgeDescriptionKey ? badge.description : badgeDescription;

  useEffect(() => {
    if (!visible) {
      glowLoopRef.current?.stop();
      return;
    }

    scaleAnim.setValue(0.6);
    opacityAnim.setValue(0);
    glowAnim.setValue(0);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 8,
        stiffness: 140,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    glowLoopRef.current = glowLoop;
    glowLoop.start();

    return () => {
      glowLoop.stop();
    };
  }, [visible, glowAnim, opacityAnim, scaleAnim]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    try {
      return date.toLocaleDateString(locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      return date.toLocaleDateString(locale);
    }
  };

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: theme.background }]}>
        <Background />
        <View
          style={[
            styles.container,
            {
              paddingTop: Math.max(spacing.xl, insets.top + spacing.lg),
              paddingBottom: Math.max(spacing.xl, insets.bottom + spacing.md),
            },
          ]}
        >
          <Text style={[styles.kicker, { color: theme.textMuted }]}>
            {t('badges.badgeUnlocked').toLocaleUpperCase(locale)}
          </Text>
          <Text style={[styles.congrats, { color: theme.text }]}>
            {t('badgeDetail.congratulations')}
          </Text>

          <View style={styles.badgeStage}>
            <Animated.View
              style={[
                styles.glowRing,
                {
                  backgroundColor: theme.primary + '20',
                  transform: [{ scale: glowScale }],
                  opacity: glowOpacity,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.badgeIcon,
                {
                  backgroundColor: theme.primary,
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                },
              ]}
            >
              <Ionicons
                name={badge.icon as keyof typeof Ionicons.glyphMap}
                size={56}
                color={theme.white}
              />
            </Animated.View>
          </View>

          <Text style={[styles.badgeTitle, { color: theme.text }]}>{displayTitle}</Text>
          <Text style={[styles.badgeDescription, { color: theme.textSecondary }]}>
            {displayDescription}
          </Text>

          {unlocked?.unlockedAt && (
            <Text style={[styles.earnedOn, { color: theme.textMuted }]}>
              {t('badgeDetail.earnedOn', { date: formatDate(unlocked.unlockedAt) })}
            </Text>
          )}

          <Pressable
            style={[styles.ctaButton, { backgroundColor: theme.primary }]}
            onPress={onClose}
          >
            <Text style={[styles.ctaText, { color: theme.white }]}>
              {t('common.close')}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  kicker: {
    fontFamily: fonts.ui,
    fontSize: fontSize.xs,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  congrats: {
    fontFamily: fonts.heading,
    fontSize: fontSize.xl,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  badgeStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  glowRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  badgeIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
  },
  badgeTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    textAlign: 'center',
  },
  badgeDescription: {
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  earnedOn: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  ctaButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  ctaText: {
    fontFamily: fonts.ui,
    fontSize: fontSize.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
