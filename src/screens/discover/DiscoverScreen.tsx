import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Globe, ArrowUpRight, Crosshair, Search, SlidersHorizontal } from 'lucide-react-native';
import TopNav from '@components/layout/TopNav';
import BusinessCard from '@features/discover/components/BusinessCard';
import AiSuggestSheet from '@features/discover/components/AiSuggestSheet';
import DetectLocationSheet from '@features/discover/components/DetectLocationSheet';
import DiscoverFiltersSheet, { type DiscoverFilters } from '@features/discover/components/DiscoverFiltersSheet';
import { MOCK_BUSINESSES } from '@features/discover/data/mockBusinesses';
import type { DiscoverStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<DiscoverStackParamList>;

export default function DiscoverScreen() {
  const navigation = useNavigation<Nav>();

  const [aiSheetVisible, setAiSheetVisible] = useState(false);
  const [locationSheetVisible, setLocationSheetVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [location, setLocation] = useState('Lagos, Nigeria');
  const [searchQuery, setSearchQuery] = useState('');

  const businesses = searchQuery.trim()
    ? MOCK_BUSINESSES.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : MOCK_BUSINESSES;

  function handleApplyFilters(_filters: DiscoverFilters) {
    // wire to real filtering once API is connected
  }

  return (
    <View style={styles.root}>
      <TopNav />

      <FlatList
        data={businesses}
        keyExtractor={b => b.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <BusinessCard
            business={item}
            onPress={() => navigation.navigate('ViewBusiness', { businessId: item.id })}
            onPressLocate={() => setLocationSheetVisible(true)}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.topRow}>
              <TouchableOpacity
                style={styles.aiPill}
                onPress={() => setAiSheetVisible(true)}
                activeOpacity={0.8}
              >
                <Globe size={16} color="#7C7212" strokeWidth={2} />
                <Text style={styles.aiPillText}>Ai place suggestions</Text>
                <ArrowUpRight size={15} color="#2A5C40" strokeWidth={2.2} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.locationPill}
                onPress={() => setLocationSheetVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.locationIconRing}>
                  <Crosshair size={13} color="#2A5C40" strokeWidth={2} />
                </View>
                <Text style={styles.locationText} numberOfLines={1}>
                  {location}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Search size={17} color="#9CA3AF" strokeWidth={2} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search Business..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                />
              </View>

              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => setFiltersVisible(true)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Open filters"
              >
                <SlidersHorizontal size={18} color="#1A1A1A" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </>
        }
      />

      <AiSuggestSheet
        visible={aiSheetVisible}
        onClose={() => setAiSheetVisible(false)}
        onSubmit={() => setAiSheetVisible(false)}
      />

      <DetectLocationSheet
        visible={locationSheetVisible}
        onClose={() => setLocationSheetVisible(false)}
        onSelectLocation={setLocation}
      />

      <DiscoverFiltersSheet
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        onApply={handleApplyFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },
  list: {
    paddingTop: 14,
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FBF3D5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
  },
  aiPillText: {
    fontSize: 13,
    fontFamily: 'Roboto_400Bold',
    color: '#7C7212',
  },
  locationPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  locationIconRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#2A5C40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
    padding: 0,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
