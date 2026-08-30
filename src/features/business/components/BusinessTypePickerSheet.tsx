import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, SectionList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Search } from 'lucide-react-native';
import { useStoreTypes } from '../hooks/useStoreTypes';
import type { BusinessTypeSelection, StoreCategoryOption } from '../types';

interface Props {
  onSelect: (selection: BusinessTypeSelection) => void;
}

interface Section {
  title: string;
  storeTypeId: string;
  storeTypeName: string;
  data: StoreCategoryOption[];
}

// Pure content, no Modal/BottomSheet of its own — embedded inside whichever single sheet
// (Create Business form or Edit Business Detail) is currently on screen. Nesting a second
// RN Modal here locks the app up (see posts/components/BusinessPickerList.tsx).
export default function BusinessTypePickerSheet({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const { storeTypes, loading, error } = useStoreTypes();

  const sections: Section[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return storeTypes
      .map(type => {
        const typeMatches = type.name.toLowerCase().includes(q);
        const categories = typeMatches ? type.categories : type.categories.filter(c => c.name.toLowerCase().includes(q));
        return { title: type.name, storeTypeId: type.id, storeTypeName: type.name, data: categories };
      })
      .filter(section => section.data.length > 0);
  }, [storeTypes, query]);

  return (
    <>
      <Text className="mb-3 px-5 font-roboto-bold text-base text-[#1A1A1A]">Select Business type</Text>

      <View className="mx-5 mb-3 flex-row items-center rounded-2xl border border-hairline bg-surface px-4 py-3">
        <Search size={16} color="#9CA3AF" strokeWidth={2} />
        <TextInput
          className="ml-2 flex-1 font-roboto text-base text-[#1A1A1A]"
          placeholder="Search business type..."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      {loading ? (
        <ActivityIndicator color="#2A5C40" className="py-6" />
      ) : error ? (
        <Text className="px-5 py-6 text-center font-roboto text-sm text-muted-light">
          Couldn&apos;t load business types: {error.message}
        </Text>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text className="mb-2 mt-4 font-roboto-bold text-base text-[#1A1A1A]">{section.title}</Text>
          )}
          renderItem={({ item, section }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              className="border-b border-hairline py-3"
              onPress={() =>
                onSelect({
                  storeTypeId: (section as Section).storeTypeId,
                  storeTypeName: (section as Section).storeTypeName,
                  categoryId: item.id,
                  categoryName: item.name,
                })
              }
            >
              <Text className="font-roboto text-base text-[#1A1A1A]">{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className="px-1 py-6 text-center font-roboto text-sm text-muted-light">No matches found</Text>
          }
        />
      )}
    </>
  );
}
