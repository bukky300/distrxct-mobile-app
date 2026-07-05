import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

interface Props {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export default function SettingsCheckbox({ label, checked, onToggle }: Props) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      className="flex-row items-start gap-3 py-2.5 active:opacity-70"
    >
      <View
        className={`mt-0.5 h-6 w-6 items-center justify-center rounded-md border ${
          checked ? 'border-brand bg-brand' : 'border-hairline bg-white'
        }`}
      >
        {checked && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
      </View>
      <Text className="flex-1 font-roboto text-base leading-6 text-[#1A1A1A]">{label}</Text>
    </TouchableOpacity>
  );
}
