import { createNavigationContainerRef } from '@react-navigation/native';
import type { AppTabParamList } from './types';

export const navigationRef = createNavigationContainerRef<AppTabParamList>();

export function navigateToProfile() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Home', { screen: 'Profile' } as never);
  }
}
