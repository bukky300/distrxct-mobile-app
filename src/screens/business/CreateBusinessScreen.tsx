import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { ChevronRight, MapPin, ArrowRight } from 'lucide-react-native';
import TopNav from '@components/layout/TopNav';
import BottomSheet from '@components/ui/BottomSheet';
import DetectLocationSheet from '@features/discover/components/DetectLocationSheet';
import PhoneInput from '@features/settings/components/PhoneInput';
import BusinessTypePickerSheet from '@features/business/components/BusinessTypePickerSheet';
import { useCreateBusiness } from '@features/business/hooks/useCreateBusiness';
import { useToastStore } from '@features/ui/store/toastStore';
import type { ResolvedLocation } from '@features/locations/services/googlePlaces';
import type { Business, BusinessTypeSelection } from '@features/business/types';

interface Props {
  onCreated?: (business: Business) => void;
}

export default function CreateBusinessScreen({ onCreated }: Props) {
  const [name, setName] = useState('');
  const [typeSelection, setTypeSelection] = useState<BusinessTypeSelection | null>(null);
  const [typePickerVisible, setTypePickerVisible] = useState(false);
  const [location, setLocation] = useState<ResolvedLocation | null>(null);
  const [locationSheetVisible, setLocationSheetVisible] = useState(false);
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [phoneDialCode, setPhoneDialCode] = useState('+234');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [description, setDescription] = useState('');

  const { createBusiness, submitting } = useCreateBusiness();
  const showToast = useToastStore(s => s.showToast);

  const isValid = name.trim().length > 0 && typeSelection !== null;

  async function handleContinue() {
    if (!isValid) return;
    try {
      const business = await createBusiness({
        name: name.trim(),
        description: description.trim(),
        storeTypeId: typeSelection!.storeTypeId,
        categoryId: typeSelection!.categoryId,
        instagramUrl: instagramUrl.trim(),
        tiktokUrl: tiktokUrl.trim(),
        whatsappNumber: phoneDigits.trim() ? `${phoneDialCode} ${phoneDigits.trim()}` : undefined,
        location: location ?? undefined,
      });
      showToast('Your business has been created', 'success');
      onCreated?.(business);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not create your business. Please try again.', 'error');
    }
  }

  return (
    <View className="flex-1 bg-white">
      <TopNav />

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          className="flex-1 px-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        >
          <Text className="mb-6 font-roboto-bold text-2xl text-[#1A1A1A]">Business Information</Text>

          <FieldLabel text="Business Name" />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Business name"
            placeholderTextColor="#9CA3AF"
            className="mb-5 rounded-2xl border border-hairline bg-surface px-4 py-3.5 font-roboto text-base text-[#1A1A1A]"
          />

          <FieldLabel text="Business Type" />
          <TouchableOpacity
            onPress={() => setTypePickerVisible(true)}
            activeOpacity={0.7}
            className="mb-5 flex-row items-center justify-between rounded-2xl border border-hairline bg-surface px-4 py-3.5"
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
            onPress={() => setLocationSheetVisible(true)}
            activeOpacity={0.7}
            className="mb-5 flex-row items-center justify-between rounded-2xl border border-hairline bg-surface px-4 py-3.5"
          >
            <Text
              className={`flex-1 font-roboto text-base ${location ? 'text-[#1A1A1A]' : 'text-muted-light'}`}
              numberOfLines={1}
            >
              {location ? location.formatted_address ?? location.label : 'Search for a location...'}
            </Text>
            <MapPin size={16} color="#9CA3AF" strokeWidth={2} />
          </TouchableOpacity>

          <FieldLabel text="TikTok Url" optional />
          <TextInput
            value={tiktokUrl}
            onChangeText={setTiktokUrl}
            placeholder="Tiktok Url."
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            className="mb-5 rounded-2xl border border-hairline bg-surface px-4 py-3.5 font-roboto text-base text-[#1A1A1A]"
          />

          <FieldLabel text="Instagram url" optional />
          <TextInput
            value={instagramUrl}
            onChangeText={setInstagramUrl}
            placeholder="Instagram url."
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            className="mb-5 rounded-2xl border border-hairline bg-surface px-4 py-3.5 font-roboto text-base text-[#1A1A1A]"
          />

          <FieldLabel text="Phone Number" />
          <View className="mb-5">
            <PhoneInput
              dialCode={phoneDialCode}
              digits={phoneDigits}
              onChangeDialCode={setPhoneDialCode}
              onChangeDigits={setPhoneDigits}
            />
          </View>

          <FieldLabel text="Description" />
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

          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isValid || submitting}
            activeOpacity={0.85}
            className={`flex-row items-center justify-center gap-2 rounded-full py-4 ${
              !isValid || submitting ? 'bg-brand/40' : 'bg-brand'
            }`}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text className="font-roboto-bold text-base text-white">Continue</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.2} />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomSheet visible={typePickerVisible} onClose={() => setTypePickerVisible(false)}>
        <BusinessTypePickerSheet
          onSelect={selection => {
            setTypeSelection(selection);
            setTypePickerVisible(false);
          }}
        />
      </BottomSheet>

      <DetectLocationSheet
        visible={locationSheetVisible}
        onClose={() => setLocationSheetVisible(false)}
        onSelectLocation={setLocation}
      />
    </View>
  );
}

function FieldLabel({ text, optional }: { text: string; optional?: boolean }) {
  return (
    <Text className="mb-2 font-roboto-bold text-sm text-[#1A1A1A]">
      {text} {optional ? <Text className="font-roboto text-muted-light">(optional)</Text> : null}
    </Text>
  );
}
