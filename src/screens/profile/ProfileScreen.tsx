import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@navigation/types';
import Screen from '@components/layout/Screen';
import Button from '@components/ui/Button';
import { useAuthStore } from '@features/auth/store/authStore';
import { colors, spacing, typography, borderRadius } from '@config/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          {user.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>{user.username[0].toUpperCase()}</Text>
            </View>
          )}
          <Text style={styles.username}>@{user.username}</Text>
          {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
        </View>

        <Button
          label="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
          variant="secondary"
          style={styles.editBtn}
        />
        <Button label="Sign Out" onPress={logout} variant="ghost" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: spacing.md },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { ...typography.h2, color: '#fff' },
  username: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  bio: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  editBtn: { marginBottom: spacing.sm },
});
