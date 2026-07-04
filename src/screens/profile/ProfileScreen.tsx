import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Settings, Signature, Users } from 'lucide-react-native';
import TopNav from '@components/layout/TopNav';
import FollowersListSheet, { type FollowerRow } from '@features/friends/components/FollowersListSheet';
import ReviewListItem from '@features/discover/components/ReviewListItem';
import BusinessCard from '@features/discover/components/BusinessCard';
import { MOCK_BUSINESSES } from '@features/discover/data/mockBusinesses';
import type { BusinessReview } from '@features/discover/types';
import PostCard, { type PostData } from '@features/posts/components/PostCard';

type ProfileTab = 'reviews' | 'activity' | 'collections';

// Placeholder data — replace with real auth/profile state
const MOCK_PROFILE = {
  name: 'Kinsley Ekene',
  address: 'Market Way, Uyo, Akwa Ibom, 520108, Nigeria',
  avatar: require('../../../assets/images/profile.png'),
};

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

const ACTIVITY_POST: PostData = {
  id: 'a1',
  type: 'review',
  user: { name: 'Kingsley' },
  timestamp: '5 hrs ago',
  reviewedBusiness: 'ABC hotels',
  location: 'Lagos, Nigeria',
  rating: 3,
  body: 'Amazing experience! The staff were friendly and the service was top notch. Will definitely come back',
  imageUri: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
  helpfulCount: 21,
  commentCount: 5,
  isOwner: true,
};

const FOLLOWERS: FollowerRow[] = [
  {
    id: 'f1',
    name: 'Kinsley Ekene',
    avatar: require('../../../assets/images/reviewprofile.png'),
    isFollowing: false,
  },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('activity');
  const [followersVisible, setFollowersVisible] = useState(false);
  const [followers, setFollowers] = useState(FOLLOWERS);

  function toggleFollower(id: string) {
    setFollowers(list =>
      list.map(f => (f.id === id ? { ...f, isFollowing: !f.isFollowing } : f)),
    );
  }

  return (
    <View style={styles.root}>
      <TopNav />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.identityRow}>
            <Image source={MOCK_PROFILE.avatar} style={styles.avatar} />
            <View style={styles.identityInfo}>
              <Text style={styles.name}>{MOCK_PROFILE.name}</Text>
              <Text style={styles.address} numberOfLines={2}>{MOCK_PROFILE.address}</Text>
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

          <TouchableOpacity
            style={styles.settingsBtn}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <Settings size={18} color="#2A5C40" strokeWidth={2} />
          </TouchableOpacity>
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

          {activeTab === 'activity' && <PostCard post={ACTIVITY_POST} />}

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
  scroll: {
    paddingBottom: 24,
  },
  pageTitle: {
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  profileCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
  },
  identityRow: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 36,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  identityInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  name: {
    fontSize: 19,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  address: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Roboto_400Regular',
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
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
  settingsBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
