import { IncomingMessage } from 'http';
import { auth } from '@workspace/auth';
import { RequestWithSession } from '../types/extended-incoming-message';

const isAuthorize = async (req: IncomingMessage): Promise<RequestWithSession | null> => {
  const reqHeaders = req.headers;
  const session = await auth.api.getSession({
    headers: reqHeaders as Record<string, string>,
  });
  if (!session) {
    return null;
  }
  if (!session.user || !session.user.emailVerified) {
    return null;
  }

  (req as RequestWithSession).session = session;
  return req as RequestWithSession;
};

export { isAuthorize };
