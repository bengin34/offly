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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter, useFocusEffect } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { Background } from '../../src/components/Background';
import { DialogHeader } from '../../src/components/DialogHeader';
import { ProUpgradeBanner } from '../../src/components/ProUpgradeBanner';
import { useI18n, useTheme, useThemeMode } from '../../src/hooks';
import { getLocaleLabel, Locale } from '../../src/localization';
import { type ThemeMode } from '../../src/stores';
import { useOnboardingStore } from '../../src/stores/onboardingStore';
import { pickAndImport } from '../../src/utils/import';
import { exportToJson } from '../../src/utils/export';
import { BabyProfileRepository, VaultRepository, ChapterRepository, MemoryRepository } from '../../src/db/repositories';
import { useBackupStore } from '../../src/stores/backupStore';
import type { BabyProfile } from '../../src/types';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { mode, setMode } = useThemeMode();
  const { t, locale, setLocale } = useI18n();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showModeSwitchModal, setShowModeSwitchModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
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
    try {
      await exportToJson();
      await setLastBackupDate(new Date().toISOString());
    } catch (error) {
      console.error('Backup export failed:', error);
      Alert.alert('Export failed', 'Could not create backup. Please try again.');
    }
  };

  // Baby profile state
  const [profile, setProfile] = useState<BabyProfile | null>(null);
  const [birthDate, setBirthDate] = useState(new Date());
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [isSwitchingMode, setIsSwitchingMode] = useState(false);

  const loadProfile = useCallback(async () => {
    const p = await BabyProfileRepository.getDefault();
    setProfile(p);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleModeSwitchToBorn = () => {
    if (!profile || profile.mode !== 'pregnant') return;
    setShowModeSwitchModal(true);
  };

  const handleBirthDateChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowBirthDatePicker(false);
    }
    if (!selectedDate) return;
    setBirthDate(selectedDate);
  };

  const confirmModeSwitchToBorn = async () => {
    if (!profile) return;
    setIsSwitchingMode(true);
    try {
      const dobStr = birthDate.toISOString();

      // 1. Update profile: mode → born, set birthdate
      await BabyProfileRepository.update({
        id: profile.id,
        mode: 'born',
        birthdate: dobStr,
      });

      // 2. Create a "Before you were born" chapter and move pregnancy journal entries
      const pregnancyCount = await MemoryRepository.countPregnancyJournal();
      if (pregnancyCount > 0) {
        const chapter = await ChapterRepository.create({
          babyId: profile.id,
          title: 'Before you were born',
          startDate: profile.edd || dobStr,
          description: 'Pregnancy journal entries',
        });
        await MemoryRepository.movePregnancyJournalToChapter(chapter.id);
      }

      // 3. Recalculate vault unlock dates using DOB
      await VaultRepository.recalculateUnlockDates(profile.id, dobStr);

      setShowModeSwitchModal(false);
      await loadProfile();

      Alert.alert(
        'Mode updated',
        'Your profile has been switched to "Born" mode. Pregnancy journal entries have been moved to a chapter.'
      );
    } catch (error) {
      console.error('Failed to switch mode:', error);
      Alert.alert('Error', 'Failed to switch mode. Please try again.');
    } finally {
      setIsSwitchingMode(false);
    }
  };

  const themeOptions: { mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { mode: 'light', label: t('settings.themeLight'), icon: 'sunny' },
    { mode: 'dark', label: t('settings.themeDark'), icon: 'moon' },
  ];

  const currentThemeLabel =
    themeOptions.find((o) => o.mode === mode)?.label || themeOptions[0]?.label;

  const languageOptions: { locale: Locale; label: string }[] = [
    { locale: 'en', label: getLocaleLabel('en') },
    { locale: 'de', label: getLocaleLabel('de') },
    { locale: 'it', label: getLocaleLabel('it') },
    { locale: 'fr', label: getLocaleLabel('fr') },
    { locale: 'es', label: getLocaleLabel('es') },
    { locale: 'tr', label: getLocaleLabel('tr') },
  ];

  const currentLanguageLabel = getLocaleLabel(locale);

  const handleSelectTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    setShowThemeModal(false);
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

  const APP_STORE_ID = '6758159402';
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
      const subject = `BabyLegacy Support (v${APP_VERSION})`;
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

        {/* Baby Profile Section */}
        {profile && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BABY PROFILE</Text>
            <View style={styles.card}>
              <View style={styles.settingsRow}>
                <View style={styles.settingsRowLeft}>
                  <Ionicons name="person-outline" size={22} color={theme.textSecondary} />
                  <Text style={styles.settingsRowLabel}>
                    {profile.name || 'Baby'}
                  </Text>
                </View>
                <View style={styles.settingsRowRight}>
                  <View style={[styles.modeBadge, { backgroundColor: profile.mode === 'pregnant' ? theme.primary + '20' : theme.success + '20' }]}>
                    <Text style={[styles.modeBadgeText, { color: profile.mode === 'pregnant' ? theme.primary : theme.success }]}>
                      {profile.mode === 'pregnant' ? 'Pregnant' : 'Born'}
                    </Text>
                  </View>
                </View>
              </View>
              {profile.mode === 'pregnant' && (
                <>
                  <View style={styles.settingsDivider} />
                  <TouchableOpacity
                    style={styles.settingsRow}
                    onPress={handleModeSwitchToBorn}
                  >
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="happy-outline" size={22} color={theme.success} />
                      <Text style={[styles.settingsRowLabel, { color: theme.success }]}>
                        Baby is born!
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                  </TouchableOpacity>
                </>
              )}
              {profile.birthdate && (
                <>
                  <View style={styles.settingsDivider} />
                  <View style={styles.settingsRow}>
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="calendar-outline" size={22} color={theme.textSecondary} />
                      <Text style={styles.settingsRowLabel}>Birth date</Text>
                    </View>
                    <Text style={styles.settingsRowValue}>
                      {new Date(profile.birthdate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                </>
              )}
              {profile.mode === 'pregnant' && profile.edd && (
                <>
                  <View style={styles.settingsDivider} />
                  <View style={styles.settingsRow}>
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="time-outline" size={22} color={theme.textSecondary} />
                      <Text style={styles.settingsRowLabel}>Due date</Text>
                    </View>
                    <Text style={styles.settingsRowValue}>
                      {new Date(profile.edd).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                </>
              )}
            </View>
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
                <Text style={styles.settingsRowLabel}>{t('settings.appearance')}</Text>
              </View>
              <View style={styles.settingsRowRight}>
                <Text style={styles.settingsRowValue}>{currentThemeLabel}</Text>
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
                <Text style={styles.settingsRowLabel}>{t('settings.language')}</Text>
              </View>
              <View style={styles.settingsRowRight}>
                <Text style={styles.settingsRowValue}>{currentLanguageLabel}</Text>
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
          <Text style={styles.sectionTitle}>BACKUP & DATA</Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="shield-checkmark-outline" size={24} color={theme.primary} />
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>Backup your memories</Text>
                <Text style={styles.cardDescription}>
                  Export your data to keep a safe copy. Your data is stored only on this device.
                </Text>
              </View>
            </View>
            {lastBackupDate && (
              <View style={styles.lastBackupRow}>
                <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                <Text style={[styles.lastBackupText, { color: theme.success }]}>
                  Last backup: {new Date(lastBackupDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            )}
            {!lastBackupDate && (
              <View style={styles.lastBackupRow}>
                <Ionicons name="warning-outline" size={16} color={theme.warning} />
                <Text style={[styles.lastBackupText, { color: theme.warning }]}>
                  No backup yet. We recommend backing up regularly.
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.onboardingButton}
              onPress={handleBackupExport}
            >
              <Ionicons name="download-outline" size={20} color={theme.white} />
              <Text style={styles.onboardingButtonText}>Create Backup</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportLink}
              onPress={() => setShowDataModal(true)}
              accessibilityRole="button"
              accessibilityLabel={t('settings.dataButton')}
            >
              <Text style={styles.exportLinkText}>More export & import options</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
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

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowLanguageModal(false)}>
          <View style={styles.modalContent}>
            <DialogHeader
              title={t('settings.chooseLanguage')}
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
              containerStyle={styles.modalHeader}
            />
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
          </View>
        </Pressable>
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

      {/* Mode Switch Modal (Pregnant → Born) */}
      <Modal
        visible={showModeSwitchModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModeSwitchModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => !isSwitchingMode && setShowModeSwitchModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <DialogHeader
              title="Baby is born!"
              onClose={() => setShowModeSwitchModal(false)}
              actionLabel={isSwitchingMode ? 'Saving...' : 'Confirm'}
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
            <Text style={styles.modeSwitchDescription}>
              Enter the birth date. Your pregnancy journal entries will be moved to a "Before you were born" chapter, and vault unlock dates will be recalculated.
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
                {birthDate.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>

            {showBirthDatePicker && (
              <View style={[styles.modeSwitchPickerContainer, { backgroundColor: theme.card, borderColor: theme.borderLight }]}>
                <DateTimePicker
                  value={birthDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleBirthDateChange}
                  themeVariant={theme.isDark ? 'dark' : 'light'}
                  maximumDate={new Date()}
                  style={{ height: 200 }}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={[styles.modeSwitchPickerDone, { borderTopColor: theme.borderLight }]}
                    onPress={() => setShowBirthDatePicker(false)}
                  >
                    <Text style={{ color: theme.primary, fontFamily: fonts.ui, fontSize: fontSize.md }}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {isSwitchingMode && (
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
    settingsRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    settingsRowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
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
    },
    settingsRowValue: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.textSecondary,
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
      maxWidth: 320,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    modalHeader: {
      marginBottom: spacing.md,
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
    modalOptionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
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
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
    },
    modeBadgeText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
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
    },
    modeSwitchPickerDone: {
      alignItems: 'center',
      padding: spacing.md,
      borderTopWidth: 1,
    },
  });
