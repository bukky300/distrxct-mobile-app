import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@navigation/types';

type NavProp = NativeStackNavigationProp<AuthStackParamList>;

const T = {
  green: '#2D6A2D',
  greenDark: '#1A2E1A',
  gray: '#888888',
  white: '#FFFFFF',
};

interface Props {
  title: string;
  body: string;
}

export default function AuthNotice({ title, body }: Props) {
  const navigation = useNavigation<NavProp>();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={T.white} />
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <CheckCircle2 size={48} color={T.green} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>

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
