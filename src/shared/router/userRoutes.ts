import { Router } from 'express';

import { ListUserController } from '@/modules/users/useCases/ListUser/ListUserController';
import { CreateUserController } from '@/modules/users/useCases/CreateUser/CreateUserController';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { DeleteUserController } from '@/modules/users/useCases/DeleteUser/DeleteUserController';

const userRouter = Router();

const createUserController = new CreateUserController();
const listUserController = new ListUserController();
const deleteUserController = new DeleteUserController();

userRouter.post('/', createUserController.handle);
userRouter.get('/', UserAuthentication, listUserController.handle);
userRouter.delete('/:pass', UserAuthentication, deleteUserController.handle);

export { userRouter };
