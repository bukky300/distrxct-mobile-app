import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { X, Smile, Send } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';
import { formatRelativeTime } from '@utils/formatters';
import { usePostComments } from '../hooks/usePostComments';
import { useAddComment } from '../hooks/useAddComment';
import type { Comment } from '../types';

interface Props {
  postId: string;
  visible: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

function authorLabel(c: Comment): string {
  const full = `${c.author.first_name} ${c.author.last_name}`.trim();
  return full || c.author.username;
}

export default function CommentsSheet({ postId, visible, onClose, onCommentAdded }: Props) {
  const { comments, totalCount, loading, called, fetchComments, refetch } = usePostComments(postId);
  const { addComment, submitting } = useAddComment(postId);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible && !called) fetchComments();
  }, [visible, called, fetchComments]);

  async function handleSend() {
    const text = draft.trim();
    if (!text || submitting) return;
    const created = await addComment(text);
    if (created) {
      setDraft('');
      // Pull the authoritative list so the new comment and count stay in sync.
      await refetch?.();
      onCommentAdded?.();
    }
  }

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentRow}>
      {item.author.profile_picture?.thumbnail ? (
        <Image source={{ uri: item.author.profile_picture.thumbnail }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}
      <View style={styles.commentBody}>
        <Text style={styles.commentAuthor}>{authorLabel(item)}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <Text style={styles.commentTimestamp}>{formatRelativeTime(item.created_at)}</Text>
      </View>
    </View>
  );

  const showEmpty = called && !loading && comments.length === 0;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {totalCount > 0 ? `Comments (${totalCount})` : 'Comments'}
          </Text>
          <TouchableOpacity onPress={onClose} hitSlop={10} activeOpacity={0.7}>
            <X size={22} color="#6B7280" strokeWidth={1.8} />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        {/* List */}
        {loading && !called ? (
          <ActivityIndicator color="#2A5C40" style={styles.loading} />
        ) : showEmpty ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No comments yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to comment.</Text>
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={item => item.id}
            renderItem={renderComment}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Composer */}
        <View style={styles.composer}>
          <TouchableOpacity
            onPress={() => inputRef.current?.focus()}
            hitSlop={8}
            activeOpacity={0.7}
            style={styles.emojiBtn}
          >
            <Smile size={22} color="#6B7280" strokeWidth={1.8} />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Add a comment…"
            placeholderTextColor="#9CA3AF"
            value={draft}
            onChangeText={setDraft}
            multiline
            returnKeyType="default"
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!draft.trim() || submitting}
            activeOpacity={0.7}
            style={styles.sendBtn}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#2A5C40" />
            ) : (
              <Send size={20} color={draft.trim() ? '#2A5C40' : '#C4C9D1'} strokeWidth={1.8} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: { height: SCREEN_HEIGHT * 0.72, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginHorizontal: -16,
  },
  loading: { paddingVertical: 24 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'Roboto_400Bold',
    color: '#4B5563',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
    marginTop: 4,
  },
  listContent: { paddingTop: 12, paddingBottom: 8 },
  commentRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  avatarPlaceholder: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#D1D5DB' },
  commentBody: { flex: 1 },
  commentAuthor: { fontSize: 13, fontFamily: 'Roboto_400Bold', color: '#1A1A1A' },
  commentText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Roboto_400Regular',
    lineHeight: 19,
    marginTop: 1,
  },
  commentTimestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
    marginTop: 3,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  emojiBtn: { paddingBottom: 8 },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: '#1A1A1A',
  },
  sendBtn: { paddingBottom: 8, width: 28, alignItems: 'center' },
});
