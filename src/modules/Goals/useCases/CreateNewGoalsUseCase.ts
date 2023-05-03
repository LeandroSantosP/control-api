import * as yup from 'yup';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { AppError } from '@/shared/infra/middleware/AppError';
import { IGoalsRepository } from '../infra/repository/IGoalsRepository';
import { GoalEntity, Input } from '../infra/entity/Goals';
import { ValidationYup } from '@/utils/ValidationYup';

interface IRequest {
   month: string;
   user_id: string;
   expectated_revenue: number;
   expectated_expense: number;
}

export const createGoalsSchema = yup.object({
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
   expectated_expense: yup
      .string()
      .required('expected_expense is Required')
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
      .required('expected_revenue is Required')
      .test('decimal', 'Must be a decimal value!', (value) => {
         if (!value) {
            return true;
         }
         return /^-?\d*\.?\d*$/.test(value);
      }),
});

@injectable()
export class CreateNewGoalsUseCase {
   constructor(
      @inject('UserRepository')
      private readonly userRepository: IUserRepository,
      @inject('GoalsRepository')
      private readonly GoalsRepository: IGoalsRepository
   ) {}

   async execute({
      user_id,
      month,
      expectated_expense,
      expectated_revenue,
   }: IRequest) {
      const user = await this.userRepository.GetUserById(user_id);

      if (!user) {
         throw new AppError('User does not exists!');
      }

      const userGoalsRegistered = await this.GoalsRepository.list(user.id);

      for (let i = 0; i < userGoalsRegistered.length; i++) {
         if (userGoalsRegistered[i].userId !== user.id) {
            throw new AppError('Not Authorized');
         } else if (userGoalsRegistered[i].month === month.toString()) {
            throw new AppError(`Month (${month}) Already Registered!`);
         }
      }

      try {
         const dados = {
            user_id: user?.id,
            month,
            expectated_expense,
            expectated_revenue,
         };
         const validadeData = await createGoalsSchema.validate(dados, {
            abortEarly: false,
         });

         const goal = {} as Input;
         Object.assign(goal, {
            expected_expense: Number(validadeData.expectated_expense),
            expected_revenue: Number(validadeData.expectated_revenue),
            month: validadeData.month,
            user_id: validadeData.user_id,
         });

         const sut = GoalEntity.create({ ...goal });

         await this.GoalsRepository.create({
            expectated_expense: sut.ExpectatedExpense.GetValue.toString(),
            expectated_revenue: sut.ExpectatedRevenue.GetValue.toString(),
            user_id: sut.userId,
            month: sut.month.getValue,
         });

         return;
      } catch (err: any) {
         new ValidationYup(err);
      }
   }
}
