import React from 'react';
import { Container } from '@/components/common/container';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { FaComments, FaGamepad, FaRocket } from 'react-icons/fa';

const chatPresets = [
  { icon: <FaComments />, label: 'Messages' },
  { icon: <FaGamepad />, label: 'Preset' },
  { icon: <FaRocket />, label: 'Missions' },
];

const LobbyFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full ">
      <Container maxWidth="full" padding="full" className="flex items-center justify-between py-2">
        {/* Preset Actions */}
        <div className="flex gap-2 items-center">
          {chatPresets.map((preset, i) => (
            <Button type="button" key={preset.label} size="sm" variant="ghost" className="gap-1">
              {preset.icon}
              <span className="hidden sm:inline">{preset.label}</span>
            </Button>
          ))}
        </div>
        {/* Start Button */}
        <Button color="primary" className="ml-auto font-bold px-6 rounded-none" size="lg">
          Start Room
        </Button>
      </Container>
    </footer>
  );
};

export default LobbyFooter;
