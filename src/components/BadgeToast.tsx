import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';
import { fonts, fontSize, spacing, borderRadius } from '../constants/colors';
import type { Badge } from '../utils/badges';

interface BadgeToastProps {
  badge: Badge;
  onDismiss: () => void;
  duration?: number;
}

export function BadgeToast({ badge, onDismiss, duration = 4000 }: BadgeToastProps) {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-150)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const badgeTitleKey = `badgeItems.${badge.id}.title`;
  const badgeDescriptionKey = `badgeItems.${badge.id}.description`;
  const badgeTitle = t(badgeTitleKey);
  const badgeDescription = t(badgeDescriptionKey);
  const displayTitle = badgeTitle === badgeTitleKey ? badge.title : badgeTitle;
  const displayDescription =
    badgeDescription === badgeDescriptionKey ? badge.description : badgeDescription;

  useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      dismissToast();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + spacing.md,
          backgroundColor: theme.card,
          borderColor: theme.primary,
          shadowColor: theme.shadow,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={dismissToast}
        activeOpacity={0.9}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
          <Ionicons
            name={badge.icon as keyof typeof Ionicons.glyphMap}
            size={24}
            color={theme.white}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>
            {t('badges.badgeUnlocked').toLocaleUpperCase(locale)}
          </Text>
          <Text style={[styles.badgeName, { color: theme.primary }]}>
            {displayTitle}
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {displayDescription}
          </Text>
        </View>
        <Ionicons name="close" size={20} color={theme.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.ui,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  badgeName: {
    fontFamily: fonts.display,
    fontSize: fontSize.lg,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
});
