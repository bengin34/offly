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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MemoryRepository } from '../../src/db/repositories';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { Background } from '../../src/components/Background';
import { ModalWrapper } from '../../src/components/ModalWrapper';
import { useTheme, usePaywallTrigger } from '../../src/hooks';

export default function NewVaultEntryScreen() {
  const { vaultId } = useLocalSearchParams<{ vaultId: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { onMemoryCreated, checkAgeLockedLetterLimit, showPaywall } = usePaywallTrigger();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (d: Date) => {
    try {
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return d.toLocaleDateString();
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

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please give your letter a title.');
      return;
    }

    if (!vaultId) {
      Alert.alert('Error', 'No vault selected.');
      return;
    }

    const currentLetterCount = await MemoryRepository.countAgeLockedLetters();
    const { canCreate, shouldShowPaywall, limit } = await checkAgeLockedLetterLimit(currentLetterCount);
    if (shouldShowPaywall && !canCreate) {
      Alert.alert(
        'Age-Locked Letter Limit Reached',
        `Free users can create up to ${limit} age-locked letters. Upgrade to Pro for unlimited letters.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade to Pro', onPress: () => void showPaywall() },
        ]
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await MemoryRepository.create({
        chapterId: '', // No chapter for vault entries
        vaultId,
        memoryType: 'letter',
        title: title.trim(),
        description: description.trim() || undefined,
        date: date.toISOString(),
      });

      await onMemoryCreated(0);
      router.back();
    } catch (error) {
      console.error('Failed to create vault entry:', error);
      Alert.alert('Error', 'Failed to save your letter. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Background />
      <ModalWrapper
        title="Write a Letter"
        onClose={() => router.back()}
        actionLabel={isSubmitting ? 'Saving...' : 'Save'}
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
          {/* Info banner */}
          <View style={styles.infoBanner}>
            <Ionicons name="lock-closed" size={16} color={theme.accent} />
            <Text style={styles.infoBannerText}>
              This letter will be kept safe until the vault unlocks
            </Text>
          </View>

          {/* Title */}
          <View style={styles.field}>
            <Text style={styles.label}>TITLE</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Dear future you..."
              placeholderTextColor={theme.textMuted}
              autoFocus
            />
          </View>

          {/* Date */}
          <View style={styles.field}>
            <Text style={styles.label}>DATE</Text>
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
                  <Text style={[styles.datePickerDoneText, { color: theme.primary }]}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Letter body */}
          <View style={styles.field}>
            <Text style={styles.label}>YOUR LETTER</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Write something meaningful..."
              placeholderTextColor={theme.textMuted}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
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
    infoBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.accentSoft,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    infoBannerText: {
      flex: 1,
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.accent,
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
      minHeight: 200,
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
  });
