import { useQuery, gql } from '@apollo/client';
import { useAuthStore } from '@features/auth/store/authStore';

const GET_FULL_USER = gql`
  query User($userId: UUID!) {
    user(user_id: $userId) {
      id
      username
      first_name
      last_name
      is_store_owner
      provider
      updated_at
      phone_number
      gender
      email
      created_at
      bio
      profile_picture {
        original
        thumbnail
        medium
      }
    }
  }
`;

export interface FullUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  is_store_owner: boolean;
  provider: string;
  updated_at: string;
  phone_number: string | null;
  gender: string | null;
  email: string;
  created_at: string;
  bio: string | null;
  profile_picture: { original: string | null; thumbnail: string | null; medium: string | null } | null;
}

export function useFullUser() {
  const userId = useAuthStore(s => s.user?.id);
  const { data, loading, error, refetch } = useQuery<{ user: FullUser | null }>(GET_FULL_USER, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'network-only',
  });

  return { user: data?.user ?? null, loading, error, refetch };
}
