import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';
import FollowButton from './FollowButton';
import { PLACEHOLDER_AVATAR } from '../utils/placeholderAvatar';
import { fullName } from '../utils/formatName';
import type { FriendUserSummary } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  followers: FriendUserSummary[];
}

export default function FollowersListSheet({ visible, onClose, followers }: Props) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? followers.filter(f => fullName(f.first_name, f.last_name).toLowerCase().includes(query.trim().toLowerCase()))
    : followers;

  function handleClose() {
    setQuery('');
    onClose();
  }

  return (
    <BottomSheet visible={visible} onClose={handleClose}>
      <View style={styles.header}>
        <Text style={styles.title}>Followers</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
          <X size={16} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search followers ..."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
      >
        {filtered.map(follower => (
          <View key={follower.id} style={styles.row}>
            <Image
              source={
                follower.profile_picture?.thumbnail ? { uri: follower.profile_picture.thumbnail } : PLACEHOLDER_AVATAR
              }
              style={styles.avatar}
            />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{fullName(follower.first_name, follower.last_name)}</Text>
              <Text style={styles.subtitle} numberOfLines={1}>@{follower.username}</Text>
            </View>
            <FollowButton userId={follower.id} />
          </View>
        ))}

        {filtered.length === 0 && (
          <Text style={styles.empty}>No followers found</Text>
        )}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    padding: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
  empty: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    paddingVertical: 24,
  },
});
