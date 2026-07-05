import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import TopNav from '@components/layout/TopNav';
import SettingsHeader from '@features/settings/components/SettingsHeader';
import SettingsCheckbox from '@features/settings/components/SettingsCheckbox';

interface PreferenceState {
  trendingDigest: boolean;
  rateReminders: boolean;
  friendShares: boolean;
  friendTips: boolean;
}

const INITIAL_STATE: PreferenceState = {
  trendingDigest: true,
  rateReminders: true,
  friendShares: false,
  friendTips: false,
};

export default function PreferencesScreen() {
  const [preferences, setPreferences] = useState(INITIAL_STATE);
  const [saved, setSaved] = useState(true);

  const toggle = (key: keyof PreferenceState) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    // No preferences mutation yet — persists locally until wired up.
    setSaved(true);
  };

  return (
    <View className="flex-1 bg-white">
      <TopNav />
      <SettingsHeader title="Preference" useSafeArea={false} />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <SettingsCheckbox
          label="Send me Trending This Week, the best new places to eat and drink in my city"
          checked={preferences.trendingDigest}
          onToggle={() => toggle('trendingDigest')}
        />
        <SettingsCheckbox
          label="Send me reminders to rate the places that I've been to."
          checked={preferences.rateReminders}
          onToggle={() => toggle('rateReminders')}
        />
        <SettingsCheckbox
          label="When a friend shares a place, tip, or list with me"
          checked={preferences.friendShares}
          onToggle={() => toggle('friendShares')}
        />
        <SettingsCheckbox
          label="Let my friends send me tips and places."
          checked={preferences.friendTips}
          onToggle={() => toggle('friendTips')}
        />

        <TouchableOpacity
          onPress={handleSave}
          disabled={saved}
          activeOpacity={0.85}
          className={`mt-6 items-center justify-center rounded-full py-4 ${saved ? 'bg-hairline' : 'bg-brand'}`}
        >
          <Text className={`font-roboto-bold text-base ${saved ? 'text-muted-light' : 'text-white'}`}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
