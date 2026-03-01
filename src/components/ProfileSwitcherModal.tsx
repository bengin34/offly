import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
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
  const { t, locale } = useI18n();
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

  const isAddNewLocked = !isPro && profiles.length >= APP_LIMITS.FREE_MAX_PROFILES;

  const handleAddNew = () => {
    if (isAddNewLocked) return;
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
        <View style={styles.content} onStartShouldSetResponder={() => true}>
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
                    <View style={[
                      styles.profileAvatar,
                      { backgroundColor: isActive ? theme.primary : theme.primary + '30' },
                    ]}>
                      {profile.avatar ? (
                        <Image source={{ uri: profile.avatar }} style={styles.profileAvatarPhoto} />
                      ) : profile.name ? (
                        <Text style={[styles.profileAvatarInitial, { color: isActive ? theme.white : theme.primary }]}>
                          {profile.name.charAt(0).toLocaleUpperCase(locale)}
                        </Text>
                      ) : (
                        <Ionicons name="footsteps" size={18} color={isActive ? theme.white : theme.primary} />
                      )}
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

              <TouchableOpacity
                style={[styles.addButton, isAddNewLocked && styles.addButtonLocked]}
                onPress={handleAddNew}
                activeOpacity={isAddNewLocked ? 1 : 0.7}
              >
                <View style={[styles.profileAvatar, { backgroundColor: theme.backgroundSecondary }]}>
                  <Ionicons name="add" size={22} color={isAddNewLocked ? theme.textMuted : theme.primary} />
                </View>
                <View style={styles.addButtonContent}>
                  <Text style={[styles.addButtonText, isAddNewLocked && styles.addButtonTextLocked]}>
                    {t('profiles.addNew')}
                  </Text>
                  {isAddNewLocked && (
                    <Text style={styles.addButtonProHint}>{t('profiles.addNewProOnly')}</Text>
                  )}
                </View>
                {isAddNewLocked && (
                  <Ionicons name="lock-closed" size={16} color={theme.textMuted} />
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
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
      maxWidth: 360,
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
    profileAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    profileAvatarPhoto: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    profileAvatarInitial: {
      fontSize: fontSize.lg,
      fontFamily: fonts.display,
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
    addButtonLocked: {
      opacity: 0.55,
    },
    addButtonContent: {
      flex: 1,
    },
    addButtonText: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.primary,
    },
    addButtonTextLocked: {
      color: theme.textMuted,
    },
    addButtonProHint: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textMuted,
      marginTop: 2,
    },
  });
