import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Heart, MessageCircle, Share2, Play, MoreHorizontal } from 'lucide-react-native';
import { formatRelativeTime } from '@utils/formatters';
import { useMarkPostHelpful } from '../hooks/useMarkPostHelpful';
import { useDeletePost } from '../hooks/useDeletePost';
import { useReportPost } from '../hooks/useReportPost';
import { useAuthStore } from '@features/auth/store/authStore';
import { useToastStore } from '@features/ui/store/toastStore';
import CommentsSheet from './CommentsSheet';
import PostActionMenu from './PostActionMenu';
import ReportPostSheet from './ReportPostSheet';
import type { Post, ReportReason } from '../types';

interface Props {
  post: Post;
}

function authorName(post: Post): string {
  if (!post.author) return 'Unknown';
  const full = `${post.author.first_name} ${post.author.last_name}`.trim();
  return full || post.author.username;
}

const BODY_COLLAPSED_LINES = 4;
// Beat between the sheet's close animation and the toast's own Modal presenting,
// so the two native modal layers don't fight for the presentation stack.
const SHEET_CLOSE_DELAY_MS = 300;

export default function FeedPostCard({ post }: Props) {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comment_count);
  const [bodyExpanded, setBodyExpanded] = useState(false);
  const [bodyTruncatable, setBodyTruncatable] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ top: 0, right: 0 });
  const [reportVisible, setReportVisible] = useState(false);
  const { toggleHelpful } = useMarkPostHelpful();
  const { deletePost } = useDeletePost();
  const { reportPost, submitting: reportSubmitting } = useReportPost(post.id);
  const showToast = useToastStore(s => s.showToast);
  const currentUserId = useAuthStore(s => s.user?.id);
  const isOwner = post.author?.id === currentUserId;

  function openMenu(e: { nativeEvent: { pageY: number } }) {
    setMenuAnchor({ top: e.nativeEvent.pageY + 4, right: 16 });
    setMenuVisible(true);
  }

  function confirmDelete() {
    Alert.alert('Delete post?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const result = await deletePost(post.id);
          showToast(result.ok ? 'Post deleted.' : result.message, result.ok ? 'success' : 'error');
        },
      },
    ]);
  }

  async function handleReportSubmit(reason: ReportReason, details: string) {
    const result = await reportPost(reason, details);
    if (result.ok) {
      setReportVisible(false);
      setTimeout(() => showToast('Report submitted. Thanks for letting us know.', 'success'), SHEET_CLOSE_DELAY_MS);
    } else {
      showToast(result.message, 'error');
    }
  }

  const video = post.media_metadata?.find(m => m.file_type === 'video');
  const imageMeta = post.media_metadata?.find(m => m.file_type !== 'video');
  const legacyImage = post.media_url?.[0];
  // Prefer media_metadata's CDN url (richer/authoritative) and fall back to the
  // simpler media_url projection — the two API surfaces don't necessarily agree on
  // which one is populated for a given upload path.
  const imageUri = !video ? imageMeta?.cdn_url ?? legacyImage?.original ?? legacyImage?.medium ?? legacyImage?.thumbnail ?? undefined : undefined;


  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        {post.author?.profile_picture?.thumbnail ? (
          <Image source={{ uri: post.author.profile_picture.thumbnail }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <View style={styles.userInfo}>
          <Text style={styles.username} numberOfLines={1}>
            {authorName(post)}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.timestamp}>{formatRelativeTime(post.created_at)}</Text>
            {post.tag && (
              <>
                <Text style={styles.dot}> · </Text>
                <Text style={styles.tagText} numberOfLines={1}>
                  {post.tag.store.name}
                </Text>
              </>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={openMenu}
          hitSlop={10}
          activeOpacity={0.7}
          style={styles.kebabBtn}
        >
          <MoreHorizontal size={18} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      {post.post_title ? <Text style={styles.title}>{post.post_title}</Text> : null}

      {/* Body */}
      {post.post_content ? (
        <View style={styles.bodyBlock}>
          <Text
            style={styles.body}
            numberOfLines={bodyExpanded ? undefined : BODY_COLLAPSED_LINES}
            onTextLayout={e => {
              // Only need to detect overflow once, while collapsed.
              if (!bodyExpanded && !bodyTruncatable && e.nativeEvent.lines.length > BODY_COLLAPSED_LINES) {
                setBodyTruncatable(true);
              }
            }}
          >
            {post.post_content}
          </Text>
          {bodyTruncatable && (
            <TouchableOpacity onPress={() => setBodyExpanded(v => !v)} activeOpacity={0.7}>
              <Text style={styles.showMore}>{bodyExpanded ? 'Show less' : 'Show more'}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}

      {/* Media */}
      {video ? (
        <View style={styles.imageWrapper}>
          {video.thumbnail_url && (
            <Image source={{ uri: video.thumbnail_url }} style={styles.postImage} resizeMode="cover" />
          )}
          <View style={styles.playOverlay}>
            <Play size={22} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
          </View>
        </View>
      ) : imageUri ? (
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUri }} style={styles.postImage} resizeMode="cover" />
        </View>
      ) : null}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => toggleHelpful(post.id)}
          activeOpacity={0.7}
        >
          <Heart
            size={16}
            color={post.is_helpful_by_current_user ? '#2A5C40' : '#6B7280'}
            fill={post.is_helpful_by_current_user ? '#2A5C40' : 'none'}
            strokeWidth={1.8}
          />
          <Text style={[styles.actionText, post.is_helpful_by_current_user && styles.actionTextActive]}>
            {post.helpful_count} helpful
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setCommentsVisible(true)}
          activeOpacity={0.7}
        >
          <MessageCircle size={16} color="#6B7280" strokeWidth={1.8} />
          <Text style={styles.actionText}>{commentCount} comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Share2 size={16} color="#6B7280" strokeWidth={1.8} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      <CommentsSheet
        postId={post.id}
        visible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
        onCommentAdded={() => setCommentCount(c => c + 1)}
      />

      <PostActionMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onReport={() => setReportVisible(true)}
        onDelete={confirmDelete}
        isOwner={isOwner}
        anchor={menuAnchor}
      />

      <ReportPostSheet
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        onSubmit={handleReportSubmit}
        loading={reportSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D1D5DB' },
  userInfo: { flex: 1, gap: 2 },
  kebabBtn: { padding: 4 },
  username: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  timestamp: { fontSize: 12, color: '#9CA3AF', fontFamily: 'Roboto_400Regular' },
  dot: { fontSize: 12, color: '#9CA3AF' },
  tagText: { fontSize: 12, color: '#2A5C40', fontFamily: 'Roboto_400Regular', flexShrink: 1 },
  title: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  bodyBlock: {
    marginBottom: 12,
  },
  body: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Roboto_400Regular',
    lineHeight: 20,
  },
  showMore: {
    fontSize: 14,
    color: '#2A5C40',
    fontFamily: 'Roboto_400Regular',
    marginTop: 4,
  },
  imageWrapper: {
    marginHorizontal: -14,
    marginBottom: 12,
  },
  postImage: { width: '100%', height: 200 },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { fontSize: 13, color: '#6B7280', fontFamily: 'Roboto_400Regular' },
  actionTextActive: { color: '#2A5C40' },
});
