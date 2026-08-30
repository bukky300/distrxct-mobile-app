import { useQuery, gql } from '@apollo/client';
import { toBusiness, type RawStore } from '@features/discover/utils/toBusiness';

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
          formattedAddress
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

interface Collection {
  id: string;
  stores: RawStore[];
}

export function useFriendCollections(userId: string | undefined) {
  const { data, loading, error } = useQuery<{ get_store_collections_by_user: Collection[] }>(
    GET_STORE_COLLECTIONS_BY_USER,
    { variables: { userId }, skip: !userId, fetchPolicy: 'network-only' },
  );

  const stores = data?.get_store_collections_by_user?.[0]?.stores ?? [];
  return { businesses: stores.map(toBusiness), loading, error };
}
