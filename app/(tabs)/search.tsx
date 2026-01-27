import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SearchRepository, TagRepository } from '../../src/db/repositories';
import type { SearchFilters } from '../../src/db/repositories/SearchRepository';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { QUICK_TAGS } from '../../src/constants/quickTags';
import { Background } from '../../src/components/Background';
import { ProUpgradeBanner } from '../../src/components/ProUpgradeBanner';
import { useI18n, useTheme, usePaywallTrigger } from '../../src/hooks';
import type { SearchResult, Tag, MemoryType } from '../../src/types';

type ResultTypeFilter = 'all' | 'chapter' | 'memory';

export default function SearchScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t, locale } = useI18n();
  const { onSearchPerformed } = usePaywallTrigger();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  // Filter state
  const [resultTypeFilter, setResultTypeFilter] = useState<ResultTypeFilter>('all');
  const [memoryTypeFilter, setMemoryTypeFilter] = useState<MemoryType | undefined>(undefined);
  const [minImportanceFilter, setMinImportanceFilter] = useState<number>(0);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const getQuickTagLabel = useCallback((tag: { key: string; label: string }) => {
    const key = `tags.quick.${tag.key}`;
    const label = t(key);
    return label === key ? tag.label : label;
  }, [t]);

  const quickTagOptions = useMemo(() => {
    return QUICK_TAGS.map((tag) => {
      const label = getQuickTagLabel(tag);
      const existing = allTags.find(
        (item) => item.name.toLowerCase() === label.toLowerCase()
      );
      return {
        key: tag.key,
        label,
        icon: tag.icon,
        id: existing?.id,
      };
    });
  }, [allTags, getQuickTagLabel]);

  const quickTagLabels = useMemo(
    () => quickTagOptions.map((tag) => tag.label.toLowerCase()),
    [quickTagOptions]
  );

  const otherTags = useMemo(
    () => allTags.filter((tag) => !quickTagLabels.includes(tag.name.toLowerCase())),
    [allTags, quickTagLabels]
  );

  // Track if filters are active
  const hasActiveFilters = resultTypeFilter !== 'all' || memoryTypeFilter !== undefined || minImportanceFilter > 0 || selectedTagIds.length > 0;

  useEffect(() => {
    TagRepository.getAll().then(setAllTags);
  }, []);

  const buildFilters = useCallback((): SearchFilters | undefined => {
    if (!hasActiveFilters) return undefined;
    return {
      resultType: resultTypeFilter,
      memoryType: memoryTypeFilter,
      minImportance: minImportanceFilter,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
    };
  }, [resultTypeFilter, memoryTypeFilter, minImportanceFilter, selectedTagIds, hasActiveFilters]);

  const performSearch = useCallback(async (text: string, filters?: SearchFilters) => {
    if (text.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      const searchResults = await SearchRepository.search(text.trim(), filters);
      setResults(searchResults);
      setHasSearched(true);

      // Track search for paywall trigger (only on successful search with results)
      if (searchResults.length > 0) {
        await onSearchPerformed();
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, [onSearchPerformed]);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    performSearch(text, buildFilters());
  }, [performSearch, buildFilters]);

  // Re-search when filters change
  useEffect(() => {
    if (query.trim().length >= 2) {
      performSearch(query, buildFilters());
    }
  }, [resultTypeFilter, memoryTypeFilter, minImportanceFilter, selectedTagIds]);

  const clearFilters = () => {
    setResultTypeFilter('all');
    setMemoryTypeFilter(undefined);
    setMinImportanceFilter(0);
    setSelectedTagIds([]);
  };

  const toggleTag = async (tagName: string, tagId?: string) => {
    let resolvedId = tagId;
    if (!resolvedId) {
      const created = await TagRepository.getOrCreate(tagName);
      resolvedId = created.id;
      setAllTags((prev) => (prev.some((tag) => tag.id === created.id) ? prev : [...prev, created]));
    }
    setSelectedTagIds((prev) =>
      prev.includes(resolvedId) ? prev.filter((id) => id !== resolvedId) : [...prev, resolvedId]
    );
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleResultPress = (result: SearchResult) => {
    if (result.type === 'chapter') {
      router.push(`/chapter/${result.id}`);
    } else {
      router.push(`/memory/${result.id}`);
    }
  };

  const getMatchedFieldLabel = (field: string) => {
    switch (field) {
      case 'title':
        return t('search.matchFieldTitle');
      case 'location':
        return t('search.matchFieldLocation');
      case 'summary':
        return t('search.matchFieldSummary');
      case 'notes':
        return t('search.matchFieldNotes');
      case 'tag':
        return t('search.matchFieldTag');
      default:
        return field;
    }
  };

  const styles = createStyles(theme);

  const renderResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => handleResultPress(item)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.resultIcon,
          item.type === 'chapter' ? styles.resultIconChapter : styles.resultIconMemory,
        ]}
      >
        <Ionicons
          name={item.type === 'chapter' ? 'book' : 'heart'}
          size={20}
          color={item.type === 'chapter' ? theme.primary : theme.accent}
        />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {item.title}
        </Text>
        {item.chapterTitle && item.type === 'memory' && (
          <Text style={styles.resultChapter} numberOfLines={1}>
            {t('search.inChapter', { chapter: item.chapterTitle })}
          </Text>
        )}
        <View style={styles.matchInfo}>
          <Text style={styles.matchLabel}>
            {t('search.matchedIn', { field: getMatchedFieldLabel(item.matchedField) })}
          </Text>
          <Text style={styles.matchText} numberOfLines={1}>
            {item.matchedText}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
    </TouchableOpacity>
  );

  const renderEmpty = () => {
    if (!hasSearched) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={theme.textMuted} />
          <Text style={styles.emptyTitle}>{t('search.emptyTitle')}</Text>
          <Text style={styles.emptySubtitle}>
            {t('search.emptySubtitle')}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-outline" size={64} color={theme.textMuted} />
        <Text style={styles.emptyTitle}>{t('search.noResultsTitle')}</Text>
        <Text style={styles.emptySubtitle}>
          {t('search.noResultsSubtitle')}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Background />
      <ProUpgradeBanner style={styles.proBanner} />
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={t('placeholders.search')}
          placeholderTextColor={theme.textMuted}
          value={query}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleToggleFilters}
          style={[styles.filterToggle, hasActiveFilters && styles.filterToggleActive]}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={hasActiveFilters ? theme.white : theme.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Result Type Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>
              {t('search.showLabel').toLocaleUpperCase(locale)}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {(['all', 'chapter', 'memory'] as ResultTypeFilter[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterChip,
                      resultTypeFilter === type && styles.filterChipActive,
                    ]}
                    onPress={() => setResultTypeFilter(type)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        resultTypeFilter === type && styles.filterChipTextActive,
                      ]}
                    >
                      {type === 'all'
                        ? t('search.filterAll')
                        : type === 'chapter'
                          ? t('search.filterChapters')
                          : t('search.filterMemories')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Memory Type Filter (only when showing memories) */}
          {resultTypeFilter !== 'chapter' && (
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>
                {t('search.memoryTypeLabel').toLocaleUpperCase(locale)}
              </Text>
              <View style={styles.filterChips}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    memoryTypeFilter === undefined && styles.filterChipActive,
                  ]}
                  onPress={() => setMemoryTypeFilter(undefined)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      memoryTypeFilter === undefined && styles.filterChipTextActive,
                    ]}
                  >
                    {t('search.filterAny')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    memoryTypeFilter === 'milestone' && styles.filterChipActive,
                    memoryTypeFilter === 'milestone' && { backgroundColor: theme.primary },
                  ]}
                  onPress={() => setMemoryTypeFilter('milestone')}
                >
                  <Ionicons
                    name="flag"
                    size={14}
                    color={memoryTypeFilter === 'milestone' ? theme.white : theme.primary}
                  />
                  <Text
                    style={[
                      styles.filterChipText,
                      memoryTypeFilter === 'milestone' && styles.filterChipTextActive,
                    ]}
                  >
                    {t('search.filterMilestones')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    memoryTypeFilter === 'note' && styles.filterChipActive,
                    memoryTypeFilter === 'note' && { backgroundColor: theme.accent },
                  ]}
                  onPress={() => setMemoryTypeFilter('note')}
                >
                  <Ionicons
                    name="document-text"
                    size={14}
                    color={memoryTypeFilter === 'note' ? theme.white : theme.accent}
                  />
                  <Text
                    style={[
                      styles.filterChipText,
                      memoryTypeFilter === 'note' && styles.filterChipTextActive,
                    ]}
                  >
                    {t('search.filterNotes')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Minimum Importance Filter */}
          {resultTypeFilter !== 'chapter' && (
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>
                {t('search.minImportanceLabel').toLocaleUpperCase(locale)}
              </Text>
              <View style={styles.filterChips}>
                {[0, 3, 4, 5].map((importance) => (
                  <TouchableOpacity
                    key={importance}
                    style={[
                      styles.filterChip,
                      minImportanceFilter === importance && styles.filterChipActive,
                    ]}
                    onPress={() => setMinImportanceFilter(importance)}
                  >
                    {importance > 0 && <Ionicons name="heart" size={12} color={minImportanceFilter === importance ? theme.white : theme.primary} />}
                    <Text
                      style={[
                        styles.filterChipText,
                        minImportanceFilter === importance && styles.filterChipTextActive,
                      ]}
                    >
                      {importance === 0 ? t('search.filterAny') : `${importance}+`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Tags Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>
              {t('search.tagsLabel').toLocaleUpperCase(locale)}
            </Text>
            <Text style={styles.filterSubLabel}>
              {t('dialogs.tagPicker.quickTags').toLocaleUpperCase(locale)}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {quickTagOptions.map((tag) => {
                  const isSelected = tag.id ? selectedTagIds.includes(tag.id) : false;
                  return (
                    <TouchableOpacity
                      key={tag.key}
                      style={[
                        styles.filterChip,
                        isSelected && styles.filterChipActive,
                      ]}
                      onPress={() => void toggleTag(tag.label, tag.id)}
                    >
                      <Ionicons
                        name={tag.icon}
                        size={14}
                        color={isSelected ? theme.white : theme.accent}
                      />
                      <Text
                        style={[
                          styles.filterChipText,
                          isSelected && styles.filterChipTextActive,
                        ]}
                      >
                        {tag.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {otherTags.length > 0 && (
              <>
                <Text style={styles.filterSubLabel}>
                  {t('dialogs.tagPicker.yourTags').toLocaleUpperCase(locale)}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filterChips}>
                    {otherTags.map((tag) => {
                      const isSelected = selectedTagIds.includes(tag.id);
                      return (
                        <TouchableOpacity
                          key={tag.id}
                          style={[
                            styles.filterChip,
                            isSelected && styles.filterChipActive,
                          ]}
                          onPress={() => void toggleTag(tag.name, tag.id)}
                        >
                          <Ionicons
                            name="pricetag"
                            size={14}
                            color={isSelected ? theme.white : theme.textMuted}
                          />
                          <Text
                            style={[
                              styles.filterChipText,
                              isSelected && styles.filterChipTextActive,
                            ]}
                          >
                            {tag.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </>
            )}
          </View>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
              <Ionicons name="close-circle-outline" size={16} color={theme.error} />
              <Text style={styles.clearFiltersText}>{t('search.clearFilters')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        renderItem={renderResult}
        contentContainerStyle={
          results.length === 0 ? styles.emptyList : styles.list
        }
        ListEmptyComponent={renderEmpty}
        keyboardShouldPersistTaps="handled"
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
    proBanner: {
      marginHorizontal: spacing.md,
      marginTop: spacing.md,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      marginHorizontal: spacing.md,
      marginBottom: spacing.sm,
      marginTop: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 2,
    },
    searchIcon: {
      marginRight: spacing.sm,
    },
    searchInput: {
      flex: 1,
      paddingVertical: spacing.md,
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.text,
    },
    clearButton: {
      padding: spacing.xs,
    },
    filterToggle: {
      padding: spacing.sm,
      marginLeft: spacing.xs,
      borderRadius: borderRadius.md,
      backgroundColor: theme.backgroundSecondary,
    },
    filterToggleActive: {
      backgroundColor: theme.primary,
    },
    filtersContainer: {
      backgroundColor: theme.card,
      marginHorizontal: spacing.md,
      marginBottom: spacing.sm,
      padding: spacing.md,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    filterSection: {
      marginBottom: spacing.md,
    },
    filterLabel: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.textMuted,
      marginBottom: spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    filterSubLabel: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.textSecondary,
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    filterChips: {
      flexDirection: 'row',
      gap: spacing.xs,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      backgroundColor: theme.backgroundSecondary,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    filterChipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterChipText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.text,
    },
    filterChipTextActive: {
      color: theme.white,
    },
    clearFiltersButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      marginTop: spacing.xs,
    },
    clearFiltersText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.error,
    },
    list: {
      padding: spacing.md,
      paddingTop: 0,
    },
    emptyList: {
      flex: 1,
      padding: spacing.md,
      paddingTop: 0,
    },
    resultCard: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      marginBottom: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 2,
    },
    resultIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    resultIconTrip: {
      backgroundColor: theme.accentSoft,
    },
    resultIconEntry: {
      backgroundColor: theme.backgroundSecondary,
    },
    resultContent: {
      flex: 1,
    },
    resultTitle: {
      fontSize: fontSize.md,
      fontFamily: fonts.heading,
      color: theme.text,
    },
    resultTrip: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: 2,
    },
    matchInfo: {
      flexDirection: 'row',
      marginTop: spacing.xs,
      flexWrap: 'wrap',
    },
    matchLabel: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.textMuted,
      marginRight: spacing.xs,
    },
    matchText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      flex: 1,
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
  });
