import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TagRepository } from '../db/repositories';
import { spacing, fontSize, borderRadius, fonts } from '../constants';
import { QUICK_TAGS, PREGNANCY_QUICK_TAGS, type QuickTag } from '../constants/quickTags';
import { useI18n, useTheme } from '../hooks';
import type { Tag } from '../types';

type TagPickerDialogProps = {
  visible: boolean;
  onClose: () => void;
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  isPregnancyMode?: boolean;
};

export function TagPickerDialog({
  visible,
  onClose,
  selectedTags,
  onTagsChange,
  isPregnancyMode = false,
}: TagPickerDialogProps) {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const [customTagInput, setCustomTagInput] = useState('');
  const [existingTags, setExistingTags] = useState<Tag[]>([]);
  const [searchResults, setSearchResults] = useState<Tag[]>([]);

  useEffect(() => {
    if (visible) {
      loadExistingTags();
    }
  }, [visible]);

  const loadExistingTags = async () => {
    const tags = await TagRepository.getAll();
    setExistingTags(tags);
  };

  const handleSearch = async (text: string) => {
    setCustomTagInput(text);
    if (text.trim().length > 0) {
      const results = await TagRepository.search(text.trim());
      setSearchResults(results.filter((t) => !selectedTags.some((st) => st.id === t.id)));
    } else {
      setSearchResults([]);
    }
  };

  const getQuickTagLabel = (tag: QuickTag) => {
    const key = `tags.quick.${tag.key}`;
    const label = t(key);
    return label === key ? tag.label : label;
  };

  const handleAddQuickTag = async (tagLabel: string) => {
    if (selectedTags.some((t) => t.name.toLowerCase() === tagLabel.toLowerCase())) {
      return; // Already selected
    }
    const tag = await TagRepository.getOrCreate(tagLabel);
    onTagsChange([...selectedTags, tag]);
  };

  const handleAddCustomTag = async () => {
    const trimmed = customTagInput.trim();
    if (!trimmed) return;

    if (selectedTags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      setCustomTagInput('');
      setSearchResults([]);
      return; // Already selected
    }

    const tag = await TagRepository.getOrCreate(trimmed);
    onTagsChange([...selectedTags, tag]);
    setCustomTagInput('');
    setSearchResults([]);
    loadExistingTags(); // Refresh existing tags list
  };

  const handleSelectExistingTag = (tag: Tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setCustomTagInput('');
    setSearchResults([]);
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId));
  };

  const isQuickTagSelected = (tagLabel: string) =>
    selectedTags.some((t) => t.name.toLowerCase() === tagLabel.toLowerCase());

  const quickTagLabels = [...QUICK_TAGS, ...PREGNANCY_QUICK_TAGS].map((tag) =>
    getQuickTagLabel(tag).toLowerCase()
  );

  // Filter existing tags that are not quick tags and not already selected
  const otherExistingTags = existingTags.filter(
    (tag) =>
      !quickTagLabels.includes(tag.name.toLowerCase()) &&
      !selectedTags.some((st) => st.id === tag.id)
  );

  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('dialogs.tagPicker.title')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.doneButton}>
            <Text style={styles.doneText}>{t('common.done')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('dialogs.tagPicker.selected').toLocaleUpperCase(locale)}
              </Text>
              <View style={styles.tagsGrid}>
                {selectedTags.map((tag) => (
                  <TouchableOpacity
                    key={tag.id}
                    style={styles.selectedTagChip}
                    onPress={() => handleRemoveTag(tag.id)}
                  >
                    <Text style={styles.selectedTagText}>{tag.name}</Text>
                    <Ionicons name="close-circle" size={18} color={theme.white} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Custom Tag Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('dialogs.tagPicker.addCustom').toLocaleUpperCase(locale)}
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={customTagInput}
                onChangeText={handleSearch}
                placeholder={t('dialogs.tagPicker.customPlaceholder')}
                placeholderTextColor={theme.textMuted}
                onSubmitEditing={handleAddCustomTag}
                returnKeyType="done"
                autoCapitalize="words"
              />
              {customTagInput.trim().length > 0 && (
                <TouchableOpacity onPress={handleAddCustomTag} style={styles.addButton}>
                  <Ionicons name="add-circle" size={28} color={theme.primary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <View style={styles.searchResults}>
                {searchResults.map((tag) => (
                  <TouchableOpacity
                    key={tag.id}
                    style={styles.searchResultItem}
                    onPress={() => handleSelectExistingTag(tag)}
                  >
                    <Text style={styles.searchResultText}>{tag.name}</Text>
                    <Ionicons name="add" size={20} color={theme.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Pregnancy Tags — shown first in pregnancy mode */}
          {isPregnancyMode && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('dialogs.tagPicker.pregnancyTags').toLocaleUpperCase(locale)}
              </Text>
              <View style={styles.quickTagsGrid}>
                {PREGNANCY_QUICK_TAGS.map((quickTag) => {
                  const label = getQuickTagLabel(quickTag);
                  const isSelected = isQuickTagSelected(label);
                  return (
                    <TouchableOpacity
                      key={quickTag.key}
                      style={[styles.quickTagChip, isSelected && styles.quickTagChipSelected]}
                      onPress={() => handleAddQuickTag(label)}
                      disabled={isSelected}
                    >
                      <Ionicons
                        name={quickTag.icon}
                        size={16}
                        color={isSelected ? theme.white : theme.accent}
                      />
                      <Text style={[styles.quickTagText, isSelected && styles.quickTagTextSelected]}>
                        {label}
                      </Text>
                      {!isSelected && (
                        <Ionicons name="add" size={16} color={theme.textMuted} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Quick Tags */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('dialogs.tagPicker.quickTags').toLocaleUpperCase(locale)}
            </Text>
            <View style={styles.quickTagsGrid}>
              {QUICK_TAGS.map((quickTag) => {
                const label = getQuickTagLabel(quickTag);
                const isSelected = isQuickTagSelected(label);
                return (
                  <TouchableOpacity
                    key={quickTag.key}
                    style={[styles.quickTagChip, isSelected && styles.quickTagChipSelected]}
                    onPress={() => handleAddQuickTag(label)}
                    disabled={isSelected}
                  >
                    <Ionicons
                      name={quickTag.icon}
                      size={16}
                      color={isSelected ? theme.white : theme.accent}
                    />
                    <Text style={[styles.quickTagText, isSelected && styles.quickTagTextSelected]}>
                      {label}
                    </Text>
                    {!isSelected && (
                      <Ionicons name="add" size={16} color={theme.textMuted} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Other Existing Tags */}
          {otherExistingTags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('dialogs.tagPicker.yourTags').toLocaleUpperCase(locale)}
              </Text>
              <View style={styles.tagsGrid}>
                {otherExistingTags.map((tag) => (
                  <TouchableOpacity
                    key={tag.id}
                    style={styles.existingTagChip}
                    onPress={() => handleSelectExistingTag(tag)}
                  >
                    <Text style={styles.existingTagText}>{tag.name}</Text>
                    <Ionicons name="add" size={16} color={theme.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    closeButton: {
      padding: spacing.xs,
    },
    title: {
      fontSize: fontSize.lg,
      fontFamily: fonts.heading,
      color: theme.text,
    },
    doneButton: {
      padding: spacing.xs,
    },
    doneText: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.primary,
    },
    content: {
      flex: 1,
      padding: spacing.md,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    input: {
      flex: 1,
      padding: spacing.md,
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.text,
    },
    addButton: {
      padding: spacing.sm,
      marginRight: spacing.xs,
    },
    searchResults: {
      marginTop: spacing.sm,
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.borderLight,
      overflow: 'hidden',
    },
    searchResultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    searchResultText: {
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.text,
    },
    tagsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
    },
    quickTagsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    selectedTagChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    selectedTagText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.white,
    },
    quickTagChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: theme.card,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    quickTagChipSelected: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
    },
    quickTagText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.text,
    },
    quickTagTextSelected: {
      color: theme.white,
    },
    existingTagChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: theme.backgroundSecondary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    existingTagText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.text,
    },
  });
