import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@config/theme';
import Badge from '@components/ui/Badge';
import RatingStars from './RatingStars';
import { CATEGORY_LABELS } from '../utils/locationHelpers';
import { formatRating } from '@utils/formatters';

interface Location {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  category: string;
  images: string[];
  averageRating?: number | null;
  ratingCount: number;
}

interface Props {
  location: Location;
  onPress: () => void;
}

export default function LocationCard({ location, onPress }: Props) {
  const coverImage = location.images[0];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {coverImage && (
        <Image source={{ uri: coverImage }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.body}>
        <View style={styles.row}>
          <Badge label={CATEGORY_LABELS[location.category] ?? location.category} />
        </View>
        <Text style={styles.name} numberOfLines={1}>{location.name}</Text>
        {location.address && (
          <Text style={styles.address} numberOfLines={1}>{location.address}</Text>
        )}
        <View style={styles.rating}>
          <RatingStars rating={location.averageRating ?? 0} size={14} readonly />
          <Text style={styles.ratingText}>
            {location.averageRating ? formatRating(location.averageRating) : 'No ratings'}
            {location.ratingCount > 0 && ` (${location.ratingCount})`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: '100%', height: 160 },
  body: { padding: spacing.md },
  row: { marginBottom: spacing.xs },
  name: { ...typography.h4, color: colors.text, marginBottom: spacing.xs / 2 },
  address: { ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.sm },
  rating: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  ratingText: { ...typography.caption, color: colors.textMuted },
});
