import { useQuery, gql } from '@apollo/client';
import type { FriendReview } from '@features/friends/hooks/useUserReviews';

// Own-profile reviews use the no-arg, session-scoped query — matches web's own
// profile page (getServerReviewsByUser), distinct from the id-based query used
// for viewing someone else's reviews.
const GET_MY_REVIEWS = gql`
  query Get_review_by_user {
    get_review_by_user {
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

export function useMyReviews() {
  const { data, loading, error } = useQuery<{ get_review_by_user: FriendReview[] }>(GET_MY_REVIEWS, {
    fetchPolicy: 'network-only',
  });

  return { reviews: data?.get_review_by_user ?? [], loading, error };
}
