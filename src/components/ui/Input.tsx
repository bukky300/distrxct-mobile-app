import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@config/theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({ label, error, style, ...props }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        style={[styles.input, focused && styles.inputFocused, !!error && styles.inputError, style]}
        placeholderTextColor={colors.textMuted}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    color: colors.text,
    backgroundColor: colors.surface,
    ...typography.body,
  },
  inputFocused: { borderColor: colors.primary },
  inputError: { borderColor: colors.error },
  error: { ...typography.caption, color: colors.error, marginTop: spacing.xs },
});
