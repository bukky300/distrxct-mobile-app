import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface Props {
  title: string;
  rightSlot?: React.ReactNode;
  /** Set false when a <TopNav /> already precedes this header and has reserved the safe area. */
  useSafeArea?: boolean;
}

export default function SettingsHeader({ title, rightSlot, useSafeArea = true }: Props) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between px-4 pb-3"
      style={{ paddingTop: (useSafeArea ? insets.top : 0) + 12 }}
    >
      <TouchableOpacity
        onPress={navigation.goBack}
        activeOpacity={0.7}
        className="flex-row items-center gap-2"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ChevronLeft size={22} color="#1A1A1A" strokeWidth={2.2} />
        <Text className="font-roboto-bold text-xl text-[#1A1A1A]">{title}</Text>
      </TouchableOpacity>

      {rightSlot ?? <View className="w-6" />}
    </View>
  );
}
