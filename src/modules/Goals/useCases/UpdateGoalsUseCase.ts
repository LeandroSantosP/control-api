import * as yup from 'yup';
import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
import { inject, injectable } from 'tsyringe';
import { IGoalsRepository } from '../infra/repository/IGoalsRepository';
import { CreateNewGoalsUseCase } from './CreateNewGoalsUseCase';
import { ValidationYup } from '@/utils/ValidationYup';

type IRequestSingle = {
   user_id: string;
   goal_id?: string;
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

const updatedSingleGoal = yup.object().shape({
   goal_id: yup.string().required(),
   expectated_expense: yup
      .string()
      .optional()
      .test(
         'decimal',
         'Must be a negative value and a decimal value!',
         (value) => {
            if (!value) {
               return true;
            }

            if (!value.includes('-')) {
               return false;
            }
            return /^-?\d*\.?\d*$/.test(value);
         }
      ),
   expectated_revenue: yup
      .string()
      .optional()
      .test('decimal', 'Must be a decimal value!', (value) => {
         if (!value) {
            return true;
         }
         return /^-?\d*\.?\d*$/.test(value);
      }),
});

const updatedMúltiploGoal = yup.object().shape({
   dataForUpdate: yup
      .array()
      .required()
      .of(
         yup.object().shape({
            month: yup.string().required('O mês é obrigatório'),
            expectated_expense: yup
               .string()
               .optional()
               .test(
                  'decimal',
                  'Must be a negative value and a decimal value!',
                  (value) => {
                     if (!value) {
                        return true;
                     }

                     if (!value.includes('-')) {
                        return false;
                     }
                     return /^-?\d*\.?\d*$/.test(value);
                  }
               ),
            expectated_revenue: yup
               .string()
               .optional()
               .test('decimal', 'Must be a decimal value!', (value) => {
                  if (!value) {
                     return true;
                  }
                  return /^-?\d*\.?\d*$/.test(value);
               }),
         })
      ),
});

@injectable()
export class UpdateGoalsUseCase {
   private readonly CreateNewGoal: CreateNewGoalsUseCase;
   constructor(
      @inject('GoalsRepository')
      private readonly GoalsRepository: IGoalsRepository,
      @inject('UserRepository')
      private readonly UserRepository: IUserRepository
   ) {
      this.CreateNewGoal = new CreateNewGoalsUseCase(
         this.UserRepository,
         this.GoalsRepository
      );
   }

   /**
    *
    * @todo
    * Validation Revenue expectation does not be a negative value.
    */

   async execute(request: IRequestMúltiplo | IRequestSingle): Promise<any> {
      const { user_id } = request;
      const userGoalsList = await this.GoalsRepository.list(user_id);

      /**
       *  its about the Múltiplo request!
       * @return returns Múltiplo modify data about it
       */
      if ('dataForUpdate' in request) {
         const { dataForUpdate, user_id, createIfNotExist } = request;

         try {
            const validateData = await updatedMúltiploGoal.validate(
               { dataForUpdate, user_id },
               { abortEarly: false }
            );

            const goalsNotRegistered = validateData.dataForUpdate.filter(
               (data) => {
                  return !userGoalsList.some(
                     (item) => item.month === data.month
                  );
               }
            );

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
               if (
                  createIfNotExist === false ||
                  createIfNotExist === undefined
               ) {
                  const goalsDoesNotExits = goalsNotRegistered.map(
                     (item) => `${item.month}`
                  );
                  throw new AppError(
                     `Monthly Goals [${goalsDoesNotExits}] Not Registered!`
                  );
               }

               /**
                * If createIfNotExist is `true` or not defined, the code below registers the new goals
                * by calling the `CreateNewGoal.execute()` function.
                */

               for (let i = 0; i < goalsNotRegistered.length; i++) {
                  const { month, expectated_expense, expectated_revenue } =
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
         } catch (err: any) {
            new ValidationYup(err);
         }
      } else {
         /**
          *  its about the only one request!
          * @return returns the modify data about
          */

         const { expectated_expense, expectated_revenue, goal_id } = request;

         try {
            const valetedDate = await updatedSingleGoal.validate(
               { expectated_expense, expectated_revenue, goal_id },
               {
                  abortEarly: false,
               }
            );

            if (
               valetedDate.expectated_expense === undefined &&
               valetedDate.expectated_revenue === undefined
            ) {
               throw new AppError(
                  'Must be provider a less an param (expectated_expense or expectated_revenue)'
               );
            }

            const goalExistes = userGoalsList.find(
               (goal) => goal.id === valetedDate.goal_id
            );

            if (!goalExistes) {
               throw new AppError('Goal does not Registered!');
            }

            const dataUpdated = await this.GoalsRepository.update({
               goal_id: valetedDate.goal_id,
               expectated_expense: valetedDate.expectated_expense,
               expectated_revenue: valetedDate.expectated_revenue,
            });

            return dataUpdated;
         } catch (err: any) {
            new ValidationYup(err);
         }
      }
   }
}