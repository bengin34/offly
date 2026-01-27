import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Platform,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { EntryRepository, TripRepository } from '../../src/db/repositories';
import { CityRepository } from '../../src/db/repositories/CityRepository';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { Background } from '../../src/components/Background';
import { ModalWrapper } from '../../src/components/ModalWrapper';
import { RatingInput } from '../../src/components/RatingInput';
import { CityPicker } from '../../src/components/CityPicker';
import { TagPickerDialog } from '../../src/components/TagPickerDialog';
import { LocationInput } from '../../src/components/LocationInput';
import { useI18n, useTheme, usePaywallTrigger } from '../../src/hooks';
import type { EntryType, Tag, City, ParsedLocation } from '../../src/types';

export default function NewEntryScreen() {
  const { tripId, cityId: initialCityId } = useLocalSearchParams<{ tripId: string; cityId?: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { t, locale } = useI18n();
  const { onEntryCreated } = usePaywallTrigger();

  const [entryType, setEntryType] = useState<EntryType>('place');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [date, setDate] = useState(new Date());
  const [isDateTouched, setIsDateTouched] = useState(false);
  const [tripStartDate, setTripStartDate] = useState<Date | null>(null);
  const [tripEndDate, setTripEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string | undefined>(initialCityId);
  const [locationName, setLocationName] = useState<string | undefined>();
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [mapUrl, setMapUrl] = useState<string | undefined>();

  const handleLocationChange = (location: ParsedLocation | null) => {
    setLocationName(location?.name);
    setLatitude(location?.latitude);
    setLongitude(location?.longitude);
    setMapUrl(location?.originalUrl);
  };

  const selectedCity = useMemo(
    () => cities.find((city) => city.id === selectedCityId),
    [cities, selectedCityId]
  );

  const getCityDefaultDate = (city?: City) => {
    if (!city) return null;
    const dateStr = city.arrivalDate ?? city.departureDate;
    return dateStr ? new Date(dateStr) : null;
  };

  const getDateKey = (value: Date) => value.toISOString().split('T')[0];

  const isDateWithinTrip = (value: Date) => {
    if (!tripStartDate || !tripEndDate) return true;
    const dateKey = getDateKey(value);
    const startKey = getDateKey(tripStartDate);
    const endKey = getDateKey(tripEndDate);
    return dateKey >= startKey && dateKey <= endKey;
  };

  useEffect(() => {
    async function loadData() {
      if (tripId) {
        // Load cities for this trip
        const tripCities = await CityRepository.getByTripId(tripId);
        setCities(tripCities);

        // If no initial city and there are cities, select the first one
        const defaultCityId = initialCityId ?? (tripCities.length > 0 ? tripCities[0].id : undefined);
        setSelectedCityId(defaultCityId);

        // Set default date within trip range
        const trip = await TripRepository.getById(tripId);
        if (trip) {
          const startDate = new Date(trip.startDate);
          const endDate = new Date(trip.endDate);
          setTripStartDate(startDate);
          setTripEndDate(endDate);
          const cityDefaultDate = getCityDefaultDate(
            tripCities.find((city) => city.id === defaultCityId)
          );
          if (cityDefaultDate) {
            setDate(cityDefaultDate);
          } else {
            const today = new Date();
            if (today >= startDate && today <= endDate) {
              setDate(today);
            } else {
              setDate(startDate);
            }
          }
        }
      }
    }
    loadData();
  }, [tripId, initialCityId]);

  useEffect(() => {
    if (isDateTouched) return;
    const cityDate = getCityDefaultDate(selectedCity);
    if (!cityDate) return;
    const currentDateKey = date.toISOString().split('T')[0];
    const cityDateKey = cityDate.toISOString().split('T')[0];
    if (currentDateKey !== cityDateKey) {
      setDate(cityDate);
    }
  }, [selectedCity, isDateTouched, date]);

  const formatDate = (d: Date) => {
    try {
      return d.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const handleDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (!selectedDate) return;
    if (!isDateWithinTrip(selectedDate)) {
      if (tripStartDate && tripEndDate) {
        Alert.alert(
          t('alerts.entryDateOutOfRangeTitle'),
          t('alerts.entryDateOutOfRangeMessage', {
            start: formatDate(tripStartDate),
            end: formatDate(tripEndDate),
          })
        );
      }
      return;
    }
    setDate(selectedDate);
    setIsDateTouched(true);
  };

  const openDatePicker = () => {
    Keyboard.dismiss();
    setShowDatePicker(true);
  };

  const confirmIOSDate = () => {
    setShowDatePicker(false);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10 - photos.length,
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map((asset) => asset.uri);
      setPhotos([...photos, ...newPhotos].slice(0, 10));
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('alerts.permissionTitle'), t('alerts.permissionCameraMessage'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri].slice(0, 10));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('alerts.requiredTitle'), t('alerts.requiredEntryTitle'));
      return;
    }
    if (!isDateWithinTrip(date) && tripStartDate && tripEndDate) {
      Alert.alert(
        t('alerts.entryDateOutOfRangeTitle'),
        t('alerts.entryDateOutOfRangeMessage', {
          start: formatDate(tripStartDate),
          end: formatDate(tripEndDate),
        })
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await EntryRepository.create({
        tripId: tripId!,
        cityId: selectedCityId,
        entryType,
        title: title.trim(),
        notes: notes.trim() || undefined,
        rating: entryType === 'place' && rating > 0 ? rating : undefined,
        date: date.toISOString(),
        tagIds: selectedTags.map((t) => t.id),
        photoUris: photos,
        locationName,
        latitude,
        longitude,
        mapUrl,
      });

      // Track entry creation (with photos) and check for paywall trigger
      await onEntryCreated(photos.length);

      router.back();
    } catch (error) {
      console.error('Failed to create entry:', error);
      Alert.alert(t('alerts.errorTitle'), t('alerts.createEntryFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Background />
      <ModalWrapper
        title={t('navigation.newEntry')}
        onClose={() => router.back()}
        actionLabel={isSubmitting ? t('common.saving') : t('common.save')}
        onAction={handleSave}
        actionDisabled={isSubmitting}
        palette={{
          text: theme.text,
          textSecondary: theme.textSecondary,
          textMuted: theme.textMuted,
          primary: theme.primary,
          border: theme.border,
        }}
        showDivider
        backgroundColor={theme.background}
      >
        <View style={styles.form}>
            {/* Entry Type Toggle */}
            <View style={styles.typeToggle}>
              <TouchableOpacity
                style={[styles.typeButton, entryType === 'place' && styles.typeButtonActive]}
                onPress={() => setEntryType('place')}
              >
                <Ionicons
                  name="location"
                  size={20}
                  color={entryType === 'place' ? theme.white : theme.place}
                />
                <Text style={[styles.typeButtonText, entryType === 'place' && styles.typeButtonTextActive]}>
                  {t('entryForm.place')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, entryType === 'moment' && styles.typeButtonActiveMoment]}
                onPress={() => setEntryType('moment')}
              >
                <Ionicons
                  name="star"
                  size={20}
                  color={entryType === 'moment' ? theme.white : theme.moment}
                />
                <Text style={[styles.typeButtonText, entryType === 'moment' && styles.typeButtonTextActive]}>
                  {t('entryForm.moment')}
                </Text>
              </TouchableOpacity>
            </View>

            {tripId ? (
              <CityPicker
                cities={cities}
                selectedCityId={selectedCityId}
                onSelect={setSelectedCityId}
                tripId={tripId}
                onCitiesChange={setCities}
              />
            ) : null}

            <View style={styles.field}>
              <Text style={styles.label}>{t('entryForm.titleLabel').toLocaleUpperCase(locale)}</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder={
                  entryType === 'place'
                    ? t('placeholders.entryTitlePlace')
                    : t('placeholders.entryTitleMoment')
                }
                placeholderTextColor={theme.textMuted}
                autoFocus
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('entryForm.locationLabel').toLocaleUpperCase(locale)}</Text>
              <LocationInput
                locationName={locationName}
                latitude={latitude}
                longitude={longitude}
                mapUrl={mapUrl}
                onLocationChange={handleLocationChange}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('labels.date').toLocaleUpperCase(locale)}</Text>
              <TouchableOpacity style={styles.dateButton} onPress={openDatePicker} activeOpacity={0.8}>
                <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
                <Text style={styles.dateText}>{formatDate(date)}</Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <View style={[styles.datePickerContainer, { backgroundColor: theme.card, borderColor: theme.borderLight }]}>
                <Text style={[styles.datePickerLabel, { color: theme.textSecondary }]}>
                  {t('labels.date')}
                </Text>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  locale={locale}
                  themeVariant={theme.isDark ? 'dark' : 'light'}
                  minimumDate={tripStartDate ?? undefined}
                  maximumDate={tripEndDate ?? undefined}
                  style={styles.datePicker}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={[styles.datePickerDone, { borderTopColor: theme.borderLight }]}
                    onPress={confirmIOSDate}
                  >
                    <Text style={[styles.datePickerDoneText, { color: theme.primary }]}>
                      {t('dialogs.cityEditor.done')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {entryType === 'place' && (
              <View style={styles.field}>
                <Text style={styles.label}>{t('entryForm.ratingLabel').toLocaleUpperCase(locale)}</Text>
                <RatingInput value={rating} onChange={setRating} />
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>{t('entryForm.notesLabel').toLocaleUpperCase(locale)}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder={t('placeholders.entryNotes')}
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Tags */}
            <View style={styles.field}>
              <Text style={styles.label}>{t('entryForm.tagsLabel').toLocaleUpperCase(locale)}</Text>
              <TouchableOpacity
                style={styles.tagInputContainer}
                onPress={() => setShowTagPicker(true)}
              >
                {selectedTags.length === 0 ? (
                  <Text style={styles.tagPlaceholder}>{t('entryForm.tapToAddTags')}</Text>
                ) : (
                  <View style={styles.selectedTagsInline}>
                    {selectedTags.slice(0, 3).map((tag) => (
                      <View key={tag.id} style={styles.selectedTag}>
                        <Text style={styles.selectedTagText}>{tag.name}</Text>
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            handleRemoveTag(tag.id);
                          }}
                        >
                          <Ionicons name="close" size={14} color={theme.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    ))}
                    {selectedTags.length > 3 && (
                      <Text style={styles.moreTagsText}>
                        {t('entryForm.moreTags', { count: selectedTags.length - 3 })}
                      </Text>
                    )}
                  </View>
                )}
                <Ionicons name="pricetag-outline" size={20} color={theme.textMuted} />
              </TouchableOpacity>
              {selectedTags.length > 3 && (
                <View style={styles.selectedTags}>
                  {selectedTags.slice(3).map((tag) => (
                    <View key={tag.id} style={styles.selectedTag}>
                      <Text style={styles.selectedTagText}>{tag.name}</Text>
                      <TouchableOpacity onPress={() => handleRemoveTag(tag.id)}>
                        <Ionicons name="close" size={14} color={theme.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TagPickerDialog
              visible={showTagPicker}
              onClose={() => setShowTagPicker(false)}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />

            {/* Photos */}
            <View style={styles.field}>
              <Text style={styles.label}>
                {t('entryForm.photosLabel', { count: photos.length, max: 10 }).toLocaleUpperCase(locale)}
              </Text>
              <View style={styles.photoButtons}>
                <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
                  <Ionicons name="images-outline" size={24} color={theme.accent} />
                  <Text style={styles.photoButtonText}>{t('entryForm.gallery')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                  <Ionicons name="camera-outline" size={24} color={theme.accent} />
                  <Text style={styles.photoButtonText}>{t('entryForm.camera')}</Text>
                </TouchableOpacity>
              </View>
            {photos.length > 0 && (
              <ScrollView
                horizontal
                style={styles.photoPreview}
                contentContainerStyle={styles.photoPreviewContent}
                showsHorizontalScrollIndicator={false}
              >
                {photos.map((uri, index) => (
                  <View
                    key={index}
                    style={[
                      styles.photoContainer,
                      index === photos.length - 1 && styles.photoContainerLast,
                    ]}
                  >
                    <Image source={{ uri }} style={styles.photo} />
                    <TouchableOpacity style={styles.removePhotoButton} onPress={() => handleRemovePhoto(index)}>
                      <Ionicons name="close-circle" size={24} color={theme.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </ModalWrapper>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    form: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    typeToggle: {
      flexDirection: 'row',
      backgroundColor: theme.card,
      borderRadius: borderRadius.xl,
      padding: 4,
      borderWidth: 1,
      borderColor: theme.borderLight,
      marginBottom: spacing.lg,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 2,
    },
    typeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.lg,
      backgroundColor: theme.backgroundSecondary,
    },
    typeButtonActive: {
      backgroundColor: theme.place,
    },
    typeButtonActiveMoment: {
      backgroundColor: theme.moment,
    },
    typeButtonText: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.text,
    },
    typeButtonTextActive: {
      color: theme.white,
    },
    field: {
      marginBottom: spacing.lg,
    },
    label: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.textSecondary,
      marginBottom: spacing.xs,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    input: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 1,
    },
    textArea: {
      minHeight: 100,
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
      gap: spacing.sm,
    },
    dateText: {
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.text,
    },
    datePickerContainer: {
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      marginBottom: spacing.lg,
      overflow: 'hidden',
    },
    datePickerLabel: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    datePicker: {
      height: 200,
    },
    datePickerDone: {
      alignItems: 'center',
      padding: spacing.md,
      borderTopWidth: 1,
    },
    datePickerDoneText: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
    },
    tagInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.borderLight,
      padding: spacing.md,
      minHeight: 52,
    },
    tagPlaceholder: {
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.textMuted,
    },
    selectedTagsInline: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      marginRight: spacing.sm,
    },
    selectedTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      marginTop: spacing.sm,
    },
    selectedTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: theme.backgroundSecondary,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    selectedTagText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.text,
    },
    moreTagsText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.textMuted,
      alignSelf: 'center',
    },
    photoButtons: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    photoButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.borderLight,
      backgroundColor: theme.backgroundSecondary,
    },
    photoButtonText: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.accent,
    },
    photoPreview: {
      marginTop: spacing.md,
      paddingTop: spacing.lg,
    },
    photoPreviewContent: {
      paddingHorizontal: spacing.xs,
    },
    photoContainer: {
      marginRight: spacing.xs,
      position: 'relative',
    },
    photoContainerLast: {
      marginRight: 0,
    },
    photo: {
      width: 100,
      height: 100,
      borderRadius: borderRadius.md,
    },
    removePhotoButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: theme.white,
      borderRadius: 12,
    },
  });
