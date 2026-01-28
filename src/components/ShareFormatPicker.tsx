import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius } from '../constants';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../hooks/useI18n';
export type ShareFormat = 'text' | 'image' | 'pdf';

interface ShareOption {
  format: ShareFormat;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

interface ShareFormatPickerProps {
  visible: boolean;
  cityName: string;
  onSelect: (format: ShareFormat) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function ShareFormatPicker({
  visible,
  cityName,
  onSelect,
  onClose,
  isLoading = false,
}: ShareFormatPickerProps) {
  const colors = useTheme();
  const { t } = useI18n();
  const [selectedFormat, setSelectedFormat] = useState<ShareFormat | null>(null);
  const shareOptions = useMemo<ShareOption[]>(
    () => [
      {
        format: 'text',
        icon: 'document-text-outline',
        title: t('shareDialog.optionTextTitle'),
        description: t('shareDialog.optionTextDescription'),
      },
      {
        format: 'image',
        icon: 'image-outline',
        title: t('shareDialog.optionImageTitle'),
        description: t('shareDialog.optionImageDescription'),
      },
      {
        format: 'pdf',
        icon: 'document-outline',
        title: t('shareDialog.optionPdfTitle'),
        description: t('shareDialog.optionPdfDescription'),
      },
    ],
    [t],
  );

  const handleSelect = (format: ShareFormat) => {
    setSelectedFormat(format);
    onSelect(format);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('shareDialog.title', { name: cityName })}
          </Text>
          <View style={styles.closeButton} />
        </View>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('shareDialog.subtitle')}
        </Text>

        {/* Options */}
        <View style={styles.options}>
          {shareOptions.map((option) => {
            const isSelected = selectedFormat === option.format;
            const isDisabled = isLoading && !isSelected;

            return (
              <TouchableOpacity
                key={option.format}
                style={[
                  styles.option,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                    opacity: isDisabled ? 0.5 : 1,
                  },
                ]}
                onPress={() => handleSelect(option.format)}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
                  {isLoading && isSelected ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Ionicons name={option.icon} size={28} color={colors.primary} />
                  )}
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    {option.description}
                  </Text>
                </View>
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : 'chevron-forward'}
                  size={24}
                  color={isSelected ? colors.primary : colors.textSecondary}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer hint */}
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          {t('shareDialog.hint')}
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  options: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
});
