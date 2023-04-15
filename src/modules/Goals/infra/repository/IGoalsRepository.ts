import { MonthlyGoals, Prisma } from '@prisma/client';

export type createRequest = {
   expectated_expense: string;
   expectated_revenue: string;
   month: string;
   user_id: string;
};

export type updateRequest = {
   goal_id?: string;
   user_id?: string;
   month?: string;
   expectated_expense?: string;
   expectated_revenue?: string;
};

export type deleteRequest = {
   goal_id?: string[] | string;
   user_id: string;
};

export abstract class IGoalsRepository {
   abstract create(props: createRequest): Promise<MonthlyGoals>;
   abstract list(user_id: string): Promise<MonthlyGoals[]>;
   abstract update({
      expectated_expense,
      expectated_revenue,
      month,
      user_id,
      goal_id,
   }: updateRequest): Promise<MonthlyGoals>;

   abstract deleteSingleOrMúltiplo(
      props: deleteRequest
   ): Promise<MonthlyGoals | Prisma.BatchPayload>;
}
