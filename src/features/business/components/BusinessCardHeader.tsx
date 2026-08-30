import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Pencil } from 'lucide-react-native';

interface Props {
  title: string;
  onEdit: () => void;
}

export default function BusinessCardHeader({ title, onEdit }: Props) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="font-roboto-bold text-base text-[#1A1A1A]">{title}</Text>
      <TouchableOpacity
        onPress={onEdit}
        activeOpacity={0.7}
        className="flex-row items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5"
      >
        <Pencil size={13} color="#1A1A1A" strokeWidth={2} />
        <Text className="font-roboto-bold text-sm text-[#1A1A1A]">Edit</Text>
      </TouchableOpacity>
    </View>
  );
}
