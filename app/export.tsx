import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { exportToJson, exportToXls } from '../src/utils/export';
import { spacing, fontSize, borderRadius, fonts } from '../src/constants';
import { Background } from '../src/components/Background';
import { useI18n, useTheme, usePaywallTrigger, ThemeColors } from '../src/hooks';

export default function ExportScreen() {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const { checkFeaturePaywall, isPro } = usePaywallTrigger();
  const [exportingFormat, setExportingFormat] = useState<'json' | 'xls' | null>(null);
  const styles = createStyles(theme);

  const handleExport = async (format: 'json' | 'xls') => {
    // Check if user is Pro or show paywall
    if (!isPro) {
      const purchased = await checkFeaturePaywall('export');
      if (!purchased) {
        // User dismissed paywall and didn't purchase - block export
        Alert.alert(
          t('alerts.proFeatureTitle'),
          t('alerts.proFeatureExport')
        );
        return;
      }
    }

    setExportingFormat(format);
    try {
      if (format === 'json') {
        await exportToJson();
      } else {
        await exportToXls();
      }
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert(t('alerts.exportFailedTitle'), t('alerts.exportFailedMessage'));
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t('settings.exportTitle') }} />
      <Background />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="download-outline" size={26} color={theme.primary} />
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>{t('settings.exportInfoTitle')}</Text>
              <Text style={styles.cardDescription}>
                {t('settings.exportInfoDescription')}
              </Text>
            </View>
          </View>
          <Text style={styles.noteText}>{t('settings.exportPrivacyNote')}</Text>
          <Text style={styles.noteText}>{t('settings.exportPhotosNote')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('settings.exportFormatsTitle')}</Text>
          <Text style={styles.cardDescription}>
            {t('settings.exportFormatsDescription')}
          </Text>
          <View style={styles.exportButtons}>
            <TouchableOpacity
              style={[
                styles.exportButton,
                exportingFormat && styles.exportButtonDisabled,
                !isPro && styles.exportButtonLocked,
              ]}
              onPress={() => handleExport('json')}
              disabled={!!exportingFormat}
            >
              {exportingFormat === 'json' ? (
                <ActivityIndicator color={theme.white} size="small" />
              ) : (
                <>
                  <Ionicons name="share-outline" size={20} color={theme.white} />
                  <Text style={styles.exportButtonText}>{t('settings.exportButton')}</Text>
                  {!isPro && <Ionicons name="lock-closed" size={16} color={theme.white} style={styles.lockIcon} />}
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.exportButton,
                exportingFormat && styles.exportButtonDisabled,
                !isPro && styles.exportButtonLocked,
              ]}
              onPress={() => handleExport('xls')}
              disabled={!!exportingFormat}
            >
              {exportingFormat === 'xls' ? (
                <ActivityIndicator color={theme.white} size="small" />
              ) : (
                <>
                  <Ionicons name="grid-outline" size={20} color={theme.white} />
                  <Text style={styles.exportButtonText}>{t('settings.exportButtonXls')}</Text>
                  {!isPro && <Ionicons name="lock-closed" size={16} color={theme.white} style={styles.lockIcon} />}
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
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
      marginBottom: spacing.md,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
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
    noteText: {
      marginTop: spacing.md,
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textMuted,
    },
    exportButtons: {
      marginTop: spacing.md,
      gap: spacing.sm,
    },
    exportButton: {
      backgroundColor: theme.primary,
      borderRadius: borderRadius.md,
      padding: spacing.md,
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
    exportButtonDisabled: {
      opacity: 0.6,
    },
    exportButtonLocked: {
      backgroundColor: theme.textMuted,
    },
    exportButtonText: {
      color: theme.white,
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
    },
    lockIcon: {
      marginLeft: spacing.xs,
    },
  });
