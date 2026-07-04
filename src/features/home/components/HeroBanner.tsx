import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';

interface Props {
  title?: string;
  onDiscover?: () => void;
}

export default function HeroBanner({
  title = 'Best Places Around Lagos',
  onDiscover,
}: Props) {
  return (
    <ImageBackground
      source={require('../../../../assets/images/Best Place Around Lagos.png')}
      style={styles.banner}
      imageStyle={styles.bannerImage}
      resizeMode="cover"
    >
      {/* Dark gradient overlay */}
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.eyebrow}>Explore</Text>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          style={styles.discoverBtn}
          onPress={onDiscover}
          activeOpacity={0.85}
        >
          <Text style={styles.discoverText}>Discover</Text>
          <ArrowRight size={15} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    borderRadius: 14,
    height: 172,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    borderRadius: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 14,
  },
  content: {
    alignItems: 'center',
    gap: 6,
  },
  eyebrow: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '400',
    fontFamily: 'Roboto_400Regular',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  discoverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2A5C40',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 24,
    marginTop: 4,
  },
  discoverText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#FFFFFF',
  },
});
