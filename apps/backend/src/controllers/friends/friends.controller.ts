import { RequestWithSession } from '@/types/extended-request';
import { db } from '@workspace/db';
import type { Response } from 'express';
import { asyncHandler } from '@/utils/async-handler';
import { StatusCodes } from '@workspace/config';
//* GET Controllers

const getAllFriends = asyncHandler(async (req: RequestWithSession, res: Response) => {
  const userId = req.session.user.id;
  const { limit = 20, page = 0, searchQuery = '' } = req.query;

  const friendships = await db.friendship.findMany({
    where: {
      userId: {
        equals: userId,
      },
      friend: {
        OR: [
          {
            name: {
              contains: String(searchQuery),
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: String(searchQuery),
              mode: 'insensitive',
            },
          },
        ],
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

  const friends = friendships.map((friendship) => friendship.friend);

  return res.status(StatusCodes.HTTP_200_OK).json({ friends });
});

const getSentFriendRequests = asyncHandler(async (req: RequestWithSession, res: Response) => {
  const { searchQuery = '' } = req.query;
  const userId = req.session.user.id;
  const sentRequests = await db.friendRequest.findMany({
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
  return res.status(StatusCodes.HTTP_200_OK).json({ sentRequests });
});

const getReceivedFriendRequests = asyncHandler(async (req: RequestWithSession, res: Response) => {
  const { searchQuery = '' } = req.query;
  const userId = req.session.user.id;
  const receivedRequests = await db.friendRequest.findMany({
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
  return res.status(StatusCodes.HTTP_200_OK).json({ receivedRequests });
});

const getAvailableUsers = asyncHandler(async (req: RequestWithSession, res: Response) => {
  const { searchQuery = '' } = req.query;
  const userId = req.session.user.id;

  const availableUsers = await db.user.findMany({
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
      NOT: [
        {
          id: userId,
        },
        {
          friends: {
            some: {
              id: userId,
            },
          },
        },
      ],
    },
  });

  res.status(StatusCodes.HTTP_200_OK).json({ availableUsers });
});

//? POST Controllers
const sendFriendRequest = asyncHandler(async (req: RequestWithSession, res: Response) => {
  const fromUserId = req.session.user.id;
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

const acceptFriendRequest = asyncHandler(async (req: RequestWithSession, res: Response) => {
  const toUserId = req.session.user.id;
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

const rejectFriendRequest = asyncHandler(async (req: RequestWithSession, res: Response) => {
  const toUserId = req.session.user.id;
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

//! DELETE Controller
const removeFriend = asyncHandler(async (req: RequestWithSession, res: Response) => {
  const userId = req.session.user.id;
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
  getAllFriends,
  getSentFriendRequests,
  getReceivedFriendRequests,
  getAvailableUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
};
