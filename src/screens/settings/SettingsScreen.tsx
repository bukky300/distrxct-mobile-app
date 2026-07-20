import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, User, Unlock, SlidersHorizontal, HelpCircle, Ban, ChevronRight } from 'lucide-react-native';
import TopNav from '@components/layout/TopNav';
import SettingsListItem from '@features/settings/components/SettingsListItem';
import { useAuth } from '@features/auth/hooks/useAuth';
import type { SettingsStackParamList } from '@navigation/types';

type NavProp = NativeStackNavigationProp<SettingsStackParamList>;

const SETTINGS_ITEMS = [
  {
    key: 'Account' as const,
    icon: User,
    title: 'Account',
    subtitle: 'manage your account name and email',
  },
  {
    key: 'ChangePassword' as const,
    icon: Unlock,
    title: 'Password',
    subtitle: 'manage your password',
  },
  {
    key: 'Preferences' as const,
    icon: SlidersHorizontal,
    title: 'Preference',
    subtitle: 'Manage your notification,  email',
  },
  {
    key: 'Help' as const,
    icon: HelpCircle,
    title: 'Help',
    subtitle: 'Chat with our customer support team',
  },
  {
    key: 'FAQ' as const,
    icon: HelpCircle,
    title: 'FAQ',
    subtitle: 'Manage your block list',
  },
  {
    key: 'BlockList' as const,
    icon: Ban,
    title: 'Block list',
    subtitle: 'Manage your block list',
  },
];

export default function SettingsScreen() {
  const navigation = useNavigation<NavProp>();
  const { logout } = useAuth();
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SETTINGS_ITEMS;
    return SETTINGS_ITEMS.filter(item => item.title.toLowerCase().includes(q));
  }, [query]);

  return (
    <View className="flex-1 bg-white">
      <TopNav />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="mt-2 px-4 font-roboto-bold text-3xl text-[#1A1A1A]">Settings</Text>

        {/* Search */}
        <View className="mx-4 mt-6 flex-row items-center rounded-full border border-hairline bg-surface px-5 py-3.5">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search settings ..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 font-roboto text-base text-[#1A1A1A]"
          />
          <Search size={20} color="#6B7280" strokeWidth={2} />
        </View>

        {/* List */}
        <View className="mt-2 px-4">
          {filteredItems.map(item => (
            <SettingsListItem
              key={item.key}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => navigation.navigate(item.key)}
            />
          ))}

          {filteredItems.length === 0 && (
            <Text className="py-8 text-center font-roboto text-base text-muted-light">
              No settings match &quot;{query}&quot;
            </Text>
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={logout}
          activeOpacity={0.7}
          className="mx-4 mt-6 flex-row items-center justify-center gap-1.5 rounded-full bg-danger-bg py-4 active:opacity-70"
        >
          <Text className="font-roboto-bold text-base text-danger">Logout</Text>
          <ChevronRight size={18} color="#DC2626" strokeWidth={2.4} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
