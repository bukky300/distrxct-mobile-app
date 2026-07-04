import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import TopNav from '@components/layout/TopNav';
import HeroBanner from '@features/home/components/HeroBanner';
import PostCard, { type PostData } from '@features/posts/components/PostCard';

// ─── Mock data — replace with API call ───────────────────────────────────────
const MOCK_POSTS: PostData[] = [
  {
    id: '1',
    type: 'post',
    user: { name: 'Larry_o9' },
    timestamp: '23 hrs ago',
    title: 'My first Post',
    body: 'Getting to know Distrxct',
    imageUri: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
    helpfulCount: 21,
    commentCount: 5,
    isOwner: false,
  },
  {
    id: '2',
    type: 'post',
    user: { name: 'Tunde_Lagos' },
    timestamp: '1 day ago',
    title: 'Great weekend',
    body: 'Spent an amazing afternoon at the beach with friends!',
    imageUri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    helpfulCount: 14,
    commentCount: 3,
    isOwner: false,
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  return (
    <View style={styles.root}>
      <TopNav />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Hero */}
        <HeroBanner />

        {/* Trending header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending 🔥</Text>
          <Text style={styles.sectionSub}>What people are saying</Text>
        </View>

        {/* Posts */}
        {MOCK_POSTS.map(post => (
          <PostCard key={post.id} post={post} />
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    paddingTop: 14,
    paddingBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
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
  bottomSpacer: { height: 16 },
});
