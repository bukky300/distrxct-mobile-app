import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { CheckCheck } from 'lucide-react-native';
import SettingsHeader from '@features/settings/components/SettingsHeader';
import { MOCK_NOTIFICATIONS, type NotificationItem } from '@features/settings/data/mockNotifications';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <View className="flex-1 bg-white">
      <SettingsHeader title="Notifications" />

      <TouchableOpacity onPress={markAllRead} activeOpacity={0.7} className="flex-row items-center justify-end gap-1.5 px-4 pb-3">
        <Text className="font-roboto text-sm text-[#1A1A1A]">Mark all as read</Text>
        <CheckCheck size={16} color="#2A5C40" strokeWidth={2.2} />
      </TouchableOpacity>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View className="h-px bg-hairline" />}
        renderItem={({ item }) => (
          <View className="flex-row gap-3 px-4 py-4">
            <Image source={{ uri: item.avatarUri }} className="h-12 w-12 rounded-full" />
            <View className="flex-1">
              <Text className={`text-base text-[#1A1A1A] ${item.read ? 'font-roboto' : 'font-roboto-bold'}`}>
                {item.title}
              </Text>
              <Text className="mt-1 font-roboto text-sm leading-5 text-muted-light">{item.body}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
