import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MemoryRepository } from '../../src/db/repositories';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { Background } from '../../src/components/Background';
import { ModalWrapper } from '../../src/components/ModalWrapper';
import { TagPickerDialog } from '../../src/components/TagPickerDialog';
import { useI18n, useTheme } from '../../src/hooks';
import { useProfileStore } from '../../src/stores/profileStore';
import type { MemoryType, Tag } from '../../src/types';

export default function NewPregnancyJournalEntryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { locale, t } = useI18n();
  const { activeBaby } = useProfileStore();

  const [memoryType, setMemoryType] = useState<MemoryType>('note');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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
    } catch {
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

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('alerts.requiredTitle'), t('alerts.requiredEntryTitle'));
      return;
    }

    setIsSubmitting(true);
    try {
      await MemoryRepository.create({
        chapterId: '', // No chapter for pregnancy journal
        babyId: activeBaby?.id,
        isPregnancyJournal: true,
        memoryType,
        title: title.trim(),
        description: description.trim() || undefined,
        date: date.toISOString(),
        tagIds: selectedTags.map((tag) => tag.id),
      });

      router.back();
    } catch (error) {
      console.error('Failed to create pregnancy journal entry:', error);
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
        title={t('navigation.newJournalEntry')}
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
          {/* Type toggle: Note / Milestone */}
          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[styles.typeButton, memoryType === 'note' && styles.typeButtonActiveNote]}
              onPress={() => setMemoryType('note')}
            >
              <Ionicons
                name="document-text"
                size={20}
                color={memoryType === 'note' ? theme.white : theme.memory}
              />
              <Text style={[styles.typeButtonText, memoryType === 'note' && styles.typeButtonTextActive]}>
                {t('memoryForm.note')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, memoryType === 'milestone' && styles.typeButtonActiveMilestone]}
              onPress={() => setMemoryType('milestone')}
            >
              <Ionicons
                name="flag"
                size={20}
                color={memoryType === 'milestone' ? theme.white : theme.milestone}
              />
              <Text style={[styles.typeButtonText, memoryType === 'milestone' && styles.typeButtonTextActive]}>
                {t('memoryForm.milestone')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('labels.title').toLocaleUpperCase(locale)}</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder={
                memoryType === 'milestone'
                  ? t('placeholders.memoryTitleMilestone')
                  : t('placeholders.memoryTitleNote')
              }
              placeholderTextColor={theme.textMuted}
              autoFocus
            />
          </View>

          {/* Date */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('labels.date').toLocaleUpperCase(locale)}</Text>
            <TouchableOpacity style={styles.dateButton} onPress={openDatePicker} activeOpacity={0.8}>
              <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <View style={[styles.datePickerContainer, { backgroundColor: theme.card, borderColor: theme.borderLight }]}>
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                themeVariant={theme.isDark ? 'dark' : 'light'}
                style={styles.datePicker}
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={[styles.datePickerDone, { borderTopColor: theme.borderLight }]}
                  onPress={confirmIOSDate}
                >
                  <Text style={[styles.datePickerDoneText, { color: theme.primary }]}>{t('common.done')}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('labels.notes').toLocaleUpperCase(locale)}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder={t('placeholders.entryNotes')}
              placeholderTextColor={theme.textMuted}
              multiline
              numberOfLines={6}
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
          </View>

          <TagPickerDialog
            visible={showTagPicker}
            onClose={() => setShowTagPicker(false)}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
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
    typeButtonActiveMilestone: {
      backgroundColor: theme.milestone,
    },
    typeButtonActiveNote: {
      backgroundColor: theme.memory,
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
      minHeight: 140,
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
  });
