import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SHIMMER_W = SCREEN_WIDTH * 0.5;

interface Props {
  count?: number;
}

export default function FriendListSkeleton({ count = 4 }: Props) {
  const translateX = useSharedValue(-SHIMMER_W);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(SCREEN_WIDTH + SHIMMER_W, { duration: 1100, easing: Easing.linear }),
      -1,
      false,
    );
  }, [translateX]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { skewX: '-18deg' }],
  }));

  return (
    <View style={styles.list}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.block, styles.avatar]}>
            <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle, styles.shimmer]} />
          </View>
          <View style={styles.info}>
            <View style={[styles.block, styles.line, { width: '55%' }]}>
              <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle, styles.shimmer]} />
            </View>
            <View style={[styles.block, styles.line, { width: '75%', marginTop: 8 }]}>
              <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle, styles.shimmer]} />
            </View>
          </View>
          <View style={[styles.block, styles.button]}>
            <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle, styles.shimmer]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  block: {
    backgroundColor: '#E8E8E8',
    overflow: 'hidden',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  info: {
    flex: 1,
  },
  line: {
    height: 12,
    borderRadius: 6,
  },
  button: {
    width: 90,
    height: 40,
    borderRadius: 10,
  },
  shimmer: {
    width: SHIMMER_W,
    backgroundColor: 'rgba(255,255,255,0.68)',
  },
});
