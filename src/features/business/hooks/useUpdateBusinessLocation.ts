import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import type { ResolvedLocation } from '@features/locations/services/googlePlaces';

const ASSIGN_LOCATION_MUTATION = gql`
  mutation CreateAndAssignLocation($input: LocationInput!, $entityId: ID!) {
    createAndAssignLocation(
      input: $input
      entityId: $entityId
      entityType: STORE
      addressType: BUSINESS
      isPrimary: true
    ) {
      location {
        formattedAddress
      }
    }
  }
`;

const UPDATE_LOCATION_MUTATION = gql`
  mutation UpdateLocation($id: ID!, $input: LocationUpdateInput!) {
    updateLocation(id: $id, input: $input) {
      formattedAddress
    }
  }
`;

function toLocationInput(location: ResolvedLocation) {
  return {
    city: location.city ?? '',
    state: location.state ?? '',
    country: location.country ?? '',
    countryCode: location.country_code ?? '',
    streetAddress: location.street_address,
    streetAddress2: location.street_address_2,
    postalCode: location.postal_code,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
  };
}

// Businesses have at most one (primary) location — assign a new one the first time,
// update the existing one afterwards. Same distinction the web app makes.
export function useUpdateBusinessLocation() {
  const [assignLocationMutation] = useMutation(ASSIGN_LOCATION_MUTATION);
  const [updateLocationMutation] = useMutation(UPDATE_LOCATION_MUTATION);
  const [submitting, setSubmitting] = useState(false);

  const updateBusinessLocation = async (
    storeId: string,
    existingLocationId: string | null,
    location: ResolvedLocation,
  ): Promise<string> => {
    setSubmitting(true);
    try {
      if (existingLocationId) {
        const { data } = await updateLocationMutation({
          variables: { id: existingLocationId, input: toLocationInput(location) },
        });
        return data?.updateLocation?.formattedAddress ?? location.formatted_address ?? location.label;
      }
      const { data } = await assignLocationMutation({
        variables: { entityId: storeId, input: toLocationInput(location) },
      });
      return data?.createAndAssignLocation?.location?.formattedAddress ?? location.formatted_address ?? location.label;
    } finally {
      setSubmitting(false);
    }
  };

  return { updateBusinessLocation, submitting };
}
