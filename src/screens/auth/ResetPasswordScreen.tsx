import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '@navigation/types';
import PasswordRequirements from '@features/auth/components/PasswordRequirements';
import { isValidPassword } from '@utils/validators';
import { useAuth } from '@features/auth/hooks/useAuth';

type NavProp = NativeStackNavigationProp<AuthStackParamList>;
type RouteProps = RouteProp<AuthStackParamList, 'ResetPassword'>;

const T = {
  green: '#2D6A2D',
  greenDark: '#1A2E1A',
  gray: '#888888',
  grayLight: '#DDDDDD',
  placeholder: '#AAAAAA',
  inputBg: '#F5F5F5',
  white: '#FFFFFF',
  black: '#000000',
  red: '#E53935',
};

export default function ResetPasswordScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const token = route.params?.token;
  const { resetPassword, resetPasswordLoading } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordValid = isValidPassword(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = passwordValid && passwordsMatch && !!token;

  const handleSubmit = async () => {
    if (!token) {
      setError('This reset link is invalid or has expired. Please request a new one.');
      return;
    }
    try {
      setError(null);
      const result = await resetPassword(token, password);
      if (result.success) {
        navigation.navigate('Login');
      } else {
        setError(result.message);
      }
    } catch (e) {
      const err = e as { graphQLErrors?: { message?: string }[]; message?: string };
      setError(err?.graphQLErrors?.[0]?.message ?? err?.message ?? 'Could not reset your password. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={T.white} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Login')}
          >
            <ChevronLeft size={20} color={T.black} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          {/* Heading */}
          <Text style={styles.title}>Your new password</Text>
          <Text style={styles.subtitle}>Please enter your new password</Text>

          {/* Enter Password */}
          <Text style={styles.label}>Enter Password</Text>
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              placeholder="* * * * * *"
              placeholderTextColor={T.placeholder}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn} activeOpacity={0.6}>
              {showPassword ? <Eye size={20} color={T.gray} /> : <EyeOff size={20} color={T.gray} />}
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={[styles.label, { marginTop: 20 }]}>Confirm Password</Text>
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              placeholder="* * * * * *"
              placeholderTextColor={T.placeholder}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeBtn} activeOpacity={0.6}>
              {showConfirm ? <Eye size={20} color={T.gray} /> : <EyeOff size={20} color={T.gray} />}
            </TouchableOpacity>
          </View>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <Text style={styles.matchErrorText}>Passwords do not match.</Text>
          )}

          <PasswordRequirements password={password} />

          {/* Error */}
          {error ? <Text style={styles.matchErrorText}>{error}</Text> : null}

          {/* Send button */}
          <TouchableOpacity
            style={[styles.primaryBtn, (!canSubmit || resetPasswordLoading) && styles.primaryBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={!canSubmit || resetPasswordLoading}
          >
            {resetPasswordLoading ? (
              <ActivityIndicator color={T.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Send</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.white },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },

  backBtn: { flexDirection: 'row', alignItems: 'center', paddingTop: 12, marginBottom: 24 },
  backText: { fontSize: 16, fontWeight: '600', color: T.black, marginLeft: 4, fontFamily: 'Roboto_700Bold' },

  title: { fontSize: 28, fontWeight: '400', color: T.greenDark, marginBottom: 6, fontFamily: 'Roboto_400Bold' },
  subtitle: { fontSize: 14, color: T.gray, marginBottom: 28, fontFamily: 'Roboto_400Regular' },

  label: { fontSize: 14, fontWeight: '400', color: T.black, marginBottom: 8, fontFamily: 'Roboto_400Bold' },

  passwordBox: {
    flexDirection: 'row', alignItems: 'center', height: 52,
    backgroundColor: T.inputBg, borderRadius: 28, paddingHorizontal: 20, marginBottom: 10,
  },
  passwordInput: { flex: 1, fontSize: 15, color: T.black, fontFamily: 'Roboto_400Regular' },
  eyeBtn: { padding: 4 },

  matchErrorText: { fontSize: 12, color: T.red, marginBottom: 12, fontFamily: 'Roboto_400Regular' },

  primaryBtn: { height: 52, backgroundColor: T.green, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: T.white, fontFamily: 'Roboto_500Medium' },
});
