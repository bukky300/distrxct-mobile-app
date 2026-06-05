const required = (key: string): string => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
};

export const env = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.distrxct.com/graphql',
  get MAPS_API_KEY() {
    return required('EXPO_PUBLIC_MAPS_API_KEY');
  },
} as const;
