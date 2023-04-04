import { Transaction } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { ITransactionsRepository } from '../../infra/repository/ITransactionsRepository';
import { TransactionManagement } from '../TransactionManagement/TransactionManagement';

interface IRequest {
   month?: number;
   isSubscription?: boolean;
   user_id: string;
}

@injectable()
export class ListTransitionsBySubscriptionUseCase {
   private TransactionManagement: TransactionManagement;
   constructor(
      @inject('TransactionsRepository')
      private TransactionRepository: ITransactionsRepository<Transaction>
   ) {
      this.TransactionManagement = new TransactionManagement();
   }

   async execute({ isSubscription, month, user_id }: IRequest) {
      if (month) {
         this.TransactionManagement.verifyMonth(month);
      }

      const transactions =
         await this.TransactionRepository.ListSubscriptionWithOrNot({
            user_id: user_id,
            month,
            isSubscription,
         });

      console.log(transactions);

      const transactionFormatted =
         await this.TransactionManagement.GetTransactionFormattedWithBalense({
            transactions,
            user_id,
         });

      return transactionFormatted;
   }
}
