import { Transaction, User } from '@prisma/client';

export interface ITransactionsRepositoryProps {
   value: string;
   description: string;
   email: string;
   dueDate?: string;
}

export abstract class ITransactionsRepository {
   abstract create({
      description,
      value,
      email,
   }: ITransactionsRepositoryProps): Promise<Transaction>;

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
}
