import { View, Text, StyleSheet, Pressable, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors as defaultColors, spacing, fontSize, fonts } from '../constants';

type DialogHeaderPalette = {
  text: string;
  textSecondary?: string;
  textMuted?: string;
  primary: string;
  border?: string;
};

type DialogHeaderProps = {
  title: string;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  palette?: DialogHeaderPalette;
  showDivider?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  actionTextStyle?: StyleProp<TextStyle>;
};

const defaultPalette: DialogHeaderPalette = {
  text: defaultColors.text,
  textSecondary: defaultColors.textSecondary,
  textMuted: defaultColors.textMuted,
  primary: defaultColors.primary,
  border: defaultColors.border,
};

export function DialogHeader({
  title,
  onClose,
  actionLabel,
  onAction,
  actionDisabled = false,
  palette = defaultPalette,
  showDivider = false,
  containerStyle,
  titleStyle,
  actionTextStyle,
}: DialogHeaderProps) {
  const dividerStyle = showDivider && palette.border
    ? { borderBottomWidth: 1, borderBottomColor: palette.border }
    : null;
  const disabledColor = palette.textMuted ?? palette.textSecondary ?? palette.text;

  return (
    <View style={[styles.container, dividerStyle, containerStyle]}>
      <Pressable onPress={onClose} style={styles.sideButton} hitSlop={8}>
        <Ionicons name="close" size={22} color={palette.text} />
      </Pressable>
      <Text
        style={[styles.title, { color: palette.text }, titleStyle]}
        numberOfLines={1}
      >
        {title}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={styles.sideButton}
          disabled={actionDisabled}
          hitSlop={8}
        >
          <Text
            style={[
              styles.actionText,
              { color: actionDisabled ? disabledColor : palette.primary },
              actionDisabled && styles.actionDisabled,
              actionTextStyle,
            ]}
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.sideButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height:70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sideButton: {
    minWidth: 28,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: fontSize.lg,
    fontFamily: fonts.heading,
    textAlign: 'center',
  },
  actionText: {
    fontSize: fontSize.md,
    fontFamily: fonts.ui,
  },
  actionDisabled: {
    opacity: 0.6,
  },
});
