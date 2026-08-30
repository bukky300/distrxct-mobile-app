import { useQuery, gql } from '@apollo/client';
import type { ReviewBusiness } from '../types';

const GET_REVIEWABLE_STORES = gql`
  query GetReviewableStores($limit: Int!, $offset: Int!) {
    get_stores(limit: $limit, offset: $offset) {
      id
      name
      location {
        formattedAddress
      }
      average_rating
      review_count
      logo {
        thumbnail
      }
    }
  }
`;

interface RawStore {
  id: string;
  name: string;
  location: { formattedAddress: string | null } | null;
  average_rating: number | null;
  review_count: number | null;
  logo: { thumbnail: string | null } | null;
}

// No server-side text search exists on this schema yet — fetch a page and filter
// client-side, same approach as posts' useStores.ts.
const PAGE_SIZE = 100;

function toReviewBusiness(store: RawStore): ReviewBusiness {
  return {
    id: store.id,
    name: store.name,
    address: store.location?.formattedAddress ?? '',
    // Backend doesn't expose live open/closed state via this query; assume open rather
    // than guessing wrong from open_hour/close_hour without a timezone-aware "now"
    // (matches friends' useFriendCollections.ts toBusiness()).
    isOpen: true,
    rating: store.average_rating ?? 0,
    ratingCount: store.review_count ?? 0,
    imageUri: store.logo?.thumbnail ?? undefined,
  };
}

export function useReviewableBusinesses() {
  const { data, loading, error } = useQuery<{ get_stores: RawStore[] }>(GET_REVIEWABLE_STORES, {
    variables: { limit: PAGE_SIZE, offset: 0 },
  });

  const businesses: ReviewBusiness[] = (data?.get_stores ?? []).map(toReviewBusiness);

  return { businesses, loading, error };
}
