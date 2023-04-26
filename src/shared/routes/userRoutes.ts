import { Router } from 'express';
import multer from 'multer';
import { ListUserController } from '@/modules/users/useCases/ListUser/ListUserController';
import { CreateUserController } from '@/modules/users/useCases/CreateUser/CreateUserController';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { DeleteUserController } from '@/modules/users/useCases/DeleteUser/DeleteUserController';
import { UpdatedUserController } from '@/modules/users/useCases/UpdatedUser/UpdatedUserController';
// import { UploadUserAvatarController } from '@/modules/Profile/useCases/UploadUserAvatar/UploadUserAvatarContoller';
import UploadConfig from '@/config/UploadConfig';
import { ConfigurationProfileController } from '@/modules/Profile/useCases/ConfigurationProfile/ConfigurationProfileController';

const userRouter = Router();

const uploadFile = multer(UploadConfig);

const createUserController = new CreateUserController();
const listUserController = new ListUserController();
const deleteUserController = new DeleteUserController();
const updatedUserController = new UpdatedUserController();
const configurationProfileController = new ConfigurationProfileController();

userRouter.get('/', UserAuthentication, listUserController.handle);
userRouter.post('/create', createUserController.handle);
userRouter.put('/updated', UserAuthentication, updatedUserController.handle);
userRouter.delete('/:pass', UserAuthentication, deleteUserController.handle);

/* Profile */

userRouter.patch(
   '/avatar',
   UserAuthentication,
   uploadFile.single('avatar'),
   configurationProfileController.handle
);

export { userRouter };
