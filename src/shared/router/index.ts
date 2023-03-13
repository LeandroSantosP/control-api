import Router from '@koa/router';

import { AuthRoutes } from './AuthenticationRoutes';
import { transactionRoutes } from './transactionRoutes';
import { userRouter } from './userRoutes';

const allRoutes = new Router();

allRoutes.use('/users', userRouter.routes());
allRoutes.use('/auth', AuthRoutes.routes());
allRoutes.use('/transaction', transactionRoutes.routes());

export { allRoutes };
