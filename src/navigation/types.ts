export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type AppTabParamList = {
  Explore: undefined;
  Map: undefined;
  Profile: undefined;
};

export type LocationsStackParamList = {
  LocationFeed: undefined;
  LocationDetail: { locationId: string };
  Search: { initialQuery?: string };
  AddLocation: { prefillCoords?: { lat: number; lng: number } };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
};
