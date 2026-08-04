import { useQuery, gql } from '@apollo/client';
import type { FriendUserSummary } from '../types';

const GET_FOLLOWERS_AND_FOLLOWING = gql`
  query User($userId: UUID!) {
    user(user_id: $userId) {
      id
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
      following {
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
    }
  }
`;

interface Result {
  user: {
    id: string;
    followers: FriendUserSummary[];
    following: FriendUserSummary[];
  } | null;
}

export function useFollowersAndFollowing(userId: string | undefined) {
  const { data, loading, error, refetch } = useQuery<Result>(GET_FOLLOWERS_AND_FOLLOWING, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'network-only',
  });

  return {
    followers: data?.user?.followers ?? [],
    following: data?.user?.following ?? [],
    loading,
    error,
    refetch,
  };
}
