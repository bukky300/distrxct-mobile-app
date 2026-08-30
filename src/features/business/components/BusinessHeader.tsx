import React from 'react';
import { View, Text, Image } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import type { Business } from '../types';

interface Props {
  business: Business;
}

export default function BusinessHeader({ business }: Props) {
  const isOpen = Boolean(business.open_hour && business.close_hour);

  return (
    <View className="flex-row items-center gap-4 px-4 pb-5 pt-2">
      {business.logo?.thumbnail ? (
        <Image source={{ uri: business.logo.thumbnail }} className="h-16 w-16 rounded-full" />
      ) : (
        <View className="h-16 w-16 items-center justify-center rounded-full bg-mint">
          <Sparkles size={26} color="#2A5C40" strokeWidth={1.6} />
        </View>
      )}

      <View className="flex-1 gap-1">
        <Text className="font-roboto-bold text-2xl text-[#1A1A1A]">{business.name}</Text>
        {business.store_type?.name ? (
          <Text className="font-roboto text-base text-muted-light">{business.store_type.name}</Text>
        ) : null}
        <View
          className={`self-start rounded-full border px-3 py-0.5 ${
            isOpen ? 'border-brand bg-mint' : 'border-danger bg-danger-bg'
          }`}
        >
          <Text className={`font-roboto-bold text-xs ${isOpen ? 'text-brand' : 'text-danger'}`}>
            {isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>
    </View>
  );
}
