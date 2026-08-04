import { useCallback } from 'react';
import { useMutation, useApolloClient, gql, type Reference } from '@apollo/client';

const DELETE_POST = gql`
  mutation Delete_post($postId: String!) {
    delete_post(post_id: $postId)
  }
`;

interface FeedEdgeRef {
  node: { post?: Reference };
  cursor: string;
}

interface FeedConnectionRef {
  edges: FeedEdgeRef[];
  page_info: unknown;
}

type DeleteResult = { ok: true } | { ok: false; message: string };

export function useDeletePost() {
  const client = useApolloClient();
  const [mutate, { loading }] = useMutation<{ delete_post: boolean }>(DELETE_POST);

  const deletePost = useCallback(
    async (postId: string): Promise<DeleteResult> => {
      try {
        const { data } = await mutate({ variables: { postId } });
        // delete_post returns a non-null Boolean that can legitimately be false —
        // a resolved promise alone doesn't mean the post was actually deleted.
        if (!data?.delete_post) {
          return { ok: false, message: "Couldn't delete this post. Try again." };
        }

        // Strip the post from every cached feed list (any feed_type) before evicting the
        // entity, so `readField` can still resolve the id off the still-live reference.
        client.cache.modify({
          fields: {
            feed(existing, { readField }) {
              const conn = existing as FeedConnectionRef | undefined;
              if (!conn?.edges) return existing;
              return {
                ...conn,
                edges: conn.edges.filter(edge => {
                  const post = edge.node.post;
                  return !post || readField('id', post) !== postId;
                }),
              };
            },
          },
        });

        const cacheId = client.cache.identify({ __typename: 'PostType', id: postId });
        if (cacheId) client.cache.evict({ id: cacheId });
        client.cache.gc();

        return { ok: true };
      } catch (e) {
        return { ok: false, message: e instanceof Error ? e.message : "Couldn't delete this post. Try again." };
      }
    },
    [mutate, client],
  );

  return { deletePost, submitting: loading };
}
