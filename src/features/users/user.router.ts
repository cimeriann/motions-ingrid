import { Router } from 'express';
import { UserController } from './user.controller';
import authMiddleWare from '@middlewares/authMiddleware';

const userRouter = Router();

// public route, for creating a user
userRouter.post('/', UserController.createUser);

// other routes are protected
userRouter.use(authMiddleWare);

// authenticated routes
userRouter.get('/', UserController.getAllUsers);
userRouter.get('/id', UserController.getUserById);
userRouter.put('/', UserController.updateUser);
userRouter.delete('/:id', UserController.deleteUser);

export default userRouter;

