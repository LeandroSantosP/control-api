import 'reflect-metadata';
import { prisma } from '@/database/prisma';
import CreateUserTest from '@/utils/CrateUserTEST';
import { TransactionsRepositoryTestDB } from '@/modules/transactions/infra/repository/test-db/TransactionsTestDB';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { CreateNewGoalsUseCase } from './CreateNewGoalsUseCase';
import { IGoalsRepository } from '../../infra/repository/IGoalsRepository';
import { GoalsRepositoryTestDB } from '../../infra/repository/test-db/GoalsRepositoryTestDB';
import { AppError } from '@/shared/infra/middleware/AppError';

let goalsRepository: IGoalsRepository;
let userRepository: UserRepositoryTestDB;
let createNewGoalsUseCase: CreateNewGoalsUseCase;

describe('CreateNewGoalsUserCase', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany({});
      goalsRepository = new GoalsRepositoryTestDB();
      userRepository = new UserRepositoryTestDB();
      createNewGoalsUseCase = new CreateNewGoalsUseCase(
         userRepository,
         goalsRepository
      );
   });

   it('should be able create a goals all transaction of user.', async () => {
      const newUser = await CreateUserTest({});

      await expect(
         createNewGoalsUseCase.execute({
            user_email: newUser.email,
            month: '12',
            expectated_expense: '10',
            expectated_revenue: '12',
         })
      ).resolves.toBeUndefined();
   });

   it('should not be able to create a new month goals if then already was registered!', async () => {
      const newUser = await CreateUserTest({});

      await createNewGoalsUseCase.execute({
         user_email: newUser.email,
         month: '12',
         expectated_expense: '10',
         expectated_revenue: '12',
      });

      await expect(
         createNewGoalsUseCase.execute({
            user_email: newUser.email,
            month: '12',
            expectated_expense: '10',
            expectated_revenue: '12',
         })
      ).rejects.toEqual(new AppError('Month Already Registered!'));
   });
});
