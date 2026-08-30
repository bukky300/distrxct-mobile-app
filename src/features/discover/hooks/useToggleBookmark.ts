import { useState } from 'react';
import { useApolloClient, gql } from '@apollo/client';

const GET_MY_COLLECTIONS = gql`
  query GetMyStoreCollections {
    get_my_store_collections {
      id
      name
    }
  }
`;

const CREATE_COLLECTION_MUTATION = gql`
  mutation CreateStoreCollection($input: StoreCollectionCreateInput!) {
    create_store_collection(input: $input) {
      id
    }
  }
`;

const ADD_TO_COLLECTION_MUTATION = gql`
  mutation AddStoreToCollection($collectionId: String!, $storeId: String!) {
    add_store_to_collection(collection_id: $collectionId, store_id: $storeId) {
      is_bookmarked
    }
  }
`;

const REMOVE_FROM_COLLECTION_MUTATION = gql`
  mutation RemoveStoreFromCollection($collectionId: String!, $storeId: String!) {
    remove_store_from_collection(collection_id: $collectionId, store_id: $storeId) {
      is_bookmarked
    }
  }
`;

const DEFAULT_COLLECTION_NAME = 'Saved';

// There's no picker — a business is saved into one implicit "Saved" collection, created
// the first time a user bookmarks anything (same "first collection is the one" convention
// useFriendCollections.ts already relies on when reading it back).
export function useToggleBookmark() {
  const client = useApolloClient();
  const [submitting, setSubmitting] = useState(false);

  const toggleBookmark = async (storeId: string, isBookmarked: boolean): Promise<boolean> => {
    setSubmitting(true);
    try {
      const { data: collectionsData } = await client.query({
        query: GET_MY_COLLECTIONS,
        fetchPolicy: 'network-only',
      });
      let collectionId: string | undefined = collectionsData?.get_my_store_collections?.[0]?.id;

      if (!collectionId) {
        const { data: createData } = await client.mutate({
          mutation: CREATE_COLLECTION_MUTATION,
          variables: { input: { name: DEFAULT_COLLECTION_NAME } },
        });
        collectionId = createData?.create_store_collection?.id;
      }
      if (!collectionId) throw new Error('Could not save this business. Please try again.');

      const { data: resultData } = await client.mutate({
        mutation: isBookmarked ? REMOVE_FROM_COLLECTION_MUTATION : ADD_TO_COLLECTION_MUTATION,
        variables: { collectionId, storeId },
      });
      const store = isBookmarked ? resultData?.remove_store_from_collection : resultData?.add_store_to_collection;
      if (!store) throw new Error('Could not save this business. Please try again.');
      return Boolean(store.is_bookmarked);
    } finally {
      setSubmitting(false);
    }
  };

  return { toggleBookmark, submitting };
}
