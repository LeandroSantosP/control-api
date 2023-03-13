import { CreateTransactionsController } from '@/modules/transactions/useCases/CreateTransaction.ts/CreateTransactionsController';
import Router from '@koa/router';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';

const transactionRoutes = new Router();

const createTransactionController = new CreateTransactionsController();

transactionRoutes.post(
  '/',
  UserAuthentication,
  createTransactionController.handle
);

export { transactionRoutes };
