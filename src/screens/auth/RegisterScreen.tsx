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
import { Eye, EyeOff, ChevronDown, Check } from 'lucide-react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@navigation/types';
import { useAuth } from '@features/auth/hooks/useAuth';
import PasswordRequirements from '@features/auth/components/PasswordRequirements';
import { isValidEmail, isValidPassword } from '@utils/validators';
import { useUIStore } from '@features/ui/store/uiStore';
import BottomSheet from '@components/ui/BottomSheet';

type NavProp = NativeStackNavigationProp<AuthStackParamList>;

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

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

function NigeriaFlag() {
  return (
    <View style={flag.container}>
      <View style={flag.green} />
      <View style={flag.white} />
      <View style={flag.green} />
    </View>
  );
}
const flag = StyleSheet.create({
  container: { width: 22, height: 16, flexDirection: 'row', borderRadius: 3, overflow: 'hidden' },
  green: { flex: 1, backgroundColor: '#008751' },
  white: { flex: 1, backgroundColor: '#FFFFFF' },
});

const LOGO_SIZE = 24;
const LOGO_FULL_H = LOGO_SIZE * (86 / 64);
const LOGO_CLIP_H = LOGO_FULL_H * (62 / 86);

export default function RegisterScreen() {
  const navigation = useNavigation<NavProp>();
  const { register, registerLoading } = useAuth();
  const openDevPreview = useUIStore(s => s.openDevPreview);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [genderPickerVisible, setGenderPickerVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = isValidEmail(email);
  const selectedGenderLabel = GENDER_OPTIONS.find(o => o.value === gender)?.label;
  const passwordValid = isValidPassword(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit =
    !!firstName && !!lastName && !!username && emailValid && !!gender && passwordValid && passwordsMatch && acceptedTerms;

  const handleRegister = async () => {
    if (!firstName || !lastName || !username || !email || !gender || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!emailValid) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!passwordValid) {
      setError('Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptedTerms) {
      setError('You must accept the terms and conditions.');
      return;
    }
    try {
      setError(null);
      await register({
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        gender,
        password,
        accepted_terms: true,
        phone_number: phone || null,
      });
      navigation.navigate('EmailVerification', { email });
    } catch (e) {
      const err = e as { graphQLErrors?: { message?: string }[]; message?: string };
      const message =
        err?.graphQLErrors?.[0]?.message ?? err?.message ?? 'Registration failed. Please try again.';
      setError(message);
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
          {/* Top nav */}
          <View style={styles.topBar}>
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
            <View style={styles.signInRow}>
              <Text style={styles.signInPrompt}>Already have an account? </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Heading */}
          <Text style={styles.title}>Sign Up for Distrxct</Text>
          <Text style={styles.subtitle}>Establish connection with excellent local business.</Text>

          {/* Social */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <AntDesign name="google" size={16} color="#EA4335" />
              <Text style={styles.socialBtnText}>Sign up with Gmail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <AntDesign name="apple1" size={16} color={T.black} />
              <Text style={styles.socialBtnText}>Sign up with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <View style={styles.nameRow}>
            <TextInput
              style={styles.nameInput}
              placeholder="First"
              placeholderTextColor={T.placeholder}
              autoCapitalize="words"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.nameInput}
              placeholder="Last"
              placeholderTextColor={T.placeholder}
              autoCapitalize="words"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Username */}
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            placeholderTextColor={T.placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            value={username}
            onChangeText={setUsername}
          />

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your email"
            placeholderTextColor={T.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          {email.length > 0 && !emailValid && (
            <Text style={styles.matchErrorText}>Please enter a valid email address.</Text>
          )}

          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity
            style={styles.selectInput}
            activeOpacity={0.7}
            onPress={() => setGenderPickerVisible(true)}
          >
            <Text style={gender ? styles.selectValueText : styles.selectPlaceholderText}>
              {selectedGenderLabel ?? 'Select gender'}
            </Text>
            <ChevronDown size={16} color={T.gray} />
          </TouchableOpacity>

          {/* Phone */}
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneRow}>
            <TouchableOpacity style={styles.countryBtn} activeOpacity={0.7}>
              <NigeriaFlag />
              <Text style={styles.countryCode}>+234</Text>
              <ChevronDown size={13} color={T.gray} />
            </TouchableOpacity>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone number (optional)"
              placeholderTextColor={T.placeholder}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>New Password</Text>
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
              {showPassword ? (
                <Eye size={20} color={T.gray} />
              ) : (
                <EyeOff size={20} color={T.gray} />
              )}
            </TouchableOpacity>
          </View>

          <PasswordRequirements password={password} />

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              placeholder="* * * * * * * * * *"
              placeholderTextColor={T.placeholder}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(v => !v)}
              style={styles.eyeBtn}
              activeOpacity={0.6}
            >
              {showConfirmPassword ? (
                <Eye size={20} color={T.gray} />
              ) : (
                <EyeOff size={20} color={T.gray} />
              )}
            </TouchableOpacity>
          </View>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <Text style={styles.matchErrorText}>Passwords do not match.</Text>
          )}

          {/* Terms */}
          <TouchableOpacity
            style={styles.termsRow}
            activeOpacity={0.7}
            onPress={() => setAcceptedTerms(v => !v)}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>

          {/* Error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Submit */}
          <TouchableOpacity
            style={[styles.primaryBtn, (registerLoading || !canSubmit) && styles.primaryBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleRegister}
            disabled={registerLoading || !canSubmit}
          >
            {registerLoading ? (
              <ActivityIndicator color={T.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Sign Up</Text>
            )}
          </TouchableOpacity>

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

      <BottomSheet visible={genderPickerVisible} onClose={() => setGenderPickerVisible(false)}>
        <Text style={styles.sheetTitle}>Select gender</Text>
        {GENDER_OPTIONS.map(option => (
          <TouchableOpacity
            key={option.value}
            style={styles.sheetRow}
            activeOpacity={0.7}
            onPress={() => {
              setGender(option.value);
              setGenderPickerVisible(false);
            }}
          >
            <Text style={styles.sheetRowText}>{option.label}</Text>
            {gender === option.value && <Check size={18} color={T.green} strokeWidth={2.5} />}
          </TouchableOpacity>
        ))}
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.white },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 24,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoClip: { width: LOGO_SIZE, height: LOGO_CLIP_H, overflow: 'hidden' },
  logoImg: { width: LOGO_SIZE, height: LOGO_FULL_H },
  logoText: {
    fontSize: 16,
    fontWeight: '600',
    color: T.green,
    marginLeft: 6,
    fontFamily: 'Roboto_500Medium',
  },
  signInRow: { flexDirection: 'row', alignItems: 'center' },
  signInPrompt: { fontSize: 12, color: T.gray, fontFamily: 'Roboto_400Regular' },
  signInLink: { fontSize: 12, fontWeight: '700', color: T.green, fontFamily: 'Roboto_700Bold' },

  title: {
    fontSize: 26,
    fontWeight: '400',
    color: T.greenDark,
    marginBottom: 6,
    fontFamily: 'Roboto_400Bold',
  },
  subtitle: { fontSize: 13, color: T.gray, marginBottom: 22, fontFamily: 'Roboto_400Regular' },

  socialRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 44,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: T.grayLight,
    backgroundColor: T.white,
  },
  socialBtnText: { fontSize: 12, color: '#333', fontFamily: 'Roboto_400Regular' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  dividerLine: { flex: 1, height: 1, backgroundColor: T.grayLight },
  dividerText: { marginHorizontal: 12, fontSize: 12, color: T.gray, fontFamily: 'Roboto_400Regular' },

  label: {
    fontSize: 14,
    fontWeight: '400',
    color: T.black,
    marginBottom: 8,
    fontFamily: 'Roboto_400Bold',
  },

  input: {
    height: 48,
    backgroundColor: T.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: T.black,
    marginBottom: 20,
    fontFamily: 'Roboto_400Regular',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    backgroundColor: T.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  selectValueText: { fontSize: 14, color: T.black, fontFamily: 'Roboto_400Regular' },
  selectPlaceholderText: { fontSize: 14, color: T.placeholder, fontFamily: 'Roboto_400Regular' },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.black,
    fontFamily: 'Roboto_700Bold',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: T.inputBg,
  },
  sheetRowText: { fontSize: 15, color: T.black, fontFamily: 'Roboto_400Regular' },
  nameRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  nameInput: {
    flex: 1,
    height: 48,
    backgroundColor: T.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: T.black,
    fontFamily: 'Roboto_400Regular',
  },

  phoneRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  countryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 48,
    backgroundColor: T.inputBg,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  countryCode: { fontSize: 13, color: T.black, fontFamily: 'Roboto_400Regular' },
  phoneInput: {
    flex: 1,
    height: 48,
    backgroundColor: T.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: T.black,
    fontFamily: 'Roboto_400Regular',
  },

  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: T.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  passwordInput: { flex: 1, fontSize: 14, color: T.black, fontFamily: 'Roboto_400Regular' },
  eyeBtn: { padding: 4 },
  matchErrorText: {
    fontSize: 12,
    color: T.red,
    marginTop: -12,
    marginBottom: 20,
    fontFamily: 'Roboto_400Regular',
  },

  termsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: T.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: T.green, borderColor: T.green },
  checkmark: { color: T.white, fontSize: 12, fontWeight: '700' },
  termsText: { fontSize: 13, color: T.gray, fontFamily: 'Roboto_400Regular', flex: 1 },
  termsLink: { color: T.green, fontWeight: '600', fontFamily: 'Roboto_500Medium' },

  errorText: {
    fontSize: 13,
    color: T.red,
    marginBottom: 16,
    fontFamily: 'Roboto_400Regular',
  },

  primaryBtn: {
    height: 52,
    backgroundColor: T.green,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: T.white, fontFamily: 'Roboto_500Medium' },

  // Dev
  devLinkRow: { alignItems: 'center', marginTop: 20 },
  devLinkText: { fontSize: 12, color: T.gray, fontFamily: 'Roboto_400Regular', textDecorationLine: 'underline' },
});
