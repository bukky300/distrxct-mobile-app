import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DiscoverStackParamList } from './types';
import DiscoverScreen from '@screens/discover/DiscoverScreen';
import ViewBusinessScreen from '@screens/discover/ViewBusinessScreen';
import PhotoGalleryScreen from '@screens/discover/PhotoGalleryScreen';

const Stack = createNativeStackNavigator<DiscoverStackParamList>();

export default function DiscoverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiscoverHome" component={DiscoverScreen} />
      <Stack.Screen name="ViewBusiness" component={ViewBusinessScreen} />
      <Stack.Screen name="PhotoGallery" component={PhotoGalleryScreen} />
    </Stack.Navigator>
  );
}
