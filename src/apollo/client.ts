import { ApolloClient, HttpLink, from } from '@apollo/client';
import { API_URL } from '@config/constants';
import { cache } from './cache';
import { authLink } from './links/authLink';
import { errorLink } from './links/errorLink';

const httpLink = new HttpLink({
  uri: API_URL,
  credentials: 'include',
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
