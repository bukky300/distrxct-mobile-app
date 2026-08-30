import React, { useState } from 'react';
import { View, Text } from 'react-native';
import BusinessCardHeader from './BusinessCardHeader';

interface Props {
  description: string | null;
  onEdit: () => void;
}

export default function AboutBusinessCard({ description, onEdit }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="mb-4 rounded-2xl border border-hairline bg-white p-4">
      <BusinessCardHeader title="About Business" onEdit={onEdit} />

      {description ? (
        <Text className="font-roboto text-base leading-6 text-[#1A1A1A]" numberOfLines={expanded ? undefined : 4}>
          {description}{' '}
          <Text className="font-roboto-bold text-brand" onPress={() => setExpanded(e => !e)}>
            {expanded ? 'see less' : 'see more'}
          </Text>
        </Text>
      ) : (
        <Text className="font-roboto text-base text-muted-light">No description yet.</Text>
      )}
    </View>
  );
}
