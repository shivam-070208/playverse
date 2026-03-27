import { UserSession } from '@workspace/auth/types/user-session';
import { IncomingMessage } from 'http';

export type RequestWithSession = IncomingMessage & {
  session: UserSession;
};
