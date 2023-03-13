import { CreateTransactionsController } from '@/modules/transactions/useCases/CreateTransaction.ts/CreateTransactionsController';
import Router from 'express';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';

const transactionRoutes = Router();

const createTransactionController = new CreateTransactionsController();

transactionRoutes.post(
  '/',
  UserAuthentication,
  createTransactionController.handle
);

export { transactionRoutes };
