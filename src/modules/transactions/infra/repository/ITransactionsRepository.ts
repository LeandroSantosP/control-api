import {
   Prisma,
   Transaction,
   TransactionsCategory,
   User,
   Category,
   Recurrence as RecurrenceProps,
} from '@prisma/client';
import { CategoryProps } from '../Entity/Category';
import { Model } from '../Entity/Model';

export interface ITransactionsRepositoryProps {
   value: string;
   description: string;
   email: string;
   dueDate?: string;
   Category?: Category;
   resolved?: boolean;
   filingDate?: string;
}

export interface ICreateTransactionInstallments {
   isSubscription?: boolean;
   installments?: number;
   dueDate?: string;
   email: string;
   value: string;
   description: string;
   categoryType: CategoryProps | undefined;
   recurrence: RecurrenceProps | undefined;
}

export interface ListBySubscription {
   user_id: string;
   month?: number;
   isSubscription?: boolean;
}

export interface ListBYRevenueOrResolvedTransactionsProps {
   resolved?: boolean;
   revenue?: boolean;
   user_id: string;
   month?: number;
}

export abstract class ITransactionsRepository extends Model<any, Transaction> {
   abstract create(props: ITransactionsRepositoryProps): Promise<
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
      recurrence: RecurrenceProps | null;
      installments: number | null;
      isSubscription: boolean | null;
      due_date: Date | null;
      created_at: Date;
      category: CategoryProps | null;
   }>;

   abstract ListUserTransactionsById(user_id: string): Promise<
      (Transaction & {
         category: TransactionsCategory;
      })[]
   >;

   abstract ListAllADM(user_id?: string): Promise<any[]>;

   abstract delete(transaction_id: string): Promise<Transaction>;

   abstract GetTransactionById(transaction_id: string): Promise<any | null>;

   abstract ListByMonth({
      user_id,
      month,
   }: {
      user_id: string;
      month: number;
   }): Promise<
      (Transaction & {
         category: TransactionsCategory;
      })[]
   >;

   abstract GetDailyTransactions(user_id: string): Promise<
      (any & {
         author: User;
      })[]
   >;

   abstract resolved(transaction_id: string): Promise<any>;

   abstract ListSubscriptionWithOrNot({
      user_id,
      month,
      isSubscription,
   }: ListBySubscription): Promise<
      (Transaction & {
         category: TransactionsCategory;
      })[]
   >;

   abstract ListBYRevenueOrResolvedTransactions({
      resolved,
      revenue,
      user_id,
      month,
   }: ListBYRevenueOrResolvedTransactionsProps): Promise<
      (Transaction & {
         category: TransactionsCategory;
      })[]
   >;
}
