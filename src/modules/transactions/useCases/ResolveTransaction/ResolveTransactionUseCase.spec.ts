import 'reflect-metadata';
import { prisma } from '@/database/prisma';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { addDays, formatISO, parse } from 'date-fns';
import { TransactionsRepositoryTestDB } from '../../infra/repository/test-db/TransactionsTestDB';
import { ResolveTransactionUseCase } from './ResolveTransactionUseCase';

let userRepository: UserRepositoryTestDB;
let transactionsRepository: TransactionsRepositoryTestDB;
let resolveTransactionUseCase: ResolveTransactionUseCase;

describe('Resolve Transaction', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany({});
      userRepository = new UserRepositoryTestDB();
      transactionsRepository = new TransactionsRepositoryTestDB();
      resolveTransactionUseCase = new ResolveTransactionUseCase(
         transactionsRepository
      );
   });

   it('should be able resolve a transaction!', async () => {
      const currentDateWithThreeDays = addDays(new Date(), 3)
         .toISOString()
         .slice(0, 10);

      let newUser = {
         email: 'example@example.com',
         password: 'senha123',
         name: 'john doe',
      };

      const user = await userRepository.create({
         ...newUser,
      });

      const dateFormatted = formatISO(
         parse(currentDateWithThreeDays as string, 'yyyy-MM-dd', new Date())
      );

      const transaction = await transactionsRepository.create({
         email: user.email,
         description: 'test',
         value: '-12',
         dueDate: dateFormatted,
      });

      const isResolved = await resolveTransactionUseCase.execute(
         transaction.id
      );

      expect(isResolved).toBeTruthy();
   });
});
