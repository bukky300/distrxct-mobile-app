import React from 'react';
import { View, Text } from 'react-native';
import BusinessCardHeader from './BusinessCardHeader';
import type { Business } from '../types';

interface Props {
  business: Business;
  onEdit: () => void;
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <View className="mb-4">
      <Text className="mb-1 font-roboto text-sm text-muted-light">{label}</Text>
      <Text className="font-roboto text-base text-[#1A1A1A]">{value || '–'}</Text>
    </View>
  );
}

export default function BusinessInfoCard({ business, onEdit }: Props) {
  const businessType = business.store_type?.name
    ? [business.store_type.name, business.store_categories[0]?.name].filter(Boolean).join(' / ')
    : null;

  return (
    <View className="mb-4 rounded-2xl border border-hairline bg-white p-4">
      <BusinessCardHeader title="Business Information" onEdit={onEdit} />

      <InfoRow label="Business name" value={business.name} />
      <InfoRow label="TikTok Url" value={business.tictok_url} />
      <InfoRow label="Instagram Url" value={business.instagram_url} />
      <InfoRow label="Email address" value={business.email} />
      <InfoRow label="Phone (Whatsapp)" value={business.whatsapp_number} />
      <InfoRow label="Address" value={business.location?.formattedAddress ?? null} />
      <InfoRow label="Business type" value={businessType} />
      <View className="mb-0">
        <Text className="mb-1 font-roboto text-sm text-muted-light">Timezone</Text>
        <Text className="font-roboto text-base text-[#1A1A1A]">{business.timezone || '–'}</Text>
      </View>
    </View>
  );
}
