import { useRef } from 'react';
import { View, Text, StyleSheet, Animated, Alert } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { spacing, fontSize, fonts } from '../constants';
import type { ThemeColors } from '../hooks';
import { useI18n } from '../hooks';

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete: () => void;
  theme: ThemeColors;
  itemName?: string;
}

export function SwipeableRow({ children, onDelete, theme, itemName = 'item' }: SwipeableRowProps) {
  const swipeableRef = useRef<Swipeable>(null);
  const { t } = useI18n();

  const handleDelete = () => {
    Alert.alert(
      t('alerts.deleteItemTitle', { item: itemName }),
      t('alerts.deleteItemMessage', { item: itemName }),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
          onPress: () => swipeableRef.current?.close(),
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            swipeableRef.current?.close();
            onDelete();
          },
        },
      ]
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0],
    });

    return (
      <Animated.View style={[styles.rightActionContainer, { transform: [{ translateX }] }]}>
        <RectButton
          style={[styles.deleteButton, { backgroundColor: theme.error }]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={22} color={theme.white} />
          <Text style={[styles.deleteText, { color: theme.white }]}>
            {t('common.delete')}
          </Text>
        </RectButton>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  rightActionContainer: {
    width: 80,
    flexDirection: 'row',
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteText: {
    fontSize: fontSize.xs,
    fontFamily: fonts.ui,
    marginTop: spacing.xs,
  },
});
