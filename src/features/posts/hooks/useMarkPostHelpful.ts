import { useMutation, useApolloClient, gql } from '@apollo/client';

const MARK_POST_HELPFUL_MUTATION = gql`
  mutation MarkPostHelpful($post_id: String!) {
    mark_post_helpful(post_id: $post_id)
  }
`;

const POST_HELPFUL_FRAGMENT = gql`
  fragment PostHelpfulFields on PostType {
    id
    helpful_count
    is_helpful_by_current_user
  }
`;

interface PostHelpfulFields {
  id: string;
  helpful_count: number;
  is_helpful_by_current_user: boolean;
}

export function useMarkPostHelpful() {
  const client = useApolloClient();
  const [markPostHelpfulMutation] = useMutation(MARK_POST_HELPFUL_MUTATION);

  // Optimistic-only, matching web: the mutation returns a bare boolean, no authoritative
  // count/state — flip the cache immediately, only roll back if the request itself errors.
  const toggleHelpful = async (postId: string) => {
    const cacheId = client.cache.identify({ __typename: 'PostType', id: postId });
    if (!cacheId) return;

    const current = client.cache.readFragment<PostHelpfulFields>({
      id: cacheId,
      fragment: POST_HELPFUL_FRAGMENT,
    });
    if (!current) return;

    const optimistic: PostHelpfulFields = {
      id: postId,
      is_helpful_by_current_user: !current.is_helpful_by_current_user,
      helpful_count: current.helpful_count + (current.is_helpful_by_current_user ? -1 : 1),
    };

    client.cache.writeFragment({ id: cacheId, fragment: POST_HELPFUL_FRAGMENT, data: optimistic });

    try {
      await markPostHelpfulMutation({ variables: { post_id: postId } });
    } catch {
      client.cache.writeFragment({ id: cacheId, fragment: POST_HELPFUL_FRAGMENT, data: current });
    }
  };

  return { toggleHelpful };
}
