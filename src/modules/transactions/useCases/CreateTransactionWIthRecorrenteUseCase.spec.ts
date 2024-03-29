import 'reflect-metadata';
import { addDays } from 'date-fns';
import { prisma } from '@/database/prisma';

import CreateUserTest from '@/utils/CrateUserTEST';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { TransactionsRepositoryTestDB } from '../infra/repository/test-db/TransactionsTestDB';
import { CreateTransactionWIthRecorrenteUseCase } from './CreateTransactionWIthRecorrenteUseCase';
import { AppError } from '@/shared/infra/middleware/AppError';
import { DateFnsProvider } from '@/shared/providers/DateProvider/implementation/DateFnsProvider';

let dateFnsProvider: DateFnsProvider;
let userRepository: UserRepositoryTestDB;
let transactionRepository: TransactionsRepositoryTestDB;
let createTransactionWIthRecorrenteUseCase: CreateTransactionWIthRecorrenteUseCase;

describe('Create Transaction With Recorrente', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.transaction.deleteMany();
      dateFnsProvider = new DateFnsProvider();
      userRepository = new UserRepositoryTestDB();
      transactionRepository = new TransactionsRepositoryTestDB();
      createTransactionWIthRecorrenteUseCase =
         new CreateTransactionWIthRecorrenteUseCase(
            transactionRepository,
            dateFnsProvider
         );
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

      expect(result).toHaveProperty('category', { name: 'Investments' });
   });

   it('should not be able pass positives values', async () => {
      const newUser2 = {
         email: 'test@gmail.com2',
         name: 'test',
         password: 'senha123',
      };

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
