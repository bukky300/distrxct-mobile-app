import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { Settings, Signature, Users, Star, Handshake } from 'lucide-react-native';
import TopNav from '@components/layout/TopNav';
import FollowersListSheet from '@features/friends/components/FollowersListSheet';
import FriendListSkeleton from '@features/friends/components/FriendListSkeleton';
import EmptyState from '@components/ui/EmptyState';
import BusinessCard from '@features/discover/components/BusinessCard';
import PostCard from '@features/posts/components/PostCard';
import { useFriendUser } from '@features/friends/hooks/useFriendUser';
import { useFollowersAndFollowing } from '@features/friends/hooks/useFollowersAndFollowing';
import { useFriendActivity } from '@features/friends/hooks/useFriendActivity';
import { useFriendCollections } from '@features/friends/hooks/useFriendCollections';
import { useMyReviews } from '@features/profile/hooks/useMyReviews';
import { useDeletePost } from '@features/posts/hooks/useDeletePost';
import { useAuthStore } from '@features/auth/store/authStore';
import { useToastStore } from '@features/ui/store/toastStore';
import { PLACEHOLDER_AVATAR } from '@features/friends/utils/placeholderAvatar';
import { fullName } from '@features/friends/utils/formatName';
import { navigateToSettings, navigateToBusiness } from '@navigation/navigationRef';
import type { HomeStackParamList } from '@navigation/types';

type ProfileTab = 'reviews' | 'activity' | 'collections';
type ProfileRoute = RouteProp<HomeStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const currentUserId = useAuthStore(s => s.user?.id);
  const showToast = useToastStore(s => s.showToast);
  const route = useRoute<ProfileRoute>();

  const [activeTab, setActiveTab] = useState<ProfileTab>(route.params?.initialTab ?? 'activity');
  const [followersVisible, setFollowersVisible] = useState(false);

  const { friend: profile, loading: profileLoading } = useFriendUser(currentUserId);
  const { followers, loading: followersLoading } = useFollowersAndFollowing(currentUserId);
  const { reviews, loading: reviewsLoading } = useMyReviews();
  const { posts, loading: activityLoading } = useFriendActivity(currentUserId);
  const { businesses, loading: collectionLoading } = useFriendCollections(currentUserId);
  const { deletePost } = useDeletePost();

  async function handleDeletePost(postId: string) {
    const result = await deletePost(postId);
    if (!result.ok) showToast(result.message, 'error');
  }

  if (profileLoading || !profile) {
    return (
      <View style={styles.root}>
        <TopNav />
        <FriendListSkeleton count={1} />
      </View>
    );
  }

  const name = fullName(profile.first_name, profile.last_name);

  return (
    <View style={styles.root}>
      <TopNav />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.identityRow}>
            <Image
              source={profile.profile_picture?.thumbnail ? { uri: profile.profile_picture.thumbnail } : PLACEHOLDER_AVATAR}
              style={styles.avatar}
            />
            <View style={styles.identityInfo}>
              <Text style={styles.name}>{name}</Text>
              {profile.location?.formattedAddress ? (
                <Text style={styles.address} numberOfLines={2}>{profile.location.formattedAddress}</Text>
              ) : null}
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
            onPress={navigateToSettings}
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
          {activeTab === 'reviews' &&
            (reviewsLoading ? (
              <FriendListSkeleton count={2} />
            ) : reviews.length === 0 ? (
              <EmptyState icon="star-outline" title="No reviews yet." />
            ) : (
              <View style={styles.reviewsList}>
                {reviews.map(review => (
                  <View key={review.id} style={styles.reviewCard}>
                    {review.content_title ? <Text style={styles.reviewTitle}>{review.content_title}</Text> : null}
                    <View style={styles.ratingRow}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={14}
                          color={i < review.rating ? '#FACC15' : '#D1D5DB'}
                          fill={i < review.rating ? '#FACC15' : 'none'}
                          strokeWidth={1.5}
                        />
                      ))}
                    </View>
                    {review.content_message ? <Text style={styles.reviewMessage}>{review.content_message}</Text> : null}
                    <View style={styles.helpfulRow}>
                      <Handshake size={16} color="#9CA3AF" strokeWidth={1.8} />
                      <Text style={styles.helpfulCount}>{review.help_count}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}

          {activeTab === 'activity' &&
            (activityLoading ? (
              <FriendListSkeleton count={2} />
            ) : posts.length === 0 ? (
              <EmptyState icon="reader-outline" title="No activity yet." />
            ) : (
              <View style={{ gap: 12 }}>
                {posts.map(post => (
                  <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
                ))}
              </View>
            ))}

          {activeTab === 'collections' &&
            (collectionLoading ? (
              <FriendListSkeleton count={2} />
            ) : businesses.length === 0 ? (
              <EmptyState icon="bookmark-outline" title="No businesses yet." />
            ) : (
              <View>
                {businesses.map(business => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    onPress={() => navigateToBusiness(business.id)}
                  />
                ))}
              </View>
            ))}
        </View>
      </ScrollView>

      <FollowersListSheet
        visible={followersVisible}
        onClose={() => setFollowersVisible(false)}
        followers={followers}
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
  reviewCard: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  reviewTitle: {
    fontSize: 15,
    fontFamily: 'Roboto_700Bold',
    color: '#1A1A1A',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewMessage: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Roboto_400Regular',
    lineHeight: 20,
  },
  helpfulRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpfulCount: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
});
