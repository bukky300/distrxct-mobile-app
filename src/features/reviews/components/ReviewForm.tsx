import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { X, ChevronLeft, Search, MapPin, Star, Store } from 'lucide-react-native';
import { useReviewableBusinesses } from '../hooks/useReviewableBusinesses';
import { useCreateReview } from '../hooks/useCreateReview';
import { useToastStore } from '@features/ui/store/toastStore';
import type { ReviewBusiness, Review } from '../types';

interface Props {
  onBack: () => void;
  onClose: () => void;
  onReviewed?: (review: Review) => void;
}

// Pure content, no Modal/BottomSheet of its own — embedded inside CreateActivitySheet's
// single sheet (nesting a second RN Modal here locks the app up, same issue documented
// in posts/components/BusinessPickerList.tsx).
export default function ReviewForm({ onBack, onClose, onReviewed }: Props) {
  const [selectedBusiness, setSelectedBusiness] = useState<ReviewBusiness | null>(null);

  function handleClose() {
    setSelectedBusiness(null);
    onClose();
  }

  if (!selectedBusiness) {
    return (
      <BusinessPicker onBack={onBack} onClose={handleClose} onSelect={setSelectedBusiness} />
    );
  }

  return (
    <ReviewDetailsForm
      business={selectedBusiness}
      onBack={() => setSelectedBusiness(null)}
      onClose={handleClose}
      onReviewed={onReviewed}
    />
  );
}

// ─── Step 1: pick a business ────────────────────────────────────────────────────

function BusinessPicker({
  onBack,
  onClose,
  onSelect,
}: {
  onBack: () => void;
  onClose: () => void;
  onSelect: (b: ReviewBusiness) => void;
}) {
  const [query, setQuery] = useState('');
  const { businesses, loading, error } = useReviewableBusinesses();

  const filtered = query.trim()
    ? businesses.filter(b => b.name.toLowerCase().includes(query.trim().toLowerCase()))
    : businesses;

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Review</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
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
      {loading ? (
        <ActivityIndicator color="#2A5C40" style={styles.loading} />
      ) : error ? (
        <Text style={styles.empty}>Couldn&apos;t load businesses: {error.message}</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <BusinessCard business={item} onPress={() => onSelect(item)} />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No businesses found</Text>}
        />
      )}
    </>
  );
}

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

        {business.address ? (
          <View style={cardStyles.addressRow}>
            <MapPin size={12} color="#9CA3AF" strokeWidth={2} />
            <Text style={cardStyles.address} numberOfLines={1}>{business.address}</Text>
          </View>
        ) : null}

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

// ─── Step 2: rating + review text ───────────────────────────────────────────────

function ReviewDetailsForm({
  business,
  onBack,
  onClose,
  onReviewed,
}: {
  business: ReviewBusiness;
  onBack: () => void;
  onClose: () => void;
  onReviewed?: (review: Review) => void;
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { createReview, submitting } = useCreateReview();
  const showToast = useToastStore(s => s.showToast);

  const canSubmit = rating > 0 && body.trim().length > 0;

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    try {
      const review = await createReview({ storeId: business.id, rating, title: title.trim(), content: body.trim() });
      onReviewed?.(review);
      onClose();
      showToast('Your review has been posted.', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Couldn't post your review. Please try again.", 'error');
    }
  }

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Review</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
          <X size={20} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={formStyles.scroll}
      >
        {/* Selected business */}
        <View style={formStyles.businessCard}>
          {business.imageUri ? (
            <Image source={{ uri: business.imageUri }} style={formStyles.businessThumbImage} resizeMode="cover" />
          ) : (
            <View style={formStyles.businessThumb}>
              <Store size={22} color="#CC2200" strokeWidth={1.8} />
            </View>
          )}
          <View style={formStyles.businessInfo}>
            <Text style={formStyles.businessName}>{business.name}</Text>
            {business.address ? (
              <View style={formStyles.addressRow}>
                <MapPin size={11} color="#9CA3AF" strokeWidth={2} />
                <Text style={formStyles.businessAddress} numberOfLines={1}>
                  {business.address}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Star rating */}
        <View style={formStyles.ratingSection}>
          <Text style={formStyles.ratingLabel}>Select rating</Text>
          <View style={formStyles.stars}>
            {Array.from({ length: 5 }, (_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setRating(i + 1)}
                activeOpacity={0.7}
                style={formStyles.starBtn}
                disabled={submitting}
              >
                <Star
                  size={32}
                  color={i < rating ? '#FACC15' : '#D1D5DB'}
                  fill={i < rating ? '#FACC15' : 'none'}
                  strokeWidth={1.5}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title */}
        <TextInput
          style={formStyles.input}
          placeholder="Title"
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
          maxLength={120}
          editable={!submitting}
        />

        {/* Body */}
        <TextInput
          style={[formStyles.input, formStyles.textarea]}
          placeholder="Write your review here"
          placeholderTextColor="#9CA3AF"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          maxLength={3000}
          editable={!submitting}
        />
        <Text style={formStyles.charCount}>{body.length} / 3000</Text>
      </ScrollView>

      {/* Submit */}
      <TouchableOpacity
        style={[formStyles.submitBtn, canSubmit && !submitting && formStyles.submitBtnActive]}
        onPress={handleSubmit}
        activeOpacity={0.8}
        disabled={!canSubmit || submitting}
      >
        <Text style={[formStyles.submitText, canSubmit && !submitting && formStyles.submitTextActive]}>
          {submitting ? 'Posting…' : 'Post review'}
        </Text>
      </TouchableOpacity>
    </>
  );
}

// ─── Shared header/search/list styles ───────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 16,
    gap: 4,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
    marginLeft: 4,
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
  loading: {
    paddingVertical: 24,
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

const formStyles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 14,
  },
  businessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  businessThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessThumbImage: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  businessInfo: {
    flex: 1,
    gap: 3,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  businessAddress: {
    flex: 1,
    fontSize: 12,
    color: '#9CA3AF',
  },
  ratingSection: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#4B5563',
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  starBtn: {
    padding: 4,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
    minHeight: 48,
  },
  textarea: {
    minHeight: 110,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: -8,
  },
  submitBtn: {
    marginHorizontal: 20,
    marginTop: 8,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnActive: {
    backgroundColor: '#2A5C40',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#9CA3AF',
  },
  submitTextActive: {
    color: '#FFFFFF',
  },
});
