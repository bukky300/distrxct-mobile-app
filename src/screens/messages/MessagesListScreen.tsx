import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TopNav from '@components/layout/TopNav';
import ConversationRow from '@features/messages/components/ConversationRow';
import { MOCK_CONVERSATIONS } from '@features/messages/data/mockConversations';
import type { MessagesStackParamList } from '@navigation/types';

type NavProp = NativeStackNavigationProp<MessagesStackParamList>;

export default function MessagesListScreen() {
  const navigation = useNavigation<NavProp>();
  const [query, setQuery] = useState('');

  const totalUnread = useMemo(
    () => MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unreadCount, 0),
    [],
  );

  const filteredConversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_CONVERSATIONS;
    return MOCK_CONVERSATIONS.filter(c => c.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <View className="flex-1 bg-white">
      <TopNav />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="mt-2 flex-row items-center gap-2 px-4">
          <Text className="font-roboto-bold text-3xl text-[#1A1A1A]">Messages</Text>
          {totalUnread > 0 && (
            <View className="h-7 min-w-[28px] items-center justify-center rounded-full bg-red-500 px-2">
              <Text className="font-roboto-bold text-sm text-white">{totalUnread}</Text>
            </View>
          )}
        </View>

        {/* Search */}
        <View className="mx-4 mt-6 flex-row items-center rounded-full border border-hairline bg-surface px-5 py-3.5">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            className="flex-1 font-roboto text-base text-[#1A1A1A]"
          />
          <Search size={20} color="#6B7280" strokeWidth={2} />
        </View>

        {/* List */}
        <View className="mt-5 px-4">
          {filteredConversations.map(conversation => (
            <ConversationRow
              key={conversation.id}
              conversation={conversation}
              onPress={() => navigation.navigate('Chat', { conversationId: conversation.id })}
            />
          ))}

          {filteredConversations.length === 0 && (
            <Text className="py-8 text-center font-roboto text-base text-muted-light">
              No conversations match &quot;{query}&quot;
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
