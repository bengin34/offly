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
  Switch,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ChapterRepository } from '../../../src/db/repositories';
import { spacing, fontSize, borderRadius, fonts } from '../../../src/constants';
import { Background } from '../../../src/components/Background';
import { ModalWrapper } from '../../../src/components/ModalWrapper';
import { useI18n, useTheme } from '../../../src/hooks';

type DatePickerTarget = 'start' | 'end' | null;

export default function EditChapterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { t, locale } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<DatePickerTarget>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadChapter() {
      if (!id) return;
      try {
        const chapter = await ChapterRepository.getById(id);

        if (chapter) {
          setTitle(chapter.title);
          setStartDate(new Date(chapter.startDate));
          if (chapter.endDate) {
            setEndDate(new Date(chapter.endDate));
            setHasEndDate(true);
          }
          setDescription(chapter.description || '');
          setCoverImage(chapter.coverImageUri);
        }
      } catch (error) {
        console.error('Failed to load chapter:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadChapter();
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
      if (endDate && selectedDate > endDate) {
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

  const getPickerDate = () => {
    if (datePickerTarget === 'end') return endDate || startDate;
    return startDate;
  };

  const handlePickCoverImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.5,
    });

    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverImage(undefined);
  };

  const handleToggleEndDate = (value: boolean) => {
    setHasEndDate(value);
    if (value && !endDate) {
      setEndDate(new Date());
    }
    if (!value) {
      setEndDate(undefined);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('alerts.requiredTitle'), t('alerts.requiredChapterTitle'));
      return;
    }

    setIsSubmitting(true);
    try {
      await ChapterRepository.update({
        id: id!,
        title: title.trim(),
        startDate: startDate.toISOString(),
        endDate: hasEndDate && endDate ? endDate.toISOString() : undefined,
        description: description.trim() || undefined,
        coverImageUri: coverImage,
      });

      router.back();
    } catch (error) {
      console.error('Failed to update chapter:', error);
      Alert.alert(t('alerts.errorTitle'), t('alerts.updateChapterFailed'));
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
        title={t('navigation.editChapter')}
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
              <Text style={styles.label}>{t('chapterForm.titleLabel').toLocaleUpperCase(locale)}</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder={t('placeholders.chapterTitle')}
                placeholderTextColor={theme.textMuted}
              />
            </View>

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
              <View style={styles.endDateToggleRow}>
                <Text style={styles.label}>{t('labels.endDate').toLocaleUpperCase(locale)}</Text>
                <Switch
                  value={hasEndDate}
                  onValueChange={handleToggleEndDate}
                  trackColor={{ false: theme.borderLight, true: theme.primary }}
                  thumbColor={theme.white}
                />
              </View>
              {hasEndDate && (
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => openDatePicker('end')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} />
                  <Text style={styles.dateText}>{formatDate(endDate || new Date())}</Text>
                </TouchableOpacity>
              )}
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
                      {t('common.done')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>{t('chapterForm.descriptionLabel').toLocaleUpperCase(locale)}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder={t('placeholders.chapterDescription')}
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('chapterForm.coverImageLabel').toLocaleUpperCase(locale)}</Text>
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
                    <Text style={styles.changeCoverText}>{t('chapterForm.changeCover')}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.coverImagePlaceholder}
                  onPress={handlePickCoverImage}
                >
                  <Ionicons name="image-outline" size={40} color={theme.textMuted} />
                  <Text style={styles.placeholderText}>{t('chapterForm.addCoverPlaceholder')}</Text>
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
    endDateToggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
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
