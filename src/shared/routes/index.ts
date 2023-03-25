import { Router } from 'express';
import { adminRoutes } from './AdminRoutes';

import { AuthRoutes } from './AuthenticationRoutes';
import { transactionRoutes } from './transactionRoutes';
import { userRouter } from './userRoutes';

const allRoutes = Router();

allRoutes.use('/admin', adminRoutes);
allRoutes.use('/user', userRouter);
allRoutes.use('/auth', AuthRoutes);
allRoutes.use('/transaction', transactionRoutes);

export { allRoutes };
