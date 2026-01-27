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
  SectionList,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TripRepository, EntryRepository } from '../../src/db/repositories';
import { CityRepository } from '../../src/db/repositories/CityRepository';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { Background } from '../../src/components/Background';
import { PageTitle, HEADER_ACTIONS_WIDTH } from '../../src/components/PageTitle';
import { SwipeableRow } from '../../src/components/SwipeableRow';
import { ShareFormatPicker } from '../../src/components/ShareFormatPicker';
import { useI18n, useTheme, ThemeColors } from '../../src/hooks';
import { getCityShareData, shareCity, type ShareFormat, type CityShareData } from '../../src/utils/cityShare';
import { getTripShareData, shareTrip, type TripShareData } from '../../src/utils/tripShare';
import type { TripWithTags, EntryWithRelations, City, Tag } from '../../src/types';

type CitySection = {
  city: City | null; // null for uncategorized entries
  data: EntryWithRelations[];
  entryCount: number;
};

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [trip, setTrip] = useState<TripWithTags | null>(null);
  const [entries, setEntries] = useState<EntryWithRelations[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [collapsedCityIds, setCollapsedCityIds] = useState<Record<string, boolean>>({});
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareTarget, setShareTarget] = useState<'city' | 'trip' | null>(null);
  const [shareCityData, setShareCityData] = useState<CityShareData | null>(null);
  const [shareTripData, setShareTripData] = useState<TripShareData | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const [tripData, entriesData, citiesData] = await Promise.all([
        TripRepository.getWithTags(id),
        EntryRepository.getByTripIdWithRelations(id),
        CityRepository.getByTripId(id),
      ]);
      setTrip(tripData);
      setEntries(entriesData);
      setCities(citiesData);
    } catch (error) {
      console.error('Failed to load trip:', error);
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
      t('alerts.deleteTripTitle'),
      t('alerts.deleteTripMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await TripRepository.delete(id!);
              router.back();
            } catch (error) {
              console.error('Failed to delete trip:', error);
              Alert.alert(t('alerts.errorTitle'), t('alerts.deleteTripFailed'));
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

  const handleEditTrip = () => {
    closeActionMenu();
    router.push(`/trip/edit/${id}`);
  };

  const handleDeleteTrip = () => {
    closeActionMenu();
    handleDelete();
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await EntryRepository.delete(entryId);
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
    } catch (error) {
      console.error('Failed to delete entry:', error);
      Alert.alert(t('alerts.errorTitle'), t('alerts.deleteEntryFailed'));
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

  const groupEntriesByCity = (entries: EntryWithRelations[], cities: City[]): CitySection[] => {
    const sections: CitySection[] = [];

    // Group entries by city
    for (const city of cities) {
      const cityEntries = entries
        .filter((e) => e.cityId === city.id)
        .sort((a, b) => a.date.localeCompare(b.date));
      sections.push({ city, data: cityEntries, entryCount: cityEntries.length });
    }

    // Add uncategorized entries (entries without a city)
    const uncategorizedEntries = entries
      .filter((e) => !e.cityId)
      .sort((a, b) => a.date.localeCompare(b.date));
    if (uncategorizedEntries.length > 0) {
      sections.push({
        city: null,
        data: uncategorizedEntries,
        entryCount: uncategorizedEntries.length,
      });
    }

    return sections;
  };

  const getCityKey = (city: City | null) => city?.id ?? 'uncategorized';

  const handleShareCity = async (city: City) => {
    if (!trip) return;
    try {
      const data = await getCityShareData(trip.id, city.id, trip);
      if (data.entries.length === 0) {
        Alert.alert(t('alerts.nothingToShare'), t('alerts.nothingToShareMessage'));
        return;
      }
      setShareTarget('city');
      setShareCityData(data);
      setShareTripData(null);
      setShareModalVisible(true);
    } catch (error) {
      console.error('Failed to prepare share data:', error);
      Alert.alert(t('alerts.errorTitle'), t('alerts.shareFailed'));
    }
  };

  const handleShareTrip = async () => {
    if (!trip) return;
    closeActionMenu();
    try {
      const data = await getTripShareData(trip.id);
      if (data.entries.length === 0) {
        Alert.alert(t('alerts.nothingToShare'), t('alerts.nothingToShareMessage'));
        return;
      }
      setShareTarget('trip');
      setShareTripData(data);
      setShareCityData(null);
      setShareModalVisible(true);
    } catch (error) {
      console.error('Failed to prepare trip share data:', error);
      Alert.alert(t('alerts.errorTitle'), t('alerts.shareFailed'));
    }
  };

  const handleShareFormatSelect = async (format: ShareFormat) => {
    if (!shareTarget) return;
    setIsSharing(true);
    try {
      if (shareTarget === 'city' && shareCityData) {
        await shareCity(shareCityData, format);
      } else if (shareTarget === 'trip' && shareTripData) {
        await shareTrip(shareTripData, format);
      } else {
        return;
      }
      setShareModalVisible(false);
      setShareTarget(null);
      setShareCityData(null);
      setShareTripData(null);
    } catch (error) {
      console.error('Failed to share:', error);
      Alert.alert(t('alerts.errorTitle'), t('alerts.shareFailed'));
    } finally {
      setIsSharing(false);
    }
  };

  const handleCloseShareModal = () => {
    if (!isSharing) {
      setShareModalVisible(false);
      setShareTarget(null);
      setShareCityData(null);
      setShareTripData(null);
    }
  };

  const toggleCitySection = (city: City | null) => {
    const key = getCityKey(city);
    setCollapsedCityIds((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const groupEntriesByDate = (entries: EntryWithRelations[]) => {
    const groups: { [date: string]: EntryWithRelations[] } = {};
    for (const entry of entries) {
      const dateKey = entry.date.split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  };

  const renderEntry = (entry: EntryWithRelations) => {
    const entryDate = new Date(entry.date);
    const coverPhoto = entry.photos[0]?.uri;
    const photoCount = entry.photos.length;
    const tagCount = entry.tags.length;
    const hasNotes = Boolean(entry.notes);
    const rating = entry.rating ?? 0;
    const hasRating = rating > 0;
    const ratingLabel = rating % 1 === 0 ? rating.toFixed(0) : rating.toFixed(1);

    return (
      <SwipeableRow
        key={entry.id}
        onDelete={() => handleDeleteEntry(entry.id)}
        theme={theme}
        itemName={t('navigation.entry')}
      >
        <TouchableOpacity
          style={styles.timelineRow}
          onPress={() => router.push(`/entry/${entry.id}`)}
          activeOpacity={0.8}
        >
          <View style={styles.dateColumn}>
            <View style={styles.dateLine} />
            <View style={styles.datePill}>
              <Text style={styles.dateMonth}>
                {formatDatePart(entryDate, { month: 'short' }).toLocaleUpperCase(locale)}
              </Text>
              <Text style={styles.dateDay}>
                {formatDatePart(entryDate, { day: 'numeric' })}
              </Text>
              <Text style={styles.dateYear}>
                {formatDatePart(entryDate, { year: 'numeric' })}
              </Text>
            </View>
          </View>

          <View style={styles.entryCard}>
            <View style={styles.entryMedia}>
              {coverPhoto ? (
                <Image source={{ uri: coverPhoto }} style={styles.entryImage} />
              ) : (
                <View style={styles.entryImagePlaceholder}>
                  <Ionicons name="image-outline" size={28} color={theme.textMuted} />
                  <Text style={styles.entryImageText}>{t('tripDetail.noPhoto')}</Text>
                </View>
              )}
              <View style={styles.mediaOverlay}>
                {photoCount > 0 && (
                  <View style={styles.mediaPill}>
                    <Ionicons name="images-outline" size={12} color={theme.white} />
                    <Text style={styles.mediaPillText}>{photoCount}</Text>
                  </View>
                )}
                {hasNotes && (
                  <View style={styles.mediaPill}>
                    <Ionicons name="chatbubble-ellipses-outline" size={12} color={theme.white} />
                    <Text style={styles.mediaPillText}>{t('tripDetail.notePill')}</Text>
                  </View>
                )}
                {tagCount > 0 && (
                  <View style={styles.mediaPill}>
                    <Ionicons name="pricetag-outline" size={12} color={theme.white} />
                    <Text style={styles.mediaPillText}>{tagCount}</Text>
                  </View>
                )}
                {hasRating && (
                  <View style={styles.ratingPill}>
                    <Ionicons name="star" size={12} color={theme.white} />
                    <Text style={styles.mediaPillText}>{ratingLabel}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.entryBody}>
              <View
                style={[
                  styles.entryTypePill,
                  { backgroundColor: entry.entryType === 'place' ? theme.place : theme.moment },
                ]}
              >
                <Ionicons
                  name={entry.entryType === 'place' ? 'location' : 'star'}
                  size={12}
                  color={theme.white}
                />
                <Text style={styles.entryTypeText}>
                  {entry.entryType === 'place' ? t('entryForm.place') : t('entryForm.moment')}
                </Text>
              </View>
              <Text style={styles.entryTitle} numberOfLines={1}>
                {entry.title}
              </Text>
              {entry.notes && (
                <Text style={styles.entryNotes} numberOfLines={2}>
                  {entry.notes}
                </Text>
              )}
              {entry.tags.length > 0 && (
                <View style={styles.tagContainer}>
                  {entry.tags.slice(0, 3).map((tag) => (
                    <View key={tag.id} style={styles.tag}>
                      <Text style={styles.tagText}>{tag.name}</Text>
                    </View>
                  ))}
                  {entry.tags.length > 3 && (
                    <Text style={styles.moreTagsText}>+{entry.tags.length - 3}</Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </SwipeableRow>
    );
  };

  const renderDateGroup = ({ item }: { item: [string, EntryWithRelations[]] }) => {
    const [, dateEntries] = item;
    return (
      <View style={styles.dateGroup}>
        {dateEntries.map((entry) => renderEntry(entry))}
      </View>
    );
  };

  const renderCitySectionHeader = ({ section }: { section: CitySection }) => {
    const { city, entryCount } = section;
    const cityKey = getCityKey(city);
    const isCollapsed = collapsedCityIds[cityKey] ?? false;
    const chevronName = isCollapsed ? 'chevron-down' : 'chevron-up';

    if (!city) {
      // Uncategorized section
      if (entryCount === 0) return null;
      return (
        <View style={styles.citySectionHeader}>
          <Pressable style={styles.citySectionInfo} onPress={() => toggleCitySection(city)}>
            <View style={styles.citySectionTitleRow}>
              <View style={styles.citySectionTitleLeft}>
                <View style={styles.citySectionIconMuted}>
                  <Ionicons name="help-circle-outline" size={18} color={theme.textMuted} />
                </View>
                <Text style={styles.citySectionTitleMuted}>{t('tripDetail.uncategorized')}</Text>
              </View>
            </View>
            <View style={styles.citySectionMeta}>
              <View style={styles.citySectionCountPill}>
                <Text style={styles.citySectionCountText}>
                  {entryCount} {entryCount === 1 ? t('common.entry') : t('common.entries')}
                </Text>
              </View>
            </View>
          </Pressable>
          <View style={styles.citySectionActions}>
            <Pressable style={styles.citySectionChevron} onPress={() => toggleCitySection(city)}>
              <Ionicons name={chevronName} size={18} color={theme.textMuted} />
            </Pressable>
          </View>
        </View>
      );
    }

    const formatCityDateRange = () => {
      if (!city.arrivalDate && !city.departureDate) return null;
      const arrival = city.arrivalDate
        ? formatDatePart(new Date(city.arrivalDate), { month: 'short', day: 'numeric' })
        : '?';
      const departure = city.departureDate
        ? formatDatePart(new Date(city.departureDate), { month: 'short', day: 'numeric' })
        : '?';
      if (city.arrivalDate && city.departureDate) return `${arrival} - ${departure}`;
      if (city.arrivalDate) return t('dialogs.cityPicker.fromDate', { date: arrival });
      return t('dialogs.cityPicker.untilDate', { date: departure });
    };

    const dateRange = formatCityDateRange();

    return (
      <View style={styles.citySectionHeader}>
        <Pressable style={styles.citySectionInfo} onPress={() => toggleCitySection(city)}>
          <View style={styles.citySectionTitleRow}>
            <View style={styles.citySectionTitleLeft}>
              <View style={styles.citySectionIcon}>
                <Ionicons name="location" size={18} color={theme.primary} />
              </View>
              <Text style={styles.citySectionTitle}>{city.name}</Text>
            </View>
          </View>
          <View style={styles.citySectionMeta}>
            {dateRange && (
              <View style={styles.citySectionMetaItem}>
                <Ionicons name="calendar-outline" size={12} color={theme.textMuted} />
                <Text style={styles.citySectionMetaText}>{dateRange}</Text>
              </View>
            )}
            <View style={styles.citySectionCountPill}>
              <Text style={styles.citySectionCountText}>
                {entryCount} {entryCount === 1 ? t('common.entry') : t('common.entries')}
              </Text>
            </View>
          </View>
        </Pressable>
        <View style={styles.citySectionActions}>
          <Pressable style={styles.citySectionChevron} onPress={() => toggleCitySection(city)}>
            <Ionicons name={chevronName} size={18} color={theme.textMuted} />
          </Pressable>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => handleShareCity(city)}
          >
            <Ionicons name="share-outline" size={18} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addEntryToCityButton}
            onPress={() => router.push({ pathname: '/entry/new', params: { tripId: id, cityId: city.id } })}
          >
            <Ionicons name="add" size={18} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmark-outline" size={64} color={theme.textMuted} />
      <Text style={styles.emptyTitle}>{t('tripDetail.emptyTitle')}</Text>
      <Text style={styles.emptySubtitle}>
        {t('tripDetail.emptySubtitle')}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => router.push({ pathname: '/entry/new', params: { tripId: id } })}
      >
        <Text style={styles.emptyButtonText}>{t('tripDetail.addFirstEntry')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => {
    if (!trip) return null;
    return (
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerMeta}>
            <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
            <Text style={styles.headerLocation}>{trip.location}</Text>
          </View>
          <View style={styles.headerDatesPill}>
            <Ionicons name="calendar-outline" size={12} color={theme.textMuted} />
            <Text style={styles.headerDates}>
              {formatDatePart(new Date(trip.startDate), { month: 'short', day: 'numeric' })} -{' '}
              {formatDatePart(new Date(trip.endDate), {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
        {trip.summary && <Text style={styles.headerSummary}>{trip.summary}</Text>}
        {trip.tags && trip.tags.length > 0 && (
          <View style={styles.headerTags}>
            {trip.tags.map((tag: Tag) => (
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

  const groupedEntries = groupEntriesByDate(entries);
  const citySections = groupEntriesByCity(entries, cities);
  const citySectionsWithState = citySections.map((section) => {
    const isCollapsed = collapsedCityIds[getCityKey(section.city)] ?? false;
    return {
      ...section,
      data: isCollapsed ? [] : section.data,
    };
  });
  const hasCities = cities.length > 0;

  const renderSectionItem = ({ item }: { item: EntryWithRelations }) => renderEntry(item);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <PageTitle title={trip?.title || t('navigation.trip')} />
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
        {hasCities ? (
          <SectionList
            sections={citySectionsWithState}
            keyExtractor={(item) => item.id}
            renderItem={renderSectionItem}
            renderSectionHeader={renderCitySectionHeader}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={!isLoading ? renderEmpty : null}
            contentContainerStyle={entries.length === 0 ? styles.emptyList : styles.list}
            stickySectionHeadersEnabled={false}
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
            data={groupedEntries}
            keyExtractor={([date]) => date}
            renderItem={renderDateGroup}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={!isLoading ? renderEmpty : null}
            contentContainerStyle={entries.length === 0 ? styles.emptyList : styles.list}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={theme.primary}
              />
            }
          />
        )}
        {entries.length > 0 && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push({ pathname: '/entry/new', params: { tripId: id } })}
          >
            <Ionicons name="add" size={28} color={theme.white} />
          </TouchableOpacity>
        )}
      </View>
      <ShareFormatPicker
        visible={shareModalVisible}
        cityName={
          shareTarget === 'trip'
            ? shareTripData?.trip.title || ''
            : shareCityData?.city.name || ''
        }
        onSelect={handleShareFormatSelect}
        onClose={handleCloseShareModal}
        isLoading={isSharing}
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
            <TouchableOpacity style={styles.actionItem} onPress={handleEditTrip}>
              <Ionicons name="pencil" size={18} color={theme.text} />
              <Text style={styles.actionText}>{t('navigation.editTrip')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={handleShareTrip}>
              <Ionicons name="share-outline" size={18} color={theme.text} />
              <Text style={styles.actionText}>{t('common.shareTrip')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={handleDeleteTrip}>
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
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    headerMeta: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
      flexShrink: 1,
    },
    headerLocation: {
      fontSize: fontSize.md,
      fontFamily: fonts.heading,
      color: theme.textSecondary,
      marginLeft: spacing.xs,
      flexShrink: 1,
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
    headerSummary: {
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
    entryCard: {
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
    entryMedia: {
      position: 'relative',
    },
    entryImage: {
      width: '100%',
      height: 190,
      resizeMode: 'cover',
    },
    entryImagePlaceholder: {
      width: '100%',
      height: 160,
      backgroundColor: theme.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    entryImageText: {
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
    ratingPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      backgroundColor: theme.accent,
      opacity: 0.95,
    },
    entryBody: {
      padding: spacing.md,
    },
    entryTypePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
      marginBottom: spacing.sm,
    },
    entryTypeText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.white,
    },
    entryTitle: {
      fontSize: fontSize.lg,
      fontFamily: fonts.heading,
      color: theme.text,
    },
    entryNotes: {
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
    photoCount: {
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
    citySectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.card,
      padding: spacing.md,
      borderRadius: borderRadius.xl,
      marginBottom: spacing.md,
      marginTop: spacing.sm,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 2,
      gap: spacing.md,
    },
    citySectionInfo: {
      flex: 1,
    },
    citySectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    citySectionTitleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flex: 1,
    },
    citySectionIcon: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    citySectionIconMuted: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    citySectionTitle: {
      fontSize: fontSize.md,
      fontFamily: fonts.heading,
      color: theme.text,
      flexShrink: 1,
    },
    citySectionTitleMuted: {
      fontSize: fontSize.md,
      fontFamily: fonts.heading,
      color: theme.textMuted,
      flexShrink: 1,
    },
    citySectionMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    citySectionActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    citySectionChevron: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.backgroundSecondary,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    citySectionMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    citySectionMetaText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textMuted,
    },
    citySectionCountPill: {
      backgroundColor: theme.backgroundSecondary,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    citySectionCountText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.textSecondary,
    },
    addEntryToCityButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    shareButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.borderLight,
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
