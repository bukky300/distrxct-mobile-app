import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Pencil, ImageIcon, Plus, LocateFixed, X, Check } from 'lucide-react-native';
import TopNav from '@components/layout/TopNav';
import SettingsHeader from '@features/settings/components/SettingsHeader';
import DetectLocationSheet from '@features/discover/components/DetectLocationSheet';
import GenderSelector from '@features/settings/components/GenderSelector';
import PhoneInput from '@features/settings/components/PhoneInput';
import { useFullUser } from '@features/settings/hooks/useFullUser';
import { useUpdateAccount, type MediaFileInput } from '@features/settings/hooks/useUpdateAccount';
import { useCurrentLocation, useUpdateLocation } from '@features/settings/hooks/useUpdateLocation';
import { useToastStore } from '@features/ui/store/toastStore';
import type { ResolvedLocation } from '@features/locations/services/googlePlaces';

interface FieldRowProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  editable?: boolean;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
  onPressPencil?: () => void;
}

function FieldRow({
  label,
  value,
  onChangeText,
  editable = true,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'none',
  onPressPencil,
}: FieldRowProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <View className="mb-5">
      <Text className="mb-2 font-roboto-bold text-sm text-[#1A1A1A]">{label}</Text>
      <View
        className={`flex-row items-center rounded-2xl border px-4 py-3.5 ${
          editable ? 'border-hairline bg-white' : 'border-hairline bg-surface'
        }`}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          className="flex-1 font-roboto text-base text-[#1A1A1A]"
        />
        <TouchableOpacity
          onPress={() => (onPressPencil ? onPressPencil() : inputRef.current?.focus())}
          hitSlop={8}
          activeOpacity={0.7}
        >
          <Pencil size={18} color="#2A5C40" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AccountSkeleton() {
  return (
    <View className="px-4 pt-6">
      <View className="mb-6 flex-row items-center gap-4">
        <View className="h-16 w-16 rounded-full bg-surface" />
        <View className="h-4 w-28 rounded bg-surface" />
      </View>
      {[0, 1, 2, 3, 4].map(i => (
        <View key={i} className="mb-5 h-14 rounded-2xl bg-surface" />
      ))}
    </View>
  );
}

function buildFileName(mimeType: string): string {
  const ext = mimeType.split('/')[1] ?? 'jpg';
  return `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
}

export default function AccountScreen() {
  const { user, loading: userLoading } = useFullUser();
  const { updateAccount, submitting } = useUpdateAccount();
  const { formattedAddress, loading: locationLoading } = useCurrentLocation(user?.id);
  const { updateLocation } = useUpdateLocation();
  const showToast = useToastStore(s => s.showToast);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameChanged, setNameChanged] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [firstNameDraft, setFirstNameDraft] = useState('');
  const [lastNameDraft, setLastNameDraft] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameChanged, setUsernameChanged] = useState(false);

  const [phoneDialCode, setPhoneDialCode] = useState('');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneChanged, setPhoneChanged] = useState(false);

  const [gender, setGender] = useState<string | null>(null);
  const [genderChanged, setGenderChanged] = useState(false);

  const [newProfilePhoto, setNewProfilePhoto] = useState<MediaFileInput | null>(null);
  const [photoPreviewUri, setPhotoPreviewUri] = useState<string | null>(null);

  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [locationSheetVisible, setLocationSheetVisible] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setUsername(user.username);
    setGender(user.gender);
    const [dialCode, ...rest] = (user.phone_number ?? '').split(' ');
    setPhoneDialCode(dialCode ?? '');
    setPhoneDigits(rest.join(' '));
  }, [user]);

  useEffect(() => {
    setLocationLabel(formattedAddress);
  }, [formattedAddress]);

  const isDirty = nameChanged || usernameChanged || genderChanged || phoneChanged || !!newProfilePhoto;

  async function handlePickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showToast('Photo library permission denied', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    const asset = result.canceled ? null : result.assets?.[0];
    const base64 = asset?.base64;
    if (!asset || !base64) return;

    const mimeType = asset.mimeType ?? 'image/jpeg';
    setNewProfilePhoto({ mime_type: mimeType, file_name: buildFileName(mimeType), file_data: base64 });
    setPhotoPreviewUri(asset.uri);
  }

  function openNameEdit() {
    setFirstNameDraft(firstName);
    setLastNameDraft(lastName);
    setNameError(null);
    setIsEditingName(true);
  }

  function closeNameEdit() {
    setNameError(null);
    setIsEditingName(false);
  }

  function saveNameEdit() {
    if (!firstNameDraft.trim() || !lastNameDraft.trim()) {
      setNameError('First and last name are required.');
      return;
    }
    setFirstName(firstNameDraft.trim());
    setLastName(lastNameDraft.trim());
    setNameChanged(true);
    setIsEditingName(false);
    setNameError(null);
  }

  async function handleSelectLocation(result: ResolvedLocation) {
    if (!user) return;
    try {
      await updateLocation(user.id, result);
      setLocationLabel(result.formatted_address ?? result.label);
      showToast('Location updated', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not save your location.', 'error');
    }
  }

  async function handleSave() {
    if (!user) return;
    try {
      const updated = await updateAccount({
        userId: user.id,
        firstName,
        lastName,
        email: user.email,
        bio: user.bio,
        ...(usernameChanged && username !== user.username ? { username } : {}),
        ...(genderChanged && gender && gender !== user.gender ? { gender } : {}),
        ...(phoneChanged ? { phoneNumber: `${phoneDialCode} ${phoneDigits}` } : {}),
        ...(newProfilePhoto ? { profilePicture: newProfilePhoto } : {}),
      });

      setFirstName(updated.first_name);
      setLastName(updated.last_name);
      setUsername(updated.username);
      setGender(updated.gender);
      const [dialCode, ...rest] = (updated.phone_number ?? '').split(' ');
      setPhoneDialCode(dialCode ?? '');
      setPhoneDigits(rest.join(' '));
      setNewProfilePhoto(null);
      setPhotoPreviewUri(null);

      setNameChanged(false);
      setUsernameChanged(false);
      setGenderChanged(false);
      setPhoneChanged(false);
      setIsEditingUsername(false);
      setIsEditingPhone(false);

      showToast('Updated Successfully', 'success');
    } catch (e) {
      // Keep the dirty flags as-is so Save stays enabled for the user to retry.
      showToast(e instanceof Error ? e.message : 'Update failed.', 'error');
    }
  }

  if (userLoading || !user) {
    return (
      <View className="flex-1 bg-white">
        <TopNav />
        <SettingsHeader title="Account" useSafeArea={false} />
        <AccountSkeleton />
      </View>
    );
  }

  const avatarSource = photoPreviewUri
    ? { uri: photoPreviewUri }
    : user.profile_picture?.thumbnail
      ? { uri: user.profile_picture.thumbnail }
      : null;

  return (
    <View className="flex-1 bg-white">
      <TopNav />
      <SettingsHeader title="Account" useSafeArea={false} />

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          className="flex-1 px-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 48 }}
        >
          <Text className="font-roboto-bold text-2xl text-[#1A1A1A]">Account Information</Text>
          <Text className="mt-1 font-roboto text-sm text-muted-light">Distrxct information about you</Text>

          {/* Profile photo */}
          <View className="my-6 flex-row items-center gap-4">
            <View className="relative">
              {avatarSource ? (
                <Image source={avatarSource} className="h-16 w-16 rounded-full" />
              ) : (
                <View className="h-16 w-16 items-center justify-center rounded-full bg-mint">
                  <ImageIcon size={26} color="#2A5C40" strokeWidth={1.6} />
                </View>
              )}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handlePickPhoto}
                className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full border border-hairline bg-white"
              >
                <Plus size={14} color="#1A1A1A" strokeWidth={2.4} />
              </TouchableOpacity>
            </View>
            <Text className="font-roboto text-base text-muted-light">Profile photo</Text>
          </View>

          {/* Name */}
          {!isEditingName ? (
            <FieldRow
              label="Name"
              value={`${firstName} ${lastName}`.trim()}
              onChangeText={() => {}}
              editable={false}
              onPressPencil={openNameEdit}
            />
          ) : (
            <View className="mb-5 gap-3 rounded-2xl border border-hairline p-4">
              <View>
                <Text className="mb-2 font-roboto-bold text-sm text-[#1A1A1A]">First Name</Text>
                <TextInput
                  value={firstNameDraft}
                  onChangeText={setFirstNameDraft}
                  autoCapitalize="words"
                  className="rounded-2xl border border-hairline bg-white px-4 py-3.5 font-roboto text-base text-[#1A1A1A]"
                />
              </View>
              <View>
                <Text className="mb-2 font-roboto-bold text-sm text-[#1A1A1A]">Last Name</Text>
                <TextInput
                  value={lastNameDraft}
                  onChangeText={setLastNameDraft}
                  autoCapitalize="words"
                  className="rounded-2xl border border-hairline bg-white px-4 py-3.5 font-roboto text-base text-[#1A1A1A]"
                />
              </View>
              {nameError ? <Text className="font-roboto text-xs text-danger">{nameError}</Text> : null}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={closeNameEdit}
                  activeOpacity={0.8}
                  className="flex-1 flex-row items-center justify-center gap-1 rounded-full bg-danger py-3"
                >
                  <X size={16} color="#FFFFFF" strokeWidth={2} />
                  <Text className="font-roboto-bold text-sm text-white">Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={saveNameEdit}
                  disabled={!firstNameDraft.trim() || !lastNameDraft.trim()}
                  activeOpacity={0.8}
                  className={`flex-1 flex-row items-center justify-center gap-1 rounded-full py-3 ${
                    !firstNameDraft.trim() || !lastNameDraft.trim() ? 'bg-brand/40' : 'bg-brand'
                  }`}
                >
                  <Check size={16} color="#FFFFFF" strokeWidth={2} />
                  <Text className="font-roboto-bold text-sm text-white">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <FieldRow
            label="Username"
            value={username}
            onChangeText={text => {
              setUsername(text);
              setUsernameChanged(true);
            }}
            editable={isEditingUsername}
            onPressPencil={() => setIsEditingUsername(v => !v)}
          />

          {/* Email — read only, matches web's actual save behavior (typed changes are never persisted) */}
          <View className="mb-5">
            <Text className="mb-2 font-roboto-bold text-sm text-[#1A1A1A]">Email</Text>
            <View className="flex-row items-center rounded-2xl border border-hairline bg-surface px-4 py-3.5">
              <Text className="flex-1 font-roboto text-base text-muted-light">{user.email}</Text>
            </View>
          </View>

          {/* Phone */}
          <View className="mb-5">
            <Text className="mb-2 font-roboto-bold text-sm text-[#1A1A1A]">Phone number</Text>
            {!isEditingPhone ? (
              <View className="flex-row items-center rounded-2xl border border-hairline bg-surface px-4 py-3.5">
                <Text className="flex-1 font-roboto text-base text-muted-light">{user.phone_number ?? ''}</Text>
                <TouchableOpacity onPress={() => setIsEditingPhone(true)} hitSlop={8} activeOpacity={0.7}>
                  <Pencil size={18} color="#2A5C40" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            ) : (
              <PhoneInput
                dialCode={phoneDialCode}
                digits={phoneDigits}
                onChangeDialCode={code => {
                  setPhoneDialCode(code);
                  setPhoneChanged(true);
                }}
                onChangeDigits={digits => {
                  setPhoneDigits(digits);
                  setPhoneChanged(true);
                }}
              />
            )}
          </View>

          {/* Location — saves instantly on selection, independent of the main Save button */}
          <View className="mb-5">
            <Text className="mb-2 font-roboto-bold text-sm text-[#1A1A1A]">Location</Text>
            <View className="flex-row items-center rounded-2xl border border-hairline bg-white px-4 py-3.5">
              {locationLoading ? (
                <ActivityIndicator size="small" color="#2A5C40" />
              ) : (
                <Text className="flex-1 font-roboto text-base text-[#1A1A1A]">
                  {locationLabel || 'Choose location...'}
                </Text>
              )}
              <TouchableOpacity activeOpacity={0.7} hitSlop={8} onPress={() => setLocationSheetVisible(true)}>
                <LocateFixed size={18} color="#2A5C40" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Gender */}
          <View className="mb-6">
            <Text className="mb-2 font-roboto-bold text-sm text-[#1A1A1A]">Gender</Text>
            <GenderSelector
              value={gender}
              onChange={value => {
                setGender(value);
                setGenderChanged(true);
              }}
            />
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={!isDirty || submitting}
            activeOpacity={0.85}
            className={`items-center justify-center rounded-full py-4 ${
              !isDirty || submitting ? 'bg-brand/40' : 'bg-brand'
            }`}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="font-roboto-bold text-base text-white">Save</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <DetectLocationSheet
        visible={locationSheetVisible}
        onClose={() => setLocationSheetVisible(false)}
        onSelectLocation={handleSelectLocation}
      />
    </View>
  );
}
