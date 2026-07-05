import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from './types';
import SettingsScreen from '@screens/settings/SettingsScreen';
import AccountScreen from '@screens/settings/AccountScreen';
import ChangePasswordScreen from '@screens/settings/ChangePasswordScreen';
import PreferencesScreen from '@screens/settings/PreferencesScreen';
import HelpScreen from '@screens/settings/HelpScreen';
import FAQScreen from '@screens/settings/FAQScreen';
import BlockListScreen from '@screens/settings/BlockListScreen';
import NotificationsScreen from '@screens/settings/NotificationsScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

interface Props {
  initialRouteName?: keyof SettingsStackParamList;
}

export default function SettingsNavigator({ initialRouteName }: Props) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
      <Stack.Screen name="BlockList" component={BlockListScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
