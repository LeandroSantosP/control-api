import { addDays, endOfMonth, startOfMonth, isBefore } from 'date-fns';
import { prisma } from '@/database/prisma';
import { AppError } from '@/shared/infra/middleware/AppError';
import { GetCurrentDate } from '@/utils/GetCurrentDate';
import {
   Category,
   Prisma,
   Recurrence,
   Transaction,
   TransactionsCategory,
   User,
} from '@prisma/client';

import {
   ICreateTransactionInstallments,
   ITransactionsRepository,
   ITransactionsRepositoryProps,
   ListBYRevenueOrResolvedTransactionsProps,
   ListBySubscription,
} from '../ITransactionsRepository';

export class TransactionsRepository
   extends GetCurrentDate
   implements ITransactionsRepository<Transaction>
{
   private prisma;

   constructor() {
      super();
      this.prisma = prisma;
   }

   private verifyFutureDate(date?: string, month = 1) {
      if (date && isBefore(new Date(date!), addDays(new Date(), month))) {
         throw new AppError(
            'Due date or filling Date must be at least one day in the future!'
         );
      }
   }

   async create({
      description,
      value,
      email,
      dueDate,
      Category,
      filingDate,
   }: ITransactionsRepositoryProps): Promise<
      Transaction & {
         category: {
            name: Category;
         };
      }
   > {
      this.verifyFutureDate(filingDate);
      this.verifyFutureDate(dueDate);

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
            filingDate,
            due_date: dueDate,
            value: new Prisma.Decimal(value),
            type: Number(value) < 0 ? 'expense' : 'revenue',
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
      recurrence: Recurrence | null;
      installments: number | null;
      isSubscription: boolean | null;
      due_date: Date | null;
      resolved: boolean;
      created_at: Date;
      category: any;
   }> {
      this.verifyFutureDate(dueDate);

      const newTransaction = await this.prisma.transaction.create({
         data: {
            installments,
            recurrence,
            description,
            isSubscription,
            due_date: dueDate,
            value: new Prisma.Decimal(value),
            type: Number(value) < 0 ? 'expense' : 'revenue',
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

   async ListUserTransactionsById(user_id: string): Promise<
      (Transaction & {
         category: TransactionsCategory;
      })[]
   > {
      const transactions = await this.prisma.transaction.findMany({
         where: {
            userId: user_id,
         },
         orderBy: {
            created_at: 'desc',
         },
         include: {
            category: true,
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
   }): Promise<
      (Transaction & {
         category: TransactionsCategory;
      })[]
   > {
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
         include: {
            category: true,
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

   async ListSubscriptionWithOrNot({
      user_id,
      month,
      isSubscription,
   }: ListBySubscription): Promise<
      (Transaction & {
         category: TransactionsCategory;
      })[]
   > {
      const result = this.getStartAndEndOfTheMonth(month);

      if (result !== undefined) {
         const { endOfTheMount, startOfTheMount } = result;

         const transaction = await this.prisma.transaction.findMany({
            where: {
               isSubscription,
               userId: user_id,
               due_date: {
                  gte: new Date(startOfTheMount),
                  lt: new Date(endOfTheMount),
               },
            },
            include: {
               category: true,
            },
         });

         return transaction;
      }

      const transaction = await this.prisma.transaction.findMany({
         where: {
            userId: user_id,
            isSubscription,
         },
         include: {
            category: true,
         },
      });

      return transaction;
   }

   async ListBYRevenueOrResolvedTransactions({
      resolved,
      revenue,
      user_id,
      month,
   }: ListBYRevenueOrResolvedTransactionsProps): Promise<
      (Transaction & {
         category: TransactionsCategory;
      })[]
   > {
      const result = this.getStartAndEndOfTheMonth(month);

      if (result !== undefined) {
         const { endOfTheMount, startOfTheMount } = result;

         let whereClause = {
            userId: user_id,
            [revenue ? 'filingDate' : 'due_date']: {
               gte: new Date(startOfTheMount),
               lt: new Date(endOfTheMount),
            },
         } as any;

         if (resolved) {
            whereClause.resolved = resolved;
         }

         if (revenue) {
            whereClause.value = { gt: 0 };
         } else if (!revenue) {
            whereClause.value = { lt: 0 };
         }

         const transactions = await this.prisma.transaction.findMany({
            where: whereClause,
            include: {
               category: true,
            },
         });
         return transactions;
      }

      let whereClause = {
         userId: user_id,
      } as any;

      if (resolved) {
         whereClause.resolved = resolved;
      }

      if (revenue) {
         whereClause.value = { gt: 0 };
      } else if (!revenue) {
         whereClause.value = { lt: 0 };
      }

      const transactions = await this.prisma.transaction.findMany({
         where: whereClause,
         include: {
            category: true,
         },
      });

      return transactions;
   }
}
