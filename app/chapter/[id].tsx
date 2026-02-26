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
import * as ImagePicker from 'expo-image-picker';
import {
  ChapterRepository,
  MemoryRepository,
  MilestoneRepository,
} from '../../src/db/repositories';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { getChapterPlaceholder } from '../../src/constants/chapterTemplates';
import { persistPhoto } from '../../src/utils/photos';
import { Background } from '../../src/components/Background';
import { PageTitle, HEADER_ACTIONS_WIDTH } from '../../src/components/PageTitle';
import { SwipeableRow } from '../../src/components/SwipeableRow';
import { MilestoneTimeline } from '../../src/components/MilestoneTimeline';
import { MilestoneQuickAddModal } from '../../src/components/MilestoneQuickAddModal';
import { useI18n, useTheme, ThemeColors } from '../../src/hooks';
import type {
  ChapterWithTags,
  MemoryWithRelations,
  Tag,
  MilestoneInstanceWithTemplate,
} from '../../src/types';

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [chapter, setChapter] = useState<ChapterWithTags | null>(null);
  const [memories, setMemories] = useState<MemoryWithRelations[]>([]);
  const [milestones, setMilestones] = useState<MilestoneInstanceWithTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'memories' | 'milestones'>('memories');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [quickAddMilestone, setQuickAddMilestone] = useState<MilestoneInstanceWithTemplate | null>(null);
  const [quickAddVisible, setQuickAddVisible] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const [chapterData, memoriesData, milestoneData] = await Promise.all([
        ChapterRepository.getWithTags(id),
        MemoryRepository.getByChapterIdWithRelations(id),
        MilestoneRepository.getByChapterIdWithRelations(id),
      ]);
      setChapter(chapterData);
      setMemories(memoriesData);
      setMilestones(milestoneData);
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

  const handleSetCoverPhoto = async () => {
    closeActionMenu();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.5,
      });
      if (result.canceled || !result.assets?.[0]) return;

      const selectedUri = result.assets[0].uri;
      // Show the new cover immediately for better perceived performance.
      setChapter((prev) => (prev ? { ...prev, coverImageUri: selectedUri } : prev));

      const persistedUri = await persistPhoto(selectedUri);
      await ChapterRepository.update({ id: id!, coverImageUri: persistedUri });
      setChapter((prev) => (prev ? { ...prev, coverImageUri: persistedUri } : prev));
    } catch (error) {
      console.error('Failed to set cover photo:', error);
      loadData();
    }
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

  const handleMilestoneAdd = (milestone: MilestoneInstanceWithTemplate) => {
    setQuickAddMilestone(milestone);
    setQuickAddVisible(true);
  };

  const handleMilestoneQuickSave = async (data: {
    title: string;
    date: Date;
    description?: string;
    photoUris: string[];
    tagIds: string[];
  }) => {
    if (!quickAddMilestone || !id) return;

    try {
      const memory = await MemoryRepository.create({
        chapterId: id,
        isPregnancyJournal: false,
        memoryType: 'milestone',
        title: data.title,
        description: data.description,
        date: data.date.toISOString(),
        tagIds: data.tagIds,
        photoUris: data.photoUris,
        milestoneTemplateId: quickAddMilestone.milestoneTemplateId,
        isCustomMilestone: false,
      });

      // Link memory to milestone instance
      await MilestoneRepository.linkMemory(quickAddMilestone.id, memory.id);

      setQuickAddVisible(false);
      setQuickAddMilestone(null);
      loadData();
    } catch (error) {
      console.error('Failed to save milestone memory:', error);
      Alert.alert(t('alerts.errorTitle') || 'Error', 'Failed to save milestone memory');
    }
  };

  const handleMilestoneView = (milestone: MilestoneInstanceWithTemplate) => {
    if (milestone.associatedMemory) {
      router.push(`/memory/${milestone.associatedMemory.id}`);
    }
  };

  const handleMilestoneEdit = (milestone: MilestoneInstanceWithTemplate) => {
    if (milestone.associatedMemory) {
      router.push(`/memory/edit/${milestone.associatedMemory.id}`);
    }
  };

  const handleMilestoneDelete = (milestone: MilestoneInstanceWithTemplate) => {
    if (!milestone.associatedMemory) return;
    Alert.alert(
      'Delete Milestone Memory',
      'This will remove the memory but keep the milestone for later.',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await MilestoneRepository.unlinkMemory(milestone.id);
              await MemoryRepository.delete(milestone.associatedMemory!.id);
              loadData();
            } catch (error) {
              console.error('Failed to delete milestone memory:', error);
              Alert.alert(t('alerts.errorTitle'), t('alerts.deleteMemoryFailed'));
            }
          },
        },
      ]
    );
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

  const placeholder = chapter ? getChapterPlaceholder(chapter.title) : null;

  const renderHeader = () => {
    if (!chapter || !placeholder) return null;
    const hasEndDate = Boolean(chapter.endDate);
    return (
      <View style={styles.header}>
        {/* Cover image or placeholder */}
        <TouchableOpacity onPress={handleSetCoverPhoto} activeOpacity={0.8}>
          {chapter.coverImageUri ? (
            <View style={styles.coverImageContainer}>
              <Image source={{ uri: chapter.coverImageUri }} style={styles.coverImage} />
              <View style={styles.coverImageOverlay}>
                <Ionicons name="camera-outline" size={16} color="#fff" />
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.coverPlaceholder,
                { backgroundColor: placeholder.bgColor + '25' },
              ]}
            >
              <Ionicons name={placeholder.icon as any} size={44} color={placeholder.bgColor} />
              <View style={styles.coverPlaceholderHint}>
                <Ionicons name="camera-outline" size={14} color={placeholder.bgColor} />
                <Text style={[styles.coverPlaceholderText, { color: placeholder.bgColor }]}>
                  Add cover photo
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.headerContent}>
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
      </View>
    );
  };

  const groupedMemories = groupEntriesByDate(memories);
  const displayChapterTitle = useMemo(() => {
    const rawTitle = chapter?.title;
    if (!rawTitle) return t('navigation.chapter');
    const weekMatch = rawTitle.match(/^Week\s+(\d+)$/i);
    if (!weekMatch) return rawTitle;
    const week = Number.parseInt(weekMatch[1], 10);
    if (!Number.isFinite(week)) return rawTitle;
    return t('home.weekLabel', { week });
  }, [chapter?.title, t]);

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'memories' && styles.tabActive]}
        onPress={() => setActiveTab('memories')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="bookmark-outline"
          size={18}
          color={activeTab === 'memories' ? theme.primary : theme.textMuted}
        />
        <Text style={[styles.tabText, activeTab === 'memories' && styles.tabTextActive]}>
          Memories
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'milestones' && styles.tabActive]}
        onPress={() => setActiveTab('milestones')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="star-outline"
          size={18}
          color={activeTab === 'milestones' ? theme.primary : theme.textMuted}
        />
        <Text style={[styles.tabText, activeTab === 'milestones' && styles.tabTextActive]}>
          Milestones
        </Text>
        {milestones.filter((m) => m.status === 'pending').length > 0 && (
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>
              {milestones.filter((m) => m.status === 'pending').length}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <PageTitle title={displayChapterTitle} />
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
        {activeTab === 'memories' ? (
          <FlatList
            data={groupedMemories}
            keyExtractor={([date]) => date}
            renderItem={renderDateGroup}
            ListHeaderComponent={() => (
              <>
                {renderHeader()}
                {renderTabBar()}
              </>
            )}
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
        ) : (
          <FlatList
            data={[]}
            keyExtractor={() => 'milestones'}
            renderItem={() => null}
            ListHeaderComponent={() => (
              <>
                {renderHeader()}
                {renderTabBar()}
              </>
            )}
            ListFooterComponent={() => (
              <MilestoneTimeline
                milestones={milestones}
                isLoading={isLoading}
                onRefresh={async () => { await loadData(); }}
                onAddMemory={handleMilestoneAdd}
                onViewMemory={handleMilestoneView}
                onEditMemory={handleMilestoneEdit}
                onDeleteMemory={handleMilestoneDelete}
                locale={locale}
              />
            )}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={theme.primary}
              />
            }
          />
        )}
        {activeTab === 'memories' && memories.length > 0 && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push({ pathname: '/memory/new', params: { chapterId: id } })}
          >
            <Ionicons name="add" size={28} color={theme.white} />
          </TouchableOpacity>
        )}
      </View>
      <MilestoneQuickAddModal
        visible={quickAddVisible}
        milestone={quickAddMilestone}
        onClose={() => { setQuickAddVisible(false); setQuickAddMilestone(null); }}
        onSave={handleMilestoneQuickSave}
        locale={locale}
      />
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
      borderRadius: borderRadius.xl,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 2,
      overflow: 'hidden',
    },
    coverImageContainer: {
      position: 'relative',
    },
    coverImage: {
      width: '100%',
      height: 180,
      resizeMode: 'cover',
    },
    coverImageOverlay: {
      position: 'absolute',
      bottom: spacing.sm,
      right: spacing.sm,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(0,0,0,0.45)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    coverPlaceholder: {
      width: '100%',
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    coverPlaceholderHint: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: spacing.xs,
    },
    coverPlaceholderText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
    },
    headerContent: {
      padding: spacing.lg,
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
    tabBar: {
      flexDirection: 'row',
      backgroundColor: theme.card,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.borderLight,
      marginBottom: spacing.md,
      padding: spacing.xs,
      gap: spacing.xs,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
    },
    tabActive: {
      backgroundColor: theme.primary + '15',
    },
    tabText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      fontWeight: '600',
      color: theme.textMuted,
    },
    tabTextActive: {
      color: theme.primary,
    },
    tabBadge: {
      backgroundColor: theme.primary,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      paddingHorizontal: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabBadgeText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      fontWeight: '700',
      color: theme.white,
    },
  });
