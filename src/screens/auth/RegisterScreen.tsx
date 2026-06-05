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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, ChevronDown } from 'lucide-react-native';
import { AntDesign } from '@expo/vector-icons';

const T = {
  green: '#2D6A2D',
  greenDark: '#1A2E1A',
  gray: '#888888',
  grayLight: '#DDDDDD',
  placeholder: '#AAAAAA',
  inputBg: '#F5F5F5',
  white: '#FFFFFF',
  black: '#000000',
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
  const [showPassword, setShowPassword] = useState(false);

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
              <TouchableOpacity activeOpacity={0.7}>
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
            <TextInput style={styles.nameInput} placeholder="First" placeholderTextColor={T.placeholder} autoCapitalize="words" />
            <TextInput style={styles.nameInput} placeholder="Last" placeholderTextColor={T.placeholder} autoCapitalize="words" />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your mail"
            placeholderTextColor={T.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
          />

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
              placeholder="Phone number"
              placeholderTextColor={T.placeholder}
              keyboardType="phone-pad"
            />
          </View>

          {/* Zip code */}
          <View style={styles.zipLabelRow}>
            <Text style={styles.label}>Zip code </Text>
            <Text style={styles.optional}>(optional)</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Type your state zip code"
            placeholderTextColor={T.placeholder}
            keyboardType="numeric"
          />

          {/* Password */}
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              placeholder="* * * * * * * * * *"
              placeholderTextColor={T.placeholder}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn} activeOpacity={0.6}>
              {showPassword ? <Eye size={20} color={T.gray} /> : <EyeOff size={20} color={T.gray} />}
            </TouchableOpacity>
          </View>

          {/* Submit */}
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Sign Up</Text>
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

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 24 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoClip: { width: LOGO_SIZE, height: LOGO_CLIP_H, overflow: 'hidden' },
  logoImg: { width: LOGO_SIZE, height: LOGO_FULL_H },
  logoText: { fontSize: 16, fontWeight: '600', color: T.green, marginLeft: 6, fontFamily: 'Roboto_500Medium' },
  signInRow: { flexDirection: 'row', alignItems: 'center' },
  signInPrompt: { fontSize: 12, color: T.gray, fontFamily: 'Roboto_400Regular' },
  signInLink: { fontSize: 12, fontWeight: '700', color: T.green, fontFamily: 'Roboto_700Bold' },

  title: { fontSize: 26, fontWeight: '400', color: T.greenDark, marginBottom: 6, fontFamily: 'Roboto_400Bold' },
  subtitle: { fontSize: 13, color: T.gray, marginBottom: 22, fontFamily: 'Roboto_400Regular' },

  socialRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  socialBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, height: 44, borderRadius: 28, borderWidth: 1, borderColor: T.grayLight, backgroundColor: T.white,
  },
  socialBtnText: { fontSize: 12, color: '#333', fontFamily: 'Roboto_400Regular' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  dividerLine: { flex: 1, height: 1, backgroundColor: T.grayLight },
  dividerText: { marginHorizontal: 12, fontSize: 12, color: T.gray, fontFamily: 'Roboto_400Regular' },

  label: { fontSize: 14, fontWeight: '400', color: T.black, marginBottom: 8, fontFamily: 'Roboto_400Bold' },
  zipLabelRow: { flexDirection: 'row', alignItems: 'baseline' },
  optional: { fontSize: 13, color: T.gray, marginBottom: 8, fontFamily: 'Roboto_400Regular' },

  input: {
    height: 48, backgroundColor: T.inputBg, borderRadius: 12,
    paddingHorizontal: 16, fontSize: 14, color: T.black, marginBottom: 20, fontFamily: 'Roboto_400Regular',
  },
  nameRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  nameInput: {
    flex: 1, height: 48, backgroundColor: T.inputBg, borderRadius: 12,
    paddingHorizontal: 16, fontSize: 14, color: T.black, fontFamily: 'Roboto_400Regular',
  },

  phoneRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  countryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    height: 48, backgroundColor: T.inputBg, borderRadius: 12, paddingHorizontal: 12,
  },
  countryCode: { fontSize: 13, color: T.black, fontFamily: 'Roboto_400Regular' },
  phoneInput: {
    flex: 1, height: 48, backgroundColor: T.inputBg, borderRadius: 12,
    paddingHorizontal: 16, fontSize: 14, color: T.black, fontFamily: 'Roboto_400Regular',
  },

  passwordBox: {
    flexDirection: 'row', alignItems: 'center', height: 48, backgroundColor: T.inputBg,
    borderRadius: 12, paddingHorizontal: 16, marginBottom: 28,
  },
  passwordInput: { flex: 1, fontSize: 14, color: T.black, fontFamily: 'Roboto_400Regular' },
  eyeBtn: { padding: 4 },

  primaryBtn: { height: 52, backgroundColor: T.green, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: T.white, fontFamily: 'Roboto_500Medium' },
});
