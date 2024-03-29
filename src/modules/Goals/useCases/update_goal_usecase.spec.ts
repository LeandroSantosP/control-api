import 'reflect-metadata';
import CreateUserTest from '@/utils/CrateUserTEST';
import { GoalsRepositoryTestDB } from '../infra/repository/test-db/GoalsRepositoryTestDB';
import { UpdateGoalsUseCase } from './UpdateGoalsUseCase';
import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
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
               expectated_expense: '-2',
               expectated_revenue: '122',
            },
            {
               month: '04',
               expectated_expense: '-22',
               expectated_revenue: '122',
            },
         ],
      });

      expect(sut).toHaveLength(2);
      expect(sut[0].expectated_expense.toString()).toBe('-2');
      expect(sut[0].expectated_revenue.toString()).toBe('122');
      expect(sut[0].expectated_expense.toString()).not.toBe('-12');
      expect(sut[0].expectated_revenue.toString()).not.toBe('12');
   });

   it('should create a new goals if specificated goal does not exits!', async () => {
      const newUser = await CreateUserTest();

      await createNewGoalsTEST.createNewGoal({
         month: '02',
         user_id: newUser.id,
      });

      const sut = await updateGoalsUseCase.execute({
         user_id: newUser.id,
         createIfNotExist: true,
         dataForUpdate: [
            {
               month: '02',
               expectated_revenue: '122',
               expectated_expense: '-111',
            },
            {
               month: '04',
               expectated_revenue: '122',
               expectated_expense: '-444.22',
            },

            {
               month: '10',
               expectated_revenue: '3333.33',
               expectated_expense: '-444.22',
            },
         ],
      });

      expect(sut).toHaveLength(3);
      expect(sut[0]).toHaveProperty('month', '02');
      expect(sut[0]).toHaveProperty('expectated_revenue');
      expect(sut[0]).toHaveProperty('expectated_expense');

      expect(Number(sut[0].expectated_revenue)).toEqual(122);
      expect(Number(sut[0].expectated_expense)).toBe(-111);

      expect(sut[2]).toHaveProperty('month', '10');
      expect(sut[2]).toHaveProperty('expectated_revenue');
      expect(sut[2]).toHaveProperty('expectated_expense');

      expect(Number(sut[2].expectated_revenue)).toEqual(3333.33);
      expect(Number(sut[2].expectated_expense)).toBe(-444.22);
   });

   it('should throw a new exception if data is in invalid format(single).', async () => {
      const newUser = await CreateUserTest();

      const newGoals = await createNewGoalsTEST.createNewGoal({
         month: '02',
         user_id: newUser.id,
      });

      await expect(
         updateGoalsUseCase.execute({
            user_id: newUser.id,
            goal_id: newGoals.id,
            expectated_expense: '12',
            expectated_revenue: '88',
         })
      ).rejects.toEqual(
         new InvalidYupError(
            'The value of the expected expense cannot be positive.'
         )
      );
   });

   it('should throw a new exception if data is in invalid format(múltiplo)', async () => {
      const newUser = await CreateUserTest();

      await createNewGoalsTEST.createNewGoal({
         month: '03',
         user_id: newUser.id,
      });
      await createNewGoalsTEST.createNewGoal({
         month: '04',
         user_id: newUser.id,
      });

      await expect(
         updateGoalsUseCase.execute({
            user_id: newUser.id,
            dataForUpdate: [
               {
                  month: '02',
                  expectated_expense: '-124',
                  expectated_revenue: '122',
               },
               {
                  month: '04',
                  expectated_expense: '-124',
                  expectated_revenue: '122',
               },
            ],
         })
      ).rejects.toEqual(new AppError('Monthly Goals [02] Not Registered!'));
   });

   it('should be able to create a new goal if the goal the user is trying to updated does not exits!(múltiplo)', async () => {
      const newUser = await CreateUserTest();

      await createNewGoalsTEST.createNewGoal({
         month: '03',
         user_id: newUser.id,
      });
      await createNewGoalsTEST.createNewGoal({
         month: '04',
         user_id: newUser.id,
      });

      const listBefore = await goalsRepositoryTestDB.list(newUser.id);

      expect(listBefore).toHaveLength(2);

      const sut = await updateGoalsUseCase.execute({
         user_id: newUser.id,
         createIfNotExist: true,
         dataForUpdate: [
            {
               month: '02',
               expectated_expense: '-124',
               expectated_revenue: '122',
            },
            {
               month: '10',
               expectated_expense: '-124',
               expectated_revenue: '122',
            },
         ],
      });

      const listAfter = await goalsRepositoryTestDB.list(newUser.id);

      const expectated_expenseAfterRef =
         listAfter[3].expectated_expense.toString();

      let newGoalsAddForDataBase = [] as any[];

      listAfter.forEach((item) => {
         const itemUpdated = sut.find((i: any) => i.id === item.id);
         if (itemUpdated !== undefined) {
            newGoalsAddForDataBase.push(itemUpdated);
         }
         return itemUpdated;
      });

      expect(newGoalsAddForDataBase).toHaveLength(2);

      expect(listAfter).toHaveLength(4);
      expect(sut).toBeTruthy();
      expect(expectated_expenseAfterRef).toBe('-124');
      expect(listAfter[3]).toHaveProperty('expectated_expense');
      expect(listAfter[3]).toHaveProperty('expectated_revenue');
   });
});
