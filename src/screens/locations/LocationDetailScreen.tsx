import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LocationsStackParamList } from '@navigation/types';
import Screen from '@components/layout/Screen';
import Loader from '@components/ui/Loader';
import Badge from '@components/ui/Badge';
import RatingStars from '@features/locations/components/RatingStars';
import { useLocationDetail } from '@features/locations/hooks/useLocationDetail';
import { useRateLocation } from '@features/locations/hooks/useRateLocation';
import { CATEGORY_LABELS } from '@features/locations/utils/locationHelpers';
import { colors, spacing, typography } from '@config/theme';
import { formatDate, formatRating } from '@utils/formatters';

type Props = NativeStackScreenProps<LocationsStackParamList, 'LocationDetail'>;

export default function LocationDetailScreen({ route, navigation }: Props) {
  const { locationId } = route.params;
  const { location, loading } = useLocationDetail(locationId);
  const { rateLocation, loading: rating } = useRateLocation();

  React.useLayoutEffect(() => {
    if (location) navigation.setOptions({ title: location.name });
  }, [location, navigation]);

  if (loading) return <Loader fullScreen />;
  if (!location) return null;

  return (
    <Screen edges={['bottom']}>
      <ScrollView>
        {location.images?.[0] && (
          <Image source={{ uri: location.images[0] }} style={styles.hero} resizeMode="cover" />
        )}
        <View style={styles.body}>
          <Badge label={CATEGORY_LABELS[location.category] ?? location.category} />
          <Text style={styles.name}>{location.name}</Text>
          {location.address && <Text style={styles.address}>{location.address}</Text>}
          {location.description && <Text style={styles.description}>{location.description}</Text>}

          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>Rating</Text>
            <View style={styles.ratingRow}>
              <RatingStars rating={location.averageRating ?? 0} size={24} readonly />
              <Text style={styles.ratingText}>
                {location.averageRating ? formatRating(location.averageRating) : '—'}
                {' '}({location.ratingCount} ratings)
              </Text>
            </View>
            <Text style={styles.sectionTitle}>Rate this location</Text>
            <RatingStars
              rating={location.myRating ?? 0}
              size={32}
              onRate={score => rateLocation(locationId, score)}
            />
          </View>

          <Text style={styles.meta}>
            Added by @{location.createdBy?.username} · {formatDate(location.createdAt)}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', height: 240 },
  body: { padding: spacing.lg },
  name: { ...typography.h2, color: colors.text, marginTop: spacing.sm, marginBottom: spacing.xs },
  address: { ...typography.body, color: colors.textMuted, marginBottom: spacing.md },
  description: { ...typography.body, color: colors.text, lineHeight: 26, marginBottom: spacing.lg },
  ratingSection: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h4, color: colors.text, marginBottom: spacing.sm, marginTop: spacing.md },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  ratingText: { ...typography.body, color: colors.textMuted },
  meta: { ...typography.caption, color: colors.textMuted, marginTop: spacing.lg },
});
