import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useBusinessDetail } from '@features/discover/hooks/useBusinessDetail';
import type { DiscoverStackParamList } from '@navigation/types';

type Route = RouteProp<DiscoverStackParamList, 'PhotoGallery'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAP = 8;
const TILE_SIZE = (SCREEN_WIDTH - 16 * 2 - GAP * 2) / 3;

export default function PhotoGalleryScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();

  const { business, loading, error, refetch } = useBusinessDetail(params.businessId);

  if (!business) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={navigation.goBack} style={styles.backBtn} activeOpacity={0.7}>
            <ChevronLeft size={24} color="#1A1A1A" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerWrap}>
          {loading ? (
            <ActivityIndicator color="#2A5C40" />
          ) : error ? (
            <>
              <Text style={styles.emptyText}>Couldn&apos;t load these photos.</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()} activeOpacity={0.85}>
                <Text style={styles.retryBtnText}>Retry</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.emptyText}>Business not found.</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backBtn} activeOpacity={0.7}>
          <ChevronLeft size={24} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>{business.name} photos</Text>
      </View>

      <FlatList
        data={business.images}
        keyExtractor={(_, i) => String(i)}
        numColumns={3}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: GAP }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={item} style={styles.tile} resizeMode="cover" />
        )}
        ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: '#2A5C40',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto_400Bold',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 8,
  },
});
