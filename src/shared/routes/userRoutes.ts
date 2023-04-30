import { Router } from 'express';
import multer from 'multer';
import { ConfigurationProfileController } from '@/modules/Profile/controller/ConfigurationProfileController';
import { GerProfileController } from '@/modules/Profile/controller/GetProfileController';

import { setUpdateField } from '../infra/middleware/UpdatedField';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { CreateUserController } from '@/modules/users/controller/CreateUserController';
import { ListUserController } from '@/modules/users/controller/ListUserController';
import { DeleteUserController } from '@/modules/users/controller/DeleteUserController';
import { UpdatedUserController } from '@/modules/users/controller/UpdatedUserController';
import { InviteEmailResetPassController } from '@/modules/users/controller/InviteEmailResetPassController';
import { ResetPassWordController } from '@/modules/users/controller/ResetPassWordController';

const userRouter = Router();
const uploadFile = multer({ storage: multer.memoryStorage() });

const createUserController = new CreateUserController();
const listUserController = new ListUserController();
const deleteUserController = new DeleteUserController();
const updatedUserController = new UpdatedUserController();
const inviteEmailResetPassController = new InviteEmailResetPassController();
const resetPassWordController = new ResetPassWordController();

userRouter.get('/', UserAuthentication, listUserController.handle);
userRouter.post('/create', createUserController.handle);
userRouter.put('/updated', UserAuthentication, updatedUserController.handle);
userRouter.delete('/:pass', UserAuthentication, deleteUserController.handle);

userRouter.post('/invite', async (req, res) => {
   const { body, statusCode, type } =
      await inviteEmailResetPassController.handle(req);

   return res.status(statusCode)[type](body);
});

userRouter.patch('/resetpass/:resetToken', async (req, res) => {
   const { body, statusCode, type } = await resetPassWordController.handle(req);
   res.status(statusCode)[type](body);
});

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
