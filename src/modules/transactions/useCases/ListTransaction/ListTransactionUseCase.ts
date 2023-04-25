import { Transaction } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { ITransactionsRepository } from '../../infra/repository/ITransactionsRepository';
import { TransactionManagement } from '../TransactionManagement/TransactionManagement';

interface IRequest {
   month?: number | undefined;
   user_id: string;
}

@injectable()
export class ListTransactionUseCase {
   private TransactionManagement;
   constructor(
      @inject('TransactionsRepository')
      private TransactionRepository: ITransactionsRepository
   ) {
      this.TransactionManagement = new TransactionManagement();
   }

   async execute({ user_id, month }: IRequest) {
      if (month === undefined) {
         const transactions =
            await this.TransactionRepository.ListUserTransactionsById(user_id);

         this.TransactionManagement.VerifyUserIsAuthentication(
            transactions,
            user_id
         );

         const response =
            await this.TransactionManagement.GetTransactionFormattedWithBalense(
               {
                  transactions,
                  user_id,
               }
            );

         return {
            balense: response.balense,
            total: response.balense?.total,
            transactions,
         };
      }

      this.TransactionManagement.verifyMonth(month);

      const allUserTransactions = await this.TransactionRepository.list({
         user_id,
      });

      const Transactions = allUserTransactions.filter((transaction) => {
         const dueDate = transaction.due_date
            ? new Date(transaction.due_date)
            : null;
         const filingDate = transaction.filingDate
            ? new Date(transaction.filingDate)
            : null;

         return (
            (dueDate && dueDate.getMonth() + 1 === Number(month)) ||
            (filingDate && filingDate.getMonth() + 1 === Number(month))
         );
      });

      this.TransactionManagement.VerifyUserIsAuthentication(
         Transactions,
         user_id
      );

      const response =
         await this.TransactionManagement.GetTransactionFormattedWithBalense({
            transactions: Transactions as any,
            user_id,
         });

      return {
         monthBalense: response.balense,
         transactions: Transactions,
         total: response.balense?.total,
      };
   }
}
