import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

function Block({ width, height, radius = 8 }: { width: number | `${number}%`; height: number; radius?: number }) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.block, { width, height, borderRadius: radius }, style]} />;
}

export default function FeedPostCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Block width={40} height={40} radius={20} />
        <View style={styles.headerText}>
          <Block width="40%" height={12} radius={6} />
          <Block width="25%" height={10} radius={6} />
        </View>
      </View>
      <Block width="90%" height={12} radius={6} />
      <View style={{ height: 8 }} />
      <Block width="100%" height={140} radius={10} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  headerText: { gap: 6, flex: 1 },
  block: { backgroundColor: '#E8E8E8' },
});
