import * as SecureStore from 'expo-secure-store';

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const raw = await SecureStore.getItemAsync(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  },

  async set(key: string, value: unknown): Promise<void> {
    const raw = typeof value === 'string' ? value : JSON.stringify(value);
    await SecureStore.setItemAsync(key, raw);
  },

  async remove(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};
