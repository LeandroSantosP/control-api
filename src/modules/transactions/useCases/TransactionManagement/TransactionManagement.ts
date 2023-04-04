import { AppError } from '@/shared/infra/middleware/AppError';
import { Transaction, TransactionsCategory } from '@prisma/client';

interface IResponseBalense {
   expense: number;
   revenue: number;
   total: number;
}
interface GetSubscriptionTransactions {
   transactions: (Transaction & {
      category: TransactionsCategory;
   })[];
   user_id: string;
}

export class TransactionManagement {
   public VerifyUserIsAuthentication(
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
      transactions:
         | (Transaction & {
              category: TransactionsCategory;
           })[]
         | null
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

   public async GetTransactionFormattedWithBalense({
      transactions,
      user_id,
   }: GetSubscriptionTransactions): Promise<{
      balense: IResponseBalense | undefined;
      transactions: (Transaction & {
         category: TransactionsCategory;
      })[];
   }> {
      this.VerifyUserIsAuthentication(transactions, user_id);
      const balenseResult = this.GetMonthBalenseList(transactions);

      return { balense: balenseResult, transactions };
   }

   public verifyMonth(month: number) {
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
   }
}
