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
import { RefreshCw } from 'lucide-react-native';
import TopNav from '@components/layout/TopNav';
import FeedPostCard from '@features/posts/components/FeedPostCard';
import FeedPostCardSkeleton from '@features/posts/components/FeedPostCardSkeleton';
import HomeSkeleton from '@components/ui/HomeSkeleton';
import { useFeed } from '@features/posts/hooks/useFeed';
import { useMarkPostsSeen } from '@features/posts/hooks/useMarkPostsSeen';
import { useAuthStore } from '@features/auth/store/authStore';
import type { Post } from '@features/posts/types';

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 60 };
const DWELL_MS = 1000;

export default function ActivityScreen() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
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
          onPress={onRefresh}
          activeOpacity={0.8}
        >
          <RefreshCw size={18} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {!isAuthenticated ? (
        <View style={styles.centerScreen}>
          <Text style={styles.centerText}>Please sign in to view activity.</Text>
        </View>
      ) : loading && posts.length === 0 ? (
        <HomeSkeleton />
      ) : error && posts.length === 0 ? (
        <View style={styles.centerScreen}>
          <Text style={styles.centerText}>Couldn&apos;t load activity.</Text>
          <Text style={styles.centerSubtext}>{error.message}</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={onRefresh} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
              <Text style={styles.emptyTitle}>No activity yet</Text>
              <Text style={styles.emptySubtitle}>Be the first to share something with the community.</Text>
            </View>
          }
        />
      )}
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
    flexGrow: 1,
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
});
