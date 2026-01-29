import { auth } from '@workspace/auth';
import { Request, Response, NextFunction } from 'express';
import { RequestWithSession } from '@/types/extended-request';
const isAuthorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as Record<string, string>,
    });
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    (req as RequestWithSession).session = session;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * This middleware should be placed after the middleware:
 * isAuthorize
 *
 * @note Place this middleware directly after `isAuthorize` in your middleware chain.
 */

function isEmailVerified(req: Request, res: Response, next: NextFunction) {
  try {
    const session = (req as RequestWithSession).session;

    if (!session || !session.user || !session.user.emailVerified) {
      return res.status(403).json({ message: 'Email not verified' });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
export { isAuthorize, isEmailVerified };
