import { AppError } from '@/shared/infra/middleware/AppError';
import { Transaction } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { ITransactionsRepository } from '../../infra/repository/ITransactionsRepository';

interface IResponseBalense {
   expense: number;
   revenue: number;
   total: number;
}

interface IRequest {
   month?: number | undefined;
   user_id: string;
   bySubscription?: boolean;
}

interface GetSubscriptionTransactions {
   transactions: Transaction[];
   user_id: string;
   verify: (
      transactions: Transaction[] | null,
      user_id: string
   ) => void | undefined;
   getBalense: (
      transactions: Transaction[] | null
   ) => IResponseBalense | undefined;
}

@injectable()
export class ListTransactionUseCase {
   constructor(
      @inject('TransactionsRepository')
      private TransactionRepository: ITransactionsRepository
   ) {}

   private VerifyUserIsAuthentication(
      transactions: Transaction[] | null,
      user_id: string
   ) {
      return transactions?.forEach((transaction) => {
         if (transaction.userId !== user_id) {
            throw new AppError('Not Authorization!');
         }
      });
   }

   private GetMonthBalenseList(
      transactions: Transaction[] | null
   ): IResponseBalense | undefined {
      const balense = transactions?.reduce(
         (storage, transaction) => {
            const transactionValue = Number(transaction.value);

            let expense = 0;
            let revenue = 0;

            if (transactionValue < 0) {
               expense = transactionValue;
            } else {
               revenue = transactionValue;
            }

            storage.expense = storage.expense + expense;
            storage.revenue = storage.revenue + revenue;

            storage.total = storage.revenue + storage.expense;

            return storage;
         },
         { expense: 0, revenue: 0, total: 0 }
      );

      if (balense) {
         Object.keys(balense).forEach((key: string) => {
            // @ts-ignore
            balense[key] = Number(balense[key]).toFixed(2);
         });
      }

      return balense;
   }

   private async GetTransactionBySubscription({
      getBalense,
      transactions,
      user_id,
      verify,
   }: GetSubscriptionTransactions): Promise<{
      balense: IResponseBalense | undefined;
      transactions: Transaction[];
   }> {
      verify(transactions, user_id);
      const balenseResult = getBalense(transactions);

      return { balense: balenseResult, transactions };
   }

   async execute({ user_id, month, bySubscription }: IRequest): Promise<any> {
      if (month === undefined) {
         const transactions =
            await this.TransactionRepository.ListUserTransactionsById(user_id);

         this.VerifyUserIsAuthentication(transactions, user_id);
         const balense = this.GetMonthBalenseList(transactions);
         return { transactions, balense };
      }

      if (isNaN(month) || !month) {
         throw new AppError('Invalid format, must be a number!');
      }

      if (month < 1 || month > 12) {
         throw new AppError(
            'Just Filter By Month between 1 and 12 ' +
               month +
               ' IsInvalid Mount'
         );
      }

      if (bySubscription) {
         if (month) {
            const transactions =
               await this.TransactionRepository.ListBySubscription({
                  user_id: user_id,
                  month,
               });

            const transactionSubscriptionByMonth =
               await this.GetTransactionBySubscription({
                  getBalense: this.GetMonthBalenseList,
                  verify: this.VerifyUserIsAuthentication,
                  transactions,
                  user_id,
               });

            return transactionSubscriptionByMonth;
         }

         const transactions =
            await this.TransactionRepository.ListBySubscription({
               user_id: user_id,
               month,
            });

         const AllTransactionSubscription =
            await this.GetTransactionBySubscription({
               getBalense: this.GetMonthBalenseList,
               verify: this.VerifyUserIsAuthentication,
               transactions,
               user_id,
            });

         return AllTransactionSubscription;
      }

      const transactionByMonth = await this.TransactionRepository.ListByMonth({
         user_id,
         month: month,
      });

      this.VerifyUserIsAuthentication(transactionByMonth, user_id);

      const balense = this.GetMonthBalenseList(transactionByMonth);

      return {
         monthBalense: balense,
         transactions: transactionByMonth,
         total: balense?.total,
      };
   }
}
