import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Alert,
  RefreshControl,
  Image,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChapterRepository, MemoryRepository } from '../../src/db/repositories';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { Background } from '../../src/components/Background';
import { PageTitle, HEADER_ACTIONS_WIDTH } from '../../src/components/PageTitle';
import { SwipeableRow } from '../../src/components/SwipeableRow';
import { useI18n, useTheme, ThemeColors } from '../../src/hooks';
import type { ChapterWithTags, MemoryWithRelations, Tag } from '../../src/types';

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [chapter, setChapter] = useState<ChapterWithTags | null>(null);
  const [memories, setMemories] = useState<MemoryWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const [chapterData, memoriesData] = await Promise.all([
        ChapterRepository.getWithTags(id),
        MemoryRepository.getByChapterIdWithRelations(id),
      ]);
      setChapter(chapterData);
      setMemories(memoriesData);
    } catch (error) {
      console.error('Failed to load chapter:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const handleDelete = () => {
    Alert.alert(
      t('alerts.deleteChapterTitle'),
      t('alerts.deleteChapterMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await ChapterRepository.delete(id!);
              router.back();
            } catch (error) {
              console.error('Failed to delete chapter:', error);
              Alert.alert(t('alerts.errorTitle'), t('alerts.deleteChapterFailed'));
            }
          },
        },
      ]
    );
  };

  const openActionMenu = () => {
    setActionMenuVisible(true);
  };

  const closeActionMenu = () => {
    setActionMenuVisible(false);
  };

  const handleEditChapter = () => {
    closeActionMenu();
    router.push(`/chapter/edit/${id}`);
  };

  const handleDeleteChapter = () => {
    closeActionMenu();
    handleDelete();
  };

  const handleDeleteMemory = async (memoryId: string) => {
    try {
      await MemoryRepository.delete(memoryId);
      setMemories((prev) => prev.filter((m) => m.id !== memoryId));
    } catch (error) {
      console.error('Failed to delete memory:', error);
      Alert.alert(t('alerts.errorTitle'), t('alerts.deleteMemoryFailed'));
    }
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

  const groupEntriesByDate = (entries: MemoryWithRelations[]) => {
    const groups: { [date: string]: MemoryWithRelations[] } = {};
    for (const entry of entries) {
      const dateKey = entry.date.split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  };

  const renderMemory = (memory: MemoryWithRelations) => {
    const memoryDate = new Date(memory.date);
    const coverPhoto = memory.photos[0]?.uri;
    const photoCount = memory.photos.length;
    const tagCount = memory.tags.length;
    const hasDescription = Boolean(memory.description);
    const importance = memory.importance ?? 0;
    const hasImportance = importance > 0;
    const isMilestone = memory.memoryType === 'milestone';

    return (
      <SwipeableRow
        key={memory.id}
        onDelete={() => handleDeleteMemory(memory.id)}
        theme={theme}
        itemName={t('memories.memory')}
      >
        <TouchableOpacity
          style={styles.timelineRow}
          onPress={() => router.push(`/memory/${memory.id}`)}
          activeOpacity={0.8}
        >
          <View style={styles.dateColumn}>
            <View style={styles.dateLine} />
            <View style={styles.datePill}>
              <Text style={styles.dateMonth}>
                {formatDatePart(memoryDate, { month: 'short' }).toLocaleUpperCase(locale)}
              </Text>
              <Text style={styles.dateDay}>
                {formatDatePart(memoryDate, { day: 'numeric' })}
              </Text>
              <Text style={styles.dateYear}>
                {formatDatePart(memoryDate, { year: 'numeric' })}
              </Text>
            </View>
          </View>

          <View style={styles.memoryCard}>
            <View style={styles.memoryMedia}>
              {coverPhoto ? (
                <Image source={{ uri: coverPhoto }} style={styles.memoryImage} />
              ) : (
                <View style={styles.memoryImagePlaceholder}>
                  <Ionicons name="image-outline" size={28} color={theme.textMuted} />
                  <Text style={styles.memoryImageText}>{t('memories.noPhoto')}</Text>
                </View>
              )}
              <View style={styles.mediaOverlay}>
                {photoCount > 0 && (
                  <View style={styles.mediaPill}>
                    <Ionicons name="images-outline" size={12} color={theme.white} />
                    <Text style={styles.mediaPillText}>{photoCount}</Text>
                  </View>
                )}
                {hasDescription && (
                  <View style={styles.mediaPill}>
                    <Ionicons name="chatbubble-ellipses-outline" size={12} color={theme.white} />
                    <Text style={styles.mediaPillText}>{t('memories.notePill')}</Text>
                  </View>
                )}
                {tagCount > 0 && (
                  <View style={styles.mediaPill}>
                    <Ionicons name="pricetag-outline" size={12} color={theme.white} />
                    <Text style={styles.mediaPillText}>{tagCount}</Text>
                  </View>
                )}
                {hasImportance && (
                  <View style={styles.importancePill}>
                    <Ionicons name="star" size={12} color={theme.white} />
                    <Text style={styles.mediaPillText}>{importance}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.memoryBody}>
              <View
                style={[
                  styles.memoryTypePill,
                  { backgroundColor: isMilestone ? theme.primary : theme.accent },
                ]}
              >
                <Ionicons
                  name={isMilestone ? 'flag' : 'document-text'}
                  size={12}
                  color={theme.white}
                />
                <Text style={styles.memoryTypeText}>
                  {isMilestone ? t('memories.milestone') : t('memories.note')}
                </Text>
              </View>
              <Text style={styles.memoryTitle} numberOfLines={1}>
                {memory.title}
              </Text>
              {memory.description && (
                <Text style={styles.memoryDescription} numberOfLines={2}>
                  {memory.description}
                </Text>
              )}
              {memory.tags.length > 0 && (
                <View style={styles.tagContainer}>
                  {memory.tags.slice(0, 3).map((tag) => (
                    <View key={tag.id} style={styles.tag}>
                      <Text style={styles.tagText}>{tag.name}</Text>
                    </View>
                  ))}
                  {memory.tags.length > 3 && (
                    <Text style={styles.moreTagsText}>+{memory.tags.length - 3}</Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </SwipeableRow>
    );
  };

  const renderDateGroup = ({ item }: { item: [string, MemoryWithRelations[]] }) => {
    const [, dateMemories] = item;
    return (
      <View style={styles.dateGroup}>
        {dateMemories.map((memory) => renderMemory(memory))}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmark-outline" size={64} color={theme.textMuted} />
      <Text style={styles.emptyTitle}>{t('chapterDetail.emptyTitle')}</Text>
      <Text style={styles.emptySubtitle}>
        {t('chapterDetail.emptySubtitle')}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => router.push({ pathname: '/memory/new', params: { chapterId: id } })}
      >
        <Text style={styles.emptyButtonText}>{t('chapterDetail.addFirstMemory')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => {
    if (!chapter) return null;
    const hasEndDate = Boolean(chapter.endDate);
    return (
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerDatesPill}>
            <Ionicons name="calendar-outline" size={12} color={theme.textMuted} />
            <Text style={styles.headerDates}>
              {formatDatePart(new Date(chapter.startDate), { month: 'short', day: 'numeric' })}
              {hasEndDate && (
                <Text>
                  {' - '}
                  {formatDatePart(new Date(chapter.endDate!), {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              )}
            </Text>
          </View>
        </View>
        {chapter.description && <Text style={styles.headerDescription}>{chapter.description}</Text>}
        {chapter.tags && chapter.tags.length > 0 && (
          <View style={styles.headerTags}>
            {chapter.tags.map((tag: Tag) => (
              <View key={tag.id} style={styles.headerTag}>
                <Ionicons name="pricetag" size={10} color={theme.accent} />
                <Text style={styles.headerTagText}>{tag.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const groupedMemories = groupEntriesByDate(memories);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <PageTitle title={chapter?.title || t('navigation.chapter')} />
          ),
          headerTitleAlign: 'center',
          headerBackButtonDisplayMode: 'minimal',
          headerBackTitle: '',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={openActionMenu}
                style={styles.headerButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color={theme.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.container}>
        <Background />
        <FlatList
          data={groupedMemories}
          keyExtractor={([date]) => date}
          renderItem={renderDateGroup}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={!isLoading ? renderEmpty : null}
          contentContainerStyle={memories.length === 0 ? styles.emptyList : styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme.primary}
            />
          }
        />
        {memories.length > 0 && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push({ pathname: '/memory/new', params: { chapterId: id } })}
          >
            <Ionicons name="add" size={28} color={theme.white} />
          </TouchableOpacity>
        )}
      </View>
      <Modal
        visible={actionMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeActionMenu}
      >
        <Pressable style={styles.actionOverlay} onPress={closeActionMenu}>
          <Pressable
            style={[
              styles.actionSheet,
              {
                backgroundColor: theme.card,
                borderColor: theme.borderLight,
                top: insets.top + spacing.sm,
                right: spacing.md,
              },
            ]}
            onPress={() => {}}
          >
            <TouchableOpacity style={styles.actionItem} onPress={handleEditChapter}>
              <Ionicons name="pencil" size={18} color={theme.text} />
              <Text style={styles.actionText}>{t('navigation.editChapter')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={handleDeleteChapter}>
              <Ionicons name="trash-outline" size={18} color={theme.error} />
              <Text style={[styles.actionText, styles.actionTextDestructive]}>
                {t('common.delete')}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    list: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl + 72,
    },
    emptyList: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.xl + 72,
    },
    header: {
      backgroundColor: theme.card,
      padding: spacing.lg,
      borderRadius: borderRadius.xl,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 2,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      gap: spacing.sm,
    },
    headerDatesPill: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 0,
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      backgroundColor: theme.backgroundSecondary,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    headerDates: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.textMuted,
    },
    headerDescription: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.text,
      marginTop: spacing.sm,
    },
    headerTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: spacing.sm,
      gap: spacing.xs,
    },
    headerTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: theme.accentSoft,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    headerTagText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.accent,
    },
    headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: HEADER_ACTIONS_WIDTH,
      flexGrow: 0,
      flexShrink: 0,
      height: 36,
    },
    headerButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 2,
    },
    dateGroup: {
      marginBottom: spacing.sm,
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
    memoryCard: {
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
    memoryMedia: {
      position: 'relative',
    },
    memoryImage: {
      width: '100%',
      height: 190,
      resizeMode: 'cover',
    },
    memoryImagePlaceholder: {
      width: '100%',
      height: 160,
      backgroundColor: theme.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    memoryImageText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.textMuted,
    },
    mediaOverlay: {
      position: 'absolute',
      right: spacing.md,
      bottom: spacing.md,
      flexDirection: 'row',
      gap: spacing.xs,
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
    importancePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      backgroundColor: theme.accent,
      opacity: 0.95,
    },
    memoryBody: {
      padding: spacing.md,
    },
    memoryTypePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
      marginBottom: spacing.sm,
    },
    memoryTypeText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.white,
    },
    memoryTitle: {
      fontSize: fontSize.lg,
      fontFamily: fonts.heading,
      color: theme.text,
    },
    memoryDescription: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: spacing.xs,
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
    moreTagsText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.textMuted,
      alignSelf: 'center',
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
    actionOverlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      justifyContent: 'flex-start',
    },
    actionSheet: {
      position: 'absolute',
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      paddingVertical: spacing.sm,
      minWidth: 180,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    actionText: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.text,
    },
    actionTextDestructive: {
      color: theme.error,
    },
  });
