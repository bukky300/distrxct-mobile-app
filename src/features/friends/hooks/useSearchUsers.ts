import { useCallback, useEffect, useRef, useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { useAuthStore } from '@features/auth/store/authStore';
import type { FriendUserSummary } from '../types';

const SEARCH_USERS = gql`
  query Search_users($query: String!) {
    search_users(query: $query) {
      id
      first_name
      last_name
      username
      followers {
        id
        first_name
        last_name
        username
      }
      profile_picture {
        original
        thumbnail
      }
    }
  }
`;

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 1000;

export function useSearchUsers() {
  const currentUserId = useAuthStore(s => s.user?.id);
  const [results, setResults] = useState<FriendUserSummary[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [runSearch] = useLazyQuery<{ search_users: FriendUserSummary[] }>(SEARCH_USERS, {
    fetchPolicy: 'network-only',
  });

  const search = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      const trimmed = query.trim();
      if (trimmed.length < MIN_QUERY_LENGTH) {
        setSearching(false);
        setResults(null);
        setNoResults(false);
        return;
      }

      // Only flip into the "searching" state once the pause has actually elapsed —
      // showing it immediately on keystroke would signal a search that hasn't started yet.
      debounceRef.current = setTimeout(async () => {
        setSearching(true);
        try {
          const { data } = await runSearch({ variables: { query: trimmed } });
          const filtered = (data?.search_users ?? []).filter(u => u.id !== currentUserId);
          if (filtered.length > 0) {
            setResults(filtered);
            setNoResults(false);
          } else {
            setResults(null);
            setNoResults(true);
          }
        } catch {
          setResults(null);
          setNoResults(true);
        } finally {
          setSearching(false);
        }
      }, DEBOUNCE_MS);
    },
    [runSearch, currentUserId],
  );

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  return { results, searching, noResults, search };
}
