import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { VaultRepository, MemoryRepository } from '../../src/db/repositories';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { APP_LIMITS } from '../../src/constants/limits';
import { Background } from '../../src/components/Background';
import { useTheme } from '../../src/hooks';
import { useSubscription } from '../../src/hooks/useSubscriptions';
import type { Vault, MemoryWithRelations } from '../../src/types';

export default function VaultDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { isPro, presentPaywall } = useSubscription();

  const [vault, setVault] = useState<Vault | null>(null);
  const [vaultIndex, setVaultIndex] = useState<number>(0);
  const [entries, setEntries] = useState<MemoryWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const vaultData = await VaultRepository.getById(id);
      setVault(vaultData);

      if (vaultData) {
        const entryData = await MemoryRepository.getByVaultIdWithRelations(id);
        setEntries(entryData);
        // Determine the 0-based index of this vault (sorted by age asc)
        const allVaults = await VaultRepository.getAll(vaultData.babyId);
        const idx = allVaults.findIndex((v) => v.id === id);
        setVaultIndex(idx >= 0 ? idx : 0);
      }
    } catch (error) {
      console.error('Failed to load vault:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    try {
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return d.toLocaleDateString();
    }
  };

  const styles = createStyles(theme);

  if (!vault && !isLoading) {
    return (
      <View style={styles.container}>
        <Background />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Vault not found</Text>
        </View>
      </View>
    );
  }

  const isLocked = vault?.status === 'locked';
  const vaultLabel =
    vault?.targetAgeYears === 1
      ? '1 Year'
      : `${vault?.targetAgeYears} Years`;
  const unlockLabel = vault?.unlockDate
    ? formatDate(vault.unlockDate)
    : 'Date not set';

  const isProVault = vaultIndex >= APP_LIMITS.FREE_MAX_AGE_LOCKED_LETTERS;

  const renderLockedHeader = () => (
    <View style={styles.lockedHeader}>
      <View style={styles.lockIconContainer}>
        <Ionicons name="lock-closed" size={48} color={theme.accent} />
      </View>
      {isProVault && !isPro && (
        <View style={[styles.proBadge, { backgroundColor: theme.primary }]}>
          <Ionicons name="star" size={12} color={theme.white} />
          <Text style={[styles.proBadgeText, { color: theme.white }]}>Pro</Text>
        </View>
      )}
      <Text style={styles.lockedTitle}>Locked until {unlockLabel}</Text>
      <Text style={styles.lockedSubtitle}>
        Letters in this vault will be revealed when your child turns {vault?.targetAgeYears}.
        You can still write new letters at any time.
      </Text>
      {isProVault && !isPro && (
        <Text style={[styles.proHint, { color: theme.textMuted }]}>
          Upgrade to Pro to write letters to this vault
        </Text>
      )}
      <View style={styles.lockedStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{entries.length}</Text>
          <Text style={styles.statLabel}>{entries.length === 1 ? 'letter' : 'letters'}</Text>
        </View>
      </View>
    </View>
  );

  const renderUnlockedHeader = () => (
    <View style={styles.unlockedHeader}>
      <View style={[styles.lockIconContainer, { backgroundColor: theme.success + '20' }]}>
        <Ionicons name="lock-open" size={48} color={theme.success} />
      </View>
      <Text style={styles.unlockedTitle}>Unlocked</Text>
      <Text style={styles.unlockedSubtitle}>
        {entries.length === 0
          ? 'No letters in this vault yet.'
          : `${entries.length} ${entries.length === 1 ? 'letter' : 'letters'} from the past`}
      </Text>
    </View>
  );

  // When locked, show entry count but not content
  const renderLockedEntry = ({ item }: { item: MemoryWithRelations }) => (
    <View style={styles.lockedEntryCard}>
      <Ionicons name="mail" size={20} color={theme.textMuted} />
      <View style={styles.lockedEntryContent}>
        <Text style={styles.lockedEntryText}>Letter written {formatDate(item.createdAt)}</Text>
      </View>
      <Ionicons name="lock-closed" size={14} color={theme.textMuted} />
    </View>
  );

  // When unlocked, show full content
  const renderUnlockedEntry = ({ item }: { item: MemoryWithRelations }) => (
    <TouchableOpacity
      style={styles.entryCard}
      onPress={() => router.push(`/memory/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.entryDateBadge}>
        <Text style={styles.entryDateText}>{formatDate(item.date)}</Text>
      </View>
      <Text style={styles.entryTitle} numberOfLines={1}>
        {item.title}
      </Text>
      {item.description && (
        <Text style={styles.entryDescription} numberOfLines={3}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderEmpty = () => {
    if (isLocked) {
      return (
        <View style={styles.emptySection}>
          <Ionicons name="mail-outline" size={48} color={theme.textMuted} />
          <Text style={styles.emptySectionTitle}>No letters yet</Text>
          <Text style={styles.emptySectionSubtitle}>
            Write your first letter to be opened in the future
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.emptySection}>
        <Ionicons name="mail-open-outline" size={48} color={theme.textMuted} />
        <Text style={styles.emptySectionTitle}>No letters</Text>
        <Text style={styles.emptySectionSubtitle}>
          This vault is empty
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Background />
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={isLocked ? renderLockedEntry : renderUnlockedEntry}
        ListHeaderComponent={isLocked ? renderLockedHeader : renderUnlockedHeader}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
          />
        }
      />
      {/* Add entry — Pro required for vaults beyond the free limit */}
      <TouchableOpacity
        style={styles.fab}
        onPress={async () => {
          const requiresPro = vaultIndex >= APP_LIMITS.FREE_MAX_AGE_LOCKED_LETTERS;
          if (requiresPro && !isPro) {
            await presentPaywall();
            return;
          }
          router.push({ pathname: '/vault/new-entry', params: { vaultId: id } });
        }}
      >
        <Ionicons name="create-outline" size={24} color={theme.white} />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    list: {
      paddingTop: spacing.md,
      paddingBottom: spacing.xl + 72,
      paddingHorizontal: spacing.md,
    },

    // Locked header
    lockedHeader: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
    },
    lockIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    proBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: borderRadius.full,
      marginBottom: spacing.sm,
    },
    proBadgeText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
    },
    proHint: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
    lockedTitle: {
      fontSize: fontSize.xl,
      fontFamily: fonts.display,
      color: theme.text,
      textAlign: 'center',
    },
    lockedSubtitle: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: spacing.sm,
      lineHeight: 20,
    },
    lockedStats: {
      flexDirection: 'row',
      marginTop: spacing.lg,
      gap: spacing.xl,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: fontSize.xxl,
      fontFamily: fonts.display,
      color: theme.text,
    },
    statLabel: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textMuted,
    },

    // Unlocked header
    unlockedHeader: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
    },
    unlockedTitle: {
      fontSize: fontSize.xl,
      fontFamily: fonts.display,
      color: theme.success,
      textAlign: 'center',
    },
    unlockedSubtitle: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: spacing.sm,
    },

    // Locked entry (minimal)
    lockedEntryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: theme.borderLight,
      gap: spacing.sm,
    },
    lockedEntryContent: {
      flex: 1,
    },
    lockedEntryText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
    },

    // Unlocked entry
    entryCard: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.xl,
      padding: spacing.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    entryDateBadge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.success + '15',
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
      marginBottom: spacing.sm,
    },
    entryDateText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.success,
    },
    entryTitle: {
      fontSize: fontSize.lg,
      fontFamily: fonts.heading,
      color: theme.text,
    },
    entryDescription: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: spacing.xs,
    },

    // Empty
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    emptyTitle: {
      fontSize: fontSize.xl,
      fontFamily: fonts.display,
      color: theme.text,
    },
    emptySection: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.md,
    },
    emptySectionTitle: {
      fontSize: fontSize.lg,
      fontFamily: fonts.display,
      color: theme.text,
      marginTop: spacing.md,
    },
    emptySectionSubtitle: {
      fontSize: fontSize.sm,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: spacing.xs,
      textAlign: 'center',
    },

    // FAB
    fab: {
      position: 'absolute',
      right: spacing.md,
      bottom: spacing.md,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
  });
