import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChapterRepository } from '../../src/db/repositories';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { Background } from '../../src/components/Background';
import { ProUpgradeBanner } from '../../src/components/ProUpgradeBanner';
import { useI18n, useTheme } from '../../src/hooks';
import type { ChapterWithTags } from '../../src/types';

export default function ChaptersScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t, locale } = useI18n();
  const [chapters, setChapters] = useState<ChapterWithTags[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadChapters = useCallback(async () => {
    try {
      const data = await ChapterRepository.getAllWithTags();
      setChapters(data);
    } catch (error) {
      console.error('Failed to load chapters:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadChapters();
    }, [loadChapters])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadChapters();
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

  const renderChapter = ({ item }: { item: ChapterWithTags }) => {
    const startDate = new Date(item.startDate);
    const coverImage = item.coverImageUri;
    const hasDateRange = Boolean(item.endDate);

    return (
      <TouchableOpacity
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
                <Text style={styles.chapterImageText}>{t('chapters.addCover')}</Text>
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
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={64} color={theme.textMuted} />
      <Text style={styles.emptyTitle}>{t('chapters.emptyTitle')}</Text>
      <Text style={styles.emptySubtitle}>
        {t('chapters.emptySubtitle')}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => router.push('/chapter/new')}
      >
        <Text style={styles.emptyButtonText}>{t('chapters.emptyButton')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Background />
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        renderItem={renderChapter}
        ListHeaderComponent={() => <ProUpgradeBanner style={styles.proBanner} />}
        contentContainerStyle={chapters.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
          />
        }
      />
      {chapters.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/chapter/new')}
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
    list: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl + 72,
      paddingHorizontal: spacing.md,
    },
    proBanner: {
      marginBottom: spacing.md,
    },
    emptyList: {
      flex: 1,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl + 72,
      paddingHorizontal: spacing.md,
    },
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
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
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
    emptyButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.xl,
      marginTop: spacing.lg,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 3,
    },
    emptyButtonText: {
      color: theme.white,
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
    },
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
