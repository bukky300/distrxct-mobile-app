import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { X, Search, Store } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';

export interface Business {
  id: string;
  name: string;
  address?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (business: Business) => void;
  businesses?: Business[];
}

// Placeholder data — replace with real API call
const MOCK_BUSINESSES: Business[] = [
  { id: '1', name: 'Sitech.ng', address: 'Victoria Island, Lagos' },
  { id: '2', name: 'Beauty and grand', address: 'Ikeja, Lagos' },
  { id: '3', name: 'Monomo', address: 'Lekki Phase 1, Lagos' },
  { id: '4', name: 'The Place Restaurant', address: 'Ojodu, Lagos' },
  { id: '5', name: 'Kilimajaro', address: 'Federal Housing Estate, Road' },
];

export default function TagBusinessSheet({ visible, onClose, onSelect, businesses }: Props) {
  const [query, setQuery] = useState('');
  const data = businesses ?? MOCK_BUSINESSES;

  const filtered = query.trim()
    ? data.filter(b => b.name.toLowerCase().includes(query.toLowerCase()))
    : data;

  function handleSelect(business: Business) {
    onSelect(business);
    onClose();
    setQuery('');
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

      {/* Search */}
      <View style={styles.searchWrap}>
        <Search size={16} color="#9CA3AF" strokeWidth={2} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search business ..."
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
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.businessItem}
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
          >
            <View style={styles.businessIcon}>
              <Store size={20} color="#CC2200" strokeWidth={1.8} />
            </View>
            <Text style={styles.businessName} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No businesses found</Text>
        }
      />
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
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
  businessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  businessIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  empty: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    paddingVertical: 24,
  },
});
