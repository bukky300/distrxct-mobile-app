import React, { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LocationsStackParamList } from '@navigation/types';
import Screen from '@components/layout/Screen';
import Input from '@components/ui/Input';
import LocationCard from '@features/locations/components/LocationCard';
import Loader from '@components/ui/Loader';
import EmptyState from '@components/ui/EmptyState';
import { useLocations } from '@features/locations/hooks/useLocations';
import { spacing } from '@config/theme';
import { useDebounce } from '@hooks/useDebounce';

type Props = NativeStackScreenProps<LocationsStackParamList, 'Search'>;

export default function SearchScreen({ route, navigation }: Props) {
  const [query, setQuery] = useState(route.params?.initialQuery ?? '');
  const debouncedQuery = useDebounce(query, 400);
  const { locations, loading } = useLocations({
    filter: debouncedQuery ? { searchQuery: debouncedQuery } : undefined,
  });

  return (
    <Screen edges={['bottom']}>
      <FlatList
        data={locations}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder="Search locations..."
            autoFocus
          />
        }
        renderItem={({ item }) => (
          <LocationCard
            location={item}
            onPress={() => navigation.navigate('LocationDetail', { locationId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          loading ? <Loader /> : (
            <EmptyState icon="search-outline" title="No results" message="Try a different search term" />
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md },
});
