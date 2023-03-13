import { Router } from 'express';

import { ListUserController } from '@/modules/users/useCases/ListUser/ListUserController';
import { CreateUserController } from '@/modules/users/useCases/CreateUser/CreateUserController';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';

const userRouter = Router();

const createUserController = new CreateUserController();
const listUserController = new ListUserController();

userRouter.post('/', createUserController.handle);
userRouter.get('/', UserAuthentication, listUserController.handle);

export { userRouter };
