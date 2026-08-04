import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useAuthStore } from '@features/auth/store/authStore';
import { useFollowToggle } from '../hooks/useFollowToggle';

interface Props {
  userId: string;
  onCountChange?: (delta: 1 | -1) => void;
  style?: StyleProp<ViewStyle>;
}

function FollowButton({ userId, onCountChange, style }: Props) {
  const currentUserId = useAuthStore(s => s.user?.id);
  const { status, toggling, toggleFollow } = useFollowToggle(userId, { onCountChange });

  // Never render on your own card/profile.
  if (!currentUserId || currentUserId === userId) return null;

  const loading = !status;
  const isFollowingOrMutual = !!status && (status.is_following || status.is_mutual);
  const label = isFollowingOrMutual ? 'Unfollow' : status?.is_followed_by ? 'Follow Back' : 'Follow';

  return (
    <TouchableOpacity
      style={[styles.btn, isFollowingOrMutual ? styles.btnUnfollow : styles.btnFollow, style]}
      onPress={toggleFollow}
      disabled={toggling || loading}
      activeOpacity={0.8}
    >
      {toggling || loading ? (
        <ActivityIndicator size="small" color={isFollowingOrMutual ? '#1A1A1A' : '#FFFFFF'} />
      ) : (
        <Text style={[styles.text, isFollowingOrMutual ? styles.textUnfollow : styles.textFollow]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

export default React.memo(FollowButton);

const styles = StyleSheet.create({
  btn: {
    height: 40,
    minWidth: 96,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFollow: {
    backgroundColor: '#2A5C40',
  },
  btnUnfollow: {
    backgroundColor: '#E5E7EB',
  },
  text: {
    fontSize: 14,
    fontFamily: 'Roboto_400Bold',
  },
  textFollow: {
    color: '#FFFFFF',
  },
  textUnfollow: {
    color: '#1A1A1A',
  },
});
