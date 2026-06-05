import { useQuery, gql } from '@apollo/client';

const GET_LOCATION = gql`
  query GetLocation($id: UUID!) {
    location(id: $id) {
      id name description address latitude longitude
      category images averageRating ratingCount myRating
      createdAt updatedAt
      createdBy { id username avatarUrl }
    }
  }
`;

export function useLocationDetail(id: string) {
  const { data, loading, error } = useQuery(GET_LOCATION, {
    variables: { id },
    skip: !id,
  });

  return { location: data?.location ?? null, loading, error };
}
