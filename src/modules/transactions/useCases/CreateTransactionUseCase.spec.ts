import 'reflect-metadata';

import { getDate, format } from 'date-fns';
import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
import { UserRepositoryTestDB } from '../../users/infra/repository/test-db/UserRepositoryTestDB';
import { CreateTransaction } from './CreateTransactionUseCase';
import { TransactionsRepositoryTestDB } from '../infra/repository/test-db/TransactionsTestDB';
import { prisma } from '@/database/prisma';
import CreateUserTest from '@/utils/CrateUserTEST';
import { IDateProvider } from '@/shared/providers/DateProvider/IDateProvider';
import { DateFnsProvider } from '@/shared/providers/DateProvider/implementation/DateFnsProvider';

let transactionRepositoryTestDB: TransactionsRepositoryTestDB;
let userRepositoryTestDB: UserRepositoryTestDB;
let createTransaction: CreateTransaction;
let dateFnsProvider: IDateProvider;

describe('Create Transaction', () => {
   beforeAll(async () => {
      await prisma.user.deleteMany();
      await prisma.transaction.deleteMany();
   });
   beforeEach(async () => {
      dateFnsProvider = new DateFnsProvider();
      transactionRepositoryTestDB = new TransactionsRepositoryTestDB();
      userRepositoryTestDB = new UserRepositoryTestDB();
      createTransaction = new CreateTransaction(
         userRepositoryTestDB,
         transactionRepositoryTestDB,
         dateFnsProvider
      );
   });

   it('should not be able create an transaction if user does not logged.', async () => {
      await expect(
         createTransaction.execute({
            email: 'test11@example.com',
            description: 'Desc',
            value: '11',
            filingDate: '2023-09-11',
         })
      ).rejects.toThrow(new AppError('User does not exites!'));
   });

   it('should be able to create a transaction', async () => {
      const newUser = await userRepositoryTestDB.create({
         email: 'mariatest@example.com',
         name: 'John doe',
         password: 'senha123',
      });

      const newTransaction = await createTransaction.execute({
         email: 'mariatest@example.com',
         description: 'Desc',
         value: '111.1',
         filingDate: '2023-09-02',
      });

      expect(newTransaction).toHaveProperty('id');
      expect(newTransaction).toHaveProperty('filingDate');
      expect(newTransaction?.description).toEqual('Desc');
      expect(newTransaction?.value).toBeTruthy();
      expect(newTransaction?.recurrence).toBeNull();
      expect(newTransaction?.installments).toBeNull();
      expect(newTransaction?.isSubscription).toBeNull();
      expect(newTransaction?.due_date).toBeNull();
      expect(newTransaction?.category.name).toEqual('unknown');
      expect(newTransaction?.resolved).toBe(false);
      expect(newTransaction?.userId).toEqual(newUser.id);
   });

   it('should not be able to create a new transaction(revenue) if filling date is wrong formatted!', async () => {
      const newUser = await CreateUserTest();

      await expect(
         createTransaction.execute({
            email: newUser.email,
            description: 'Desc',
            value: '111.1',
            filingDate: 'INVALID_FORMAT',
         })
      ).rejects.toThrow('Data inválida. O formato deve ser yyyy-MM-dd');
   });

   it('should not be able to create a expense transaction, must not contains felling date!', async () => {
      const newUser = await CreateUserTest();
      await expect(
         createTransaction.execute({
            description: 'Desc',
            email: newUser.email,
            value: '-100.22',
            categoryType: 'habitation',
            filingDate: '2040-10-10',
         })
      ).rejects.toEqual(new AppError('Expense does not have filling date!'));
   });

   it('should not be able to create a revenue transaction, must not contains due date!', async () => {
      const newUser = await CreateUserTest();
      await expect(
         createTransaction.execute({
            description: 'Desc',
            email: newUser.email,
            value: '100.22',
            categoryType: 'habitation',
            dueDate: '2040-10-10',
         })
      ).rejects.toEqual(new AppError('Revenue does not have due date!'));
   });

   it('should not be able to create a new revenue if due date are passed', async () => {
      try {
         await createTransaction.execute({
            email: 'mariatest@example.com',
            description: 'Desc',
            value: '111.1',
            dueDate: '2023-09-22',
            categoryType: 'Taxes',
         });
      } catch (error: any) {
         expect(error.message).toEqual('Revenue does not have due date!');
      }
   });

   it('should not to be able pass a Category that does not exist!', async () => {
      try {
         await createTransaction.execute({
            email: 'mariatest@example.com',
            description: 'Desc',
            value: '111.1',
            dueDate: '2023-09-22',
            // @ts-ignore
            categoryType: 'InvalidCategory',
         });
      } catch (error: any) {
         expect(error.statusCode).toEqual(400);
         expect(error.message).toEqual(
            'categoryType must be one of the following values: transport, food, habitation, education, health, leisure, products, debts, Taxes, Investments, unknown \n' +
               ''
         );
      }
   });

   it('should be able choose a category for a new transaction!', async () => {
      const newUser = await userRepositoryTestDB.create({
         email: 'test14@example.com',
         name: 'John doe',
         password: 'senha123',
      });
      const response = await createTransaction.execute({
         email: newUser.email,
         description: 'Desc',
         value: '100',
         filingDate: '2023-09-22',
         categoryType: 'food',
      });
      expect(response).toHaveProperty('category', { name: 'food' });
   });

   it('should not be able create an transaction if data is in incorrect format.', async () => {
      const newUser = await userRepositoryTestDB.create({
         email: 'test1@example.com',
         name: 'John doe',
         password: 'senha123',
      });

      await expect(
         createTransaction.execute({
            email: newUser.email,
            description: 'Desc',
            value: 'wrong format',
         })
      ).rejects.toThrow(InvalidYupError);
   });
   it('should return the current date based on the given value(revenue/expense).', async () => {
      /* expense(due-date) */
      await userRepositoryTestDB.create({
         email: 'ana@example.com',
         name: 'Ana doe',
         password: 'senha123',
      });

      const sutExpense = await createTransaction.execute({
         description: 'Compras',
         email: 'ana@example.com',
         value: '-100',
         categoryType: 'leisure',
         dueDate: '2023-09-22',
      });

      const dateReturnsExpense = format(sutExpense?.due_date!, 'yyyy-MM-dd');

      expect(dateReturnsExpense).toBe('2023-09-22');
      expect(sutExpense?.due_date).toBeTruthy();

      /* revenue(filing-date) */

      const sutRevenue = await createTransaction.execute({
         description: 'Compras',
         email: 'ana@example.com',
         value: '100',
         categoryType: 'leisure',
         filingDate: '2023-09-22',
      });

      const dateReturnsRevenue = format(sutRevenue?.filingDate!, 'yyyy-MM-dd');

      expect(dateReturnsRevenue).toBe('2023-09-22');
      expect(sutRevenue?.filingDate).toBeTruthy();
   });
});
