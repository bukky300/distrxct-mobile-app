import { useQuery, gql } from '@apollo/client';
import type { StoreOption } from '../types';

const GET_STORES = gql`
  query GetStores($limit: Int!, $offset: Int!) {
    get_stores(limit: $limit, offset: $offset) {
      id
      name
    }
  }
`;

// No server-side text search exists on this schema yet — fetch a page and filter client-side.
const PAGE_SIZE = 100;

export function useStores() {
  const { data, loading, error } = useQuery(GET_STORES, {
    variables: { limit: PAGE_SIZE, offset: 0 },
  });

  const stores: StoreOption[] = data?.get_stores ?? [];

  return { stores, loading, error };
}
