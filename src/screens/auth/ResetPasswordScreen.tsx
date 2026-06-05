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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';

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
  strengthFilled: '#4CAF50',
  strengthEmpty: '#E0E0E0',
};

type StrengthItem = {
  symbol: string;
  label: string;
  met: boolean;
  color: string;
};

const STRENGTH_ITEMS: StrengthItem[] = [
  { symbol: '8+', label: 'Characters', met: true, color: T.green },
  { symbol: 'AA', label: 'Uppercase', met: true, color: T.green },
  { symbol: 'aa', label: 'Lowercase', met: false, color: T.red },
  { symbol: '123', label: 'Numbers', met: false, color: T.gray },
  { symbol: '$#^', label: 'Symbol', met: false, color: T.gray },
];

export default function ResetPasswordScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}>
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
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn} activeOpacity={0.6}>
              {showPassword ? <Eye size={20} color={T.gray} /> : <EyeOff size={20} color={T.gray} />}
            </TouchableOpacity>
          </View>

          {/* Strength bar */}
          <View style={styles.strengthBar}>
            {[0, 1, 2, 3, 4].map(i => (
              <View
                key={i}
                style={[
                  styles.strengthSegment,
                  { backgroundColor: i < 2 ? T.strengthFilled : i === 2 ? '#81C784' : T.strengthEmpty },
                ]}
              />
            ))}
          </View>

          {/* Confirm Password */}
          <Text style={[styles.label, { marginTop: 20 }]}>Confirm Password</Text>
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              placeholder="* * * * * *"
              placeholderTextColor={T.placeholder}
              secureTextEntry={!showConfirm}
            />
            <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeBtn} activeOpacity={0.6}>
              {showConfirm ? <Eye size={20} color={T.gray} /> : <EyeOff size={20} color={T.gray} />}
            </TouchableOpacity>
          </View>

          {/* Strength requirements */}
          <Text style={styles.requirementsTitle}>Password strength requirement</Text>
          <View style={styles.requirementsRow}>
            {STRENGTH_ITEMS.map((item, i) => (
              <View key={i} style={styles.requirementItem}>
                <Text style={[styles.requirementSymbol, { color: item.color }]}>{item.symbol}</Text>
                <Text style={styles.requirementLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Send button */}
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Send</Text>
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

  // Strength bar
  strengthBar: { flexDirection: 'row', gap: 4, height: 4, marginBottom: 4 },
  strengthSegment: { flex: 1, borderRadius: 2 },

  // Requirements
  requirementsTitle: { fontSize: 13, color: T.gray, textAlign: 'center', marginBottom: 16, marginTop: 8, fontFamily: 'Roboto_400Regular' },
  requirementsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  requirementItem: { alignItems: 'center', gap: 4 },
  requirementSymbol: { fontSize: 14, fontWeight: '700', fontFamily: 'Roboto_700Bold' },
  requirementLabel: { fontSize: 11, color: T.gray, fontFamily: 'Roboto_400Regular' },

  primaryBtn: { height: 52, backgroundColor: T.green, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: T.white, fontFamily: 'Roboto_500Medium' },
});
