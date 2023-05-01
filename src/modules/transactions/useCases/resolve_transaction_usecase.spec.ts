import 'reflect-metadata';
import { prisma } from '@/database/prisma';
import { addDays, formatISO, parse } from 'date-fns';
import CreateUserTest from '@/utils/CrateUserTEST';
import { AppError } from '@/shared/infra/middleware/AppError';
import { ResolveTransactionUseCase } from './ResolveTransactionUseCase';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { TransactionsRepositoryTestDB } from '../infra/repository/test-db/TransactionsTestDB';

let userRepository: UserRepositoryTestDB;
let transactionsRepository: TransactionsRepositoryTestDB;
let resolveTransactionUseCase: ResolveTransactionUseCase;

describe('Resolve Transaction', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany({});
      userRepository = new UserRepositoryTestDB();
      transactionsRepository = new TransactionsRepositoryTestDB();
      resolveTransactionUseCase = new ResolveTransactionUseCase(
         userRepository,
         transactionsRepository
      );
   });
   const currentDateWithThreeDays = addDays(new Date(), 3)
      .toISOString()
      .slice(0, 10);
   const dateFormatted = formatISO(
      parse(currentDateWithThreeDays as string, 'yyyy-MM-dd', new Date())
   );

   it('should be able resolve a transaction!', async () => {
      const user = await CreateUserTest({
         email: 'example@example.com',
         password: 'senha123',
         name: 'john doe',
      });

      const transaction = await transactionsRepository.create({
         email: user.email,
         description: 'test',
         value: '-12',
         dueDate: dateFormatted,
      });

      const isResolved = await resolveTransactionUseCase.execute(
         transaction.id,
         user.id
      );

      expect(isResolved).toBeTruthy();
   });

   it('should throw new Error if Transaction already resolved'!, async () => {
      const User = await CreateUserTest();
      const newTransaction = await transactionsRepository.create({
         description: 'Desc',
         email: User.email,
         value: '-12',
         Category: 'education',
         dueDate: dateFormatted,
         resolved: true,
      });

      await expect(
         resolveTransactionUseCase.execute(newTransaction.id, User.id)
      ).rejects.toThrow(AppError);
   });
});
