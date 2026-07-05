import { createNavigationContainerRef } from '@react-navigation/native';
import type { AppTabParamList } from './types';

export const navigationRef = createNavigationContainerRef<AppTabParamList>();

export function navigateToProfile() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Home', { screen: 'Profile' } as never);
  }
}

export function navigateToSettings() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Home', { screen: 'Settings', params: { screen: 'SettingsHome' } } as never);
  }
}

export function navigateToNotifications() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Home', { screen: 'Settings', params: { screen: 'Notifications' } } as never);
  }
}

export function navigateToMessages() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Home', { screen: 'Messages', params: { screen: 'MessagesHome' } } as never);
  }
}

export function navigateToHelp() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Home', { screen: 'Settings', params: { screen: 'Help' } } as never);
  }
}
