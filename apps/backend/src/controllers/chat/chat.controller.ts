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

  let chatData = await db.chat.findFirst({
    where: {
      OR: [
        {
          user1Id: userId,
          user2Id: receiverId,
        },
        {
          user1Id: receiverId,
          user2Id: userId,
        },
      ],
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!chatData) {
    chatData = await db.chat.create({
      data: {
        user1Id: userId,
        user2Id: receiverId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }
  res.status(StatusCodes.HTTP_200_OK).json({ messages: chatData?.messages || [] });
});
