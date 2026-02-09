import React from 'react';
import { CloseNavigate } from '@/components/common/close-navigate';
import { Container } from '@/components/common/container';
import { Header } from '@/components/common/header';
export default async function SecondaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="relative h-dvh flex flex-col" maxWidth="full" padding="full">
      <Header>
        <CloseNavigate />
      </Header>
      {children}
    </Container>
  );
}
