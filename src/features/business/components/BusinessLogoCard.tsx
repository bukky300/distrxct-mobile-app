import React from 'react';
import { View, Text, Image } from 'react-native';
import BusinessCardHeader from './BusinessCardHeader';

interface Props {
  logoUri: string | null;
  onEdit: () => void;
}

export default function BusinessLogoCard({ logoUri, onEdit }: Props) {
  return (
    <View className="mb-4 rounded-2xl border border-hairline bg-white p-4">
      <BusinessCardHeader title="Business Logo" onEdit={onEdit} />

      {logoUri ? (
        <Image source={{ uri: logoUri }} className="h-16 w-16 rounded-full" />
      ) : (
        <Text className="font-roboto text-base text-muted-light">No Business logo</Text>
      )}
    </View>
  );
}
