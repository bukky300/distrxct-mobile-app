import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface Coords {
  latitude: number;
  longitude: number;
}

export function useCurrentLocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoading(false);
        return;
      }
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }).then(pos => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLoading(false);
      }).catch(err => {
        setError(err.message);
        setLoading(false);
      });
    });
  }, []);

  return { coords, error, loading };
}
