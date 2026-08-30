import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from './types';
import HomeScreen from '@screens/home/HomeScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';
import BusinessScreen from '@screens/business/BusinessScreen';
import SettingsNavigator from './SettingsNavigator';
import MessagesNavigator from './MessagesNavigator';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeHome" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsNavigator} />
      <Stack.Screen name="Messages" component={MessagesNavigator} />
      <Stack.Screen name="Business" component={BusinessScreen} />
    </Stack.Navigator>
  );
}
