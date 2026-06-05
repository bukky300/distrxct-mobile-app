import React from 'react';
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

const LOGO_SIZE = 28;
const LOGO_FULL_H = LOGO_SIZE * (86 / 64);
const LOGO_CLIP_H = LOGO_FULL_H * (62 / 86);

export default function ForgotPasswordScreen() {
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
          {/* Logo centered */}
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

          {/* Heading */}
          <Text style={styles.title}>Forget password</Text>
          <Text style={styles.subtitle}>We&apos;ll send a link to your email</Text>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your email"
            placeholderTextColor={T.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Send button */}
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Send</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Remember password? </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.white },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },

  logoRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 32, marginBottom: 40 },
  logoClip: { width: LOGO_SIZE, height: LOGO_CLIP_H, overflow: 'hidden' },
  logoImg: { width: LOGO_SIZE, height: LOGO_FULL_H },
  logoText: { fontSize: 18, fontWeight: '600', color: T.green, marginLeft: 6, fontFamily: 'Roboto_500Medium' },

  title: { fontSize: 28, fontWeight: '400', color: T.greenDark, marginBottom: 6, fontFamily: 'Roboto_400Bold' },
  subtitle: { fontSize: 14, color: T.gray, marginBottom: 32, fontFamily: 'Roboto_400Regular' },

  label: { fontSize: 14, fontWeight: '400', color: T.black, marginBottom: 8, fontFamily: 'Roboto_400Bold' },
  input: {
    height: 52, backgroundColor: T.inputBg, borderRadius: 28,
    paddingHorizontal: 20, fontSize: 15, color: T.black, marginBottom: 16, fontFamily: 'Roboto_400Regular',
  },

  primaryBtn: { height: 52, backgroundColor: T.green, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: T.white, fontFamily: 'Roboto_500Medium' },

  footerRow: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontSize: 14, color: T.gray, fontFamily: 'Roboto_400Regular' },
  footerLink: { fontSize: 14, fontWeight: '700', color: T.green, fontFamily: 'Roboto_700Bold' },
});
