import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  ChapterRepository,
  BabyProfileRepository,
  VaultRepository,
  MemoryRepository,
} from '../../src/db/repositories';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { Background } from '../../src/components/Background';
import { ProUpgradeBanner } from '../../src/components/ProUpgradeBanner';
import { useI18n, useTheme } from '../../src/hooks';
import type { ChapterWithTags, BabyProfile, VaultWithEntryCount } from '../../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t, locale } = useI18n();

  const [profile, setProfile] = useState<BabyProfile | null>(null);
  const [chapters, setChapters] = useState<ChapterWithTags[]>([]);
  const [vaults, setVaults] = useState<VaultWithEntryCount[]>([]);
  const [pregnancyEntryCount, setPregnancyEntryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const babyProfile = await BabyProfileRepository.getDefault();
      setProfile(babyProfile);

      if (!babyProfile) return;

      // Load vaults for all modes
      const vaultData = await VaultRepository.getAllWithEntryCounts(babyProfile.id);
      setVaults(vaultData);

      // Check and auto-unlock vaults
      await VaultRepository.checkAndUnlock(babyProfile.id);

      if (babyProfile.mode === 'pregnant') {
        const count = await MemoryRepository.countPregnancyJournal();
        setPregnancyEntryCount(count);
      } else {
        const chapterData = await ChapterRepository.getAllWithTags();
        setChapters(chapterData);
      }
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
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

  // --- Section: Pregnancy Journal Card ---
  const renderPregnancyJournal = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pregnancy Journal</Text>
      </View>
      <TouchableOpacity
        style={styles.journalCard}
        onPress={() => router.push('/pregnancy-journal')}
        activeOpacity={0.8}
      >
        <View style={styles.journalCardIcon}>
          <Ionicons name="heart-outline" size={32} color={theme.primary} />
        </View>
        <View style={styles.journalCardContent}>
          <Text style={styles.journalCardTitle}>Your pregnancy journey</Text>
          <Text style={styles.journalCardSubtitle}>
            {pregnancyEntryCount === 0
              ? 'Start writing your first entry'
              : `${pregnancyEntryCount} ${pregnancyEntryCount === 1 ? 'entry' : 'entries'}`}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
      </TouchableOpacity>
    </View>
  );

  // --- Section: Chapters Timeline ---
  const renderChaptersSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Chapters</Text>
        {chapters.length > 0 && (
          <TouchableOpacity onPress={() => router.push('/chapter/new')}>
            <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
        )}
      </View>

      {chapters.length === 0 ? (
        <View style={styles.emptySection}>
          <Ionicons name="book-outline" size={48} color={theme.textMuted} />
          <Text style={styles.emptySectionTitle}>No chapters yet</Text>
          <Text style={styles.emptySectionSubtitle}>
            Create your first chapter to start recording memories
          </Text>
          <TouchableOpacity
            style={styles.emptySectionButton}
            onPress={() => router.push('/chapter/new')}
          >
            <Text style={styles.emptySectionButtonText}>Create first chapter</Text>
          </TouchableOpacity>
        </View>
      ) : (
        chapters.map((item) => {
          const startDate = new Date(item.startDate);
          const coverImage = item.coverImageUri;

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.timelineRow}
              onPress={() => router.push(`/chapter/${item.id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.dateColumn}>
                <View style={styles.dateLine} />
                <View style={styles.datePill}>
                  <Text style={styles.dateMonth}>
                    {formatDatePart(startDate, { month: 'short' }).toLocaleUpperCase(locale)}
                  </Text>
                  <Text style={styles.dateDay}>
                    {formatDatePart(startDate, { day: 'numeric' })}
                  </Text>
                  <Text style={styles.dateYear}>
                    {formatDatePart(startDate, { year: 'numeric' })}
                  </Text>
                </View>
              </View>

              <View style={styles.chapterCard}>
                <View style={styles.chapterMedia}>
                  {coverImage ? (
                    <Image source={{ uri: coverImage }} style={styles.chapterImage} />
                  ) : (
                    <View style={styles.chapterImagePlaceholder}>
                      <Ionicons name="image-outline" size={28} color={theme.textMuted} />
                      <Text style={styles.chapterImageText}>Add cover</Text>
                    </View>
                  )}
                  <View style={styles.mediaOverlayTop}>
                    <View style={styles.mediaPill}>
                      <Ionicons name="calendar-outline" size={12} color={theme.white} />
                      <Text style={styles.mediaPillText}>
                        {formatDateRange(item.startDate, item.endDate)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.chapterBody}>
                  <View style={styles.chapterTitleRow}>
                    <Text style={styles.chapterTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                  {item.description && (
                    <Text style={styles.chapterNotes} numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                  {item.tags.length > 0 && (
                    <View style={styles.tagContainer}>
                      {item.tags.slice(0, 4).map((tag) => (
                        <View key={tag.id} style={styles.tag}>
                          <Text style={styles.tagText}>{tag.name}</Text>
                        </View>
                      ))}
                      {item.tags.length > 4 && (
                        <View style={styles.tagMore}>
                          <Text style={styles.tagMoreText}>+{item.tags.length - 4}</Text>
                        </View>
                      )}
                    </View>
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
          <Text style={styles.sectionTitle}>Age-Locked Letters</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          Write letters to be unlocked in the future
        </Text>
        {vaults.map((vault) => {
          const isLocked = vault.status === 'locked';
          const unlockLabel = vault.unlockDate
            ? formatDatePart(new Date(vault.unlockDate), {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Date not set';

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
                    ? '1 Year'
                    : `${vault.targetAgeYears} Years`}
                </Text>
                <Text style={styles.vaultMeta}>
                  {isLocked
                    ? `Unlocks ${unlockLabel}`
                    : 'Unlocked'}
                  {vault.entryCount > 0 &&
                    ` · ${vault.entryCount} ${vault.entryCount === 1 ? 'letter' : 'letters'}`}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // --- Empty state (no profile) ---
  const renderNoProfile = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="person-outline" size={64} color={theme.textMuted} />
      <Text style={styles.emptyTitle}>Welcome to BabyLegacy</Text>
      <Text style={styles.emptySubtitle}>
        Set up your baby profile to get started
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Background />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
          />
        }
      >
        <ProUpgradeBanner style={styles.proBanner} />

        {!isLoading && !profile && renderNoProfile()}

        {profile && isPregnant && renderPregnancyJournal()}
        {profile && !isPregnant && renderChaptersSection()}
        {profile && renderVaultsSection()}
      </ScrollView>

      {/* FAB for quick add */}
      {profile && !isLoading && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            if (isPregnant) {
              router.push('/pregnancy-journal/new-entry');
            } else {
              router.push('/chapter/new');
            }
          }}
        >
          <Ionicons name="add" size={28} color={theme.white} />
        </TouchableOpacity>
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
    scrollContent: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl + 72,
      paddingHorizontal: spacing.md,
    },
    proBanner: {
      marginBottom: spacing.md,
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
    datePill: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      width: '100%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 2,
    },
    dateMonth: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    dateDay: {
      fontSize: fontSize.xl,
      fontFamily: fonts.display,
      color: theme.text,
      lineHeight: 28,
    },
    dateYear: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textMuted,
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
    chapterMedia: {
      position: 'relative',
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
    },
  });
