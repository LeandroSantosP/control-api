import 'reflect-metadata';
import CreateUserTest from '@/utils/CrateUserTEST';
import { GoalsRepositoryTestDB } from '../../infra/repository/test-db/GoalsRepositoryTestDB';
import { UpdateGoalsUseCase } from './UpdateGoalsUseCase';
import { AppError } from '@/shared/infra/middleware/AppError';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { prisma } from '@/database/prisma';
import { CreateNewGoalsTEST } from '@/utils/CreateNewGoalsTEST';

let createNewGoalsTEST: CreateNewGoalsTEST;
let updateGoalsUseCase: UpdateGoalsUseCase;
let userRepositoryTestDB: UserRepositoryTestDB;
let goalsRepositoryTestDB: GoalsRepositoryTestDB;

describe('UpdatedUseCase', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany({});
      await prisma.monthlyGoals.deleteMany();
      createNewGoalsTEST = new CreateNewGoalsTEST();
      userRepositoryTestDB = new UserRepositoryTestDB();
      goalsRepositoryTestDB = new GoalsRepositoryTestDB();
      updateGoalsUseCase = new UpdateGoalsUseCase(
         goalsRepositoryTestDB,
         userRepositoryTestDB
      );
   });

   it('should be abre updated a goals registered.', async () => {
      const newUser = await CreateUserTest();

      const newGoals = await createNewGoalsTEST.createNewGoal({
         month: '02',
         user_id: newUser.id,
      });

      const sut = await updateGoalsUseCase.execute({
         user_id: newUser.id,
         goal_id: newGoals.id,
         expectated_revenue: '90',
      });

      expect(sut).toHaveProperty('id');
      expect(sut).toHaveProperty('month');
      expect(sut).toHaveProperty('expectated_revenue');
      expect(sut).toHaveProperty('expectated_expense');
      expect(sut).toHaveProperty('created_at');
      expect(sut).toHaveProperty('updated_at');
      expect(sut).toHaveProperty('userId');
      expect(sut).toHaveProperty('user');

      expect(sut.userId).toBe(newUser.id);
      expect(sut.expectated_expense.toString()).toBe(
         newGoals.expectated_expense.toString()
      );
      expect(sut.expectated_revenue.toString()).not.toBe(
         newGoals.expectated_revenue.toString()
      );
      expect(sut.userId).toBe(newUser.id);
   });

   it('should be able to updated a goal if then does not exists.', async () => {
      const newUser = await CreateUserTest();
      await expect(
         updateGoalsUseCase.execute({
            user_id: newUser.id,
            goal_id: 'INVALID_GOAL',
            expectated_revenue: '90',
         })
      ).rejects.toEqual(new AppError('Goal does not Registered!'));
   });

   it('should be able to update múltiplos goals', async () => {
      const newUser = await CreateUserTest();

      await createNewGoalsTEST.createNewGoal({
         month: '02',
         user_id: newUser.id,
      });

      await createNewGoalsTEST.createNewGoal({
         month: '04',
         user_id: newUser.id,
      });

      const sut = await updateGoalsUseCase.execute({
         user_id: newUser.id,
         dataForUpdate: [
            {
               month: '02',
               expectated_expense: '124',
               expectated_revenue: '122',
            },
            {
               month: '04',
               expectated_expense: '124',
               expectated_revenue: '122',
            },
         ],
      });

      expect(sut).toHaveLength(2);
      expect(sut[0].expectated_expense.toString()).toBe('124');
      expect(sut[0].expectated_revenue.toString()).toBe('122');
      expect(sut[0].expectated_expense.toString()).not.toBe('12');
      expect(sut[0].expectated_revenue.toString()).not.toBe('12');
   });

   it.only('should create a new goals if specificated goal does not exits!', async () => {
      const newUser = await CreateUserTest();

      await createNewGoalsTEST.createNewGoal({
         month: '02',
         user_id: newUser.id,
      });

      const sut = await updateGoalsUseCase.execute({
         user_id: newUser.id,
         dataForUpdate: [
            {
               month: '02',
               expectated_expense: '124',
               expectated_revenue: '122',
            },
            {
               month: '04',
               expectated_expense: '124',
               expectated_revenue: '122',
            },
         ],
      });

      console.log(sut);
   });
});
