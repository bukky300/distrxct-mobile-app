import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { LocationsStackParamList } from './types';
import LocationFeedScreen from '@screens/locations/LocationFeedScreen';
import LocationDetailScreen from '@screens/locations/LocationDetailScreen';
import SearchScreen from '@screens/locations/SearchScreen';
import AddLocationScreen from '@screens/locations/AddLocationScreen';
import { colors } from '@config/theme';

const Stack = createNativeStackNavigator<LocationsStackParamList>();

export default function LocationsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="LocationFeed" component={LocationFeedScreen} options={{ title: 'Explore' }} />
      <Stack.Screen name="LocationDetail" component={LocationDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
      <Stack.Screen name="AddLocation" component={AddLocationScreen} options={{ title: 'Add Location' }} />
    </Stack.Navigator>
  );
}
