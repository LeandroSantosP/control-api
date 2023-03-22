import 'reflect-metadata';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { TransactionsRepositoryTestDB } from '../../infra/repository/test-db/TransactionsTestDB';
import { ListTransactionUseCase } from './ListTransactionUseCase';
import { prisma } from '@/database/prisma';

let userRepository: UserRepositoryTestDB;
let TransactionsRepository: TransactionsRepositoryTestDB;
let listTransactionUseCase: ListTransactionUseCase;

describe('List Transactions', () => {
   beforeAll(async () => {
      await prisma.user.deleteMany();
   });
   beforeEach(async () => {
      userRepository = new UserRepositoryTestDB();
      TransactionsRepository = new TransactionsRepositoryTestDB();
      listTransactionUseCase = new ListTransactionUseCase(
         TransactionsRepository
      );
   });

   it('should be able list all user transactions.', async () => {
      const user = {
         email: 'exemplo222@gmail.com',
         name: 'test',
         password: 'senha123',
      };

      const newUser = await userRepository.create({ ...user });

      await TransactionsRepository.create({
         email: user.email,
         description: 'desc',
         value: '12',
      });

      const list = await listTransactionUseCase.execute(newUser.id);

      expect(list?.transactions).toBeTruthy();
   });

   it('should be able list all transaction by mouth', async () => {
      const user = {
         email: 'exemplo2222@gmail.com',
         name: 'test',
         password: 'senha123',
      };

      const newUser = await userRepository.create({ ...user });

      await TransactionsRepository.create({
         email: user.email,
         description: 'desc',
         value: '21',
      });

      await TransactionsRepository.create({
         email: user.email,
         description: 'desc2',
         value: '21',
      });

      const transactionByMount = await listTransactionUseCase.execute(
         newUser.id,
         3
      );

      expect(transactionByMount.transactions).toHaveLength(2);
   });
});
