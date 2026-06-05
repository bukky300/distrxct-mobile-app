import React from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LocationsStackParamList } from '@navigation/types';
import Screen from '@components/layout/Screen';
import LocationCard from '@features/locations/components/LocationCard';
import Loader from '@components/ui/Loader';
import EmptyState from '@components/ui/EmptyState';
import { useLocations } from '@features/locations/hooks/useLocations';
import { colors, spacing } from '@config/theme';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<LocationsStackParamList, 'LocationFeed'>;

export default function LocationFeedScreen({ navigation }: Props) {
  const { locations, loading, loadMore, hasNextPage, refetch } = useLocations();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Search', {})} style={styles.headerBtn}>
          <Ionicons name="search" size={22} color={colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading && locations.length === 0) return <Loader fullScreen />;

  return (
    <Screen edges={['bottom']}>
      <FlatList
        data={locations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <LocationCard
            location={item}
            onPress={() => navigation.navigate('LocationDetail', { locationId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        onEndReached={() => hasNextPage && loadMore()}
        onEndReachedThreshold={0.4}
        onRefresh={refetch}
        refreshing={loading}
        ListEmptyComponent={
          <EmptyState
            icon="compass-outline"
            title="No locations yet"
            message="Be the first to share an interesting spot!"
          />
        }
        ListFooterComponent={loading && locations.length > 0 ? <Loader size="small" /> : null}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddLocation', {})}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md },
  headerBtn: { marginRight: spacing.sm },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
