import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import type { ReviewSummary } from '../types';

interface Props {
  summary: ReviewSummary;
}

export default function ReviewSummaryCard({ summary }: Props) {
  const maxCount = Math.max(...summary.breakdown.map(row => row.count), 1);

  return (
    <View style={styles.card}>
      <View style={styles.barsCol}>
        {summary.breakdown.map(row => (
          <View key={row.star} style={styles.barRow}>
            <Text style={styles.starLabel}>{row.star}</Text>
            <View style={styles.track}>
              <View
                style={[styles.fill, { width: `${(row.count / maxCount) * 100}%` }]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.statsCol}>
        <View style={styles.averageRow}>
          <Text style={styles.averageText}>{summary.average.toFixed(1)}</Text>
          <Star size={18} color="#FACC15" fill="#FACC15" strokeWidth={1.5} />
        </View>
        <Text style={styles.reviewsText}>{summary.total} Reviews</Text>
        <Text style={styles.percentText}>{summary.percentRecommended}%</Text>
        <Text style={styles.recommendedText}>Recommended</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 18,
    gap: 18,
  },
  barsCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starLabel: {
    width: 10,
    fontSize: 13,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#FACC15',
  },
  statsCol: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  averageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  averageText: {
    fontSize: 28,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  reviewsText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
  percentText: {
    fontSize: 15,
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
    marginTop: 6,
  },
  recommendedText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
});
