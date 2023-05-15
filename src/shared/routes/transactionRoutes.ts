import Router from 'express';
import { CreateTransactionsController } from '@/modules/transactions/controller/CreateTransactionsController';
import { DeleteTransactionController } from '@/modules/transactions/controller/DeleteTransactionController';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { ListTransactionController } from '@/modules/transactions/controller/ListTransactionController';
import { CreateTransactionWIthRecorrenteController } from '@/modules/transactions/controller/CreateTransactionWIthRecorrenteController';
import { ResolveTransactionController } from '@/modules/transactions/controller/ResolveTransactionController';
import { ListTransactionsBySubscriptionController } from '@/modules/transactions/controller/ListTransitionsBySubscriptionController';
import { EditTransactionsCategoryAndDescriptionController } from '@/modules/transactions/controller/EditTransactionsCategoryAndDescription';
import { TransactionPdfController } from '@/modules/transactions/controller/TransactionPdfController';

const transactionRoutes = Router();

const transactionPdfController = new TransactionPdfController();
const editTransactionsCategoryAndDescriptionController =
   new EditTransactionsCategoryAndDescriptionController();
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
   '/edit/:transaction_id',
   UserAuthentication,
   async (req, res) => {
      const { body, statusCode, type } =
         await editTransactionsCategoryAndDescriptionController.handle(
            req,
            res
         );

      return res.status(statusCode)[type](body);
   }
);

transactionRoutes.patch(
   '/resolved/:transaction_id',
   UserAuthentication,
   resolveTransactionController.handle
);

/* pdf */

transactionRoutes.post('/pdf', UserAuthentication, async (req, res) => {
   const { body, statusCode } = await transactionPdfController.handle(req);
   res.status(statusCode)
      .set('Content-Type', 'application/pdf')
      .set('Content-Disposition', 'attachment; filename=arquivo.pdf')
      .send(body);
});
export { transactionRoutes };
