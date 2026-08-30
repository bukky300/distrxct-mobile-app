import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import TopNav from '@components/layout/TopNav';
import CreateBusinessScreen from './CreateBusinessScreen';
import BusinessDashboardScreen from './BusinessDashboardScreen';
import { useMyBusiness } from '@features/business/hooks/useMyBusiness';
import type { Business } from '@features/business/types';

function BusinessSkeleton() {
  return (
    <View className="flex-1 bg-white">
      <TopNav />
      <View className="px-4 pt-6">
        <View className="mb-6 flex-row items-center gap-4">
          <View className="h-16 w-16 rounded-full bg-surface" />
          <View className="h-5 w-40 rounded bg-surface" />
        </View>
        {[0, 1, 2, 3].map(i => (
          <View key={i} className="mb-4 h-32 rounded-2xl bg-surface" />
        ))}
      </View>
    </View>
  );
}

// Gate screen: shows the Create Business form if the current user doesn't own a business
// yet, otherwise the dashboard — the single entry point behind ProfileDrawer's
// "Distrxct business" item.
export default function BusinessScreen() {
  const { business: fetchedBusiness, loading, refetch } = useMyBusiness();
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (fetchedBusiness) setBusiness(fetchedBusiness);
  }, [fetchedBusiness]);

  if (loading && !business) {
    return <BusinessSkeleton />;
  }

  if (!business) {
    return (
      <CreateBusinessScreen
        onCreated={created => {
          setBusiness(created);
          refetch();
        }}
      />
    );
  }

  return <BusinessDashboardScreen business={business} onBusinessUpdated={setBusiness} />;
}
