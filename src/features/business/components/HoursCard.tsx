import React from 'react';
import { View, Text } from 'react-native';
import BusinessCardHeader from './BusinessCardHeader';
import { formatTime12h } from '../utils/time';

interface Props {
  openHour: string | null;
  closeHour: string | null;
  onEdit: () => void;
}

export default function HoursCard({ openHour, closeHour, onEdit }: Props) {
  const isOpen = Boolean(openHour && closeHour);

  return (
    <View className="mb-4 rounded-2xl border border-hairline bg-white p-4">
      <BusinessCardHeader title="Hours" onEdit={onEdit} />

      {isOpen ? (
        <View className="flex-row justify-between">
          <View>
            <Text className="mb-1 font-roboto text-sm text-muted-light">Opening Hour:</Text>
            <Text className="font-roboto-bold text-base text-[#1A1A1A]">{formatTime12h(openHour!)}</Text>
          </View>
          <View>
            <Text className="mb-1 font-roboto text-sm text-muted-light">Closing Hour:</Text>
            <Text className="font-roboto-bold text-base text-[#1A1A1A]">{formatTime12h(closeHour!)}</Text>
          </View>
        </View>
      ) : (
        <Text className="font-roboto text-base text-muted-light">Closed</Text>
      )}
    </View>
  );
}
