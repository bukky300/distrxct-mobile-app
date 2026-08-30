import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';
import { useUpdateBusiness } from '../hooks/useUpdateBusiness';
import { useToastStore } from '@features/ui/store/toastStore';
import type { Business } from '../types';

interface Props {
  visible: boolean;
  business: Business;
  onClose: () => void;
  onSaved: (business: Business) => void;
}

export default function EditAboutSheet({ visible, business, onClose, onSaved }: Props) {
  const [description, setDescription] = useState(business.description ?? '');
  const { updateBusiness, submitting } = useUpdateBusiness();
  const showToast = useToastStore(s => s.showToast);

  useEffect(() => {
    if (visible) setDescription(business.description ?? '');
  }, [visible, business.description]);

  async function handleSave() {
    try {
      const updated = await updateBusiness(business.id, { description: description.trim() });
      onSaved(updated);
      onClose();
      showToast('About section updated', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not save your changes.', 'error');
    }
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="mb-5 flex-row items-center justify-between px-5">
        <Text className="font-roboto-bold text-lg text-[#1A1A1A]">About Business</Text>
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          className="h-8 w-8 items-center justify-center rounded-full bg-surface"
        >
          <X size={18} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View className="px-5">
        <Text className="mb-2 font-roboto-bold text-sm text-[#1A1A1A]">About business</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your business"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          maxLength={2000}
          className="mb-6 min-h-[140px] rounded-2xl border border-hairline bg-surface px-4 py-3.5 font-roboto text-base text-[#1A1A1A]"
        />
      </View>

      <TouchableOpacity
        onPress={handleSave}
        disabled={submitting}
        activeOpacity={0.85}
        className={`mx-5 mb-2 items-center justify-center rounded-full py-4 ${submitting ? 'bg-brand/40' : 'bg-brand'}`}
      >
        {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text className="font-roboto-bold text-base text-white">Save changes</Text>}
      </TouchableOpacity>
    </BottomSheet>
  );
}
