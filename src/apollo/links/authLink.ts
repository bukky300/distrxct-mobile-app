import { setContext } from '@apollo/client/link/context';
import { ensureValidAccessToken } from '../tokenRefresh';

export const authLink = setContext(async (_, { headers }) => {
  const token = await ensureValidAccessToken();
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});
