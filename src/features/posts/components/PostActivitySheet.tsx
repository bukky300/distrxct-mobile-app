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
import { X, ImagePlay } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import BottomSheet from '@components/ui/BottomSheet';
import TagBusinessSheet, { type Business } from './TagBusinessSheet';

interface Props {
  visible: boolean;
  onClose: () => void;
  onPost: (data: { title: string; body: string; mediaUri?: string; business?: Business }) => void;
  loading?: boolean;
}

export default function PostActivitySheet({ visible, onClose, onPost, loading = false }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mediaUri, setMediaUri] = useState<string | undefined>();
  const [taggedBusiness, setTaggedBusiness] = useState<Business | undefined>();
  const [tagSheetVisible, setTagSheetVisible] = useState(false);

  const canPost = title.trim().length > 0 || body.trim().length > 0;

  async function pickMedia() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.85,
      allowsEditing: true,
    });
    if (!result.canceled) setMediaUri(result.assets[0].uri);
  }

  function handlePost() {
    if (!canPost || loading) return;
    onPost({ title: title.trim(), body: body.trim(), mediaUri, business: taggedBusiness });
    reset();
  }

  function handleClose() {
    reset();
    onClose();
  }

  function reset() {
    setTitle('');
    setBody('');
    setMediaUri(undefined);
    setTaggedBusiness(undefined);
  }

  return (
    <>
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
          >
            {mediaUri ? (
              <Image source={{ uri: mediaUri }} style={styles.previewImage} resizeMode="cover" />
            ) : (
              <View style={styles.mediaPlaceholder}>
                <ImagePlay size={36} color="#2A5C40" strokeWidth={1.5} />
                <Text style={styles.mediaLabel}>Add Image/Video</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Tag business */}
          <TouchableOpacity
            style={styles.tagBtn}
            onPress={() => setTagSheetVisible(true)}
            activeOpacity={0.7}
          >
            {taggedBusiness ? (
              <Text style={styles.tagBtnTextActive} numberOfLines={1}>
                📍 {taggedBusiness.name}
              </Text>
            ) : (
              <Text style={styles.tagBtnText}>
                <Text style={styles.tagPlus}>+ </Text>Tag a business to this activity
              </Text>
            )}
          </TouchableOpacity>

          {/* Title */}
          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
            maxLength={120}
          />

          {/* Body */}
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Describe your activity"
            placeholderTextColor="#9CA3AF"
            value={body}
            onChangeText={setBody}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={1000}
          />
        </ScrollView>

        {/* Post button */}
        <TouchableOpacity
          style={[styles.postBtn, canPost && !loading && styles.postBtnActive]}
          onPress={handlePost}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={[styles.postBtnText, canPost && !loading && styles.postBtnTextActive]}>
            {loading ? 'Posting…' : 'Post'}
          </Text>
        </TouchableOpacity>
      </BottomSheet>

      <TagBusinessSheet
        visible={tagSheetVisible}
        onClose={() => setTagSheetVisible(false)}
        onSelect={setTaggedBusiness}
      />
    </>
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
  mediaLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
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
