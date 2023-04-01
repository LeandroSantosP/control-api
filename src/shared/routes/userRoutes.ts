import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { resolve } from 'path';

import { ListUserController } from '@/modules/users/useCases/ListUser/ListUserController';
import { CreateUserController } from '@/modules/users/useCases/CreateUser/CreateUserController';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { DeleteUserController } from '@/modules/users/useCases/DeleteUser/DeleteUserController';
import { UpdatedUserController } from '@/modules/users/useCases/UpdatedUser/UpdatedUserController';
import { UploadUserAvatarController } from '@/modules/users/useCases/UploadUserAvatar/UploadUserAvatarContoller';
import UploadConfig from '@/config/UploadConfig';

const userRouter = Router();

const uploadFile = multer(UploadConfig);

const createUserController = new CreateUserController();
const listUserController = new ListUserController();
const deleteUserController = new DeleteUserController();
const updatedUserController = new UpdatedUserController();
const uploadUserAvatarController = new UploadUserAvatarController();

userRouter.get('/', UserAuthentication, listUserController.handle);
userRouter.post('/create', createUserController.handle);
userRouter.put('/updated', UserAuthentication, updatedUserController.handle);
userRouter.patch(
   '/avatar',
   UserAuthentication,
   uploadFile.single('avatar'),
   uploadUserAvatarController.handle
);
userRouter.delete('/:pass', UserAuthentication, deleteUserController.handle);

export { userRouter };