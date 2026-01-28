import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MemoryRepository } from '../../src/db/repositories';
import { spacing, fontSize, borderRadius, fonts } from '../../src/constants';
import { Background } from '../../src/components/Background';
import { useTheme } from '../../src/hooks';
import type { MemoryWithRelations } from '../../src/types';

export default function PregnancyJournalScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [entries, setEntries] = useState<MemoryWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadEntries = useCallback(async () => {
    try {
      const data = await MemoryRepository.getPregnancyJournalEntriesWithRelations();
      setEntries(data);
    } catch (error) {
      console.error('Failed to load pregnancy journal entries:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadEntries();
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

  const renderEntry = ({ item }: { item: MemoryWithRelations }) => (
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
        <Text style={styles.entryDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      {item.tags.length > 0 && (
        <View style={styles.tagRow}>
          {item.tags.slice(0, 3).map((tag) => (
            <View key={tag.id} style={styles.tag}>
              <Text style={styles.tagText}>{tag.name}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{item.tags.length - 3}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={64} color={theme.textMuted} />
      <Text style={styles.emptyTitle}>Your pregnancy journal</Text>
      <Text style={styles.emptySubtitle}>
        Capture thoughts, feelings, and milestones during your pregnancy
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => router.push('/pregnancy-journal/new-entry')}
      >
        <Text style={styles.emptyButtonText}>Write your first entry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Background />
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderEntry}
        contentContainerStyle={entries.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
          />
        }
      />
      {entries.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/pregnancy-journal/new-entry')}
        >
          <Ionicons name="add" size={28} color={theme.white} />
        </TouchableOpacity>
      )}
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
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl + 72,
      paddingHorizontal: spacing.md,
    },
    emptyList: {
      flex: 1,
      paddingHorizontal: spacing.md,
    },
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
      backgroundColor: theme.primary + '15',
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
      marginBottom: spacing.sm,
    },
    entryDateText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.primary,
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
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      marginTop: spacing.sm,
    },
    tag: {
      backgroundColor: theme.accentSoft,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    tagText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.accent,
    },
    moreTagsText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.ui,
      color: theme.textMuted,
      alignSelf: 'center',
    },
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
      marginTop: spacing.md,
    },
    emptySubtitle: {
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    emptyButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.xl,
      marginTop: spacing.lg,
    },
    emptyButtonText: {
      color: theme.white,
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
    },
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
