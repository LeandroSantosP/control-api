import { PushNotificationController } from '@/modules/PushNotification/PushNotificationController';
import Router from 'express';

const pushNotificationRoutes = Router();

const pushNotificationController = new PushNotificationController();
pushNotificationRoutes.post('/', pushNotificationController.handle);

export { pushNotificationRoutes };
