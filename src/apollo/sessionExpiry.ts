import type { NetworkError } from '@apollo/client/errors';
import type { GraphQLFormattedError } from 'graphql';
import { useAuthStore } from '@features/auth/store/authStore';
import { useToastStore } from '@features/ui/store/toastStore';

// Deliberately narrow to "you are not authenticated" (session/token invalid), not
// "you don't have permission for this" (a 403-style authorization error, e.g. trying to
// delete someone else's post) — those are unrelated failures that must NOT force a
// valid, logged-in user out to the Login screen.
const AUTH_ERROR_CODES = new Set(['UNAUTHENTICATED']);
const AUTH_MESSAGE_PATTERN = /unauthenticated|invalid.*token|expired.*token|token.*expired|jwt.*expired|session.*expired/i;

function hasStatusCode(error: unknown): error is { statusCode: number } {
  return typeof error === 'object' && error !== null && 'statusCode' in error;
}

// Backend error conventions have already proven inconsistent elsewhere in this app
// (snake_case vs camelCase drift between fields) — check the standard extensions.code
// convention, the HTTP status (401 specifically means "not authenticated", unlike 403
// "forbidden"), and fall back to a message match rather than trusting any single shape.
export function isAuthError(
  graphQLErrors: readonly GraphQLFormattedError[] | undefined,
  networkError: NetworkError | undefined,
): boolean {
  if (graphQLErrors?.some(e => AUTH_ERROR_CODES.has(String(e.extensions?.code)) || AUTH_MESSAGE_PATTERN.test(e.message))) {
    return true;
  }
  if (networkError && hasStatusCode(networkError) && networkError.statusCode === 401) {
    return true;
  }
  if (networkError && AUTH_MESSAGE_PATTERN.test(networkError.message)) {
    return true;
  }
  return false;
}

let loggingOut = false;

// Single choke point for "the JWT is no longer valid" — called both when a proactive
// refresh fails (tokenRefresh.ts) and when the backend reactively rejects a request
// (errorLink.ts). Deduped because authStore.logout() calls apolloClient.resetStore(),
// which refetches every active query; if the token is invalid, several of those
// refetches fail concurrently and would otherwise re-enter this at the same time.
export async function forceLogout(): Promise<void> {
  if (loggingOut) return;
  loggingOut = true;
  try {
    useToastStore.getState().showToast('Your session has expired. Please log in again.', 'error');
    await useAuthStore.getState().logout();
  } finally {
    loggingOut = false;
  }
}
