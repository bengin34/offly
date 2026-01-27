import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks';

export function Background() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={styles.frame} />
      <View style={styles.washTop} />
      <View style={styles.washBottom} />
      <View style={styles.washCenter} />

      <View style={styles.timelineLine} />
      <View style={styles.timelineDotLarge} />
      <View style={styles.timelineDotSmall} />
      <View style={styles.timelineDotTiny} />

      <View style={styles.cornerTopRight} />
      <View style={styles.cornerBottomLeft} />
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
    },
    frame: {
      position: 'absolute',
      top: 24,
      right: 24,
      bottom: 24,
      left: 24,
      borderWidth: 1,
      borderRadius: 22,
      borderColor: theme.borderLight,
      opacity: theme.isDark ? 0.12 : 0.28,
    },
    washTop: {
      position: 'absolute',
      top: -120,
      right: -90,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: theme.accentSoft,
      opacity: theme.isDark ? 0.14 : 0.3,
    },
    washBottom: {
      position: 'absolute',
      bottom: -180,
      left: -140,
      width: 320,
      height: 320,
      borderRadius: 160,
      backgroundColor: theme.primaryLight,
      opacity: theme.isDark ? 0.08 : 0.18,
    },
    washCenter: {
      position: 'absolute',
      top: 160,
      left: '25%',
      width: 240,
      height: 180,
      borderRadius: 120,
      backgroundColor: theme.backgroundSecondary,
      opacity: theme.isDark ? 0.18 : 0.4,
    },
    timelineLine: {
      position: 'absolute',
      top: 72,
      bottom: 72,
      left: 44,
      width: 1,
      backgroundColor: theme.borderLight,
      opacity: theme.isDark ? 0.25 : 0.45,
    },
    timelineDotLarge: {
      position: 'absolute',
      top: 160,
      left: 39,
      width: 10,
      height: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.backgroundSecondary,
      opacity: theme.isDark ? 0.5 : 0.7,
    },
    timelineDotSmall: {
      position: 'absolute',
      top: 320,
      left: 41,
      width: 6,
      height: 6,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.backgroundSecondary,
      opacity: theme.isDark ? 0.5 : 0.7,
    },
    timelineDotTiny: {
      position: 'absolute',
      bottom: 160,
      left: 42,
      width: 5,
      height: 5,
      borderRadius: 2.5,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.backgroundSecondary,
      opacity: theme.isDark ? 0.5 : 0.7,
    },
    cornerTopRight: {
      position: 'absolute',
      top: 40,
      right: 40,
      width: 56,
      height: 56,
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderColor: theme.border,
      opacity: theme.isDark ? 0.2 : 0.35,
    },
    cornerBottomLeft: {
      position: 'absolute',
      bottom: 40,
      left: 40,
      width: 56,
      height: 56,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderColor: theme.border,
      opacity: theme.isDark ? 0.2 : 0.35,
    },
  });
