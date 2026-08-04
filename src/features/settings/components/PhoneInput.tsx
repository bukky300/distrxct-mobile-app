import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import BottomSheet from '@components/ui/BottomSheet';
import { countries, type Country } from '../data/countries';

const MIN_PHONE_DIGITS = 5;
const MAX_PHONE_DIGITS = 10;

interface Props {
  dialCode: string;
  digits: string;
  onChangeDialCode: (dialCode: string) => void;
  onChangeDigits: (digits: string) => void;
}

export default function PhoneInput({ dialCode, digits, onChangeDialCode, onChangeDigits }: Props) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const selected = countries.find(c => c.dialCode === dialCode) ?? countries[0];

  // Default the dial code from IP geolocation the first time this renders with none set yet,
  // falling back to the first entry (Nigeria) — matches web's InputPhone behavior.
  useEffect(() => {
    if (dialCode) return;
    let cancelled = false;

    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then((data: { country?: string }) => {
        if (cancelled) return;
        const found = countries.find(c => c.code === data.country);
        onChangeDialCode((found ?? countries[0]).dialCode);
      })
      .catch(() => {
        if (!cancelled) onChangeDialCode(countries[0].dialCode);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDigitsChange(text: string) {
    onChangeDigits(text.replace(/\D/g, '').slice(0, MAX_PHONE_DIGITS));
  }

  function handleSelectCountry(country: Country) {
    onChangeDialCode(country.dialCode);
    setPickerVisible(false);
  }

  const digitsError =
    digits.length > 0 && digits.length < MIN_PHONE_DIGITS
      ? `Phone number must be at least ${MIN_PHONE_DIGITS} digits`
      : null;

  return (
    <View>
      <View className="flex-row items-center rounded-2xl border border-hairline bg-white px-2 py-1.5">
        <TouchableOpacity
          onPress={() => setPickerVisible(true)}
          activeOpacity={0.7}
          className="flex-row items-center gap-1 border-r border-hairline px-2 py-2"
        >
          <Text className="text-base">{selected.flag}</Text>
          <Text className="font-roboto text-sm text-[#1A1A1A]">{selected.dialCode}</Text>
          <ChevronDown size={14} color="#6B7280" strokeWidth={2} />
        </TouchableOpacity>
        <TextInput
          value={digits}
          onChangeText={handleDigitsChange}
          keyboardType="number-pad"
          placeholder="Phone number"
          placeholderTextColor="#9CA3AF"
          className="flex-1 px-3 py-2 font-roboto text-base text-[#1A1A1A]"
        />
      </View>
      {digitsError ? <Text className="mt-1 px-1 font-roboto text-xs text-danger">{digitsError}</Text> : null}

      <BottomSheet visible={pickerVisible} onClose={() => setPickerVisible(false)}>
        <Text className="mb-3 px-5 font-roboto-bold text-lg text-[#1A1A1A]">Select country</Text>
        <ScrollView style={{ maxHeight: 360 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}>
          {countries.map(country => (
            <TouchableOpacity
              key={country.code}
              onPress={() => handleSelectCountry(country)}
              activeOpacity={0.7}
              className="flex-row items-center gap-3 py-3"
            >
              <Text className="text-lg">{country.flag}</Text>
              <Text className="flex-1 font-roboto text-sm text-[#1A1A1A]">{country.name}</Text>
              <Text className="font-roboto text-sm text-muted-light">{country.dialCode}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </BottomSheet>
    </View>
  );
}
