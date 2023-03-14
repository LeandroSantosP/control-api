import { CreateTransactionsController } from '@/modules/transactions/useCases/CreateTransaction.ts/CreateTransactionsController';
import { ListTransactionOfUserController } from '@/modules/transactions/useCases/ListTransactionOfUser/ListTransactionOfUserController';
import Router from 'express';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';

const transactionRoutes = Router();

const createTransactionController = new CreateTransactionsController();
const listTransactionOfUserController = new ListTransactionOfUserController();

transactionRoutes.post(
  '/',
  UserAuthentication,
  createTransactionController.handle
);

transactionRoutes.get(
  '/',
  UserAuthentication,
  listTransactionOfUserController.handle
);

export { transactionRoutes };
