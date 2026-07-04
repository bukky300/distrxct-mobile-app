import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Star, Handshake } from 'lucide-react-native';
import type { BusinessReview } from '../types';

interface Props {
  review: BusinessReview;
}

export default function ReviewListItem({ review }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {review.user.avatarUri ? (
          <Image source={{ uri: review.user.avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <Text style={styles.name}>{review.user.name}</Text>
        <Text style={styles.separator}>|</Text>
        <Text style={styles.timestamp}>{review.timestamp}</Text>
      </View>

      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={15}
            color={i < review.rating ? '#FACC15' : '#D1D5DB'}
            fill={i < review.rating ? '#FACC15' : 'none'}
            strokeWidth={1.5}
          />
        ))}
      </View>

      <Text style={styles.comment}>{review.comment}</Text>

      <View style={styles.helpfulRow}>
        <Handshake size={16} color="#9CA3AF" strokeWidth={1.8} />
        <Text style={styles.helpfulCount}>{review.helpfulCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#2A5C40',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1D5DB',
  },
  name: {
    fontSize: 15,
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  separator: {
    color: '#D1D5DB',
  },
  timestamp: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
  },
  comment: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Roboto_400Regular',
    lineHeight: 20,
  },
  helpfulRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpfulCount: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
});
