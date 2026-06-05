import React from 'react';
import { useAuthStore } from '../store/authStore';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback = null }: Props) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
}
