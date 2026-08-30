import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { X, ChevronLeft, Star, MapPin, Store } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';
import type { ReviewBusiness } from '../types';

interface Props {
  visible: boolean;
  business: ReviewBusiness;
  onClose: () => void;
  onBack: () => void;
  onSubmit: (data: { businessId: string; rating: number; title: string; body: string }) => void;
  loading?: boolean;
}

export default function ReviewFormSheet({
  visible,
  business,
  onClose,
  onBack,
  onSubmit,
  loading = false,
}: Props) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const canSubmit = rating > 0;

  function handleSubmit() {
    if (!canSubmit || loading) return;
    onSubmit({ businessId: business.id, rating, title: title.trim(), body: body.trim() });
    reset();
  }

  function handleClose() {
    reset();
    onClose();
  }

  function reset() {
    setRating(0);
    setTitle('');
    setBody('');
  }

  return (
    <BottomSheet visible={visible} onClose={handleClose}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Review</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
          <X size={20} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        {/* Selected business */}
        <View style={styles.businessCard}>
          <View style={styles.businessThumb}>
            <Store size={22} color="#CC2200" strokeWidth={1.8} />
          </View>
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{business.name}</Text>
            <View style={styles.addressRow}>
              <MapPin size={11} color="#9CA3AF" strokeWidth={2} />
              <Text style={styles.businessAddress} numberOfLines={1}>
                {business.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Star rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingLabel}>Select rating</Text>
          <View style={styles.stars}>
            {Array.from({ length: 5 }, (_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setRating(i + 1)}
                activeOpacity={0.7}
                style={styles.starBtn}
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
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
          maxLength={120}
        />

        {/* Body */}
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Write your review here"
          placeholderTextColor="#9CA3AF"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          maxLength={1000}
        />
      </ScrollView>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, canSubmit && !loading && styles.submitBtnActive]}
        onPress={handleSubmit}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={[styles.submitText, canSubmit && !loading && styles.submitTextActive]}>
          {loading ? 'Posting…' : 'Post review'}
        </Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}

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
