import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@navigation/types';
import Screen from '@components/layout/Screen';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { useAuthStore } from '@features/auth/store/authStore';
import { spacing } from '@config/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const { user } = useAuthStore();
  const [username, setUsername] = useState(user?.username ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');

  const handleSave = () => {
    // TODO: call updateProfile mutation, then call setUser
    navigation.goBack();
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Input label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <Input label="Bio" value={bio} onChangeText={setBio} multiline numberOfLines={3} placeholder="Tell others about yourself..." />
        <Button label="Save Changes" onPress={handleSave} />
        <Button label="Cancel" onPress={() => navigation.goBack()} variant="ghost" />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
});
