import { useQuery, gql } from '@apollo/client';
import type { PostData } from '@features/posts/components/PostCard';
import { useAuthStore } from '@features/auth/store/authStore';
import { fullName } from '../utils/formatName';
import { relativeTime } from '../utils/relativeTime';

const GET_POSTS_BY_USER = gql`
  query Resolve_posts_by_user($userId: String!) {
    resolve_posts_by_user(user_id: $userId) {
      id
      post_title
      post_content
      comment_count
      helpful_count
      created_at
      media_url {
        original
        thumbnail
        medium
      }
      author {
        id
        username
        first_name
        last_name
        profile_picture {
          original
          thumbnail
          medium
        }
      }
    }
  }
`;

interface RawPost {
  id: string;
  post_title: string | null;
  post_content: string | null;
  comment_count: number;
  helpful_count: number;
  created_at: string;
  media_url: { original: string | null; thumbnail: string | null; medium: string | null } | null;
  author: {
    id: string;
    first_name: string;
    last_name: string;
    profile_picture: { original: string | null; thumbnail: string | null; medium: string | null } | null;
  };
}

function toPostData(post: RawPost, currentUserId: string | undefined): PostData {
  return {
    id: post.id,
    type: 'post',
    user: {
      name: fullName(post.author.first_name, post.author.last_name),
      avatarUri: post.author.profile_picture?.thumbnail ?? undefined,
    },
    timestamp: relativeTime(post.created_at),
    title: post.post_title ?? undefined,
    body: post.post_content ?? '',
    imageUri: post.media_url?.original ?? undefined,
    helpfulCount: post.helpful_count,
    commentCount: post.comment_count,
    isOwner: post.author.id === currentUserId,
  };
}

// Also used for the current user's own Activity tab (userId === signed-in user) —
// isOwner is derived by comparison so both call sites get the correct value automatically.
export function useFriendActivity(userId: string | undefined) {
  const currentUserId = useAuthStore(s => s.user?.id);
  const { data, loading, error } = useQuery<{ resolve_posts_by_user: RawPost[] }>(GET_POSTS_BY_USER, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'network-only',
  });

  return {
    posts: (data?.resolve_posts_by_user ?? []).map(post => toPostData(post, currentUserId)),
    loading,
    error,
  };
}
