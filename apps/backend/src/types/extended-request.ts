import { UserSession } from '@workspace/auth/types/user-session';
import type { Request } from 'express';

export type RequestWithSession = Request & {
  session: UserSession;
};
