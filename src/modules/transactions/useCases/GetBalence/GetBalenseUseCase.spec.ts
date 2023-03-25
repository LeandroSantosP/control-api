import { prisma } from '@/database/prisma';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { TransactionsRepositoryTestDB } from '../../infra/repository/test-db/TransactionsTestDB';
import { GetBalenseUseCase } from './GetBalenseUseCase';

let userRepositoryTestDB = new UserRepositoryTestDB();
let TransactionRepositoryDBTest: TransactionsRepositoryTestDB;
let getBalenseUseCase: GetBalenseUseCase;

describe('Get Balense', () => {
   beforeEach(async () => {
      await prisma.transaction.deleteMany();
      await prisma.user.deleteMany();
      userRepositoryTestDB = new UserRepositoryTestDB();
      TransactionRepositoryDBTest = new TransactionsRepositoryTestDB();
      getBalenseUseCase = new GetBalenseUseCase(TransactionRepositoryDBTest);
   });

   it('should be return Balense of user Transactions', async () => {
      const user = await userRepositoryTestDB.create({
         email: 'user2@example.com',
         name: 'user',
         password: 'senha123',
      });

      await TransactionRepositoryDBTest.create({
         email: user.email,
         description: 'test',
         value: '1990.90',
      });

      await TransactionRepositoryDBTest.create({
         email: user.email,
         description: 'test',
         value: '-100',
      });

      await TransactionRepositoryDBTest.create({
         email: user.email,
         description: 'test',
         value: '200.22',
      });
      const balense = await getBalenseUseCase.execute({ user_id: user.id });

      expect(balense).toHaveProperty('balense');
      expect(balense?.balense).toBe(2091.12);
   });
});
