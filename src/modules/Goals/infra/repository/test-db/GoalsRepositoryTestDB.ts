import { prisma } from '@/database/prisma';
import { MonthlyGoals, Prisma } from '@prisma/client';
import { Retryer } from 'react-query/types/core/retryer';
import {
   createRequest,
   IGoalsRepository,
   updateRequest,
} from '../IGoalsRepository';

export class GoalsRepositoryTestDB implements IGoalsRepository {
   private readonly prisma;

   constructor() {
      this.prisma = prisma;
   }

   async create({
      expectated_expense,
      expectated_revenue,
      month,
      user_id,
   }: createRequest): Promise<MonthlyGoals> {
      const newGoal = await this.prisma.monthlyGoals.create({
         data: {
            month,
            userId: user_id,
            expectated_expense: new Prisma.Decimal(expectated_expense),
            expectated_revenue: new Prisma.Decimal(expectated_revenue),
         },
      });

      return newGoal;
   }

   async list(user_id: string): Promise<MonthlyGoals[]> {
      const goals = await this.prisma.monthlyGoals.findMany({
         where: {
            userId: user_id,
         },
      });
      return goals;
   }

   async update({
      user_id,
      goal_id,
      month,
      expectated_expense,
      expectated_revenue,
   }: updateRequest): Promise<any> {
      let result;
      if (!month) {
         let expectated_expenseForDecimal;
         let expectated_revenueForDecimal;

         if (expectated_expense) {
            expectated_expenseForDecimal = new Prisma.Decimal(
               expectated_expense
            );
         }
         if (expectated_revenue) {
            expectated_revenueForDecimal = new Prisma.Decimal(
               expectated_revenue
            );
         }

         const goalUpdated = await this.prisma.monthlyGoals.update({
            where: {
               id: goal_id,
            },
            data: {
               expectated_expense: expectated_expenseForDecimal,
               expectated_revenue: expectated_revenueForDecimal,
            },
            include: {
               user: {
                  select: {
                     id: true,
                  },
               },
            },
         });
         result = goalUpdated;
      } else {
         let expectated_expenseForDecimal;
         let expectated_revenueForDecimal;

         if (expectated_expense) {
            expectated_expenseForDecimal = new Prisma.Decimal(
               expectated_expense
            );
         }
         if (expectated_revenue) {
            expectated_revenueForDecimal = new Prisma.Decimal(
               expectated_revenue
            );
         }

         const goalUpdated = await this.prisma.user.update({
            where: {
               id: user_id,
            },
            data: {
               MonthlyGoals: {
                  update: {
                     where: {
                        month,
                     },
                     data: {
                        expectated_expense: expectated_expenseForDecimal,
                        expectated_revenue: expectated_revenueForDecimal,
                     },
                  },
               },
            },
            select: {
               MonthlyGoals: {
                  where: {
                     month,
                  },
               },
            },
         });

         result = goalUpdated.MonthlyGoals[0];
      }

      return result;
   }
}
