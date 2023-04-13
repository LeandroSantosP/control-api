import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { AppError } from '@/shared/infra/middleware/AppError';
import { inject, injectable } from 'tsyringe';
import { IGoalsRepository } from '../../infra/repository/IGoalsRepository';
import { CreateNewGoalsUseCase } from '../CreateNewGoals/CreateNewGoalsUseCase';

type IRequestSingle = {
   user_id: string;
   goal_id: string;
   expectated_expense?: string;
   expectated_revenue?: string;
};

type IRequestMúltiplo = {
   user_id: string;
   goal_id?: string;
   dataForUpdate: Array<{
      month: string;
      expectated_expense?: string;
      expectated_revenue?: string;
   }>;
};

@injectable()
export class UpdateGoalsUseCase {
   private readonly CreateNewGoal: CreateNewGoalsUseCase;
   constructor(
      @inject('GoalsRepository')
      private GoalsRepository: IGoalsRepository,
      @inject('UserRepository')
      private UserRepository: IUserRepository
   ) {
      this.CreateNewGoal = new CreateNewGoalsUseCase(
         this.UserRepository,
         this.GoalsRepository
      );
   }

   async execute(request: IRequestMúltiplo | IRequestSingle): Promise<any> {
      const { goal_id, user_id } = request;
      const userGoalsList = await this.GoalsRepository.list(user_id);
      /* Múltiplas Metas */

      if ('dataForUpdate' in request) {
         // Trata-se de uma requisição múltipla
         const { dataForUpdate, user_id } = request;

         const goalsNotRegistered = dataForUpdate.filter((data) => {
            return !userGoalsList.some((item) => item.month === data.month);
         });

         /* Validation of data! / Manipulation of data. */

         if (goalsNotRegistered.length > 0) {
            // const newGoals = this.CreateNewGoal.execute({});
            // throw new AppError(
            //    `Goals [${goalsNotRegistered.map(
            //       (item) => `${item.month}`
            //    )}] Not Registered!`
            // );
            return;
         }

         const updatedGoals = [];
         for (let i = 0; i < dataForUpdate.length; i++) {
            let { month, expectated_expense, expectated_revenue } =
               dataForUpdate[i];

            const dataUpdated = await this.GoalsRepository.update({
               month,
               user_id,
               expectated_expense,
               expectated_revenue,
            });

            updatedGoals.push(dataUpdated);
         }

         return updatedGoals;
      } else {
         // Trata-se de uma requisição única
         const goalExistes = userGoalsList.find((goal) => goal.id === goal_id);

         if (!goalExistes) {
            throw new AppError('Goal does not Registered!');
         }

         const { expectated_expense, expectated_revenue } = request;

         const dataUpdated = await this.GoalsRepository.update({
            goal_id,
            expectated_expense,
            expectated_revenue,
         });

         return dataUpdated;
      }
   }
}
