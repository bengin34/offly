import { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  Modal,
  StatusBar,
  type LayoutChangeEvent,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EntryRepository, TripRepository } from '../../src/db/repositories';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { Background } from '../../src/components/Background';
import { PageTitle, HEADER_ACTIONS_WIDTH } from '../../src/components/PageTitle';
import { LocationCard } from '../../src/components/LocationCard';
import { useI18n, useTheme, ThemeColors } from '../../src/hooks';
import { useThemeStore } from '../../src/stores/themeStore';
import type { EntryWithRelations, Trip } from '../../src/types';

const { width: screenWidth } = Dimensions.get('window');

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const { photoDisplayMode, setPhotoDisplayMode } = useThemeStore();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const togglePhotoDisplayMode = () => {
    setPhotoDisplayMode(photoDisplayMode === 'cover' ? 'contain' : 'cover');
  };
  const [entry, setEntry] = useState<EntryWithRelations | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fullScreenPhotoIndex, setFullScreenPhotoIndex] = useState<number | null>(null);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const modalScrollRef = useRef<ScrollView>(null);
  const gridGap = spacing.sm;
  const gridColumns = 2;
  const [gridWidth, setGridWidth] = useState<number | null>(null);
  const gridItemSize =
    gridWidth !== null
      ? (gridWidth - (gridGap * (gridColumns - 1))) / gridColumns
      : 0;

  const formatDateLabel = useCallback(
    (value: string, options: Intl.DateTimeFormatOptions) => {
      const date = new Date(value);
      try {
        return date.toLocaleDateString(locale, options);
      } catch (error) {
        return date.toLocaleDateString(undefined, options);
      }
    },
    [locale]
  );

  const formatDateTime = useCallback(
    (value: string) => {
      const date = new Date(value);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      };
      try {
        return date.toLocaleString(locale, options);
      } catch (error) {
        return date.toLocaleString(undefined, options);
      }
    },
    [locale]
  );

  const handleGridLayout = useCallback((event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    const innerWidth = Math.max(0, width - (gridGap * 2));
    setGridWidth(innerWidth);
  }, [gridGap]);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const entryData = await EntryRepository.getWithRelations(id);
      setEntry(entryData);
      if (entryData) {
        const tripData = await TripRepository.getById(entryData.tripId);
        setTrip(tripData);
      }
    } catch (error) {
      console.error('Failed to load entry:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleDelete = () => {
    Alert.alert(
      t('alerts.deleteEntryTitle'),
      t('alerts.deleteEntryMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await EntryRepository.delete(id!);
              router.back();
            } catch (error) {
              console.error('Failed to delete entry:', error);
              Alert.alert(t('alerts.errorTitle'), t('alerts.deleteEntryFailed'));
            }
          },
        },
      ]
    );
  };

  const handleDeletePhoto = (photoId: string, photoIndex: number) => {
    Alert.alert(
      t('alerts.deletePhotoTitle'),
      t('alerts.deletePhotoMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await EntryRepository.deletePhoto(photoId);
              // Update local state
              setEntry((prev) => {
                if (!prev) return null;
                return {
                  ...prev,
                  photos: prev.photos.filter((p) => p.id !== photoId),
                };
              });
              // Close fullscreen if viewing deleted photo
              if (fullScreenPhotoIndex === photoIndex) {
                setFullScreenPhotoIndex(null);
              } else if (fullScreenPhotoIndex !== null && fullScreenPhotoIndex > photoIndex) {
                setFullScreenPhotoIndex(fullScreenPhotoIndex - 1);
              }
            } catch (error) {
              console.error('Failed to delete photo:', error);
              Alert.alert(t('alerts.errorTitle'), t('alerts.deletePhotoFailed'));
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

  const handleEditEntry = () => {
    closeActionMenu();
    router.push(`/entry/edit/${id}`);
  };

  const handleDeleteEntry = () => {
    closeActionMenu();
    handleDelete();
  };

  const headerTitle = entry?.title || t('navigation.entry');
  const ratingValue = entry?.rating ?? 0;
  const hasRating = entry ? ratingValue > 0 : false;
  const ratingLabel = entry
    ? (ratingValue % 1 === 0 ? ratingValue.toFixed(0) : ratingValue.toFixed(1))
    : '';

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => <PageTitle title={headerTitle} />,
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
      {entry && !isLoading ? (
        <View style={styles.container}>
          <Background />
          <ScrollView style={styles.scroll}>
            {/* Photos */}
            {entry.photos.length > 0 && (
              <View style={styles.carouselContainer}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  style={styles.photoCarousel}
                  showsHorizontalScrollIndicator={false}
                >
                  {entry.photos.map((photo, index) => (
                    <TouchableOpacity
                      key={photo.id}
                      activeOpacity={0.9}
                      onPress={() => setFullScreenPhotoIndex(index)}
                    >
                      <Image
                        source={{ uri: photo.uri }}
                        style={styles.carouselPhoto}
                        resizeMode={photoDisplayMode}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.displayModeToggle}
                  onPress={togglePhotoDisplayMode}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={photoDisplayMode === 'cover' ? 'expand-outline' : 'contract-outline'}
                    size={18}
                    color={theme.white}
                  />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.content}>
            {/* Type Badge and Date */}
            <View style={styles.metaRow}>
              <View style={styles.metaLeft}>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: entry.entryType === 'place' ? theme.place : theme.moment },
                  ]}
                >
                  <Ionicons
                    name={entry.entryType === 'place' ? 'location' : 'star'}
                    size={14}
                    color={theme.white}
                  />
                  <Text style={styles.typeBadgeText}>
                    {entry.entryType === 'place' ? t('entryForm.place') : t('entryForm.moment')}
                  </Text>
                </View>
                {hasRating && (
                  <View style={[styles.ratingBadge, { backgroundColor: theme.warning }]}>
                    <Ionicons name="star" size={14} color={theme.white} />
                    <Text style={styles.ratingText}>{ratingLabel}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.date}>
                {formatDateLabel(entry.date, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>

            {/* Trip link */}
            {trip && (
              <TouchableOpacity style={styles.tripLink} onPress={() => router.push(`/trip/${trip.id}`)}>
                <Ionicons name="airplane-outline" size={16} color={theme.textSecondary} />
                <Text style={styles.tripLinkText}>{trip.title}</Text>
                <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
              </TouchableOpacity>
            )}

            {/* Location */}
            {(entry.locationName || entry.latitude) && (
              <View style={styles.locationWrapper}>
                <LocationCard
                  locationName={entry.locationName}
                  latitude={entry.latitude}
                  longitude={entry.longitude}
                  mapUrl={entry.mapUrl}
                />
              </View>
            )}

          {/* Notes */}
          {entry.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('entryDetail.notesTitle').toLocaleUpperCase(locale)}
              </Text>
              <Text style={styles.notes}>{entry.notes}</Text>
            </View>
          )}

          {/* Tags */}
          {entry.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('entryDetail.tagsTitle').toLocaleUpperCase(locale)}
              </Text>
              <View style={styles.tagsContainer}>
                {entry.tags.map((tag) => (
                  <View key={tag.id} style={styles.tag}>
                    <Text style={styles.tagText}>{tag.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Photo Thumbnails */}
          {entry.photos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('entryDetail.allPhotos', { count: entry.photos.length }).toLocaleUpperCase(locale)}
              </Text>
              <View style={styles.photoGridWrapper} onLayout={handleGridLayout}>
                <View style={styles.photoGrid}>
                  {entry.photos.map((photo, index) => (
                    <View
                      key={photo.id}
                      style={[styles.gridPhotoContainer, { width: gridItemSize, height: gridItemSize }]}
                    >
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setFullScreenPhotoIndex(index)}
                      >
                        <Image
                          source={{ uri: photo.uri }}
                          style={[styles.gridPhoto, { width: gridItemSize, height: gridItemSize }]}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deletePhotoButton}
                        onPress={() => handleDeletePhoto(photo.id, index)}
                      >
                        <Ionicons name="close" size={14} color={theme.white} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Timestamps */}
          <View style={styles.timestamps}>
            <Text style={styles.timestamp}>
              {t('entryDetail.created', { date: formatDateTime(entry.createdAt) })}
            </Text>
            {entry.updatedAt !== entry.createdAt && (
              <Text style={styles.timestamp}>
                {t('entryDetail.updated', { date: formatDateTime(entry.updatedAt) })}
              </Text>
            )}
          </View>
          </View>
        </ScrollView>
      </View>
      ) : (
        <View style={styles.container}>
          <Background />
        </View>
      )}

      {entry ? (
        <Modal
          visible={fullScreenPhotoIndex !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setFullScreenPhotoIndex(null)}
        >
          <StatusBar barStyle="light-content" backgroundColor={theme.black} />
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalDeleteButton}
              onPress={() => {
                const currentIndex = fullScreenPhotoIndex ?? 0;
                const photo = entry.photos[currentIndex];
                if (photo) {
                  handleDeletePhoto(photo.id, currentIndex);
                }
              }}
            >
              <Ionicons name="trash-outline" size={22} color={theme.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setFullScreenPhotoIndex(null)}
            >
              <Ionicons name="close" size={28} color={theme.white} />
            </TouchableOpacity>
            <ScrollView
              ref={modalScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentOffset={{ x: (fullScreenPhotoIndex ?? 0) * screenWidth, y: 0 }}
            >
              {entry.photos.map((photo) => (
                <Image
                  key={photo.id}
                  source={{ uri: photo.uri }}
                  style={styles.fullScreenPhoto}
                  resizeMode="contain"
                />
              ))}
            </ScrollView>
            {entry.photos.length > 1 && (
              <View style={styles.photoCounter}>
                <Text style={styles.photoCounterText}>
                  {(fullScreenPhotoIndex ?? 0) + 1} / {entry.photos.length}
                </Text>
              </View>
            )}
          </View>
        </Modal>
      ) : null}
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
            <TouchableOpacity style={styles.actionItem} onPress={handleEditEntry}>
              <Ionicons name="pencil" size={18} color={theme.text} />
              <Text style={styles.actionText}>{t('navigation.editEntry')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={handleDeleteEntry}>
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
    scroll: {
      flex: 1,
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
    carouselContainer: {
      position: 'relative',
    },
    photoCarousel: {
      height: 250,
      backgroundColor: theme.black,
      borderBottomLeftRadius: borderRadius.xl,
      borderBottomRightRadius: borderRadius.xl,
      overflow: 'hidden',
    },
    carouselPhoto: {
      width: screenWidth,
      height: 250,
    },
    displayModeToggle: {
      position: 'absolute',
      bottom: spacing.sm,
      right: spacing.sm,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: borderRadius.full,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    metaLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flexShrink: 1,
    },
    typeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    typeBadgeText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.white,
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    ratingText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.white,
    },
    date: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
    },
    tripLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: theme.card,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 2,
    },
    tripLinkText: {
      flex: 1,
      fontSize: fontSize.md,
      fontFamily: fonts.heading,
      color: theme.text,
    },
    locationWrapper: {
      marginBottom: spacing.lg,
    },
    section: {
      marginBottom: spacing.lg,
      backgroundColor: theme.card,
      borderRadius: borderRadius.xl,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    notes: {
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.text,
      lineHeight: 24,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
    },
    tag: {
      backgroundColor: theme.accentSoft,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    tagText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.accent,
    },
    photoGridWrapper: {
      paddingHorizontal: spacing.sm,
      paddingTop: spacing.lg,
    },
    photoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    gridPhoto: {
      width: 100,
      height: 100,
      borderRadius: borderRadius.md,
    },
    gridPhotoContainer: {
      position: 'relative',
    },
    deletePhotoButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: theme.error,
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    timestamps: {
      marginTop: spacing.lg,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    timestamp: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textMuted,
      marginBottom: spacing.xs,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: theme.black,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalCloseButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      zIndex: 1,
      padding: spacing.sm,
    },
    modalDeleteButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      zIndex: 1,
      padding: spacing.sm,
      backgroundColor: theme.error,
      borderRadius: borderRadius.full,
    },
    fullScreenPhoto: {
      width: screenWidth,
      height: '100%',
    },
    photoCounter: {
      position: 'absolute',
      bottom: 50,
      alignSelf: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    photoCounterText: {
      color: theme.white,
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
    },
  });
