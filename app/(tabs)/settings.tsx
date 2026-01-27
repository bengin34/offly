import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Pressable,
  ActivityIndicator,
  Linking,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { Background } from '../../src/components/Background';
import { DialogHeader } from '../../src/components/DialogHeader';
import { ProUpgradeBanner } from '../../src/components/ProUpgradeBanner';
import { useI18n, useTheme, useThemeMode } from '../../src/hooks';
import { getLocaleLabel, Locale } from '../../src/localization';
import { type ThemeMode } from '../../src/stores';
import { useOnboardingStore } from '../../src/stores/onboardingStore';
import { pickAndImport } from '../../src/utils/import';

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { mode, setMode } = useThemeMode();
  const { t, locale, setLocale } = useI18n();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);

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

              const summary = `${t('tabs.chapters')}: ${result.tripsImported}\n${t('common.memories')}: ${result.entriesImported}\n${t('entryForm.tagsLabel')}: ${result.tagsImported}`;
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
          <Text style={styles.sectionTitle}>
            {t('settings.dataSection').toLocaleUpperCase(locale)}
          </Text>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="swap-horizontal-outline" size={24} color={theme.primary} />
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{t('settings.dataTitle')}</Text>
                <Text style={styles.cardDescription}>
                  {t('settings.dataDescription')}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.exportLink}
              onPress={() => setShowDataModal(true)}
              accessibilityRole="button"
              accessibilityLabel={t('settings.dataButton')}
            >
              <Text style={styles.exportLinkText}>{t('settings.dataButton')}</Text>
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
  });
