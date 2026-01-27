import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';
import { fonts, fontSize, spacing, borderRadius } from '../constants/colors';
import type { Badge, UnlockedBadge } from '../utils/badges';

interface BadgeDetailDialogProps {
  badge: Badge;
  unlocked?: UnlockedBadge;
  visible: boolean;
  onClose: () => void;
}

export function BadgeDetailDialog({ badge, unlocked, visible, onClose }: BadgeDetailDialogProps) {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const isUnlocked = !!unlocked;
  const badgeTitleKey = `badgeItems.${badge.id}.title`;
  const badgeDescriptionKey = `badgeItems.${badge.id}.description`;
  const badgeTitle = t(badgeTitleKey);
  const badgeDescription = t(badgeDescriptionKey);
  const displayTitle = badgeTitle === badgeTitleKey ? badge.title : badgeTitle;
  const displayDescription =
    badgeDescription === badgeDescriptionKey ? badge.description : badgeDescription;

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
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.dialog, { backgroundColor: theme.card }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <Pressable style={styles.closeButton} onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={theme.textMuted} />
          </Pressable>

          {/* Badge Icon */}
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
              size={48}
              color={isUnlocked ? theme.white : theme.textMuted}
            />
          </View>

          {/* Badge Title */}
          <Text style={[styles.title, { color: theme.text }]}>{displayTitle}</Text>

          {/* Description */}
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {displayDescription}
          </Text>

          {/* Unlocked Status */}
          {isUnlocked && unlocked ? (
            <View style={styles.unlockedSection}>
              <View style={[styles.congratsBadge, { backgroundColor: theme.success + '20' }]}>
                <Ionicons name="checkmark-circle" size={20} color={theme.success} />
                <Text style={[styles.congratsText, { color: theme.success }]}>
                  {t('badgeDetail.congratulations')}
                </Text>
              </View>
              <Text style={[styles.unlockedDate, { color: theme.textMuted }]}>
                {t('badgeDetail.earnedOn', { date: formatDate(unlocked.unlockedAt) })}
              </Text>
            </View>
          ) : (
            <View style={styles.lockedSection}>
              <View style={[styles.lockedBadge, { backgroundColor: theme.backgroundSecondary }]}>
                <Ionicons name="lock-closed" size={18} color={theme.textMuted} />
                <Text style={[styles.lockedText, { color: theme.textMuted }]}>
                  {t('badgeDetail.notYetEarned')}
                </Text>
              </View>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 320,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    padding: spacing.xs,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSize.xl,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  unlockedSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  congratsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  congratsText: {
    fontFamily: fonts.ui,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  unlockedDate: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  lockedSection: {
    alignItems: 'center',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  lockedText: {
    fontFamily: fonts.ui,
    fontSize: fontSize.sm,
  },
});
