import { Router } from 'express';

import { AuthRoutes } from './AuthenticationRoutes';
import { transactionRoutes } from './transactionRoutes';
import { userRouter } from './userRoutes';

const allRoutes = Router();

allRoutes.use('/users', userRouter);
allRoutes.use('/auth', AuthRoutes);
allRoutes.use('/transaction', transactionRoutes);

export { allRoutes };
