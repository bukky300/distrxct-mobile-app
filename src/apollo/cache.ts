import { InMemoryCache, type FieldMergeFunction, type Reference } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';

interface FeedEdgeStore {
  node: { post?: Reference };
  cursor: string;
}

interface FeedConnectionStore {
  edges: FeedEdgeStore[];
  page_info: unknown;
}

// Web's pagination naively concats pages with no dedup, which can produce duplicate
// cards if the backend ever returns overlapping edges across pages. Dedupe by the
// underlying post's id instead. A fetch with no `after` (initial load or a
// pull-to-refresh refetch) replaces the list rather than appending to it.
const mergeFeed: FieldMergeFunction<FeedConnectionStore> = (existing, incoming, { args, readField }) => {
  if (!args?.after || !existing) return incoming;

  const seen = new Set<unknown>();
  const dedupedEdges: FeedEdgeStore[] = [];

  const addEdges = (edges: FeedEdgeStore[] | undefined) => {
    (edges ?? []).forEach(edge => {
      const postId = edge.node.post ? readField('id', edge.node.post) : undefined;
      if (seen.has(postId)) return;
      seen.add(postId);
      dedupedEdges.push(edge);
    });
  };

  addEdges(existing.edges);
  addEdges(incoming.edges);

  return { ...incoming, edges: dedupedEdges };
};

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        locations: relayStylePagination(['filter', 'sortBy']),
        feed: {
          keyArgs: ['feed_type'],
          merge: mergeFeed,
        },
      },
    },
    Location: {
      keyFields: ['id'],
    },
    User: {
      keyFields: ['id'],
    },
    PostType: {
      keyFields: ['id'],
    },
  },
});
