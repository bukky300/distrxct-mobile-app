import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import TopNav from '@components/layout/TopNav';
import DetectLocationSheet from '@features/discover/components/DetectLocationSheet';
import BusinessHeader from '@features/business/components/BusinessHeader';
import BusinessInfoCard from '@features/business/components/BusinessInfoCard';
import AboutBusinessCard from '@features/business/components/AboutBusinessCard';
import BusinessLogoCard from '@features/business/components/BusinessLogoCard';
import HoursCard from '@features/business/components/HoursCard';
import GalleryCard from '@features/business/components/GalleryCard';
import EditBusinessDetailSheet from '@features/business/components/EditBusinessDetailSheet';
import EditAboutSheet from '@features/business/components/EditAboutSheet';
import EditHoursSheet from '@features/business/components/EditHoursSheet';
import EditLogoSheet from '@features/business/components/EditLogoSheet';
import EditGallerySheet from '@features/business/components/EditGallerySheet';
import { useUpdateBusinessLocation } from '@features/business/hooks/useUpdateBusinessLocation';
import { useToastStore } from '@features/ui/store/toastStore';
import type { Business } from '@features/business/types';

interface Props {
  business: Business;
  onBusinessUpdated: (business: Business) => void;
}

type EditSheet = 'detail' | 'about' | 'hours' | 'logo' | 'gallery' | null;

// Handoff delay from EditBusinessDetailSheet's location row to DetectLocationSheet — both
// are RN Modals, and opening the second before the first finishes its close animation
// (BottomSheet's exit animation is ~260ms) stacks two Modals at once and locks the app up.
const MODAL_HANDOFF_DELAY_MS = 300;

export default function BusinessDashboardScreen({ business, onBusinessUpdated }: Props) {
  const [activeSheet, setActiveSheet] = useState<EditSheet>(null);
  const [locationSheetVisible, setLocationSheetVisible] = useState(false);
  const { updateBusinessLocation } = useUpdateBusinessLocation();
  const showToast = useToastStore(s => s.showToast);

  function handleEditLocation() {
    setActiveSheet(null);
    setTimeout(() => setLocationSheetVisible(true), MODAL_HANDOFF_DELAY_MS);
  }

  async function handleSelectLocation(result: Parameters<typeof updateBusinessLocation>[2]) {
    try {
      const formattedAddress = await updateBusinessLocation(business.id, business.location?.id ?? null, result);
      onBusinessUpdated({
        ...business,
        location: { id: business.location?.id ?? '', formattedAddress },
      });
      showToast('Business location updated', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not save your location.', 'error');
    }
  }

  return (
    <View className="flex-1 bg-white">
      <TopNav />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <BusinessHeader business={business} />

        <View className="px-4">
          <BusinessInfoCard business={business} onEdit={() => setActiveSheet('detail')} />
          <AboutBusinessCard description={business.description} onEdit={() => setActiveSheet('about')} />
          <BusinessLogoCard logoUri={business.logo?.thumbnail ?? null} onEdit={() => setActiveSheet('logo')} />
          <HoursCard openHour={business.open_hour} closeHour={business.close_hour} onEdit={() => setActiveSheet('hours')} />
          <GalleryCard images={business.media_url ?? []} onEdit={() => setActiveSheet('gallery')} />
        </View>
      </ScrollView>

      <EditBusinessDetailSheet
        visible={activeSheet === 'detail'}
        business={business}
        onClose={() => setActiveSheet(null)}
        onSaved={onBusinessUpdated}
        onEditLocation={handleEditLocation}
      />
      <EditAboutSheet
        visible={activeSheet === 'about'}
        business={business}
        onClose={() => setActiveSheet(null)}
        onSaved={onBusinessUpdated}
      />
      <EditHoursSheet
        visible={activeSheet === 'hours'}
        business={business}
        onClose={() => setActiveSheet(null)}
        onSaved={onBusinessUpdated}
      />
      <EditLogoSheet
        visible={activeSheet === 'logo'}
        business={business}
        onClose={() => setActiveSheet(null)}
        onSaved={onBusinessUpdated}
      />
      <EditGallerySheet
        visible={activeSheet === 'gallery'}
        business={business}
        onClose={() => setActiveSheet(null)}
        onSaved={onBusinessUpdated}
      />

      <DetectLocationSheet
        visible={locationSheetVisible}
        onClose={() => setLocationSheetVisible(false)}
        onSelectLocation={result => {
          setLocationSheetVisible(false);
          handleSelectLocation(result);
        }}
      />
    </View>
  );
}
