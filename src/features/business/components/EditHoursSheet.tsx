import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Switch, FlatList, ActivityIndicator } from 'react-native';
import { X, ChevronDown, ChevronLeft } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';
import { useUpdateBusiness } from '../hooks/useUpdateBusiness';
import { useToastStore } from '@features/ui/store/toastStore';
import { TIME_SLOTS, formatTime12h } from '../utils/time';
import type { Business } from '../types';

interface Props {
  visible: boolean;
  business: Business;
  onClose: () => void;
  onSaved: (business: Business) => void;
}

const DEFAULT_OPEN = '09:00:00';
const DEFAULT_CLOSE = '18:00:00';

export default function EditHoursSheet({ visible, business, onClose, onSaved }: Props) {
  const [open, setOpen] = useState(Boolean(business.open_hour && business.close_hour));
  const [openHour, setOpenHour] = useState(business.open_hour ?? DEFAULT_OPEN);
  const [closeHour, setCloseHour] = useState(business.close_hour ?? DEFAULT_CLOSE);
  const [pickerField, setPickerField] = useState<'open' | 'close' | null>(null);
  const { updateBusiness, submitting } = useUpdateBusiness();
  const showToast = useToastStore(s => s.showToast);

  useEffect(() => {
    if (!visible) return;
    setOpen(Boolean(business.open_hour && business.close_hour));
    setOpenHour(business.open_hour ?? DEFAULT_OPEN);
    setCloseHour(business.close_hour ?? DEFAULT_CLOSE);
    setPickerField(null);
  }, [visible, business]);

  async function handleSave() {
    try {
      const updated = await updateBusiness(business.id, {
        open_hour: open ? openHour : null,
        close_hour: open ? closeHour : null,
      });
      onSaved(updated);
      onClose();
      showToast('Business hours updated', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not save your changes.', 'error');
    }
  }

  if (pickerField) {
    const current = pickerField === 'open' ? openHour : closeHour;
    return (
      <BottomSheet visible={visible} onClose={onClose}>
        <View className="mb-3 flex-row items-center justify-between px-5">
          <TouchableOpacity onPress={() => setPickerField(null)} activeOpacity={0.7}>
            <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2} />
          </TouchableOpacity>
          <Text className="font-roboto-bold text-base text-[#1A1A1A]">
            {pickerField === 'open' ? 'Opening Hour' : 'Closing Hour'}
          </Text>
          <View className="h-8 w-8" />
        </View>
        <FlatList
          data={TIME_SLOTS}
          keyExtractor={item => item.value}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              className="border-b border-hairline py-3"
              onPress={() => {
                if (pickerField === 'open') setOpenHour(item.value);
                else setCloseHour(item.value);
                setPickerField(null);
              }}
            >
              <Text className={`font-roboto text-base ${item.value === current ? 'font-roboto-bold text-brand' : 'text-[#1A1A1A]'}`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </BottomSheet>
    );
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View className="mb-5 flex-row items-center justify-between px-5">
        <Text className="font-roboto-bold text-lg text-[#1A1A1A]">Hours</Text>
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          className="h-8 w-8 items-center justify-center rounded-full bg-surface"
        >
          <X size={18} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View className="px-5">
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="font-roboto-bold text-base text-[#1A1A1A]">Business Hours</Text>
          <View className="flex-row items-center gap-2">
            <Switch
              value={open}
              onValueChange={setOpen}
              trackColor={{ true: '#2A5C40', false: '#D1D5DB' }}
              thumbColor="#FFFFFF"
            />
            <Text className="font-roboto text-base text-muted-light">{open ? 'Open' : 'Closed'}</Text>
          </View>
        </View>

        {open ? (
          <View className="mb-6 flex-row gap-3">
            <TouchableOpacity
              onPress={() => setPickerField('open')}
              activeOpacity={0.7}
              className="flex-1 flex-row items-center justify-between rounded-2xl border border-hairline bg-white px-4 py-3.5"
            >
              <Text className="font-roboto text-base text-[#1A1A1A]">{formatTime12h(openHour)}</Text>
              <ChevronDown size={16} color="#9CA3AF" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPickerField('close')}
              activeOpacity={0.7}
              className="flex-1 flex-row items-center justify-between rounded-2xl border border-hairline bg-white px-4 py-3.5"
            >
              <Text className="font-roboto text-base text-[#1A1A1A]">{formatTime12h(closeHour)}</Text>
              <ChevronDown size={16} color="#9CA3AF" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mb-6" />
        )}
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
