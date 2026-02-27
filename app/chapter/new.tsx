import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Image,
  Keyboard,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ChapterRepository, BabyProfileRepository, MilestoneRepository } from '../../src/db/repositories';
import { useProfileStore } from '../../src/stores/profileStore';
import { getMilestoneTemplates } from '../../src/constants/milestoneTemplates';
import { getExpectedDate, getMilestonesForChapter } from '../../src/utils/milestones';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { Background } from '../../src/components/Background';
import { ModalWrapper } from '../../src/components/ModalWrapper';
import { useI18n, useTheme, useSubscription } from '../../src/hooks';

type DatePickerTarget = 'start' | 'end' | null;

export default function NewChapterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t, locale } = useI18n();
  const { isPro, presentPaywall } = useSubscription();
  const { activeBaby } = useProfileStore();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<DatePickerTarget>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chapterCount, setChapterCount] = useState(0);
  const [limitChecked, setLimitChecked] = useState(false);

  // Check chapter limit on mount
  useEffect(() => {
    const checkLimit = async () => {
      const count = await ChapterRepository.count(activeBaby?.id);
      setChapterCount(count);

      // Simple check: if not pro and count >= 3, show paywall
      if (!isPro && count >= 3) {
        Alert.alert(
          t('alerts.chapterLimitTitle'),
          t('alerts.chapterLimitMessage', { limit: '3' }),
          [
            { text: t('common.cancel'), style: 'cancel', onPress: () => router.back() },
            {
              text: t('alerts.chapterLimitUpgrade'),
              onPress: async () => {
                const purchased = await presentPaywall();
                if (!purchased) {
                  router.back();
                }
              }
            },
          ]
        );
      }
      setLimitChecked(true);
    };
    checkLimit();
  }, [isPro, presentPaywall, t, router]);

  const formatDate = (date: Date) => {
    try {
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return date.toLocaleDateString(locale);
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
      // Use active profile from store, fall back to default
      const babyProfile = activeBaby ?? await BabyProfileRepository.getDefault();
      if (!babyProfile) {
        Alert.alert(t('alerts.errorTitle'), t('alerts.noProfileFound'));
        setIsSubmitting(false);
        return;
      }

      const newChapter = await ChapterRepository.create({
        babyId: babyProfile.id,
        title: title.trim(),
        startDate: startDate.toISOString(),
        endDate: hasEndDate && endDate ? endDate.toISOString() : undefined,
        description: description.trim() || undefined,
        coverImageUri: coverImage,
      });

      // Auto-generate milestone instances for this chapter
      try {
        const chapterStartDate = startDate.toISOString();
        const chapterEndDate = hasEndDate && endDate ? endDate.toISOString() : undefined;
        const templates = getMilestonesForChapter(babyProfile, chapterStartDate, chapterEndDate);

        for (const template of templates) {
          const expectedDate = getExpectedDate(babyProfile, template);
          if (expectedDate) {
            await MilestoneRepository.createInstance(babyProfile.id, template.id, expectedDate);
          }
        }
      } catch (milestoneError) {
        console.warn('Failed to auto-generate milestones:', milestoneError);
      }

      router.back();
    } catch (error) {
      console.error('Failed to create chapter:', error);
      Alert.alert(t('alerts.errorTitle'), t('alerts.createChapterFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Background />
      <ModalWrapper
        title={t('navigation.newChapter')}
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
                autoFocus
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
                  <Image source={{ uri: coverImage }} style={styles.coverImage} />
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
      overflow: 'hidden',
    },
    coverImage: {
      width: '100%',
      height: 180,
      borderRadius: borderRadius.lg,
    },
    removeCoverButton: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
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
