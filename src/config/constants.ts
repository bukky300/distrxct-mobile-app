export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.distrxct.com/graphql';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@distrxct/access_token',
  REFRESH_TOKEN: '@distrxct/refresh_token',
  ACCESS_TOKEN_EXPIRES_AT: '@distrxct/access_token_expires_at',
  USER: '@distrxct/user',
} as const;

export const PAGINATION = {
  LOCATIONS_PER_PAGE: 20,
} as const;

export const MAP_DEFAULTS = {
  INITIAL_REGION: {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,
} as const;

export const RATING = {
  MIN: 1,
  MAX: 5,
} as const;
