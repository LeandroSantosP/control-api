import Router from 'express';
import { CreateTransactionsController } from '@/modules/transactions/useCases/CreateTransaction/CreateTransactionsController';
import { DeleteTransactionController } from '@/modules/transactions/useCases/DeleteTransaction/DeleteTransactionController';
import { UserAuthentication } from '../infra/middleware/UserAuthentication';
import { ListTransactionController } from '@/modules/transactions/useCases/ListTransaction/ListTransactionController';
import { CreateTransactionWIthRecorrenteController } from '@/modules/transactions/useCases/CreateTransactionWIthRecorrence/CreateTransactionWIthRecorrenteController';
import { ResolveTransactionController } from '@/modules/transactions/useCases/ResolveTransaction/ResolveTransactionController';

const transactionRoutes = Router();

const createTransactionController = new CreateTransactionsController();
const createTransactionWIthRecorrenteController =
   new CreateTransactionWIthRecorrenteController();
const listTransactionController = new ListTransactionController();
const deleteTransactionController = new DeleteTransactionController();
const resolveTransactionController = new ResolveTransactionController();

/*
Fields:{
   month: number | undefined
}: req.query

Campos2:{
   bySubscription: boolean | undefined
}: req.query

filter todas as traslações ou informe um mes especifico, passo no body o "bySubscription",
para filtrar pelo inscrições, também com a opção de informar o mes
*/

transactionRoutes.get(
   '/',
   UserAuthentication,
   listTransactionController.handle
);

/*
Fields:{
   description: string,
   value: string,
   dueDate: string yyyy-mm-dd | undefined,
   categoryType:string | undefined
}: Body

Crated a new transaction where it can be an revenue or expense
(Can not contais reference)
If it's an expense, must be an due date!
*/

/* Fix decimal dot */
transactionRoutes.post(
   '/',
   UserAuthentication,
   createTransactionController.handle
);

/*
Fields :{
      description: string,
      value: string,
      due_date: string,
      recurrence: string,
      categoryType:string | undefined
      isSubscription: boolean | undefined,
      installments: number | undefined,
}: Body


Created a new transaction, it can be only an expense (with recorrência)
caso seja um inscrição deve conter obrigatoriamente o numero de installments
(If it's a subscriptions,it must be the number of subscriptions)
*/
transactionRoutes.post(
   '/recurrent',
   UserAuthentication,
   createTransactionWIthRecorrenteController.handle
);

/*
Fields: {
   transaction_id: string
}: req.params
*/

/* Delete an transaction by id */
transactionRoutes.delete(
   '/:transaction_id',
   UserAuthentication,
   deleteTransactionController.handle
);

/*
Fields: {
   transaction_id: string
}: req.params
*/

/* Mark a transaction as resolved */
transactionRoutes.patch(
   '/resolved/:transaction_id',
   UserAuthentication,
   resolveTransactionController.handle
);

export { transactionRoutes };
