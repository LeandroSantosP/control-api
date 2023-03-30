import { Category, Transaction, User } from '@prisma/client';

export interface ITransactionsRepositoryProps {
   value: string;
   description: string;
   email: string;
   dueDate?: string;
   Category?: Category;
}

export interface ICreateTransactionInstallments {
   isSubscription?: boolean;
   installments?: number;
   dueDate?: string;
   email: string;
   value: string;
   description: string;
   categoryType: Category | undefined;
   recurrence: 'monthly' | 'daily' | 'yearly';
}

export abstract class ITransactionsRepository {
   abstract create({
      description,
      value,
      email,
      Category,
   }: ITransactionsRepositoryProps): Promise<
      Transaction & {
         category: {
            name: Category;
         };
      }
   >;

   abstract CreateTransactionInstallments(
      props: ICreateTransactionInstallments
   ): Promise<
      Transaction & {
         category: {
            name: Category;
         };
      }
   >;

   abstract ListUserTransactionsById(
      user_id: string
   ): Promise<Transaction[] | null>;

   abstract ListAllADM(user_id?: string): Promise<Transaction[]>;

   abstract remove(transaction_id: string): Promise<string>;

   abstract GetTransactionById(
      transaction_id: string
   ): Promise<Transaction | null>;

   abstract ListByMonth({
      user_id,
      month,
   }: {
      user_id: string;
      month: number;
   }): Promise<Transaction[]>;

   abstract GetDailyTransactions(user_id: string): Promise<
      (Transaction & {
         author: User;
      })[]
   >;

   abstract resolved(transaction_id: string): Promise<Transaction>;
}
