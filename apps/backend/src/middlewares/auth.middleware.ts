import { auth } from '@workspace/auth';
import { Request, Response, NextFunction } from 'express';
const isAuthorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as Record<string, string>,
    });
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    (req as unknown as Record<string, unknown>).session = session;
    next();
  } catch (error) {
    console.error('Auth middleware error', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { isAuthorize };
