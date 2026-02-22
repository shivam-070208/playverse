import * as FriendsController from '@/controllers/friends/friends.controller';
import express from 'express';
import type { Router } from 'express';
import { isAuthorize, isEmailVerified } from '@/middlewares/auth.middleware';

const friendsRouter: Router = express.Router();

// middlewares
friendsRouter.use(isAuthorize);
friendsRouter.use(isEmailVerified);

// routes
//? GET Request
friendsRouter.get('/', FriendsController.getAllFriends);
friendsRouter.get('/requests/sent', FriendsController.getSentFriendRequests);
friendsRouter.get('/requests/received', FriendsController.getReceivedFriendRequests);
friendsRouter.get('/available', FriendsController.getAvailableUsers);

//* POST Requests
friendsRouter.post('/request/send/:userId', FriendsController.sendFriendRequest);
friendsRouter.post('/request/accept/:requestId', FriendsController.acceptFriendRequest);
friendsRouter.post('/request/rejects/:requestId', FriendsController.rejectFriendRequest);

//! DELETE Request
friendsRouter.delete('/remove/:friendId', FriendsController.removeFriend);

export default friendsRouter;
