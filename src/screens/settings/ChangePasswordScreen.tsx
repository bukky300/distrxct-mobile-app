import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import TopNav from '@components/layout/TopNav';
import SettingsHeader from '@features/settings/components/SettingsHeader';
import PasswordRequirements from '@features/auth/components/PasswordRequirements';
import { useAuth } from '@features/auth/hooks/useAuth';
import { isValidPassword } from '@utils/validators';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const { changePassword, changePasswordLoading } = useAuth();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const newPasswordValid = isValidPassword(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const canSubmit = !!oldPassword && newPasswordValid && passwordsMatch;

  const handleSubmit = async () => {
    if (!oldPassword) {
      setError('Please enter your current password.');
      return;
    }
    if (!newPasswordValid) {
      setError('New password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.');
      return;
    }
    if (!passwordsMatch) {
      setError('New passwords do not match.');
      return;
    }
    try {
      setError(null);
      setSuccess(false);
      const ok = await changePassword(oldPassword, newPassword);
      if (ok) {
        setSuccess(true);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => navigation.goBack(), 900);
      } else {
        setError('Could not change your password. Please check your current password and try again.');
      }
    } catch (e) {
      const err = e as { graphQLErrors?: { message?: string }[]; message?: string };
      setError(err?.graphQLErrors?.[0]?.message ?? err?.message ?? 'Could not change your password. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <TopNav />
      <SettingsHeader title="Password" useSafeArea={false} />

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          className="flex-1 px-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 48 }}
        >
          {/* Old password */}
          <Text className="mb-2 font-roboto-bold text-base text-[#1A1A1A]">Enter old password</Text>
          <View className="mb-6 flex-row items-center rounded-2xl border border-hairline bg-surface px-4 py-3.5">
            <TextInput
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!showOld}
              placeholder="* * * * * *"
              placeholderTextColor="#9CA3AF"
              className="flex-1 font-roboto text-base text-[#1A1A1A]"
            />
            <TouchableOpacity onPress={() => setShowOld(v => !v)} hitSlop={8} activeOpacity={0.7}>
              {showOld ? (
                <Eye size={20} color="#6B7280" strokeWidth={2} />
              ) : (
                <EyeOff size={20} color="#1A1A1A" strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>

          {/* New password */}
          <Text className="mb-2 font-roboto-bold text-base text-[#1A1A1A]">Enter new Password</Text>
          <View className="mb-2 flex-row items-center rounded-2xl border border-hairline bg-surface px-4 py-3.5">
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
              placeholder="* * * * * *"
              placeholderTextColor="#9CA3AF"
              className="flex-1 font-roboto text-base text-[#1A1A1A]"
            />
            <TouchableOpacity onPress={() => setShowNew(v => !v)} hitSlop={8} activeOpacity={0.7}>
              {showNew ? (
                <Eye size={20} color="#6B7280" strokeWidth={2} />
              ) : (
                <EyeOff size={20} color="#1A1A1A" strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>

          {/* Confirm new password */}
          <Text className="mb-2 mt-4 font-roboto-bold text-base text-[#1A1A1A]">Confirm new Password</Text>
          <View className="mb-2 flex-row items-center rounded-2xl border border-hairline bg-surface px-4 py-3.5">
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              placeholder="* * * * * *"
              placeholderTextColor="#9CA3AF"
              className="flex-1 font-roboto text-base text-[#1A1A1A]"
            />
            <TouchableOpacity onPress={() => setShowConfirm(v => !v)} hitSlop={8} activeOpacity={0.7}>
              {showConfirm ? (
                <Eye size={20} color="#6B7280" strokeWidth={2} />
              ) : (
                <EyeOff size={20} color="#1A1A1A" strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <Text className="mb-2 font-roboto text-xs text-danger">Passwords do not match.</Text>
          )}

          <PasswordRequirements password={newPassword} />

          {error ? <Text className="mb-4 text-center font-roboto text-sm text-danger">{error}</Text> : null}
          {success ? (
            <Text className="mb-4 text-center font-roboto text-sm text-brand">Password changed successfully.</Text>
          ) : null}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit || changePasswordLoading}
            activeOpacity={0.85}
            className={`items-center justify-center rounded-full py-4 ${
              !canSubmit || changePasswordLoading ? 'bg-brand/40' : 'bg-brand'
            }`}
          >
            {changePasswordLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="font-roboto-bold text-base text-white">Change Password</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
