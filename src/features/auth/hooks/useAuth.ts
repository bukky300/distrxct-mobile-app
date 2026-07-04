import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useAuthStore } from '../store/authStore';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@config/constants';
import { apolloClient } from '@/apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($email_or_username: String!, $password: String!) {
    login(email_or_username: $email_or_username, password: $password) {
      access_token
      refresh_token
      expires_in
      token_type
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: UserRegistrationInput!) {
    register(input: $input) {
      access_token
      refresh_token
      expires_in
      token_type
    }
  }
`;

const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verify_email(token: $token) {
      success
      message
      attempts_remaining
      can_resend
      requires_new_token
    }
  }
`;

const RESEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation ResendVerificationEmail($email: String!) {
    resend_verification_email(email: $email) {
      success
      message
      attempts_remaining
      can_resend
      requires_new_token
    }
  }
`;

const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($email: String!) {
    request_password_reset(email: $email) {
      success
      message
    }
  }
`;

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $new_password: String!) {
    reset_password(token: $token, new_password: $new_password) {
      success
      message
    }
  }
`;

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($current_password: String!, $new_password: String!) {
    change_password(current_password: $current_password, new_password: $new_password)
  }
`;

const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      avatarUrl
      bio
    }
  }
`;

export interface RegisterInput {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  accepted_terms: boolean;
  phone_number?: string | null;
  gender?: string | null;
}

export interface EmailVerificationResult {
  success: boolean;
  message: string;
  attempts_remaining?: number | null;
  can_resend?: boolean | null;
  requires_new_token?: boolean | null;
}

export interface PasswordResetResult {
  success: boolean;
  message: string;
}

export function useAuth() {
  const { isAuthenticated, user, setAuth, logout } = useAuthStore();
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER_MUTATION);
  const [verifyEmailMutation, { loading: verifyEmailLoading }] = useMutation(VERIFY_EMAIL_MUTATION);
  const [resendVerificationEmailMutation, { loading: resendVerificationEmailLoading }] = useMutation(
    RESEND_VERIFICATION_EMAIL_MUTATION,
  );
  const [requestPasswordResetMutation, { loading: requestPasswordResetLoading }] = useMutation(
    REQUEST_PASSWORD_RESET_MUTATION,
  );
  const [resetPasswordMutation, { loading: resetPasswordLoading }] = useMutation(RESET_PASSWORD_MUTATION);
  const [changePasswordMutation, { loading: changePasswordLoading }] = useMutation(CHANGE_PASSWORD_MUTATION);

  const login = async (emailOrUsername: string, password: string) => {
    const { data } = await loginMutation({
      variables: { email_or_username: emailOrUsername, password },
    });
    if (data?.login) {
      const { access_token, refresh_token } = data.login;
      // Save token first so authLink can use it for the me query
      await storage.set(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      const { data: meData } = await apolloClient.query({ query: GET_ME, fetchPolicy: 'network-only' });
      if (meData?.me) {
        await setAuth({ accessToken: access_token, refreshToken: refresh_token }, meData.me);
      }
    }
  };

  const register = async (input: RegisterInput) => {
    const { data } = await registerMutation({ variables: { input } });
    if (!data?.register) throw new Error('Registration failed. Please try again.');
    const { access_token, refresh_token } = data.register;
    // Stash tokens without marking the user authenticated — they're promoted to a
    // real session once verify_email succeeds, so RootNavigator keeps showing AuthStack
    // until then.
    await storage.set(STORAGE_KEYS.ACCESS_TOKEN, access_token);
    await storage.set(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
  };

  const verifyEmail = async (token: string): Promise<EmailVerificationResult> => {
    const { data } = await verifyEmailMutation({ variables: { token } });
    const result: EmailVerificationResult | undefined = data?.verify_email;
    if (!result) throw new Error('Verification failed. Please try again.');

    if (result.success) {
      const [accessToken, refreshToken] = await Promise.all([
        storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN),
        storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN),
      ]);
      if (accessToken && refreshToken) {
        const { data: meData } = await apolloClient.query({ query: GET_ME, fetchPolicy: 'network-only' });
        if (meData?.me) {
          await setAuth({ accessToken, refreshToken }, meData.me);
        }
      }
    }

    return result;
  };

  const resendVerificationEmail = async (email: string): Promise<EmailVerificationResult> => {
    const { data } = await resendVerificationEmailMutation({ variables: { email } });
    const result: EmailVerificationResult | undefined = data?.resend_verification_email;
    if (!result) throw new Error('Could not resend verification email. Please try again.');
    return result;
  };

  const requestPasswordReset = async (email: string): Promise<PasswordResetResult> => {
    const { data } = await requestPasswordResetMutation({ variables: { email } });
    const result: PasswordResetResult | undefined = data?.request_password_reset;
    if (!result) throw new Error('Could not request a password reset. Please try again.');
    return result;
  };

  const resetPassword = async (token: string, newPassword: string): Promise<PasswordResetResult> => {
    const { data } = await resetPasswordMutation({
      variables: { token, new_password: newPassword },
    });
    const result: PasswordResetResult | undefined = data?.reset_password;
    if (!result) throw new Error('Could not reset your password. Please try again.');
    return result;
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    const { data } = await changePasswordMutation({
      variables: { current_password: currentPassword, new_password: newPassword },
    });
    return !!data?.change_password;
  };

  return {
    isAuthenticated,
    user,
    login,
    register,
    verifyEmail,
    resendVerificationEmail,
    requestPasswordReset,
    resetPassword,
    changePassword,
    logout,
    loginLoading,
    registerLoading,
    verifyEmailLoading,
    resendVerificationEmailLoading,
    requestPasswordResetLoading,
    resetPasswordLoading,
    changePasswordLoading,
  };
}
