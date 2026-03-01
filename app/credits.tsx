import { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, fontSize, borderRadius, fonts } from '../src/constants';
import { Background } from '../src/components/Background';
import { useI18n, useTheme, ThemeColors } from '../src/hooks';

const CREDIT_ITEMS = [
  {
    id: 'freepik-pregnant-life',
    attribution: 'Image by rawpixel.com on Freepik',
    url: 'https://www.freepik.com/free-photo/pregnant-woman-life_2765264.htm',
  },
  {
    id: 'freepik-ultrasound',
    attribution: 'Image by freepik',
    url: 'https://www.freepik.com/free-photo/pregnant-woman-with-husband-ultrasound_2045641.htm',
  },
  {
    id: 'freepik-balcony',
    attribution: 'Image by freepik',
    url: 'https://www.freepik.com/free-photo/pregnant-woman-front-balcony_2045620.htm',
  },
  {
    id: 'freepik-baby-floor',
    attribution: 'Image by freepik',
    url: 'https://www.freepik.com/free-photo/baby-laying-floor-while-defocused-mother-is-his-back_24751495.htm',
  },
  {
    id: 'freepik-newborn',
    attribution: 'Image by rawpixel.com on Freepik',
    url: 'https://www.freepik.com/free-photo/newborn-baby_2765276.htm',
  },
] as const;

export default function CreditsScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const styles = createStyles(theme);

  const handleOpenLink = useCallback(async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open credits link:', error);
      Alert.alert(t('alerts.errorTitle'));
    }
  }, [t]);

  return (
    <View style={styles.container}>
      <Background />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={24} color={theme.primary} />
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>{t('settings.creditsTitle')}</Text>
              <Text style={styles.cardDescription}>{t('settings.creditsDescription')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          {CREDIT_ITEMS.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.creditRow}
                onPress={() => handleOpenLink(item.url)}
                accessibilityRole="button"
                accessibilityLabel={t('settings.creditsOpenSource')}
              >
                <View style={styles.creditTextContainer}>
                  <Text style={styles.creditAttribution}>{item.attribution}</Text>
                  <Text style={styles.creditUrl} numberOfLines={1} ellipsizeMode="middle">
                    {item.url}
                  </Text>
                </View>
                <Ionicons name="open-outline" size={18} color={theme.textMuted} />
              </TouchableOpacity>
              {index < CREDIT_ITEMS.length - 1 && <View style={styles.settingsDivider} />}
            </View>
          ))}
        </View>

        <Text style={styles.footerNote}>{t('settings.creditsFooterNote')}</Text>
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
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 2,
      marginBottom: spacing.md,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
    },
    cardHeaderText: {
      flex: 1,
    },
    cardTitle: {
      fontFamily: fonts.display,
      fontSize: fontSize.lg,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    cardDescription: {
      fontFamily: fonts.ui,
      fontSize: fontSize.md,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    creditRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
      paddingVertical: spacing.sm,
    },
    creditTextContainer: {
      flex: 1,
      gap: spacing.xs,
    },
    creditAttribution: {
      fontFamily: fonts.ui,
      fontSize: fontSize.md,
      color: theme.text,
    },
    creditUrl: {
      fontFamily: fonts.ui,
      fontSize: fontSize.sm,
      color: theme.primary,
    },
    settingsDivider: {
      height: 1,
      backgroundColor: theme.borderLight,
    },
    footerNote: {
      fontFamily: fonts.ui,
      fontSize: fontSize.sm,
      color: theme.textMuted,
      textAlign: 'center',
      paddingHorizontal: spacing.sm,
      paddingBottom: spacing.md,
    },
  });
