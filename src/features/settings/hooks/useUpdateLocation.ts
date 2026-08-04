import { useCallback } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import type { ResolvedLocation } from '@features/locations/services/googlePlaces';

const GET_USER_LOCATION = gql`
  query User($userId: UUID!) {
    user(user_id: $userId) {
      id
      location {
        formatted_address
      }
    }
  }
`;

// Initial display value only — the main useFullUser query doesn't include location,
// matching web's separate location flow (desktop-location-section.jsx's own fetch).
export function useCurrentLocation(userId: string | undefined) {
  const { data, loading } = useQuery<{ user: { location: { formatted_address: string | null } | null } | null }>(
    GET_USER_LOCATION,
    { variables: { userId }, skip: !userId, fetchPolicy: 'network-only' },
  );

  return { formattedAddress: data?.user?.location?.formatted_address ?? null, loading };
}

const UPDATE_LOCATION = gql`
  mutation Update_user($location: LocationUpdateInput, $userId: UUID!) {
    update_user(location: $location, user_id: $userId) {
      location {
        id
        street_address
        street_address_2
        city
        state
        postal_code
        country
        country_code
        latitude
        longitude
        formatted_address
        place_id
        timezone
        created_at
        updated_at
      }
    }
  }
`;

interface UpdatedLocation {
  id: string;
  formatted_address: string | null;
}

// Fires instantly on pick, independent of the main Account Settings Save button.
export function useUpdateLocation() {
  const [mutate, { loading }] = useMutation<{ update_user: { location: UpdatedLocation | null } }>(
    UPDATE_LOCATION,
  );

  const updateLocation = useCallback(
    async (userId: string, location: ResolvedLocation): Promise<UpdatedLocation> => {
      const { data } = await mutate({
        variables: {
          userId,
          location: {
            street_address: location.street_address,
            street_address_2: location.street_address_2,
            city: location.city,
            state: location.state,
            postal_code: location.postal_code,
            country: location.country,
            country_code: location.country_code,
            latitude: location.latitude,
            longitude: location.longitude,
            timezone: location.timezone,
          },
        },
      });
      if (!data?.update_user?.location) throw new Error("Couldn't save your location. Try again.");
      return data.update_user.location;
    },
    [mutate],
  );

  return { updateLocation, submitting: loading };
}
