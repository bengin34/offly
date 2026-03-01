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
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n, useTheme, useThemeMode } from '../src/hooks';
import { useOnboardingStore } from '../src/stores/onboardingStore';
import { BabyProfileRepository, VaultRepository } from '../src/db/repositories';
import { useProfileStore } from '../src/stores/profileStore';
import { autoGenerateTimeline } from '../src/utils/autoGenerate';
import { rebaseBornTimelineDates } from '../src/utils/rebaseBornTimeline';
import { Background } from '../src/components/Background';
import { spacing, fontSize, fonts, borderRadius, lightPaletteColors, paletteMetadata } from '../src/constants';
import type { BabyMode } from '../src/types';
import type { ThemePalette } from '../src/constants/colors';

export default function BabySetupScreen() {
  const theme = useTheme();
  const { palette, setPalette } = useThemeMode();
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addNew } = useLocalSearchParams<{ addNew?: string }>();
  const isAddingNew = addNew === 'true';
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const { setActiveBaby } = useProfileStore();

  const [step, setStep] = useState<'mode' | 'details' | 'theme'>('mode');
  const [mode, setMode] = useState<BabyMode | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [selectedPalette, setSelectedPalette] = useState<ThemePalette>(palette);
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

  const handleSelectPalette = useCallback(
    (nextPalette: ThemePalette) => {
      setSelectedPalette(nextPalette);
      setPalette(nextPalette);
    },
    [setPalette]
  );

  const handleFinish = useCallback(async () => {
    if (!mode || isSaving) return;
    setIsSaving(true);

    try {
      if (!isAddingNew) {
        setPalette(selectedPalette);
      }

      if (isAddingNew) {
        // Create a brand new profile
        const newProfile = await BabyProfileRepository.create({
          name: name.trim() || undefined,
          mode,
          birthdate: mode === 'born' ? date.toISOString() : undefined,
          edd: mode === 'pregnant' ? date.toISOString() : undefined,
        });

        // Create default vaults
        const referenceDate = date.toISOString();
        await VaultRepository.createDefaults(newProfile.id, referenceDate);

        // Auto-generate chapters + milestones for born mode
        if (mode === 'born') {
          try {
            await autoGenerateTimeline(newProfile);
          } catch (err) {
            console.warn('Failed to auto-generate timeline:', err);
          }
        }

        // Set the new profile as active
        await setActiveBaby(newProfile.id);
        router.back();
      } else {
        // Update the default profile with mode + date info (onboarding flow)
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

          // Auto-generate chapters + milestones for born mode.
          // Also rebase existing chapters in case mock data pre-created them
          // with a different birth date (ensures chapter dates align with the
          // actual birth date entered during onboarding).
          if (mode === 'born') {
            try {
              const updatedProfile = await BabyProfileRepository.getDefault();
              if (updatedProfile) {
                await autoGenerateTimeline(updatedProfile);
                await rebaseBornTimelineDates(
                  updatedProfile.id,
                  updatedProfile.birthdate!,
                  profile.birthdate
                );
              }
            } catch (err) {
              console.warn('Failed to auto-generate timeline:', err);
            }
          }
        }

        await completeOnboarding();
        router.replace('/');
      }
    } catch (error) {
      console.error('Failed to save baby setup:', error);
      if (!isAddingNew) {
        await completeOnboarding();
        router.replace('/');
      } else {
        router.back();
      }
    } finally {
      setIsSaving(false);
    }
  }, [mode, name, date, isSaving, isAddingNew, selectedPalette, setPalette, completeOnboarding, setActiveBaby, router]);

  const handleContinueFromDetails = useCallback(() => {
    if (!mode) return;
    if (isAddingNew) {
      // Skip theme selection when adding a new profile
      handleFinish();
    } else {
      setStep('theme');
    }
  }, [mode, isAddingNew, handleFinish]);

  const trOrFallback = useCallback(
    (key: string, fallback: string) => {
      const translated = t(key);
      return translated === key ? fallback : translated;
    },
    [t]
  );

  const paletteOptions: {
    palette: ThemePalette;
    label: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = (Object.keys(paletteMetadata) as ThemePalette[]).map((value) => {
    const base = paletteMetadata[value];
    return {
      palette: value,
      label: trOrFallback(`settings.palette.${value}.label`, base.label),
      description: trOrFallback(`settings.palette.${value}.description`, base.description),
      icon: base.icon,
    };
  });

  const styles = createStyles(theme);

  if (step === 'mode') {
    return (
      <View style={styles.container}>
        <Background />
        <View style={[styles.content, { paddingTop: insets.top + spacing.lg }]}>
          {isAddingNew && (
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, isAddingNew && { marginTop: spacing.md }]}>
            {isAddingNew ? 'Add New Baby' : t('babySetup.welcomeTitle')}
          </Text>
          <Text style={styles.subtitle}>
            {isAddingNew ? 'Choose how you want to set up this profile.' : t('babySetup.welcomeSubtitle')}
          </Text>

          <View style={styles.modeCards}>
            <TouchableOpacity
              style={styles.modeCard}
              onPress={() => handleSelectMode('born')}
              activeOpacity={0.8}
            >
              <View style={[styles.modeIcon, { backgroundColor: theme.accentSoft }]}>
                <Ionicons name="happy-outline" size={32} color={theme.accent} />
              </View>
              <Text style={styles.modeTitle}>{t('babySetup.modeBornTitle')}</Text>
              <Text style={styles.modeDescription}>
                {t('babySetup.modeBornDescription')}
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
              <Text style={styles.modeTitle}>{t('babySetup.modePregnantTitle')}</Text>
              <Text style={styles.modeDescription}>
                {t('babySetup.modePregnantDescription')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (step === 'theme') {
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
            <TouchableOpacity style={styles.backButton} onPress={() => setStep('details')}>
              <Ionicons name="arrow-back" size={22} color={theme.textSecondary} />
            </TouchableOpacity>

            <Text style={styles.title}>{t('babySetup.themeTitle')}</Text>
            <Text style={styles.subtitle}>{t('babySetup.themeSubtitle')}</Text>

            <View style={styles.paletteList}>
              {paletteOptions.map((option) => {
                const preview = lightPaletteColors[option.palette];
                const isSelected = selectedPalette === option.palette;

                return (
                  <TouchableOpacity
                    key={option.palette}
                    style={[
                      styles.paletteCard,
                      isSelected && styles.paletteCardSelected,
                    ]}
                    onPress={() => handleSelectPalette(option.palette)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.paletteCardLeft}>
                      <View style={[styles.paletteIconWrap, { backgroundColor: preview.accentSoft }]}>
                        <Ionicons
                          name={option.icon}
                          size={20}
                          color={isSelected ? theme.primary : theme.textSecondary}
                        />
                      </View>
                      <View style={styles.paletteTextContainer}>
                        <Text style={styles.paletteTitle} numberOfLines={2}>
                          {option.label}
                        </Text>
                        <Text style={styles.paletteSubtitle} numberOfLines={2}>
                          {option.description}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.paletteRight}>
                      <View style={styles.paletteSwatches}>
                        <View style={[styles.paletteSwatch, { backgroundColor: preview.primary }]} />
                        <View style={[styles.paletteSwatch, { backgroundColor: preview.accent }]} />
                        <View style={[styles.paletteSwatch, { backgroundColor: preview.milestone }]} />
                      </View>
                      <View style={styles.paletteCheckSlot}>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.finishButton, isSaving && styles.finishButtonDisabled]}
              onPress={handleFinish}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              <Text style={styles.finishButtonText}>
                {isSaving ? t('babySetup.settingUp') : t('babySetup.getStarted')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
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
            {mode === 'born'
              ? (isAddingNew ? "Baby's details" : t('babySetup.detailsBornTitle'))
              : (isAddingNew ? "Pregnancy details" : t('babySetup.detailsPregnantTitle'))}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'born'
              ? (isAddingNew ? "Enter a name and birth date for this baby." : t('babySetup.detailsBornSubtitle'))
              : (isAddingNew ? "Enter the estimated due date for this pregnancy." : t('babySetup.detailsPregnantSubtitle'))}
          </Text>

          <View style={styles.formSection}>
            <Text style={styles.label}>{t('babySetup.nameLabel')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={
                mode === 'born'
                  ? t('babySetup.namePlaceholderBorn')
                  : t('babySetup.namePlaceholderPregnant')
              }
              placeholderTextColor={theme.textMuted}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>
              {mode === 'born'
                ? t('babySetup.dateOfBirthLabel')
                : t('babySetup.estimatedDueDateLabel')}
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
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={mode === 'born' ? new Date() : undefined}
                  minimumDate={mode === 'pregnant' ? new Date() : undefined}
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.finishButton, isSaving && styles.finishButtonDisabled]}
            onPress={handleContinueFromDetails}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            <Text style={styles.finishButtonText}>
              {t('babySetup.continue')}
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
    paletteList: {
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    paletteCard: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.borderLight,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    paletteCardSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.backgroundSecondary,
    },
    paletteCardLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      flex: 1,
      minWidth: 0,
    },
    paletteTextContainer: {
      flex: 1,
      minWidth: 0,
    },
    paletteIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    paletteTitle: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.text,
    },
    paletteSubtitle: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: 2,
      lineHeight: 18,
    },
    paletteRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flexShrink: 0,
      marginLeft: spacing.sm,
    },
    paletteSwatches: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    paletteSwatch: {
      width: 10,
      height: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    paletteCheckSlot: {
      width: 22,
      height: 22,
      alignItems: 'center',
      justifyContent: 'center',
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
    datePickerContainer: {
      alignItems: 'center',
      width: '100%',
      marginHorizontal: -spacing.xl,
      paddingHorizontal: spacing.md,
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
