import React from 'react';
import AuthNotice from '@features/auth/components/AuthNotice';

export default function EmailVerifiedScreen() {
  return (
    <AuthNotice
      title="Email verified"
      body="Your email has been verified. Log in to continue."
    />
  );
}
