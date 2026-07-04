import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';
import TopNav from '@components/layout/TopNav';
import FriendCard from '@features/friends/components/FriendCard';
import { MOCK_FRIENDS } from '@features/friends/data/mockFriends';
import type { Friend } from '@features/friends/types';
import type { FriendsStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<FriendsStackParamList>;
type FriendsTab = 'followers' | 'following' | 'explore';

export default function FriendsScreen() {
  const navigation = useNavigation<Nav>();
  const [friends, setFriends] = useState<Friend[]>(MOCK_FRIENDS);
  const [activeTab, setActiveTab] = useState<FriendsTab>('followers');
  const [query, setQuery] = useState('');

  function toggleFollow(id: string) {
    setFriends(list =>
      list.map(f => (f.id === id ? { ...f, isFollowing: !f.isFollowing } : f)),
    );
  }

  const tabFiltered = friends.filter(f => {
    if (activeTab === 'followers') return f.followsYou;
    if (activeTab === 'following') return f.isFollowing;
    return !f.isFollowing && !f.followsYou;
  });

  const visibleFriends = query.trim()
    ? tabFiltered.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : tabFiltered;

  return (
    <View style={styles.root}>
      <TopNav />

      <View style={styles.tabsRow}>
        <TouchableOpacity onPress={() => setActiveTab('followers')} activeOpacity={0.7}>
          <Text style={[styles.tabLabel, activeTab === 'followers' && styles.tabLabelActive]}>
            Followers
          </Text>
          {activeTab === 'followers' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('following')} activeOpacity={0.7}>
          <Text style={[styles.tabLabel, activeTab === 'following' && styles.tabLabelActive]}>
            Following
          </Text>
          {activeTab === 'following' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('explore')} activeOpacity={0.7}>
          <Text style={[styles.tabLabel, activeTab === 'explore' && styles.tabLabelActive]}>
            Explore
          </Text>
          {activeTab === 'explore' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {activeTab !== 'explore' && (
        <Text style={styles.countText}>
          {activeTab === 'followers'
            ? `${tabFiltered.length} followers`
            : `following (${tabFiltered.length})`}
        </Text>
      )}

      <FlatList
        data={visibleFriends}
        keyExtractor={f => f.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.searchWrap}>
            <TextInput
              style={styles.searchInput}
              placeholder={activeTab === 'explore' ? 'Search People ...' : 'Search Friends ...'}
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
            />
            <Search size={18} color="#9CA3AF" strokeWidth={2} style={styles.searchIcon} />
          </View>
        }
        renderItem={({ item }) => (
          <FriendCard
            friend={item}
            onPress={() => navigation.navigate('FriendsProfile', { friendId: item.id })}
            onToggleFollow={() => toggleFollow(item.id)}
          />
        )}
      />
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
    fontSize: 17,
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
  countText: {
    fontSize: 15,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
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
