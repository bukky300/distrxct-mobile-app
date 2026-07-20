import { useCallback } from 'react';
import { useMutation, gql } from '@apollo/client';
import type { Comment } from '../types';

const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentCreateInput!) {
    create_comment(input: $input) {
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
  }
`;

export function useAddComment(postId: string) {
  const [mutate, { loading, error }] = useMutation<{ create_comment: Comment }>(CREATE_COMMENT);

  const addComment = useCallback(
    async (content: string): Promise<Comment | null> => {
      const trimmed = content.trim();
      if (!trimmed) return null;
      const { data } = await mutate({
        variables: { input: { post_id: postId, content: trimmed } },
      });
      return data?.create_comment ?? null;
    },
    [mutate, postId],
  );

  return { addComment, submitting: loading, error };
}
