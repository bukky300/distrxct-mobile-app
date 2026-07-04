import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, CheckCircle2, XCircle } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '@navigation/types';
import { useAuth } from '@features/auth/hooks/useAuth';

type NavProp = NativeStackNavigationProp<AuthStackParamList>;
type RouteProps = RouteProp<AuthStackParamList, 'EmailVerification'>;

type Status = 'pending' | 'verifying' | 'success' | 'error';

const T = {
  green: '#2D6A2D',
  greenDark: '#1A2E1A',
  gray: '#888888',
  red: '#D32F2F',
  white: '#FFFFFF',
  black: '#000000',
};

export default function EmailVerificationScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { verifyEmail, verifyEmailLoading, resendVerificationEmail, resendVerificationEmailLoading } = useAuth();
  const email = route.params?.email ?? '';
  const token = route.params?.token;

  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'pending');
  const [message, setMessage] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  const [canResend, setCanResend] = useState(true);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendFailed, setResendFailed] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    try {
      const result = await resendVerificationEmail(email);
      setResendMessage(result.message);
      setResendFailed(!result.success);
      setCanResend(result.can_resend ?? true);
    } catch (e) {
      const err = e as { graphQLErrors?: { message?: string }[]; message?: string };
      setResendMessage(err?.graphQLErrors?.[0]?.message ?? err?.message ?? 'Could not resend the email. Please try again.');
      setResendFailed(true);
    }
  };

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        const result = await verifyEmail(token);
        if (cancelled) return;
        setMessage(result.message);
        setAttemptsRemaining(result.attempts_remaining ?? null);
        setStatus(result.success ? 'success' : 'error');
      } catch (e) {
        if (cancelled) return;
        const err = e as { graphQLErrors?: { message?: string }[]; message?: string };
        setMessage(err?.graphQLErrors?.[0]?.message ?? err?.message ?? 'Verification failed. Please try again.');
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (status === 'verifying') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={T.white} />
        <View style={styles.container}>
          <ActivityIndicator size="large" color={T.green} />
          <Text style={[styles.body, { marginTop: 20 }]}>Verifying your email…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'success') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={T.white} />
        <View style={styles.container}>
          <View style={styles.iconWrapper}>
            <CheckCircle2 size={48} color={T.green} />
          </View>
          <Text style={styles.title}>Email verified</Text>
          <Text style={styles.body}>{message ?? 'Your account is now verified.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={T.white} />
        <View style={styles.container}>
          <View style={[styles.iconWrapper, styles.iconWrapperError]}>
            <XCircle size={48} color={T.red} />
          </View>
          <Text style={styles.title}>Verification failed</Text>
          <Text style={styles.body}>{message ?? 'This link is invalid or has expired.'}</Text>
          {typeof attemptsRemaining === 'number' && (
            <Text style={[styles.body, { marginTop: 8 }]}>
              Attempts remaining: {attemptsRemaining}
            </Text>
          )}

          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryBtnText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={T.white} />
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <Mail size={48} color={T.green} />
        </View>

        <Text style={styles.title}>Check your email</Text>

        <Text style={styles.body}>We sent a verification link to</Text>
        {email ? <Text style={styles.email}>{email}</Text> : null}
        <Text style={styles.body}>
          Click the link in the email to verify your account, then come back to sign in.
        </Text>

        {email ? (
          <View style={styles.resendRow}>
            <Text style={styles.body}>Didn&apos;t get the email? </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleResend}
              disabled={resendVerificationEmailLoading || !canResend}
            >
              <Text
                style={[
                  styles.resendLink,
                  (resendVerificationEmailLoading || !canResend) && styles.resendLinkDisabled,
                ]}
              >
                {resendVerificationEmailLoading ? 'Sending…' : 'Resend'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {resendMessage ? (
          <Text style={[styles.body, resendFailed ? styles.resendError : styles.resendSuccess]}>
            {resendMessage}
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Login')}
          disabled={verifyEmailLoading}
        >
          <Text style={styles.primaryBtnText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.white },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  iconWrapperError: {
    backgroundColor: '#FDECEA',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: T.greenDark,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Roboto_500Medium',
  },
  body: {
    fontSize: 14,
    color: T.gray,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Roboto_400Regular',
  },
  email: {
    fontSize: 14,
    fontWeight: '600',
    color: T.black,
    marginVertical: 6,
    textAlign: 'center',
    fontFamily: 'Roboto_500Medium',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    color: T.green,
    fontFamily: 'Roboto_700Bold',
  },
  resendLinkDisabled: {
    color: T.gray,
  },
  resendSuccess: {
    color: T.green,
    marginTop: 12,
  },
  resendError: {
    color: T.red,
    marginTop: 12,
  },
  primaryBtn: {
    marginTop: 32,
    height: 52,
    backgroundColor: T.green,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: T.white,
    fontFamily: 'Roboto_500Medium',
  },
});
