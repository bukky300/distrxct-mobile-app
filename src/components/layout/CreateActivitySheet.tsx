import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X, ImagePlay, Star, ChevronRight } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';
import PostForm from '@features/posts/components/PostForm';
import ReviewForm from '@features/reviews/components/ReviewForm';
import type { CreateSheetMode } from '@features/ui/store/uiStore';
import type { Post } from '@features/posts/types';
import type { Review } from '@features/reviews/types';

interface Props {
  visible: boolean;
  onClose: () => void;
  /** Skip the choice step and open straight into a specific form, e.g. from a
   * "Create a post" CTA elsewhere in the app. Defaults to the choice step. */
  initialMode?: CreateSheetMode;
  onPosted?: (post: Post) => void;
  onReviewed?: (review: Review) => void;
}

// Owns the single BottomSheet/Modal for the whole create flow. The choice step and the
// Post/Review forms all render inside it — mounting a second BottomSheet for any of them
// would stack two RN Modals at once, which locks the app up (see BusinessPickerList.tsx).
export default function CreateActivitySheet({ visible, onClose, initialMode = 'choice', onPosted, onReviewed }: Props) {
  const [mode, setMode] = useState<CreateSheetMode>(initialMode);

  // Re-sync to the requested starting step each time the sheet is opened.
  useEffect(() => {
    if (visible) setMode(initialMode);
  }, [visible, initialMode]);

  function handleClose() {
    setMode('choice');
    onClose();
  }

  return (
    <BottomSheet visible={visible} onClose={handleClose}>
      {mode === 'choice' && (
        <ChoiceStep
          onClose={handleClose}
          onSelectPost={() => setMode('post')}
          onSelectReview={() => setMode('review')}
        />
      )}
      {mode === 'post' && (
        <PostForm
          onBack={() => setMode('choice')}
          onClose={handleClose}
          onPosted={onPosted}
        />
      )}
      {mode === 'review' && (
        <ReviewForm
          onBack={() => setMode('choice')}
          onClose={handleClose}
          onReviewed={onReviewed}
        />
      )}
    </BottomSheet>
  );
}

// ─── Choice step ─────────────────────────────────────────────────────────────

function ChoiceStep({
  onClose,
  onSelectPost,
  onSelectReview,
}: {
  onClose: () => void;
  onSelectPost: () => void;
  onSelectReview: () => void;
}) {
  return (
    <View style={choiceStyles.container}>
      {/* Header */}
      <View style={choiceStyles.header}>
        <Text style={choiceStyles.title}>Create</Text>
        <TouchableOpacity onPress={onClose} style={choiceStyles.closeBtn} activeOpacity={0.7}>
          <X size={20} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ChoiceRow
        icon={<ImagePlay size={22} color="#2A5C40" strokeWidth={1.8} />}
        title="Add Post"
        subtitle="Share a photo or video activity"
        onPress={onSelectPost}
      />
      <ChoiceRow
        icon={<Star size={22} color="#2A5C40" strokeWidth={1.8} />}
        title="Add Review"
        subtitle="Rate and review a business"
        onPress={onSelectReview}
      />
    </View>
  );
}

function ChoiceRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={choiceStyles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={choiceStyles.iconCircle}>{icon}</View>
      <View style={choiceStyles.rowText}>
        <Text style={choiceStyles.rowTitle}>{title}</Text>
        <Text style={choiceStyles.rowSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={18} color="#9CA3AF" strokeWidth={2} />
    </TouchableOpacity>
  );
}

const choiceStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
