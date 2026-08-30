import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';
import PhoneInput from '@features/settings/components/PhoneInput';
import BusinessTypePickerSheet from './BusinessTypePickerSheet';
import { useUpdateBusiness } from '../hooks/useUpdateBusiness';
import { useToastStore } from '@features/ui/store/toastStore';
import type { Business, BusinessTypeSelection } from '../types';

interface Props {
  visible: boolean;
  business: Business;
  onClose: () => void;
  onSaved: (business: Business) => void;
  /** Location isn't editable here — it hands off to the dashboard's own DetectLocationSheet,
   * since nesting a second Modal inside this sheet locks the app up (see BusinessPickerList.tsx). */
  onEditLocation: () => void;
}

function splitPhone(phone: string | null): [string, string] {
  if (!phone) return ['+234', ''];
  const [dialCode, ...rest] = phone.split(' ');
  return [dialCode || '+234', rest.join(' ')];
}

export default function EditBusinessDetailSheet({ visible, business, onClose, onSaved, onEditLocation }: Props) {
  const [typePickerVisible, setTypePickerVisible] = useState(false);
  const { updateBusiness, submitting } = useUpdateBusiness();
  const showToast = useToastStore(s => s.showToast);

  const [name, setName] = useState(business.name);
  const [typeSelection, setTypeSelection] = useState<BusinessTypeSelection | null>(
    business.store_type
      ? {
          storeTypeId: business.store_type.id,
          storeTypeName: business.store_type.name,
          categoryId: business.store_categories[0]?.id ?? '',
          categoryName: business.store_categories[0]?.name ?? '',
        }
      : null,
  );
  const [email, setEmail] = useState(business.email ?? '');
  const [tiktokUrl, setTiktokUrl] = useState(business.tictok_url ?? '');
  const [instagramUrl, setInstagramUrl] = useState(business.instagram_url ?? '');
  const [phoneDialCode, setPhoneDialCode] = useState(splitPhone(business.whatsapp_number)[0]);
  const [phoneDigits, setPhoneDigits] = useState(splitPhone(business.whatsapp_number)[1]);

  useEffect(() => {
    if (!visible) return;
    setName(business.name);
    setEmail(business.email ?? '');
    setTiktokUrl(business.tictok_url ?? '');
    setInstagramUrl(business.instagram_url ?? '');
    const [dialCode, digits] = splitPhone(business.whatsapp_number);
    setPhoneDialCode(dialCode);
    setPhoneDigits(digits);
    setTypeSelection(
      business.store_type
        ? {
            storeTypeId: business.store_type.id,
            storeTypeName: business.store_type.name,
            categoryId: business.store_categories[0]?.id ?? '',
            categoryName: business.store_categories[0]?.name ?? '',
          }
        : null,
    );
  }, [visible, business]);

  function handleClose() {
    setTypePickerVisible(false);
    onClose();
  }

  async function handleSave() {
    try {
      const updated = await updateBusiness(business.id, {
        name: name.trim(),
        email: email.trim() || undefined,
        tictok_url: tiktokUrl.trim() || undefined,
        instagram_url: instagramUrl.trim() || undefined,
        whatsapp_number: phoneDigits.trim() ? `${phoneDialCode} ${phoneDigits}` : undefined,
        ...(typeSelection
          ? { store_type_id: typeSelection.storeTypeId, category_ids: [typeSelection.categoryId] }
          : {}),
      });
      onSaved(updated);
      handleClose();
      showToast('Business details updated', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not save your changes.', 'error');
    }
  }

  if (typePickerVisible) {
    return (
      <BottomSheet visible={visible} onClose={handleClose}>
        <View className="mb-3 flex-row items-center justify-between px-5">
          <TouchableOpacity onPress={() => setTypePickerVisible(false)} activeOpacity={0.7}>
            <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2} />
          </TouchableOpacity>
          <View className="h-8 w-8" />
        </View>
        <BusinessTypePickerSheet
          onSelect={selection => {
            setTypeSelection(selection);
            setTypePickerVisible(false);
          }}
        />
      </BottomSheet>
    );
  }

  return (
    <BottomSheet visible={visible} onClose={handleClose}>
      <View className="mb-5 flex-row items-center justify-between px-5">
        <Text className="font-roboto-bold text-lg text-[#1A1A1A]">Business Information</Text>
        <TouchableOpacity
          onPress={handleClose}
          activeOpacity={0.7}
          className="h-8 w-8 items-center justify-center rounded-full bg-surface"
        >
          <X size={18} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-5" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <FieldLabel text="Business Name" />
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Business name"
          placeholderTextColor="#9CA3AF"
          className="mb-5 rounded-2xl border border-hairline bg-white px-4 py-3.5 font-roboto text-base text-[#1A1A1A]"
        />

        <FieldLabel text="Business Type" />
        <TouchableOpacity
          onPress={() => setTypePickerVisible(true)}
          activeOpacity={0.7}
          className="mb-5 flex-row items-center justify-between rounded-2xl border border-hairline bg-white px-4 py-3.5"
        >
          <Text
            className={`flex-1 font-roboto text-base ${typeSelection ? 'text-[#1A1A1A]' : 'text-muted-light'}`}
            numberOfLines={1}
          >
            {typeSelection ? `${typeSelection.storeTypeName} / ${typeSelection.categoryName}` : 'Business type'}
          </Text>
          <ChevronRight size={16} color="#9CA3AF" strokeWidth={2} />
        </TouchableOpacity>

        <FieldLabel text="Business Location" />
        <TouchableOpacity
          onPress={() => {
            handleClose();
            onEditLocation();
          }}
          activeOpacity={0.7}
          className="mb-5 flex-row items-center justify-between rounded-2xl border border-hairline bg-white px-4 py-3.5"
        >
          <Text
            className={`flex-1 font-roboto text-base ${business.location ? 'text-[#1A1A1A]' : 'text-muted-light'}`}
            numberOfLines={1}
          >
            {business.location?.formattedAddress || 'Search for a location...'}
          </Text>
          <MapPin size={16} color="#9CA3AF" strokeWidth={2} />
        </TouchableOpacity>

        <FieldLabel text="Email address" />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          className="mb-5 rounded-2xl border border-hairline bg-white px-4 py-3.5 font-roboto text-base text-[#1A1A1A]"
        />

        <FieldLabel text="Phone (Whatsapp)" />
        <View className="mb-5">
          <PhoneInput
            dialCode={phoneDialCode}
            digits={phoneDigits}
            onChangeDialCode={setPhoneDialCode}
            onChangeDigits={setPhoneDigits}
          />
        </View>

        <FieldLabel text="TikTok Url" optional />
        <TextInput
          value={tiktokUrl}
          onChangeText={setTiktokUrl}
          placeholder="TikTok Url."
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          className="mb-5 rounded-2xl border border-hairline bg-white px-4 py-3.5 font-roboto text-base text-[#1A1A1A]"
        />

        <FieldLabel text="Instagram url" optional />
        <TextInput
          value={instagramUrl}
          onChangeText={setInstagramUrl}
          placeholder="Instagram url."
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          className="mb-6 rounded-2xl border border-hairline bg-white px-4 py-3.5 font-roboto text-base text-[#1A1A1A]"
        />
      </ScrollView>

      <TouchableOpacity
        onPress={handleSave}
        disabled={!name.trim() || submitting}
        activeOpacity={0.85}
        className={`mx-5 mb-2 items-center justify-center rounded-full py-4 ${
          !name.trim() || submitting ? 'bg-brand/40' : 'bg-brand'
        }`}
      >
        {submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text className="font-roboto-bold text-base text-white">Save changes</Text>}
      </TouchableOpacity>
    </BottomSheet>
  );
}

function FieldLabel({ text, optional }: { text: string; optional?: boolean }) {
  return (
    <Text className="mb-2 font-roboto-bold text-sm text-[#1A1A1A]">
      {text} {optional ? <Text className="font-roboto text-muted-light">(optional)</Text> : null}
    </Text>
  );
}
