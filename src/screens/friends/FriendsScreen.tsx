import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';
import TopNav from '@components/layout/TopNav';
import EmptyState from '@components/ui/EmptyState';
import FriendCard from '@features/friends/components/FriendCard';
import FriendListSkeleton from '@features/friends/components/FriendListSkeleton';
import { useFollowersAndFollowing } from '@features/friends/hooks/useFollowersAndFollowing';
import { useSearchUsers } from '@features/friends/hooks/useSearchUsers';
import { useAuthStore } from '@features/auth/store/authStore';
import type { FriendUserSummary } from '@features/friends/types';
import type { FriendsStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<FriendsStackParamList>;
type FriendsTab = 'followers' | 'following' | 'explore';

export default function FriendsScreen() {
  const navigation = useNavigation<Nav>();
  const currentUserId = useAuthStore(s => s.user?.id);
  const [activeTab, setActiveTab] = useState<FriendsTab>('followers');
  const [query, setQuery] = useState('');

  const { followers, following, loading: countsLoading } = useFollowersAndFollowing(currentUserId);
  const { results: exploreResults, searching, noResults, search } = useSearchUsers();

  const goToProfile = useCallback(
    (friendId: string) => {
      navigation.navigate('FriendsProfile', { friendId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: FriendUserSummary }) => <FriendCard friend={item} onPress={goToProfile} />,
    [goToProfile],
  );

  function handleQueryChange(text: string) {
    setQuery(text);
    if (activeTab === 'explore') search(text);
  }

  function handleTabChange(tab: FriendsTab) {
    setActiveTab(tab);
    setQuery('');
  }

  const listForTab: FriendUserSummary[] = activeTab === 'followers' ? followers : following;
  const filtered = useMemo(() => {
    if (activeTab === 'explore') return exploreResults ?? [];
    if (!query.trim()) return listForTab;
    const q = query.trim().toLowerCase();
    return listForTab.filter(
      f =>
        f.first_name?.toLowerCase().includes(q) ||
        f.last_name?.toLowerCase().includes(q) ||
        f.username?.toLowerCase().includes(q),
    );
  }, [activeTab, exploreResults, listForTab, query]);

  const isLoading = activeTab === 'explore' ? searching : countsLoading;

  let emptyMessage: string | null = null;
  if (!isLoading) {
    if (activeTab === 'explore') {
      if (noResults) emptyMessage = 'No users found.';
    } else if (filtered.length === 0) {
      emptyMessage = 'No friends Found.';
    }
  }

  return (
    <View style={styles.root}>
      <TopNav />

      <View style={styles.tabsRow}>
        <TouchableOpacity onPress={() => handleTabChange('followers')} activeOpacity={0.7}>
          <Text style={[styles.tabLabel, activeTab === 'followers' && styles.tabLabelActive]}>
            {countsLoading ? 'Followers' : `Followers (${followers.length})`}
          </Text>
          {activeTab === 'followers' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('following')} activeOpacity={0.7}>
          <Text style={[styles.tabLabel, activeTab === 'following' && styles.tabLabelActive]}>
            {countsLoading ? 'Following' : `Following (${following.length})`}
          </Text>
          {activeTab === 'following' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('explore')} activeOpacity={0.7}>
          <Text style={[styles.tabLabel, activeTab === 'explore' && styles.tabLabelActive]}>Explore</Text>
          {activeTab === 'explore' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {/* Rendered unconditionally (never swapped for the skeleton below) so typing never
          unmounts the input and drops keyboard focus mid-search. */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder={activeTab === 'explore' ? 'Search people ...' : 'Search friends ...'}
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={handleQueryChange}
          returnKeyType="search"
        />
        <Search size={18} color="#9CA3AF" strokeWidth={2} style={styles.searchIcon} />
      </View>

      {isLoading ? (
        <FriendListSkeleton count={4} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={f => f.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          ListEmptyComponent={emptyMessage ? <EmptyState icon="people-outline" title={emptyMessage} /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  tabsRow: {
    flexDirection: 'row',
    gap: 24,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  tabLabel: {
    fontSize: 16,
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
    paddingBottom: 10,
  },
  tabLabelActive: {
    color: '#2A5C40',
  },
  tabUnderline: {
    height: 2,
    backgroundColor: '#2A5C40',
    borderRadius: 1,
    marginTop: -2,
  },
  list: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  searchWrap: {
    marginHorizontal: 16,
    marginBottom: 16,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 13,
    paddingRight: 40,
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
  },
  searchIcon: {
    position: 'absolute',
    right: 14,
    top: 13,
  },
});
