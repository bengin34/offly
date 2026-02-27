import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useI18n } from '../hooks';
import { spacing, fontSize, borderRadius, fonts } from '../constants';
import type { MilestoneInstanceWithTemplate, MemoryPhoto } from '../types';
import { formatMilestoneDate, isMilestoneInPast, getDaysUntilMilestone } from '../utils/milestones';
import { getLocalizedMilestoneLabel } from '../constants/milestoneTemplates';

interface MilestoneTimelineProps {
  milestones: MilestoneInstanceWithTemplate[];
  isLoading?: boolean;
  onRefresh?: () => Promise<void>;
  onAddMemory?: (milestone: MilestoneInstanceWithTemplate) => void;
  onViewMemory?: (milestone: MilestoneInstanceWithTemplate) => void;
  onEditMemory?: (milestone: MilestoneInstanceWithTemplate) => void;
  onDeleteMemory?: (milestone: MilestoneInstanceWithTemplate) => void;
  locale?: string;
}

export function MilestoneTimeline({
  milestones,
  isLoading = false,
  onRefresh,
  onAddMemory,
  onViewMemory,
  onEditMemory,
  onDeleteMemory,
  locale = 'en-US',
}: MilestoneTimelineProps) {
  const theme = useTheme();
  const { t } = useI18n();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const renderMilestone = ({ item }: { item: MilestoneInstanceWithTemplate }) => {
    const isFilled = item.status === 'filled' && item.associatedMemory;
    const isArchived = item.status === 'archived';
    const isPast = isMilestoneInPast(item.expectedDate);
    const daysUntil = getDaysUntilMilestone(item.expectedDate);
    const displayLabel = getLocalizedMilestoneLabel(item.template, t);

    if (isArchived) {
      return (
        <View style={[styles.milestoneCard, { backgroundColor: theme.card, opacity: 0.6 }]}>
          <View style={styles.milestoneContent}>
            <Ionicons name="archive-outline" size={20} color={theme.textMuted} />
            <View style={styles.milestoneText}>
              <Text style={[styles.milestoneLabel, { color: theme.textMuted }]}>
                {displayLabel}
              </Text>
              <Text style={[styles.milestoneDate, { color: theme.textMuted }]}>
                {formatMilestoneDate(item.expectedDate, locale)}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    if (isFilled) {
      const photo = item.associatedMemory?.photos?.[0];
      return (
        <View style={[styles.milestoneCard, styles.filledCard, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={styles.filledContent}
            onPress={() => onViewMemory?.(item)}
            activeOpacity={0.7}
          >
            {photo ? (
              <Image
                source={{ uri: photo.uri }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.thumbnail, { backgroundColor: theme.background }]}>
                <Ionicons name="image-outline" size={24} color={theme.textMuted} />
              </View>
            )}
            <View style={styles.filledTextContainer}>
              <View style={styles.filledHeader}>
                <Text style={[styles.milestoneLabelFilled, { color: theme.text }]}>
                  {displayLabel}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: theme.primary + '20' },
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
                  <Text style={[styles.statusText, { color: theme.primary }]}>
                    {t('labels.filled')}
                  </Text>
                </View>
              </View>
              <Text style={[styles.memoryTitle, { color: theme.text }]} numberOfLines={1}>
                {item.associatedMemory?.title}
              </Text>
              <Text style={[styles.memoryDate, { color: theme.textSecondary }]} numberOfLines={1}>
                {formatMilestoneDate(item.associatedMemory?.date || '', locale)}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: theme.borderLight }]}
              onPress={() => onEditMemory?.(item)}
            >
              <Ionicons name="create-outline" size={18} color={theme.accent} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: theme.borderLight }]}
              onPress={() => onDeleteMemory?.(item)}
            >
              <Ionicons name="trash-outline" size={18} color={theme.error} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Empty milestone
    return (
      <View style={[styles.milestoneCard, { backgroundColor: theme.card }]}>
        <View style={styles.emptyContent}>
          <View style={styles.emptyLeft}>
            <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="star-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.emptyTextContainer}>
              <Text style={[styles.milestoneLabel, { color: theme.text }]}>
                {displayLabel}
              </Text>
              <Text style={[styles.emptyDate, { color: theme.textSecondary }]}>
                {isPast
                  ? t('labels.milestone.pastDue')
                  : daysUntil === 0
                    ? t('labels.milestone.today')
                    : daysUntil === 1
                      ? t('labels.milestone.tomorrow')
                      : t('labels.milestone.inDays', { count: daysUntil })}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => onAddMemory?.(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color={theme.white} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading && milestones.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (milestones.length === 0) {
    return (
      <View style={[styles.emptyStateContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="star-outline" size={64} color={theme.textMuted} />
        <Text style={[styles.emptyStateTitle, { color: theme.text }]}>
          {t('labels.milestone.empty')}
        </Text>
        <Text style={[styles.emptyStateSubtitle, { color: theme.textMuted }]}>
          {t('labels.milestone.emptySubtitle')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={milestones}
        keyExtractor={(item) => item.id}
        renderItem={renderMilestone}
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} /> : undefined}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    listContent: {
      padding: spacing.md,
      gap: spacing.md,
    },
    milestoneCard: {
      marginBottom: spacing.md,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    filledCard: {
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    milestoneContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    milestoneText: {
      flex: 1,
    },
    milestoneLabel: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      fontWeight: '600',
    },
    milestoneLabelFilled: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      fontWeight: '600',
      flex: 1,
    },
    milestoneDate: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      marginTop: spacing.xs,
    },
    emptyContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    emptyLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyTextContainer: {
      flex: 1,
    },
    emptyDate: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      marginTop: spacing.xs,
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    filledContent: {
      flexDirection: 'row',
      gap: spacing.md,
      padding: spacing.md,
    },
    thumbnail: {
      width: 80,
      height: 80,
      borderRadius: borderRadius.md,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filledTextContainer: {
      flex: 1,
      justifyContent: 'center',
      gap: spacing.xs,
    },
    filledHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
      gap: spacing.xs,
    },
    statusText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      fontWeight: '600',
    },
    memoryTitle: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      fontWeight: '500',
    },
    memoryDate: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      justifyContent: 'flex-start',
    },
    actionButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.md,
    },
    emptyStateTitle: {
      fontSize: fontSize.lg,
      fontFamily: fonts.ui,
      fontWeight: '600',
    },
    emptyStateSubtitle: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
    },
  });

// Use theme hook outside for styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  milestoneCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
  },
  filledCard: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  milestoneContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  milestoneText: {
    flex: 1,
  },
  milestoneLabel: {
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
    fontWeight: '600',
  },
  milestoneLabelFilled: {
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
    fontWeight: '600',
    flex: 1,
  },
  milestoneDate: {
    fontSize: fontSize.sm,
    fontFamily: fonts.ui,
    marginTop: spacing.xs,
  },
  emptyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  emptyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTextContainer: {
    flex: 1,
  },
  emptyDate: {
    fontSize: fontSize.sm,
    fontFamily: fonts.ui,
    marginTop: spacing.xs,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledContent: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledTextContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  filledHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontFamily: fonts.ui,
    fontWeight: '600',
  },
  memoryTitle: {
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
    fontWeight: '500',
  },
  memoryDate: {
    fontSize: fontSize.sm,
    fontFamily: fonts.ui,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    justifyContent: 'flex-start',
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyStateTitle: {
    fontSize: fontSize.lg,
    fontFamily: fonts.ui,
    fontWeight: '600',
  },
  emptyStateSubtitle: {
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
  },
});
