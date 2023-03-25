import { ListTransactionOfUserController } from '@/modules/Admin/ListTransactionOfUser/ListTransactionOfUserController';
import { PushNotificationController } from '@/modules/PushNotification/PushNotificationController';
import { Router } from 'express';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';

const listTransactionOfUserController = new ListTransactionOfUserController();

const pushNotificationController = new PushNotificationController();

const adminRoutes = Router();

adminRoutes.get(
   '/transactions/:user_id?',
   UserAuthentication,
   listTransactionOfUserController.handle
);

adminRoutes.get('/notification', pushNotificationController.handle);

export { adminRoutes };
