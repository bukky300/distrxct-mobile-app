import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@config/theme';
import { RATING } from '@config/constants';

interface Props {
  rating: number;
  maxRating?: number;
  size?: number;
  onRate?: (score: number) => void;
  readonly?: boolean;
}

export default function RatingStars({
  rating,
  maxRating = RATING.MAX,
  size = 20,
  onRate,
  readonly = false,
}: Props) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <View style={styles.row}>
      {stars.map(star => (
        <TouchableOpacity
          key={star}
          onPress={() => !readonly && onRate?.(star)}
          disabled={readonly}
          activeOpacity={0.7}
          style={styles.star}
        >
          <Ionicons
            name={star <= Math.round(rating) ? 'star' : 'star-outline'}
            size={size}
            color={star <= Math.round(rating) ? colors.starFilled : colors.starEmpty}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  star: { marginRight: spacing.xs / 2 },
});
