import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Users, Signature, MessageCircle } from 'lucide-react-native';
import FollowButton from './FollowButton';
import MessageComposeSheet from './MessageComposeSheet';
import { PLACEHOLDER_AVATAR } from '../utils/placeholderAvatar';
import { fullName } from '../utils/formatName';
import type { FriendUser } from '../types';

interface Props {
  friend: FriendUser;
  /** Receives the tapped friend's id — keep this reference stable in the parent
   *  (e.g. useCallback) so FlatList rows can actually benefit from React.memo below. */
  onPress?: (id: string) => void;
}

function FriendCard({ friend, onPress }: Props) {
  const [followerCount, setFollowerCount] = useState(friend.followers?.length ?? 0);
  const [messageVisible, setMessageVisible] = useState(false);
  const name = fullName(friend.first_name, friend.last_name);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(friend.id)} activeOpacity={0.85}>
      <View style={styles.header}>
        <Image
          source={friend.profile_picture?.thumbnail ? { uri: friend.profile_picture.thumbnail } : PLACEHOLDER_AVATAR}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {friend.location?.formatted_address ? (
            <Text style={styles.location} numberOfLines={1}>{friend.location.formatted_address}</Text>
          ) : null}
          <View style={styles.statsRow}>
            <Users size={14} color="#9CA3AF" strokeWidth={2} />
            <Text style={styles.statText}>
              Friends <Text style={styles.statValue}>{followerCount}</Text>
            </Text>
            <View style={styles.dot} />
            <Signature size={14} color="#9CA3AF" strokeWidth={2} />
            <Text style={styles.statText}>
              Reviews <Text style={styles.statValue}>{friend.reviewsCount ?? 0}</Text>
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <FollowButton
          userId={friend.id}
          style={styles.followBtn}
          onCountChange={delta => setFollowerCount(c => Math.max(0, c + delta))}
        />

        <TouchableOpacity
          style={styles.messageBtn}
          onPress={() => setMessageVisible(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Message ${name}`}
        >
          <MessageCircle size={18} color="#7C7212" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <MessageComposeSheet visible={messageVisible} onClose={() => setMessageVisible(false)} recipientName={name} />
    </TouchableOpacity>
  );
}

export default React.memo(FriendCard);

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
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  location: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
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
