import { useQuery, gql } from '@apollo/client';
import type { FriendUser } from '../types';

const GET_USER = gql`
  query User($userId: UUID!) {
    user(user_id: $userId) {
      id
      profile_picture {
        original
        thumbnail
        medium
      }
      username
      first_name
      last_name
      followers {
        id
        profile_picture {
          original
          thumbnail
          medium
        }
        username
        first_name
        last_name
      }
      location {
        formattedAddress
      }
    }
  }
`;

export function useFriendUser(userId: string | undefined) {
  const { data, loading, error, refetch } = useQuery<{ user: FriendUser | null }>(GET_USER, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'network-only',
  });

  return { friend: data?.user ?? null, loading, error, refetch };
}
