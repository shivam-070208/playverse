import { Container } from '@/components/common/container';
import { Heading } from '@workspace/ui/components/heading';
import { LobbyHeader } from './lobby-header';
import LobbyFooter from './lobby-footer';
const Lobby = () => {
  return (
    <Container className="relative h-dvh" maxWidth="full" padding="full">
      <div className="absolute z-0 w-full h-full grid place-items-center">
        <Heading className="font-ryzes tracking-normal! text-8xl! text-center">
          Play <br />
          Verse
        </Heading>
      </div>
      <div className="overlay relative z-1 w-full h-full">
        <LobbyHeader />
        <LobbyFooter />
      </div>
    </Container>
  );
};

export default Lobby;
