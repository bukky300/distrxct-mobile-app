import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import FollowButton from '@features/friends/components/FollowButton';
import FriendListSkeleton from '@features/friends/components/FriendListSkeleton';
import EmptyState from '@components/ui/EmptyState';
import { useFollowersAndFollowing } from '@features/friends/hooks/useFollowersAndFollowing';
import { PLACEHOLDER_AVATAR } from '@features/friends/utils/placeholderAvatar';
import { fullName } from '@features/friends/utils/formatName';
import type { FriendsStackParamList } from '@navigation/types';
import type { FriendUserSummary } from '@features/friends/types';

type Route = RouteProp<FriendsStackParamList, 'FollowersList'>;

const FollowerRow = React.memo(function FollowerRow({ item }: { item: FriendUserSummary }) {
  return (
    <View style={styles.row}>
      <Image
        source={item.profile_picture?.thumbnail ? { uri: item.profile_picture.thumbnail } : PLACEHOLDER_AVATAR}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{fullName(item.first_name, item.last_name)}</Text>
        <Text style={styles.username} numberOfLines={1}>@{item.username}</Text>
      </View>
      <FollowButton userId={item.id} />
    </View>
  );
});

export default function FollowersListScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const { followers, loading } = useFollowersAndFollowing(params.friendId);

  const filtered = query.trim()
    ? followers.filter(f => fullName(f.first_name, f.last_name).toLowerCase().includes(query.trim().toLowerCase()))
    : followers;

  const renderItem = useCallback(({ item }: { item: FriendUserSummary }) => <FollowerRow item={item} />, []);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backRow} activeOpacity={0.7}>
          <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{params.friendName ? `${params.friendName}'s Followers` : 'Followers'}</Text>
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

      {loading ? (
        <FriendListSkeleton count={5} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={f => f.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          ListEmptyComponent={<EmptyState icon="people-outline" title="No friends Found." />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  searchWrap: {
    paddingHorizontal: 16,
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
    paddingHorizontal: 16,
    paddingBottom: 24,
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
  username: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
});
