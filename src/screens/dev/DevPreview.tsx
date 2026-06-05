import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, X } from 'lucide-react-native';

// ─── Import every screen here ────────────────────────────────────────────────
import SplashScreen from '../onboarding/SplashScreen';
import WelcomeScreen from '../onboarding/WelcomeScreen';
import LoginScreen from '../auth/LoginScreen';
import RegisterScreen from '../auth/RegisterScreen';
import ForgotPasswordScreen from '../auth/ForgotPasswordScreen';
import EmailVerificationScreen from '../auth/EmailVerificationScreen';
import ResetPasswordScreen from '../auth/ResetPasswordScreen';

// ─── Screen registry ─────────────────────────────────────────────────────────
const SCREENS: { label: string; group: string; component: React.ComponentType }[] = [
  { group: 'Onboarding', label: 'Splash',              component: SplashScreen },
  { group: 'Onboarding', label: 'Welcome',             component: WelcomeScreen },
  { group: 'Auth',       label: 'Login',               component: LoginScreen },
  { group: 'Auth',       label: 'Register / Sign Up',  component: RegisterScreen },
  { group: 'Auth',       label: 'Forgot Password',     component: ForgotPasswordScreen },
  { group: 'Auth',       label: 'Email Verification',  component: EmailVerificationScreen },
  { group: 'Auth',       label: 'Reset Password',      component: ResetPasswordScreen },
];

const GROUPS = [...new Set(SCREENS.map(s => s.group))];

const GROUP_COLORS: Record<string, string> = {
  Onboarding: '#2D6A2D',
  Auth:       '#1A6060',
};

export default function DevPreview() {
  const [active, setActive] = useState<React.ComponentType | null>(null);
  const [activeLabel, setActiveLabel] = useState('');

  if (active) {
    const Screen = active;
    return (
      <View style={{ flex: 1 }}>
        <Screen />
        {/* Floating back pill */}
        <TouchableOpacity
          style={styles.backPill}
          onPress={() => setActive(null)}
          activeOpacity={0.85}
        >
          <X size={14} color="#fff" />
          <Text style={styles.backPillText}>{activeLabel}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Screen Preview</Text>
        <Text style={styles.headerSub}>{SCREENS.length} screens</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {GROUPS.map(group => (
          <View key={group} style={styles.group}>
            <View style={[styles.groupBadge, { backgroundColor: GROUP_COLORS[group] ?? '#555' }]}>
              <Text style={styles.groupLabel}>{group}</Text>
            </View>

            {SCREENS.filter(s => s.group === group).map((screen, i) => (
              <TouchableOpacity
                key={i}
                style={styles.row}
                activeOpacity={0.7}
                onPress={() => { setActiveLabel(screen.label); setActive(() => screen.component); }}
              >
                <Text style={styles.rowLabel}>{screen.label}</Text>
                <ChevronRight size={18} color="#AAAAAA" />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#111', fontFamily: 'Roboto_700Bold' },
  headerSub: { fontSize: 13, color: '#888', marginTop: 2, fontFamily: 'Roboto_400Regular' },

  list: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, gap: 28 },

  group: { gap: 0 },
  groupBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  groupLabel: { fontSize: 12, fontWeight: '600', color: '#fff', fontFamily: 'Roboto_500Medium', letterSpacing: 0.5 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    marginBottom: 8,
  },
  rowLabel: { fontSize: 15, color: '#1A1A1A', fontWeight: '500', fontFamily: 'Roboto_500Medium' },

  // Floating back button
  backPill: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 99,
  },
  backPillText: { fontSize: 13, color: '#fff', fontWeight: '500', fontFamily: 'Roboto_500Medium' },
});
