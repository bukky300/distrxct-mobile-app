import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LocationsStackParamList } from '@navigation/types';
import Screen from '@components/layout/Screen';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { useMutation, gql } from '@apollo/client';
import { colors, spacing, typography } from '@config/theme';

const CREATE_LOCATION = gql`
  mutation CreateLocation($input: CreateLocationInput!) {
    createLocation(input: $input) {
      id name
    }
  }
`;

type Props = NativeStackScreenProps<LocationsStackParamList, 'AddLocation'>;

export default function AddLocationScreen({ navigation, route }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(route.params?.prefillCoords?.lat?.toString() ?? '');
  const [lng, setLng] = useState(route.params?.prefillCoords?.lng?.toString() ?? '');
  const [error, setError] = useState('');
  const [createLocation, { loading }] = useMutation(CREATE_LOCATION, {
    refetchQueries: ['GetLocations'],
  });

  const handleSubmit = async () => {
    setError('');
    if (!name.trim()) { setError('Name is required'); return; }
    if (!lat || !lng) { setError('Coordinates are required'); return; }
    try {
      const { data } = await createLocation({
        variables: {
          input: {
            name: name.trim(),
            description: description.trim() || undefined,
            address: address.trim() || undefined,
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
            category: 'OTHER',
          },
        },
      });
      if (data?.createLocation) {
        navigation.navigate('LocationDetail', { locationId: data.createLocation.id });
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create location');
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Input label="Name *" value={name} onChangeText={setName} placeholder="What's this place called?" />
          <Input label="Description" value={description} onChangeText={setDescription} multiline numberOfLines={3} placeholder="Tell us about this spot..." />
          <Input label="Address" value={address} onChangeText={setAddress} placeholder="123 Example St" />
          <View style={styles.row}>
            <View style={styles.half}>
              <Input label="Latitude *" value={lat} onChangeText={setLat} keyboardType="numeric" placeholder="37.7749" />
            </View>
            <View style={styles.half}>
              <Input label="Longitude *" value={lng} onChangeText={setLng} keyboardType="numeric" placeholder="-122.4194" />
            </View>
          </View>
          <Button label="Add Location" onPress={handleSubmit} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: spacing.lg },
  error: { ...typography.bodySmall, color: colors.error, marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
});
