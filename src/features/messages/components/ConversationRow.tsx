import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import type { ConversationPreview } from '../data/mockConversations';

interface Props {
  conversation: ConversationPreview;
  onPress: () => void;
}

export default function ConversationRow({ conversation, onPress }: Props) {
  const unread = conversation.unreadCount > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`mb-3 flex-row rounded-2xl p-4 active:opacity-70 ${unread ? 'bg-mint' : 'bg-white'}`}
    >
      <Image source={{ uri: conversation.avatarUri }} className="h-12 w-12 rounded-full" />

      <View className="ml-3 flex-1">
        <View className="flex-row items-start justify-between">
          <Text className="flex-1 font-roboto-bold text-base text-[#1A1A1A]" numberOfLines={1}>
            {conversation.name}
          </Text>
          <Text className="ml-2 font-roboto text-xs text-muted-light">{conversation.timestamp}</Text>
        </View>

        <View className="mt-1 flex-row items-end justify-between">
          <Text
            className={`mr-2 flex-1 font-roboto text-sm leading-5 ${unread ? 'text-brand' : 'text-muted'}`}
            numberOfLines={2}
          >
            {conversation.lastMessage}
          </Text>
          {unread && (
            <View className="h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-1.5">
              <Text className="font-roboto-bold text-xs text-white">{conversation.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
