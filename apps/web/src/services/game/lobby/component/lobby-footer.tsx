'use client';
import React from 'react';
import { Container } from '@/components/common/container';
import { Button } from '@workspace/ui/components/button';
import { authClient } from '@/lib/auth-client';
import { FaComments, FaGamepad, FaRocket } from 'react-icons/fa';
import { cn } from '@workspace/ui/lib/utils';

const chatPresets = [
  { icon: <FaComments />, label: 'Messages' },
  { icon: <FaGamepad />, label: 'Preset' },
  { icon: <FaRocket />, label: 'Missions' },
];

const LobbyFooter = () => {
  const { data: user_session } = authClient.useSession();
  return (
    <footer className="fixed bottom-0 left-0 w-full ">
      <Container maxWidth="full" padding="full" className="flex items-center justify-between py-2">
        {/* Preset Actions */}
        <div className="flex gap-2 items-center pl-1">
          {chatPresets.map((preset, i) => (
            <Button
              type="button"
              key={preset.label}
              size="sm"
              variant="ghost"
              className="gap-1 rounded-none"
            >
              {preset.icon}
              <span className="hidden sm:inline">{preset.label}</span>
            </Button>
          ))}
        </div>
        <Button
          color="primary"
          disabled={!user_session?.user.emailVerified}
          size="lg"
          className={cn(
            'ml-auto font-black px-6 rounded-none',
            '[clip-path:polygon(12%_0%,100%_0,100%_100%,0%_100%)]',
          )}
        >
          Start Room
        </Button>
      </Container>
    </footer>
  );
};

export default LobbyFooter;
