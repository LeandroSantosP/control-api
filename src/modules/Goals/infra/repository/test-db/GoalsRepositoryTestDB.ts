import { prisma } from '@/database/prisma';
import { MonthlyGoals, Prisma } from '@prisma/client';
import { createRequest, IGoalsRepository } from '../IGoalsRepository';

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
}
