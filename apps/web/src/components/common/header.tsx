import React from 'react';
import { ProfileCard } from './profile-card';
import { Container } from './container';

const Header = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Container maxWidth="full" className="flex justify-between items-center" as="header">
      <div className="profile">
        <ProfileCard />
      </div>
      <div className="actions flex gap-2">{children}</div>
    </Container>
  );
};

export { Header };
