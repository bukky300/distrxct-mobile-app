import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['distrxct://', 'https://distrxct.com'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
          EmailVerification: 'verify-email/:token',
          ResetPassword: 'reset-password/:token',
        },
      },
      App: {
        screens: {
          Home: 'home',
        },
      },
    },
  },
};
