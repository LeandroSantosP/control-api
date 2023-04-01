import { prisma } from '@/database/prisma';
import { addDays, isBefore } from 'date-fns';
import {
   Category,
   Prisma,
   Recurrence,
   Transaction,
   User,
} from '@prisma/client';
import { startOfMonth, endOfMonth } from 'date-fns';

import {
   ICreateTransactionInstallments,
   ITransactionsRepository,
   ITransactionsRepositoryProps,
   ListBySubscription,
} from '../ITransactionsRepository';
import { AppError } from '@/shared/infra/middleware/AppError';
import { GetCurrentDate } from '@/utils/GetCurrentDate';

export class TransactionsRepositoryTestDB
   extends GetCurrentDate
   implements ITransactionsRepository
{
   private prisma;

   constructor() {
      super();
      this.prisma = prisma;
   }

   async create({
      description,
      value,
      email,
      dueDate,
      Category,
      resolved,
   }: ITransactionsRepositoryProps): Promise<
      Transaction & {
         category: {
            name: Category;
         };
      }
   > {
      if (dueDate && isBefore(new Date(dueDate!), addDays(new Date(), 1))) {
         throw new AppError('Due date must be at least one day in the future!');
      }

      const newTransaction = await this.prisma.transaction.create({
         data: {
            category: {
               connectOrCreate: {
                  where: {
                     name: Category || 'unknown',
                  },
                  create: {
                     name: Category || 'unknown',
                  },
               },
            },
            description,
            value: new Prisma.Decimal(value),
            due_date: dueDate !== null ? dueDate : undefined,
            type: Number(value) < 0 ? 'expense' : 'revenue',
            resolved,
            author: {
               connect: {
                  email,
               },
            },
         },
         include: {
            category: {
               select: {
                  name: true,
               },
            },
         },
      });

      return newTransaction;
   }
   async CreateTransactionInstallments({
      categoryType,
      description,
      email,
      recurrence,
      value,
      dueDate,
      installments,
      isSubscription,
   }: ICreateTransactionInstallments): Promise<{
      description: string;
      value: Prisma.Decimal;
      resolved: boolean;
      recurrence: Recurrence | null;
      installments: number | null;
      isSubscription: boolean | null;
      due_date: Date | null;
      created_at: Date;
      category: any;
   }> {
      if (
         isBefore(new Date(dueDate!), addDays(new Date(), 1)) &&
         dueDate !== null
      ) {
         throw new AppError('Due date must be at least one day in the future!');
      }

      const newTransaction = await this.prisma.transaction.create({
         data: {
            description: description,
            value: new Prisma.Decimal(value),
            due_date: dueDate,
            installments: installments,
            type: Number(value) < 0 ? 'expense' : 'revenue',
            isSubscription: isSubscription,
            recurrence: recurrence,
            resolved: Number(value) > 0 ? true : false,
            category: {
               connectOrCreate: {
                  where: {
                     name: categoryType || 'unknown',
                  },
                  create: {
                     name: categoryType || 'unknown',
                  },
               },
            },
            author: {
               connect: {
                  email,
               },
            },
         },
         select: {
            description: true,
            value: true,
            due_date: true,
            recurrence: true,
            created_at: true,
            resolved: true,
            installments: true,
            isSubscription: true,
            category: {
               select: {
                  name: true,
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

      const startOfTheMount = startOfMonth(new Date(currentYear, 4 - 1));
      const endOfTheMount = endOfMonth(new Date(currentYear, 4 - 1));

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

   async resolved(transaction_id: string): Promise<Transaction> {
      const transaction = await this.prisma.transaction.update({
         where: {
            id: transaction_id,
         },
         data: {
            resolved: true,
         },
      });

      return transaction;
   }

   async ListBySubscription({
      user_id,
      month,
   }: ListBySubscription): Promise<Transaction[]> {
      const result = this.getStartAndEndOfTheMonth(month);

      if (result !== undefined) {
         const { endOfTheMount, startOfTheMount } = result;

         const transaction = await this.prisma.transaction.findMany({
            where: {
               isSubscription: true,
               userId: user_id,
               due_date: {
                  gte: new Date(startOfTheMount),
                  lt: new Date(endOfTheMount),
               },
            },
         });

         return transaction;
      }

      const transaction = await this.prisma.transaction.findMany({
         where: {
            isSubscription: true,
         },
      });

      return transaction;
   }
}
