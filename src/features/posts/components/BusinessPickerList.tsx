import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Search, Store } from 'lucide-react-native';
import { useStores } from '../hooks/useStores';
import type { StoreOption } from '../types';

interface Props {
  onSelect: (store: StoreOption) => void;
}

// Pure list content, no Modal/BottomSheet of its own — meant to be embedded inside
// whichever single sheet is currently on screen, since nesting two RN Modals at once
// (e.g. this inside PostActivitySheet's own sheet) causes the app to lock up.
export default function BusinessPickerList({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const { stores, loading, error } = useStores();

  const filtered = query.trim()
    ? stores.filter(s => s.name.toLowerCase().includes(query.trim().toLowerCase()))
    : stores;

  return (
    <>
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
            <TouchableOpacity
              style={styles.businessItem}
              onPress={() => onSelect(item)}
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
          ListEmptyComponent={<Text style={styles.empty}>No businesses found</Text>}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
  loading: {
    paddingVertical: 24,
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
