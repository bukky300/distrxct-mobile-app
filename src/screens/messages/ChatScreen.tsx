import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  Info,
  Plus,
  AtSign,
  Smile,
  ImageIcon,
  AlarmClockPlus,
  Send,
  CheckCheck,
} from 'lucide-react-native';
import type { MessagesStackParamList } from '@navigation/types';
import { getConversationById, MOCK_THREAD, type ChatMessage } from '@features/messages/data/mockConversations';

type NavProp = NativeStackNavigationProp<MessagesStackParamList>;
type RouteProps = RouteProp<MessagesStackParamList, 'Chat'>;

let messageIdCounter = 0;

export default function ChatScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();

  const conversation = getConversationById(route.params.conversationId);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_THREAD);
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    messageIdCounter += 1;
    setMessages(prev => [
      ...prev,
      { id: `local-${messageIdCounter}`, text, fromMe: true, timestamp: 'Now', read: false },
    ]);
    setDraft('');
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center gap-2 px-4 pb-3">
        <TouchableOpacity onPress={navigation.goBack} activeOpacity={0.7} hitSlop={8}>
          <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2.2} />
        </TouchableOpacity>
        <Text className="font-roboto-bold text-xl text-[#1A1A1A]">Messages</Text>
      </View>

      {/* Contact row */}
      <View className="flex-row items-center gap-3 border-b border-hairline px-4 pb-4">
        <Image source={{ uri: conversation?.avatarUri }} className="h-12 w-12 rounded-full" />
        <View className="flex-1">
          <Text className="font-roboto-bold text-base text-[#1A1A1A]">{conversation?.name ?? 'Unknown'}</Text>
          <Text className="font-roboto text-sm text-muted-light">
            {conversation?.online ? 'Online' : 'Offline'}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={8}
          className="h-9 w-9 items-center justify-center rounded-full border border-hairline"
        >
          <Info size={18} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => {
            const next = messages[index + 1];
            const showMeta = !next || next.fromMe !== message.fromMe;

            return (
              <View
                key={message.id}
                className={`mb-1 flex-row items-end ${message.fromMe ? 'justify-end' : 'justify-start'}`}
              >
                {!message.fromMe && showMeta ? (
                  <View className="relative mr-2 h-9 w-9">
                    <Image source={{ uri: conversation?.avatarUri }} className="h-9 w-9 rounded-full" />
                    {conversation?.online && (
                      <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-blue-500" />
                    )}
                  </View>
                ) : !message.fromMe ? (
                  <View className="mr-2 w-9" />
                ) : null}

                <View className="max-w-[75%]">
                  <View
                    className={`px-4 py-3 ${
                      message.fromMe
                        ? 'rounded-2xl rounded-br-md bg-mint'
                        : 'rounded-2xl rounded-bl-md bg-surface'
                    }`}
                  >
                    <Text className="font-roboto text-base text-[#1A1A1A]">{message.text}</Text>
                  </View>

                  {showMeta && (
                    <View className={`mt-1 flex-row items-center gap-1 ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
                      <Text className="font-roboto text-xs text-muted-light">{message.timestamp}</Text>
                      {message.fromMe && (
                        <CheckCheck size={14} color={message.read ? '#2A5C40' : '#9CA3AF'} strokeWidth={2} />
                      )}
                    </View>
                  )}
                </View>

                {message.fromMe && showMeta ? (
                  <Image source={{ uri: conversation?.avatarUri }} className="ml-2 h-9 w-9 rounded-full" />
                ) : message.fromMe ? (
                  <View className="ml-2 w-9" />
                ) : null}
              </View>
            );
          })}
        </ScrollView>

        {/* Composer */}
        <View
          className="mx-4 rounded-3xl border border-hairline px-4 pt-3"
          style={{ marginBottom: insets.bottom + 12 }}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message"
            placeholderTextColor="#9CA3AF"
            multiline
            className="min-h-[40px] font-roboto text-base text-[#1A1A1A]"
          />

          <View className="mt-2 flex-row items-center justify-between border-t border-hairline pb-2 pt-2.5">
            <View className="flex-row items-center gap-3">
              <TouchableOpacity activeOpacity={0.7} hitSlop={6}>
                <Plus size={20} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
              <View className="h-5 w-px bg-hairline" />
              <TouchableOpacity activeOpacity={0.7} hitSlop={6}>
                <AtSign size={20} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} hitSlop={6}>
                <Smile size={20} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} hitSlop={6}>
                <ImageIcon size={20} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center gap-3">
              <TouchableOpacity activeOpacity={0.7} hitSlop={6}>
                <AlarmClockPlus size={20} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSend} activeOpacity={0.7} hitSlop={6} disabled={!draft.trim()}>
                <Send size={20} color={draft.trim() ? '#2A5C40' : '#9CA3AF'} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
