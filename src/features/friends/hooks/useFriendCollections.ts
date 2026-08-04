import { useQuery, gql } from '@apollo/client';
import type { Business } from '@features/discover/types';
import { PLACEHOLDER_AVATAR } from '../utils/placeholderAvatar';

const GET_STORE_COLLECTIONS_BY_USER = gql`
  query Get_store_collections_by_user($userId: String!) {
    get_store_collections_by_user(user_id: $userId) {
      id
      user_id
      name
      stores {
        id
        name
        open_hour
        close_hour
        average_rating
        review_count
        is_bookmarked
        location {
          formatted_address
          timezone
          longitude
          latitude
        }
        media_url {
          original
          thumbnail
          medium
        }
        store_categories {
          id
          name
          description
          store_type_id
        }
      }
    }
  }
`;

interface RawStore {
  id: string;
  name: string;
  average_rating: number | null;
  review_count: number;
  location: { formatted_address: string | null } | null;
  media_url: { original: string | null; thumbnail: string | null; medium: string | null } | null;
  store_categories: { id: string; name: string }[];
}

interface Collection {
  id: string;
  stores: RawStore[];
}

function toBusiness(store: RawStore): Business {
  const image = store.media_url?.original ? { uri: store.media_url.original } : PLACEHOLDER_AVATAR;

  return {
    id: store.id,
    name: store.name,
    category: store.store_categories?.[0]?.name ?? '',
    // Backend doesn't expose live open/closed state via this query; assume open rather
    // than guessing wrong from open_hour/close_hour without a timezone-aware "now".
    isOpen: true,
    address: store.location?.formatted_address ?? '',
    rating: store.average_rating ?? 0,
    ratingCount: store.review_count,
    coverImage: image,
    logo: image,
    images: [image],
    description: '',
    reviewSummary: {
      average: store.average_rating ?? 0,
      total: store.review_count,
      percentRecommended: 0,
      breakdown: [],
    },
    reviews: [],
  };
}

export function useFriendCollections(userId: string | undefined) {
  const { data, loading, error } = useQuery<{ get_store_collections_by_user: Collection[] }>(
    GET_STORE_COLLECTIONS_BY_USER,
    { variables: { userId }, skip: !userId, fetchPolicy: 'network-only' },
  );

  const stores = data?.get_store_collections_by_user?.[0]?.stores ?? [];
  return { businesses: stores.map(toBusiness), loading, error };
}
