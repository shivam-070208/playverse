import { RequestWithSession } from '@/types/extended-request';
import { db } from '@workspace/db';
import type { Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler';
import { StatusCodes } from '@workspace/config';
//* GET Controller

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
  return res.status(StatusCodes.HTTP_200_OK).json({ Friends });
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
  return res.status(StatusCodes.HTTP_200_OK).json({ SentRequests });
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
  return res.status(StatusCodes.HTTP_200_OK).json({ ReceivedRequests });
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

  res.status(StatusCodes.HTTP_200_OK).json({ AvailableUsers });
});

//? POST CONTROLLER
const sendFriendRequestController = asyncHandler(async (req: Request, res: Response) => {
  const fromUserId = (req as RequestWithSession).session.user.id;
  const userId = req.params.userId as string;

  if (fromUserId === userId) {
    return res
      .status(StatusCodes.HTTP_400_BAD_REQUEST)
      .json({ message: 'You cannot send a friend request to yourself.' });
  }

  const userExists = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userExists) {
    return res.status(StatusCodes.HTTP_404_NOT_FOUND).json({ message: 'User not found.' });
  }

  const existingRequest = await db.friendRequest.findFirst({
    where: {
      fromUserId,
      toUserId: userId,
    },
  });

  if (existingRequest) {
    return res
      .status(StatusCodes.HTTP_409_CONFLICT)
      .json({ message: 'Friend request already sent.' });
  }

  const request = await db.friendRequest.create({
    data: {
      fromUserId,
      toUserId: userId,
    },
  });

  return res.status(StatusCodes.HTTP_201_CREATED).json({ request });
});

const acceptFriendRequestController = asyncHandler(async (req: Request, res: Response) => {
  const toUserId = (req as RequestWithSession).session.user.id;
  const requestId = req.params.requestId as string;
  const result = await db.$transaction(async (prisma) => {
    const friendRequest = await prisma.friendRequest.findFirst({
      where: { id: requestId, toUserId },
    });
    if (!friendRequest) {
      return { notFound: true };
    }
    await prisma.friendship.createMany({
      data: [
        { userId: toUserId, friendId: friendRequest.fromUserId },
        { userId: friendRequest.fromUserId, friendId: toUserId },
      ],
    });
    await prisma.friendRequest.delete({
      where: { id: requestId },
    });
    return { notFound: false };
  });

  if (result.notFound) {
    return res
      .status(StatusCodes.HTTP_404_NOT_FOUND)
      .json({ message: 'Friend request not found.' });
  }
  return res.status(StatusCodes.HTTP_200_OK).json({ message: 'Friend request accepted.' });
});

const rejectFriendRequestController = asyncHandler(async (req: Request, res: Response) => {
  const toUserId = (req as RequestWithSession).session.user.id;
  const requestId = req.params.requestId as string;
  const friendRequest = await db.friendRequest.findFirst({
    where: { id: requestId, toUserId },
  });
  if (!friendRequest) {
    return res
      .status(StatusCodes.HTTP_404_NOT_FOUND)
      .json({ message: 'Friend request not found.' });
  }
  await db.friendRequest.delete({
    where: { id: requestId },
  });
  return res.status(StatusCodes.HTTP_200_OK).json({ message: 'Friend request rejected.' });
});

//! DELETE CONTROLLER
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
  return res.status(StatusCodes.HTTP_200_OK).json({ message: 'Friend removed.' });
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
