import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Users, Signature, MessageCircle } from 'lucide-react-native';
import type { Friend } from '../types';

interface Props {
  friend: Friend;
  onPress?: () => void;
  onToggleFollow?: () => void;
  onPressMessage?: () => void;
}

export default function FriendCard({ friend, onPress, onToggleFollow, onPressMessage }: Props) {
  const label = friend.isFollowing ? 'Unfollow' : friend.followsYou ? 'Follow back' : 'Follow';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <Image source={friend.avatar} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{friend.name}</Text>
          <View style={styles.statsRow}>
            <Users size={14} color="#9CA3AF" strokeWidth={2} />
            <Text style={styles.statText}>
              Friends <Text style={styles.statValue}>{friend.friendsCount}</Text>
            </Text>
            <View style={styles.dot} />
            <Signature size={14} color="#9CA3AF" strokeWidth={2} />
            <Text style={styles.statText}>
              Reviews <Text style={styles.statValue}>{friend.reviewsCount}</Text>
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.followBtn, friend.isFollowing && styles.followBtnUnfollow]}
          onPress={onToggleFollow}
          activeOpacity={0.8}
        >
          <Text style={[styles.followText, friend.isFollowing && styles.followTextUnfollow]}>
            {label}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.messageBtn}
          onPress={onPressMessage}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Message ${friend.name}`}
        >
          <MessageCircle size={18} color="#7C7212" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 14,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
  statValue: {
    color: '#2A5C40',
    fontFamily: 'Roboto_400Bold',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  followBtn: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#2A5C40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followBtnUnfollow: {
    backgroundColor: '#D1D5DB',
  },
  followText: {
    fontSize: 15,
    fontFamily: 'Roboto_400Bold',
    color: '#FFFFFF',
  },
  followTextUnfollow: {
    color: '#1A1A1A',
  },
  messageBtn: {
    width: 50,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
