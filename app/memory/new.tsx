import { useState } from 'react';
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
import { MemoryRepository } from '../../src/db/repositories';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { Background } from '../../src/components/Background';
import { ModalWrapper } from '../../src/components/ModalWrapper';
import { TagPickerDialog } from '../../src/components/TagPickerDialog';
import { useI18n, useTheme } from '../../src/hooks';
import { useProfileStore } from '../../src/stores/profileStore';
import type { Tag } from '../../src/types';

export default function NewMemoryScreen() {
  const { activeBaby } = useProfileStore();
  const { chapterId, chapterStartDate, chapterEndDate } = useLocalSearchParams<{
    chapterId: string;
    chapterStartDate?: string;
    chapterEndDate?: string;
  }>();
  const router = useRouter();
  const theme = useTheme();
  const { t, locale } = useI18n();
  const minDate = chapterStartDate ? new Date(chapterStartDate) : undefined;
  const maxDate = chapterEndDate ? new Date(chapterEndDate) : new Date();

  // Clamp initial date to chapter range
  const getInitialDate = () => {
    const now = new Date();
    if (maxDate && now > maxDate) return maxDate;
    if (minDate && now < minDate) return minDate;
    return now;
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getInitialDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (d: Date) => {
    try {
      return d.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return d.toLocaleDateString(locale);
    }
  };

  const handleDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (!selectedDate) return;
    setDate(selectedDate);
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
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };


  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('alerts.requiredTitle'), t('alerts.requiredEntryTitle'));
      return;
    }

    if (minDate && date < minDate) {
      Alert.alert(t('alerts.invalidDateTitle'), t('alerts.dateBelowChapterStart'));
      return;
    }
    if (maxDate && date > maxDate) {
      Alert.alert(t('alerts.invalidDateTitle'), t('alerts.dateAboveChapterEnd'));
      return;
    }

    setIsSubmitting(true);
    try {
      await MemoryRepository.create({
        chapterId: chapterId!,
        babyId: activeBaby?.id,
        memoryType: 'note',
        title: title.trim(),
        description: description.trim() || undefined,
        date: date.toISOString(),
        tagIds: selectedTags.map((tag) => tag.id),
        photoUris: photos,
      });

      router.back();
    } catch (error) {
      console.error('Failed to create memory:', error);
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
            <View style={styles.field}>
              <Text style={styles.label}>{t('memoryForm.titleLabel').toLocaleUpperCase(locale)}</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder={t('placeholders.memoryTitleNote')}
                placeholderTextColor={theme.textMuted}
                autoFocus
              />
            </View>

            {/* Photos - moved right after title */}
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


            <View style={styles.field}>
              <Text style={styles.label}>{t('labels.date').toLocaleUpperCase(locale)}</Text>
              <TouchableOpacity style={styles.dateButton} onPress={openDatePicker} activeOpacity={0.8}>
                <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
                <Text style={styles.dateText}>{formatDate(date)}</Text>
              </TouchableOpacity>
              {(chapterStartDate || chapterEndDate) && (
                <Text style={styles.dateHint}>{t('entryForm.dateRangeHint')}</Text>
              )}
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
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  locale={locale}
                  themeVariant={theme.isDark ? 'dark' : 'light'}
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
              <Text style={styles.label}>{t('memoryForm.descriptionLabel').toLocaleUpperCase(locale)}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder={t('placeholders.entryNotes')}
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Tags */}
            <View style={styles.field}>
              <Text style={styles.label}>{t('memoryForm.tagsLabel').toLocaleUpperCase(locale)}</Text>
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
              isPregnancyMode={activeBaby?.mode === 'pregnant'}
            />
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
    dateHint: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textMuted,
      marginTop: spacing.xs,
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
