import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
  Animated,
  Pressable,
} from 'react-native';
import { useRouter, useFocusEffect, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ChapterRepository,
  BabyProfileRepository,
  VaultRepository,
  MemoryRepository,
} from '../../src/db/repositories';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { getChapterPlaceholder } from '../../src/constants/chapterTemplates';
import { getPregnancyChapterPlaceholder, getPregnancyChapterTemplateByTitle } from '../../src/constants/pregnancyChapterTemplates';
import { calculateGestationWeeks } from '../../src/utils/milestones';
import { Background } from '../../src/components/Background';
import { ProUpgradeBanner } from '../../src/components/ProUpgradeBanner';
import { ProfileSwitcherModal } from '../../src/components/ProfileSwitcherModal';
import { useI18n, useTheme } from '../../src/hooks';
import { useProfileStore } from '../../src/stores/profileStore';
import { formatHeaderTitle } from '../../src/utils/ageFormatter';
import type { ChapterWithMilestoneProgress, BabyProfile, VaultWithEntryCount } from '../../src/types';
import { useMockData } from '../../src/mocks/useMockData';
import { cleanupBornChapters } from '../../src/utils/autoGenerate';

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const { t, locale } = useI18n();
  const { activeBaby, loadActiveProfile } = useProfileStore();
  const babyMockData = useMockData(locale, 'baby');
  const pregnancyMockData = useMockData(locale, 'pregnancy');

  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [profile, setProfile] = useState<BabyProfile | null>(null);
  const [chapters, setChapters] = useState<ChapterWithMilestoneProgress[]>([]);
  const [vaults, setVaults] = useState<VaultWithEntryCount[]>([]);
  const [pregnancyEntryCount, setPregnancyEntryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const shouldAutoFocusCurrentChapter = useRef(false);
  const chapterYByIdRef = useRef<Record<string, number>>({});
  const fabAnim = useRef(new Animated.Value(0)).current;

  const getCurrentChapterIdFromList = useCallback((list: ChapterWithMilestoneProgress[]) => {
    const now = Date.now();
    for (const ch of list) {
      const start = new Date(ch.startDate).getTime();
      const end = ch.endDate ? new Date(ch.endDate).getTime() : Infinity;
      if (now >= start && now < end) return ch.id;
    }
    return list.length > 0 ? list[list.length - 1].id : null;
  }, []);

  const scrollToCurrentChapter = useCallback((chapterId: string | null, animated = true) => {
    if (!chapterId) return false;
    const y = chapterYByIdRef.current[chapterId];
    if (typeof y !== 'number') return false;
    scrollViewRef.current?.scrollTo({
      y: Math.max(0, y - spacing.xl),
      animated,
    });
    return true;
  }, []);

  const loadData = useCallback(async () => {
    shouldAutoFocusCurrentChapter.current = true;
    try {
      // Use active profile from store instead of getDefault()
      let babyProfile = activeBaby;
      if (!babyProfile) {
        babyProfile = await BabyProfileRepository.getDefault();
      }

      // Auto-create a default profile if none exists
      if (!babyProfile) {
        babyProfile = await BabyProfileRepository.create({ mode: 'born' });
      }

      setProfile(babyProfile);

      // Load vaults for all modes
      const vaultData = await VaultRepository.getAllWithEntryCounts(babyProfile.id);
      setVaults(vaultData);

      // Check and auto-unlock vaults
      await VaultRepository.checkAndUnlock(babyProfile.id);

      if (babyProfile.mode === 'pregnant') {
        // Auto-generate weekly chapters (handles migration from old formats)
        if (babyProfile.edd) {
          await ChapterRepository.autoGeneratePregnancyChapters(babyProfile.id, babyProfile.edd);
        }

        // Load chapters with progress (same as born mode)
        let chapterData = await ChapterRepository.getAllWithProgress(babyProfile.id);

        // Apply mock data if active
        if (pregnancyMockData) {
          chapterData = chapterData.map((chapter, index) => {
            const mock = pregnancyMockData.milestones[index % pregnancyMockData.milestones.length];
            return {
              ...chapter,
              title: mock?.title ?? chapter.title,
              coverImageUri: mock?.imageUrl,
              milestoneFilled: Math.min(index + 2, chapter.milestoneTotal),
              memoryCount: index + 3,
            };
          });
        }

        setChapters(chapterData);

        // Also load pregnancy journal count
        const count = await MemoryRepository.countPregnancyJournal();
        setPregnancyEntryCount(count);

        const currentId = getCurrentChapterIdFromList(chapterData);
        requestAnimationFrame(() => {
          if (!shouldAutoFocusCurrentChapter.current) return;
          if (scrollToCurrentChapter(currentId, true)) {
            shouldAutoFocusCurrentChapter.current = false;
          }
        });
      } else {
        // Clean up any leftover pregnancy chapters or duplicates from the DB
        await cleanupBornChapters(babyProfile.id);

        let chapterData = await ChapterRepository.getAllWithProgress(babyProfile.id);

        // Apply mock data if active
        if (babyMockData) {
          chapterData = chapterData.map((chapter, index) => {
            const mock = babyMockData.milestones[index % babyMockData.milestones.length];
            return {
              ...chapter,
              title: mock?.title ?? chapter.title,
              coverImageUri: mock?.imageUrl,
              milestoneFilled: Math.min(index + 2, chapter.milestoneTotal),
              memoryCount: index + 3,
            };
          });
        }

        setChapters(chapterData);
        const currentId = getCurrentChapterIdFromList(chapterData);
        requestAnimationFrame(() => {
          if (!shouldAutoFocusCurrentChapter.current) return;
          if (scrollToCurrentChapter(currentId, true)) {
            shouldAutoFocusCurrentChapter.current = false;
          }
        });
      }
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeBaby, getCurrentChapterIdFromList, scrollToCurrentChapter, babyMockData, pregnancyMockData]);

  useFocusEffect(
    useCallback(() => {
      loadActiveProfile().then(() => loadData());
    }, [loadActiveProfile, loadData])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const toggleFab = () => {
    const toValue = fabOpen ? 0 : 1;
    setFabOpen(!fabOpen);
    Animated.spring(fabAnim, {
      toValue,
      useNativeDriver: true,
      friction: 6,
    }).start();
  };

  const closeFab = () => {
    setFabOpen(false);
    Animated.spring(fabAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 6,
    }).start();
  };

  const formatDatePart = useCallback(
    (date: Date, options: Intl.DateTimeFormatOptions) => {
      try {
        return date.toLocaleDateString(locale, options);
      } catch (error) {
        return date.toLocaleDateString(undefined, options);
      }
    },
    [locale]
  );

  const formatDateRange = useCallback(
    (startDate: string, endDate?: string) => {
      const start = new Date(startDate);
      const startLabel = formatDatePart(start, { month: 'short', day: 'numeric' });
      if (!endDate) return startLabel;
      const end = new Date(endDate);
      const endLabel = formatDatePart(end, { month: 'short', day: 'numeric' });
      return `${startLabel} - ${endLabel}`;
    },
    [formatDatePart]
  );

  const styles = createStyles(theme);

  const isPregnant = profile?.mode === 'pregnant';

  useEffect(() => {
    let dynamicTitle = formatHeaderTitle(profile, t);

    // For pregnancy mode, add current week to title
    if (profile?.mode === 'pregnant' && profile.edd) {
      const currentWeek = calculateGestationWeeks(profile.edd);
      dynamicTitle = `${t('home.weekLabel', { week: currentWeek })} · ${dynamicTitle}`;
    }

    navigation.setOptions({
      headerTitle: dynamicTitle || t('tabs.chapters'),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowProfileSwitcher(true)}
          style={styles.headerProfileButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={profile?.mode === 'pregnant' ? 'heart' : 'happy'}
            size={18}
            color={theme.primary}
          />
          <Text style={styles.headerProfileName} numberOfLines={1}>
            {profile?.name || t('profiles.defaultName')}
          </Text>
          <Ionicons name="chevron-down" size={14} color={theme.textMuted} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, profile, t, theme, styles]);

  // --- Section: Pregnancy Journal Link (appears below timeline for pregnancy mode) ---
  const renderPregnancyJournalLink = () => {
    if (pregnancyEntryCount === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.journalLinkCard}
          onPress={() => router.push('/pregnancy-journal')}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text-outline" size={20} color={theme.primary} />
          <Text style={styles.journalLinkText}>
            {t('home.journalEntries', { count: pregnancyEntryCount })}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </TouchableOpacity>
      </View>
    );
  };

  const currentChapterId = getCurrentChapterIdFromList(chapters);

  // Get week label for pregnancy chapters
  const getWeekLabelForChapter = useCallback((chapter: ChapterWithMilestoneProgress, edd: string) => {
    const start = new Date(chapter.startDate);
    const end = chapter.endDate ? new Date(chapter.endDate) : new Date();
    const now = Date.now();
    const isCurrentChapter = now >= start.getTime() && now <= end.getTime();

    if (isCurrentChapter) {
      const currentWeek = calculateGestationWeeks(edd);
      return t('home.weekLabel', { week: currentWeek });
    }

    // For past/future chapters, show week range
    const template = getPregnancyChapterTemplateByTitle(chapter.title);
    if (template) {
      return template.gestationWeeksMin === template.gestationWeeksMax
        ? t('home.weekLabel', { week: template.gestationWeeksMin })
        : t('home.weeksLabel', { min: template.gestationWeeksMin, max: template.gestationWeeksMax });
    }
    return '';
  }, [t]);

  // --- Section: Chapters Timeline ---
  const renderChaptersSection = () => (
    <View style={styles.sectionContainer}>
      {chapters.length === 0 ? (
        <View style={styles.emptySection}>
          <Ionicons name="book-outline" size={48} color={theme.textMuted} />
          <Text style={styles.emptySectionTitle}>{t('home.noChaptersTitle')}</Text>
          <Text style={styles.emptySectionSubtitle}>
            {t('home.noChaptersSubtitle')}
          </Text>
        </View>
      ) : (
        chapters.map((item, index) => {
          const startDate = new Date(item.startDate);
          const endDate = item.endDate ? new Date(item.endDate) : null;
          const now = Date.now();
          const isCurrent = item.id === currentChapterId;
          const isPast = endDate ? now >= endDate.getTime() : false;
          const isFuture = now < startDate.getTime();
          const coverImage = item.coverImageUri;
          const placeholder = isPregnant
            ? getPregnancyChapterPlaceholder(item.title)
            : getChapterPlaceholder(item.title);
          const hasMilestones = item.milestoneTotal > 0;
          const hasContent = item.memoryCount > 0 || item.milestoneFilled > 0;
          const progressPct = hasMilestones
            ? Math.round((item.milestoneFilled / item.milestoneTotal) * 100)
            : 0;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.timelineRow, isFuture && styles.timelineRowFuture]}
              onPress={() => router.push(`/chapter/${item.id}`)}
              activeOpacity={0.8}
              onLayout={(event) => {
                chapterYByIdRef.current[item.id] = event.nativeEvent.layout.y;
                if (!isCurrent || !shouldAutoFocusCurrentChapter.current) return;
                requestAnimationFrame(() => {
                  if (scrollToCurrentChapter(item.id, true)) {
                    shouldAutoFocusCurrentChapter.current = false;
                  }
                });
              }}
            >
              {/* Timeline line + dot */}
              <View style={styles.dateColumn}>
                {index > 0 && <View style={styles.dateLine} />}
                <View
                  style={[
                    styles.timelineDot,
                    isCurrent && styles.timelineDotCurrent,
                    isPast && hasContent && styles.timelineDotFilled,
                    isFuture && styles.timelineDotFuture,
                  ]}
                >
                  {isCurrent ? (
                    <Ionicons name="ellipse" size={10} color={theme.white} />
                  ) : isPast && hasContent ? (
                    <Ionicons name="checkmark" size={12} color={theme.white} />
                  ) : null}
                </View>
                {index < chapters.length - 1 && <View style={styles.dateLineBottom} />}
              </View>

              {/* Chapter card */}
              <View
                style={[
                  styles.chapterCard,
                  isCurrent && styles.chapterCardCurrent,
                  isFuture && styles.chapterCardFuture,
                ]}
              >
                {/* Cover image or placeholder */}
                {coverImage ? (
                  <View style={styles.chapterMedia}>
                    <Image source={{ uri: coverImage }} style={styles.chapterImage} />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.chapterImagePlaceholder,
                      { backgroundColor: placeholder.bgColor + '25' },
                    ]}
                  >
                    <Ionicons
                      name={placeholder.icon as any}
                      size={36}
                      color={placeholder.bgColor}
                    />
                    <View style={styles.addPhotoHint}>
                      <Ionicons name="camera-outline" size={12} color={theme.textMuted} />
                      <Text style={styles.chapterImageText}>{t('home.addPhoto')}</Text>
                    </View>
                    {/* Monthly milestone badge for pregnancy weeks */}
                    {isPregnant && (() => {
                      const template = getPregnancyChapterTemplateByTitle(item.title);
                      return template?.isMonthlyMilestone ? (
                        <View style={styles.monthlyMilestoneBadge}>
                          <Ionicons name="star" size={16} color={theme.primary} />
                        </View>
                      ) : null;
                    })()}
                  </View>
                )}

                <View style={styles.chapterBody}>
                  <View style={styles.chapterTitleRow}>
                    <Text
                      style={[
                        styles.chapterTitle,
                        isFuture && styles.chapterTitleFuture,
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {isCurrent && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>{t('home.nowBadge')}</Text>
                      </View>
                    )}
                  </View>

                  {/* Date range with week for pregnancy */}
                  <Text style={[styles.chapterDateRange, isFuture && styles.chapterDateRangeFuture]}>
                    {isPregnant && profile?.edd && (
                      <Text style={styles.weekLabel}>
                        {getWeekLabelForChapter(item, profile.edd)} ·{' '}
                      </Text>
                    )}
                    {formatDateRange(item.startDate, item.endDate)}
                  </Text>

                  {/* Milestone progress bar */}
                  {hasMilestones && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${progressPct}%` },
                            isFuture && styles.progressFillFuture,
                          ]}
                        />
                      </View>
                      <Text style={[styles.progressText, isFuture && styles.progressTextFuture]}>
                        {item.milestoneFilled}/{item.milestoneTotal}
                      </Text>
                    </View>
                  )}

                  {/* Memory count for past chapters */}
                  {isPast && item.memoryCount > 0 && (
                    <Text style={styles.memoryCountText}>
                      {item.memoryCount === 1
                        ? t('home.memoryCount', { count: 1 })
                        : t('home.memoryCountPlural', { count: item.memoryCount })}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );

  // --- Section: Vaults ---
  const renderVaultsSection = () => {
    if (vaults.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.vaultsTitle')}</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          {t('home.vaultsSubtitle')}
        </Text>
        {vaults.map((vault) => {
          const isLocked = vault.status === 'locked';
          const unlockLabel = vault.unlockDate
            ? formatDatePart(new Date(vault.unlockDate), {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : t('home.vaultDateNotSet');

          return (
            <TouchableOpacity
              key={vault.id}
              style={styles.vaultCard}
              onPress={() => router.push(`/vault/${vault.id}`)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.vaultIcon,
                  { backgroundColor: isLocked ? theme.accentSoft : theme.success + '20' },
                ]}
              >
                <Ionicons
                  name={isLocked ? 'lock-closed' : 'lock-open'}
                  size={20}
                  color={isLocked ? theme.accent : theme.success}
                />
              </View>
              <View style={styles.vaultContent}>
                <Text style={styles.vaultTitle}>
                  {vault.targetAgeYears === 1
                    ? t('home.vaultYearSingular')
                    : t('home.vaultYearPlural', { count: vault.targetAgeYears })}
                </Text>
                <Text style={styles.vaultMeta}>
                  {isLocked
                    ? t('home.vaultUnlocks', { date: unlockLabel })
                    : t('home.vaultUnlocked')}
                  {vault.entryCount > 0 &&
                    ` · ${vault.entryCount === 1
                      ? t('home.vaultLetterCount', { count: 1 })
                      : t('home.vaultLetterCountPlural', { count: vault.entryCount })}`}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // --- Empty state (no profile — should rarely show since we auto-create) ---
  const renderNoProfile = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="person-outline" size={64} color={theme.textMuted} />
      <Text style={styles.emptyTitle}>{t('home.noProfileTitle')}</Text>
      <Text style={styles.emptySubtitle}>
        {t('home.noProfileSubtitle')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Background />
      <ScrollView
        ref={scrollViewRef}
        stickyHeaderIndices={[0]}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
          />
        }
      >
        <View style={styles.stickyTopHeader}>
          <ProUpgradeBanner style={styles.proBanner} />
          {profile && (
            <View style={styles.timelineStickyHeader}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {isPregnant ? t('home.pregnancyTimeline') : t('home.timeline')}
                </Text>
              </View>
            </View>
          )}
        </View>

        {!isLoading && !profile && renderNoProfile()}

        {profile && renderChaptersSection()}
        {profile && isPregnant && renderPregnancyJournalLink()}
        {profile && renderVaultsSection()}
      </ScrollView>

      {/* FAB for quick add */}
      {profile && !isLoading && (
        <>
          {/* Backdrop when FAB menu is open */}
          {fabOpen && (
            <Pressable style={styles.fabBackdrop} onPress={closeFab} />
          )}

          {/* Speed-dial options (born mode only, when chapters exist) */}
          {!isPregnant && chapters.length > 0 && (
            <>
              {/* New Memory option */}
              <Animated.View
                style={[
                  styles.fabOption,
                  {
                    bottom: spacing.md + 56 + 12 + 56 + 12,
                    opacity: fabAnim,
                    transform: [
                      {
                        translateY: fabAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [40, 0],
                        }),
                      },
                    ],
                  },
                ]}
                pointerEvents={fabOpen ? 'auto' : 'none'}
              >
                <TouchableOpacity
                  style={styles.fabOptionRow}
                  onPress={() => {
                    closeFab();
                    const lastChapter = chapters[0];
                    router.push(`/memory/new?chapterId=${lastChapter.id}`);
                  }}
                >
                  <View style={styles.fabOptionLabel}>
                    <Text style={styles.fabOptionText}>{t('home.fabNewMemory')}</Text>
                  </View>
                  <View style={[styles.fabOptionIcon, { backgroundColor: theme.accent }]}>
                    <Ionicons name="star-outline" size={22} color={theme.white} />
                  </View>
                </TouchableOpacity>
              </Animated.View>

              {/* New Chapter option */}
              <Animated.View
                style={[
                  styles.fabOption,
                  {
                    bottom: spacing.md + 56 + 12,
                    opacity: fabAnim,
                    transform: [
                      {
                        translateY: fabAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
                pointerEvents={fabOpen ? 'auto' : 'none'}
              >
                <TouchableOpacity
                  style={styles.fabOptionRow}
                  onPress={() => {
                    closeFab();
                    router.push('/chapter/new');
                  }}
                >
                  <View style={styles.fabOptionLabel}>
                    <Text style={styles.fabOptionText}>{t('home.fabNewChapter')}</Text>
                  </View>
                  <View style={[styles.fabOptionIcon, { backgroundColor: theme.primary }]}>
                    <Ionicons name="book-outline" size={22} color={theme.white} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </>
          )}

          {/* Main FAB */}
          <TouchableOpacity
            style={styles.fab}
            onPress={() => {
              if (isPregnant) {
                router.push('/pregnancy-journal/new-entry');
              } else if (chapters.length === 0) {
                router.push('/chapter/new');
              } else {
                toggleFab();
              }
            }}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: fabAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '45deg'],
                    }),
                  },
                ],
              }}
            >
              <Ionicons name="add" size={28} color={theme.white} />
            </Animated.View>
          </TouchableOpacity>
        </>
      )}
      <ProfileSwitcherModal
        visible={showProfileSwitcher}
        onClose={() => setShowProfileSwitcher(false)}
      />
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl + 72,
      paddingHorizontal: spacing.md,
    },
    proBanner: {
      marginBottom: 0,
    },
    stickyTopHeader: {
      backgroundColor: theme.background,
      paddingBottom: spacing.md,
      zIndex: 20,
    },
    timelineStickyHeader: {
      backgroundColor: theme.background,
      paddingTop: spacing.sm,
    },

    // Section layout
    sectionContainer: {
      marginBottom: spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      fontSize: fontSize.xl,
      fontFamily: fonts.display,
      color: theme.text,
    },
    sectionSubtitle: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginBottom: spacing.md,
    },

    // Pregnancy Journal card
    journalCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: borderRadius.xl,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 2,
    },
    journalCardIcon: {
      width: 56,
      height: 56,
      borderRadius: borderRadius.lg,
      backgroundColor: theme.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    journalCardContent: {
      flex: 1,
    },
    journalCardTitle: {
      fontSize: fontSize.lg,
      fontFamily: fonts.heading,
      color: theme.text,
    },
    journalCardSubtitle: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: 2,
    },
    journalLinkCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: borderRadius.md,
      padding: spacing.sm,
      borderWidth: 1,
      borderColor: theme.borderLight,
      gap: spacing.xs,
    },
    journalLinkText: {
      flex: 1,
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.text,
    },

    // Vault cards
    vaultCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 1,
    },
    vaultIcon: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    vaultContent: {
      flex: 1,
    },
    vaultTitle: {
      fontSize: fontSize.md,
      fontFamily: fonts.heading,
      color: theme.text,
    },
    vaultMeta: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: 2,
    },

    // Timeline (chapters)
    timelineRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.lg,
    },
    dateColumn: {
      width: 60,
      alignItems: 'center',
      position: 'relative',
      paddingTop: 6,
      marginRight: spacing.sm,
    },
    dateLine: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: 2,
      left: '50%',
      marginLeft: -1,
      backgroundColor: theme.borderLight,
      borderRadius: 2,
    },
    timelineRowFuture: {
      opacity: 0.55,
    },
    timelineDot: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.borderLight,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
    timelineDotCurrent: {
      backgroundColor: theme.primary,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 3,
    },
    timelineDotFilled: {
      backgroundColor: theme.success,
    },
    timelineDotFuture: {
      backgroundColor: theme.borderLight,
      borderWidth: 2,
      borderColor: theme.border,
    },
    dateLineBottom: {
      position: 'absolute',
      top: 30,
      bottom: -spacing.lg,
      width: 2,
      left: '50%',
      marginLeft: -1,
      backgroundColor: theme.borderLight,
      borderRadius: 2,
    },
    chapterCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 3,
      overflow: 'hidden',
    },
    chapterCardCurrent: {
      borderColor: theme.primary,
      borderWidth: 1.5,
      shadowColor: theme.primary,
      shadowOpacity: 0.15,
    },
    chapterCardFuture: {
      backgroundColor: theme.backgroundSecondary,
      borderColor: theme.border,
      shadowOpacity: 0.04,
    },
    chapterMedia: {
      position: 'relative',
    },
    chapterMediaCompact: {
      paddingTop: spacing.md,
      paddingLeft: spacing.md,
    },
    chapterImage: {
      width: '100%',
      height: 170,
      resizeMode: 'cover',
    },
    chapterImagePlaceholder: {
      width: '100%',
      height: 140,
      backgroundColor: theme.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    chapterImageText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.textMuted,
    },
    addPhotoHint: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: spacing.xs,
    },
    monthlyMilestoneBadge: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    mediaOverlayTop: {
      position: 'absolute',
      bottom: spacing.sm,
      left: spacing.sm,
      right: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: spacing.sm,
    },
    mediaPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      backgroundColor: theme.accent,
      opacity: 0.92,
    },
    mediaPillText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.white,
    },
    chapterBody: {
      padding: spacing.md,
    },
    chapterTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    chapterTitle: {
      fontSize: fontSize.lg,
      fontFamily: fonts.heading,
      color: theme.text,
      flex: 1,
    },
    chapterTitleFuture: {
      color: theme.textMuted,
    },
    currentBadge: {
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
      marginLeft: spacing.sm,
    },
    currentBadgeText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.white,
    },
    chapterDateRange: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: 4,
    },
    chapterDateRangeFuture: {
      color: theme.textMuted,
    },
    weekLabel: {
      fontFamily: fonts.heading,
      color: theme.primary,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
      gap: spacing.sm,
    },
    progressBar: {
      flex: 1,
      height: 6,
      backgroundColor: theme.borderLight,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.success,
      borderRadius: 3,
    },
    progressFillFuture: {
      backgroundColor: theme.border,
    },
    progressText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.textSecondary,
      minWidth: 30,
    },
    progressTextFuture: {
      color: theme.textMuted,
    },
    memoryCountText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textMuted,
      marginTop: 4,
    },
    chapterNotes: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: spacing.sm,
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: spacing.sm,
      gap: spacing.xs,
    },
    tag: {
      backgroundColor: theme.accentSoft,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    tagText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.accent,
    },
    tagMore: {
      backgroundColor: theme.backgroundSecondary,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    tagMoreText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.textMuted,
    },

    // Empty states
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
      minHeight: 300,
    },
    emptyTitle: {
      fontSize: fontSize.xl,
      fontFamily: fonts.display,
      color: theme.text,
      marginTop: spacing.md,
    },
    emptySubtitle: {
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    emptySection: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.md,
      backgroundColor: theme.card,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    emptySectionTitle: {
      fontSize: fontSize.lg,
      fontFamily: fonts.display,
      color: theme.text,
      marginTop: spacing.md,
    },
    emptySectionSubtitle: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    emptySectionButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm + 2,
      borderRadius: borderRadius.xl,
      marginTop: spacing.md,
    },
    emptySectionButtonText: {
      color: theme.white,
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
    },

    // FAB
    fab: {
      position: 'absolute',
      right: spacing.md,
      bottom: spacing.md,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
      zIndex: 10,
    },
    fabBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
      zIndex: 5,
    },
    fabOption: {
      position: 'absolute',
      right: spacing.md,
      zIndex: 10,
    },
    fabOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    fabOptionLabel: {
      backgroundColor: theme.card,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      marginRight: spacing.sm,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    fabOptionText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.text,
    },
    fabOptionIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },

    // Header profile switcher
    headerProfileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.backgroundSecondary,
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: spacing.xs + 2,
      borderRadius: borderRadius.full,
      gap: 4,
      maxWidth: 160,
    },
    headerProfileName: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.text,
      maxWidth: 100,
    },
  });
