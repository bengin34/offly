import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BabyProfileRepository } from '../db/repositories/BabyProfileRepository';
import { useProfileStore } from '../stores/profileStore';
import { useTheme, useI18n, useSubscription } from '../hooks';
import { spacing, fontSize, borderRadius, fonts } from '../constants';
import { APP_LIMITS } from '../constants/limits';
import { DialogHeader } from './DialogHeader';
import type { BabyProfile } from '../types';
import type { ThemeColors } from '../hooks';

interface ProfileSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileSwitcherModal({ visible, onClose }: ProfileSwitcherModalProps) {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useI18n();
  const { isPro, presentPaywall } = useSubscription();
  const { activeBaby, setActiveBaby } = useProfileStore();
  const [profiles, setProfiles] = useState<BabyProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadProfiles();
    }
  }, [visible]);

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const all = await BabyProfileRepository.getAll();
      setProfiles(all);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProfile = async (profile: BabyProfile) => {
    if (profile.id === activeBaby?.id) {
      onClose();
      return;
    }
    await setActiveBaby(profile.id);
    onClose();
  };

  const handleAddNew = async () => {
    if (!isPro && profiles.length >= APP_LIMITS.FREE_MAX_PROFILES) {
      onClose();
      await presentPaywall();
      return;
    }
    onClose();
    router.push('/baby-setup?addNew=true');
  };

  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <DialogHeader
            title={t('profiles.switchProfile')}
            onClose={onClose}
            actionLabel={t('common.done')}
            onAction={onClose}
            palette={{
              text: theme.text,
              textSecondary: theme.textSecondary,
              textMuted: theme.textMuted,
              primary: theme.primary,
              border: theme.border,
            }}
            containerStyle={styles.header}
          />

          {isLoading ? (
            <ActivityIndicator size="small" color={theme.primary} style={{ marginVertical: spacing.lg }} />
          ) : (
            <>
              {profiles.map((profile) => {
                const isActive = profile.id === activeBaby?.id;
                return (
                  <TouchableOpacity
                    key={profile.id}
                    style={[styles.profileRow, isActive && styles.profileRowActive]}
                    onPress={() => handleSelectProfile(profile)}
                  >
                    <View style={[styles.profileIcon, { backgroundColor: profile.mode === 'pregnant' ? theme.primary + '15' : theme.accent + '15' }]}>
                      <Ionicons
                        name={profile.mode === 'pregnant' ? 'heart' : 'happy'}
                        size={20}
                        color={profile.mode === 'pregnant' ? theme.primary : theme.accent}
                      />
                    </View>
                    <View style={styles.profileInfo}>
                      <Text style={[styles.profileName, isActive && { color: theme.primary }]}>
                        {profile.name || t('profiles.defaultName')}
                      </Text>
                      <Text style={styles.profileMeta}>
                        {profile.mode === 'pregnant' ? t('settings.modeExpecting') : t('settings.modeBorn')}
                      </Text>
                    </View>
                    {isActive && (
                      <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
                <View style={[styles.profileIcon, { backgroundColor: theme.backgroundSecondary }]}>
                  <Ionicons name="add" size={22} color={theme.primary} />
                </View>
                <Text style={styles.addButtonText}>{t('profiles.addNew')}</Text>
                {!isPro && profiles.length >= APP_LIMITS.FREE_MAX_PROFILES && (
                  <Ionicons name="lock-closed" size={14} color={theme.textMuted} />
                )}
              </TouchableOpacity>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    content: {
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
    header: {
      marginBottom: spacing.md,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.md,
      marginBottom: spacing.xs,
    },
    profileRowActive: {
      backgroundColor: theme.backgroundSecondary,
    },
    profileIcon: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: fontSize.md,
      fontFamily: fonts.heading,
      color: theme.text,
    },
    profileMeta: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: 2,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.md,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
      marginTop: spacing.xs,
    },
    addButtonText: {
      flex: 1,
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.primary,
    },
  });
