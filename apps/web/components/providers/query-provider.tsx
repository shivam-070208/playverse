'use client';
import React from 'react';
import { QueryClient, QueryClientProvider as TanstackQueryProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return <TanstackQueryProvider client={queryClient}>{children}</TanstackQueryProvider>;
};
export { QueryProvider };
