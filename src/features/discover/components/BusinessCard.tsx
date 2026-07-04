import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Star, LocateFixed } from 'lucide-react-native';
import type { Business } from '../types';

interface Props {
  business: Business;
  onPress?: () => void;
  onPressLocate?: () => void;
}

export default function BusinessCard({ business, onPress, onPressLocate }: Props) {
  const filledStars = Math.round(business.rating);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrapper}>
        <Image source={business.coverImage} style={styles.image} resizeMode="cover" />
        <TouchableOpacity
          style={styles.locateBtn}
          onPress={onPressLocate}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`View ${business.name} on map`}
        >
          <LocateFixed size={16} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>{business.name}</Text>
          <Text style={[styles.status, business.isOpen ? styles.open : styles.closed]}>
            {business.isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>

        <View style={styles.addressRow}>
          <MapPin size={12} color="#9CA3AF" strokeWidth={2} />
          <Text style={styles.address} numberOfLines={1}>{business.address}</Text>
        </View>

        <View style={styles.ratingRow}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={13}
              color={i < filledStars ? '#FACC15' : '#D1D5DB'}
              fill={i < filledStars ? '#FACC15' : 'none'}
              strokeWidth={1.5}
            />
          ))}
          <Text style={styles.ratingText}>
            {business.rating.toFixed(1)} ({business.ratingCount})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  locateBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 14,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  status: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
  },
  open: {
    color: '#16A34A',
  },
  closed: {
    color: '#DC2626',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  address: {
    flex: 1,
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#6B7280',
    marginLeft: 4,
  },
});
