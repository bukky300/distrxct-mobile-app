import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useToastStore } from '@features/ui/store/toastStore';
import type { ConnectionStatus } from '../types';

const GET_CONNECTION_STATUS = gql`
  query Get_connection_status($targetUserId: UUID!) {
    get_connection_status(target_user_id: $targetUserId) {
      is_following
      is_followed_by
      is_mutual
    }
  }
`;

const FOLLOW_USER = gql`
  mutation Follow_user($userId: UUID!) {
    follow_user(user_id: $userId)
  }
`;

const UNFOLLOW_USER = gql`
  mutation Unfollow_user($userId: UUID!) {
    unfollow_user(user_id: $userId)
  }
`;

interface Options {
  /** Lets the caller keep a visible follower count in sync without a refetch. */
  onCountChange?: (delta: 1 | -1) => void;
}

export function useFollowToggle(userId: string | undefined, options: Options = {}) {
  const { onCountChange } = options;
  const showToast = useToastStore(s => s.showToast);
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [toggling, setToggling] = useState(false);

  // cache-and-network (not network-only): serves a cached status immediately when a row
  // remounts during list virtualization/filtering, while still refreshing in the background —
  // avoids every visible row firing a blocking network round-trip on every mount.
  const { data } = useQuery<{ get_connection_status: ConnectionStatus }>(GET_CONNECTION_STATUS, {
    variables: { targetUserId: userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (data?.get_connection_status) setStatus(data.get_connection_status);
  }, [data]);

  const [followMutate] = useMutation<{ follow_user: boolean }>(FOLLOW_USER);
  const [unfollowMutate] = useMutation<{ unfollow_user: boolean }>(UNFOLLOW_USER);

  const toggleFollow = useCallback(async () => {
    if (!status || !userId || toggling) return;

    const previous = status;
    const wasFollowingOrMutual = status.is_following || status.is_mutual;
    const optimistic: ConnectionStatus = wasFollowingOrMutual
      ? { is_following: false, is_followed_by: status.is_followed_by, is_mutual: false }
      : { is_following: true, is_followed_by: status.is_followed_by, is_mutual: status.is_followed_by };

    setStatus(optimistic);
    setToggling(true);

    try {
      if (wasFollowingOrMutual) {
        const { data: res } = await unfollowMutate({ variables: { userId } });
        if (!res?.unfollow_user) throw new Error("Couldn't unfollow. Try again.");
        onCountChange?.(-1);
      } else {
        const { data: res } = await followMutate({ variables: { userId } });
        if (!res?.follow_user) throw new Error("Couldn't follow. Try again.");
        onCountChange?.(1);
      }
    } catch (e) {
      setStatus(previous);
      showToast(e instanceof Error ? e.message : "Couldn't update follow status. Try again.", 'error');
    } finally {
      setToggling(false);
    }
  }, [status, userId, toggling, followMutate, unfollowMutate, onCountChange, showToast]);

  return { status, toggling, toggleFollow };
}
