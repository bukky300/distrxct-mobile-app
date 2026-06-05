import { create } from 'zustand';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@config/constants';
import { apolloClient } from '@apollo/client';

interface CurrentUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

interface AuthState {
  token: string | null;
  user: CurrentUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: CurrentUser) => Promise<void>;
  setUser: (user: CurrentUser) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setAuth: async (token, user) => {
    await Promise.all([
      storage.set(STORAGE_KEYS.AUTH_TOKEN, token),
      storage.set(STORAGE_KEYS.USER, user),
    ]);
    set({ token, user, isAuthenticated: true });
  },

  setUser: user => set({ user }),

  logout: async () => {
    await Promise.all([
      storage.remove(STORAGE_KEYS.AUTH_TOKEN),
      storage.remove(STORAGE_KEYS.USER),
    ]);
    await apolloClient.resetStore();
    set({ token: null, user: null, isAuthenticated: false });
  },

  hydrate: async () => {
    const [token, user] = await Promise.all([
      storage.get<string>(STORAGE_KEYS.AUTH_TOKEN),
      storage.get<CurrentUser>(STORAGE_KEYS.USER),
    ]);
    if (token && user) {
      set({ token, user, isAuthenticated: true });
    }
  },
}));
