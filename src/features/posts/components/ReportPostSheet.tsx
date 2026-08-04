import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { X, ChevronDown } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';
import type { ReportReason } from '../types';

const REPORT_REASONS: ReportReason[] = [
  'SPAM',
  'INAPPROPRIATE',
  'HARASSMENT',
  'HATE_SPEECH',
  'VIOLENCE',
  'NUDITY',
  'FALSE_INFORMATION',
  'SCAM',
  'OTHER',
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason, details: string) => void;
  loading?: boolean;
}

export default function ReportPostSheet({ visible, onClose, onSubmit, loading = false }: Props) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState('');
  const [reasonPickerVisible, setReasonPickerVisible] = useState(false);

  const canSubmit = reason !== null;

  function handleSubmit() {
    if (!canSubmit || loading) return;
    onSubmit(reason!, details.trim());
    reset();
  }

  function handleClose() {
    reset();
    onClose();
  }

  function reset() {
    setReason(null);
    setDetails('');
    setReasonPickerVisible(false);
  }

  return (
    <BottomSheet visible={visible} onClose={handleClose}>
      {reasonPickerVisible ? (
        <>
          <View style={pickerStyles.header}>
            <Text style={pickerStyles.title}>Select Reasons</Text>
          </View>
          <FlatList
            data={REPORT_REASONS}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[pickerStyles.item, reason === item && pickerStyles.itemSelected]}
                onPress={() => { setReason(item); setReasonPickerVisible(false); }}
                activeOpacity={0.65}
              >
                <Text style={[pickerStyles.itemText, reason === item && pickerStyles.itemTextSelected]}>
                  {item.replace(/_/g, ' ')}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={pickerStyles.list}
          />
        </>
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Report Post</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color="#1A1A1A" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.question}>Are you sure you want to report this post?</Text>

            {/* Reason selector */}
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setReasonPickerVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.selectorText, reason && styles.selectorTextSelected]}>
                {reason ? reason.replace(/_/g, ' ') : 'Select reason'}
              </Text>
              <ChevronDown size={18} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>

            {/* Details */}
            <TextInput
              style={styles.textarea}
              placeholder="Details..."
              placeholderTextColor="#9CA3AF"
              value={details}
              onChangeText={setDetails}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, canSubmit && !loading && styles.submitBtnActive]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={[styles.submitText, canSubmit && !loading && styles.submitTextActive]}>
              {loading ? 'Submitting…' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  body: {
    paddingHorizontal: 20,
    gap: 14,
    paddingBottom: 12,
  },
  question: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#4B5563',
    lineHeight: 20,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: '#FFFFFF',
  },
  selectorText: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  selectorTextSelected: {
    color: '#1A1A1A',
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
  },
  textarea: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: '#1A1A1A',
    minHeight: 110,
    textAlignVertical: 'top',
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

const pickerStyles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  list: {
    paddingBottom: 8,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  itemSelected: {
    backgroundColor: '#F0FDF4',
  },
  itemText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#374151',
    letterSpacing: 0.2,
  },
  itemTextSelected: {
    color: '#2A5C40',
    fontWeight: '400',
  },
});
