export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  EmailVerification: { email?: string; token?: string };
  ResetPassword: { token?: string };
  EmailVerified: undefined;
  PasswordResetComplete: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Activity: undefined;
  Discover: undefined;
  Friends: undefined;
};

export type HomeStackParamList = {
  HomeHome: undefined;
  Profile: { initialTab?: 'reviews' | 'activity' | 'collections' } | undefined;
  Settings: undefined;
  Messages: undefined;
  Business: undefined;
};

export type MessagesStackParamList = {
  MessagesHome: undefined;
  Chat: { conversationId: string };
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
  Account: undefined;
  ChangePassword: undefined;
  Preferences: undefined;
  Help: undefined;
  FAQ: undefined;
  BlockList: undefined;
  Notifications: undefined;
};

export type DiscoverStackParamList = {
  DiscoverHome: undefined;
  ViewBusiness: { businessId: string };
  PhotoGallery: { businessId: string };
};

export type FriendsStackParamList = {
  FriendsHome: undefined;
  FriendsProfile: { friendId: string };
  FollowersList: { friendId: string; friendName?: string };
};

export type LocationsStackParamList = {
  LocationFeed: undefined;
  LocationDetail: { locationId: string };
  Search: { initialQuery?: string };
  AddLocation: { prefillCoords?: { lat: number; lng: number } };
};
