import { useQuery, gql } from '@apollo/client';
import { useAuthStore } from '@features/auth/store/authStore';
import type { Business } from '../types';

const BUSINESS_FIELDS = `
  id
  name
  description
  instagram_url
  tictok_url
  whatsapp_number
  email
  timezone
  open_hour
  close_hour
  owner_id
  logo {
    original
    thumbnail
    medium
  }
  media_url {
    original
    thumbnail
    medium
  }
  location {
    id
    formattedAddress
  }
  store_type {
    id
    name
  }
  store_categories {
    id
    name
  }
`;

const GET_MY_BUSINESS = gql`
  query GetStoresByOwnerId($ownerId: String!, $limit: Int!, $offset: Int!) {
    get_stores_by_owner_id(owner_id: $ownerId, limit: $limit, offset: $offset) {
      ${BUSINESS_FIELDS}
    }
  }
`;

export function useMyBusiness() {
  const userId = useAuthStore(s => s.user?.id);

  const { data, loading, error, refetch } = useQuery<{ get_stores_by_owner_id: Business[] }>(GET_MY_BUSINESS, {
    variables: { ownerId: userId, limit: 1, offset: 0 },
    skip: !userId,
    fetchPolicy: 'network-only',
  });

  return {
    business: data?.get_stores_by_owner_id?.[0] ?? null,
    loading,
    error,
    refetch,
  };
}

export { BUSINESS_FIELDS };
