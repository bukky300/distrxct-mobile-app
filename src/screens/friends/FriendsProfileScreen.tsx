import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Signature, Users, Share2, MoreVertical, MessageCircle, Star, Handshake } from 'lucide-react-native';
import FollowButton from '@features/friends/components/FollowButton';
import FriendOptionsSheet from '@features/friends/components/FriendOptionsSheet';
import MessageComposeSheet from '@features/friends/components/MessageComposeSheet';
import FriendListSkeleton from '@features/friends/components/FriendListSkeleton';
import EmptyState from '@components/ui/EmptyState';
import { useFriendUser } from '@features/friends/hooks/useFriendUser';
import { useUserReviews } from '@features/friends/hooks/useUserReviews';
import { useFriendActivity } from '@features/friends/hooks/useFriendActivity';
import { useFriendCollections } from '@features/friends/hooks/useFriendCollections';
import { PLACEHOLDER_AVATAR } from '@features/friends/utils/placeholderAvatar';
import { fullName } from '@features/friends/utils/formatName';
import BusinessCard from '@features/discover/components/BusinessCard';
import PostCard from '@features/posts/components/PostCard';
import type { FriendsStackParamList } from '@navigation/types';
import { navigateToBusiness } from '@navigation/navigationRef';

type Route = RouteProp<FriendsStackParamList, 'FriendsProfile'>;
type Nav = NativeStackNavigationProp<FriendsStackParamList>;
type ProfileTab = 'reviews' | 'activity' | 'collection';

export default function FriendsProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<ProfileTab>('reviews');
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);

  const { friend, loading: friendLoading } = useFriendUser(params.friendId);
  const { reviews, loading: reviewsLoading } = useUserReviews(params.friendId);
  const { posts, loading: activityLoading } = useFriendActivity(params.friendId);
  const { businesses, loading: collectionLoading } = useFriendCollections(params.friendId);

  if (friendLoading || !friend) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={navigation.goBack} style={styles.backRow} activeOpacity={0.7}>
            <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <FriendListSkeleton count={1} />
      </View>
    );
  }

  const name = fullName(friend.first_name, friend.last_name);
  const followerCount = friend.followers?.length ?? 0;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backRow} activeOpacity={0.7}>
          <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOptionsVisible(true)} style={styles.kebabBtn} activeOpacity={0.7}>
          <MoreVertical size={20} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          <View style={styles.identityRow}>
            <Image
              source={friend.profile_picture?.thumbnail ? { uri: friend.profile_picture.thumbnail } : PLACEHOLDER_AVATAR}
              style={styles.avatar}
            />
            <View style={styles.identityInfo}>
              <Text style={styles.name}>{name}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statBtn}>
                  <Signature size={14} color="#9CA3AF" strokeWidth={2} />
                  <Text style={styles.statText}>
                    Reviews <Text style={styles.statValue}>{reviews.length}</Text>
                  </Text>
                </View>
                <View style={styles.dot} />
                <TouchableOpacity
                  style={styles.statBtn}
                  onPress={() => navigation.navigate('FollowersList', { friendId: friend.id, friendName: name })}
                  activeOpacity={0.7}
                >
                  <Users size={14} color="#2A5C40" strokeWidth={2} />
                  <Text style={styles.statTextActive}>
                    Followers <Text style={styles.statValue}>{followerCount}</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <FollowButton userId={friend.id} style={styles.followBtn} />

            <TouchableOpacity style={styles.messageBtn} onPress={() => setMessageVisible(true)} activeOpacity={0.7}>
              <MessageCircle size={16} color="#1A1A1A" strokeWidth={2} />
              <Text style={styles.messageText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareBtn} onPress={() => setOptionsVisible(true)} activeOpacity={0.7}>
              <Share2 size={15} color="#1A1A1A" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsRow}>
          <TouchableOpacity onPress={() => setActiveTab('reviews')} activeOpacity={0.7}>
            <Text style={[styles.tabLabel, activeTab === 'reviews' && styles.tabLabelActive]}>Reviews</Text>
            {activeTab === 'reviews' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('activity')} activeOpacity={0.7}>
            <Text style={[styles.tabLabel, activeTab === 'activity' && styles.tabLabelActive]}>Activity</Text>
            {activeTab === 'activity' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('collection')} activeOpacity={0.7}>
            <Text style={[styles.tabLabel, activeTab === 'collection' && styles.tabLabelActive]}>Collection</Text>
            {activeTab === 'collection' && <View style={styles.tabUnderline} />}
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
                  <PostCard key={post.id} post={post} />
                ))}
              </View>
            ))}

          {activeTab === 'collection' &&
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

      <FriendOptionsSheet
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        friendId={friend.id}
        friendName={name}
      />
      <MessageComposeSheet visible={messageVisible} onClose={() => setMessageVisible(false)} recipientName={name} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  kebabBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  messageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  shareBtn: {
    width: 46,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1A1A1A',
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
