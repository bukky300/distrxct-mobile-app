import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Pencil, ImageIcon, Plus, LocateFixed } from 'lucide-react-native';
import TopNav from '@components/layout/TopNav';
import SettingsHeader from '@features/settings/components/SettingsHeader';

interface FieldRowProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  editable?: boolean;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
}

function FieldRow({
  label,
  value,
  onChangeText,
  editable = true,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'none',
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
        {editable && (
          <TouchableOpacity onPress={() => inputRef.current?.focus()} hitSlop={8} activeOpacity={0.7}>
            <Pencil size={18} color="#2A5C40" strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function AccountScreen() {
  const [name, setName] = useState('Ologwu samuel');
  const [username, setUsername] = useState('Ologwu');
  const [phone, setPhone] = useState('09086543234');
  const [location, setLocation] = useState('Rivers, Nigeria');
  const email = 'Ogbonnasamuel67@gmail.com';

  return (
    <View className="flex-1 bg-white">
      <TopNav />
      <SettingsHeader title="Account" useSafeArea={false} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
              <View className="h-16 w-16 items-center justify-center rounded-full bg-mint">
                <ImageIcon size={26} color="#2A5C40" strokeWidth={1.6} />
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full border border-hairline bg-white"
              >
                <Plus size={14} color="#1A1A1A" strokeWidth={2.4} />
              </TouchableOpacity>
            </View>
            <Text className="font-roboto text-base text-muted-light">Profile photo</Text>
          </View>

          <FieldRow label="Name" value={name} onChangeText={setName} autoCapitalize="words" />
          <FieldRow label="Username" value={username} onChangeText={setUsername} />
          <FieldRow label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          {/* Email — read only */}
          <View className="mb-5">
            <Text className="mb-2 font-roboto-bold text-sm text-[#1A1A1A]">Email</Text>
            <View className="flex-row items-center rounded-2xl border border-hairline bg-surface px-4 py-3.5">
              <Text className="flex-1 font-roboto text-base text-muted-light">{email}</Text>
            </View>
          </View>

          {/* Location */}
          <View className="mb-5">
            <Text className="mb-2 font-roboto-bold text-sm text-[#1A1A1A]">Location</Text>
            <View className="flex-row items-center rounded-2xl border border-hairline bg-white px-4 py-3.5">
              <TextInput
                value={location}
                onChangeText={setLocation}
                className="flex-1 font-roboto text-base text-[#1A1A1A]"
              />
              <TouchableOpacity activeOpacity={0.7} hitSlop={8}>
                <LocateFixed size={18} color="#2A5C40" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
