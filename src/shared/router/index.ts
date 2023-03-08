import Router from '@koa/router';
import { AuthRoutes } from './AuthenticationRoutes';
import { userRouter } from './userRoutes';

const allRoutes = new Router();

allRoutes.use('/users', userRouter.routes());
allRoutes.use('/auth', AuthRoutes.routes());

export { allRoutes };
