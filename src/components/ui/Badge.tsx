import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@config/theme';

interface Props {
  label: string;
  color?: string;
}

export default function Badge({ label, color = colors.primary }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: { ...typography.caption, fontWeight: '600' },
});
