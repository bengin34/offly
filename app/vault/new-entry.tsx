import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MemoryRepository } from '../../src/db/repositories';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { APP_LIMITS } from '../../src/constants/limits';
import { hideVaultFreeLimit } from '../../src/config/dev';
import { Background } from '../../src/components/Background';
import { DialogHeader } from '../../src/components/DialogHeader';
import { useI18n, useTheme, useSubscription } from '../../src/hooks';
import { useProfileStore } from '../../src/stores/profileStore';

function titleFromBody(body: string): string {
  const firstLine = body.split('\n').find((l) => l.trim().length > 0) ?? '';
  const trimmed = firstLine.trim();
  if (trimmed.length <= 50) return trimmed;
  return trimmed.slice(0, 47) + '...';
}

export default function NewVaultEntryScreen() {
  const { vaultId } = useLocalSearchParams<{ vaultId: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { t } = useI18n();
  const { isPro, presentPaywall } = useSubscription();
  const { activeBaby } = useProfileStore();
  const insets = useSafeAreaInsets();

  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!body.trim()) {
      Alert.alert(t('vault.alertEmptyLetterTitle'), t('vault.alertEmptyLetterMessage'));
      return;
    }

    if (!vaultId) {
      Alert.alert(t('vault.alertNoVaultTitle'), t('vault.alertNoVaultMessage'));
      return;
    }

    if (!isPro && !hideVaultFreeLimit) {
      const vaultLetterCount = await MemoryRepository.countByVaultId(vaultId);
      if (vaultLetterCount >= APP_LIMITS.FREE_MAX_LETTERS_PER_VAULT) {
        await presentPaywall();
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await MemoryRepository.create({
        chapterId: '',
        vaultId,
        babyId: activeBaby?.id,
        memoryType: 'letter',
        title: titleFromBody(body),
        description: body.trim(),
        date: new Date().toISOString(),
      });

      router.back();
    } catch (error) {
      console.error('Failed to create vault entry:', error);
      Alert.alert(t('vault.alertSaveFailedTitle'), t('vault.alertSaveFailedMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Background />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={{ paddingTop: Platform.OS === 'android' ? insets.top : 0, paddingHorizontal: spacing.md }}>
          <DialogHeader
            title={t('vault.writeLetterTitle')}
            onClose={() => router.back()}
            actionLabel={isSubmitting ? t('vault.savingAction') : t('vault.saveAction')}
            onAction={handleSave}
            actionDisabled={isSubmitting || !body.trim()}
            palette={{
              text: theme.text,
              textSecondary: theme.textSecondary,
              textMuted: theme.textMuted,
              primary: theme.primary,
              border: theme.border,
            }}
            showDivider
          />
        </View>

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="lock-closed" size={14} color={theme.accent} />
          <Text style={styles.infoBannerText}>
            {t('vault.safeUntilUnlock')}
          </Text>
        </View>

        {/* Writing surface */}
        <TextInput
          style={[styles.textInput, { paddingBottom: insets.bottom + spacing.lg }]}
          value={body}
          onChangeText={setBody}
          placeholder={t('vault.placeholderBody')}
          placeholderTextColor={theme.textMuted}
          multiline
          autoFocus
          textAlignVertical="top"
          scrollEnabled
        />
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
    infoBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.accentSoft,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      marginHorizontal: spacing.md,
      marginTop: spacing.xs,
      marginBottom: spacing.sm,
      gap: spacing.xs,
    },
    infoBannerText: {
      flex: 1,
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.accent,
    },
    textInput: {
      flex: 1,
      fontSize: fontSize.md + 1,
      fontFamily: fonts.body,
      color: theme.text,
      lineHeight: 26,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
    },
  });
