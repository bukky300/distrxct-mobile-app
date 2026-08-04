import { useCallback } from 'react';
import { useMutation, gql } from '@apollo/client';
import type { FullUser } from './useFullUser';

const UPDATE_USER = gql`
  mutation Update_user(
    $userId: UUID!
    $lastName: String!
    $email: String!
    $firstName: String!
    $profilePicture: MediaFileInput
    $phoneNumber: String
    $bio: String
    $gender: String
    $username: String
  ) {
    update_user(
      user_id: $userId
      last_name: $lastName
      email: $email
      first_name: $firstName
      profile_picture: $profilePicture
      phone_number: $phoneNumber
      bio: $bio
      gender: $gender
      username: $username
    ) {
      provider
      profile_picture {
        original
        thumbnail
        medium
      }
      id
      first_name
      last_name
      username
      email
      bio
      gender
      updated_at
      phone_number
    }
  }
`;

export interface MediaFileInput {
  mime_type: string;
  file_name: string;
  file_data: string;
}

export interface UpdateAccountInput {
  userId: string;
  // Non-null in the schema — always send the current value even when unchanged.
  firstName: string;
  lastName: string;
  email: string;
  bio: string | null;
  // Genuinely optional — only include when the user actually changed them.
  username?: string;
  gender?: string;
  phoneNumber?: string;
  profilePicture?: MediaFileInput;
}

export function useUpdateAccount() {
  const [mutate, { loading }] = useMutation<{ update_user: FullUser }>(UPDATE_USER);

  const updateAccount = useCallback(
    async (input: UpdateAccountInput): Promise<FullUser> => {
      const { data } = await mutate({ variables: input });
      if (!data?.update_user) throw new Error("Couldn't update your account. Try again.");
      return data.update_user;
    },
    [mutate],
  );

  return { updateAccount, submitting: loading };
}
