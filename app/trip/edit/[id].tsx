import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  Image,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { TripRepository } from '../../../src/db/repositories';
import { CityRepository } from '../../../src/db/repositories/CityRepository';
import { spacing, fontSize, borderRadius, fonts } from '../../../src/constants';
import { Background } from '../../../src/components/Background';
import { ModalWrapper } from '../../../src/components/ModalWrapper';
import { CityListEditor } from '../../../src/components/CityListEditor';
import { useI18n, useTheme } from '../../../src/hooks';

type CityDraft = {
  id?: string;
  name: string;
  arrivalDate?: string;
  departureDate?: string;
};

type DatePickerTarget = 'start' | 'end' | null;

export default function EditTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { t, locale } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [cities, setCities] = useState<CityDraft[]>([]);
  const [originalCityIds, setOriginalCityIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<DatePickerTarget>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derive location from city names
  const derivedLocation = cities.length > 0
    ? cities.map((c) => c.name).join(', ')
    : '';

  useEffect(() => {
    async function loadTrip() {
      if (!id) return;
      try {
        const trip = await TripRepository.getById(id);
        const tripCities = await CityRepository.getByTripId(id);

        if (trip) {
          setTitle(trip.title);
          setStartDate(new Date(trip.startDate));
          setEndDate(new Date(trip.endDate));
          setSummary(trip.summary || '');
          setCoverImage(trip.coverImageUri);

          // Convert cities to drafts
          const cityDrafts: CityDraft[] = tripCities.map((c) => ({
            id: c.id,
            name: c.name,
            arrivalDate: c.arrivalDate,
            departureDate: c.departureDate,
          }));
          setCities(cityDrafts);
          setOriginalCityIds(tripCities.map((c) => c.id));
        }
      } catch (error) {
        console.error('Failed to load trip:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTrip();
  }, [id]);

  const formatDate = (date: Date) => {
    try {
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const openDatePicker = (target: DatePickerTarget) => {
    Keyboard.dismiss();
    setDatePickerTarget(target);
    setShowDatePicker(true);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setDatePickerTarget(null);
    }
    if (event.type !== 'set' || !selectedDate || !datePickerTarget) return;

    if (datePickerTarget === 'start') {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    } else {
      if (selectedDate < startDate) {
        Alert.alert(t('alerts.invalidDateTitle'), t('alerts.invalidDateMessage'));
        return;
      }
      setEndDate(selectedDate);
    }
  };

  const confirmIOSDate = () => {
    setShowDatePicker(false);
    setDatePickerTarget(null);
  };

  const getPickerDate = () => (datePickerTarget === 'end' ? endDate : startDate);

  const handlePickCoverImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverImage(undefined);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('alerts.requiredTitle'), t('alerts.requiredTripTitle'));
      return;
    }
    if (cities.length === 0) {
      Alert.alert(t('alerts.requiredTitle'), t('alerts.requiredTripCity'));
      return;
    }

    setIsSubmitting(true);
    try {
      // Update trip with derived location
      await TripRepository.update({
        id: id!,
        title: title.trim(),
        location: derivedLocation,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        summary: summary.trim() || undefined,
        coverImageUri: coverImage,
      });

      // Handle city updates
      const currentCityIds = cities.filter((c) => c.id).map((c) => c.id!);

      // Delete removed cities
      for (const originalId of originalCityIds) {
        if (!currentCityIds.includes(originalId)) {
          await CityRepository.delete(originalId);
        }
      }

      // Update existing and create new cities
      for (let i = 0; i < cities.length; i++) {
        const cityDraft = cities[i];
        if (cityDraft.id) {
          // Update existing city
          await CityRepository.update({
            id: cityDraft.id,
            name: cityDraft.name,
            arrivalDate: cityDraft.arrivalDate,
            departureDate: cityDraft.departureDate,
            orderIndex: i,
          });
        } else {
          // Create new city
          await CityRepository.create({
            tripId: id!,
            name: cityDraft.name,
            arrivalDate: cityDraft.arrivalDate,
            departureDate: cityDraft.departureDate,
            orderIndex: i,
          });
        }
      }

      router.back();
    } catch (error) {
      console.error('Failed to update trip:', error);
      Alert.alert(t('alerts.errorTitle'), t('alerts.updateTripFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = createStyles(theme);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Background />
      <ModalWrapper
        title={t('navigation.editTrip')}
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
            <View style={styles.field}>
              <Text style={styles.label}>{t('tripForm.titleLabel').toLocaleUpperCase(locale)}</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder={t('placeholders.tripTitle')}
                placeholderTextColor={theme.textMuted}
              />
            </View>

            <CityListEditor
              cities={cities}
              onCitiesChange={setCities}
              tripStartDate={startDate.toISOString().split('T')[0]}
              tripEndDate={endDate.toISOString().split('T')[0]}
              onTripStartDateChange={(dateStr) => setStartDate(new Date(dateStr))}
              onTripEndDateChange={(dateStr) => setEndDate(new Date(dateStr))}
            />

            <View style={styles.field}>
              <Text style={styles.label}>{t('labels.startDate').toLocaleUpperCase(locale)}</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => openDatePicker('start')}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} />
                <Text style={styles.dateText}>{formatDate(startDate)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('labels.endDate').toLocaleUpperCase(locale)}</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => openDatePicker('end')}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} />
                <Text style={styles.dateText}>{formatDate(endDate)}</Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <View style={[styles.datePickerContainer, { backgroundColor: theme.card, borderColor: theme.borderLight }]}>
                <Text style={[styles.datePickerLabel, { color: theme.textSecondary }]}>
                  {datePickerTarget === 'end'
                    ? t('labels.endDate')
                    : t('labels.startDate')}
                </Text>
                <DateTimePicker
                  value={getPickerDate()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  locale={locale}
                  themeVariant={theme.isDark ? 'dark' : 'light'}
                  minimumDate={datePickerTarget === 'end' ? startDate : undefined}
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

            <View style={styles.field}>
              <Text style={styles.label}>{t('tripForm.summaryLabel').toLocaleUpperCase(locale)}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={summary}
                onChangeText={setSummary}
                placeholder={t('placeholders.tripSummary')}
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('tripForm.coverImageLabel').toLocaleUpperCase(locale)}</Text>
              {coverImage ? (
                <View style={styles.coverImageContainer}>
                  <View style={styles.coverImageFrame}>
                    <Image source={{ uri: coverImage }} style={styles.coverImage} />
                  </View>
                  <TouchableOpacity
                    style={styles.removeCoverButton}
                    onPress={handleRemoveCoverImage}
                  >
                    <Ionicons name="close-circle" size={28} color={theme.error} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.changeCoverButton}
                    onPress={handlePickCoverImage}
                  >
                    <Ionicons name="camera" size={18} color={theme.white} />
                    <Text style={styles.changeCoverText}>{t('tripForm.changeCover')}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.coverImagePlaceholder}
                  onPress={handlePickCoverImage}
                >
                  <Ionicons name="image-outline" size={40} color={theme.textMuted} />
                  <Text style={styles.placeholderText}>{t('tripForm.addCoverPlaceholder')}</Text>
                </TouchableOpacity>
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    form: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
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
      minHeight: 80,
    },
    dateButton: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
      flexDirection: 'row',
      alignItems: 'center',
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
    coverImageContainer: {
      position: 'relative',
      borderRadius: borderRadius.lg,
      overflow: 'visible',
    },
    coverImageFrame: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    coverImage: {
      width: '100%',
      height: 180,
    },
    removeCoverButton: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: theme.white,
      borderRadius: 14,
    },
    changeCoverButton: {
      position: 'absolute',
      bottom: spacing.sm,
      right: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: theme.overlay,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
    },
    changeCoverText: {
      color: theme.white,
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
    },
    coverImagePlaceholder: {
      backgroundColor: theme.backgroundSecondary,
      borderRadius: borderRadius.lg,
      borderWidth: 2,
      borderColor: theme.borderLight,
      borderStyle: 'dashed',
      height: 180,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    placeholderText: {
      color: theme.textMuted,
      fontSize: fontSize.md,
      fontFamily: fonts.body,
    },
  });
