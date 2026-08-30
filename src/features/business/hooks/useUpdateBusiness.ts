import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { BUSINESS_FIELDS } from './useMyBusiness';
import type { Business } from '../types';

const UPDATE_STORE_MUTATION = gql`
  mutation Update_store($storeId: String!, $input: StoreUpdateInput!) {
    update_store(store_id: $storeId, input: $input) {
      ${BUSINESS_FIELDS}
    }
  }
`;

export interface MediaFileInput {
  mime_type: string;
  file_name: string;
  file_data: string;
}

// Every edit sheet (Detail, About, Hours, Logo, Gallery) builds a different partial
// of this and calls the same mutation — update_store is a patch, not a full replace.
export interface BusinessUpdateInput {
  name?: string;
  description?: string;
  instagram_url?: string;
  tictok_url?: string;
  whatsapp_number?: string;
  email?: string;
  timezone?: string;
  open_hour?: string | null;
  close_hour?: string | null;
  store_type_id?: string;
  category_ids?: string[];
  logo?: MediaFileInput;
  remove_logo?: boolean;
  add_media?: MediaFileInput[];
  remove_media_urls?: string[];
  remove_all_media?: boolean;
}

export function useUpdateBusiness() {
  const [updateStoreMutation] = useMutation(UPDATE_STORE_MUTATION);
  const [submitting, setSubmitting] = useState(false);

  const updateBusiness = async (storeId: string, input: BusinessUpdateInput): Promise<Business> => {
    setSubmitting(true);
    try {
      const { data } = await updateStoreMutation({ variables: { storeId, input } });
      const business: Business | undefined = data?.update_store;
      if (!business) throw new Error('Could not save your changes. Please try again.');
      return business;
    } finally {
      setSubmitting(false);
    }
  };

  return { updateBusiness, submitting };
}
