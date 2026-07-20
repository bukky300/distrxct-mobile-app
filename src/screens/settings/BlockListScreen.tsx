import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ban, MoreHorizontal } from 'lucide-react-native';
import TopNav from '@components/layout/TopNav';
import SettingsHeader from '@features/settings/components/SettingsHeader';
import { MOCK_BLOCKED_USERS, type BlockedUser } from '@features/settings/data/mockBlockedUsers';

export default function BlockListScreen() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>(MOCK_BLOCKED_USERS);

  const handleUnblock = (user: BlockedUser) => {
    Alert.alert(`Unblock ${user.name}?`, `They'll be able to see your posts and interact with you again.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unblock',
        style: 'destructive',
        onPress: () => setBlockedUsers(prev => prev.filter(u => u.id !== user.id)),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <TopNav />
      <SettingsHeader title="Block List" useSafeArea={false} />

      {blockedUsers.length === 0 ? (
        <View className="mx-4 mt-2 items-center rounded-2xl border border-hairline px-6 py-14">
          <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-mint">
            <Ban size={26} color="#2A5C40" strokeWidth={1.8} />
          </View>
          <Text className="font-roboto text-base text-[#1A1A1A]">No blocked users</Text>
        </View>
      ) : (
        <FlatList
          data={blockedUsers}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          ItemSeparatorComponent={() => <View className="h-px bg-hairline" />}
          renderItem={({ item }) => (
            <View className="flex-row items-center gap-3 py-4">
              <Image source={{ uri: item.avatarUri }} className="h-12 w-12 rounded-full" />
              <View className="flex-1">
                <Text className="font-roboto-bold text-base text-[#1A1A1A]">{item.name}</Text>
                <Text className="font-roboto text-sm text-muted-light">{item.username}</Text>
              </View>
              <TouchableOpacity onPress={() => handleUnblock(item)} hitSlop={10} activeOpacity={0.6}>
                <MoreHorizontal size={20} color="#1A1A1A" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
