import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { PAGINATION } from '@config/constants';

// Replace with codegen-generated hook after `npm run codegen`
const GET_LOCATIONS = gql`
  query GetLocations($first: Int, $after: String, $filter: LocationFilter, $sortBy: LocationSortBy) {
    locations(first: $first, after: $after, filter: $filter, sortBy: $sortBy) {
      edges {
        node {
          id
          name
          description
          address
          latitude
          longitude
          category
          images
          averageRating
          ratingCount
          createdAt
          createdBy { id username avatarUrl }
        }
        cursor
      }
      pageInfo { hasNextPage endCursor }
      totalCount
    }
  }
`;

interface UseLocationsOptions {
  filter?: Record<string, unknown>;
  sortBy?: string;
}

export function useLocations({ filter, sortBy }: UseLocationsOptions = {}) {
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_LOCATIONS, {
    variables: { first: PAGINATION.LOCATIONS_PER_PAGE, filter, sortBy },
  });

  const loadMore = () => {
    const pageInfo = data?.locations?.pageInfo;
    if (!pageInfo?.hasNextPage) return;
    fetchMore({
      variables: { after: pageInfo.endCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          locations: {
            ...fetchMoreResult.locations,
            edges: [...prev.locations.edges, ...fetchMoreResult.locations.edges],
          },
        };
      },
    });
  };

  return {
    locations: data?.locations?.edges?.map((e: { node: unknown }) => e.node) ?? [],
    totalCount: data?.locations?.totalCount ?? 0,
    hasNextPage: data?.locations?.pageInfo?.hasNextPage ?? false,
    loading,
    error,
    loadMore,
    refetch,
  };
}
