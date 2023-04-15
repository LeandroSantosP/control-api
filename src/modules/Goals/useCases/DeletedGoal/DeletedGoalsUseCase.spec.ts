import 'reflect-metadata';
import CreateUserTest from '@/utils/CrateUserTEST';
import { CreateNewGoalsTEST } from '@/utils/CreateNewGoalsTEST';
import { GoalsRepositoryTestDB } from '../../infra/repository/test-db/GoalsRepositoryTestDB';
import { DeletedGoalsUseCase } from './DeletedGoalsUseCase';
import { prisma } from '@/database/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '@/shared/infra/middleware/AppError';

let goalsRepositoryTestDB: GoalsRepositoryTestDB;
let deletedGoalsUseCase: DeletedGoalsUseCase;

async function ListUserGoals(user_id: string) {
   return await prisma.monthlyGoals.findMany({
      where: {
         userId: user_id,
      },
   });
}

describe('DeleteGoalsUseCase', () => {
   beforeEach(async () => {
      await prisma.monthlyGoals.deleteMany({});
      goalsRepositoryTestDB = new GoalsRepositoryTestDB();
      deletedGoalsUseCase = new DeletedGoalsUseCase(goalsRepositoryTestDB);
   });

   it('should be able to delete one Goals Register.', async () => {
      const newUser = await CreateUserTest();
      const newGoal = await new CreateNewGoalsTEST().createNewGoal({
         user_id: newUser.id,
         month: '01',
      });

      const userGaolsBefore = await ListUserGoals(newUser.id);

      expect(userGaolsBefore).toHaveLength(1);
      expect(userGaolsBefore[0]).toHaveProperty('month', '01');
      expect(userGaolsBefore[0]).toHaveProperty(
         'expectated_revenue',
         new Prisma.Decimal(12)
      );
      expect(userGaolsBefore[0]).toHaveProperty(
         'expectated_expense',
         new Prisma.Decimal(-12)
      );

      await deletedGoalsUseCase.execute({
         user_id: newUser.id,
         goals_id_or_months: newGoal.id,
      });

      const userGaolsAfter = await ListUserGoals(newUser.id);

      expect(userGaolsAfter).toHaveLength(0);
      expect(userGaolsAfter).toEqual([]);
   });

   it('should be able to delete many Goals by months.', async () => {
      let monthsListForCreateGoals = [
         '01',
         '02',
         '03',
         '04',
         '05',
         '06',
         '07',
         '08',
      ];
      const newUser = await CreateUserTest();

      await Promise.all(
         monthsListForCreateGoals.map(async (month) => {
            await new CreateNewGoalsTEST().createNewGoal({
               month,
               user_id: newUser.id,
            });
         })
      );

      const userGaolsBefore = await ListUserGoals(newUser.id);

      expect(userGaolsBefore).toHaveLength(8);

      await deletedGoalsUseCase.execute({
         user_id: newUser.id,
         goals_id_or_months: ['01', '02', '03', '06', '07'],
      });
      const userGaolsAfter = await ListUserGoals(newUser.id);

      expect(userGaolsAfter).toHaveLength(3);

      const expectedMonths = ['05', '04'];

      const response = userGaolsAfter.some((item) =>
         expectedMonths.includes(item.month)
      );

      expect(response).toBe(true);

      const expectedGoals = expect.arrayContaining([
         expect.objectContaining({ month: '04' }),
      ]);

      expect(userGaolsAfter).toEqual(expectedGoals);
   });

   it('should not be able to delete an month that user not have!', async () => {
      let monthsListForCreateGoals = [
         '01',
         '02',
         '03',
         '04',
         '05',
         '06',
         '07',
         '08',
      ];
      const newUser = await CreateUserTest();

      await Promise.all(
         monthsListForCreateGoals.map(async (month) => {
            await new CreateNewGoalsTEST().createNewGoal({
               month,
               user_id: newUser.id,
            });
         })
      );

      await expect(
         deletedGoalsUseCase.execute({
            user_id: newUser.id,
            goals_id_or_months: ['10', '23'],
         })
      ).rejects.toEqual(new AppError('Month [10,23] Not Found', 404));
   });
});
