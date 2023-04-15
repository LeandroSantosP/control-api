import { AppError } from '@/shared/infra/middleware/AppError';
import { MonthlyGoals } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { IGoalsRepository } from '../../infra/repository/IGoalsRepository';

interface IRequest {
   goals_id_or_months: string[] | string;
   user_id: string;
}

@injectable()
export class DeletedGoalsUseCase {
   constructor(
      @inject('GoalsRepository')
      private GoalsRepository: IGoalsRepository
   ) {}

   private VerifyGoals(
      goals_id_or_months: string[] | string,
      userGoals: MonthlyGoals[]
   ) {
      if (!Array.isArray(goals_id_or_months)) {
         const goalExists = userGoals.some(
            (goal) => goal.id === goals_id_or_months
         );

         if (goalExists === false) {
            throw new AppError('Goal not Found.', 404);
         }
         return;
      }

      let MonthsNotFound = [] as any[];

      goals_id_or_months.forEach((goal_month_for_delete) => {
         const goalExists = userGoals.find(
            (user_goal) => user_goal.month === goal_month_for_delete
         );

         if (goalExists === undefined) {
            MonthsNotFound.push(goal_month_for_delete);
            return;
         }
      });
      if (MonthsNotFound.length > 0) {
         throw new AppError(`Month [${MonthsNotFound}] Not Found`, 404);
      }
   }

   async execute({ goals_id_or_months, user_id }: IRequest): Promise<void> {
      /* O Usuário pode deletar todos sua metas ou deletar uma em especifica. */
      const userGoals = await this.GoalsRepository.list(user_id);

      if (goals_id_or_months === undefined) {
         throw new AppError('Invalid data!');
      }
      this.VerifyGoals(goals_id_or_months, userGoals);

      if (!Array.isArray(goals_id_or_months)) {
         await this.GoalsRepository.deleteSingleOrMúltiplo({
            user_id,
            goal_id: goals_id_or_months,
         });

         return;
      }

      await this.GoalsRepository.deleteSingleOrMúltiplo({
         user_id,
         goal_id: goals_id_or_months,
      });

      return;
   }
}
