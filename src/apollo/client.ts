import { ApolloClient, HttpLink, from } from '@apollo/client';
import { API_URL } from '@config/constants';
import { cache } from './cache';
import { authLink } from './links/authLink';
import { errorLink } from './links/errorLink';

// The backend (especially staging) can hang indefinitely on a slow/dropped connection —
// without this, a stuck request leaves the UI in "loading" forever with no error.
// Large payloads (e.g. base64 image uploads in create_post) legitimately need more time
// than a simple query, so scale the timeout by request body size rather than picking one
// number that's either too tight for uploads or too loose for everything else.
const DEFAULT_TIMEOUT_MS = 15_000;
const LARGE_PAYLOAD_TIMEOUT_MS = 60_000;
const LARGE_PAYLOAD_THRESHOLD_BYTES = 512 * 1024;

function fetchWithTimeout(uri: RequestInfo | URL, options?: RequestInit): Promise<Response> {
  const bodySize = typeof options?.body === 'string' ? options.body.length : 0;
  const timeoutMs = bodySize > LARGE_PAYLOAD_THRESHOLD_BYTES ? LARGE_PAYLOAD_TIMEOUT_MS : DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(uri, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeout));
}

const httpLink = new HttpLink({
  uri: API_URL,
  credentials: 'include',
  fetch: fetchWithTimeout,
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  connectToDevTools: __DEV__,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});
