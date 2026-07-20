import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import AuthStack from './AuthStack';
import AppNavigator from './AppNavigator';
import { useAuthStore } from '@features/auth/store/authStore';
import { linking } from './linking';
import { navigationRef } from './navigationRef';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
