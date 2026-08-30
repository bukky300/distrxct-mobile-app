import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { X, ImageIcon, Plus } from 'lucide-react-native';
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

function buildFileName(mimeType: string): string {
  const ext = mimeType.split('/')[1] ?? 'jpg';
  return `logo-${Date.now()}.${ext}`;
}

export default function EditLogoSheet({ visible, business, onClose, onSaved }: Props) {
  const [pickedLogo, setPickedLogo] = useState<MediaFileInput | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const { updateBusiness, submitting } = useUpdateBusiness();
  const showToast = useToastStore(s => s.showToast);

  function handleClose() {
    setPickedLogo(null);
    setPreviewUri(null);
    onClose();
  }

  async function handlePick() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast('Photo library permission denied', 'error');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
      base64: true,
    });
    const asset = result.canceled ? null : result.assets?.[0];
    if (!asset?.base64) return;

    const mimeType = asset.mimeType ?? 'image/jpeg';
    setPickedLogo({ mime_type: mimeType, file_name: buildFileName(mimeType), file_data: asset.base64 });
    setPreviewUri(asset.uri);
  }

  async function handleUpload() {
    if (!pickedLogo) return;
    try {
      const updated = await updateBusiness(business.id, { logo: pickedLogo });
      onSaved(updated);
      handleClose();
      showToast('Business logo updated', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not upload your logo.', 'error');
    }
  }

  const displayUri = previewUri ?? business.logo?.thumbnail ?? null;

  return (
    <BottomSheet visible={visible} onClose={handleClose}>
      <View className="mb-5 flex-row items-center justify-between px-5">
        <Text className="font-roboto-bold text-lg text-[#1A1A1A]">Business Logo</Text>
        <TouchableOpacity
          onPress={handleClose}
          activeOpacity={0.7}
          className="h-8 w-8 items-center justify-center rounded-full bg-surface"
        >
          <X size={18} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View className="mb-8 items-center px-5">
        <TouchableOpacity onPress={handlePick} activeOpacity={0.8} className="relative">
          {displayUri ? (
            <Image source={{ uri: displayUri }} className="h-24 w-24 rounded-full" />
          ) : (
            <View className="h-24 w-24 items-center justify-center rounded-full bg-mint">
              <ImageIcon size={30} color="#2A5C40" strokeWidth={1.6} />
            </View>
          )}
          <View className="absolute -bottom-1 -right-1 h-7 w-7 items-center justify-center rounded-full border border-hairline bg-white">
            <Plus size={16} color="#1A1A1A" strokeWidth={2.4} />
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleUpload}
        disabled={!pickedLogo || submitting}
        activeOpacity={0.85}
        className={`mx-5 mb-2 items-center justify-center rounded-full py-4 ${
          !pickedLogo || submitting ? 'bg-surface' : 'bg-brand'
        }`}
      >
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className={`font-roboto-bold text-base ${!pickedLogo ? 'text-muted-light' : 'text-white'}`}>Upload</Text>
        )}
      </TouchableOpacity>
    </BottomSheet>
  );
}
