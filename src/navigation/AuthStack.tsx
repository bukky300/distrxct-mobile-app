import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';
import LoginScreen from '@screens/auth/LoginScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@screens/auth/ForgotPasswordScreen';
import EmailVerificationScreen from '@screens/auth/EmailVerificationScreen';
import ResetPasswordScreen from '@screens/auth/ResetPasswordScreen';
import EmailVerifiedScreen from '@screens/auth/EmailVerifiedScreen';
import PasswordResetCompleteScreen from '@screens/auth/PasswordResetCompleteScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface Props {
  initialRouteName?: keyof AuthStackParamList;
}

export default function AuthStack({ initialRouteName }: Props) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="EmailVerified" component={EmailVerifiedScreen} />
      <Stack.Screen name="PasswordResetComplete" component={PasswordResetCompleteScreen} />
    </Stack.Navigator>
  );
}
