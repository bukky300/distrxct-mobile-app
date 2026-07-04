import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Signature, Users, Share2 } from 'lucide-react-native';
import { getFriendById } from '@features/friends/data/mockFriends';
import FollowersListSheet, { type FollowerRow } from '@features/friends/components/FollowersListSheet';
import ReviewListItem from '@features/discover/components/ReviewListItem';
import BusinessCard from '@features/discover/components/BusinessCard';
import { MOCK_BUSINESSES } from '@features/discover/data/mockBusinesses';
import type { BusinessReview } from '@features/discover/types';
import PostCard, { type PostData } from '@features/posts/components/PostCard';
import type { FriendsStackParamList } from '@navigation/types';

type Route = RouteProp<FriendsStackParamList, 'FriendsProfile'>;
type ProfileTab = 'reviews' | 'activity' | 'collections';

const MOCK_REVIEWS: BusinessReview[] = [
  {
    id: 'r1',
    user: { name: 'Sampato' },
    timestamp: '23 hrs ago',
    rating: 2,
    comment: 'Lorem ipsum dolor sit amet consectetur. Odio sed neque risus cras lacus',
    helpfulCount: 0,
  },
  {
    id: 'r2',
    user: { name: 'Sampato' },
    timestamp: '23 hrs ago',
    rating: 2,
    comment: 'Lorem ipsum dolor sit amet consectetur. Odio sed neque risus cras lacus',
    helpfulCount: 0,
  },
];

const FOLLOWERS: FollowerRow[] = [
  {
    id: 'f1',
    name: 'Kinsley Ekene',
    avatar: require('../../../assets/images/profile.png'),
    isFollowing: false,
  },
];

export default function FriendsProfileScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();

  const friend = getFriendById(params.friendId);

  const [isFollowing, setIsFollowing] = useState(friend?.isFollowing ?? false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('reviews');
  const [followersVisible, setFollowersVisible] = useState(false);
  const [followers, setFollowers] = useState(FOLLOWERS);

  if (!friend) return null;

  const activityPost: PostData = {
    id: 'a1',
    type: 'review',
    user: { name: friend.name },
    timestamp: '5 hrs ago',
    reviewedBusiness: 'ABC hotels',
    location: 'Lagos, Nigeria',
    rating: 3,
    body: 'Amazing experience! The staff were friendly and the service was top notch. Will definitely come back',
    imageUri: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
    helpfulCount: 21,
    commentCount: 5,
    isOwner: false,
  };

  function toggleFollower(id: string) {
    setFollowers(list =>
      list.map(f => (f.id === id ? { ...f, isFollowing: !f.isFollowing } : f)),
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backRow} activeOpacity={0.7}>
          <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          <View style={styles.identityRow}>
            <Image source={friend.avatar} style={styles.avatar} />
            <View style={styles.identityInfo}>
              <Text style={styles.name}>{friend.name}</Text>
              <View style={styles.statsRow}>
                <TouchableOpacity
                  style={styles.statBtn}
                  onPress={() => setActiveTab('reviews')}
                  activeOpacity={0.7}
                >
                  <Signature size={14} color="#9CA3AF" strokeWidth={2} />
                  <Text style={styles.statText}>Reviews</Text>
                </TouchableOpacity>
                <View style={styles.dot} />
                <TouchableOpacity
                  style={styles.statBtn}
                  onPress={() => setFollowersVisible(true)}
                  activeOpacity={0.7}
                >
                  <Users size={14} color="#2A5C40" strokeWidth={2} />
                  <Text style={styles.statTextActive}>
                    Followers <Text style={styles.statValue}>{followers.length}</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.followBtn, !isFollowing && styles.followBtnActive]}
              onPress={() => setIsFollowing(f => !f)}
              activeOpacity={0.85}
            >
              <Text style={[styles.followText, !isFollowing && styles.followTextActive]}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareBtn} activeOpacity={0.7}>
              <Text style={styles.shareText}>Share</Text>
              <Share2 size={15} color="#1A1A1A" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsRow}>
          <TouchableOpacity onPress={() => setActiveTab('reviews')} activeOpacity={0.7}>
            <Text style={[styles.tabLabel, activeTab === 'reviews' && styles.tabLabelActive]}>
              Reviews
            </Text>
            {activeTab === 'reviews' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('activity')} activeOpacity={0.7}>
            <Text style={[styles.tabLabel, activeTab === 'activity' && styles.tabLabelActive]}>
              Activity
            </Text>
            {activeTab === 'activity' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('collections')} activeOpacity={0.7}>
            <Text style={[styles.tabLabel, activeTab === 'collections' && styles.tabLabelActive]}>
              Collections
            </Text>
            {activeTab === 'collections' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <View style={styles.tabsDivider} />
        </View>

        <View style={styles.section}>
          {activeTab === 'reviews' && (
            <View style={styles.reviewsList}>
              {MOCK_REVIEWS.map(review => (
                <ReviewListItem key={review.id} review={review} />
              ))}
            </View>
          )}

          {activeTab === 'activity' && <PostCard post={activityPost} />}

          {activeTab === 'collections' && (
            <View>
              {MOCK_BUSINESSES.map(business => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <FollowersListSheet
        visible={followersVisible}
        onClose={() => setFollowersVisible(false)}
        followers={followers}
        onToggleFollow={toggleFollower}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  scroll: {
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    gap: 18,
  },
  identityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  identityInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  name: {
    fontSize: 19,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
  statTextActive: {
    fontSize: 13,
    color: '#2A5C40',
    fontFamily: 'Roboto_400Regular',
  },
  statValue: {
    fontFamily: 'Roboto_400Bold',
    color: '#2A5C40',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  followBtn: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followBtnActive: {
    backgroundColor: '#2A5C40',
  },
  followText: {
    fontSize: 15,
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  followTextActive: {
    color: '#FFFFFF',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  shareText: {
    fontSize: 15,
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 24,
    paddingHorizontal: 16,
    paddingTop: 22,
  },
  tabLabel: {
    fontSize: 15,
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
  tabsDivider: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  reviewsList: {
    gap: 12,
  },
});
