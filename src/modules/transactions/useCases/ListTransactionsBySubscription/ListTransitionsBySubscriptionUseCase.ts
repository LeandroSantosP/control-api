import { Transaction } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { ITransactionsRepository } from '../../infra/repository/ITransactionsRepository';
import { TransactionManagement } from '../TransactionManagement/TransactionManagement';

interface IRequest {
   month?: number;
   isSubscription?: boolean;
   user_id: string;
   resolved?: boolean;
   revenue?: boolean;
}

interface ListByRevenueOrResolvedTransactionProps {
   month: number | undefined;
   resolved: boolean | undefined;
   revenue: boolean | undefined;
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

   private async ListByRevenueOrResolvedTransaction({
      month,
      resolved,
      revenue,
      user_id,
   }: ListByRevenueOrResolvedTransactionProps) {
      const transactions =
         await this.TransactionRepository.ListBYRevenueOrResolvedTransactions({
            user_id,
            month,
            resolved,
            revenue,
         });

      return transactions;
   }

   async execute({
      user_id,
      isSubscription,
      month,
      resolved,
      revenue,
   }: IRequest): Promise<any> {
      if (month) {
         this.TransactionManagement.verifyMonth(month);
      }

      if ((resolved || revenue) && !isSubscription) {
         return await this.ListByRevenueOrResolvedTransaction({
            month,
            resolved,
            revenue,
            user_id,
         });
      }

      const transactions =
         await this.TransactionRepository.ListSubscriptionWithOrNot({
            user_id: user_id,
            month,
            isSubscription,
         });

      const transactionFormatted =
         await this.TransactionManagement.GetTransactionFormattedWithBalense({
            transactions,
            user_id,
         });

      return transactionFormatted;
   }
}
