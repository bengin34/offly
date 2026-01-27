import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { fonts, fontSize, spacing, borderRadius } from '../constants/colors';

interface StatCardProps {
  value: number | string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  subtitle?: string;
}

export function StatCard({ value, label, icon, subtitle }: StatCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {icon && (
        <Ionicons name={icon} size={20} color={theme.primary} style={styles.icon} />
      )}
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 100,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: spacing.xs,
  },
  value: {
    fontFamily: fonts.display,
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  label: {
    fontFamily: fonts.ui,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.xs,
    marginTop: 2,
    textAlign: 'center',
  },
});
