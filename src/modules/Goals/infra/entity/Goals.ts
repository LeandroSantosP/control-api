import { v4 as uuidV4 } from 'uuid';
import { ExpectatedRevenue } from './ExpectatedRevenue';
import { ExpectatedExpense } from './ExpectatedExpense';
import { Month } from './Month';

export class GoalEntity {
   private constructor(
      readonly month: Month,
      readonly ExpectatedRevenue: ExpectatedRevenue,
      readonly ExpectatedExpense: ExpectatedExpense,
      readonly userId: string,
      readonly CreatedAt?: Date,
      readonly UpdatedAt?: Date
   ) {
      if (!this.CreatedAt) {
         this.CreatedAt = new Date();
      }
      if (!this.UpdatedAt) {
         this.UpdatedAt = new Date();
      }
      if (!this.userId) {
         this.userId = uuidV4();
      }
   }

   static create({
      month,
      expected_expense,
      expected_revenue,
      user_id,
      createAt,
      updatedAt,
   }: Input) {
      return new GoalEntity(
         new Month(month),
         new ExpectatedRevenue(expected_revenue),
         new ExpectatedExpense(expected_expense),
         user_id,
         createAt,
         updatedAt
      );
   }
}

export type Input = {
   month: string;
   expected_revenue: number;
   expected_expense: number;
   user_id: string;
   createAt?: Date;
   updatedAt?: Date;
};
