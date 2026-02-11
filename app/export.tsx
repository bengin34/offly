import { useState, useEffect } from 'react';
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
import { exportToJson, exportToXls, exportToZip, getExportStats } from '../src/utils/export';
import { spacing, fontSize, borderRadius, fonts } from '../src/constants';
import { Background } from '../src/components/Background';
import { useI18n, useTheme, useSubscription, ThemeColors } from '../src/hooks';

export default function ExportScreen() {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const { isPro, presentPaywall } = useSubscription();
  const [exportingFormat, setExportingFormat] = useState<'json' | 'xls' | 'zip' | null>(null);
  const [zipProgress, setZipProgress] = useState<number | null>(null);
  const [photoCount, setPhotoCount] = useState(0);
  const [estimatedSizeMB, setEstimatedSizeMB] = useState(0);
  const styles = createStyles(theme);

  // Load export stats on mount
  useEffect(() => {
    void (async () => {
      try {
        const stats = await getExportStats();
        setPhotoCount(stats.photoCount);
        // Average compressed photo size: ~3.5MB
        setEstimatedSizeMB(Math.round(stats.photoCount * 3.5));
      } catch (error) {
        console.error('Failed to load export stats:', error);
      }
    })();
  }, []);

  const handleExport = async (format: 'json' | 'xls' | 'zip') => {
    // Simple check: if not pro, show paywall
    if (!isPro) {
      await presentPaywall();
      return;
    }

    setExportingFormat(format);
    try {
      if (format === 'json') {
        await exportToJson();
      } else if (format === 'xls') {
        await exportToXls();
      } else if (format === 'zip') {
        await exportToZip((progress) => setZipProgress(progress));
      }
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert(t('alerts.exportFailedTitle'), t('alerts.exportFailedMessage'));
    } finally {
      setExportingFormat(null);
      setZipProgress(null);
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
        </View>

        {/* Full Backup (ZIP) Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="archive-outline" size={24} color={theme.primary} />
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>Full Backup (ZIP)</Text>
              <Text style={styles.cardDescription}>
                Includes all data and photos. Best for device migration.
              </Text>
            </View>
          </View>
          {photoCount > 0 && (
            <Text style={styles.estimateText}>
              Estimated size: ~{estimatedSizeMB} MB ({photoCount} photos)
            </Text>
          )}
          <TouchableOpacity
            style={[
              styles.exportButton,
              styles.primaryButton,
              exportingFormat && styles.exportButtonDisabled,
              !isPro && styles.exportButtonLocked,
            ]}
            onPress={() => handleExport('zip')}
            disabled={!!exportingFormat}
          >
            {exportingFormat === 'zip' ? (
              <>
                <ActivityIndicator color={theme.white} size="small" />
                {zipProgress !== null && (
                  <Text style={styles.exportButtonText}>
                    {Math.round(zipProgress * 100)}%
                  </Text>
                )}
              </>
            ) : (
              <>
                <Ionicons name="archive" size={20} color={theme.white} />
                <Text style={styles.exportButtonText}>Create Full Backup</Text>
                {!isPro && <Ionicons name="lock-closed" size={16} color={theme.white} style={styles.lockIcon} />}
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Data Export (JSON/XLS) Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text-outline" size={24} color={theme.textSecondary} />
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>Data Export</Text>
              <Text style={styles.cardDescription}>
                Export data only (without photos). Good for spreadsheets or lightweight backups.
              </Text>
            </View>
          </View>
          <View style={styles.exportButtons}>
            <TouchableOpacity
              style={[
                styles.exportButton,
                styles.secondaryButton,
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
                  <Ionicons name="code-outline" size={20} color={theme.white} />
                  <Text style={styles.exportButtonText}>{t('settings.exportButton')}</Text>
                  {!isPro && <Ionicons name="lock-closed" size={16} color={theme.white} style={styles.lockIcon} />}
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.exportButton,
                styles.secondaryButton,
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
    estimateText: {
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
      marginTop: spacing.md,
    },
    primaryButton: {
      backgroundColor: theme.primary,
    },
    secondaryButton: {
      backgroundColor: theme.textSecondary,
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
