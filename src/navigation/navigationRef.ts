import { createNavigationContainerRef, type NavigationContainerRefWithCurrent } from '@react-navigation/native';
import type { RootStackParamList, AppTabParamList } from './types';

// Typed to the root navigator (RootNavigator attaches this ref to its NavigationContainer).
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// The helpers below all navigate into the App tab navigator's nested stacks, which
// RootStackParamList has no knowledge of — cast to the tab param list to call .navigate
// with real screen names instead of bare `any`.
const appNavigationRef = navigationRef as unknown as NavigationContainerRefWithCurrent<AppTabParamList>;

export function navigateToProfile() {
  if (navigationRef.isReady()) {
    appNavigationRef.navigate('Home', { screen: 'Profile' } as never);
  }
}

export function navigateToCollections() {
  if (navigationRef.isReady()) {
    appNavigationRef.navigate('Home', { screen: 'Profile', params: { initialTab: 'collections' } } as never);
  }
}

export function navigateToSettings() {
  if (navigationRef.isReady()) {
    appNavigationRef.navigate('Home', { screen: 'Settings', params: { screen: 'SettingsHome' } } as never);
  }
}

export function navigateToNotifications() {
  if (navigationRef.isReady()) {
    appNavigationRef.navigate('Home', { screen: 'Settings', params: { screen: 'Notifications' } } as never);
  }
}

export function navigateToMessages() {
  if (navigationRef.isReady()) {
    appNavigationRef.navigate('Home', { screen: 'Messages', params: { screen: 'MessagesHome' } } as never);
  }
}

export function navigateToHelp() {
  if (navigationRef.isReady()) {
    appNavigationRef.navigate('Home', { screen: 'Settings', params: { screen: 'Help' } } as never);
  }
}

export function navigateToDiscover() {
  if (navigationRef.isReady()) {
    appNavigationRef.navigate('Discover' as never);
  }
}

export function navigateToBusiness(businessId: string) {
  if (navigationRef.isReady()) {
    appNavigationRef.navigate('Discover', { screen: 'ViewBusiness', params: { businessId } } as never);
  }
}

// Distinct from navigateToBusiness above (which views any business by id) — this opens
// the current user's own business management flow (Create form / dashboard).
export function navigateToMyBusiness() {
  if (navigationRef.isReady()) {
    appNavigationRef.navigate('Home', { screen: 'Business' } as never);
  }
}
