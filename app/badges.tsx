import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBadgeStore } from '../src/stores';
import { BADGES, getBadgeProgress, type UnlockedBadge, type Badge } from '../src/utils/badges';
import { StatsRepository, type BabyStats, type PostInstallStats } from '../src/db/repositories';
import { BadgeDetailDialog } from '../src/components/BadgeDetailDialog';
import { Background } from '../src/components/Background';
import { useI18n, useTheme } from '../src/hooks';
import { spacing, fontSize, borderRadius, fonts } from '../src/constants';

export default function AllBadgesScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const { unlockedBadges, loadBadges, getAppInstalledAt } = useBadgeStore();
  const [stats, setStats] = useState<BabyStats | null>(null);
  const [postInstallStats, setPostInstallStats] = useState<PostInstallStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const loadData = useCallback(async () => {
    try {
      await loadBadges();
      const appInstalledAt = getAppInstalledAt();
      const [statsData, postInstallStatsData] = await Promise.all([
        StatsRepository.getStats(),
        StatsRepository.getPostInstallStats(appInstalledAt),
      ]);
      setStats(statsData);
      setPostInstallStats(postInstallStatsData);
    } catch (error) {
      console.error('Failed to load badges data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadBadges, getAppInstalledAt]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getUnlockedBadge = (badgeId: string): UnlockedBadge | undefined => {
    return unlockedBadges.find((u) => u.badgeId === badgeId);
  };

  const unlockedCount = unlockedBadges.length;
  const totalBadges = BADGES.length;

  // Group badges by category
  const specialBadges = BADGES.filter((b) => b.id === 'historian');
  const firstBadges = BADGES.filter((b) => b.id.startsWith('first_'));
  const tripBadges = BADGES.filter((b) => b.id.startsWith('trips_'));
  const placeBadges = BADGES.filter((b) => b.id.startsWith('places_'));
  const entryBadges = BADGES.filter((b) => b.id.startsWith('entries_'));
  const countryBadges = BADGES.filter((b) => b.id.startsWith('countries_'));
  const photoBadges = BADGES.filter((b) => b.id.startsWith('photos_'));
  const cityBadges = BADGES.filter((b) => b.id.startsWith('cities_'));
  const tagBadges = BADGES.filter((b) => b.id.startsWith('tag_'));

  const styles = createStyles(theme);

  const renderBadgeItem = (badge: Badge) => {
    const unlocked = getUnlockedBadge(badge.id);
    const isUnlocked = !!unlocked;
    const progress = stats && postInstallStats && !isUnlocked ? getBadgeProgress(stats, postInstallStats, badge) : undefined;
    const badgeTitleKey = `badgeItems.${badge.id}.title`;
    const badgeTitle = t(badgeTitleKey);
    const displayTitle = badgeTitle === badgeTitleKey ? badge.title : badgeTitle;

    return (
      <TouchableOpacity
        key={badge.id}
        style={[
          styles.badgeItem,
          {
            backgroundColor: isUnlocked ? theme.card : theme.backgroundSecondary,
            borderColor: isUnlocked ? theme.primary : theme.border,
          },
        ]}
        onPress={() => setSelectedBadge(badge)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.badgeIcon,
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
        <View style={styles.badgeInfo}>
          <Text
            style={[
              styles.badgeTitle,
              { color: isUnlocked ? theme.text : theme.textMuted },
            ]}
            numberOfLines={1}
          >
            {displayTitle}
          </Text>
          {isUnlocked ? (
            <View style={styles.unlockedIndicator}>
              <Ionicons name="checkmark-circle" size={14} color={theme.success} />
              <Text style={[styles.badgeStatus, { color: theme.success }]}>
                {t('badges.earned')}
              </Text>
            </View>
          ) : progress ? (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: theme.primary, width: `${progress.percentage}%` },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: theme.textMuted }]}>
                {progress.current}/{progress.target}
              </Text>
            </View>
          ) : (
            <Text style={[styles.badgeStatus, { color: theme.textMuted }]}>
              {t('badges.locked')}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, badges: Badge[]) => {
    if (badges.length === 0) return null;
    const sectionUnlocked = badges.filter((b) => getUnlockedBadge(b.id)).length;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={[styles.sectionCount, { color: theme.primary }]}>
            {sectionUnlocked}/{badges.length}
          </Text>
        </View>
        {badges.map(renderBadgeItem)}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Background />
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Background />


      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="trophy" size={32} color={theme.primary} />
          <View style={styles.summaryText}>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {unlockedCount} / {totalBadges}
            </Text>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              {t('badges.badgesEarned')}
            </Text>
          </View>
          <View style={styles.summaryProgress}>
            <View style={[styles.summaryProgressBar, { backgroundColor: theme.border }]}>
              <View
                style={[
                  styles.summaryProgressFill,
                  {
                    backgroundColor: theme.primary,
                    width: `${Math.round((unlockedCount / totalBadges) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.summaryPercent, { color: theme.textMuted }]}>
              {Math.round((unlockedCount / totalBadges) * 100)}%
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSection(t('badges.special'), specialBadges)}
        {renderSection(t('badges.firstSteps'), firstBadges)}
        {renderSection(t('badges.chapterMilestones'), tripBadges)}
        {renderSection(t('badges.milestoneAchievements'), placeBadges)}
        {renderSection(t('badges.entryMilestones'), entryBadges)}
        {renderSection(t('badges.consistencyMilestones'), countryBadges)}
        {renderSection(t('badges.photoMilestones'), photoBadges)}
        {renderSection(t('badges.tagMilestones'), cityBadges)}
        {renderSection(t('badges.tagAdventures'), tagBadges)}
      </ScrollView>

      {/* Badge Detail Dialog */}
      {selectedBadge && (
        <BadgeDetailDialog
          badge={selectedBadge}
          unlocked={getUnlockedBadge(selectedBadge.id)}
          visible={!!selectedBadge}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.lg,
      paddingBottom: spacing.sm,
    },
    backButton: {
      padding: spacing.xs,
    },
    headerTitle: {
      flex: 1,
      fontFamily: fonts.heading,
      fontSize: fontSize.xl,
      color: theme.text,
      textAlign: 'center',
    },
    headerRight: {
      width: 32,
    },
    summaryContainer: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
    },
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      gap: spacing.md,
    },
    summaryText: {
      flex: 1,
    },
    summaryValue: {
      fontFamily: fonts.display,
      fontSize: fontSize.xl,
    },
    summaryLabel: {
      fontFamily: fonts.body,
      fontSize: fontSize.sm,
    },
    summaryProgress: {
      alignItems: 'flex-end',
      gap: spacing.xs,
    },
    summaryProgressBar: {
      width: 60,
      height: 6,
      borderRadius: borderRadius.full,
      overflow: 'hidden',
    },
    summaryProgressFill: {
      height: '100%',
      borderRadius: borderRadius.full,
    },
    summaryPercent: {
      fontFamily: fonts.body,
      fontSize: fontSize.xs,
    },
    scrollContent: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xxl,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      fontFamily: fonts.ui,
      fontSize: fontSize.sm,
      color: theme.textSecondary,
      letterSpacing: 0.3,
    },
    sectionCount: {
      fontFamily: fonts.ui,
      fontSize: fontSize.sm,
    },
    badgeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      marginBottom: spacing.sm,
      gap: spacing.md,
    },
    badgeIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeInfo: {
      flex: 1,
    },
    badgeTitle: {
      fontFamily: fonts.ui,
      fontSize: fontSize.md,
      marginBottom: spacing.xs,
    },
    unlockedIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    badgeStatus: {
      fontFamily: fonts.body,
      fontSize: fontSize.sm,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    progressBar: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      overflow: 'hidden',
      maxWidth: 80,
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
