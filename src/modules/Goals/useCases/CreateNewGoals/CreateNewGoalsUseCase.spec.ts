import 'reflect-metadata';
import { prisma } from '@/database/prisma';
import CreateUserTest from '@/utils/CrateUserTEST';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { CreateNewGoalsUseCase } from './CreateNewGoalsUseCase';
import { IGoalsRepository } from '../../infra/repository/IGoalsRepository';
import { GoalsRepositoryTestDB } from '../../infra/repository/test-db/GoalsRepositoryTestDB';
import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';

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
            user_id: newUser.id,
            month: '12',
            expectated_expense: 10,
            expectated_revenue: 12,
         })
      ).resolves.toBeUndefined();

      const listGoals = await goalsRepository.list(newUser.id);

      expect(listGoals).toHaveLength(1);

      const { expectated_expense, expectated_revenue } = listGoals[0];
      expect(listGoals[0]).toHaveProperty('userId', newUser.id);
      expect(Number(expectated_expense)).toEqual(10);
      expect(Number(expectated_revenue)).toEqual(12);
   });

   it('should not be able to create a new month goals if then already was registered!', async () => {
      const newUser = await CreateUserTest({});

      await createNewGoalsUseCase.execute({
         user_id: newUser.id,
         month: '12',
         expectated_expense: -10,
         expectated_revenue: 12,
      });

      await expect(
         createNewGoalsUseCase.execute({
            user_id: newUser.id,
            month: '12',
            expectated_expense: 10,
            expectated_revenue: 12,
         })
      ).rejects.toEqual(new AppError(`Month (${12}) Already Registered!`));
   });

   it('should not be able create new month goal if month is invalid!', async () => {
      const newUser = await CreateUserTest({});

      await expect(
         createNewGoalsUseCase.execute({
            user_id: newUser.id,
            month: 'wrong',
            expectated_expense: 11,
            expectated_revenue: 11,
         })
      ).rejects.toEqual(
         new InvalidYupError(
            'month must be one of the following values: 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12 \n'
         )
      );
   });
   it('should not be able create new month goal if expectated_expense/expectated_revenue is invalid!', async () => {
      const newUser = await CreateUserTest({});

      await expect(
         createNewGoalsUseCase.execute({
            user_id: newUser.id,
            month: '12',
            expectated_revenue: 12,
            // @ts-ignore
            expectated_expense: 'wrong_format',
         })
      ).rejects.toThrow(InvalidYupError);
   });
});
