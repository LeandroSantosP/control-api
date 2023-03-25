import Router from 'express';
import { CreateTransactionsController } from '@/modules/transactions/useCases/CreateTransaction/CreateTransactionsController';
import { DeleteTransactionController } from '@/modules/transactions/useCases/DeleteTransaction/DeleteTransactionController';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { ListTransactionController } from '@/modules/transactions/useCases/ListTransaction/ListTransactionController';
import { GetBalenseController } from '@/modules/transactions/useCases/GetBalence/GetBalenseController';

const transactionRoutes = Router();

const createTransactionController = new CreateTransactionsController();
const listTransactionController = new ListTransactionController();
const deleteTransactionController = new DeleteTransactionController();
const getBalenseController = new GetBalenseController();

transactionRoutes.get(
   '/balense',
   UserAuthentication,
   getBalenseController.handle
);

transactionRoutes.get(
   '/',
   UserAuthentication,
   listTransactionController.handle
);

transactionRoutes.post(
   '/',
   UserAuthentication,
   createTransactionController.handle
);

transactionRoutes.delete(
   '/:transaction_id',
   UserAuthentication,
   deleteTransactionController.handle
);

export { transactionRoutes };
