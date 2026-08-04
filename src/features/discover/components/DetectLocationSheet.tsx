import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { X, Crosshair } from 'lucide-react-native';
import * as Location from 'expo-location';
import {
  searchPlacePredictions,
  getPlaceDetails,
  reverseGeocode,
  type PlacePrediction,
  type ResolvedLocation,
} from '@features/locations/services/googlePlaces';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (result: ResolvedLocation) => void;
}

const DEBOUNCE_MS = 400;

export default function DetectLocationSheet({ visible, onClose, onSelectLocation }: Props) {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [recentLocations, setRecentLocations] = useState<ResolvedLocation[]>([]);
  const [searching, setSearching] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  }, [visible, opacity, scale]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  function handleQueryChange(text: string) {
    setQuery(text);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text.trim()) {
      setPredictions([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchPlacePredictions(text.trim());
        setPredictions(results);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Search failed');
        setPredictions([]);
      } finally {
        setSearching(false);
      }
    }, DEBOUNCE_MS);
  }

  function commitSelection(result: ResolvedLocation) {
    setRecentLocations(prev => [result, ...prev.filter(l => l.label !== result.label)].slice(0, 5));
    setQuery('');
    setPredictions([]);
    onSelectLocation(result);
    handleClose();
  }

  async function handleSelectPrediction(prediction: PlacePrediction) {
    setResolving(true);
    setError(null);
    try {
      const result = await getPlaceDetails(prediction.place_id);
      commitSelection(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load that address');
    } finally {
      setResolving(false);
    }
  }

  async function handleDetectCurrent() {
    setDetecting(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const result = await reverseGeocode(position.coords.latitude, position.coords.longitude);
      commitSelection(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to detect location');
    } finally {
      setDetecting(false);
    }
  }

  function handleClose() {
    setQuery('');
    setPredictions([]);
    setError(null);
    onClose();
  }

  if (!mounted) return null;

  const showingSearchResults = query.trim().length > 0;

  return (
    <Modal visible transparent animationType="none" onRequestClose={handleClose} statusBarTranslucent>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleClose} />
      </Animated.View>

      <View style={styles.centerWrap} pointerEvents="box-none">
        <Animated.View style={[styles.card, cardStyle]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
            <X size={16} color="#1A1A1A" strokeWidth={2} />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Search Location ..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={handleQueryChange}
            returnKeyType="search"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {showingSearchResults ? (
            searching || resolving ? (
              <ActivityIndicator style={styles.loadingIndicator} color="#2A5C40" />
            ) : predictions.length > 0 ? (
              predictions.map(p => (
                <TouchableOpacity
                  key={p.place_id}
                  style={styles.recentRow}
                  onPress={() => handleSelectPrediction(p)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.recentText}>{p.description}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No matches found</Text>
            )
          ) : (
            <>
              <Text style={styles.sectionTitle}>Detect Current Location</Text>

              <TouchableOpacity
                style={styles.currentLocationRow}
                onPress={handleDetectCurrent}
                activeOpacity={0.7}
                disabled={detecting}
              >
                {detecting ? (
                  <ActivityIndicator size="small" color="#2A5C40" />
                ) : (
                  <Crosshair size={16} color="#2A5C40" strokeWidth={2} />
                )}
                <Text style={styles.currentLocationText}>Current location</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Recent Locations</Text>

              {recentLocations.length === 0 ? (
                <Text style={styles.emptyText}>No recent locations</Text>
              ) : (
                recentLocations.map(loc => (
                  <TouchableOpacity
                    key={loc.label}
                    style={styles.recentRow}
                    onPress={() => commitSelection(loc)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.recentText}>{loc.label}</Text>
                  </TouchableOpacity>
                ))
              )}
            </>
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
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    fontFamily: 'Roboto_400Regular',
    marginBottom: 12,
  },
  loadingIndicator: {
    paddingVertical: 16,
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
