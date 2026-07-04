import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import TopNav from '@components/layout/TopNav';
import PostCard, { type PostData } from '@features/posts/components/PostCard';

// ─── Mock data — replace with API call ───────────────────────────────────────
const MOCK_REVIEWS: PostData[] = [
  {
    id: 'r1',
    type: 'review',
    user: { name: 'Larry_o9' },
    timestamp: '5 hrs ago',
    reviewedBusiness: 'ABC hotels',
    location: 'Lagos, Nigeria',
    rating: 2,
    body: 'Amazing experience! The staff were friendly and the service was top notch. Will definitely come back',
    imageUri: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
    helpfulCount: 21,
    commentCount: 5,
    isOwner: false,
  },
  {
    id: 'r2',
    type: 'review',
    user: { name: 'Larry_o9' },
    timestamp: '5 hrs ago',
    reviewedBusiness: 'ABC hotels',
    location: 'Lagos, Nigeria',
    rating: 2,
    body: 'Amazing experience! The staff were friendly and the service was top notch. Will definitely come back',
    helpfulCount: 21,
    commentCount: 5,
    isOwner: false,
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ActivityScreen() {
  function handleRefresh() {
    // wire to API refetch
  }

  return (
    <View style={styles.root}>
      <TopNav />

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Activity</Text>
          <Text style={styles.sectionSub}>What people are doing</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={handleRefresh}
          activeOpacity={0.8}
        >
          <RefreshCw size={18} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {MOCK_REVIEWS.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  sectionSub: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
    marginTop: 2,
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A5C40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingTop: 4,
    paddingBottom: 24,
  },
});
