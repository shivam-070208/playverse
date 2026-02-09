import { authRequire } from '@/services/auth/lib/auth-utils';
import React from 'react';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  await authRequire();
  return <>{children}</>;
}
