import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import type { ResolvedLocation } from '@features/locations/services/googlePlaces';
import { BUSINESS_FIELDS } from './useMyBusiness';
import type { Business } from '../types';

const CREATE_STORE_MUTATION = gql`
  mutation Create_store($input: StoreCreateInput!) {
    create_store(input: $input) {
      ${BUSINESS_FIELDS}
    }
  }
`;

const ASSIGN_LOCATION_MUTATION = gql`
  mutation CreateAndAssignLocation($input: LocationInput!, $entityId: ID!) {
    createAndAssignLocation(
      input: $input
      entityId: $entityId
      entityType: STORE
      addressType: BUSINESS
      isPrimary: true
    ) {
      id
      location {
        formattedAddress
      }
    }
  }
`;

interface CreateBusinessArgs {
  name: string;
  description: string;
  storeTypeId: string;
  categoryId: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  whatsappNumber?: string;
  location?: ResolvedLocation;
}

export function useCreateBusiness() {
  const [createStoreMutation] = useMutation(CREATE_STORE_MUTATION);
  const [assignLocationMutation] = useMutation(ASSIGN_LOCATION_MUTATION);
  const [submitting, setSubmitting] = useState(false);

  const createBusiness = async (args: CreateBusinessArgs): Promise<Business> => {
    setSubmitting(true);
    try {
      const { data } = await createStoreMutation({
        variables: {
          input: {
            name: args.name,
            description: args.description,
            store_type_id: args.storeTypeId,
            category_ids: [args.categoryId],
            instagram_url: args.instagramUrl || undefined,
            tictok_url: args.tiktokUrl || undefined,
            whatsapp_number: args.whatsappNumber || undefined,
          },
        },
      });
      const business: Business | undefined = data?.create_store;
      if (!business) throw new Error('Could not create your business. Please try again.');

      if (args.location) {
        // The dashboard refetches after creation (see onCreated), which will pick up
        // the assigned location with its id — no need to merge a partial shape here.
        await assignLocationMutation({
          variables: {
            entityId: business.id,
            input: {
              city: args.location.city ?? '',
              state: args.location.state ?? '',
              country: args.location.country ?? '',
              countryCode: args.location.country_code ?? '',
              streetAddress: args.location.street_address,
              streetAddress2: args.location.street_address_2,
              postalCode: args.location.postal_code,
              latitude: args.location.latitude,
              longitude: args.location.longitude,
              timezone: args.location.timezone,
            },
          },
        });
      }

      return business;
    } finally {
      setSubmitting(false);
    }
  };

  return { createBusiness, submitting };
}
