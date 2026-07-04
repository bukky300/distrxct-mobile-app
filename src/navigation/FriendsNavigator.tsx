import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { FriendsStackParamList } from './types';
import FriendsScreen from '@screens/friends/FriendsScreen';
import FriendsProfileScreen from '@screens/friends/FriendsProfileScreen';

const Stack = createNativeStackNavigator<FriendsStackParamList>();

export default function FriendsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FriendsHome" component={FriendsScreen} />
      <Stack.Screen name="FriendsProfile" component={FriendsProfileScreen} />
    </Stack.Navigator>
  );
}
