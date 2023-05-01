import 'reflect-metadata';
import CreateUserTest from '@/utils/CrateUserTEST';
import { GoalsRepositoryTestDB } from '../infra/repository/test-db/GoalsRepositoryTestDB';
import { ListGoalsUseCase } from './ListGoalsUseCase';
import { CreateNewGoalsTEST } from '@/utils/CreateNewGoalsTEST';
import { prisma } from '@/database/prisma';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';

let goalsRepositoryTestDB: GoalsRepositoryTestDB;
let listGoalsUseCase: ListGoalsUseCase;
let userRepositoryTEstDB: UserRepositoryTestDB;

describe('ListGoalsUseCase', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany({});
      goalsRepositoryTestDB = new GoalsRepositoryTestDB();
      userRepositoryTEstDB = new UserRepositoryTestDB();
      listGoalsUseCase = new ListGoalsUseCase(
         goalsRepositoryTestDB,
         userRepositoryTEstDB
      );
   });

   it('should be able to list all Goals of User.', async () => {
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

      const sut = await listGoalsUseCase.execute(newUser.id);

      expect(sut).toHaveProperty('user');
      expect(sut.user).toHaveProperty('name', 'John Smith');
      expect(sut.MonthFormatted).toHaveLength(8);

      return;
   });
});
