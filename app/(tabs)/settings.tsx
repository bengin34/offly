import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Pressable,
  ActivityIndicator,
  Linking,
  Share,
  Platform,
  Keyboard,
  Switch,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter, useFocusEffect } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { spacing, fontSize, borderRadius, fonts, lightPaletteColors, paletteMetadata } from '../../src/constants';
import { Background } from '../../src/components/Background';
import { DialogHeader } from '../../src/components/DialogHeader';
import { ProUpgradeBanner } from '../../src/components/ProUpgradeBanner';
import { useI18n, useTheme, useThemeMode, useSubscription } from '../../src/hooks';
import { getLocaleLabel, Locale, supportedLocales } from '../../src/localization';
import { type ThemeMode } from '../../src/stores';
import { useOnboardingStore } from '../../src/stores/onboardingStore';
import { pickAndImport } from '../../src/utils/import';
import { exportToZip } from '../../src/utils/export';
import { autoGenerateTimeline } from '../../src/utils/autoGenerate';
import { rebaseBornTimelineDates } from '../../src/utils/rebaseBornTimeline';
import { BabyProfileRepository, VaultRepository, ChapterRepository, MemoryRepository, MilestoneRepository } from '../../src/db/repositories';
import { useBackupStore } from '../../src/stores/backupStore';
import { useProfileStore } from '../../src/stores/profileStore';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { APP_LIMITS } from '../../src/constants/limits';
import type { BabyProfile } from '../../src/types';
import type { ThemePalette } from '../../src/constants/colors';
import { BORN_CHAPTER_TEMPLATES } from '../../src/constants/chapterTemplates';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { mode, setMode, palette, setPalette } = useThemeMode();
  const { t, locale, setLocale } = useI18n();
  const { isPro, presentPaywall } = useSubscription();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPaletteModal, setShowPaletteModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showModeSwitchModal, setShowModeSwitchModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [backupProgress, setBackupProgress] = useState<number | null>(null);
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);
  const lastBackupDate = useBackupStore((state) => state.lastBackupDate);
  const loadBackupState = useBackupStore((state) => state.loadBackupState);
  const setLastBackupDate = useBackupStore((state) => state.setLastBackupDate);

  // Load backup state on mount
  useFocusEffect(
    useCallback(() => {
      loadBackupState();
    }, [loadBackupState])
  );

  const handleBackupExport = async () => {
    if (!isPro) {
      await presentPaywall();
      return;
    }
    try {
      setBackupProgress(0);
      await exportToZip((progress) => setBackupProgress(progress));
      await setLastBackupDate(new Date().toISOString());
    } catch (error) {
      console.error('Backup export failed:', error);
      Alert.alert(t('alerts.exportFailedTitle'), t('settings.alertBackupExportFailedMessage'));
    } finally {
      setBackupProgress(null);
    }
  };

  // Baby profile state
  const [profile, setProfile] = useState<BabyProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<BabyProfile[]>([]);
  const [birthDate, setBirthDate] = useState(new Date());
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [isSwitchingMode, setIsSwitchingMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState(new Date());
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const toLocalDateKey = (value?: string | Date | null): string => {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Persist selected calendar day at local noon to prevent timezone day-shift issues.
  const toPersistedDateIso = (value: Date): string =>
    new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
      12,
      0,
      0,
      0
    ).toISOString();

  const { loadActiveProfile } = useProfileStore();
  const { multiProfileEnabled, setMultiProfileEnabled } = useSettingsStore();

  const loadProfile = useCallback(async () => {
    await loadActiveProfile();
    const p = useProfileStore.getState().activeBaby ?? await BabyProfileRepository.getDefault();
    setProfile(p);
    const all = await BabyProfileRepository.getAll();
    setAllProfiles(all);
  }, [loadActiveProfile]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleModeSwitchToBorn = () => {
    if (!profile || profile.mode !== 'pregnant') return;
    setShowModeSwitchModal(true);
  };

  const handleOpenEditProfile = () => {
    if (!profile) return;
    setEditName(profile.name || '');
    const refDate = profile.mode === 'born' ? profile.birthdate : profile.edd;
    setEditDate(refDate ? new Date(refDate) : new Date());
    setShowEditDatePicker(Platform.OS === 'ios');
    setShowEditProfileModal(true);
  };

  const handleBirthDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowBirthDatePicker(false);
    }
    if (!selectedDate) return;
    setBirthDate(selectedDate);
  };

  const handleEditDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEditDatePicker(false);
    }
    if (!selectedDate) return;
    setEditDate(selectedDate);
  };

  const handleSaveProfileEdits = async () => {
    if (!profile) return;
    setIsSavingProfile(true);
    try {
      const trimmedName = editName.trim();
      const nextDateIso = toPersistedDateIso(editDate);
      const existingDateIso = profile.mode === 'born' ? profile.birthdate : profile.edd;
      const existingDateKey = toLocalDateKey(existingDateIso);
      const nextDateKey = toLocalDateKey(editDate);
      const dateChanged = existingDateKey !== nextDateKey;

      if (profile.mode === 'born') {
        await BabyProfileRepository.update({
          id: profile.id,
          name: trimmedName || undefined,
          birthdate: nextDateIso,
        });
        if (dateChanged) {
          await rebaseBornTimelineDates(profile.id, nextDateIso, profile.birthdate);
        }
      } else {
        await BabyProfileRepository.update({
          id: profile.id,
          name: trimmedName || undefined,
          edd: nextDateIso,
        });
      }

      await VaultRepository.recalculateUnlockDates(profile.id, nextDateIso);
      await loadProfile();
      setShowEditProfileModal(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert(t('alerts.errorTitle'), t('settings.alertProfileUpdateFailedMessage'));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePickAvatar = async () => {
    if (!profile) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    const sourceUri = result.assets[0].uri;
    const dir = (FileSystem.documentDirectory ?? '') + 'avatars/';
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const destUri = dir + profile.id + '.jpg';
    await FileSystem.copyAsync({ from: sourceUri, to: destUri });
    await BabyProfileRepository.update({ id: profile.id, avatar: destUri });
    await loadProfile();
    await loadActiveProfile();
  };

  // Mode switch preview state
  const [modeSwitchStep, setModeSwitchStep] = useState<1 | 2>(1);
  const [switchPreview, setSwitchPreview] = useState<{
    pregnancyChapterCount: number;
    pregnancyMemoryCount: number;
    pregnancyMilestoneCount: number;
    journalEntryCount: number;
  } | null>(null);

  const computeSwitchPreview = async () => {
    if (!profile) return;
    const chapters = await ChapterRepository.getAll(profile.id);
    const pregnancyChapters = chapters.filter(
      (ch) => ch.title.startsWith('Week ') || ch.title.includes('Trimester')
    );
    let memoryCount = 0;
    for (const ch of pregnancyChapters) {
      const count = await MemoryRepository.count(ch.id);
      memoryCount += count;
    }
    const milestoneCount = await MilestoneRepository.countByPregnancyChapters(profile.id);
    const journalCount = await MemoryRepository.countPregnancyJournal(profile.id);
    setSwitchPreview({
      pregnancyChapterCount: pregnancyChapters.length,
      pregnancyMemoryCount: memoryCount,
      pregnancyMilestoneCount: milestoneCount,
      journalEntryCount: journalCount,
    });
    setModeSwitchStep(2);
  };

  const confirmModeSwitchToBorn = async () => {
    if (!profile) return;
    setIsSwitchingMode(true);
    try {
      const dobStr = toPersistedDateIso(birthDate);

      // 0. Save undo state before any changes
      await BabyProfileRepository.saveModeSwitchState(profile.id);

      // 1. Update profile: mode → born, set birthdate
      await BabyProfileRepository.update({
        id: profile.id,
        mode: 'born',
        birthdate: dobStr,
      });
      await BabyProfileRepository.setShowArchivedChapters(profile.id, true);

      // 2. Create a "Before you were born" chapter and move pregnancy journal entries
      const pregnancyCount = await MemoryRepository.countPregnancyJournal(profile.id);
      if (pregnancyCount > 0) {
        const chapter = await ChapterRepository.create({
          babyId: profile.id,
          title: t('settings.beforeBirthChapterTitle'),
          startDate: profile.edd || dobStr,
          description: t('settings.beforeBirthChapterDescription'),
        });
        await MemoryRepository.movePregnancyJournalToChapter(chapter.id, profile.id);
        await BabyProfileRepository.setBeforeBirthChapterId(profile.id, chapter.id);
      }

      // 3. Archive pregnancy chapters and milestones (not delete)
      await ChapterRepository.archivePregnancyChapters(profile.id);
      await MilestoneRepository.archiveByPregnancyChapters(profile.id);

      // 4. Ensure born timeline exists for users switching from pregnancy mode.
      const existingChapters = await ChapterRepository.getAll(profile.id);
      const chapterTitles = new Set(existingChapters.map((ch) => ch.title));
      const hasAnyBornTemplateChapter = BORN_CHAPTER_TEMPLATES.some((template) =>
        chapterTitles.has(template.title)
      );
      if (!hasAnyBornTemplateChapter) {
        await autoGenerateTimeline({
          ...profile,
          mode: 'born',
          birthdate: dobStr,
          edd: undefined,
        });
      }

      // 5. Recalculate vault unlock dates using DOB
      await VaultRepository.recalculateUnlockDates(profile.id, dobStr);

      setShowModeSwitchModal(false);
      setModeSwitchStep(1);
      setSwitchPreview(null);
      await loadProfile();

      Alert.alert(
        t('settings.alertModeUpdatedTitle'),
        t('settings.alertModeUpdatedMessage', { chapter: t('settings.beforeBirthChapterTitle') })
      );
    } catch (error) {
      console.error('Failed to switch mode:', error);
      Alert.alert(t('alerts.errorTitle'), t('settings.alertModeSwitchFailedMessage'));
    } finally {
      setIsSwitchingMode(false);
    }
  };

  const handleUndoModeSwitch = () => {
    if (!profile || !profile.modeSwitchedAt) return;
    Alert.alert(
      t('settings.undoModeSwitchTitle'),
      t('settings.undoModeSwitchAlert'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.undoModeSwitchConfirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSwitchingMode(true);
              await BabyProfileRepository.undoModeSwitchToPregnant(profile.id);
              await loadProfile();
              Alert.alert(
                t('settings.alertModeUpdatedTitle'),
                t('settings.undoModeSwitchSuccess')
              );
            } catch (error) {
              console.error('Failed to undo mode switch:', error);
              Alert.alert(t('alerts.errorTitle'), t('settings.alertModeSwitchFailedMessage'));
            } finally {
              setIsSwitchingMode(false);
            }
          },
        },
      ]
    );
  };

  const handleToggleShowArchivedChapters = async (show: boolean) => {
    if (!profile) return;
    try {
      await BabyProfileRepository.setShowArchivedChapters(profile.id, show);
      await loadProfile();
    } catch (error) {
      console.error('Failed to update archived chapters visibility:', error);
      Alert.alert(t('alerts.errorTitle'), 'Failed to update settings');
    }
  };

  const { setActiveBaby } = useProfileStore();

  const handleSwitchProfile = async (profileId: string) => {
    if (profileId === profile?.id) return;
    await setActiveBaby(profileId);
    await loadProfile();
  };

  const handleAddNewProfile = async () => {
    if (!isPro && allProfiles.length >= APP_LIMITS.FREE_MAX_PROFILES) {
      await presentPaywall();
      return;
    }
    router.push('/baby-setup?addNew=true');
  };

  const handleDeleteProfile = (profileToDelete: BabyProfile) => {
    if (allProfiles.length <= 1) {
      Alert.alert(t('alerts.errorTitle'), t('profiles.cannotDeleteLast'));
      return;
    }

    Alert.alert(
      t('profiles.deleteTitle'),
      t('profiles.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profiles.deleteConfirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await BabyProfileRepository.delete(profileToDelete.id);
              // If deleting the active profile, switch to another
              if (profileToDelete.id === profile?.id) {
                const remaining = allProfiles.filter((p) => p.id !== profileToDelete.id);
                if (remaining.length > 0) {
                  await setActiveBaby(remaining[0].id);
                }
              }
              await loadProfile();
            } catch (error) {
              console.error('Failed to delete profile:', error);
              Alert.alert(t('alerts.errorTitle'), t('alerts.deleteProfileFailed'));
            }
          },
        },
      ]
    );
  };

  const themeOptions: { mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { mode: 'light', label: t('settings.themeLight'), icon: 'sunny' },
    { mode: 'dark', label: t('settings.themeDark'), icon: 'moon' },
  ];

  const currentThemeLabel =
    themeOptions.find((o) => o.mode === mode)?.label || themeOptions[0]?.label;

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

  const currentPaletteLabel =
    paletteOptions.find((option) => option.palette === palette)?.label ??
    paletteOptions[0]?.label ??
    paletteMetadata.blush.label;

  const languageOptions: { locale: Locale; label: string }[] = supportedLocales.map((language) => ({
    locale: language,
    label: getLocaleLabel(language),
  }));

  const currentLanguageLabel = getLocaleLabel(locale);

  const handleSelectTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    setShowThemeModal(false);
  };

  const handleSelectPalette = (newPalette: ThemePalette) => {
    setPalette(newPalette);
    setShowPaletteModal(false);
  };

  const handleSelectLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    setShowLanguageModal(false);
  };

  const handleConfirmOnboarding = async () => {
    await resetOnboarding();
    router.replace('/onboarding');
  };

  const handleShowOnboarding = () => {
    Alert.alert(
      t('settings.onboardingResetTitle'),
      t('settings.onboardingResetMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.onboardingResetAction'),
          onPress: () => {
            void handleConfirmOnboarding();
          },
        },
      ]
    );
  };

  const handleImport = async () => {
    if (!isPro) {
      await presentPaywall();
      return;
    }
    Alert.alert(
      t('settings.importTitle'),
      `${t('settings.importDescription')}\n\n${t('settings.exportPhotosNote')}`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.importButton'),
          onPress: async () => {
            setIsImporting(true);
            try {
              const result = await pickAndImport({ duplicateHandling: 'skip' });
              if (!result) {
                // User cancelled
                return;
              }

              const summary = `${t('tabs.chapters')}: ${result.chaptersImported}\n${t('common.memories')}: ${result.memoriesImported}\n${t('entryForm.tagsLabel')}: ${result.tagsImported}`;
              if (result.success) {
                Alert.alert(t('alerts.importComplete'), summary);
              } else {
                const errorDetails = result.errors.length
                  ? `\n\n${result.errors.slice(0, 3).join('\n')}${
                      result.errors.length > 3 ? `\n...${result.errors.length - 3}` : ''
                    }`
                  : '';
                Alert.alert(t('alerts.importCompletedWithErrors'), `${summary}${errorDetails}`);
              }
            } catch (error) {
              console.error('Import failed:', error);
              Alert.alert(
                t('alerts.importFailed')
              );
            } finally {
              setIsImporting(false);
            }
          },
        },
      ]
    );
  };

  const APP_STORE_ID = '6758960256';
  const APP_STORE_URL = `https://apps.apple.com/app/id${APP_STORE_ID}`;
  const APP_STORE_REVIEW_URL = `${APP_STORE_URL}?action=write-review`;
  const SUPPORT_EMAIL = 'support@qrodesk.com';
  const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

  const handleRateApp = async () => {
    try {
      await Linking.openURL(APP_STORE_REVIEW_URL);
    } catch (error) {
      console.error('Failed to open review link:', error);
      Alert.alert(t('alerts.errorTitle'));
    }
  };

  const handleShareApp = async () => {
    try {
      const message = t('settings.supportShareMessage', { link: APP_STORE_URL });
      await Share.share({ message });
    } catch (error) {
      console.error('Failed to share app:', error);
      Alert.alert(t('alerts.errorTitle'));
    }
  };

  const handleContactSupport = async () => {
    try {
      const subject = `Offly Support (v${APP_VERSION})`;
      const body = `App Version: ${APP_VERSION}\n`;
      const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      await Linking.openURL(mailtoUrl);
    } catch (error) {
      console.error('Failed to open mail client:', error);
      Alert.alert(t('alerts.errorTitle'));
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Background />
      <ScrollView>
        <ProUpgradeBanner style={styles.proBanner} />

        {/* Profile Switcher Section */}
        {allProfiles.length > 1 && profile?.mode !== 'pregnant' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('profiles.multipleProfiles').toLocaleUpperCase(locale)}
            </Text>
            <View style={styles.card}>
              {allProfiles.map((p) => {
                const isActive = p.id === profile?.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.settingsRow, { paddingVertical: spacing.sm + 2 }]}
                    onPress={() => handleSwitchProfile(p.id)}
                    onLongPress={() => handleDeleteProfile(p)}
                  >
                    <View style={styles.settingsRowLeft}>
                      <View style={[styles.profileListIcon, { backgroundColor: p.mode === 'pregnant' ? theme.primary + '15' : theme.accent + '15' }]}>
                        <Ionicons
                          name={p.mode === 'pregnant' ? 'heart' : 'happy'}
                          size={18}
                          color={p.mode === 'pregnant' ? theme.primary : theme.accent}
                        />
                      </View>
                      <View>
                        <Text style={[styles.settingsRowLabel, isActive && { color: theme.primary, fontFamily: fonts.ui }]}>
                          {p.name || t('profiles.defaultName')}
                        </Text>
                        <Text style={styles.profileListMeta}>
                          {p.mode === 'pregnant' ? t('settings.modeExpecting') : t('settings.modeBorn')}
                        </Text>
                      </View>
                    </View>
                    {isActive && (
                      <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
              <View style={styles.settingsDivider} />
              <TouchableOpacity
                style={[styles.settingsRow, { paddingVertical: spacing.sm + 2 }]}
                onPress={handleAddNewProfile}
              >
                <View style={styles.settingsRowLeft}>
                  <View style={[styles.profileListIcon, { backgroundColor: theme.backgroundSecondary }]}>
                    <Ionicons name="add" size={20} color={theme.primary} />
                  </View>
                  <Text style={[styles.settingsRowLabel, { color: theme.primary }]}>{t('profiles.addNew')}</Text>
                </View>
                {!isPro && allProfiles.length >= APP_LIMITS.FREE_MAX_PROFILES && (
                  <Ionicons name="lock-closed" size={14} color={theme.textMuted} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Baby Profile Section */}
        {profile && (
          <View style={styles.babyProfileSection}>
            <View style={[styles.babyProfileCard, { backgroundColor: profile.mode === 'pregnant' ? theme.primary + '08' : theme.success + '08', borderColor: profile.mode === 'pregnant' ? theme.primary + '25' : theme.success + '25' }]}>
              {/* Header with Avatar + Name + Edit */}
              <View style={styles.babyProfileHeader}>
                <TouchableOpacity style={styles.babyAvatarWrap} onPress={handlePickAvatar} activeOpacity={0.8}>
                  {profile.avatar ? (
                    <Image source={{ uri: profile.avatar }} style={styles.babyAvatarImage} />
                  ) : (
                    <View style={[styles.babyAvatarPlaceholder, { backgroundColor: theme.primary + '20' }]}>
                      {profile.name ? (
                        <Text style={[styles.babyAvatarInitial, { color: theme.primary }]}>
                          {profile.name.charAt(0).toUpperCase()}
                        </Text>
                      ) : (
                        <Ionicons name="camera-outline" size={22} color={theme.primary} />
                      )}
                    </View>
                  )}
                  <View style={[styles.babyAvatarEditBadge, { backgroundColor: theme.accent }]}>
                    <Ionicons name="camera" size={10} color={theme.white} />
                  </View>
                </TouchableOpacity>
                <View style={styles.babyProfileHeaderText}>
                  <Text style={styles.babyProfileNameLarge}>{profile.name || t('settings.yourBaby')}</Text>
                  {profile.mode === 'pregnant' && (
                    <View style={[
                      styles.modeBadge,
                      { backgroundColor: theme.primary + '22' }
                    ]}>
                      <Text style={[
                        styles.modeBadgeText,
                        { color: theme.primary }
                      ]}>
                        {t('settings.modeExpecting')}
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.babyEditButton, { backgroundColor: theme.accent + '18' }]}
                  onPress={handleOpenEditProfile}
                >
                  <Ionicons name="pencil" size={16} color={theme.accent} />
                  <Text style={[styles.babyEditButtonText, { color: theme.accent }]}>{t('settings.editAction')}</Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={[styles.babyDivider, { backgroundColor: theme.border }]} />

              {/* Date + Age Info */}
              {profile.mode === 'pregnant' && profile.edd && (
                <View style={styles.babyDateSection}>
                  <View style={styles.babyDateItem}>
                    <View style={[styles.babyDateIcon, { backgroundColor: theme.primary + '15' }]}>
                      <Ionicons name="time-outline" size={18} color={theme.primary} />
                    </View>
                    <View>
                      <Text style={styles.babyDateLabel}>{t('settings.dueDate')}</Text>
                      <Text style={styles.babyDateValue}>
                        {new Date(profile.edd).toLocaleDateString(locale, {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {profile.mode === 'born' && profile.birthdate && (
                <View style={styles.babyDateSection}>
                  <View style={styles.babyDateRowContainer}>
                    <View style={styles.babyDateItem}>
                      <View style={[styles.babyDateIcon, { backgroundColor: theme.accent + '15' }]}>
                        <Ionicons name="calendar-outline" size={18} color={theme.accent} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.babyDateLabel}>{t('settings.birthDateLabel')}</Text>
                        <Text style={styles.babyDateValue}>
                          {new Date(profile.birthdate).toLocaleDateString(locale, {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.babyDateItem, { marginLeft: spacing.md }]}>
                      <View style={[styles.babyDateIcon, { backgroundColor: theme.milestone + '15' }]}>
                        <Ionicons name="sparkles-outline" size={18} color={theme.milestone} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.babyDateLabel}>{t('settings.age')}</Text>
                        <Text style={styles.babyDateValue}>
                          {t('settings.daysCount', {
                            count: Math.floor(
                              (Date.now() - new Date(profile.birthdate).getTime()) / (1000 * 60 * 60 * 24)
                            ),
                          })}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Action Button */}
              {profile.mode === 'pregnant' && (
                <>
                  <View style={[styles.babyDivider, { backgroundColor: theme.border, marginVertical: spacing.md }]} />
                  <TouchableOpacity
                    style={[styles.babyBornButton, { backgroundColor: theme.success }]}
                    onPress={handleModeSwitchToBorn}
                  >
                    <Ionicons name="happy-outline" size={18} color={theme.white} />
                    <Text style={styles.babyBornButtonText}>{t('settings.babyBornButton')}</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Undo mode switch */}
              {profile.mode === 'born' && profile.modeSwitchedAt && (
                <>
                  <View style={[styles.babyDivider, { backgroundColor: theme.border, marginVertical: spacing.md }]} />
                  <TouchableOpacity
                    style={[styles.undoModeButton, { borderColor: theme.border }]}
                    onPress={handleUndoModeSwitch}
                    disabled={isSwitchingMode}
                  >
                    <Ionicons name="refresh-outline" size={18} color={theme.textSecondary} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.undoModeButtonText, { color: theme.text }]}>
                        {t('settings.undoModeSwitchTitle')}
                      </Text>
                      <Text style={[styles.undoModeButtonSubtext, { color: theme.textMuted }]}>
                        {t('settings.undoModeSwitchDescription', {
                          date: new Date(profile.modeSwitchedAt).toLocaleDateString(locale, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }),
                        })}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}

              {/* Show/Hide pregnancy memories toggle */}
              {profile.mode === 'born' && (
                <>
                  <View style={[styles.babyDivider, { backgroundColor: theme.border, marginVertical: spacing.md }]} />
                  <View style={[styles.settingsRow, styles.settingsRowMultiline]}>
                    <View style={[styles.settingsRowLeft, styles.settingsRowLeftMultiline]}>
                      <Ionicons name="archive-outline" size={22} color={theme.textSecondary} />
                      <View style={styles.settingsRowTextContainer}>
                        <Text style={[styles.settingsRowLabel, { color: theme.text }]}>
                          {t('settings.showPregnancyChaptersTitle')}
                        </Text>
                        <Text style={[styles.settingsRowDescription, { color: theme.textMuted }]}>
                          {t('settings.showPregnancyChaptersDescription')}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.settingsRowRight, styles.settingsRowRightFixed]}>
                      <Switch
                        value={profile.showArchivedChapters}
                        onValueChange={handleToggleShowArchivedChapters}
                        disabled={isSwitchingMode}
                        trackColor={{ false: theme.border, true: theme.primary }}
                        thumbColor={profile.showArchivedChapters ? '#fff' : theme.textMuted}
                      />
                    </View>
                  </View>
                </>
              )}

              <View style={[styles.babyDivider, { backgroundColor: theme.border, marginVertical: spacing.md }]} />
              <View style={[styles.settingsRow, styles.settingsRowMultiline]}>
                <View style={[styles.settingsRowLeft, styles.settingsRowLeftMultiline]}>
                  <Ionicons name="people-outline" size={22} color={theme.textSecondary} />
                  <View style={styles.settingsRowTextContainer}>
                    <Text style={styles.settingsRowLabel}>{t('profiles.multipleProfiles')}</Text>
                    <Text style={[styles.settingsRowDescription, { color: theme.textMuted }]}>
                      {t('settings.showProfileSwitcherOnHome')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.settingsRowRight, styles.settingsRowRightFixed]}>
                  <Switch
                    value={multiProfileEnabled}
                    onValueChange={setMultiProfileEnabled}
                    trackColor={{ false: theme.border, true: theme.primary }}
                    thumbColor={multiProfileEnabled ? '#fff' : theme.textMuted}
                  />
                </View>
              </View>
            </View>

            {/* Add new baby button (shown when multiple profiles enabled or already >1) */}
            {(multiProfileEnabled || allProfiles.length > 1) && (
              <TouchableOpacity
                style={[styles.settingsRow, { marginTop: spacing.md }]}
                onPress={handleAddNewProfile}
              >
                <View style={styles.settingsRowLeft}>
                  <Ionicons name="add-circle-outline" size={22} color={theme.primary} />
                  <Text style={[styles.settingsRowLabel, { color: theme.primary }]}>{t('profiles.addNew')}</Text>
                </View>
                {!isPro && allProfiles.length >= APP_LIMITS.FREE_MAX_PROFILES && (
                  <Ionicons name="lock-closed" size={14} color={theme.textMuted} />
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.preferences').toLocaleUpperCase(locale)}
          </Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingsRow}
              onPress={() => setShowThemeModal(true)}
            >
              <View style={styles.settingsRowLeft}>
                <Ionicons name="color-palette-outline" size={22} color={theme.textSecondary} />
                <Text style={styles.settingsRowLabel} numberOfLines={1}>
                  {t('settings.appearance')}
                </Text>
              </View>
              <View style={styles.settingsRowRightValue}>
                <Text style={styles.settingsRowValue} numberOfLines={1} ellipsizeMode="tail">
                  {currentThemeLabel}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </View>
            </TouchableOpacity>
            <View style={styles.settingsDivider} />
            <TouchableOpacity
              style={styles.settingsRow}
              onPress={() => setShowPaletteModal(true)}
            >
              <View style={styles.settingsRowLeft}>
                <Ionicons name="color-wand-outline" size={22} color={theme.textSecondary} />
                <Text style={styles.settingsRowLabel} numberOfLines={1}>
                  {t('settings.colorTheme')}
                </Text>
              </View>
              <View style={styles.settingsRowRightValue}>
                <Text style={styles.settingsRowValue} numberOfLines={1} ellipsizeMode="tail">
                  {currentPaletteLabel}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </View>
            </TouchableOpacity>
            <View style={styles.settingsDivider} />
            <TouchableOpacity
              style={styles.settingsRow}
              onPress={() => setShowLanguageModal(true)}
            >
              <View style={styles.settingsRowLeft}>
                <Ionicons name="language-outline" size={22} color={theme.textSecondary} />
                <Text style={styles.settingsRowLabel} numberOfLines={1}>
                  {t('settings.language')}
                </Text>
              </View>
              <View style={styles.settingsRowRightValue}>
                <Text style={styles.settingsRowValue} numberOfLines={1} ellipsizeMode="tail">
                  {currentLanguageLabel}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.supportSection').toLocaleUpperCase(locale)}
          </Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingsRow}
              onPress={handleRateApp}
              accessibilityRole="button"
              accessibilityLabel={t('settings.supportRate')}
            >
              <View style={styles.settingsRowLeft}>
                <Ionicons name="star-outline" size={22} color={theme.textSecondary} />
                <Text style={styles.settingsRowLabel}>{t('settings.supportRate')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </TouchableOpacity>
            <View style={styles.settingsDivider} />
            <TouchableOpacity
              style={styles.settingsRow}
              onPress={handleShareApp}
              accessibilityRole="button"
              accessibilityLabel={t('settings.supportShare')}
            >
              <View style={styles.settingsRowLeft}>
                <Ionicons name="share-social-outline" size={22} color={theme.textSecondary} />
                <Text style={styles.settingsRowLabel}>{t('settings.supportShare')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </TouchableOpacity>
            <View style={styles.settingsDivider} />
            <TouchableOpacity
              style={styles.settingsRow}
              onPress={handleContactSupport}
              accessibilityRole="button"
              accessibilityLabel={t('settings.supportContact')}
            >
              <View style={styles.settingsRowLeft}>
                <Ionicons name="mail-outline" size={22} color={theme.textSecondary} />
                <Text style={styles.settingsRowLabel}>{t('settings.supportContact')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.onboardingSection').toLocaleUpperCase(locale)}
          </Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="sparkles-outline" size={24} color={theme.primary} />
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{t('settings.onboardingTitle')}</Text>
                <Text style={styles.cardDescription}>
                  {t('settings.onboardingDescription')}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.onboardingButton}
              onPress={handleShowOnboarding}
              accessibilityRole="button"
              accessibilityLabel={t('settings.onboardingButton')}
            >
              <Ionicons name="play-outline" size={20} color={theme.white} />
              <Text style={styles.onboardingButtonText}>
                {t('settings.onboardingButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.aboutSection').toLocaleUpperCase(locale)}
          </Text>
          <View style={styles.card}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>{t('settings.version')}</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>{t('settings.storage')}</Text>
              <Text style={styles.aboutValue}>{t('settings.storageValue')}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>{t('settings.privacy')}</Text>
              <Text style={styles.aboutValue}>{t('settings.privacyValue')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.backupDataSection').toLocaleUpperCase(locale)}</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="shield-checkmark-outline" size={24} color={theme.primary} />
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{t('settings.backupMemoriesTitle')}</Text>
                <Text style={styles.cardDescription}>
                  {t('settings.backupMemoriesDescription')}
                </Text>
              </View>
            </View>
            {lastBackupDate && (
              <View style={styles.lastBackupRow}>
                <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                <Text style={[styles.lastBackupText, { color: theme.success }]}>
                  {t('settings.lastBackup', {
                    date: new Date(lastBackupDate).toLocaleDateString(locale, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                  })}
                </Text>
              </View>
            )}
            {!lastBackupDate && (
              <View style={styles.lastBackupRow}>
                <Ionicons name="warning-outline" size={16} color={theme.warning} />
                <Text style={[styles.lastBackupText, { color: theme.warning }]}>
                  {t('settings.noBackupYet')}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={[
                styles.onboardingButton,
                backupProgress !== null && { opacity: 0.6 },
                !isPro && { backgroundColor: theme.textMuted },
              ]}
              onPress={handleBackupExport}
              disabled={backupProgress !== null}
            >
              {backupProgress !== null ? (
                <>
                  <ActivityIndicator color={theme.white} size="small" />
                  <Text style={styles.onboardingButtonText}>
                    {Math.round(backupProgress * 100)}%
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="download-outline" size={20} color={theme.white} />
                  <Text style={styles.onboardingButtonText}>{t('settings.createBackup')}</Text>
                  {!isPro && <Ionicons name="lock-closed" size={16} color={theme.white} style={{ marginLeft: 4 }} />}
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportLink}
              onPress={() => {
                if (!isPro) {
                  void presentPaywall();
                  return;
                }
                setShowDataModal(true);
              }}
              accessibilityRole="button"
              accessibilityLabel={t('settings.dataButton')}
            >
              <Text style={styles.exportLinkText}>{t('settings.moreExportImportOptions')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {!isPro && <Ionicons name="lock-closed" size={14} color={theme.textMuted} />}
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('limitations.title').toLocaleUpperCase(locale)}
          </Text>
          <View style={styles.card}>
            <View style={styles.limitationRow}>
              <Ionicons name="image-outline" size={18} color={theme.textMuted} />
              <Text style={styles.limitationText}>{t('limitations.photosNotBundled')}</Text>
            </View>
            <View style={styles.limitationRow}>
              <Ionicons name="cloud-offline-outline" size={18} color={theme.textMuted} />
              <Text style={styles.limitationText}>{t('limitations.noCloudSync')}</Text>
            </View>
            <View style={styles.limitationRow}>
              <Ionicons name="text-outline" size={18} color={theme.textMuted} />
              <Text style={styles.limitationText}>{t('limitations.freeTextCities')}</Text>
            </View>
            <View style={styles.limitationRow}>
              <Ionicons name="save-outline" size={18} color={theme.textMuted} />
              <Text style={styles.limitationText}>{t('limitations.noAutoBackup')}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>
          {t('settings.footer')}
        </Text>
      </ScrollView>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowThemeModal(false)}>
          <View style={styles.modalContent}>
            <DialogHeader
              title={t('settings.chooseAppearance')}
              titleNumberOfLines={2}
              onClose={() => setShowThemeModal(false)}
              actionLabel={t('common.done')}
              onAction={() => setShowThemeModal(false)}
              palette={{
                text: theme.text,
                textSecondary: theme.textSecondary,
                textMuted: theme.textMuted,
                primary: theme.primary,
                border: theme.border,
              }}
              containerStyle={styles.modalHeader}
            />
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.mode}
                style={[
                  styles.modalOption,
                  mode === option.mode && styles.modalOptionActive,
                ]}
                onPress={() => handleSelectTheme(option.mode)}
              >
                <View style={styles.modalOptionLeft}>
                  <Ionicons
                    name={option.icon}
                    size={22}
                    color={mode === option.mode ? theme.primary : theme.textSecondary}
                  />
                  <Text
                    style={[
                      styles.modalOptionText,
                      mode === option.mode && styles.modalOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
                {mode === option.mode && (
                  <Ionicons name="checkmark" size={22} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Palette Selection Modal */}
      <Modal
        visible={showPaletteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaletteModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowPaletteModal(false)}>
          <View style={styles.modalContent}>
            <DialogHeader
              title={t('settings.chooseColorTheme')}
              titleNumberOfLines={2}
              onClose={() => setShowPaletteModal(false)}
              actionLabel={t('common.done')}
              onAction={() => setShowPaletteModal(false)}
              palette={{
                text: theme.text,
                textSecondary: theme.textSecondary,
                textMuted: theme.textMuted,
                primary: theme.primary,
                border: theme.border,
              }}
              containerStyle={styles.modalHeader}
            />
            {paletteOptions.map((option) => {
              const preview = lightPaletteColors[option.palette];
              const isActive = palette === option.palette;

              return (
                <TouchableOpacity
                  key={option.palette}
                  style={[
                    styles.modalOption,
                    styles.paletteModalOption,
                    isActive && styles.modalOptionActive,
                  ]}
                  onPress={() => handleSelectPalette(option.palette)}
                >
                  <View style={styles.paletteOptionLeft}>
                    <Ionicons
                      name={option.icon}
                      size={22}
                      color={isActive ? theme.primary : theme.textSecondary}
                    />
                    <View style={styles.paletteTextContainer}>
                      <Text
                        style={[
                          styles.modalOptionText,
                          isActive && styles.modalOptionTextActive,
                        ]}
                        numberOfLines={2}
                      >
                        {option.label}
                      </Text>
                      <Text style={styles.paletteDescription} numberOfLines={2}>
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.paletteOptionRight}>
                    <View style={styles.palettePreview}>
                      <View style={[styles.paletteDot, { backgroundColor: preview.primary }]} />
                      <View style={[styles.paletteDot, { backgroundColor: preview.accent }]} />
                      <View style={[styles.paletteDot, { backgroundColor: preview.milestone }]} />
                    </View>
                    <View style={styles.paletteCheckSlot}>
                      {isActive && (
                        <Ionicons name="checkmark" size={22} color={theme.primary} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.languageModalScreen}>
          <DialogHeader
            title={t('settings.chooseLanguage')}
            titleNumberOfLines={2}
            onClose={() => setShowLanguageModal(false)}
            actionLabel={t('common.done')}
            onAction={() => setShowLanguageModal(false)}
            palette={{
              text: theme.text,
              textSecondary: theme.textSecondary,
              textMuted: theme.textMuted,
              primary: theme.primary,
              border: theme.border,
            }}
            containerStyle={styles.languageModalHeader}
          />
          <ScrollView
            style={styles.languageModalList}
            contentContainerStyle={styles.languageModalListContent}
            showsVerticalScrollIndicator={false}
          >
            {languageOptions.map((option) => (
              <TouchableOpacity
                key={option.locale}
                style={[
                  styles.modalOption,
                  locale === option.locale && styles.modalOptionActive,
                ]}
                onPress={() => handleSelectLanguage(option.locale)}
              >
                <View style={styles.modalOptionLeft}>
                  <Ionicons
                    name="language-outline"
                    size={22}
                    color={locale === option.locale ? theme.primary : theme.textSecondary}
                  />
                  <Text
                    style={[
                      styles.modalOptionText,
                      locale === option.locale && styles.modalOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
                {locale === option.locale && (
                  <Ionicons name="checkmark" size={22} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Data Transfer Modal */}
      <Modal
        visible={showDataModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDataModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowDataModal(false)}>
          <View style={styles.modalContent}>
            <DialogHeader
              title={t('settings.dataTitle')}
              titleNumberOfLines={2}
              onClose={() => setShowDataModal(false)}
              actionLabel={t('common.close')}
              onAction={() => setShowDataModal(false)}
              palette={{
                text: theme.text,
                textSecondary: theme.textSecondary,
                textMuted: theme.textMuted,
                primary: theme.primary,
                border: theme.border,
              }}
              containerStyle={styles.modalHeader}
            />
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowDataModal(false);
                router.push('/export');
              }}
            >
              <View style={styles.modalOptionLeft}>
                <Ionicons name="download-outline" size={22} color={theme.textSecondary} />
                <Text style={styles.modalOptionText}>{t('settings.exportTitle')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalOption, isImporting && styles.modalOptionDisabled]}
              onPress={() => {
                setShowDataModal(false);
                void handleImport();
              }}
              disabled={isImporting}
            >
              <View style={styles.modalOptionLeft}>
                <Ionicons name="cloud-upload-outline" size={22} color={theme.textSecondary} />
                <Text style={styles.modalOptionText}>
                  {isImporting ? t('settings.importButtonImporting') : t('settings.importTitle')}
                </Text>
              </View>
              {isImporting ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Mode Switch Modal (Pregnant → Born) — 2-step */}
      <Modal
        visible={showModeSwitchModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isSwitchingMode) {
            setShowModeSwitchModal(false);
            setModeSwitchStep(1);
            setSwitchPreview(null);
          }
        }}
      >
        <Pressable
          style={[styles.modalOverlay, styles.modeSwitchModalOverlay]}
          onPress={() => {
            if (!isSwitchingMode) {
              setShowModeSwitchModal(false);
              setModeSwitchStep(1);
              setSwitchPreview(null);
            }
          }}
        >
          <Pressable
            style={[styles.modalContent, styles.modeSwitchModalContent]}
            onPress={(e) => e.stopPropagation()}
          >
            {modeSwitchStep === 1 ? (
              <>
                <DialogHeader
                  title={t('settings.modeSwitchTitle')}
                  onClose={() => { setShowModeSwitchModal(false); setModeSwitchStep(1); setSwitchPreview(null); }}
                  actionLabel={t('settings.modeSwitchNext')}
                  onAction={computeSwitchPreview}
                  palette={{
                    text: theme.text,
                    textSecondary: theme.textSecondary,
                    textMuted: theme.textMuted,
                    primary: theme.primary,
                    border: theme.border,
                  }}
                  containerStyle={styles.modalHeader}
                />
                <Text style={styles.modeSwitchDescription}>
                  {t('settings.modeSwitchDescription', { chapter: t('settings.beforeBirthChapterTitle') })}
                </Text>

                <TouchableOpacity
                  style={[styles.modeSwitchDateButton, { backgroundColor: theme.backgroundSecondary, borderColor: theme.borderLight }]}
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowBirthDatePicker(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
                  <Text style={[styles.modeSwitchDateText, { color: theme.text }]}>
                    {birthDate.toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </TouchableOpacity>

                {showBirthDatePicker && (
                  <View
                    style={[
                      styles.modeSwitchPickerContainer,
                      styles.modeSwitchPickerWideContainer,
                      { backgroundColor: theme.card, borderColor: theme.borderLight },
                    ]}
                  >
                    <DateTimePicker
                      value={birthDate}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleBirthDateChange}
                      themeVariant={theme.isDark ? 'dark' : 'light'}
                      maximumDate={new Date()}
                      style={{ height: 200, width: '80%' }}
                    />
                    {Platform.OS === 'ios' && (
                      <TouchableOpacity
                        style={[styles.modeSwitchPickerDone, { borderTopColor: theme.borderLight }]}
                        onPress={() => setShowBirthDatePicker(false)}
                      >
                        <Text style={{ color: theme.primary, fontFamily: fonts.ui, fontSize: fontSize.md }}>{t('common.done')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </>
            ) : (
              <>
                <DialogHeader
                  title={t('settings.modeSwitchReviewTitle')}
                  onClose={() => { setModeSwitchStep(1); }}
                  actionLabel={isSwitchingMode ? t('common.saving') : t('settings.modeSwitchConfirm')}
                  onAction={confirmModeSwitchToBorn}
                  palette={{
                    text: theme.text,
                    textSecondary: theme.textSecondary,
                    textMuted: theme.textMuted,
                    primary: theme.primary,
                    border: theme.border,
                  }}
                  containerStyle={styles.modalHeader}
                />
                {switchPreview && (
                  <View style={{ paddingHorizontal: spacing.md, gap: spacing.sm }}>
                    {switchPreview.pregnancyChapterCount > 0 && (
                      <View style={styles.reviewItem}>
                        <Ionicons name="archive-outline" size={18} color={theme.textSecondary} />
                        <Text style={[styles.reviewItemText, { color: theme.text }]}>
                          {t('settings.modeSwitchReviewChapters', { count: switchPreview.pregnancyChapterCount })}
                        </Text>
                      </View>
                    )}
                    {switchPreview.pregnancyMemoryCount > 0 && (
                      <View style={styles.reviewItem}>
                        <Ionicons name="heart-outline" size={18} color={theme.textSecondary} />
                        <Text style={[styles.reviewItemText, { color: theme.text }]}>
                          {t('settings.modeSwitchReviewMemories', { count: switchPreview.pregnancyMemoryCount })}
                        </Text>
                      </View>
                    )}
                    {switchPreview.pregnancyMilestoneCount > 0 && (
                      <View style={styles.reviewItem}>
                        <Ionicons name="flag-outline" size={18} color={theme.textSecondary} />
                        <Text style={[styles.reviewItemText, { color: theme.text }]}>
                          {t('settings.modeSwitchReviewMilestones', { count: switchPreview.pregnancyMilestoneCount })}
                        </Text>
                      </View>
                    )}
                    {switchPreview.journalEntryCount > 0 && (
                      <View style={styles.reviewItem}>
                        <Ionicons name="book-outline" size={18} color={theme.textSecondary} />
                        <Text style={[styles.reviewItemText, { color: theme.text }]}>
                          {t('settings.modeSwitchReviewJournal', { count: switchPreview.journalEntryCount, chapter: t('settings.beforeBirthChapterTitle') })}
                        </Text>
                      </View>
                    )}
                    <View style={[styles.reviewItem, { marginTop: spacing.sm }]}>
                      <Ionicons name="refresh-outline" size={18} color={theme.primary} />
                      <Text style={[styles.reviewItemText, { color: theme.primary }]}>
                        {t('settings.modeSwitchReviewUndo')}
                      </Text>
                    </View>
                  </View>
                )}

                {isSwitchingMode && (
                  <ActivityIndicator size="small" color={theme.primary} style={{ marginTop: spacing.md }} />
                )}
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Edit Baby Profile Modal */}
      <Modal
        visible={showEditProfileModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditProfileModal(false)}
      >
        <Pressable style={[styles.modalOverlay, styles.editProfileModalOverlay]} onPress={() => !isSavingProfile && setShowEditProfileModal(false)}>
          <Pressable style={[styles.modalContent, styles.editProfileModalContent]} onPress={(e) => e.stopPropagation()}>
            <DialogHeader
              title={t('settings.editBabyProfileTitle')}
              onClose={() => setShowEditProfileModal(false)}
              actionLabel={isSavingProfile ? t('common.saving') : t('common.save')}
              onAction={handleSaveProfileEdits}
              palette={{
                text: theme.text,
                textSecondary: theme.textSecondary,
                textMuted: theme.textMuted,
                primary: theme.primary,
                border: theme.border,
              }}
              containerStyle={styles.modalHeader}
            />

            <Text style={styles.label}>{t('settings.name').toLocaleUpperCase(locale)}</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder={t('settings.namePlaceholder')}
              placeholderTextColor={theme.textMuted}
            />

            <View style={{ height: spacing.md }} />

            <Text style={styles.label}>
              {(profile?.mode === 'born' ? t('settings.birthDateLabel') : t('settings.dueDate')).toLocaleUpperCase(locale)}
            </Text>
            <TouchableOpacity
              style={[styles.modeSwitchDateButton, { backgroundColor: theme.backgroundSecondary, borderColor: theme.borderLight }]}
              onPress={() => {
                Keyboard.dismiss();
                setShowEditDatePicker(true);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
              <Text style={[styles.modeSwitchDateText, { color: theme.text }]}>
                {editDate.toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>

            {showEditDatePicker && (
              <View style={[styles.modeSwitchPickerContainer, styles.editProfilePickerContainer, { backgroundColor: theme.card, borderColor: theme.borderLight }]}>
                <DateTimePicker
                  value={editDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleEditDateChange}
                  themeVariant={theme.isDark ? 'dark' : 'light'}
                  maximumDate={profile?.mode === 'born' ? new Date() : undefined}
                  style={{ height: 200, width: '100%' }}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={[styles.modeSwitchPickerDone, { borderTopColor: theme.borderLight }]}
                    onPress={() => setShowEditDatePicker(false)}
                  >
                    <Text style={{ color: theme.primary, fontFamily: fonts.ui, fontSize: fontSize.md }}>{t('common.done')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {isSavingProfile && (
              <ActivityIndicator size="small" color={theme.primary} style={{ marginTop: spacing.md }} />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    section: {
      padding: spacing.md,
      paddingBottom: 0,
    },
    proBanner: {
      marginHorizontal: spacing.md,
      marginTop: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 2,
    },
    settingsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingsRowMultiline: {
      alignItems: 'flex-start',
    },
    settingsRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
      minWidth: 0,
    },
    settingsRowLeftMultiline: {
      alignItems: 'flex-start',
    },
    settingsRowTextContainer: {
      flex: 1,
      minWidth: 0,
    },
    settingsRowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      flexShrink: 1,
      minWidth: 0,
      marginLeft: spacing.sm,
    },
    settingsRowRightValue: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: spacing.xs,
      flexShrink: 1,
      minWidth: 0,
      marginLeft: spacing.sm,
      maxWidth: '52%',
    },
    settingsRowRightFixed: {
      flexShrink: 0,
      marginLeft: spacing.sm,
    },
    settingsDivider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: spacing.sm,
    },
    settingsRowLabel: {
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.text,
      flexShrink: 1,
    },
    settingsRowValue: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.textSecondary,
      flexShrink: 1,
      textAlign: 'right',
    },
    settingsRowDescription: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textMuted,
      marginTop: spacing.xs,
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
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    cardHeaderText: {
      marginLeft: spacing.md,
      flex: 1,
    },
    cardTitle: {
      fontSize: fontSize.md,
      fontFamily: fonts.heading,
      color: theme.text,
    },
    cardDescription: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: 4,
    },
    exportLink: {
      marginTop: spacing.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: theme.backgroundSecondary,
      borderWidth: 1,
      borderColor: theme.borderLight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    exportLinkText: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.text,
    },
    onboardingButton: {
      backgroundColor: theme.primary,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 3,
    },
    onboardingButtonText: {
      color: theme.white,
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
    },
    aboutRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
    },
    aboutLabel: {
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.textSecondary,
    },
    aboutValue: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.text,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
    },
    footerText: {
      textAlign: 'center',
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textMuted,
      padding: spacing.xl,
    },
    limitationRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    limitationText: {
      flex: 1,
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      width: '100%',
      maxWidth: 360,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    editProfileModalOverlay: {
      paddingHorizontal: Platform.OS === 'ios' ? spacing.sm : spacing.lg,
    },
    modeSwitchModalOverlay: {
      paddingHorizontal: Platform.OS === 'ios' ? spacing.sm : spacing.md,
    },
    editProfileModalContent: {
      maxWidth: 370,
      paddingHorizontal: Platform.OS === 'ios' ? spacing.md : spacing.lg,
    },
    modeSwitchModalContent: {
      maxWidth: 370,
      paddingHorizontal: Platform.OS === 'ios' ? spacing.md  : spacing.lg,
    },
    editProfilePickerContainer: {
      marginHorizontal: Platform.OS === 'ios' ? -spacing.xs : -spacing.lg,
    },
    modeSwitchPickerWideContainer: {
      marginHorizontal: Platform.OS === 'ios' ? -spacing.xs : -spacing.lg,
    },
    modalHeader: {
      marginBottom: spacing.md,
    },
    languageModalScreen: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: spacing.md,
      paddingTop: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
      paddingBottom: spacing.md,
    },
    languageModalHeader: {
      marginBottom: spacing.sm,
    },
    languageModalList: {
      flex: 1,
    },
    languageModalListContent: {
      paddingBottom: spacing.xl,
    },
    modalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.md,
      marginBottom: spacing.xs,
    },
    modalOptionActive: {
      backgroundColor: theme.backgroundSecondary,
    },
    paletteModalOption: {
      alignItems: 'flex-start',
    },
    modalOptionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    paletteOptionLeft: {
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
    paletteOptionRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flexShrink: 0,
      marginLeft: spacing.sm,
    },
    paletteDescription: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: 2,
      lineHeight: 18,
    },
    paletteCheckSlot: {
      width: 22,
      height: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    palettePreview: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    paletteDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    modalOptionText: {
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.text,
    },
    modalOptionTextActive: {
      fontFamily: fonts.ui,
      color: theme.primary,
    },
    modalOptionDisabled: {
      opacity: 0.6,
    },
    // Backup row
    lastBackupRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.md,
      paddingHorizontal: spacing.xs,
    },
    lastBackupText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      flex: 1,
    },
    // Mode badge
    modeBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: borderRadius.full,
    },
    modeBadgeText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    // Mode switch modal
    modeSwitchDescription: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: spacing.md,
    },
    modeSwitchDateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    modeSwitchDateText: {
      fontSize: fontSize.md,
      fontFamily: fonts.body,
    },
    modeSwitchPickerContainer: {
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      overflow: 'hidden',
      marginBottom: spacing.sm,
      alignItems: 'center',
      width: '100%',
      marginHorizontal: -spacing.lg,
      paddingHorizontal: spacing.md,
    },
    modeSwitchPickerDone: {
      alignItems: 'center',
      padding: spacing.md,
      borderTopWidth: 1,
    },
    // Baby Profile Styles
    babyProfileSection: {
      padding: spacing.md,
      paddingBottom: spacing.lg,
    },
    babyProfileCard: {
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      borderWidth: 1,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    babyProfileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    babyAvatarWrap: {
      width: 52,
      height: 52,
      marginRight: spacing.md,
      position: 'relative',
    },
    babyAvatarImage: {
      width: 52,
      height: 52,
      borderRadius: 26,
    },
    babyAvatarPlaceholder: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
    },
    babyAvatarInitial: {
      fontSize: fontSize.xl,
      fontFamily: fonts.display,
    },
    babyAvatarEditBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
    },
    babyProfileHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
    },
    babyProfileIcon: {
      width: 56,
      height: 56,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    babyProfileHeaderText: {
      flex: 1,
      gap: spacing.xs,
    },
    babyProfileNameLarge: {
      fontSize: fontSize.xl,
      fontFamily: fonts.heading,
      color: theme.text,
      lineHeight: fontSize.xl * 1.2,
    },
    babyEditButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.lg,
      flexShrink: 0,
    },
    babyEditButtonText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      fontWeight: '500',
    },
    babyDivider: {
      height: 1,
      marginVertical: spacing.md,
    },
    babyDateSection: {
      marginBottom: spacing.md,
    },
    babyDateRowContainer: {
      flexDirection: 'row',
      gap: spacing.lg,
    },
    babyDateItem: {
      flex: 1,
      flexDirection: 'row',
      gap: spacing.sm,
      alignItems: 'flex-start',
    },
    babyDateIcon: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    babyDateLabel: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    babyDateValue: {
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.text,
    },
    babyBornButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 3,
    },
    babyBornButtonText: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.white,
      fontWeight: '600',
    },
    undoModeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
    },
    undoModeButtonText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      fontWeight: '500',
    },
    undoModeButtonSubtext: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      marginTop: 2,
    },
    reviewItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.xs,
    },
    reviewItemText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      flex: 1,
    },
    // Profile list styles
    profileListIcon: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileListMeta: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: 1,
    },
  });
