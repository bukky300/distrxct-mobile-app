import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Search } from 'lucide-react-native';
import TopNav from '@components/layout/TopNav';
import SettingsHeader from '@features/settings/components/SettingsHeader';
import FAQAccordionItem from '@features/settings/components/FAQAccordionItem';
import { FAQ_DATA } from '@features/settings/data/faqData';

export default function FAQScreen() {
  const [query, setQuery] = useState('');

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ_DATA;
    return FAQ_DATA
      .map(group => ({
        ...group,
        items: group.items.filter(item => item.question.toLowerCase().includes(q)),
      }))
      .filter(group => group.items.length > 0);
  }, [query]);

  return (
    <View className="flex-1 bg-white">
      <TopNav />
      <SettingsHeader title="FAQs" useSafeArea={false} />

      <View className="mx-4 mb-2 flex-row items-center rounded-full border border-hairline bg-surface px-5 py-3">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search"
          placeholderTextColor="#9CA3AF"
          className="flex-1 font-roboto text-base text-[#1A1A1A]"
        />
        <Search size={20} color="#6B7280" strokeWidth={2} />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        {filteredGroups.map(group => (
          <View key={group.category} className="mt-5">
            <Text className="mb-1 font-roboto-bold text-base text-[#1A1A1A]">{group.category}</Text>
            {group.items.map(item => (
              <FAQAccordionItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </View>
        ))}

        {filteredGroups.length === 0 && (
          <Text className="py-8 text-center font-roboto text-base text-muted-light">
            No results for &quot;{query}&quot;
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
