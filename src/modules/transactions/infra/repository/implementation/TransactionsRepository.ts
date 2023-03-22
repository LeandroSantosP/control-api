import { prisma } from '@/database/prisma';
import { Prisma, Transaction } from '@prisma/client';
import { endOfMonth, startOfMonth } from 'date-fns';
import {
   ITransactionsRepository,
   ITransactionsRepositoryProps,
} from '../ITransactionsRepository';

export class TransactionsRepository implements ITransactionsRepository {
   private prisma;

   constructor() {
      this.prisma = prisma;
   }

   async create({
      description,
      value,
      email,
      dueDate,
   }: ITransactionsRepositoryProps): Promise<Transaction> {
      const newTransaction = await this.prisma.transaction.create({
         data: {
            description,
            value: new Prisma.Decimal(value),
            due_date: dueDate,
            author: {
               connect: {
                  email,
               },
            },
         },
      });
      return newTransaction;
   }

   async ListUserTransactionsById(
      user_id: string
   ): Promise<Transaction[] | null> {
      const transactions = await this.prisma.transaction.findMany({
         where: {
            userId: user_id,
         },
         orderBy: {
            created_at: 'desc',
         },
      });

      return transactions;
   }
   async remove(transaction_id: string): Promise<string> {
      const transaction = await this.prisma.transaction.delete({
         where: {
            id: transaction_id,
         },
      });
      return transaction.id;
   }

   async GetTransactionById(
      transaction_id: string
   ): Promise<Transaction | null> {
      const transaction = await this.prisma.transaction.findUnique({
         where: {
            id: transaction_id,
         },
      });

      return transaction;
   }

   async ListAllADM(user_id: string): Promise<Transaction[]> {
      if (user_id) {
         const UserTransactions = await this.prisma.transaction.findMany({
            where: {
               userId: user_id,
            },
         });

         return UserTransactions;
      }
      const allTransaction = await this.prisma.transaction.findMany();
      return allTransaction;
   }
   async ListByMonth({
      user_id,
      month,
   }: {
      user_id: string;
      month: number;
   }): Promise<Transaction[]> {
      const currentYear = new Date().getFullYear();

      const startOfTheMount = startOfMonth(new Date(currentYear, month - 1));
      const endOfTheMount = endOfMonth(new Date(currentYear, month - 1));

      const transactions = await prisma.transaction.findMany({
         where: {
            userId: user_id,
            AND: [
               {
                  created_at: {
                     gte: new Date(startOfTheMount),
                     lt: new Date(endOfTheMount),
                  },
               },
            ],
         },
      });

      return transactions;
   }
}
