import { API_URL, STORAGE_KEYS } from '@config/constants';
import { storage } from '@utils/storage';
import { useAuthStore } from '@/features/auth/store/authStore';

const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($refresh_token: String!) {
    refresh_token(refresh_token: $refresh_token) {
      access_token
      refresh_token
      expires_in
      token_type
    }
  }
`;

// Refresh a bit before actual expiry to absorb request latency and clock drift.
const EXPIRY_BUFFER_MS = 60_000;

let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: REFRESH_TOKEN_MUTATION,
        variables: { refresh_token: refreshToken },
      }),
    });
    const json = await response.json();
    const tokens = json?.data?.refresh_token;
    if (!tokens) return null;

    const expiresAt = Date.now() + tokens.expires_in * 1000;
    await Promise.all([
      storage.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token),
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token),
      storage.set(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT, expiresAt),
    ]);
    return tokens.access_token as string;
  } catch {
    return null;
  }
}

/**
 * Returns a valid access token for the outgoing request, transparently refreshing it
 * (deduped across concurrent requests) when it's expired or about to expire. Logs the
 * user out if the refresh token itself is no longer valid.
 */
export async function ensureValidAccessToken(): Promise<string | null> {
  const [accessToken, refreshToken, expiresAt] = await Promise.all([
    storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN),
    storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN),
    storage.get<number>(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT),
  ]);

  if (!accessToken) return null;
  if (!refreshToken || Date.now() < (expiresAt ?? 0) - EXPIRY_BUFFER_MS) {
    return accessToken;
  }

  if (!refreshPromise) {
    refreshPromise = performRefresh(refreshToken).finally(() => {
      refreshPromise = null;
    });
  }

  const newAccessToken = await refreshPromise;
  if (!newAccessToken) {
    await useAuthStore.getState().logout();
    return null;
  }
  return newAccessToken;
}
