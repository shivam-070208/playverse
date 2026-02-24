import express from 'express';
import type { Router } from 'express';
import { isAuthorize } from '@/middlewares/auth.middleware';
import * as ChatController from '@/controllers/chat/chat.controller';
const chatRouter: Router = express.Router();

chatRouter.use(isAuthorize);

chatRouter.get('/:id/messages', ChatController.getMessages);

export default chatRouter;
