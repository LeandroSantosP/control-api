import { prisma } from '@/database/prisma';
import { GoalsRepositoryTestDB } from '@/modules/Goals/infra/repository/test-db/GoalsRepositoryTestDB';
import { MonthlyGoals } from '@prisma/client';

type IRequest = {
   expectated_expense?: string;
   expectated_revenue?: string;
   month: string;
   user_id: string;
};

export class CreateNewGoalsTEST {
   private goalsRepositoryTestDB: GoalsRepositoryTestDB;

   constructor() {
      this.goalsRepositoryTestDB = new GoalsRepositoryTestDB();
   }
   async createNewGoal({
      month,
      user_id,
      expectated_expense = '-12',
      expectated_revenue = '12',
   }: IRequest): Promise<MonthlyGoals> {
      return this.goalsRepositoryTestDB.create({
         user_id,
         expectated_expense,
         expectated_revenue,
         month,
      });
   }
}
