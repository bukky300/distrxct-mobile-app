import './global.css';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_900Black,
} from '@expo-google-fonts/roboto';
import { apolloClient } from './src/apollo/client'; // direct path (App.tsx is outside src/)
import SplashScreen from './src/screens/onboarding/SplashScreen';
import DevPreview from './src/screens/dev/DevPreview';
import RootNavigator from './src/navigation/RootNavigator';
import { useUIStore } from './src/features/ui/store/uiStore';
import { useAuthStore } from './src/features/auth/store/authStore';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const devPreviewOpen = useUIStore(s => s.devPreviewOpen);
  const closeDevPreview = useUIStore(s => s.closeDevPreview);
  const hydrate = useAuthStore(s => s.hydrate);

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
  });

  useEffect(() => {
    hydrate();
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#2D6A2D" />
      </View>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <SafeAreaProvider>
        {showSplash ? (
          <SplashScreen />
        ) : devPreviewOpen ? (
          <DevPreview onExit={closeDevPreview} />
        ) : (
          <RootNavigator />
        )}
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
