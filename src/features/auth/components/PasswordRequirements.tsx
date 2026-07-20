import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getPasswordRequirements } from '@utils/validators';

const T = {
  green: '#2D6A2D',
  gray: '#888888',
};

const ITEMS: { key: keyof ReturnType<typeof getPasswordRequirements>; symbol: string; label: string }[] = [
  { key: 'minLength', symbol: '8+', label: 'Characters' },
  { key: 'uppercase', symbol: 'AA', label: 'Uppercase' },
  { key: 'lowercase', symbol: 'aa', label: 'Lowercase' },
  { key: 'number', symbol: '123', label: 'Numbers' },
  { key: 'symbol', symbol: '$#^', label: 'Symbol' },
];

interface Props {
  password: string;
}

export default function PasswordRequirements({ password }: Props) {
  const requirements = getPasswordRequirements(password);
  const metCount = Object.values(requirements).filter(Boolean).length;

  return (
    <View>
      <View style={styles.strengthBar}>
        {[0, 1, 2, 3, 4].map(i => (
          <View
            key={i}
            style={[styles.strengthSegment, { backgroundColor: i < metCount ? T.green : '#E0E0E0' }]}
          />
        ))}
      </View>

      <Text style={styles.title}>Password strength requirement</Text>
      <View style={styles.row}>
        {ITEMS.map(item => {
          const met = requirements[item.key];
          return (
            <View key={item.key} style={styles.item}>
              <Text style={[styles.symbol, { color: met ? T.green : T.gray }]}>{item.symbol}</Text>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  strengthBar: { flexDirection: 'row', gap: 4, height: 4, marginBottom: 4 },
  strengthSegment: { flex: 1, borderRadius: 2 },
  title: {
    fontSize: 13,
    color: T.gray,
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
    fontFamily: 'Roboto_400Regular',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  item: { alignItems: 'center', gap: 4 },
  symbol: { fontSize: 14, fontWeight: '700', fontFamily: 'Roboto_700Bold' },
  label: { fontSize: 11, color: T.gray, fontFamily: 'Roboto_400Regular' },
});
