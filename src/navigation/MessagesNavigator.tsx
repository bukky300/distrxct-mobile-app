import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MessagesStackParamList } from './types';
import MessagesListScreen from '@screens/messages/MessagesListScreen';
import ChatScreen from '@screens/messages/ChatScreen';

const Stack = createNativeStackNavigator<MessagesStackParamList>();

interface Props {
  initialRouteName?: keyof MessagesStackParamList;
}

export default function MessagesNavigator({ initialRouteName }: Props) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesHome" component={MessagesListScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} initialParams={{ conversationId: '1' }} />
    </Stack.Navigator>
  );
}
