import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocations } from '@features/locations/hooks/useLocations';
import { MAP_DEFAULTS } from '@config/constants';
import { colors } from '@config/theme';

export default function MapScreen() {
  const { locations } = useLocations();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={MAP_DEFAULTS.INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {locations.map(loc => (
          <Marker
            key={loc.id}
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
            title={loc.name}
            description={loc.address ?? undefined}
            pinColor={colors.primary}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
