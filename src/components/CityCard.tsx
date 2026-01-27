import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fonts, borderRadius } from '../constants';
import type { City } from '../types';
import { useI18n } from '../hooks';

type CityCardProps = {
  city: City;
  entryCount: number;
  onPress?: () => void;
  onAddEntry?: () => void;
  onEdit?: () => void;
};

export function CityCard({ city, entryCount, onPress, onAddEntry, onEdit }: CityCardProps) {
  const { t, locale } = useI18n();
  const hasDateRange = city.arrivalDate || city.departureDate;

  const formatDateRange = () => {
    if (!city.arrivalDate && !city.departureDate) return null;

    const arrival = city.arrivalDate
      ? new Date(city.arrivalDate).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
      : '?';
    const departure = city.departureDate
      ? new Date(city.departureDate).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
      : '?';

    if (city.arrivalDate && city.departureDate) {
      return `${arrival} - ${departure}`;
    }
    if (city.arrivalDate) {
      return t('dialogs.cityPicker.fromDate', { date: arrival });
    }
    return t('dialogs.cityPicker.untilDate', { date: departure });
  };

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <Text style={styles.cityName}>{city.name}</Text>
        </View>
        {onEdit && (
          <Pressable onPress={onEdit} hitSlop={8}>
            <Ionicons name="pencil" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      <View style={styles.meta}>
        {hasDateRange && (
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{formatDateRange()}</Text>
          </View>
        )}
        <View style={styles.metaItem}>
          <Ionicons name="document-text-outline" size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>
            {entryCount} {entryCount === 1 ? t('common.entry') : t('common.entries')}
          </Text>
        </View>
      </View>

      {onAddEntry && (
        <Pressable style={styles.addButton} onPress={onAddEntry}>
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={styles.addButtonText}>{t('tripDetail.addEntry')}</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.accentSoft,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  cityName: {
    fontSize: fontSize.lg,
    fontFamily: fonts.heading,
    color: colors.accent,
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body,
    color: colors.textMuted,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.ui,
    color: colors.primary,
  },
});
