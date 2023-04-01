import {
   Category,
   Prisma,
   Recurrence,
   Transaction,
   User,
} from '@prisma/client';

export interface ITransactionsRepositoryProps {
   value: string;
   description: string;
   email: string;
   dueDate?: string;
   Category?: Category;
   resolved?: boolean;
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

export interface ListBySubscription {
   user_id: string;
   month?: number;
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
   ): Promise<{
      description: string;
      value: Prisma.Decimal;
      resolved: boolean;
      recurrence: Recurrence | null;
      installments: number | null;
      isSubscription: boolean | null;
      due_date: Date | null;
      created_at: Date;
      category: any;
   }>;

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

   abstract ListBySubscription({
      user_id,
      month,
   }: ListBySubscription): Promise<Transaction[]>;
}
