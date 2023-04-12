import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { AppError } from '@/shared/infra/middleware/AppError';
import { IGoalsRepository } from '../../infra/repository/IGoalsRepository';
import { GoalEntity } from '../../infra/entity/Goals';

interface IRequest {
   month: string;
   user_email: string;
   expectated_revenue: string;
   expectated_expense: string;
}

// => user_id => get all transactions and connect/create then on goals

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

      const goal = new GoalEntity();

      Object.assign(goal, {
         user_id: user.id,
         month,
         expectated_expense,
         expectated_revenue,
      });

      await this.GoalsRepository.create({
         user_id: goal.user_id,
         expectated_expense: goal.expectated_expense,
         expectated_revenue: goal.expectated_revenue,
         month: goal.month,
      });

      return;
   }
}
