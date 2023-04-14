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
   createIfNotExist?: boolean;
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

      /**
       * If dataForUpdate Exists
       */

      /*
         TEst
         */

      if ('dataForUpdate' in request) {
         // Trata-se de uma requisição múltipla
         const { dataForUpdate, user_id, createIfNotExist } = request;

         const goalsNotRegistered = dataForUpdate.filter((data) => {
            return !userGoalsList.some((item) => item.month === data.month);
         });

         /**
          * Checks if there are unregistered goals for the user and, if so, registers new goals.
          *
          * @param {Array} goalsNotRegistered - an array containing the unregistered goals
          * @param {string} user_id - the user ID
          * @param {boolean} createIfNotExist - defines whether the goals should be created if they don't exist. The default value is `false`.
          *
          * @throws {AppError} if createIfNotExist is `false` and there are unregistered goals
          *
          * @returns {Promise} a Promise that resolves when all goals have been successfully registered
          */

         if (goalsNotRegistered.length > 0) {
            if (createIfNotExist === false || createIfNotExist === undefined) {
               throw new AppError(
                  `Goals [${goalsNotRegistered.map(
                     (item) => `${item.month}`
                  )}] Not Registered!`
               );
            }

            /**
             * If createIfNotExist is `true` or not defined, the code below registers the new goals
             * by calling the `CreateNewGoal.execute()` function.
             */

            for (let i = 0; i < goalsNotRegistered.length; i++) {
               const { expectated_expense, month, expectated_revenue } =
                  goalsNotRegistered[i];
               await this.CreateNewGoal.execute({
                  user_id,
                  month,
                  expectated_expense: Number(expectated_expense),
                  expectated_revenue: Number(expectated_revenue),
               });
            }
         }

         const updatedGoals = await Promise.all(
            dataForUpdate.map(
               async ({ month, expectated_expense, expectated_revenue }) => {
                  const dataUpdated = await this.GoalsRepository.update({
                     month,
                     user_id,
                     expectated_expense,
                     expectated_revenue,
                  });
                  return dataUpdated;
               }
            )
         );

         return updatedGoals;
      } else {
         /**
          *  its about the only one request!
          * @return returns the modify data about
          */

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
