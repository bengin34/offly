import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';
import { fonts, fontSize, spacing, borderRadius } from '../constants/colors';
import type { Badge, UnlockedBadge } from '../utils/badges';

interface BadgeCardProps {
  badge: Badge;
  unlocked?: UnlockedBadge;
  progress?: {
    current: number;
    target: number;
    percentage: number;
  };
  onPress?: () => void;
}

export function BadgeCard({ badge, unlocked, progress, onPress }: BadgeCardProps) {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const isUnlocked = !!unlocked;
  const badgeTitleKey = `badgeItems.${badge.id}.title`;
  const badgeTitle = t(badgeTitleKey);
  const displayTitle = badgeTitle === badgeTitleKey ? badge.title : badgeTitle;

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    try {
      return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      style={[
        styles.container,
        {
          backgroundColor: isUnlocked ? theme.card : theme.backgroundSecondary,
          borderColor: isUnlocked ? theme.primary : theme.border,
          opacity: isUnlocked ? 1 : 0.7,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isUnlocked ? theme.primary : theme.border,
          },
        ]}
      >
        <Ionicons
          name={badge.icon as keyof typeof Ionicons.glyphMap}
          size={24}
          color={isUnlocked ? theme.white : theme.textMuted}
        />
      </View>
      <Text
        style={[
          styles.title,
          { color: isUnlocked ? theme.text : theme.textMuted },
        ]}
        numberOfLines={1}
      >
        {displayTitle}
      </Text>
      {isUnlocked && unlocked ? (
        <Text style={[styles.status, { color: theme.success }]}>
          {formatDate(unlocked.unlockedAt)}
        </Text>
      ) : progress ? (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.primary,
                  width: `${progress.percentage}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textMuted }]}>
            {progress.current}/{progress.target}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 110,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.ui,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  status: {
    fontFamily: fonts.body,
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: fonts.body,
    fontSize: fontSize.xs,
  },
});
