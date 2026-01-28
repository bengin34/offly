import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useSubscription } from '../src/hooks';
import { useOnboardingStore } from '../src/stores/onboardingStore';
import { BabyProfileRepository, VaultRepository } from '../src/db/repositories';
import { Background } from '../src/components/Background';
import { spacing, fontSize, fonts, borderRadius } from '../src/constants';
import type { BabyMode } from '../src/types';

export default function BabySetupScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const { presentPaywall, isPro } = useSubscription();

  const [step, setStep] = useState<'mode' | 'details'>('mode');
  const [mode, setMode] = useState<BabyMode | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectMode = useCallback((selectedMode: BabyMode) => {
    setMode(selectedMode);
    setStep('details');
  }, []);

  const handleDateChange = useCallback((_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  }, []);

  const handleFinish = useCallback(async () => {
    if (!mode || isSaving) return;
    setIsSaving(true);

    try {
      // Update the default profile with mode + date info
      const profile = await BabyProfileRepository.getDefault();
      if (profile) {
        await BabyProfileRepository.update({
          id: profile.id,
          name: name.trim() || undefined,
          mode,
          birthdate: mode === 'born' ? date.toISOString() : undefined,
          edd: mode === 'pregnant' ? date.toISOString() : undefined,
        });

        // Create default vaults
        const referenceDate = date.toISOString();
        await VaultRepository.createDefaults(profile.id, referenceDate);
      }

      // Show paywall if not pro
      if (!isPro) {
        await presentPaywall();
      }

      await completeOnboarding();
      router.replace('/');
    } catch (error) {
      console.error('Failed to save baby setup:', error);
      // Still complete onboarding to avoid being stuck
      await completeOnboarding();
      router.replace('/');
    } finally {
      setIsSaving(false);
    }
  }, [mode, name, date, isSaving, isPro, presentPaywall, completeOnboarding, router]);

  const styles = createStyles(theme);

  if (step === 'mode') {
    return (
      <View style={styles.container}>
        <Background />
        <View style={[styles.content, { paddingTop: insets.top + spacing.xxl }]}>
          <Text style={styles.title}>Welcome to BabyLegacy</Text>
          <Text style={styles.subtitle}>How would you like to start?</Text>

          <View style={styles.modeCards}>
            <TouchableOpacity
              style={styles.modeCard}
              onPress={() => handleSelectMode('born')}
              activeOpacity={0.8}
            >
              <View style={[styles.modeIcon, { backgroundColor: theme.accentSoft }]}>
                <Ionicons name="happy-outline" size={32} color={theme.accent} />
              </View>
              <Text style={styles.modeTitle}>Baby is born</Text>
              <Text style={styles.modeDescription}>
                Start capturing milestones and memories from birth
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modeCard}
              onPress={() => handleSelectMode('pregnant')}
              activeOpacity={0.8}
            >
              <View style={[styles.modeIcon, { backgroundColor: theme.accentSoft }]}>
                <Ionicons name="heart-outline" size={32} color={theme.primary} />
              </View>
              <Text style={styles.modeTitle}>I'm pregnant</Text>
              <Text style={styles.modeDescription}>
                Start a pregnancy journal and write letters for the future
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Background />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.detailsContent,
            { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xxl },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.backButton} onPress={() => setStep('mode')}>
            <Ionicons name="arrow-back" size={22} color={theme.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.title}>
            {mode === 'born' ? 'Tell us about your baby' : 'When are you due?'}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'born'
              ? 'You can always update this later in Settings'
              : 'This helps us set up your timeline'}
          </Text>

          <View style={styles.formSection}>
            <Text style={styles.label}>Name (optional)</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={mode === 'born' ? 'Baby\'s name or nickname' : 'A name or nickname'}
              placeholderTextColor={theme.textMuted}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>
              {mode === 'born' ? 'Date of birth' : 'Estimated due date'}
            </Text>
            {Platform.OS === 'android' && (
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={theme.primary} />
                <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>
            )}
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={mode === 'born' ? new Date() : undefined}
                minimumDate={mode === 'pregnant' ? new Date() : undefined}
              />
            )}
          </View>

          <TouchableOpacity
            style={[styles.finishButton, isSaving && styles.finishButtonDisabled]}
            onPress={handleFinish}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            <Text style={styles.finishButtonText}>
              {isSaving ? 'Setting up...' : 'Get started'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    flex: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.xl,
    },
    detailsContent: {
      paddingHorizontal: spacing.xl,
      flexGrow: 1,
    },
    backButton: {
      marginBottom: spacing.lg,
      padding: spacing.xs,
      alignSelf: 'flex-start',
    },
    title: {
      fontSize: fontSize.xxl,
      fontFamily: fonts.display,
      color: theme.text,
      marginBottom: spacing.sm,
    },
    subtitle: {
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginBottom: spacing.xl,
    },
    modeCards: {
      gap: spacing.md,
    },
    modeCard: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 3,
    },
    modeIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    modeTitle: {
      fontSize: fontSize.lg,
      fontFamily: fonts.heading,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    modeDescription: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    formSection: {
      marginBottom: spacing.lg,
    },
    label: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    input: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    dateButton: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    dateButtonText: {
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.text,
    },
    finishButton: {
      backgroundColor: theme.primary,
      borderRadius: borderRadius.xl,
      paddingVertical: spacing.md + 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.lg,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 3,
    },
    finishButtonDisabled: {
      opacity: 0.6,
    },
    finishButtonText: {
      fontSize: fontSize.lg,
      fontFamily: fonts.ui,
      color: theme.white,
    },
  });
