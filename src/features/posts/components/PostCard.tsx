import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Heart, MessageCircle, Share2, Smile, Star, MapPin } from 'lucide-react-native';
import PostActionMenu from './PostActionMenu';
import ReportPostSheet from './ReportPostSheet';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PostData {
  id: string;
  type: 'post' | 'review';
  user: {
    name: string;
    avatarUri?: string;
  };
  timestamp: string;
  /** Review-only: business that was reviewed */
  reviewedBusiness?: string;
  /** Review-only: city / location string */
  location?: string;
  /** Review-only: 1-5 star rating */
  rating?: number;
  title?: string;
  body: string;
  imageUri?: string;
  helpfulCount: number;
  commentCount: number;
  isOwner?: boolean;
}

interface Props {
  post: PostData;
  onDelete?: (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PostCard({ post, onDelete }: Props) {
  const [helpful, setHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(post.helpfulCount);
  const [comment, setComment] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ top: 0, right: 0 });
  const [reportVisible, setReportVisible] = useState(false);

  function handleHelpful() {
    setHelpful(h => !h);
    setHelpfulCount(c => (helpful ? c - 1 : c + 1));
  }

  function openMenu(e: any) {
    const { pageY } = e.nativeEvent;
    setMenuAnchor({ top: pageY + 4, right: 16 });
    setMenuVisible(true);
  }

  return (
    <>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          {/* Avatar */}
          {post.user.avatarUri ? (
            <Image source={{ uri: post.user.avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}

          {/* User info */}
          <View style={styles.userInfo}>
            {post.type === 'review' ? (
              <>
                <Text style={styles.usernameRow} numberOfLines={1}>
                  <Text style={styles.username}>{post.user.name}</Text>
                  <Text style={styles.reviewedLabel}> Reviewed </Text>
                  <Text style={styles.businessName}>{post.reviewedBusiness}</Text>
                </Text>
                <View style={styles.locationRow}>
                  <Text style={styles.timestamp}>{post.timestamp}</Text>
                  {post.location && (
                    <>
                      <Text style={styles.dot}> · </Text>
                      <MapPin size={11} color="#9CA3AF" strokeWidth={2} />
                      <Text style={styles.location}> {post.location}</Text>
                    </>
                  )}
                </View>
              </>
            ) : (
              <Text style={styles.username}>{post.user.name}</Text>
            )}

            {post.type === 'post' && (
              <Text style={styles.timestamp}>{post.timestamp}</Text>
            )}
          </View>

          {/* Three dots */}
          <TouchableOpacity
            onPress={openMenu}
            style={styles.dotsBtn}
            activeOpacity={0.6}
          >
            <Text style={styles.dots}>···</Text>
          </TouchableOpacity>
        </View>

        {/* Review: star rating */}
        {post.type === 'review' && post.rating !== undefined && (
          <View style={styles.ratingRow}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={14}
                color={i < post.rating! ? '#FACC15' : '#D1D5DB'}
                fill={i < post.rating! ? '#FACC15' : 'none'}
                strokeWidth={1.5}
              />
            ))}
            <Text style={styles.ratingText}>{post.rating?.toFixed(1)}</Text>
          </View>
        )}

        {/* Title */}
        {post.title && <Text style={styles.title}>{post.title}</Text>}

        {/* Body */}
        <Text style={styles.body}>{post.body}</Text>

        {/* Image — stretches edge-to-edge inside the card */}
        {post.imageUri && (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: post.imageUri }}
              style={styles.postImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleHelpful}
            activeOpacity={0.7}
          >
            <Heart
              size={16}
              color={helpful ? '#2A5C40' : '#6B7280'}
              fill={helpful ? '#2A5C40' : 'none'}
              strokeWidth={1.8}
            />
            <Text style={[styles.actionText, helpful && styles.actionTextActive]}>
              {helpfulCount} helpful
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <MessageCircle size={16} color="#6B7280" strokeWidth={1.8} />
            <Text style={styles.actionText}>{post.commentCount} comment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Share2 size={16} color="#6B7280" strokeWidth={1.8} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* View more comments */}
        <TouchableOpacity activeOpacity={0.7} style={styles.viewMore}>
          <Text style={styles.viewMoreText}>View more comments</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Comment input */}
        <View style={styles.commentRow}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment"
            placeholderTextColor="#9CA3AF"
            value={comment}
            onChangeText={setComment}
            returnKeyType="send"
          />
          <TouchableOpacity activeOpacity={0.7}>
            <Smile size={20} color="#9CA3AF" strokeWidth={1.8} />
          </TouchableOpacity>
        </View>
      </View>

      <PostActionMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onReport={() => setReportVisible(true)}
        onDelete={() => onDelete?.(post.id)}
        isOwner={post.isOwner}
        anchor={menuAnchor}
      />

      <ReportPostSheet
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        onSubmit={() => setReportVisible(false)}
      />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#F0F0F0',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1D5DB',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  usernameRow: {
    fontSize: 14,
    lineHeight: 20,
  },
  username: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  reviewedLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Roboto_400Regular',
  },
  businessName: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#2A5C40',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
  dot: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  location: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
  dotsBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  dots: {
    fontSize: 18,
    color: '#9CA3AF',
    letterSpacing: 2,
    lineHeight: 20,
  },

  // Review rating
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Roboto_400Regular',
    marginLeft: 4,
  },

  // Content
  title: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Roboto_400Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  imageWrapper: {
    marginHorizontal: -14,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 0,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Roboto_400Regular',
  },
  actionTextActive: {
    color: '#2A5C40',
  },

  // Comments
  viewMore: {
    paddingBottom: 8,
  },
  viewMoreText: {
    fontSize: 13,
    color: '#2A5C40',
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginHorizontal: -14,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
    padding: 0,
  },
});
