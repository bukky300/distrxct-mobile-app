import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { X, Camera, Trash2 } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';
import { useUpdateBusiness, type MediaFileInput } from '../hooks/useUpdateBusiness';
import { useToastStore } from '@features/ui/store/toastStore';
import type { Business } from '../types';

interface Props {
  visible: boolean;
  business: Business;
  onClose: () => void;
  onSaved: (business: Business) => void;
}

const MAX_IMAGES = 5;

function buildFileName(mimeType: string): string {
  const ext = mimeType.split('/')[1] ?? 'jpg';
  return `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
}

export default function EditGallerySheet({ visible, business, onClose, onSaved }: Props) {
  const [removedUrls, setRemovedUrls] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<{ uri: string; file: MediaFileInput }[]>([]);
  const { updateBusiness, submitting } = useUpdateBusiness();
  const showToast = useToastStore(s => s.showToast);

  useEffect(() => {
    if (visible) {
      setRemovedUrls([]);
      setNewImages([]);
    }
  }, [visible]);

  const existingImages = (business.media_url ?? []).filter(img => img.original && !removedUrls.includes(img.original));
  const totalCount = existingImages.length + newImages.length;
  const hasChanges = removedUrls.length > 0 || newImages.length > 0;

  async function handlePick() {
    if (totalCount >= MAX_IMAGES) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast('Photo library permission denied', 'error');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      base64: true,
    });
    const asset = result.canceled ? null : result.assets?.[0];
    if (!asset?.base64) return;

    const fileSize = asset.fileSize ?? 0;
    if (fileSize > 5 * 1024 * 1024) {
      showToast('Images must be 5MB or smaller.', 'error');
      return;
    }

    const mimeType = asset.mimeType ?? 'image/jpeg';
    setNewImages(prev => [
      ...prev,
      { uri: asset.uri, file: { mime_type: mimeType, file_name: buildFileName(mimeType), file_data: asset.base64! } },
    ]);
  }

  async function handleUpload() {
    try {
      const updated = await updateBusiness(business.id, {
        ...(newImages.length ? { add_media: newImages.map(i => i.file) } : {}),
        ...(removedUrls.length ? { remove_media_urls: removedUrls } : {}),
      });
      onSaved(updated);
      onClose();
      showToast('Business gallery updated', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not update your gallery.', 'error');
    }
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="mb-5 flex-row items-center justify-between px-5">
        <Text className="font-roboto-bold text-lg text-[#1A1A1A]">Business Images</Text>
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          className="h-8 w-8 items-center justify-center rounded-full bg-surface"
        >
          <X size={18} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View className="mb-4 rounded-2xl border border-hairline px-4 pt-4">
        {totalCount === 0 ? (
          <TouchableOpacity
            onPress={handlePick}
            activeOpacity={0.7}
            className="mb-4 items-center justify-center rounded-2xl border border-dashed border-hairline bg-surface py-16"
          >
            <Camera size={26} color="#9CA3AF" strokeWidth={1.8} />
            <Text className="mt-3 font-roboto text-base text-muted-light">Click to upload or take a photo</Text>
          </TouchableOpacity>
        ) : (
          <View className="mb-2 flex-row flex-wrap gap-3">
            {existingImages.map(img => (
              <View key={img.original} className="relative">
                <Image source={{ uri: img.medium ?? img.original ?? undefined }} className="h-24 w-24 rounded-xl" />
                <TouchableOpacity
                  onPress={() => setRemovedUrls(prev => [...prev, img.original!])}
                  activeOpacity={0.7}
                  className="absolute -right-1.5 -top-1.5 h-6 w-6 items-center justify-center rounded-full bg-white shadow"
                >
                  <Trash2 size={13} color="#1A1A1A" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            ))}
            {newImages.map((img, i) => (
              <View key={img.uri} className="relative">
                <Image source={{ uri: img.uri }} className="h-24 w-24 rounded-xl" />
                <TouchableOpacity
                  onPress={() => setNewImages(prev => prev.filter((_, idx) => idx !== i))}
                  activeOpacity={0.7}
                  className="absolute -right-1.5 -top-1.5 h-6 w-6 items-center justify-center rounded-full bg-white shadow"
                >
                  <Trash2 size={13} color="#1A1A1A" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            ))}
            {totalCount < MAX_IMAGES && (
              <TouchableOpacity
                onPress={handlePick}
                activeOpacity={0.7}
                className="h-24 w-24 items-center justify-center rounded-xl border border-dashed border-hairline"
              >
                <Camera size={20} color="#9CA3AF" strokeWidth={1.8} />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View className="mb-4 flex-row justify-between">
          <Text className="font-roboto text-sm text-[#1A1A1A]">
            {totalCount} / {MAX_IMAGES}
          </Text>
          <Text className="font-roboto text-sm text-danger">Size 5mb Max</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleUpload}
        disabled={!hasChanges || submitting}
        activeOpacity={0.85}
        className={`mx-5 mb-2 items-center justify-center rounded-full py-4 ${
          !hasChanges || submitting ? 'bg-surface' : 'bg-brand'
        }`}
      >
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className={`font-roboto-bold text-base ${!hasChanges ? 'text-muted-light' : 'text-white'}`}>Upload</Text>
        )}
      </TouchableOpacity>
    </BottomSheet>
  );
}
