import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Mail } from 'lucide-react-native';

const T = {
  green: '#2D6A2D',
  greenDark: '#1A2E1A',
  gray: '#888888',
  grayLight: '#DDDDDD',
  inputBg: '#F0F0F0',
  white: '#FFFFFF',
  black: '#000000',
  yellow: '#F5C518',
  disabledBg: '#E0E0E0',
  disabledText: '#AAAAAA',
};

const OTP_LENGTH = 6;

export default function EmailVerificationScreen() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);
    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const isComplete = otp.every(d => d !== '');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={T.white} />

      {/* Back */}
      <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}>
        <ChevronLeft size={20} color={T.black} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Email icon */}
        <View style={styles.iconBox}>
          <View style={styles.envelopeOuter}>
            <Mail size={28} color={T.green} />
            <View style={styles.yellowDot} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Verify Email address</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          To verify your email, we have sent a One{'\n'}
          Time Password (OTP) to{' '}
          <Text style={styles.emailBold}>eduo@gmail.com</Text>
        </Text>

        {/* OTP */}
        <Text style={styles.otpLabel}>OTP Code</Text>
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={el => { inputs.current[i] = el; }}
              style={[styles.otpCell, digit ? styles.otpCellFilled : null]}
              value={digit}
              onChangeText={t => handleChange(t, i)}
              onKeyPress={e => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectionColor={T.green}
            />
          ))}
        </View>

        {/* Send button */}
        <TouchableOpacity
          style={[styles.primaryBtn, !isComplete && styles.primaryBtnDisabled]}
          activeOpacity={isComplete ? 0.85 : 1}
          disabled={!isComplete}
        >
          <Text style={[styles.primaryBtnText, !isComplete && styles.primaryBtnTextDisabled]}>
            Send
          </Text>
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn&apos;t get code? </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.white },

  backBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  backText: { fontSize: 16, fontWeight: '600', color: T.black, marginLeft: 4, fontFamily: 'Roboto_700Bold' },

  content: { paddingHorizontal: 20, alignItems: 'center', paddingTop: 40 },

  // Icon
  iconBox: { marginBottom: 28 },
  envelopeOuter: {
    width: 72,
    height: 72,
    backgroundColor: T.inputBg,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yellowDot: {
    position: 'absolute',
    top: 12,
    right: 14,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: T.yellow,
  },

  // Title
  title: { fontSize: 28, fontWeight: '400', color: T.greenDark, textAlign: 'center', marginBottom: 12, fontFamily: 'Roboto_400Bold' },

  // Subtitle
  subtitle: { fontSize: 14, color: T.gray, textAlign: 'center', lineHeight: 22, marginBottom: 32, fontFamily: 'Roboto_400Regular' },
  emailBold: { fontWeight: '700', color: T.black, fontFamily: 'Roboto_700Bold' },

  // OTP
  otpLabel: { fontSize: 14, fontWeight: '400', color: T.black, alignSelf: 'flex-start', marginBottom: 12, fontFamily: 'Roboto_400Bold' },
  otpRow: { flexDirection: 'row', gap: 8, marginBottom: 28 },
  otpCell: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.grayLight,
    backgroundColor: T.white,
    fontSize: 20,
    fontWeight: '600',
    color: T.black,
    textAlign: 'center',
    fontFamily: 'Roboto_700Bold',
  },
  otpCellFilled: {
    borderWidth: 2,
    borderColor: T.green,
    color: T.green,
  },

  // Button
  primaryBtn: {
    width: '100%',
    height: 52,
    backgroundColor: T.green,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  primaryBtnDisabled: { backgroundColor: T.disabledBg },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: T.white, fontFamily: 'Roboto_500Medium' },
  primaryBtnTextDisabled: { color: T.disabledText },

  // Resend
  resendRow: { flexDirection: 'row', alignItems: 'center' },
  resendText: { fontSize: 14, color: T.gray, fontFamily: 'Roboto_400Regular' },
  resendLink: { fontSize: 14, fontWeight: '700', color: T.green, fontFamily: 'Roboto_700Bold' },
});
