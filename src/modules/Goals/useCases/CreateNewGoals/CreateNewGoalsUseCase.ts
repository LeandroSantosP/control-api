import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
import { IGoalsRepository } from '../../infra/repository/IGoalsRepository';
import { GoalEntity } from '../../infra/entity/Goals';
import * as yup from 'yup';

interface IRequest {
   month: string;
   user_email: string;
   expectated_revenue: number;
   expectated_expense: number;
}

const createGoalsSchema = yup.object({
   user_id: yup.string().required(),
   month: yup
      .string()
      .required('Month Is Required!')
      .oneOf([
         '01',
         '02',
         '03',
         '04',
         '05',
         '06',
         '07',
         '08',
         '09',
         '10',
         '11',
         '12',
      ]),
   expectated_expense: yup.number().required(),
   expectated_revenue: yup.number().required(),
});

injectable();
export class CreateNewGoalsUseCase {
   constructor(
      @inject('UserRepository')
      private userRepository: IUserRepository,
      @inject('GoalsRepository')
      private GoalsRepository: IGoalsRepository
   ) {}

   async execute({
      user_email,
      month,
      expectated_expense,
      expectated_revenue,
   }: IRequest) {
      const user = await this.userRepository.GetUserByEmail(user_email);

      if (!user) {
         throw new AppError('User does not exists!');
      }

      const userGoalsRegistered = await this.GoalsRepository.list(user.id);

      for (let i = 0; i < userGoalsRegistered.length; i++) {
         if (userGoalsRegistered[i].month === month) {
            throw new AppError('Month Already Registered!');
         } else if (userGoalsRegistered[i].userId !== user.id) {
            throw new AppError('Not Authorized');
         }
      }

      try {
         const dados = {
            user_id: user.id,
            month,
            expectated_expense,
            expectated_revenue,
         };
         const validadeData = await createGoalsSchema.validate(dados, {
            abortEarly: false,
         });
         const goal = new GoalEntity();

         Object.assign(goal, {
            user_id: validadeData.user_id,
            month: validadeData.month,
            expectated_expense: validadeData.expectated_expense,
            expectated_revenue: validadeData.expectated_revenue,
         });

         await this.GoalsRepository.create({
            user_id: goal.user_id,
            expectated_expense: goal.expectated_expense.toString(),
            expectated_revenue: goal.expectated_revenue.toString(),
            month: goal.month,
         });

         return;
      } catch (err: any) {
         if (err instanceof yup.ValidationError) {
            const errorMessages: string[] = [];

            err.inner.forEach(({ path, message }: any) => {
               if (path) {
                  errorMessages.push(`${message} \n`);
               }
            });

            throw new InvalidYupError(errorMessages.join(''));
         }

         throw new AppError(err.message, 400);
      }
   }
}
