import Router from 'express';
import { CreateTransactionsController } from '@/modules/transactions/useCases/CreateTransaction/CreateTransactionsController';
import { DeleteTransactionController } from '@/modules/transactions/useCases/DeleteTransaction/DeleteTransactionController';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { ListTransactionController } from '@/modules/transactions/useCases/ListTransaction/ListTransactionController';
import { CreateTransactionWIthRecorrenteController } from '@/modules/transactions/useCases/CreateTransactionWIthRecorrence/CreateTransactionWIthRecorrenteController';

const transactionRoutes = Router();

const createTransactionController = new CreateTransactionsController();
const createTransactionWIthRecorrenteController =
   new CreateTransactionWIthRecorrenteController();
const listTransactionController = new ListTransactionController();
const deleteTransactionController = new DeleteTransactionController();

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

transactionRoutes.post(
   '/recurrent',
   UserAuthentication,
   createTransactionWIthRecorrenteController.handle
);

transactionRoutes.delete(
   '/:transaction_id',
   UserAuthentication,
   deleteTransactionController.handle
);

export { transactionRoutes };
