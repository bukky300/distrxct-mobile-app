import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { X, Crosshair } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
  recentLocations?: string[];
}

export default function DetectLocationSheet({
  visible,
  onClose,
  onSelectLocation,
  recentLocations = [],
}: Props) {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(visible);
  const scale = useSharedValue(0.92);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      opacity.value = withTiming(1, { duration: 180 });
      scale.value = withSpring(1, { damping: 18, stiffness: 260 });
    } else {
      opacity.value = withTiming(0, { duration: 160 }, finished => {
        if (finished) runOnJS(setMounted)(false);
      });
      scale.value = withTiming(0.92, { duration: 160 });
    }
  }, [visible]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!mounted) return null;

  function handleDetectCurrent() {
    // Mocked — wire to expo-location when GPS support is added
    onSelectLocation('Current location');
    setQuery('');
    onClose();
  }

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      <View style={styles.centerWrap} pointerEvents="box-none">
        <Animated.View style={[styles.card, cardStyle]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <X size={16} color="#1A1A1A" strokeWidth={2} />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Search Location ..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />

          <Text style={styles.sectionTitle}>Detect Current Location</Text>

          <TouchableOpacity
            style={styles.currentLocationRow}
            onPress={handleDetectCurrent}
            activeOpacity={0.7}
          >
            <Crosshair size={16} color="#2A5C40" strokeWidth={2} />
            <Text style={styles.currentLocationText}>Current location</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Recent Locations</Text>

          {recentLocations.length === 0 ? (
            <Text style={styles.emptyText}>No recent locations</Text>
          ) : (
            recentLocations.map(loc => (
              <TouchableOpacity
                key={loc}
                style={styles.recentRow}
                onPress={() => { onSelectLocation(loc); onClose(); }}
                activeOpacity={0.7}
              >
                <Text style={styles.recentText}>{loc}</Text>
              </TouchableOpacity>
            ))
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(0,0,0,0.45)' },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
    marginTop: 28,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Roboto_400Bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  currentLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 14,
  },
  currentLocationText: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: '#2A5C40',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 13,
    color: '#D1D5DB',
    fontFamily: 'Roboto_400Regular',
  },
  recentRow: {
    paddingVertical: 8,
  },
  recentText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: 'Roboto_400Regular',
  },
});
