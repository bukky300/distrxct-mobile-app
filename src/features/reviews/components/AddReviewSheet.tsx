import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { X, Search, MapPin, Star, Store } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';
import ReviewFormSheet from './ReviewFormSheet';

export interface ReviewBusiness {
  id: string;
  name: string;
  address: string;
  isOpen: boolean;
  rating: number;
  ratingCount: number;
  imageUri?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onReviewSubmit: (data: {
    businessId: string;
    rating: number;
    title: string;
    body: string;
  }) => void;
  businesses?: ReviewBusiness[];
  loading?: boolean;
}

// Placeholder data — replace with real API call
const MOCK_BUSINESSES: ReviewBusiness[] = [
  { id: '1', name: 'Kilimajaro', address: 'Federal Housing Estate, Road', isOpen: true, rating: 3, ratingCount: 198 },
  { id: '2', name: 'Kilimajaro', address: 'Federal Housing Estate, Road', isOpen: true, rating: 3, ratingCount: 198 },
  { id: '3', name: 'Kilimajaro', address: 'Federal Housing Estate, Road', isOpen: false, rating: 3, ratingCount: 198 },
  { id: '4', name: 'Kilimajaro', address: 'Federal Housing Estate, Road', isOpen: true, rating: 3, ratingCount: 198 },
];

export default function AddReviewSheet({
  visible,
  onClose,
  onReviewSubmit,
  businesses,
  loading,
}: Props) {
  const [query, setQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<ReviewBusiness | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  const data = businesses ?? MOCK_BUSINESSES;
  const filtered = query.trim()
    ? data.filter(b => b.name.toLowerCase().includes(query.toLowerCase()))
    : data;

  function handleSelectBusiness(b: ReviewBusiness) {
    setSelectedBusiness(b);
    setFormVisible(true);
  }

  function handleClose() {
    setQuery('');
    setSelectedBusiness(null);
    onClose();
  }

  return (
    <>
      <BottomSheet visible={visible} onClose={handleClose}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add Review</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
            <X size={20} color="#1A1A1A" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Search size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Business..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>

        {/* Business list */}
        <FlatList
          data={filtered}
          keyExtractor={(item, idx) => `${item.id}-${idx}`}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <BusinessCard business={item} onPress={() => handleSelectBusiness(item)} />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No businesses found</Text>
          }
        />
      </BottomSheet>

      {selectedBusiness && (
        <ReviewFormSheet
          visible={formVisible}
          business={selectedBusiness}
          onClose={() => { setFormVisible(false); setSelectedBusiness(null); }}
          onBack={() => { setFormVisible(false); setSelectedBusiness(null); }}
          onSubmit={data => {
            onReviewSubmit(data);
            setFormVisible(false);
            setSelectedBusiness(null);
            handleClose();
          }}
          loading={loading}
        />
      )}
    </>
  );
}

// ─── Business Card ─────────────────────────────────────────────────────────────

function BusinessCard({ business, onPress }: { business: ReviewBusiness; onPress: () => void }) {
  const filledStars = Math.round(business.rating);

  return (
    <TouchableOpacity style={cardStyles.card} onPress={onPress} activeOpacity={0.75}>
      {/* Thumbnail */}
      {business.imageUri ? (
        <Image source={{ uri: business.imageUri }} style={cardStyles.thumb} resizeMode="cover" />
      ) : (
        <View style={cardStyles.thumbPlaceholder}>
          <Store size={22} color="#CC2200" strokeWidth={1.8} />
        </View>
      )}

      {/* Info */}
      <View style={cardStyles.info}>
        <View style={cardStyles.row}>
          <Text style={cardStyles.name} numberOfLines={1}>{business.name}</Text>
          <Text style={[cardStyles.status, business.isOpen ? cardStyles.open : cardStyles.closed]}>
            {business.isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>

        <View style={cardStyles.addressRow}>
          <MapPin size={12} color="#9CA3AF" strokeWidth={2} />
          <Text style={cardStyles.address} numberOfLines={1}>{business.address}</Text>
        </View>

        <View style={cardStyles.ratingRow}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={13}
              color={i < filledStars ? '#FACC15' : '#D1D5DB'}
              fill={i < filledStars ? '#FACC15' : 'none'}
              strokeWidth={1.5}
            />
          ))}
          <Text style={cardStyles.ratingText}>
            {business.rating.toFixed(1)} ({business.ratingCount})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 17,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: 20,
    marginVertical: 14,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    padding: 0,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  empty: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    paddingVertical: 24,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
  },
  thumbPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  status: {
    fontSize: 12,
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
    fontSize: 12,
    color: '#9CA3AF',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#6B7280',
    marginLeft: 4,
  },
});
