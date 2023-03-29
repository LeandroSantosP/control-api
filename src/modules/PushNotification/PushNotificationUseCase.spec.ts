import 'reflect-metadata';
import { prisma } from '@/database/prisma';
import { SessionUseCase } from '../authentication/Session/SessionUseCase';
import { TransactionsRepositoryTestDB } from '../transactions/infra/repository/test-db/TransactionsTestDB';
import { UserRepositoryTestDB } from '../users/infra/repository/test-db/UserRepositoryTestDB';
import { PushNotificationUseCase } from './PushNotificationUseCase';
import { JwtAuthProvider } from '@/shared/providers/AuthProvider/implementation/JwtAuthProvider';
import { hash } from 'bcrypt';
import auth from '@/config/auth';

let sessionUseCase: SessionUseCase;
let userRepository: UserRepositoryTestDB;
let jwtAuthProvider: JwtAuthProvider;
let transactionRepositoryTestDB: TransactionsRepositoryTestDB;
let pushNotificationUseCase: PushNotificationUseCase;

describe('PushNotification', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany();
      userRepository = new UserRepositoryTestDB();
      transactionRepositoryTestDB = new TransactionsRepositoryTestDB();
      jwtAuthProvider = new JwtAuthProvider();
      sessionUseCase = new SessionUseCase(userRepository, jwtAuthProvider);
      pushNotificationUseCase = new PushNotificationUseCase(
         transactionRepositoryTestDB,
         jwtAuthProvider
      );
   });

   it('should be able something', async () => {
      const currentDate = new Date().toISOString();

      const { saltRounds } = auth;
      const passwordHash = await hash('senha123', saltRounds);
      const user = {
         email: 'test2222@example.com',
         name: 'joana',
         password: passwordHash,
      };
      await userRepository.create({ ...user });

      await transactionRepositoryTestDB.create({
         email: user.email,
         description: 'new Transaction test',
         value: '12.00',
         dueDate: currentDate,
      });

      await transactionRepositoryTestDB.create({
         email: user.email,
         description: 'new Transaction test',
         value: '12.00',
         dueDate: currentDate,
      });

      const { PushNotificationToken } = await sessionUseCase.execute({
         authenticationBase64: 'Basic dGVzdDIyMjJAZXhhbXBsZS5jb206c2VuaGExMjM=',
      });

      const push = await pushNotificationUseCase.execute(
         'Bearer ' + PushNotificationToken
      );

      expect(push).toHaveLength(2);
      expect(push[0]).toHaveProperty('due_date', new Date(currentDate));
      expect(push[1]).toHaveProperty('due_date', new Date(currentDate));
   });
});
