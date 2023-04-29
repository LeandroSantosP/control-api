import { Router } from 'express';
import multer from 'multer';
import { ListUserController } from '@/modules/users/useCases/ListUser/ListUserController';
import { CreateUserController } from '@/modules/users/useCases/CreateUser/CreateUserController';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { DeleteUserController } from '@/modules/users/useCases/DeleteUser/DeleteUserController';
import { UpdatedUserController } from '@/modules/users/useCases/UpdatedUser/UpdatedUserController';
import { ConfigurationProfileController } from '@/modules/Profile/useCases/ConfigurationProfile/ConfigurationProfileController';
import { setUpdateField } from '../infra/middleware/UpdatedField';
import { GerProfileController } from '@/modules/Profile/useCases/GetProfileConfig/GetProfileController';

const userRouter = Router();

const uploadFile = multer({ storage: multer.memoryStorage() });

const createUserController = new CreateUserController();
const listUserController = new ListUserController();
const deleteUserController = new DeleteUserController();
const updatedUserController = new UpdatedUserController();

userRouter.get('/', UserAuthentication, listUserController.handle);
userRouter.post('/create', createUserController.handle);
userRouter.put('/updated', UserAuthentication, updatedUserController.handle);
userRouter.delete('/:pass', UserAuthentication, deleteUserController.handle);

/* Profile */
const configurationProfileController = new ConfigurationProfileController();
const getProfileController = new GerProfileController();

userRouter.patch(
   '/avatar',
   UserAuthentication,
   uploadFile.single('avatar'),
   configurationProfileController.handle
);

userRouter.post(
   '/profile',
   UserAuthentication,
   uploadFile.single('avatar'),
   setUpdateField(false),
   async (req, res) => {
      const { body, statusCode, type } =
         await configurationProfileController.handle(req, res);

      return res.status(statusCode)[type](body);
   }
);

userRouter.patch(
   '/profile',
   UserAuthentication,
   uploadFile.single('avatar'),
   setUpdateField(true),
   async (req, res) => {
      const { body, statusCode, type } =
         await configurationProfileController.handle(req, res);

      return res.status(statusCode)[type](body);
   }
);

userRouter.get('/profile', UserAuthentication, async (req, res) => {
   const { body, statusCode, type } = await getProfileController.handle(req);
   return res.status(statusCode)[type](body);
});

export { userRouter };
