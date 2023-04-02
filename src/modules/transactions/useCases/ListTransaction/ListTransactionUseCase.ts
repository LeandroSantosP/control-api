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

      const transactionByMonth = await this.TransactionRepository.ListByMonth({
         user_id,
         month: month,
      });

      this.TransactionManagement.VerifyUserIsAuthentication(
         transactionByMonth,
         user_id
      );

      const response =
         await this.TransactionManagement.GetTransactionFormattedWithBalense({
            transactions: transactionByMonth,
            user_id,
         });

      return {
         monthBalense: response.balense,
         transactions: transactionByMonth,
         total: response.balense?.total,
      };
   }
}
