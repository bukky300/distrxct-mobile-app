import { env } from '@config/env';

const BASE_URL = 'https://maps.googleapis.com/maps/api';

export interface PlacePrediction {
  place_id: string;
  description: string;
}

export interface ResolvedLocation {
  /** Display label, e.g. "Lagos, Lagos State" */
  label: string;
  formatted_address: string | null;
  place_id: string | null;
  street_address: string | null;
  street_address_2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  country_code: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeocodeGeometry {
  location: { lat: number; lng: number };
}

interface GeocodeResult {
  address_components: AddressComponent[];
  geometry: GeocodeGeometry;
  formatted_address: string;
  place_id?: string;
}

function getComponent(components: AddressComponent[], type: string, useShort = false): string | null {
  const match = components.find(c => c.types.includes(type));
  if (!match) return null;
  return useShort ? match.short_name : match.long_name;
}

function toResolvedLocation(result: GeocodeResult): ResolvedLocation {
  const components = result.address_components ?? [];

  const streetAddress =
    [getComponent(components, 'street_number'), getComponent(components, 'route')]
      .filter(Boolean)
      .join(' ') || null;

  const city =
    getComponent(components, 'locality') ||
    getComponent(components, 'sublocality') ||
    getComponent(components, 'administrative_area_level_2');

  const state = getComponent(components, 'administrative_area_level_1');
  const country = getComponent(components, 'country');

  const label = city && state ? `${city}, ${state}` : city || country || 'Unknown location';

  return {
    label,
    formatted_address: result.formatted_address ?? null,
    place_id: result.place_id ?? null,
    street_address: streetAddress,
    street_address_2: null,
    city,
    state,
    postal_code: getComponent(components, 'postal_code'),
    country,
    country_code: getComponent(components, 'country', true),
    latitude: result.geometry?.location?.lat ?? null,
    longitude: result.geometry?.location?.lng ?? null,
    timezone: null,
  };
}

export async function searchPlacePredictions(query: string): Promise<PlacePrediction[]> {
  const url = `${BASE_URL}/place/autocomplete/json?input=${encodeURIComponent(query)}&types=address&components=country:ng&key=${env.MAPS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(data.error_message || `Places autocomplete failed: ${data.status}`);
  }
  return (data.predictions ?? []).map((p: { place_id: string; description: string }) => ({
    place_id: p.place_id,
    description: p.description,
  }));
}

export async function getPlaceDetails(placeId: string): Promise<ResolvedLocation> {
  const url = `${BASE_URL}/place/details/json?place_id=${placeId}&fields=address_component,geometry,formatted_address&key=${env.MAPS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK') {
    throw new Error(data.error_message || `Place details failed: ${data.status}`);
  }
  return toResolvedLocation({ ...data.result, place_id: placeId });
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<ResolvedLocation> {
  const url = `${BASE_URL}/geocode/json?latlng=${latitude},${longitude}&key=${env.MAPS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK' || !data.results?.length) {
    throw new Error(data.error_message || `Reverse geocoding failed: ${data.status}`);
  }
  return toResolvedLocation(data.results[0]);
}
