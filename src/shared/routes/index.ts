import { Router } from 'express';
import { adminRoutes } from './AdminRoutes';

import { AuthRoutes } from './AuthenticationRoutes';
import { pushNotificationRoutes } from './PushNotification';
import { transactionRoutes } from './transactionRoutes';
import { userRouter } from './userRoutes';
import { GoalsRoutes } from './GoalsRoutes';

const allRoutes = Router();
allRoutes.use('/goals', GoalsRoutes);
allRoutes.use('/admin', adminRoutes);
allRoutes.use('/user', userRouter);
allRoutes.use('/auth', AuthRoutes);
allRoutes.use('/transaction', transactionRoutes);
allRoutes.use('/push', pushNotificationRoutes);

export { allRoutes };
