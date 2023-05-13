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

export interface UpdatedProps {
   transaction_id: string;
   description?: string;
   category?: Category;
   category_id?: string;
}

interface pdfOptions {
   ByRevenue?: boolean;
   ByExpense?: boolean;
   BySubscription?: boolean;
}

export interface GetPDFInfosFromTransaction {
   user_id: string;
   start_date?: Date;
   end_date?: Date;
   options?: pdfOptions;
}
export abstract class ITransactionsRepository extends Model<any, Transaction> {
   abstract create(props: ITransactionsRepositoryProps): Promise<
      Transaction & {
         category: {
            name: Category;
         };
      }
   >;

   abstract list({ user_id }: { user_id: string }): Promise<
      (Transaction & {
         category: TransactionsCategory;
      })[]
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

   abstract GetTransactionById(
      transaction_id: string
   ): Promise<Transaction | null>;

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

   abstract updated(params: UpdatedProps): Promise<
      Transaction & {
         category: TransactionsCategory;
      }
   >;

   abstract GetPDFInfosFromTransaction(
      params: GetPDFInfosFromTransaction
   ): Promise<any>;
}
