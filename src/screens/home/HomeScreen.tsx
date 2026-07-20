import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  type ViewToken,
} from 'react-native';
import TopNav from '@components/layout/TopNav';
import HeroBanner from '@features/home/components/HeroBanner';
import FeedPostCard from '@features/posts/components/FeedPostCard';
import FeedPostCardSkeleton from '@features/posts/components/FeedPostCardSkeleton';
import HomeSkeleton from '@components/ui/HomeSkeleton';
import { useFeed } from '@features/posts/hooks/useFeed';
import { useMarkPostsSeen } from '@features/posts/hooks/useMarkPostsSeen';
import { useUIStore } from '@features/ui/store/uiStore';
import { useAuthStore } from '@features/auth/store/authStore';
import { navigateToDiscover } from '@navigation/navigationRef';
import type { Post } from '@features/posts/types';

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 60 };
const DWELL_MS = 1000;

export default function HomeScreen() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const openPostSheet = useUIStore(s => s.openPostSheet);
  const { posts, loading, refreshing, fetchingMore, error, loadMore, onRefresh } = useFeed('HOME');
  const { markSeen } = useMarkPostsSeen();

  const dwellTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const onViewableItemsChanged = useCallback(
    ({ changed }: { changed: ViewToken[] }) => {
      const timers = dwellTimersRef.current;
      changed.forEach(({ item, isViewable }) => {
        const postId = (item as Post).id;
        if (isViewable) {
          if (timers.has(postId)) return;
          timers.set(
            postId,
            setTimeout(() => {
              timers.delete(postId);
              markSeen(postId);
            }, DWELL_MS),
          );
        } else {
          const timer = timers.get(postId);
          if (timer) {
            clearTimeout(timer);
            timers.delete(postId);
          }
        }
      });
    },
    [markSeen],
  );

  if (!isAuthenticated) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.centerText}>Please sign in to view your feed.</Text>
      </View>
    );
  }

  if (loading && posts.length === 0) {
    return (
      <View style={styles.root}>
        <HomeSkeleton />
      </View>
    );
  }

  if (error && posts.length === 0) {
    return (
      <View style={styles.root}>
        <TopNav />
        <View style={styles.centerScreen}>
          <Text style={styles.centerText}>Couldn&apos;t load your feed.</Text>
          <Text style={styles.centerSubtext}>{error.message}</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={onRefresh} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <TopNav />

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <FeedPostCard post={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2A5C40" colors={['#2A5C40']} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        ListHeaderComponent={
          <>
            <HeroBanner onDiscover={navigateToDiscover} />
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending 🔥</Text>
              <Text style={styles.sectionSub}>What people are saying</Text>
            </View>
          </>
        }
        ListFooterComponent={
          fetchingMore ? (
            <>
              <FeedPostCardSkeleton />
              <FeedPostCardSkeleton />
            </>
          ) : (
            <View style={styles.bottomSpacer} />
          )
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No activities yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to share something with the community.</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={openPostSheet} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Create a post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.refreshLink} onPress={onRefresh} activeOpacity={0.7}>
              <Text style={styles.refreshLinkText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    flexGrow: 1,
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
  centerScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  centerText: {
    fontSize: 15,
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  centerSubtext: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
  },
  primaryBtn: {
    backgroundColor: '#2A5C40',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  primaryBtnText: {
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 4,
  },
  refreshLink: { marginTop: 12 },
  refreshLinkText: {
    fontSize: 13,
    fontFamily: 'Roboto_500Medium',
    color: '#2A5C40',
    textDecorationLine: 'underline',
  },
});
