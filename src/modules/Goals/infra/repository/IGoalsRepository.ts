import { MonthlyGoals } from '@prisma/client';

export type createRequest = {
   expectated_expense: string;
   expectated_revenue: string;
   month: string;
   user_id: string;
};

export abstract class IGoalsRepository {
   abstract create(props: createRequest): Promise<MonthlyGoals>;
   abstract list(user_id: string): Promise<MonthlyGoals[]>;
}
