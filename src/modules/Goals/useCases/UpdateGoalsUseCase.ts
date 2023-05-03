import * as yup from 'yup';
import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { AppError } from '@/shared/infra/middleware/AppError';
import { inject, injectable } from 'tsyringe';
import { IGoalsRepository } from '../infra/repository/IGoalsRepository';
import { CreateNewGoalsUseCase } from './CreateNewGoalsUseCase';
import { ValidationYup } from '@/utils/ValidationYup';
import { ExpectatedExpense } from '../infra/entity/ExpectatedExpense';
import { ExpectatedRevenue } from '../infra/entity/ExpectatedRevenue';
import { Month } from '../infra/entity/Month';

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

interface UpdatedGoalsProps {
   dataForUpdate: {
      month: string;
      expectated_expense?: string | undefined;
      expectated_revenue?: string | undefined;
   }[];
   user_id: string;
}

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

   verifyFormat({
      expense,
      revenue,
      month,
   }: {
      expense?: number;
      revenue?: number;
      month?: string;
   }) {
      let monthRes: string | undefined;
      let expenseRes: string | undefined;
      let revenueRes: string | undefined;

      if (month) {
         monthRes = new Month(month).getValue;
      }

      if (revenue) {
         new ExpectatedRevenue(revenue).GetValue;
      }

      if (expense) {
         new ExpectatedExpense(expense).GetValue;
      }

      return {
         expense: expenseRes,
         revenue: revenueRes,
         month: monthRes,
      };
   }

   async updatedGoals({
      dataForUpdate,
      user_id,
   }: UpdatedGoalsProps): Promise<any[]> {
      const userGoalsListAll = await this.GoalsRepository.list(user_id);

      const goalsIdForUpdated = userGoalsListAll
         .map((goal) => {
            const goalForUpdated = dataForUpdate.find(
               (e) => e.month === goal.month
            );

            if (goalForUpdated === undefined) {
               return;
            }

            return {
               goalId: goal.id,
               expectated_expense: goalForUpdated?.expectated_expense,
               expectated_revenue: goalForUpdated?.expectated_revenue,
            };
         })
         .filter((i) => i !== undefined);

      const updatedGoals = await Promise.all(
         goalsIdForUpdated.map(
            async ({ goalId, expectated_expense, expectated_revenue }: any) => {
               const dataUpdated = (await this.GoalsRepository.update({
                  expectated_expense,
                  expectated_revenue,
                  goal_id: goalId,
               })) as any;
               return dataUpdated;
            }
         )
      );

      return updatedGoals;
   }

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

            for (let i = 0; i < validateData.dataForUpdate.length; i++) {
               const { expectated_expense, expectated_revenue } =
                  validateData.dataForUpdate[i];

               this.verifyFormat({
                  expense: Number(expectated_expense),
                  revenue: Number(expectated_revenue),
               });
            }

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

            const updatedGoals = await this.updatedGoals({
               dataForUpdate,
               user_id,
            });

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

         if (expectated_expense || expectated_revenue) {
            this.verifyFormat({
               expense: Number(expectated_expense),
               revenue: Number(expectated_revenue),
            });
         }

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
