import {
  acceptFriendRequestController,
  getAllFriendController,
  getAvailableUsers,
  getReceivedRequests,
  getSentRequestsController,
  rejectFriendRequestController,
  sendFriendRequestController,
} from '@/controllers/friends/friends.controller';
import express from 'express';
import type { Router } from 'express';
import { isAuthorize, isEmailVerified } from '@/middlewares/auth.middleware';

const friendsRouter: Router = express.Router();

// middlewares
friendsRouter.use(isAuthorize);
friendsRouter.use(isEmailVerified);

// routes
//? GET Request
friendsRouter.get('/', getAllFriendController);
friendsRouter.get('/requests/sent', getSentRequestsController);
friendsRouter.get('/requests/received', getReceivedRequests);
friendsRouter.get('/available', getAvailableUsers);

//* POST Requests
friendsRouter.post('/request/send/:userId', sendFriendRequestController);
friendsRouter.post('/request/accept/:requestId', acceptFriendRequestController);
friendsRouter.post('/request/rejects/:requestId', rejectFriendRequestController);

//! DELETE Request
friendsRouter.delete('/remove/:friendId');

export default friendsRouter;
