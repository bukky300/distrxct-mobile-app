import { InMemoryCache } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        locations: relayStylePagination(['filter', 'sortBy']),
      },
    },
    Location: {
      keyFields: ['id'],
    },
    User: {
      keyFields: ['id'],
    },
  },
});
