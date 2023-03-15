import { ListTransactionOfUserController } from '@/modules/Admin/ListTransactionOfUser/ListTransactionOfUserController';
import { Router } from 'express';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';

const listTransactionOfUserController = new ListTransactionOfUserController();

const adminRoutes = Router();

adminRoutes.get(
  '/transactions/:user_id?',
  UserAuthentication,
  listTransactionOfUserController.handle
);

export { adminRoutes };
