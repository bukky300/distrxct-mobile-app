import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
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
import { Eye, EyeOff } from 'lucide-react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@navigation/types';
import { useAuth } from '@features/auth/hooks/useAuth';
import { isValidEmail } from '@utils/validators';
import { useUIStore } from '@features/ui/store/uiStore';

type NavProp = NativeStackNavigationProp<AuthStackParamList>;

const T = {
  green: '#2D6A2D',
  greenDark: '#1A2E1A',
  gray: '#888888',
  grayLight: '#DDDDDD',
  placeholder: '#AAAAAA',
  inputBg: '#F5F5F5',
  white: '#FFFFFF',
  black: '#000000',
  red: '#D32F2F',
};

export default function LoginScreen() {
  const navigation = useNavigation<NavProp>();
  const { login, loginLoading } = useAuth();
  const openDevPreview = useUIStore(s => s.openDevPreview);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = isValidEmail(email);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (!emailValid) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      setError(null);
      await login(email, password);
    } catch (e) {
      const err = e as { graphQLErrors?: { message?: string }[]; message?: string };
      setError(err?.graphQLErrors?.[0]?.message ?? err?.message ?? 'Login failed. Please try again.');
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
          {/* Logo */}
          <View style={styles.logoRow}>
            <View style={styles.logoClip}>
              <Image
                source={require('../../../assets/images/logo.png')}
                style={styles.logoImg}
                resizeMode="stretch"
              />
            </View>
            <Text style={styles.logoText}>Distrxct</Text>
          </View>

          {/* Error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Heading */}
          <Text style={styles.title}>Log in to your account</Text>
          <Text style={styles.subtitle}>Welcome back ✨</Text>

          {/* Social buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <AntDesign name="google" size={17} color="#EA4335" />
              <Text style={styles.socialBtnText}>Sign in with Gmail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <AntDesign name="apple1" size={17} color={T.black} />
              <Text style={styles.socialBtnText}>Sign in with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your email"
            placeholderTextColor={T.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
          {email.length > 0 && !emailValid && (
            <Text style={styles.fieldErrorText}>Please enter a valid email address.</Text>
          )}

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              placeholder="* * * * * * * * * *"
              placeholderTextColor={T.placeholder}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(v => !v)}
              style={styles.eyeBtn}
              activeOpacity={0.6}
            >
              {showPassword
                ? <Eye size={20} color={T.gray} />
                : <EyeOff size={20} color={T.gray} />}
            </TouchableOpacity>
          </View>

          {/* Forgot */}
          <TouchableOpacity
            style={styles.forgotRow}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          

          {/* Sign in */}
          <TouchableOpacity
            style={[styles.primaryBtn, (loginLoading || !emailValid) && styles.primaryBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={loginLoading || !emailValid}
          >
            {loginLoading ? (
              <ActivityIndicator color={T.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Sign in</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>New to distrxct? </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Dev-only shortcut to the component/screen preview */}
          <TouchableOpacity
            style={styles.devLinkRow}
            activeOpacity={0.7}
            onPress={openDevPreview}
          >
            <Text style={styles.devLinkText}>Dev Preview</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Logo clip constants (64×86 image, icon occupies top 62px)
const LOGO_SIZE = 28;
const LOGO_FULL_H = LOGO_SIZE * (86 / 64);
const LOGO_CLIP_H = LOGO_FULL_H * (62 / 86);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.white },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },

  // Logo
  logoRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 32, marginBottom: 32 },
  logoClip: { width: LOGO_SIZE, height: LOGO_CLIP_H, overflow: 'hidden' },
  logoImg: { width: LOGO_SIZE, height: LOGO_FULL_H },
  logoText: { fontSize: 18, fontWeight: '600', color: T.green, marginLeft: 6, fontFamily: 'Roboto_500Medium' },

  // Heading
  title: { fontSize: 28, fontWeight: '400', color: T.greenDark, marginBottom: 6, fontFamily: 'Roboto_400Bold' },
  subtitle: { fontSize: 14, color: T.gray, marginBottom: 28, fontFamily: 'Roboto_400Regular' },

  // Social
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: T.grayLight,
    backgroundColor: T.white,
  },
  socialBtnText: { fontSize: 12, color: '#333', fontFamily: 'Roboto_400Regular' },

  // Divider
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  dividerLine: { flex: 1, height: 1, backgroundColor: T.grayLight },
  dividerText: { marginHorizontal: 12, fontSize: 12, color: T.gray, fontFamily: 'Roboto_400Regular' },

  // Label
  label: { fontSize: 14, fontWeight: '400', color: T.black, marginBottom: 8, fontFamily: 'Roboto_400Bold' },

  // Input
  input: {
    height: 52,
    backgroundColor: T.inputBg,
    borderRadius: 28,
    paddingHorizontal: 20,
    fontSize: 15,
    color: T.black,
    marginBottom: 20,
    fontFamily: 'Roboto_400Regular',
  },

  // Password
  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: T.inputBg,
    borderRadius: 28,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  passwordInput: { flex: 1, fontSize: 15, color: T.black, fontFamily: 'Roboto_400Regular' },
  eyeBtn: { padding: 4 },

  // Forgot
  forgotRow: { alignItems: 'flex-end', marginBottom: 28 },
  forgotText: { fontSize: 13, color: T.green, fontFamily: 'Roboto_500Medium' },

  errorText: {
    fontSize: 13,
    color: T.red,
    marginBottom: 16,
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
  },
  fieldErrorText: {
    fontSize: 12,
    color: T.red,
    marginTop: -12,
    marginBottom: 20,
    fontFamily: 'Roboto_400Regular',
  },

  // Primary button
  primaryBtn: {
    height: 52,
    backgroundColor: T.green,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: T.white, fontFamily: 'Roboto_500Medium' },

  // Footer
  footerRow: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontSize: 14, color: T.gray, fontFamily: 'Roboto_400Regular' },
  footerLink: { fontSize: 14, fontWeight: '700', color: T.green, fontFamily: 'Roboto_700Bold' },

  // Dev
  devLinkRow: { alignItems: 'center', marginTop: 24 },
  devLinkText: { fontSize: 12, color: T.gray, fontFamily: 'Roboto_400Regular', textDecorationLine: 'underline' },
});
