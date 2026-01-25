import express, { Router } from 'express';
import { isAuthorize } from 'src/middlewares/auth.middleware';

const userRouter: Router = express.Router();

// middleware for session verification
userRouter.use(isAuthorize);

export default userRouter;
