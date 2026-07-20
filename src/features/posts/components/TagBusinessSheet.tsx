import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';
import BusinessPickerList from './BusinessPickerList';
import type { StoreOption } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (store: StoreOption) => void;
}

// Standalone entry point (own Modal) — for embedding inside another sheet
// (e.g. PostActivitySheet), use BusinessPickerList directly instead so only
// one Modal is ever mounted at a time.
export default function TagBusinessSheet({ visible, onClose, onSelect }: Props) {
  function handleSelect(store: StoreOption) {
    onSelect(store);
    onClose();
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Select a Business</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
          <X size={20} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <BusinessPickerList onSelect={handleSelect} />
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
});
