import type { ComponentProps, ReactNode } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  type StyleProp,
  type ViewStyle,
  type ScrollViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../constants';
import { DialogHeader } from './DialogHeader';

type ModalWrapperProps = ComponentProps<typeof DialogHeader> & {
  children: ReactNode;
  backgroundColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  useSafeAreaTop?: boolean;
  keyboardVerticalOffset?: number;
  scrollViewProps?: Omit<ScrollViewProps, 'contentContainerStyle' | 'children'>;
};

export function ModalWrapper({
  children,
  backgroundColor,
  containerStyle,
  contentContainerStyle,
  useSafeAreaTop = Platform.OS === 'android',
  keyboardVerticalOffset = Platform.OS === 'ios' ? 20 : 0,
  scrollViewProps,
  ...headerProps
}: ModalWrapperProps) {
  const insets = useSafeAreaInsets();
  const topPadding = useSafeAreaTop ? insets.top : 0;

  return (
    <View style={[styles.container, backgroundColor ? { backgroundColor } : null, containerStyle]}>
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <DialogHeader {...headerProps} />
      </View>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
});
