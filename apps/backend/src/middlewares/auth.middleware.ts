import { auth } from '@workspace/auth';
import { Request, Response, NextFunction } from 'express';
import { RequestWithSession } from '@/types/extended-request';
import { StatusCodes } from '@workspace/config';
const isAuthorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as Record<string, string>,
    });
    if (!session) {
      return res.status(StatusCodes.HTTP_401_UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
    (req as RequestWithSession).session = session;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.HTTP_500_INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
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
      return res.status(StatusCodes.HTTP_403_FORBIDDEN).json({ message: 'Email not verified' });
    }
    next();
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.HTTP_500_INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
}
export { isAuthorize, isEmailVerified };
