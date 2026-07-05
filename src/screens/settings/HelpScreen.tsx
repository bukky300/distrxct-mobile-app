import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Mail, Copy, Check } from 'lucide-react-native';
import TopNav from '@components/layout/TopNav';
import SettingsHeader from '@features/settings/components/SettingsHeader';

const SUPPORT_EMAIL = 'support@distrxct.com';

export default function HelpScreen() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(SUPPORT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View className="flex-1 bg-white">
      <TopNav />
      <SettingsHeader title="Help" useSafeArea={false} />

      <View className="px-4">
        <Text className="text-center font-roboto text-base leading-6 text-[#1A1A1A]">
          Need assistance? Reach out to our support team and we&apos;ll get back to you as soon as possible.
        </Text>

        <View className="mt-6 items-center rounded-2xl border border-hairline px-6 py-10">
          <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-mint">
            <Mail size={26} color="#2A5C40" strokeWidth={1.8} />
          </View>
          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)} activeOpacity={0.7}>
            <Text className="font-roboto-bold text-xl text-brand underline">{SUPPORT_EMAIL}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleCopy}
          activeOpacity={0.7}
          className="mt-4 flex-row items-center justify-between rounded-full border border-hairline px-5 py-4"
        >
          <Text className="font-roboto text-base text-[#1A1A1A]">{copied ? 'Copied!' : 'Copy Email'}</Text>
          {copied ? (
            <Check size={20} color="#2A5C40" strokeWidth={2.2} />
          ) : (
            <Copy size={20} color="#2A5C40" strokeWidth={2} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
