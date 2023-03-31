import 'reflect-metadata';
import { prisma } from '@/database/prisma';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { TransactionsRepositoryTestDB } from '../../infra/repository/test-db/TransactionsTestDB';
import { CreateTransactionWIthRecorrenteUseCase } from './CreateTransactionWIthRecorrenteUseCase';
import { addDays } from 'date-fns';
import { AppError } from '@/shared/infra/middleware/AppError';
import CreateUserTest from '@/utils/CrateUserTEST';

let userRepository: UserRepositoryTestDB;
let transactionRepository: TransactionsRepositoryTestDB;
let createTransactionWIthRecorrenteUseCase: CreateTransactionWIthRecorrenteUseCase;

describe('Create Transaction With Recorrente', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.transaction.deleteMany();
      userRepository = new UserRepositoryTestDB();
      transactionRepository = new TransactionsRepositoryTestDB();
      createTransactionWIthRecorrenteUseCase =
         new CreateTransactionWIthRecorrenteUseCase(transactionRepository);
   });
   const currentDateWithThreeDays = addDays(new Date(), 3)
      .toISOString()
      .slice(0, 10);

   it('should be able to create a new transaction with recorrente(not subscription)', async () => {
      const newUser = {
         email: 'test@gmail.com',
         name: 'test',
         password: 'senha123',
      };

      await userRepository.create(newUser);

      const result = await createTransactionWIthRecorrenteUseCase.execute({
         email: newUser.email,
         categoryType: 'Investments',
         description: 'description',
         due_date: currentDateWithThreeDays,
         recurrence: 'daily',
         value: '-10.22',
         isSubscription: false,
         installments: 12,
      });

      expect(result).toHaveProperty('Category', result.Category);
   });

   it('should not be able pass positives values', async () => {
      const newUser2 = {
         email: 'test@gmail.com2',
         name: 'test',
         password: 'senha123',
      };
      await userRepository.create(newUser2);

      await expect(
         createTransactionWIthRecorrenteUseCase.execute({
            email: newUser2.email,
            categoryType: 'Investments',
            description: 'description',
            due_date: currentDateWithThreeDays,
            recurrence: 'daily',
            value: '10.22',
            isSubscription: false,
         })
      ).rejects.toThrow(AppError);
   });

   it('should throw YupError if recurrent its not valid!', async () => {
      const newUser = await CreateUserTest();

      await expect(
         createTransactionWIthRecorrenteUseCase.execute({
            categoryType: 'Investments',
            description: 'Desc',
            due_date: '2030-02-11',
            email: newUser.email,
            isSubscription: false,
            // @ts-ignore
            recurrence: 'invalid',
            value: '12',
         })
      ).rejects.toEqual(
         new AppError(
            'Error: recurrence, message: recurrence must be one of the following values: monthly, daily, yearly\n'
         )
      );
   });
});
