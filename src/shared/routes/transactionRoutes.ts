import Router from 'express';
import { CreateTransactionsController } from '@/modules/transactions/controller/CreateTransactionsController';
import { DeleteTransactionController } from '@/modules/transactions/controller/DeleteTransactionController';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { ListTransactionController } from '@/modules/transactions/controller/ListTransactionController';
import { CreateTransactionWIthRecorrenteController } from '@/modules/transactions/controller/CreateTransactionWIthRecorrenteController';
import { ResolveTransactionController } from '@/modules/transactions/controller/ResolveTransactionController';
import { ListTransactionsBySubscriptionController } from '@/modules/transactions/controller/ListTransitionsBySubscriptionController';

const transactionRoutes = Router();

const createTransactionController = new CreateTransactionsController();
const createTransactionWIthRecorrenteController =
   new CreateTransactionWIthRecorrenteController();
const listTransactionController = new ListTransactionController();
const listTransactionsBySubscriptionController =
   new ListTransactionsBySubscriptionController();
const deleteTransactionController = new DeleteTransactionController();
const resolveTransactionController = new ResolveTransactionController();

transactionRoutes.get('/', UserAuthentication, async (req, res) => {
   const { body, statusCode, type } = await listTransactionController.handle(
      req,
      res
   );
   return res.status(statusCode)[type](body || undefined);
});

transactionRoutes.get(
   '/bySubscriptions',
   UserAuthentication,
   listTransactionsBySubscriptionController.handle
);

transactionRoutes.post('/', UserAuthentication, async (req, res) => {
   const { body, statusCode, type } = await createTransactionController.handle(
      req,
      res
   );
   return res.status(statusCode)[type](body || undefined);
});

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

transactionRoutes.patch(
   '/resolved/:transaction_id',
   UserAuthentication,
   resolveTransactionController.handle
);

export { transactionRoutes };
