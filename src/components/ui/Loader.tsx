import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { colors } from '@config/theme';

interface Props {
  fullScreen?: boolean;
  size?: 'small' | 'large';
}

export default function Loader({ fullScreen = false, size = 'large' }: Props) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 16 },
  fullScreen: { flex: 1 },
});
