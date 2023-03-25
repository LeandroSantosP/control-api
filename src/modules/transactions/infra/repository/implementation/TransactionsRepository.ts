import { prisma } from '@/database/prisma';
import { Prisma, Transaction, User } from '@prisma/client';
import { addDays, endOfMonth, startOfMonth } from 'date-fns';
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
            type: Number(value) < 0 ? 'expense' : 'revenue',
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
            due_date: {
               gte: new Date(startOfTheMount),
               lt: new Date(endOfTheMount),
            },
         },
      });

      return transactions;
   }

   async GetDailyTransactions(user_id: string): Promise<
      (Transaction & {
         author: User;
      })[]
   > {
      const today = new Date();
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const day = today.getDate();

      const transaction = await this.prisma.transaction.findMany({
         where: {
            userId: user_id,
            due_date: {
               gte: new Date(year, month, day, 0, 0),
               lt: addDays(new Date(year, month, day, 0, 0), 1),
            },
         },
         include: {
            author: true,
         },
      });

      return transaction;
   }
}
