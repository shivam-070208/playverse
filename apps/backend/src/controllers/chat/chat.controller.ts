import { RequestWithSession } from '@/types/extended-request';
import { asyncHandler } from '@/utils/async-handler';
import type { Response } from 'express';

export const getMessages = asyncHandler((req: RequestWithSession, res: Response) => {});
