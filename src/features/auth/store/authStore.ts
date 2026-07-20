import { create } from 'zustand';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@config/constants';
import { apolloClient } from '@/apollo/client';

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  // Omit when the caller has already persisted the expiry itself (e.g. register(),
  // ahead of verifyEmail() later calling setAuth for the same token pair).
  expiresIn?: number;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: CurrentUser | null;
  isAuthenticated: boolean;
  setAuth: (tokens: AuthTokens, user: CurrentUser) => Promise<void>;
  setUser: (user: CurrentUser) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: async (tokens, user) => {
    const writes = [
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
      storage.set(STORAGE_KEYS.USER, user),
    ];
    if (tokens.expiresIn != null) {
      writes.push(storage.set(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT, Date.now() + tokens.expiresIn * 1000));
    }
    await Promise.all(writes);
    set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user, isAuthenticated: true });
  },

  setUser: user => set({ user }),

  logout: async () => {
    await Promise.all([
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN),
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN),
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT),
      storage.remove(STORAGE_KEYS.USER),
    ]);
    await apolloClient.resetStore();
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
  },

  hydrate: async () => {
    const [accessToken, refreshToken, user] = await Promise.all([
      storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN),
      storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN),
      storage.get<CurrentUser>(STORAGE_KEYS.USER),
    ]);
    if (accessToken && user) {
      set({ accessToken, refreshToken, user, isAuthenticated: true });
    }
  },
}));
