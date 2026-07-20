import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { X, ChevronUp, ChevronDown, Crosshair } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';

const BUSINESS_TYPES = [
  'Hotels',
  'Petrol Station',
  'Restaurants',
  'Car Rental',
  'Animal Care',
  'Super Market',
  'Car Wash',
  'Hair Saloon',
];

const WORKING_HOURS = ['Open Now', '24/7', 'Closed'];

export interface DiscoverFilters {
  businessTypes: string[];
  workingHours: string[];
  location: string;
}

const DEFAULT_FILTERS: DiscoverFilters = {
  businessTypes: ['Hotels'],
  workingHours: ['Open Now'],
  location: 'Rivers',
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: DiscoverFilters) => void;
  initialFilters?: DiscoverFilters;
}

export default function DiscoverFiltersSheet({
  visible,
  onClose,
  onApply,
  initialFilters = DEFAULT_FILTERS,
}: Props) {
  const [businessTypes, setBusinessTypes] = useState(initialFilters.businessTypes);
  const [workingHours, setWorkingHours] = useState(initialFilters.workingHours);
  const [location, setLocation] = useState(initialFilters.location);
  const [typeQuery, setTypeQuery] = useState('');

  const [typeOpen, setTypeOpen] = useState(true);
  const [hoursOpen, setHoursOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(true);

  const visibleTypes = typeQuery.trim()
    ? BUSINESS_TYPES.filter(t => t.toLowerCase().includes(typeQuery.toLowerCase()))
    : BUSINESS_TYPES;

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  }

  function handleReset() {
    setBusinessTypes([]);
    setWorkingHours([]);
    setLocation('');
    setTypeQuery('');
  }

  function handleApply() {
    onApply({ businessTypes, workingHours, location });
    onClose();
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Filters</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
          <X size={16} color="#1A1A1A" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        {/* Business Type */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setTypeOpen(o => !o)}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionTitle}>Business Type</Text>
          {typeOpen ? (
            <ChevronUp size={18} color="#1A1A1A" strokeWidth={2} />
          ) : (
            <ChevronDown size={18} color="#1A1A1A" strokeWidth={2} />
          )}
        </TouchableOpacity>

        {typeOpen && (
          <View style={styles.sectionBody}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Business type..."
              placeholderTextColor="#9CA3AF"
              value={typeQuery}
              onChangeText={setTypeQuery}
            />
            <View style={styles.chipWrap}>
              {visibleTypes.map(type => {
                const selected = businessTypes.includes(type);
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => toggle(businessTypes, setBusinessTypes, type)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.divider} />

        {/* Working Hours */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setHoursOpen(o => !o)}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionTitle}>Working Hours</Text>
          {hoursOpen ? (
            <ChevronUp size={18} color="#1A1A1A" strokeWidth={2} />
          ) : (
            <ChevronDown size={18} color="#1A1A1A" strokeWidth={2} />
          )}
        </TouchableOpacity>

        {hoursOpen && (
          <View style={[styles.sectionBody, styles.chipWrap]}>
            {WORKING_HOURS.map(hours => {
              const selected = workingHours.includes(hours);
              return (
                <TouchableOpacity
                  key={hours}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => toggle(workingHours, setWorkingHours, hours)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {hours}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.divider} />

        {/* Location */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setLocationOpen(o => !o)}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionTitle}>Location</Text>
          {locationOpen ? (
            <ChevronUp size={18} color="#1A1A1A" strokeWidth={2} />
          ) : (
            <ChevronDown size={18} color="#1A1A1A" strokeWidth={2} />
          )}
        </TouchableOpacity>

        {locationOpen && (
          <View style={styles.sectionBody}>
            <View style={styles.locationRow}>
              <Text style={styles.locationText}>{location || 'Select location'}</Text>
              <Crosshair size={18} color="#2A5C40" strokeWidth={2} />
            </View>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.85}>
        <Text style={styles.applyText}>Apply filter</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  resetText: {
    fontSize: 14,
    fontFamily: 'Roboto_400Bold',
    color: '#2A5C40',
    width: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    maxHeight: 460,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
  },
  sectionBody: {
    gap: 12,
    paddingBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: '#E2EDE6',
    borderColor: '#2A5C40',
  },
  chipText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Roboto_400Regular',
  },
  chipTextSelected: {
    color: '#2A5C40',
    fontFamily: 'Roboto_400Bold',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  locationText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
  },
  applyBtn: {
    marginHorizontal: 20,
    marginTop: 8,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2A5C40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#FFFFFF',
  },
});
