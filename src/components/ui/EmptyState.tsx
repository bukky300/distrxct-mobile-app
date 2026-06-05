import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@config/theme';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
}

export default function EmptyState({ icon = 'search-outline', title, message }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  title: { ...typography.h4, color: colors.text, marginTop: spacing.md, textAlign: 'center' },
  message: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
});
