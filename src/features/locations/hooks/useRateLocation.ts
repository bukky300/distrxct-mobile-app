import { useMutation, gql } from '@apollo/client';

const RATE_LOCATION = gql`
  mutation RateLocation($input: RateLocationInput!) {
    rateLocation(input: $input) {
      id score comment createdAt
    }
  }
`;

export function useRateLocation() {
  const [mutate, { loading, error }] = useMutation(RATE_LOCATION, {
    refetchQueries: ['GetLocation'],
  });

  const rateLocation = (locationId: string, score: number, comment?: string) =>
    mutate({ variables: { input: { locationId, score, comment } } });

  return { rateLocation, loading, error };
}
