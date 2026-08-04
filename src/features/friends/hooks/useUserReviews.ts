import { useQuery, gql } from '@apollo/client';

const GET_REVIEWS_BY_USER_ID = gql`
  query Get_review_by_user_id($userId: String!) {
    get_review_by_user_id(user_id: $userId) {
      id
      author {
        id
        first_name
        last_name
        username
      }
      content_title
      content_message
      store_id
      rating
      help_count
      is_helpful_by_current_user
    }
  }
`;

export interface FriendReview {
  id: string;
  author: { id: string; first_name: string; last_name: string; username: string };
  content_title: string | null;
  content_message: string | null;
  store_id: string;
  rating: number;
  help_count: number;
  is_helpful_by_current_user: boolean;
}

export function useUserReviews(userId: string | undefined) {
  const { data, loading, error } = useQuery<{ get_review_by_user_id: FriendReview[] }>(
    GET_REVIEWS_BY_USER_ID,
    { variables: { userId }, skip: !userId, fetchPolicy: 'network-only' },
  );

  return { reviews: data?.get_review_by_user_id ?? [], loading, error };
}
