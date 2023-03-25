import { Router } from 'express';

import { ListUserController } from '@/modules/users/useCases/ListUser/ListUserController';
import { CreateUserController } from '@/modules/users/useCases/CreateUser/CreateUserController';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { DeleteUserController } from '@/modules/users/useCases/DeleteUser/DeleteUserController';
import { UpdatedUserController } from '@/modules/users/useCases/UpdatedUser/UpdatedUserController';

const userRouter = Router();

const createUserController = new CreateUserController();
const listUserController = new ListUserController();
const deleteUserController = new DeleteUserController();
const updatedUserController = new UpdatedUserController();

userRouter.get('/', UserAuthentication, listUserController.handle);
userRouter.post('/create', createUserController.handle);
userRouter.put('/updated', UserAuthentication, updatedUserController.handle);
userRouter.delete('/:pass', UserAuthentication, deleteUserController.handle);

export { userRouter };
