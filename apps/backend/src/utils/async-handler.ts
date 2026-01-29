import type { Request, Response, NextFunction } from 'express';

/* eslint-disable @typescript-eslint/no-unsafe-function-type */
const asyncHandler = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await fn(req, res, next);
      return result;
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'internal Server Error',
      });
    }
  };
};

export { asyncHandler };
