import { RequestWithSession } from '@/types/extended-request';
import { asyncHandler } from '@/utils/async-handler';
import { StatusCodes } from '@workspace/config';
import { db } from '@workspace/db';
import type { Response } from 'express';

export const getMessages = asyncHandler(async (req: RequestWithSession, res: Response) => {
  const receiverId = req.params.receiverId;
  const userId = req.session.user.id;
  if (!receiverId || typeof receiverId != 'string') {
    return res.status(StatusCodes.HTTP_404_NOT_FOUND).json({
      message: 'No chat data found for corresponding user',
    });
  }

  const messages = await db.message.findMany({
    where: {
      OR: [
        {
          senderId: userId,
          receiverId: receiverId,
        },
        {
          senderId: receiverId,
          receiverId: userId,
        },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(StatusCodes.HTTP_200_OK).json({ messages });
});
