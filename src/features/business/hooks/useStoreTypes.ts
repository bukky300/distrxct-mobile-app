import { useQuery, gql } from '@apollo/client';
import type { StoreTypeOption } from '../types';

const GET_ALL_STORE_TYPES = gql`
  query GetAllStoreTypes {
    get_all_store_types {
      id
      name
      categories {
        id
        name
      }
    }
  }
`;

export function useStoreTypes() {
  const { data, loading, error } = useQuery<{ get_all_store_types: StoreTypeOption[] }>(GET_ALL_STORE_TYPES);

  return {
    storeTypes: data?.get_all_store_types ?? [],
    loading,
    error,
  };
}
