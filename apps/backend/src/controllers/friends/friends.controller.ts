import { RequestWithSession } from '@/types/extended-request';
import { db } from '@workspace/db';
import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler';

// GET Controller

const getAllFriendController = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as RequestWithSession).session.user.id;
  const { limit = 20, page = 0 } = req.query;

  const Friends = await db.friendship.findMany({
    where: {
      userId: {
        equals: userId,
      },
    },
    include: {
      friend: true,
    },
    orderBy: [
      {
        friend: {
          status: 'desc',
        },
      },
    ],
    skip: Number(page) * Number(limit),
    take: Number(limit),
  });
  return res.status(200).json({ Friends });
});
const getSentRequestsController = asyncHandler(async (req: Request, res: Response) => {
  const { searchQuery = '' } = req.query;
  const userId = (req as RequestWithSession).session.user.id;
  const SentRequests = await db.friendRequest.findMany({
    where: {
      fromUserId: {
        equals: userId,
      },
      toUser: {
        OR: [
          {
            name: {
              contains: String(searchQuery),
            },
          },
          {
            id: {
              contains: String(searchQuery),
            },
          },
        ],
      },
    },
    include: {
      toUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return res.status(200).json({ SentRequests });
});

const getReceivedRequests = asyncHandler(async (req: Request, res: Response) => {
  const { searchQuery = '' } = req.query;
  const userId = (req as RequestWithSession).session.user.id;
  const ReceivedRequests = await db.friendRequest.findMany({
    where: {
      toUserId: userId,
      fromUser: {
        OR: [
          {
            name: {
              contains: String(searchQuery),
            },
          },
          {
            id: {
              contains: String(searchQuery),
            },
          },
        ],
      },
    },
    include: {
      fromUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return res.status(200).json({ ReceivedRequests });
});

const getAvailableUsers = asyncHandler(async (req: Request, res: Response) => {
  const { searchQuery = '' } = req.query;
  const userId = (req as RequestWithSession).session.user.id;

  const AvailableUsers = await db.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: String(searchQuery),
          },
        },
        {
          id: {
            contains: String(searchQuery),
          },
        },
      ],
      NOT: {
        id: userId,
        friends: {
          some: {
            userId,
          },
        },
      },
    },
  });

  res.status(200).json({ AvailableUsers });
});

const sendFriendRequestController = asyncHandler(async (req: Request, res: Response) => {
  const fromUserId = (req as RequestWithSession).session.user.id;
  const userId = req.params.userId as string;

  if (fromUserId === userId) {
    return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
  }

  const userExists = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userExists) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const existingRequest = await db.friendRequest.findFirst({
    where: {
      fromUserId,
      toUserId: userId,
    },
  });

  if (existingRequest) {
    return res.status(409).json({ message: 'Friend request already sent.' });
  }

  const request = await db.friendRequest.create({
    data: {
      fromUserId,
      toUserId: userId,
    },
  });

  return res.status(201).json({ request });
});

const acceptFriendRequestController = asyncHandler(async (req: Request, res: Response) => {
  const toUserId = (req as RequestWithSession).session.user.id;
  const requestId = req.params.requestId as string;
  const friendRequest = await db.friendRequest.findFirst({
    where: { id: requestId, toUserId },
  });
  if (!friendRequest) {
    return res.status(404).json({ message: 'Friend request not found.' });
  }
  await db.friendship.createMany({
    data: [
      { userId: toUserId, friendId: friendRequest.fromUserId },
      { userId: friendRequest.fromUserId, friendId: toUserId },
    ],
  });
  await db.friendRequest.delete({
    where: { id: requestId },
  });
  return res.status(200).json({ message: 'Friend request accepted.' });
});

const rejectFriendRequestController = asyncHandler(async (req: Request, res: Response) => {
  const toUserId = (req as RequestWithSession).session.user.id;
  const requestId = req.params.requestId as string;
  const friendRequest = await db.friendRequest.findFirst({
    where: { id: requestId, toUserId },
  });
  if (!friendRequest) {
    return res.status(404).json({ message: 'Friend request not found.' });
  }
  await db.friendRequest.delete({
    where: { id: requestId },
  });
  return res.status(200).json({ message: 'Friend request rejected.' });
});

const removeFriendController = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as RequestWithSession).session.user.id;
  const friendId = req.params.friendId as string;
  await db.friendship.deleteMany({
    where: {
      OR: [
        { userId, friendId },
        { userId: friendId, friendId: userId },
      ],
    },
  });
  return res.status(200).json({ message: 'Friend removed.' });
});

export {
  getAllFriendController,
  getSentRequestsController,
  getReceivedRequests,
  getAvailableUsers,
  sendFriendRequestController,
  acceptFriendRequestController,
  rejectFriendRequestController,
  removeFriendController,
};
