import Router from '@koa/router';

import { ListUserController } from '@/modules/users/useCases/ListUser/ListUserController';
import { CreateUserController } from '@/modules/users/useCases/CreateUser/CreateUserController';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';

const createUserController = new CreateUserController();
const listUserController = new ListUserController();
const userRouter = new Router();

userRouter.post('/', createUserController.handle);
userRouter.get('/', UserAuthentication, listUserController.handle);

export { userRouter };
