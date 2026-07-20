import { useCallback } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import type { CommentConnection } from '../types';

const GET_COMMENTS_BY_POST = gql`
  query GetCommentsByPost($postId: String!, $offset: Int!, $limit: Int!) {
    get_comments_by_post(post_id: $postId, offset: $offset, limit: $limit) {
      comments {
        id
        content
        created_at
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
      total_count
      has_next_page
    }
  }
`;

const COMMENTS_PAGE_SIZE = 20;

export function usePostComments(postId: string) {
  const [execute, { data, loading, error, called, refetch }] = useLazyQuery<{
    get_comments_by_post: CommentConnection;
  }>(GET_COMMENTS_BY_POST);

  // Variables belong on the execute call (not the hook config) per Apollo 3.14.
  const fetchComments = useCallback(
    () => execute({ variables: { postId, offset: 0, limit: COMMENTS_PAGE_SIZE } }),
    [execute, postId],
  );

  return {
    comments: data?.get_comments_by_post?.comments ?? [],
    totalCount: data?.get_comments_by_post?.total_count ?? 0,
    loading,
    error,
    called,
    fetchComments,
    refetch,
  };
}
