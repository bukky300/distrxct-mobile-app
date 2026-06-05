import { setContext } from '@apollo/client/link/context';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@config/constants';

export const authLink = setContext(async (_, { headers }) => {
  const token = await storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});
