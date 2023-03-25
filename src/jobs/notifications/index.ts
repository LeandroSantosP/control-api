import { PushNotificationController } from '@/modules/PushNotification/PushNotificationController';

const pushNotificationController = new PushNotificationController();

pushNotificationController
   .handle()
   .then((response) => console.log(response))
   .catch((err) => console.log(err));
