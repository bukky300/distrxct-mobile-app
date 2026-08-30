import { useQuery, gql } from '@apollo/client';
import { toBusiness, type RawStore } from '../utils/toBusiness';

const GET_STORES = gql`
  query GetDiscoverStores($limit: Int!, $offset: Int!) {
    get_stores(limit: $limit, offset: $offset) {
      id
      name
      average_rating
      review_count
      is_bookmarked
      location {
        formattedAddress
      }
      media_url {
        original
        thumbnail
        medium
      }
      store_categories {
        id
        name
      }
    }
  }
`;

// No server-side search exists on this schema yet — fetch a page and filter client-side,
// same approach as posts' useStores.ts / reviews' useReviewableBusinesses.ts.
const PAGE_SIZE = 50;

export function useDiscoverBusinesses() {
  const { data, loading, error, refetch } = useQuery<{ get_stores: RawStore[] }>(GET_STORES, {
    variables: { limit: PAGE_SIZE, offset: 0 },
  });

  const businesses = (data?.get_stores ?? []).map(toBusiness);

  return { businesses, loading, error, refetch };
}
