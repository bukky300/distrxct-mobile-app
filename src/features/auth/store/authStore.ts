import { create } from 'zustand';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@config/constants';
import { apolloClient } from '@/apollo/client';

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  /** "local" | "google" — drives the Password settings screen's OAuth branch */
  provider?: string | null;
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
  /** True once this device has ever completed a login/signup — survives logout, so
   * AuthStack knows to open on Login instead of the Welcome screen. */
  hasOnboarded: boolean;
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
  hasOnboarded: false,

  setAuth: async (tokens, user) => {
    const writes = [
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
      storage.set(STORAGE_KEYS.USER, user),
      storage.set(STORAGE_KEYS.HAS_ONBOARDED, true),
    ];
    if (tokens.expiresIn != null) {
      writes.push(storage.set(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT, Date.now() + tokens.expiresIn * 1000));
    }
    await Promise.all(writes);
    set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user, isAuthenticated: true, hasOnboarded: true });
  },

  setUser: user => set({ user }),

  logout: async () => {
    await Promise.all([
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN),
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN),
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT),
      storage.remove(STORAGE_KEYS.USER),
    ]);
    // Deliberately leave HAS_ONBOARDED untouched — logging out must land on Login, not
    // the first-launch Welcome screen.
    await apolloClient.resetStore();
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
  },

  hydrate: async () => {
    const [accessToken, refreshToken, user, hasOnboarded] = await Promise.all([
      storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN),
      storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN),
      storage.get<CurrentUser>(STORAGE_KEYS.USER),
      storage.get<boolean>(STORAGE_KEYS.HAS_ONBOARDED),
    ]);
    if (accessToken && user) {
      // A valid session on this device is itself proof it has onboarded before — covers
      // installs that authenticated before this flag existed. Backfill it to storage (not
      // just in-memory state) so the proof survives the next logout, which clears the
      // session itself — without this, the very first logout after upgrading would lose
      // the only evidence of prior onboarding and fall back to Welcome.
      if (!hasOnboarded) storage.set(STORAGE_KEYS.HAS_ONBOARDED, true);
      set({ accessToken, refreshToken, user, isAuthenticated: true, hasOnboarded: true });
    } else {
      set({ hasOnboarded: Boolean(hasOnboarded) });
    }
  },
}));
