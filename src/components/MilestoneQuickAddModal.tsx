import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { ModalWrapper } from './ModalWrapper';
import { TagPickerDialog } from './TagPickerDialog';
import { useTheme, useI18n } from '../hooks';
import { spacing, fontSize, borderRadius, fonts } from '../constants';
import type { MilestoneInstanceWithTemplate, Tag } from '../types';

interface MilestoneQuickAddModalProps {
  visible: boolean;
  milestone: MilestoneInstanceWithTemplate | null;
  onClose: () => void;
  onSave: (data: {
    title: string;
    date: Date;
    description?: string;
    photoUris: string[];
    tagIds: string[];
  }) => Promise<void>;
  isLoading?: boolean;
  locale?: string;
}

export function MilestoneQuickAddModal({
  visible,
  milestone,
  onClose,
  onSave,
  isLoading = false,
  locale = 'en-US',
}: MilestoneQuickAddModalProps) {
  const theme = useTheme();
  const { t } = useI18n();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date(milestone?.expectedDate || new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handlePickImage = useCallback(async () => {
    if (photos.length >= 3) {
      Alert.alert(t('alerts.maxPhotos') || 'Max 3 photos', t('alerts.maxPhotosDesc') || 'You can add up to 3 photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  }, [photos.length, t]);

  const handleTakePhoto = useCallback(async () => {
    if (photos.length >= 3) {
      Alert.alert(t('alerts.maxPhotos') || 'Max 3 photos', t('alerts.maxPhotosDesc') || 'You can add up to 3 photos');
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('alerts.cameraPermission') || 'Camera Permission', t('alerts.cameraPermissionDesc') || 'Please enable camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  }, [photos.length, t]);

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleSave = async () => {
    if (isSaving || isLoading) return;

    if (!title.trim()) {
      Alert.alert(t('alerts.required') || 'Required', t('alerts.requiredTitle') || 'Please enter a title');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        title: title.trim(),
        date,
        description: description.trim() || undefined,
        photoUris: photos,
        tagIds: selectedTags.map((tag) => tag.id),
      });
      // Reset form
      setTitle('');
      setDate(new Date(milestone?.expectedDate || new Date()));
      setDescription('');
      setPhotos([]);
      setSelectedTags([]);
    } finally {
      setIsSaving(false);
    }
  };

  if (!milestone) return null;

  const formatDate = (d: Date) => {
    try {
      return d.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return d.toLocaleDateString();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
    <ModalWrapper
      onClose={onClose}
      title={milestone.template.label}
      actionLabel={isSaving ? (t('common.saving') || 'Saving...') : (t('common.save') || 'Save')}
      onAction={handleSave}
      actionDisabled={isSaving || isLoading}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Title Input */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>{t('labels.title') || 'Title'}</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.borderLight,
              },
            ]}
            placeholder={t('placeholders.memoryTitle') || 'What happened?'}
            placeholderTextColor={theme.textMuted}
            value={title}
            onChangeText={setTitle}
            editable={!isSaving}
          />
        </View>

        {/* Date Picker */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>{t('labels.date') || 'Date'}</Text>
          <TouchableOpacity
            style={[
              styles.dateButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.borderLight,
              },
            ]}
            onPress={() => setShowDatePicker(true)}
            disabled={isSaving}
          >
            <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
            <Text style={[styles.dateText, { color: theme.text }]}>{formatDate(date)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Photos */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>
            {t('entryForm.photosLabel', { count: photos.length, max: 3 }) || `Photos (${photos.length}/3)`}
          </Text>
          <View style={styles.photoButtons}>
            <TouchableOpacity
              style={[styles.photoButton, { backgroundColor: theme.card, borderColor: theme.borderLight }]}
              onPress={handlePickImage}
              disabled={isSaving}
            >
              <Ionicons name="images-outline" size={24} color={theme.accent} />
              <Text style={[styles.photoButtonText, { color: theme.accent }]}>
                {t('entryForm.gallery') || 'Gallery'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.photoButton, { backgroundColor: theme.card, borderColor: theme.borderLight }]}
              onPress={handleTakePhoto}
              disabled={isSaving}
            >
              <Ionicons name="camera-outline" size={24} color={theme.accent} />
              <Text style={[styles.photoButtonText, { color: theme.accent }]}>
                {t('entryForm.camera') || 'Camera'}
              </Text>
            </TouchableOpacity>
          </View>
          {photos.length > 0 && (
            <ScrollView
              horizontal
              style={styles.photoPreview}
              showsHorizontalScrollIndicator={false}
            >
              {photos.map((uri, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri }} style={styles.photo} resizeMode="cover" />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => handleRemovePhoto(index)}
                    disabled={isSaving}
                  >
                    <Ionicons name="close-circle" size={24} color={theme.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>
            {t('labels.notes') || 'Notes'} ({t('labels.optional') || 'optional'})
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.card,
                color: theme.text,
                borderColor: theme.borderLight,
              },
            ]}
            placeholder={t('placeholders.memoryNotes') || 'Add details...'}
            placeholderTextColor={theme.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            editable={!isSaving}
          />
        </View>

        {/* Tags */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>
            {(t('memoryForm.tagsLabel') || t('entryForm.tagsLabel') || 'Tags').toLocaleUpperCase(locale)}
          </Text>
          <TouchableOpacity
            style={[
              styles.tagInputContainer,
              {
                backgroundColor: theme.card,
                borderColor: theme.borderLight,
              },
            ]}
            onPress={() => setShowTagPicker(true)}
            disabled={isSaving}
          >
            {selectedTags.length === 0 ? (
              <Text style={[styles.tagPlaceholder, { color: theme.textMuted }]}>
                {t('entryForm.tapToAddTags') || 'Tap to add tags...'}
              </Text>
            ) : (
              <View style={styles.selectedTagsInline}>
                {selectedTags.slice(0, 3).map((tag) => (
                  <View
                    key={tag.id}
                    style={[
                      styles.selectedTag,
                      { backgroundColor: theme.backgroundSecondary, borderColor: theme.borderLight },
                    ]}
                  >
                    <Text style={[styles.selectedTagText, { color: theme.text }]}>{tag.name}</Text>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(tag.id);
                      }}
                      disabled={isSaving}
                    >
                      <Ionicons name="close" size={14} color={theme.textSecondary} />
                    </TouchableOpacity>
                  </View>
                ))}
                {selectedTags.length > 3 && (
                  <Text style={[styles.moreTagsText, { color: theme.textSecondary }]}>
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
                <View
                  key={tag.id}
                  style={[
                    styles.selectedTag,
                    { backgroundColor: theme.backgroundSecondary, borderColor: theme.borderLight },
                  ]}
                >
                  <Text style={[styles.selectedTagText, { color: theme.text }]}>{tag.name}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(tag.id)} disabled={isSaving}>
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
      </View>
    </ModalWrapper>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dateText: {
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
    flex: 1,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  photoButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  photoButtonText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.ui,
    fontWeight: '500',
  },
  photoPreview: {
    marginTop: spacing.md,
  },
  photoContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 12,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
    minHeight: 52,
  },
  tagPlaceholder: {
    fontSize: fontSize.md,
    fontFamily: fonts.body,
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
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  selectedTagText: {
    fontSize: fontSize.xs,
    fontFamily: fonts.ui,
  },
  moreTagsText: {
    fontSize: fontSize.xs,
    fontFamily: fonts.body,
    alignSelf: 'center',
  },
});
