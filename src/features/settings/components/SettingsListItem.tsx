import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';

interface Props {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export default function SettingsListItem({ icon: Icon, title, subtitle, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      className="flex-row items-center gap-3.5 py-3.5 active:opacity-60"
    >
      <View className="h-11 w-11 items-center justify-center rounded-full bg-mint">
        <Icon size={20} color="#2A5C40" strokeWidth={1.8} />
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="font-roboto-bold text-base text-[#1A1A1A]">{title}</Text>
        <Text className="font-roboto text-sm text-muted-light">{subtitle}</Text>
      </View>

      <ChevronRight size={20} color="#6B7280" strokeWidth={2} />
    </TouchableOpacity>
  );
}
