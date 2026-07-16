import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@navigation/types';

const { width } = Dimensions.get('window');

type NavProp = NativeStackNavigationProp<AuthStackParamList>;

export default function WelcomeScreen() {
  const navigation = useNavigation<NavProp>();

  return (
    <SafeAreaView style={styles.container}>
      {/* Title row — text left, shapes top-right */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/images/group.png')}
          style={styles.shapes}
          resizeMode="contain"
        />
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Welcome to{'\n'}Distrxct</Text>
        </View>
      </View>

      {/* Illustration */}
      <View style={styles.illustrationWrapper}>
        <Image
          source={require('../../../assets/images/beam.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* CTA button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Get started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2EDE6',
  },
  header: {
    position: 'relative',
    paddingTop: 56,
  },
  shapes: {
    position: 'absolute',
    top: -24,
    right: -24,
    width: width * 0.56,
    height: width * 0.56,
    zIndex: 0,
  },
  titleWrapper: {
    paddingHorizontal: 28,
    zIndex: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: '400',
    color: '#1C3D2E',
    lineHeight: 52,
    fontFamily: 'Roboto_700Black',
    letterSpacing: 1.5,
  },
  illustrationWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: width * 0.82,
    height: width * 0.82,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  button: {
    backgroundColor: '#2A5C40',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Roboto_500Medium',
    letterSpacing: 0.2,
  },
});
