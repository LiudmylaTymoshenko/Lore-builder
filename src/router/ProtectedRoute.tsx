// ProtectedRoute.tsx
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { Navigate } from 'react-router-dom';
import React from 'react';

export default function ProtectedRoute({
  children,
}: {
  children: React.JSX.Element;
}) {
  const isAuth = useSelector((s: RootState) => s.auth.isAuthenticated);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
