import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatsRepository, type BabyStats, type TagCount, type PostInstallStats } from '../../src/db/repositories';
import { useBadgeStore } from '../../src/stores';
import { BADGES, getBadgeById, type UnlockedBadge, type Badge } from '../../src/utils/badges';
import { StatCard } from '../../src/components/StatCard';
import { BadgeCard } from '../../src/components/BadgeCard';
import { BadgeUnlockDialog } from '../../src/components/BadgeUnlockDialog';
import { BadgeDetailDialog } from '../../src/components/BadgeDetailDialog';
import { Background } from '../../src/components/Background';
import { ProUpgradeBanner } from '../../src/components/ProUpgradeBanner';
import { useI18n, useTheme } from '../../src/hooks';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';

export default function InsightsScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const theme = useTheme();
  const { t, locale } = useI18n();
  const router = useRouter();
  const [stats, setStats] = useState<BabyStats | null>(null);
  const [topTags, setTopTags] = useState<TagCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { unlockedBadges, loadBadges, checkAndUnlockBadges, getAppInstalledAt, pendingToast, clearPendingToast } =
    useBadgeStore();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const loadData = useCallback(async () => {
    try {
      const appInstalledAt = getAppInstalledAt();
      const [statsData, tagsData, postInstallStatsData] = await Promise.all([
        StatsRepository.getStats(),
        StatsRepository.getTopTags(5),
        StatsRepository.getPostInstallStats(appInstalledAt),
      ]);
      setStats(statsData);
      setTopTags(tagsData);

      // Check for newly unlocked badges
      await checkAndUnlockBadges(statsData, postInstallStatsData);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [checkAndUnlockBadges, getAppInstalledAt]);

  useEffect(() => {
    loadBadges();
  }, [loadBadges]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const getUnlockedBadge = (badgeId: string): UnlockedBadge | undefined => {
    return unlockedBadges.find((u) => u.badgeId === badgeId);
  };

  const styles = createStyles(theme);
  const badgeColumns = 3;
  const badgeGap = spacing.sm;
  const badgeGridHorizontalPadding = spacing.md * 2;
  const badgeAvailableWidth = Math.max(screenWidth - badgeGridHorizontalPadding, 0);
  const badgeCardWidth = Math.floor(
    (badgeAvailableWidth - badgeGap * (badgeColumns - 1)) / badgeColumns
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Background />
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const unlockedCount = unlockedBadges.length;
  const totalBadges = BADGES.length;

  return (
    <View style={styles.container}>
      <Background />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      >
        <ProUpgradeBanner style={styles.proBanner} />
        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('insights.sectionStats').toLocaleUpperCase(locale)}
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <StatCard
                value={stats?.totalChapters ?? 0}
                label={t('insights.statsChapters')}
                icon="book"
              />
              <StatCard
                value={stats?.totalMemories ?? 0}
                label={t('insights.statsMemories')}
                subtitle={
                  stats
                    ? t('insights.memoriesBreakdown', {
                        milestones: stats.milestonesCount,
                        notes: stats.notesCount,
                      })
                    : undefined
                }
              />
            </View>
            <View style={styles.statsRow}>
              <StatCard
                value={stats?.totalPhotos ?? 0}
                label={t('insights.statsPhotos')}
                icon="images"
              />
              <StatCard
                value={stats?.totalTags ?? 0}
                label={t('insights.topTags')}
                icon="pricetag"
              />
            </View>
          </View>
        </View>

        {/* Additional Stats */}
        {stats != null && stats.firstMemoryDate != null && (
          <View style={styles.section}>
            <View style={styles.highlightCard}>
              {stats.firstMemoryDate && (
                <View style={styles.highlightRow}>
                  <Ionicons name="flag" size={18} color={theme.success} />
                  <Text style={styles.highlightLabel}>{t('insights.highlightFirstMemory')}</Text>
                  <Text style={styles.highlightValue}>
                    {new Date(stats.firstMemoryDate).toLocaleDateString(locale, {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Top Tags */}
        {topTags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('insights.topTags').toLocaleUpperCase(locale)}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tagsRow}>
                {topTags.map((tag) => (
                  <View key={tag.name} style={styles.tagChip}>
                    <Ionicons name="pricetag" size={14} color={theme.primary} />
                    <Text style={styles.tagName}>{tag.name}</Text>
                    <Text style={styles.tagCount}>{tag.count}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Achievements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t('insights.achievements').toLocaleUpperCase(locale)}
            </Text>
            <TouchableOpacity onPress={() => router.push('/badges')}>
              <Text style={styles.seeAllText}>{t('insights.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          {unlockedCount === 0 ? (
            <TouchableOpacity
              style={styles.badgesEmpty}
              onPress={() => router.push('/badges')}
            >
              <Ionicons name="trophy-outline" size={32} color={theme.textMuted} />
              <Text style={styles.badgesEmptyText}>{t('insights.noBadgesEarned')}</Text>
              <Text style={styles.badgesEmptyHint}>
                {t('insights.badgesEmptyHint')}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.badgesGrid}>
                {unlockedBadges.slice(0, 6).map((unlocked) => {
                  const badge = getBadgeById(unlocked.badgeId);
                  if (!badge) return null;
                  return (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      unlocked={unlocked}
                      style={{ width: badgeCardWidth }}
                      onPress={() => setSelectedBadge(badge)}
                    />
                  );
                })}
              </View>
              {unlockedCount > 6 && (
                <TouchableOpacity
                  style={styles.viewMoreBadges}
                  onPress={() => router.push('/badges')}
                >
                  <Text style={styles.viewMoreText}>
                    {t('insights.moreBadges', { count: unlockedCount - 6 })}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={theme.primary} />
                </TouchableOpacity>
              )}
              <View style={styles.badgeProgress}>
                <Text style={[styles.badgeProgressText, { color: theme.textMuted }]}>
                  {t('insights.badgesProgress', {
                    unlocked: unlockedCount,
                    total: totalBadges,
                  })}
                </Text>
              </View>
            </>
          )}
        </View>
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

      {/* Badge Unlock Dialog */}
      {pendingToast && (
        <BadgeUnlockDialog
          badge={pendingToast}
          unlocked={unlockedBadges.find((u) => u.badgeId === pendingToast.id)}
          visible={!!pendingToast}
          onClose={clearPendingToast}
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
    scrollContent: {
      paddingBottom: spacing.xxl,
    },
    proBanner: {
      marginHorizontal: spacing.md,
      marginTop: spacing.md,
    },
    section: {
      padding: spacing.md,
      paddingBottom: 0,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    statsGrid: {
      gap: spacing.sm,
    },
    statsRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    highlightCard: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.sm,
    },
    highlightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    highlightLabel: {
      flex: 1,
      fontFamily: fonts.body,
      fontSize: fontSize.sm,
      color: theme.textSecondary,
    },
    highlightValue: {
      fontFamily: fonts.ui,
      fontSize: fontSize.md,
      color: theme.text,
    },
    tagsRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingRight: spacing.md,
    },
    tagChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: borderRadius.full,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.xs,
    },
    tagName: {
      fontFamily: fonts.ui,
      fontSize: fontSize.sm,
      color: theme.text,
    },
    tagCount: {
      fontFamily: fonts.body,
      fontSize: fontSize.xs,
      color: theme.textMuted,
      backgroundColor: theme.backgroundSecondary,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
      overflow: 'hidden',
    },
    badgesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      columnGap: spacing.sm,
      rowGap: spacing.sm,
    },
    badgesEmpty: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      alignItems: 'center',
      gap: spacing.xs,
      borderWidth: 1,
      borderColor: theme.border,
      borderStyle: 'dashed',
    },
    badgesEmptyText: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.text,
    },
    badgesEmptyHint: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textMuted,
      textAlign: 'center',
    },
    viewMoreBadges: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
    },
    viewMoreText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.primary,
    },
    badgeProgress: {
      alignItems: 'center',
      paddingTop: spacing.xs,
    },
    badgeProgressText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
    },
    seeAllText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.primary,
      marginBottom: spacing.sm,
    },
  });
