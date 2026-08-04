import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { X, ChevronLeft, ImagePlay, Video as VideoIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BottomSheet from '@components/ui/BottomSheet';
import BusinessPickerList from './BusinessPickerList';
import { useCreatePost } from '../hooks/useCreatePost';
import { useToastStore } from '@features/ui/store/toastStore';
import {
  postFormSchema,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  MAX_VIDEO_DURATION_MS,
  type PostFormValues,
} from '../schema/postFormSchema';
import type { Post, StoreOption } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onPosted?: (post: Post) => void;
}

const DEFAULT_VALUES: PostFormValues = {
  title: '',
  content: '',
  media: null,
  tag: null,
};

export default function PostActivitySheet({ visible, onClose, onPosted }: Props) {
  const [tagSheetVisible, setTagSheetVisible] = useState(false);
  const { createPost, submitting, uploadProgress } = useCreatePost();
  const showToast = useToastStore(s => s.showToast);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isValid },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  const media = watch('media');
  const tag = watch('tag');

  async function pickMedia() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('Allow photo library access to add media.', 'error');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.85,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });
    if (result.canceled) return;
    const asset = result.assets[0];

    if (asset.type === 'video') {
      const fileSize = asset.fileSize ?? 0;
      const durationMs = asset.duration ?? 0;
      if (fileSize > MAX_VIDEO_BYTES) {
        showToast('Videos must be 500MB or smaller.', 'error');
        return;
      }
      if (durationMs > MAX_VIDEO_DURATION_MS) {
        showToast('Videos must be 60 seconds or shorter.', 'error');
        return;
      }
      setValue(
        'media',
        {
          kind: 'video',
          uri: asset.uri,
          mimeType: asset.mimeType ?? 'video/mp4',
          fileName: asset.fileName ?? `video-${Date.now()}.mp4`,
          fileSize,
          durationMs,
        },
        { shouldValidate: true },
      );
    } else {
      const fileSize = asset.fileSize ?? 0;
      if (fileSize > MAX_IMAGE_BYTES) {
        showToast('Images must be 5MB or smaller.', 'error');
        return;
      }
      if (!asset.base64) {
        showToast('Could not read the selected image.', 'error');
        return;
      }
      setValue(
        'media',
        {
          kind: 'image',
          uri: asset.uri,
          mimeType: asset.mimeType ?? 'image/jpeg',
          fileName: asset.fileName ?? `image-${Date.now()}.jpg`,
          base64: asset.base64,
          fileSize,
        },
        { shouldValidate: true },
      );
    }
  }

  function handleSelectStore(store: StoreOption) {
    setValue('tag', { store_id: store.id, store_name: store.name }, { shouldValidate: true });
    setTagSheetVisible(false);
  }

  function handleClose() {
    setTagSheetVisible(false);
    reset(DEFAULT_VALUES);
    onClose();
  }

  const onSubmit = async (values: PostFormValues) => {
    try {
      const post = await createPost(values);
      onPosted?.(post);
      reset(DEFAULT_VALUES);
      onClose();
      showToast('Your activity has been posted.', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Couldn't post. Please try again.", 'error');
    }
  };

  const postLabel = !submitting ? 'Post' : uploadProgress !== null ? `Uploading ${uploadProgress}%` : 'Posting…';

  if (tagSheetVisible) {
    return (
      <BottomSheet visible={visible} onClose={handleClose}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setTagSheetVisible(false)}
            style={styles.closeBtn}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color="#1A1A1A" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.title}>Select a Business</Text>
          <View style={styles.closeBtn} />
        </View>

        <BusinessPickerList onSelect={handleSelectStore} />
      </BottomSheet>
    );
  }

  return (
    <BottomSheet visible={visible} onClose={handleClose}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Post Activity</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
          <X size={20} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          {/* Media picker */}
          <TouchableOpacity
            style={styles.mediaPicker}
            onPress={pickMedia}
            activeOpacity={0.75}
            disabled={submitting}
          >
            {media?.kind === 'image' ? (
              <Image source={{ uri: media.uri }} style={styles.previewImage} resizeMode="cover" />
            ) : media?.kind === 'video' ? (
              <View style={styles.videoPreview}>
                <VideoIcon size={32} color="#2A5C40" strokeWidth={1.5} />
                <Text style={styles.videoFileName} numberOfLines={1}>
                  {media.fileName}
                </Text>
                <Text style={styles.videoDuration}>{Math.round(media.durationMs / 1000)}s</Text>
              </View>
            ) : (
              <View style={styles.mediaPlaceholder}>
                <ImagePlay size={36} color="#2A5C40" strokeWidth={1.5} />
                <Text style={styles.mediaLabel}>Add Image/Video</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Video upload progress */}
          {submitting && uploadProgress !== null && (
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
            </View>
          )}

          {/* Tag business */}
          <TouchableOpacity
            style={styles.tagBtn}
            onPress={() => setTagSheetVisible(true)}
            activeOpacity={0.7}
            disabled={submitting}
          >
            {tag ? (
              <Text style={styles.tagBtnTextActive} numberOfLines={1}>
                📍 {tag.store_name}
              </Text>
            ) : (
              <Text style={styles.tagBtnText}>
                <Text style={styles.tagPlus}>+ </Text>Tag a business to this activity
              </Text>
            )}
          </TouchableOpacity>

          {/* Title */}
          <Controller
            control={control}
            name="title"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="next"
                maxLength={120}
                editable={!submitting}
              />
            )}
          />

          {/* Body */}
          <Controller
            control={control}
            name="content"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Describe your activity"
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                maxLength={1000}
                editable={!submitting}
              />
            )}
          />
        </ScrollView>

        {/* Post button */}
        <TouchableOpacity
          style={[styles.postBtn, isValid && !submitting && styles.postBtnActive]}
          onPress={handleSubmit(onSubmit)}
          activeOpacity={0.8}
          disabled={!isValid || submitting}
        >
          <Text style={[styles.postBtnText, isValid && !submitting && styles.postBtnTextActive]}>
            {postLabel}
          </Text>
        </TouchableOpacity>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  mediaPicker: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 160,
    overflow: 'hidden',
  },
  mediaPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    gap: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  videoPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    gap: 6,
    paddingHorizontal: 16,
  },
  videoFileName: {
    fontSize: 13,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
    maxWidth: '90%',
  },
  videoDuration: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Roboto_400Regular',
  },
  mediaLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2A5C40',
  },
  tagBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  tagBtnText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
  },
  tagBtnTextActive: {
    fontSize: 13,
    color: '#2A5C40',
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
  },
  tagPlus: {
    color: '#2A5C40',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
    minHeight: 48,
  },
  textarea: {
    minHeight: 110,
    paddingTop: 12,
  },
  postBtn: {
    marginHorizontal: 20,
    marginTop: 8,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postBtnActive: {
    backgroundColor: '#2A5C40',
  },
  postBtnText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#9CA3AF',
  },
  postBtnTextActive: {
    color: '#FFFFFF',
  },
});
