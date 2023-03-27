import 'reflect-metadata';
import { prisma } from '@/database/prisma';
import { TransactionsRepositoryTestDB } from '../transactions/infra/repository/test-db/TransactionsTestDB';
import { UserRepositoryTestDB } from '../users/infra/repository/test-db/UserRepositoryTestDB';
import { PushNotificationUseCase } from './PushNotificationUseCase';

let userRepository: UserRepositoryTestDB;
let transactionRepositoryTestDB: TransactionsRepositoryTestDB;
let pushNotificationUseCase: PushNotificationUseCase;

describe('PushNotification', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.transaction.deleteMany();
      userRepository = new UserRepositoryTestDB();
      transactionRepositoryTestDB = new TransactionsRepositoryTestDB();
      pushNotificationUseCase = new PushNotificationUseCase(
         transactionRepositoryTestDB
      );
   });

   it('should be able something', async () => {
      const user = {
         email: 'test2222@example.com',
         name: 'joana',
         password: 'senha123',
      };
      await userRepository.create({ ...user });

      await transactionRepositoryTestDB.create({
         email: user.email,
         description: 'new Transaction test',
         value: '12.00',
         dueDate: '2023-03-25T03:00:00.000Z',
      });

      const transaction = await transactionRepositoryTestDB.create({
         email: user.email,
         description: 'new Transaction test',
         value: '12.00',
         dueDate: '2023-03-25T03:00:00.000Z',
      });

      const push = await pushNotificationUseCase.execute(transaction.userId);
   });
});
