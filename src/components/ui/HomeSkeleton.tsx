import React, { createContext, useContext, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  SharedValue,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SHIMMER_W = SCREEN_WIDTH * 0.52;

// Single animation value shared across all blocks for synchronised sweep
const ShimmerCtx = createContext<SharedValue<number> | null>(null);

function ShimmerProvider({ children }: { children: React.ReactNode }) {
  const translateX = useSharedValue(-SHIMMER_W);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(SCREEN_WIDTH + SHIMMER_W, {
        duration: 1100,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, []);

  return <ShimmerCtx.Provider value={translateX}>{children}</ShimmerCtx.Provider>;
}

// ─── Individual skeleton block ─────────────────────────────────────────────────

interface BlockProps {
  width?: number | `${number}%`;
  height: number;
  radius?: number;
  style?: object;
}

function Block({ width = '100%', height, radius = 8, style }: BlockProps) {
  const translateX = useContext(ShimmerCtx)!;

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { skewX: '-18deg' }],
  }));

  return (
    <View style={[styles.block, { width: width as any, height, borderRadius: radius }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle, styles.shimmer]} />
    </View>
  );
}

// ─── HomeSkeleton ──────────────────────────────────────────────────────────────

export default function HomeSkeleton() {
  return (
    <ShimmerProvider>
      <View style={styles.container}>
        {/* Header row: logo + icons */}
        <View style={[styles.row, { marginBottom: 16 }]}>
          <Block width={96} height={30} radius={10} />
          <Block width={76} height={30} radius={10} />
        </View>

        {/* Hero banner */}
        <Block height={162} radius={14} style={{ marginBottom: 10 }} />

        {/* Subtitle tag */}
        <View style={[styles.row, { justifyContent: 'flex-end', marginBottom: 4 }]}>
          <Block width={86} height={20} radius={10} />
        </View>
        <Block width={110} height={20} radius={10} style={{ marginBottom: 20 }} />

        {/* Post card 1 */}
        <Block height={78} radius={12} style={{ marginBottom: 12 }} />

        {/* Post card 2 */}
        <Block height={78} radius={12} style={{ marginBottom: 12 }} />

        {/* Two-column content cards */}
        <View style={[styles.row, { gap: 12, marginBottom: 12 }]}>
          <Block width={(SCREEN_WIDTH - 44) / 2} height={128} radius={12} />
          <Block width={(SCREEN_WIDTH - 44) / 2} height={128} radius={12} />
        </View>

        {/* Post card 3 */}
        <Block height={78} radius={12} />
      </View>
    </ShimmerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  block: {
    backgroundColor: '#E8E8E8',
    overflow: 'hidden',
  },
  shimmer: {
    width: SHIMMER_W,
    backgroundColor: 'rgba(255,255,255,0.68)',
  },
});
