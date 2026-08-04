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

interface LocationNode {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  category: string;
  images: string[];
  averageRating: number | null;
  ratingCount: number;
  createdAt: string;
  createdBy: { id: string; username: string; avatarUrl: string | null };
}

interface LocationEdge {
  node: LocationNode;
  cursor: string;
}

interface GetLocationsData {
  locations: {
    edges: LocationEdge[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    totalCount: number;
  };
}

interface GetLocationsVars {
  first?: number;
  after?: string;
  filter?: Record<string, unknown>;
  sortBy?: string;
}

export function useLocations({ filter, sortBy }: UseLocationsOptions = {}) {
  const { data, loading, error, fetchMore, refetch } = useQuery<GetLocationsData, GetLocationsVars>(GET_LOCATIONS, {
    variables: { first: PAGINATION.LOCATIONS_PER_PAGE, filter, sortBy },
  });

  const loadMore = () => {
    const pageInfo = data?.locations?.pageInfo;
    if (!pageInfo?.hasNextPage) return;
    fetchMore({
      variables: { after: pageInfo.endCursor ?? undefined },
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
    locations: data?.locations?.edges?.map(e => e.node) ?? [],
    totalCount: data?.locations?.totalCount ?? 0,
    hasNextPage: data?.locations?.pageInfo?.hasNextPage ?? false,
    loading,
    error,
    loadMore,
    refetch,
  };
}
