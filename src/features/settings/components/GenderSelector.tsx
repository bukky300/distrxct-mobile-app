import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

const OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Prefer not to say', value: 'other' },
] as const;

interface Props {
  value: string | null;
  onChange: (value: string) => void;
}

export default function GenderSelector({ value, onChange }: Props) {
  return (
    <View className="flex-row flex-wrap items-center gap-4 rounded-2xl border border-hairline px-4 py-3.5">
      {OPTIONS.map(option => {
        const selected = value === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
            className="flex-row items-center gap-2"
          >
            <View
              className={`h-4 w-4 items-center justify-center rounded border ${
                selected ? 'border-brand bg-brand' : 'border-hairline'
              }`}
            >
              {selected ? <Check size={11} color="#FFFFFF" strokeWidth={3} /> : null}
            </View>
            <Text className="font-roboto text-sm text-[#1A1A1A]">{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
