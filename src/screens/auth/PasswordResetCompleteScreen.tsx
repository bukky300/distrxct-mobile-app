import React from 'react';
import AuthNotice from '@features/auth/components/AuthNotice';

export default function PasswordResetCompleteScreen() {
  return (
    <AuthNotice
      title="Password reset"
      body="Your password has been reset. Log in with your new password."
    />
  );
}
