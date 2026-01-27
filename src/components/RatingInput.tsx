import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fonts } from '../constants';

type RatingInputProps = {
  value: number;
  onChange: (value: number) => void;
};

const MAX_RATING = 5;
const STAR_SIZE = 22;

function getStarIcon(starIndex: number, value: number) {
  if (value >= starIndex) {
    return 'star';
  }
  if (value >= starIndex - 0.5) {
    return 'star-half';
  }
  return 'star-outline';
}

function formatRating(value: number) {
  if (value % 1 === 0) {
    return value.toFixed(0);
  }
  return value.toFixed(1);
}

export function RatingInput({ value, onChange }: RatingInputProps) {
  const ratingValue = Math.max(0, Math.min(MAX_RATING, value));

  return (
    <View style={styles.container}>
      <View style={styles.starRow}>
        {Array.from({ length: MAX_RATING }).map((_, index) => {
          const starValue = index + 1;
          const iconName = getStarIcon(starValue, ratingValue);

          return (
            <View key={starValue} style={styles.starWrapper}>
              <Ionicons name={iconName} size={STAR_SIZE} color={colors.primary} />
              <View style={styles.starTouchRow}>
                <Pressable
                  style={styles.starHalf}
                  onPress={() => onChange(starValue - 0.5)}
                />
                <Pressable
                  style={styles.starHalf}
                  onPress={() => onChange(starValue)}
                />
              </View>
            </View>
          );
        })}
      </View>
      <Text style={styles.valueText}>
        {ratingValue > 0 ? `${formatRating(ratingValue)} / 5` : 'Not rated'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  starWrapper: {
    width: STAR_SIZE + 6,
    height: STAR_SIZE + 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starTouchRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  starHalf: {
    flex: 1,
  },
  valueText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.ui,
    color: colors.textSecondary,
  },
});
