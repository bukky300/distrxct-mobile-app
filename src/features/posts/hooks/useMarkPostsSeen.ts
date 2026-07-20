import { useCallback, useEffect, useRef } from 'react';
import { useMutation, gql } from '@apollo/client';

const MARK_POSTS_SEEN_MUTATION = gql`
  mutation Mark_posts_seen($input: MarkSeenInput!) {
    mark_posts_seen(input: $input) {
      success
      message
    }
  }
`;

const FLUSH_DELAY_MS = 1000;

export function useMarkPostsSeen() {
  const [markPostsSeenMutation] = useMutation(MARK_POSTS_SEEN_MUTATION);
  const pendingRef = useRef<Set<string>>(new Set());
  const markedRef = useRef<Set<string>>(new Set());
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    flushTimerRef.current = null;
    const ids = Array.from(pendingRef.current);
    pendingRef.current.clear();
    if (ids.length === 0) return;
    // Fire-and-forget, matching web: no retry, no surfaced error on failure.
    markPostsSeenMutation({ variables: { input: { post_ids: ids } } }).catch(() => {});
  }, [markPostsSeenMutation]);

  const markSeen = useCallback(
    (postId: string) => {
      if (markedRef.current.has(postId)) return;
      markedRef.current.add(postId);
      pendingRef.current.add(postId);
      if (!flushTimerRef.current) {
        flushTimerRef.current = setTimeout(flush, FLUSH_DELAY_MS);
      }
    },
    [flush],
  );

  useEffect(() => {
    return () => {
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
    };
  }, []);

  return { markSeen };
}
